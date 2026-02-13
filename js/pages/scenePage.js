/**
 * 场景页面
 * 显示具体的地图场景（采集和冒险通用）
 */
export default class ScenePage {
  constructor(main) {
    this.main = main;
    this.SUB_PAGE = main.SUB_PAGE;

    // 当前地图
    this.currentMap = null;

    // 抖动动画
    this.shakeIntensity = 0;
    this.shakeSpeed = 0.02;

    // 行走动画
    this.walkIntensity = 0;
    this.walkPhase = 0;
    this.walkSpeed = 0.008;
    this.totalSteps = 0;
    this.currentStep = 0;

    // 底部导航栏选项
    this.navItems = [
      { text: '采集', action: 'collect' },
      { text: '前进', action: 'forward' },
      { text: '返回', action: 'back' }
    ];
  }

  /**
   * 设置当前地图
   */
  setMap(mapId) {
    this.currentMap = this.main.mapManager.getMap(mapId);
  }

  /**
   * 更新页面
   */
  update() {
    if (this.shakeIntensity > 0) {
      this.shakeIntensity -= this.shakeSpeed;
      if (this.shakeIntensity < 0) {
        this.shakeIntensity = 0;
      }
    }

    // 行走动画：连续触发
    if (this.totalSteps > 0) {
      if (this.walkIntensity <= 0) {
        this.currentStep++;
        if (this.currentStep <= this.totalSteps) {
          this.walkIntensity = 1;
        }
      }

      if (this.walkIntensity > 0) {
        this.walkIntensity -= this.walkSpeed;
        if (this.walkIntensity < 0) {
          this.walkIntensity = 0;
        }
      }
    }
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
    }
    return false;
  }

  /**
   * 处理导航点击
   */
  handleNavClick(item) {
    console.log('场景页面点击了导航:', item.text);
    switch (item.action) {
      case 'collect':
        console.log('执行采集');
        this.shakeIntensity = 1;
        break;
      case 'forward':
        console.log('执行前进');
        this.totalSteps = 2;
        this.currentStep = 0;
        this.walkIntensity = 1;
        break;
      case 'back':
        console.log('返回外出页面');
        this.main.startSubPageTransition(this.main.SUB_PAGE.BATTLE);
        break;
    }
  }

  /**
   * 渲染场景页面
   */
  render(ctx) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 应用抖动偏移
    let offsetX = (Math.random() - 0.5) * this.shakeIntensity * 4;
    let offsetY = (Math.random() - 0.5) * this.shakeIntensity * 4;

    // 应用行走晃动（上下摆动）
    if (this.walkIntensity > 0) {
      this.walkPhase += 0.2;
      const walkOffsetY = Math.sin(this.walkPhase) * this.walkIntensity * 8;
      offsetY += walkOffsetY;
    }

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // 使用地图背景色
    if (this.currentMap) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, this.currentMap.backgroundColor);
      gradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = '#3a3a3a';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.currentMap ? this.currentMap.name : '场景', centerX, 50);

    // 根据当前地图渲染场景
    if (this.currentMap) {
      this.renderMapScene(ctx, centerX, centerY);
    }

    // 绘制底部导航栏
    this.renderNavBar(ctx);

    ctx.restore();
  }

  /**
   * 渲染地图场景
   */
  renderMapScene(ctx, centerX, centerY) {
    switch (this.currentMap.id) {
      case 'cabin_surroundings':
        this.renderCabinSurroundings(ctx, centerX, centerY);
        break;
      case 'pond':
        this.renderPond(ctx, centerX, centerY);
        break;
      default:
        this.renderDefault(ctx, centerX, centerY);
        break;
    }
  }

  /**
   * 渲染木屋周围
   */
  renderCabinSurroundings(ctx, centerX, centerY) {
    // 绘制背景树木（简化为三角形）
    const treePositions = [
      { x: centerX - 200, y: centerY - 50, size: 60 },
      { x: centerX - 150, y: centerY + 80, size: 50 },
      { x: centerX + 180, y: centerY - 80, size: 55 },
      { x: centerX + 200, y: centerY + 60, size: 65 }
    ];

    treePositions.forEach(tree => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tree.x, tree.y - tree.size);
      ctx.lineTo(tree.x - tree.size / 2, tree.y + tree.size / 2);
      ctx.lineTo(tree.x + tree.size / 2, tree.y + tree.size / 2);
      ctx.closePath();

      ctx.fillStyle = '#2d5a27';
      ctx.fill();
      ctx.strokeStyle = '#1a3a1a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });

    // 绘制中央空地提示
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('安全的森林空地', centerX, centerY);
  }

  /**
   * 渲染池塘
   */
  renderPond(ctx, centerX, centerY) {
    // 绘制水面
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 150, 80, 0, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(0.7, '#2c5aa0');
    gradient.addColorStop(1, '#1a3a4a');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#3a6a9a';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 绘制提示
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('平静的水面', centerX, centerY);
  }

  /**
   * 渲染默认场景
   */
  renderDefault(ctx, centerX, centerY) {
    ctx.fillStyle = '#888888';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('未知的区域', centerX, centerY);
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
