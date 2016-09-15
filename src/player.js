var Player = function(angles) {
	this.sprite = null;
	
	this.angles = angles;
	this.maxPositionIndex = this.angles.length;
	this.positionIndex = Math.round(this.maxPositionIndex / 2 - 0.25);
	// this.graphics = null;
	this.bullets = null;
};

Player.prototype.init = function() {
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.setScale( {x:2.0, y:2.0} );
	this.setAngle(this.angles[this.positionIndex]);

	this.bullets = new Array()
};

Player.prototype.createBullet = function(){
	var bullet = new Bullet(true, this.angles,this.positionIndex);
	this.bullets.push(bullet);
}

Player.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{
		var scale = this.bullets[i].getScale();
		if(scale.x < 0.1)
		{
			var temp = this.bullets[this.bullets.length - 1];
			this.bullets[this.bullets.length - 1] = this.bullets[i];
			this.bullets[i] = temp;
			this.bullets.pop();
		}
		else
			this.bullets[i].setScale({ x:scale.x - 0.1, y:scale.y - 0.1});
	}
}

Player.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Player.prototype.getScale = function() {
	return this.sprite.scale;
};

Player.prototype.setAngle = function(newAngle) {
	this.sprite.angle = newAngle;
}

Player.prototype.scaleUp = function(scaleTo) {
	// var newScale = { x: this.sprite.scale.x + scaleTo, y: this.sprite.scale.y + scaleTo };
	// Game.add.tween(this.sprite.scale).to(newScale, 1000, Phaser.Easing.Linear.None, true);	
};

Player.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Player.prototype.isVisible = function() {
	return this.sprite.visible;
};

Player.prototype.setPositionIndex = function(index)
{
	if(index < 0) index += this.maxPositionIndex;
	else index = (index % this.maxPositionIndex);
	this.positionIndex = index;
	this.setAngle(this.angles[this.positionIndex]);
}

Player.prototype.getPositionIndex = function()
{
	return this.positionIndex;
}