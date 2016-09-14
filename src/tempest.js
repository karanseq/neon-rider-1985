var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var Tempest = function() {
	this.game = null;
};

Tempest.prototype.preload = function() {
	
};

Tempest.prototype.create = function() {
	
};

Tempest.prototype.update = function() {
	
};

Tempest.prototype.init = function() {
	console.log("In tempest.init");
	this.game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update });
};