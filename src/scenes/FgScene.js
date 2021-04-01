import 'phaser';
import Player from '../entity/Player'

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.score = 0;
    this.death = false;
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>

    // PLATFORM **
    this.load.image('swamp_tiles', 'src/assets/tilemaps/swamp_tileset.png');
    this.load.tilemapTiledJSON('swamp_map', 'src/assets/tilemaps/swamp_level1.json');

    // PLAYER **
    this.load.spritesheet('wizard', 'src/assets/spritesheets/wizard.png', {
      frameWidth: 50,
      frameHeight: 37
    })

    // FRONT PLATFORMS **
    // this.load.image('block', 'src/assets/spritesheets/block.png')

    // RIDGES **
    this.load.image('ridges', 'src/assets/spritesheets/log.png')

    // COINS **
    this.load.spritesheet('coin', 'src/assets/spritesheets/coins.png', {
      frameWidth: 15,
      frameHeight: 15
    })

    // CHECKPOINT **
    this.load.spritesheet('flag', 'src/assets/spritesheets/flag.png', {
      frameWidth: 100,
      frameHeight: 100
    })

    // ENEMY **
    // this.load.spritesheet('flying-eye', 'src/assets/spritesheets/flying-eye.png', {
    //   frameWidth: 100,
    //   frameHeight: 100
    // })
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>

    // BACKGROUND TILES **
    const map = this.make.tilemap({ key: 'swamp_map' });
    const tileset = map.addTilesetImage('swamp_tiles', 'swamp_tiles');
    map.createLayer('BackgroundPlatform', tileset, 0, 0);

    // PLATFORM **
    const platforms = map.createLayer('Platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion([0,-1], true);
    this.physics.world.bounds.width = platforms.width

    // PLAYER **
    this.player = new Player(this, 20, 500, 'wizard').setScale(1.5).setSize(20, 35); //20, 500 & 3000, 450
    this.player.setCollideWorldBounds(true);

    // FRONT PLATFORMS **
    // this.frontPlatforms = this.physics.add.group({
    //   allowGravity: false,
    //   immovable: true,
    // })
    // const frontObjects = map.getObjectLayer('FrontPlatforms')['objects'];
    // frontObjects.forEach(frontObj => {
    //   const front = this.frontPlatforms.create(frontObj.x, frontObj.y - frontObj.height, 'block').setOrigin(0)
    //   front.body.setSize(front.width, front.height - 20)
    // })
    
    // COINS **
    this.coins = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    this.coinsObjects = map.getObjectLayer('Coins')['objects'];
    this.createCoins(this.coinsObjects)
    // this.coinsObjects.forEach(coinObject => {
    //   const coin = this.coins.create(coinObject.x, coinObject.y - coinObject.height, 'coin').setOrigin(0,0);
    //   coin.body.setSize(coin.width, coin.height - 20);
    //   this.anims.create({
    //     key: 'rotate',
    //     frames: this.anims.generateFrameNumbers('coin', {
    //       start: 0,
    //       end: 4
    //     }),
    //     frameRate: 12,
    //     repeat: -1
    //   })
    //   coin.play('rotate')
    // })

    // RIDGES **
    this.ridges = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const ridgesObjects = map.getObjectLayer('Ridges')['objects'];
    ridgesObjects.forEach(ridgeObject => {
      const ridge = this.ridges.create(ridgeObject.x, ridgeObject.y - ridgeObject.height + 5, 'ridges').setOrigin(0,0)
      ridge.body.setSize(ridge.width, ridge.height - 20)
    })

    // CHECKPOINT **
    this.flag = this.physics.add.group({
      allowGravity: false,
      immovable: true
    })
    const flagObject = map.getObjectLayer('Checkpoint')['objects'];
    flagObject.forEach(flagObj => {
      const flag = this.flag.create(flagObj.x, flagObj.y - flagObj.height - 15, 'flag').setOrigin(0,0)
      flag.body.setSize(flag.width, flag.height - 20);
    })

    // ENEMY **
    // this.enemies = this.physics.add.group({
    //   allowGravity: false,
    //   immovable: true,
    // });
    // this.enemy = this.enemies.create(700, 350, 'flying-eye').setScale(2);
    // this.enemy.flipX = true;
    
    // LASERS **
    // this.lasers = this.physics.add.group({
    //   allowGravity: false
    // })

    // COLLISIONS **
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.ridges, this.playerHit, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.flag, this.nextLevel, null, this);
    // this.physics.add.overlap(this.player, this.frontPlatforms, this.transparentTiles, null, this)
    // this.physics.add.collider(this.enemy, platforms)

    // CURSOR **
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnimations();

    // CAMERA **
    this.cameras.main.setBounds(0, 0, platforms.displayWidth, platforms.displayHeight);
    this.cameras.main.startFollow(this.player);

    // SCORE **
    this.text = this.add.text(20, 570, '0', {
      fontSize: '20px',
      fill: '#fff'
    });
    this.text.setScrollFactor(0);
  }

  createAnimations() {
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'wizard', frame: 0 }],
      frameRate: 20, 
    })
     this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('wizard', {
        start: 10,
        end: 15
      }),
      frameRate: 5,
      repeat: true
    })
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('wizard', {
        start: 22,
        end: 24
      }),
      frameRate: 3,
    })
  }

  update(time, delta) {
    this.player.update(this.cursors);
  }

  createCoins(coinObj) {
    coinObj.forEach(coinObject => {
      const sub = this.death ? coinObject.height : 0;
      const coin = this.coins.create(coinObject.x, coinObject.y - coinObject.height + sub, 'coin').setOrigin(0,0);
      coin.body.setSize(coin.width, coin.height - 20);
      this.anims.create({
        key: 'rotate',
        frames: this.anims.generateFrameNumbers('coin', {
          start: 0,
          end: 4
        }),
        frameRate: 12,
        repeat: -1
      })
      coin.play('rotate')
    })
    this.score = 0;
    this.collectedCoins = [];
  }

  playerHit(player, spike) {
    player.setVelocity(0, 0);
    player.setX(20);
    player.setY(450);
    player.play('idle', true);
    player.setAlpha(0);
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
    this.score = 0;
    this.text.setText(this.score);
    this.death = true;
    this.createCoins(this.collectedCoins);
    this.collectedCoins = [];
  }

  collectCoin(player, coin) {
    this.collectedCoins.push(coin);
    coin.destroy();
    this.score++;
    this.text.setText(this.score)
  }

  // transparentTiles(player, tiles) {

  //   // if (tiles.alpha === 0.5) {
  //   // } else {
  //   //   this.tweens.add({
  //   //     targets: tiles,
  //   //     alpha: 0.5,
  //   //     duration: 100,
  //   //     ease: 'Linear',
  //   //   });
  //   // }
  //   // setTimeout(() => {
  //   //   this.tweens.add({
  //   //     targets: tiles,
  //   //     alpha: 1,
  //   //     duration: 100,
  //   //     ease: 'Linear',
  //   //   });
  //   // }, 500)
  // }

  nextLevel() {
    this.scene.start('BgScene2');
    this.scene.setVisible(false, 'BgScene');
    this.scene.start('FgScene2', { score: this.score });
  }
  
}