/* ==================================================
   CLOCK & DATE LUGAR (TELA DE BLOQUEIO)
================================================== */
function updateClock() {
  const dateTimeEl = document.getElementById('dateTime');
  const dateTodayEl = document.getElementById('dateToday');
  
  if (!dateTimeEl) return;
  
  const now = new Date();
  
  // Format hours and minutes
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  dateTimeEl.textContent = `${hours}:${minutes}`;
  
  // Format date in Portuguese
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  let dateString = now.toLocaleDateString('pt-BR', options);
  
  // Capitalize first letter of each word
  dateString = dateString.replace(/^\w/, c => c.toUpperCase());
  dateTodayEl.textContent = dateString;
}

// Inicializar e rodar o relógio
updateClock();
setInterval(updateClock, 1000);


/* ==================================================
   SWIPE TO UNLOCK (TELA DE BLOQUEIO)
================================================== */
const sliderHandle = document.getElementById('sliderHandle');
const lockScreen = document.getElementById('lockScreen');
const mainApp = document.getElementById('mainApp');

if (sliderHandle) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  
  // Get track width
  const track = sliderHandle.parentElement;
  
  const onStart = (e) => {
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    sliderHandle.style.transition = 'none';
  };
  
  const onMove = (e) => {
    if (!isDragging) return;
    
    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let deltaX = currentX - startX;
    
    // Limits the dragging space inside track
    const maxDrag = track.clientWidth - sliderHandle.clientWidth - 8;
    
    if (deltaX < 0) deltaX = 0;
    if (deltaX > maxDrag) deltaX = maxDrag;
    
    sliderHandle.style.left = `${deltaX}px`;
    
    // Check if swipe unlocked (e.g. 88% of the way)
    if (deltaX >= maxDrag * 0.88) {
      isDragging = false;
      showPasswordScreen();
    }
  };
  
  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    // Slide back if not unlocked
    sliderHandle.style.transition = 'left 0.3s cubic-bezier(0.19, 1, 0.22, 1)';
    sliderHandle.style.left = '0px';
  };
  
  // Mobile touch events
  sliderHandle.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
  
  // Desktop mouse events
  sliderHandle.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

function showPasswordScreen() {
  const sliderContainer = document.getElementById('sliderContainer');
  const passwordContainer = document.getElementById('passwordContainer');
  const passwordInput = document.getElementById('passwordInput');
  
  if (sliderContainer && passwordContainer) {
    sliderContainer.classList.add('hidden');
    passwordContainer.classList.remove('hidden');
    
    if (passwordInput) {
      passwordInput.focus();
      // Adiciona listener de Enter apenas uma vez
      if (!passwordInput.dataset.listenerAdded) {
        passwordInput.dataset.listenerAdded = "true";
        passwordInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            checkPassword();
          }
        });
      }
    }
  }
}

function checkPassword() {
  const passwordInput = document.getElementById('passwordInput');
  const passwordCard = document.querySelector('.password-card');
  const passwordError = document.getElementById('passwordError');
  
  if (!passwordInput) return;
  
  const val = passwordInput.value.trim().toLowerCase();
  
  if (val === 'destino') {
    if (passwordError) passwordError.classList.add('hidden');
    const passwordContainer = document.getElementById('passwordContainer');
    if (passwordContainer) passwordContainer.classList.add('hidden');
    unlockApp();
  } else {
    // Senha incorreta: vibra a caixinha e limpa o input
    if (passwordCard) {
      passwordCard.classList.add('shake');
      if (passwordError) passwordError.classList.remove('hidden');
      passwordInput.value = '';
      passwordInput.focus();
      
      setTimeout(() => {
        passwordCard.classList.remove('shake');
      }, 500);
    }
  }
}

function unlockApp() {
  if (lockScreen && mainApp) {
    lockScreen.classList.add('unlocked');
    mainApp.classList.remove('hidden');
    
    // Welcome Confetti blast!
    triggerConfetti(0.25, {
      spread: 70,
      origin: { y: 0.8 }
    });
    triggerConfetti(0.2, {
      spread: 60,
      decay: 0.91,
      scalar: 0.8
    });
    
    // Start generating background hearts/particles
    startHeartRain();
  }
}


