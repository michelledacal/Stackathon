import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.facingLeft = false;
  }

  // Check which controller button is being pushed and execute movement & animation
  updateMovement(cursors) {
    // Move left
    if (cursors.left.isDown) {
      if (!this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = true;
      }
      this.setVelocityX(-150);
      if (this.body.blocked.down) {
        this.play('run', true)
      }
    }
    // Move right
    else if (cursors.right.isDown) {
      if (this.facingLeft) {
        this.flipX = !this.flipX;
        this.facingLeft = false;
      }
      this.setVelocityX(150)
      if (this.body.blocked.down) {
        this.play('run', true)
      }
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0)
      this.anims.play('idle')
    }
  }

  updateJump(cursors) {
    if (cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(-200);
    }
  }

  updateinAir() {
    if (!this.body.blocked.down) {
      this.play('jump')
    }
  }


  update(cursors) {
    this.updateMovement(cursors);
    this.updateJump(cursors);
    this.updateinAir();
  }
}