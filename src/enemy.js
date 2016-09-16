var ENEMY_SPAWN_RADIUS = 10;
var ENEMY_SPAWN_SCALE = { x:0.1, y:0.1 };



var Enemy = function(angleIndex) {
	this.angleIndex = angleIndex;
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;

	this.radius = ENEMY_SPAWN_RADIUS;
	this.angle = ANGLES[this.angleIndex]
	this.scale = ENEMY_SPAWN_SCALE;
	this.position = caculatePosition(this.radius, this.angle);

	if(Math.random() < 0.5)
		this.rotateLeft = true;
	else
		this.rotateLeft = false;
	this.rotateInterval = 50;
	this.rotateTimer = Math.round(Math.random() * this.rotateInterval);

	this.isRotate = false;
	this.rotateLasting = 5;

	this.previousAngle =0;
};


Enemy.prototype.createBullet = function(){
	var bullet = new Bullet(false, this.radius, this.angleIndex);
	bullet.scale = this.scale;
	return bullet;
}

Enemy.prototype.updateRotation = function(){
	this.rotateTimer++;
	if(!this.isRotate)
	{
		if(this.rotateTimer >= this.rotateInterval)
		{	
			this.previousAngle = ANGLES[this.angleIndex];
			if(this.rotateLeft)
			{
				this.angleIndex++;
				if(this.angleIndex >= MAX_ANGLE_INDEX)
				{
					this.angleIndex -= this.MAX_ANGLE_INDEX;
					this.previousAngle = ANGLES[MAX_ANGLE_INDEX - 1] - 360;
				}
			}
			else
			{
				this.angleIndex--;
				if(this.angleIndex < 0)
				{
					this.angleIndex += MAX_ANGLE_INDEX;
					this.previousAngle = ANGLES[0] + 360;
				}
			}

			this.isRotate = true;
			this.rotateTimer = 0; 
		}
	}
	else
	{
		if(this.rotateTimer >= this.rotateLasting)
		{
			this.angle = ANGLES[this.angleIndex];
			this.isRotate = false;
			rotateTimer = 0;
		}
		else
		{
			this.angle = this.previousAngle + (ANGLES[this.angleIndex] - this.previousAngle) * this.rotateTimer / this.rotateLasting;
		}
	}
}

Enemy.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

Enemy.prototype.destroy = function(){
	this.sprite.destroy();
}

Enemy.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Enemy.prototype.isVisible = function() {
	return this.sprite.visible;
};