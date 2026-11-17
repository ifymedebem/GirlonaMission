(() => {
  const get = id => document.getElementById(id);
  const tracks = { spring: 'Tafi Maradi no voice', summer: 'Sunshine (version 2)', fall: 'Folk Round', winter: 'We Wish you a Merry Christmas' };
  const playButton = get('music-play'), muteButton = get('music-mute'), volumeInput = get('music-volume'), status = get('music-status');
  let context, master, current, wanted = false, muted = false, volume = .25, request = 0;
  const voices = new Set();
  try { muted = localStorage.getItem('living-tree-muted') === 'true'; const stored = Number(localStorage.getItem('living-tree-volume') ?? .25); if (Number.isFinite(stored)) volume = Math.max(0, Math.min(1, stored)); } catch {}
  volumeInput.value = volume;
  function persist() { try { localStorage.setItem('living-tree-muted', muted); localStorage.setItem('living-tree-volume', volume); } catch {} }
  function render(message) {
    playButton.textContent = wanted ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', wanted ? 'Pause seasonal music' : 'Play seasonal music');
    playButton.setAttribute('aria-pressed', String(wanted));
    muteButton.textContent = muted ? '♩' : '♫';
    muteButton.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
    muteButton.setAttribute('aria-pressed', String(muted));
    status.textContent = message || (wanted ? tracks[document.body.dataset.season] : 'Tap to listen');
    status.title = status.textContent;
  }
  function applyVolume() { if (master) master.gain.setTargetAtTime(muted ? 0 : volume, context.currentTime, .05); }
  function stop(voice) {
    clearTimeout(voice.timer); voice.audio.pause(); voice.audio.removeAttribute('src'); voice.audio.load();
    voice.source.disconnect(); voice.gain.disconnect(); voices.delete(voice); if (current === voice) current = null;
  }
  function ramp(voice, target, seconds) {
    const now = context.currentTime;
    voice.gain.gain.cancelAndHoldAtTime(now);
    voice.gain.gain.linearRampToValueAtTime(target, now + seconds);
  }
  async function start(season) {
    const ticket = ++request;
    if (!context) { context = new (window.AudioContext || window.webkitAudioContext)(); master = context.createGain(); master.gain.value = muted ? 0 : volume; master.connect(context.destination); }
    await context.resume();
    if (ticket !== request || !wanted || document.hidden) return;
    const audio = new Audio('audio/' + season + '.mp3'); audio.preload = 'auto';
    const source = context.createMediaElementSource(audio), gain = context.createGain(); gain.gain.value = 0; source.connect(gain); gain.connect(master);
    const voice = { audio, source, gain, season }; voices.add(voice);
    try {
      await audio.play();
      if (ticket !== request || !wanted || document.hidden) { stop(voice); return; }
      const old = [...voices].filter(v => v !== voice); current = voice;
      ramp(voice, 1, old.length ? 2 : .6);
      old.forEach(v => { ramp(v, 0, 2); clearTimeout(v.timer); v.timer = setTimeout(() => stop(v), 2200); });
      let looping = false;
      audio.addEventListener('timeupdate', () => {
        if (!looping && current === voice && wanted && !document.hidden && Number.isFinite(audio.duration) && audio.duration - audio.currentTime < 2.1) { looping = true; start(season); }
      });
      audio.addEventListener('ended', () => { if (!looping && current === voice && wanted && !document.hidden) start(season); });
      audio.addEventListener('error', () => { if (current === voice) fail(); });
      render();
    } catch { stop(voice); if (ticket === request) fail(); }
  }
  function fail() { wanted = false; ++request; [...voices].forEach(stop); render('Unable to play · retry'); }
  function pause() { ++request; [...voices].forEach(stop); render(); }
  playButton.addEventListener('click', () => {
    wanted = !wanted;
    if (wanted) { render('Loading music…'); start(document.body.dataset.season).catch(fail); }
    else pause();
  });
  muteButton.addEventListener('click', () => { muted = !muted; applyVolume(); persist(); render(); });
  volumeInput.addEventListener('input', () => { volume = Number(volumeInput.value); if (volume > 0) muted = false; applyVolume(); persist(); render(); });
  document.querySelectorAll('nav button[data-season]').forEach(button => button.addEventListener('click', () => {
    if (wanted && !document.hidden && current?.season !== document.body.dataset.season) { render('Changing season…'); start(document.body.dataset.season).catch(fail); }
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { ++request; [...voices].forEach(stop); if (context) context.suspend().catch(() => {}); if (wanted) render('Paused while away'); }
    else if (wanted) start(document.body.dataset.season).catch(fail);
  });
  get('music-credits').onclick = () => get('credits-dialog').showModal();
  get('credits-close').onclick = () => get('credits-dialog').close();
  get('credits-dialog').addEventListener('click', event => { if (event.target === get('credits-dialog')) get('credits-dialog').close(); });
  render();
})();
