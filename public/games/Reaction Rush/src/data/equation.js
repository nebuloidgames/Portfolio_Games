/**
 * Reaction Rush - Dynamic Math Equation Engine
 * Generates calibrated math equations and 4 multiple-choice options with
 * difficulty scaling across levels (Easy, Medium, Hard, Expert) and stages (L-1 to L-5).
 */

// Helper to get random integer between min and max (inclusive)
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array (Fisher-Yates)
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Generate 3 plausible distractors for a correct numerical answer.
 * Guarantees that all 4 choices are unique and reasonable.
 */
const generateDistractors = (answer, context = {}) => {
  const distractors = new Set();
  const { operand1, operand2, operator } = context;

  // Potential distractor strategies
  const candidatePool = [];

  // 1. Off-by-one / off-by-two
  candidatePool.push(answer + 1, answer - 1, answer + 2, answer - 2);

  // 2. Off-by-ten / off-by-five
  candidatePool.push(answer + 10, answer - 10, answer + 5, answer - 5);

  // 3. Flipped digits if 2-digit number (e.g., 42 -> 24)
  if (Math.abs(answer) >= 10 && Math.abs(answer) <= 99) {
    const str = String(Math.abs(answer));
    if (str[0] !== str[1]) {
      const flipped = parseInt(str.split("").reverse().join(""), 10);
      candidatePool.push(answer < 0 ? -flipped : flipped);
    }
  }

  // 4. Operator confusion distractors if operands available
  if (operand1 !== undefined && operand2 !== undefined) {
    if (operator === "+") {
      candidatePool.push(Math.abs(operand1 - operand2));
      candidatePool.push(operand1 * operand2);
    } else if (operator === "-") {
      candidatePool.push(operand1 + operand2);
      candidatePool.push(operand1 * operand2);
    } else if (operator === "×" || operator === "*") {
      candidatePool.push(operand1 + operand2);
      candidatePool.push(answer + operand1, answer - operand1);
      candidatePool.push(answer + operand2, answer - operand2);
    } else if (operator === "÷" || operator === "/") {
      candidatePool.push(operand1 * operand2);
      candidatePool.push(operand1 - operand2);
    }
  }

  // Shuffle candidates and insert valid candidates
  const shuffledCandidates = shuffle(candidatePool);
  for (const num of shuffledCandidates) {
    if (
      num !== answer &&
      !distractors.has(num) &&
      Number.isInteger(num) &&
      (answer >= 0 ? num >= 0 : true) // avoid negative numbers if answer is positive
    ) {
      distractors.add(num);
      if (distractors.size >= 3) break;
    }
  }

  // Fallback random offsets if not enough unique distractors
  let offset = 3;
  while (distractors.size < 3) {
    const delta = Math.random() < 0.5 ? offset : -offset;
    const candidate = answer + delta;
    if (candidate !== answer && !distractors.has(candidate) && (answer >= 0 ? candidate >= 0 : true)) {
      distractors.add(candidate);
    }
    offset += randInt(1, 4);
  }

  return Array.from(distractors).slice(0, 3);
};

/**
 * Question generator by level and stage
 */
