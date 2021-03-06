var LayerManager = function() {
	this.numLayersInLevel = 0;
	this.numVisibleLayers = 0;

	this.indexLayerFront = 0;
	this.indexLayerBack = 0;

	this.layerData = null;
	this.layers = null;

	this.isAnimating = false;
	this.mustKillPlayer = false;
	this.haveAllLayersSpawned = false;
	this.startShowingAlertEvent = null;
	this.finishShowingAlertEvent = null;
};

LayerManager.prototype.init = function(levelNumber) {
	this.numVisibleLayers = 6;

	this.indexLayerFront = 0;
	this.indexLayerBack = 0;
	
	this.loadLevel(levelNumber);
	this.createLayers();
	
	this.isAnimating = false;
	this.mustKillPlayer = false;
	this.haveAllLayersSpawned = false;

	this.startShowingAlertEvent = Game.time.events.add(this.layerData.waitBeforeOuterLayerBreak, this.startShowingAlert, this);
};

LayerManager.prototype.reset = function() {
	this.resetAllAlertEvents();

	// destroy all layers
	while (this.layers.length) {
		var layer = this.layers.pop();
		layer.destroy();
		layer = null;
	}

	// reset data
	this.numLayersInLevel = 0;
	this.layerData = null;
};

LayerManager.prototype.resetAllAlertEvents = function() {
	// if an alert has been scheduled to start, remove it
	if (this.startShowingAlertEvent != null) {
		Game.time.events.remove(this.startShowingAlertEvent);
		this.startShowingAlertEvent = null;
	}

	// if an alert has been scheduled to finish, remove it
	if (this.finishShowingAlertEvent != null) {
		Game.time.events.remove(this.finishShowingAlertEvent);
		this.finishShowingAlertEvent = null;
	}

	// if an alert is being shown, stop it
	this.stopShowingAlert();

	// reset the alpha on the outer most layer
	if (this.indexLayerFront < this.indexLayerBack) {
		this.layers[this.indexLayerFront].resetAlpha();
	}
};

LayerManager.prototype.loadLevel = function(levelNumber) {
	this.layerData = Game.cache.getJSON('level_' + levelNumber);
	this.numLayersInLevel = this.layerData.layers.length;
	console.log(this.layerData.color);
	setParticleTint(ringEmitter, this.layerData.color, true);
};

LayerManager.prototype.createLayers = function() {
	this.layers = new Array();

	var numLayersCreated = 0;
	for (var i = 0; i < this.numLayersInLevel; ++i) {
		// create a new layer object
		var layer = new Layer();
		layer.init(this.layerData.lanes, this.layerData.color);

		// show only layers that are in the front
		if (++numLayersCreated <= this.numVisibleLayers) {
			layer.setScale({ x: layerScale[i], y: layerScale[i] });
			layer.setVisible(true);
			++this.indexLayerBack;
		}

		this.layers.push(layer);
	}

	console.log("Created " + this.layers.length + " layers...");
};

LayerManager.prototype.moveUp = function() {
	// only animate if we're not already animating
	if (this.isAnimating) {
		return false;
	}

	// bounds checking
	if (this.indexLayerFront == this.indexLayerBack) {
		return false;
	}

	this.isAnimating = true;

	this.resetAllAlertEvents();

	// scale up all the visible layers
	for (var i = this.indexLayerFront; i < this.indexLayerBack; ++i) {
		var layer = this.layers[i];
		layer.scaleUp(i - this.indexLayerFront - 1, CONFIG.LAYER_SCALE_DURATION);
	}

	// fade out the outer-most layer
	this.layers[this.indexLayerFront++].die(CONFIG.LAYER_SCALE_DURATION);

	// check if there are any more layers to add
	if (this.indexLayerBack < this.numLayersInLevel) {
		this.layers[this.indexLayerBack++].spawn(this.indexLayerBack - this.indexLayerFront - 1);
	}

	// check if all layers have finished spawning
	if (this.indexLayerBack >= this.numLayersInLevel) {
		this.haveAllLayersSpawned = true;
	}

	Game.time.events.add(CONFIG.LAYER_SCALE_DURATION, this.onAnimationFinished, this);
	this.startShowingAlertEvent = Game.time.events.add(this.layerData.waitBeforeOuterLayerBreak, this.startShowingAlert, this);

	console.log("LayerManager moveUp says front=" + this.indexLayerFront + " & back=" + this.indexLayerBack);
	return true;
};

LayerManager.prototype.moveToEnd = function() {
	this.resetAllAlertEvents();

	// scale up all the visible layers
	for (var i = this.indexLayerFront; i < this.indexLayerBack; ++i) {
		this.layers[i].die(CONFIG.LAYER_SCALE_DURATION * (i+1) * 0.25);
	}
};

LayerManager.prototype.startShowingAlert = function() {
	// check if there are any layers to blink
	if (this.indexLayerFront >= this.numLayersInLevel) {
		return;
	}

	// start blinking the outermost layer
	var blinkDuration = this.layers[this.indexLayerFront].startBlinking();

	// schedule an event when the blinking has finished
	this.finishShowingAlertEvent = Game.time.events.add(blinkDuration, this.finishedShowingAlert, this);
};

LayerManager.prototype.stopShowingAlert = function() {
	// check if there are any layers to blink
	if (this.indexLayerFront >= this.numLayersInLevel) {
		return;
	}

	// stop blinking the outermost layer
	this.layers[this.indexLayerFront].stopBlinking();
};

LayerManager.prototype.finishedShowingAlert = function() {
	console.log("Finished showing alert...kill layer and player!");
	this.finishShowingAlertEvent = null;

	// hide the last ring
	this.layers[this.indexLayerFront].setVisible(false);

	this.mustKillPlayer = true;
};

LayerManager.prototype.flashAllLayers = function() {
	for (var i = this.indexLayerFront; i < this.indexLayerBack; ++i) {
		this.layers[i].flashRedOnce();
	}
};

LayerManager.prototype.getEnemiesForBottomLayer = function() {
	if (this.indexLayerBack < this.numLayersInLevel) {
		return this.layerData.layers[this.indexLayerBack].enemies;
	}
	else {
		return null;
	}
};

LayerManager.prototype.onAnimationFinished = function() {
	this.isAnimating = false;
};