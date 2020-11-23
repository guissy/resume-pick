"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackWorkYear = void 0;
function buildLevel(workAge, score, text) {
    var lv = '...';
    var ageLv = Math.log2(Math.pow((workAge + 2), 1.5)); // 0.492+
    var scoreLv = (Math.pow((score + 2.2), 0.95)) / 5.2; // 0.407+
    var total = ageLv + scoreLv;
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
exports.default = buildLevel;
function trackWorkYear(kw) {
    var msInYear = 31536000000;
    return (kw.calcMonth(kw.items.map(function (k) { return (k.children || []).map(function (w) { return Number(w.score) > 0 && w.works ? w.works : []; }); }).flat(2)) / msInYear);
}
exports.trackWorkYear = trackWorkYear;
