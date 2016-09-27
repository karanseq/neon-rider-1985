var INIT_ANGLE_INDEX = 4;
var EXPLOSION_INTERVAL = 15;
var EXPLOSION_REVERSE_COUNTER = 2;

var PLAYER_ROTATE_LASTING = 5;
var PLAYER_MAX_HEALTH = 6;

var Player = function() {
	this.sprite = null;
	this.healthSprite = null;
	this.dashSprite = null;
	this.angleIndex = INIT_ANGLE_INDEX;
	
	this.radius = RADIUS[1];
	this.angle = ANGLES[this.angleIndex];
	this.position = caculatePosition(this.radius, this.angle);
	this.scale = PLAYER_SCALE;

	this.bullets = null;

	this.bulletMoveSpeed = 5;
	this.bulletScaleSpeed = 0.001;
	this.fireRate = 10;
	this.fireRateCounter = 0;

	this.isExplosionLarge = true;
	this.explosionTimer = 0;
	this.explosionReverseCounter = 0;
	this.explosionScaleChange = 0.1;

	this.isRotate = false;
	this.previousAngle =0;
	this.rotateTimer = 0;

	this.health = PLAYER_MAX_HEALTH;
	this.healthBars = 2;
	this.isBlinking = false;

	this.numMoves = 3;
	this.moveEvent = null;
};

Player.prototype.init = function() {
	// reset player position
	this.angleIndex = INIT_ANGLE_INDEX;
	this.angle = ANGLES[this.angleIndex];

	// initialize player sprite
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player');
	this.sprite.tint = '0xeccd31';
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.scale = PLAYER_SCALE;
	this.sprite.visible = true;

	// initialize health sprite
	this.healthSprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player_health_full');
	this.healthSprite.anchor = { x: 0.5, y: 0.5 };
	this.healthSprite.scale = PLAYER_SCALE;
	this.healthSprite.visible = true;

	// initialize dash sprite
	this.dashSprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player_dash_' + this.numMoves);
	this.dashSprite.anchor = { x: 0.5, y: 0.5 };
	this.dashSprite.scale = PLAYER_SCALE;
	// this.dashSprite.tint = '0xeccd31';
	this.dashSprite.alpha = 0.75;
	this.dashSprite.visible = true;

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

	// remove any finish move events
	if (this.moveEvent != null) {
		Game.time.events.remove(this.moveEvent);
		this.moveEvent = null;
	}
};

Player.prototype.moveForward = function() {
	// can the player move forward?
	if (this.numMoves <= 0) {
		return;
	}

	// schedule an event to move forward
	--this.numMoves;
	this.refreshDashSprite();
	this.moveEvent = Game.time.events.add(3000, this.finishMove, this);

	console.log("Move forward numMoves:" + this.numMoves);

	return;
};

Player.prototype.finishMove = function() {
	if (this.numMoves < 3) {
		++this.numMoves;
		this.refreshDashSprite();

		console.log("Finished moving forward numMoves:" + this.numMoves);
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

	playerShootEmitter.position = this.position;
	playerShootEmitter.explode(playerShootEmitter.lifespan, 4);

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

	if (this.healthSprite != null) {
		this.healthSprite.scale = this.scale;
		this.healthSprite.angle = -this.angle;
		this.healthSprite.position = this.position;		
	}

	if (this.dashSprite != null) {
		this.dashSprite.scale = this.scale;
		this.dashSprite.angle = -this.angle;
		this.dashSprite.position = this.position;
	}

	if (this.fireRateCounter > 0) {
		--this.fireRateCounter;
	}
}

Player.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
	this.healthSprite.visible = visibility;
};

Player.prototype.isVisible = function() {
	return this.sprite.visible || this.healthSprite.visible;
};

Player.prototype.destroy = function() {
	this.sprite.destroy();
	this.sprite = null;

	if (this.healthSprite != null) {
		this.healthSprite.destroy();
		this.healthSprite = null;
	}

	if (this.dashSprite != null) {
		this.dashSprite.destroy();
		this.dashSprite = null;
	}
}

Player.prototype.takeDamage = function() {
	if (this.isBlinking) {
		return;
	}

	// reduce health
	--this.health;
	console.log("Player takes damage...health:" + this.health);

	if (this.health <= 0) {
		this.die();
	}
	else {
		this.startBlinking();

		this.refreshHealthSprite();
	}	
};

Player.prototype.gainHealth = function() {
	++this.health;
	if (this.health > PLAYER_MAX_HEALTH) {
		this.health = PLAYER_MAX_HEALTH;
	}
	console.log("Player gains health...health:" + this.health);

	this.refreshHealthSprite();
};

Player.prototype.refreshHealthSprite = function() {
	this.healthSprite.destroy();

	var spriteName = '';
	var healthBar = Math.ceil(this.health / this.healthBars);
	if (healthBar < 2) {
		spriteName = 'player_health_low';
	}
	else if (healthBar < 3) {
		spriteName = 'player_health_med';
	}
	else {
		spriteName = 'player_health_full';
	}

	this.healthSprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, spriteName);
	this.healthSprite.anchor = { x: 0.5, y: 0.5 };
	this.healthSprite.scale = this.scale;
	this.healthSprite.angle = -this.angle;
	this.healthSprite.position = this.position;
};

Player.prototype.refreshDashSprite = function() {
	this.dashSprite.destroy();

	this.dashSprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player_dash_' + this.numMoves);
	this.dashSprite.anchor = { x: 0.5, y: 0.5 };
	this.dashSprite.scale = this.scale;
	this.dashSprite.angle = -this.angle;
	this.dashSprite.position = this.position;
	this.dashSprite.alpha = 0.75;
	// this.dashSprite.tint = '0xeccd31';
};

Player.prototype.die = function() {	
	this.health = 0;

	// remove old sprite
	this.destroy();

	// add explosion
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'playerExplosion');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.sprite.scale = PLAYER_EXPLOSION_SCALE;
	this.scale = PLAYER_EXPLOSION_SCALE;
};

// player explosion animation
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

Player.prototype.startBlinking = function() {
	if (this.isBlinking) {
		return;
	}
	this.isBlinking = true;

	var duration = 50;
	var numBlinks = 15;
	Game.add.tween(this.sprite).to({ alpha: 0.1 }, duration, Phaser.Easing.Linear.None, true, duration, numBlinks, true);
	Game.add.tween(this.healthSprite).to({ alpha: 0.1 }, duration, Phaser.Easing.Linear.None, true, duration, numBlinks, true);
	Game.add.tween(this.dashSprite).to({ alpha: 0.1 }, duration, Phaser.Easing.Linear.None, true, duration, numBlinks, true);

	Game.time.events.add(duration * numBlinks * 2, this.finishBlinking, this);
};

Player.prototype.finishBlinking = function() {
	this.isBlinking = false;
	this.sprite.alpha = 1;
	if (this.healthSprite != null) {
		this.healthSprite.alpha = 1;
	}
	if (this.dashSprite != null) {
		this.dashSprite.alpha = 0.75;
	}
};

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