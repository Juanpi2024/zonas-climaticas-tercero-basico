let currentScore = 0;
let currentMission = '';

const hasGsap = () => typeof window.gsap !== 'undefined';

function animateTo(targets, vars) {
    if (hasGsap()) {
        window.gsap.to(targets, vars);
        return;
    }

    const onComplete = vars && vars.onComplete;
    if (vars && vars.display) {
        document.querySelectorAll(Array.isArray(targets) ? targets.join(',') : targets).forEach((el) => {
            el.style.display = vars.display;
        });
    }
    if (typeof onComplete === 'function') {
        onComplete();
    }
}

function animateFrom(targets, vars) {
    if (hasGsap()) {
        window.gsap.from(targets, vars);
    }
}

function animateFromTo(target, fromVars, toVars) {
    if (hasGsap()) {
        window.gsap.fromTo(target, fromVars, toVars);
        return;
    }

    const element = document.querySelector(target);
    if (!element) return;
    element.style.opacity = toVars.opacity ?? 1;
    element.style.transform = `translateY(${toVars.y ?? 0}px)`;
}

const missions = {
    cardinals: {
        title: 'Misión: Puntos Cardinales',
        content: `
            <div class="activity-shell text-center">
                <p class="mb-4">La brújula nos ayuda a orientarnos. Haz clic en el punto <strong>NORTE</strong>.</p>
                <div class="compass-container">
                    <button class="compass-point north" onclick="checkAnswer(true, 'cardinals')">N</button>
                    <button class="compass-point south" onclick="checkAnswer(false, 'cardinals')">S</button>
                    <button class="compass-point east" onclick="checkAnswer(false, 'cardinals')">E</button>
                    <button class="compass-point west" onclick="checkAnswer(false, 'cardinals')">O</button>
                    <div class="needle"></div>
                    <div class="compass-center">🧭</div>
                </div>
                <p class="hint">Pista: en los mapas escolares, el norte suele estar arriba.</p>
            </div>
        `
    },
    lines: {
        title: 'Misión: Líneas de Referencia',
        content: `
            <div class="quiz-container activity-shell">
                <p class="mb-4">¿Cómo se llama la línea imaginaria que divide a la Tierra en Hemisferio Norte y Hemisferio Sur?</p>
                <button class="option-btn" onclick="checkAnswer(false, 'lines')">Meridiano de Greenwich</button>
                <button class="option-btn" onclick="checkAnswer(true, 'lines')">Línea del Ecuador</button>
                <button class="option-btn" onclick="checkAnswer(false, 'lines')">Trópico de Capricornio</button>
            </div>
        `
    },
    continents: {
        title: 'Misión: Continentes y Océanos',
        content: `
            <div class="map-container activity-shell">
                <img src="assets/img/map.png" class="interactive-map" alt="Mapa del Mundo">
                <button class="marker" aria-label="Marcador en América del Norte" style="top: 30%; left: 20%;" onclick="checkAnswer(false, 'continents')"></button>
                <button class="marker" aria-label="Marcador en América del Sur" style="top: 60%; left: 25%;" onclick="checkAnswer(true, 'continents')"></button>
                <button class="marker" aria-label="Marcador en África" style="top: 40%; left: 50%;" onclick="checkAnswer(false, 'continents')"></button>
                <p class="mt-4">Haz clic en el marcador que se encuentra en <strong>América del Sur</strong>.</p>
            </div>
        `
    },
    oceans: {
        title: 'Misión: Océanos del Mundo',
        content: `
            <div class="quiz-container activity-shell">
                <p class="mb-4">Chile mira hacia un gran océano. ¿Cuál es?</p>
                <button class="option-btn" onclick="checkAnswer(true, 'oceans')">Océano Pacífico</button>
                <button class="option-btn" onclick="checkAnswer(false, 'oceans')">Océano Índico</button>
                <button class="option-btn" onclick="checkAnswer(false, 'oceans')">Océano Atlántico</button>
            </div>
        `
    },
    climates: {
        title: 'Misión: Zonas Climáticas',
        content: `
            <div class="quiz-container activity-shell">
                <p class="mb-4">En esta zona los rayos del sol llegan de forma directa y hace mucho calor todo el año. ¿Qué zona es?</p>
                <button class="option-btn" onclick="checkAnswer(false, 'climates')">Zona Fría</button>
                <button class="option-btn" onclick="checkAnswer(false, 'climates')">Zona Templada</button>
                <button class="option-btn" onclick="checkAnswer(true, 'climates')">Zona Cálida</button>
            </div>
        `
    },
    symbols: {
        title: 'Misión: Símbolos del Mapa',
        content: `
            <div class="quiz-container activity-shell">
                <p class="mb-4">En la leyenda de un mapa, ¿qué símbolo usarías para representar una montaña?</p>
                <button class="option-btn" onclick="checkAnswer(false, 'symbols')">Una línea azul ondulada</button>
                <button class="option-btn" onclick="checkAnswer(true, 'symbols')">Un triángulo o dibujo de cerro</button>
                <button class="option-btn" onclick="checkAnswer(false, 'symbols')">Un ancla</button>
            </div>
        `
    },
    final: {
        title: '🚀 Examen Final de Explorador',
        content: `
            <div id="final-quiz" class="quiz-container activity-shell">
                <div id="question-box">
                    <p id="question-text" class="mb-4 question-text"></p>
                    <div id="options-box"></div>
                </div>
            </div>
        `
    }
};

