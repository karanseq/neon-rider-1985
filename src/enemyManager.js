var EnemyManager = function(angles){
	this.angles = angles;
	this.maxPositionIndex = this.angles.length;
	// this.graphics = null;
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;
}


EnemyManager.prototype.init = function() {

	this.enemys = new Array();
	this.bullets = new Array();
};

EnemyManager.prototype.createEnemy = function(positionIndex){
	var enemy = new Enemy(this.angles, positionIndex);
	this.enemys.push(enemy);
}


EnemyManager.prototype.updateEnemy = function(){
	for(var i=0;i<this.enemys.length;i++)
	{
		var scale = this.enemys[i].getScale();
		if(scale.x > 1.7)
		{
			var temp = this.enemys[i];
			this.enemys[i] = this.enemys[this.enemys.length - 1];
			temp.destroy();
			delete temp;
			this.enemys.pop();
		}
		else
		{
			this.enemys[i].setScale({ x:scale.x + 0.01, y:scale.y + 0.01});
			this.enemys[i].updateRotation();

			// shoot bullet
			if(Math.random() < this.enemyShootChance)
			{
				this.createBullet(this.enemys[i]);
			}
		}
	}
}

EnemyManager.prototype.createBullet = function(enemy){
	var bullet = enemy.createBullet();
	if(bullet != null)
		this.bullets.push(bullet);
}

EnemyManager.prototype.updateBullets = function(){
	for(var i=0;i<this.bullets.length;i++)
	{
		var scale = this.bullets[i].getScale();
		if(scale.x > 3.0)
		{
			var temp = this.bullets[i];
			this.bullets[i] = this.bullets[this.bullets.length - 1];
			temp.destroy();
			delete temp;
			this.bullets.pop();
		}
		else
			this.bullets[i].setScale({ x:scale.x + 0.1, y:scale.y + 0.1});
	}
}