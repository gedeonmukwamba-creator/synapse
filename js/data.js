/* Synapse — données (contenu pédagogique L1 médecine UPC) */

const USER = {
  firstName: 'Gédéon',
  lastName: 'Mukwamba',
  initials: 'GM',
  promo: 'L1 Médecine · UPC Kinshasa',
  globalProgress: 64,
  qcmDone: 87,
  qcmPassed: 71,
  avgScore: 78,
  studyHours: 42,
  studyThisWeek: 6.5,
  streak: 9,
  points: 2840,
};

const SUBJECTS = [
  { id: 'anat', name: 'Anatomie', icon: 'anatomy', color: 'blue', chapters: 8, qcm: 124, progress: 72,
    desc: 'Ostéologie, myologie, systèmes et régions du corps humain.' },
  { id: 'biochem', name: 'Biochimie', icon: 'biochem', color: 'mint', chapters: 6, qcm: 98, progress: 58,
    desc: 'Glucides, lipides, protéines, enzymes et métabolisme.' },
  { id: 'physio', name: 'Physiologie', icon: 'physio', color: 'coral', chapters: 7, qcm: 110, progress: 45,
    desc: 'Fonctionnement des grands systèmes : cœur, rein, respiration.' },
  { id: 'histo', name: 'Histologie', icon: 'histo', color: 'violet', chapters: 5, qcm: 76, progress: 81,
    desc: 'Tissus fondamentaux, cellules et organisation microscopique.' },
  { id: 'semio', name: 'Sémiologie', icon: 'semio', color: 'sky', chapters: 6, qcm: 64, progress: 30,
    desc: "Signes cliniques, examen et vocabulaire de l'observation." },
  { id: 'embryo', name: 'Embryologie', icon: 'embryo', color: 'gold', chapters: 4, qcm: 52, progress: 22,
    desc: 'Développement, gamétogenèse et formation des organes.' },
  { id: 'biophys', name: 'Biophysique', icon: 'biophys', color: 'blue', chapters: 5, qcm: 60, progress: 40,
    desc: 'Phénomènes physiques appliqués au vivant, fluides, pH.' },
  { id: 'microbio', name: 'Microbiologie', icon: 'microbio', color: 'mint', chapters: 5, qcm: 58, progress: 15,
    desc: 'Bactéries, virus, défenses et agents pathogènes.' },
];

const COLOR_CLASS = { blue:'ic-blue', mint:'ic-mint', coral:'ic-coral', violet:'ic-violet', sky:'ic-sky', gold:'ic-gold' };

const CHAPTERS = {
  anat: [
    { id:'a1', n:1, title:"Ostéologie générale & le squelette axial", progress:100, qcm:18, hasVideo:true, mins:35 },
    { id:'a2', n:2, title:"Le système cardiovasculaire — cœur & gros vaisseaux", progress:74, qcm:22, hasVideo:true, mins:48 },
    { id:'a3', n:3, title:"Myologie : organisation des muscles squelettiques", progress:60, qcm:16, hasVideo:false, mins:30 },
    { id:'a4', n:4, title:"Le membre supérieur — os, articulations, innervation", progress:40, qcm:20, hasVideo:true, mins:52 },
    { id:'a5', n:5, title:"Le membre inférieur & la ceinture pelvienne", progress:15, qcm:18, hasVideo:true, mins:46 },
    { id:'a6', n:6, title:"Système nerveux central — encéphale & moelle", progress:0, qcm:24, hasVideo:true, mins:60 },
  ],
  biochem: [
    { id:'b1', n:1, title:"Les glucides : structure & classification", progress:90, qcm:16, hasVideo:true, mins:32 },
    { id:'b2', n:2, title:"Les lipides & les membranes biologiques", progress:55, qcm:18, hasVideo:false, mins:34 },
    { id:'b3', n:3, title:"Acides aminés & structure des protéines", progress:48, qcm:20, hasVideo:true, mins:40 },
    { id:'b4', n:4, title:"Enzymes & cinétique enzymatique", progress:20, qcm:22, hasVideo:true, mins:44 },
    { id:'b5', n:5, title:"Glycolyse & cycle de Krebs", progress:0, qcm:22, hasVideo:true, mins:55 },
  ],
  physio: [
    { id:'p1', n:1, title:"Le potentiel de membrane & l'influx nerveux", progress:70, qcm:18, hasVideo:true, mins:42 },
    { id:'p2', n:2, title:"Physiologie cardiaque & cycle cardiaque", progress:50, qcm:20, hasVideo:true, mins:48 },
    { id:'p3', n:3, title:"Le rein & la filtration glomérulaire", progress:30, qcm:18, hasVideo:false, mins:40 },
  ],
};

