const express = require("express");
const path = require("path");
const fs = require("fs");
const { recommend } = require("../recommendation/ranking");

const app = express();
const port = Number(process.env.PORT || 8787);

const samplePath = path.join(__dirname, "../../sample-data/admission_records.sample.json");
const records = JSON.parse(fs.readFileSync(samplePath, "utf8"));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mode: "sample-data",
    records: records.length,
    note: "Use DATABASE_URL and import scripts for production data.",
  });
});

app.get("/api/recommend", (req, res) => {
  const profile = {
    score: Number(req.query.score || 450),
    rank: req.query.rank ? Number(req.query.rank) : null,
    subject: String(req.query.subject || "history"),
    regionPreference: String(req.query.region || "north"),
    interests: String(req.query.interests || "会计,财经")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    limit: Math.min(Number(req.query.limit || 10), 30),
  };

  res.json({
    profile,
    data_scope: "sample only; not real full production dataset",
    results: recommend(records, profile),
  });
});

app.listen(port, () => {
  console.log(`Gaokao portfolio demo listening on http://127.0.0.1:${port}`);
});
