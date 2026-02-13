/**
 * 整备页面
 */
export default class PreparePage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;

    // 当前标签：equipment(装备) 或 items(道具)
    this.currentTab = 'equipment';

    // 底部导航栏选项
    this.navItems = [
      { text: '角色', action: 'character' },
      { text: '装备', action: 'equipment' },
      { text: '道具', action: 'items' },
      { text: '返回', action: 'back' }
    ];
  }

  /**
   * 更新页面
   */
  update() {
    // 暂时没有需要更新的动画
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
    console.log('整备页面点击了导航:', item.text);
    switch (item.action) {
      case 'character':
        console.log('切换到角色页面');
        this.main.startSubPageTransition(this.main.SUB_PAGE.CHARACTER);
        break;
      case 'equipment':
        this.currentTab = 'equipment';
        break;
      case 'items':
        this.currentTab = 'items';
        break;
      case 'back':
        console.log('返回游戏主页');
        this.main.startSubPageTransition(this.main.SUB_PAGE.GAME_HOME);
        break;
    }
  }

  /**
   * 渲染整备页面
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
    ctx.fillText('整备', centerX, 50);

    // 根据当前标签绘制内容
    this.renderContent(ctx, centerX, centerY);

    // 绘制底部导航栏
    this.renderNavBar(ctx);
  }

  /**
   * 渲染内容区域
   */
  renderContent(ctx, centerX, centerY) {
    switch (this.currentTab) {
      case 'equipment':
        this.renderEquipmentTab(ctx, centerX, centerY);
        break;
      case 'items':
        this.renderItemsTab(ctx, centerX, centerY);
        break;
    }
  }

  /**
   * 渲染装备标签
   */
  renderEquipmentTab(ctx, centerX, centerY) {
    const contentText = '装备';
    const subText = '查看和穿戴装备...';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(contentText, centerX, centerY - 30);

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '24px sans-serif';
    ctx.fillText(subText, centerX, centerY + 30);
  }

  /**
   * 渲染道具标签（背包）
   */
  renderItemsTab(ctx, centerX, centerY) {
    const contentText = '道具';

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(contentText, centerX, 100);

    // 获取所有道具
    const items = this.main.itemManager.getAllItems();

    // 背包布局配置
    const slotSize = 60;          // 格子大小
    const slotGap = 8;            // 格子间距
    const slotsPerRow = 5;        // 每行格子数
    const startX = centerX - (slotsPerRow * slotSize + (slotsPerRow - 1) * slotGap) / 2;
    const startY = 150;             // 起始Y位置

    // 绘制道具格子
    items.forEach((item, index) => {
      const row = Math.floor(index / slotsPerRow);
      const col = index % slotsPerRow;
      const slotX = startX + col * (slotSize + slotGap);
      const slotY = startY + row * (slotSize + slotGap);

      // 绘制格子背景
      ctx.fillStyle = '#2a2a2a';
      ctx.strokeStyle = item.getRarityColor();  // 使用稀有度颜色作为边框
      ctx.lineWidth = 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(slotX, slotY, slotSize, slotSize, [4, 4, 4, 4]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 格子中央显示道具文本：名称 + 数量
      const itemText = `${item.name}${item.currentStack}`;
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(itemText, slotX + slotSize / 2, slotY + slotSize / 2);
    });

    // 如果没有道具，显示提示
    if (items.length === 0) {
      ctx.fillStyle = '#888888';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('背包为空', centerX, centerY);
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
}