const QUIZ = {
  id: 'qcm-anat-cv',
  subject: 'Anatomie',
  subjectColor: 'blue',
  chapter: "Le système cardiovasculaire",
  difficulty: 'Moyen',
  questions: [
    { q: "Combien de cavités le cœur humain comporte-t-il ?",
      opts: ["2 cavités", "3 cavités", "4 cavités", "5 cavités"], correct: 2,
      exp: "Le cœur possède **quatre cavités** : deux oreillettes (atria) en haut, qui reçoivent le sang, et deux ventricules en bas, qui l'éjectent. La cloison interventriculaire sépare les deux ventricules.",
      src: "Anatomie · Ch.2 — Cœur & gros vaisseaux" },
    { q: "Quelle valve sépare l'oreillette gauche du ventricule gauche ?",
      opts: ["La valve tricuspide", "La valve mitrale", "La valve aortique", "La valve pulmonaire"], correct: 1,
      exp: "La **valve mitrale** (ou bicuspide) sépare l'oreillette gauche du ventricule gauche. À droite, c'est la valve tricuspide. Moyen mnémotechnique : « M » comme Mitrale et comme Gauche (Mano gauche).",
      src: "Anatomie · Ch.2 — Valves cardiaques" },
    { q: "Le sang pauvre en oxygène quitte le cœur droit par :",
      opts: ["L'aorte", "Les veines pulmonaires", "Le tronc / l'artère pulmonaire", "La veine cave"], correct: 2,
      exp: "Le ventricule droit éjecte le sang désoxygéné dans le **tronc pulmonaire**, qui le conduit vers les poumons pour l'hématose. C'est l'unique artère du corps à transporter du sang pauvre en O₂.",
      src: "Anatomie · Ch.2 — Petite circulation" },
    { q: "Les artères coronaires naissent au niveau de :",
      opts: ["La crosse de l'aorte", "Les sinus de Valsalva (racine aortique)", "Le tronc pulmonaire", "L'oreillette droite"], correct: 1,
      exp: "Les artères coronaires droite et gauche naissent des **sinus de Valsalva**, juste au-dessus de la valve aortique. Elles assurent la vascularisation propre du myocarde.",
      src: "Anatomie · Ch.2 — Vascularisation du myocarde" },
    { q: "Quel vaisseau ramène le sang oxygéné des poumons vers le cœur ?",
      opts: ["L'artère pulmonaire", "Les veines pulmonaires", "La veine cave supérieure", "L'aorte descendante"], correct: 1,
      exp: "Les **veines pulmonaires** (au nombre de quatre) ramènent le sang riche en O₂ vers l'oreillette gauche. Ce sont les seules veines transportant du sang oxygéné.",
      src: "Anatomie · Ch.2 — Retour veineux pulmonaire" },
    { q: "Le péricarde est :",
      opts: ["Le muscle cardiaque lui-même", "La couche interne tapissant les cavités", "L'enveloppe fibro-séreuse entourant le cœur", "Une valve cardiaque"], correct: 2,
      exp: "Le **péricarde** est le sac fibro-séreux qui enveloppe le cœur. Le myocarde est le muscle, l'endocarde tapisse l'intérieur des cavités.",
      src: "Anatomie · Ch.2 — Enveloppes du cœur" },
  ],
};

