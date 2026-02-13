# 微信小游戏基础框架

一个简洁的微信小游戏开发框架，已清理为空白项目，可以基于此开发新的小游戏。

## 源码目录介绍

```
├── audio               // 音频资源目录（目前为空）
├── images              // 图片资源目录（目前为空）
├── js
│   ├── base
│   │   ├── animation.js      // 帧动画的简易实现
│   │   ├── pool.js           // 对象池的简易实现
│   │   └── sprite.js         // 游戏基本元素精灵类
│   ├── libs
│   │   └── tinyemitter.js    // 事件监听和触发器
│   ├── databus.js            // 管控游戏状态
│   ├── main.js               // 游戏入口主函数（基础框架）
│   └── render.js             // Canvas初始化
├── .eslintrc.js             // 代码规范配置
├── game.js                  // 游戏逻辑主入口
├── game.json                // 游戏运行时配置
├── project.config.json      // 项目配置
└── project.private.config.json  // 项目个人配置
```

## 框架功能

### 基础组件

- **Sprite** (js/base/sprite.js): 游戏精灵基类
  - 支持图片渲染
  - 提供简单的矩形碰撞检测
  - 继承自事件系统，可发布/订阅事件

- **Pool** (js/base/pool.js): 对象池
  - 减少对象创建开销
  - 避免频繁垃圾回收
  - 提高游戏性能

- **Animation** (js/base/animation.js): 帧动画
  - 简单的帧动画实现

- **TinyEmitter** (js/libs/tinyemitter.js): 事件系统
  - 提供事件监听和触发功能

### 游戏循环

- **Main** (js/main.js): 游戏主类
  - 提供标准的游戏循环（loop）
  - update() 方法：更新游戏逻辑
  - render() 方法：渲染游戏画面
  - 可以继承此类或修改方法实现具体游戏

### 状态管理

- **DataBus** (js/databus.js): 全局状态管理
  - 单例模式
  - 管理游戏帧数、动画、游戏状态
  - 集成对象池

## 开始开发

1. 在 `js/main.js` 的 `update()` 方法中添加游戏逻辑
2. 在 `js/main.js` 的 `render()` 方法中添加渲染逻辑
3. 使用 `Sprite` 类创建游戏元素
4. 使用 `DataBus` 管理游戏状态
5. 在 `audio/` 和 `images/` 目录中添加资源

## 参考文档

[微信小游戏开发文档](https://developers.weixin.qq.com/minigame/dev/guide/)
