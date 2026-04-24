// ===========================
// Data
// ===========================

const QUESTIONS = [
  { id:  1, text: "子どもが考える前に指示してしまう",    category: "anticipation" },
  { id:  2, text: "話を最後まで聞かない",                category: "interrupting" },
  { id:  3, text: "「早くしなさい」と言う",              category: "scolding"     },
  { id:  4, text: "理由を聞く前に叱る",                  category: "scolding"     },
  { id:  5, text: "結果だけで評価する",                  category: "results"      },
  { id:  6, text: "他の子と比べる",                      category: "results"      },
  { id:  7, text: "子どもの感情を面倒に感じる",          category: "emotion"      },
  { id:  8, text: "やりたいことを止める",                category: "anticipation" },
  { id:  9, text: "先回りして手伝う",                    category: "anticipation" },
  { id: 10, text: "機嫌によって対応が変わる",            category: "emotion"      },
  { id: 11, text: "すぐに解決策を言う",                  category: "interrupting" },
  { id: 12, text: "子どもの感情を軽く扱う",              category: "scolding"     },
  { id: 13, text: "スマホを見ながら話を聞く",            category: "interrupting" },
  { id: 14, text: "できていない所ばかり見る",            category: "results"      },
  { id: 15, text: "子どもをコントロールしようとする",    category: "anticipation" },
];

const CHOICES = [
  { label: "ほとんどない",  score: 0 },
  { label: "たまにある",    score: 1 },
  { label: "よくある",      score: 2 },
  { label: "かなりある",    score: 3 },
];

// max = question count × 3
const CATEGORIES = {
  anticipation: {
    name: "先回り・過干渉",
    max: 12,
    icon: "🌱",
    advice: "「どうしたい？」と一声かけてみましょう。子どもの意思を先に聞くだけで、関係が変わっていきます。",
  },
  interrupting: {
    name: "話を遮る",
    max: 9,
    icon: "👂",
    advice: "最後まで聞くだけで、子どもの安心感が変わります。解決策より共感を先にしてみましょう。",
  },
  scolding: {
    name: "否定・叱責",
    max: 9,
    icon: "💬",
    advice: "行動だけを指摘し、人格は否定しないよう意識しましょう。「〇〇はやめて」より「〇〇してみよう」。",
  },
  results: {
    name: "結果・比較",
    max: 9,
    icon: "⭐",
    advice: "結果より過程を見て、「頑張ったね」を大切に。他の子との比較は自己肯定感に影響します。",
  },
  emotion: {
    name: "感情反応",
    max: 6,
    icon: "💛",
    advice: "感情的になることは誰にでもあります。後から「さっきはごめんね」と修復できれば十分です。",
  },
};

const RESULT_TYPES = [
  {
    min:  0, max: 10,
    type: "安定型",
    comment: "関わりは安定しています。このまま継続していきましょう。",
    color: "#6aab8e",
  },
  {
    min: 11, max: 22,
    type: "見直しポイントあり",
    comment: "一部に改善の余地があります。余裕がない時の対応を少し見直しましょう。",
    color: "#f0a500",
  },
  {
    min: 23, max: 34,
    type: "偏りあり",
    comment: "関わりに偏りがあります。まずは話をじっくり聞く時間を意識してみましょう。",
    color: "#e07b54",
  },
  {
    min: 35, max: 45,
    type: "要見直し",
    comment: "余裕のなさが影響している可能性があります。焦らず、小さな改善から始めましょう。",
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
const progressFill = document.getElementById("progress-fill");
const progressLabel= document.getElementById("progress-label");
const questionCard = document.getElementById("question-card");
const qNumber      = document.getElementById("q-number");
const qText        = document.getElementById("q-text");
const choicesList  = document.getElementById("choices-list");
const totalScore   = document.getElementById("total-score");
const resultBadge  = document.getElementById("result-badge");
const resultComment= document.getElementById("result-comment");
const categoryList = document.getElementById("category-list");
const adviceList   = document.getElementById("advice-list");

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

  // Progress
  const pct = (currentIndex / QUESTIONS.length) * 100;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = `${currentIndex + 1} / ${QUESTIONS.length}`;

  // Question text
  qNumber.textContent = `Q${q.id}`;
  qText.textContent = q.text;

  // Choices
  choicesList.innerHTML = "";
  CHOICES.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `
      <span class="choice-label">${choice.label}</span>
      <span class="choice-score">${choice.score}点</span>
    `;
    btn.addEventListener("click", () => handleAnswer(choice.score, btn));
    choicesList.appendChild(btn);
  });

  // Entrance animation
  if (!immediate) {
    questionCard.classList.remove("animate");
    // force reflow so the animation restarts
    void questionCard.offsetWidth;
  }
  questionCard.classList.add("animate");
}

function handleAnswer(score, selectedBtn) {
  // Disable all choices immediately to prevent double-tap
  choicesList.querySelectorAll(".choice-btn").forEach(b => (b.disabled = true));
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

  // --- Score card ---
  totalScore.textContent = total;
  resultBadge.textContent = result.type;
  resultBadge.style.backgroundColor = result.color;
  resultComment.textContent = result.comment;

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

  sorted.forEach(([key, cat]) => {
    const pct = catScores[key] / cat.max;
    const isPriority = pct >= 0.5;

    const item = document.createElement("div");
    item.className = "advice-item" + (isPriority ? " advice-priority" : "");
    item.innerHTML = `
      <span class="advice-icon">${cat.icon}</span>
      <div>
        <p class="advice-category-name">${cat.name}</p>
        <p class="advice-text">${cat.advice}</p>
      </div>
    `;
    adviceList.appendChild(item);
  });

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
