var Layer = function() {
	this.sprite = null;

	this.blinkTweens = null;
	this.doBlinkEvent = null;
	this.finishBlinkEvent = null;

	this.blinkPhase = 0;
	this.color = null;

	this.blinkSound = null;
};

Layer.prototype.init = function(numSides, color) {
	this.numSides = numSides;
	this.color = color;

	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'layer');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = false;
	this.setColorOriginal();

	this.blinkSound = Game.add.audio('ring_blink');
};

Layer.prototype.destroy = function() {
	this.stopBlinking();
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
	Game.add.tween(this.sprite.scale).to(newScale, CONFIG.LAYER_SCALE_DURATION, Phaser.Easing.Linear.None, true);
	this.fadeTween(this.sprite, 1, CONFIG.LAYER_SCALE_DURATION);
};

Layer.prototype.scaleUp = function(layerIndex, duration) {
	var newScale = { x: layerScale[layerIndex], y: layerScale[layerIndex] };
	Game.add.tween(this.sprite.scale).to(newScale, duration, Phaser.Easing.Linear.None, true);
};

Layer.prototype.die = function(duration) {
	Game.add.tween(this.sprite.scale).to({x: 0.9, y: 0.9}, duration, Phaser.Easing.Linear.None, true);
	this.fadeTween(this.sprite, 0, duration);
};

Layer.prototype.startBlinking = function() {
	// don't blink if we're already blinking
	if (this.blinkTweens != null) {
		return;
	}
	this.blinkTweens = new Array();

	this.blinkSound.play();

	this.setColorRed();

	var duration = 0;
	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.1 }, 1000, Phaser.Easing.Linear.None, true, duration, 0, true));
	duration += 2000;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.1 }, 500, Phaser.Easing.Linear.None, true, duration, 1, true));	
	duration += 2000;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.1 }, 250, Phaser.Easing.Linear.None, true, duration, 2, true));
	duration += 1500;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.1 }, 125, Phaser.Easing.Linear.None, true, duration, 7, true));
	duration += 2000;

	this.blinkTweens.push(Game.add.tween(this.sprite).to({ alpha: 0.1 }, 50, Phaser.Easing.Linear.None, true, duration, 9, true));
	duration += 1000;

	// return total blink duration to layer manager
	return duration;
};

Layer.prototype.stopBlinking = function() {
	// check if we're blinking
	if (this.blinkTweens == null) {
		return;
	}

	this.blinkSound.stop();

	this.setColorOriginal();

	// stop and clear all tweens
	while (this.blinkTweens.length > 0) {
		var tween = this.blinkTweens.pop();
		tween.stop();
	}
	
	this.blinkTweens = null;
};

Layer.prototype.flashRedOnce = function() {
	this.setColorRed();
	Game.time.events.add(250, this.setColorOriginal, this);
};

Layer.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Layer.prototype.isVisible = function() {
	return this.sprite.visible;
};

Layer.prototype.resetAlpha = function() {
	this.sprite.alpha = 1;
};

Layer.prototype.fadeTween = function(sprite, toAlpha, duration) {
	return Game.add.tween(sprite).to({ alpha: toAlpha }, duration, Phaser.Easing.Linear.None, true);
};

Layer.prototype.setColorOriginal = function() {
	this.sprite.tint = this.color;
	this.sprite.alpha = 1.0;
};

Layer.prototype.setColorRed = function() {
	this.sprite.tint = '0xcc0000';
	this.sprite.alpha = 0.5;
};