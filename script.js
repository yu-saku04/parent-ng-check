// ===========================
// Data
// ===========================

const QUESTIONS = [
  { id:  1, text: "子どもが考える前に指示してしまう",    category: "anticipation" },
  { id:  2, text: "話を最後まで聞かない",                category: "interrupting" },
  { id:  3, text: "「早くしなさい」と急かしてしまう",    category: "scolding"     },
  { id:  4, text: "理由を聞く前に叱る",                  category: "scolding"     },
  { id:  5, text: "結果だけで評価する",                  category: "results"      },
  { id:  6, text: "他の子と比べる",                      category: "results"      },
  { id:  7, text: "子どもの感情を面倒に感じる",          category: "emotion"      },
  { id:  8, text: "やりたいことを止める",                category: "anticipation" },
  { id:  9, text: "先回りして手伝う",                    category: "anticipation" },
  { id: 10, text: "機嫌によって対応が変わる",            category: "emotion"      },
  { id: 11, text: "すぐに解決策を言う",                  category: "interrupting" },
  { id: 12, text: "子どもの感情を軽く扱う",              category: "scolding"     },
];

// 5段階評価: 1=ない … 5=いつも
const CHOICES = [
  { label: "1", score: 0 },
  { label: "2", score: 1 },
  { label: "3", score: 2 },
  { label: "4", score: 3 },
  { label: "5", score: 4 },
];

const MAX_SCORE = QUESTIONS.length * CHOICES[CHOICES.length - 1].score; // 48

// max = question count × 4
const CATEGORIES = {
  anticipation: {
    name: "先回り・過干渉",
    max: 12,  // 3問 × 4
    icon: "🌱",
    advice: "「どうしたい？」と一声かけてみましょう。子どもの意思を先に聞くだけで、関係が変わっていきます。",
    positive: "子どもに考える余地を与えられています。",
    guide: {
      title: "先回りをやめる実践ガイド",
      tip: "子どもの「どうしたい？」を先に聞く習慣づけで、自主性と自信が育ちます。",
    },
  },
  interrupting: {
    name: "話を遮る",
    max: 8,   // 2問 × 4
    icon: "👂",
    advice: "最後まで聞くだけで、子どもの安心感が変わります。解決策より共感を先にしてみましょう。",
    positive: "子どもの話をしっかり最後まで聞けています。",
    guide: {
      title: "共感ファースト・聴き方ガイド",
      tip: "「解決策より先に共感」で、子どもの話す意欲がグッと変わります。",
    },
  },
  scolding: {
    name: "否定・叱責",
    max: 12,  // 3問 × 4
    icon: "💬",
    advice: "行動だけを指摘し、人格は否定しないよう意識しましょう。「〇〇はやめて」より「〇〇してみよう」。",
    positive: "子どもへの言葉かけが穏やかにできています。",
    guide: {
      title: "叱らずに伝える言い換え術",
      tip: "NGフレーズをポジティブな言葉に変えるだけで、子どもの反応が変わります。",
    },
  },
  results: {
    name: "結果・比較",
    max: 8,   // 2問 × 4
    icon: "⭐",
    advice: "結果より過程を見て、「頑張ったね」を大切に。他の子との比較は自己肯定感に影響します。",
    positive: "過程を見守る関わり方ができています。",
    guide: {
      title: "比べない・認める声かけ術",
      tip: "「結果より過程」を褒める言葉が、子どもの自己肯定感を育てます。",
    },
  },
  emotion: {
    name: "感情反応",
    max: 8,   // 2問 × 4
    icon: "💛",
    advice: "感情的になることは誰にでもあります。後から「さっきはごめんね」と修復できれば十分です。",
    positive: "感情を安定させた関わり方ができています。",
    guide: {
      title: "感情コントロール・実践ガイド",
      tip: "カッとなったときに使える「5秒ルール」と、関係を修復する言葉の習慣。",
    },
  },
};

// スコア範囲: 0〜48
const RESULT_TYPES = [
  {
    min:  0, max: 12,
    type: "安定型",
    comments: [
      "関わりが全体的に安定しています。このままの姿勢を大切にしていきましょう。",
      "子どもに寄り添う力がしっかり育っています。自信を持って接していきましょう。",
      "穏やかな関わり方ができています。その姿勢が子どもの安心感につながっています。",
    ],
    praise: "話を聞く姿勢や感情への配慮がしっかりできています。",
    color: "#6aab8e",
  },
  {
    min: 13, max: 24,
    type: "見直しポイントあり",
    comments: [
      "全体的にはうまく関われています。余裕がない時の対応だけ少し意識してみましょう。",
      "多くの場面では十分な関わりができています。気になる点から一つずつ整えましょう。",
      "良いところがたくさんある中で、少し見直せる部分があります。焦らず取り組みましょう。",
    ],
    praise: "多くの場面で落ち着いた対応ができています。",
    color: "#f0a500",
  },
  {
    min: 25, max: 36,
    type: "偏りあり",
    comments: [
      "いくつかのカテゴリに偏りが見られます。一番気になる点から取り組んでみましょう。",
      "気づけたことが大切な一歩です。苦手なパターンを一つ改善するだけで変わります。",
      "毎日頑張っている中でのことです。焦らず、できることから少しずつ変えていきましょう。",
    ],
    praise: "このチェックに向き合えたこと自体、子どもを大切にしている証です。",
    color: "#e07b54",
  },
  {
    min: 37, max: 48,
    type: "要見直し",
    comments: [
      "余裕のなさが関わりに影響しているかもしれません。まずは自分を労うことから始めましょう。",
      "正直に向き合えたからこそのスコアです。その誠実さが変化につながります。",
      "「気づくこと」が最初の変化です。焦らず、小さな一歩から始めていきましょう。",
    ],
    praise: "このチェックに最後まで向き合えた勇気を、自分に認めてあげましょう。",
    color: "#c55a4a",
  },
];

