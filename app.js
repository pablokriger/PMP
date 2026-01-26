// ==================== VARIABLES GLOBALES ====================
let allQuestions = [];
let tipsData = { consejos_PMP: [], pmbok7_caracteristicas: [] };
let currentTipsIndex = -1;
let currentPmbok7Index = -1;
let questions = [], current = 0, score = 0, history = {}, totalTimerSeconds = 0, initialTotalSeconds = 0, examTimerInterval = null, questionElapsedSeconds = 0, questionTimerInterval = null, answered = false, noTimeLimit = false, sessionElapsedSeconds = 0, sessionElapsedInterval = null, pieChart = null, barChart = null, isFullscreen = false;

// Referencias a elementos DOM
const loginBtnMenu = document.getElementById('loginBtnMenu');
const logoutBtnMenu = document.getElementById('logoutBtnMenu');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userHistorySection = document.getElementById('user-history-section');
const userHistoryList = document.getElementById('user-history-list');
const langBtn = document.getElementById('lang-btn');
const langMenuList = document.getElementById('lang-menu-list');
const questionAreaEl = document.getElementById('question-area');
const finishBackdrop = document.getElementById('finish-backdrop');
const finishYes = document.getElementById('finish-yes');
const finishNo = document.getElementById('finish-no');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const progressMenuBtn = document.getElementById('progressMenuBtn');
const aboutMenuBtn = document.getElementById('aboutMenuBtn');
const consejosMenuBtn = document.getElementById('consejosMenuBtn');
const consejosSubmenu = document.getElementById('consejosSubmenu');
const pmpTipsBackdrop = document.getElementById('pmp-tips-backdrop');
const pmpContent = document.getElementById('pmp-content');
const pmpAnotherBtn = document.getElementById('pmp-another');
const pmpCloseBtn = document.getElementById('pmp-close');
const pmpTabs = document.querySelectorAll('.pmp-tab');
const progressBackdrop = document.getElementById('progress-backdrop');
const progressCloseBtn = document.getElementById('progress-close');
const homeHeaderBtn = document.getElementById('home-header-btn');
const homeExitBackdrop = document.getElementById('home-exit-backdrop');
const homeExitNo = document.getElementById('home-exit-no');
const homeExitYes = document.getElementById('home-exit-yes');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const aboutBackdrop = document.getElementById('about-backdrop');
const aboutCloseBtn = document.getElementById('about-close');

// ==================== MANEJO DEL BOTÓN DE INICIO ====================
homeHeaderBtn.addEventListener('click', () => {
    const isQuizActive = document.getElementById('quiz-container').style.display === 'block';
    
    if (isQuizActive) {
        // Si hay un quiz en progreso, mostrar modal de confirmación
        showBackdrop('home-exit-backdrop');
    } else {
        // Si no hay quiz activo, ir directamente al inicio
        goHome();
    }
});

// Manejar el modal de confirmación para salir
homeExitNo.addEventListener('click', () => {
    hideBackdrop('home-exit-backdrop');
});

homeExitYes.addEventListener('click', () => {
    hideBackdrop('home-exit-backdrop');
    goHome();
});

// ==================== CIERRE DE MODALES AL HACER CLIC AFUERA ====================
function setupModalCloseOnClickOutside(backdropId) {
    const backdrop = document.getElementById(backdropId);
    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                hideBackdrop(backdropId);
            }
        });
    }
}

// Configurar cierre al hacer clic fuera para todos los modales
setupModalCloseOnClickOutside('about-backdrop');
setupModalCloseOnClickOutside('pmp-tips-backdrop');
setupModalCloseOnClickOutside('progress-backdrop');
setupModalCloseOnClickOutside('finish-backdrop');
setupModalCloseOnClickOutside('home-exit-backdrop');
setupModalCloseOnClickOutside('exit-backdrop');
setupModalCloseOnClickOutside('timeup-backdrop');

// ==================== MANEJO DE PANTALLA COMPLETA ====================
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (!isFullscreen) {
        // Entrar en pantalla completa
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    } else {
        // Salir de pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

function updateFullscreenButton() {
    const fullscreenIcon = document.getElementById('fullscreen-icon');
    const exitFullscreenIcon = document.getElementById('exit-fullscreen-icon');
    
    if (isFullscreen) {
        fullscreenIcon.style.display = 'none';
        exitFullscreenIcon.style.display = 'block';
        fullscreenBtn.setAttribute('data-tooltip', 'Salir de pantalla completa');
        fullscreenBtn.setAttribute('aria-label', 'Salir de pantalla completa');
    } else {
        fullscreenIcon.style.display = 'block';
        exitFullscreenIcon.style.display = 'none';
        fullscreenBtn.setAttribute('data-tooltip', 'Pantalla completa');
        fullscreenBtn.setAttribute('aria-label', 'Pantalla completa');
    }
}

function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement);
    updateFullscreenButton();
}

// Escuchar eventos de cambio de pantalla completa
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

// ==================== MANEJO DEL MENÚ DROPDOWN ====================
let isMenuOpen = false;

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        menuDropdown.style.display = 'block';
        // Cerrar otros menús si están abiertos
        langMenuList.style.display = 'none';
        langMenuList.setAttribute('aria-hidden', 'true');
    } else {
        menuDropdown.style.display = 'none';
        // Cerrar también el submenú de consejos
        consejosSubmenu.style.display = 'none';
    }
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target) && e.target !== menuBtn) {
        menuDropdown.style.display = 'none';
        isMenuOpen = false;
        // Cerrar también el submenú de consejos
        consejosSubmenu.style.display = 'none';
    }
});

