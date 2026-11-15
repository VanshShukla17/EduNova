/**
 * Curriculum-aligned STEM Interactive Diagram definitions.
 * Includes complete part mappings, functional summaries, comprehensive scientific explanations,
 * and bilingual (English + Hindi) content.
 */

export function normalizeDiagramId(diagramOrId, title = '') {
  if (!diagramOrId) return '';
  let idStr = '';
  let titleStr = title || '';
  if (typeof diagramOrId === 'object') {
    idStr = diagramOrId.id || diagramOrId._id || diagramOrId.slug || '';
    titleStr = diagramOrId.title || diagramOrId.titleHindi || titleStr;
  } else {
    idStr = String(diagramOrId);
  }
  const combined = `${idStr} ${titleStr}`.toLowerCase();
  if (combined.includes('plant') || (combined.includes('cell') && !combined.includes('electrolysis'))) return 'plant-cell';
  if (combined.includes('period') || combined.includes('element')) return 'periodic-groups';
  if (combined.includes('circuit') || combined.includes('electric')) return 'electric-circuit';
  if (combined.includes('digest')) return 'digestive-system';
  if (combined.includes('dna') || combined.includes('helix')) return 'dna-helix';
  if (combined.includes('magnet')) return 'bar-magnet';
  if (combined.includes('electrolysis') || combined.includes('water')) return 'water-electrolysis';
  if (combined.includes('unit') || combined.includes('circle') || combined.includes('trig')) return 'unit-circle';
  return idStr;
}

