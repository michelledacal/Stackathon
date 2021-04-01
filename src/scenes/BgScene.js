import 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('swamp', 'src/assets/background/swamp.png');
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    const bg = this.add.image(0, 0, 'swamp').setOrigin(0).setScale(2)
    this.physics.world.bounds.height = bg.height

  }
}