// Manejar el botón de consejos (submenú)
consejosMenuBtn.addEventListener('click', () => {
    const isSubmenuVisible = consejosSubmenu.style.display === 'block';
    consejosSubmenu.style.display = isSubmenuVisible ? 'none' : 'block';
});

// Manejar las opciones de consejos
document.querySelectorAll('.tips-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tipType = e.target.dataset.tipType;
        showBackdrop('pmp-tips-backdrop');
        // Establecer la pestaña activa según el tipo
        pmpTabs.forEach(tab => {
            if (tab.dataset.tab === tipType) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        showRandomTip(tipType);
        // Cerrar el menú
        menuDropdown.style.display = 'none';
        isMenuOpen = false;
        consejosSubmenu.style.display = 'none';
    });
});

// ==================== SISTEMA DE AUTENTICACIÓN ====================
function initAuth() {
    console.log("Inicializando autenticación...");
    
    // Escuchar cambios en el estado de autenticación
    window.onAuthStateChanged(window.auth, (user) => {
        console.log("Estado de autenticación cambiado:", user);
        
        if (user) {
            // Usuario logueado
            console.log("Usuario autenticado:", user.email);
            loginBtnMenu.style.display = 'none';
            logoutBtnMenu.style.display = 'block';
            logoutBtnMenu.classList.remove('hidden');
            userAvatar.src = user.photoURL || 'https://via.placeholder.com/48';
            userName.textContent = user.displayName || user.email || 'Usuario';
            
            // Mostrar sección de historial personal
            userHistorySection.style.display = 'block';
            userHistoryList.innerHTML = '<p>Cargando tu historial...</p>';
            
            // Cargar el historial del usuario
            loadUserHistory(user.uid);
            // Cargar estadísticas de progreso
            loadProgressData(user.uid);
        } else {
            // Usuario no logueado
            console.log("Usuario no autenticado");
            loginBtnMenu.style.display = 'block';
            logoutBtnMenu.style.display = 'none';
            logoutBtnMenu.classList.add('hidden');
            // Ícono de persona gris para invitados
            userAvatar.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzlhYTdiZiI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==';
            userName.textContent = 'Invitado';
            userHistorySection.style.display = 'none';
        }
    });
}

// Función para iniciar sesión con Google
loginBtnMenu.addEventListener('click', () => {
    console.log("Iniciando sesión...");
    
    window.signInWithPopup(window.auth, window.googleProvider)
        .then((result) => {
            console.log('Usuario autenticado:', result.user.email);
            // Cerrar el menú después de iniciar sesión
            menuDropdown.style.display = 'none';
            isMenuOpen = false;
        })
        .catch((error) => {
            console.error('Error en autenticación:', error);
            alert('Error al iniciar sesión: ' + error.message);
        });
});

// Función para cerrar sesión
logoutBtnMenu.addEventListener('click', () => {
    console.log("Cerrando sesión...");
    window.signOut(window.auth)
        .then(() => {
            console.log('Sesión cerrada exitosamente');
            // Cerrar el menú después de cerrar sesión
            menuDropdown.style.display = 'none';
            isMenuOpen = false;
        })
        .catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
});

// ==================== CARGA DE PREGUNTAS DESDE FIRESTORE ====================
async function cargarPreguntas() {
  console.log("Cargando preguntas desde Firestore...");
  
  const q = window.query(
    window.collection(window.db, "questions"),
    window.orderBy("number")
  );

  const snapshot = await window.getDocs(q);

  const preguntas = [];
  snapshot.forEach(doc => {
    preguntas.push(doc.data());
  });

  console.log(`Se cargaron ${preguntas.length} preguntas desde Firestore`);
  return preguntas;
}

// Función para cargar el historial del usuario
function loadUserHistory(userId) {
    console.log("Cargando historial para usuario:", userId);
    
    const userHistoryRef = window.collection(window.db, 'users', userId, 'history');
    const q = window.query(userHistoryRef, window.orderBy('timestamp', 'desc'));
    
    window.getDocs(q)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                userHistoryList.innerHTML = '<p>Aún no tienes historial. ¡Completa tu primer quiz!</p>';
                return;
            }
            
            let html = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const date = data.timestamp ? data.timestamp.toDate() : new Date();
                html += `<p>${date.toLocaleDateString()} - ${data.score || 0}% - ${data.totalQuestions || 0} preguntas</p>`;
            });
            userHistoryList.innerHTML = html;
        })
        .catch((error) => {
            console.error('Error cargando historial:', error);
            userHistoryList.innerHTML = '<p>Error cargando historial</p>';
        });
}

