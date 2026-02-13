/**
 * 整备-装备页面
 * 显示装备槽位和装备信息
 */
export default class EquipmentPage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;

    // 底部导航栏选项
    this.navItems = [
      { text: '角色', action: 'character' },
      { text: '道具', action: 'items' },
      { text: '返回', action: 'back' }
    ];

    // 装备槽位配置
    this.equipmentSlots = [
      { name: '武器', slot: 'weapon', item: null },
      { name: '头盔', slot: 'head', item: null },
      { name: '盔甲', slot: 'chest', item: null },
      { name: '护腿', slot: 'legs', item: null },
      { name: '鞋子', slot: 'feet', item: null },
      { name: '饰品', slot: 'accessory', item: null }
    ];
  }

  /**
   * 处理触摸事件
   */
  handleTouch(x, y) {
    const navHeight = 80;
    const navY = canvas.height - navHeight;
    const itemWidth = canvas.width / 3;

    // 检查是否点击了底部导航栏
    if (y >= navY) {
      for (let i = 0; i < this.navItems.length; i++) {
        const itemX = i * itemWidth;
        if (x >= itemX && x < itemX + itemWidth) {
          this.handleNavClick(this.navItems[i]);
          return true;
        }
      }
      return true;
    }

    // 检查是否点击了装备槽位
    const slotStartY = 120;
    const slotHeight = 70;
    const slotGap = 10;

    for (let i = 0; i < this.equipmentSlots.length; i++) {
      const slotY = slotStartY + i * (slotHeight + slotGap);
      if (y >= slotY && y < slotY + slotHeight && x >= 40 && x < canvas.width - 40) {
        this.handleSlotClick(this.equipmentSlots[i]);
        return true;
      }
    }

    return false;
  }

  /**
   * 处理装备槽位点击
   */
  handleSlotClick(slot) {
    console.log('点击了装备槽位:', slot.name);
    // TODO: 打开装备选择界面
  }

  /**
   * 处理导航点击
   */
  handleNavClick(item) {
    console.log('装备页面点击了导航:', item.text);
    switch (item.action) {
      case 'character':
        console.log('打开角色页面');
        this.main.switchToSubPage('character');
        break;
      case 'items':
        console.log('打开道具页面');
        this.main.switchToSubPage('items');
        break;
      case 'back':
        console.log('返回整备页面');
        this.main.startSubPageTransition(this.main.SUB_PAGE.PREPARE);
        break;
    }
  }

  /**
   * 渲染装备页面
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
    ctx.fillText('装备', centerX, 50);

    // 绘制装备槽位
    this.renderEquipmentSlots(ctx);

    // 绘制底部导航栏
    this.renderNavBar(ctx);
  }

  /**
   * 绘制装备槽位
   */
  renderEquipmentSlots(ctx) {
    const slotStartY = 120;
    const slotWidth = canvas.width - 80;
    const slotHeight = 70;
    const slotGap = 10;

    this.equipmentSlots.forEach((slot, index) => {
      const slotY = slotStartY + index * (slotHeight + slotGap);
      const slotX = 40;

      // 绘制槽位背景
      ctx.save();
      ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;

      // 圆角矩形
      const radius = 10;
      ctx.beginPath();
      ctx.moveTo(slotX + radius, slotY);
      ctx.lineTo(slotX + slotWidth - radius, slotY);
      ctx.quadraticCurveTo(slotX + slotWidth, slotY, slotX + slotWidth, slotY + radius);
      ctx.lineTo(slotX + slotWidth, slotY + slotHeight - radius);
      ctx.quadraticCurveTo(slotX + slotWidth, slotY + slotHeight, slotX + slotWidth - radius, slotY + slotHeight);
      ctx.lineTo(slotX + radius, slotY + slotHeight);
      ctx.quadraticCurveTo(slotX, slotY + slotHeight, slotX, slotY + slotHeight - radius);
      ctx.lineTo(slotX, slotY + radius);
      ctx.quadraticCurveTo(slotX, slotY, slotX + radius, slotY);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 绘制槽位名称
      ctx.fillStyle = '#cccccc';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(slot.name, slotX + 15, slotY + slotHeight / 2);

      // 绘制装备信息或空槽位提示
      if (slot.item) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px sans-serif';
        ctx.fillText(slot.item.name, slotX + 100, slotY + slotHeight / 2);
      } else {
        ctx.fillStyle = '#888888';
        ctx.font = '16px sans-serif';
        ctx.fillText('空', slotX + 100, slotY + slotHeight / 2);
      }
    });
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

    // 绘制三个选项
    const itemWidth = canvas.width / 3;
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
