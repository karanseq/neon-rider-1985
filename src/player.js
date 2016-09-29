var INIT_ANGLE_INDEX = 4;
//var EXPLOSION_INTERVAL = 15;
//var EXPLOSION_REVERSE_COUNTER = 2;

var PLAYER_ROTATE_LASTING = 10;

var Player = function() {
	this.sprite = null;
	this.healthSprite = null;
	this.dashSprite = null;
	this.angleIndex = INIT_ANGLE_INDEX;
	
	this.radius = RADIUS[1];
	this.angle = ANGLES[this.angleIndex];
	this.position = caculatePosition(this.radius, this.angle);
	this.scale = PLAYER_SCALE;

	this.backVector = null;
	this.frontVector = null;

	this.bullets = null;

	this.bulletMoveSpeed = 5;
	this.bulletScaleSpeed = 0.001;
	this.fireRate = 10;
	this.fireRateCounter = 0;
	this.muzzleFlashSpread = 120;

	//this.isExplosionLarge = true;
	//this.explosionTimer = 0;
	//this.explosionReverseCounter = 0;
	//this.explosionScaleChange = 0.1;

	this.isRotate = false;
	this.previousAngle = 0;
	this.rotateTimer = 0;

	this.health = CONFIG.PLAYER_MAX_HEALTH;
	this.healthBars = CONFIG.PLAYER_HEALTH_BARS;
	this.isBlinking = false;

	this.numMoves = 3;
	this.moveEvent = null;
	this.boostFlashSpread = 75;

	this.isGoingThroughLevel = false;
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

    // create emitters
	createPlayerDestructionEmitter();
	createPlayerBoostEmitter();
	createPlayerShootEmitter();
	createWarpEmitter();
	this.updateVectors();
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
	this.moveEvent = Game.time.events.add(CONFIG.PLAYER_MOVE_COOLDOWN, this.finishMove, this);

    // emit dash particles
	playerBoostEmitter.x = this.position.x;
	playerBoostEmitter.y = this.position.y;
	playerBoostEmitter.explode(playerBoostEmitter.lifespan, 4);

	Game.sound.play('player_dash');
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
		Game.sound.play('player_move');
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
	Game.sound.play('player_shoot');
	playerShootEmitter.position = this.position;
	playerShootEmitter.explode(playerShootEmitter.lifespan, 4);

	var bullet = new Bullet(0, this.radius, this.angleIndex);
	bullet.updateSprite();
	bullet.sprite.tint = '0x00ff00';
	setParticleTint(bullet.trail, '0x00ff00', true);
	this.bullets.push(bullet);
}

Player.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{	
		if(this.bullets[i].radius < this.bulletMoveSpeed * 15)
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

			this.updateVectors();
		}
		else
		{
			this.angle = this.previousAngle + (ANGLES[this.angleIndex] - this.previousAngle) * this.rotateTimer / ROTATE_LASTING;
		}
	}
}

Player.prototype.updateVectors = function () {
    this.frontVector = forward(this.angle);
    var muzzleFlashSpeed = playerShootEmitter.speed;
    playerShootEmitter.minParticleSpeed = new Phaser.Point(this.frontVector.x * muzzleFlashSpeed - this.muzzleFlashSpread, this.frontVector.y * muzzleFlashSpeed - this.muzzleFlashSpread);
    playerShootEmitter.maxParticleSpeed = new Phaser.Point(this.frontVector.x * muzzleFlashSpeed + this.muzzleFlashSpread, this.frontVector.y * muzzleFlashSpeed + this.muzzleFlashSpread);

    this.backVector = backward(this.angle);
    var boostSpeed = playerBoostEmitter.speed;
    playerBoostEmitter.minParticleSpeed = new Phaser.Point(this.backVector.x * boostSpeed - this.boostFlashSpread, this.backVector.y * boostSpeed - this.boostFlashSpread);
    playerBoostEmitter.maxParticleSpeed = new Phaser.Point(this.backVector.x * boostSpeed + this.boostFlashSpread, this.backVector.y * boostSpeed + this.boostFlashSpread);
}