export const generateQuestion = (level = "easy", stage = 1) => {
  let question = "";
  let answer = 0;
  let category = "Math Reflex";
  let opContext = {};

  const lvl = level.toLowerCase();
  const stg = Math.min(Math.max(Number(stage) || 1, 1), 5);

  // =========================================================================
  // EASY LEVEL (Stages 1-5)
  // Focus: Foundational arithmetic, fast recognition, tables 1-10
  // =========================================================================
  if (lvl === "easy") {
    if (stg === 1) {
      // Stage 1: Single digit addition (1-9 + 1-9)
      category = "Single-Digit Addition";
      const a = randInt(1, 9);
      const b = randInt(1, 9);
      question = `${a} + ${b} = ?`;
      answer = a + b;
      opContext = { operand1: a, operand2: b, operator: "+" };
    } else if (stg === 2) {
      // Stage 2: Subtraction up to 20 & simple addition
      category = "Basic Subtraction & Addition";
      const isSub = Math.random() < 0.6;
      if (isSub) {
        const b = randInt(2, 9);
        const a = randInt(b + 1, 19);
        question = `${a} - ${b} = ?`;
        answer = a - b;
        opContext = { operand1: a, operand2: b, operator: "-" };
      } else {
        const a = randInt(6, 12);
        const b = randInt(3, 8);
        question = `${a} + ${b} = ?`;
        answer = a + b;
        opContext = { operand1: a, operand2: b, operator: "+" };
      }
    } else if (stg === 3) {
      // Stage 3: Double-digit + single-digit without complex carrying
      category = "Double-Digit Essentials";
      const isAdd = Math.random() < 0.6;
      if (isAdd) {
        const a = randInt(11, 45);
        const b = randInt(2, 9);
        question = `${a} + ${b} = ?`;
        answer = a + b;
        opContext = { operand1: a, operand2: b, operator: "+" };
      } else {
        const a = randInt(15, 50);
        const b = randInt(2, 9);
        question = `${a} - ${b} = ?`;
        answer = a - b;
        opContext = { operand1: a, operand2: b, operator: "-" };
      }
    } else if (stg === 4) {
      // Stage 4: Basic Multiplication (tables 2-5) & double-digit sums
      category = "Multiplication Basics (2–5)";
      const isMult = Math.random() < 0.65;
      if (isMult) {
        const a = randInt(2, 5);
        const b = randInt(2, 10);
        question = `${a} × ${b} = ?`;
        answer = a * b;
        opContext = { operand1: a, operand2: b, operator: "×" };
      } else {
        const a = randInt(20, 50);
        const b = randInt(12, 35);
        question = `${a} + ${b} = ?`;
        answer = a + b;
        opContext = { operand1: a, operand2: b, operator: "+" };
      }
    } else {
      // Stage 5: Multiplication tables up to 10 & basic exact division
      category = "Multiplication & Division (1–10)";
      const isDiv = Math.random() < 0.5;
      if (isDiv) {
        const divisor = randInt(2, 9);
        const quotient = randInt(2, 10);
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient;
        opContext = { operand1: dividend, operand2: divisor, operator: "÷" };
      } else {
        const a = randInt(6, 10);
        const b = randInt(3, 9);
        question = `${a} × ${b} = ?`;
        answer = a * b;
        opContext = { operand1: a, operand2: b, operator: "×" };
      }
    }
  }

  // =========================================================================
  // MEDIUM LEVEL (Stages 1-5)
  // Focus: 2-digit regrouping, tables 6-12, missing numbers, basic 2-step
  // =========================================================================
  else if (lvl === "medium") {
    if (stg === 1) {
      // Stage 1: 2-digit addition & subtraction with carrying/borrowing
      category = "2-Digit Addition & Subtraction";
      const isAdd = Math.random() < 0.55;
      if (isAdd) {
        const a = randInt(25, 78);
        const b = randInt(18, 59);
        question = `${a} + ${b} = ?`;
        answer = a + b;
        opContext = { operand1: a, operand2: b, operator: "+" };
      } else {
        const b = randInt(19, 58);
        const a = randInt(b + 15, 99);
        question = `${a} - ${b} = ?`;
        answer = a - b;
        opContext = { operand1: a, operand2: b, operator: "-" };
      }
    } else if (stg === 2) {
      // Stage 2: Multiplication (tables 6-12) & division
      category = "Rapid Times Tables (6–12)";
      const isDiv = Math.random() < 0.45;
      if (isDiv) {
        const divisor = randInt(4, 12);
        const quotient = randInt(4, 12);
        const dividend = divisor * quotient;
        question = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient;
        opContext = { operand1: dividend, operand2: divisor, operator: "÷" };
      } else {
        const a = randInt(6, 12);
        const b = randInt(4, 12);
        question = `${a} × ${b} = ?`;
        answer = a * b;
        opContext = { operand1: a, operand2: b, operator: "×" };
      }
    } else if (stg === 3) {
      // Stage 3: Missing value equation (? + b = c, a × ? = c, etc.)
      category = "Missing Value Equations";
      const type = randInt(1, 3);
      if (type === 1) {
        // ? + b = c
        const b = randInt(15, 45);
        const c = randInt(b + 12, 95);
        answer = c - b;
        question = `? + ${b} = ${c}`;
        opContext = { operand1: c, operand2: b, operator: "-" };
      } else if (type === 2) {
        // a × ? = c
        const a = randInt(4, 11);
        answer = randInt(3, 12);
        const c = a * answer;
        question = `${a} × ? = ${c}`;
        opContext = { operand1: c, operand2: a, operator: "÷" };
      } else {
        // ? - b = c
        const b = randInt(12, 40);
        const c = randInt(15, 55);
        answer = b + c;
        question = `? - ${b} = ${c}`;
        opContext = { operand1: b, operand2: c, operator: "+" };
      }
    } else if (stg === 4) {
      // Stage 4: 2-step mixed operations without parentheses (BODMAS)
      category = "2-Step BODMAS (Order of Operations)";
      const pattern = randInt(1, 3);
      if (pattern === 1) {
        // a + b × c
        const a = randInt(5, 30);
        const b = randInt(2, 8);
        const c = randInt(2, 7);
        question = `${a} + ${b} × ${c} = ?`;
        answer = a + b * c;
      } else if (pattern === 2) {
        // a × b - c
        const a = randInt(3, 9);
        const b = randInt(3, 8);
        const c = randInt(2, 18);
        question = `${a} × ${b} - ${c} = ?`;
        answer = a * b - c;
      } else {
        // a - b ÷ c
        const c = randInt(2, 6);
        const quotient = randInt(2, 8);
        const b = c * quotient;
        const a = randInt(quotient + 5, 40);
        question = `${a} - ${b} ÷ ${c} = ?`;
        answer = a - quotient;
      }
    } else {
      // Stage 5: Operations with parentheses
      category = "Bracket Operations (a ± b) × c";
      const isMult = Math.random() < 0.65;
      if (isMult) {
        const a = randInt(4, 18);
        const b = randInt(2, 12);
        const c = randInt(2, 6);
        question = `(${a} + ${b}) × ${c} = ?`;
        answer = (a + b) * c;
      } else {
        const c = randInt(2, 6);
        const quotient = randInt(3, 9);
        const sum = c * quotient;
        const b = randInt(2, sum - 2);
        const a = sum + b;
        question = `(${a} - ${b}) ÷ ${c} = ?`;
        answer = quotient;
      }
    }
  }

  // =========================================================================
  // HARD LEVEL (Stages 1-5)
  // Focus: 3-digit operations, 2-digit multiplication, complex BODMAS, squares
  // =========================================================================
  else if (lvl === "hard") {
    if (stg === 1) {
      // Stage 1: 3-digit addition & subtraction
      category = "3-Digit Arithmetic Rush";
      const isAdd = Math.random() < 0.55;
      if (isAdd) {
        const a = randInt(125, 680);
        const b = randInt(115, 450);
        question = `${a} + ${b} = ?`;
        answer = a + b;
        opContext = { operand1: a, operand2: b, operator: "+" };
      } else {
        const b = randInt(120, 480);
        const a = randInt(b + 110, 950);
        question = `${a} - ${b} = ?`;
        answer = a - b;
        opContext = { operand1: a, operand2: b, operator: "-" };
      }
    } else if (stg === 2) {
      // Stage 2: 2-digit multiplication (12-25 × 3-15)
      category = "Mental Multiplication Sprint";
      const a = randInt(12, 25);
      const b = randInt(4, 14);
      question = `${a} × ${b} = ?`;
      answer = a * b;
      opContext = { operand1: a, operand2: b, operator: "×" };
    } else if (stg === 3) {
      // Stage 3: 3-step arithmetic with BODMAS
      category = "3-Step BODMAS Calculation";
      const pattern = randInt(1, 2);
      if (pattern === 1) {
        // a × b + c ÷ d
        const a = randInt(3, 9);
        const b = randInt(4, 10);
        const d = randInt(2, 6);
        const q = randInt(2, 8);
        const c = d * q;
        question = `${a} × ${b} + ${c} ÷ ${d} = ?`;
        answer = a * b + q;
      } else {
        // a + b × c - d
        const a = randInt(15, 60);
        const b = randInt(3, 8);
        const c = randInt(4, 9);
        const d = randInt(5, 25);
        question = `${a} + ${b} × ${c} - ${d} = ?`;
        answer = a + b * c - d;
      }
    } else if (stg === 4) {
      // Stage 4: Missing value in expressions (e.g. (? + a) × b = c)
      category = "Complex Missing Value";
      const pattern = randInt(1, 2);
      if (pattern === 1) {
        // (? + a) × b = c
        answer = randInt(3, 16);
        const a = randInt(2, 15);
        const b = randInt(2, 6);
        const c = (answer + a) * b;
        question = `(? + ${a}) × ${b} = ${c}`;
      } else {
        // a × ? - b = c
        const a = randInt(3, 8);
        answer = randInt(4, 14);
        const b = randInt(5, 25);
        const c = a * answer - b;
        question = `${a} × ? - ${b} = ${c}`;
      }
    } else {
      // Stage 5: Squares and Square Roots
      category = "Squares & Square Roots";
      const isSqrt = Math.random() < 0.5;
      if (isSqrt) {
        const root = randInt(6, 25);
        const sq = root * root;
        question = `√${sq} = ?`;
        answer = root;
      } else {
        const isSum = Math.random() < 0.4;
        if (isSum) {
          const a = randInt(3, 9);
          const b = randInt(3, 8);
          question = `${a}² + ${b}² = ?`;
          answer = a * a + b * b;
        } else {
          const a = randInt(6, 20);
          question = `${a}² = ?`;
          answer = a * a;
        }
      }
    }
  }

  // =========================================================================
  // EXPERT LEVEL (Stages 1-5)
  // Focus: Powers, cubes, roots, multi-bracket, linear algebra, mental percentages
  // =========================================================================
  else {
    if (stg === 1) {
      // Stage 1: Cubes, powers & roots combined
      category = "Cubes & Powers Mastery";
      const type = randInt(1, 3);
      if (type === 1) {
        // a³ - b
        const a = randInt(2, 6);
        const b = randInt(5, 30);
        question = `${a}³ - ${b} = ?`;
        answer = Math.pow(a, 3) - b;
      } else if (type === 2) {
        // √a + b²
        const root = randInt(5, 16);
        const a = root * root;
        const b = randInt(3, 9);
        question = `√${a} + ${b}² = ?`;
        answer = root + b * b;
      } else {
        // a² - b²
        const a = randInt(9, 18);
        const b = randInt(4, a - 1);
        question = `${a}² - ${b}² = ?`;
        answer = a * a - b * b;
      }
    } else if (stg === 2) {
      // Stage 2: Multi-bracket expressions
      category = "Multi-Bracket Evaluation";
      const a = randInt(15, 35);
      const b = randInt(5, 14);
      const c = randInt(10, 25);
      const d = randInt(2, 9);
      question = `(${a} - ${b}) × (${c} - ${d}) = ?`;
      answer = (a - b) * (c - d);
    } else if (stg === 3) {
      // Stage 3: Linear algebra equations (find x)
      category = "Linear Algebra Reflex (Find x)";
      const pattern = randInt(1, 2);
      if (pattern === 1) {
        // ax + b = c
        const a = randInt(2, 7);
        answer = randInt(3, 15);
        const b = randInt(4, 30);
        const c = a * answer + b;
        question = `${a}x + ${b} = ${c},  x = ?`;
      } else {
        // a(x - b) = c
        const a = randInt(2, 6);
        answer = randInt(6, 18);
        const b = randInt(2, 5);
        const c = a * (answer - b);
        question = `${a}(x - ${b}) = ${c},  x = ?`;
      }
    } else if (stg === 4) {
      // Stage 4: Mental percentages & rapid chains
      category = "Mental Percentages Sprint";
      const pArr = [10, 20, 25, 50, 75];
      const p = pArr[randInt(0, pArr.length - 1)];
      let base = 0;
      if (p === 10) base = randInt(4, 35) * 10;
      else if (p === 20) base = randInt(3, 25) * 20;
      else if (p === 25 || p === 75) base = randInt(2, 16) * 40;
      else base = randInt(6, 40) * 10;

      const pctVal = Math.round((p / 100) * base);
      const addBonus = randInt(5, 35);
      question = `${p}% of ${base} + ${addBonus} = ?`;
      answer = pctVal + addBonus;
    } else {
      // Stage 5: Grand Master Math Challenge
      category = "Grand Master Reflex";
      const challengeType = randInt(1, 3);
      if (challengeType === 1) {
        // (√a × b) + c²
        const root = randInt(6, 16);
        const a = root * root;
        const b = randInt(2, 5);
        const c = randInt(4, 9);
        question = `(√${a} × ${b}) + ${c}² = ?`;
        answer = root * b + c * c;
      } else if (challengeType === 2) {
        // ax² = c, x = ?
        const a = randInt(2, 5);
        answer = randInt(3, 10);
        const c = a * answer * answer;
        question = `${a}x² = ${c},  x = ?`;
      } else {
        // (a³ - b) ÷ c
        const a = randInt(3, 6);
        const cube = Math.pow(a, 3);
        const c = randInt(2, 5);
        const q = randInt(4, 12);
        const b = cube - c * q;
        if (b > 0) {
          question = `(${a}³ - ${b}) ÷ ${c} = ?`;
          answer = q;
        } else {
          const root = randInt(7, 15);
          question = `√${root * root} + ${randInt(12, 35)} × 3 = ?`;
          answer = root + 36;
        }
      }
    }
  }

  // Generate 3 unique distractors
  const distractors = generateDistractors(answer, opContext);

  // Combine and shuffle options
  const allChoices = [answer, ...distractors];
  const options = shuffle(allChoices);
  const correctOptionIndex = options.indexOf(answer);

  return {
    id: `${lvl}-${stg}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    question,
    answer,
    options,
    correctOptionIndex,
    category,
    level: lvl,
    stage: stg,
  };
};

/**
 * Pre-generate a batch of questions for smooth transitions
 */
export const getQuestionBatch = (level = "easy", stage = 1, count = 10) => {
  return Array.from({ length: count }, () => generateQuestion(level, stage));
};

export default generateQuestion;
