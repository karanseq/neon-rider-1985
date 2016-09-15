var Bullet = function(createByPlayer, angles, positionIndex){
	this.createByPlayer = createByPlayer;

	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bullet');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	
	this.positionIndex = positionIndex;
	this.angles = angles;
	this.setAngle(this.angles[this.positionIndex]);
	this.setScale( {x:2.0, y:2.0} );
}

Bullet.prototype.setAngle = function(newAngle)
{
	this.sprite.angle = newAngle;
}

Bullet.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Bullet.prototype.getScale = function() {
	return this.sprite.scale;
};

