/**
 * 游戏主页
 * 包含底部导航栏和设置弹窗
 */
export default class GameHomePage {
  constructor(main) {
    this.main = main;

    // 底部导航栏选项
    this.gameNavItems = [
      { text: '外出', action: 'battle', locked: false },
      { text: '室内', action: 'room', locked: false },
      { text: '整备', action: 'prepare', locked: false },
      { text: '设置', action: 'settings', locked: false }
    ];

    // 设置弹窗选项
    this.settingsItems = [
      { text: '画面', action: 'graphics' },
      { text: '声音', action: 'sound' },
      { text: '兑换', action: 'redeem' },
      { text: '返回标题', action: 'backToTitle' }
    ];

    // 设置弹窗状态
    this.showSettingsPopup = false;
    this.settingsPopupAlpha = 0;
    this.settingsPopupState = 'none';  // 'none', 'opening', 'open', 'closing'
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const itemWidth = canvas.width / 4;

    // 如果设置弹窗正在显示，优先处理弹窗点击
    if (this.showSettingsPopup && this.settingsPopupState !== 'none') {
      return this.handleSettingsPopupClick(x, y);
    }

    // 检查是否点击了底部导航栏
    if (y >= navY) {
      for (let i = 0; i < this.gameNavItems.length; i++) {
        const itemX = i * itemWidth;
        if (x >= itemX && x < itemX + itemWidth) {
          this.handleNavClick(this.gameNavItems[i]);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 处理导航点击
   */
  handleNavClick(item) {
    console.log('点击了导航:', item.text);

    // 如果按钮被锁定，不处理
    if (item.locked) {
      console.log('按钮已锁定:', item.text);
      return;
    }

    switch (item.action) {
      case 'battle':
        this.main.switchToSubPage('battle');
        break;
      case 'room':
        this.main.switchToSubPage('room');
        break;
      case 'prepare':
        this.main.switchToSubPage('prepare');
        break;
      case 'settings':
        console.log('打开设置弹窗');
        this.showSettingsPopup = true;
        this.settingsPopupState = 'opening';
        this.settingsPopupAlpha = 0;
        break;
    }
  }

  /**
   * 处理设置弹窗点击
   */
  handleSettingsPopupClick(x, y) {
    const popupWidth = 200;
    const popupHeight = 280;
    const popupX = (canvas.width - popupWidth) / 2;
    const popupY = (canvas.height - popupHeight) / 2;
    const itemHeight = 70;

    // 检查是否点击了弹窗矩形范围内
    const inPopupX = x >= popupX && x <= popupX + popupWidth;
    const inPopupY = y >= popupY && y <= popupY + popupHeight;

    if (inPopupX && inPopupY) {
      // 点击在弹窗内，检查是否点击了选项
      for (let i = 0; i < this.settingsItems.length; i++) {
        const itemY = popupY + i * itemHeight;
        if (y >= itemY && y < itemY + itemHeight) {
          this.handleSettingsItemClick(this.settingsItems[i]);
          return true;
        }
      }
    } else {
      // 点击弹窗外部关闭
      if (this.settingsPopupState === 'opening' || this.settingsPopupState === 'open') {
        this.settingsPopupState = 'closing';
      }
      return true;
    }
    return false;
  }

  /**
   * 处理设置选项点击
   */
  handleSettingsItemClick(item) {
    console.log('点击了设置选项:', item.text);
    switch (item.action) {
      case 'graphics':
      case 'sound':
      case 'redeem':
        console.log('功能开发中');
        this.settingsPopupState = 'closing';
        break;
      case 'backToTitle':
        console.log('返回标题');
        this.settingsPopupState = 'closing';
        this.main.pendingBackToTitle = true;
        this.main.audioManager.stopBGM();
        break;
    }
  }

  /**
   * 更新设置弹窗过渡效果
   */
  update() {
    if (this.settingsPopupState === 'none' || this.settingsPopupState === 'open') {
      return;
    }

    const fadeSpeed = 0.05;

    if (this.settingsPopupState === 'opening') {
      this.settingsPopupAlpha += fadeSpeed;
      if (this.settingsPopupAlpha >= 1) {
        this.settingsPopupAlpha = 1;
        this.settingsPopupState = 'open';
      }
    } else if (this.settingsPopupState === 'closing') {
      this.settingsPopupAlpha -= fadeSpeed;
      if (this.settingsPopupAlpha <= 0) {
        this.settingsPopupAlpha = 0;
        this.settingsPopupState = 'none';
        this.showSettingsPopup = false;

        // 如果有待处理的返回标题操作，启动页面过渡
        if (this.main.pendingBackToTitle) {
          this.main.pendingBackToTitle = false;
          this.main.startTransitionToMenu();
        }
      }
    }
  }

  /**
   * 渲染游戏页面
   */
  render(ctx) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 绘制统一的灰色渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3a3a3a');
    gradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制篝火场景
    this.drawCampfireGlow(ctx, centerX, centerY - 120);
    this.drawCampfire(ctx, centerX, centerY - 120);

    // 绘制游戏标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('游戏页面', centerX, 50);

    // 绘制底部导航栏
    this.renderNavBar(ctx);

    // 如果设置弹窗打开，绘制弹窗
    if (this.showSettingsPopup || this.settingsPopupState !== 'none') {
      this.renderSettingsPopup(ctx);
    }
  }

  /**
   * 绘制底部导航栏
   */
  renderNavBar(ctx) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const cornerRadius = 15;

    ctx.save();

    // 绘制带圆角的导航栏
    ctx.beginPath();
    ctx.moveTo(0, navY);
    ctx.lineTo(cornerRadius, navY);
    ctx.quadraticCurveTo(0, navY, 0, navY + cornerRadius);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, navY + cornerRadius);
    ctx.quadraticCurveTo(canvas.width, navY, canvas.width - cornerRadius, navY);
    ctx.closePath();

    ctx.fillStyle = '#333333';
    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 绘制四个选项
    const itemWidth = canvas.width / 4;
    this.gameNavItems.forEach((item, index) => {
      const itemCenterX = index * itemWidth + itemWidth / 2;
      const itemCenterY = navY + navHeight / 2;

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, itemCenterX, itemCenterY);
    });
  }

