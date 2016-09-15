// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var Tempest = function() {
	this.state = null;

	this.numLayersInLevel = 0;
	this.numVisibleLayers = 0;
	this.layers = null;

	this.player = null;

	this.leftKey = null;
	this.rightKey = null;
	this.upKey = null;
	this.downKey = null;
	this.spaceKey = null;
	this.acceptKeys = false;
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
	this.createLevel();
	this.createKeys();

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
};

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

Tempest.prototype.createKeys = function() {
	this.leftKey = Game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	this.rightKey = Game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	this.upKey = Game.input.keyboard.addKey(Phaser.Keyboard.UP);
	this.downKey = Game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	this.spaceKey = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	Game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR ]);
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
	console.log("Left pressed...");
};

Tempest.prototype.handleKeyRight = function() {
	this.acceptKeys = false;
	console.log("Right pressed...");
};

Tempest.prototype.handleKeyUp = function() {
	this.acceptKeys = false;
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