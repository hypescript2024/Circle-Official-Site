"use strict";

const CHARACTER_IMAGES = {
  senna: ["../images/card/char_illust/senna_ochikubo.jpg"],
  iori: ["../images/card/char_illust/iori_yotaka.jpg"],
};

const NPCS = {
  senna: {
    name: "落窪 千奈",
    reading: "おちくぼ せんな",
    note: "HARD/BALANCE",
    confirmation: "これは、命懸けのデュエルだから(落)",
  },
  iori: {
    name: "夜鷹 伊織",
    reading: "よたか いおり",
    note: "NORMAL/ATTACKER",
    confirmation: "あたし、こーいうの結構強いんだよ！(伊)",
  },
};

const DECKS = {
  recovery: {
    name: "回復型",
    english: "RECOVERY",
    image: "../images/card/monster_card_illust/kyouboasukarakamasu.png",
    confirmation: "回復効果を軸に、長期戦で優位を形成するデッキ。",
  },
  assault: {
    name: "攻撃型",
    english: "ASSAULT",
    image: "../images/card/monster_card_illust/astro.png",
    confirmation: "小細工なし、ひたすら高火力で押すデッキ。",
  },
  balance: {
    name: "均衡型",
    english: "BALANCE",
    image: "../images/card/monster_card_illust/leviathan.png",
    confirmation: "火力と回復を両立し、柔軟に対応するデッキ。",
  },
};

const CUSTOM_DECK_RULES = Object.freeze({
  size: 25,
  minCostZero: 7,
  excludedIds: new Set([24]),
  aceIds: new Set([1, 6, 10]),
});

const ENTRY_GAMES = {
  cleaning: {
    index: "SELECT / 01",
    title: "お掃除を始めますか？",
    logo: "../images/card/title_logo/MoonCLEANING_logo_add.png",
    logoAlt: "Moon Cleaning",
    href: "../yoruaka_menu.html?v=20260821-2",
  },
  card: {
    index: "SELECT / 02",
    title: "DCGを始めますか？",
    logo: "../images/card/title_logo/dawn_taitle_logo3.png",
    logoAlt: "夜の赤月 -Today Once More- デジタルカードゲーム",
  },
};

const state = {
  screen: "portal-splash",
  selectedNpc: null,
  selectedDeck: null,
  pendingSelection: null,
  pendingEntryGame: null,
  transitioning: false,
  orderTimer: 0,
  portalTimer: 0,
  noticeTimer: 0,
  noticeFinished: false,
  playerGoesFirst: null,
  openingDeckDetail: false,
  customDeckCounts: {},
  customDeckDefinition: null,
};

const screens = new Map(
  [...document.querySelectorAll("[data-screen]")].map((screen) => [screen.dataset.screen, screen]),
);
const confirmDialog = document.querySelector("#confirm-dialog");
const confirmIndex = document.querySelector("#confirm-index");
const confirmTitle = document.querySelector("#confirm-title");
const confirmDetail = document.querySelector("#confirm-detail");
const confirmPortrait = document.querySelector("#confirm-portrait");
const confirmYes = document.querySelector("#dialog-yes");
const confirmNo = document.querySelector("#dialog-no");
const confirmClose = document.querySelector("#dialog-x");
const confirmDeckDetail = document.querySelector("#dialog-deck-detail");
const gameEntryDialog = document.querySelector("#game-entry-dialog");
const gameEntryIndex = document.querySelector("#game-entry-index");
const gameEntryLogo = document.querySelector("#game-entry-logo");
const gameEntryTitle = document.querySelector("#game-entry-title");
const gameEntryYes = document.querySelector("#game-entry-yes");
const gameEntryNo = document.querySelector("#game-entry-no");
const gameEntryClose = document.querySelector("#game-entry-close");
const gamePreviewVideos = [...document.querySelectorAll(".game-choice video")];
const noticeScreen = document.querySelector("[data-screen='notice']");
const creditDialog = document.querySelector("#credit-dialog");
const creditDialogClose = document.querySelector("#credit-dialog-close");
const orderWord = document.querySelector("#order-word");
const orderReading = document.querySelector("#order-reading");
const summaryNpc = document.querySelector("#summary-npc");
const summaryDeck = document.querySelector("#summary-deck");
const customDeckEntry = document.querySelector("#custom-deck-entry");
const customDeckGrid = document.querySelector("#deck-builder-grid");
const customDeckStatus = document.querySelector(".deck-builder-status");
const customDeckTotal = document.querySelector("#deck-builder-total");
const customDeckCurve = document.querySelector("#deck-builder-curve");
const customDeckRequirement = document.querySelector("#deck-builder-requirement");
const useCustomDeckButton = document.querySelector("#use-custom-deck-button");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setCharacterImage(image, character) {
  if (!image) return;
  const sources = CHARACTER_IMAGES[character] ?? CHARACTER_IMAGES.senna;
  let sourceIndex = 0;
  image.dataset.characterImage = character;
  image.onload = () => image.classList.remove("image-missing");
  image.onerror = () => {
    if (sourceIndex < sources.length) {
      image.src = sources[sourceIndex];
      sourceIndex += 1;
      return;
    }
    image.classList.add("image-missing");
  };
  image.src = sources[sourceIndex];
  sourceIndex += 1;
}

