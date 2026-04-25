import { vocabData, idiomsData, grammarData, writingData, speakingData } from './data.js';

// ---- Storage & Gamification ----
let xpScore = parseInt(localStorage.getItem('elevate_xp') || '0');
const elXpCounter = document.getElementById('xp-counter');

function addXp(amount) {
  xpScore += amount;
  localStorage.setItem('elevate_xp', xpScore);
  elXpCounter.textContent = `⭐ ${xpScore} XP`;
  
  // Animation
  elXpCounter.parentElement.style.transform = 'scale(1.1)';
  setTimeout(() => elXpCounter.parentElement.style.transform = 'scale(1)', 200);
}
// Init XP
elXpCounter.textContent = `⭐ ${xpScore} XP`;

// ---- Theme Manager ----
const themeBtn = document.getElementById('theme-btn');
let isLight = localStorage.getItem('elevate_theme') === 'light';

function applyTheme() {
  if(isLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '☀️';
  }
}
applyTheme();

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  localStorage.setItem('elevate_theme', isLight ? 'light' : 'dark');
  applyTheme();
});

// ---- Navigation Logic ----
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(btn.getAttribute('data-target')).classList.add('active');
  });
});

// ---- Vocabulary with Spaced Repetition ----
let currentVocabIndex = 0;
const flashcard = document.getElementById('vocab-flashcard');
const btnFlip = document.getElementById('vocab-flip-btn');
const btnStudyAgain = document.getElementById('btn-study-again');
const btnGotIt = document.getElementById('btn-got-it');

// Audio
const btnAudio = document.getElementById('btn-audio');

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Delay ensures voices are loaded in some browsers
    const voices = window.speechSynthesis.getVoices();
    // Enforce strictly American English voices
    const usVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Microsoft'))) || voices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
    if(usVoice) utterance.voice = usVoice;
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser doesn't support text to speech!");
  }
}

// Ensure voices are loaded (Chrome quirk)
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// Elements
const elFcWord = document.getElementById('fc-word');
const elFcPron = document.getElementById('fc-pronunciation');
const elFcDef = document.getElementById('fc-definition');
const elFcEx = document.getElementById('fc-example');

function loadVocabCard() {
  const data = vocabData[currentVocabIndex];
  elFcWord.textContent = data.word;
  elFcPron.textContent = data.pronunciation;
  elFcDef.textContent = data.definition;
  elFcEx.textContent = `"${data.example}"`;
  flashcard.classList.remove('is-flipped');
}

btnFlip.addEventListener('click', () => {
  flashcard.classList.add('is-flipped');
});

flashcard.addEventListener('click', (e) => {
  // Prevent flipping if they clicked the Audio button inside the flashcard
  if(e.target.closest('#btn-audio')) return;
  flashcard.classList.toggle('is-flipped');
});

btnAudio.addEventListener('click', (e) => {
  e.stopPropagation();
  speak(vocabData[currentVocabIndex].word);
});

function nextCard() {
  flashcard.classList.remove('is-flipped');
  setTimeout(() => {
    currentVocabIndex = (currentVocabIndex + 1) % vocabData.length;
    loadVocabCard();
  }, 400); // Wait for un-flip animation
}

btnStudyAgain.addEventListener('click', (e) => {
  e.stopPropagation();
  // We mock the Spaced Repetition array here
  const weakWords = JSON.parse(localStorage.getItem('weakWords') || '[]');
  const word = vocabData[currentVocabIndex].word;
  if(!weakWords.includes(word)) {
    weakWords.push(word);
    localStorage.setItem('weakWords', JSON.stringify(weakWords));
  }
  nextCard();
});

btnGotIt.addEventListener('click', (e) => {
  e.stopPropagation();
  addXp(10);
  nextCard();
});

// Initialize Vocab
loadVocabCard();

