const {Tree, db} = require('./keyword');
const cloneDeep = require('lodash/cloneDeep')

function calcWorkDate(start, end) {
  let startDate = new Date(start);
  let endDate = end === '至今' ? new Date() : new Date(end);
  endDate.setDate(30);
  return {
    startDate,
    endDate,
  };
}

function calcTotal(content, config = db) {
  const month = /(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2})月?\s*([—–\-~至])+\s*(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2}月?|至今)/
  let n = 0;
  const nodes = [];
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  let max = d;
  while (n < content.length) {
    const match = content.slice(n).match(month);
    if (match && match.index >= 0) {
      const start = match[1].replace(/[年月]/g, '-');
      const end = match[5].replace(/[年月]/g, '-');
      nodes.push([n + match.index + match[0].length, start, end]);
      if (match[1] > max) {
        max = match[1];
      }
    }
    n += match && match.index + 14 || 14;
  }
  const keywords = new Tree(cloneDeep(config));
  if (nodes.length > 0) {
    const date = calcWorkDate(max, new Date());
    date.workContent = content.slice(0, nodes[0][0]);
    keywords.work(date);
  }
  nodes.forEach(([n, start, end], i, arr) => {
    const date = calcWorkDate(start, end);
    date.workContent = content.slice(n, arr[i + 1] && arr[i + 1][0]);
    keywords.work(date);
  });
  const score = keywords.calc(keywords.items);
  return {score, keywords};
}

exports.calcTotal = calcTotal;
