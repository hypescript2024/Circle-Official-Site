"use strict";

(() => {
  const root = document.querySelector("#tutorial-player");
  if (!root) return;

  const nodes = {
    board: root.querySelector("#tutorial-board"),
    step: root.querySelector("#tutorial-step-number"),
    total: root.querySelector("#tutorial-step-total"),
    progress: root.querySelector("#tutorial-progress"),
    phase: root.querySelector("#tutorial-phase"),
    label: root.querySelector("#tutorial-caption-label"),
    text: root.querySelector("#tutorial-caption-text"),
    hand: root.querySelector("#tutorial-hand"),
    playerSeeds: root.querySelector("#tutorial-player-seeds"),
    enemySeeds: root.querySelector("#tutorial-enemy-seeds"),
    playerDeck: root.querySelector("#tutorial-player-deck"),
    enemyDeck: root.querySelector("#tutorial-enemy-deck"),
    cost: root.querySelector("#tutorial-cost"),
    prev: root.querySelector("#tutorial-prev"),
    toggle: root.querySelector("#tutorial-toggle"),
    next: root.querySelector("#tutorial-next"),
  };

  const cards = {
    tsukushi: { name: "つくし", cost: 0, hp: 300, at: 100, art: "../images/card/monster_card_illust/tukushi.png" },
    boy: { name: "つくしボーイ", cost: 1, hp: 500, at: 300, art: "../images/card/monster_card_illust/tukushi_boy.png" },
    rebel: { name: "反抗期のつくし", cost: 2, hp: 1500, at: 800, art: "../images/card/monster_card_illust/tukushi_hankoki.png" },
    dartagnan: { name: "ダルタニアン伯爵", cost: 1, hp: 1000, at: 500, art: "../images/card/monster_card_illust/darutanian.png" },
    astro: { name: "アストロ公爵", cost: 3, hp: 4000, at: 2000, art: "../images/card/monster_card_illust/astro.png" },
  };

  const baseHand = [cards.tsukushi, cards.boy, cards.rebel];
  const steps = [
    {
      phase: "START", label: "最初の一手", target: "hand", hand: baseHand,
      text: "最初はコスト0のモンスターを、メインアタッカーとして必ず召喚します。手札になければ、出るまで引き直します。",
    },
    {
      phase: "MAIN", label: "召喚コスト", target: "player-resource", playerMain: cards.tsukushi, hand: [cards.boy, cards.rebel],
      text: "現在の召喚コストは「3－種ゾーンの枚数」。種が3枚ならコスト0です。",
    },
    {
      phase: "MAIN", label: "サブアタッカー", target: "player-sub", playerMain: cards.tsukushi, playerSub: cards.boy, hand: [cards.rebel],
      text: "1ターンに1度、現在の召喚コスト以下、またはそれに＋1までのコストのモンスターをサブアタッカーに出せます。控えは最大2体です。",
    },
    {
      phase: "MAIN", label: "戻す・入れ替える", target: "player-sub", playerMain: cards.tsukushi, playerSub: cards.boy, hand: [cards.rebel],
      text: "サブアタッカーを出す代わりに、既に場に出ているサブアタッカー1体を手札へ戻すこともできます。メインアタッカーとの入れ替えは、これと別に1ターン1度行えます。",
    },
    {
      phase: "BATTLE", label: "攻撃", target: "enemy-main", playerMain: cards.dartagnan, playerSub: cards.boy, enemyMain: cards.tsukushi, hand: [cards.rebel], hit: true,
      text: "BATTLEではメインアタッカーが攻撃。攻撃力分のダメージを与え、相手のメインアタッカーの体力を0にしたら破壊できます。",
    },
    {
      phase: "DESTROY", label: "破壊と種の回収", target: "enemy-resource", playerMain: cards.dartagnan, playerSub: cards.boy, enemySub: cards.boy, playerSeeds: 3, enemySeeds: 2, hand: [cards.rebel],
      text: "メインアタッカーが破壊された時、種が残っていれば、手前の種1枚を手札に加えます。サブアタッカーがいれば、それが次のメインアタッカーになります。",
    },
    {
      phase: "LOSE", label: "敗北条件", target: "enemy-resource", playerMain: cards.dartagnan, enemyMain: cards.astro, playerSeeds: 3, enemySeeds: 0, hand: [cards.rebel], danger: true,
      text: "種が0枚の時にメインアタッカーが破壊されると、サブアタッカーがいても敗北。種が残っていても、交代するサブアタッカーがいなければ敗北です。",
    },
    {
      phase: "HAND", label: "手札の上限", target: "hand", playerMain: cards.dartagnan, playerSub: cards.boy, enemyMain: cards.astro, hand: [cards.tsukushi, cards.boy, cards.rebel, cards.dartagnan, cards.tsukushi, cards.boy, cards.astro],
      text: "手札が6枚以上でBATTLEかターンエンドを押すと、5枚になるまで選んで捨てます。それまでに5枚以下になれば、捨てる必要はありません。",
    },
    {
      phase: "EFFECT", label: "確認と効果発動", target: "player-main", playerMain: cards.astro, playerSub: cards.boy, enemyMain: cards.dartagnan, hand: baseHand,
      text: "自分のターンのBATTLE前は、自分の手札と場に出ている表向きカードを確認できます。テキストが青く光る時は効果が発動可能なので、押下して使用できます。",
    },
    {
      phase: "TURN END", label: "ターン終了と山札切れ", target: "actions", playerMain: cards.dartagnan, playerSub: cards.boy, enemyMain: cards.astro, playerDeck: 0, hand: baseHand,
      text: "攻撃せずにターン終了もできます（先攻1ターン目はBATTLEなし）。山札が0枚の状態でドローしなければならなくなった場合は敗北です。",
    },
  ];

  let index = 0;
  let timer = 0;
  let playing = false;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function cardMarkup(card, kind = "sub") {
    if (!card) return "";
    return `<div class="tutorial-card is-${kind}">
      <span>${escapeHtml(card.name)}</span><b>${card.cost}</b>
      <img src="${escapeHtml(card.art)}" alt="" draggable="false">
      <small>HP ${card.hp}<em>AT ${card.at}</em></small>
    </div>`;
  }

  function setSlot(name, card) {
    const slot = root.querySelector(`[data-tutorial-slot="${name}"]`);
    if (!slot) return;
    const label = slot.querySelector("small")?.textContent ?? "";
    slot.innerHTML = cardMarkup(card, name.endsWith("main") ? "main" : "sub") || `<small>${label}</small>`;
  }

  function schedule() {
    window.clearTimeout(timer);
    if (!playing) return;
    timer = window.setTimeout(() => {
      index = (index + 1) % steps.length;
      render();
      schedule();
    }, 6200);
  }

  function render() {
    const step = steps[index];
    nodes.step.textContent = String(index + 1).padStart(2, "0");
    nodes.total.textContent = String(steps.length).padStart(2, "0");
    nodes.phase.textContent = step.phase;
    nodes.label.textContent = step.label;
    nodes.text.textContent = step.text;
    nodes.playerSeeds.textContent = step.playerSeeds ?? 3;
    nodes.enemySeeds.textContent = step.enemySeeds ?? 3;
    nodes.playerDeck.textContent = step.playerDeck ?? 18;
    nodes.enemyDeck.textContent = step.enemyDeck ?? 18;
    nodes.cost.textContent = Math.max(0, 3 - (step.playerSeeds ?? 3));
    setSlot("player-main", step.playerMain);
    setSlot("player-sub", step.playerSub);
    setSlot("enemy-main", step.enemyMain);
    setSlot("enemy-sub", step.enemySub);
    const tutorialHand = step.hand ?? [];
    nodes.hand.dataset.count = String(tutorialHand.length);
    nodes.hand.innerHTML = tutorialHand.map((card) => cardMarkup(card, "hand")).join("");
    nodes.progress.innerHTML = steps.map((_, stepIndex) => `<span class="${stepIndex === index ? "is-current" : stepIndex < index ? "is-past" : ""}"></span>`).join("");
    nodes.board.querySelectorAll(".is-explained").forEach((node) => node.classList.remove("is-explained"));
    nodes.board.querySelector(`[data-tutorial-target="${step.target}"], [data-tutorial-slot="${step.target}"]`)?.classList.add("is-explained");
    nodes.board.classList.toggle("is-hit", Boolean(step.hit));
    nodes.board.classList.toggle("is-danger", Boolean(step.danger));
    nodes.prev.disabled = index === 0;
    nodes.next.disabled = index === steps.length - 1;
  }

  function setPlaying(value) {
    playing = value;
    nodes.toggle.textContent = playing ? "一時停止" : "再生";
    nodes.toggle.setAttribute("aria-pressed", String(!playing));
    schedule();
  }

  function move(amount) {
    index = Math.max(0, Math.min(steps.length - 1, index + amount));
    render();
    schedule();
  }

  nodes.prev.addEventListener("click", () => move(-1));
  nodes.next.addEventListener("click", () => move(1));
  nodes.toggle.addEventListener("click", () => setPlaying(!playing));

  function start() {
    index = 0;
    render();
    setPlaying(true);
  }

  function stop() {
    playing = false;
    window.clearTimeout(timer);
  }

  window.GameTutorial = { start, stop };
})();
