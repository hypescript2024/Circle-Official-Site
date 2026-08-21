"use strict";

(() => {
  const CARD_LIBRARY = {
    1: { id: 1, name: "アストロ公爵", cost: 3, hp: 4000, at: 2500, effect: "この効果は1ターンに1度だけ発動可能。体力を500減らし、攻撃力を500アップできる。", effectCode: "REDUCE_HP_BUFF_SELF", limit: "turn", accent: "#57203b", art: "monster_card_illust/astro.png" },
    2: { id: 2, name: "カリオストロ侯爵", cost: 2, hp: 2500, at: 1500, effect: "【逸話】500年熟成させた赤ワインを宝物庫に所有している。", effectCode: null, limit: null, accent: "#66252e", art: "monster_card_illust/kariosutro.png" },
    3: { id: 3, name: "ダルタニアン伯爵", cost: 1, hp: 1000, at: 500, effect: "【逸話】侯爵の宝物庫からワインを盗んでは、よく怒られている。", effectCode: null, limit: null, accent: "#4c5261", art: "monster_card_illust/darutanian.png" },
    4: { id: 4, name: "バッドボディ子爵", cost: 0, hp: 500, at: 200, effect: "この効果はバトル中に1度だけ発動可能。山札から1枚ドローできる。", effectCode: "DRAW_ONE", limit: "battle", accent: "#633e4c", art: "monster_card_illust/badbody.png" },
    5: { id: 5, name: "グッドボディ男爵", cost: 0, hp: 500, at: 200, effect: "【逸話】見た目だけの身体、長剣を振ることもできない。", effectCode: null, limit: null, accent: "#4d5360", art: "monster_card_illust/goodbody.png" },
    6: { id: 6, name: "法皇リヴァイアサン", cost: 3, hp: 5000, at: 2000, effect: "この効果はフィールドに他のモンスターがいる場合、バトル中に1度だけ発動可能。場にいるこのカードを手札に戻した後、手札から最大3枚を選んで種ゾーンに置く。また、相手の種ゾーンにカードがある場合、それを1枚相手の手札に加えさせる。", effectCode: "RETURN_SELF_AND_SEED", limit: "battle", accent: "#284d72", art: "monster_card_illust/leviathan.png" },
    7: { id: 7, name: "皇妃ドラコー", cost: 2, hp: 2000, at: 2000, effect: "この効果はバトル中に1度だけ発動可能。手札をすべてデッキに戻して混ぜ、カードを2枚引く。", effectCode: "REDRAW_TWO", limit: "battle", accent: "#721d29", art: "monster_card_illust/ouhidorako-.png" },
    8: { id: 8, name: "オッポ", cost: 1, hp: 800, at: 500, effect: "この効果はバトル中に1度だけ発動可能。山札から1枚ドローできる。", effectCode: "DRAW_ONE", limit: "battle", accent: "#80652c", art: "monster_card_illust/oppo.png" },
    9: { id: 9, name: "ベビー・レヴィー", cost: 0, hp: 500, at: 100, effect: "この効果は1ターンに1度だけ発動可能。デッキの上から3枚を確認し、『法皇リヴァイアサン』か『皇妃ドラコー』があれば1枚を手札に加える。残りはデッキの一番下に戻す。", effectCode: "SEARCH_ROYAL", limit: "turn", accent: "#315a75", art: "monster_card_illust/babyraby.png" },
    10: { id: 10, name: "教母アスカラカマス", cost: 3, hp: 5000, at: 1500, effect: "この効果は1ターンに1度だけ発動可能。このモンスターの体力を300回復し、相手のメインアタッカーに300ダメージを与える。", effectCode: "HEAL_SELF_DAMAGE_MAIN", limit: "turn", accent: "#6f254b", art: "monster_card_illust/kyouboasukarakamasu.png" },
    11: { id: 11, name: "キメラ・スパイダー", cost: 2, hp: 3000, at: 1000, effect: "この効果はバトル中に1度だけ発動可能。このモンスターが破壊された時、手札かサブアタッカーに『スモール・スパイダーズ』がいる場合、そのカードを種ゾーンの手前に置くことができる。", effectCode: "SPIDER_SEED_ON_DESTROY", limit: "battle", accent: "#394e3b", art: "monster_card_illust/kimera_spider.png" },
    12: { id: 12, name: "スモール・スパイダーズA", cost: 0, hp: 1000, at: 100, effect: "この効果はバトル中に1度だけ発動可能。このカードがサブアタッカーにいる場合、このカードを墓地へ送り、自分のメインアタッカーを500回復する。", effectCode: "HEAL_MAIN_500", limit: "battle", accent: "#4c5d3d", art: "monster_card_illust/small_spider_a.png" },
    13: { id: 13, name: "スモール・スパイダーズB", cost: 0, hp: 1000, at: 100, effect: "この効果はバトル中に1度だけ発動可能。このカードがサブアタッカーにいる場合、このカードを墓地へ送り、相手のメインアタッカーの攻撃力を500下げる。", effectCode: "DEBUFF_ENEMY_MAIN", limit: "battle", accent: "#3f5048", art: "monster_card_illust/small_spider_B.png" },
    14: { id: 14, name: "ザ・ハンド", cost: 1, hp: 1000, at: 300, effect: "【逸話】何者かの手。1000年以上、生きている。", effectCode: null, limit: null, accent: "#55545b", art: "monster_card_illust/theHand.png" },
    15: { id: 15, name: "PGエレファント", cost: 2, hp: 500, at: 1200, effect: "【逸話】とある青年が生み出した悲しき獣。", effectCode: null, limit: null, accent: "#5e5150", art: "monster_card_illust/PS_zousan.png" },
    16: { id: 16, name: "つくし", cost: 0, hp: 300, at: 100, effect: "【逸話】つくし。", effectCode: null, limit: null, accent: "#5d6f48", art: "monster_card_illust/tukushi.png" },
    17: { id: 17, name: "つくしボーイ", cost: 1, hp: 500, at: 300, effect: "【逸話】つくしがちょっと成長したよ。", effectCode: null, limit: null, accent: "#68733e", art: "monster_card_illust/tukushi_boy.png" },
    18: { id: 18, name: "反抗期のつくし", cost: 2, hp: 1500, at: 800, effect: "【逸話】つくしにだって反抗期はある。", effectCode: null, limit: null, accent: "#684c3a", art: "monster_card_illust/tukushi_hankoki.png" },
    19: { id: 19, name: "キングつくし", cost: 3, hp: 2000, at: 1000, effect: "【逸話】闇で闇を消すことはできない。消せるのは光だけだ。", effectCode: null, limit: null, accent: "#8b6b2f", art: "monster_card_illust/tukushi_king.png" },
    20: { id: 20, name: "過去の遺物", cost: 0, hp: 300, at: 300, effect: "【逸話】かつて、男は強かった。その強さと引き換えに、男は幸せを知った。", effectCode: null, limit: null, accent: "#55585d", art: "monster_card_illust/kakonoibuthu.png" },
    21: { id: 21, name: "バンソーコーマン", cost: 0, hp: 100, at: 100, effect: "この効果は1ターンに1度だけ発動可能。このカードがサブアタッカーにいる場合、このカードを墓地へ送り、場に出ている任意のモンスター1体の体力を500回復する。", effectCode: "SUB_HEAL_ANY", limit: "turn", accent: "#80515a", art: "monster_card_illust/banso-ko-man.png" },
    22: { id: 22, name: "て・て・て天使", cost: 0, hp: 300, at: 200, effect: "【逸話】天界から降りてきた天使。今は無職。", effectCode: null, limit: null, accent: "#8b6f72", art: "monster_card_illust/tetetetenshi.png" },
    23: { id: 23, name: "パンデグライン", cost: 0, hp: 400, at: 100, effect: "この効果はバトル中に1度だけ発動可能。このカードが攻撃した時、攻撃した相手のメインアタッカーの攻撃力を500下げる。", effectCode: "ATTACK_DEBUFF_TARGET", limit: "battle", accent: "#51476b", art: "monster_card_illust/pandenguline.png" },
    24: { id: 24, name: "やっちゃえ、あたしのヒーロー！", cost: 2, hp: 100, at: 0, effect: "この効果はバトル中に1度だけ発動可能。このカードの攻撃力は相手のメインアタッカーの残り体力と同じになる。発動したターンの終了時にこのカードを墓地へ送る。", effectCode: "MATCH_ENEMY_HP", limit: "battle", accent: "#85233b", art: "monster_card_illust/yattyae.png" },
    25: { id: 25, name: "マジシャンズ・ビーバー", cost: 0, hp: 100, at: 100, effect: "この効果はバトル中に1度だけ発動可能。このカードがサブアタッカーにいる場合、このカードを墓地へ送り、自分の種ゾーンの手前から1枚を手札に加える。", effectCode: "SACRIFICE_SELF_DRAW_SEED", limit: "battle", accent: "#3c655d", art: "monster_card_illust/magician.png" },
    26: { id: 26, name: "ボク・オスカー・デスカー", cost: 1, hp: 400, at: 300, effect: "【逸話】僕は一体、何者なのだろうか。", effectCode: null, limit: null, accent: "#424e64", art: "monster_card_illust/Oscerdeskar.png" },
    27: { id: 27, name: "川を越える者", cost: 2, hp: 1000, at: 1000, effect: "【逸話】苦節24年、新潟出身の修行人。", effectCode: null, limit: null, accent: "#315e68", art: "monster_card_illust/kawawokoeru.png" },
  };

  Object.values(CARD_LIBRARY).forEach((card) => {
    if (card.art) card.art = `../images/card/${card.art}`;
  });

  const DECK_LISTS = {
    assault: [[1, 1], [19, 2], [2, 2], [18, 1], [15, 3], [27, 2], [3, 3], [17, 2], [14, 2], [5, 3], [16, 1], [20, 1], [4, 1], [25, 1]],
    balance: [[6, 1], [19, 2], [7, 2], [18, 2], [15, 2], [27, 2], [17, 2], [8, 3], [14, 2], [16, 1], [20, 1], [9, 2], [12, 1], [23, 1], [25, 1]],
    recovery: [[10, 1], [19, 2], [11, 2], [18, 2], [15, 2], [27, 2], [17, 2], [8, 3], [14, 2], [16, 1], [20, 1], [13, 1], [22, 1], [12, 1], [21, 1], [25, 1]],
    iori: [[19, 3], [24, 1], [2, 2], [18, 2], [15, 2], [27, 1], [3, 2], [17, 2], [14, 1], [26, 2], [4, 2], [5, 1], [23, 1], [16, 1], [20, 1], [22, 1]],
  };

  const NPC_PROFILES = {
    iori: { key: "iori", shortName: "伊織", fullName: "夜鷹 伊織", deck: "iori", style: "NORMAL / ATTACKER" },
    senna: { key: "senna", shortName: "千奈", fullName: "落窪 千奈", deck: "balance", style: "HARD / BALANCE" },
  };

  const ACE_CARD_IDS = new Set([1, 6, 10]);
  const SPOTLIGHT_CARD_IDS = new Set([1, 6, 10, 24]);
  const CUSTOM_DECK_SIZE = 25;
  const CUSTOM_DECK_MIN_COST_ZERO = 7;
  const CUSTOM_DECK_EXCLUDED_IDS = new Set([24]);

  const dom = {
    playmat: document.querySelector("#battle-playmat"),
    turn: document.querySelector("#battle-turn-chip strong"),
    playerMain: document.querySelector("#player-main-slot"),
    playerSubs: document.querySelector("#player-sub-slots"),
    npcMain: document.querySelector("#npc-main-slot"),
    npcSubs: document.querySelector("#npc-sub-slots"),
    playerHand: document.querySelector("#player-hand"),
    npcHand: document.querySelector("#npc-hand"),
    playerSeeds: document.querySelector("#player-seeds"),
    npcSeeds: document.querySelector("#npc-seeds"),
    playerDeck: document.querySelector("#player-deck-count"),
    npcDeck: document.querySelector("#npc-deck-count"),
    playerGrave: document.querySelector("#player-grave-count"),
    npcGrave: document.querySelector("#npc-grave-count"),
    playerHandCount: document.querySelector("#player-hand-count"),
    battleButton: document.querySelector("#battle-button"),
    turnEndButton: document.querySelector("#turn-end-button"),
    phaseBanner: document.querySelector("#phase-banner"),
    phaseText: document.querySelector("#phase-banner strong"),
    toast: document.querySelector("#battle-toast"),
    menu: document.querySelector("#battle-menu-button"),
    dialog: document.querySelector("#battle-dialog"),
    dialogClose: document.querySelector("#battle-dialog-close"),
    dialogIndex: document.querySelector("#battle-dialog-index"),
    dialogTitle: document.querySelector("#battle-dialog-title"),
    dialogBody: document.querySelector("#battle-dialog-body"),
    dialogActions: document.querySelector("#battle-dialog-actions"),
    aceDialog: document.querySelector("#ace-dialog"),
    aceDialogBody: document.querySelector("#ace-dialog-body"),
  };

  let game = null;
  let uid = 0;
  let toastTimer = 0;
  let dialogResolver = null;
  let dialogClosable = true;
  let suppressClickUntil = 0;
  let pendingSummonTimer = 0;

  function makeCard(id) {
    const base = CARD_LIBRARY[id];
    return { ...base, uid: `${id}-${++uid}`, currentHp: base.hp, usedBattle: false, usedTurn: false };
  }

  function normalizeCustomDeckDefinition(definition) {
    if (!Array.isArray(definition)) return null;
    const normalized = [];
    const seen = new Set();
    let total = 0;
    let costZero = 0;
    let aceCount = 0;
    for (const entry of definition) {
      if (!Array.isArray(entry) || entry.length < 2) return null;
      const id = Number(entry[0]);
      const count = Number(entry[1]);
      const card = CARD_LIBRARY[id];
      const limit = ACE_CARD_IDS.has(id) ? 1 : 3;
      if (!card || CUSTOM_DECK_EXCLUDED_IDS.has(id) || seen.has(id) || !Number.isInteger(count) || count < 1 || count > limit) return null;
      seen.add(id);
      normalized.push([id, count]);
      total += count;
      if (card.cost === 0) costZero += count;
      if (ACE_CARD_IDS.has(id)) aceCount += count;
    }
    if (total !== CUSTOM_DECK_SIZE || costZero < CUSTOM_DECK_MIN_COST_ZERO || aceCount > 1) return null;
    return normalized;
  }

  function makeDeck(deckKey = "balance", suppliedDefinition = null) {
    const customDefinition = deckKey === "custom" ? normalizeCustomDeckDefinition(suppliedDefinition) : null;
    const definition = customDefinition ?? DECK_LISTS[deckKey] ?? DECK_LISTS.balance;
    return definition.flatMap(([id, count]) => Array.from({ length: count }, () => makeCard(id)));
  }

  function shuffle(cards) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[other]] = [cards[other], cards[index]];
    }
    return cards;
  }

  function prepareSide(label, deckKey, suppliedDefinition = null) {
    let deck = makeDeck(deckKey, suppliedDefinition);
    for (let attempt = 0; attempt < 80; attempt += 1) {
      shuffle(deck);
      if (deck.slice(0, 3).some((card) => card.cost === 0)) break;
    }
    return {
      label,
      deck,
      hand: deck.splice(0, 3),
      seeds: deck.splice(0, 3),
      grave: [],
      main: null,
      subs: [],
      subActionUsedThisTurn: false,
      swappedThisTurn: false,
      attackedThisTurn: false,
      usedSharedTurnEffects: new Set(),
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[character]);
  }

  function otherSide(side) {
    return side === "player" ? "npc" : "player";
  }

  function sideState(side) {
    return game[side];
  }

  function sharedTurnEffects(side) {
    const owner = sideState(side);
    if (!(owner.usedSharedTurnEffects instanceof Set)) owner.usedSharedTurnEffects = new Set();
    return owner.usedSharedTurnEffects;
  }

  function currentSummonCost(side) {
    return Math.max(0, 3 - sideState(side).seeds.length);
  }

  function allowedSubCost(side) {
    return Math.min(3, currentSummonCost(side) + 1);
  }

  function isOpeningTurnWithoutBattle() {
    return game.turnNumber === 1;
  }

  function canPlayerInspect() {
    return game && !game.ended && game.active === "player" && game.phase === "main" && !game.busy;
  }

  function cardLocation(side, card) {
    const owner = sideState(side);
    if (owner.main?.uid === card.uid) return "main";
    if (owner.subs.some((candidate) => candidate.uid === card.uid)) return "sub";
    if (owner.hand.some((candidate) => candidate.uid === card.uid)) return "hand";
    return null;
  }

  function canUseEffect(side, card) {
    if (!card.effectCode || !game || game.ended || game.phase !== "main" || game.active !== side || game.busy) return false;
    const location = cardLocation(side, card);
    if (location !== "main" && location !== "sub") return false;
    if (card.limit === "battle" && card.usedBattle) return false;
    if (card.limit === "turn" && card.usedTurn) return false;
    if (card.effectCode === "SEARCH_ROYAL" && sharedTurnEffects(side).has("SEARCH_ROYAL")) return false;
    if (card.effectCode === "SPIDER_SEED_ON_DESTROY" || card.effectCode === "ATTACK_DEBUFF_TARGET") return false;
    if (card.effectCode === "HEAL_SELF_DAMAGE_MAIN" || card.effectCode === "MATCH_ENEMY_HP") return Boolean(sideState(otherSide(side)).main);
    if (card.effectCode === "HEAL_MAIN_500") return location === "sub" && sideState(side).main && sideState(side).main.currentHp < sideState(side).main.hp;
    if (card.effectCode === "DEBUFF_ENEMY_MAIN") return location === "sub" && Boolean(sideState(otherSide(side)).main);
    if (card.effectCode === "SUB_HEAL_ANY") {
      return location === "sub" && fieldHealCandidates(side, card).length > 0;
    }
    if (card.effectCode === "RETURN_SELF_AND_SEED") return location === "sub" || sideState(side).subs.length > 0;
    if (card.effectCode === "SACRIFICE_SELF_DRAW_SEED") return location === "sub" && sideState(side).seeds.length > 0;
    return true;
  }

  function displayedAttack(card) {
    return card?.id === 24 ? "???" : card.at;
  }

  function cardMarkup(card, zone, side) {
    const zoneClass = zone === "main" ? "is-main" : zone === "sub" ? "is-sub" : "is-hand";
    const damaged = card.currentHp < card.hp ? " is-damaged" : "";
    const selectable = side === "player" && zone === "hand" && canSummonCard(card) ? " is-selectable" : "";
    const armed = side === "player" && zone === "hand" && game?.pendingSummonUid === card.uid ? " is-tap-armed" : "";
    const art = card.art
      ? `<img src="${escapeHtml(card.art)}" alt="" draggable="false">`
      : `<span>${escapeHtml(card.name.slice(0, 1))}</span>`;
    return `<button class="battle-card ${zoneClass}${damaged}${selectable}${armed}" type="button" data-card-uid="${card.uid}" data-card-side="${side}" data-card-zone="${zone}" style="--card-accent:${card.accent}">
      <span class="battle-card-name">${escapeHtml(card.name)}</span>
      <span class="battle-card-cost">${card.cost}</span>
      <span class="battle-card-art${card.art ? " has-art" : ""}">${art}</span>
      <span class="battle-card-stats"><span class="hp">HP ${card.currentHp}</span><span class="at">AT ${displayedAttack(card)}</span></span>
    </button>`;
  }

  function canSummonCard(card) {
    if (!game || game.ended || game.active !== "player" || game.phase !== "main" || game.busy) return false;
    const owner = game.player;
    if (!owner.main) return card.cost === 0;
    return !owner.subActionUsedThisTurn && owner.subs.length < 2 && card.cost <= allowedSubCost("player");
  }

  function renderSide(side) {
    const owner = sideState(side);
    const mainNode = side === "player" ? dom.playerMain : dom.npcMain;
    const subNode = side === "player" ? dom.playerSubs : dom.npcSubs;
    const seedNode = side === "player" ? dom.playerSeeds : dom.npcSeeds;
    mainNode.innerHTML = owner.main ? cardMarkup(owner.main, "main", side) : "";
    subNode.innerHTML = owner.subs.map((card) => cardMarkup(card, "sub", side)).join("");
    seedNode.innerHTML = `<span class="summon-cost-display" aria-label="現在の召喚コスト ${currentSummonCost(side)}"><small>召喚コスト</small><strong>${currentSummonCost(side)}</strong></span>${owner.seeds.map(() => '<span class="seed-card" aria-hidden="true"></span>').join("")}`;
  }

  function render() {
    if (!game) return;
    renderSide("player");
    renderSide("npc");
    dom.playerHand.innerHTML = game.player.hand.map((card) => cardMarkup(card, "hand", "player")).join("");
    dom.playerHand.dataset.handCount = String(Math.min(game.player.hand.length, 9));
    dom.npcHand.innerHTML = game.npc.hand.map(() => '<span class="card-back-mini" aria-hidden="true"></span>').join("");
    dom.playerDeck.textContent = game.player.deck.length;
    dom.npcDeck.textContent = game.npc.deck.length;
    dom.playerGrave.textContent = game.player.grave.length;
    dom.npcGrave.textContent = game.npc.grave.length;
    dom.playerHandCount.textContent = `${game.player.hand.length} / 5`;
    dom.turn.textContent = String(game.turnNumber).padStart(2, "0");

    const playerMayAct = game.active === "player" && (game.phase === "main" || game.phase === "postbattle") && !game.busy && !game.ended;
    dom.battleButton.hidden = isOpeningTurnWithoutBattle();
    dom.battleButton.disabled = !playerMayAct || !game.player.main || game.player.attackedThisTurn;
    dom.turnEndButton.disabled = !playerMayAct || !game.player.main;
    bindCardInteractions();
    window.GameAudio?.syncBattleCards([
      game.player.main,
      ...game.player.subs,
      game.npc.main,
      ...game.npc.subs,
    ].filter(Boolean));
  }

  function bindCardInteractions() {
    document.querySelectorAll(".battle-card[data-card-uid]").forEach((node) => {
      let pressTimer = 0;
      let startX = 0;
      let startY = 0;
      node.addEventListener("pointerdown", (event) => {
        if (!canPlayerInspect()) return;
        startX = event.clientX;
        startY = event.clientY;
        pressTimer = window.setTimeout(() => {
          suppressClickUntil = Date.now() + 450;
          clearPendingSummon();
          const card = findCard(node.dataset.cardSide, node.dataset.cardUid);
          if (card) showCardDetail(node.dataset.cardSide, card);
        }, 520);
      });
      node.addEventListener("pointermove", (event) => {
        if (Math.hypot(event.clientX - startX, event.clientY - startY) > 10) window.clearTimeout(pressTimer);
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach((type) => node.addEventListener(type, () => window.clearTimeout(pressTimer)));
      node.addEventListener("click", () => {
        if (Date.now() < suppressClickUntil) return;
        handleCardClick(node.dataset.cardSide, node.dataset.cardZone, node.dataset.cardUid);
      });
    });
  }

  function syncPendingSummonVisual() {
    dom.playerHand.querySelectorAll?.(".battle-card[data-card-uid]").forEach((node) => {
      node.classList.toggle("is-tap-armed", node.dataset.cardUid === game?.pendingSummonUid);
    });
  }

  function clearPendingSummon() {
    window.clearTimeout(pendingSummonTimer);
    pendingSummonTimer = 0;
    if (!game || game.pendingSummonUid === null) return false;
    game.pendingSummonUid = null;
    syncPendingSummonVisual();
    return true;
  }

  function armPendingSummon(cardUid) {
    window.clearTimeout(pendingSummonTimer);
    game.pendingSummonUid = cardUid;
    syncPendingSummonVisual();
    pendingSummonTimer = window.setTimeout(() => {
      if (game?.pendingSummonUid === cardUid) clearPendingSummon();
    }, 4000);
  }

  function findCard(side, cardUid) {
    const owner = sideState(side);
    return [owner.main, ...owner.subs, ...owner.hand, ...owner.grave].find((card) => card?.uid === cardUid) ?? null;
  }

  function toast(message) {
    window.clearTimeout(toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.remove("is-visible");
    void dom.toast.offsetWidth;
    dom.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 1750);
  }

  function showPhase(message) {
    dom.phaseText.textContent = message;
    dom.phaseBanner.classList.remove("is-visible");
    void dom.phaseBanner.offsetWidth;
    dom.phaseBanner.classList.add("is-visible");
  }

  function closeDialog(value = null) {
    if (!dom.dialog.open) return;
    dom.dialog.close();
    dom.dialog.classList.remove("is-result", "is-card-only", "is-spotlight", "is-ace-effect");
    const resolver = dialogResolver;
    dialogResolver = null;
    if (resolver) resolver(value);
  }

  function askDialog({ index = "BATTLE / INFO", title, body, actions = [{ value: true, label: "OK", primary: true }], closable = true, variant = "" }) {
    if (dom.dialog.open) closeDialog(null);
    dialogClosable = closable;
    dom.dialog.classList.remove("is-result", "is-card-only", "is-spotlight", "is-ace-effect");
    if (variant === "result") dom.dialog.classList.add("is-result");
    if (variant === "card") dom.dialog.classList.add("is-card-only");
    if (variant === "spotlight") dom.dialog.classList.add("is-spotlight");
    if (variant === "ace-effect") dom.dialog.classList.add("is-ace-effect");
    dom.dialogClose.hidden = !closable;
    dom.dialogIndex.textContent = index;
    dom.dialogTitle.textContent = title;
    dom.dialogBody.innerHTML = body;
    dom.dialogActions.innerHTML = "";
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action.label;
      if (action.primary) button.classList.add("is-primary");
      button.addEventListener("click", () => {
        if (action.keepOpen) {
          action.onSelect?.(button);
          return;
        }
        closeDialog(action.value);
      });
      dom.dialogActions.append(button);
    });
    dom.dialog.showModal();
    return new Promise((resolve) => { dialogResolver = resolve; });
  }

  async function confirmAction(title, message, yesLabel = "進む", noLabel = "戻る") {
    return askDialog({
      index: "BATTLE / CONFIRM",
      title,
      body: `<p>${escapeHtml(message)}</p>`,
      actions: [{ value: false, label: noLabel }, { value: true, label: yesLabel, primary: true }],
    });
  }

  async function chooseCards(cards, count, title, message) {
    if (count <= 0) return [];
    const selected = new Set();
    dialogClosable = false;
    dom.dialogClose.hidden = true;
    dom.dialogIndex.textContent = "BATTLE / SELECT";
    dom.dialogTitle.textContent = title;
    dom.dialogBody.innerHTML = `<p>${escapeHtml(message)}</p><div class="choice-list">${cards.map((card) => `<button type="button" data-choice-card="${card.uid}" style="--card-accent:${card.accent}"><span class="grave-list-art">${escapeHtml(card.name.slice(0, 1))}</span><span><strong>${escapeHtml(card.name)}</strong><small>COST ${card.cost} / HP ${card.currentHp} / AT ${displayedAttack(card)}</small></span><em>選択</em></button>`).join("")}</div>`;
    dom.dialogActions.innerHTML = "";
    const done = document.createElement("button");
    done.type = "button";
    done.className = "is-primary";
    done.disabled = true;
    done.textContent = `0 / ${count}枚を選択`;
    dom.dialogActions.append(done);
    dom.dialogBody.querySelectorAll("[data-choice-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardUid = button.dataset.choiceCard;
        if (selected.has(cardUid)) {
          selected.delete(cardUid);
          button.classList.remove("is-selected");
        } else if (selected.size < count) {
          selected.add(cardUid);
          button.classList.add("is-selected");
        }
        done.disabled = selected.size !== count;
        done.textContent = `${selected.size} / ${count}枚を選択`;
      });
    });
    if (!dom.dialog.open) dom.dialog.showModal();
    return new Promise((resolve) => {
      dialogResolver = resolve;
      done.addEventListener("click", () => closeDialog([...selected]));
    });
  }

  async function chooseUpToCards(cards, maximum, title, message) {
    const selected = new Set();
    dialogClosable = false;
    dom.dialogClose.hidden = true;
    dom.dialogIndex.textContent = "BATTLE / SELECT";
    dom.dialogTitle.textContent = title;
    dom.dialogBody.innerHTML = `<p>${escapeHtml(message)}</p><div class="choice-list">${cards.map((card) => `<button type="button" data-choice-card="${card.uid}" style="--card-accent:${card.accent}"><span class="grave-list-art">${escapeHtml(card.name.slice(0, 1))}</span><span><strong>${escapeHtml(card.name)}</strong><small>COST ${card.cost} / HP ${card.currentHp} / AT ${displayedAttack(card)}</small></span><em>選択</em></button>`).join("")}</div>`;
    dom.dialogActions.innerHTML = "";
    const done = document.createElement("button");
    done.type = "button";
    done.className = "is-primary";
    done.textContent = `0 / 最大${maximum}枚で完了`;
    dom.dialogActions.append(done);
    dom.dialogBody.querySelectorAll("[data-choice-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const cardUid = button.dataset.choiceCard;
        if (selected.has(cardUid)) {
          selected.delete(cardUid);
          button.classList.remove("is-selected");
        } else if (selected.size < maximum) {
          selected.add(cardUid);
          button.classList.add("is-selected");
        }
        done.textContent = `${selected.size} / 最大${maximum}枚で完了`;
      });
    });
    if (!dom.dialog.open) dom.dialog.showModal();
    return new Promise((resolve) => {
      dialogResolver = resolve;
      done.addEventListener("click", () => closeDialog([...selected]));
    });
  }

  function detailMarkup(card, usable, { allowArtZoom = false } = {}) {
    const art = card.art ? `<img src="${escapeHtml(card.art)}" alt="" draggable="false">` : escapeHtml(card.name.slice(0, 1));
    const effectClass = usable ? " is-usable" : "";
    const effectLabel = card.effect;
    const zoomClass = card.art && allowArtZoom ? " is-zoomable" : "";
    const zoomAttributes = card.art && allowArtZoom ? ` data-reference-art-zoom="true" aria-label="${escapeHtml(card.name)}のイラスト。長押しで拡大"` : "";
    return `<div class="card-detail" style="--card-accent:${card.accent}">
      <div class="card-detail-card">
        <div class="card-detail-name"><span>${escapeHtml(card.name)}</span><span class="card-detail-cost">${card.cost}</span></div>
        <div class="card-detail-art${card.art ? " has-art" : ""}${zoomClass}"${zoomAttributes}>${art}</div>
        <div class="card-detail-effect${effectClass}" data-detail-effect>${escapeHtml(effectLabel)}</div>
        <div class="card-detail-stats"><span>HP ${card.currentHp}/${card.hp}</span><span>AT ${displayedAttack(card)}</span></div>
      </div>
    </div>`;
  }

  function installReferenceArtZoom(card) {
    const art = dom.dialogBody.querySelector("[data-reference-art-zoom]");
    const zoomDialog = document.querySelector("#card-art-dialog");
    const zoomImage = document.querySelector("#card-art-dialog-image");
    if (!art || !zoomDialog || !zoomImage || !card.art) return;
    let pressTimer = 0;
    let startX = 0;
    let startY = 0;
    const cancelPress = () => window.clearTimeout(pressTimer);
    art.addEventListener("pointerdown", (event) => {
      startX = event.clientX;
      startY = event.clientY;
      pressTimer = window.setTimeout(() => {
        zoomImage.src = card.art;
        zoomImage.alt = `${card.name}のイラスト拡大表示`;
        if (!zoomDialog.open) zoomDialog.showModal();
      }, 520);
    });
    art.addEventListener("pointermove", (event) => {
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 10) cancelPress();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => art.addEventListener(type, cancelPress));
    art.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  async function showCardDetail(side, card) {
    if (!canPlayerInspect()) return;
    const usable = side === "player" && canUseEffect(side, card);
    const pendingResult = askDialog({
      index: `CARD / No ${String(card.id).padStart(3, "0")}`,
      title: card.name,
      body: detailMarkup(card, usable),
      actions: usable ? [{ value: "effect", label: "効果を発動", primary: true }, { value: null, label: "閉じる" }] : [{ value: null, label: "閉じる", primary: true }],
      variant: "card",
    });
    if (usable) dom.dialogBody.querySelector("[data-detail-effect]")?.addEventListener("click", () => closeDialog("effect"));
    const result = await pendingResult;
    if (result === "effect") await useEffect(side, card);
  }

  async function handleCardClick(side, zone, cardUid) {
    if (!game || game.ended || game.busy) return;
    const card = findCard(side, cardUid);
    if (!card) return;
    if (side === "player" && zone === "hand") {
      if (!canSummonCard(card)) {
        clearPendingSummon();
        await summonPlayerCard(card);
        return;
      }
      if (game.pendingSummonUid !== card.uid) {
        armPendingSummon(card.uid);
        return;
      }
      clearPendingSummon();
      await summonPlayerCard(card);
      return;
    }
    clearPendingSummon();
    if (side === "player" && zone === "sub" && game.active === "player" && game.phase === "main") {
      const actions = [{ value: null, label: "閉じる" }];
      if (!game.player.swappedThisTurn) actions.push({ value: "swap", label: "メインアタッカーと入れ替える", primary: true });
      if (!game.player.subActionUsedThisTurn) actions.push({ value: "return", label: "手札に戻す" });
      if (actions.length === 1) {
        toast("このターン、このサブアタッカーに行える操作は残っていません。");
        return;
      }
      const action = await askDialog({
        index: "BATTLE / SUB ACTION",
        title: card.name,
        body: "<p>このサブアタッカーに行う操作を選んでください。</p>",
        actions,
      });
      if (action === "swap") swapWithMain("player", card);
      if (action === "return") returnSubToHand("player", card);
    }
  }

  async function summonPlayerCard(card) {
    if (!canSummonCard(card)) {
      if (!game.player.main && card.cost !== 0) toast("最初のメインアタッカーにはコスト0を召喚してください。");
      else if (game.player.subActionUsedThisTurn) toast("このターンはすでにサブアタッカーの召喚、または手札へ戻す操作を行っています。");
      else if (game.player.subs.length >= 2) toast("サブアタッカーは最大2体です。");
      else toast(`現在サブアタッカーに召喚できるのはコスト${allowedSubCost("player")}までです。`);
      return;
    }
    const index = game.player.hand.findIndex((candidate) => candidate.uid === card.uid);
    game.player.hand.splice(index, 1);
    if (!game.player.main) {
      game.player.main = card;
      toast(`『${card.name}』をメインアタッカーに召喚しました。`);
    } else {
      game.player.subs.push(card);
      game.player.subActionUsedThisTurn = true;
      toast(`『${card.name}』をサブアタッカーに召喚しました。`);
    }
    window.GameAudio?.playSfx("summon");
    render();
    await showHeroArrival("player", card);
  }

  function swapWithMain(side, card) {
    const owner = sideState(side);
    const subIndex = owner.subs.findIndex((candidate) => candidate.uid === card.uid);
    if (subIndex < 0 || !owner.main) return;
    const costLimit = currentSummonCost(side);
    if (card.cost > costLimit) {
      if (side === "player") {
        toast(`現在の召喚コストは${costLimit}です。コスト${card.cost}の『${card.name}』はメインアタッカーに出せません。`);
      }
      return;
    }
    const previousMain = owner.main;
    owner.main = owner.subs[subIndex];
    owner.subs[subIndex] = previousMain;
    owner.swappedThisTurn = true;
    toast(`『${owner.main.name}』がメインアタッカーになりました。`);
    render();
  }

  function returnSubToHand(side, card) {
    const owner = sideState(side);
    if (owner.subActionUsedThisTurn) return;
    const subIndex = owner.subs.findIndex((candidate) => candidate.uid === card.uid);
    if (subIndex < 0) return;
    const [returned] = owner.subs.splice(subIndex, 1);
    owner.hand.push(returned);
    owner.subActionUsedThisTurn = true;
    toast(`『${returned.name}』を手札に戻しました。`);
    render();
  }

  async function drawCard(side, amount = 1) {
    const owner = sideState(side);
    for (let count = 0; count < amount; count += 1) {
      if (owner.deck.length === 0) {
        await finishGame(otherSide(side), `${owner.label}はカードを引けませんでした。`);
        return false;
      }
      owner.hand.push(owner.deck.shift());
    }
    window.GameAudio?.playSfx("draw");
    render();
    return true;
  }

  function npcIdentity() {
    return game?.config?.npc ?? "iori";
  }

  function npcProfile() {
    return NPC_PROFILES[npcIdentity()] ?? NPC_PROFILES.iori;
  }

  function randomChoice(cards) {
    return cards[Math.floor(Math.random() * cards.length)] ?? null;
  }

  function publicNpcObservation() {
    const own = game.npc;
    const opponent = game.player;
    return {
      own: {
        main: own.main,
        subs: [...own.subs],
        hand: [...own.hand],
        grave: [...own.grave],
        deck: [...own.deck],
        seeds: [...own.seeds],
        currentCost: currentSummonCost("npc"),
        allowedSubCost: allowedSubCost("npc"),
      },
      opponent: {
        main: opponent.main,
        subs: [...opponent.subs],
        grave: [...opponent.grave],
        handCount: opponent.hand.length,
        deckCount: opponent.deck.length,
        seedCount: opponent.seeds.length,
      },
    };
  }

  function strategicCardScore(card) {
    const signatureBonus = [1, 6, 10].includes(card.id) ? 5000 : 0;
    const effectBonus = card.effectCode ? 700 : 0;
    return signatureBonus + effectBonus + card.cost * 900 + card.hp * 0.35 + card.at;
  }

  function sennaRedrawPriority(owner) {
    if (owner.deck.length < 2) return -1;
    const handSize = owner.hand.length;
    const hasAce = owner.hand.some((card) => ACE_CARD_IDS.has(card.id));
    const lowValueCount = owner.hand.filter((card) => strategicCardScore(card) < 2600).length;
    if (handSize === 0) return 3600;
    if (handSize === 1) return hasAce ? -1 : 3100 + lowValueCount * 150;
    if (handSize === 2) {
      if (hasAce) return lowValueCount === 2 ? 650 : -1;
      return 2100 + lowValueCount * 260;
    }
    if (handSize === 3 && !hasAce && lowValueCount >= 2) return 1150 + lowValueCount * 120;
    return -1;
  }

  function sennaSubCandidateScore(card) {
    const owner = game.npc;
    const enemy = game.player.main;
    const desiredCost = desiredNpcSubCost();
    const formationBonus = card.cost === desiredCost ? 1900 : 0;
    const lethalBonus = enemy && card.at >= enemy.currentHp ? 4800 : 0;
    const survivalBonus = enemy && card.currentHp > enemy.at ? 650 : 0;
    return strategicCardScore(card) + formationBonus + lethalBonus + survivalBonus;
  }

  function chooseNpcDiscardCards(cards, count) {
    if (npcIdentity() === "iori") {
      return [...cards].sort((left, right) => {
        const leftHero = left.id === 24 ? 1 : 0;
        const rightHero = right.id === 24 ? 1 : 0;
        return leftHero - rightHero || left.cost - right.cost || left.at - right.at || left.hp - right.hp;
      }).slice(0, count);
    }
    return [...cards].sort((left, right) => strategicCardScore(left) - strategicCardScore(right)).slice(0, count);
  }

  function chooseNpcPromotion(cards) {
    const highestCost = Math.max(...cards.map((card) => card.cost));
    const candidates = cards.filter((card) => card.cost === highestCost);
    if (npcIdentity() === "senna") {
      return [...candidates].sort((left, right) => strategicCardScore(right) - strategicCardScore(left))[0];
    }
    return candidates.find((card) => card.id === 24) ?? randomChoice(candidates);
  }

  function chooseSennaSeedCards(owner, maximum) {
    const observation = publicNpcObservation();
    const desiredSeedCount = observation.own.seeds.length === 0 ? 3 : observation.own.seeds.length === 1 ? 3 : 2;
    const needed = Math.max(0, Math.min(maximum, desiredSeedCount - observation.own.seeds.length));
    return [...owner.hand]
      .sort((left, right) => strategicCardScore(left) - strategicCardScore(right))
      .slice(0, needed)
      .map((card) => card.uid);
  }

  function chooseSennaRoyal(found, owner) {
    return [...found].sort((left, right) => {
      const score = (card) => {
        if (card.id === 6) {
          const endangered = !owner.main || owner.main.currentHp <= owner.main.hp / 2;
          return 100 + (owner.seeds.length <= 1 ? 45 : 0) + (endangered ? 30 : 0);
        }
        if (card.id === 7) return 85 + (owner.hand.length >= 4 ? 55 : 0) + (owner.deck.length >= 2 ? 10 : 0);
        return 0;
      };
      return score(right) - score(left);
    })[0];
  }

  async function chooseRoyalCard(side, found) {
    if (found.length <= 1) return found[0] ?? null;
    if (side === "player") {
      game.busy = false;
      const [selectedUid] = await chooseCards(found, 1, "手札に加えるカードを選択", "確認したカードから1枚を選んでください。");
      game.busy = true;
      return found.find((candidate) => candidate.uid === selectedUid) ?? found[0];
    }
    if (npcIdentity() === "iori") return found.find((candidate) => candidate.id === 6) ?? found[0];
    return chooseSennaRoyal(found, sideState(side));
  }

  function revealedCardMarkup(card, selectable) {
    const art = card.art ? `<img src="${escapeHtml(card.art)}" alt="">` : `<span>${escapeHtml(card.name.slice(0, 1))}</span>`;
    const tag = selectable ? "button" : "div";
    const attributes = selectable ? ` type="button" data-revealed-choice="${card.uid}"` : "";
    return `<${tag} class="revealed-card${selectable ? " is-selectable" : ""}"${attributes} style="--card-accent:${card.accent}">
      <span class="revealed-card-name">${escapeHtml(card.name)}</span>
      <span class="revealed-card-art${card.art ? " has-art" : ""}">${art}</span>
      <span class="revealed-card-stats">COST ${card.cost}<br>HP ${card.currentHp} / AT ${displayedAttack(card)}</span>
      ${selectable ? "<em>手札に加える</em>" : ""}
    </${tag}>`;
  }

  async function showRevealedCards(side, revealed, found) {
    const requiresSelection = side === "player" && found.length > 0;
    dialogClosable = !requiresSelection;
    dom.dialogClose.hidden = requiresSelection;
    dom.dialogIndex.textContent = "BATTLE / REVEAL";
    dom.dialogTitle.textContent = "ベビー・レヴィーの効果発動";
    dom.dialogBody.innerHTML = `<p>${requiresSelection ? "手札に加えるカードを1枚選んでください。" : "確認したカード。画面をタップすると対戦へ戻ります。"}</p><div class="revealed-card-list">${revealed.map((card) => revealedCardMarkup(card, requiresSelection && (card.id === 6 || card.id === 7))).join("")}</div>`;
    dom.dialogActions.innerHTML = "";
    if (!requiresSelection) {
      const done = document.createElement("button");
      done.type = "button";
      done.className = "is-primary";
      done.textContent = "確認";
      done.addEventListener("click", () => closeDialog(null));
      dom.dialogActions.append(done);
    }
    dom.dialogBody.querySelectorAll("[data-revealed-choice]").forEach((button) => {
      button.addEventListener("click", () => closeDialog(button.dataset.revealedChoice));
    });
    if (!dom.dialog.open) dom.dialog.showModal();
    return new Promise((resolve) => { dialogResolver = resolve; });
  }

  function fieldHealCandidates(side, sourceCard) {
    const own = sideState(side);
    const enemy = sideState(otherSide(side));
    return [
      ...[own.main, ...own.subs].filter(Boolean).map((card) => ({ side, card })),
      ...[enemy.main, ...enemy.subs].filter(Boolean).map((card) => ({ side: otherSide(side), card })),
    ].filter(({ card }) => card.uid !== sourceCard.uid && card.currentHp < card.hp);
  }

  async function chooseFieldHealTarget(side, sourceCard) {
    const candidates = fieldHealCandidates(side, sourceCard);
    if (candidates.length <= 1) return candidates[0] ?? null;
    if (side === "player") {
      game.busy = false;
      const [selectedUid] = await chooseCards(candidates.map(({ card }) => card), 1, "回復するモンスターを選択", "場に出ているモンスターから1体選んでください。");
      game.busy = true;
      return candidates.find(({ card }) => card.uid === selectedUid) ?? candidates[0];
    }
    if (npcIdentity() === "iori") return candidates[Math.floor(Math.random() * candidates.length)];
    const allies = candidates.filter((candidate) => candidate.side === side);
    if (allies.length === 0) return null;
    return [...allies].sort((left, right) => {
      const leftNeed = left.card.hp - left.card.currentHp;
      const rightNeed = right.card.hp - right.card.currentHp;
      return rightNeed - leftNeed || strategicCardScore(right.card) - strategicCardScore(left.card);
    })[0];
  }

  function removeCardToGrave(owner, card) {
    if (owner.main?.uid === card.uid) {
      owner.main = null;
      owner.grave.push(card);
      return "main";
    }
    const subIndex = owner.subs.findIndex((candidate) => candidate.uid === card.uid);
    if (subIndex >= 0) {
      owner.grave.push(owner.subs.splice(subIndex, 1)[0]);
      return "sub";
    }
    const handIndex = owner.hand.findIndex((candidate) => candidate.uid === card.uid);
    if (handIndex >= 0) {
      owner.grave.push(owner.hand.splice(handIndex, 1)[0]);
      return "hand";
    }
    return null;
  }

  async function showTimedCard(side, card, { title, index, duration }) {
    if (!game || game.ended) return;
    const wasBusy = game.busy;
    game.busy = true;
    render();
    const pending = askDialog({
      index,
      title,
      body: detailMarkup(card, false),
      actions: [],
      closable: false,
      variant: "spotlight",
    });
    await sleep(duration);
    if (dom.dialog.open) closeDialog(null);
    await pending;
    if (game && !game.ended) {
      game.busy = wasBusy;
      render();
    }
  }

  async function showHeroArrival(side, card) {
    if (!game || game.ended) return;
    if (!game.aceArrivalShown) game.aceArrivalShown = { player: false, npc: false };
    if (SPOTLIGHT_CARD_IDS.has(card.id) && !game.aceArrivalShown[side]) {
      game.aceArrivalShown[side] = true;
      await showAceSpotlight(side, card);
    }
  }

  async function showAceSpotlight(side, card, duration = 10000) {
    if (!game || game.ended || !dom.aceDialog) return;
    const wasBusy = game.busy;
    game.busy = true;
    render();
    dom.aceDialogBody.innerHTML = detailMarkup(card, false);
    if (dom.aceDialog.open) dom.aceDialog.close();
    dom.aceDialog.showModal();
    await new Promise((resolve) => {
      let settled = false;
      let timer = 0;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        dom.aceDialog.removeEventListener?.("click", finish);
        if (dom.aceDialog.open) dom.aceDialog.close();
        resolve();
      };
      timer = window.setTimeout(finish, duration);
      if (!settled) dom.aceDialog.addEventListener("click", finish, { once: true });
    });
    if (game && !game.ended) {
      game.busy = wasBusy;
      render();
    }
  }

  async function showAceEffect(side, card) {
    if (!SPOTLIGHT_CARD_IDS.has(card.id)) return;
    await askDialog({
      index: "BATTLE / ACE EFFECT",
      title: `『${card.name}』の効果発動`,
      body: detailMarkup(card, false),
      actions: [{ value: true, label: "確認", primary: true }],
      closable: false,
      variant: "ace-effect",
    });
  }

  async function useEffect(side, card) {
    if (!canUseEffect(side, card)) return false;
    const owner = sideState(side);
    game.busy = true;
    if (card.limit === "battle") card.usedBattle = true;
    if (card.limit === "turn") card.usedTurn = true;
    if (card.effectCode === "SEARCH_ROYAL") sharedTurnEffects(side).add("SEARCH_ROYAL");
    window.GameAudio?.playSfx("summon");
    await showAceEffect(side, card);

    if (card.effectCode === "DRAW_ONE") {
      toast(`『${card.name}』の効果：1枚ドロー。`);
      await drawCard(side, 1);
    }

    if (card.effectCode === "REDUCE_HP_BUFF_SELF") {
      const location = cardLocation(side, card);
      card.currentHp = Math.max(0, card.currentHp - 500);
      card.at += 500;
      toast(`『${card.name}』のHPを500減らし、ATを500上げました。`);
      if (card.currentHp <= 0) {
        if (location === "main") await destroyMain(side);
        else if (location === "sub") {
          removeCardToGrave(owner, card);
          toast(`『${card.name}』は効果でHPが0になり、破壊されました。`);
        }
      }
    }

    if (card.effectCode === "HEAL_MAIN_500") {
      removeCardToGrave(owner, card);
      const before = owner.main.currentHp;
      owner.main.currentHp = Math.min(owner.main.hp, owner.main.currentHp + 500);
      toast(`『${card.name}』を墓地へ送り、『${owner.main.name}』のHPを${owner.main.currentHp - before}回復。`);
    }

    if (card.effectCode === "REDRAW_TWO") {
      const returned = owner.hand.splice(0);
      owner.deck.push(...returned);
      shuffle(owner.deck);
      toast(`${returned.length}枚を戻し、2枚ドロー。`);
      await drawCard(side, 2);
    }

    if (card.effectCode === "SEARCH_ROYAL") {
      const revealed = owner.deck.splice(0, Math.min(3, owner.deck.length));
      const found = revealed.filter((candidate) => candidate.id === 6 || candidate.id === 7);
      let selected;
      if (side === "player") {
        const selectedUid = await showRevealedCards(side, revealed, found);
        selected = found.find((candidate) => candidate.uid === selectedUid) ?? null;
      } else {
        await showRevealedCards(side, revealed, found);
        selected = await chooseRoyalCard(side, found);
      }
      if (selected) {
        owner.hand.push(selected);
        const selectedIndex = revealed.findIndex((candidate) => candidate.uid === selected.uid);
        if (selectedIndex >= 0) revealed.splice(selectedIndex, 1);
        toast(`『${selected.name}』を手札に加えました。`);
      } else {
        toast("対象のカードは見つかりませんでした。");
      }
      owner.deck.push(...revealed);
    }

    if (card.effectCode === "HEAL_SELF_DAMAGE_MAIN") {
      const targetSide = otherSide(side);
      const target = sideState(targetSide).main;
      const before = card.currentHp;
      card.currentHp = Math.min(card.hp, card.currentHp + 300);
      if (target) {
        target.currentHp = Math.max(0, target.currentHp - 300);
        toast(`『${card.name}』を${card.currentHp - before}回復し、『${target.name}』へ300ダメージ。`);
        if (target.currentHp <= 0) await destroyMain(targetSide);
      }
    }

    if (card.effectCode === "DEBUFF_ENEMY_MAIN") {
      const target = sideState(otherSide(side)).main;
      if (target) {
        removeCardToGrave(owner, card);
        target.at = Math.max(0, target.at - 500);
        toast(`『${card.name}』を墓地へ送り、『${target.name}』のATを500下げました。`);
      }
    }

    if (card.effectCode === "SUB_HEAL_ANY") {
      const selected = await chooseFieldHealTarget(side, card);
      const target = selected?.card;
      if (target) {
        removeCardToGrave(owner, card);
        const before = target.currentHp;
        target.currentHp = Math.min(target.hp, target.currentHp + 500);
        toast(`『${card.name}』を墓地へ送り、『${target.name}』を${target.currentHp - before}回復。`);
      }
    }

    if (card.effectCode === "MATCH_ENEMY_HP") {
      const target = sideState(otherSide(side)).main;
      if (target) {
        card.at = target.currentHp;
        card.expiresAtEndOfTurn = true;
        toast(`『${card.name}』のATが変化しました。`);
      }
    }

    if (card.effectCode === "SACRIFICE_SELF_DRAW_SEED") {
      owner.subs = owner.subs.filter((candidate) => candidate.uid !== card.uid);
      owner.grave.push(card);
      const seedCard = owner.seeds.shift();
      owner.hand.push(seedCard);
      window.GameAudio?.playSfx("draw");
      toast(`『${card.name}』を墓地へ送り、種カード1枚を手札に加えました。`);
    }

    if (card.effectCode === "RETURN_SELF_AND_SEED") {
      const location = cardLocation(side, card);
      if (location === "main") {
        owner.main = null;
        await promoteSub(side);
      } else {
        owner.subs = owner.subs.filter((candidate) => candidate.uid !== card.uid);
      }
      owner.hand.push(card);
      const seedCount = Math.min(3, owner.hand.length);
      let selectedUids;
      if (side === "player") {
        game.busy = false;
        selectedUids = await chooseUpToCards(owner.hand, seedCount, "種に置くカード", `手札から最大${seedCount}枚を選んでください。0枚でも構いません。`);
        game.busy = true;
      } else if (npcIdentity() === "senna") {
        selectedUids = chooseSennaSeedCards(owner, seedCount);
      } else {
        selectedUids = shuffle([...owner.hand]).slice(0, seedCount).map((candidate) => candidate.uid);
      }
      selectedUids.forEach((selectedUid) => {
        const index = owner.hand.findIndex((candidate) => candidate.uid === selectedUid);
        if (index >= 0) owner.seeds.push(owner.hand.splice(index, 1)[0]);
      });
      toast(`${selectedUids.length}枚を種ゾーンに置きました。`);
      const opponent = sideState(otherSide(side));
      if (opponent.seeds.length > 0) {
        const returnedSeed = opponent.seeds.shift();
        opponent.hand.push(returnedSeed);
        window.GameAudio?.playSfx("draw");
        toast(`『${returnedSeed.name}』を相手の種ゾーンから手札へ加えさせました。`);
      }
    }

    if (game) {
      game.busy = false;
      render();
    }
    return true;
  }

  async function enforceHandLimit(side) {
    const owner = sideState(side);
    const excess = owner.hand.length - 5;
    if (excess <= 0) return true;
    let selectedUids;
    if (side === "player") {
      selectedUids = await chooseCards(owner.hand, excess, "捨て札を選択", `手札を5枚に減らすため、${excess}枚選んでください。`);
    } else {
      selectedUids = chooseNpcDiscardCards(owner.hand, excess).map((card) => card.uid);
    }
    selectedUids.forEach((cardUid) => {
      const index = owner.hand.findIndex((card) => card.uid === cardUid);
      if (index >= 0) owner.grave.push(owner.hand.splice(index, 1)[0]);
    });
    render();
    return true;
  }

  async function promoteSub(side) {
    const owner = sideState(side);
    if (owner.subs.length === 0) {
      await finishGame(otherSide(side), `${owner.label}のメインアタッカーが倒れ、交代できません。`);
      return false;
    }
    let promoted;
    if (owner.subs.length === 1 || side === "npc") {
      const selected = owner.subs.length === 1 ? owner.subs[0] : chooseNpcPromotion(owner.subs);
      const index = owner.subs.findIndex((candidate) => candidate.uid === selected.uid);
      [promoted] = owner.subs.splice(index, 1);
    } else {
      game.busy = false;
      const [selectedUid] = await chooseCards(owner.subs, 1, "次のメインアタッカーを選択", "サブアタッカーから1体選んでください。");
      game.busy = true;
      const index = owner.subs.findIndex((candidate) => candidate.uid === selectedUid);
      [promoted] = owner.subs.splice(index, 1);
    }
    owner.main = promoted;
    toast(`『${promoted.name}』がメインアタッカーへ出ました。`);
    render();
    return true;
  }

  async function resolveSpiderSeedOnDestroy(side, destroyed) {
    if (destroyed.effectCode !== "SPIDER_SEED_ON_DESTROY") return;
    const owner = sideState(side);
    const candidates = [...owner.hand, ...owner.subs].filter((card) => card.id === 12 || card.id === 13);
    if (candidates.length === 0) return;

    let selectedUid = candidates[0].uid;
    if (side === "player" && candidates.length > 1) {
      game.busy = false;
      [selectedUid] = await chooseCards(candidates, 1, "種ゾーンへ置くモンスターを選択", "『スモール・スパイダーズA』または『スモール・スパイダーズB』から1体選んでください。");
      game.busy = true;
    } else if (side === "npc" && candidates.length > 1 && npcIdentity() === "senna") {
      const enemyMain = publicNpcObservation().opponent.main;
      const preferredId = enemyMain?.at >= 500 ? 13 : 12;
      selectedUid = candidates.find((card) => card.id === preferredId)?.uid ?? candidates[0].uid;
    }

    let selected;
    const handIndex = owner.hand.findIndex((card) => card.uid === selectedUid);
    if (handIndex >= 0) [selected] = owner.hand.splice(handIndex, 1);
    if (!selected) {
      const subIndex = owner.subs.findIndex((card) => card.uid === selectedUid);
      if (subIndex >= 0) [selected] = owner.subs.splice(subIndex, 1);
    }
    if (!selected) return;
    owner.seeds.unshift(selected);
    toast(`『${selected.name}』を種ゾーンの手前に置きました。`);
  }

  async function destroyMain(side) {
    const owner = sideState(side);
    if (!owner.main) return;
    const destroyed = owner.main;
    const hadSeedBeforeDestruction = owner.seeds.length > 0;
    owner.main = null;
    owner.grave.push(destroyed);
    if (hadSeedBeforeDestruction) {
      owner.hand.push(owner.seeds.shift());
      window.GameAudio?.playSfx("draw");
      toast(`『${destroyed.name}』を破壊。種カード1枚を手札へ。`);
    } else {
      toast(`『${destroyed.name}』を破壊。種がないため敗北。`);
    }
    await resolveSpiderSeedOnDestroy(side, destroyed);
    render();
    await sleep(450);
    if (game.ended) return;
    if (!hadSeedBeforeDestruction) {
      await finishGame(otherSide(side), `${owner.label}は種がない状態でメインアタッカーを破壊されました。`);
      return;
    }
    await promoteSub(side);
  }

  async function attack(attackerSide) {
    if (!game || game.ended) return;
    const attacker = sideState(attackerSide);
    const defenderSide = otherSide(attackerSide);
    const defender = sideState(defenderSide);
    if (!attacker.main || !defender.main) return;
    game.busy = true;
    attacker.attackedThisTurn = true;
    game.phase = "battle";
    render();
    showPhase("BATTLE");
    window.GameAudio?.playSfx("attack");
    await sleep(420);
    const targetNode = defenderSide === "player" ? dom.playerMain.querySelector(".battle-card") : dom.npcMain.querySelector(".battle-card");
    targetNode?.classList.add("is-hit");
    const attackDebuffTriggered = attacker.main.effectCode === "ATTACK_DEBUFF_TARGET" && !attacker.main.usedBattle;
    if (attackDebuffTriggered) {
      defender.main.at = Math.max(0, defender.main.at - 500);
      attacker.main.usedBattle = true;
    }
    defender.main.currentHp = Math.max(0, defender.main.currentHp - attacker.main.at);
    toast(`『${attacker.main.name}』の攻撃\n${attacker.main.at}ダメージ！${attackDebuffTriggered ? `\n『${defender.main.name}』のATを500下げました。` : ""}`);
    await sleep(430);
    render();
    if (defender.main && defender.main.currentHp <= 0) await destroyMain(defenderSide);
    if (!game) return;
    game.busy = false;
    if (!game.ended && attackerSide === "player") game.phase = "postbattle";
    render();
  }

  function availableSubActionMessage(side) {
    const owner = sideState(side);
    if (game.phase !== "main" || !owner.main || owner.subActionUsedThisTurn) return "";
    const canSummon = owner.subs.length < 2 && owner.hand.some((card) => card.cost <= allowedSubCost(side));
    const canReturn = owner.subs.length > 0;
    if (canSummon && canReturn) return "サブアタッカーの召喚、またはサブアタッカーを手札に戻す操作ができます。";
    if (canSummon) return "サブアタッカーを召喚できます。";
    if (canReturn) return "サブアタッカーを手札に戻せます。";
    return "";
  }

  async function playerBattle() {
    if (!game || game.active !== "player" || game.busy || game.player.attackedThisTurn || isOpeningTurnWithoutBattle()) return;
    if (!game.player.main) {
      toast("メインアタッカーを召喚してください。");
      return;
    }
    await enforceHandLimit("player");
    if (!game.ended) await attack("player");
  }

  async function playerEndTurn() {
    if (!game || game.active !== "player" || game.busy || game.ended) return;
    if (!game.player.main) {
      toast("メインアタッカーを召喚してください。");
      return;
    }
    await enforceHandLimit("player");
    if (game.ended) return;
    if (!game.player.attackedThisTurn && !isOpeningTurnWithoutBattle()) {
      const skipBattle = await confirmAction("バトルを行わず終了", "バトルをしないでターンを終了してもよろしいですか？", "終了する");
      if (!skipBattle) return;
    }
    const subActionMessage = availableSubActionMessage("player");
    if (subActionMessage) {
      const skipSubAction = await confirmAction("サブ操作を見送る", `${subActionMessage}操作せずターンを終了しますか？`, "終了する");
      if (!skipSubAction) return;
    }
    await endTurn();
  }

  async function endTurn() {
    if (!game || game.ended) return;
    game.busy = true;
    await resolveEndTurnEffects(game.active);
    if (game.ended) return;
    game.phase = "transition";
    game.active = otherSide(game.active);
    game.turnNumber += 1;
    render();
    await sleep(300);
    await startTurn(game.active);
  }

  async function resolveEndTurnEffects(side) {
    const owner = sideState(side);
    const expiring = [owner.main, ...owner.subs, ...owner.hand].filter((card) => card?.expiresAtEndOfTurn);
    for (const card of expiring) {
      card.expiresAtEndOfTurn = false;
      const formerLocation = removeCardToGrave(owner, card);
      if (!formerLocation) continue;
      toast(`『${card.name}』をターン終了時に墓地へ送りました。`);
      render();
      await sleep(300);
      if (formerLocation === "main") {
        await promoteSub(side);
        if (game.ended) return;
      }
    }
  }

  function resetTurnFlags(side) {
    const owner = sideState(side);
    owner.subActionUsedThisTurn = false;
    owner.swappedThisTurn = false;
    owner.attackedThisTurn = false;
    if (side === "player") game.pendingSummonUid = null;
    sharedTurnEffects(side).clear();
    [owner.main, ...owner.subs, ...owner.hand].filter(Boolean).forEach((card) => { card.usedTurn = false; });
  }

  async function startTurn(side) {
    if (!game || game.ended) return;
    game.active = side;
    game.phase = "main";
    game.busy = true;
    resetTurnFlags(side);
    render();
    showPhase(side === "player" ? "あなたのターン" : `${npcProfile().shortName}のターン`);
    await sleep(650);
    const drew = await drawCard(side, 1);
    if (!drew || game.ended) return;
    game.busy = false;
    render();
    if (side === "player") {
      if (!game.player.main) toast("メインアタッカーを召喚してください。");
      return;
    }
    await runNpcTurn();
  }

  function npcSummonInitialMain() {
    const owner = game.npc;
    if (owner.main) return true;
    const candidates = owner.hand.filter((card) => card.cost === 0);
    if (candidates.length === 0) return false;
    const selected = npcIdentity() === "senna"
      ? [...candidates].sort((left, right) => strategicCardScore(right) - strategicCardScore(left))[0]
      : [...candidates].sort((left, right) => right.at - left.at || right.hp - left.hp)[0];
    owner.main = owner.hand.splice(owner.hand.findIndex((card) => card.uid === selected.uid), 1)[0];
    toast(`${npcProfile().shortName}は『${owner.main.name}』をメインアタッカーに召喚。`);
    window.GameAudio?.playSfx("summon");
    render();
    return true;
  }

  function desiredNpcSubCost() {
    const owner = game.npc;
    const current = currentSummonCost("npc");
    const upper = allowedSubCost("npc");
    if (current === upper) return current;
    const hasCurrent = owner.subs.some((card) => card.cost === current);
    const hasUpper = owner.subs.some((card) => card.cost === upper);
    if (!hasUpper) return upper;
    if (!hasCurrent) return current;
    return upper;
  }

  function chooseNpcSubCard() {
    const owner = game.npc;
    const candidates = owner.hand.filter((card) => card.cost <= allowedSubCost("npc"));
    if (candidates.length === 0) return null;
    if (npcIdentity() === "iori") {
      const hero = candidates.find((card) => card.id === 24);
      if (hero) return hero;
    }
    if (npcIdentity() === "senna") {
      return [...candidates].sort((left, right) => sennaSubCandidateScore(right) - sennaSubCandidateScore(left))[0];
    }
    const desiredCost = desiredNpcSubCost();
    const exact = candidates.filter((card) => card.cost === desiredCost);
    const pool = exact.length > 0 ? exact : candidates.filter((card) => card.cost === Math.max(...candidates.map((candidate) => candidate.cost)));
    return [...pool].sort((left, right) => right.at - left.at || right.hp - left.hp)[0];
  }

  function chooseNpcSubToReturn() {
    const owner = game.npc;
    if (owner.subActionUsedThisTurn || owner.subs.length === 0) return null;
    const current = currentSummonCost("npc");
    const upper = allowedSubCost("npc");
    const legalHand = owner.hand.filter((card) => card.cost <= upper);
    if (npcIdentity() === "iori") {
      const heroReady = legalHand.some((card) => card.id === 24);
      if (heroReady && owner.subs.length >= 2 && !owner.subs.some((card) => card.id === 24)) {
        return [...owner.subs].sort((left, right) => left.cost - right.cost || left.at - right.at)[0];
      }
      if (owner.subs.length < 2) return null;
      const desired = current === upper ? [current, current] : [current, upper];
      const missingCost = desired.find((cost, index) => owner.subs.filter((card) => card.cost === cost).length <= desired.slice(0, index).filter((item) => item === cost).length);
      if (missingCost === undefined || !legalHand.some((card) => card.cost === missingCost)) return null;
      const desiredCounts = new Map(desired.map((cost) => [cost, desired.filter((item) => item === cost).length]));
      return [...owner.subs].sort((left, right) => {
        const leftExcess = owner.subs.filter((card) => card.cost === left.cost).length > (desiredCounts.get(left.cost) ?? 0) ? 1 : 0;
        const rightExcess = owner.subs.filter((card) => card.cost === right.cost).length > (desiredCounts.get(right.cost) ?? 0) ? 1 : 0;
        return rightExcess - leftExcess || left.cost - right.cost || left.at - right.at;
      })[0];
    }
    if (owner.subs.length < 2 || legalHand.length === 0) return null;
    const weakest = [...owner.subs].sort((left, right) => strategicCardScore(left) - strategicCardScore(right))[0];
    const bestReplacement = [...legalHand].sort((left, right) => sennaSubCandidateScore(right) - sennaSubCandidateScore(left))[0];
    const enemy = game.player.main;
    const createsLethal = enemy && bestReplacement.at >= enemy.currentHp && weakest.at < enemy.currentHp;
    return createsLethal || sennaSubCandidateScore(bestReplacement) >= sennaSubCandidateScore(weakest) + 350 ? weakest : null;
  }

  async function npcManageSubAction() {
    const owner = game.npc;
    if (!owner.main || owner.subActionUsedThisTurn) return false;
    if (owner.subs.length < 2) {
      const selected = chooseNpcSubCard();
      if (selected) {
        owner.hand.splice(owner.hand.findIndex((card) => card.uid === selected.uid), 1);
        owner.subs.push(selected);
        owner.subActionUsedThisTurn = true;
        toast(`${npcProfile().shortName}は『${selected.name}』をサブアタッカーに召喚。`);
        window.GameAudio?.playSfx("summon");
        render();
        await showHeroArrival("npc", selected);
        return true;
      }
    }
    const returned = chooseNpcSubToReturn();
    if (!returned) return false;
    returnSubToHand("npc", returned);
    return true;
  }

  function npcMaybeSwap() {
    const owner = game.npc;
    if (!owner.main || owner.swappedThisTurn) return false;
    const candidates = owner.subs.filter((card) => card.cost <= currentSummonCost("npc"));
    if (candidates.length === 0) return false;
    let selected = null;
    if (npcIdentity() === "iori") {
      selected = candidates.find((card) => card.id === 24) ?? null;
      if (!selected && owner.main.currentHp <= owner.main.hp / 2) {
        selected = [...candidates]
          .filter((card) => card.currentHp > owner.main.currentHp)
          .sort((left, right) => right.cost - left.cost || right.currentHp - left.currentHp || right.at - left.at)[0] ?? null;
      }
    } else {
      const enemy = publicNpcObservation().opponent.main;
      const score = (card) => strategicCardScore(card)
        + card.currentHp * 0.65
        + (enemy && card.at >= enemy.currentHp ? 7000 : 0)
        + (enemy && card.currentHp > enemy.at ? 1200 : 0);
      const best = [...candidates].sort((left, right) => score(right) - score(left))[0];
      const endangered = owner.main.currentHp <= Math.max(owner.main.hp * 0.38, enemy?.at ?? 0);
      const createsLethal = enemy && best.at >= enemy.currentHp && owner.main.at < enemy.currentHp;
      if (createsLethal || score(best) >= score(owner.main) + 250 || (endangered && best.currentHp > owner.main.currentHp)) selected = best;
    }
    if (!selected) return false;
    swapWithMain("npc", selected);
    return true;
  }

  function sennaEffectPriority(card) {
    const observation = publicNpcObservation();
    const own = observation.own;
    const opponent = observation.opponent;
    const location = cardLocation("npc", card);
    if (card.effectCode === "DRAW_ONE") return own.deck.length > 0 ? 1900 - Math.max(0, own.hand.length - 4) * 220 : -1;
    if (card.effectCode === "REDUCE_HP_BUFF_SELF") {
      if (card.currentHp <= 500) return -1;
      const lethalBonus = opponent.main && card.at < opponent.main.currentHp && card.at + 500 >= opponent.main.currentHp ? 2600 : 0;
      return 350 + lethalBonus - (card.currentHp <= 1000 ? 500 : 0);
    }
    if (card.effectCode === "RETURN_SELF_AND_SEED") {
      const survival = own.seeds.length <= 1 ? 2600 : own.seeds.length === 2 ? 800 : 0;
      const pressure = opponent.seedCount <= 1 ? 1200 : 350;
      const rescue = location === "main" && card.currentHp <= (opponent.main?.at ?? 0) ? 900 : 0;
      return survival + pressure + rescue - (own.subs.length === 0 ? 5000 : 0);
    }
    if (card.effectCode === "REDRAW_TWO") {
      return sennaRedrawPriority(own);
    }
    if (card.effectCode === "SEARCH_ROYAL") {
      if (own.deck.length === 0) return -1;
      const alreadyHasRoyal = [own.main, ...own.subs, ...own.hand].some((item) => item && (item.id === 6 || item.id === 7));
      return alreadyHasRoyal ? 1700 : 2850;
    }
    if (card.effectCode === "HEAL_SELF_DAMAGE_MAIN") {
      if (!opponent.main) return -1;
      const missingHp = card.hp - card.currentHp;
      return 3050 + Math.min(300, missingHp) + (opponent.main.currentHp <= 300 ? 5000 : 0);
    }
    if (card.effectCode === "HEAL_MAIN_500") {
      if (!own.main || own.main.currentHp >= own.main.hp) return -1;
      const preventsDefeat = opponent.main && own.main.currentHp <= opponent.main.at && own.main.currentHp + 500 > opponent.main.at;
      return preventsDefeat ? 3600 : Math.min(500, own.main.hp - own.main.currentHp) >= 300 ? 850 : 150;
    }
    if (card.effectCode === "DEBUFF_ENEMY_MAIN") {
      if (!opponent.main || opponent.main.at <= 0) return -1;
      const preventsDefeat = own.main && own.main.currentHp <= opponent.main.at && own.main.currentHp > Math.max(0, opponent.main.at - 500);
      return preventsDefeat ? 3500 : opponent.main.at >= 1000 ? 900 : 200;
    }
    if (card.effectCode === "SUB_HEAL_ANY") {
      const allies = [own.main, ...own.subs].filter((item) => item && item.uid !== card.uid && item.currentHp < item.hp);
      if (allies.length === 0) return -1;
      return Math.max(...allies.map((item) => Math.min(500, item.hp - item.currentHp))) + 400;
    }
    if (card.effectCode === "SACRIFICE_SELF_DRAW_SEED") {
      if (own.seeds.length === 0 || !own.main) return -1;
      const frontSeed = own.seeds[0];
      const unlocksCost = own.currentCost < 3 && frontSeed?.cost >= own.currentCost + 1;
      const hasBackup = own.subs.some((item) => item.uid !== card.uid);
      return unlocksCost && (own.seeds.length >= 2 || hasBackup) ? 1250 + strategicCardScore(frontSeed) * 0.08 : -1;
    }
    return -1;
  }

  async function useAllIoriEffects() {
    for (let action = 0; action < 12 && !game.ended; action += 1) {
      const usable = [game.npc.main, ...game.npc.subs].filter((card) => card && canUseEffect("npc", card) && (card.id !== 24 || game.npc.main?.uid === card.uid));
      if (usable.length === 0) return;
      await useEffect("npc", usable[0]);
      await sleep(420);
    }
  }

  async function useSennaEffects() {
    for (let action = 0; action < 12 && !game.ended; action += 1) {
      const ranked = [game.npc.main, ...game.npc.subs]
        .filter((card) => card && canUseEffect("npc", card))
        .map((card) => ({ card, priority: sennaEffectPriority(card) }))
        .filter(({ priority }) => priority > 0)
        .sort((left, right) => right.priority - left.priority);
      if (ranked.length === 0) return;
      await useEffect("npc", ranked[0].card);
      await sleep(420);
    }
  }

  function shouldSennaAttack() {
    const observation = publicNpcObservation();
    const attacker = observation.own.main;
    const defender = observation.opponent.main;
    return Boolean(attacker && defender);
  }

  async function runNpcTurn() {
    if (!game || game.ended) return;
    game.busy = true;
    await sleep(420);
    if (!npcSummonInitialMain()) {
      await finishGame("player", `${npcProfile().shortName}はメインアタッカーを召喚できませんでした。`);
      return;
    }
    await sleep(420);
    game.busy = false;
    if (npcIdentity() === "iori") await useAllIoriEffects();
    else await useSennaEffects();
    if (game.ended) return;
    game.busy = false;
    npcMaybeSwap();
    game.busy = true;
    await npcManageSubAction();
    await sleep(480);
    game.busy = false;
    npcMaybeSwap();
    if (npcIdentity() === "iori") await useAllIoriEffects();
    else await useSennaEffects();
    if (game.ended) return;
    game.busy = true;
    const shouldAttack = npcIdentity() === "iori" ? true : shouldSennaAttack();
    if (!isOpeningTurnWithoutBattle() && shouldAttack && game.npc.main && game.player.main) await attack("npc");
    if (game.ended) return;
    await enforceHandLimit("npc");
    await sleep(450);
    game.busy = false;
    await endTurn();
  }

  async function finishGame(winner, reason) {
    if (!game || game.ended) return;
    game.ended = true;
    game.phase = "ended";
    game.busy = false;
    render();
    const playerWon = winner === "player";
    window.GameAudio?.finishBattle(playerWon);
    const action = await askDialog({
      index: "BATTLE / RESULT",
      title: playerWon ? "WIN" : "LOSE",
      body: `<div class="battle-result"><p>${escapeHtml(reason)}</p></div>`,
      actions: [{ value: "title", label: "タイトルへ" }, { value: "again", label: "もう一度", primary: true }],
      closable: false,
      variant: "result",
    });
    if (action === "again") start(game.config);
    if (action === "title") {
      game = null;
      window.AppNavigation?.showScreen("title");
    }
  }

  function graveMarkup(side) {
    const owner = sideState(side);
    if (owner.grave.length === 0) return "<p>墓地にカードはありません。</p>";
    return `<div class="grave-list">${owner.grave.map((card) => `<div class="grave-list-item" style="--card-accent:${card.accent}"><span class="grave-list-art">${escapeHtml(card.name.slice(0, 1))}</span><span><strong>${escapeHtml(card.name)}</strong><small>COST ${card.cost} / HP ${card.currentHp}/${card.hp} / AT ${displayedAttack(card)}</small></span></div>`).join("")}</div>`;
  }

  async function openGrave(side) {
    if (!game || game.busy || game.ended) return;
    const owner = sideState(side);
    await askDialog({
      index: `GRAVE / ${side === "player" ? "YOU" : npcProfile().key.toUpperCase()}`,
      title: `${owner.label}の墓地（${owner.grave.length}枚）`,
      body: graveMarkup(side),
      actions: [{ value: null, label: "閉じる", primary: true }],
    });
  }

  async function openMenu() {
    if (!game || game.ended || dom.dialog.open) return;
    game.paused = true;
    window.GameAudio?.playSfx("button");
    window.GameAudio?.setDucked(true);
    const action = await askDialog({
      index: "BATTLE / PAUSE",
      title: "対戦メニュー",
      body: "<p>対戦を一時停止しています。</p>",
      actions: [
        { value: "resume", label: "ゲームへ", primary: true },
        { value: "title", label: "タイトルへ" },
        {
          value: "sound",
          label: window.GameAudio?.isEnabled() === false ? "SOUND OFF" : "SOUND ON",
          keepOpen: true,
          onSelect: (button) => {
            const enabled = window.GameAudio?.toggle() ?? true;
            button.textContent = enabled ? "SOUND ON" : "SOUND OFF";
            if (enabled) window.GameAudio?.playSfx("button");
          },
        },
      ],
      closable: false,
    });
    if (action === "title") {
      window.GameAudio?.setDucked(false);
      game = null;
      window.AppNavigation?.showScreen("title");
      return;
    }
    window.GameAudio?.setDucked(false);
    if (game) game.paused = false;
  }

  async function sleep(milliseconds) {
    await new Promise((resolve) => window.setTimeout(resolve, milliseconds));
    while (game?.paused) await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  function start(config) {
    if (dom.dialog.open) closeDialog(null);
    window.GameAudio?.enterBattle(config.npc ?? "iori");
    const mats = ["mat-red", "mat-circle", "mat-none"];
    dom.playmat.classList.remove(...mats);
    dom.playmat.classList.add(mats[Math.floor(Math.random() * mats.length)]);
    const profile = NPC_PROFILES[config.npc] ?? NPC_PROFILES.iori;
    const npcDeck = config.npcDeck ?? profile.deck;
    game = {
      config: {
        ...config,
        npc: profile.key,
        npcDeck,
        playerDeckDefinition: Array.isArray(config.playerDeckDefinition)
          ? config.playerDeckDefinition.map(([id, count]) => [id, count])
          : null,
      },
      player: prepareSide("あなた", config.playerDeck, config.playerDeckDefinition),
      npc: prepareSide(profile.shortName, npcDeck),
      active: config.playerGoesFirst ? "player" : "npc",
      turnNumber: 1,
      phase: "setup",
      busy: true,
      paused: false,
      ended: false,
      pendingSummonUid: null,
      aceArrivalShown: { player: false, npc: false },
    };
    render();
    window.setTimeout(() => startTurn(game.active), 420);
  }

  dom.battleButton.addEventListener("click", playerBattle);
  dom.turnEndButton.addEventListener("click", playerEndTurn);
  dom.menu.addEventListener("click", openMenu);
  dom.playmat.addEventListener("click", (event) => {
    if (!game?.pendingSummonUid || event.target.closest?.(".player-hand .battle-card[data-card-uid]")) return;
    clearPendingSummon();
  });
  document.querySelectorAll("[data-open-grave]").forEach((button) => button.addEventListener("click", () => openGrave(button.dataset.openGrave)));
  dom.dialogClose.addEventListener("click", () => { if (dialogClosable) closeDialog(null); });
  dom.dialog.addEventListener("cancel", (event) => {
    if (!dialogClosable) event.preventDefault();
    else closeDialog(null);
  });
  dom.dialog.addEventListener("click", (event) => {
    if (!dialogClosable || event.target !== dom.dialog) return;
    closeDialog(null);
  });
  dom.aceDialog?.addEventListener("cancel", (event) => event.preventDefault());
  const artZoomDialog = document.querySelector("#card-art-dialog");
  const artZoomImage = document.querySelector("#card-art-dialog-image");
  const closeArtZoom = () => {
    if (!artZoomDialog?.open) return;
    artZoomDialog.close();
    if (artZoomImage) {
      artZoomImage.removeAttribute("src");
      artZoomImage.alt = "";
    }
  };
  document.querySelector("#card-art-dialog-close")?.addEventListener("click", closeArtZoom);
  artZoomDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeArtZoom();
  });
  artZoomDialog?.addEventListener("click", (event) => {
    if (event.target === artZoomDialog) closeArtZoom();
  });
  document.addEventListener?.("contextmenu", (event) => {
    if (event.target.closest?.(".catalog-card-art, .card-detail-art, #card-art-dialog")) event.preventDefault();
  });
  document.addEventListener?.("dragstart", (event) => {
    if (event.target.closest?.(".catalog-card-art, .card-detail-art, #card-art-dialog")) event.preventDefault();
  });

  function getAllCards() {
    return Object.values(CARD_LIBRARY).sort((left, right) => left.id - right.id).map((card) => ({ ...card }));
  }

  function getDeckCards(deckKey) {
    return (DECK_LISTS[deckKey] ?? DECK_LISTS.balance).map(([id, count]) => ({ ...CARD_LIBRARY[id], count }));
  }

  async function openCardReference(cardId, { allowArtZoom = false } = {}) {
    const base = CARD_LIBRARY[cardId];
    if (!base) return;
    const card = { ...base, currentHp: base.hp };
    const pendingResult = askDialog({
      index: `CARD / No ${String(card.id).padStart(3, "0")}`,
      title: card.name,
      body: detailMarkup(card, false, { allowArtZoom }),
      actions: [{ value: null, label: "閉じる", primary: true }],
    });
    if (allowArtZoom) installReferenceArtZoom(card);
    await pendingResult;
  }

  window.BattleGame = { start };
  window.CardCatalog = { getAllCards, getDeckCards, openCardReference };
})();
