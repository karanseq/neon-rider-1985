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

	this.formationDelay = 75;
	this.enemySpawnDelay = 50;
};

EnemyManager.prototype.startFormations = function() {
	if (this.hasStartFormation == true) {
		return;
	}
	this.hasStartFormation = true;
	this.formationCounter = Math.round(this.formationDelay * 0.1);
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
	for (var i = 0; i < this.enemys.length; i++) {
		this.enemys[i].update();

		if (this.enemys[i].type == EnemyType.ENEMY_SHOOTING && this.enemys[i].isReadyToFire == true) {
			this.createBullet(this.enemys[i]);
		}

		if (this.enemys[i].hasFinishedDying == true) {
			var temp = this.enemys[i];
			this.enemys[i] = this.enemys[this.enemys.length - 1];
			temp.destroy();
			delete temp;
			this.enemys.pop();
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
		var enemy = new Enemy(this.getEnemyType(), this.angles, positionIndex);
		enemy.setVisible(false);
		this.enemiesToSpawn.push(enemy);
	}
};

EnemyManager.prototype.getEnemyType = function () {
	return EnemyType.ENEMY_MOVING;

	var randomIndex = Math.round(Math.random() * EnemyType.ENEMY_SHOOTING);
	switch (randomIndex) {
		case 0:
		return EnemyType.ENEMY_SIMPLE;
		case 1:
		return EnemyType.ENEMY_ROTATING;
		case 2:
		return EnemyType.ENEMY_MOVING;
		case 3:
		return EnemyType.ENEMY_SHOOTING;
	}
};