// Función para cargar datos de progreso
function loadProgressData(userId) {
    console.log("Cargando datos de progreso para usuario:", userId);
    
    const userHistoryRef = window.collection(window.db, 'users', userId, 'history');
    
    window.getDocs(userHistoryRef)
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                document.getElementById('total-quizzes').textContent = '0';
                document.getElementById('avg-score').textContent = '0%';
                document.getElementById('best-score').textContent = '0%';
                document.getElementById('total-study-time').textContent = '0h 0m';
                document.getElementById('mastered-areas').textContent = '0';
                document.getElementById('improve-areas').textContent = '0';
                return;
            }
            
            let totalQuizzes = 0;
            let totalScore = 0;
            let bestScore = 0;
            let totalTime = 0;
            let areasStats = {};
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                totalQuizzes++;
                totalScore += data.score || 0;
                bestScore = Math.max(bestScore, data.score || 0);
                totalTime += data.timeSpent || 0;
                
                // Analizar áreas
                if (data.areas) {
                    Object.keys(data.areas).forEach(area => {
                        if (!areasStats[area]) {
                            areasStats[area] = { correct: 0, total: 0 };
                        }
                        areasStats[area].correct += data.areas[area].correct || 0;
                        areasStats[area].total += data.areas[area].total || 0;
                    });
                }
            });
            
            const avgScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
            const totalHours = Math.floor(totalTime / 3600);
            const totalMinutes = Math.floor((totalTime % 3600) / 60);
            
            let masteredAreas = 0;
            let improveAreas = 0;
            
            Object.keys(areasStats).forEach(area => {
                const percentage = areasStats[area].total > 0 ? 
                    Math.round((areasStats[area].correct / areasStats[area].total) * 100) : 0;
                if (percentage >= 70) masteredAreas++;
                else improveAreas++;
            });
            
            document.getElementById('total-quizzes').textContent = totalQuizzes;
            document.getElementById('avg-score').textContent = avgScore + '%';
            document.getElementById('best-score').textContent = bestScore + '%';
            document.getElementById('total-study-time').textContent = totalHours + 'h ' + totalMinutes + 'm';
            document.getElementById('mastered-areas').textContent = masteredAreas;
            document.getElementById('improve-areas').textContent = improveAreas;
        })
        .catch((error) => {
            console.error('Error cargando datos de progreso:', error);
        });
}

// Función para guardar resultados del quiz
function saveQuizResults(userId, results) {
    console.log("Guardando resultados para usuario:", userId);
    
    const historyRef = window.collection(window.db, 'users', userId, 'history');
    
    return window.addDoc(historyRef, {
        timestamp: window.serverTimestamp(),
        score: results.percent,
        totalQuestions: results.total,
        correct: results.correct,
        timeSpent: results.timeSpent,
        areas: results.areas || {}
    });
}

// ==================== MANEJO DEL BOTÓN DE IDIOMA ====================
langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = langMenuList.style.display === 'block';
    langMenuList.style.display = isVisible ? 'none' : 'block';
    langMenuList.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
    // Cerrar otros menús si están abiertos
    menuDropdown.style.display = 'none';
    isMenuOpen = false;
    consejosSubmenu.style.display = 'none';
});

// Cerrar menú de idioma al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!langMenuList.contains(e.target) && e.target !== langBtn) {
        langMenuList.style.display = 'none';
        langMenuList.setAttribute('aria-hidden', 'true');
    }
});

// ==================== CONSEJOS PMP ====================
async function loadTipsData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/pablokriger/PMP/main/data_cmp.json');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        tipsData = await response.json();
        console.log('Datos de consejos cargados:', tipsData);
    } catch (error) {
        console.error('Error cargando consejos:', error);
        tipsData = { 
            consejos_PMP: ['Error cargando consejos de rendimiento PMP'], 
            pmbok7_caracteristicas: ['Error cargando información PMBOK7'] 
        };
    }
}

function showRandomTip(category) {
    const contentEl = document.getElementById('pmp-content');
    if (category === 'consejos_PMP') {
        if (tipsData.consejos_PMP.length === 0) {
            contentEl.textContent = 'Cargando consejos de rendimiento PMP...';
            return;
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tipsData.consejos_PMP.length);
        } while (newIndex === currentTipsIndex && tipsData.consejos_PMP.length > 1);
        currentTipsIndex = newIndex;
        contentEl.textContent = tipsData.consejos_PMP[currentTipsIndex];
    } else if (category === 'pmbok7_caracteristicas') {
        if (tipsData.pmbok7_caracteristicas.length === 0) {
            contentEl.textContent = 'Cargando información de PMBOK7...';
            return;
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tipsData.pmbok7_caracteristicas.length);
        } while (newIndex === currentPmbok7Index && tipsData.pmbok7_caracteristicas.length > 1);
        currentPmbok7Index = newIndex;
        contentEl.textContent = tipsData.pmbok7_caracteristicas[currentPmbok7Index];
    } else {
        contentEl.textContent = 'Selecciona una categoría para ver contenido';
    }
}

// Event listeners para el modal de Consejos PMP
pmpAnotherBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.pmp-tab.active');
    const category = activeTab.dataset.tab;
    showRandomTip(category);
});

pmpCloseBtn.addEventListener('click', () => {
    hideBackdrop('pmp-tips-backdrop');
});

// Manejar cambio de pestañas en el modal
pmpTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Quitar active de todas
        pmpTabs.forEach(t => t.classList.remove('active'));
        // Añadir active a la seleccionada
        tab.classList.add('active');
        const category = tab.dataset.tab;
        showRandomTip(category);
    });
});

// ==================== MI PROGRESO ====================
progressMenuBtn.addEventListener('click', () => {
    showBackdrop('progress-backdrop');
    const user = window.auth.currentUser;
    if (user) {
        loadProgressData(user.uid);
    }
    // Cerrar el menú
    menuDropdown.style.display = 'none';
    isMenuOpen = false;
    consejosSubmenu.style.display = 'none';
});

progressCloseBtn.addEventListener('click', () => {
    hideBackdrop('progress-backdrop');
});

// ==================== ACERCA DE ====================
aboutMenuBtn.addEventListener('click', () => {
    showBackdrop('about-backdrop');
    // Cerrar el menú
    menuDropdown.style.display = 'none';
    isMenuOpen = false;
    consejosSubmenu.style.display = 'none';
});

aboutCloseBtn.addEventListener('click', () => {
    hideBackdrop('about-backdrop');
});