Player.prototype.updateSprite = function() {
	// check if player is going through level
	if (this.isGoingThroughLevel) {
		this.radius -= 5;
		this.scale = { x: this.scale.x - 0.005, y: this.scale.y - 0.005 };
		if (this.scale.x <= 0 || this.scale.y <= 0 || this.radius <= 0) {
			this.isGoingThroughLevel = false;
		}
		warpEmitter.x = this.position.x;
		warpEmitter.y = this.position.y;
	}

	this.position = caculatePosition(this.radius, this.angle);
	
	if (this.sprite != null) {
		this.sprite.scale = this.scale;
		this.sprite.angle = -this.angle;	
		this.sprite.position = this.position;
	}

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
	if (this.sprite != null) this.sprite.destroy();
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

Player.prototype.takeDamage = function(damage) {
	if (damage <= 0) {
		return;
	}

	if (this.isBlinking) {
		return;
	}

	// reduce health
	this.health -= damage;
	console.log("Player takes " + damage + " damage...health:" + this.health);

	if (this.health <= 0) {
		this.health = 0;
		this.die();
	}
	else {
		this.startBlinking();
		Game.sound.play('player_hurt');
		this.refreshHealthSprite();
	}	
};

Player.prototype.gainHealth = function() {
	// increment health
	this.health += CONFIG.PLAYER_HEALTH_GAIN_RATE;

	// limit max health
	if (this.health > CONFIG.PLAYER_MAX_HEALTH) {
		this.health = CONFIG.PLAYER_MAX_HEALTH;
	}
	console.log("Player gains " + CONFIG.PLAYER_HEALTH_GAIN_RATE + " health...health:" + this.health);

	this.refreshHealthSprite();
};

Player.prototype.goThroughLevel = function() {
    if (this.isGoingThroughLevel) {
		return;
	}
	this.isGoingThroughLevel = true;
	warpEmitter.start(false, warpEmitter.lifespan, warpEmitter.frequency, 256, false);
};

Player.prototype.refreshHealthSprite = function() {
	if (this.healthSprite == null) {
		return;
	}

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
	if (this.dashSprite == null) {
		return;
	}	
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
	//this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'playerExplosion');
	//this.sprite.anchor = { x: 0.5, y: 0.5 };
	//this.sprite.visible = true;
	//this.sprite.scale = PLAYER_EXPLOSION_SCALE;
    //this.scale = PLAYER_EXPLOSION_SCALE;

	playerDestructionEmitter.position = this.position;
	playerDestructionEmitter.explode(playerDestructionEmitter.lifespan, 5);

	sparkEmitter.x = this.position.x;
	sparkEmitter.y = this.position.y;
	setParticleTint(sparkEmitter, '0x00ff00');
	setParticleSpeed(sparkEmitter, 1000);
	sparkEmitter.explode(sparkEmitter.lifespan, 128);

	var numRingPieces = 32;
	ringEmitter.explode(ringEmitter.lifespan, numRingPieces);
	var r = 250;
	var i = 0;
	ringEmitter.forEach(function (particle) {
	    var angle = i++ / numRingPieces * 2 * Math.PI;
	    particle.position = new Phaser.Point(GAME_WIDTH / 2 + r * Math.cos(angle), GAME_HEIGHT / 2 + r * Math.sin(angle));
	    particle.rotation = angle;
	});

	kamikazeExplosionEmitter.x = this.position.x;
	kamikazeExplosionEmitter.y = this.position.y;
	kamikazeExplosionEmitter.explode(kamikazeExplosionEmitter.lifespan, 2);

	Game.sound.play('player_death');
};

// player explosion animation
//Player.prototype.updateExplosion = function(){
//	this.explosionTimer++;
//	// if(this.isExplosionLarge)
//	// {
//	// 	if(this.explosionTimer >= EXPLOSION_INTERVAL)
//	// 	{
//	// 		this.explosionReverseCounter++;
//	// 		this.scale = {x: this.scale.x + this.explosionScaleChange, y: this.scale.y + this.explosionScaleChange};
//	// 		this.explosionTimer = 0;
//	// 	}
//	// 	if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
//	// 	{
//	// 		this.isExplosionLarge = false;
//	// 		this.explosionReverseCounter = 0;
//	// 	}
//	// }
//	// else
//	// {
//	// 	if(this.explosionTimer >= EXPLOSION_INTERVAL)
//	// 	{
//	// 		this.explosionReverseCounter++;
//	// 		this.scale = {x: this.scale.x - this.explosionScaleChange, y: this.scale.y - this.explosionScaleChange};
//	// 		this.explosionTimer = 0;
//	// 	}
//	// 	if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
//	// 	{
//	// 		this.isExplosionLarge = true;
//	// 		this.explosionReverseCounter = 0;
//	// 	}
//	// }

	
//	if(this.isExplosionLarge)
//	{
//		if(this.explosionTimer >= EXPLOSION_INTERVAL)
//		{
//			this.explosionReverseCounter++;
//			this.scale = {x: this.scale.x + this.explosionScaleChange, y: this.scale.y + this.explosionScaleChange};
//			this.explosionTimer = 0;
//		}
//		if(this.explosionReverseCounter >= EXPLOSION_REVERSE_COUNTER)
//		{
//			this.isExplosionLarge = false;
//			this.explosionReverseCounter = 0;
//		}
//	}
//	else
//	{
//		if(this.explosionTimer >= EXPLOSION_INTERVAL / 2)
//		{
			
//			this.scale = PLAYER_EXPLOSION_SCALE;
//			this.explosionTimer = 0;
		
//			this.isExplosionLarge = true;
//		}
//	}
//}

Player.prototype.startBlinking = function() {
	if (this.isBlinking) {
		return;
	}
	this.isBlinking = true;

	var duration = 50;
	var numBlinks = 5;
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