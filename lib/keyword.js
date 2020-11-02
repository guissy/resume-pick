"use strict";
exports.__esModule = true;
var Calc;
(function (Calc) {
  Calc["sum"] = "sum";
  Calc["max"] = "max";
  Calc["avg"] = "avg";
})(Calc = exports.Calc || (exports.Calc = {}));
exports.db = [
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
    name: '函数式和语言',
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
var Tree = /** @class */ (function () {
  function Tree(items) {
    this.items = items;
    this.index = 0;
    this.walked = [];
    this.total = 0;
    if (!Array.isArray(items)) {
      this.items = [];
    }
    this.walk(this.items);
    // console.log('☞☞☞ 9527 keywords 97', this.walked);
  }

  // 对每段工作经验分析关键字
  // KeywordItem extends TreeItem
  Tree.prototype.work = function (workDate) {
    this.walked.forEach(function (keywordItem) {
      if (!Array.isArray(keywordItem.alias)) {
        keywordItem.alias = [];
      }
      var kws = keywordItem.alias.concat(keywordItem.name).map(v => {
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
  };
  // 计算总分, 公式为 score * months
  Tree.prototype.calc = function (items) {
    var _this = this;
    if (items === void 0) {
      items = this.items;
    }
    var totalGained = 0;
    items.forEach(function (item) {
      var notArray = !Array.isArray(item.children);
      var emptyArray = Array.isArray(item.children) && item.children.length === 0;
      if (notArray || emptyArray) {
        var d = new Date(_this.calcMonth(item.works));
        item.months = (d.getFullYear() - 1970) * 12 + d.getMonth();
        // 仅将最末的元素的分值相加
        item.gained = _this.calcScore(item.score, item.months);
      } else {
        item.gained = _this.calc(item.children) || 0;
      }
      totalGained += item.gained;
    });
    return totalGained;
  };
  // 时间戳
  Tree.prototype.calcMonth = function (works) {
    var result = 0;
    if (Array.isArray(works)) {
      works.sort(function (_a, _b) {
        var s1 = _a.startDate;
        var s2 = _b.startDate;
        return s1.getTime() - s2.getTime();
      });
      // console.log('\u2665 calcMonth 152', works);
      result = works.reduce(function (_a, _b) {
        var s1 = _a.startDate, e1 = _a.endDate, delay = _a.delay;
        var s2 = _b.startDate, e2 = _b.endDate;
        // 1 包含 2
        var startDate = new Date(0);
        var endDate = new Date(0);
        if (e1 > e2) {
          startDate = s1;
          endDate = e1;
          delay += 0;
        } else if (s2 < e1) {
          startDate = s1;
          endDate = e2;
          delay += e2.getTime() - e1.getTime();
        } else if (s2 >= e1) {
          startDate = s2;
          endDate = e2;
          delay += e2.getTime() - s2.getTime();
        }
        return {startDate: startDate, endDate: endDate, delay: delay};
      }, {startDate: new Date(0), endDate: new Date(0), delay: 0}).delay;
    }
    return result;
  };
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
  Tree.prototype.calcScore = function (score, months) {
    var monthsValid = 0;
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
  };
  Tree.prototype.walk = function (items) {
    var _this = this;
    items.forEach(function (item) {
      var notArray = !Array.isArray(item.children);
      var emptyArray = Array.isArray(item.children) && item.children.length === 0;
      if (notArray || emptyArray) {
        // 仅将最末的元素添加到数组中，扔掉中间元素
        _this.walked.push(item);
      } else {
        _this.walk(item.children);
      }
    });
  };
  Tree.prototype.next = function () {
    // 忽略 level 1, 遍历 level 2 和 level 3
    // 分别使用 Lv1 Lv2 Lv3 表示各级别
    var item;
    var isLastOne = this.index === this.walked.length;
    item = this.walked[this.index];
    // console.log('\u2665 next', this.index);
    this.index += 1;
    return {value: item, done: isLastOne};
  };
  Tree.prototype["throw"] = function () {
    return {value: null, done: true};
  };
  Object.defineProperty(Tree.prototype, "length", {
    get: function () {
      return this.walked.length;
    },
    enumerable: true,
    configurable: true
  });
  Tree.prototype[Symbol.iterator] = function () {
    return this;
  };
  return Tree;
}());
exports.Tree = Tree;
exports["default"] = Tree;
