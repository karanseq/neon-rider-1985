var BULLET_ADJUST_SCALE = {x:0.15, y:0.15};
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

	this.trail = Game.add.emitter(0, 0, 64);

	this.trail.makeParticles(['glow_particle']);
	this.trail.lifespan = 500;
	this.trail.gravity = 0;
	this.trail.frequency = 25;
	this.trail.autoScale = true;
	this.trail.autoAlpha = true;
	this.trail.spread = 20;

	this.trail.baseScale = 0.5;
	var dir = (this.type == this.BulletType.PLAYER_BULLET ? backward(this.angle) : forward(this.angle));
	//var back = backward(this.angle);
	this.trail.minParticleSpeed = new Phaser.Point(dir.x * this.radius - this.trail.spread, dir.y * this.radius - this.trail.spread);
	this.trail.maxParticleSpeed = new Phaser.Point(dir.x * this.radius + this.trail.spread, dir.y * this.radius + this.trail.spread);

	this.trail.setAlpha(1, 0, this.trail.lifespan, undefined, false);
	this.trail.setScale(0, this.trail.baseScale, 0, this.trail.baseScale, this.trail.lifespan, undefined, false);

	this.trail.start(false, this.trail.lifespan, this.trail.frequency, 16, false);
	this.trail.position = this.position;
}

Bullet.prototype.BulletType = {
	PLAYER_BULLET: 0, 
	ENEMY_BULLET: 1
}

Bullet.prototype.destroy = function(){
    this.sprite.destroy();
    this.trail.destroy();
}

Bullet.prototype.update = function(){
	if(this.type == this.BulletType.PLAYER_BULLET)
		this.radius -= PLAYER_BULLET_SPEED;
	else
		this.radius += ENEMY_BULLET_SPEED;
	this.scale = { x:this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.x, y: this.radius / RADIUS[0] * BULLET_ADJUST_SCALE.y };
	this.updateSprite();
	this.trail.position = this.position;
}

Bullet.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

