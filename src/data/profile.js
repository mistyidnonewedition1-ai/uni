/**
 * ─────────────────────────────────────────────────────────────
 *  À PERSONNALISER — tout ton auto-portrait est dans CE fichier.
 *
 *  Les mini-jeux, le carnet et la finale lisent uniquement ces
 *  textes. Tu peux changer les phrases sans toucher au code.
 *
 *  Règles simples :
 *  - Garde les `id` tels quels si tu veux conserver une partie
 *    déjà commencée sur ton téléphone.
 *  - Tu peux réécrire tous les textes, le prénom, l'âge, etc.
 *  - Tu peux ajouter un objet en copiant un bloc et en changeant
 *    son `id` (les passions, les études et les langues suivent).
 *  - Mes goûts : 8 objets maximum (il y a 8 cachettes).
 *  - Mon univers : 8 découvertes maximum.
 *  - Ma personnalité : 6 symboles maximum.
 *  - Quand tes textes sont les tiens, passe `ready` à true
 *    pour masquer le rappel « textes d'exemple ».
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  // À PERSONNALISER : passe à true quand ce n'est plus l'exemple.
  ready: false,

  // À PERSONNALISER
  name: "Lea",
  // À PERSONNALISER
  age: "18 ans",
  // À PERSONNALISER : une phrase courte sous ton prénom
  tagline: "Des images, des sons, et des mondes à explorer.",
  // À PERSONNALISER : le mode d'emploi, deux lignes maximum
  intro:
    "Chaque étoile est un mini-jeu. Ce que tu trouves s'écrit dans le carnet.",

  // À PERSONNALISER : le texte lu à la fin, quand tout est découvert.
  portrait: [
    "Je m'appelle Lea. J'aime fabriquer des ambiances : une image, un son, une lumière de nuit.",
    "Mon parcours passe par l'audiovisuel. J'apprends à créer, et le son est devenu essentiel.",
    "Je suis plutôt rêveuse, curieuse, et je tiens bon quand un projet me tient à cœur.",
    "Le français est ma langue, l'anglais un outil, l'espagnol une porte que je suis en train d'ouvrir.",
  ],

  /**
   * MES GOÛTS — objets cachés dans la pièce.
   * L'ordre du tableau = l'ordre des cachettes.
   * `label` apparaît dans le carnet (même avant la découverte).
   * `text` reste masqué tant que l'objet n'est pas ramassé.
   */
  tastes: [
    {
      id: "taste-music",
      icon: "🎵",
      label: "Musique", // À PERSONNALISER
      text: "J'écoute beaucoup de musiques dans le style metal , dark pop , alt pop , classique.", // À PERSONNALISER
    },
    {
      id: "taste-games",
      icon: "🎮",
      label: "Jeux vidéo", // À PERSONNALISER
      text: "J'aime les jeux de tire, du style counter-strike, fortnite , mais aussi les jeux chill type animal crossing ou autre.", // À PERSONNALISER
    },
    {
      id: "taste-aesthetic",
      icon: "🌙",
      label: "Esthétique", // À PERSONNALISER
      text: "Je suis attiré par les lumières de nuit, le violet, l'or pâle, les images un peu floues.", // À PERSONNALISER
    },
    {
      id: "taste-create",
      icon: "🎨",
      label: "Ce que j'aime créer", // À PERSONNALISER
      text: "Monter une séquence, chercher un son juste, construire une ambiance.", // À PERSONNALISER
    },
    {
      id: "taste-film",
      icon: "⭐",
      label: "Film préféré", // À PERSONNALISER
      text: "Les films où ca ce passe dans l'univers me touche.", // À PERSONNALISER
    },
  ],

  /**
   * MES PASSIONS — le joueur doit séparer le vrai du faux.
   * truths : ce qui est vraiment toi (débloque le carnet).
   * decoys : des pistes fausses. À PERSONNALISER : mets des choses
   * qui ne te ressemblent PAS.
   */
  passions: {
    truths: [
      {
        id: "passion-cinema",
        icon: "🖥️",
        label: "L'informatique", // À PERSONNALISER
        text: "l'informatique reste un domaine qui me passionne.", // À PERSONNALISER
      },
      {
        id: "passion-sound",
        icon: "🎧",
        label: "Le son", // À PERSONNALISER
        text: "Le son change tout. Une scène banale devient un souvenir dès que l'ambiance sonore est juste.", // À PERSONNALISER
      },
      {
        id: "passion-games",
        icon: "🎮",
        label: "Les jeux vidéo", // À PERSONNALISER
        text: "Les jeux vidéo sont pour moi des décors dans lesquels on entre vraiment.", // À PERSONNALISER
      },
      {
        id: "passion-image",
        icon: "🖼️",
        label: "L'image", // À PERSONNALISER
        text: "J'aime composer une image : les couleurs, le vide, ce que l'on choisit de montrer.", // À PERSONNALISER
      },
      {
        id: "passion-lang",
        icon: "🌎",
        label: "Les langues", // À PERSONNALISER
        text: "Apprendre une langue, c'est gagner une autre pièce dans la même maison.", // À PERSONNALISER
      },
    ],
    decoys: [
      { id: "decoy-accounts", icon: "📊", label: "La comptabilité" }, // À PERSONNALISER (faux)
      { id: "decoy-f1", icon: "🏎️", label: "La Formule 1" }, // À PERSONNALISER (faux)
      { id: "decoy-garden", icon: "🪴", label: "Le jardinage" }, // À PERSONNALISER (faux)
      { id: "decoy-rugby", icon: "🏉", label: "Le rugby" }, // À PERSONNALISER (faux)
    ],
  },

  /**
   * MES ÉTUDES — l'ordre du tableau EST le bon ordre du puzzle.
   * Le premier objet est la première étape du parcours.
   */
  studies: [
    {
      id: "study-curiosity",
      label: "Curiosité", // À PERSONNALISER
      text: "Tout a commencé par l'envie de raconter avec des images, avant même d'avoir le vocabulaire.", // À PERSONNALISER
    },
    {
      id: "study-av",
      label: "Audiovisuel", // À PERSONNALISER
      text: "J'ai choisi la voie de l'audiovisuel pour apprendre le cadre, le récit et la technique.", // À PERSONNALISER
    },
    {
      id: "study-bts",
      label: "BTS", // À PERSONNALISER
      text: "Je prépare un BTS : c'est là que les essais deviennent des projets.", // À PERSONNALISER
    },
    {
      id: "study-creation",
      label: "Création", // À PERSONNALISER
      text: "Ce qui m'importe, c'est créer — pas seulement savoir utiliser les outils.", // À PERSONNALISER
    },
    {
      id: "study-sound",
      label: "Son", // À PERSONNALISER
      text: "Le son est devenu une partie essentielle de mon parcours. Il porte l'émotion.", // À PERSONNALISER
    },
  ],

  /**
   * MA PERSONNALITÉ — un symbole par trait, dans l'ordre du labyrinthe.
   * Maximum 6 traits.
   */
  personality: [
    {
      id: "self-dream",
      symbol: "🌙",
      label: "Rêveur", // À PERSONNALISER
      text: "Je vis un peu dans mes images. Les idées arrivent souvent quand il fait calme.", // À PERSONNALISER
    },
    {
      id: "self-listen",
      symbol: "🎧",
      label: "À l'écoute", // À PERSONNALISER
      text: "J'entends les détails : un ton de voix, un bruit de fond, ce qui n'est pas dit.", // À PERSONNALISER
    },
    {
      id: "self-curious",
      symbol: "✨",
      label: "Curieux", // À PERSONNALISER
      text: "J'aime ouvrir une porte de plus, même si je ne sais pas encore ce qu'il y a derrière.", // À PERSONNALISER
    },
    {
      id: "self-calm",
      symbol: "🌊",
      label: "Calme", // À PERSONNALISER
      text: "Je parle peu au début. Je regarde, je prends le temps, puis je me lance.", // À PERSONNALISER
    },
    {
      id: "self-drive",
      symbol: "🔥",
      label: "Persévérant", // À PERSONNALISER
      text: "Quand un projet me tient, je reviens dessus jusqu'à ce qu'il sonne juste.", // À PERSONNALISER
    },
  ],

  // À PERSONNALISER : le paragraphe affiché à la sortie du labyrinthe.
  personalitySynthesis:
    "Rêveur, à l'écoute, curieux, calme, et persévérant : je construis doucement, mais je ne lâche pas une idée qui compte.",

  /**
   * MES LANGUES — chaque langue a des mots à associer.
   * Quand tous ses mots sont rangés, la langue se débloque.
   */
  languages: [
    {
      id: "lang-fr",
      name: "Français", // À PERSONNALISER
      label: "Français", // À PERSONNALISER
      level: "Langue maternelle", // À PERSONNALISER
      text: "Le français est la langue dans laquelle je pense, j'écris et je rêve.", // À PERSONNALISER
      words: ["brume", "carnet", "étoile"], // À PERSONNALISER
    },
    {
      id: "lang-en",
      name: "Anglais", // À PERSONNALISER
      label: "Anglais", // À PERSONNALISER
      level: "Je la pratique", // À PERSONNALISER
      text: "L'anglais m'ouvre les jeux, les tutoriels et les films en version originale.", // À PERSONNALISER
      words: ["dream", "light", "sound"], // À PERSONNALISER
    },
    {
      id: "lang-es",
      name: "Espagnol", // À PERSONNALISER
      label: "Espagnol", // À PERSONNALISER
      level: "Je l'apprends", // À PERSONNALISER
      text: "L'espagnol est la langue que je suis en train d'apprendre, mot après mot.", // À PERSONNALISER
      words: ["sueño", "mundo", "luz"], // À PERSONNALISER
    },
  ],

  /**
   * Énigme des langues — une seule bonne réponse.
   * `answer` doit être identique à l'un des `choices`.
   */
  languageRiddle: {
    id: "lang-why",
    label: "Pourquoi les langues", // À PERSONNALISER
    prompt: "Pourquoi est-ce que j'apprends une nouvelle langue ?", // À PERSONNALISER
    choices: [
      "Pour voyager sans jamais parler",
      "Pour rencontrer d'autres façons de penser",
      "Parce que c'est une obligation administrative",
      "Pour devenir interprète de conférence",
    ], // À PERSONNALISER
    answer: "Pour rencontrer d'autres façons de penser", // À PERSONNALISER
    text: "Une langue de plus, c'est une manière de plus de voir les gens et les histoires.", // À PERSONNALISER
  },

  /**
   * MON UNIVERS — découvertes dans le monde libre.
   * L'ordre suit les emplacements : rêve, lieu, musique, jeux, création, espagnol.
   * Maximum 8.
   */
  universe: [
    {
      id: "uni-dream",
      icon: "🌙",
      zoneName: "Zone rêveuse",
      label: "Ce qui m'apaise", // À PERSONNALISER
      text: "La nuit, quand tout ralentit, les idées deviennent plus nettes.", // À PERSONNALISER
    },
    {
      id: "uni-place",
      icon: "🪟",
      zoneName: "Zone rêveuse",
      label: "Un lieu imaginaire", // À PERSONNALISER
      text: "J'aime les endroits entre deux lumières : un couloir, une gare tard, une chambre allumée.", // À PERSONNALISER
    },
    {
      id: "uni-music",
      icon: "🎵",
      zoneName: "Zone musicale",
      label: "Le rôle de la musique", // À PERSONNALISER
      text: "La musique est le fil qui relie mes images. Sans elle, le monde me semble plat.", // À PERSONNALISER
    },
    {
      id: "uni-games",
      icon: "🎮",
      zoneName: "Zone jeux vidéo",
      label: "Un univers de jeu", // À PERSONNALISER
      text: "Dans un jeu, j'aime surtout marcher, regarder, et comprendre comment le lieu a été pensé.", // À PERSONNALISER
    },
    {
      id: "uni-create",
      icon: "🎨",
      zoneName: "Zone créative",
      label: "Un projet qui me ressemble", // À PERSONNALISER
      text: "Je voudrais réaliser un court film où le son guide le spectateur plus que les mots.", // À PERSONNALISER
    },
    {
      id: "uni-es",
      icon: "🌎",
      zoneName: "Zone espagnole",
      label: "amor en español", // À PERSONNALISER
      text: "Chaque mot d'espagnol appris est une petite pièce ajoutée à mon univers.", // À PERSONNALISER
    },
  ],
};