  /**
   * 渲染设置弹窗
   */
  renderSettingsPopup(ctx) {
    const popupWidth = 200;
    const popupHeight = 280;
    const popupX = (canvas.width - popupWidth) / 2;
    const popupY = (canvas.height - popupHeight) / 2;
    const cornerRadius = 10;

    // 根据透明度绘制遮罩
    ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * this.settingsPopupAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 保存上下文并设置透明度
    ctx.save();
    ctx.globalAlpha = this.settingsPopupAlpha;

    // 绘制弹窗背景（带圆角）
    ctx.beginPath();
    ctx.moveTo(popupX + cornerRadius, popupY);
    ctx.lineTo(popupX + popupWidth - cornerRadius, popupY);
    ctx.quadraticCurveTo(popupX + popupWidth, popupY, popupX + popupWidth, popupY + cornerRadius);
    ctx.lineTo(popupX + popupWidth, popupY + popupHeight - cornerRadius);
    ctx.quadraticCurveTo(popupX + popupWidth, popupY + popupHeight, popupX + popupWidth - cornerRadius, popupY + popupHeight);
    ctx.lineTo(popupX + cornerRadius, popupY + popupHeight);
    ctx.quadraticCurveTo(popupX, popupY + popupHeight, popupX, popupY + popupHeight - cornerRadius);
    ctx.lineTo(popupX, popupY + cornerRadius);
    ctx.quadraticCurveTo(popupX, popupY, popupX + cornerRadius, popupY);
    ctx.closePath();

    ctx.fillStyle = '#444444';
    ctx.fill();

    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制选项
    const itemHeight = 70;
    this.settingsItems.forEach((item, index) => {
      const itemY = popupY + index * itemHeight;

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, popupX + popupWidth / 2, itemY + itemHeight / 2);
    });

