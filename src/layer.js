var LAYER_SCALE_DURATION = 500;

var Layer = function() {
	this.sprite = null;
	this.lanes = 0;
	this.blinkTweens = null;
};

Layer.prototype.init = function(numSides, color) {
	this.numSides = numSides;
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'layer');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = false;
	this.sprite.tint = color;
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
	this.fadeTween(this.sprite, 1, LAYER_SCALE_DURATION);
};

Layer.prototype.scaleUp = function(layerIndex) {
	var newScale = { x: layerScale[layerIndex], y: layerScale[layerIndex] };
	Game.add.tween(this.sprite.scale).to(newScale, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
};

Layer.prototype.die = function() {
	Game.add.tween(this.sprite.scale).to({x: 0.9, y: 0.9}, LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
	this.fadeTween(this.sprite, 0, LAYER_SCALE_DURATION);
};

Layer.prototype.startBlinking = function(duration) {
	// don't blink if we're already blinking
	if (this.blinkTweens != null) {
		return;
	}
	this.blinkTweens = new Array();

	var duration = 0;
	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.25 }, 1000, Phaser.Easing.Linear.None, true, duration, 0, true));
	duration += 2000;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.25 }, 500, Phaser.Easing.Linear.None, true, duration, 1, true));
	duration += 2000;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.25 }, 250, Phaser.Easing.Linear.None, true, duration, 2, true));
	duration += 1500;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.25 }, 125, Phaser.Easing.Linear.None, true, duration, 3, true));

	// return total blink duration to layer manager
	return duration;
};

Layer.prototype.stopBlinking = function() {
	// check if we're blinking
	if (this.blinkTweens == null) {
		return;
	}

	// stop and clear all tweens
	while (this.blinkTweens.length > 0) {
		var tween = this.blinkTweens.pop();
		tween.stop();
	}
	this.blinkTweens = null;
};

Layer.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Layer.prototype.isVisible = function() {
	return this.sprite.visible;
};

Layer.prototype.fadeTween = function(sprite, toAlpha, duration) {
	return Game.add.tween(sprite).to({ alpha: toAlpha }, duration, Phaser.Easing.Linear.None, true);
};