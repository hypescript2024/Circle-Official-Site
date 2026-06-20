/*
  aokanayou intro effect
  本体サイトへ組み込む時は、制作物一覧の試し読みリンクを ./aokana.html に変更してください。
  Noteの遷移先だけを変えたい場合は、下の noteUrl を差し替えます。
*/
const AOKANAYOU_INTRO_CONFIG = {
  noteUrl: "https://note.com/hypescript/n/n6ca42201d86a",
  shortLineDuration: 3600,
  longLineDuration: 7000,
  lineGap: 360,
  finalRedirectDelay: 4000
};

const memoryLines = [
  "今日、仏教は受難の時代です\nしかし君ならこの闇をも切り払ってくれると、私は確信しています。",
  "おねがい。──あたしを、助けてください",
  "こいつはまさに鬼の武器だ。ぎらついた肌の屈強な益荒男が息を切らし！\n汗を飛ばし！　雄ォ叫びを上げながら揮う巨大包丁ッ！",
  "いい旅をな。",
  "あの人は、お前に託そうとしているのかもしれねえな",
  "それでいつか、蒼き彼方の地でまた逢おう"
];

/* セリフの表示位置。完全ランダムではなく、画面内で記憶が漂うように順番に使います。 */
const linePositions = [
  { left: "50%", top: "28%" },
  { left: "58%", top: "42%" },
  { left: "50%", top: "56%" },
  { left: "32%", top: "39%" },
  { left: "56%", top: "31%" },
  { left: "48%", top: "63%" }
];

const intro = document.querySelector(".aokanayou-intro");
const memoryLine = document.querySelector("#memoryLine");
const finalLine = document.querySelector("#finalLine");
const bubbleField = document.querySelector(".bubble-field");
const skipButton = document.querySelector("#skipButton");

let isLeaving = false;

createAmbientBubbles();
bindSkipActions();
playMemorySequence();
window.addEventListener("resize", fitCurrentMemoryLine);

function createAmbientBubbles() {
  const bubbleCount = 28;

  for (let index = 0; index < bubbleCount; index += 1) {
    const bubble = document.createElement("span");
    const size = 6 + (index % 7) * 3;
    const left = (index * 37) % 100;
    const duration = 12 + (index % 6) * 2.8;
    const delay = -1 * ((index * 1.7) % 14);
    const sway = index % 2 === 0 ? `${12 + index}px` : `${-12 - index}px`;
    const opacity = 0.12 + (index % 5) * 0.055;

    bubble.className = "ambient-bubble";
    bubble.style.setProperty("--size", `${size}px`);
    bubble.style.setProperty("--left", `${left}%`);
    bubble.style.setProperty("--duration", `${duration}s`);
    bubble.style.setProperty("--delay", `${delay}s`);
    bubble.style.setProperty("--sway", sway);
    bubble.style.setProperty("--opacity", opacity);
    bubbleField.appendChild(bubble);
  }
}

function bindSkipActions() {
  skipButton.addEventListener("click", (event) => {
    event.stopPropagation();
    goToNote();
  });

  /* 画面タップでも演出を飛ばせるようにします。 */
  intro.addEventListener("click", (event) => {
    if (event.target === skipButton) {
      return;
    }

    goToNote();
  });
}

async function playMemorySequence() {
  for (let index = 0; index < memoryLines.length; index += 1) {
    if (isLeaving) {
      return;
    }

    const line = memoryLines[index];
    const duration = getLineDuration(line);
    showMemoryLine(line, linePositions[index], duration);
    await wait(duration + AOKANAYOU_INTRO_CONFIG.lineGap);
  }

  if (isLeaving) {
    return;
  }

  showFinalLine();
  await wait(AOKANAYOU_INTRO_CONFIG.finalRedirectDelay);
  goToNote();
}

function showMemoryLine(text, position, duration) {
  memoryLine.classList.remove("is-visible");
  memoryLine.innerHTML = formatMemoryLine(text);
  memoryLine.style.setProperty("--line-left", position.left);
  memoryLine.style.setProperty("--line-top", position.top);
  memoryLine.style.setProperty("--line-duration", `${duration}ms`);

  fitCurrentMemoryLine();

  /* 同じ要素でアニメーションを繰り返すため、強制的に再計算を挟みます。 */
  void memoryLine.offsetWidth;
  memoryLine.classList.add("is-visible");
}

/* 長いセリフもできるだけ1行で見せるため、画面幅に合わせて縮小率を更新します。 */
function fitCurrentMemoryLine() {
  if (!memoryLine.textContent) {
    return;
  }

  memoryLine.style.setProperty("--line-scale", "1");
  const availableWidth = window.innerWidth * 0.92;
  const naturalWidth = memoryLine.scrollWidth;
  const scale = Math.min(1, Math.max(0.38, availableWidth / naturalWidth));
  memoryLine.style.setProperty("--line-scale", scale.toFixed(3));
  memoryLine.style.setProperty("--line-scale-start", (scale * 0.96).toFixed(3));
  memoryLine.style.setProperty("--line-scale-end", (scale * 1.04).toFixed(3));
}

/* 配列内で明示した改行だけを <br> として反映します。 */
function formatMemoryLine(text) {
  return text
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br>");
}

function escapeHtml(text) {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return text.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

function getLineDuration(text) {
  return text.length >= 6
    ? AOKANAYOU_INTRO_CONFIG.longLineDuration
    : AOKANAYOU_INTRO_CONFIG.shortLineDuration;
}

function showFinalLine() {
  memoryLine.classList.remove("is-visible");
  memoryLine.textContent = "";
  intro.classList.add("is-climax");
  finalLine.setAttribute("aria-hidden", "false");
  finalLine.classList.add("is-visible");
}

function goToNote() {
  if (isLeaving) {
    return;
  }

  isLeaving = true;
  window.location.href = AOKANAYOU_INTRO_CONFIG.noteUrl;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
