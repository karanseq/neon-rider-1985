var MAX_LAYER_SCALE = 0.725;

var LayerManager = function() {
	this.numLayersInLevel = 0;
	this.numVisibleLayers = 0;
	this.indexLayerFront = 0;
	this.indexLayerBack = 0;
	this.layerData = null;
	this.layers = null;
};

LayerManager.prototype.init = function(levelNumber) {
	this.numVisibleLayers = 5;
	this.indexLayerFront = 0;
	this.indexLayerBack = 0;
	this.loadLevel(levelNumber);
	this.createLayers();
};

LayerManager.prototype.reset = function() {
	// destroy all layers
	while (this.layers.length) {
		var layer = this.layers.pop();
		layer.destroy();
		layer = null;
	}
	this.numLayersInLevel = 0;
	this.layerData = null;
};

LayerManager.prototype.loadLevel = function(levelNumber) {
	this.layerData = Game.cache.getJSON('level_template');
	this.numLayersInLevel = this.layerData.layers.length;
};

LayerManager.prototype.createLayers = function() {
	this.layers = new Array();

	var numLayersCreated = 0;
	for (var i = 0; i < this.numLayersInLevel; ++i) {
		// create a new layer object
		var layer = new Layer(this.layerData.lanes);
		layer.init(0);

		// show only layers that are in the front
		if (++numLayersCreated <= this.numVisibleLayers) {
			layer.setScale({ x: layerScale[i], y: layerScale[i] });
			layer.setVisible(true);
			++this.indexLayerBack;
		}

		this.layers.push(layer);
	}
};

LayerManager.prototype.moveUp = function() {
	// bounds checking
	if (this.indexLayerFront == this.indexLayerBack) {
		return;
	}

	// scale up all the visible layers
	for (var i = this.indexLayerFront; i < this.indexLayerBack; ++i) {
		var layer = this.layers[i];
		layer.scaleUp(i - this.indexLayerFront - 1);
	}

	// fade out the outer-most layer
	this.layers[this.indexLayerFront++].die();

	// check if there are any more layers to add
	if (this.indexLayerBack < this.numLayersInLevel) {
		this.layers[this.indexLayerBack++].spawn(this.indexLayerBack - this.indexLayerFront - 1);
	}
};