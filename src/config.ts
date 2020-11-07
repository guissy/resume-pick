import { Calc } from './keyword';

export const config = [
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
