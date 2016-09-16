var Bullet = function(createByPlayer, radius, angleIndex){
	this.createByPlayer = createByPlayer;
	this.angleIndex = angleIndex;

	if(this.createByPlayer)
		this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'playerbullet');
	else
		this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemybullet');

	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	
	this.radius = radius;
	this.angle = ANGLES[this.angleIndex];
	this.scale = {x: 1, y:1}
	this.position = caculatePosition(this.radius, this.angle);
}

Bullet.prototype.destroy = function(){
	this.sprite.destroy();
}

Bullet.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