    ctx.restore();
  }

  /**
   * 绘制篝火周围的光照效果
   */
  drawCampfireGlow(ctx, x, y) {
    const fireBaseY = y + 40;

    ctx.save();

    // 第一层光照：最大的暖黄色光晕
    const gradient1 = ctx.createRadialGradient(x, fireBaseY - 10, 0, x, fireBaseY - 10, 450);
    gradient1.addColorStop(0, 'rgba(255, 180, 80, 0.15)');
    gradient1.addColorStop(0.3, 'rgba(255, 150, 50, 0.08)');
    gradient1.addColorStop(0.6, 'rgba(255, 120, 40, 0.03)');
    gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 第二层光照：中等橙色光晕
    const gradient2 = ctx.createRadialGradient(x, fireBaseY - 10, 0, x, fireBaseY - 10, 280);
    gradient2.addColorStop(0, 'rgba(255, 200, 100, 0.2)');
    gradient2.addColorStop(0.4, 'rgba(255, 160, 60, 0.1)');
    gradient2.addColorStop(0.7, 'rgba(255, 120, 40, 0.04)');
    gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 第三层光照：小范围亮黄色光晕
    const gradient3 = ctx.createRadialGradient(x, fireBaseY - 15, 0, x, fireBaseY - 15, 150);
    gradient3.addColorStop(0, 'rgba(255, 255, 180, 0.25)');
    gradient3.addColorStop(0.5, 'rgba(255, 220, 120, 0.12)');
    gradient3.addColorStop(1, 'rgba(255, 150, 50, 0)');

    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  }

  /**
   * 绘制篝火
   */
  drawCampfire(ctx, x, y) {
    // 绘制木柴
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    // 左边的木柴
    ctx.beginPath();
    ctx.moveTo(x - 30, y + 40);
    ctx.lineTo(x + 8, y + 52);
    ctx.stroke();

    // 右边的木柴
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 40);
    ctx.lineTo(x - 8, y + 52);
    ctx.stroke();

    // 绘制火焰
    const fireHeight = 25 + Math.sin(this.main.fireFrame * 0.1) * 3;
    const fireBaseY = y + 40;

    // 外层火焰（橙色）
    ctx.fillStyle = `rgba(255, 140, 0, ${0.8 + Math.sin(this.main.fireFrame * 0.15) * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(x - 28, fireBaseY);
    ctx.quadraticCurveTo(x - 30, y - fireHeight / 2, x, y - fireHeight);
    ctx.quadraticCurveTo(x + 30, y - fireHeight / 2, x + 28, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 中层火焰（黄色）
    const midHeight = fireHeight * 0.75;
    ctx.fillStyle = `rgba(255, 200, 0, ${0.9 + Math.sin(this.main.fireFrame * 0.2) * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(x - 18, fireBaseY);
    ctx.quadraticCurveTo(x - 18, y - midHeight / 2, x, y - midHeight);
    ctx.quadraticCurveTo(x + 18, y - midHeight / 2, x + 18, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 内层火焰（白色/亮黄）
    const innerHeight = fireHeight * 0.5;
    ctx.fillStyle = `rgba(255, 255, 200, ${0.9 + Math.sin(this.main.fireFrame * 0.25) * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(x - 10, fireBaseY);
    ctx.quadraticCurveTo(x - 10, y - innerHeight / 2, x, y - innerHeight);
    ctx.quadraticCurveTo(x + 10, y - innerHeight / 2, x + 10, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 火星效果
    for (let i = 0; i < 3; i++) {
      const sparkOffset = Math.sin(this.main.fireFrame * 0.1 + i * 2) * 10;
      const sparkY = y - 10 - (this.main.fireFrame % 60 + i * 20) % 40;
      const sparkAlpha = 1 - ((this.main.fireFrame % 60 + i * 20) % 40) / 40;
      ctx.fillStyle = `rgba(255, 200, 100, ${sparkAlpha})`;
      ctx.beginPath();
      ctx.arc(x + sparkOffset, sparkY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
