// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;
var RADIUS = 275;
var ANGLES = [-180, -135, -90, -45, 0, 45, 90, 135];
var MAX_ANGLE_INDEX = ANGLES.length;

var BULLET_COLLISION_DISTANCE = 10;
var ENEMY_COLLISION_DISTANCE = 30;
var PLAYER_COLLISION_DISTANCE = 20;

var BULLET_SCALE = {x:0.1, y:0.1};
var PLAYER_SCALE = {x:0.3, y:0.3};
var PLAYER_EXPLOSION_SCALE = {x: 0.1, y: 0.1};

var WAVE_INTERVAL = 100;
var ENEMY_INTERVAL = 30;
var WAVE_COUNT = 4;

var caculatePosition = function(radius, angle)
{
	var pos = {x: GAME_WIDTH / 2 + radius * Math.sin(angle / 180 * Math.PI), y: GAME_HEIGHT / 2 + radius * Math.cos(angle / 180 * Math.PI)};
	return pos;
}

var Tempest = function() {
	this.state = null;

	this.layerManager = null;
	this.player = null;
	this.enemyList = null;

	this.leftKey = null;
	this.rightKey = null;
	this.upKey = null;
	this.downKey = null;
	this.spaceKey = null;
	this.acceptKeys = false;

	this.generateTimer = 0;
	this.generateCount = 0;
	this.isGenerate = false;

	this.hudGroup = null;
	this.score = 0;
	this.scoreText = null;
	this.lifeSprites = null;
	this.gameOverText = null;
};

Tempest.prototype.TempestState = {
	NONE: 0,
	GAME_INIT: 1,
	GAME_RUNNING: 2,
	GAME_PAUSED: 3,
	GAME_PLAYER_DIED: 5,
	GAME_OVER: 6
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
	this.init();
	this.createKeys();
};

Tempest.prototype.init = function() {
	this.state = this.TempestState.GAME_INIT;

	this.layerManager = new LayerManager();
	this.layerManager.init();

	this.player = new Player(this.angles);
	this.player.init();

	this.enemyManager = new EnemyManager(this.angles);
	this.enemyManager.init();

	this.initHUD();

	this.startGame();
};

Tempest.prototype.initHUD = function() {
	this.hudGroup = Game.add.group();

	this.score = 0;
	this.scoreText = Game.add.bitmapText(GAME_WIDTH * 0.2, GAME_HEIGHT * 0.05, 'carrier_command', 'Score: 0', 24);
	this.scoreText.anchor.set(0.5);
	this.hudGroup.add(this.scoreText);

	this.lifeSprites = new Array();
	for (var i = 0; i < this.player.lives; ++i) {
		var lifeSprite = this.hudGroup.create(GAME_WIDTH - 50 - (i * 50), GAME_HEIGHT * 0.05, 'player');
		lifeSprite.anchor = { x: 0.5, y: 0.5 };
		lifeSprite.scale = { x: 0.15, y: 0.15 };
		this.lifeSprites.push(lifeSprite);
	}
};

Tempest.prototype.reset = function() {
	this.player.reset();
	this.enemyManager.reset();

	if (this.gameOverText != null) {
		this.gameOverText.destroy();
		this.gameOverText = null;
	}
};

Tempest.prototype.onPlayerDeath = function() {
	if (this.state != this.TempestState.GAME_PLAYER_DIED) {
		return;
	}
	console.log("Player died...lives left:" + this.player.lives);

	// remove life sprite
	var lifeSprite = this.lifeSprites.pop();
	lifeSprite.destroy();
	lifeSprite = null;

	// check if the player has any lives left
	if (this.player.lives <= 0) {
		this.endGame();
	}
};

Tempest.prototype.playAgain = function() {
	if (this.state != this.TempestState.GAME_PLAYER_DIED && this.state != this.TempestState.GAME_OVER) {
		return;
	}

	this.reset();

	if (this.state == this.TempestState.GAME_PLAYER_DIED) {
		this.player.init();
		this.startGame();
	}
	else if (this.state == this.TempestState.GAME_OVER) {
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
	this.state = this.TempestState.GAME_RUNNING;
	this.acceptKeys = true;
	this.enemyManager.startFormations(this.layerManager.getEnemiesForBottomLayer());
};

Tempest.prototype.endGame = function() {
	this.state = this.TempestState.GAME_OVER;
	console.log("Game over...");

	// TODO: display game over text and player score here...
	this.gameOverText = Game.add.bitmapText(GAME_WIDTH * 0.5, GAME_WIDTH * 0.3, 'carrier_command', 'Game Over!', 34);
	this.gameOverText.anchor.set(0.5);
	this.hudGroup.add(this.gameOverText);
	Game.world.bringToTop(this.hudGroup);

	this.scoreText.position = { x: GAME_WIDTH * 0.5, y: GAME_WIDTH * 0.5 };
}

Tempest.prototype.createKeys = function() {
	this.leftKey = Game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = Game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.upKey = Game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = Game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.spaceKey = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	Game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);
};

