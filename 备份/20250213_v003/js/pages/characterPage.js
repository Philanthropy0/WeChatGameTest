/**
 * 整备-角色页面
 * 显示角色信息
 */
export default class CharacterPage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;  // 保存子页面常量引用

    // 当前选中的标签
    this.currentTab = 'stats';  // 'stats' | 'skills' | 'class'

    // 底部导航栏选项
    this.navItems = [
      { text: '属性', action: 'stats' },
      { text: '技能', action: 'skills' },
      { text: '职业', action: 'class' },
      { text: '返回', action: 'back' }
    ];

    // 角色数据（模拟）
    this.character = {
      name: '冒险者',
      level: 1,
      hp: 100,
      maxHp: 100,
      mp: 0,
      maxMp: 100,
      stamina: 0,
      maxStamina: 50,
      exp: 0,
      maxExp: 100,
      attack: 10,
      defense: 5,
      magicPower: 0
    };
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const itemWidth = canvas.width / 4;  // 4个选项

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
    console.log('角色页面点击了导航:', item.text);
    switch (item.action) {
      case 'stats':
        console.log('切换到属性');
        this.currentTab = 'stats';
        break;
      case 'skills':
        console.log('切换到技能');
        this.currentTab = 'skills';
        break;
      case 'class':
        console.log('切换到职业');
        this.currentTab = 'class';
        break;
      case 'back':
        console.log('返回整备页面');
        this.main.startSubPageTransition(this.main.SUB_PAGE.PREPARE);
        break;
    }
  }

  /**
   * 渲染角色页面
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
    ctx.fillText('角色', centerX, 50);

    // 根据当前标签渲染不同内容
    switch (this.currentTab) {
      case 'stats':
        this.renderCharacterInfo(ctx, centerX, centerY);
        break;
      case 'skills':
        this.renderSkillsTab(ctx, centerX);
        break;
      case 'class':
        this.renderClassTab(ctx, centerX);
        break;
    }

    // 绘制底部导航栏
    this.renderNavBar(ctx);
  }

  /**
   * 绘制角色信息
   */
  renderCharacterInfo(ctx, centerX, centerY) {
    const boxWidth = 280;
    const boxHeight = 260;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - boxHeight / 2 - 140;  // 继续向上偏移

    // 绘制角色面板背景框
    ctx.save();
    ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.restore();

    // 绘制角色名称
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.character.name, centerX, boxY + 20);

    // 绘制等级
    ctx.fillStyle = '#cccccc';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`等级 ${this.character.level}`, centerX, boxY + 65);

    // 绘制属性条
    const barWidth = 220;
    const barHeight = 20;
    const barX = centerX - barWidth / 2;
    const barY = boxY + 110;

    this.renderStatBar(ctx, barX, barY, barWidth, barHeight, this.character.hp, this.character.maxHp, '生命', '#e74c3c', '#c0392b');
    this.renderStatBar(ctx, barX, barY + 30, barWidth, barHeight, this.character.mp, this.character.maxMp, '魔法值', '#4a90e2', '#2c5aa0');
    this.renderStatBar(ctx, barX, barY + 60, barWidth, barHeight, this.character.stamina, this.character.maxStamina, '体力', '#27ae60', '#1e8449');
    this.renderStatBar(ctx, barX, barY + 90, barWidth, barHeight, this.character.exp, this.character.maxExp, '经验值', '#f39c12', '#d68910');

    // 绘制角色数值区域（增加间距）
    this.renderCharacterStats(ctx, centerX, boxY + boxHeight + 60);
  }

  /**
   * 绘制角色数值区域
   */
  renderCharacterStats(ctx, centerX, y) {
    const boxX = centerX - 100;
    const boxY = y;

    // 绘制三项数值（无边框，无标题）
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const lineHeight = 35;  // 增加行间距

    ctx.fillText(`攻击: ${this.character.attack}`, boxX, boxY);
    ctx.fillText(`防御: ${this.character.defense}`, boxX, boxY + lineHeight);
    ctx.fillText(`魔力: ${this.character.magicPower}`, boxX, boxY + lineHeight * 2);
  }

  /**
   * 绘制属性条
   */
  renderStatBar(ctx, x, y, width, height, value, maxValue, label, color1, color2) {
    const labelWidth = 60;  // 标签宽度
    const barBgWidth = width - labelWidth;
    const barBgHeight = height;
    const barX = x + labelWidth;  // 属性条起始位置（标签在左侧）

    // 绘制标签
    ctx.fillStyle = '#cccccc';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + barBgHeight / 2);

    // 绘制背景条
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(barX, y, barBgWidth, barBgHeight);

    // 绘制填充条
    const fillWidth = (value / maxValue) * barBgWidth;
    ctx.fillStyle = color1;
    ctx.fillRect(barX, y, fillWidth, barBgHeight);

    // 绘制边框
    ctx.strokeStyle = color2;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, y, barBgWidth, barBgHeight);

    // 绘制数值
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value} / ${maxValue}`, barX + barBgWidth, y + barBgHeight / 2);
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

  /**
   * 绘制技能标签页
   */
  renderSkillsTab(ctx, centerX) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('技能', centerX, canvas.height / 2 - 40);
  }

  /**
   * 绘制职业标签页
   */
  renderClassTab(ctx, centerX) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('职业', centerX, canvas.height / 2 - 40);
  }
}
