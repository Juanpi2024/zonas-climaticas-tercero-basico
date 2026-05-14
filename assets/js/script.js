let currentScore = 0;
let currentMission = '';

const missions = {
    cardinals: {
        title: 'Misión: Puntos Cardinales',
        content: `
            <div class="text-center">
                <p class="mb-4">¿Hacia dónde apunta la brújula? Haz clic en el punto <strong>NORTE</strong>.</p>
                <div class="compass-container" style="position: relative; width: 300px; height: 300px; margin: 0 auto; background: var(--glass); border-radius: 50%; border: 4px solid var(--primary);">
                    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); cursor: pointer;" onclick="checkAnswer(true, 'cardinals')">N</div>
                    <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); cursor: pointer;" onclick="checkAnswer(false, 'cardinals')">S</div>
                    <div style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;" onclick="checkAnswer(false, 'cardinals')">E</div>
                    <div style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;" onclick="checkAnswer(false, 'cardinals')">O</div>
                    <div class="needle" style="position: absolute; top: 50%; left: 50%; width: 4px; height: 100px; background: red; transform: translate(-50%, -100%);"></div>
                </div>
            </div>
        `
    },
    lines: {
        title: 'Misión: Líneas de Referencia',
        content: `
            <div class="quiz-container">
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
            <div class="map-container">
                <img src="assets/img/map.png" class="interactive-map" alt="Mapa del Mundo">
                <div class="marker" style="top: 30%; left: 20%;" onclick="checkAnswer(false, 'continents')"></div>
                <div class="marker" style="top: 60%; left: 25%;" onclick="checkAnswer(true, 'continents')"></div>
                <div class="marker" style="top: 40%; left: 50%;" onclick="checkAnswer(false, 'continents')"></div>
                <p class="mt-4">Haz clic en el marcador que se encuentra en <strong>América del Sur</strong>.</p>
            </div>
        `
    },
    climates: {
        title: 'Misión: Zonas Climáticas',
        content: `
            <div class="quiz-container">
                <p class="mb-4">En esta zona los rayos del sol llegan de forma directa y hace mucho calor todo el año. ¿Qué zona es?</p>
                <button class="option-btn" onclick="checkAnswer(false, 'climates')">Zona Fría</button>
                <button class="option-btn" onclick="checkAnswer(false, 'climates')">Zona Templada</button>
                <button class="option-btn" onclick="checkAnswer(true, 'climates')">Zona Cálida</button>
            </div>
        `
    },
    final: {
        title: '🚀 EXAMEN FINAL DE EXPLORADOR',
        content: `
            <div id="final-quiz" class="quiz-container">
                <div id="question-box">
                    <p id="question-text" class="mb-4" style="font-size: 1.25rem; font-weight: 800;"></p>
                    <div id="options-box"></div>
                </div>
            </div>
        `
    }
};

const finalQuestions = [
    {
        q: "¿Qué océanos bañan las costas de América?",
        options: ["Atlántico y Pacífico", "Índico y Ártico", "Pacífico e Índico"],
        correct: 0
    },
    {
        q: "¿Para qué sirven las líneas de referencia en los mapas?",
        options: ["Para que se vean bonitos", "Para ubicar cualquier punto en la Tierra", "Para saber dónde hay tesoros"],
        correct: 1
    },
    {
        q: "Si viajas hacia el Polo Sur, ¿en qué zona climática estarás?",
        options: ["Zona Cálida", "Zona Templada", "Zona Fría"],
        correct: 2
    }
];

let finalQuestionIndex = 0;

function showScreen(screenId) {
    const mainScreen = document.getElementById('main-screen');
    const gameScreen = document.getElementById('game-screen');
    const targetScreen = document.getElementById(screenId);

    // GSAP Transition
    gsap.to(['#main-screen', '#game-screen'], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        display: 'none',
        onComplete: () => {
            targetScreen.style.display = 'block';
            gsap.fromTo(targetScreen, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );

            if (screenId === 'main-screen') {
                gsap.to('#hero-bg', { scale: 1, duration: 1.5, ease: "power2.inOut" });
                // Stagger cards entrance
                gsap.from('.mission-card', {
                    opacity: 0,
                    y: 50,
                    rotationX: -15,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to('#hero-bg', { scale: 1.1, duration: 1.5, ease: "power2.inOut" });
            }
        }
    });
}

function startMission(missionKey) {
    currentMission = missionKey;
    const mission = missions[missionKey];
    document.getElementById('mission-title').innerText = mission.title;
    document.getElementById('game-content').innerHTML = mission.content;
    document.getElementById('feedback').innerText = '';
    
    if (missionKey === 'final') {
        finalQuestionIndex = 0;
        loadFinalQuestion();
    }
    
    showScreen('game-screen');
}

function loadFinalQuestion() {
    const qData = finalQuestions[finalQuestionIndex];
    document.getElementById('question-text').innerText = qData.q;
    const optionsBox = document.getElementById('options-box');
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
        document.getElementById('feedback').style.color = '#10b981'; // accent color
        
        setTimeout(() => {
            finalQuestionIndex++;
            if (finalQuestionIndex < finalQuestions.length) {
                loadFinalQuestion();
                document.getElementById('feedback').innerText = '';
            } else {
                finishGame();
            }
        }, 1500);
    } else {
        btns[selectedIndex].classList.add('wrong');
        document.getElementById('feedback').innerText = '¡Casi! Inténtalo de nuevo.';
        document.getElementById('feedback').style.color = '#ef4444';
    }
}

function checkAnswer(isCorrect, type) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = '¡FANTÁSTICO! Misión cumplida. +20 puntos';
        feedback.style.color = '#10b981'; // accent color
        updateScore(20);
        setTimeout(() => showScreen('main-screen'), 2000);
    } else {
        feedback.innerText = '¡Oh no! Prueba otra vez, tú puedes.';
        feedback.style.color = '#ef4444';
    }
}

function updateScore(points) {
    currentScore += points;
    document.getElementById('score').innerText = currentScore;
    
    // Animation effect
    const scoreEl = document.getElementById('score');
    gsap.fromTo(scoreEl, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
}

function finishGame() {
    document.getElementById('game-content').innerHTML = `
        <div class="text-center fade-in">
            <h2 style="font-size: 3rem; margin-bottom: 1rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">🏆 ¡MISIÓN CUMPLIDA!</h2>
            <p style="font-size: 1.5rem; margin-bottom: 2rem; color: white; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">Has completado tu entrenamiento de Explorador Planetario.</p>
            <img src="assets/img/mascot.png" style="width: 200px; border-radius: 50%; margin-bottom: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" alt="Explorador">
            <div class="glass-card" style="padding: 2rem; margin-bottom: 2rem;">
                <h3 style="color: white;">Puntuación Total: ${currentScore} puntos</h3>
            </div>
            <button class="btn-primary" onclick="location.reload()">Jugar de nuevo</button>
        </div>
    `;
    document.getElementById('feedback').innerText = '';
}

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hero-bg').style.backgroundImage = 'url("assets/img/hero.png")';
    
    // Initial entrance animation
    gsap.from('.hero-title', { opacity: 0, y: -50, duration: 1, ease: "power4.out" });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from('.mission-card', {
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 1,
        delay: 0.5,
        ease: "expo.out"
    });
});
