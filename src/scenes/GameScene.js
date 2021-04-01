import 'phaser';
 
export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }
 
  create () {
    this.scene.launch('BgScene');
    this.scene.launch('FgScene');
    
  }
};