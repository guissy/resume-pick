export enum Calc {
  sum = 'sum', // 默认
  max = 'max',
  avg = 'avg',
}
export interface TreeItem {
  name: string;
  children?: KeywordItem[];
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
    const texts = workDate.workContent.split(/[\n；;。]/).filter(Boolean);
    this.walked.forEach((keywordItem: KeywordItem) => {
      if (!Array.isArray(keywordItem.alias)) {
        keywordItem.alias = [];
      }
      let hasZhB = false;
      const names = keywordItem.alias.concat([keywordItem.name]);
      const kws = names.map(v => {
        const hasAnyZh = /[^\x00-\xff]/.test(v);
        const isLongEn = v.length > 6;
        const hasB = v.startsWith(`\\b`);
        if (hasAnyZh && hasB) {
          const s = v.slice(2) + '(?!(小程序|地图|API|云|开放平台|平台|官方|开源|团队))';
          hasZhB = true;
          return `((\t|\s|　)${s})`;
        }
        if (hasAnyZh || isLongEn) return v;
        if (['java', 'go', 'rust', 'php', 'python'].includes(v)) {
          return `\\b${v}\\b(?!\\s*[接口])`;
        }
        return `\\b${v}\\b`;
      }).join('|');
      let hasFound = false;
      texts.forEach((content) => {
        if (!content.includes('了解')) {
          const found1 = !!content.match(new RegExp(kws, 'gi'));
          const found2 = hasZhB && names.some(n => content.startsWith(n.slice(2)));
          if (!hasFound) {
            hasFound = found1 || found2;
          }
        }
      });
      if (hasFound) {
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
        item.gained = this.calcScore(item.score || 0, item.months);
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
        if (e1 >= e2) {
          startDate = s1;
          endDate = e1;
          delay += 0;
        } else if (s2 < e1 && e2 > e1) {
          startDate = s1;
          endDate = e2;
          delay += e2.getTime() - e1.getTime();
        } else if (s2 > e1 && e1.getTime() > 0) {
          startDate = s2;
          endDate = e2;
          delay += endDate.getTime() - startDate.getTime();
        } else if (s1.getTime() === 0 && e1.getTime() === 0) {
          startDate = s2;
          endDate = e2;
          delay += endDate.getTime() - startDate.getTime();
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
    if (months < 1) return 0
    let rate = 1;
    if (months > 0) {
      if (score <= 0.5) {
        rate = 8;
      } else if (score <= 1) {
        rate = 4.8;
      } else if (score <= 2) {
        rate = 4
      } else if (score <= 3) {
        rate = 3.2
      } else {
        rate = 2.6
      }
    }
    // return score * monthsValid / 6;
    return score * Math.log2(months) / rate;
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

  next(): IteratorResult<T> {
    // 忽略 level 1, 遍历 level 2 和 level 3
    // 分别使用 Lv1 Lv2 Lv3 表示各级别
    let item: T;
    const isLastOne = this.index == this.walked.length;
    item = this.walked[this.index];
    this.index += 1;
    return { value: item, done: isLastOne };
  }

  // @ts-ignore
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