function installCharacterImages() {
  document.querySelectorAll("[data-character-image]").forEach((image) => {
    setCharacterImage(image, image.dataset.characterImage);
  });
}

function npcBattleDeck(key) {
  return key === "senna" ? "balance" : "iori";
}

function updateBattleNpcPresentation(key) {
  const npc = NPCS[key] ?? NPCS.iori;
  const image = document.querySelector("#battle-opponent-image");
  const name = document.querySelector("#battle-opponent-name");
  const style = document.querySelector("#battle-opponent-style");
  const heading = document.querySelector("#battle-heading");
  const enemyField = document.querySelector(".enemy-field");
  setCharacterImage(image, key);
  image.alt = npc.name.replaceAll(" ", "");
  name.textContent = npc.name;
  style.textContent = npc.note.replace("HARD/", "HARD / ").replace("NORMAL/", "NORMAL / ");
  heading.textContent = `${npc.name.replaceAll(" ", "")}との対戦`;
  enemyField?.setAttribute("aria-label", `${npc.name.replaceAll(" ", "")}のフィールド`);
  document.querySelector("#npc-hand")?.setAttribute("aria-label", `${npc.name.replaceAll(" ", "")}の手札`);
  document.querySelector("#npc-sub-slots")?.setAttribute("aria-label", `${npc.name.replaceAll(" ", "")}のサブアタッカー`);
  document.querySelector("#npc-main-slot")?.setAttribute("aria-label", `${npc.name.replaceAll(" ", "")}のメインアタッカー`);
  document.querySelector("#npc-seeds")?.setAttribute("aria-label", `${npc.name.replaceAll(" ", "")}の種ゾーン`);
}

function screenHeading(screen) {
  return screen.querySelector("h1, h2") ?? screen;
}

function setPreviewVideosActive(active) {
  gamePreviewVideos.forEach((video) => {
    if (!active) {
      video.pause();
      return;
    }
    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  });
}

function playUiSound(kind) {
  window.GameAudio?.playSfx(kind);
}

function updateSoundButtons() {
  const enabled = window.GameAudio?.isEnabled() ?? true;
  document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
    button.textContent = enabled ? "SOUND ON" : "SOUND OFF";
    button.setAttribute("aria-pressed", String(enabled));
  });
}

function clearCustomDeckState() {
  state.customDeckCounts = {};
  state.customDeckDefinition = null;
  if (state.selectedDeck === "custom") state.selectedDeck = null;
}

