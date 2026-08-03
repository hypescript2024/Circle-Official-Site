(() => {
  const MAX_ATTEMPTS = 7;
  const TARGET_COUNT = 5;
  const MOVE_SPEED = 27;
  const FINAL_CHANCE_SPEED_MULTIPLIER = 12;
  const FINAL_FIRST_LINE_DURATION = 3200;
  const FINAL_SECOND_LINE_DURATION = 1800;
  const HERO_CUTIN_ENTRY_DURATION = 260;
  const HERO_CUTIN_DURATION = 2800;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RISE_DURATION = REDUCED_MOTION ? 80 : 780;
  const HOLD_DURATION = REDUCED_MOTION ? 30 : 130;
  const RETURN_DURATION = REDUCED_MOTION ? 80 : 590;
  const LAUNCH_DURATION = RISE_DURATION + HOLD_DURATION + RETURN_DURATION;

  const chanceCount = document.getElementById("chanceCount");
  const cleanCount = document.getElementById("cleanCount");
  const playScreen = document.getElementById("playScreen");
  const cleanerMover = document.getElementById("cleanerMover");
  const cleaner = document.getElementById("cleaner");
  const osogButton = document.getElementById("osogButton");
  const heroButton = document.getElementById("heroButton");
  const heroCutin = document.getElementById("heroCutin");
  const feedback = document.getElementById("gameFeedback");
  const moonWrap = document.getElementById("moonWrap");
  const dirtLayers = [...document.querySelectorAll(".moon-dirt")];
  const countdownOverlay = document.getElementById("countdownOverlay");
  const countdownText = document.getElementById("countdownText");
  const resultOverlay = document.getElementById("resultOverlay");
  const resultPanel = document.getElementById("resultPanel");
  const resultKicker = document.getElementById("resultKicker");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const rewardModal = document.getElementById("rewardModal");
  const rewardModalClose = document.getElementById("rewardModalClose");
  const tweetButton = document.getElementById("tweetButton");
  const confetti = document.getElementById("confetti");
  const cleanerSpeech = document.querySelector(".cleaner-speech");
  const cleanerHitArea = document.querySelector(".cleaner-hit-area");

  let attempts = 0;
  let cleaned = Array(TARGET_COUNT).fill(false);
  let cleanerX = 8;
  let direction = 1;
  let lastFrame = null;
  let gameState = "countdown";
  let launchLocked = false;
  let finalCleanActive = false;
  let heroUsed = false;

  const updateHeroButtonState = () => {
    const remainingAttempts = MAX_ATTEMPTS - attempts;
    const shouldShow = gameState === "playing"
      && finalCleanActive
      && remainingAttempts === 1
      && !heroUsed;

    heroButton.hidden = !shouldShow;
    heroButton.disabled = !shouldShow || launchLocked;
  };

  const updateStatus = () => {
    chanceCount.textContent = String(MAX_ATTEMPTS - attempts);
    cleanCount.textContent = String(cleaned.filter(Boolean).length);
    updateHeroButtonState();
  };

  const moveCleaner = (timestamp) => {
    if (lastFrame === null) lastFrame = timestamp;
    const elapsed = Math.min((timestamp - lastFrame) / 1000, 0.05);
    lastFrame = timestamp;

    if (gameState === "playing" && !launchLocked) {
      const remainingTargets = TARGET_COUNT - cleaned.filter(Boolean).length;
      const currentMoveSpeed = !heroUsed && finalCleanActive && remainingTargets === 1
        ? MOVE_SPEED * FINAL_CHANCE_SPEED_MULTIPLIER
        : MOVE_SPEED;
      cleanerX += direction * currentMoveSpeed * elapsed;
      if (cleanerX >= 94) {
        cleanerX = 94;
        direction = -1;
      } else if (cleanerX <= 6) {
        cleanerX = 6;
        direction = 1;
      }
      cleanerMover.style.left = `${cleanerX}%`;
      cleanerMover.classList.toggle("speech-left", cleanerX > 72);
    }

    if (gameState !== "result") requestAnimationFrame(moveCleaner);
  };

  const measureAim = () => {
    const moonRect = moonWrap.getBoundingClientRect();
    const ragRect = cleanerHitArea.getBoundingClientRect();
    const zoneWidth = moonRect.width / TARGET_COUNT;
    const edgeAllowance = Math.min(4, zoneWidth * 0.07);
    const ragLeft = ragRect.left - edgeAllowance;
    const ragRight = ragRect.right + edgeAllowance;
    const requiredOverlap = Math.max(7, Math.min(ragRect.width, zoneWidth) * 0.2);

    if (ragRight < moonRect.left || ragLeft > moonRect.right) {
      return { zone: -1, reason: "outside" };
    }

    const overlaps = cleaned.map((isClean, zoneIndex) => {
      const zoneLeft = moonRect.left + zoneWidth * zoneIndex;
      const zoneRight = zoneLeft + zoneWidth;
      return {
        zone: zoneIndex,
        isClean,
        overlap: Math.max(0, Math.min(ragRight, zoneRight) - Math.max(ragLeft, zoneLeft)),
      };
    });
    const dirtyHit = overlaps
      .filter(({ isClean, overlap }) => !isClean && overlap >= requiredOverlap)
      .sort((a, b) => b.overlap - a.overlap)[0];

    if (dirtyHit) return { zone: dirtyHit.zone, reason: "hit" };

    const cleanHit = overlaps.some(({ isClean, overlap }) => isClean && overlap >= requiredOverlap);
    return { zone: -1, reason: cleanHit ? "already-clean" : "off-target" };
  };

  const prepareLaunchDistance = () => {
    const moonRect = moonWrap.getBoundingClientRect();
    const cleanerRect = cleaner.getBoundingClientRect();
    return Math.ceil(cleanerRect.bottom - moonRect.top + cleanerRect.height * 0.7);
  };

  const setFeedback = (message, state = "") => {
    feedback.textContent = message;
    feedback.classList.toggle("is-hit", state === "hit");
    feedback.classList.toggle("is-miss", state === "miss");
  };

  const createConfetti = () => {
    const colors = ["#f1c75b", "#67d8c5", "#ffffff", "#e83a36"];
    for (let index = 0; index < 28; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${(index * 37) % 100}%`;
      piece.style.setProperty("--piece-color", colors[index % colors.length]);
      piece.style.setProperty("--fall-time", `${2.1 + (index % 6) * 0.22}s`);
      piece.style.setProperty("--fall-delay", `${(index % 8) * -0.23}s`);
      piece.style.setProperty("--drift", `${-55 + (index % 9) * 14}px`);
      confetti.appendChild(piece);
    }
  };

  const updatePostLink = () => {
    const shareUrl = "https://hypescript2024.github.io/Circle-Official-Site/yoruaka_clear_share.html";
    const shareLines = ["『夜の赤月』ミニゲームクリア！", "", "感想は…", ""];

    if (shareUrl) shareLines.push(`ミニゲームはこちら→${shareUrl}`, "");
    shareLines.push("#HypeScript #夜の赤月 #月のお掃除");

    const tweetParams = new URLSearchParams({ text: shareLines.join("\n") });
    tweetButton.href = `https://x.com/intent/tweet?${tweetParams.toString()}`;
  };

  const finishGame = (cleared) => {
    gameState = "result";
    osogButton.disabled = true;
    heroButton.disabled = true;
    heroButton.hidden = true;
    resultOverlay.hidden = false;
    resultPanel.hidden = false;
    rewardModal.hidden = true;

    if (cleared) {
      moonWrap.classList.add("is-complete");
      resultPanel.hidden = true;
      rewardModal.hidden = false;
      updatePostLink();
      resultKicker.textContent = "Moon Cleaned!";
      resultTitle.textContent = "CONGRATULATION！！";
      resultMessage.textContent = "お月様がピッカピカになったよ！　お掃除、大成功！";
      createConfetti();
    } else {
      resultKicker.textContent = "Almost Clean!";
      resultTitle.textContent = "惜しい！";
      resultMessage.textContent = "またプレイしてください";
    }
  };

  const launchCleaner = () => {
    if (gameState !== "playing" || launchLocked) return;

    launchLocked = true;
    attempts += 1;
    osogButton.disabled = true;
    const aim = measureAim();
    const launchDistance = prepareLaunchDistance();
    setFeedback("おそうじ、いってらっしゃい！");
    cleaner.classList.add("is-running");
    cleaner.style.transition = "none";
    cleaner.style.transform = "translateY(0) scale(1)";
    void cleaner.offsetWidth;
    cleaner.style.transition = `transform ${RISE_DURATION}ms cubic-bezier(0.2, 0.72, 0.24, 1)`;
    cleaner.style.transform = `translateY(${-launchDistance}px) scale(0.84) rotate(-7deg)`;
    updateStatus();

    window.setTimeout(() => {
      cleaner.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.55, 0, 0.35, 1)`;
      cleaner.style.transform = "translateY(0) scale(1) rotate(0deg)";
    }, RISE_DURATION + HOLD_DURATION);

    window.setTimeout(() => {
      if (aim.zone >= 0) {
        cleaned[aim.zone] = true;
        dirtLayers[aim.zone].classList.add("is-clean");
        const cleanTotal = cleaned.filter(Boolean).length;
        if (!finalCleanActive) {
          cleanerSpeech.textContent = cleanTotal % 2 === 1 ? "やったルビィ" : "がんばルビィ";
        }
        setFeedback("ピカッ！　きれいになったよ！", "hit");
      } else {
        setFeedback("ビールでも飲んでリラックスしな", "miss");
      }
      updateStatus();
    }, LAUNCH_DURATION * 0.48);

    window.setTimeout(() => {
      cleaner.classList.remove("is-running");
      cleaner.style.transition = "";
      cleaner.style.transform = "";
      const cleanTotal = cleaned.filter(Boolean).length;

      if (cleanTotal === TARGET_COUNT) {
        finishGame(true);
        return;
      }
      if (attempts >= MAX_ATTEMPTS) {
        finishGame(false);
        return;
      }

      if (cleanTotal === TARGET_COUNT - 1 && !finalCleanActive) {
        finalCleanActive = true;
        cleanerMover.classList.toggle("speech-left", cleanerX > 50);
        cleanerSpeech.classList.add("is-long");
        cleanerSpeech.textContent = "ゆったりさんと書いてあったな";
        window.setTimeout(() => {
          if (gameState !== "playing" || !finalCleanActive) return;
          cleanerSpeech.classList.remove("is-long");
          cleanerSpeech.textContent = "あれは嘘だ";
          setFeedback("ええっ！");
          window.setTimeout(() => {
            if (gameState !== "playing" || !finalCleanActive) return;
            cleanerSpeech.hidden = true;
            launchLocked = false;
            osogButton.disabled = false;
            updateHeroButtonState();
            setFeedback("光の速度で掃除した事はあるかい");
          }, FINAL_SECOND_LINE_DURATION);
        }, FINAL_FIRST_LINE_DURATION);
        return;
      }

      launchLocked = false;
      osogButton.disabled = false;
      updateHeroButtonState();
      if (aim.zone >= 0) setFeedback("次はどこを磨こうかな？");
    }, LAUNCH_DURATION + 40);
  };

  const summonHero = () => {
    if (gameState !== "playing" || launchLocked || !finalCleanActive || heroUsed) return;

    heroUsed = true;
    launchLocked = true;
    osogButton.disabled = true;
    updateHeroButtonState();
    playScreen.classList.add("is-cutin-paused");

    heroCutin.hidden = false;
    heroCutin.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      cleanerSpeech.hidden = false;
      cleanerSpeech.textContent = "ひぇ";
    }, REDUCED_MOTION ? 10 : HERO_CUTIN_ENTRY_DURATION);

    window.setTimeout(() => {
      heroCutin.hidden = true;
      heroCutin.setAttribute("aria-hidden", "true");
      window.requestAnimationFrame(() => {
        cleanerSpeech.hidden = false;
        cleanerSpeech.textContent = "😅";
        setFeedback("調子乗りました、すんません");
        playScreen.classList.remove("is-cutin-paused");
        launchLocked = false;
        osogButton.disabled = false;
        updateHeroButtonState();
      });
    }, REDUCED_MOTION ? 40 : HERO_CUTIN_DURATION);
  };

  const runCountdown = () => {
    const messages = ["3", "2", "1", "ゲームスタート！"];
    messages.forEach((message, index) => {
      window.setTimeout(() => {
        countdownText.textContent = message;
        countdownText.classList.toggle("is-start", index === messages.length - 1);
        countdownText.style.animation = "none";
        void countdownText.offsetWidth;
        countdownText.style.animation = "";
      }, index * 760);
    });

    window.setTimeout(() => {
      countdownOverlay.hidden = true;
      gameState = "playing";
      osogButton.disabled = false;
      setFeedback("お掃除屋さんはゆったりさん！　しっかり見極めて《OSOG》！");
    }, messages.length * 760);
  };

  osogButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    launchCleaner();
  });
  heroButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    summonHero();
  });
  cleanerMover.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    launchCleaner();
  });

  rewardModalClose.addEventListener("click", () => {
    rewardModal.hidden = true;
    resultPanel.hidden = false;
    rewardModalClose.blur();
  });
  tweetButton.addEventListener("click", updatePostLink);

  updateStatus();
  cleanerMover.style.left = `${cleanerX}%`;
  requestAnimationFrame(moveCleaner);
  runCountdown();
})();
