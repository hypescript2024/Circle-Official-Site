"use strict";

(() => {
  const BGM = {
    opening: { src: "bgm/opening.mp3", gain: 1 },
    afterOpening: { src: "bgm/after_opening.mp3", gain: 1 },
    ioriBattle: { src: "bgm/iori_sentoBGM.mp3", gain: 1 },
    sennaBattle: { src: "bgm/sennna_sentoBGM.mp3", gain: 1 },
    askara: { src: "bgm/askara.mp3", gain: 1 },
    astro: { src: "bgm/astro.mp3", gain: 1 },
    leviathan: { src: "bgm/leviathan_music.mp3", gain: 1 },
    sennaHero: { src: "bgm/senna_music.mp3", gain: 0.82 },
  };

  const SFX = {
    button: { src: "bgm/button_push.mp3", gain: 1.15 },
    back: { src: "bgm/buck_push.mp3", gain: 1.15 },
    draw: { src: "bgm/draw_on_boosted.mp3", gain: 1 },
    attack: { src: "bgm/attack.mp3", gain: 1 },
    summon: { src: "bgm/monster_syoukann.mp3", gain: 0.55, interrupt: true },
    notice: { src: "bgm/notice.mp3", gain: 1.215 },
    win: { src: "bgm/win_music.mp3", gain: 1.1 },
    lose: { src: "bgm/lose_music.mp3", gain: 1.1 },
  };

  const SPECIAL_TRACKS = new Map([
    [1, "astro"],
    [6, "leviathan"],
    [10, "askara"],
    [24, "sennaHero"],
  ]);

  const BGM_VOLUME = 0.35;
  const SFX_VOLUME = 0.70;
  const DUCK_FACTOR = 0.35;
  const FADE_DURATION = 400;
  const STORAGE_KEY = "hypescript-dcg-sound-enabled";

  let enabled = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "false") enabled = false;
  } catch (_) {
    enabled = true;
  }

  let desiredBgmKey = null;
  let currentBgmKey = null;
  let currentBgm = null;
  let ducked = false;
  let hiddenPaused = false;
  let audioContext = null;
  let battleActive = false;
  let battleNpc = null;
  let specialOrder = [];
  const fadeFrames = new WeakMap();
  const activeSfx = new Set();
  const sfxByKey = new Map();

  function publishState() {
    document.documentElement.dataset.soundEnabled = String(enabled);
    document.documentElement.dataset.audioBgm = currentBgmKey ?? "";
    document.documentElement.dataset.audioDucked = String(ducked);
    document.documentElement.dataset.audioSfx = [...sfxByKey.keys()].join(",");
    document.documentElement.dataset.audioPaused = String(currentBgm?.paused ?? true);
  }

  function dispatchChange() {
    window.dispatchEvent(new CustomEvent("gameaudiochange", { detail: { enabled } }));
  }

  function effectiveBgmVolume(key) {
    const definition = BGM[key];
    if (!definition || !enabled || document.hidden) return 0;
    return Math.min(1, BGM_VOLUME * definition.gain * (ducked ? DUCK_FACTOR : 1));
  }

  function cancelFade(audio) {
    const frame = fadeFrames.get(audio);
    if (frame) window.cancelAnimationFrame(frame);
    fadeFrames.delete(audio);
  }

  function fade(audio, target, duration = FADE_DURATION, complete = null) {
    if (!audio) return;
    cancelFade(audio);
    const initial = audio.volume;
    const startedAt = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / Math.max(1, duration));
      audio.volume = Math.max(0, Math.min(1, initial + (target - initial) * progress));
      if (progress < 1) {
        fadeFrames.set(audio, window.requestAnimationFrame(step));
        return;
      }
      fadeFrames.delete(audio);
      complete?.();
    };
    fadeFrames.set(audio, window.requestAnimationFrame(step));
  }

  function makeAudio(definition, loop = false) {
    const audio = new Audio(definition.src);
    audio.preload = "none";
    audio.loop = loop;
    audio.playsInline = true;
    return audio;
  }

  function playBgm(key, { restart = false } = {}) {
    if (!BGM[key]) return;
    desiredBgmKey = key;
    if (!enabled || document.hidden) return;

    if (currentBgm && currentBgmKey === key) {
      if (restart) currentBgm.currentTime = 0;
      const promise = currentBgm.play();
      promise?.catch?.(() => {});
      fade(currentBgm, effectiveBgmVolume(key));
      publishState();
      return;
    }

    const previous = currentBgm;
    const next = makeAudio(BGM[key], true);
    next.volume = 0;
    currentBgm = next;
    currentBgmKey = key;
    publishState();
    const promise = next.play();
    promise?.catch?.(() => {});
    publishState();
    fade(next, effectiveBgmVolume(key));
    if (previous) {
      fade(previous, 0, FADE_DURATION, () => {
        previous.pause();
        previous.currentTime = 0;
      });
    }
  }

  function stopBgm({ preserveDesired = false } = {}) {
    if (!preserveDesired) desiredBgmKey = null;
    const previous = currentBgm;
    currentBgm = null;
    currentBgmKey = null;
    publishState();
    if (!previous) return;
    fade(previous, 0, FADE_DURATION, () => {
      previous.pause();
      previous.currentTime = 0;
    });
  }

  function registerSfx(key, audio) {
    activeSfx.add(audio);
    if (!sfxByKey.has(key)) sfxByKey.set(key, new Set());
    sfxByKey.get(key).add(audio);
    publishState();
    const cleanup = () => {
      activeSfx.delete(audio);
      sfxByKey.get(key)?.delete(audio);
      if (sfxByKey.get(key)?.size === 0) sfxByKey.delete(key);
      publishState();
    };
    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
  }

  function playSfx(key) {
    const definition = SFX[key];
    if (!definition || !enabled || document.hidden) return null;
    if (definition.interrupt) stopSfx(key);
    const audio = makeAudio(definition, false);
    audio.preload = "auto";
    audio.volume = Math.min(1, SFX_VOLUME * definition.gain);
    registerSfx(key, audio);
    const promise = audio.play();
    promise?.catch?.(() => {
      activeSfx.delete(audio);
      sfxByKey.get(key)?.delete(audio);
      if (sfxByKey.get(key)?.size === 0) sfxByKey.delete(key);
      publishState();
    });
    return audio;
  }

  function stopSfx(key) {
    const instances = [...(sfxByKey.get(key) ?? [])];
    instances.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      activeSfx.delete(audio);
    });
    sfxByKey.delete(key);
    publishState();
  }

  function stopAllSfx() {
    [...activeSfx].forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    activeSfx.clear();
    sfxByKey.clear();
    publishState();
  }

  function unlock() {
    const Context = window.AudioContext ?? window.webkitAudioContext;
    if (!Context) return;
    if (!audioContext) audioContext = new Context();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (_) {
      // Storage is optional. The current session still keeps the selected state.
    }
    if (!enabled) {
      if (currentBgm) {
        cancelFade(currentBgm);
        currentBgm.pause();
        currentBgm.volume = 0;
      }
      stopAllSfx();
    } else {
      unlock();
      if (desiredBgmKey) playBgm(desiredBgmKey);
    }
    dispatchChange();
    publishState();
    return enabled;
  }

  function toggle() {
    return setEnabled(!enabled);
  }

  function setDucked(nextDucked) {
    ducked = Boolean(nextDucked);
    publishState();
    if (currentBgm && currentBgmKey && enabled && !document.hidden) {
      fade(currentBgm, effectiveBgmVolume(currentBgmKey), 220);
    }
  }

  function baseBattleTrack() {
    return battleNpc === "senna" ? "sennaBattle" : "ioriBattle";
  }

  function enterBattle(npc, { restart = false } = {}) {
    const changedMatch = !battleActive || battleNpc !== npc;
    battleActive = true;
    battleNpc = npc === "senna" ? "senna" : "iori";
    if (changedMatch || restart) specialOrder = [];
    playBgm(baseBattleTrack(), { restart: changedMatch || restart });
  }

  function syncBattleCards(cards) {
    if (!battleActive) return;
    const present = new Map(
      cards
        .filter((card) => card && SPECIAL_TRACKS.has(card.id))
        .map((card) => [card.uid, card]),
    );
    specialOrder = specialOrder.filter((entry) => present.has(entry.uid));
    present.forEach((card, uid) => {
      if (!specialOrder.some((entry) => entry.uid === uid)) specialOrder.push({ uid, id: card.id });
    });
    const latest = specialOrder.at(-1);
    playBgm(latest ? SPECIAL_TRACKS.get(latest.id) : baseBattleTrack());
  }

  function finishBattle(playerWon) {
    battleActive = false;
    specialOrder = [];
    stopBgm();
    playSfx(playerWon ? "win" : "lose");
  }

  function setScene(scene, context = {}) {
    if (scene === "portal-splash" || scene === "game-select" || scene === "notice") {
      battleActive = false;
      stopBgm();
      return;
    }
    if (scene === "title") {
      battleActive = false;
      playBgm("opening");
      return;
    }
    if (["guide", "npc", "deck", "deck-builder", "deck-detail", "card-catalog"].includes(scene)) {
      battleActive = false;
      playBgm("afterOpening");
      return;
    }
    if (scene === "order") enterBattle(context.npc ?? battleNpc ?? "iori", { restart: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenPaused = Boolean(currentBgm && !currentBgm.paused);
      currentBgm?.pause();
      publishState();
      stopAllSfx();
      return;
    }
    if (hiddenPaused && enabled && currentBgm) {
      const promise = currentBgm.play();
      promise?.catch?.(() => {});
      fade(currentBgm, effectiveBgmVolume(currentBgmKey));
      publishState();
    }
    hiddenPaused = false;
  });

  window.GameAudio = {
    unlock,
    isEnabled: () => enabled,
    setEnabled,
    toggle,
    playSfx,
    stopSfx,
    playBgm,
    stopBgm,
    setDucked,
    setScene,
    enterBattle,
    syncBattleCards,
    finishBattle,
    getState: () => ({
      enabled,
      desiredBgmKey,
      currentBgmKey,
      ducked,
      battleActive,
      battleNpc,
      specialOrder: [...specialOrder],
      currentPaused: currentBgm?.paused ?? true,
      currentTime: currentBgm?.currentTime ?? 0,
      currentVolume: currentBgm?.volume ?? 0,
      activeSfx: Object.fromEntries([...sfxByKey].map(([key, instances]) => [key, instances.size])),
    }),
  };
  publishState();
})();
