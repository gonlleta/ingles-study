// Datos de la lección organizados por Etapas (Stages)
const courseData = {
    1: {
        vocabulary: [
            { english: "Ubiquitous", spanish: "Omnipresente / Ubicuo" },
            { english: "Ephemeral", spanish: "Efímero" },
            { english: "Pragmatic", spanish: "Pragmático" },
            { english: "Tenacious", spanish: "Tenaz" },
            { english: "Resilient", spanish: "Resiliente" },
            { english: "Ambiguous", spanish: "Ambiguo" },
            { english: "Eloquent", spanish: "Elocuente" },
            { english: "Inevitable", spanish: "Inevitable" }
        ],
        sentences: [
            { english: "It is ubiquitous in modern society", spanish: "Es omnipresente en la sociedad moderna", distractors: ["always", "never"] },
            { english: "Is it ubiquitous in modern society?", spanish: "¿Es omnipresente en la sociedad moderna?", distractors: ["are", "always"] },
            { english: "The joy was completely ephemeral", spanish: "La alegría fue completamente efímera", distractors: ["sadness", "is"] },
            { english: "Did he take a pragmatic approach?", spanish: "¿Tomó él un enfoque pragmático?", distractors: ["does", "taking", "she"] },
            { english: "She remained tenacious despite failures", spanish: "Ella se mantuvo tenaz a pesar de los fracasos", distractors: ["remains", "because"] },
            { english: "Why is the nuance hard to understand?", spanish: "¿Por qué el matiz es difícil de entender?", distractors: ["who", "easy", "for"] }
        ],
        phrasalVerbs: [
            { english: "Bring about", spanish: "Provocar / Causar" },
            { english: "Carry out", spanish: "Llevar a cabo" },
            { english: "Figure out", spanish: "Averiguar / Resolver" }
        ]
    },
    2: {
        vocabulary: [
            { english: "Idiosyncrasy", spanish: "Idiosincrasia" },
            { english: "Paradigm", spanish: "Paradigma" },
            { english: "Meticulous", spanish: "Meticuloso" },
            { english: "Cynical", spanish: "Cínico" },
            { english: "Empathy", spanish: "Empatía" },
            { english: "Nuance", spanish: "Matiz" },
            { english: "Obsolete", spanish: "Obsoleto" },
            { english: "Cognitive", spanish: "Cognitivo" }
        ],
        sentences: [
            { english: "That represents a paradigm shift", spanish: "Eso representa un cambio de paradigma", distractors: ["this", "shifting"] },
            { english: "Does that represent a paradigm shift?", spanish: "¿Eso representa un cambio de paradigma?", distractors: ["do", "this"] },
            { english: "He is a very meticulous person", spanish: "Él es una persona muy meticulosa", distractors: ["was", "people"] },
            { english: "Are older models obsolete now?", spanish: "¿Están obsoletos los modelos antiguos ahora?", distractors: ["is", "newer"] },
            { english: "Empathy is crucial for teamwork", spanish: "La empatía es crucial para el trabajo en equipo", distractors: ["sympathy", "in"] },
            { english: "How important is cognitive development?", spanish: "¿Qué tan importante es el desarrollo cognitivo?", distractors: ["who", "are"] }
        ],
        phrasalVerbs: [
            { english: "Look into", spanish: "Investigar" },
            { english: "Point out", spanish: "Señalar / Indicar" },
            { english: "Rule out", spanish: "Descartar" }
        ]
    },
    3: {
        vocabulary: [
            { english: "Hypothetical", spanish: "Hipotético" },
            { english: "Rhetorical", spanish: "Retórico" },
            { english: "Plausible", spanish: "Plausible" },
            { english: "Feasible", spanish: "Factible" },
            { english: "Conundrum", spanish: "Acertijo / Dilema" },
            { english: "Ambiguity", spanish: "Ambigüedad" },
            { english: "Dichotomy", spanish: "Dicotomía" },
            { english: "Paradox", spanish: "Paradoja" }
        ],
        sentences: [
            { english: "Is this a rhetorical question?", spanish: "¿Es esta una pregunta retórica?", distractors: ["are", "those"] },
            { english: "How can we solve this conundrum?", spanish: "¿Cómo podemos resolver este dilema?", distractors: ["who", "solving"] },
            { english: "Would you consider this a plausible scenario?", spanish: "¿Considerarías este un escenario plausible?", distractors: ["will", "plausibly"] },
            { english: "Why is there such a dichotomy?", spanish: "¿Por qué hay tal dicotomía?", distractors: ["where", "are"] },
            { english: "Could it be a hypothetical situation?", spanish: "¿Podría ser una situación hipotética?", distractors: ["can", "hypothetically"] },
            { english: "The ambiguity makes it a true paradox", spanish: "La ambigüedad lo convierte en una verdadera paradoja", distractors: ["ambiguous", "truly"] }
        ],
        phrasalVerbs: [
            { english: "Boil down to", spanish: "Reducirse a / Resumirse en" },
            { english: "Come up with", spanish: "Idear / Proponer" },
            { english: "Follow up on", spanish: "Hacer seguimiento de" }
        ]
    }
};