// ==================== FUNCIONES EXISTENTES DEL QUIZ ====================
const versionSelectExam = document.getElementById('version-filter-exam'),
      startBtn = document.getElementById('start-btn'),
      aboutBtn = document.getElementById('about-btn'),
      startScreen = document.getElementById('start-screen'),
      quizContainer = document.getElementById('quiz-container'),
      endScreen = document.getElementById('end-screen'),
      scoreContainer = document.getElementById('score-container'),
      questionEl = document.getElementById('question'),
      qInfoEl = document.getElementById('q-info'),
      optionsEl = document.getElementById('options'),
      explanationEl = document.getElementById('explanation'),
      nextBtn = document.getElementById('next-btn'),
      prevBtn = document.getElementById('prev-btn'),
      restartBtn = document.getElementById('restart-btn'),
      homeBtn = document.getElementById('home-button'),
      exitBackdrop = document.getElementById('exit-backdrop'),
      exitYes = document.getElementById('exit-yes'),
      exitNo = document.getElementById('exit-no'),
      totalTimerEl = document.getElementById('total-timer'),
      initialTotalEl = document.getElementById('initial-total'),
      questionTimerEl = document.getElementById('question-timer'),
      progressDisplay = document.getElementById('progress-display'),
      finishBtn = document.getElementById('finish-btn'),
      timeupBackdrop = document.getElementById('timeup-backdrop'),
      timeupAccept = document.getElementById('timeup-accept'),
      chartsGrid = document.getElementById('charts-grid'),
      tooltipEl = document.getElementById('tooltip'),
      areasListEl = document.getElementById('areas-list'),
      selectAllAreasBtn = document.getElementById('select-all-areas'),
      deselectAllAreasBtn = document.getElementById('deselect-all-areas'),
      customCountInput = document.getElementById('custom-count'),
      customTimeInput = document.getElementById('custom-time'),
      customAllQuestions = document.getElementById('custom-all-questions'),
      customNoTime = document.getElementById('custom-no-time'),
      groupChartsEl = document.getElementById('group-charts'),
      groupPerformanceEl = document.getElementById('group-performance'),
      groupHistoryEl = document.getElementById('group-history'),
      finalStatsEl = document.getElementById('final-stats'),
      performanceSummaryEl = document.getElementById('performance-summary'),
      historyListEl = document.getElementById('history-list'),
      resultGeneralEl = document.getElementById('result-general'),
      examVersionButtons = document.getElementById('exam-version-buttons'),
      customVersionButtons = document.getElementById('custom-version-buttons'),
      fullscreenIcon = document.getElementById('fullscreen-icon'),
      exitFullscreenIcon = document.getElementById('exit-fullscreen-icon');

function populateAreas() {
    if (allQuestions.length === 0) {
        areasListEl.innerHTML = '<div style="color:#9aa7bf;text-align:center;padding:10px;">Cargando áreas...</div>';
        return;
    }
    const areas = Array.from(new Set(allQuestions.map(q => q.area))).sort();
    areasListEl.innerHTML = '';
    areas.forEach(a => {
        const id = 'area_' + a.replace(/\s+/g, '_');
        const wrapper = document.createElement('label');
        wrapper.innerHTML = `<input type="checkbox" value="${a}" id="${id}" checked> <span>${a}</span>`;
        areasListEl.appendChild(wrapper);
    });
}

function showBackdrop(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('visible');
        el.style.display = 'flex';
        el.setAttribute('aria-hidden', 'false');
    }
}

function hideBackdrop(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('visible');
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
    }
}

function setupVersionButtons(container, hiddenInputId) {
    const buttons = container.querySelectorAll('.version-btn');
    const hiddenInput = document.getElementById(hiddenInputId);
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            hiddenInput.value = btn.dataset.value;
        });
    });
    const selectedBtn = container.querySelector('.version-btn.selected');
    if (selectedBtn && hiddenInput) {
        hiddenInput.value = selectedBtn.dataset.value;
    }
}

selectAllAreasBtn.addEventListener('click', () => {
    Array.from(areasListEl.querySelectorAll('input[type=checkbox]')).forEach(c => c.checked = true);
});

deselectAllAreasBtn.addEventListener('click', () => {
    Array.from(areasListEl.querySelectorAll('input[type=checkbox]')).forEach(c => c.checked = false);
});

const modeRadios = Array.from(document.querySelectorAll('input[name="mode"]'));
modeRadios.forEach(r => r.addEventListener('change', onModeChange));

function onModeChange() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    if (mode === 'exam') {
        document.getElementById('exam-controls').style.display = 'block';
        document.getElementById('custom-controls').style.display = 'none';
        document.getElementById('exam-note').style.display = 'block';
    } else {
        document.getElementById('exam-controls').style.display = 'none';
        document.getElementById('custom-controls').style.display = 'block';
        document.getElementById('exam-note').style.display = 'none';
    }
}

if (customAllQuestions) {
    customAllQuestions.addEventListener('change', () => {
        customCountInput.disabled = customAllQuestions.checked;
    });
}

if (customNoTime) {
    customNoTime.addEventListener('change', () => {
        customTimeInput.disabled = customNoTime.checked;
    });
}

let tooltipTimer = null;
document.body.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-tooltip]');
    if (!t) return;
    const text = t.getAttribute('data-tooltip');
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
        tooltipEl.textContent = text;
        tooltipEl.style.display = 'block';
        const rect = t.getBoundingClientRect();
        const left = Math.max(8, rect.left + rect.width / 2 - 60);
        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top = (rect.top - 40) + 'px';
        tooltipEl.style.opacity = '1';
        tooltipEl.setAttribute('aria-hidden', 'false');
    }, 500);
});

