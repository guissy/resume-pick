"use strict";
exports.__esModule = true;
var config_1 = require("./config");
var Tree = require('./keyword').Tree;
var cloneDeep = require('lodash/cloneDeep');
function findSchool(text) {
    // eslint-disable-next-line no-control-regex
    var regExp1 = /([^\x00-\xff]){2,6}(学院|大学|职院|师范|职中|高中|中学|一中)/;
    var regExp2 = /(计机|计算机|电脑|电子)/;
    return regExp1.test(text) || regExp2.test(text);
}
exports.findSchool = findSchool;
function calcWorkDate(start, end) {
    var startDate = new Date(start);
    var endDate = end === '至今' ? new Date() : new Date(end);
    endDate.setDate(30);
    return {
        startDate: startDate,
        endDate: endDate,
        workContent: ''
    };
}
function calcTotal(content, config) {
    if (config === void 0) { config = config_1.config; }
    var month = /(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2})月?\s*([—–\-~至])+\s*(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2}月?|至今)/;
    var n = 0;
    var nodes = [];
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    var max = d;
    while (n < content.length) {
        var match = content.slice(n).match(month);
        if (match && match.index >= 0) {
            var start = match[1].replace(/[年月]/g, '-');
            var end = match[5].replace(/[年月]/g, '-');
            nodes.push([n + match.index + match[0].length, start, end]);
            if (match[1] > max) {
                max = match[1];
            }
        }
        n += match && match.index + 14 || 14;
    }
    var keywords = new Tree(cloneDeep(config));
    var schoolInfo = '';
    nodes.forEach(function (_a, i, arr) {
        var n = _a[0], start = _a[1], end = _a[2];
        var date = calcWorkDate(start, end);
        date.workContent = content.slice(n, arr[i + 1] && arr[i + 1][0]);
        if (!findSchool(date.workContent)) {
            keywords.work(date);
        }
        else {
            schoolInfo += date.workContent;
        }
    });
    if (nodes.length > 0) {
        var date = calcWorkDate(max, new Date());
        var baseInfo = content.slice(0, nodes[0][0]);
        date.workContent = baseInfo + schoolInfo;
        keywords.work(date);
    }
    var score = keywords.calc(keywords.items);
    return { score: score, keywords: keywords };
}
exports.calcTotal = calcTotal;