/* ==================================================
   PARTÍCULAS & CORAÇÕES FLUTUANTES
================================================== */
function startHeartRain() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  const emojis = ['☀️', '🧡', '✨', '❤', '🌸', '💖', '🥰'];
  
  setInterval(() => {
    if (document.hidden) return;
    
    const heart = document.createElement('div');
    heart.className = 'love-heart-floating';
    
    // Random icon
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random horizontal position
    heart.style.left = `${Math.random() * 100}vw`;
    // Random vertical starting position
    heart.style.top = `${Math.random() * 20 + 80}vh`; 
    
    // Random animation duration
    const duration = Math.random() * 2 + 2;
    heart.style.animation = `floatHeart ${duration}s ease-out forwards`;
    
    container.appendChild(heart);
    
    // Clear element
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }, 1800);
}


/* ==================================================
   INTERAÇÃO: MODO ROMÂNTICO EXTRA (BRILHO DO CORAÇÃO)
================================================== */
const mangaToggle = document.getElementById('mangaToggle');
const mangaFeedback = document.getElementById('mangaFeedback');

if (mangaToggle) {
  mangaToggle.addEventListener('click', () => {
    mangaToggle.classList.toggle('active');
    document.body.classList.toggle('sleeves-up');
    
    if (mangaToggle.classList.contains('active')) {
      mangaFeedback.classList.remove('hidden');
      
      // Spark golden/rose confetti shower!
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fb7185', '#ec4899', '#fef08a']
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fb7185', '#ec4899', '#fef08a']
      });
    } else {
      mangaFeedback.classList.add('hidden');
    }
  });
}


/* ==================================================
   CARD SINTONIA FINA (REVEAL CARD ON CLICK)
================================================== */
function revealCard(card) {
  card.classList.toggle('flipped');
  
  // Cute sparkle on reveal
  if (card.classList.contains('flipped')) {
    confetti({
      particleCount: 15,
      spread: 30,
      origin: {
        x: card.getBoundingClientRect().left / window.innerWidth + 0.1,
        y: card.getBoundingClientRect().top / window.innerHeight + 0.05
      },
      colors: ['#f43f5e', '#fb7185', '#ec4899']
    });
  }
}


/* ==================================================
   CAIXINHA DE CARINHO INTERATIVA (Compliment box)
================================================== */
const chequeCard = document.getElementById('chequeCard');
const btnSocorro = document.getElementById('btnSocorro');
const gameSuccess = document.getElementById('gameSuccess');
const carinhoMensagem = document.getElementById('carinhoMensagem');

// Sweet compliment statements from Rafael
const CARINHOS = [
  "\"Que tenha uma ótima noite de sono, bons sonhos e o descanso que você tanto merece. Dorme bem! 🌙☀️\"",
  "\"Tenho que confessar, você é muito bonita. Uma daquelas pessoas raras que a gente simplesmente não cansa de admirar! 🫣✨\"",
  "\"É um prazer enorme poder te fazer sorrir. Cada pequeno gesto é sincero e vem do fundo do coração. ☺️🧡\"",
  "\"Sua energia é incrível e transmite uma luz muito especial. É maravilhoso ter você por perto! 🫠✨\"",
  "\"Você tem um jeito muito simpático e uma energia leve, daquelas que acalmam qualquer dia corrido. 🕊️\"",
  "\"Estou sempre na torcida por você e aqui para o que precisar, seja para ouvir, apoiar ou apenas te ver sorrir! 🕊️🧡\"",
  "\"Estou adorando nossa sintonia, a hora passa tão rápido que a gente nem vê! 🥰\""
];

let lastCarinhoIndex = -1;

function getRandomCarinho() {
  let index;
  do {
    index = Math.floor(Math.random() * CARINHOS.length);
  } while (index === lastCarinhoIndex);
  
  lastCarinhoIndex = index;
  return CARINHOS[index];
}

