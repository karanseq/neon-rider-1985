var ENEMY_SPAWN_RADIUS = 10;
var ENEMY_ADJUST_SCALE = [{ x:0.3, y:0.3 }, { x:0.4, y:0.4 }, {x: 0.9, y: 0.9 }, {x: 0.9, y: 0.9} ];
var ROTATE_INTERVAL = 50;
var ROTATE_LASTING = 5;
var SHOOT_INTERVAL = 80;
var MOVE_SPEED = 1;
var MOVE_LASTING = 60;
var ACCELERATE_SPEED = 3;

var GUN_HEALTH = 2;
var BLOCK_HEALTH = 10;


var Enemy = function(angleIndex, enemyType) {
	this.angleIndex = angleIndex;

	this.type = enemyType;

	switch(this.type)
	{
		case this.EnemyType.STRAIGHT_FORWARD:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy1');
			this.sprite.tint = 0xf26a4d;
			break;
		case this.EnemyType.ROTATE_FORWARD:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy2');
			this.sprite.tint = 0xe97720;
			break;
		case this.EnemyType.GUN:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy3');
			this.sprite.tint = 0x3df518;
			break;			
		case this.EnemyType.BLOCK:
			this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy4-1');
			this.sprite.tint = 0x6ac8f7;
			break;
		 default:
		 	break;
	}
	
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.layerIndex = RADIUS.length - 3;
	this.layerAnimation = false;
	this.layerAnimationTimer = 0;

	if(this.type == this.EnemyType.STRAIGHT_FORWARD || this.type == this.EnemyType.ROTATE_FORWARD)
		this.radius = ENEMY_SPAWN_RADIUS;
	else
		this.radius = RADIUS[this.layerIndex];
	this.angle = ANGLES[this.angleIndex];
	this.scale = { x:this.radius / RADIUS[0] * ENEMY_ADJUST_SCALE[this.type].x, y: this.radius / RADIUS[0] * ENEMY_ADJUST_SCALE[this.type].y };
	this.position = caculatePosition(this.radius, this.angle);
	this.updateSprite();

	this.moveTimer = 0;

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
	if(this.type == this.EnemyType.GUN)
		this.health = GUN_HEALTH;
	if(this.type == this.EnemyType.BLOCK)
		this.health = BLOCK_HEALTH;


};

Enemy.prototype.EnemyType = {
	STRAIGHT_FORWARD: 0,
	ROTATE_FORWARD: 1,
	GUN: 2,
 	BLOCK: 3,
 };

Enemy.prototype.createBullet = function(){
	var bullet = new Bullet(1, this.radius, this.angleIndex);
	bullet.updateSprite();
	return bullet;
}

Enemy.prototype.update = function(){
	// update Layer Anmiation mark
	if(this.layerAnimation)
	{
		this.layerAnimationTimer++;
		if(this.layerAnimationTimer > LAYER_ANIMATION_TIMER)
		{
			this.layerAnimation = false;
		}
	}
	else
	{
		if(this.layerAnimationTimer > LAYER_ANIMATION_TIMER)
		{
			this.layerAnimationTimer++;
			if(this.layerAnimationTimer > PROTECT_LAYER_ANIMATION_TIMER)
			{
				this.layerAnimationTimer = 0;
				this.layerIndex--;
			}
		}
		else if(LAYER_IS_ANIMATION)
		{	
			this.layerAnimation = true;
			
		}
	}

	switch (this.type) {
 		case this.EnemyType.STRAIGHT_FORWARD:
			this.updateMove();
 			break;
 		case this.EnemyType.ROTATE_FORWARD:
			this.updateMove();
 			this.updateRotation();
 			break;
 		case this.EnemyType.GUN:
 			this.updateLayerMove();
 			this.updateRotation();
 			this.updateShooting();
 		case this.EnemyType.BLOCK:
 			this.updateLayerMove();
			break;
		default:
			break;
 	}
 	this.updateSprite();
}


Enemy.prototype.updateMove = function(){
	// if(this.layerAnimation)
	// 	this.radius += ACCELERATE_SPEED;
	// else	
	// 	this.radius += MOVE_SPEED;
	this.moveTimer++;
	if(this.layerAnimation)
		this.moveTimer++;
	if(this.moveTimer >= MOVE_LASTING)
	{
		this.layerIndex--;
		this.moveTimer -= MOVE_LASTING;
	}
	this.radius = RADIUS[this.layerIndex] + (RADIUS[this.layerIndex - 1] - RADIUS[this.layerIndex]) * this.moveTimer / MOVE_LASTING;

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

Enemy.prototype.updateLayerMove = function(){

	if(this.layerAnimation)
	{
		this.radius = RADIUS[this.layerIndex] + (RADIUS[this.layerIndex - 1] - RADIUS[this.layerIndex]) * this.layerAnimationTimer / LAYER_ANIMATION_TIMER;
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
	this.scale = { x:this.radius / RADIUS[0] * ENEMY_ADJUST_SCALE[this.type].x, y: this.radius / RADIUS[0] * ENEMY_ADJUST_SCALE[this.type].y };
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

Enemy.prototype.changeSprite = function(spriteName, color){
	this.sprite.destroy();

	// add sprite
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, spriteName);
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.sprite.tint = color;
	this.updateSprite()
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