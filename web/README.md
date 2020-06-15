# 开发环境

java 1.8

scala 2.11.12

nodejs 10.16 LTS

mysql 5.7 注意安装过程中不要一路next，中间有需要execute的先execute

idea ultra

https://pan.baidu.com/s/1XGQdFEQFwrIXWlKdafV6Ew 6t3c

# 配套工具

git

maven

cnpm 替代npm速度快

# 前端使用技术

typescript

react

nextjs

antd

less

mobx

react hooks

es7(async/await)

# 开发统一标准

兼容IE9+

前端开发的缩进都改为两个空格（File->Setting->搜索栏里搜indent->Typescript/javascript/json 三项每项三个框都改为2)

ajax get/post/delete(去掉put,根据id判断)

/tour?id=xxx /tour/list 分别代表详情页和列表页，差别在id通过querystring传进去

# 启动项目

## 前端

cnpm install

npm run dev

## 后端

mysql: create database trip

运行App，根据错误信息建表

# 部署运行

## 前端

npm run build

npm run start

## 后端

mvn clean package

java -jar xxx.jar

# 视频分享

https://pan.baidu.com/s/1pjxPIt-ybZRCi3WZMiobBA 2xbw

# url路径

GET /api/tour?id=

GET /api/tour/list

POST /admin/tour

GET /place?id=

GET /place/list

POST /admin/place

# TODO

tour 详情

供应商编辑