export const STEM_DIAGRAMS = [
  {
    id: 'plant-cell',
    title: 'Plant Cell Anatomy',
    titleHindi: 'पादप कोशिका की संरचना',
    subject: 'biology',
    subjectCode: 'biology',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'Anatomy and microscopic organelles of a eukaryotic plant cell under transmission light microscopy.',
    parts: [
      {
        id: 'cell-wall',
        name: 'Cell wall',
        label: 'Cell wall',
        labelHindi: 'कोशिका भित्ति',
        function: 'Gives the cell a fixed shape, mechanical rigidity, and osmotic protection.',
        explanation: 'A tough, fibrous outer layer composed primarily of cellulose microfibrils, hemicellulose, and pectin. Unlike animal cells, the plant cell wall resists high internal turgor pressure preventing cytolysis in hypotonic solutions.',
        explanationHindi: 'सेल्यूलोज से बनी दृढ़ बाहरी परत जो कोशिका को यांत्रिक सहारा, निश्चित आकार और स्फीति दाब से सुरक्षा देती है।'
      },
      {
        id: 'membrane',
        name: 'Cell membrane',
        label: 'Cell membrane',
        labelHindi: 'प्लाज्मा झिल्ली (कोशिका झिल्ली)',
        function: 'Controls selective transport of ions, nutrients, and biochemical signals.',
        explanation: 'A semi-permeable phospholipid bilayer with embedded integral and peripheral proteins situated directly beneath the cell wall. It regulates passive diffusion, osmosis, and active ion exchange via ATP-driven pumps.',
        explanationHindi: 'अर्ध-पारगम्य फॉस्फोलिपिड द्वि-परत जो कोशिका में पदार्थों के प्रवेश एवं निकास का चयनात्मक नियंत्रण करती है।'
      },
      {
        id: 'cytoplasm',
        name: 'Cytoplasm',
        label: 'Cytoplasm',
        labelHindi: 'कोशिका द्रव्य',
        function: 'Jelly-like matrix hosting intracellular metabolic cascades and organelle transport.',
        explanation: 'The aqueous cytosol containing suspended organelles, cytoskeletal filaments, and dissolved biochemical solutes. Primary biochemical pathways like anaerobic glycolysis and translation of proteins occur here.',
        explanationHindi: 'जेली जैसा तरल जिसमें सभी कोशिकांग स्थित होते हैं तथा ग्लाइकोलिसिस जैसी आवश्यक चयापचय क्रियाएं संपन्न होती हैं।'
      },
      {
        id: 'vacuole',
        name: 'Large central vacuole',
        label: 'Large central vacuole',
        labelHindi: 'केंद्रीय रिक्तिका (रसधानी)',
        function: 'Maintains plant turgidity, stores cell sap, salts, pigments, and hydrolytic enzymes.',
        explanation: 'Occupying up to 90% of mature cell volume, it is enclosed by a specialized membrane called the tonoplast. By accumulating inorganic ions and organic acids, it creates internal osmotic turgor pressure that keeps herbaceous plants erect.',
        explanationHindi: 'टोनोप्लास्ट झिल्ली से घिरी रसधानी जो स्फीति दाब बनाए रखकर पौधे को सीधा खड़ा रखती है और अपशिष्ट संग्रहित करती है।'
      },
      {
        id: 'nucleus',
        name: 'Nucleus',
        label: 'Nucleus',
        labelHindi: 'केंद्रक',
        function: 'Directs genomic expression, cellular replication, and mRNA synthesis.',
        explanation: 'Enclosed by a double-layered nuclear envelope perforated with nuclear pores. It houses linear genomic DNA wound around histone octamers as chromatin, orchestrating cell growth, differentiation, and hereditary inheritance.',
        explanationHindi: 'दोहरी झिल्ली वाला कोशिकांग जो आनुवंशिक डीएनए को सुरक्षित रखता है और कोशिका की समस्त क्रियाओं का संचालन करता है।'
      },
      {
        id: 'nucleolus',
        name: 'Nucleolus',
        label: 'Nucleolus',
        labelHindi: 'केंद्रिका',
        function: 'Transcribes ribosomal RNA (rRNA) and assembles ribosomal pre-subunits.',
        explanation: 'A dense non-membrane-bound subnuclear structure that synthesizes ribosomal RNA (rRNA) genes and aggregates them with ribosomal proteins imported from the cytoplasm before export to form 80S ribosomes.',
        explanationHindi: 'केंद्रक के भीतर सघन क्षेत्र जहां राइबोसोमल आरएनए (rRNA) का संश्लेषण और राइबोसोम का निर्माण होता है।'
      },
      {
        id: 'chloroplast',
        name: 'Chloroplast',
        label: 'Chloroplast',
        labelHindi: 'हरितलवक (क्लोरोप्लास्ट)',
        function: 'Converts solar photonic energy into chemical energy (glucose) via oxygenic photosynthesis.',
        explanation: 'Double-membrane semiautonomous organelle housing stacks of chlorophyll-embedded thylakoid membranes (grana) suspended within the stroma. The light-dependent reactions synthesize ATP and NADPH, driving the Calvin cycle fixation of CO₂ into glucose.',
        explanationHindi: 'प्रकाश संश्लेषण का केंद्र; क्लोरोफिल वर्णक की सहायता से सूर्य के प्रकाश को रासायनिक ऊर्जा (ग्लूकोज) में परिवर्तित करता है।'
      },
      {
        id: 'mitochondrion',
        name: 'Mitochondrion',
        label: 'Mitochondrion',
        labelHindi: 'माइटोकॉन्ड्रिया',
        function: 'Synthesizes ATP through the Krebs cycle and oxidative phosphorylation.',
        explanation: 'The cellular powerhouse. Its heavily folded inner membrane (cristae) contains the electron transport chain enzymes and ATP synthase complexes that generate ATP molecules during aerobic cellular respiration.',
        explanationHindi: 'कोशिका का ऊर्जा गृह; वायवीय श्वसन और क्रेब्स चक्र द्वारा एटीपी (ATP) के रूप में ऊर्जा मुक्त करता है।'
      },
    ],
  },
  {
    id: 'periodic-groups',
    title: 'Periodic Table Element Groups',
    titleHindi: 'आवर्त सारणी: तत्व वर्ग एवं श्रेणियां',
    subject: 'chemistry',
    subjectCode: 'chemistry',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: '118 elements classified into chemical groups sharing valence electronic configurations and periodic properties.',
    parts: [
      {
        id: 'alkali',
        name: 'Alkali metals (Group 1)',
        label: 'Alkali metals (Group 1)',
        labelHindi: 'क्षार धातुएं (वर्ग 1)',
        function: 'Soft, univalent, highly electropositive s-block metals (ns¹).',
        explanation: 'Li, Na, K, Rb, Cs, Fr. Having single valence electrons with low first ionization enthalpy, they rapidly lose one electron to form M⁺ cations. They react violently with water generating H₂ gas and strong hydroxides; hence stored under inert kerosene.',
        explanationHindi: 'Li, Na, K आदि अत्यधिक क्रियाशील धातुएं जो जल से तीव्रता से क्रिया कर क्षार तथा हाइड्रोजन गैस बनाती हैं।'
      },
      {
        id: 'alkaline',
        name: 'Alkaline earth metals (Group 2)',
        label: 'Alkaline earth metals (Group 2)',
        labelHindi: 'क्षारीय मृदा धातुएं (वर्ग 2)',
        function: 'Bivalent reactive s-block metals (ns²).',
        explanation: 'Be, Mg, Ca, Sr, Ba, Ra. With two valence electrons and higher nuclear charge than Group 1, they are denser and harder. They oxidize readily to form basic M²⁺ oxides and ionic salts that produce vibrant flame test emission colors.',
        explanationHindi: 'Mg, Ca आदि द्विसंयोजी धातुएं जो ऑक्साइड और हाइड्रॉक्साइड बनाती हैं तथा ज्वाला परीक्षण में विशिष्ट रंग देती हैं।'
      },
      {
        id: 'transition',
        name: 'Transition metals (Groups 3–12)',
        label: 'Transition metals (Groups 3–12)',
        labelHindi: 'संक्रमण तत्व (वर्ग 3-12)',
        function: 'd-Block metallic elements exhibiting variable oxidation states, colorful ions, and catalytic utility.',
        explanation: 'Elements featuring incompletely filled (n-1)d subshells. Because (n-1)d and ns orbital energies are closely spaced, they exhibit multiple oxidation states (e.g. Fe²⁺/Fe³⁺, Mn²⁺ through Mn⁷⁺), form coordination complexes, and act as industrial catalysts.',
        explanationHindi: 'd-ब्लॉक तत्व जो परिवर्ती ऑक्सीकरण अवस्थाएं, रंगीन संकुल आयन तथा उत्कृष्ट उत्प्रेरक गुण प्रदर्शित करते हैं।'
      },
      {
        id: 'post-transition',
        name: 'Post-transition metals',
        label: 'Post-transition metals',
        labelHindi: 'उत्तर-संक्रमण धातुएं',
        function: 'p-Block soft metals with high electronegativity and lower melting points.',
        explanation: 'Al, Ga, In, Sn, Tl, Pb, Bi. Located between transition metals and metalloids. Their valence electrons occupy outer p-orbitals. They exhibit inert pair effects (e.g. Pb²⁺ being more stable than Pb⁴⁺) and amphoteric chemical behavior.',
        explanationHindi: 'Al, Sn, Pb आदि धातुएं जो उभयधर्मी ऑक्साइड बनाती हैं तथा अक्रिय युग्म प्रभाव दर्शाती हैं।'
      },
      {
        id: 'metalloids',
        name: 'Metalloids (Semimetals)',
        label: 'Metalloids (Semimetals)',
        labelHindi: 'उपधातुएं (Metalloids)',
        function: 'Elements with intermediate electronic band gaps, forming the backbone of modern semiconductor electronics.',
        explanation: 'B, Si, Ge, As, Sb, Te. Straddling the diagonal staircase boundary between metals and non-metals. They possess metallic luster with brittle covalent lattices. Their electrical conductivity increases exponentially with temperature and trace dopant addition.',
        explanationHindi: 'Si, Ge आदि तत्व जिनमें धातु और अधातु दोनों के गुण होते हैं; यह अर्धचालक चिप्स और ट्रांजिस्टर का आधार हैं।'
      },
      {
        id: 'nonmetals',
        name: 'Reactive non-metals',
        label: 'Reactive non-metals',
        labelHindi: 'अधातु तत्व (Reactive Non-metals)',
        function: 'High electronegativity elements essential for organic biochemistry and atmospheric gases.',
        explanation: 'C, N, O, P, S, Se, plus Hydrogen. They possess high ionization energies and strongly favor covalent electron sharing or forming negative anions. Fundamental building blocks of nucleic acids, proteins, and carbohydrates.',
        explanationHindi: 'C, N, O आदि अधातुएं जो उच्च विद्युतऋणात्मकता रखती हैं तथा सभी जैविक अणुओं के मुख्य घटक हैं।'
      },
      {
        id: 'halogens',
        name: 'Halogens (Group 17)',
        label: 'Halogens (Group 17)',
        labelHindi: 'हैलोजन (वर्ग 17)',
        function: 'Highly reactive electronegative non-metals with ns² np⁵ electronic configurations.',
        explanation: 'F, Cl, Br, I, At. Lacking only one valence electron to achieve an octet noble-gas configuration, they have high electron affinity and act as vigorous oxidizing agents. They react vigorously with alkali metals to form stoichiometric halides (e.g. NaCl).',
        explanationHindi: 'F, Cl, Br आदि तत्व जो एक इलेक्ट्रॉन ग्रहण कर स्थायी अष्टक प्राप्त करते हैं और लवण बनाते हैं।'
      },
      {
        id: 'noble',
        name: 'Noble gases (Group 18)',
        label: 'Noble gases (Group 18)',
        labelHindi: 'अक्रिय गैसें (वर्ग 18)',
        function: 'Monatomic, odorless, chemically inert gases with full valence octets (ns² np⁶).',
        explanation: 'He, Ne, Ar, Kr, Xe, Rn. Possessing completely filled outer electron shells, they have extremely high ionization energies and negligible electron affinity, remaining chemically unreactive under ambient standard conditions.',
        explanationHindi: 'He, Ne, Ar आदि पूर्ण अष्टक वाली गैसें जो रासायनिक रूप से अक्रिय और एक-परमाणुक होती हैं।'
      },
      {
        id: 'lanthanides',
        name: 'Lanthanides (Rare earths)',
        label: 'Lanthanides (Rare earths)',
        labelHindi: 'लैंथेनाइड्स (दुर्लभ मृदा तत्व)',
        function: 'Inner-transition f-block elements (4f series, Z = 57–71).',
        explanation: 'Characterized by progressive filling of the 4f subshell. They undergo lanthanide contraction—a steady decrease in ionic radius caused by poor 4f electron shielding—and are essential for neodymium magnets, lasers, and petroleum catalysts.',
        explanationHindi: '4f उपकोश भरने वाले तत्व जो लैंथेनाइड आकुंचन और तीव्र चुंबकीय गुण प्रदर्शित करते हैं।'
      },
      {
        id: 'actinides',
        name: 'Actinides (Radioactive elements)',
        label: 'Actinides (Radioactive elements)',
        labelHindi: 'ऐक्टिनाइड्स (रेडियोधर्मी भारी तत्व)',
        function: 'Heavy radioactive inner-transition elements (5f series, Z = 89–103).',
        explanation: 'Th, Pa, U, Np, Pu, and transuranic synthetic elements. All isotopes are radioactive and spontaneously decay via alpha/beta emissions and nuclear fission. Uranium-235 and Plutonium-239 are critical fissile fuels for nuclear power reactors.',
        explanationHindi: 'रेडियोधर्मी भारी तत्व जो स्वतः विखंडित होते हैं; परमाणु ऊर्जा रिएक्टरों में ईंधन के रूप में प्रयुक्त होते हैं।'
      },
    ],
  },
  {
    id: 'electric-circuit',
    title: 'Simple Electric Circuit',
    titleHindi: 'सरल विद्युत परिपथ',
    subject: 'physics',
    subjectCode: 'physics',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'Closed conducting circuit demonstrating Ohm’s Law: V = IR, potential difference, current flow, and load resistance.',
    parts: [
      {
        id: 'battery',
        name: 'DC battery',
        label: 'DC battery',
        labelHindi: 'डीसी बैटरी (विद्युत सेल)',
        function: 'Maintains electrochemical potential difference (Voltage V) across circuit terminals.',
        explanation: 'Supplies chemical electromotive force (EMF) that drives charge separation. By expending chemical energy, it pumps electrons from the positive cathode to the negative anode, creating electric potential energy that drives current.',
        explanationHindi: 'विद्युत वाहक बल (EMF) प्रदान करने वाला स्रोत जो परिपथ के दोनों सिरों पर विभवांतर स्थापित करता है।'
      },
      {
        id: 'ammeter',
        name: 'Ammeter',
        label: 'Ammeter',
        labelHindi: 'ऐमीटर (धारामापी)',
        function: 'Measures electric current (I = dq/dt) in Amperes.',
        explanation: 'Connected strictly in series so that all electrons flowing through the circuit pass through its low-resistance shunt coil, ensuring minimal disturbance to the circuit current being measured.',
        explanationHindi: 'परिपथ में श्रेणीक्रम में जुड़ने वाला उपकरण जो विद्युत धारा के मान को ऐम्पीयर (A) में मापता है।'
      },
      {
        id: 'switch',
        name: 'Switch',
        label: 'Switch',
        labelHindi: 'कुंजी / स्विच (Switch)',
        function: 'Opens or closes the conducting loop to control electric current flow.',
        explanation: 'When closed, physical metallic contact completes the circuit permitting unbroken electron flow. When opened, an air gap introduces virtually infinite dielectric resistance, terminating current.',
        explanationHindi: 'परिपथ को जोड़ने अथवा तोड़ने वाली युक्ति; बंद करने पर धारा बहती है और खोलने पर रुक जाती है।'
      },
      {
        id: 'wire',
        name: 'Connecting wire',
        label: 'Connecting wire',
        labelHindi: 'संयोजी तांबे के तार',
        function: 'Low-resistance conductor providing a closed pathway for drift electrons.',
        explanation: 'Fabricated from high-conductivity electrolytic copper with negligible internal resistance. Under an applied electric field, free conduction electrons drift toward the positive terminal with drift velocity vd.',
        explanationHindi: 'तांबे का सुचालक तार जो न्यूनतम प्रतिरोध के साथ इलेक्ट्रॉनों के प्रवाह के लिए मार्ग प्रदान करता है।'
      },
      {
        id: 'bulb',
        name: 'Bulb',
        label: 'Bulb',
        labelHindi: 'विद्युत बल्ब (भार)',
        function: 'Converts electrical energy into radiant light and thermal heat energy (Joule heating).',
        explanation: 'Contains a fine coiled high-melting tungsten filament encased in argon gas. Resistance to electron collisions raises filament temperature above 2500°C, emitting incandescent light by Joule heating: P = I²R.',
        explanationHindi: 'टंगस्टन तंतु वाला बल्ब जो धारा प्रवाहित होने पर जूल ऊष्मा प्रभाव (H = I²Rt) द्वारा प्रकाश देता है।'
      },
      {
        id: 'resistor',
        name: 'Resistor',
        label: 'Resistor',
        labelHindi: 'प्रतिरोधक (Resistor R)',
        function: 'Imposes calibrated electrical resistance to regulate circuit current according to Ohm’s law.',
        explanation: 'An ohmic component that resists current flow by atomic lattice scattering of conduction electrons. Governed by Ohm\'s Law: V = IR, where resistance R depends on resistivity ρ, length L, and cross-sectional area A (R = ρL/A).',
        explanationHindi: 'विद्युत धारा के प्रवाह में निश्चित बाधा उत्पन्न करने वाला घटक; ओम के नियम (V = IR) का पालन करता है।'
      },
      {
        id: 'current',
        name: 'Conventional current',
        label: 'Conventional current',
        labelHindi: 'पारंपरिक विद्युत धारा',
        function: 'Designates the theoretical directional flow of positive charge carriers.',
        explanation: 'By historical convention defined by Benjamin Franklin, conventional current flows externally from the positive terminal (+) to the negative terminal (−), opposite to the actual physical drift direction of negatively charged electrons.',
        explanationHindi: 'धनात्मक आवेश के बहने की दिशा (बैटरी के धनात्मक + सिरे से ऋणात्मक - सिरे की ओर)।'
      },
    ],
  },
  {
    id: 'digestive-system',
    title: 'Human Digestive System',
    titleHindi: 'मानव पाचन तंत्र',
    subject: 'biology',
    subjectCode: 'biology',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'Anatomical alimentary canal from mouth to intestines illustrating mechanical and biochemical digestion.',
    parts: [
      {
        id: 'mouth',
        name: 'Mouth & Buccal Cavity',
        label: 'Mouth & Buccal Cavity',
        labelHindi: 'मुख एवं मुख गुहा',
        function: 'Mastication of food and enzymatic initiation of starch hydrolysis.',
        explanation: 'Teeth mechanically grind food while saliva secreted from salivary glands lubricates the bolus. Salivary amylase (ptyalin) breaks down complex insoluble starches into soluble maltose disaccharides at neutral pH 6.8.',
        explanationHindi: 'भोजन को चबाना तथा लार में उपस्थित एमाइलेज एंजाइम द्वारा स्टार्च का माल्टोज में पाचन शुरू करना।'
      },
      {
        id: 'oesophagus',
        name: 'Oesophagus',
        label: 'Oesophagus',
        labelHindi: 'ग्रसिका (अन्नप्रणाली)',
        function: 'Propels swallowed food bolus from pharynx into the stomach by coordinated peristalsis.',
        explanation: 'A 25 cm muscular hollow tube lined with stratified squamous epithelium. Alternating circular and longitudinal smooth muscle contractions generate involuntary peristaltic waves that propel the bolus forward.',
        explanationHindi: 'मांसपेशीय नली जो क्रमाकुंचन (Peristalsis) गतियों द्वारा भोजन को आमाशय तक पहुंचाती है।'
      },
      {
        id: 'stomach',
        name: 'Stomach',
        label: 'Stomach',
        labelHindi: 'आमाशय (Stomach)',
        function: 'Acidic chemical digestion of dietary proteins and mechanical churning into chyme.',
        explanation: 'A J-shaped muscular organ whose gastric glands secrete concentrated hydrochloric acid (pH 1.5–2.0) to denature proteins and kill ingested pathogens. Inactive pepsinogen is cleaved into active pepsin, digesting proteins into peptones and proteoses.',
        explanationHindi: 'HCl अम्ल और पेप्सिन एंजाइम स्रावित कर प्रोटीनों को पचाने तथा भोजन को मथने वाला अंग।'
      },
      {
        id: 'liver',
        name: 'Liver',
        label: 'Liver',
        labelHindi: 'यकृत (Liver)',
        function: 'Produces alkaline bile to emulsify dietary fats and metabolize absorbed nutrients.',
        explanation: 'The body’s largest internal metabolic gland. Hepatocytes secrete yellowish-green bile containing bile salts (sodium taurocholate and glycocholate) that emulsify large hydrophobic lipid droplets into micro-micelles for lipase digestion.',
        explanationHindi: 'शरीर की सबसे बड़ी ग्रंथि जो पित्त रस बनाकर वसा का इमल्सीकरण (इमल्शन) करती है।'
      },
      {
        id: 'gallbladder',
        name: 'Gall bladder',
        label: 'Gall bladder',
        labelHindi: 'पित्ताशय (Gallbladder)',
        function: 'Stores and concentrates alkaline hepatic bile before meal-stimulated ejection.',
        explanation: 'A pear-shaped muscular reservoir located beneath the right hepatic lobe. In response to intestinal cholecystokinin (CCK) hormone release after a fatty meal, it contracts, releasing bile into the duodenum via the common bile duct.',
        explanationHindi: 'यकृत से स्रावित पित्त रस का संचय एवं सांद्रण करने वाली छोटी थैली।'
      },
      {
        id: 'pancreas',
        name: 'Pancreas',
        label: 'Pancreas',
        labelHindi: 'अग्न्याशय (Pancreas)',
        function: 'Secretes broad-spectrum digestive enzymes and sodium bicarbonate into the duodenum.',
        explanation: 'A retroperitoneal dual gland. Exocrine acinar cells secrete pancreatic juice containing pancreatic amylase, trypsinogen, chymotrypsinogen, and pancreatic lipase. Alkaline bicarbonate neutralizes gastric acid to pH 7.8–8.2.',
        explanationHindi: 'अग्न्याशयी रस स्रावित करता है जिसमें ट्रिप्सिन (प्रोटीन) तथा लाइपेज (वसा) पाचक एंजाइम होते हैं।'
      },
      {
        id: 'small-intestine',
        name: 'Small intestine',
        label: 'Small intestine',
        labelHindi: 'क्षुद्रांत्र (छोटी आंत)',
        function: 'Terminal enzymatic digestion of macromolecules and maximal nutrient absorption.',
        explanation: 'Divided into duodenum, jejunum, and ileum. Millions of microscopic finger-like projections called villi with microvillus brush borders expand the absorptive surface area over 300 m². Glucose and amino acids enter capillaries while fatty acids enter central lacteals.',
        explanationHindi: 'पाचन का मुख्य केंद्र; दीर्घरोम (Villi) द्वारा पचे हुए पोषक तत्वों का रक्त में अवशोषण होता है।'
      },
      {
        id: 'large-intestine',
        name: 'Large intestine',
        label: 'Large intestine',
        labelHindi: 'बृहदांत्र (बड़ी आंत)',
        function: 'Reabsorption of water, electrolytes, and consolidation of non-digestible fecal mass.',
        explanation: 'Comprising cecum, colon, and rectum. It reabsorbs residual water and mineral electrolytes from indigestible dietary fiber. Commensal gut microflora synthesize vitamin K and B12 prior to defecation via the anal sphincter.',
        explanationHindi: 'अपचित भोजन से जल और आवश्यक लवणों का अवशोषण तथा मल का मलाशय में निष्कासन।'
      },
    ],
  },
  {
    id: 'dna-helix',
    title: 'DNA Double Helix Structure',
    titleHindi: 'डीएनए की द्विकुंडलिनी संरचना (Watson & Crick Model)',
    subject: 'biology',
    subjectCode: 'biology',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'B-DNA double helix showing complementary base pairing, hydrogen bonding, and antiparallel sugar-phosphate backbones.',
    parts: [
      {
        id: 'adenine',
        name: 'Adenine (A)',
        label: 'Adenine (A)',
        labelHindi: 'एडेनिन (A - प्यूरीन)',
        function: 'Purine nitrogenous base that pairs specifically with Thymine via two hydrogen bonds.',
        explanation: 'A bicyclic purine heterocyclic base consisting of a six-membered pyrimidine ring fused to a five-membered imidazole ring. According to Chargaff’s rules, [A] = [T] in all double-stranded genomic DNA.',
        explanationHindi: 'द्वि-चक्रीय प्यूरीन क्षारक जो थायमिन के साथ दो हाइड्रोजन बंध (A = T) बनाता है।'
      },
      {
        id: 'thymine',
        name: 'Thymine (T)',
        label: 'Thymine (T)',
        labelHindi: 'थायमिन (T - पिरिमिडीन)',
        function: 'Pyrimidine nitrogenous base complementary to Adenine (A = T).',
        explanation: 'A monocyclic pyrimidine derivative possessing a 5-methyl group that distinguishes DNA from RNA (where uracil replaces thymine). The hydrophobic methyl group enhances DNA stability against oxidative mutagenesis.',
        explanationHindi: 'एकल-चक्रीय पिरिमिडीन क्षारक जो डीएनए को स्थायित्व प्रदान करता है और एडेनिन से जुड़ता है।'
      },
      {
        id: 'guanine',
        name: 'Guanine (G)',
        label: 'Guanine (G)',
        labelHindi: 'ग्वानिन (G - प्यूरीन)',
        function: 'Purine base that pairs with Cytosine through three stable hydrogen bonds (G ≡ C).',
        explanation: 'A purine base whose Watson-Crick face provides three hydrogen-bonding opportunities (one donor, two acceptors). DNA sequences with high GC content have higher thermal melting temperatures (Tm).',
        explanationHindi: 'प्यूरीन क्षारक जो साइटोसिन के साथ तीन मजबूत हाइड्रोजन बंध (G ≡ C) द्वारा जुड़ता है।'
      },
      {
        id: 'cytosine',
        name: 'Cytosine (C)',
        label: 'Cytosine (C)',
        labelHindi: 'साइटोसिन (C - पिरिमिडीन)',
        function: 'Pyrimidine base complementary to Guanine (C ≡ G).',
        explanation: 'A single-ring pyrimidine possessing a keto oxygen at C2 and an amino group at C4. Pairing with guanine via three hydrogen bonds stabilizes the helical geometry against chemical unwinding.',
        explanationHindi: 'पिरिमिडीन क्षारक जो ग्वानिन के साथ तीन हाइड्रोजन बंध बनाकर द्विकुंडलिनी को दृढ़ता देता है।'
      },
      {
        id: 'hydrogen-bond',
        name: 'Hydrogen bonds',
        label: 'Hydrogen bonds',
        labelHindi: 'हाइड्रोजन बंध (Hydrogen Bonds)',
        function: 'Non-covalent electrostatic attractions holding complementary nucleotide strands together.',
        explanation: 'Formed between electronegative oxygen/nitrogen atoms and electropositive hydrogen atoms on opposite bases (A=T shares 2 bonds; G≡C shares 3 bonds). While individually weak (~2–5 kcal/mol), millions acting in unison provide high structural stability while enabling strand separation during transcription and replication.',
        explanationHindi: 'दुर्बल गैर-सहसंयोजक बंध जो दोनों रज्जुकों को जोड़ते हैं तथा आवश्यकता पड़ने पर आसानी से खुल जाते हैं।'
      },
      {
        id: 'backbone',
        name: 'Sugar-phosphate backbone',
        label: 'Sugar-phosphate backbone',
        labelHindi: 'शर्करा-फॉस्फेट रीढ़ (Backbone)',
        function: 'Forms the outer covalent rails of the double helix with 5\' to 3\' directional polarity.',
        explanation: 'Repeated units of 2\'-deoxyribose sugars linked by 3\'-5\' phosphodiester bridges. The two parallel strands are antiparallel: one runs 5\'→3\' while the complementary partner runs 3\'→5\'.',
        explanationHindi: 'फॉस्फोडाइएस्टर बंधों से जुड़ी बाहरी रीढ़ जो दोनों रज्जुकों को प्रति-समानांतर (5\'→3\' और 3\'→5\') दिशा में रखती है।'
      },
      {
        id: 'sugar',
        name: 'Deoxyribose sugar',
        label: 'Deoxyribose sugar',
        labelHindi: 'डिऑक्सीराइबोज शर्करा (Pentose Sugar)',
        function: '5-Carbon cyclic pentose linking the phosphate group to the nitrogenous base.',
        explanation: 'A modified ribose sugar lacking a hydroxyl group at carbon 2\' (hence "deoxy"). The absence of 2\'-OH prevents nucleophilic self-cleavage, making DNA substantially more chemically stable over millennia than RNA.',
        explanationHindi: '5-कार्बन वाली पेंटोज शर्करा जिसके 2\' कार्बन पर ऑक्सीजन न होने से डीएनए अत्यधिक स्थायी होता है।'
      },
      {
        id: 'phosphate',
        name: 'Phosphate group',
        label: 'Phosphate group',
        labelHindi: 'फॉस्फेट समूह (PO₄³⁻)',
        function: 'Connects adjacent pentose sugars and imparts overall net negative charge to DNA.',
        explanation: 'Ionized phosphate groups (PO₄⁻) along the exterior impart a strong polyanionic surface charge to the DNA macromolecule, enabling high-affinity electrostatic binding to positively charged basic histone proteins.',
        explanationHindi: 'ऋणावेशित फॉस्फेट समूह जो डीएनए अणु को समग्र ऋणात्मक आवेश देते हैं।'
      },
    ],
  },
  {
    id: 'bar-magnet',
    title: 'Magnetic Field Lines of Bar Magnet',
    titleHindi: 'छड़ चुंबक की चुंबकीय क्षेत्र रेखाएं',
    subject: 'physics',
    subjectCode: 'physics',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'Magnetic dipole field lines, continuous closed loops, pole strength, and magnetic compass alignment.',
    parts: [
      {
        id: 'north-pole',
        name: 'North pole',
        label: 'North pole',
        labelHindi: 'उत्तरी ध्रुव (N ध्रुव)',
        function: 'Region of concentrated magnetic polarity from which external field lines diverge.',
        explanation: 'The magnetic dipole face that orients toward geographic north when suspended freely. Magnetic field vectors diverge outward into external space from the North pole face.',
        explanationHindi: 'चुंबक का वह सिरा जिससे चुंबकीय क्षेत्र रेखाएं बाहर की ओर निकलती हैं।'
      },
      {
        id: 'south-pole',
        name: 'South pole',
        label: 'South pole',
        labelHindi: 'दक्षिणी ध्रुव (S ध्रुव)',
        function: 'Region of magnetic polarity where external field lines converge.',
        explanation: 'The opposite magnetic pole where external lines of force terminate before continuing through the interior of the ferromagnet back to the North pole.',
        explanationHindi: 'चुंबक का वह सिरा जहां बाह्य चुंबकीय क्षेत्र रेखाएं अंदर प्रवेश करती हैं।'
      },
      {
        id: 'field-lines',
        name: 'Magnetic field lines',
        label: 'Magnetic field lines',
        labelHindi: 'चुंबकीय बल रेखाएं',
        function: 'Imaginary continuous curves representing the vector direction and intensity of the magnetic field.',
        explanation: 'Continuous closed loops with no beginning or end (satisfying Gauss’s law for magnetism: ∇·B = 0). Field line density is directly proportional to magnetic flux density B (measured in Tesla); lines never intersect at any point.',
        explanationHindi: 'सतत बंद वक्र जो कभी एक दूसरे को नहीं काटते; रेखाओं की निकटता क्षेत्र की प्रबलता दर्शाती है।'
      },
      {
        id: 'field-direction',
        name: 'Direction arrows',
        label: 'Direction arrows',
        labelHindi: 'दिशा तीर (B-वेक्टर दिशा)',
        function: 'Indicate the instantaneous trajectory of a hypothetical isolated north magnetic monopolar test charge.',
        explanation: 'By convention, arrows point externally away from the North pole toward the South pole (N → S), and internally from the South pole back to the North pole (S → N).',
        explanationHindi: 'चुंबक के बाहर उत्तर से दक्षिण (N → S) तथा चुंबक के अंदर दक्षिण से उत्तर (S → N) की दिशा।'
      },
      {
        id: 'compass',
        name: 'Compass needle',
        label: 'Compass needle',
        labelHindi: 'दिक्सूचक सुई (Compass Needle)',
        function: 'Pivoted magnetized needle that aligns tangentially along local magnetic field lines.',
        explanation: 'A tiny friction-free magnetic dipole. The torque τ = m × B exerted by the bar magnet\'s field rotates the needle until its magnetic dipole moment aligns parallel with the tangent vector to the local field line.',
        explanationHindi: 'छोटी चुंबकीय सुई जो चुंबकीय क्षेत्र रेखा की स्पर्श रेखा की दिशा में स्वतः संरेखित हो जाती है।'
      },
    ],
  },
  {
    id: 'water-electrolysis',
    title: 'Electrolysis of Water Cell',
    titleHindi: 'जल का विद्युत अपघटन (Electrolysis of Water)',
    subject: 'chemistry',
    subjectCode: 'chemistry',
    viewBox: '0 0 800 500',
    svgViewBox: '0 0 800 500',
    description: 'Hofmann electrolysis apparatus demonstrating electrochemical dissociation: 2H₂O(l) → 2H₂(g) + O₂(g).',
    parts: [
      {
        id: 'battery',
        name: 'DC battery',
        label: 'DC battery',
        labelHindi: 'डीसी विद्युत स्रोत (DC Source)',
        function: 'Provides direct electric potential (>1.23 V) driving non-spontaneous endothermic redox reactions.',
        explanation: 'Direct current (DC) is mandatory for electrolytic decomposition. An applied voltage exceeding standard cell potential (E° = 1.23 V plus overpotential) pushes electrons into the cathode and removes them from the anode.',
        explanationHindi: 'दिष्ट धारा (DC) स्रोत जो अपघटन के लिए आवश्यक विभवांतर प्रदान करता है।'
      },
      {
        id: 'cathode',
        name: 'Cathode (−)',
        label: 'Cathode (−)',
        labelHindi: 'ऋणात्मक कैथोड (−)',
        function: 'Electrode where electro-reduction occurs, liberating Hydrogen gas.',
        explanation: 'Connected to negative DC terminal. Hydrogen cations accept electrons via reduction half-reaction: 2H⁺(aq) + 2e⁻ → H₂(g). Hydrogen gas bubbles form at twice the volumetric rate of oxygen.',
        explanationHindi: 'ऋण ध्रुव जहां अपचयन क्रिया द्वारा हाइड्रोजन गैस (H₂) मुक्त होती है।'
      },
      {
        id: 'anode',
        name: 'Anode (+)',
        label: 'Anode (+)',
        labelHindi: 'धनात्मक एनोड (+)',
        function: 'Electrode where electro-oxidation occurs, evolving Oxygen gas.',
        explanation: 'Connected to positive DC terminal. Water molecules lose electrons via oxidation half-reaction: 2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻. Oxygen gas relights a glowing wooden splint.',
        explanationHindi: 'धन ध्रुव जहां ऑक्सीकरण क्रिया द्वारा ऑक्सीजन गैस (O₂) मुक्त होती है।'
      },
      {
        id: 'electrolyte',
        name: 'Electrolyte',
        label: 'Electrolyte',
        labelHindi: 'तनु अम्लीकृत जल (विद्युत अपघट्य)',
        function: 'Aqueous conducting medium supplying mobile charge-carrying ions.',
        explanation: 'Pure deionized water is an electrical insulator due to infinitesimal auto-ionization (Kw = 10⁻¹⁴). Adding dilute sulfuric acid (H₂SO₄) provides abundant mobile H₃O⁺ and SO₄²⁻ ions to conduct Faraday current without consuming acid.',
        explanationHindi: 'तनु सल्फ्यूरिक अम्ल मिश्रित जल; शुद्ध जल कुचालक होता है, अम्ल मिलाने से आयन चालकता बढ़ाते हैं।'
      },
      {
        id: 'hydrogen',
        name: 'Hydrogen gas tube',
        label: 'Hydrogen gas tube',
        labelHindi: 'हाइड्रोजन परखनली (2 आयतन)',
        function: 'Inverted graduated test tube collecting H₂ gas by downward displacement of water.',
        explanation: 'Stoichiometric molar ratio 2:1 from the balanced equation 2H₂O → 2H₂ + O₂ produces double the volume of hydrogen gas above the cathode column compared to oxygen.',
        explanationHindi: 'कैथोड पर जल विस्थापन द्वारा एकत्र 2 भाग हाइड्रोजन गैस; यह पॉप ध्वनि के साथ जलती है।'
      },
      {
        id: 'oxygen',
        name: 'Oxygen gas tube',
        label: 'Oxygen gas tube',
        labelHindi: 'ऑक्सीजन परखनली (1 आयतन)',
        function: 'Inverted test tube collecting O₂ gas by downward displacement of water.',
        explanation: '1 volume of oxygen gas collects above the anode column. Oxygen is a colorless, odorless gas that supports combustion, causing a glowing ember to rekindle into flame.',
        explanationHindi: 'एनोड पर एकत्र 1 भाग ऑक्सीजन गैस; यह जलने में सहायक है।'
      },
      {
        id: 'beaker',
        name: 'Beaker',
        label: 'Beaker',
        labelHindi: 'कांच का बीकर / पात्र',
        function: 'Chemically inert borosilicate glass vessel containing acidified water solution.',
        explanation: 'Resists thermal changes and chemical attack by dilute sulfuric acid throughout continuous electrolysis runs.',
        explanationHindi: 'अम्ल-प्रतिरोधी बोरोसिलिकेट कांच का पात्र जिसमें अपघटन प्रक्रिया होती है।'
      },
    ],
  },
  {
    id: 'unit-circle',
    title: 'Trigonometric Unit Circle',
    titleHindi: 'त्रिकोणमितीय इकाई वृत्त (Unit Circle)',
    subject: 'mathematics',
    subjectCode: 'mathematics',
    viewBox: '0 0 800 480',
    svgViewBox: '0 0 800 480',
    description: 'Circle of radius r = 1 centered at origin demonstrating trigonometric functions, coordinates, and Pythagorean identity: sin²θ + cos²θ = 1.',
    parts: [
      {
        id: 'unit-circle',
        name: 'Unit circle',
        label: 'Unit circle',
        labelHindi: 'इकाई वृत्त (Radius r = 1)',
        function: 'Geometric circle of radius r = 1 defined algebraically by x² + y² = 1.',
        explanation: 'The foundation of circular trigonometry. Because the hypotenuse is exactly 1, every point on the circumference directly defines coordinate trigonometric ratios: P = (cos θ, sin θ) across all 360° quadrants.',
        explanationHindi: 'मूल बिंदु पर स्थित 1 इकाई त्रिज्या वाला वृत्त; इसका प्रत्येक बिंदु (cos θ, sin θ) को दर्शाता है।'
      },
      {
        id: 'radius',
        name: 'Radius (hypotenuse = 1)',
        label: 'Radius (hypotenuse = 1)',
        labelHindi: 'त्रिज्या सदिश (कर्ण = 1)',
        function: 'Vector joining the origin (0, 0) to circumferential point P.',
        explanation: 'With length r = 1, sin θ = Opp/Hyp = y/1 = y, and cos θ = Adj/Hyp = x/1 = x. Hence, the geometric segment lengths themselves are identical to the trigonometric function values.',
        explanationHindi: 'मूल बिंदु से परिधि तक खींची गई 1 लम्बाई की रेखा जो समकोण त्रिभुज का कर्ण बनती है।'
      },
      {
        id: 'angle',
        name: 'Angle θ',
        label: 'Angle θ',
        labelHindi: 'कोण θ (Angle in Degrees / Radians)',
        function: 'Rotational arc swept counter-clockwise from the positive x-axis.',
        explanation: 'Measured in radians or degrees. Angles measured counter-clockwise are positive, spanning Quadrants I (0°–90°), II (90°–180°), III (180°–270°), and IV (270°–360°).',
        explanationHindi: 'धनात्मक x-अक्ष से वामावर्त (एंटी-क्लॉकवाइज) दिशा में मापा गया घूर्णन कोण।'
      },
      {
        id: 'cosine',
        name: 'Cosine (cos θ)',
        label: 'Cosine (cos θ)',
        labelHindi: 'कोज्या (cos θ - क्षैतिज प्रक्षेप)',
        function: 'Horizontal signed projection length along the x-axis: x = cos θ.',
        explanation: 'Bounded between [−1, +1]. Positive in Quadrants I and IV where x > 0; negative in Quadrants II and III. Crosses 0 at 90° and 270°.',
        explanationHindi: 'बिंदु P का क्षैतिज आधार प्रक्षेप; प्रथम और चतुर्थ चतुर्थांश में धनात्मक तथा द्वितीय और तृतीय में ऋणात्मक।'
      },
      {
        id: 'sine',
        name: 'Sine (sin θ)',
        label: 'Sine (sin θ)',
        labelHindi: 'ज्या (sin θ - ऊर्ध्वाधर प्रक्षेप)',
        function: 'Vertical signed projection height along the y-axis: y = sin θ.',
        explanation: 'Bounded between [−1, +1]. Positive in Quadrants I and II where y > 0; negative in Quadrants III and IV. Crosses 0 at 0°, 180°, and 360°.',
        explanationHindi: 'बिंदु P की ऊर्ध्वाधर ऊंचाई (लम्ब); प्रथम और द्वितीय चतुर्थांश में धनात्मक तथा तृतीय और चतुर्थ में ऋणात्मक।'
      },
      {
        id: 'tangent',
        name: 'Tangent (tan θ)',
        label: 'Tangent (tan θ)',
        labelHindi: 'स्पर्शज्या (tan θ = sin θ / cos θ)',
        function: 'Vertical distance intercepted on the tangent line x = 1 by the extended radius line.',
        explanation: 'Defined as the ratio of sine to cosine: tan θ = sin θ / cos θ = y / x. It is undefined (approaching ±∞) at 90° and 270° where cos θ = 0.',
        explanationHindi: 'स्पर्श रेखा पर कटा खंड; tan θ = sin θ / cos θ; 90° और 270° पर यह अपरिभाषित (अनंत) होता है।'
      },
      {
        id: 'point',
        name: 'Point P(cos θ, sin θ)',
        label: 'Point P(cos θ, sin θ)',
        labelHindi: 'गतिशील बिंदु P(cos θ, sin θ)',
        function: 'Draggable coordinate point on the circle circumference.',
        explanation: 'Drag this orange handle continuously around the circle to interactively observe how sine, cosine, and tangent lengths and signs dynamically modulate across all four geometric quadrants.',
        explanationHindi: 'वृत्त पर गतिशील बिंदु; इसे घुमाकर चारों चतुर्थांशों में sin, cos और tan के मानों में परिवर्तन देखें।'
      },
    ],
  },
];
