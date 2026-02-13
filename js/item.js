/**
 * 道具基础类
 * 所有游戏道具的基类
 */
export default class Item {
  constructor(config) {
    this.id = config.id;                    // 唯一标识
    this.name = config.name;                // 名称
    this.description = config.description || '';  // 描述
    this.type = config.type;                  // 类型：material(素材), equipment(装备), weapon(武器), consumable(消耗品)
    this.rarity = config.rarity || 'common';  // 稀有度：common, uncommon, rare, epic, legendary
    this.value = config.value || 0;          // 价值/售价
    this.stackSize = config.stackSize || 99;   // 可堆叠数量
    this.currentStack = config.currentStack || 1; // 当前数量

    // 图标颜色（用于简易显示）
    this.iconColor = config.iconColor || '#ffffff';
  }

  /**
   * 是否可以堆叠
   */
  isStackable() {
    return this.stackSize > 1;
  }

  /**
   * 增加数量
   */
  addStack(amount = 1) {
    if (!this.isStackable()) return false;
    this.currentStack = Math.min(this.currentStack + amount, this.stackSize);
    return true;
  }

  /**
   * 减少数量
   */
  removeStack(amount = 1) {
    if (!this.isStackable()) return false;
    if (this.currentStack < amount) return false;
    this.currentStack -= amount;
    return this.currentStack > 0;
  }

  /**
   * 获取稀有度颜色
   */
  getRarityColor() {
    const colors = {
      'common': '#aaaaaa',      // 灰色
      'uncommon': '#00ff00',    // 绿色
      'rare': '#0070dd',        // 蓝色
      'epic': '#a335ee',        // 紫色
      'legendary': '#ff8000'    // 橙色
    };
    return colors[this.rarity] || colors['common'];
  }

  /**
   * 获取稀有度中文名
   */
  getRarityName() {
    const names = {
      'common': '普通',
      'uncommon': '优秀',
      'rare': '稀有',
      'epic': '史诗',
      'legendary': '传说'
    };
    return names[this.rarity] || '普通';
  }

  /**
   * 获取类型中文名
   */
  getTypeName() {
    const names = {
      'material': '素材',
      'equipment': '装备',
      'weapon': '武器',
      'consumable': '消耗品'
    };
    return names[this.type] || '其他';
  }
}

/**
 * 道具管理器
 * 管理玩家拥有的所有道具
 */
export class ItemManager {
  constructor() {
    this.items = new Map();  // itemId -> Item
  }

  /**
   * 添加道具
   */
  addItem(item) {
    const existing = this.items.get(item.id);

    if (existing && existing.isStackable()) {
      existing.addStack(item.currentStack);
    } else {
      this.items.set(item.id, item);
    }
  }

  /**
   * 移除道具
   */
  removeItem(itemId, amount = 1) {
    const item = this.items.get(itemId);
    if (!item) return false;

    if (item.isStackable()) {
      const success = item.removeStack(amount);
      if (!success || item.currentStack <= 0) {
        this.items.delete(itemId);
      }
      return success;
    } else {
      this.items.delete(itemId);
      return true;
    }
  }

  /**
   * 获取道具
   */
  getItem(itemId) {
    return this.items.get(itemId);
  }

  /**
   * 获取所有道具列表
   */
  getAllItems() {
    return Array.from(this.items.values());
  }

  /**
   * 按类型筛选道具
   */
  getItemsByType(type) {
    return this.getAllItems().filter(item => item.type === type);
  }

  /**
   * 清空道具
   */
  clear() {
    this.items.clear();
  }
}
