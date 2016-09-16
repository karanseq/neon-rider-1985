var EnemyType = {
	ENEMY_SIMPLE: 0,
	ENEMY_ROTATING: 1,
	ENEMY_MOVING: 2,
	ENEMY_SHOOTING: 3
};

var Enemy = function(type, angles, positionIndex) {
	this.sprite = null;
	this.type = type;
	this.hasFinishedDying = false;
	this.mustShoot = false;

	this.angles = angles;
	this.maxPositionIndex = this.angles.length;
	this.positionIndex = positionIndex;

	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'enemy');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;
	this.setScale( {x:0.1, y:0.1} );
	this.setAngle(this.angles[this.positionIndex]);

	if (this.type == EnemyType.ENEMY_ROTATING) {
		this.initRotation();
	}
	else if (this.type == EnemyType.ENEMY_SHOOTING) {
		this.initShooting();
	}
};

Enemy.prototype.initRotation = function() {
	if(Math.random() < 0.5)
		this.rotateLeft = true;
	else
		this.rotateLeft = false;

	this.rotateInterval = 40;
	this.rotateTimer = Math.round(Math.random() * this.rotateInterval);

	this.isRotate = false;
	this.rotateLasting = 10;

	this.previousAngle = 0;
};

Enemy.prototype.initShooting = function() {
	this.bulletFireDelay = 150;
	this.bulletFireCounter = this.bulletFireDelay;
	this.isReadyToFire = false;
};

Enemy.prototype.createBullet = function() {
	if(this.isRotate) return null;

	this.isReadyToFire = false;
	var bullet = new Bullet(false, this.angles, this.positionIndex);
	bullet.setScale({x: this.sprite.scale.x + 0.8, y: this.sprite.scale.y + 0.8});
	return bullet;
}

Enemy.prototype.update = function() {

	switch (this.type) {
		case EnemyType.ENEMY_MOVING:
		this.updateMovement();
		break;

		case EnemyType.ENEMY_ROTATING:
		this.updateRotation();
		break;

		case EnemyType.ENEMY_SHOOTING:
		this.updateShooting();
		break;
	}
};

Enemy.prototype.updateMovement = function() {
	var scale = this.getScale();

	if(scale.x > 1.7)
	{
		this.hasFinishedDying = true;
	}
	else
	{
		this.setScale({ x:scale.x + 0.01, y:scale.y + 0.01});
	}
};

Enemy.prototype.updateRotation = function() {
	this.rotateTimer++;
	if(!this.isRotate)
	{
		if(this.rotateTimer >= this.rotateInterval)
		{	
			this.previousAngle = this.angles[this.positionIndex];
			if(this.rotateLeft)
			{
				this.positionIndex++;
				if(this.positionIndex >= this.maxPositionIndex)
				{
					this.positionIndex -= this.maxPositionIndex;
					this.previousAngle = this.angles[this.maxPositionIndex - 1] - 360;
				}
			}
			else
			{
				this.positionIndex--;
				if(this.positionIndex < 0)
				{
					this.positionIndex += this.maxPositionIndex;
					this.previousAngle = this.angles[0] + 360;
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
			this.setAngle(this.angles[this.positionIndex]);
			this.isRotate = false;
			rotateTimer = 0;
		}
		else
		{
			this.setAngle(this.previousAngle + (this.angles[this.positionIndex] - this.previousAngle) * this.rotateTimer / this.rotateLasting);
		}
	}
};

Enemy.prototype.updateShooting = function() {
	if (this.bulletFireCounter > 0) {
		--this.bulletFireCounter;

		if (this.bulletFireCounter == 0) {
			this.bulletFireCounter = this.bulletFireDelay;
			this.isReadyToFire = true;			
		}
	}
};

Enemy.prototype.destroy = function(){
	this.sprite.destroy();
};

Enemy.prototype.setScale = function(newScale) {
	this.sprite.scale = newScale;
};

Enemy.prototype.getScale = function() {
	return this.sprite.scale;
};

Enemy.prototype.setAngle = function(newAngle) {
	this.sprite.angle = newAngle;
};

Enemy.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Enemy.prototype.isVisible = function() {
	return this.sprite.visible;
};
