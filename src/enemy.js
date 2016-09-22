var ENEMY_SPAWN_RADIUS = 10;
var ENEMY_ADJUST_SCALE = { x:0.6, y:0.6 };
var ROTATE_INTERVAL = 50;
var ROTATE_LASTING = 5;
var SHOOT_INTERVAL = 80;
var MOVE_SPEED = 1;

var BLOCK_HEALTH = 5;

var Enemy = function(angleIndex, enemyType) {
	this.angleIndex = angleIndex;

	this.type = enemyType;

	switch(this.type)
	{
		case this.EnemyType.STRAIGHT_FORWARD:
		case this.EnemyType.ROTATE_FORWARD:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy1');
			break;
		case this.EnemyType.ROTATE_STABLE:
		case this.EnemyType.BLOCK:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy2');
			break;
		case this.EnemyType.GUN:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy3');
		 	break;
		 default:
		 break;
	}
	
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;

	if(this.type == this.EnemyType.STRAIGHT_FORWARD || this.type == this.EnemyType.ROTATE_FORWARD)
		this.radius = ENEMY_SPAWN_RADIUS;
	else
		this.radius = RADIUS * 0.4;
	this.angle = ANGLES[this.angleIndex];
	this.scale = { x:this.radius / RADIUS * ENEMY_ADJUST_SCALE.x, y: this.radius / RADIUS * ENEMY_ADJUST_SCALE.y };
	this.position = caculatePosition(this.radius, this.angle);
	this.updateSprite();


	if(Math.random() < 0.5)
		this.rotateLeft = true;
	else
		this.rotateLeft = false;

	this.rotateTimer = Math.round(Math.random() * ROTATE_INTERVAL);
	this.isRotate = false;
	this.previousAngle =0;

	this.shootTimer = Math.round(Math.random() * SHOOT_INTERVAL);
	this.shootFlag = false;

	this.health = 1;
	if(this.type == this.EnemyType.BLOCK)
		this.health = BLOCK_HEALTH;
};

Enemy.prototype.EnemyType = {
	STRAIGHT_FORWARD: 0,
	ROTATE_FORWARD: 1,
	ROTATE_STABLE: 2,
 	BLOCK: 3,
 	GUN: 4
 };

Enemy.prototype.createBullet = function(){
	var bullet = new Bullet(1, this.radius, this.angleIndex);
	bullet.updateSprite();
	return bullet;
}

Enemy.prototype.update = function(){

	switch (this.type) {
 		case this.EnemyType.STRAIGHT_FORWARD:
			this.updateMovement();
 			break;
 		case this.EnemyType.ROTATE_FORWARD:
			this.updateMovement();
 			this.updateRotation();
 			break;
 		case this.EnemyType.ROTATE_STABLE:
 			this.updateRotation();
 		case this.EnemyType.BLOCK:
			break;
		case this.EnemyType.GUN:
			this.updateShooting();
			break;
		default:
			break;
 	}
 	this.updateSprite();
}


Enemy.prototype.updateMovement = function(){
	this.radius += MOVE_SPEED;
	this.scale = { x: this.radius / RADIUS * ENEMY_ADJUST_SCALE.x, y: this.radius / RADIUS * ENEMY_ADJUST_SCALE.y };

	// this.scale = { x:this.scale.x + SCALE_SPEED, y:this.scale.y + SCALE_SPEED};
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
			if(!this.rotateLeft)
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