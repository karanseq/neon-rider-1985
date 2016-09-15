var Layer = function() {
	this.graphics = null;
	this.numSides = 0;
};

Layer.prototype.init = function(numSides) {
	this.numSides = numSides;

	var poly = new Phaser.Polygon();
	poly.setTo(getRegularPolygonVertices(this.numSides, 100, 0));

	this.graphics = Game.add.graphics(GAME_WIDTH / 2, GAME_HEIGHT / 2);
	this.graphics.lineStyle(5, 0x4cf774, 1);
	this.graphics.drawPolygon(poly.points);
};