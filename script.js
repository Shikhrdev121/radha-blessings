(function () {
      const openBlessingsBtn = document.getElementById('open-blessings-btn');
      const giftBoxWrapper = document.getElementById('gift-box-wrapper');
      const welcomeSection = document.getElementById('welcome-section');
      const mainBlessingsContent = document.getElementById('main-blessings-content');

      const envelopeContainer = document.getElementById('envelope-container');
      const envelopeToggleBtn = document.getElementById('envelope-toggle-btn');
      const envelopeCtaText = document.getElementById('envelope-cta-text');

      const replayBtn = document.getElementById('replay-blessings-btn');

      const lightbox = document.getElementById('photo-lightbox');
      const lightboxImg = document.getElementById('lightbox-image');
      const lightboxCaption = document.getElementById('lightbox-caption');
      const closeLightboxBtn = document.getElementById('close-lightbox-btn');
      const polaroidCards = document.querySelectorAll('.polaroid-card');

      const musicToggleBtn = document.getElementById('music-toggle-btn');
      const musicIcon = document.getElementById('music-icon');
      const musicLabel = document.getElementById('music-label');

      openBlessingsBtn.addEventListener('click', function () {
        giftBoxWrapper.classList.remove('gift-bursting');
        void giftBoxWrapper.offsetWidth;
        giftBoxWrapper.classList.add('gift-opened', 'gift-bursting');
        setTimeout(function () {
          mainBlessingsContent.hidden = false;
          welcomeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1650);
      });

      function openLightbox(card) {
        const src = card.getAttribute('data-photo-src');
        const caption = card.getAttribute('data-photo-caption');
        lightboxImg.src = src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
        if (typeof lightbox.showModal === 'function') {
          lightbox.showModal();
        }
      }

      polaroidCards.forEach(function (card) {
        card.addEventListener('click', function () { openLightbox(card); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(card);
          }
        });
      });

      closeLightboxBtn.addEventListener('click', function () { lightbox.close(); });
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) lightbox.close();
      });

      envelopeToggleBtn.addEventListener('click', function () {
        const isOpen = envelopeContainer.classList.contains('envelope-open');
        if (isOpen) {
          envelopeContainer.classList.remove('envelope-open');
          envelopeContainer.classList.add('envelope-closed');
          envelopeToggleBtn.setAttribute('aria-expanded', 'false');
          envelopeCtaText.textContent = 'Open letter';
        } else {
          envelopeContainer.classList.remove('envelope-closed');
          envelopeContainer.classList.add('envelope-open');
          envelopeToggleBtn.setAttribute('aria-expanded', 'true');
          envelopeCtaText.textContent = 'Fold letter';
        }
      });

      replayBtn.addEventListener('click', function () {
        giftBoxWrapper.classList.remove('gift-opened', 'gift-bursting');
        envelopeContainer.classList.remove('envelope-open');
        envelopeContainer.classList.add('envelope-closed');
        envelopeToggleBtn.setAttribute('aria-expanded', 'false');
        envelopeCtaText.textContent = 'Open letter';
        mainBlessingsContent.hidden = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      let audioCtx = null;
      let musicInterval = null;
      let isMusicPlaying = false;
      const melodyNotes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.0, 698.46];
      let noteIndex = 0;

      function playGentleChime() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(melodyNotes[noteIndex % melodyNotes.length], audioCtx.currentTime);
        noteIndex++;
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.45);
      }

      musicToggleBtn.addEventListener('click', function () {
        isMusicPlaying = !isMusicPlaying;
        musicToggleBtn.setAttribute('aria-pressed', String(isMusicPlaying));
        if (isMusicPlaying) {
          musicIcon.textContent = 'music_note';
          musicLabel.textContent = 'Music On';
          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
              if (!audioCtx) audioCtx = new AudioContextClass();
              if (audioCtx.state === 'suspended') audioCtx.resume();
              playGentleChime();
              musicInterval = setInterval(playGentleChime, 850);
            }
          } catch (err) {}
        } else {
          musicIcon.textContent = 'music_off';
          musicLabel.textContent = 'Music Off';
          if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
          }
        }
      });
    })();





