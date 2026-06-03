# LLM Boundaries

This project uses an LLM as an advisor, not as the source of admission truth.

The safest product rule is:

> The recommendation API creates the candidate pool. The LLM explains, compares, and plans only from that pool.

## Why This Boundary Exists

Gaokao volunteer advice is a high-stakes decision-support scenario. A convincing but unsupported answer can cause real harm.

The LLM should therefore never be allowed to:

- invent schools or majors outside the candidate pool
- fabricate admission scores, ranks, quotas, or batch rules
- present outdated data as current-year certainty
- override official admission plans or university regulations
- promise an admission outcome

## Input Contract For AI Advice

The backend should send a compact, auditable payload:

```json
{
  "profile": {
    "score": 450,
    "rank": 120000,
    "subject": "history",
    "regionPreference": "north",
    "interests": ["会计", "财经"]
  },
  "candidatePool": [
    {
      "school": "长春金融高等专科学校",
      "major": "大数据与会计",
      "tier": "保底稳妥",
      "admitProbability": 90,
      "evidence": {
        "referenceScore": 410,
        "referenceRank": 160052,
        "scoreDelta": 40,
        "rankStatus": "better_than_reference",
        "dataScope": "sample_data"
      },
      "warnings": [
        "样例数据仅用于工程演示，正式填报必须核验当年官方招生计划。"
      ]
    }
  ]
}
```

## Output Contract

AI output should include:

- a plain-language summary
- school/major trade-off explanation
- risk notes tied to `evidence` and `warnings`
- four-year university action plan
- graduation branch comparison
- official verification reminder

AI output should not include:

- new schools not present in `candidatePool`
- unsupported score/rank claims
- definitive admission guarantees
- medical/legal/financial-style certainty wording

## Recommended Prompt Guardrail

```text
You are a Gaokao volunteer-advice assistant.

Use only the candidatePool records provided by the backend.
Do not invent schools, majors, scores, ranks, quotas, or admission rules.
If the candidate pool is insufficient, say what data is missing and ask the user to verify official sources.
Every recommendation must mention its evidence and uncertainty.
Actual application decisions must be checked against official current-year data.
```

## Product Implication

This boundary makes the system more credible in interviews because it shows the project is not just "LLM in a web page." It is a decision-support system with:

- deterministic retrieval/ranking
- auditable evidence fields
- explicit uncertainty messaging
- source-of-truth separation
- model-risk controls
