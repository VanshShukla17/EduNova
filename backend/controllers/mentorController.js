const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
// Ensure dotenv is loaded from backend/.env
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { supabaseAdmin } = require('../utils/supabaseAdmin');
const { getSaarthiSystemPrompt } = require('../src/mentor/systemPrompt');
const { getStudentMemories, extractAndStoreFacts } = require('../src/mentor/memoryService');
const { retrieve } = require('../src/rag/retrieval');

// Configure Gemini Model (defaults to gemini-3.5-flash)
const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash';

/**
 * Helper to initialize Gemini Generative Model with active System Instructions
 */
function getGeminiModel(systemInstruction) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey.trim());
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemInstruction || undefined
  });
}

/**
 * Create a new chat session
 * POST /api/mentor/sessions
 */
exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title = 'New Conversation', mode = 'doubt', subject = 'physics' } = req.body;

    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
        mode,
        subject
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Create session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create session', error: err.message });
  }
};

/**
 * List all sessions for the logged-in student (optional ?mode=mentor filter)
 * GET /api/mentor/sessions
 */
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    let query = supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (req.query.mode) {
      query = query.eq('mode', req.query.mode);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch sessions', error: err.message });
  }
};

/**
 * Get messages of a specific session
 * GET /api/mentor/sessions/:id
 */
exports.getSessionMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify session ownership
    const { data: session, error: sessErr } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (sessErr || !session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (msgErr) throw msgErr;

    return res.json({
      success: true,
      session,
      messages: messages || []
    });
  } catch (err) {
    console.error('Get session messages error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
};

/**
 * Rename/Update a session
 * PATCH /api/mentor/sessions/:id
 */
exports.updateSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Update session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update session', error: err.message });
  }
};

/**
 * Delete a session
 * DELETE /api/mentor/sessions/:id
 */
exports.deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (err) {
    console.error('Delete session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete session', error: err.message });
  }
};

/**
 * Core internal handler to execute a Gemini chat turn with multi-turn memory, image support, & curriculum RAG
 */