document.body.addEventListener('mouseout', (e) => {
    const t = e.target.closest('[data-tooltip]');
    if (!t) return;
    clearTimeout(tooltipTimer);
    tooltipEl.style.opacity = '0';
    tooltipEl.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
        if (tooltipEl.style.opacity === '0') {
            tooltipEl.style.display = 'none';
            tooltipEl.textContent = '';
        }
    }, 200);
});

startBtn.addEventListener('click', () => {
    if (allQuestions.length === 0) {
        alert('Los datos aún no se han cargado. Por favor, espera un momento.');
        return;
    }
    startQuiz();
});

aboutBtn.addEventListener('click', () => showBackdrop('about-backdrop'));

finishBtn.addEventListener('click', () => {
    showBackdrop('finish-backdrop');
});

finishNo.addEventListener('click', () => {
    hideBackdrop('finish-backdrop');
});

finishYes.addEventListener('click', () => {
    hideBackdrop('finish-backdrop');
    finishQuiz();
});

function startQuiz() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    questions = [];
    current = 0;
    score = 0;
    history = {};
    answered = false;
    noTimeLimit = false;
    clearAllIntervals();
    sessionElapsedSeconds = 0;
    sessionElapsedInterval = setInterval(() => {
        sessionElapsedSeconds++;
    }, 1000);
    
    if (mode === 'exam') {
        const version = document.getElementById('version-filter-exam').value;
        if (!version) {
            alert('Selecciona la versión (v6 o v7) para Exam PMP.');
            return;
        }
        let pool = allQuestions.filter(q => q.version === version);
        if (pool.length === 0) {
            alert(`No hay preguntas para la versión ${version}.`);
            return;
        }
        pool = shuffleArray(pool);
        const desired = 180;
        if (pool.length < desired) {
            if (!confirm(`Solo hay ${pool.length} preguntas disponibles en ${version}. Se usará ese total.`)) return;
        }
        questions = pool.slice(0, Math.min(desired, pool.length));
        initialTotalSeconds = 250 * 60;
        totalTimerSeconds = initialTotalSeconds;
        noTimeLimit = false;
    } else {
        const checkedAreas = Array.from(areasListEl.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
        let pool = allQuestions.filter(q => checkedAreas.length === 0 ? true : checkedAreas.includes(q.area));
        const verChoice = document.getElementById('custom-version').value;
        if (verChoice && verChoice !== 'both') pool = pool.filter(q => q.version === verChoice);
        if (pool.length === 0) {
            alert('No hay preguntas para las áreas/versión seleccionadas.');
            return;
        }
        pool = shuffleArray(pool);
        let count;
        if (customAllQuestions && customAllQuestions.checked) {
            count = pool.length;
        } else {
            count = parseInt(customCountInput.value || '0', 10);
            if (isNaN(count) || count <= 0) {
                alert('Cantidad inválida de preguntas');
                return;
            }
        }
        if (pool.length < count) {
            if (!confirm(`Solo hay ${pool.length} preguntas disponibles. Se usará ese total.`)) return;
        }
        questions = pool.slice(0, Math.min(count, pool.length));
        if (customNoTime && customNoTime.checked) {
            noTimeLimit = true;
            initialTotalSeconds = 0;
            totalTimerSeconds = 0;
        } else {
            noTimeLimit = false;
            initialTotalSeconds = parseInt(customTimeInput.value || '0', 10) * 60;
            totalTimerSeconds = initialTotalSeconds;
        }
    }
    
    document.getElementById('score').innerText = score;
    document.getElementById('current-question').innerText = current + 1;
    document.getElementById('total-questions').innerText = questions.length;
    initialTotalEl.textContent = noTimeLimit ? 'Sin límite' : formatTime(initialTotalSeconds);
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    endScreen.style.display = 'none';
    scoreContainer.style.display = 'block';
    
    if (!noTimeLimit && initialTotalSeconds > 0) {
        startTotalTimer();
    } else {
        totalTimerEl.textContent = 'Sin límite';
        homeBtn.classList.remove('warning');
    }
    showQuestion();
}

function clearAllIntervals() {
    clearInterval(examTimerInterval);
    clearInterval(questionTimerInterval);
    clearInterval(sessionElapsedInterval);
    examTimerInterval = null;
    questionTimerInterval = null;
    sessionElapsedInterval = null;
}

function startTotalTimer() {
    clearInterval(examTimerInterval);
    totalTimerEl.textContent = formatTime(totalTimerSeconds);
    examTimerInterval = setInterval(() => {
        if (totalTimerSeconds > 0) {
            totalTimerSeconds--;
            totalTimerEl.textContent = formatTime(totalTimerSeconds);
            if (totalTimerSeconds <= 60) {
                homeBtn.classList.add('warning');
            } else {
                homeBtn.classList.remove('warning');
            }
            if (totalTimerSeconds <= 0) {
                clearInterval(examTimerInterval);
                homeBtn.classList.remove('warning');
                showBackdrop('timeup-backdrop');
            }
        } else {
            clearInterval(examTimerInterval);
        }
    }, 1000);
}

function startQuestionTimer() {
    clearInterval(questionTimerInterval);
    questionElapsedSeconds = 0;
    questionTimerEl.textContent = formatElapsed(questionElapsedSeconds);
    questionTimerInterval = setInterval(() => {
        questionElapsedSeconds++;
        questionTimerEl.textContent = formatElapsed(questionElapsedSeconds);
    }, 1000);
}

