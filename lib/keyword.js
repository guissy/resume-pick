"use strict";
exports.__esModule = true;
var Calc;
(function (Calc) {
    Calc["sum"] = "sum";
    Calc["max"] = "max";
    Calc["avg"] = "avg";
})(Calc = exports.Calc || (exports.Calc = {}));
// @ts-ignore
var Tree = /** @class */ (function () {
    function Tree(items) {
        this.items = items;
        this.index = 0;
        this.walked = [];
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
            var kws = keywordItem.alias.concat([keywordItem.name]).map(function (v) {
                var hasAnyZh = /[^\x00-\xff]/.test(v);
                var isLongEn = v.length > 6;
                return hasAnyZh || isLongEn ? v : "\\b" + v + "\\b";
            }).join('|');
            if (workDate.workContent.match(new RegExp(kws, 'gi'))) {
                if (!Array.isArray(keywordItem.works)) {
                    keywordItem.works = [];
                }
                keywordItem.works.push(workDate);
            }
        });
    };
    // 计算总分
    Tree.prototype.calc = function (items) {
        var _this = this;
        if (items === void 0) { items = this.items; }
        var totalGained = 0;
        items.forEach(function (item) {
            var notArray = !Array.isArray(item.children);
            var emptyArray = Array.isArray(item.children) && item.children.length === 0;
            if (notArray || emptyArray) {
                var d = new Date(_this.calcMonth(item.works || []));
                item.months = (d.getFullYear() - 1970) * 12 + d.getMonth();
                // 仅将最末的元素的分值相加
                item.gained = _this.calcScore(item.score, item.months);
            }
            else {
                item.gained = _this.calc(item.children) || 0;
            }
            totalGained += item.gained;
        });
        return totalGained;
    };
    Tree.prototype.calcMonth = function (works) {
        var result = 0;
        if (Array.isArray(works)) {
            works.sort(function (_a, _b) {
                var s1 = _a.startDate;
                var s2 = _b.startDate;
                return s1.getTime() - s2.getTime();
            });
            var delay = works.reduce(function (_a, _b) {
                var s1 = _a.startDate, e1 = _a.endDate, delay = _a.delay;
                var s2 = _b.startDate, e2 = _b.endDate;
                // 1 包含 2
                var startDate = new Date(0);
                var endDate = new Date(0);
                if (e1 > e2) {
                    startDate = s1;
                    endDate = e1;
                    delay += endDate.getTime() - startDate.getTime();
                }
                else if (s2 < e1 && e2 > e1) {
                    startDate = s1;
                    endDate = e2;
                    delay += endDate.getTime() - startDate.getTime();
                }
                else if (s2 > e1) {
                    startDate = s2;
                    endDate = e2;
                    delay += e1.getTime() - s1.getTime();
                    delay += e2.getTime() - s2.getTime();
                }
                return { startDate: startDate, endDate: endDate, delay: delay };
            }, { startDate: new Date(0), endDate: new Date(0), delay: 0 }).delay;
            result = delay;
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
            }
            else if (score <= 1) {
                monthsValid = Math.min(months, 10);
            }
            else if (score <= 2) {
                monthsValid = Math.min(months, 12);
            }
            else if (score <= 3) {
                monthsValid = Math.min(months, 15);
            }
            else {
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
            }
            else {
                _this.walk(item.children);
            }
        });
    };
    Tree.prototype.next = function (value) {
        // 忽略 level 1, 遍历 level 2 和 level 3
        // 分别使用 Lv1 Lv2 Lv3 表示各级别
        var item;
        var isLastOne = this.index == this.walked.length;
        item = this.walked[this.index];
        // console.log('\u2665 next', this.index);
        this.index += 1;
        return { value: item, done: isLastOne };
    };
    Tree.prototype["throw"] = function (e) {
        return { value: null, done: true };
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