// ===========================
// State
// ===========================

let currentIndex = 0;
let answers = [];

// ===========================
// DOM refs
// ===========================

const screenTop    = document.getElementById("screen-top");
const screenQuiz   = document.getElementById("screen-quiz");
const screenResult = document.getElementById("screen-result");
const btnStart     = document.getElementById("btn-start");
const btnRetry     = document.getElementById("btn-retry");
const btnGuide     = document.getElementById("btn-guide");
const progressFill = document.getElementById("progress-fill");
const progressLabel= document.getElementById("progress-label");
const questionCard = document.getElementById("question-card");
const qNumber      = document.getElementById("q-number");
const qText        = document.getElementById("q-text");
const choicesList  = document.getElementById("choices-list");
const totalScore   = document.getElementById("total-score");
const scoreDenom   = document.getElementById("score-denom");
const resultBadge  = document.getElementById("result-badge");
const resultPraise = document.getElementById("result-praise");
const resultComment= document.getElementById("result-comment");
const categoryList = document.getElementById("category-list");
const adviceList   = document.getElementById("advice-list");
const guideSection = document.getElementById("guide-section");

// Set dynamic max score label
scoreDenom.textContent = `/ ${MAX_SCORE}点`;

// ===========================
// Navigation
// ===========================

function showScreen(screen) {
  [screenTop, screenQuiz, screenResult].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

btnStart.addEventListener("click", () => {
  currentIndex = 0;
  answers = [];
  showScreen(screenQuiz);
  renderQuestion(true);
});

btnRetry.addEventListener("click", () => {
  showScreen(screenTop);
});

// ===========================
// Quiz
// ===========================

function renderQuestion(immediate) {
  const q = QUESTIONS[currentIndex];

  // Hide card before DOM changes to prevent selected-state flash
  if (!immediate) {
    questionCard.style.opacity = "0";
  }

  // Progress
  const pct = (currentIndex / QUESTIONS.length) * 100;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = `${currentIndex + 1} / ${QUESTIONS.length}`;

  // Question text
  qNumber.textContent = `Q${q.id}`;
  qText.textContent = q.text;

  // Choices: 5段階スケール（横並び円形ボタン）
  choicesList.innerHTML = "";

  const scaleWrap = document.createElement("div");
  scaleWrap.className = "scale-wrap";

  const labels = document.createElement("div");
  labels.className = "scale-labels";
  labels.innerHTML = "<span>ない</span><span>いつも</span>";

  const btnRow = document.createElement("div");
  btnRow.className = "scale-buttons";

  CHOICES.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "scale-btn";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => handleAnswer(choice.score, btn));
    btnRow.appendChild(btn);
  });

  scaleWrap.appendChild(labels);
  scaleWrap.appendChild(btnRow);
  choicesList.appendChild(scaleWrap);

  // Entrance animation
  questionCard.classList.remove("animate");
  void questionCard.offsetWidth;
  questionCard.classList.add("animate");
  if (!immediate) {
    questionCard.style.opacity = "";
  }
}

function handleAnswer(score, selectedBtn) {
  // Disable all choices immediately to prevent double-tap
  choicesList.querySelectorAll("button").forEach(b => (b.disabled = true));
  selectedBtn.classList.add("selected");

  answers.push(score);

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < QUESTIONS.length) {
      renderQuestion(false);
    } else {
      showResults();
    }
  }, 320);
}

// ===========================
// Results
// ===========================