function showQuestion() {
    answered = false;
    const q = questions[current];
    if (!q) {
        finishQuiz();
        return;
    }
    questionEl.textContent = `${current + 1}. ${q.question}`;
    // Solo mostrar versión en q-info
    qInfoEl.textContent = `Versión: ${q.version || 'N/A'}`;
    // Mostrar área en el nuevo elemento question-area
    questionAreaEl.textContent = `Área: ${q.area || 'N/A'}`;
    questionAreaEl.style.display = 'block';
    
    progressDisplay.textContent = `Pregunta ${current + 1} de ${questions.length}`;
    if (current === questions.length - 1) {
        nextBtn.innerHTML = 'Finalizar cuestionario';
        nextBtn.classList.add('finalize');
    } else {
        nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        nextBtn.classList.remove('finalize');
    }
    optionsEl.innerHTML = '';
    let shuffledOrder = [];
    const hist = history[q.number];
    if (hist && hist.shuffledOrder) {
        shuffledOrder = hist.shuffledOrder;
    } else {
        shuffledOrder = shuffleArray(Array.from({ length: q.options.length }, (_, i) => i));
        if (!history[q.number]) {
            history[q.number] = {};
        }
        history[q.number].shuffledOrder = shuffledOrder;
    }
    
    for (let pos = 0; pos < shuffledOrder.length; pos++) {
        const origIdx = shuffledOrder[pos];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = q.options[origIdx] || '';
        btn.dataset.pos = pos;
        btn.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            btn.classList.add('pressed');
            try {
                btn.setPointerCapture(ev.pointerId);
            } catch (e) { }
        });
        btn.addEventListener('pointerup', (ev) => {
            ev.preventDefault();
            try {
                btn.releasePointerCapture(ev.pointerId);
            } catch (e) { }
            const rect = btn.getBoundingClientRect();
            const inside = ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom;
            btn.classList.remove('pressed');
            if (!inside || answered) {
                return;
            }
            const prev = history[q.number];
            if (prev && typeof prev.selected === 'number') return;
            const selectedPos = parseInt(btn.dataset.pos, 10);
            try {
                Array.from(optionsEl.children).forEach(b => b.classList.remove('selected'));
            } catch (e) { }
            btn.classList.add('selected');
            handleAnswer(selectedPos, shuffledOrder);
        });
        btn.addEventListener('pointerleave', () => btn.classList.remove('pressed'));
        optionsEl.appendChild(btn);
    }
    
    if (hist && typeof hist.selected !== 'undefined') {
        const buttons = Array.from(optionsEl.children);
        for (let i = 0; i < buttons.length; i++) {
            const realIdx = shuffledOrder[i];
            buttons[i].disabled = true;
            if (realIdx === q.correct) buttons[i].classList.add('correct');
            if (hist.selected === realIdx && hist.selected !== q.correct) buttons[i].classList.add('wrong');
            if (hist.selected === realIdx) buttons[i].classList.add('selected');
        }
        if (q.explanation && q.explanation.trim() !== '') {
            explanationEl.textContent = q.explanation;
            explanationEl.style.display = 'block';
        } else {
            explanationEl.style.display = 'none';
        }
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-flex';
    } else {
        explanationEl.style.display = 'none';
        explanationEl.textContent = '';
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-flex';
    }
    prevBtn.disabled = (current <= 0);
    startQuestionTimer();
}

function handleAnswer(selectedPos, shuffledOrder) {
    if (answered) return;
    answered = true;
    const q = questions[current];
    const actualSelected = (selectedPos >= 0) ? shuffledOrder[selectedPos] : -1;
    const buttons = Array.from(optionsEl.children);
    for (let i = 0; i < buttons.length; i++) {
        const realIdx = shuffledOrder[i];
        buttons[i].disabled = true;
        if (realIdx === q.correct) buttons[i].classList.add('correct');
        if (realIdx === actualSelected && actualSelected !== q.correct) buttons[i].classList.add('wrong');
    }
    if (actualSelected === q.correct) score++;
    history[q.number] = {
        number: q.number,
        selected: actualSelected === -1 ? null : actualSelected,
        correctIndex: q.correct,
        correct: actualSelected === q.correct,
        timeTakenForQuestion: questionElapsedSeconds,
        shuffledOrder: shuffledOrder
    };
    if (q.explanation && q.explanation.trim() !== '') {
        explanationEl.textContent = q.explanation;
        explanationEl.style.display = 'block';
    } else {
        explanationEl.style.display = 'none';
    }
    document.getElementById('score').innerText = score;
    document.getElementById('current-question').innerText = current + 1;
}

prevBtn.addEventListener('pointerdown', e => {
    e.preventDefault();
    prevBtn.classList.add('pressing');
});

prevBtn.addEventListener('pointerup', e => {
    prevBtn.classList.remove('pressing');
    if (current > 0) {
        current--;
        showQuestion();
    }
});

prevBtn.addEventListener('pointerleave', () => prevBtn.classList.remove('pressing'));

nextBtn.addEventListener('pointerdown', e => {
    e.preventDefault();
    nextBtn.classList.add('pressing');
});

nextBtn.addEventListener('pointerup', e => {
    nextBtn.classList.remove('pressing');
    const q = questions[current];
    if (!history[q.number]) {
        history[q.number] = {
            number: q.number,
            selected: null,
            correctIndex: q.correct,
            correct: false,
            timeTakenForQuestion: questionElapsedSeconds,
            shuffledOrder: history[q.number]?.shuffledOrder || shuffleArray(Array.from({ length: q.options.length }, (_, i) => i))
        };
    }
    if (current < questions.length - 1) {
        current++;
        showQuestion();
    } else {
        finishQuiz();
    }
});