async function showScreen(name) {
  if (state.transitioning || name === state.screen || !screens.has(name)) {
    return;
  }

  if (name === "title") clearCustomDeckState();

  state.transitioning = true;
  window.clearTimeout(state.orderTimer);
  if (state.screen === "guide" && name !== "guide") {
    window.GameTutorial?.stop();
  }

  const current = screens.get(state.screen);
  const next = screens.get(name);
  if (state.screen === "notice" && name !== "notice") {
    window.clearTimeout(state.noticeTimer);
    window.GameAudio?.stopSfx("notice");
  }
  current.classList.add("is-leaving");

  await new Promise((resolve) => window.setTimeout(resolve, reduceMotion.matches ? 0 : 190));

  current.classList.remove("is-active", "is-leaving");
  current.hidden = true;
  next.hidden = false;
  next.classList.remove("is-leaving");

  window.requestAnimationFrame(() => next.classList.add("is-active"));
  state.screen = name;
  state.transitioning = false;
  setPreviewVideosActive(name === "game-select");
  window.GameAudio?.setScene(name, { npc: state.selectedNpc ?? "iori" });

  const heading = screenHeading(next);
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });

  if (name === "order") {
    revealOrder();
  }
  if (name === "guide") {
    window.GameTutorial?.start();
  }
}

function openEntryConfirmation(key) {
  const entry = ENTRY_GAMES[key];
  if (!entry) return;
  state.pendingEntryGame = key;
  gameEntryIndex.textContent = entry.index;
  gameEntryTitle.textContent = entry.title;
  gameEntryLogo.src = entry.logo;
  gameEntryLogo.alt = entry.logoAlt;
  gameEntryDialog.showModal();
}

async function finishNotice() {
  if (state.noticeFinished || state.screen !== "notice") return;
  state.noticeFinished = true;
  window.clearTimeout(state.noticeTimer);
  window.GameAudio?.stopSfx("notice");
  await showScreen("title");
}

async function enterNotice() {
  state.noticeFinished = false;
  await showScreen("notice");
  state.noticeTimer = window.setTimeout(finishNotice, 10000);
}

async function acceptEntryGame() {
  const key = state.pendingEntryGame;
  const entry = ENTRY_GAMES[key];
  if (!entry) return;
  if (!entry.href) {
    window.GameAudio?.unlock();
    window.GameAudio?.playSfx("notice");
  }
  state.pendingEntryGame = null;
  gameEntryDialog.close();
  if (entry.href) {
    window.location.href = entry.href;
    return;
  }
  await enterNotice();
}

function openNpcConfirmation(key) {
  const npc = NPCS[key];
  if (!npc) return;

  state.pendingSelection = { type: "npc", key };
  confirmIndex.textContent = `CONFIRM / ENEMY ${key === "senna" ? "01" : "02"}`;
  confirmTitle.textContent = `${npc.name.replaceAll(" ", "")}でよろしいですか？`;
  confirmDetail.textContent = npc.confirmation;
  const portraitImage = confirmPortrait.querySelector("img");
  setCharacterImage(portraitImage, key);
  portraitImage.alt = npc.name;
  confirmPortrait.classList.remove("is-deck");
  confirmDialog.classList.remove("is-deck-confirmation");
  confirmDeckDetail.hidden = true;
  confirmDialog.showModal();
}

function openDeckConfirmation(key) {
  const deck = DECKS[key];
  if (!deck) return;

  state.pendingSelection = { type: "deck", key };
  confirmIndex.textContent = `CONFIRM / DECK ${deck.english}`;
  confirmTitle.textContent = `${deck.name}デッキでよろしいですか？`;
  confirmDetail.textContent = deck.confirmation;
  const portraitImage = confirmPortrait.querySelector("img");
  delete portraitImage.dataset.characterImage;
  portraitImage.classList.remove("image-missing");
  portraitImage.onload = () => portraitImage.classList.remove("image-missing");
  portraitImage.onerror = () => portraitImage.classList.add("image-missing");
  portraitImage.src = deck.image;
  portraitImage.draggable = false;
  portraitImage.alt = `${deck.name}デッキのイメージ`;
  confirmPortrait.classList.add("is-deck");
  confirmDialog.classList.add("is-deck-confirmation");
  confirmDeckDetail.hidden = false;
  confirmDialog.showModal();
}

function escapeCatalogHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[character]);
}

function catalogCardMarkup(card) {
  const art = card.art
    ? `<img src="${escapeCatalogHtml(card.art)}" alt="" draggable="false">`
    : escapeCatalogHtml(card.name.slice(0, 1));
  const count = card.count ? `<span class="catalog-card-count">×${card.count}</span>` : "";
  return `<button class="catalog-card" type="button" data-reference-card="${card.id}" style="--card-accent:${card.accent}" aria-label="${escapeCatalogHtml(card.name)}。タップで詳細表示">
    <span class="catalog-card-id"><span>No ${String(card.id).padStart(3, "0")}</span><span>COST ${card.cost}</span></span>
    <span class="catalog-card-art${card.art ? " has-art" : ""}">${art}</span>
    <strong class="catalog-card-name">${escapeCatalogHtml(card.name)}</strong>
    ${count}
    <span class="catalog-card-stats"><span>HP ${card.hp}</span><span>AT ${card.id === 24 ? "???" : card.at}</span></span>
  </button>`;
}

function installCatalogLongPress(container, allowArtZoom = false) {
  container.querySelectorAll("[data-reference-card]").forEach((button) => {
    button.addEventListener("click", () => {
      window.CardCatalog?.openCardReference(Number(button.dataset.referenceCard), { allowArtZoom });
    });
  });
}

function renderDeckDetail(deckKey) {
  const deck = DECKS[deckKey] ?? DECKS.balance;
  const cards = window.CardCatalog?.getDeckCards(deckKey) ?? [];
  const total = cards.reduce((sum, card) => sum + card.count, 0);
  const curve = [0, 1, 2, 3].map((cost) => cards.filter((card) => card.cost === cost).reduce((sum, card) => sum + card.count, 0));
  document.querySelector("#deck-detail-heading").textContent = `${deck.name}デッキ`;
  document.querySelector("#deck-detail-summary").textContent = `${total}枚｜コスト 0:${curve[0]} / 1:${curve[1]} / 2:${curve[2]} / 3:${curve[3]}　タップで詳細表示`;
  const grid = document.querySelector("#deck-detail-grid");
  grid.innerHTML = cards.map(catalogCardMarkup).join("");
  installCatalogLongPress(grid);
}

function renderAllCards() {
  const grid = document.querySelector("#all-card-grid");
  const cards = window.CardCatalog?.getAllCards() ?? [];
  grid.innerHTML = cards.map(catalogCardMarkup).join("");
  installCatalogLongPress(grid, true);
}

function customDeckCards() {
  return (window.CardCatalog?.getAllCards() ?? [])
    .filter((card) => !CUSTOM_DECK_RULES.excludedIds.has(card.id));
}

function customDeckCardLimit(cardId) {
  return CUSTOM_DECK_RULES.aceIds.has(cardId) ? 1 : 3;
}

function customDeckMetrics() {
  const cards = customDeckCards();
  const curve = [0, 1, 2, 3].map((cost) => cards
    .filter((card) => card.cost === cost)
    .reduce((sum, card) => sum + (Number(state.customDeckCounts[card.id]) || 0), 0));
  const total = curve.reduce((sum, count) => sum + count, 0);
  const aceCount = cards
    .filter((card) => CUSTOM_DECK_RULES.aceIds.has(card.id))
    .reduce((sum, card) => sum + (Number(state.customDeckCounts[card.id]) || 0), 0);
  const valid = total === CUSTOM_DECK_RULES.size
    && curve[0] >= CUSTOM_DECK_RULES.minCostZero
    && aceCount <= 1;
  return { cards, curve, total, aceCount, valid };
}

function customDeckDefinition() {
  return customDeckCards()
    .map((card) => [card.id, Number(state.customDeckCounts[card.id]) || 0])
    .filter(([, count]) => count > 0);
}

