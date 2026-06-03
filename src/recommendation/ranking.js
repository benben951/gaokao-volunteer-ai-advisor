function scoreProbability(delta) {
  if (delta >= 30) return 0.9;
  if (delta >= 15) return 0.78;
  if (delta >= 5) return 0.66;
  if (delta >= -5) return 0.52;
  if (delta >= -15) return 0.36;
  if (delta >= -25) return 0.22;
  return 0.12;
}

function regionScore(preference, province) {
  const north = new Set(["北京", "天津", "河北", "河南", "山东", "山西", "内蒙古", "辽宁", "吉林", "黑龙江"]);
  if (!preference || preference === "neutral") return 0.6;
  if (preference === "north") return north.has(province) ? 1 : 0.35;
  if (preference === "avoid_south_west") return north.has(province) ? 1 : 0.4;
  return 0.6;
}

function majorScore(record, interests = []) {
  if (!interests.length) return 0.4;
  const text = `${record.major || ""} ${(record.tags || []).join(" ")}`;
  const hits = interests.filter((item) => text.includes(item)).length;
  return hits ? Math.min(1, hits / interests.length + 0.25) : 0.2;
}

function tier(probability, delta) {
  if (probability >= 0.73 || delta >= 15) return "保底稳妥";
  if (probability >= 0.55) return "匹配稳健";
  if (probability >= 0.35) return "冲刺可尝试";
  return "风险较高";
}

function rankStatus(rankDelta) {
  if (rankDelta == null) return "unknown";
  if (rankDelta < 0) return "better_than_reference";
  if (rankDelta === 0) return "equal_to_reference";
  return "worse_than_reference";
}

function buildWarnings(record, probability, rankDelta) {
  const warnings = [
    "样例数据仅用于工程演示，正式填报必须核验当年官方招生计划。",
  ];

  if (probability < 0.55) {
    warnings.push("参考分数接近或低于往年记录，建议只作为冲刺项并配置稳妥保底。");
  }

  if (rankDelta != null && rankDelta > 0) {
    warnings.push("当前位次弱于样例参考位次，需要重点核验近年位次波动。");
  }

  if (!record.rank) {
    warnings.push("该样例记录缺少参考位次，排序时主要依赖分数与偏好。");
  }

  return warnings;
}

function recommend(records, profile) {
  const score = Number(profile.score);
  const rank = profile.rank ? Number(profile.rank) : null;
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  return records
    .filter((record) => record.subject === profile.subject)
    .map((record) => {
      const delta = score - Number(record.score || 0);
      const probability = scoreProbability(delta);
      const rankDelta = rank && record.rank ? rank - record.rank : null;
      const status = rankStatus(rankDelta);
      const total =
        probability * 48 +
        regionScore(profile.regionPreference, record.province) * 22 +
        majorScore(record, interests) * 20 +
        (record.nature === "公办" ? 10 : 0);

      return {
        ...record,
        delta,
        rankDelta,
        admitProbability: Math.round(probability * 100),
        tier: tier(probability, delta),
        evidence: {
          referenceScore: record.score ?? null,
          referenceRank: record.rank ?? null,
          scoreDelta: delta,
          rankDelta,
          rankStatus: status,
          subject: record.subject,
          batch: record.batch,
          dataScope: "sample_data",
        },
        warnings: buildWarnings(record, probability, rankDelta),
        reason: [
          `近年参考分 ${record.score}`,
          record.rank ? `参考位次 ${record.rank}` : null,
          record.nature === "公办" ? "公办院校" : null,
          record.province ? `${record.province}方向` : null,
        ]
          .filter(Boolean)
          .join("；"),
        total,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, profile.limit || 20);
}

module.exports = { recommend };
