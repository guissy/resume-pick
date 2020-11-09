export enum Calc {
  sum = 'sum', // 默认
  max = 'max',
  avg = 'avg',
}
interface TreeItem {
  name: string;
  children?: TreeItem[];
}
export interface KeywordItem extends TreeItem {
  name: string;
  score?: number;
  alias?: string[];
  calc?: Calc;
  children?: KeywordItem[];
  gained?: number; // 得分
  months?: number; // 月
  works?: WorkDate[]; // 工作经验时间段
}

export interface WorkDate {
  startDate: Date;
  endDate: Date;
  workContent: string;
  work?: string;
}

// @ts-ignore
export class Tree<T extends TreeItem> implements IterableIterator<TreeItem> {
  private index: number = 0;
  public walked: T[] = [];

  constructor(public items: TreeItem[]) {
    if (!Array.isArray(items)) {
      this.items = [] as TreeItem[];
    }
    this.walk(this.items as T[]);
    // console.log('☞☞☞ 9527 keywords 97', this.walked);
  }

  // 对每段工作经验分析关键字
  // KeywordItem extends TreeItem
  work(workDate: WorkDate) {
    this.walked.forEach((keywordItem: KeywordItem) => {
      if (!Array.isArray(keywordItem.alias)) {
        keywordItem.alias = [];
      }
      const kws = keywordItem.alias.concat([keywordItem.name]).map(v => {
        const hasAnyZh = /[^\x00-\xff]/.test(v);
        const isLongEn = v.length > 6;
        if (hasAnyZh || isLongEn) return v;
        if (['java', 'go', 'rust', 'php', 'python'].includes(v)) {
          return `\\b${v}\\b(?!\\s*[接口])`;
        }
        return `\\b${v}\\b`;
      }).join('|');
      if (workDate.workContent.match(new RegExp(kws, 'gi'))) {
        if (!Array.isArray(keywordItem.works)) {
          keywordItem.works = [];
        }
        keywordItem.works.push(workDate);
      }
    });
  }

  // 计算总分
  calc(items: KeywordItem[] = this.items): number {
    let totalGained = 0;
    items.forEach((item: KeywordItem) => {
      const notArray = !Array.isArray(item.children);
      const emptyArray = Array.isArray(item.children) && item.children.length === 0;
      if (notArray || emptyArray) {
        const d = new Date(this.calcMonth(item.works || []));
        item.months = (d.getFullYear() - 1970) * 12 + d.getMonth();
        // 仅将最末的元素的分值相加
        item.gained = this.calcScore(item.score, item.months);
      } else {
        item.gained = this.calc(item.children as T[]) || 0;
      }
      totalGained += item.gained;
    });
    return totalGained;
  }

  calcMonth(works: WorkDate[]) {
    let result = 0;
    if (Array.isArray(works)) {
      works.sort(({startDate: s1}, {startDate: s2}) => s1.getTime() - s2.getTime());
      const { delay } = works.reduce(({startDate: s1, endDate: e1, delay}, {startDate: s2, endDate: e2}) => {
        // 1 包含 2
        let startDate = new Date(0);
        let endDate = new Date(0);
        if (e1 > e2) {
          startDate = s1;
          endDate = e1;
          delay += endDate.getTime() - startDate.getTime();
        } else if (s2 < e1 && e2 > e1) {
          startDate = s1;
          endDate = e2;
          delay += endDate.getTime() - startDate.getTime();
        } else if (s2 > e1) {
          startDate = s2;
          endDate = e2;
          delay += e1.getTime() - s1.getTime();
          delay += e2.getTime() - s2.getTime();
        }
        return { startDate, endDate, delay };
      }, { startDate: new Date(0), endDate: new Date(0), delay: 0 })
      result = delay;
    }
    return result;
  }

  // 6个月拿到1倍的 score
  // 12个月拿到2倍的 score
  // 18个月拿到3倍的 score
  // 以此类推，没有最大限制
  /**
   * 按月算分
   * @param {number} score 每项的分数
   * @param {number} months 多少月
   * @returns {number}
   */
  calcScore(score: number, months: number) {
    let monthsValid = 0;
    if (months > 0) {
      if (score <= 0.5) {
        monthsValid = Math.min(months, 6);
      } else if (score <= 1) {
        monthsValid = Math.min(months, 10);
      } else if (score <= 2) {
        monthsValid = Math.min(months, 12);
      } else if (score <= 3) {
        monthsValid = Math.min(months, 15);
      } else {
        monthsValid = Math.min(months, 18);
      }
    }
    return score * monthsValid / 6;
  }

  walk(items: T[]) {
    items.forEach((item: T) => {
      const notArray = !Array.isArray(item.children);
      const emptyArray = Array.isArray(item.children) && item.children.length === 0;
      if (notArray || emptyArray) {
        // 仅将最末的元素添加到数组中，扔掉中间元素
        this.walked.push(item);
      } else {
        this.walk(item.children as T[]);
      }
    })
  }

  next(value?: T): IteratorResult<T> {
    // 忽略 level 1, 遍历 level 2 和 level 3
    // 分别使用 Lv1 Lv2 Lv3 表示各级别
    let item: T;
    const isLastOne = this.index == this.walked.length;
    item = this.walked[this.index];
    this.index += 1;
    return { value: item, done: isLastOne };
  }

  throw(e?: Error): IteratorResult<T> {
    return { value: null, done: true };
  }

  get length(): number {
    return this.walked.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}
