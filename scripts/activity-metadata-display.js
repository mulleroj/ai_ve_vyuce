const ROLE_LABELS = Object.freeze({
  teacher_preparation: 'Učitel připravuje',
  teacher_led: 'Učitel vede AI',
  student_direct: 'Žák pracuje s AI',
  flexible: 'Učitel nebo žák'
});

const OPERATOR_DESCRIPTIONS = Object.freeze({
  teacher_preparation: 'Učitel AI obsluhuje při přípravě a výstup před použitím ověřuje. Žáci pracují s učitelem vybraným materiálem.',
  teacher_led: 'Učitel technicky obsluhuje AI a řídí její použití. Žáci se věnují popsané výukové činnosti.',
  student_direct: 'Žák přímo komunikuje s AI podle zadání. Učitel stanoví vzdělávací cíl a podmínky použití.',
  flexible: 'Režim určuje učitel podle školních podmínek. Přímý žákovský režim vyžaduje školou schválené prostředí.'
});

function formatTime(item, { approximate = true } = {}) {
  if (!item || item.status === 'unknown') return 'čas není určen';
  const number = item.range
    ? `${item.range.min}–${item.range.max}`
    : String(item.value);
  const unit = item.unit === 'minutes' ? 'min' : item.unit;
  const per = item.per ? ` na ${item.per === 'student' ? 'žáka' : item.per === 'text' ? 'text' : 'tým'}` : '';
  return `${approximate && item.status === 'unverified_estimate' ? 'asi ' : ''}${number} ${unit}${per}`;
}

function cardTimingLabel(timing) {
  if (timing.variants.length > 1) return 'Více režimů · rozpis v detailu';
  const phases = ['teacherPrep', 'learnerWork', 'teacherReview', 'activityTotal'].filter(key => timing[key]);
  if (phases.length > 1) return 'Více časových fází · rozpis v detailu';
  if (timing.teacherPrep) return `Příprava · ${formatTime(timing.teacherPrep)}`;
  if (timing.learnerWork) {
    return timing.learnerWork.per === 'student'
      ? `Práce žáků · ${formatTime(timing.learnerWork)}`
      : `Práce žáků · ${formatTime(timing.learnerWork)}`;
  }
  if (timing.teacherReview) return `Kontrola učitele · ${formatTime(timing.teacherReview)}`;
  if (timing.activityTotal) return `Aktivita · ${formatTime(timing.activityTotal)}`;
  return 'Čas zatím neurčen';
}

function timingDetails(timing) {
  const rows = [];
  const labels = {
    teacherPrep: 'Příprava učitele', learnerWork: 'Práce žáků',
    teacherReview: 'Kontrola učitele', activityTotal: 'Orientační celková délka aktivity'
  };
  for (const key of Object.keys(labels)) {
    if (timing[key]) rows.push({ label: labels[key], text: formatTime(timing[key]) });
  }
  if (timing.teacherPrep && timing.learnerWork === null) {
    rows.push({ label: 'Práce žáků', text: 'Čas není určen; příprava učitele není délkou žákovské práce.' });
  }
  for (const variant of timing.variants) {
    const phase = labels[variant.phase] || 'Časová fáze';
    rows.push({ label: variant.label, text: `${phase}: ${formatTime(variant.duration)}` });
  }
  if (timing.legacyUnclassified) {
    const note = timing.legacyUnclassified.note || 'Historický údaj; fáze není doložena.';
    rows.push({ label: 'Starší časový údaj', text: `${formatTime(timing.legacyUnclassified)}. ${note}` });
  }
  if (!rows.length) rows.push({ label: 'Délka', text: 'Není určena; neznámý čas není nula.' });
  return rows;
}

function usageDetails(usage) {
  const accessText = usage.studentDirectAccess === 'required'
    ? 'Přímá práce žáka s AI je součástí režimu; konkrétní nástroj a režim musí schválit škola.'
    : usage.studentDirectAccess === 'optional'
      ? 'Přímou práci žáka může učitel zvolit; pouze ve školou schváleném nástroji a režimu.'
      : 'Žák AI v tomto režimu přímo neobsluhuje. Obecná pravidla školy, ochrana dat a další povinnosti platí vždy.';
  return {
    roleLabel: ROLE_LABELS[usage.aiOperator],
    operatorDescription: OPERATOR_DESCRIPTIONS[usage.aiOperator],
    teacherRole: usage.teacherRole,
    studentRole: usage.studentRole,
    accessText,
    offlineAlternative: usage.offlineAlternative ? usage.offlineAlternative.description : null
  };
}

module.exports = { ROLE_LABELS, OPERATOR_DESCRIPTIONS, formatTime, cardTimingLabel, timingDetails, usageDetails };
