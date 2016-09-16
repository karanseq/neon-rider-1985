var EnemyManager = function(){
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;

	this.enemyMoveSpeed = 1;
	this.enemyScaleSpeed = 0.002;
	this.enemyBulletMoveSpeed = 2;
	this.enemyBulletScaleSpeed = 0.005;
}


EnemyManager.prototype.init = function() {
	this.enemys = new Array();
	this.bullets = new Array();
};

EnemyManager.prototype.createEnemy = function(angleIndex){
	var enemy = new Enemy(angleIndex);
	this.enemys.push(enemy);
}


EnemyManager.prototype.updateEnemy = function(){
	for(var i=0;i<this.enemys.length;i++)
	{
		if(this.enemys[i].radius > RADIUS)
		{
			var temp = this.enemys[i];
			this.enemys[i] = this.enemys[this.enemys.length - 1];
			temp.destroy();
			delete temp;
			this.enemys.pop();
		}
		else
		{
			this.enemys[i].radius += this.enemyMoveSpeed;
			this.enemys[i].scale = { x:this.enemys[i].scale.x + this.enemyScaleSpeed, y:this.enemys[i].scale.y + this.enemyScaleSpeed};
			this.enemys[i].updateRotation();
			this.enemys[i].updateSprite();

			// shoot bullet
			if(Math.random() < this.enemyShootChance)
			{
				//enemy can not create bullet when they are roatating
				if(!this.enemys[i].isRotate)
					this.createBullet(this.enemys[i]);
			}
		}
	}
}

EnemyManager.prototype.createBullet = function(enemy){
	var bullet = enemy.createBullet();
		this.bullets.push(bullet);
}

EnemyManager.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{
		if(this.bullets[i].radius > RADIUS)
		{
			var temp = this.bullets[i];
			this.bullets[i] = this.bullets[this.bullets.length - 1];
			temp.destroy();
			delete temp;
			this.bullets.pop();
		}
		else
		{
			this.bullets[i].radius += this.enemyBulletMoveSpeed;
			this.bullets[i].scale = { x:this.bullets[i].scale.x + this.enemyBulletScaleSpeed, y:this.bullets[i].scale.y + this.enemyBulletScaleSpeed};
			this.bullets[i].updateSprite();
		}
	}
}