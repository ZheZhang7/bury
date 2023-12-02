# bury 前端埋点系统

## 介绍

### 安装

```
    npm install
```

### 打包

```
    npm run build
```

### 启动服务

```
    node index.js
```

### 配置

ts + rollup

1. src/types 定义检测数据类型
2. src/core 核心代码
3. src/utils/pv 工具函数 页面访问量

## 笔记

### 重写 history

[pushstate 和 replacestate 无法触发 onpopstate 事件](https://www.cnblogs.com/suizhikuo/p/4969604.html)

hash 使用 hashchange 监听

### 数据上报

#### 两种方式

1. navigator.sendBeacon(url, data)
2. XMLHttpRequest.send(data)

#### 区别

sendbeacon 即使页面关闭也会完成请求，xhr 不确定

### dom 上报

主要是给需要监听的元素添加一个属性 target-key, 用来区分是否需要监听

### js error 和 promise error 上报

js 错误会触发浏览器 error 事件 promise 错误会触发 unhandledrejection 事件（返回 promise 对象）
