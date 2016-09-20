var ENEMY_SPAWN_RADIUS = 10;
var ENEMY_SPAWN_SCALE = { x:0.02, y:0.02 };
var ROTATE_INTERVAL = 50;
var ROTATE_LASTING = 5;
var SHOOT_INTERVAL = 80;
var MOVE_SPEED = 1;
var SCALE_SPEED = 0.001;

var Enemy = function(angleIndex, enemyType) {
	this.angleIndex = angleIndex;
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;

	this.radius = ENEMY_SPAWN_RADIUS;
	this.angle = ANGLES[this.angleIndex]
	this.scale = ENEMY_SPAWN_SCALE;
	this.position = caculatePosition(this.radius, this.angle);
	this.updateSprite();

	this.type = enemyType;

	if(Math.random() < 0.5)
		this.rotateLeft = true;
	else
		this.rotateLeft = false;

	this.rotateTimer = Math.round(Math.random() * ROTATE_INTERVAL);
	this.isRotate = false;
	this.previousAngle =0;

	this.shootTimer = Math.round(Math.random() * SHOOT_INTERVAL);
	this.shootFlag = false;
};

Enemy.prototype.EnemyType = {
	ENEMY_SIMPLE: 0,
	ENEMY_ROTATING: 1,
 	ENEMY_SHOOTING: 2,
 };

Enemy.prototype.createBullet = function(){
	var bullet = new Bullet(false, this.radius, this.angleIndex);
	bullet.scale = {x: this.scale.x * 0.1, y: this.scale.y * 0.1};
	bullet.updateSprite();
	return bullet;
}

Enemy.prototype.update = function(){
	this.updateMovement();

	switch (this.type) {
 		case this.EnemyType.ENEMY_SIMPLE:
 			break;
 		case this.EnemyType.ENEMY_ROTATING:
 			this.updateRotation();
 			break;
 		case this.EnemyType.ENEMY_SHOOTING:
 			this.updateShooting();
			break;
 	}
 	this.updateSprite();
}


Enemy.prototype.updateMovement = function(){
	this.radius += MOVE_SPEED;
	this.scale = { x:this.scale.x + SCALE_SPEED, y:this.scale.y + SCALE_SPEED};
}

Enemy.prototype.updateShooting = function(){
	this.shootTimer++;
	if(this.shootTimer >= SHOOT_INTERVAL)
	{
		this.shootFlag = true;
		this.shootTimer -= SHOOT_INTERVAL;
	}
}

Enemy.prototype.updateRotation = function(){
	this.rotateTimer++;
	if(!this.isRotate)
	{
		if(this.rotateTimer >= ROTATE_INTERVAL)
		{	
			this.previousAngle = ANGLES[this.angleIndex];
			if(this.rotateLeft)
			{
				this.angleIndex++;
				if(this.angleIndex >= MAX_ANGLE_INDEX)
				{
					this.angleIndex -= MAX_ANGLE_INDEX;
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
		if(this.rotateTimer >= ROTATE_LASTING)
		{
			this.angle = ANGLES[this.angleIndex];
			this.isRotate = false;
			rotateTimer = 0;
		}
		else
		{
			this.angle = this.previousAngle + (ANGLES[this.angleIndex] - this.previousAngle) * this.rotateTimer / ROTATE_LASTING;
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