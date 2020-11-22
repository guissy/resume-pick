import { Tree, TreeItem } from '../src/keyword';

export default function buildLevel(
  workAge: number,
  score: number,
  text: string
) {
  let lv = '...';
  const ageLv = workAge > 2 ? Math.log2(workAge * 12) / 2 : 0; // +0.75-0.75
  const scoreLv = (score + 3) / 5; // +0.75-0.75
  const total = ageLv + scoreLv;
  if (total >= 9) {
    lv = 'p7+';
  } else if (total > 8) {
    lv = 'p7';
  } else if (total > 7) {
    lv = 'p6+';
  } else if (total > 6) {
    lv = 'p6';
  } else if (total > 5) {
    lv = 'p5+';
  } else if (total > 4) {
    lv = 'p5';
  } else if (total > 3) {
    lv = 'p4';
  } else if (total > 2) {
    lv = 'p3';
  } else if (total > 1) {
    lv = 'p2';
  } else if (total > 0) {
    lv = 'p1';
  } else if (text.length > 0) {
    lv = '-';
  }
  return { level: lv, levelValue: total };
}

export function trackWorkYear(kw: Tree<TreeItem>) {
  const msInYear = 31536000000;
  return (
    kw.calcMonth(
      kw.items.map((k) => (k.children || []).map((w) => w.works || [])).flat(2)
    ) / msInYear
  );
}
