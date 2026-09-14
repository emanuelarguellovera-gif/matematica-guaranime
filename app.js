/* ==========================================================================
   MATEMÁTICA GUARANÍME — Script de Interactividad
   Terminología oficial del Guaraní Paraguayo (MEC) con soporte en Español
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. SISTEMA DE CONVERSIÓN DE NÚMEROS A GUARANÍ (Papapykuéra)
     ------------------------------------------------------------------------ */
  const units = ["", "peteĩ", "mokõi", "mbohapy", "irundy", "po", "poteĩ", "pokõi", "poapy", "porundy"];

  function getGuaraniNumber(num) {
    num = parseInt(num, 10);
    if (isNaN(num) || num < 0) return { text: "Papapy invalido", breakdown: "" };
    if (num === 0) return { text: "Mba'eve (Cero)", breakdown: "0" };
    if (num === 100) return { text: "Sa", breakdown: "100" };
    if (num === 1000) return { text: "Su", breakdown: "1000" };

    if (num <= 9) {
      return { text: units[num], breakdown: `${num}` };
    }

    if (num >= 10 && num <= 99) {
      const tens = Math.floor(num / 10);
      const remainder = num % 10;
      let tensText = tens === 1 ? "Pa" : units[tens] + "pa";
      let text = remainder === 0 ? tensText : `${tensText} ${units[remainder]}`;
      
      let breakdown = tens === 1 ? "10" : `${tens} × 10`;
      if (remainder > 0) breakdown += ` + ${remainder}`;
      
      return { text, breakdown };
    }

    return { text: `${num} (Papapy guasu)`, breakdown: "Número mayor a 99" };
  }

  const numInput = document.getElementById('converter-num');
  const guaraniTextEl = document.getElementById('guarani-num-text');
  const mathBreakdownEl = document.getElementById('guarani-num-breakdown');

  function updateNumberConverter() {
    if (!numInput || !guaraniTextEl) return;
    const val = Math.min(Math.max(parseInt(numInput.value || 1, 10), 1), 999);
    const result = getGuaraniNumber(val);
    guaraniTextEl.textContent = result.text;
    mathBreakdownEl.textContent = `Desglose: ${result.breakdown}`;
  }

  if (numInput) {
    numInput.addEventListener('input', updateNumberConverter);
    updateNumberConverter();
  }


  /* ------------------------------------------------------------------------
     2. INSPECTOR GEOMÉTRICO (Ta'angakuéra)
     ------------------------------------------------------------------------ */
  const geoItems = document.querySelectorAll('.geo-shape-item');
  const geoNameEl = document.getElementById('geo-active-name');
  const geoEsNameEl = document.getElementById('geo-active-es');
  const geoDescEl = document.getElementById('geo-active-desc');

  const geoData = {
    apua: {
      guarani: "Apu'a",
      spanish: "Círculo",
      desc: "Ndaipori takamby. Hembeyke apu'apamánte. (Sin esquinas. Línea curva cerrada continua)."
    },
    kuada: {
      guarani: "Kua'ada / Takambyirundyjoja",
      spanish: "Cuadrado",
      desc: "Oguereko irundy yke ijojáva ha irundy takamby apu'a'ỹva (4 lados iguales y 4 ángulos rectos)."
    },
    takambyapy: {
      guarani: "Takambyapy",
      spanish: "Triángulo",
      desc: "Oguereko mbohapy yke ha mbohapy takamby. (Tiene 3 lados y 3 ángulos)."
    },
    takambyirundy: {
      guarani: "Takambyirundy",
      spanish: "Rectángulo",
      desc: "Oguereko irundy yke (mokõi ha mokõi ijojáva) ha irundy takamby. (4 lados con parejas iguales)."
    }
  };

  geoItems.forEach(item => {
    item.addEventListener('click', () => {
      geoItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const shapeKey = item.getAttribute('data-shape');
      const data = geoData[shapeKey];
      if (data && geoNameEl) {
        geoNameEl.textContent = data.guarani;
        geoEsNameEl.textContent = `(${data.spanish})`;
        geoDescEl.textContent = data.desc;
      }
    });
  });


  /* ------------------------------------------------------------------------
     3. SINTETIZADOR DE SONIDOS Y EFECTOS (Web Audio API sintético)
     ------------------------------------------------------------------------ */
  function playSound(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Ignorar silenciósamente si el navegador no permite audio automático
    }
  }


  /* ------------------------------------------------------------------------
     4. CUESTIONARIO INTERACTIVO DE EJERCICIOS (Eñembokatupyry)
     ------------------------------------------------------------------------ */
  const quizQuestions = [
    {
      questionGuarani: "Mboypa 2 + 3?",
      questionSpanish: "¿Cuánto es 2 + 3 en guaraní?",
      options: [
        { text: "Irundy (4)", correct: false },
        { text: "Po (5)", correct: true },
        { text: "Poteĩ (6)", correct: false },
        { text: "Pokõi (7)", correct: false }
      ],
      explanation: "2 + 3 = 5. Guaraníme 5 oje'e 'po'."
    },
    {
      questionGuarani: "Mboypa 10 - 4?",
      questionSpanish: "¿Cuánto es 10 - 4?",
      options: [
        { text: "Po (5)", correct: false },
        { text: "Poteĩ (6)", correct: true },
        { text: "Pokõi (7)", correct: false },
        { text: "Poapy (8)", correct: false }
      ],
      explanation: "10 - 4 = 6. Guaraníme 6 oje'e 'poteĩ' (po + peteĩ)."
    },
    {
      questionGuarani: "Mba'éichapa oje'e 'Suma' guaraníme?",
      questionSpanish: "¿Cómo se dice 'Suma' en guaraní?",
      options: [
        { text: "Ñemboguejy", correct: false },
        { text: "Ñembojoja", correct: true },
        { text: "Ñembohetave", correct: false },
        { text: "Ñemboja'o", correct: false }
      ],
      explanation: "'Ñembojoja' ha'e suma terã adición."
    },
    {
      questionGuarani: "Mboypa 3 × 4?",
      questionSpanish: "¿Cuánto es 3 × 4?",
      options: [
        { text: "Pa (10)", correct: false },
        { text: "Pa peteĩ (11)", correct: false },
        { text: "Pa mokõi (12)", correct: true },
        { text: "Pa mbohapy (13)", correct: false }
      ],
      explanation: "3 × 4 = 12. Guaraníme: mbohapy jey irundy ha'e 'pa mokõi'."
    },
    {
      questionGuarani: "Mba'e ta'angapa oguereko mbohapy yke?",
      questionSpanish: "¿Qué figura geométrica tiene 3 lados?",
      options: [
        { text: "Kua'ada (Cuadrado)", correct: false },
        { text: "Takambyapy (Triángulo)", correct: true },
        { text: "Apu'a (Círculo)", correct: false },
        { text: "Takambyirundy (Rectángulo)", correct: false }
      ],
      explanation: "Takambyapy (Triángulo) oguereko 3 yke ha 3 takamby."
    },
    {
      questionGuarani: "Mboypa 12 ÷ 3?",
      questionSpanish: "¿Cuánto es 12 ÷ 3?",
      options: [
        { text: "Mbohapy (3)", correct: false },
        { text: "Irundy (4)", correct: true },
        { text: "Po (5)", correct: false },
        { text: "Poteĩ (6)", correct: false }
      ],
      explanation: "12 ÷ 3 = 4. Pa mokõi oñemboja'o mbohapy pehẽme ha'e 'irundy'."
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;
  let questionAnswered = false;

  const quizQuestionTitle = document.getElementById('quiz-question-title');
  const quizQuestionSub = document.getElementById('quiz-question-sub');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizFeedbackBox = document.getElementById('quiz-feedback');
  const quizFeedbackText = document.getElementById('quiz-feedback-text');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizProgressBar = document.getElementById('quiz-progress-fill');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizScoreEl = document.getElementById('quiz-score-num');
  
  const quizBox = document.getElementById('quiz-box');
  const quizResultsScreen = document.getElementById('quiz-results-screen');
  const resultsMsgGuarani = document.getElementById('results-msg-guarani');
  const resultsScoreText = document.getElementById('results-score-text');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');

  function renderQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
      showQuizResults();
      return;
    }

    questionAnswered = false;
    const q = quizQuestions[currentQuestionIndex];

    quizQuestionTitle.textContent = q.questionGuarani;
    quizQuestionSub.textContent = q.questionSpanish;

    // Actualizar progreso
    const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    if (quizProgressBar) quizProgressBar.style.width = `${progressPercent}%`;
    if (quizProgressText) quizProgressText.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;

    // Limpiar opciones
    quizOptionsGrid.innerHTML = '';
    quizFeedbackBox.className = 'feedback-box';
    quizFeedbackBox.style.display = 'none';
    quizNextBtn.style.display = 'none';

    q.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span>${opt.text}</span><i class="bi bi-circle"></i>`;
      btn.addEventListener('click', () => handleSelectOption(btn, opt, q));
      quizOptionsGrid.appendChild(btn);
    });
  }

  function handleSelectOption(selectedBtn, option, question) {
    if (questionAnswered) return;
    questionAnswered = true;

    const allButtons = quizOptionsGrid.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (option.correct) {
      selectedBtn.classList.add('correct');
      selectedBtn.querySelector('i').className = 'bi bi-check-circle-fill';
      userScore += 10;
      if (quizScoreEl) quizScoreEl.textContent = userScore;
      playSound('correct');

      quizFeedbackBox.className = 'feedback-box correct';
      quizFeedbackBox.innerHTML = `
        <div class="feedback-title"><i class="bi bi-check-circle-fill"></i> ¡Iporãite! (¡Correcto!)</div>
        <div>${question.explanation}</div>
      `;
    } else {
      selectedBtn.classList.add('incorrect');
      selectedBtn.querySelector('i').className = 'bi bi-x-circle-fill';
      playSound('wrong');

      // Resaltar la opción correcta
      allButtons.forEach((btn, idx) => {
        if (question.options[idx].correct) {
          btn.classList.add('correct');
          btn.querySelector('i').className = 'bi bi-check-circle-fill';
        }
      });

      quizFeedbackBox.className = 'feedback-box incorrect';
      quizFeedbackBox.innerHTML = `
        <div class="feedback-title"><i class="bi bi-x-circle-fill"></i> ¡Nda'ahái! (¡Incorrecto!)</div>
        <div>${question.explanation}</div>
      `;
    }

    quizFeedbackBox.style.display = 'block';
    quizNextBtn.style.display = 'inline-flex';
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      renderQuestion();
    });
  }

  function showQuizResults() {
    quizBox.style.display = 'none';
    quizResultsScreen.style.display = 'block';

    const maxScore = quizQuestions.length * 10;
    const percentage = (userScore / maxScore) * 100;

    resultsScoreText.textContent = `Puntuación: ${userScore} de ${maxScore} puntos (${Math.round(percentage)}%)`;

    if (percentage === 100) {
      resultsMsgGuarani.textContent = "¡Iporãiterei! 🌟 Nde rembiapo porãite.";
    } else if (percentage >= 70) {
      resultsMsgGuarani.textContent = "¡Rehecha porã! 👏 Ekuatia porãve hag̃ua.";
    } else {
      resultsMsgGuarani.textContent = "¡Eñeha'ãve! 💪 Ndaha'eiri mba'eve, emboapyve.";
    }
  }

  if (quizRestartBtn) {
    quizRestartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      userScore = 0;
      if (quizScoreEl) quizScoreEl.textContent = "0";
      quizResultsScreen.style.display = 'none';
      quizBox.style.display = 'block';
      renderQuestion();
    });
  }

  // Inicializar primera pregunta si existe el quiz
  if (quizQuestionTitle) {
    renderQuestion();
  }


  /* ------------------------------------------------------------------------
     5. DICCIONARIO MATEMÁTICO EN GUARANÍ (Ñe'ẽryru)
     ------------------------------------------------------------------------ */
  const dictionaryTerms = [
    { guarani: "Papapy", spanish: "Número", category: "papapykuera", desc: "Mba'e ohechaukáva mboypa oĩ. (Concepto para indicar cantidad)." },
    { guarani: "Papapykuéra", spanish: "Números (Plural)", category: "papapykuera", desc: "Hetave papapy ojueheve. (Conjunto o lista de números)." },
    { guarani: "Ñembojoja", spanish: "Suma / Adición", category: "mbaeapo", desc: "Mokõi terã hetave papapy mbojoaju. (Unir o añadir dos o más cantidades)." },
    { guarani: "Ñemboguejy", spanish: "Resta / Sustracción", category: "mbaeapo", desc: "Nohẽ papapy ambuégui. (Quitar una cantidad de otra)." },
    { guarani: "Ñembohetave", spanish: "Multiplicación", category: "mbaeapo", desc: "Mboheta papapy jey jey. (Sumar un número varias veces)." },
    { guarani: "Ñemboja'o", spanish: "División", category: "mbaeapo", desc: "Mboja'o papapy pehẽ ojueheguápe. (Repartir una cantidad en partes iguales)." },
    { guarani: "Mbojojaha", spanish: "Igualdad / Signo Igual (=)", category: "mbaeapo", desc: "Meteĩcha mbojoja mokõi mba'e. (Demuestra que dos expresiones valen lo mismo)." },
    { guarani: "Ta'anga", spanish: "Figura / Forma Geométrica", category: "taanga", desc: "Mba'e ra'anga geometrica. (Representación o forma visual)." },
    { guarani: "Apu'a", spanish: "Círculo / Redondo", category: "taanga", desc: "Ta'anga apu'apamáva sin takamby. (Figura redonda continua sin esquinas)." },
    { guarani: "Kua'ada", spanish: "Cuadrado", category: "taanga", desc: "Ta'anga oguerekóva irundy yke ijojáva. (Figura de 4 lados iguales)." },
    { guarani: "Takambyapy", spanish: "Triángulo", category: "taanga", desc: "Ta'anga mbohapy yke ha mbohapy takambyoñemoĩva. (Figura con 3 lados y 3 ángulos)." },
    { guarani: "Takambyirundy", spanish: "Rectángulo", category: "taanga", desc: "Ta'anga irundy yke, mokõi ha mokõi ijojáva. (Figura de 4 lados en parejas)." },
    { guarani: "Takamby", spanish: "Ángulo / Esquina", category: "taanga", desc: "Mokõi yke oñembojoajuhápe. (Vértice o esquina donde se unen lados)." },
    { guarani: "Yke", spanish: "Lado", category: "taanga", desc: "Línea o delimita ta'anga retikue. (Línea lateral de una figura)." },
    { guarani: "Ykepaha", spanish: "Perímetro", category: "taanga", desc: "Opaite yke mbojoapy. (Suma de todos los lados de una figura)." },
    { guarani: "Ape", spanish: "Área / Superficie", category: "taanga", desc: "Kuaa mboypa oguereko pype ta'anga. (Espacio interior que ocupa una figura)." },
    { guarani: "Popapy", spanish: "Contar / Cómputo", category: "papapykuera", desc: "Papa 1, 2, 3... tenonde gotyo. (Enumerar elementos uno a uno)." },
    { guarani: "Peteĩ", spanish: "Uno (1)", category: "papapykuera", desc: "Papapy peteĩha. (Primer número natural)." },
    { guarani: "Mokõi", spanish: "Dos (2)", category: "papapykuera", desc: "Papapy mokõiha. (Número dos)." },
    { guarani: "Mbohapy", spanish: "Tres (3)", category: "papapykuera", desc: "Papapy mbohapyha. (Número tres)." },
    { guarani: "Irundy", spanish: "Cuatro (4)", category: "papapykuera", desc: "Papapy irundyha. (Número cuatro)." },
    { guarani: "Po", spanish: "Cinco (5)", category: "papapykuera", desc: "Papapy poha. Po avei he'ise mano (5 poã). (Número cinco)." },
    { guarani: "Pa", spanish: "Diez (10)", category: "papapykuera", desc: "Decena guaraníme. (Base de decenas)." },
    { guarani: "Sa", spanish: "Cien (100)", category: "papapykuera", desc: "Centena guaraníme. (Cien)." },
    { guarani: "Su", spanish: "Mil (1000)", category: "papapykuera", desc: "Unidad de mil guaraníme. (Mil)." }
  ];

  const dictGrid = document.getElementById('dictionary-grid');
  const searchInput = document.getElementById('dict-search-input');
  const filterChips = document.querySelectorAll('.filter-chip');

  let activeCategory = 'all';

  function renderDictionary() {
    if (!dictGrid) return;
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    dictGrid.innerHTML = '';

    const filtered = dictionaryTerms.filter(item => {
      const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
      const matchesSearch = item.guarani.toLowerCase().includes(query) ||
                            item.spanish.toLowerCase().includes(query) ||
                            item.desc.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      dictGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="bi bi-search" style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;">
          </i>
          <strong>Ndaipóri ñe'ẽ upeichaguápe</strong> (No se encontraron palabras para tu búsqueda)
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'dict-card';
      card.innerHTML = `
        <div class="dict-card-head">
          <span class="dict-guarani">${item.guarani}</span>
          <span class="dict-tag">${item.category}</span>
        </div>
        <div class="dict-spanish">= ${item.spanish}</div>
        <div class="dict-desc">${item.desc}</div>
      `;
      dictGrid.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderDictionary);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderDictionary();
    });
  });

  renderDictionary();


  /* ------------------------------------------------------------------------
     6. MENÚ RESPONSIVE MÓVIL
     ------------------------------------------------------------------------ */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x-lg');
      }
    });

    // Cerrar al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

});
