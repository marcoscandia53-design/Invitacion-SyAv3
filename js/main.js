/**
 * ==========================================================================
 * BODA SANDRA & AARÓN - INTERACTIVIDAD WEB
 * Manejo de botones superpuestos e interacción de copiar datos bancarios.
 * ==========================================================================
 */

// Configuración de enlaces y datos oficiales
const CONFIG = {
  // Datos bancarios
  alias: '0972232552',
  banco: 'BNF',
  titular: 'SANDRA BARRETO',

  // Enlaces oficiales
  urlUbicacion: 'https://www.google.com/maps?q=-25.26599884033203,-57.417781829833984&z=17&hl=es',
  urlTupi: 'https://www.tupi.com.py/regalos_en_lista/9841/Boda-de-Sandra-Barreto-y-Aaron-Samaniego--el-12-12-2026',
  urlWhatsapp: 'https://wa.me/595972232552?text=%C2%A1Hola!%20Quisiera%20confirmar%20mi%20asistencia%20a%20la%20boda.%20%C2%A1Muchas%20gracias%20por%20la%20invitaci%C3%B3n!%20%E2%9C%A8',

  // Fecha oficial de la boda (Sábado 12 de Diciembre de 2026 a las 17:00 hs)
  fechaBoda: '2026-12-12T17:00:00-03:00'
};

document.addEventListener('DOMContentLoaded', () => {
  setupEnvelope();
  setupMusic();
  setupButtons();
  setupCopyAlias();
  setupCountdown();
});

/**
 * Asigna los enlaces a los botones de Ubicación, Tienda Tupi y RSVP WhatsApp
 */
function setupButtons() {
  const btnLocation = document.getElementById('btnLocation');
  const btnTupi = document.getElementById('btnTupi');
  const btnRsvp = document.getElementById('btnRsvp');

  if (btnLocation) {
    btnLocation.href = CONFIG.urlUbicacion;
  }

  if (btnTupi) {
    btnTupi.href = CONFIG.urlTupi;
  }

  if (btnRsvp) {
    btnRsvp.href = CONFIG.urlWhatsapp;
  }
}

/**
 * Función para copiar el alias bancario al portapapeles y mostrar notificación toast
 */
function setupCopyAlias() {
  const btnCopyAlias = document.getElementById('btnCopyAlias');
  const toast = document.getElementById('toastNotification');
  let toastTimeout = null;

  if (!btnCopyAlias) return;

  btnCopyAlias.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONFIG.alias);
      } else {
        // Fallback para navegadores antiguos o entornos sin HTTPS
        const textarea = document.createElement('textarea');
        textarea.value = CONFIG.alias;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      showToast();
    } catch (err) {
      console.error('Error al copiar alias:', err);
    }
  });

  function showToast() {
    if (!toast) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/**
 * Módulo: Cuenta Regresiva
 * Calcula y actualiza en tiempo real los días, horas, minutos y segundos
 * hasta el Sábado 12 de Diciembre de 2026 a las 17:00 hs.
 */
function setupCountdown() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const targetDate = new Date(CONFIG.fechaBoda).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // Ejecución inmediata y actualización cada segundo
  update();
  setInterval(update, 1000);
}

/**
 * Módulo: Apertura del Sobre de Bienvenida con Destello
 * Muestra el sobre en pantalla completa y, al presionar (click o touch),
 * genera un destello luminoso antes de revelar la invitación completa.
 */
function setupEnvelope() {
  const envelopeScreen = document.getElementById('envelopeScreen');
  const flashEffect = document.getElementById('flashEffect');

  if (!envelopeScreen || !flashEffect) return;

  // Bloquear scroll mientras el sobre esté activo
  document.body.classList.add('envelope-active');

  let isOpening = false;

  const openEnvelope = () => {
    if (isOpening) return;
    isOpening = true;

    // 1. Disparar destello radiante sobre el sello de lacre
    flashEffect.classList.add('trigger');

    // 2. Iniciar la reproducción musical al abrir la invitación
    if (typeof window.startWeddingMusic === 'function') {
      window.startWeddingMusic();
    }

    // 3. Iniciar la apertura y transición suave del sobre
    setTimeout(() => {
      envelopeScreen.classList.add('opening');
    }, 120);

    // 4. Remover el sobre y habilitar el scroll
    setTimeout(() => {
      document.body.classList.remove('envelope-active');
      envelopeScreen.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 850);
  };

  envelopeScreen.addEventListener('click', openEnvelope);
  envelopeScreen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
}

/**
 * Módulo: Reproductor de Música de Fondo
 * Inicia la reproducción de Harry Styles - Coming Up Roses al abrir el sobre
 * y permite pausar o reanudar tocando el botón flotante giratorio.
 */
function setupMusic() {
  const audio = document.getElementById('weddingAudio');
  const btnToggle = document.getElementById('btnMusicToggle');

  if (!audio || !btnToggle) return;

  let isPlaying = false;

  const playMusic = async () => {
    try {
      await audio.play();
      isPlaying = true;
      btnToggle.classList.remove('paused');
      btnToggle.classList.add('playing');
    } catch (err) {
      console.warn('Reproducción de audio a la espera de interacción:', err);
      isPlaying = false;
      btnToggle.classList.remove('playing');
      btnToggle.classList.add('paused');
    }
  };

  const pauseMusic = () => {
    audio.pause();
    isPlaying = false;
    btnToggle.classList.remove('playing');
    btnToggle.classList.add('paused');
  };

  btnToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Exponer función para iniciar música con la interacción de apertura
  window.startWeddingMusic = playMusic;
}



