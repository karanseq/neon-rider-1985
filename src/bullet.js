var BULLET_ADJUST_SCALE = {x:0.1, y:0.1};
var PLAYER_BULLET_SPEED = 5;
var ENEMY_BULLET_SPEED = 2;

var Bullet = function(type, radius, angleIndex){
	this.type = type;
	this.angleIndex = angleIndex;

	if(this.type == this.BulletType.PLAYER_BULLET)
		this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'playerbullet');
	else
		this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemybullet');

	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	
	this.radius = radius;
	this.angle = ANGLES[this.angleIndex];
	this.scale = { x:this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.x, y: this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.y };
	this.position = caculatePosition(this.radius, this.angle);
}

Bullet.prototype.BulletType = {
	PLAYER_BULLET: 0, 
	ENEMY_BULLET: 1
}

Bullet.prototype.destroy = function(){
	this.sprite.destroy();
}

Bullet.prototype.update = function(){
	if(this.type == this.BulletType.PLAYER_BULLET)
		this.radius -= PLAYER_BULLET_SPEED;
	else
		this.radius += ENEMY_BULLET_SPEED;
	this.scale = { x:this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.x, y: this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.y };
	this.updateSprite();
}

Bullet.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

