/**
 * 整备-角色页面
 * 显示角色信息
 */
export default class CharacterPage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;
    this.currentTab = 'stats';
    this.navItems = [
      { text: '属性', action: 'stats' },
      { text: '技能', action: 'skills' },
      { text: '职业', action: 'class' },
      { text: '返回', action: 'back' }
    ];
  }

  handleTouch(x, y) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const itemWidth = canvas.width / 4;
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

  handleNavClick(item) {
    console.log('角色页面点击了导航:', item.text);
    switch (item.action) {
      case 'stats':
        this.currentTab = 'stats';
        break;
      case 'skills':
        this.currentTab = 'skills';
        break;
      case 'class':
        this.currentTab = 'class';
        break;
      case 'back':
        this.main.startSubPageTransition(this.main.SUB_PAGE.PREPARE);
        break;
    }
  }

  render(ctx) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3a3a3a');
    gradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('角色', centerX, 50);
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
    this.renderNavBar(ctx);
  }

  renderCharacterInfo(ctx, centerX, centerY) {
    const character = this.main.characterData;
    const boxWidth = 280;
    const boxHeight = 260;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - boxHeight / 2 - 140;
    ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(character.name, centerX, boxY + 20);
    ctx.fillStyle = '#cccccc';
    ctx.font = '20px sans-serif';
    ctx.fillText(`等级 ${character.level}`, centerX, boxY + 75);
    const barWidth = 220;
    const barHeight = 20;
    const barX = centerX - barWidth / 2;
    const barY = boxY + 125;
    this.renderStatBar(ctx, barX, barY, barWidth, barHeight, character.hp, character.maxHp, '生命', '#e74c3c', '#c0392b');
    this.renderStatBar(ctx, barX, barY + 35, barWidth, barHeight, character.mp, character.maxMp, '魔法值', '#4a90e2', '#2c5aa0');
    this.renderStatBar(ctx, barX, barY + 70, barWidth, barHeight, character.stamina, character.maxStamina, '体力', '#27ae60', '#1e8449');
    this.renderStatBar(ctx, barX, barY + 105, barWidth, barHeight, character.exp, character.maxExp, '经验值', '#f39c12', '#d68910');
    this.renderCharacterStats(ctx, centerX, boxY + boxHeight + 60);
  }

  renderCharacterStats(ctx, centerX, y) {
    const character = this.main.characterData;
    const boxX = centerX - 100;
    const boxY = y;
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    const lineHeight = 35;
    ctx.fillText(`攻击: ${character.attack}`, boxX, boxY);
    ctx.fillText(`防御: ${character.defense}`, boxX, boxY + lineHeight);
    ctx.fillText(`魔力: ${character.magicPower}`, boxX, boxY + lineHeight * 2);
  }

  renderStatBar(ctx, x, y, width, height, value, maxValue, label, color1, color2) {
    const labelWidth = 60;
    const barBgWidth = width - labelWidth;
    const barX = x + labelWidth;
    ctx.fillStyle = '#cccccc';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + height / 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(barX, y, barBgWidth, height);
    const fillWidth = (value / maxValue) * barBgWidth;
    ctx.fillStyle = color1;
    ctx.fillRect(barX, y, fillWidth, height);
    ctx.strokeStyle = color2;
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, y, barBgWidth, height);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`${value} / ${maxValue}`, barX + barBgWidth, y + height / 2);
  }

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

      // 当前选中的标签显示为金色，其他为白色
      const isSelected = this.navItems[index].action === this.currentTab;
      ctx.fillStyle = isSelected ? '#ffd700' : '#ffffff';
      ctx.font = isSelected ? 'bold 24px sans-serif' : '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.text, itemCenterX, itemCenterY);
    });
  }

  renderSkillsTab(ctx, centerX) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('技能', centerX, canvas.height / 2 - 40);
  }

  renderClassTab(ctx, centerX) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('职业', centerX, canvas.height / 2 - 40);
  }
}
