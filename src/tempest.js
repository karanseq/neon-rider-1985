// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;

var MAX_LEVELS = 5;

var BULLET_COLLISION_DISTANCE = 10;
var ENEMY_COLLISION_DISTANCE = 30;
var PLAYER_COLLISION_DISTANCE = 20;

var BULLET_SCALE = {x:0.1, y:0.1};
var PLAYER_SCALE = {x:0.25, y:0.25};
var PLAYER_EXPLOSION_SCALE = { x: 0.1, y: 0.1 };

var MAX_PARTICLES = 1000;

var LAYER_IS_ANIMATION = false;

var LAYER_ANIMATION_TIMER = 30;
var PROTECT_LAYER_ANIMATION_TIMER = 31;

var caculatePosition = function(radius, angle)
{
	var pos = {x: GAME_WIDTH / 2 + radius * Math.sin(angle / 180 * Math.PI), y: GAME_HEIGHT / 2 + radius * Math.cos(angle / 180 * Math.PI)};
	return pos;
}

var Tempest = function() {
	this.state = null;

	this.levelNumber = 1;
	this.layerManager = null;
	this.player = null;

	this.hudGroup = null;
	this.score = 0;
	this.scoreText = null;
	this.gameOverText = null;
	this.levelCompleteText = null;

	this.numParticles = 0;

	this.restartWait = 75;
	this.restartWaitCounter = 0;

	this.layerAnimation = false;
	this.layerAnimationTimer = 0;
};

Tempest.prototype.TempestState = {
	NONE: 0,
	GAME_INIT: 1,
	GAME_RUNNING: 2,
	GAME_PAUSED: 3,
	GAME_PLAYER_DIED: 5,
	GAME_LEVEL_COMPLETE: 6,
	GAME_OVER: 7
};

Tempest.prototype.preload = function() {
	// load all images
	for (var i = 0; i < imageSet.length; ++i) {
		Game.load.image(imageSet[i].key, imageSet[i].src);
	}

	// load fonts
	for (var i = 0; i < fontSet.length; ++i) {
		Game.load.bitmapFont(fontSet[i].key, fontSet[i].img, fontSet[i].data);
	}

	// load levels
	for (var i = 0; i < levelFileSet.length; ++i) {
		Game.load.json(levelFileSet[i].key, levelFileSet[i].src);
	}
};

Tempest.prototype.create = function() {
	var background = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background');
	background.anchor = { x: 0.5, y: 0.5 };
	background.scale = { x: 0.66667, y: 0.66667 };

	this.init();
};

Tempest.prototype.init = function() {
	this.state = this.TempestState.GAME_INIT;

	this.layerManager = new LayerManager();
	this.layerManager.init(4);

	this.player = new Player();
	this.player.init();

	this.enemyManager = new EnemyManager();
	this.enemyManager.init();

	this.initHUD();

    // Create emitters
	createGruntDestructionEmitter();
	createkamikazeDestructionEmitter();
	createPlayerShootEmitter();
	createBarricadeDestructionEmitter();
	createBarricadeHitEmitter();

	this.startGame();
};

Tempest.prototype.initHUD = function() {
	this.hudGroup = Game.add.group();

	this.score = 0;
	this.scoreText = Game.add.bitmapText(GAME_WIDTH * 0.025, GAME_HEIGHT * 0.05, 'carrier_command', 'Score:0', 24);
	this.scoreText.anchor.set(0);
	this.hudGroup.add(this.scoreText);
};

