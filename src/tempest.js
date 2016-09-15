// URL: http://localhost/projects/team-10-tempest

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var Tempest = function() {
	this.layers = null;
};

Tempest.prototype.preload = function() {
	
};

Tempest.prototype.create = function() {
	var layer = new Layer();
	layer.init(4);
	this.layers.push(layer);
};

Tempest.prototype.update = function() {
	 
};

Tempest.prototype.init = function() {
	console.log("In tempest.init");
	this.layers = new Array();
};