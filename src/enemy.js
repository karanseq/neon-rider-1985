var Enemy = function(angles, positionIndex) {
	this.sprite = null;
	
	this.angles = angles;
	this.maxPositionIndex = this.angles.length;
	this.positionIndex = positionIndex;

	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.setScale( {x:0.1, y:0.1} );
	this.setAngle(this.angles[this.positionIndex]);

	if(Math.random() < 0.5)
		this.flipLeft = true;
	else
		this.flipLeft = false;
	
	this.flipInterval = 40;

	this.flipTimer = Math.round(Math.random() * this.flipInterval);
};


Enemy.prototype.createBullet = function(){
	var bullet = new Bullet(false, this.angles, this.positionIndex);
	bullet.setScale({x: this.sprite.scale.x + 0.8, y: this.sprite.scale.y + 0.8});
	return bullet;
}

Enemy.prototype.updateFlip = function(){
	this.flipTimer++;
	if(this.flipTimer > this.flipInterval)
	{
		if(this.flipLeft)
		{
			this.positionIndex++;
			if(this.positionIndex >= this.maxPositionIndex)
				this.positionIndex -= this.maxPositionIndex;
		}
		else
		{
			this.positionIndex--;
			if(this.positionIndex < 0)
				this.positionIndex += this.maxPositionIndex;
		}
		this.setAngle(this.angles[this.positionIndex]);
		this.flipTimer -= this.flipInterval; 
	}
}

Enemy.prototype.destroy = function(){
	this.sprite.destroy();
}

Enemy.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Enemy.prototype.getScale = function() {
	return this.sprite.scale;
};

Enemy.prototype.setAngle = function(newAngle) {
	this.sprite.angle = newAngle;
}

Enemy.prototype.scaleUp = function(scaleTo) {
	// var newScale = { x: this.sprite.scale.x + scaleTo, y: this.sprite.scale.y + scaleTo };
	// Game.add.tween(this.sprite.scale).to(newScale, 1000, Phaser.Easing.Linear.None, true);	
};

Enemy.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Enemy.prototype.isVisible = function() {
	return this.sprite.visible;
};