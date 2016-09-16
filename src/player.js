var INIT_ANGLE_INDEX = 4;

var Player = function() {
	this.sprite = null;
	this.angleIndex = INIT_ANGLE_INDEX;
	
	this.radius = RADIUS;
	this.angle = ANGLES[this.angleIndex];
	this.position = caculatePosition(RADIUS, this.angle);
	this.scale = {x:1, y:1};

	this.bullets = null;

	this.bulletMoveSpeed = 5;
	this.bulletScaleSpeed = 0.02;
};

Player.prototype.init = function() {
	this.sprite = Game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player');
	this.sprite.anchor = { x: 0.5, y: 0.5 };
	this.sprite.visible = true;

	this.bullets = new Array();
};

Player.prototype.createBullet = function(){
	var bullet = new Bullet(true, this.radius, this.angleIndex);
	this.bullets.push(bullet);
}

Player.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{	
		if(this.bullets[i].radius < this.bulletMoveSpeed * 2)
		{
			var temp = this.bullets[i];
			this.bullets[i] = this.bullets[this.bullets.length - 1];
			temp.destroy();
			delete temp;
			this.bullets.pop();
		}
		else
		{
			this.bullets[i].radius -= this.bulletMoveSpeed;
			this.bullets[i].scale = { x:this.bullets[i].scale.x - this.bulletScaleSpeed, y:this.bullets[i].scale.y - this.bulletScaleSpeed};
			this.bullets[i].updateSprite();
		}
	}
}

Player.prototype.updateSprite = function(){
	this.sprite.scale = this.scale;
	this.sprite.angle = -this.angle;
	this.position = caculatePosition(this.radius, this.angle);
	this.sprite.position = this.position;
}

Player.prototype.setVisible = function(visibility) {
	this.sprite.visible = visibility;
};

Player.prototype.isVisible = function() {
	return this.sprite.visible;
};

Player.prototype.setAngleIndex = function(index)
{
	if(index < 0) index += MAX_ANGLE_INDEX;
	else index = (index % MAX_ANGLE_INDEX);
	this.angleIndex = index;
	this.angle = ANGLES[this.angleIndex];
}

Player.prototype.getAngleIndex = function()
{
	return this.angleIndex;
}