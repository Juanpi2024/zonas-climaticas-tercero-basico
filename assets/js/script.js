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
