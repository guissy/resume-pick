import { Tree, TreeItem, KeywordItem, WorkDate } from '../src/keyword';
import config from './config';
import dayjs from 'dayjs';
import resume from './resume';
import { calcTotal, findSchool } from '../src/time-content';

test('keyword calcMonth', () => {
  const tree = new Tree([
    { name: 't', children: [] }
  ]);
  const workDates = config.keywords.map((k) => k.children.map((w) => w.works || []))
    .flat(2)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1))
    // .filter((wk, i, arr) =>
    //   i > 0
    //     ? Number(wk.startDate) - Number(arr[i - 1]?.startDate) !== 0 &&
    //     Number(wk.endDate) - Number(arr[i - 1]?.endDate) !== 0
    //     : true
    // )
    .map((wk) => ({
      startDate: wk.startDate,
      endDate: wk.endDate,
      workContent: dayjs(wk.endDate).diff(wk.startDate, 'month').toString(),
    }));
  const msInYear = 31536000000;
  const ms = tree.calcMonth(workDates);
  expect(ms / msInYear).toBeGreaterThan(1);
});

test('calcTotal', () => {
  const { keywords } = calcTotal(resume, [{ name: 't', children: [{ name: '小程序', score: 2, alias: [] }] }]);
  const tree = new Tree([
    { name: 't', children: [] }
  ]);
  const msInYear = 31536000000;
  const works = keywords.items.map((v: TreeItem) => v?.children?.map((w: KeywordItem) => w.works))
    .flat(2).map((wk: WorkDate) => ({
      startDate: wk.startDate,
      endDate: wk.endDate,
      workContent: dayjs(wk.endDate).diff(wk.startDate, 'month').toString(),
    }));
  const m = tree.calcMonth(works)
  expect(m / msInYear).toBeGreaterThan(1)
});

test('work', () => {
  const tree = new Tree([
    {
      name: 't',
      children: [{
        "name": "大厂背景",
        "alias": [
          "\\b阿里巴巴",
          "\\b腾讯",
          "\\b百度",
          "\\b京东",
          "\\b美团",
          "\\b新浪",
          "\\b网易",
          "\\b字节跳动"
        ],
        "score": 2.5
      }]
    }
  ]);
  tree.work({
    startDate: new Date(2019, 1, 1),
    endDate: new Date(2020, 1, 1),
    workContent: ` 美团点评 职位：WEB前端 参与日均`
  });
  expect(tree.items[0].children?.[0].score).toBeGreaterThan(2)
});

test('findSchool', () => {
  expect(findSchool('大专 / 电气自动化1小时前来过1小时前有投递行为30天前更新简历')).toBeTruthy()
});

