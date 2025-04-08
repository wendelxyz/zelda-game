const X_VELOCITY = 200
const Y_VELOCITY = 200

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.velocity = velocity
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.width / 2,
    }

    this.loaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.loaded = true
    }
    this.image.src = './images/player.png'
    this.currentFrame = 0
    this.elapsedTime = 0
  }

  draw(c) {
    if (!this.loaded) return

    // Red square debug code
    c.fillStyle = 'rgba(0, 0, 255, 0.5)'
    c.fillRect(this.x, this.y, this.width, this.height)

    const cropbox = {
      x: 0,
      y: 0,
      width: 16,
      height: 16
    }
    c.drawImage(
      this.image, 
      cropbox.x, 
      cropbox.height * this.currentFrame, 
      cropbox.width, 
      cropbox.height, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    this.elapsedTime += deltaTime // delta time is the amount of time that has passed between each frame

    // oscillate between 0-3 -- set current frame equal to current frame + 1, mod by max ammount of frames

    const intervalToGoToNextFrame = 0.15
    if(this.elapsedTime > intervalToGoToNextFrame) {
      this.currentFrame = (this.currentFrame + 1) % 4
      this.elapsedTime -= intervalToGoToNextFrame
    }
    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.width / 2,
    }
  }

  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
  }

  handleInput(keys) {
    this.velocity.x = 0
    this.velocity.y = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
    } else if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY
    } else if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer

          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y + collisionBlock.height + buffer
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.height - buffer
          break
        }
      }
    }
  }
}