async function processChatTurn({
  userId,
  userMetadata,
  sessionId,
  content,
  image,
  mimeType,
  mode,
  subject,
  classLevel,
  language,
  moduleTitle,
  currentTopic
}) {
  const activeMode = mode || 'doubt';
  const activeSubject = subject || 'physics';

  // 1. Process image if attached (Phase 14)
  let cleanBase64 = null;
  let cleanMimeType = mimeType || 'image/jpeg';
  const userSources = [];

  if (image && typeof image === 'string') {
    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        cleanMimeType = match[1];
        cleanBase64 = match[2];
      } else {
        cleanBase64 = image.replace(/^data:[^;]+;base64,/, '');
      }
    } else {
      cleanBase64 = image;
    }

    // Size limit check (max ~10MB)
    if (cleanBase64.length > 14 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit. Please upload a smaller image.');
    }

    userSources.push({
      type: 'image_attachment',
      mimeType: cleanMimeType,
      dataUrl: image.startsWith('data:') ? image : `data:${cleanMimeType};base64,${image}`
    });
  }

  const effectiveContent = (content && content.trim()) || (cleanBase64 ? 'Please solve and explain the question in this image step-by-step.' : '');

  // 2. Record user message in chat_messages table
  const { data: userMsg, error: uErr } = await supabaseAdmin
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: effectiveContent,
      sources: userSources
    })
    .select()
    .single();

  if (uErr) throw uErr;

  // 3. Update session title if default (Phase 13: meaningful conversation title)
  const { data: currentSession } = await supabaseAdmin
    .from('chat_sessions')
    .select('title')
    .eq('id', sessionId)
    .maybeSingle();

  if (currentSession && (currentSession.title.startsWith('New ') || currentSession.title === 'Untitled')) {
    let newTitle = effectiveContent;
    if (cleanBase64 && (!content || content.length < 5)) {
      newTitle = `${(moduleTitle || activeSubject).toUpperCase()} Diagram Question`;
    } else {
      newTitle = newTitle.replace(/^[#*>\s]+/, '').slice(0, 36) + (newTitle.length > 36 ? '...' : '');
    }
    await supabaseAdmin
      .from('chat_sessions')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  }

  // 4. Retrieve recent conversation history from this session (up to 8 turns for context window)
  const { data: pastMsgs } = await supabaseAdmin
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(8);

  const chronologicalHistory = (pastMsgs || []).reverse();
  const priorHistory = chronologicalHistory.slice(0, -1);

  // Format history for Gemini SDK
  const geminiHistory = priorHistory.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  while (geminiHistory.length > 0 && geminiHistory[0].role !== 'user') {
    geminiHistory.shift();
  }

  // 5. Retrieve relevant CBSE textbook excerpts via RAG
  let retrievedChunks = [];
  try {
    retrievedChunks = await retrieve(
      effectiveContent,
      {
        board: 'CBSE',
        classLevel: Number(classLevel),
        subject: activeSubject,
        language,
        userId,
        minSimilarity: 0.15
      },
      3
    );
  } catch (ragErr) {
    console.warn('RAG retrieval warning:', ragErr.message);
  }

  // 6. Retrieve student knowledge base & past weaknesses
  let memories = [];
  try {
    memories = await getStudentMemories(userId, activeSubject);
  } catch (memErr) {
    console.warn('Memory retrieval warning:', memErr.message);
  }

  // 7. Build dynamic CBSE educational system instructions
  const systemPrompt = getSaarthiSystemPrompt({
    mode: activeMode,
    board: 'CBSE',
    classLevel: Number(classLevel),
    language,
    studentName: userMetadata?.full_name || 'Student',
    subject: activeSubject,
    moduleTitle,
    currentTopic
  });

  // 8. Enrich current prompt with retrieved context
  let userTurnText = effectiveContent;
  const contextSegments = [];
  if (moduleTitle || currentTopic) {
    contextSegments.push(`[ACTIVE STUDY MODULE: ${moduleTitle || currentTopic} in ${activeSubject.toUpperCase()}]`);
  }
  if (memories.length > 0) {
    contextSegments.push(`[STUDENT LEARNING CONTEXT & WEAKNESSES]:\n${memories.map((m) => `- ${m.text}`).join('\n')}`);
  }
  if (retrievedChunks.length > 0) {
    contextSegments.push(
      `[OFFICIAL NCERT / CBSE TEXTBOOK PASSAGES (Ground your answer on these facts)]:\n${retrievedChunks
        .map((c, i) => `[Source ${i + 1}] (${c.chapter}):\n${c.content}`)
        .join('\n\n')}`
    );
  }

  if (contextSegments.length > 0) {
    userTurnText = `${contextSegments.join('\n\n')}\n\n[STUDENT INQUIRY]:\n${effectiveContent}`;
  }

  // 9. Invoke Google Gemini API (Multimodal if image is present)
  let replyText = '';
  const geminiModel = getGeminiModel(systemPrompt);

  if (geminiModel) {
    try {
      const chat = geminiModel.startChat({
        history: geminiHistory
      });

      let promptPayload;
      if (cleanBase64) {
        promptPayload = [
          {
            inlineData: {
              mimeType: cleanMimeType,
              data: cleanBase64
            }
          },
          userTurnText
        ];
      } else {
        promptPayload = userTurnText;
      }

      const result = await chat.sendMessage(promptPayload);
      const response = await result.response;
      replyText = response.text().trim();
    } catch (apiErr) {
      console.error('Google Gemini API execution error:', apiErr.message);
      if (apiErr.message.includes('API_KEY_INVALID') || apiErr.message.includes('key not valid')) {
        replyText = '⚠️ **Saarthi Configuration Notice**: The configured Gemini API key appears invalid. Please verify your `GEMINI_API_KEY` setting in `backend/.env`.';
      } else if (apiErr.message.includes('429') || apiErr.message.includes('quota') || apiErr.message.includes('RESOURCE_EXHAUSTED')) {
        replyText = '⏳ **High Traffic**: The Gemini API quota is currently saturated. Please wait a few seconds before asking your next question.';
      } else {
        replyText = `I encountered an unexpected issue while communicating with Gemini (${apiErr.message.slice(0, 80)}...). Please try asking your question again in a moment.`;
      }
    }
  } else {
    replyText = '⚠️ **Saarthi AI Core Offline**: `GEMINI_API_KEY` is not configured in the backend environment. Please set your key in `backend/.env` to activate live Gemini AI.';
  }

  // 10. Citations metadata
  const sources = (retrievedChunks || []).map((c) => ({
    id: c.id,
    chapter: c.chapter,
    source: c.source,
    page: c.page || 1,
    similarity: c.similarity
  }));

  // 11. Save assistant message to Supabase
  const { data: assistantMsg, error: aErr } = await supabaseAdmin
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: replyText,
      sources
    })
    .select()
    .single();

  if (aErr) throw aErr;

  // 12. Update session timestamp
  await supabaseAdmin
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  // 13. Extract facts asynchronously for long-term memory
  extractAndStoreFacts(userId, effectiveContent, activeSubject).catch((err) =>
    console.warn('Fact extraction non-blocking error:', err)
  );

  return {
    assistantMsg,
    reply: replyText,
    sources
  };
}