// Estado de la aplicación
let currentMode = 'classic';
let currentQuestionIndex = 0;
let lessonQuestions = [];
let correctAnswersCount = 0;
let isAnswerChecked = false;
let currentSentenceWords = [];
let selectedSentenceWords = [];

// Estado persistente con migración por si ya había datos
let savedData = JSON.parse(localStorage.getItem('memriseProgress')) || {};
let userProgress = {
    xp: savedData.xp || 0,
    streak: savedData.streak || 0,
    lessonsCompletedToday: savedData.lessonsCompletedToday !== undefined ? savedData.lessonsCompletedToday : (savedData.lessonsCompleted || 0),
    lessonsCompletedCourse: savedData.lessonsCompletedCourse !== undefined ? savedData.lessonsCompletedCourse : (savedData.lessonsCompleted || 0),
    stage: savedData.stage || 1
};

// Elementos del DOM
const screens = {
    dashboard: document.getElementById('dashboard'),
    learning: document.getElementById('learning-session'),
    summary: document.getElementById('summary-screen')
};

const elements = {
    closeBtn: document.getElementById('close-session-btn'),
    questionLabel: document.getElementById('question-label'),
    targetWord: document.getElementById('target-word'),
    playAudioBtn: document.getElementById('play-audio-btn'),
    optionsGrid: document.getElementById('options-grid'),
    typingContainer: document.getElementById('typing-container'),
    typingInput: document.getElementById('typing-input'),
    checkTypingBtn: document.getElementById('check-typing-btn'),
    sentenceContainer: document.getElementById('sentence-container'),
    sentenceDropzone: document.getElementById('sentence-dropzone'),
    sentenceWords: document.getElementById('sentence-words'),
    speakingContainer: document.getElementById('speaking-container'),
    micBtn: document.getElementById('mic-btn'),
    micStatus: document.getElementById('mic-status'),
    speechResult: document.getElementById('speech-result'),
    sessionProgressFill: document.getElementById('session-progress-fill'),
    sessionFooter: document.getElementById('session-footer'),
    feedbackMessage: document.getElementById('feedback-message'),
    continueBtn: document.getElementById('continue-btn'),
    finishBtn: document.getElementById('finish-btn'),
    scoreText: document.getElementById('score-text'),
    accuracyText: document.getElementById('accuracy-text'),
    correctSound: document.getElementById('correct-sound'),
    wrongSound: document.getElementById('wrong-sound')
};

// --- Ajuste de Volumen ---
elements.correctSound.volume = 0.2;
elements.wrongSound.volume = 0.4;

