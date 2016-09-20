var EnemyManager = function(){
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;

	this.enemyMoveSpeed = 1;
	this.enemyScaleSpeed = 0.001;
	this.enemyBulletMoveSpeed = 2;
	this.enemyBulletScaleSpeed = 0.001;

	this.hasStartFormation = false;
	this.formationDelay = 0;
	this.formationDelayCounter = 0;

	this.enemySpawnDelay = 0;
	this.enemySpawnDelayCounter = 0;
	this.enemiesToSpawn = null;
};

EnemyManager.prototype.init = function() {
	this.enemys = new Array();
	this.bullets = new Array();

	this.enemiesToSpawn = new Array();
	this.formationDelay = 100;
	this.enemySpawnDelay = 25;
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

EnemyManager.prototype.startFormations = function() {
	if (this.hasStartFormation == true) {
		return;
	}
	this.hasStartFormation = true;
	this.createFormation();
};

EnemyManager.prototype.createEnemy = function(angleIndex){
	var enemy = new Enemy(angleIndex);
	this.enemys.push(enemy);
};

EnemyManager.prototype.update = function() {
	this.updateEnemy();
	this.updateBullets();
	this.updateFormation();
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
};

EnemyManager.prototype.deleteEnemy = function(enemyIndex){
	var temp = this.enemys[enemyIndex];
	this.enemys[enemyIndex] = this.enemys[this.enemys.length - 1];
	temp.destroy();
	delete temp;
	this.enemys.pop();
};

EnemyManager.prototype.createBullet = function(enemy){
	var bullet = enemy.createBullet();
		this.bullets.push(bullet);
};

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
};

EnemyManager.prototype.deleteBullet = function(bulletIndex){
	var temp = this.bullets[bulletIndex];
	this.bullets[bulletIndex] = this.bullets[this.bullets.length - 1];
	temp.destroy();
	delete temp;
	this.bullets.pop();
};

EnemyManager.prototype.updateFormation = function() {

	// update formation counter
	if (this.formationDelayCounter > 0) {
		--this.formationDelayCounter;

		// check if a new formation is required
		if (this.formationDelayCounter == 0) {
			this.createFormation();
		}
	}

	// check if there are any enemies left to spawn
	if (this.enemiesToSpawn.length > 0) {
		// update enemy spawn counter
		if (this.enemySpawnDelayCounter > 0) {
			--this.enemySpawnDelayCounter;

			// check if the counter has elapsed
			if (this.enemySpawnDelayCounter == 0) {
				this.enemySpawnDelayCounter = this.enemySpawnDelay;
				var enemy = this.enemiesToSpawn.pop();
				enemy.setVisible(true);
				this.enemys.push(enemy);
			}
		}

		// check if all enemies have spawned
		if (this.enemiesToSpawn.length == 0) {
			// spawn the next formation
			this.formationDelayCounter = this.formationDelay;
		}
	}
};

EnemyManager.prototype.createFormation = function() {
	var numEnemiesInFormation = this.getNumEnemiesInFormation();

	// create enemies and add them to a spawning list
	for (var i = 0; i < numEnemiesInFormation; ++i) {
		var enemy = new Enemy();
		enemy.setVisible(false);
		this.enemiesToSpawn.push(enemy);
	}

	// start spawning enemies
	this.enemySpawnDelayCounter = this.enemySpawnDelay;
};

EnemyManager.prototype.getNumEnemiesInFormation = function() {
	// TODO: replace with actual logic
	return 5;
};