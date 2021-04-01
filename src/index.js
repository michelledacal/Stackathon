import 'phaser';
import config from './Config/config';
import GameScene from './scenes/GameScene';
import BgScene from './scenes/BgScene';
import FgScene from './scenes/FgScene';
import TitleScene from './scenes/TitleScene';
import BgScene2 from './scenes/Level2Bg'
import FgScene2 from './scenes/Level2Fg'
 
class Game extends Phaser.Game {
  constructor () {
    super(config);

    // << ADD ALL SCENES HERE >>
    this.scene.add('TitleScene', TitleScene);
    this.scene.add('BgScene', BgScene);
    this.scene.add('FgScene', FgScene);
    this.scene.add('BgScene2', BgScene2)
    this.scene.add('FgScene2', FgScene2)
    this.scene.add('Game', GameScene);

    // << START GAME HERE >>
    this.scene.start('Game');
  }
}
 
window.onload = function () {
  window.game = new Game();
}
