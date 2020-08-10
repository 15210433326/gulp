# gulp 的基本使用

## 目录结构

* css 文件夹 --- 存放自定义 css 样式文件
* images 文件夹 --- 所有页面使用的图片文件夹
* js 文件夹 --- 存放自定义 js 文件
* libs 文件夹 --- 存放 js 库文件和 css 库文件
* index.html --- 主页

## 使用说明

1. npm install

2. gulp

3. gulpfile.js配置文件压缩方式，img图片添加 MD5 后缀，css、js（混淆）、html压缩成一行，libs文件不做修改，直接输出；


> MAC 需要全局安装 gulp，建议首先安装 cnpm，再安装 gulp，否则会报错；

```javascript
npm install -g cnpm --registry=https://registry.npm.taobao.org

sudo cnpm install gulp -g
```
