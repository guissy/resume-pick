"use strict";
exports.__esModule = true;
exports.calcTotal = exports.findSchool = void 0;
var config_1 = require("./config");
var buildLevel_1 = require("../lib/buildLevel");
var Tree = require('./keyword').Tree;
var cloneDeep = require('lodash/cloneDeep');
function findSchool(text) {
    // eslint-disable-next-line no-control-regex
    var regExp1 = /([^\x00-\xff]){2,6}(学院|大学|职院|师范|职中|高中|中学|一中)/;
    var regExp2 = /(计机|计算机|电脑|电子)/;
    return (regExp1.test(text.slice(0, 33)) || regExp2.test(text.slice(0, 33)));
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
    if (config === void 0) { config = config_1["default"]; }
    var month = /(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2})月?\s*([—–\-~至])+\s*(20(09|10|11|12|13|14|15|16|17|18|19|20|21|22)([.\-\/年])\d{1,2}月?|至今)/;
    var n = 0;
    var nodes = [];
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    var max = d;
    while (n < content.length) {
        var match = content.slice(n).match(month);
        if (match && Number(match.index) >= 0) {
            var start = match[1].replace(/[年月]/g, '-');
            var end = match[5].replace(/[年月]/g, '-');
            nodes.push([n + Number(match.index) + match[0].length, start, end]);
            // if (match[1] > max) {
            //   max = match[1];
            // }
        }
        n += match && Number(match.index) + 14 || 14;
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
        var date = calcWorkDate(max.toDateString(), new Date().toDateString());
        var baseInfo = content.slice(0, Number(nodes[0][0]));
        date.workContent = baseInfo + schoolInfo;
        keywords.work(date);
    }
    var score = keywords.calc(keywords.items);
    var workAge = buildLevel_1.trackWorkYear(keywords);
    var _a = buildLevel_1["default"](workAge, score, content), level = _a.level, levelValue = _a.levelValue;
    return { score: score, workAge: workAge, level: level, levelValue: levelValue, keywords: keywords };
}
exports.calcTotal = calcTotal;
exports.calcTotal = calcTotal;