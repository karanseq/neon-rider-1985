var LAYER_SCALE_DURATION = 500;

var Layer = function() {
	this.sprite = null;
	this.lanes = 0;
};

Layer.prototype.init = function(numSides) {
	this.numSides = numSides;
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'layer');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = false;
};

Layer.prototype.destroy = function() {
	this.sprite.destroy();
	this.sprite = null;
};

Layer.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Layer.prototype.getScale = function() {
	return this.sprite.scale;
};

Layer.prototype.spawn = function(layerIndex) {	
	this.sprite.scale = { x: layerScale[layerIndex + 1], y: layerScale[layerIndex + 1] };
	this.sprite.visible = true;
	this.sprite.alpha = 0;

	var newScale = { x: layerScale[layerIndex], y: layerScale[layerIndex] };
	Game.add.tween(this.sprite.scale).to(newScale, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
	Game.add.tween(this.sprite).to( { alpha: 1 }, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
};

Layer.prototype.scaleUp = function(layerIndex) {
	var newScale = { x: layerScale[layerIndex], y: layerScale[layerIndex] };
	Game.add.tween(this.sprite.scale).to(newScale, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
};

Layer.prototype.die = function() {
	Game.add.tween(this.sprite).to( { alpha: 0 }, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
};

Layer.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Layer.prototype.isVisible = function() {
	return this.sprite.visible;
};
