var INIT_ANGLE_INDEX = 4;
var EXPLOSION_INTERVAL = 15;
var EXPLOSION_REVERSE_COUNTER = 2;

var PLAYER_ROTATE_LASTING = 5;

var Player = function() {
	this.sprite = null;
	this.angleIndex = INIT_ANGLE_INDEX;
	
	this.radius = RADIUS;
	this.angle = ANGLES[this.angleIndex];
	this.position = caculatePosition(RADIUS, this.angle);
	this.scale = PLAYER_SCALE;

	this.bullets = null;

	this.bulletMoveSpeed = 5;
	this.bulletScaleSpeed = 0.001;
	this.fireRate = 7;
	this.fireRateCounter = 0;

	this.isExplosionLarge = true;
	this.explosionTimer = 0;
	this.explosionReverseCounter = 0;
	this.explosionScaleChange = 0.1;

	this.isRotate = false;
	this.previousAngle =0;
	this.rotateTimer = 0;

	this.lives = 3;
};

Player.prototype.init = function() {
	// reset player position
	this.angleIndex = INIT_ANGLE_INDEX;
	this.angle = ANGLES[this.angleIndex];

	// initialize player sprite
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.scale = PLAYER_SCALE;
	this.sprite.visible = true;

	// call update to set default position
	this.updateSprite();

	this.scale = PLAYER_SCALE;

	this.bullets = new Array();
	this.fireRateCounter = 0;
};

Player.prototype.reset = function() {
	// remove the sprite
	this.destroy();

	// remove all bullets
	while (this.bullets.length > 0) {
		var bullet = this.bullets.pop();
		bullet.destroy();
	}
};

Player.prototype.beginRotation = function(rotateLeft){
	if(!this.isRotate)
	{
		this.previousAngle = ANGLES[this.angleIndex];
		if(!rotateLeft)
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



Player.prototype.createBullet = function() {
	// this condition prevents multiple bullets from sticking together
	if (this.fireRateCounter > 0) {
		return;
	}
	this.fireRateCounter = this.fireRate;

	var bullet = new Bullet(0, this.radius, this.angleIndex);
	bullet.updateSprite();
	this.bullets.push(bullet);
}

Player.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{	
		if(this.bullets[i].radius < this.bulletMoveSpeed * 2)
			this.deleteBullet(i);
		else
			this.bullets[i].update();
	}
}

Player.prototype.deleteBullet = function(bulletIndex){
	var temp = this.bullets[bulletIndex];
	this.bullets[bulletIndex] = this.bullets[this.bullets.length - 1];
	temp.destroy();
	delete temp;
	this.bullets.pop();
}

Player.prototype.updateRotation = function(){
	if(this.isRotate)
	{
		this.rotateTimer++;
		if(this.rotateTimer >= PLAYER_ROTATE_LASTING)
		{
			this.angle = ANGLES[this.angleIndex];
			this.isRotate = false;
		}
		else
		{
			this.angle = this.previousAngle + (ANGLES[this.angleIndex] - this.previousAngle) * this.rotateTimer / ROTATE_LASTING;
		}
	}
}

Player.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;

	if (this.fireRateCounter > 0) {
		--this.fireRateCounter;
	}
}

Player.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Player.prototype.isVisible = function() {
	return this.sprite.visible;
};

Player.prototype.destroy = function(){
	this.sprite.destroy();
	this.sprite = null;
}

Player.prototype.die = function() {	
	// remove old sprite
	this.destroy();

	// add explosion
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'playerExplosion');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.sprite.scale = PLAYER_EXPLOSION_SCALE;
	this.scale = PLAYER_EXPLOSION_SCALE;

	// reduce number of lives
	--this.lives;
};

Player.prototype.updateExplosion = function(){
	this.explosionTimer++;
	// if(this.isExplosionLarge)
	// {
	// 	if(this.explosionTimer >= EXPLOSION_INTERVAL)
	// 	{
	// 		this.explosionReverseCounter++;
	// 		this.scale = {x: this.scale.x + this.explosionScaleChange, y: this.scale.y + this.explosionScaleChange};
	// 		this.explosionTimer = 0;
	// 	}
	// 	if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
	// 	{
	// 		this.isExplosionLarge = false;
	// 		this.explosionReverseCounter = 0;
	// 	}
	// }
	// else
	// {
	// 	if(this.explosionTimer >= EXPLOSION_INTERVAL)
	// 	{
	// 		this.explosionReverseCounter++;
	// 		this.scale = {x: this.scale.x - this.explosionScaleChange, y: this.scale.y - this.explosionScaleChange};
	// 		this.explosionTimer = 0;
	// 	}
	// 	if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
	// 	{
	// 		this.isExplosionLarge = true;
	// 		this.explosionReverseCounter = 0;
	// 	}
	// }

	
	if(this.isExplosionLarge)
	{
		if(this.explosionTimer >= EXPLOSION_INTERVAL)
		{
			this.explosionReverseCounter++;
			this.scale = {x: this.scale.x + this.explosionScaleChange, y: this.scale.y + this.explosionScaleChange};
			this.explosionTimer = 0;
		}
		if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
		{
			this.isExplosionLarge = false;
			this.explosionReverseCounter = 0;
		}
	}
	else
	{
		if(this.explosionTimer >= EXPLOSION_INTERVAL / 2)
		{
			
			this.scale = PLAYER_EXPLOSION_SCALE;
			this.explosionTimer = 0;
		
			this.isExplosionLarge = true;
		}
	}
}

// Player.prototype.setAngleIndex = function(index)
// {
// 	if(index < 0) index += MAX_ANGLE_INDEX;
// 	else index = (index % MAX_ANGLE_INDEX);
// 	this.angleIndex = index;
// 	this.angle = ANGLES[this.angleIndex];
// }

// Player.prototype.getAngleIndex = function()
// {
// 	return this.angleIndex;
// }