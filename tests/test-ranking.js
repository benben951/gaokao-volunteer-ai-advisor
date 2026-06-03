const assert = require("node:assert/strict");
const test = require("node:test");

const { recommend } = require("../src/recommendation/ranking");
const records = require("../sample-data/admission_records.sample.json");

test("recommend returns explainable results with evidence and risk notes", () => {
  const results = recommend(records, {
    score: 450,
    rank: 120000,
    subject: "history",
    regionPreference: "north",
    interests: ["会计", "财经"],
    limit: 3,
  });

  assert.equal(results.length, 3);
  assert.equal(results[0].tier, "保底稳妥");
  assert.equal(results[0].evidence.referenceScore, 410);
  assert.equal(results[0].evidence.referenceRank, 160052);
  assert.equal(results[0].evidence.rankStatus, "better_than_reference");
  assert.ok(results[0].warnings.includes("样例数据仅用于工程演示，正式填报必须核验当年官方招生计划。"));
});

test("recommend filters by subject and never invents schools outside the candidate pool", () => {
  const results = recommend(records, {
    score: 450,
    subject: "physics",
    regionPreference: "north",
    interests: ["会计"],
  });

  assert.deepEqual(results, []);
});

test("recommend respects limit caps from the caller", () => {
  const results = recommend(records, {
    score: 450,
    subject: "history",
    regionPreference: "north",
    interests: ["会计"],
    limit: 2,
  });

  assert.equal(results.length, 2);
});