if (chequeCard) {
  // Click on the gift box opens it!
  chequeCard.addEventListener('click', triggerSocorro);
}

function triggerSocorro() {
  if (!chequeCard) return;
  
  // Dynamic scale pop animation on box
  chequeCard.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  chequeCard.style.transform = 'scale(0.85)';
  
  setTimeout(() => {
    chequeCard.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      chequeCard.style.transform = 'scale(1)';
      completeChequeGame();
    }, 150);
  }, 150);
}

function completeChequeGame() {
  if (gameSuccess && carinhoMensagem) {
    // Select a random compliment
    carinhoMensagem.textContent = getRandomCarinho();
    gameSuccess.classList.remove('hidden');
    
    // Soft heart confetti burst
    confetti({
      particleCount: 35,
      spread: 50,
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a']
    });
  }
}


/* ==================================================
   CARROSSEL DO CHAT DE MEMÓRIAS
================================================== */
let currentSlide = 0;
const slides = document.querySelectorAll('.chat-slide');
const dots = document.querySelectorAll('.chat-dots .dot');

function showSlide(index) {
  if (slides.length === 0) return;
  
  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;
  
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
    if (i === currentSlide) {
      slide.classList.add('active');
      dots[i].classList.add('active');
    }
  });
}

function moveSlide(direction) {
  showSlide(currentSlide + direction);
}

function goToSlide(index) {
  showSlide(index);
}

// Auto Slide every 8 seconds
let autoSlideTimer = setInterval(() => {
  moveSlide(1);
}, 8000);

const chatContainer = document.querySelector('.chat-container');
if (chatContainer) {
  chatContainer.addEventListener('click', () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      moveSlide(1);
    }, 8000);
  });
}


/* ==================================================
   CONVITE DO 1% - MODAL & CONFETTI CONTINUO
================================================== */
const inviteModal = document.getElementById('inviteModal');
const modalMessage = document.getElementById('modalMessage');

function acceptInvite(type) {
  if (!inviteModal) return;
  
  if (type === 'romantic') {
    modalMessage.innerHTML = `☀️ <strong>Coração transbordando de carinho!</strong><br><br>Fico muito feliz de ter você por perto e ver como a nossa sintonia é leve e natural. Prometo estar sempre aqui para trazer sorrisos e tornar cada pequeno momento especial ao seu lado! 🧡🍊`;
  } else {
    modalMessage.innerHTML = `🥰 <strong>Coração sorrindo!</strong><br><br>Adoro a nossa sintonia e quero muito continuar dividindo momentos incríveis com você. É maravilhoso ver o seu sorriso e saber que trazemos essa luz tão especial para os momentos de cada um! 🥰✨`;
  }
  
  inviteModal.classList.remove('hidden');
  
  // Continuous heart/gold confetti cascade
  const end = Date.now() + (3.5 * 1000);
  const colors = ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'];
  
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

function closeModal() {
  if (inviteModal) {
    inviteModal.classList.add('hidden');
  }
}

// Helpers for generic confetti triggers
function triggerConfetti(scalarVal, opts) {
  confetti(Object.assign({}, opts, {
    scalar: scalarVal,
    particleCount: 30
  }));
}

/* ==================================================
   INTERAÇÃO: O GIRASSOL DO DIA
================================================== */
function bloomSunflower() {
  const container = document.getElementById('sunflowerContainer');
  const graphic = document.getElementById('sunflowerGraphic');
  const message = document.getElementById('flowerMessage');
  
  if (!container || !graphic || !message) return;
  
  container.classList.toggle('bloomed');
  
  if (container.classList.contains('bloomed')) {
    graphic.textContent = '🌻✨';
    message.classList.remove('hidden');
    
    // Spark gold confetti!
    confetti({
      particleCount: 25,
      spread: 40,
      colors: ['#fbbf24', '#facc15', '#fef08a']
    });
  } else {
    graphic.textContent = '🌻';
    message.classList.add('hidden');
  }
}