// --- Progreso y LocalStorage ---
function updateUIStats() {
    const streakCounter = document.getElementById('streak-counter');
    const xpCounter = document.getElementById('xp-counter');
    const courseProgressBar = document.getElementById('course-progress-bar');
    const courseProgressText = document.getElementById('course-progress-text');
    const goalCircles = document.getElementById('goal-circles');
    const goalText = document.getElementById('goal-text');

    if (streakCounter) streakCounter.textContent = userProgress.streak;
    if (xpCounter) xpCounter.textContent = userProgress.xp;

    // Calcular progreso del curso (20% por lección, así se llena en 5 lecciones para la demo)
    let coursePercentage = Math.min(userProgress.lessonsCompletedCourse * 20, 100);
    if (courseProgressBar) courseProgressBar.style.width = `${coursePercentage}%`;
    if (courseProgressText) courseProgressText.textContent = `Etapa ${userProgress.stage} - ${coursePercentage}%`;

    // Calcular objetivo diario (max 3)
    let dailyCompleted = Math.min(userProgress.lessonsCompletedToday, 3);
    if (goalText) goalText.textContent = `${dailyCompleted} / 3 lecciones completadas`;
    
    if (goalCircles) {
        goalCircles.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            if (i <= dailyCompleted) {
                goalCircles.innerHTML += `<div class="circle filled"><i class="fa-solid fa-check"></i></div>`;
            } else {
                goalCircles.innerHTML += `<div class="circle"><i class="fa-solid fa-lock"></i></div>`;
            }
        }
    }
}

function saveProgress() {
    localStorage.setItem('memriseProgress', JSON.stringify(userProgress));
    updateUIStats();
}

document.addEventListener('DOMContentLoaded', updateUIStats);

// Utilidades
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function speakWord(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

// --- RECONOCIMIENTO DE VOZ ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        elements.micBtn.classList.add('listening');
        elements.micStatus.textContent = 'Te estoy escuchando...';
        elements.speechResult.textContent = '';
    };

    recognition.onspeechend = function() {
        recognition.stop();
        elements.micBtn.classList.remove('listening');
        elements.micStatus.textContent = 'Procesando...';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().replace(/[.,!?]/g, '');
        elements.speechResult.textContent = `Dijiste: "${transcript}"`;
        
        const correctWord = lessonQuestions[currentQuestionIndex].english.toLowerCase();
        
        // Es correcto si dijo la palabra exacta o si la frase la contiene claramente
        const isCorrect = transcript.includes(correctWord) || correctWord.includes(transcript);
        
        setTimeout(() => {
            handleAnswer(isCorrect, lessonQuestions[currentQuestionIndex].english, null);
        }, 1000);
    };

    recognition.onerror = function(event) {
        elements.micBtn.classList.remove('listening');
        elements.micStatus.textContent = 'No se pudo escuchar. Intenta de nuevo.';
    };
}

elements.micBtn.addEventListener('click', () => {
    if (isAnswerChecked) return;
    if (!recognition) {
        alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
        return;
    }
    recognition.start();
});

// Lógica de Lección
window.startLesson = function(mode) {
    currentMode = mode;
    
    // Obtener datos de la etapa actual (si no existe, vuelve a la etapa 1)
    const stageData = courseData[userProgress.stage] || courseData[1];
    
    if (mode === 'sentences') {
        lessonQuestions = shuffleArray(stageData.sentences).slice(0, 5);
    } else if (mode === 'phrasal_verbs') {
        // Son 3 por etapa, los cargamos todos al azar (slice a 5 funcionará igual)
        lessonQuestions = shuffleArray(stageData.phrasalVerbs).slice(0, 5);
    } else if (mode === 'speaking' || mode === 'listening' || mode === 'typing' || mode === 'reverse') {
        const combined = [...stageData.vocabulary, ...stageData.sentences];
        lessonQuestions = shuffleArray(combined).slice(0, 5);
    } else {
        lessonQuestions = shuffleArray(stageData.vocabulary).slice(0, 5);
    }
    
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    
    switchScreen('learning');
    loadQuestion();
}