// ---- Quiz Engine (Reusable) ----
function setupQuiz(dataArray, prefix) {
  let currentIndex = 0;
  
  const elQuestion = document.getElementById(`${prefix}-question`);
  const elOptions = document.getElementById(`${prefix}-options`);
  const elFeedback = document.getElementById(`${prefix}-feedback`);
  const btnNext = document.getElementById(`${prefix}-next-btn`);
  const elProgress = document.getElementById(`${prefix}-progress`);
  
  function loadQuestion(index) {
    if (index >= dataArray.length) {
      elQuestion.innerHTML = `🌟 Outstanding! You completed this challenge.`;
      elOptions.innerHTML = '';
      elFeedback.textContent = '';
      btnNext.style.display = 'none';
      elProgress.textContent = '';
      return;
    }
    
    const data = dataArray[index];
    elQuestion.textContent = data.scenario || data.sentence;
    elOptions.innerHTML = '';
    elFeedback.textContent = '';
    btnNext.style.display = 'none';
    elProgress.textContent = `${index + 1} / ${dataArray.length}`;
    
    data.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = optText;
      btn.onclick = () => handleAnswer(btn, i, data);
      elOptions.appendChild(btn);
    });
  }
  
  function handleAnswer(btn, selectedIndex, data) {
    Array.from(elOptions.children).forEach(b => b.disabled = true);
    
    if (selectedIndex === data.correct) {
      btn.classList.add('correct');
      addXp(10);
      if(data.explanation) elFeedback.innerHTML = `<strong>Correct!</strong> ${data.explanation}`;
      else elFeedback.innerHTML = `<strong>Spot on! (+10 XP)</strong>`;
    } else {
      btn.classList.add('wrong');
      elOptions.children[data.correct].classList.add('correct');
      if(data.explanation) elFeedback.innerHTML = `<strong>Incorrect.</strong> ${data.explanation}`;
      else elFeedback.innerHTML = `<strong>Not quite.</strong> The correct answer was: <em>${data.options[data.correct]}</em>`;
    }
    btnNext.style.display = 'inline-block';
  }
  
  btnNext.addEventListener('click', () => {
    currentIndex++;
    loadQuestion(currentIndex);
  });
  
  loadQuestion(0);
}

setupQuiz(idiomsData, 'idioms');
setupQuiz(grammarData, 'grammar');

// ---- AI Writing Challenge Simulation ----
let currentWritingIndex = 0;
const elWritingPrompt = document.getElementById('writing-prompt');
const elWritingInput = document.getElementById('writing-input');
const elWritingWordCount = document.getElementById('writing-word-count');
const btnWritingSubmit = document.getElementById('writing-submit');
const elAiLoading = document.getElementById('ai-loading');
const elAiFeedback = document.getElementById('ai-feedback');

function loadWritingPrompt() {
  const data = writingData[currentWritingIndex];
  elWritingPrompt.textContent = data.scenario;
  elWritingInput.value = '';
  elWritingWordCount.textContent = 'Words: 0';
  elAiFeedback.style.display = 'none';
  elWritingInput.disabled = false;
  btnWritingSubmit.style.display = 'block';
}

elWritingInput.addEventListener('input', () => {
  const text = elWritingInput.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  elWritingWordCount.textContent = `Words: ${words}`;
});

btnWritingSubmit.addEventListener('click', () => {
  const text = elWritingInput.value.trim();
  if(!text) return;
  
  // Disable input & show loading animation
  elWritingInput.disabled = true;
  btnWritingSubmit.style.display = 'none';
  elAiLoading.style.display = 'flex';
  
  // Simulate AI latency (fake API call delay)
  setTimeout(() => {
    elAiLoading.style.display = 'none';
    elAiFeedback.style.display = 'block';
    
    // Simple mock AI validation logic
    const words = text.split(/\s+/).length;
    const data = writingData[currentWritingIndex];
    let usedKeywords = 0;
    data.keywords.forEach(kw => {
      if(text.toLowerCase().includes(kw)) usedKeywords++;
    });
    
    if (words < 10) {
      elAiFeedback.innerHTML = `
        <h4 style="color:var(--warning);">Needs Expansion</h4>
        <p>Your response is a bit too short (${words} words). A C1-level response requires more elaboration.</p>
        <button class="btn-primary" onclick="window.retryWriting()" style="margin-top:1rem; background:var(--warning);">Try Again</button>
      `;
      // We don't add class directly so we use style override for simple warning button
    } else {
      addXp(50);
      elAiFeedback.innerHTML = `
        <h4 style="color:var(--success);">C1 Level Achieved! (+50 XP)</h4>
        <p>Excellent structure. You wrote ${words} words and naturally incorporated ${usedKeywords} advanced thematic keywords.</p>
        <button class="btn-primary" onclick="window.nextWriting()" style="margin-top:1rem;">Next Prompt</button>
      `;
    }
  }, 2200); // 2.2 second fake AI thinking
});

