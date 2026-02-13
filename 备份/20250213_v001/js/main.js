import './render'; // 初始化Canvas
import AudioManager from './runtime/audio'; // 导入音频管理器
import MenuPage from './pages/menuPage';
import GameHomePage from './pages/gameHomePage';
import BattlePage from './pages/battlePage';
import RoomPage from './pages/roomPage';
import PreparePage from './pages/preparePage';

// 页面状态枚举
const PAGE = {
  MENU: 'menu',      // 主菜单
  GAME: 'game'       // 游戏页面
};

// 子页面枚举
const SUB_PAGE = {
  GAME_HOME: 'gameHome',   // 游戏主页（带导航栏）
  BATTLE: 'battle',       // 战斗页面
  ROOM: 'room',          // 室内页面
  PREPARE: 'prepare'      // 整备页面
};

/**
 * 游戏主函数
 * 基础框架：提供游戏循环和渲染流程
 */
export default class Main {
  constructor() {
    this.aniId = 0;
    this.currentPage = PAGE.MENU;  // 当前页面
    this.SUB_PAGE = SUB_PAGE;  // 保存子页面常量引用
    this.currentSubPage = SUB_PAGE.GAME_HOME;  // 当前子页面

    // 篝火动画
    this.fireFrame = 0;

    // 音频管理器
    this.audioManager = new AudioManager();
    this.woodCrackTimer = 0;
    this.nextWoodCrackTime = Math.random() * 300 + 180;  // 3-8秒

    // 页面过渡效果
    this.transitionState = 'none';  // 'none', 'fadeout', 'fadein'
    this.transitionAlpha = 0;  // 0-1，黑色遮罩透明度
    this.targetPage = PAGE.MENU;  // 目标页面

    this.pendingBackToTitle = false;  // 待处理的返回标题操作

    // 创建各个页面
    this.menuPage = new MenuPage(this);
    this.gameHomePage = new GameHomePage(this);
    this.battlePage = new BattlePage(this);
    this.roomPage = new RoomPage(this);
    this.preparePage = new PreparePage(this);

    this.start();
  }

