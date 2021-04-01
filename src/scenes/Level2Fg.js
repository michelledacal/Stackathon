import 'phaser';
import Player from '../entity/Player'

export default class FgScene2 extends Phaser.Scene {
  constructor() {
    super('FgScene2');
    this.death = false;
  }

  init(data) {
    this.data = data
    this.score = data.score
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>

    // PLATFORM **
    this.load.image('wasteland_tiles', 'src/assets/tilemaps/wasteland_tileset.png');
    this.load.tilemapTiledJSON('wasteland', 'src/assets/tilemaps/wasteland_level2.json');

    // PLAYER **
    this.load.spritesheet('wizard', 'src/assets/spritesheets/wizard.png', {
      frameWidth: 50,
      frameHeight: 37
    })

    // WATER **
    this.load.image('water', 'src/assets/spritesheets/water.png')

    // COINS **
    this.load.spritesheet('coin', 'src/assets/spritesheets/coins.png', {
      frameWidth: 15,
      frameHeight: 15
    })
  }

  create() {
    // Create Sprites
    // << CREATE SPRITE HERE >>

    const map = this.make.tilemap({ key: 'wasteland' });
    const tileset = map.addTilesetImage('wasteland_tiles', 'wasteland_tiles');
    
    // BACKGROUND TILES **
    map.createLayer('BackgroundPlatform', tileset, 0, 0);

    // WATER **
    this.water = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const waterObjects = map.getObjectLayer('Water')['objects'];
    waterObjects.forEach(waterObject => {
      const water = this.water.create(waterObject.x, waterObject.y - waterObject.height + 5, 'water').setOrigin(0,0)
      water.body.setSize(water.width, water.height - 20)
    })

    // PLATFORM **
    const platforms = map.createLayer('Platforms', tileset, 0, 0);
    platforms.setCollisionByExclusion([0,-1], true);
    this.physics.world.bounds.width = platforms.width

    // PLAYER **
    this.player = new Player(this, 20, 500, 'wizard').setScale(1.5).setSize(20, 35); //20, 500
    this.player.setCollideWorldBounds(true);

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


    // COLLISIONS **
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.water, this.playerHit, null, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // CURSOR **
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnimations();

    // CAMERA **
    this.cameras.main.setBounds(0, 0, platforms.displayWidth, platforms.displayHeight);
    this.cameras.main.startFollow(this.player);

     // SCORE **
     this.text = this.add.text(20, 570, `${this.score}`, {
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
    this.score = this.data.score;
    this.collectedCoins = [];
  }

  collectCoin(player, coin) {
    this.collectedCoins.push(coin);
    coin.destroy();
    this.score++;
    this.text.setText(this.score)
  }

  playerHit(player, spike) {
    player.setVelocity(0, 0);
    player.setX(20);
    player.setY(500)
    player.play('idle', true);
    player.setAlpha(0);
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
    this.score = this.data.score;
    this.text.setText(this.score);
    this.death = true;
    this.createCoins(this.collectedCoins);
    this.collectedCoins = [];
  }
}