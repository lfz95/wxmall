# wemall

> 微商城

## Build Setup

``` bash
# 安装项目依赖
npm install

# 本地运行
npm run dev

# 生产发布
npm run build

# 生产发布，并查看发布分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

使用技术
    vue2.x
    vue-router
    vux组件库
    axios
    webpack打包
    flexible适配
介绍
 	项目使用vue作为开发框架，并且引入vux组件库。采用淘宝的flexible适配方案，根据不同设备动态设置根元素的font-size，使用rem作为长度单位（border太小时可以使用px），在各个设备中进行缩小和放大。使用axios发送ajax请求，并返回一个异步对象操作

 参考资料：
 	http://caibaojian.com/mobile-responsive-example.html

 	http://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html

 	https://cn.vuejs.org/