function showResults() {
  const total = answers.reduce((sum, s) => sum + s, 0);

  // Tally scores per category
  const catScores = {};
  Object.keys(CATEGORIES).forEach(key => (catScores[key] = 0));
  QUESTIONS.forEach((q, i) => { catScores[q.category] += answers[i]; });

  // Result type
  const result = RESULT_TYPES.find(r => total >= r.min && total <= r.max);
  const comment = result.comments[Math.floor(Math.random() * result.comments.length)];

  // --- Score card ---
  totalScore.textContent = total;
  resultBadge.textContent = result.type;
  resultBadge.style.backgroundColor = result.color;
  resultPraise.textContent = result.praise;
  resultComment.textContent = comment;

  // --- Category bars ---
  categoryList.innerHTML = "";
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const score = catScores[key];
    const pct   = Math.round((score / cat.max) * 100);
    const colorClass = pct >= 67 ? "bar-high" : pct >= 34 ? "bar-mid" : "bar-low";

    const item = document.createElement("div");
    item.className = "category-item";
    item.innerHTML = `
      <div class="category-header">
        <span class="category-name">${cat.name}</span>
        <span class="category-score-text">${score} / ${cat.max}</span>
      </div>
      <div class="category-bar-bg">
        <div class="category-bar-fill ${colorClass}" data-width="${pct}%"></div>
      </div>
    `;
    categoryList.appendChild(item);
  });

  // --- Advice (sorted by % score descending) ---
  adviceList.innerHTML = "";

  const sorted = Object.entries(CATEGORIES).sort(([aKey, aCat], [bKey, bCat]) => {
    return (catScores[bKey] / bCat.max) - (catScores[aKey] / aCat.max);
  });

  const threshold = 0.34;
  const doingWell = sorted.filter(([key]) => catScores[key] / CATEGORIES[key].max < threshold);
  const needsWork = sorted.filter(([key]) => catScores[key] / CATEGORIES[key].max >= threshold);

  // Always show at least one positive item (fallback: lowest-scoring category)
  const praiseItems = doingWell.length > 0 ? doingWell : [sorted[sorted.length - 1]];

  const sectionLabel = (text, mod) => {
    const p = document.createElement("p");
    p.className = "advice-section-label" + (mod ? ` ${mod}` : "");
    p.textContent = text;
    return p;
  };

  adviceList.appendChild(sectionLabel("できていること", "advice-section-positive"));
  praiseItems.forEach(([key, cat]) => {
    const item = document.createElement("div");
    item.className = "advice-item advice-positive";
    item.innerHTML = `
      <span class="advice-icon">${cat.icon}</span>
      <div>
        <p class="advice-category-name advice-name-positive">${cat.name}</p>
        <p class="advice-text">${cat.positive}</p>
      </div>
    `;
    adviceList.appendChild(item);
  });

  if (needsWork.length > 0) {
    adviceList.appendChild(sectionLabel("見直しポイント", ""));
    needsWork.forEach(([key, cat]) => {
      const pct = catScores[key] / cat.max;
      const item = document.createElement("div");
      item.className = "advice-item" + (pct >= 0.67 ? " advice-priority" : "");
      item.innerHTML = `
        <span class="advice-icon">${cat.icon}</span>
        <div>
          <p class="advice-category-name">${cat.name}</p>
          <p class="advice-text">${cat.advice}</p>
        </div>
      `;
      adviceList.appendChild(item);
    });
  }

  // --- Guide section (チラ見せ: 上位2件を無料公開、残りをブラー) ---
  guideSection.innerHTML = "";

  const guideCard = document.createElement("div");
  guideCard.className = "card guide-card";
  guideCard.innerHTML = `
    <div class="guide-card-header">
      <h3 class="card-heading guide-title">あなたへの育成ガイド</h3>
      <span class="guide-price-tag">¥980</span>
    </div>
    <p class="guide-subtitle">診断結果をもとにした、具体的な改善プログラム</p>
  `;

  // 無料プレビュー: スコア上位2カテゴリ
  sorted.slice(0, 2).forEach(([key, cat], i) => {
    const item = document.createElement("div");
    item.className = "guide-item guide-item-free";
    item.innerHTML = `
      <span class="guide-num">0${i + 1}</span>
      <div>
        <p class="guide-item-title">${cat.guide.title}</p>
        <p class="guide-item-tip">${cat.guide.tip}</p>
      </div>
    `;
    guideCard.appendChild(item);
  });

  // ロック済み: 残り3カテゴリをブラー表示
  const lockedItems = sorted.slice(2);
  if (lockedItems.length > 0) {
    const lockedWrap = document.createElement("div");
    lockedWrap.className = "guide-locked-wrap";

    const blurList = document.createElement("div");
    blurList.className = "guide-items-blur";
    lockedItems.forEach(([key, cat], i) => {
      const item = document.createElement("div");
      item.className = "guide-item";
      item.innerHTML = `
        <span class="guide-num">0${i + 3}</span>
        <div>
          <p class="guide-item-title">${cat.guide.title}</p>
          <p class="guide-item-tip">${cat.guide.tip}</p>
        </div>
      `;
      blurList.appendChild(item);
    });

    const overlay = document.createElement("div");
    overlay.className = "guide-lock-overlay";
    overlay.innerHTML = `
      <span class="guide-lock-icon">🔒</span>
      <p class="guide-lock-text">残り${lockedItems.length}つのガイドが含まれます</p>
    `;

    lockedWrap.appendChild(blurList);
    lockedWrap.appendChild(overlay);
    guideCard.appendChild(lockedWrap);
  }

  guideSection.appendChild(guideCard);

  showScreen(screenResult);

  // Animate bars after screen is visible
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll(".category-bar-fill").forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    });
  });
}