function loadQuestion() {
    isAnswerChecked = false;
    elements.sessionFooter.classList.remove('show', 'correct-state', 'wrong-state');
    
    // Configurar visibilidad de contenedores
    elements.optionsGrid.style.display = 'none';
    elements.typingContainer.style.display = 'none';
    elements.sentenceContainer.style.display = 'none';
    elements.speakingContainer.style.display = 'none';
    elements.playAudioBtn.style.display = 'none';
    elements.targetWord.style.display = 'block';
    
    const progressPercentage = (currentQuestionIndex / lessonQuestions.length) * 100;
    elements.sessionProgressFill.style.width = `${progressPercentage}%`;

    const currentData = lessonQuestions[currentQuestionIndex];

    if (currentMode === 'classic') {
        elements.questionLabel.textContent = "¿Cómo se dice...?";
        elements.targetWord.textContent = currentData.spanish;
        elements.optionsGrid.style.display = 'grid';
        setupMultipleChoice(currentData);
        
    } else if (currentMode === 'listening') {
        elements.questionLabel.textContent = "Escucha e identifica";
        elements.targetWord.style.display = 'none';
        elements.playAudioBtn.style.display = 'flex';
        elements.optionsGrid.style.display = 'grid';
        setupMultipleChoice(currentData);
        speakWord(currentData.english); // Auto-play
        
    } else if (currentMode === 'typing') {
        elements.questionLabel.textContent = "Escribe la traducción";
        elements.targetWord.textContent = currentData.spanish;
        elements.typingContainer.style.display = 'flex';
        elements.typingInput.value = '';
        elements.typingInput.readOnly = false;
        elements.typingInput.classList.remove('wrong', 'correct');
        elements.typingInput.focus();
        
    } else if (currentMode === 'sentences') {
        elements.questionLabel.textContent = "Ordena la frase";
        elements.targetWord.textContent = currentData.spanish;
        elements.sentenceContainer.style.display = 'flex';
        setupSentenceBuilding(currentData);
        
    } else if (currentMode === 'speaking') {
        elements.questionLabel.textContent = "Pronuncia esto:";
        elements.targetWord.textContent = currentData.english;
        elements.speakingContainer.style.display = 'flex';
        elements.speechResult.textContent = '';
        elements.micStatus.textContent = 'Haz clic en el micrófono y habla';
        elements.micBtn.classList.remove('listening');
        
    } else if (currentMode === 'reverse') {
        elements.questionLabel.textContent = "Traduce al español";
        elements.targetWord.textContent = currentData.english;
        elements.optionsGrid.style.display = 'grid';
        setupReverseMultipleChoice(currentData);
        
    } else if (currentMode === 'phrasal_verbs') {
        elements.questionLabel.textContent = "¿Qué significa este Phrasal Verb?";
        elements.targetWord.textContent = currentData.english;
        elements.optionsGrid.style.display = 'grid';
        setupReverseMultipleChoice(currentData);
    }
}