Tempest.prototype.update = function() {
	this.updateCursorKeys();

	if (this.state == this.TempestState.GAME_RUNNING) {
		this.player.updateBullets();
		this.enemyManager.update();

		this.playerBulletCollide();
		this.playerCollide();
     }
     else if (this.state == this.TempestState.GAME_PLAYER_DIED || this.state == this.TempestState.GAME_OVER) {
     	this.player.updateExplosion();
     }
     this.player.updateSprite();
};

Tempest.prototype.updateCursorKeys = function() {
	// this check prevents key event from being pushed repeatedly
	if (this.acceptKeys) {
		if (this.leftKey.isDown) {
			this.handleKeyLeft();
		}
		else if (this.rightKey.isDown) {
			this.handleKeyRight();
		}
		else if (this.upKey.isDown) {
			this.handleKeyUp();
		}
		else if (this.downKey.isDown) {
			this.handleKeyDown();
		}
		else if (this.spaceKey.isDown) {
			this.handleKeySpace();
		}
	}
	// handle collision between player's bullet with enemy's bullet or enemy's body
	// reset flag when all keys are released
	if (this.leftKey.isUp && 
		this.rightKey.isUp && 
		this.upKey.isUp && 
		this.downKey.isUp &&
		this.spaceKey.isUp) {
		this.acceptKeys = true;
	}
};

Tempest.prototype.handleKeyLeft = function() {
	this.acceptKeys = false;
	
	if (this.state != this.TempestState.GAME_RUNNING) {
		return;
	}

	this.player.setAngleIndex(this.player.getAngleIndex() - 1);
};

Tempest.prototype.handleKeyRight = function() {
	this.acceptKeys = false;
	
	if (this.state != this.TempestState.GAME_RUNNING) {
		return;
	}

	this.player.setAngleIndex(this.player.getAngleIndex() + 1);
};

Tempest.prototype.handleKeyUp = function() {
	this.acceptKeys = false;
	this.layerManager.moveUp();
	this.enemyManager.createFormation(this.layerManager.getEnemiesForBottomLayer());
};

Tempest.prototype.handleKeyDown = function() {
	this.acceptKeys = false;
};

Tempest.prototype.handleKeySpace = function() {
	this.acceptKeys = false;

	switch (this.state) {
		case this.TempestState.GAME_RUNNING:
		this.player.createBullet();
		break;

		case this.TempestState.GAME_PLAYER_DIED:
		case this.TempestState.GAME_OVER:
		this.playAgain();
		break;
	}
};

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
					this.enemyManager.deleteEnemy(j);
					this.updateScore(150);
					break;
				}
			}
		}
	}
};

Tempest.prototype.playerCollide = function(){
	var mark = false;
	for(var i = 0; i < this.enemyManager.bullets.length; i++)
	{	
		if(this.player.angleIndex == this.enemyManager.bullets[i].angleIndex &&
			Math.abs(this.player.radius - this.enemyManager.bullets[i].radius) < PLAYER_COLLISION_DISTANCE)
		{
			this.player.die();
			this.enemyManager.deleteBullet(i);
			mark = true;
			this.state = this.TempestState.GAME_PLAYER_DIED;
			this.onPlayerDeath();
			break;
		}
	}

	if(!mark);
	{
		for(var i = 0; i < this.enemyManager.enemys.length; i++)
		{	
			if(this.player.angleIndex == this.enemyManager.enemys[i].angleIndex &&
				Math.abs(this.player.radius - this.enemyManager.enemys[i].radius) < PLAYER_COLLISION_DISTANCE)
			{
				this.player.die();
				this.enemyManager.deleteEnemy(i);
				this.state = this.TempestState.GAME_PLAYER_DIED;
				this.onPlayerDeath();
				break;
			}
		}
	}
};

Tempest.prototype.updateScore = function(delta) {
	this.score += delta;
	this.scoreText.setText("Score: " + this.score);	
};
	
