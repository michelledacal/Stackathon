import 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('title');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('play', 'src/assets/spritesheets/play.png')
    this.load.image('playRed', 'src/assets/spritesheets/playRed.png')
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>
    console.log('inside create')
    this.gameButton = this.physics.add.sprite(20, 500, 'play').setInteractive();
    // this.centerButton(this.gameButton, 1)
    // this.gameButton.on('pointerdown', function (pointer) {
      this.scene.start('Game')
    // }.bind(this))

    // this.input.on('pointerover', function (event, gameObjects) {
    //   gameObjects[0].setTexture('playRed');
    // });
     
    // this.input.on('pointerout', function (event, gameObjects) {
    //   gameObjects[0].setTexture('play');
    // });

  }

  // centerButton (gameObject, offset = 0) {
  //   Phaser.Display.Align.In.Center(
  //     gameObject,
  //     this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
  //   );
  // }
}