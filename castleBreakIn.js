import { game } from "./sgc/sgc.js";
import { Sprite } from "./sgc/sgc.js";
game.setBackground("grass.png");

class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}

new Wall(0, 0, "A spooky castle wall", "castle.png");

let leftWall = new Wall;
leftWall.x = 0;
leftWall.y = 200;
leftWall.name = ("Left Side Wall");
leftWall.setImage("wall.png");

let rightWall = new Wall();
rightWall.x = game.displayWidth - 48;
rightWall.y = 200;
rightWall.name = ("Right Side Wall");
rightWall.setImage("wall.png");



class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = 256;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 150;
        this.lives = 1;
        this.accelerateOnBounce = false;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.lives = 3;


    }
    loseALife() {
        this.lives -= 1;
        this.updateLivesDisplay();
        if (this.lives > 0) {
            new Ball();
        }
        if (this.lives <= 0) {
            game.end("The mysterious stranger has escaped from\nPrincess Ann for now!\n\nBetter luck next time.");
        }

    }
    addALife() {
        this.lives += 1;
        this.updateLivesDisplay();
        
    }
    
    updateLivesDisplay() {
        game.createTextArea(game.displayWidth - 48 * 3, 0);
        game.writeToTextArea(this.livesDisplay, "Lives = " + this.lives);
    }
    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
        this.playAnimation("left");
    }
    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
        this.playAnimation("right");
    }
    handleGameLoop() {
        this.x = Math.max(leftWall.width, this.x);
        this.x = Math.min(game.displayWidth - rightWall.width - this.width, this.x);
        this.speed = 0;
    }
    handleCollision(otherSprite) {
        let horizontaloffset = this.x - otherSprite.x;
        let verticaloffset = this.y - otherSprite.y;
        if (Math.abs(horizontaloffset) < this.width && verticaloffset > this.height) {
            otherSprite.angle = 90 + 2 * horizontaloffset;
        }
        return false;
    }
    handleFirstGameLoop() {
        this.livesDisplay = game.createTextArea(game.displayWidth - 144, 20);
        this.updateLivesDisplay();
    }
}

let ann = new Princess();
ann.name = "ann";



class Ball extends Sprite {
    constructor() {
        super();
        this.x = 256;
        this.y = 300;
        this.height = 48;
        this.width = 48;
        this.setImage("ball.png");
        this.defineAnimation("spin", 0, 12);
        this.playAnimation("spin");
        this.speed = 1;
        this.angle = 50 + Math.random() * 80;
        Ball.ballsInPlay += 1;
    }
    handleGameLoop() {
        if (this.speed < 200) {
            this.speed += 2;
        }
    }
    handleBoundaryContact() {
        game.removeSprite(this);
        Ball.ballsInPlay -= 1;
        if(Ball.ballsInPlay == 0) {
            ann.loseALife();
        }
    }
}

Ball.ballsInPlay = 0;

new Ball(256, 300, "A Ball", "ball.png");

class Block extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "Block";
        this.setImage("block1.png");
        this.accelerateOnBounce = false;
        Block.blocksToDestroy = Block.blocksToDestroy + 1;
    }
    handleCollision() {
        game.removeSprite(this);
        Block.blocksToDestroy -= 1;
        if (Block.blocksToDestroy == 0) {
            game.end("Congratulations!\n\Princess Ann can continue her pursuit\nof the mysterious stranger!");
        }
        return true;
    }
}

Block.blocksToDestroy = 0;

for (let i = 0; i < 5; i = i + 1) {
    new Block(200 + i * 48, 200);
}

class ExtraLifeBlock extends Block {
     constructor(x, y, name, image) {
         super(x, y);
         this.setImage("block2.png");
         Block.blocksToDestroy -= 1;
         
     }
     
     handleCollision() {
         super.handleCollision();
         ann.addALife();
         return true;
     }
}

new ExtraLifeBlock(200, 250, "A New Life Block", "block2.png");

class ExtraBallBlock extends Block {
    constructor(x, y, name, image) {
        super(x, y);
        this.setImage("block3.png");
        Block.blocksToDestroy -= 1;
        
    }
    
    handleCollision() {
        super.handleCollision();
        new Ball();
        return true;
        
    }
    
    
}

new ExtraBallBlock(300, 250, "A New Ball Block", "block3.png");
