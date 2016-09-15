// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var Tempest = function() {
	this.state = null;

	this.numLayersInLevel = 0;
	this.numVisibleLayers = 0;

	this.layers = null;
	this.player = null;
	this.enemyList = null;

	this.cursorKeys = null;
	this.acceptKeys = false;
	this.angles = [-180, -135, -90, -45, 0, 45, 90, 135];
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

	this.createLevel();

	this.cursorKeys = Game.input.keyboard.createCursorKeys();

	this.startGame();
};

Tempest.prototype.update = function() {
	 if (this.state != this.TempestState.GAME_RUNNING) {
	 	return;
	 }

	 this.updateCursorKeys();
};

Tempest.prototype.init = function() {
	this.state = this.TempestState.GAME_INIT;
	this.layers = new Array();
	
}

Tempest.prototype.startGame = function() {
	this.state = this.TempestState.GAME_RUNNING;
	this.acceptKeys = true;
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

Tempest.prototype.updateCursorKeys = function() {
	if (this.cursorKeys == null) {
		return;
	}

	// this check prevents key event from being pushed repeatedly
	if (this.acceptKeys) {
		if (this.cursorKeys.left.isDown) {
			this.acceptKeys = false;
			console.log("Left pressed...");
			this.player.setPositionIndex(this.player.getPositionIndex() + 1);
		}
		else if (this.cursorKeys.right.isDown) {
			this.acceptKeys = false;
			console.log("Right pressed...");
			this.player.setPositionIndex(this.player.getPositionIndex() - 1);
		}
		else if (this.cursorKeys.up.isDown) {
			this.acceptKeys = false;
			console.log("Up pressed...");
			this.player.createBullet();
		}
		else if (this.cursorKeys.down.isDown) {
			this.acceptKeys = false;
			console.log("Down pressed...");

			this.enemyManager.createEnemy(Math.round(Math.random() * 7.49));
		}
	}

	this.player.updateBullets();
	this.enemyManager.updateEnemy();
	this.enemyManager.updateBullets();

	// reset flag when all keys are released
	if (this.cursorKeys.left.isUp && 
		this.cursorKeys.right.isUp && 
		this.cursorKeys.up.isUp && 
		this.cursorKeys.down.isUp) {
		this.acceptKeys = true;
	}
};