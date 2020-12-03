import { Tree, TreeItem } from './keyword';

export default function buildLevel(
  workAge: number,
  score: number,
  text: string
) {
  let lv = '...';
  const ageLv = Math.log2((workAge + 2) ** 1.5); // 0.492+
  const scoreLv = ((score + 2.2) ** 0.95) / 5.2; // 0.407+
  let total = ageLv + scoreLv;
  if (total > 2 && workAge > 2) {
    total += total / workAge - 2;
  }
  if (total > 13) {
    lv = 'p8++';
  } else if (total > 12) {
    lv = 'p8+';
  } else if (total > 11) {
    lv = 'p8';
  } else if (total > 10) {
    lv = 'p7++';
  } else if (total > 9) {
    lv = 'p7+';
  } else if (total > 8) {
    lv = 'p7';
  } else if (total > 7) {
    lv = 'p6++';
  } else if (total > 6) {
    lv = 'p6+';
  } else if (total > 5) {
    lv = 'p6';
  } else if (total > 4) {
    lv = 'p5+';
  } else if (total > 2) {
    lv = 'p5';
  } else if (text.length > 0) {
    lv = '--';
  }
  return { level: lv, levelValue: total };
}

export function trackWorkYear(kw: Tree<TreeItem>) {
  const msInYear = 31536000000;
  return (
    kw.calcMonth(
      kw.items.map((k) => (k.children || []).map((w) => Number(w.score) > 0 && w.works ? w.works : [])).flat(2)
    ) / msInYear
  );
}
