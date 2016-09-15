var EnemyManager = function(angles){
	this.angles = angles;
	this.maxPositionIndex = this.angles.length;
	// this.graphics = null;
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;

	this.hasStartFormation = false;
	this.formationDelay = 0;
	this.formationCounter = -1;
	this.enemySpawnDelay = 0;
	this.enemySpawnCounter = -1;
	this.enemiesToSpawn = null;
}

EnemyManager.prototype.init = function() {
	this.enemys = new Array();
	this.bullets = new Array();
	this.enemiesToSpawn = new Array();

	this.formationDelay = 100;
	this.enemySpawnDelay = 25;
};

EnemyManager.prototype.startFormations = function() {
	if (this.hasStartFormation == true) {
		return;
	}
	this.hasStartFormation = true;
	this.formationCounter = this.formationDelay;
};

EnemyManager.prototype.createEnemy = function(positionIndex) {
	var enemy = new Enemy(this.angles, positionIndex);
	this.enemys.push(enemy);
}

EnemyManager.prototype.update = function() {
	this.updateEnemy();
	this.updateBullets();
	this.updateFormation();
};

EnemyManager.prototype.updateEnemy = function() {
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
			// this.enemys[i].updateRotation();

			// shoot bullet
			if(Math.random() < this.enemyShootChance)
			{
				this.createBullet(this.enemys[i]);
			}
		}
	}
};

EnemyManager.prototype.createBullet = function(enemy){
	var bullet = enemy.createBullet();
	if(bullet != null)
		this.bullets.push(bullet);
};

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
};

EnemyManager.prototype.updateFormation = function() {
	// update formation counter
	if (this.formationCounter > 0) {
		--this.formationCounter;

		// check if a new formation is required	
		if (this.formationCounter == 0) {
			this.createFormation();
			this.enemySpawnCounter = this.enemySpawnDelay;
		}
	}	

	// check if there are any enemies to spawn
	if (this.enemiesToSpawn.length > 0) {
		// update enemy spawn counter
		if (this.enemySpawnCounter > 0) {
			--this.enemySpawnCounter;

			// check if the counter has elapsed
			if (this.enemySpawnCounter == 0) {
				this.enemySpawnCounter = this.enemySpawnDelay;
				var enemy = this.enemiesToSpawn.pop();
				enemy.setVisible(true);
				this.enemys.push(enemy);
			}
		}

		if (this.enemiesToSpawn.length == 0) {
			this.formationCounter = this.formationDelay;
		}
	}
};

EnemyManager.prototype.createFormation = function() {
	var positionIndex = Math.round(Math.random() * this.angles.length);
	var numEnemiesInFormation = 1 + Math.round(Math.random() * 5);

	for (var i = 0; i < numEnemiesInFormation; ++i) {
		var enemy = new Enemy(this.angles, positionIndex);
		enemy.setVisible(false);
		this.enemiesToSpawn.push(enemy);
	}
};