const RESOURCES = {
  videos: [
    { id:'v1', subj:'Anatomie', src:'AnatomieKiné', title:"Anatomie du cœur en 3D", desc:"Visite guidée des cavités, valves et gros vaisseaux.", dur:"12:40", yt:"u_OncRCbDfM" },
    { id:'v2', subj:'Biochimie', src:'Biochimie Facile', title:"La glycolyse expliquée simplement", desc:"Les 10 étapes du catabolisme du glucose, pas à pas.", dur:"18:05", yt:"4VLjsLjFs_8" },
    { id:'v3', subj:'Physiologie', src:'Khan Academy FR', title:"Potentiel d'action neuronal", desc:"Dépolarisation, repolarisation et rôle des canaux ioniques.", dur:"09:22", yt:"7EyhsOewnH4" },
    { id:'v4', subj:'Histologie', src:'Histo Atlas', title:"Les 4 tissus fondamentaux", desc:"Épithélial, conjonctif, musculaire et nerveux au microscope.", dur:"15:11", yt:"V3pUlpY1KGg" },
    { id:'v5', subj:'Anatomie', src:'AnatomieKiné', title:"Le squelette axial", desc:"Crâne, colonne vertébrale et cage thoracique.", dur:"14:30", yt:"rDGqkMHPDqE" },
    { id:'v6', subj:'Biochimie', src:'Osmosis FR', title:"Structure des protéines", desc:"Du primaire au quaternaire : repliement et fonction.", dur:"11:48", yt:"2Ll1iX5Vf_E" },
  ],
  links: [
    { subj:'Anatomie', title:"Kenhub — Atlas d'anatomie", url:"kenhub.com/fr", icon:'anatomy', color:'blue' },
    { subj:'Anatomie', title:"IMAIOS e-Anatomy", url:"imaios.com/fr", icon:'histo', color:'violet' },
    { subj:'Biochimie', title:"Biochimie — Cours & exercices", url:"biochimej.univ-angers.fr", icon:'biochem', color:'mint' },
    { subj:'Physiologie', title:"Physiologie humaine (CHUPS)", url:"chups.jussieu.fr", icon:'physio', color:'coral' },
    { subj:'Tous', title:"PubMed — recherche scientifique", url:"pubmed.ncbi.nlm.nih.gov", icon:'search', color:'sky' },
    { subj:'Histologie', title:"Histology Guide — lames virtuelles", url:"histologyguide.com", icon:'histo', color:'violet' },
  ],
};

const LEADERBOARD = [
  { rank:1, name:'Josué Kalala', meta:'L1 · Groupe B', initials:'JK', pts:3120, streak:14, color:'blue' },
  { rank:2, name:'Gédéon Mukwamba', meta:'C\'est toi', initials:'GM', pts:2840, streak:9, color:'mint', me:true },
  { rank:3, name:'Esther Nkulu', meta:'L1 · Groupe A', initials:'EN', pts:2610, streak:7, color:'coral' },
  { rank:4, name:'Daniel Tshibangu', meta:'L1 · Groupe B', initials:'DT', pts:2390, streak:5, color:'violet' },
  { rank:5, name:'Sarah Ilunga', meta:'L1 · Groupe A', initials:'SI', pts:2155, streak:11, color:'sky' },
  { rank:6, name:'Patrick Mukendi', meta:'L1 · Groupe C', initials:'PM', pts:1980, streak:3, color:'gold' },
  { rank:7, name:'Ruth Kabongo', meta:'L1 · Groupe B', initials:'RK', pts:1840, streak:6, color:'coral' },
];

const AVATAR_GRAD = {
  blue: 'linear-gradient(140deg,#356394,#15314d)',
  mint: 'linear-gradient(140deg,#2ecc8f,#1f9d6c)',
  coral:'linear-gradient(140deg,#ef8a7f,#d2564c)',
  violet:'linear-gradient(140deg,#9384e0,#6a59c5)',
  sky:  'linear-gradient(140deg,#5cb6e6,#2e85bd)',
  gold: 'linear-gradient(140deg,#f7cd5a,#dca018)',
};

const SUMMARY = {
  subject: 'Biochimie',
  chapter: 'Chapitre 1',
  title: 'Les glucides : structure & classification',
  readMins: 6,
  updated: '12 oct. 2025',
};
