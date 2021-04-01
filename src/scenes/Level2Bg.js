import 'phaser';

export default class BgScene2 extends Phaser.Scene {
  constructor() {
    super('BgScene2');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('wasteland', 'src/assets/background/wasteland.png');
    // this.load.image('mountains', 'src/assets/background/mountains.png');
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    const bg = this.add.image(-100, 0, 'wasteland').setOrigin(0).setScale(2.4)
    this.physics.world.bounds.height = bg.height
    // this.add.image(-100, 0, 'mountains').setOrigin(0).setScale(2.4);

  }
}