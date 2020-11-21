import { Tree, TreeItem, KeywordItem, WorkDate } from '../src/keyword';
import config from './config';
import dayjs from 'dayjs';
import resume from './resume';
import { calcTotal } from '../src/time-content';

test.skip('keyword calcMonth', () => {
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

