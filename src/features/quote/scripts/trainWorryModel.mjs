// 번뇌 분류 나이브 베이즈 학습 스크립트. 개발 PC에서만 실행하고, 결과(data/worryModel.json)만 앱에 들어간다.
// 실행: node --experimental-strip-types src/features/quote/scripts/trainWorryModel.mjs
// 1) 예문의 80%로 학습해 남은 20%로 성능을 잰다.
// 2) 예문 전체로 다시 학습해 점수표를 저장한다.
// 'unsure'도 하나의 종류로 학습한다 (예문: unsure.txt). 애매한 문장을 억지로 다른 종류에 넣지 않게 하려는 것이다.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreWorryModel, toNgrams } from '../utils/worryModel.ts';
import { WORRY_KEYWORDS, WORRY_KIND_PRIORITY } from '../utils/worryKeywords.ts';
import { WORRY_CASES } from '../utils/worryCases.ts';

const here = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(here, '../data/worryExamples');
const outPath = join(here, '../data/worryModel.json');

const ALPHA = 0.5; // 라플라스 스무딩. 처음 보는 조각에도 0이 아닌 확률을 준다.
const SCALE = 100; // 점수를 정수로 저장하기 위한 배율
// 1등과 2등의 점수 차이가 이보다 작으면 'unsure'. 0이면 'unsure'로 학습된 문장만 'unsure'가 된다.
// 'unsure'가 너무 많이 나오는 게 문제라서 0으로 정했다 (quote 담당 결정, 2026-10-31).
const minMargin = 0;

const readLines = (name) =>
  readFileSync(join(examplesDir, `${name}.txt`), 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

const kinds = [...WORRY_KIND_PRIORITY, 'unsure'];
// 고민 문장 모음(worryCases.ts)에 있는 문장은 학습에서 뺀다. 그래야 그 테스트가 처음 보는 문장 시험이 된다.
const testTexts = new Set(WORRY_CASES.map(([text]) => text));
const examples = kinds.flatMap((kind) =>
  readLines(kind)
    .filter((text) => !testTexts.has(text))
    .map((text, i) => ({ text, kind, i })),
);

function train(rows) {
  const counts = new Map();
  const totals = kinds.map(() => 0);
  for (const { text, kind } of rows) {
    const k = kinds.indexOf(kind);
    for (const gram of toNgrams(text)) {
      if (!counts.has(gram)) counts.set(gram, kinds.map(() => 0));
      counts.get(gram)[k]++;
      totals[k]++;
    }
  }
  const vocab = counts.size;
  const logProb = (c, k) => Math.round(Math.log((c + ALPHA) / (totals[k] + ALPHA * vocab)) * SCALE);
  const grams = {};
  for (const [gram, c] of counts) grams[gram] = c.map((n, k) => logProb(n, k));
  return { kinds, scale: SCALE, unknown: kinds.map((_, k) => logProb(0, k)), grams };
}

function matchKeyword(text) {
  const compact = text.replace(/\s+/g, '');
  let best = 'unsure';
  let bestScore = 0;
  for (const kind of WORRY_KIND_PRIORITY) {
    const score = WORRY_KEYWORDS[kind].filter((kw) => compact.includes(kw.replace(/\s+/g, ''))).length;
    if (score > bestScore) {
      best = kind;
      bestScore = score;
    }
  }
  return best;
}

const matchModel = (model, text, minMargin) => {
  const result = scoreWorryModel(model, text);
  return result && result.margin >= minMargin ? result.kind : 'unsure';
};
const matchHybrid = (model, text, minMargin) => {
  const keyword = matchKeyword(text);
  return keyword !== 'unsure' ? keyword : matchModel(model, text, minMargin);
};

const accuracy = (rows, fn) => rows.filter(([text, expected]) => fn(text) === expected).length / rows.length;
const pct = (x) => `${(x * 100).toFixed(1)}%`;

// 1) 80/20 나눠서 평가. 종류마다 5번째 예문을 평가용으로 남긴다 (같은 입력이면 같은 분할).
const trainRows = examples.filter(({ i }) => i % 5 !== 0);
const testRows = examples.filter(({ i }) => i % 5 === 0).map(({ text, kind }) => [text, kind]);
const evalModel = train(trainRows);

const kindTest = testRows.filter(([, kind]) => kind !== 'unsure');
const unsureTest = testRows.filter(([, kind]) => kind === 'unsure');
console.log(`예문 ${examples.length}개 (학습 ${trainRows.length} / 평가 ${testRows.length}), 기준값 minMargin = ${minMargin}`);
const report = (label, rows, model) =>
  console.log(
    `${label.padEnd(18)} 키워드 ${pct(accuracy(rows, matchKeyword)).padStart(6)} | 모델 ${pct(
      accuracy(rows, (t) => matchModel(model, t, minMargin)),
    ).padStart(6)} | 섞기 ${pct(accuracy(rows, (t) => matchHybrid(model, t, minMargin))).padStart(6)}`,
  );
report('남긴 예문 (7종류)', kindTest, evalModel);
report('남긴 예문 (애매)', unsureTest, evalModel);

// 기준값을 바꿀 때 참고하도록 다른 값의 결과도 보여준다.
for (const m of [1, 2, 3, 5]) {
  const kindAcc = pct(accuracy(kindTest, (t) => matchHybrid(evalModel, t, m)));
  const unsureAcc = pct(accuracy(unsureTest, (t) => matchHybrid(evalModel, t, m)));
  console.log(`  (참고) minMargin ${m}: 7종류 ${kindAcc}, 애매 ${unsureAcc}`);
}

// 2) 전체 예문으로 다시 학습해 저장
const model = { ...train(examples), minMargin };
report('고민 문장 모음', WORRY_CASES, model);
writeFileSync(outPath, JSON.stringify(model));
console.log(`저장: data/worryModel.json (조각 ${Object.keys(model.grams).length}개, ${(JSON.stringify(model).length / 1024).toFixed(0)}KB)`);