function canAddCustomCard(card, metrics) {
  const count = Number(state.customDeckCounts[card.id]) || 0;
  if (metrics.total >= CUSTOM_DECK_RULES.size || count >= customDeckCardLimit(card.id)) return false;
  if (CUSTOM_DECK_RULES.aceIds.has(card.id) && metrics.aceCount >= 1 && count === 0) return false;
  return true;
}

function customDeckCardMarkup(card, metrics) {
  const count = Number(state.customDeckCounts[card.id]) || 0;
  const limit = customDeckCardLimit(card.id);
  const art = card.art
    ? `<img src="${escapeCatalogHtml(card.art)}" alt="" draggable="false">`
    : escapeCatalogHtml(card.name.slice(0, 1));
  const canAdd = canAddCustomCard(card, metrics);
  const countBadge = count > 0 ? `<span class="catalog-card-count">×${count}</span>` : "";
  return `<article class="deck-builder-card${count > 0 ? " is-selected" : ""}" data-custom-card="${card.id}">
    <button class="catalog-card" type="button" data-custom-detail="${card.id}" style="--card-accent:${card.accent}" aria-label="${escapeCatalogHtml(card.name)}の詳細を表示">
      <span class="catalog-card-id"><span>No ${String(card.id).padStart(3, "0")}</span><span>COST ${card.cost}</span></span>
      <span class="catalog-card-art${card.art ? " has-art" : ""}">${art}</span>
      <strong class="catalog-card-name">${escapeCatalogHtml(card.name)}</strong>
      ${countBadge}
      <span class="catalog-card-stats"><span>HP ${card.hp}</span><span>AT ${card.id === 24 ? "???" : card.at}</span></span>
    </button>
    <div class="deck-builder-card-controls">
      <button type="button" data-custom-remove="${card.id}" aria-label="${escapeCatalogHtml(card.name)}を1枚取り除く"${count > 0 ? "" : " disabled"}>−</button>
      <output aria-label="選択枚数">${count} / ${limit}</output>
      <button type="button" data-custom-add="${card.id}" aria-label="${escapeCatalogHtml(card.name)}を1枚追加"${canAdd ? "" : " disabled"}>＋</button>
    </div>
  </article>`;
}

function renderCustomDeckBuilder() {
  if (!customDeckGrid) return;
  const metrics = customDeckMetrics();
  customDeckGrid.innerHTML = metrics.cards.map((card) => customDeckCardMarkup(card, metrics)).join("");
  customDeckTotal.textContent = `${metrics.total} / ${CUSTOM_DECK_RULES.size}`;
  customDeckCurve.textContent = `COST 0:${metrics.curve[0]} / 1:${metrics.curve[1]} / 2:${metrics.curve[2]} / 3:${metrics.curve[3]}`;
  const messages = [];
  if (metrics.total < CUSTOM_DECK_RULES.size) messages.push(`あと${CUSTOM_DECK_RULES.size - metrics.total}枚`);
  if (metrics.curve[0] < CUSTOM_DECK_RULES.minCostZero) messages.push(`コスト0があと${CUSTOM_DECK_RULES.minCostZero - metrics.curve[0]}枚必要`);
  customDeckRequirement.textContent = metrics.valid ? "使用条件を満たしています。" : messages.join("｜");
  customDeckStatus.classList.toggle("is-valid", metrics.valid);
  useCustomDeckButton.disabled = !metrics.valid;
}

function changeCustomDeckCard(cardId, amount) {
  const card = customDeckCards().find((candidate) => candidate.id === Number(cardId));
  if (!card) return;
  const metrics = customDeckMetrics();
  const current = Number(state.customDeckCounts[card.id]) || 0;
  if (amount > 0 && !canAddCustomCard(card, metrics)) return;
  const next = Math.max(0, Math.min(customDeckCardLimit(card.id), current + amount));
  if (next === 0) delete state.customDeckCounts[card.id];
  else state.customDeckCounts[card.id] = next;
  renderCustomDeckBuilder();
}

