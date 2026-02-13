/**
 * 音频管理器
 * 负责播放背景音乐和音效
 */
export default class AudioManager {
  constructor() {
    this.bgm = null;  // 背景音乐
    this.sfx = {};    // 音效集合
    this.isMusicOn = true;   // 音乐开关
    this.isSfxOn = true;     // 音效开关

    // 初始化音频上下文（微信小游戏使用 InnerAudioContext）
    this.audioContext = wx.createInnerAudioContext ? wx.createInnerAudioContext() : null;
  }

  /**
   * 播放背景音乐（循环）
   */
  playBGM(audioPath) {
    if (!this.isMusicOn) return;

    this.stopBGM();

    this.bgm = wx.createInnerAudioContext();
    this.bgm.src = audioPath;
    this.bgm.loop = true;
    this.bgm.volume = 0.3;  // 背景音乐音量30%
    this.bgm.play();

    this.bgm.onError((res) => {
      console.error('BGM播放失败:', res);
    });
  }

  /**
   * 停止背景音乐
   */
  stopBGM() {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.destroy();
      this.bgm = null;
    }
  }

  /**
   * 播放音效
   */
  playSFX(audioPath) {
    if (!this.isSfxOn) return;

    const sfx = wx.createInnerAudioContext();
    sfx.src = audioPath;
    sfx.volume = 0.5;  // 音效音量50%
    sfx.play();

    sfx.onEnded(() => {
      sfx.destroy();
    });

    sfx.onError((res) => {
      console.error('音效播放失败:', res);
    });
  }

  /**
   * 播放烧火音效（循环）
   */
  playFireSound() {
    if (!this.isSfxOn) return;
    this.playBGM('audio/fire.mp3');  // 烧火背景音
  }

  /**
   * 播放木柴断裂音效（随机）
   */
  playWoodCrack() {
    if (!this.isSfxOn) return;

    // 随机选择一个断裂音效
    const crackSounds = ['audio/crack1.mp3', 'audio/crack2.mp3', 'audio/crack3.mp3'];
    const randomSound = crackSounds[Math.floor(Math.random() * crackSounds.length)];
    this.playSFX(randomSound);
  }

  /**
   * 切换音乐开关
   */
  toggleMusic() {
    this.isMusicOn = !this.isMusicOn;
    if (!this.isMusicOn) {
      this.stopBGM();
    }
    return this.isMusicOn;
  }

  /**
   * 切换音效开关
   */
  toggleSFX() {
    this.isSfxOn = !this.isSfxOn;
    return this.isSfxOn;
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume) {
    if (this.bgm) {
      this.bgm.volume = Math.max(0, Math.min(1, volume));
    }
  }
}