function setupMultipleChoice(currentData) {
    let options = [currentData.english];
    const stageData = courseData[userProgress.stage] || courseData[1];
    
    // Check if it is a sentence
    const isSentence = stageData.sentences.some(s => s.english === currentData.english);
    const pool = isSentence ? stageData.sentences : stageData.vocabulary;
    
    const otherOptions = pool.filter(w => w.english !== currentData.english);
    const shuffledOthers = shuffleArray(otherOptions);
    
    for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
        options.push(shuffledOthers[i].english);
    }
    
    // Fallback if not enough options in the current pool
    if (options.length < 4) {
        const fallbackPool = isSentence ? stageData.vocabulary : stageData.sentences;
        const shuffledFallback = shuffleArray(fallbackPool);
        for (let i = 0; options.length < 4 && i < shuffledFallback.length; i++) {
            options.push(shuffledFallback[i].english);
        }
    }
    
    options = shuffleArray(options);

    elements.optionsGrid.innerHTML = '';
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${option}</span>`;
        btn.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        btn.style.opacity = '0';
        btn.addEventListener('click', () => handleAnswer(option === currentData.english, currentData.english, btn));
        elements.optionsGrid.appendChild(btn);
    });
}

function setupReverseMultipleChoice(currentData) {
    let options = [currentData.spanish];
    const stageData = courseData[userProgress.stage] || courseData[1];
    
    // Identificamos de dónde viene el currentData
    const isSentence = stageData.sentences.some(s => s.english === currentData.english);
    const isPhrasal = stageData.phrasalVerbs && stageData.phrasalVerbs.some(p => p.english === currentData.english);
    
    let pool = stageData.vocabulary;
    if (isSentence) pool = stageData.sentences;
    else if (isPhrasal) pool = stageData.phrasalVerbs;
    
    const otherOptions = pool.filter(w => w.english !== currentData.english);
    const shuffledOthers = shuffleArray(otherOptions);
    
    for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
        options.push(shuffledOthers[i].spanish);
    }
    
    // Fallback: Si no hay suficientes distractores en la pool (ej: phrasal verbs solo tiene 3 en total, faltaría 1 distractor para hacer 4 opciones)
    if (options.length < 4) {
        const fallbackPool = stageData.vocabulary; // usar el vocabulario base como fallback para rellenar
        const shuffledFallback = shuffleArray(fallbackPool);
        for (let i = 0; options.length < 4 && i < shuffledFallback.length; i++) {
            // Asegurarse de no añadir duplicados por error
            if (!options.includes(shuffledFallback[i].spanish)) {
                options.push(shuffledFallback[i].spanish);
            }
        }
    }
    
    options = shuffleArray(options);

    elements.optionsGrid.innerHTML = '';
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${option}</span>`;
        btn.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        btn.style.opacity = '0';
        // En reversa, mostramos el correcto en español pero pronunciamos en inglés
        btn.addEventListener('click', () => handleAnswer(option === currentData.spanish, currentData.spanish, btn, currentData.english));
        elements.optionsGrid.appendChild(btn);
    });
}

function setupSentenceBuilding(currentSentence) {
    elements.sentenceDropzone.innerHTML = '';
    elements.sentenceWords.innerHTML = '';
    selectedSentenceWords = [];
    elements.sentenceDropzone.classList.remove('filled');
    
    currentSentenceWords = currentSentence.english.split(' ');
    
    // Palabras correctas + palabras distractoras (extras)
    let wordsToDisplay = [...currentSentenceWords];
    if (currentSentence.distractors) {
        wordsToDisplay = wordsToDisplay.concat(currentSentence.distractors);
    }
    
    let shuffledWords = shuffleArray(wordsToDisplay);
    
    shuffledWords.forEach((word, index) => {
        const pill = document.createElement('div');
        pill.className = 'word-pill';
        pill.textContent = word;
        pill.dataset.word = word;
        pill.dataset.index = index;
        
        pill.addEventListener('click', () => {
            if (isAnswerChecked || pill.classList.contains('used')) return;
            
            pill.classList.add('used');
            
            const dropPill = document.createElement('div');
            dropPill.className = 'word-pill';
            dropPill.textContent = word;
            dropPill.addEventListener('click', () => {
                if (isAnswerChecked) return;
                dropPill.remove();
                pill.classList.remove('used');
                selectedSentenceWords = selectedSentenceWords.filter(w => w !== word);
            });
            
            elements.sentenceDropzone.appendChild(dropPill);
            selectedSentenceWords.push(word);
            
            // Validar automáticamente al llegar al número de palabras que conforman la frase original
            if (selectedSentenceWords.length === currentSentenceWords.length) {
                checkSentenceCompletion(currentSentence.english);
            }
        });
        
        elements.sentenceWords.appendChild(pill);
    });
}

function checkSentenceCompletion(correctSentence) {
    const userSentence = selectedSentenceWords.join(' ');
    handleAnswer(userSentence === correctSentence, correctSentence, null);
}

elements.checkTypingBtn.addEventListener('click', () => {
    if (currentMode !== 'typing' || isAnswerChecked) return;
    const userInput = elements.typingInput.value.trim().toLowerCase();
    const correctWord = lessonQuestions[currentQuestionIndex].english.toLowerCase();
    
    const isCorrect = userInput === correctWord;
    handleAnswer(isCorrect, lessonQuestions[currentQuestionIndex].english, null);
});