/**
 * Send a message within a specific session
 * POST /api/mentor/sessions/:id/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: sessionId } = req.params;
    const {
      content,
      image,
      mimeType,
      mode: clientMode,
      subject: clientSubj,
      classLevel = 10,
      language = 'en',
      moduleTitle,
      currentTopic
    } = req.body;

    if ((!content || !content.trim()) && !image) {
      return res.status(400).json({ success: false, message: 'Message content or image is required' });
    }

    // Verify session
    const { data: session, error: sErr } = await supabaseAdmin
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (sErr || !session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const result = await processChatTurn({
      userId,
      userMetadata: req.user.user_metadata,
      sessionId,
      content,
      image,
      mimeType,
      mode: clientMode || session.mode || 'doubt',
      subject: clientSubj || session.subject || 'physics',
      classLevel,
      language,
      moduleTitle,
      currentTopic
    });

    return res.json({
      success: true,
      message: result.assistantMsg,
      reply: result.reply,
      sources: result.sources
    });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process message', error: err.message });
  }
};

/**
 * Direct chat endpoint (supports continuing existing session or starting fresh)
 * POST /api/mentor/chat
 */
exports.directChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      message,
      query,
      sessionId: requestedSessionId,
      newChat = false,
      image,
      mimeType,
      mode = 'doubt',
      subject = 'physics',
      classLevel = 10,
      language = 'en',
      moduleTitle,
      currentTopic
    } = req.body;

    const content = message || query;
    if ((!content || !content.trim()) && !image) {
      return res.status(400).json({ success: false, message: 'Message or image is required' });
    }

    let session = null;

    // 1. If explicit sessionId is requested and not newChat, verify and use it
    if (requestedSessionId && !newChat) {
      const { data: existingSess } = await supabaseAdmin
        .from('chat_sessions')
        .select('id, mode, subject')
        .eq('id', requestedSessionId)
        .eq('user_id', userId)
        .maybeSingle();
      if (existingSess) {
        session = existingSess;
      }
    }

    // 2. If newChat requested, or mode is 'mentor' without explicit session, create a clean session
    if (!session) {
      const titleSnippet = content
        ? content.trim().slice(0, 35) + (content.length > 35 ? '...' : '')
        : `${(moduleTitle || subject).toUpperCase()} Question Image`;

      const { data: newSess, error: createErr } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: titleSnippet,
          mode,
          subject
        })
        .select('id, mode, subject')
        .single();
      if (createErr) throw createErr;
      session = newSess;
    }

    const result = await processChatTurn({
      userId,
      userMetadata: req.user.user_metadata,
      sessionId: session.id,
      content,
      image,
      mimeType,
      mode,
      subject,
      classLevel,
      language,
      moduleTitle,
      currentTopic
    });

    return res.json({
      success: true,
      sessionId: session.id,
      message: result.assistantMsg,
      reply: result.reply,
      sources: result.sources
    });
  } catch (err) {
    console.error('Direct chat error:', err);
    return res.status(500).json({ success: false, message: 'Direct chat failed', error: err.message });
  }
};

