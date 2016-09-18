// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
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

	this.numLayersInLevel = 0;
	this.numVisibleLayers = 0;

	this.layers = null;
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
};

Tempest.prototype.TempestState = {
	NONE: 0,
	GAME_INIT: 1,
	GAME_RUNNING: 2,
	GAME_PAUSED: 3,
	GAME_OVER: 4
};

Tempest.prototype.preload = function() {
	// load all images
	for (var i = 0; i < imageSet.length; ++i) {
		Game.load.image(imageSet[i].key, imageSet[i].src);
	}
};

Tempest.prototype.create = function() {

	this.player = new Player(this.angles);
	this.player.init();
	this.enemyManager = new EnemyManager(this.angles);
	this.enemyManager.init();

	//this.createLevel();
	this.backgroundSprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'circle');
	this.backgroundSprite.anchor = { x: 0.5, y: 0.5 };
	this.backgroundSprite.scale = {x: 0.5, y: 0.5};
	this.createKeys();
	this.startGame();
};

Tempest.prototype.createLevel = function() {
	this.numLayersInLevel = 20;
	this.numVisibleLayers = 5;

	this.createLayers();
};

Tempest.prototype.createLayers = function() {
	var numLayersCreated = 0;
	for (var i = 0; i < this.numLayersInLevel; ++i) {
		var layer = new Layer();
		layer.init(0);

		if (++numLayersCreated <= this.numVisibleLayers) {
			layer.setScale({ x: MAX_LAYER_SCALE - i * 0.1, y: MAX_LAYER_SCALE - i * 0.1 });			
			layer.setVisible(true);
		}

		this.layers.push(layer);
	}
};

Tempest.prototype.createKeys = function() {
	this.leftKey = Game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = Game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.upKey = Game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = Game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.spaceKey = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	Game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR ]);
};

Tempest.prototype.init = function() {
	this.state = this.TempestState.GAME_INIT;
	this.layers = new Array();
}

Tempest.prototype.startGame = function() {
	this.state = this.TempestState.GAME_RUNNING;
	this.acceptKeys = true;
};

Tempest.prototype.update = function() {
	 if (this.state == this.TempestState.GAME_RUNNING) {
	 	this.updateCursorKeys();
		this.player.updateBullets();
		this.enemyManager.updateEnemy();
		this.enemyManager.updateBullets();

		this.playerBulletCollide();
		this.playerCollide();
		this.generateEnemy();
     }
     else if(this.state == this.TempestState.GAME_OVER)
     {
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
	this.player.setAngleIndex(this.player.getAngleIndex() - 1);
	console.log("Left pressed...");
};

Tempest.prototype.handleKeyRight = function() {
	this.acceptKeys = false;
	this.player.setAngleIndex(this.player.getAngleIndex() + 1);
	console.log("Right pressed...");
};

Tempest.prototype.handleKeyUp = function() {
	this.acceptKeys = false;
	this.player.createBullet();
	console.log("Up pressed...");
};

Tempest.prototype.handleKeyDown = function() {
	this.acceptKeys = false;
	console.log("Down pressed...");
};

Tempest.prototype.handleKeySpace = function() {
	this.acceptKeys = false;
	console.log("Space pressed...");
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
			this.player.destroy();
			this.enemyManager.deleteBullet(i);
			mark = true;
			this.state = this.TempestState.GAME_OVER;
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
				this.player.destroy();
				this.enemyManager.deleteEnemy(i);
				this.state = this.TempestState.GAME_OVER;
				break;
			}
		}
	}
};

Tempest.prototype.generateEnemy = function(){
	this.generateTimer++;
	if(!this.isGenerate)
	{
		if(this.generateTimer > WAVE_INTERVAL)
		{
			this.isGenerate = true;
			this.generateTimer = 0;
			this.generateCount = 0;
		}
	}
	else
	{
		if(this.generateTimer > ENEMY_INTERVAL)
		{
			this.enemyManager.createEnemy(Math.round(Math.random() * 7.49));
			this.generateCount++;
			this.generateTimer = 0;
			if(this.generateCount >= 4)
			{
				this.isGenerate = false;
			}
		}
	}
};

	