const finalQuestions = [
    {
        q: '¿Qué océanos bañan las costas de América?',
        options: ['Atlántico y Pacífico', 'Índico y Ártico', 'Pacífico e Índico'],
        correct: 0
    },
    {
        q: '¿Para qué sirven las líneas de referencia en los mapas?',
        options: ['Para que se vean bonitos', 'Para ubicar lugares en la Tierra', 'Para saber dónde hay tesoros'],
        correct: 1
    },
    {
        q: 'Si viajas hacia el Polo Sur, ¿en qué zona climática estarás?',
        options: ['Zona Cálida', 'Zona Templada', 'Zona Fría'],
        correct: 2
    },
    {
        q: '¿Cuál es un punto cardinal?',
        options: ['Norte', 'Primavera', 'Mapa'],
        correct: 0
    },
    {
        q: '¿Qué elemento explica el significado de símbolos y colores de un mapa?',
        options: ['La leyenda', 'La portada', 'La nube'],
        correct: 0
    }
];

let finalQuestionIndex = 0;
let missionReturnTimer = null;

function showScreen(screenId) {
    const mainScreen = document.getElementById('main-screen');
    const gameScreen = document.getElementById('game-screen');
    const targetScreen = document.getElementById(screenId);

    if (!mainScreen || !gameScreen || !targetScreen) return;

    clearTimeout(missionReturnTimer);

    animateTo(['#main-screen', '#game-screen'], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        display: 'none',
        onComplete: () => {
            mainScreen.style.display = screenId === 'main-screen' ? 'block' : 'none';
            gameScreen.style.display = screenId === 'game-screen' ? 'block' : 'none';
            targetScreen.style.opacity = '1';
            targetScreen.style.transform = 'translateY(0)';

            animateFromTo(`#${screenId}`, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            if (screenId === 'main-screen') {
                document.getElementById('feedback').innerText = '';
                animateTo('#hero-bg', { scale: 1, duration: 1.5, ease: 'power2.inOut' });
                animateFrom('.mission-card', {
                    opacity: 0,
                    y: 50,
                    rotationX: -15,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            } else {
                animateTo('#hero-bg', { scale: 1.1, duration: 1.5, ease: 'power2.inOut' });
            }
        }
    });
}

function startMission(missionKey) {
    currentMission = missionKey;
    const mission = missions[missionKey];
    if (!mission) return;

    document.getElementById('mission-title').innerText = mission.title;
    document.getElementById('game-content').innerHTML = mission.content;
    document.getElementById('feedback').innerText = '';
    document.getElementById('feedback').style.color = '';

    showScreen('game-screen');

    if (missionKey === 'final') {
        finalQuestionIndex = 0;
        setTimeout(loadFinalQuestion, 0);
    }
}

function loadFinalQuestion() {
    const qData = finalQuestions[finalQuestionIndex];
    const questionText = document.getElementById('question-text');
    const optionsBox = document.getElementById('options-box');

    if (!qData || !questionText || !optionsBox) return;

    questionText.innerText = `${finalQuestionIndex + 1}. ${qData.q}`;
    optionsBox.innerHTML = '';

    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkFinalAnswer(index);
        optionsBox.appendChild(btn);
    });
}

function checkFinalAnswer(selectedIndex) {
    const qData = finalQuestions[finalQuestionIndex];
    const btns = document.querySelectorAll('#options-box .option-btn');

    if (selectedIndex === qData.correct) {
        btns[selectedIndex].classList.add('correct');
        updateScore(50);
        document.getElementById('feedback').innerText = '¡Excelente! Siguiente pregunta...';
        document.getElementById('feedback').style.color = '#047857';

        setTimeout(() => {
            finalQuestionIndex++;
            if (finalQuestionIndex < finalQuestions.length) {
                loadFinalQuestion();
                document.getElementById('feedback').innerText = '';
            } else {
                finishGame();
            }
        }, 1200);
    } else {
        btns[selectedIndex].classList.add('wrong');
        document.getElementById('feedback').innerText = '¡Casi! Inténtalo de nuevo.';
        document.getElementById('feedback').style.color = '#b91c1c';
    }
}

function checkAnswer(isCorrect) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = '¡FANTÁSTICO! Misión cumplida. +20 puntos';
        feedback.style.color = '#047857';
        updateScore(20);
        missionReturnTimer = setTimeout(() => showScreen('main-screen'), 1800);
    } else {
        feedback.innerText = '¡Oh no! Prueba otra vez, tú puedes.';
        feedback.style.color = '#b91c1c';
    }
}

function updateScore(points) {
    currentScore += points;
    document.getElementById('score').innerText = currentScore;

    const scoreEl = document.getElementById('score');
    if (hasGsap()) {
        window.gsap.fromTo(scoreEl, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    }
}

function finishGame() {
    document.getElementById('game-content').innerHTML = `
        <div class="text-center fade-in result-card">
            <h2>🏆 ¡MISIÓN CUMPLIDA!</h2>
            <p>Has completado tu entrenamiento de Explorador Planetario.</p>
            <img src="assets/img/mascot.png" alt="Explorador">
            <div class="score-summary">
                <h3>Puntuación Total: ${currentScore} puntos</h3>
            </div>
            <button class="btn-primary" onclick="location.reload()">Jugar de nuevo</button>
        </div>
    `;
    document.getElementById('feedback').innerText = '';
}

// Initial state
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hero-bg').style.backgroundImage = 'linear-gradient(rgba(219, 234, 254, 0.88), rgba(240, 253, 250, 0.92)), url("assets/img/hero.png")';

    animateFrom('.hero-title', { opacity: 0, y: -50, duration: 1, ease: 'power4.out' });
    animateFrom('.hero-subtitle', { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: 'power3.out' });
    animateFrom('.mission-card', {
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 1,
        delay: 0.5,
        ease: 'expo.out'
    });
});
