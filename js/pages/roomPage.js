/**
 * 室内页面
 */
export default class RoomPage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;  // 保存子页面常量引用

    // 底部导航栏选项
    this.navItems = [
      { text: '制作', action: 'craft' },
      { text: '锻炼', action: 'exercise' },
      { text: '成就', action: 'achievement' },
      { text: '返回', action: 'back' }
    ];

    // 光效动画变量
    this.lightIntensity = 0;
    this.lightDirection = 1;  // 1 为变亮，-1 为变暗
  }

  /**
   * 更新光效动画
   */
  update() {
    const speed = 0.02;
    this.lightIntensity += speed * this.lightDirection;

    if (this.lightIntensity >= 1) {
      this.lightIntensity = 1;
      this.lightDirection = -1;
    } else if (this.lightIntensity <= 0) {
      this.lightIntensity = 0;
      this.lightDirection = 1;
    }
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const itemWidth = canvas.width / 4;

    // 检查是否点击了底部导航栏
    if (y >= navY) {
      for (let i = 0; i < this.navItems.length; i++) {
        const itemX = i * itemWidth;
        if (x >= itemX && x < itemX + itemWidth) {
          this.handleNavClick(this.navItems[i]);
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
    console.log('室内页面点击了导航:', item.text);
    switch (item.action) {
      case 'craft':
      case 'exercise':
      case 'achievement':
        console.log('功能开发中');
        break;
      case 'back':
        console.log('返回游戏主页');
        // 启动子页面过渡效果
        this.main.startSubPageTransition(this.main.SUB_PAGE.GAME_HOME);
        break;
    }
  }

  /**
   * 渲染室内页面
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

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('室内', centerX, 50);

    // 绘制木屋
    this.renderHouse(ctx, centerX, centerY);

    // 绘制底部导航栏
    this.renderNavBar(ctx);
  }

  /**
   * 绘制木屋
   */
  renderHouse(ctx, centerX, centerY) {
    const houseWidth = 280;
    const houseHeight = 180;
    const houseX = centerX - houseWidth / 2;
    const houseY = centerY - houseHeight / 2 - 20;
    const logHeight = 18;

    // 绘制地面光照效果（在房子下方，从窗户中心向下）
    const windowSize = 80;
    const windowX = houseX + houseWidth - windowSize - 30;
    const windowCenter = windowX + windowSize / 2;
    this.renderGroundLight(ctx, windowCenter, houseY + houseHeight);

    // 窗户的Y位置（与门对齐）
    const doorWidth = 60;
    const doorHeight = 90;
    const doorY = houseY + houseHeight - doorHeight - 10;
    const windowY = doorY;

    // 绘制三角形屋顶
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX - houseWidth / 2 - 20, houseY);
    ctx.lineTo(centerX, houseY - 60);
    ctx.lineTo(centerX + houseWidth / 2 + 20, houseY);
    ctx.closePath();

    ctx.fillStyle = '#5c4033';
    ctx.fill();
    ctx.strokeStyle = '#3d2817';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 绘制水平堆叠的木墙
    const numLogs = Math.floor(houseHeight / logHeight);
    for (let i = 0; i < numLogs; i++) {
      const logY = houseY + i * logHeight;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(houseX, logY, houseWidth, logHeight, [2, 2, 2, 2]);

      const logGradient = ctx.createLinearGradient(houseX, logY, houseX + houseWidth, logY);
      logGradient.addColorStop(0, '#8B4513');
      logGradient.addColorStop(0.5, '#A0522D');
      logGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = logGradient;
      ctx.fill();

      ctx.strokeStyle = '#5c3317';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // 门的位置（左侧）
    const doorX = houseX + 30;

    // 绘制门
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(doorX, doorY, doorWidth, doorHeight, [3, 3, 0, 0]);

    ctx.fillStyle = '#4a3728';
    ctx.fill();
    ctx.strokeStyle = '#2d1f14';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 绘制门把手
    ctx.save();
    ctx.beginPath();
    ctx.arc(doorX + doorWidth - 12, doorY + doorHeight / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 绘制窗户内部背景
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(windowX, windowY, windowSize, windowSize, [3, 3, 3, 3]);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    ctx.restore();

    // 绘制窗户内部光效
    this.renderWindowLight(ctx, windowX, windowY, windowSize);

    // 绘制窗框（十字形）
    const frameWidth = 3;
    ctx.save();
    ctx.strokeStyle = '#5c4033';
    ctx.lineWidth = frameWidth;
    ctx.beginPath();
    ctx.roundRect(windowX, windowY, windowSize, windowSize, [3, 3, 3, 3]);
    ctx.stroke();
    ctx.restore();

    // 水平窗框
    ctx.save();
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(windowX + 2, windowY + windowSize / 2 - frameWidth / 2, windowSize - 4, frameWidth);
    ctx.restore();

    // 垂直窗框
    ctx.save();
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(windowX + windowSize / 2 - frameWidth / 2, windowY + 2, frameWidth, windowSize - 4);
    ctx.restore();
  }

  /**
   * 绘制窗户内部光效
   */
  renderWindowLight(ctx, windowX, windowY, windowSize) {
    ctx.save();

    // 创建窗户区域裁剪
    ctx.beginPath();
    ctx.roundRect(windowX, windowY, windowSize, windowSize, [3, 3, 3, 3]);
    ctx.clip();

    const centerX = windowX + windowSize / 2;
    const centerY = windowY + windowSize / 2;
    const intensity = 0.6 + this.lightIntensity * 0.3;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, windowSize / 2);
    gradient.addColorStop(0, `rgba(255, 230, 150, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(255, 200, 100, ${intensity * 0.6})`);
    gradient.addColorStop(1, 'rgba(255, 180, 80, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(windowX, windowY, windowSize, windowSize);

    ctx.restore();
  }

  /**
   * 绘制地面光照效果
   * @param {number} centerX - 窗户中心X坐标
   * @param {number} groundY - 地面Y坐标
   */
  renderGroundLight(ctx, centerX, groundY) {
    const lightLength = 150;
    const lightWidthTop = 70;
    const lightWidthBottom = 100;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(centerX - lightWidthTop / 2, groundY);
    ctx.lineTo(centerX + lightWidthTop / 2, groundY);
    ctx.lineTo(centerX + lightWidthBottom / 2, groundY + lightLength);
    ctx.lineTo(centerX - lightWidthBottom / 2, groundY + lightLength);
    ctx.closePath();

    const intensity = 0.3 + this.lightIntensity * 0.3;

    const gradient = ctx.createLinearGradient(0, groundY, 0, groundY + lightLength);
    gradient.addColorStop(0, `rgba(255, 220, 120, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(255, 180, 80, ${intensity * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
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
    this.navItems.forEach((item, index) => {
      const itemCenterX = index * itemWidth + itemWidth / 2;
      const itemCenterY = navY + navHeight / 2;

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, itemCenterX, itemCenterY);
    });
  }
}
