/*
  blackdeath intro sequence
  URLを差し替える場合は BLACKDEATH_CONFIG.noteUrl だけを変更。
*/
const BLACKDEATH_CONFIG = {
  noteUrl: "https://note.com/hypescript/n/nc7f00186f84d",
  firstLine: "わたしも地獄を見ました",
  secondLine: "あなたは何故、旅を続けるのですか",
  firstLineDuration: 4000,
  secondLineDuration: 4000,
  clearDuration: 240
};

const glitchLine = document.querySelector("#glitchLine");

playBlackdeathIntro();

async function playBlackdeathIntro() {
  showGlitchLine(BLACKDEATH_CONFIG.firstLine);
  await wait(BLACKDEATH_CONFIG.firstLineDuration);

  clearGlitchLine();
  await wait(BLACKDEATH_CONFIG.clearDuration);

  showGlitchLine(BLACKDEATH_CONFIG.secondLine);
  await wait(BLACKDEATH_CONFIG.secondLineDuration);

  window.location.href = BLACKDEATH_CONFIG.noteUrl;
}

function showGlitchLine(text) {
  glitchLine.classList.remove("is-clearing", "is-visible");
  glitchLine.textContent = text;
  glitchLine.dataset.text = text;

  /* 同じ要素でエフェクトを再生し直すため、再計算を挟みます。 */
  void glitchLine.offsetWidth;
  glitchLine.classList.add("is-visible");
}

function clearGlitchLine() {
  glitchLine.classList.remove("is-visible");
  glitchLine.classList.add("is-clearing");

  window.setTimeout(() => {
    glitchLine.textContent = "";
    glitchLine.dataset.text = "";
  }, BLACKDEATH_CONFIG.clearDuration);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
