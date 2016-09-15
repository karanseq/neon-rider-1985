var MAX_LAYER_SCALE = 0.5;

var Layer = function() {
	this.sprite = null;
	this.numSides = 0;

	// this.graphics = null;
};

Layer.prototype.init = function(numSides) {
	this.numSides = numSides;
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'layer');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = false;
};

Layer.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Layer.prototype.getScale = function() {
	return this.sprite.scale;
};

Layer.prototype.scaleUp = function(scaleTo) {
	var newScale = { x: this.sprite.scale.x + scaleTo, y: this.sprite.scale.y + scaleTo };
	Game.add.tween(this.sprite.scale).to(newScale, 1000, Phaser.Easing.Linear.None, true);	
};

Layer.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Layer.prototype.isVisible = function() {
	return this.sprite.visible;
};