window.retryWriting = () => {
  elAiFeedback.style.display = 'none';
  elWritingInput.disabled = false;
  btnWritingSubmit.style.display = 'block';
};

window.nextWriting = () => {
  currentWritingIndex = (currentWritingIndex + 1) % writingData.length;
  loadWritingPrompt();
};

loadWritingPrompt();

// ---- Speaking (Pronunciation Check) ----
let currentSpeakingIndex = 0;
const elSpeakingPrompt = document.getElementById('speaking-prompt');
const btnMic = document.getElementById('btn-mic');
const elMicStatus = document.getElementById('mic-status');
const elTranscriptText = document.getElementById('transcript-text');
const elSpeakingFeedback = document.getElementById('speaking-feedback');
const btnSpeakingNext = document.getElementById('speaking-next-btn');

function loadSpeakingPrompt() {
  const data = speakingData[currentSpeakingIndex];
  elSpeakingPrompt.innerHTML = `"${data.phrase}"<br><span style="font-size:0.95rem; font-weight:400; color:var(--text-secondary); display:block; margin-top:15px;">💡 Hint: ${data.explanation}</span>`;
  elTranscriptText.innerHTML = `<span style="color:var(--text-secondary); font-style:italic;">Your transcribed voice will appear here...</span>`;
  elSpeakingFeedback.style.display = 'none';
  btnSpeakingNext.style.display = 'none';
  elMicStatus.textContent = 'Click the microphone to start.';
  btnMic.style.display = 'flex';
}

function normalizeStr(str) {
  return str.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
}

function calculateAccuracy(original, transcript) {
  const origWords = normalizeStr(original).split(" ");
  const transWords = normalizeStr(transcript).split(" ");
  let matches = 0;
  
  transWords.forEach(tw => {
    if(origWords.includes(tw)) matches++;
  });
  
  return transWords.length === 0 ? 0 : matches / origWords.length;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; // Strict American English
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  btnMic.addEventListener('click', () => {
    try {
      recognition.start();
      btnMic.classList.add('listening');
      elMicStatus.textContent = 'Listening... Speak clearly now.';
      elMicStatus.style.color = 'var(--danger)';
    } catch(e) {
      console.error(e);
      // Already started
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const targetPhrase = speakingData[currentSpeakingIndex].phrase;
    
    // UI Update
    elTranscriptText.innerHTML = `"${transcript}"`;
    
    // Evaluate
    const accuracy = calculateAccuracy(targetPhrase, transcript);
    elSpeakingFeedback.style.display = 'block';
    
    if (accuracy >= 0.70) {
      addXp(20);
      elSpeakingFeedback.innerHTML = `
        <h4 style="color:var(--success);">Nailed it! (+20 XP)</h4>
        <p>Your pronunciation was clear and accurate enough (${Math.round(accuracy*100)}% word match).</p>
      `;
      btnSpeakingNext.style.display = 'inline-block';
      btnMic.style.display = 'none';
    } else {
      elSpeakingFeedback.innerHTML = `
        <h4 style="color:var(--warning);">Try again</h4>
        <p>The system heard: <em>${transcript}</em>. Try to speak clearer or slightly slower.</p>
      `;
    }
  };

  recognition.onspeechend = () => {
    recognition.stop();
    btnMic.classList.remove('listening');
    elMicStatus.textContent = 'Processing...';
    elMicStatus.style.color = 'var(--text-secondary)';
  };

  recognition.onerror = (event) => {
    btnMic.classList.remove('listening');
    elMicStatus.textContent = 'Error: ' + event.error + '. Ensure you allowed microphone permissions.';
    elMicStatus.style.color = 'var(--danger)';
  };
} else {
  elMicStatus.textContent = 'Oops! Your browser does not support Speech Recognition. Try Google Chrome.';
  btnMic.style.opacity = '0.5';
  btnMic.disabled = true;
}

btnSpeakingNext.addEventListener('click', () => {
  currentSpeakingIndex = (currentSpeakingIndex + 1) % speakingData.length;
  loadSpeakingPrompt();
});

loadSpeakingPrompt();
