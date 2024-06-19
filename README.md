# bilibili-danmaku-dplayer

## 介绍
一个调用B站api获取弹幕并转换为dplayer所需响应格式的服务端程序

## （新增）在docker中运行
```shell
docker build -t bilibili-danmaku-dplayer .
docker run -d -p 3000:3000 --name bilibili-danmaku-dplayer bilibili-danmaku-dplayer
```


## 使用
1. 安装依赖
```shell
npm install
```

2. 运行
```shell
npm run server
```

3. 提供参数
二者提供一个即可，建议使用bv号
```
http://localhost:3000/?bv=视频bv号&cid=弹幕cid号
```
4. 在dplayer中使用
```javascript
const dp = new DPlayer({
    container: document.getElementById('dplayer'), // 播放器dom
    video: {
        url: '视频地址',
        pic: '视频封面',
        type: 'auto'
    },
    danmaku: {
        id: '视频cid',
        api: 'http://后端部署地址/', 
        addition: 'http://本项目部署地址/?bv=视频bv号&cid=弹幕cid号' // 用于获取额外弹幕
    }
});
```
