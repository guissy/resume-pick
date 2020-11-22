"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = [
    {
        "name": "核心项",
        "children": [
            {
                "name": "RN",
                "alias": ["react native", "rn", "weex"],
                "score": 1.5
            },
            {
                "name": "flutter",
                "alias": ["flutter1", "flutter2", "dart"],
                "score": 1.5
            },
            {
                "name": "h5",
                "alias": [
                    "uni-app",
                    "uniapp",
                    "umi-app",
                    "umijs",
                    "ionic",
                    "mobile",
                    "移动端",
                    "webapp"
                ],
                "score": 1.5
            },
            {
                "name": "h5",
                "alias": [
                    "webview",
                    "混生",
                    "hybrid",
                    "hybridapp",
                    "jsbridge",
                    "apicloud"
                ],
                "score": 1.5
            },
            {
                "name": "react",
                "alias": ["reactjs", "redux", "antd", "ant design"],
                "score": 1.5
            },
            {
                "name": "vue",
                "alias": ["vue2", "vuejs", "vue2", "element", "vant"],
                "score": 1.5
            },
            {
                "name": "vue3",
                "score": 1.5
            },
            {
                "name": "angular",
                "alias": [
                    "ng",
                    "ng2",
                    "angularjs",
                    "angular2",
                    "angular4",
                    "angular5",
                    "angular6",
                    "angular7",
                    "angular8"
                ],
                "score": 1
            },
            {
                "name": "wxapp",
                "alias": ["微信", "小程序", "taro", "mpvue", "mpvue"],
                "score": 1.5
            },
            {
                "name": "node",
                "alias": ["nodejs", "express", "koa", "koa2", "egg", "next", "nextjs", "pm2", "hapi", "nuxt"],
                "score": 1.5
            },
            {
                "name": "state mgr",
                "alias": [
                    "redux",
                    "saga",
                    "mobx",
                    "vuex",
                    "vuetify",
                    "dva",
                    "事件总线",
                    "eventBus",
                    "event bus",
                    "mvvm"
                ],
                "score": 1
            },
            {
                "name": "es6",
                "alias": [
                    "es5",
                    "es6",
                    "es6+",
                    "es2015",
                    "es2016",
                    "es2017",
                    "es7",
                    "es8",
                    "es9",
                    "ecmascript",
                    "原生JS",
                    "原生 JS"
                ],
                "score": 0.8
            },
            {
                "name": "w3c",
                "score": 0.5,
                "alias": ["mdn"]
            },
            {
                "name": "css3",
                "alias": [
                    "flex",
                    "grid",
                    "css3",
                    "rem",
                    "less",
                    "sass",
                    "scss",
                    "bem",
                    "stylus",
                    "cssmodules",
                    "css-modules",
                    "css in js",
                    "css-in-js",
                    "styled-components",
                    "jss",
                    "emotion",
                    "tailwind",
                    "纯CSS",
                    "vw",
                    "vh"
                ],
                "score": 0.5
            },
            {
                "name": "keyframes",
                "alias": [
                    "animate.css",
                    "wow.js",
                    "gsap",
                    "pixi",
                    "pixijs",
                    "svga",
                    "createjs",
                    "canvas",
                    "gpu",
                    "webgl"
                ],
                "score": 0.8
            }
        ]
    },
    {
        "name": "进阶",
        "children": [
            {
                "name": "typescript",
                "alias": ["ts"],
                "score": 1.5
            },
            {
                "name": "hooks",
                "alias": ["hook", "hoc", "高阶"],
                "score": 1.5
            },
            {
                "name": "rxjs",
                "alias": ["ReactiveX", "ngrx"],
                "score": 1.5
            },
            {
                "name": "graphql",
                "alias": ["gql", "relay"],
                "score": 1.5
            },
            {
                "name": "test",
                "calc": "max",
                "alias": [
                    "mocha",
                    "jasmine",
                    "jest",
                    "cypress",
                    "puppeteer",
                    "unit test"
                ],
                "score": 1.5
            },
            {
                "name": "gayhub",
                "alias": ["github.com", "gitee.com"],
                "score": 1.5
            },
            {
                "name": "lint",
                "alias": [
                    "tslint",
                    "eslint",
                    "jslint",
                    "stylelint",
                    "githook",
                    "husky",
                    "prettier",
                    "命名规范",
                    "代码规范",
                    "commit规范",
                    "接口规范"
                ],
                "score": 1
            },
            {
                "name": "review",
                "alias": ["pr", "git flow", "git-flow", "gitflow", "代码审查", "codereview"],
                "score": 0.5
            },
            {
                "name": "代码分析",
                "alias": ["代码静态分析", "SonarQube"],
                "score": 0.5
            },
            {
                "name": "blog",
                "alias": [
                    "个人博客",
                    "博客地址",
                    "csdn.net",
                    "cnblogs.com",
                    "juejin.im",
                    "zhihu.com",
                    "jianshu.com",
                    "segmentfault.com",
                    "oschina.net",
                    "imooc.com",
                    "51cto.com",
                    "gitbooks.io"
                ],
                "score": 1.5
            }
        ]
    },
    {
        "name": "其他",
        "children": [
            {
                "name": "大厂背景",
                "alias": [
                    "\\b阿里巴巴",
                    "\\b腾讯",
                    "\\b百度",
                    "\\b京东",
                    "\\b美团",
                    "\\b新浪",
                    "\\b网易",
                    "\\b字节跳动"
                ],
                "score": 2.5
            },
            {
                "name": "leader",
                "alias": ["组长", "负责人", "选型", "架构设计", "框架开发", "评审", "排期", "细化", "带领", "带队"],
                "score": 2
            },
            {
                "name": "manager",
                "alias": ["组织分享", "分配工作", "任务分配", "整体进度", "项目进度", "招聘", "多次组织", "技术分享"],
                "score": 2
            },
            {
                "name": "流量",
                "alias": ["([0-9一二三四五六七八九几十百千]+)\\s*(万|亿)"],
                "score": 2
            },
            {
                "name": "百分点",
                "alias": ["(减少|降低|提升|提高|降至|降到|升至|升到)(\\D{0,2})\\d+(\\.\\d+)?(%|M|s)"],
                "score": 2
            },
            {
                "name": "游戏引擎",
                "alias": ["白鹭", "p2", "pomelo", "cocos2d", "egret", "重力", "粒子"],
                "score": 1.5
            },
            {
                "name": "sql",
                "alias": [
                    "sqlite3",
                    "sqlite",
                    "mysql",
                    "postgre",
                    "mariadb",
                    "hive",
                    "redis"
                ],
                "score": 1
            },
            {
                "name": "electron",
                "alias": ["nwjs"],
                "score": 1.2
            },
            {
                "name": "oc",
                "alias": ["iOS原生开发", "objective-c"],
                "score": 1.2
            },
            {
                "name": "webrtc",
                "alias": ["hls", "直播流", "视频流", "jsmpeg"],
                "score": 1.2
            },
            {
                "name": "区块链",
                "alias": ["比特币", "以太坊"],
                "score": 1.2
            },
            {
                "name": "mock",
                "alias": ["mockjs", "rap", "模拟", "抓取"],
                "score": 0.5
            },
            {
                "name": "ejs",
                "alias": ["hygen", "swagger"],
                "score": 0.5
            },
            {
                "name": "git",
                "alias": ["rebase", "代码分支"],
                "score": 0.5
            },
            {
                "name": "docker",
                "alias": ["kubernetes", "k8s"],
                "score": 0.5
            },
            {
                "name": "websocket",
                "alias": ["socket", "charles", "实时性", "实时通信"],
                "score": 0.5
            },
            {
                "name": "微服务",
                "alias": ["monorepo", "submodule", "无服务器", "severless", "自动化构建"],
                "score": 0.5
            },
            {
                "name": "加密",
                "alias": [
                    "密文",
                    "支付",
                    "md5",
                    "sha1",
                    "签名",
                    "白名单",
                    "jwt",
                    "x-token",
                    "crypto"
                ],
                "score": 0.5
            },
            {
                "name": "重构",
                "alias": [
                    "防抖",
                    "去抖",
                    "节流",
                    "虚拟化",
                    "debounce",
                    "throttle",
                    "代码分割",
                    "分包",
                    "错误收集",
                    "埋点",
                    "可读性",
                    "preact",
                    "类型校验",
                    "类型检测"
                ],
                "score": 0.5
            },
            {
                "name": "Promise",
                "alias": ["async", "await", "generator"],
                "score": 0.5
            },
            {
                "name": "自定义",
                "alias": [
                    "封装",
                    "公共方法",
                    "公共资源",
                    "公共模块",
                    "通用类库",
                    "插件开发",
                    "二次封装",
                    "造轮子",
                    "简化",
                    "可复用",
                    "自动化"
                ],
                "score": 0.5
            },
            {
                "name": "性能调优",
                "alias": ["毫秒", "攻克", "攻坚", "首屏", "懒加载", "gzip", "webp", "按需加载"],
                "score": 0.5
            },
            {
                "name": "component",
                "alias": ["基础组件", "公共组件", "通用组件", "业务组件", "组件化", "模块化"],
                "score": 0.5
            },
            {
                "name": "编程范式",
                "alias": ["函数式", "haskell", "f#"],
                "score": 0.5
            },
            {
                "name": "技术博客",
                "alias": [
                    "极客",
                    "掘金",
                    "知乎",
                    "思否",
                    "stackoverflow",
                    "mdn",
                    "w3school",
                    "博客园",
                    "简书",
                    "CSDN"
                ],
                "score": 0.5
            },
            {
                "name": "python",
                "score": 0.5
            },
            {
                "name": "java",
                "alias": ["springcloud", "springboot", "springmvc", "mybatis", "feign", "gateway", "hystrix", "zookeeper", "dubbo", "jpa", "solr"],
                "score": 0.5
            },
            {
                "name": "middleware",
                "alias": ["nacos", "eureka", "hystrix", "gateway", "zuul", "feign"],
                "score": 0.5
            },
            {
                "name": "queue",
                "alias": ["rocketmq", "rabbitmq"],
                "score": 0.5
            },
            {
                "name": "go",
                "score": 0.5
            },
            {
                "name": "rust",
                "score": 0.5
            },
            {
                "name": "cpp",
                "score": 0.5
            },
            {
                "name": "swift",
                "score": 0.5
            },
            {
                "name": "kotlin",
                "score": 0.5
            },
            {
                "name": "scala",
                "score": 0.5
            },
            {
                "name": "mongodb",
                "alias": ["sequelize", "typeorm", "orm", "nosql"],
                "score": 0.5
            },
            {
                "name": "devops",
                "alias": ["shell", "nginx", "linux", "cicd", "构建速度", "verdaccio", "私有npm", "jenkins"],
                "score": 0.5
            },
            {
                "name": "vim",
                "score": 0.5
            },
            {
                "name": "markdown",
                "score": 0.5
            },
            {
                "name": "ssr",
                "score": 0.5
            },
            {
                "name": "mdx",
                "alias": ["stroybook"],
                "score": 0.5
            },
            {
                "name": "bi",
                "score": 0.5,
                "alias": ["可视化", "大屏", "echarts", "d3", "antv"]
            },
            {
                "name": "three.js",
                "score": 0.5
            },
            {
                "name": "log4js",
                "alias": ["winston", "chalk"],
                "score": 0.5
            },
            {
                "name": "postman",
                "score": 0.5,
                "alias": ["charles", "fiddler"]
            },
            {
                "name": "leetcode",
                "score": 0.5,
                "alias": ["力扣", "leet code"]
            },
            {
                "name": "deno",
                "score": 0.5
            },
            {
                "name": "seo",
                "score": 0.5
            },
            {
                "name": "wasm",
                "score": 0.5,
                "alias": ["web assembly"]
            },
            {
                "name": "逆向",
                "score": 0.5
            },
            {
                "name": "代表作",
                "score": 0.5,
                "alias": ["项目链接", "作品链接", "(由|从)(0|零)到(1|一)"]
            },
            {
                "name": "机器学习",
                "score": 0.5,
                "alias": ["数据结构与算法"]
            },
            {
                "name": "coding",
                "score": 0.1,
                "alias": ["coder", "coding"]
            },
            {
                "name": "iframe",
                "alias": ["flash", "dreamweaver", "div+css", "v-for", "v-if"],
                "score": -1.5
            },
            {
                "name": "mvc",
                "score": -0.5
            },
            {
                "name": "ajax",
                "alias": ["ajax", "jsonp", "ie6", "ie7", "ie8"],
                "score": -1
            },
            {
                "name": "jquery",
                "alias": [
                    "jq",
                    "zepto",
                    "knockout",
                    "knockoutjs",
                    "extjs",
                    "backbone",
                    "dojo",
                    "mootools",
                    "emberjs",
                    "yui3",
                    "prototype.js"
                ],
                "score": -0.5
            },
            {
                "name": "svn",
                "alias": [
                    "requirejs",
                    "gulp",
                    "grunt",
                    "yeo",
                    "yeoman",
                    "seajs",
                    "phonegap",
                    "jasmine"
                ],
                "score": -1
            },
            {
                "name": "积极乐观",
                "alias": ["为人和蔼", "吃苦耐劳", "上进", "了解"],
                "score": -0.5
            },
            {
                "name": "熟悉",
                "score": -0.3
            }
        ]
    }
];
exports.default = config;
