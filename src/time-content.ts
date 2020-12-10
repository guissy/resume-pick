import configDefault from './config';
import buildLevel, { trackWorkYear } from './buildLevel';

const { Tree } = require('./keyword');
const cloneDeep = require('lodash/cloneDeep')

export function findSchool(text: string) {
  // eslint-disable-next-line no-control-regex
  const regExp1 = /([^\x00-\xff]){2,6}(学院|大学|职院|师范|职中|高中|中学|一中)/;
  const regExp2 = /(计机|计算机)/;
  const regExp3 = /(博士|硕士|本科|一本|二本|大专|高中|初中)/;
  return (regExp1.test(text.slice(0, 33)) || regExp2.test(text.slice(0, 33)) || regExp3.test(text.slice(0, 33)));
}

export function findBasic(text: string) {
  const regExp = /(自我描述|专业技能)/;
  const found = text.match(regExp);
  if (Number(found?.index) > 0) {
    return {
      workContent: text.slice(0, found?.index),
      basic: text.slice(found?.index)
    }
  } else {
    return {
      workContent: text,
      basic: '',
    }
  }
}

function calcWorkDate(start: string, end: string) {
  let startDate = new Date(start);
  let endDate = end === '至今' ? new Date() : new Date(end);
  endDate.setDate(30);
  return {
    startDate,
    endDate,
    workContent: ''
  };
}

export function calcTotal(content: string, config = configDefault) {
  const month = /(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2})月?\s*([—–\-~～至])+\s*(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2}月?|至今)/
  let n = 0;
  const nodes = [] as [number, string, string][];
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  let max = d;
  while (n < content.length) {
    const match = content.slice(n).match(month) as RegExpMatchArray;
    if (match && Number(match.index) >= 0) {
      const start = match[1].replace(/[年月]/g, '-');
      const end = match[5].replace(/[年月]/g, '-');
      nodes.push([n + Number(match.index) + match[0].length, start, end]);
      // if (match[1] > max) {
      //   max = match[1];
      // }
    }
    n += match && Number(match.index) + 14 || 14;
  }
  const keywords = new Tree(cloneDeep(config));
  let schoolInfo = '';
  let basicInfo = '';
  nodes.forEach(([n, start, end], i, arr) => {
    const date = calcWorkDate(start, end);
    date.workContent = content.slice(n, arr[i + 1] && arr[i + 1][0]);
    if (!findSchool(date.workContent)) {
      const { workContent, basic } = findBasic(date.workContent);
      date.workContent = workContent;
      if (basic) {
        basicInfo = basic;
      }
      keywords.work(date);
    } else {
      schoolInfo = date.workContent;
    }
  });
  if (nodes.length > 0) {
    const date = calcWorkDate(max.toDateString(), new Date().toDateString());
    const baseInfo = content.slice(0, Number(nodes[0][0]));
    date.workContent = baseInfo + schoolInfo + basicInfo;
    keywords.work(date);
  }
  const score = keywords.calc(keywords.items);
  const workAge = trackWorkYear(keywords);
  const { level, levelValue } = buildLevel(workAge, score, content);
  return { score, workAge, level, levelValue, keywords };
}