nextBtn.addEventListener('pointerleave', () => nextBtn.classList.remove('pressing'));

function finishQuiz() {
    clearAllIntervals();
    hideBackdrop('timeup-backdrop');
    quizContainer.style.display = 'none';
    scoreContainer.style.display = 'none';
    endScreen.style.display = 'block';
    
    const areas = {};
    const versions = {};
    let answeredCount = 0;
    let unansweredCount = 0;
    let totalTimeTakenForQuestions = 0;
    let correctByArea = {};
    let totalByArea = {};
    
    questions.forEach(q => {
        const a = q.area || 'N/A';
        const v = q.version || 'N/A';
        if (!areas[a]) areas[a] = { correct: 0, total: 0 };
        if (!versions[v]) versions[v] = { correct: 0, total: 0 };
        areas[a].total++;
        versions[v].total++;
        if (!correctByArea[a]) correctByArea[a] = 0;
        if (!totalByArea[a]) totalByArea[a] = 0;
        totalByArea[a]++;
    });
    
    Object.values(history).forEach(h => {
        const q = questions.find(x => x.number === h.number);
        if (!q) return;
        const a = q.area || 'N/A';
        const v = q.version || 'N/A';
        if (h.correct) {
            correctByArea[a] = (correctByArea[a] || 0) + 1;
            versions[v].correct = (versions[v].correct || 0) + 1;
        }
        if (h.selected === null) {
            unansweredCount++;
        } else {
            answeredCount++;
        }
        if (h.timeTakenForQuestion) {
            totalTimeTakenForQuestions += h.timeTakenForQuestion;
        }
    });
    
    for (const a in areas) {
        areas[a].correct = correctByArea[a] || 0;
    }
    
    const totalCorrect = score;
    const percentOverall = questions.length > 0 ? Math.round(totalCorrect / questions.length * 100) : 0;
    
    performanceSummaryEl.innerHTML = `<div style="font-size:1rem;margin-bottom:10px;"><strong>Puntaje:</strong> ${percentOverall}%<br><strong>Correctas:</strong> ${totalCorrect} de ${questions.length}</div>`;
    resultGeneralEl.style.display = 'block';
    
    let finalStatsHtml = '';
    finalStatsHtml += '<div style="margin-bottom:10px;">';
    finalStatsHtml += `<strong>Preguntas totales:</strong> ${questions.length}<br>`;
    finalStatsHtml += `<strong>Respondidas:</strong> ${answeredCount}<br>`;
    finalStatsHtml += `<strong>Correctas:</strong> ${score}<br>`;
    finalStatsHtml += `<strong>Porcentaje final:</strong> ${percentOverall}%`;
    finalStatsHtml += '</div>';
    
    finalStatsHtml += '<div style="margin-bottom:6px;"><strong>Tiempos:</strong><br>';
    let tiempoEmpleadostr = 'N/A';
    let tiempoRestantestr = 'N/A';
    if (initialTotalSeconds > 0) {
        const tiempoRestante = Math.max(0, totalTimerSeconds);
        const tiempoEmpleadosec = initialTotalSeconds - tiempoRestante;
        tiempoEmpleadostr = formatTime(tiempoEmpleadosec);
        tiempoRestantestr = formatTime(tiempoRestante);
    } else {
        tiempoEmpleadostr = formatTime(sessionElapsedSeconds);
        tiempoRestantestr = 'Sin límite';
    }
    finalStatsHtml += `<div style="margin-left:10px;"><strong>Tiempo empleado:</strong> ${tiempoEmpleadostr}<br><strong>Tiempo restante:</strong> ${tiempoRestantestr}<br>`;
    const avgTimePerQ = answeredCount > 0 ? Math.round((totalTimeTakenForQuestions / answeredCount)) : 0;
    finalStatsHtml += `<strong>Tiempo promedio por pregunta respondida:</strong> ${formatElapsed(avgTimePerQ)}`;
    finalStatsHtml += '</div></div>';
    
    if (Object.keys(areas).length > 0) {
        finalStatsHtml += '<div style="margin-top:10px;border-top:1px solid rgba(0,0,0,0.1);padding-top:6px;">';
        finalStatsHtml += '<h5>Por áreas:</h5>';
        finalStatsHtml += '<div style="margin-bottom:6px;"><ul style="margin:3px 0 6px 15px;">';
        for (const a in areas) {
            const pct = areas[a].total ? Math.round((areas[a].correct / areas[a].total) * 100) : 0;
            finalStatsHtml += `<li>${a}: ${areas[a].correct}/${areas[a].total} (${pct}%)</li>`;
        }
        finalStatsHtml += '</ul></div></div>';
    }
    
    finalStatsEl.innerHTML = finalStatsHtml;
    historyListEl.innerHTML = '';
    
    Object.values(history).forEach(h => {
        const q = questions.find(x => x.number === h.number);
        if (!q) return;
        const qText = q.question.substring(0, 70) + (q.question.length > 70 ? '...' : '');
        const status = h.correct ? 'Correcta' : (h.selected === null ? 'No respondida' : 'Incorrecta');
        const t = h.timeTakenForQuestion ? ` - ${h.timeTakenForQuestion}s` : '';
        const p = document.createElement('p');
        p.textContent = `Pregunta ${q.number}: ${qText} - ${status}${t}`;
        historyListEl.appendChild(p);
    });
    
    if (Object.keys(areas).length > 0 || Object.keys(versions).length > 0) {
        groupPerformanceEl.style.display = 'block';
        finalStatsEl.style.display = 'block';
    } else {
        groupPerformanceEl.style.display = 'none';
    }
    
    if (Object.values(history).length > 0) {
        groupHistoryEl.style.display = 'block';
    } else {
        groupHistoryEl.style.display = 'none';
    }
    
    try {
        renderCharts(score, questions.length, areas);
        groupChartsEl.style.display = 'block';
    } catch (e) {
        console.error('Error al renderizar gráficos:', e);
        groupChartsEl.style.display = 'none';
    }
    
    // Guardar resultados si el usuario está logueado
    const user = window.auth.currentUser;
    if (user) {
        const results = {
            percent: percentOverall,
            total: questions.length,
            correct: score,
            timeSpent: sessionElapsedSeconds,
            areas: areas
        };
        
        saveQuizResults(user.uid, results)
            .then(() => {
                console.log('Resultados guardados en Firestore');
                // Recargar el historial del usuario
                loadUserHistory(user.uid);
                // Actualizar datos de progreso
                loadProgressData(user.uid);
            })
            .catch(error => {
                console.error('Error guardando resultados:', error);
            });
    }
}

