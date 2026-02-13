/**
 * 主页页面
 * 显示篝火场景和三个菜单按钮
 */
export default class MenuPage {
  constructor(main) {
    this.main = main;
    this.fireFrame = 0;

    // 菜单选项
    this.menuItems = [
      { text: '开始游戏', action: 'start' },
      { text: '读取存档', action: 'load' },
      { text: '游戏设定', action: 'settings' }
    ];
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    const menuStartY = canvas.height - 330;
    const menuItemHeight = 60;
    const menuGap = 10;

    for (let i = 0; i < this.menuItems.length; i++) {
      const itemY = menuStartY + i * (menuItemHeight + menuGap);
      const halfHeight = menuItemHeight / 2;

      if (Math.abs(y - itemY) < halfHeight) {
        this.handleClick(this.menuItems[i]);
        return true;
      }
    }
    return false;
  }

  /**
   * 处理菜单点击
   */
  handleClick(item) {
    console.log('点击了菜单:', item.text);
    this.main.onMenuAction(item.action);
  }

  /**
   * 更新页面
   */
  update() {
    this.fireFrame++;
  }

  /**
   * 渲染页面
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

    // 绘制标题"小黑屋"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('小黑屋', centerX, 80);

    // 绘制菜单选项
    this.renderMenuButtons(ctx, centerX);
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
    const fireHeight = 25 + Math.sin(this.fireFrame * 0.1) * 3;
    const fireBaseY = y + 40;

    // 外层火焰（橙色）
    ctx.fillStyle = `rgba(255, 140, 0, ${0.8 + Math.sin(this.fireFrame * 0.15) * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(x - 28, fireBaseY);
    ctx.quadraticCurveTo(x - 30, y - fireHeight / 2, x, y - fireHeight);
    ctx.quadraticCurveTo(x + 30, y - fireHeight / 2, x + 28, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 中层火焰（黄色）
    const midHeight = fireHeight * 0.75;
    ctx.fillStyle = `rgba(255, 200, 0, ${0.9 + Math.sin(this.fireFrame * 0.2) * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(x - 18, fireBaseY);
    ctx.quadraticCurveTo(x - 18, y - midHeight / 2, x, y - midHeight);
    ctx.quadraticCurveTo(x + 18, y - midHeight / 2, x + 18, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 内层火焰（白色/亮黄）
    const innerHeight = fireHeight * 0.5;
    ctx.fillStyle = `rgba(255, 255, 200, ${0.9 + Math.sin(this.fireFrame * 0.25) * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(x - 10, fireBaseY);
    ctx.quadraticCurveTo(x - 10, y - innerHeight / 2, x, y - innerHeight);
    ctx.quadraticCurveTo(x + 10, y - innerHeight / 2, x + 10, fireBaseY);
    ctx.closePath();
    ctx.fill();

    // 火星效果
    for (let i = 0; i < 3; i++) {
      const sparkOffset = Math.sin(this.fireFrame * 0.1 + i * 2) * 10;
      const sparkY = y - 10 - (this.fireFrame % 60 + i * 20) % 40;
      const sparkAlpha = 1 - ((this.fireFrame % 60 + i * 20) % 40) / 40;
      ctx.fillStyle = `rgba(255, 200, 100, ${sparkAlpha})`;
      ctx.beginPath();
      ctx.arc(x + sparkOffset, sparkY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制菜单按钮
   */
  renderMenuButtons(ctx, centerX) {
    const menuStartY = canvas.height - 330;
    const menuItemHeight = 60;
    const menuGap = 10;
    const menuWidth = 220;
    const cornerRadius = 10;

    this.menuItems.forEach((item, index) => {
      const y = menuStartY + index * (menuItemHeight + menuGap);
      const itemX = centerX - menuWidth / 2;

      // 绘制带圆角的矩形边框
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(itemX + cornerRadius, y - menuItemHeight / 2);
      ctx.lineTo(itemX + menuWidth - cornerRadius, y - menuItemHeight / 2);
      ctx.quadraticCurveTo(itemX + menuWidth, y - menuItemHeight / 2, itemX + menuWidth, y - menuItemHeight / 2 + cornerRadius);
      ctx.lineTo(itemX + menuWidth, y + menuItemHeight / 2 - cornerRadius);
      ctx.quadraticCurveTo(itemX + menuWidth, y + menuItemHeight / 2, itemX + menuWidth - cornerRadius, y + menuItemHeight / 2);
      ctx.lineTo(itemX + cornerRadius, y + menuItemHeight / 2);
      ctx.quadraticCurveTo(itemX, y + menuItemHeight / 2, itemX, y + menuItemHeight / 2 - cornerRadius);
      ctx.lineTo(itemX, y - menuItemHeight / 2 + cornerRadius);
      ctx.quadraticCurveTo(itemX, y - menuItemHeight / 2, itemX + cornerRadius, y - menuItemHeight / 2);
      ctx.closePath();

      // 填充背景
      ctx.fillStyle = 'rgba(40, 40, 40, 0.6)';
      ctx.fill();

      // 绘制边框
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // 绘制文字
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = '#cccccc';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, centerX, y);

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });
  }
}
