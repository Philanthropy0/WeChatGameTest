/**
 * 地图基础类
 * 游戏中的不同地点/场景
 */
export default class GameMap {
  constructor(config) {
    this.id = config.id;                    // 唯一标识
    this.name = config.name;                // 名称
    this.description = config.description || '';  // 描述
    this.type = config.type || 'outdoor';  // 类型：outdoor(户外), indoor(室内), dungeon(地下城)
    this.level = config.level || 1;          // 推荐等级
    this.backgroundColor = config.backgroundColor || '#3a3a3a';  // 背景色

    // 地图中的可能事件
    this.events = config.events || [];  // 可发生的 events: { type: 'battle' | 'collect' | 'rest', weight: 1-10 }
  }

  /**
   * 获取地图名称颜色
   */
  getNameColor() {
    return '#ffffff';
  }

  /**
   * 获取描述颜色
   */
  getDescriptionColor() {
    return '#aaaaaa';
  }
}

/**
 * 地图管理器
 * 管理游戏中的所有地图
 */
export class MapManager {
  constructor() {
    this.maps = new Map();  // mapId -> GameMap
    this.currentMap = null;  // 当前所在的地图
  }

  /**
   * 注册地图
   */
  registerMap(mapConfig) {
    const map = new GameMap(mapConfig);
    this.maps.set(map.id, map);
    return map;
  }

  /**
   * 获取地图
   */
  getMap(mapId) {
    return this.maps.get(mapId);
  }

  /**
   * 获取所有地图
   */
  getAllMaps() {
    return Array.from(this.maps.values());
  }

  /**
   * 切换到指定地图
   */
  enterMap(mapId) {
    const map = this.getMap(mapId);
    if (map) {
      this.currentMap = map;
      return true;
    }
    return false;
  }

  /**
   * 获取当前地图
   */
  getCurrentMap() {
    return this.currentMap;
  }
}
