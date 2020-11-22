export default function buildLevel(workAge, score, text) {
    let lv = '...';
    const ageLv = (workAge + 0.455) ** 0.88; // 0.5+
    const scoreLv = (score + 3) / 6; // 0.5+
    const total = ageLv + scoreLv;
    if (total > 13) {
        lv = 'p8++';
    }
    else if (total > 12) {
        lv = 'p8+';
    }
    else if (total > 11) {
        lv = 'p8';
    }
    else if (total > 10) {
        lv = 'p7++';
    }
    else if (total > 9) {
        lv = 'p7+';
    }
    else if (total > 8) {
        lv = 'p7';
    }
    else if (total > 7) {
        lv = 'p6++';
    }
    else if (total > 6) {
        lv = 'p6+';
    }
    else if (total > 5) {
        lv = 'p6';
    }
    else if (total > 4) {
        lv = 'p5+';
    }
    else if (total > 3) {
        lv = 'p5';
    }
    else if (total > 2) {
        lv = 'p4+';
    }
    else if (total > 1) {
        lv = 'p4';
    }
    else if (text.length > 0) {
        lv = '--';
    }
    return { level: lv, levelValue: total };
}
export function trackWorkYear(kw) {
    const msInYear = 31536000000;
    return (kw.calcMonth(kw.items.map((k) => (k.children || []).map((w) => w.works || [])).flat(2)) / msInYear);
}