function openCustomDeckConfirmation() {
  const metrics = customDeckMetrics();
  if (!metrics.valid) return;
  const definition = customDeckDefinition().map(([id, count]) => [id, count]);
  state.pendingSelection = { type: "custom-deck", key: "custom", definition };
  confirmIndex.textContent = "CONFIRM / CUSTOM DECK";
  confirmTitle.textContent = "このデッキを使用しますか？";
  confirmDetail.textContent = "このデッキは一時保存です。タイトルに戻るか、ページの再読み込み・終了を行うと自動で削除されます。";
  const portraitImage = confirmPortrait.querySelector("img");
  delete portraitImage.dataset.characterImage;
  portraitImage.classList.remove("image-missing");
  portraitImage.onload = () => portraitImage.classList.remove("image-missing");
  portraitImage.onerror = () => portraitImage.classList.add("image-missing");
  portraitImage.src = "../images/card/char_illust/deck_shyoninn.png";
  portraitImage.draggable = false;
  portraitImage.alt = "自分でデッキを作る";
  confirmPortrait.classList.add("is-deck");
  confirmDialog.classList.remove("is-deck-confirmation");
  confirmDeckDetail.hidden = true;
  confirmDialog.showModal();
}

async function acceptPendingSelection() {
  const pending = state.pendingSelection;
  if (!pending) return;

  confirmDialog.close();

  if (pending.type === "npc") {
    state.selectedNpc = pending.key;
    state.pendingSelection = null;
    await showScreen("deck");
    return;
  }

  state.selectedDeck = pending.key;
  if (pending.type === "custom-deck") {
    state.customDeckDefinition = pending.definition.map(([id, count]) => [id, count]);
  }
  state.pendingSelection = null;
  summaryNpc.textContent = NPCS[state.selectedNpc]?.name ?? "未選択";
  summaryDeck.textContent = state.selectedNpc === "senna" ? "均衡型" : "伊織専用";
  await showScreen("order");
}

function secureCoinFlip() {
  if (window.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    window.crypto.getRandomValues(value);
    return value[0] % 2;
  }
  return Math.random() < 0.5 ? 0 : 1;
}

function revealOrder() {
  const playerGoesFirst = secureCoinFlip() === 0;
  state.playerGoesFirst = playerGoesFirst;
  orderWord.classList.remove("is-revealed");
  orderWord.textContent = "—";
  orderReading.textContent = "DRAWING...";

  state.orderTimer = window.setTimeout(() => {
    orderWord.textContent = playerGoesFirst ? "先攻" : "後攻";
    orderReading.textContent = playerGoesFirst ? "YOU GO FIRST" : "YOU GO SECOND";
    orderWord.classList.add("is-revealed");
  }, reduceMotion.matches ? 0 : 520);
}

document.querySelector("[data-action='start']").addEventListener("click", () => {
  playUiSound("button");
  showScreen("guide");
});
document.querySelector("[data-action='credit']").addEventListener("click", () => {
  playUiSound("button");
  creditDialog.showModal();
});

document.querySelectorAll("[data-entry-game]").forEach((button) => {
  button.addEventListener("click", () => openEntryConfirmation(button.dataset.entryGame));
});

gameEntryYes.addEventListener("click", acceptEntryGame);
gameEntryNo.addEventListener("click", () => gameEntryDialog.close());
gameEntryClose.addEventListener("click", () => gameEntryDialog.close());
gameEntryDialog.addEventListener("close", () => {
  state.pendingEntryGame = null;
});
gameEntryDialog.addEventListener("click", (event) => {
  const bounds = gameEntryDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left
    && event.clientX <= bounds.right
    && event.clientY >= bounds.top
    && event.clientY <= bounds.bottom;
  if (!inside) gameEntryDialog.close();
});

creditDialogClose.addEventListener("click", () => {
  playUiSound("back");
  creditDialog.close();
});
creditDialog.addEventListener("click", (event) => {
  const bounds = creditDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left
    && event.clientX <= bounds.right
    && event.clientY >= bounds.top
    && event.clientY <= bounds.bottom;
  if (!inside) creditDialog.close();
});

