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
