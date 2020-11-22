"use strict";
exports.__esModule = true;
exports.Tree = exports.Calc = void 0;
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
        var texts = workDate.workContent.split(/[\n；;。]/).filter(Boolean);
        this.walked.forEach(function (keywordItem) {
            if (!Array.isArray(keywordItem.alias)) {
                keywordItem.alias = [];
            }
            var hasZhB = false;
            var names = keywordItem.alias.concat([keywordItem.name]);
            var kws = names.map(function (v) {
                var hasAnyZh = /[^\x00-\xff]/.test(v);
                var isLongEn = v.length > 6;
                var hasB = v.startsWith("\\b");
                if (hasAnyZh && hasB) {
                    var s = v.slice(2) + '(?!(小程序|地图|API|云|开放平台|平台|官方|开源|团队))';
                    hasZhB = true;
                    return "((\t|s|\u3000)" + s + ")";
                }
                if (hasAnyZh || isLongEn)
                    return v;
                if (['java', 'go', 'rust', 'php', 'python'].includes(v)) {
                    return "\\b" + v + "\\b(?!\\s*[\u63A5\u53E3])";
                }
                return "\\b" + v + "\\b";
            }).join('|');
            var hasFound = false;
            texts.forEach(function (content) {
                if (!content.includes('了解')) {
                    var found1 = !!content.match(new RegExp(kws, 'gi'));
                    var found2 = hasZhB && names.some(function (n) { return content.startsWith(n.slice(2)); });
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
                item.gained = _this.calcScore(item.score || 0, item.months);
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
                if (e1 >= e2) {
                    startDate = s1;
                    endDate = e1;
                    delay += 0;
                }
                else if (s2 < e1 && e2 > e1) {
                    startDate = s1;
                    endDate = e2;
                    delay += e2.getTime() - e1.getTime();
                }
                else if (s2 > e1 && e1.getTime() > 0) {
                    startDate = s2;
                    endDate = e2;
                    delay += endDate.getTime() - startDate.getTime();
                }
                else if (s1.getTime() === 0 && e1.getTime() === 0) {
                    startDate = s2;
                    endDate = e2;
                    delay += endDate.getTime() - startDate.getTime();
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
        if (months < 1)
            return 0;
        var rate = 1;
        if (months > 0) {
            if (score <= 0.5) {
                rate = 8;
            }
            else if (score <= 1) {
                rate = 4.8;
            }
            else if (score <= 2) {
                rate = 4;
            }
            else if (score <= 3) {
                rate = 3.2;
            }
            else {
                rate = 2.6;
            }
        }
        // return score * monthsValid / 6;
        return score * Math.log2(months) / rate;
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
    Tree.prototype.next = function () {
        // 忽略 level 1, 遍历 level 2 和 level 3
        // 分别使用 Lv1 Lv2 Lv3 表示各级别
        var item;
        var isLastOne = this.index == this.walked.length;
        item = this.walked[this.index];
        this.index += 1;
        return { value: item, done: isLastOne };
    };
    // @ts-ignore
    Tree.prototype["throw"] = function (e) {
        return { value: null, done: true };
    };
    Object.defineProperty(Tree.prototype, "length", {
        get: function () {
            return this.walked.length;
        },
        enumerable: false,
        configurable: true
    });
    Tree.prototype[Symbol.iterator] = function () {
        return this;
    };
    return Tree;
}());
exports.Tree = Tree;