noticeScreen.addEventListener("click", finishNotice);
noticeScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") finishNotice();
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    const isBack = button.classList.contains("icon-button") || button.classList.contains("title-game-select-link");
    playUiSound(isBack ? "back" : "button");
    showScreen(button.dataset.go);
  });
});

document.querySelectorAll("[data-select-npc]").forEach((button) => {
  button.addEventListener("click", () => {
    playUiSound("button");
    openNpcConfirmation(button.dataset.selectNpc);
  });
});

document.querySelectorAll("[data-select-deck]").forEach((button) => {
  button.addEventListener("click", () => {
    playUiSound("button");
    openDeckConfirmation(button.dataset.selectDeck);
  });
});

customDeckEntry?.addEventListener("click", async () => {
  playUiSound("button");
  renderCustomDeckBuilder();
  await showScreen("deck-builder");
});

customDeckGrid?.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-custom-detail]");
  if (detailButton) {
    window.CardCatalog?.openCardReference(Number(detailButton.dataset.customDetail), { allowArtZoom: true });
    return;
  }
  const addButton = event.target.closest("[data-custom-add]");
  if (addButton) {
    changeCustomDeckCard(addButton.dataset.customAdd, 1);
    return;
  }
  const removeButton = event.target.closest("[data-custom-remove]");
  if (removeButton) changeCustomDeckCard(removeButton.dataset.customRemove, -1);
});

useCustomDeckButton?.addEventListener("click", () => {
  playUiSound("button");
  openCustomDeckConfirmation();
});

document.querySelector("#battle-start-button").addEventListener("click", async () => {
  const npc = state.selectedNpc ?? "iori";
  const playerDeck = state.selectedDeck ?? "balance";
  updateBattleNpcPresentation(npc);
  window.BattleGame?.start({
    npc,
    playerDeck,
    playerDeckDefinition: playerDeck === "custom"
      ? state.customDeckDefinition?.map(([id, count]) => [id, count])
      : null,
    npcDeck: npcBattleDeck(npc),
    playerGoesFirst: state.playerGoesFirst ?? true,
  });
  await showScreen("battle");
});

confirmYes.addEventListener("click", () => {
  playUiSound("button");
  acceptPendingSelection();
});
confirmNo.addEventListener("click", () => {
  playUiSound("back");
  confirmDialog.close();
});
confirmClose.addEventListener("click", () => {
  playUiSound("back");
  confirmDialog.close();
});
confirmDeckDetail.addEventListener("click", async () => {
  playUiSound("button");
  const deckKey = state.pendingSelection?.type === "deck" ? state.pendingSelection.key : null;
  if (!deckKey) return;
  state.openingDeckDetail = true;
  confirmDialog.close();
  renderDeckDetail(deckKey);
  await showScreen("deck-detail");
});
document.querySelector("#all-card-list-button").addEventListener("click", async () => {
  playUiSound("button");
  renderAllCards();
  await showScreen("card-catalog");
});
confirmDialog.addEventListener("close", () => {
  if (state.openingDeckDetail) {
    state.openingDeckDetail = false;
    state.pendingSelection = null;
    return;
  }
  if (state.pendingSelection) {
    state.pendingSelection = null;
  }
});
confirmDialog.addEventListener("click", (event) => {
  const bounds = confirmDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left
    && event.clientX <= bounds.right
    && event.clientY >= bounds.top
    && event.clientY <= bounds.bottom;
  if (!inside) confirmDialog.close();
});

installCharacterImages();
setPreviewVideosActive(false);
document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const enabled = window.GameAudio?.toggle() ?? true;
    updateSoundButtons();
    if (enabled) playUiSound("button");
  });
});
window.addEventListener("gameaudiochange", updateSoundButtons);
updateSoundButtons();
window.GameAudio?.setScene("portal-splash");
state.portalTimer = window.setTimeout(() => showScreen("game-select"), 2000);

window.AppNavigation = { showScreen };