/**
 * Real-time Server-Sent Events (SSE) streaming chat endpoint
 * POST /api/mentor/chat/stream
 */
exports.streamChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      message,
      query,
      sessionId: requestedSessionId,
      newChat = false,
      mode = 'doubt',
      subject = 'physics',
      classLevel = 10,
      language = 'en',
      moduleTitle,
      currentTopic
    } = req.body;

    const content = message || query;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Setup SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // 1. Session lookup or creation
    let session = null;
    if (requestedSessionId && !newChat) {
      const { data: existingSess } = await supabaseAdmin
        .from('chat_sessions')
        .select('id')
        .eq('id', requestedSessionId)
        .eq('user_id', userId)
        .maybeSingle();
      if (existingSess) session = existingSess;
    }

    if (!session) {
      const { data: newSess } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: content.slice(0, 35),
          mode,
          subject
        })
        .select('id')
        .single();
      session = newSess;
    }

    const sessionId = session.id;

    // 2. Insert user message
    await supabaseAdmin.from('chat_messages').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: content.trim(),
      sources: []
    });

    // 3. Load prior history
    const { data: pastMsgs } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(8);

    const chronologicalHistory = (pastMsgs || []).reverse().slice(0, -1);
    const geminiHistory = chronologicalHistory.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    while (geminiHistory.length > 0 && geminiHistory[0].role !== 'user') {
      geminiHistory.shift();
    }

    // 4. Build prompt
    const systemPrompt = getSaarthiSystemPrompt({
      mode,
      board: 'CBSE',
      classLevel: Number(classLevel),
      language,
      studentName: req.user.user_metadata?.full_name || 'Student',
      subject,
      moduleTitle,
      currentTopic
    });

    const geminiModel = getGeminiModel(systemPrompt);
    let fullReply = '';

    if (geminiModel) {
      try {
        const chat = geminiModel.startChat({ history: geminiHistory });
        const resultStream = await chat.sendMessageStream(content.trim());

        for await (const chunk of resultStream.stream) {
          const chunkText = chunk.text();
          fullReply += chunkText;
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
      } catch (streamErr) {
        console.error('Gemini streaming error:', streamErr);
        res.write(`data: ${JSON.stringify({ error: streamErr.message })}\n\n`);
      }
    } else {
      fullReply = '⚠️ Saarthi AI is offline: GEMINI_API_KEY is not configured in backend/.env.';
      res.write(`data: ${JSON.stringify({ text: fullReply })}\n\n`);
    }

    // 5. Store completed response in database
    if (fullReply) {
      await supabaseAdmin.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: fullReply,
        sources: []
      });

      await supabaseAdmin
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('SSE Stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Streaming failed', error: err.message });
    } else {
      res.end();
    }
  }
};

/**
 * Get student's persistent memories
 * GET /api/mentor/memories
 */
exports.getMemories = async (req, res) => {
  try {
    const userId = req.user.id;
    const memories = await getStudentMemories(userId);
    return res.json({
      success: true,
      data: memories
    });
  } catch (err) {
    console.error('Get memories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch memories', error: err.message });
  }
};

/**
 * Delete a memory fact
 * DELETE /api/mentor/memories/:id
 */
exports.deleteMemory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('memory_facts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Memory deleted'
    });
  } catch (err) {
    console.error('Delete memory error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete memory', error: err.message });
  }
};
