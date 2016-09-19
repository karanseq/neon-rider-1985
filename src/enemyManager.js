var EnemyManager = function(){
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;

	this.enemyMoveSpeed = 1;
	this.enemyScaleSpeed = 0.001;
	this.enemyBulletMoveSpeed = 2;
	this.enemyBulletScaleSpeed = 0.001;
}


EnemyManager.prototype.init = function() {
	this.enemys = new Array();
	this.bullets = new Array();
};

EnemyManager.prototype.reset = function() {
	while (this.enemys.length > 0) {
		var enemy = this.enemys.pop();
		enemy.destroy();
	}

	while (this.bullets.length > 0) {
		var bullet = this.bullets.pop();
		bullet.destroy();
	}
};

EnemyManager.prototype.createEnemy = function(angleIndex){
	var enemy = new Enemy(angleIndex);
	this.enemys.push(enemy);
};

EnemyManager.prototype.updateEnemy = function(){
	for(var i=0;i<this.enemys.length;i++)
	{
		if(this.enemys[i].radius > RADIUS - 15)
		{
			this.deleteEnemy(i);
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
				if(!this.enemys[i].isRotate && this.enemys[i].radius < RADIUS / 2)
					this.createBullet(this.enemys[i]);
			}
		}
	}
}

EnemyManager.prototype.deleteEnemy = function(enemyIndex){
	var temp = this.enemys[enemyIndex];
	this.enemys[enemyIndex] = this.enemys[this.enemys.length - 1];
	temp.destroy();
	delete temp;
	this.enemys.pop();
}

EnemyManager.prototype.createBullet = function(enemy){
	var bullet = enemy.createBullet();
		this.bullets.push(bullet);
}

EnemyManager.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{
		if(this.bullets[i].radius > RADIUS - 15)
		{
			this.deleteBullet(i);
		}
		else
		{
			this.bullets[i].radius += this.enemyBulletMoveSpeed;
			this.bullets[i].scale = { x:this.bullets[i].scale.x + this.enemyBulletScaleSpeed, y:this.bullets[i].scale.y + this.enemyBulletScaleSpeed};
			this.bullets[i].updateSprite();
		}
	}
}

EnemyManager.prototype.deleteBullet = function(bulletIndex){
	var temp = this.bullets[bulletIndex];
	this.bullets[bulletIndex] = this.bullets[this.bullets.length - 1];
	temp.destroy();
	delete temp;
	this.bullets.pop();
}