restartBtn && restartBtn.addEventListener('click', () => {
    clearAllIntervals();
    history = {};
    score = 0;
    current = 0;
    answered = false;
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
    if (barChart) {
        barChart.destroy();
        barChart = null;
    }
    groupChartsEl.style.display = 'none';
    groupPerformanceEl.style.display = 'none';
    groupHistoryEl.style.display = 'none';
    resultGeneralEl.style.display = 'none';
    startQuiz();
});

exitNo.addEventListener('click', () => hideBackdrop('exit-backdrop'));
exitYes.addEventListener('click', () => {
    hideBackdrop('exit-backdrop');
    goHome();
});

timeupAccept && timeupAccept.addEventListener('click', () => {
    hideBackdrop('timeup-backdrop');
    finishQuiz();
});

function renderCharts(correctCount, totalCount, areasObj) {
    const incorrect = totalCount - correctCount;
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Correctas', 'Incorrectas'],
            datasets: [{
                data: [correctCount, incorrect],
                backgroundColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#4CAF50',
                    getComputedStyle(document.documentElement).getPropertyValue('--danger').trim() || '#F44336'
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    const labels = Object.keys(areasObj);
    const data = labels.map(l => {
        const a = areasObj[l];
        return a.total ? Math.round((a.correct / a.total) * 100) : 0;
    });
    
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '% exactitud',
                data,
                backgroundColor: labels.map(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4D89FF')
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function formatTime(sec) {
    if (sec === 0) return '0m 0s';
    if (!sec || sec <= 0) return '0m 0s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
}

function formatElapsed(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
}

function goHome() {
    current = 0;
    score = 0;
    history = {};
    clearAllIntervals();
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
    if (barChart) {
        barChart.destroy();
        barChart = null;
    }
    groupChartsEl.style.display = 'none';
    groupPerformanceEl.style.display = 'none';
    groupHistoryEl.style.display = 'none';
    resultGeneralEl.style.display = 'none';
    endScreen.style.display = 'none';
    startScreen.style.display = 'block';
    scoreContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    totalTimerSeconds = 0;
    initialTotalSeconds = 0;
    sessionElapsedSeconds = 0;
    hideBackdrop('progress-backdrop');
    hideBackdrop('pmp-tips-backdrop');
    hideBackdrop('about-backdrop');
    hideBackdrop('home-exit-backdrop');
}

async function init() {
    console.log("Inicializando aplicación...");
    
    // Inicializar autenticación primero
    initAuth();
    
    // Cargar datos de consejos
    await loadTipsData();
    
    // Inicializar elementos que no dependen de los datos
    onModeChange();
    if (customAllQuestions) customCountInput.disabled = customAllQuestions.checked;
    if (customNoTime) customTimeInput.disabled = customNoTime.checked;
    setupVersionButtons(examVersionButtons, 'version-filter-exam');
    setupVersionButtons(customVersionButtons, 'custom-version');
    hideBackdrop('exit-backdrop');
    hideBackdrop('timeup-backdrop');
    hideBackdrop('about-backdrop');
    hideBackdrop('pmp-tips-backdrop');
    hideBackdrop('progress-backdrop');
    hideBackdrop('finish-backdrop');
    hideBackdrop('home-exit-backdrop');
    menuDropdown.style.display = 'none';
    isMenuOpen = false;
    consejosSubmenu.style.display = 'none';
    langMenuList.setAttribute('aria-hidden', 'true');
    
    // Cargar datos desde Firestore
    console.log('Iniciando carga de datos desde Firestore...');
    startBtn.disabled = true;
    startBtn.textContent = "Cargando datos...";
    
    try {
        allQuestions = await cargarPreguntas();
        console.log('Datos cargados correctamente desde Firestore:', {
            questions: allQuestions.length
        });
        
        startBtn.disabled = false;
        startBtn.textContent = "Comenzar Quiz";
        populateAreas();
        console.log('Aplicación inicializada correctamente');
    } catch (error) {
        console.error('ERROR cargando datos desde Firestore:', error);
        
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'background:#ffebee;color:#c62828;padding:10px;border-radius:6px;margin-top:10px;text-align:center;';
        errorMsg.innerHTML = `
            <strong>Error cargando datos</strong><br>
            <small>No se pudieron cargar las preguntas desde Firestore.</small><br>
            <small>Error: ${error.message}</small>
        `;
        
        startBtn.parentNode.appendChild(errorMsg);
        
        startBtn.disabled = true;
        startBtn.textContent = "Error cargando datos";
    }
}

document.addEventListener('DOMContentLoaded', init);