  /**
   * 开始游戏
   */
  start() {
    cancelAnimationFrame(this.aniId);

    // 绑定触摸事件
    wx.onTouchStart(this.handleTouchStart.bind(this));

    // 播放主页背景音乐（烧火声）
    this.audioManager.playFireSound();

    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * 处理触摸事件
   */
  handleTouchStart(e) {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    if (this.currentPage === PAGE.MENU) {
      // 主菜单页面的触摸处理
      const handled = this.menuPage.handleTouch(x, y);
      if (handled) {
        // 已由 menuPage 处理
      }
    } else if (this.currentPage === PAGE.GAME) {
      // 游戏页面的触摸处理
      let handled = false;

      // 根据当前子页面处理触摸
      switch (this.currentSubPage) {
        case SUB_PAGE.GAME_HOME:
          handled = this.gameHomePage.handleTouch(x, y);
          break;
        case SUB_PAGE.BATTLE:
          handled = this.battlePage.handleTouch(x, y);
          break;
        case SUB_PAGE.ROOM:
          handled = this.roomPage.handleTouch(x, y);
          break;
        case SUB_PAGE.PREPARE:
          handled = this.preparePage.handleTouch(x, y);
          break;
      }
    }
  }

  /**
   * 处理菜单操作
   */
  onMenuAction(action) {
    console.log('菜单操作:', action);
    switch (action) {
      case 'start':
        console.log('开始游戏');
        this.startTransitionToGame();
        break;
      case 'load':
        console.log('读取存档');
        break;
      case 'settings':
        console.log('游戏设定');
        break;
    }
  }

  /**
   * 启动过渡到游戏页面
   */
  startTransitionToGame() {
    this.transitionState = 'fadeout';
    this.transitionAlpha = 0;
    this.targetPage = PAGE.GAME;
    this.audioManager.stopBGM();
  }

  /**
   * 启动过渡到主菜单
   */
  startTransitionToMenu() {
    this.transitionState = 'fadeout';
    this.transitionAlpha = 0;
    this.targetPage = PAGE.MENU;
    this.audioManager.stopBGM();
  }

  /**
   * 切换到子页面
   */
  switchToSubPage(subPageName) {
    console.log('切换到子页面:', subPageName);
    switch (subPageName) {
      case 'battle':
        this.currentSubPage = SUB_PAGE.BATTLE;
        break;
      case 'room':
        this.currentSubPage = SUB_PAGE.ROOM;
        break;
      case 'prepare':
        this.currentSubPage = SUB_PAGE.PREPARE;
        break;
    }
  }

  /**
   * 游戏逻辑更新
   */
  update() {
    // 更新火焰动画帧
    this.fireFrame++;

    // 更新音频和音效
    this.updateAudio();

    // 更新页面过渡效果
    if (this.transitionState !== 'none') {
      this.updateTransition();
    }

    // 更新设置弹窗过渡效果
    this.gameHomePage.update();

    // 更新各个页面
    this.menuPage.update();
  }

  /**
   * 更新音频和音效
   */
  updateAudio() {
    // 只在主页且没有弹窗、没有过渡时播放音效
    if (this.currentPage !== PAGE.MENU) return;
    if (this.transitionState !== 'none') return;

    this.woodCrackTimer++;

    if (this.woodCrackTimer >= this.nextWoodCrackTime) {
      this.audioManager.playWoodCrack();
      this.woodCrackTimer = 0;
      this.nextWoodCrackTime = Math.random() * 300 + 180;
    }
  }

  /**
   * 更新页面过渡效果
   */
  updateTransition() {
    const fadeSpeed = 0.03;

    switch (this.transitionState) {
      case 'fadeout':
        // 逐渐变黑
        this.transitionAlpha += fadeSpeed;
        if (this.transitionAlpha >= 1) {
          this.transitionAlpha = 1;
          this.currentPage = this.targetPage;

          // 切换到目标页面
          if (this.targetPage === PAGE.GAME) {
            this.currentSubPage = SUB_PAGE.GAME_HOME;
          }

          this.transitionState = 'fadein';
        }
        break;

      case 'fadein':
        // 逐渐变亮
        this.transitionAlpha -= fadeSpeed;
        if (this.transitionAlpha <= 0) {
          this.transitionAlpha = 0;
          this.transitionState = 'none';

          // 如果回到主页，播放烧火声
          if (this.currentPage === PAGE.MENU) {
            this.audioManager.playFireSound();
          }
        }
        break;
    }
  }

  /**
   * 渲染游戏画面
   */
  render() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 根据过渡状态决定渲染哪个页面
    if (this.transitionState === 'fadeout') {
      // 淡出阶段：渲染当前页面
      if (this.currentPage === PAGE.MENU) {
        this.menuPage.render(ctx);
      } else {
        this.renderGamePage(ctx);
      }
    } else if (this.transitionState === 'fadein') {
      // 淡入阶段：渲染目标页面
      if (this.targetPage === PAGE.MENU) {
        this.menuPage.render(ctx);
      } else {
        this.renderGamePage(ctx);
      }
    } else {
      // 无过渡：渲染当前页面
      if (this.currentPage === PAGE.MENU) {
        this.menuPage.render(ctx);
      } else {
        this.renderGamePage(ctx);
      }
    }

    // 绘制过渡黑色遮罩
    if (this.transitionState !== 'none') {
      ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * 渲染游戏页面（根据子页面）
   */
  renderGamePage(ctx) {
    switch (this.currentSubPage) {
      case SUB_PAGE.GAME_HOME:
        this.gameHomePage.render(ctx);
        break;
      case SUB_PAGE.BATTLE:
        this.battlePage.render(ctx);
        break;
      case SUB_PAGE.ROOM:
        this.roomPage.render(ctx);
        break;
      case SUB_PAGE.PREPARE:
        this.preparePage.render(ctx);
        break;
      default:
        this.gameHomePage.render(ctx);
        break;
    }
  }

  /**
   * 游戏主循环
   */
  loop() {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
}
