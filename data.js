export const vocabData = [
  { word: "ubiquitous", pronunciation: "/juˈbɪk.wə.t̬əs/", definition: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in daily life." },
  { word: "ephemeral", pronunciation: "/ɪˈfem.ɚ.əl/", definition: "Lasting for a very short time.", example: "Fashions are ephemeral and change every season." },
  { word: "sycophant", pronunciation: "/ˈsɪk.ə.fənt/", definition: "A person who acts obsequiously toward someone important in order to gain advantage.", example: "The CEO was surrounded by sycophants who never disagreed with him." },
  { word: "obfuscate", pronunciation: "/ˈɑːb.fə.skeɪt/", definition: "Render obscure, unclear, or unintelligible.", example: "Politicians often obfuscate the truth when asked direct questions." },
  { word: "pernicious", pronunciation: "/pɚˈnɪʃ.əs/", definition: "Having a harmful effect, especially in a gradual or subtle way.", example: "The pernicious influences of mass media on teenagers." },
  { word: "fastidious", pronunciation: "/fæˈstɪd.i.əs/", definition: "Very attentive to and concerned about accuracy and detail.", example: "She was very fastidious about how her coffee was prepared." },
  { word: "esoteric", pronunciation: "/ˌes.əˈter.ɪk/", definition: "Intended for or likely to be understood by only a small number of people with a specialized knowledge.", example: "They were having an esoteric discussion about quantum physics." }
];

export const idiomsData = [
  { scenario: "You want to say that someone revealed a secret by mistake.", options: ["Let the cat out of the bag", "Bark up the wrong tree", "Bite the bullet", "Plead the Fifth"], correct: 0 },
  { scenario: "You refuse to answer a question, typically because it might incriminate you or get you in trouble.", options: ["Throw under the bus", "Plead the Fifth", "Touch base", "Shoot the breeze"], correct: 1 },
  { scenario: "You want to tell someone to stop avoiding the main topic and speak directly.", options: ["Hit the nail on the head", "Cut corners", "Beat around the bush", "Play hardball"], correct: 2 },
  { scenario: "To have a casual conversation about unimportant things.", options: ["Hit the sack", "Shoot the breeze", "Jump on the bandwagon", "Pull someone's leg"], correct: 1 },
  { scenario: "To unfairly blame someone else in order to save yourself.", options: ["Bite the bullet", "Throw someone under the bus", "Jump the gun", "Spill the beans"], correct: 1 }
];

export const grammarData = [
  { sentence: "Hardly ______ when the severe thunderstorm started.", options: ["had we arrived", "we had arrived", "we arrived", "did we arrive"], correct: 0, explanation: "After 'hardly' at the beginning of a sentence, we use inverted word order (auxiliary verb before the subject)." },
  { sentence: "If she had known you were coming, she ______ you up from the airport.", options: ["would pick", "will pick", "would have picked", "picked"], correct: 2, explanation: "This is a Third Conditional sentence describing an unreal situation in the past." },
  { sentence: "Not until I saw the paperwork ______ what had actually happened.", options: ["did I realize", "I realized", "I had realized", "I did realize"], correct: 0, explanation: "Inversion is required after 'Not until' placed at the beginning of the sentence." },
  { sentence: "The new highway ______ completed by next fall.", options: ["will be", "will have been", "has been", "is being"], correct: 1, explanation: "Future perfect passive is used to describe an action that will be completed before a certain time in the future." },
  { sentence: "So intense ______ that he had to look away immediately.", options: ["was the light", "the light was", "is the light", "the light is"], correct: 0, explanation: "Inversion is used after 'so + adjective' at the beginning of a clause for emphasis." }
];

export const writingData = [
  { 
    scenario: "Write a formal email declining a job offer. Use advanced vocabulary and maintain a polite but firm tone.", 
    keywords: ["appreciate", "opportunity", "decided", "alignment", "thank you", "career path"]
  },
  { 
    scenario: "Provide a brief argument about the impact of artificial intelligence on modern education. Aim for 30-50 words.", 
    keywords: ["furthermore", "consequently", "inevitable", "unprecedented", "transform", "impact"]
  }
];

export const speakingData = [
  { phrase: "The ubiquitous sycophant obfuscated the ephemeral truth.", explanation: "Focus on the short 'u' in ubiquitous and the soft 'th' in truth." },
  { phrase: "She was incredibly fastidious about the esoteric details of the project.", explanation: "Watch out for the stress on the second syllable of fastidious (fa-STID-i-ous)." },
  { phrase: "It was a blessing in disguise that they decided to plead the Fifth.", explanation: "Practice sounding natural without pausing between idioms." },
  { phrase: "I would appreciate the opportunity, but I have chosen a different career path.", explanation: "Focus on clear enunciation of 'appreciate' and 'opportunity'." }
];
