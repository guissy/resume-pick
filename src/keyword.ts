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

export const db = [
  {
    name: '核心项',
    score: 10,
    children: [
      {
        name: 'mobile',
        alias: ['itunes', 'ios', 'flutter', 'dart', 'webview', 'uni-app', 'uniapp', 'taro', 'ionic', 'apicloud'],
        score: 2.5
      },
      {
        name: 'react', alias: [
          'antd', 'ant design',
          'vue2', 'vuejs', 'vue2', 'element', 'vant',
          'angular', 'ng2', 'angular2', 'angular4', 'angular5', 'angular6', 'angular7', 'angular8'
        ], score: 1.5
      },
      {name: 'es6', alias: ['es2015', 'es2016', 'es2017', 'es7', 'es8', 'es9', 'ecmascript'], score: 0.5},
    ]
  },
  {
    name: '函数式和类js语言',
    children: [
      {name: 'typescript', alias: 'ts', score: 2},
      {name: 'rxjs', alias: ['ReactiveX', 'ngrx'], score: 2},
      {name: 'graphql', alias: 'gql', score: 1.5},
      {name: 'redux', alias: ['saga', 'mobx', 'vuex', 'dva'], score: 1.5},
    ]
  },
  {
    name: '代码质量', children: [
      {
        name: 'unit test',
        calc: Calc.max,
        children: [
          {name: 'mocha', score: 1.5},
          {name: 'jasmine', score: 1.5},
          {name: 'jest', score: 1.5},
          {name: 'puppeteer', score: 1.5},
        ]
      },
      {
        name: 'lint',
        calc: Calc.max,
        children: [
          {name: 'tslint', score: 1.5},
          {name: 'eslint', score: 1.5},
          {name: 'jslint', score: 1.5},
        ]
      },
      {name: 'http://', alias: ['https://'], score: 0.5},
      {name: 'mock', score: 0.5},
      {name: 'git', score: 0.5},
      {name: 'docker', score: 0.5},
      {name: 'websocket', alias: ['socket', 'canvas', 'charles'], score: 0.5},
      {name: '微服务', score: 0.5},
      {name: '加密', alias: ['密文', '支付', 'md5', 'sha1', '签名', '白名单'], score: 0.5},
      {name: '重构', alias: ['防抖', '去抖', '节流', '虚拟化', '懒加载'], score: 0.5},
      {name: '自定义', alias: ['封装', '公共组件', '二次封装'], score: 0.5},
      {
        name: 'flash',
        alias: ['dreamweaver', 'ie6', 'div+css', 'iframe'],
        score: -1.5
      },
      {
        name: 'jquery',
        alias: ['jq', 'zepto', 'ajax', 'jsonp', 'gulp', 'bootstrap', 'dom', 'requirejs', 'grunt', 'svn'],
        score: -1
      },
      {
        name: '积极乐观',
        alias: ['为人和蔼', '吃苦耐劳', '上进', '了解'],
        score: -0.5
      },
      {
        name: '熟悉',
        score: -0.3
      },
    ]
  }
];
// export const db;

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
        return hasAnyZh || isLongEn ? v : `\\b${v}\\b`;
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
    // console.log('\u2665 next', this.index);
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