elements.typingInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.checkTypingBtn.click();
    }
});

function handleAnswer(isCorrect, correctAnswerText, buttonElement, wordToSpeak = null) {
    if (isAnswerChecked) return;
    isAnswerChecked = true;

    // Deshabilitar interacción
    if (currentMode === 'classic' || currentMode === 'listening' || currentMode === 'reverse' || currentMode === 'phrasal_verbs') {
        document.querySelectorAll('.option-btn').forEach(btn => btn.style.pointerEvents = 'none');
    } else if (currentMode === 'typing') {
        elements.typingInput.readOnly = true;
    } else if (currentMode === 'sentences') {
        elements.sentenceDropzone.classList.add('filled');
    } else if (currentMode === 'speaking') {
        elements.micBtn.classList.remove('listening');
    }

    elements.sessionFooter.classList.add('show');
    speakWord(wordToSpeak || correctAnswerText);

    if (isCorrect) {
        if (buttonElement) buttonElement.classList.add('correct');
        if (currentMode === 'typing') elements.typingInput.classList.add('correct');
        
        elements.sessionFooter.classList.add('correct-state');
        elements.feedbackMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Excelente!';
        elements.continueBtn.textContent = 'Continuar';
        elements.correctSound.play().catch(e => console.log('Audio error:', e));
        correctAnswersCount++;
    } else {
        if (buttonElement) buttonElement.classList.add('wrong');
        if (currentMode === 'typing') elements.typingInput.classList.add('wrong');
        
        if (currentMode === 'classic' || currentMode === 'listening' || currentMode === 'reverse' || currentMode === 'phrasal_verbs') {
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.textContent === correctAnswerText) {
                    btn.classList.add('correct');
                    btn.style.borderStyle = 'dashed';
                }
            });
        }

        elements.sessionFooter.classList.add('wrong-state');
        elements.feedbackMessage.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Correcto: ${correctAnswerText}`;
        elements.continueBtn.textContent = 'Entendido';
        elements.wrongSound.play().catch(e => console.log('Audio error:', e));
    }
}

elements.playAudioBtn.addEventListener('click', () => {
    const currentData = lessonQuestions[currentQuestionIndex];
    speakWord(currentData.english);
});

function nextStep() {
    currentQuestionIndex++;
    if (currentQuestionIndex < lessonQuestions.length) {
        loadQuestion();
    } else {
        showSummary();
    }
}

function showSummary() {
    elements.sessionProgressFill.style.width = '100%';
    
    setTimeout(() => {
        switchScreen('summary');
        
        const xpEarned = correctAnswersCount * 10;
        const accuracy = Math.round((correctAnswersCount / lessonQuestions.length) * 100);
        
        elements.scoreText.textContent = `+${xpEarned} XP`;
        elements.accuracyText.textContent = `${accuracy}% Precisión`;
        
        // Update persistent stats
        userProgress.xp += xpEarned;
        userProgress.lessonsCompletedToday += 1;
        userProgress.lessonsCompletedCourse += 1;
        
        // Lógica de avance de Etapa (100% = 5 lecciones para que sea rápido de probar)
        if (userProgress.lessonsCompletedCourse * 20 >= 100) {
            userProgress.stage++;
            userProgress.lessonsCompletedCourse = 0; // Reinicia la barra
            
            // Si supera las etapas que existen, vuelve a la 1 para este demo
            if (!courseData[userProgress.stage]) {
                userProgress.stage = 1;
            }
        }
        
        if (userProgress.streak === 0) userProgress.streak = 1;
        saveProgress();
        
    }, 500);
}

// Event Listeners
elements.closeBtn.addEventListener('click', () => switchScreen('dashboard'));
elements.continueBtn.addEventListener('click', nextStep);
elements.finishBtn.addEventListener('click', () => switchScreen('dashboard'));

document.addEventListener('click', () => {
    elements.correctSound.load();
    elements.wrongSound.load();
}, { once: true });
