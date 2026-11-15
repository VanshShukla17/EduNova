import React from 'react';
import Callout from './Callout';

export default function DigestiveSystem({ part, labels }) {
  return (
    <g>
      {/* large intestine first, so small intestine sits on top */}
      <g {...part('large-intestine')}>
        <path d="M300 430 V294 H530 V430" fill="none" stroke="#b9714f" strokeWidth="24" strokeLinejoin="round" pointerEvents="stroke" />
        <path d="M300 430 V294 H530 V430" fill="none" stroke="#d9a07f" strokeWidth="14" strokeLinejoin="round" pointerEvents="none" />
      </g>

      <g {...part('oesophagus')}>
        <path d="M400 58 V132" stroke="#e08a76" strokeWidth="20" strokeLinecap="round" />
        <path d="M400 58 V132" stroke="#f2b8a2" strokeWidth="12" strokeLinecap="round" />
      </g>

      <g {...part('mouth')}>
        <ellipse cx="400" cy="38" rx="36" ry="19" fill="#f4a6a0" stroke="#b4504a" strokeWidth="3" />
        <path d="M376 38 Q400 50 424 38" fill="none" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g {...part('stomach')}>
        <path
          d="M392 130 C392 110 440 106 470 128 C520 160 526 215 482 238 C440 258 400 238 398 205 L400 175 Z"
          fill="#f4a6a0"
          stroke="#b4504a"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      <g {...part('pancreas')}>
        <path d="M410 246 C445 254 490 252 508 264 C490 284 445 284 410 264 Z" fill="#f7d58a" stroke="#b7791f" strokeWidth="3" />
      </g>

      <g {...part('liver')}>
        <path
          d="M250 142 C290 108 380 122 402 140 L396 188 C340 204 282 198 252 162 Z"
          fill="#a94438"
          stroke="#6b1d16"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      <g {...part('gallbladder')}>
        <ellipse cx="362" cy="206" rx="11" ry="17" fill="#4d7c0f" stroke="#365314" strokeWidth="2.5" />
      </g>

      <g {...part('small-intestine')}>
        <path
          d="M440 246 Q452 280 440 312 H470 Q488 312 488 326 Q488 340 470 340 H340 Q322 340 322 354 Q322 368 340 368 H470 Q488 368 488 382 Q488 396 470 396 H300"
          fill="none"
          stroke="#c2562f"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M440 246 Q452 280 440 312 H470 Q488 312 488 326 Q488 340 470 340 H340 Q322 340 322 354 Q322 368 340 368 H470 Q488 368 488 382 Q488 396 470 396 H300"
          fill="none"
          stroke="#f6a98c"
          strokeWidth="9"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      <Callout show={labels} x1={436} y1={38} x2={590} y2={38}>Mouth</Callout>
      <Callout show={labels} x1={410} y1={100} x2={590} y2={100}>Oesophagus</Callout>
      <Callout show={labels} x1={505} y1={190} x2={590} y2={190}>Stomach</Callout>
      <Callout show={labels} x1={500} y1={272} x2={590} y2={250}>Pancreas</Callout>
      <Callout show={labels} x1={541} y1={380} x2={590} y2={380}>Large intestine</Callout>
      <Callout show={labels} x1={268} y1={150} x2={190} y2={150} anchor="end">Liver</Callout>
      <Callout show={labels} x1={352} y1={214} x2={190} y2={214} anchor="end">Gall bladder</Callout>
      <Callout show={labels} x1={400} y1={340} x2={190} y2={340} anchor="end">Small intestine</Callout>
    </g>
  );
}
