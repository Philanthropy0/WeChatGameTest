/**
 * 战斗页面（外出）
 */
export default class BattlePage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;  // 保存子页面常量引用

    // 当前标签
    this.currentTab = 'venture';  // venture: 冒险, collect: 采集, rest: 修整

    // 底部导航栏选项
    this.navItems = [
      { text: '冒险', action: 'venture' },
      { text: '采集', action: 'collect' },
      { text: '修整', action: 'rest' },
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
    console.log('外出页面点击了导航:', item.text);
    switch (item.action) {
      case 'venture':
        this.currentTab = 'venture';
        break;
      case 'collect':
        this.currentTab = 'collect';
        break;
      case 'rest':
        this.currentTab = 'rest';
        break;
      case 'back':
        console.log('返回游戏主页');
        this.main.startSubPageTransition(this.main.SUB_PAGE.GAME_HOME);
        break;
    }
  }

  /**
   * 渲染战斗页面
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
    ctx.fillText('外出', centerX, 50);

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
      case 'venture':
        this.renderVentureTab(ctx, centerX, centerY);
        break;
      case 'collect':
        this.renderCollectTab(ctx, centerX, centerY);
        break;
      case 'rest':
        this.renderRestTab(ctx, centerX, centerY);
        break;
    }
  }

  /**
   * 渲染冒险标签
   */
  renderVentureTab(ctx, centerX, centerY) {
    const contentText = '冒险';
    const subText = '探索未知的区域...';

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
   * 渲染采集标签（地图选择）
   */
  renderCollectTab(ctx, centerX, centerY) {
    const contentText = '选择地点';

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(contentText, centerX, 100);

    // 获取所有地图
    const maps = this.main.mapManager.getAllMaps();

    // 地图选项布局
    const optionHeight = 80;
    const optionGap = 12;
    const optionWidth = 280;
    const startX = centerX - optionWidth / 2;
    const startY = 150;

    maps.forEach((map, index) => {
      const optionY = startY + index * (optionHeight + optionGap);

      // 绘制地图选项背景
      ctx.fillStyle = map.backgroundColor;
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(startX, optionY, optionWidth, optionHeight, [8, 8, 8, 8]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 绘制地图名称
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(map.name, startX + 15, optionY + 15);

      // 绘制地图描述
      ctx.fillStyle = '#cccccc';
      ctx.font = '16px sans-serif';
      ctx.fillText(map.description, startX + 15, optionY + 45);

      // 绘制推荐等级
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Lv.${map.level}`, startX + optionWidth - 15, optionY + 15);
    });
  }

  /**
   * 渲染修整标签
   */
  renderRestTab(ctx, centerX, centerY) {
    const contentText = '修整';
    const subText = '整理装备和物品...';

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