Tempest.prototype.createKeys = function() {
	this.leftKey = Game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = Game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.upKey = Game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = Game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.spaceKey = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

Tempest.prototype.reset = function() {
	this.removeKeys();
	this.player.reset();
	this.enemyManager.reset();

	if (this.gameOverText != null) {
		this.gameOverText.destroy();
		this.gameOverText = null;
	}

	if (this.levelCompleteText != null) {
		this.levelCompleteText.destroy();
		this.levelCompleteText = null;
	}
};

Tempest.prototype.removeKeys = function() {
	Game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
	Game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
	Game.input.keyboard.removeKey(Phaser.Keyboard.UP);
	Game.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
	Game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
	this.leftKey = this.rightKey = this.upKey = this.downKey = this.spaceKey = null;
};

Tempest.prototype.onPlayerDeath = function() {
	if (this.state != this.TempestState.GAME_PLAYER_DIED) {
		return;
	}

	// prevent the player from restarting immediately
	this.restartWaitCounter = this.restartWait;

	// stop any layer blink alerts that may be going on
	this.layerManager.resetAllAlertEvents();

	// check if the player has any lives left
	if (this.player.health <= 0) {
		this.endGame();
	}
};

Tempest.prototype.playAgain = function() {
	if (this.state != this.TempestState.GAME_PLAYER_DIED &&
	 this.state != this.TempestState.GAME_OVER &&
	 this.state != this.TempestState.GAME_LEVEL_COMPLETE) {
		return;
	}

	this.reset();

	if (this.state == this.TempestState.GAME_PLAYER_DIED) {
		// ask the layer manager to move all layers up
		var wasMoveSuccessful = this.layerManager.moveUp();

		// if the layers were moved successfully, add a new formation of enemies
		if (wasMoveSuccessful) {
			this.enemyManager.createFormation(this.layerManager.getEnemiesForBottomLayer());		
		}

		this.player.init();
		this.startGame();
	}
	else {
		if (this.state == this.TempestState.GAME_LEVEL_COMPLETE) {
			this.levelNumber = (this.levelNumber + 1) > 5 ? 1 : this.levelNumber + 1;
		}

		// clear all layers
		this.layerManager.reset();
		this.layerManager = null;

		// delete the objects since its a new game
		this.player = null;
		this.enemyManager = null;
		this.scoreText.destroy();
		this.scoreText = null;

		// call init so that all objects are created again
		this.init();
	}
};

Tempest.prototype.startGame = function() {
	this.createKeys();

	this.state = this.TempestState.GAME_RUNNING;

	this.enemyManager.createFormation(this.layerManager.getEnemiesForBottomLayer());
};

Tempest.prototype.endGame = function() {
	if (this.state == this.TempestState.GAME_OVER) {
		return;
	}
	this.state = this.TempestState.GAME_OVER;
	console.log("Game over...");

	this.gameOverText = Game.add.bitmapText(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.45, 'carrier_command', 'Game Over!', 34);
	this.gameOverText.anchor.set(0.5);
	this.hudGroup.add(this.gameOverText);
	Game.world.bringToTop(this.hudGroup);

	this.scoreText.anchor.set(0.5);
	this.scoreText.position = { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.55 };
};

Tempest.prototype.onLevelComplete = function() {
	if (this.state == this.TempestState.GAME_LEVEL_COMPLETE) {
		return;
	}
	this.state = this.TempestState.GAME_LEVEL_COMPLETE;
	console.log("Level complete...");

	this.levelCompleteText = Game.add.bitmapText(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.45, 'carrier_command', 'Level Complete!', 34);
	this.levelCompleteText.anchor.set(0.5);
	this.hudGroup.add(this.levelCompleteText);
	Game.world.bringToTop(this.hudGroup);

	this.scoreText.anchor.set(0.5);
	this.scoreText.position = { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.55 };
};

Tempest.prototype.update = function() {
	// Game.debug.text(Game.time.fps, GAME_WIDTH/2, GAME_HEIGHT/2, 0xffff22);

	if(this.layerAnimation)
	{
		this.layerAnimationTimer++;
		if(this.layerAnimationTimer > PROTECT_LAYER_ANIMATION_TIMER)
		{
			this.layerAnimationTimer = 0;
			this.layerAnimation = false;
		}
	}
	this.updateKeys();
	LAYER_IS_ANIMATION = this.layerManager.isAnimating;

	if (this.state == this.TempestState.GAME_RUNNING) {
		this.player.updateBullets();
		this.player.updateRotation();

		this.enemyManager.update();
		
		this.playerBulletCollide();

		// player cannot collide when blinking
		if (!this.player.isBlinking) {
			this.playerCollide();
		}

		// ask the layer manager if the player must be killed
		if (this.layerManager.mustKillPlayer) {
			this.layerManager.mustKillPlayer = false;

			this.player.die();
			this.state = this.TempestState.GAME_PLAYER_DIED;
			this.onPlayerDeath();
		}
     }
     else if (this.state == this.TempestState.GAME_PLAYER_DIED || this.state == this.TempestState.GAME_OVER) {
     	if (this.restartWaitCounter > 0) {
     		--this.restartWaitCounter;
     	}

     	// this.player.updateExplosion();
     }
     this.player.updateSprite();
};

Tempest.prototype.updateKeys = function() {
	if (this.leftKey.isDown) {
		this.handleKeyLeft();
	}
	

	if (this.rightKey.isDown) {
		this.handleKeyRight();
	}
	
	if (this.upKey.isDown) {
		this.handleKeyUp();
	}
	
	if (this.downKey.isDown) {
		this.handleKeyDown();
	}
	
	if (this.spaceKey.isDown) {
		this.handleKeySpace();
	}
};

Tempest.prototype.handleKeyLeft = function() {
	if (this.state != this.TempestState.GAME_RUNNING) {
		return;
	}

	this.player.beginRotation(true);
};

Tempest.prototype.handleKeyRight = function() {
	if (this.state != this.TempestState.GAME_RUNNING) {
		return;
	}

	this.player.beginRotation(false);
};

Tempest.prototype.handleKeyUp = function() {
	if (this.state != this.TempestState.GAME_RUNNING) {
		return;
	}
	
	if(!this.layerAnimation) {
		// check if the player can move forward
		if (this.player.numMoves <= 0) {
			return;
		}
		this.player.moveForward();

		// ask the layer manager to move all layers up
		var wasMoveSuccessful = this.layerManager.moveUp();

		// if the layers were moved successfully, add a new formation of enemies
		if (wasMoveSuccessful) {
			this.enemyManager.createFormation(this.layerManager.getEnemiesForBottomLayer());		
		}
		this.layerAnimation = wasMoveSuccessful; //true;

		// check if the level was completed
		if (this.layerManager.isLevelComplete) {
			this.onLevelComplete();
		}
	}
};

Tempest.prototype.handleKeyDown = function() {
};

Tempest.prototype.handleKeySpace = function() {
	switch (this.state) {
		case this.TempestState.GAME_RUNNING:
			if(!this.player.isRotate)
				this.player.createBullet();
			break;

		case this.TempestState.GAME_PLAYER_DIED:
		case this.TempestState.GAME_OVER:
		case this.TempestState.GAME_LEVEL_COMPLETE:
			if (this.restartWaitCounter <= 0) {
				this.playAgain();
			}
			break;
	}
};

// player's bullet collide with enemys' body or bullet
Tempest.prototype.playerBulletCollide = function(){
	for(var i = 0; i < this.player.bullets.length; i++)
	{
		var mark = false;
		for(var j = 0; j< this.enemyManager.bullets.length; j++)
		{
			if(this.player.bullets[i].angleIndex == this.enemyManager.bullets[j].angleIndex &&
				Math.abs(this.player.bullets[i].radius - this.enemyManager.bullets[j].radius) < BULLET_COLLISION_DISTANCE)
			{
				this.player.deleteBullet(i);
				this.enemyManager.deleteBullet(j);
				mark = true;
				break;
			}
		}
		if(!mark)
		{
			for(var j = 0; j < this.enemyManager.enemys.length; j++)
			{
				if(this.player.bullets[i].angleIndex == this.enemyManager.enemys[j].angleIndex &&
				Math.abs(this.player.bullets[i].radius - this.enemyManager.enemys[j].radius) < ENEMY_COLLISION_DISTANCE)
				{
					this.player.deleteBullet(i);
					this.enemyManager.hitEnemy(j);
					this.updateScore(150);
					break;
				}
			}
		}
	}
};

// player's body collide with enemys' body or bullet
Tempest.prototype.playerCollide = function(){
	var mark = false;
	for(var i = 0; i < this.enemyManager.bullets.length; i++)
	{	
		if(this.player.angleIndex == this.enemyManager.bullets[i].angleIndex &&
			Math.abs(this.player.radius - this.enemyManager.bullets[i].radius) < PLAYER_COLLISION_DISTANCE)
		{
			this.onPlayerCollision();
			this.enemyManager.deleteBullet(i);
			mark = true;
			break;
		}
	}

	if(!mark);
	{
		for(var i = 0; i < this.enemyManager.enemys.length; i++)
		{	
			if((this.player.angleIndex == this.enemyManager.enemys[i].angleIndex || (this.enemyManager.enemys[i].type == 0 && Math.abs(this.player.angleIndex - this.enemyManager.enemys[i].angleIndex) <= 1)) &&
				Math.abs(this.player.radius - this.enemyManager.enemys[i].radius) < PLAYER_COLLISION_DISTANCE)
			{
				this.onPlayerCollision();
				this.enemyManager.deleteEnemy(i);
				break;
			}
		}
	}
};

Tempest.prototype.onPlayerCollision = function() {
	this.player.takeDamage();

	// check if player died
	if (this.player.health == 0) {
		this.state = this.TempestState.GAME_PLAYER_DIED;
		this.onPlayerDeath();
	}
};

Tempest.prototype.updateScore = function(delta) {
	this.score += delta;
	this.scoreText.setText("Score:" + this.score);	
};
	
