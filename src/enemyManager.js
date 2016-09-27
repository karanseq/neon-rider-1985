var EnemyManager = function(){
	this.enemys = null;
	this.bullets = null;
	this.enemyShootChance = 0.01;

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
	this.formationDelay = 15;
	this.enemySpawnDelay = 1;
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

EnemyManager.prototype.startFormations = function(enemies) {
	if (this.hasStartFormation == true) {
		return;
	}
	this.hasStartFormation = true;
	this.createFormation(enemies);
};

// EnemyManager.prototype.createEnemy = function(angleIndex, enemyType){
// 	var enemy = new Enemy(angleIndex, enemyType);
// 	this.enemys.push(enemy);
// };

EnemyManager.prototype.update = function() {
	this.updateEnemy();
	this.updateBullets();
	this.updateFormation();
};

EnemyManager.prototype.updateEnemy = function(){
	for(var i=0;i<this.enemys.length;i++)
	{
		if(this.enemys[i].radius > RADIUS[1] - 15 || this.enemys[i].layerIndex < 0)
		{
			this.deleteEnemy(i);
		}
		else
		{
			this.enemys[i].update();
			
			// avoid collision between enemys
			if(this.enemys[i].type == 2 )
			{
				for(var j=0;j<this.enemys.length;j++)
				{
					if(this.enemys[j].type == 3 && this.enemys[i].layerIndex == this.enemys[j].layerIndex)
					{
						if(this.enemys[i].rotateLeft && (this.enemys[j].angleIndex + 1) % MAX_ANGLE_INDEX == this.enemys[i].angleIndex)
							this.enemys[i].rotateLeft = false;
						else if(!this.enemys[i].rotateLeft && (this.enemys[i].angleIndex + 1) % MAX_ANGLE_INDEX == this.enemys[j].angleIndex)
						 	this.enemys[i].rotateLeft = true;
					}
				}
			}
			// shoot bullet
			if(this.enemys[i].type == 2 && this.enemys[i].shootFlag)
			{
				//enemy can not create bullet when they are roatating
				if(!this.enemys[i].isRotate && this.enemys[i].radius < RADIUS[0] * 0.5)
					this.createBullet(this.enemys[i]);
				this.enemys[i].shootFlag = false;
			}

		}
	}
};

EnemyManager.prototype.hitEnemy = function(enemyIndex){
	this.enemys[enemyIndex].health--;
	if(this.enemys[enemyIndex].health == 0)
		this.deleteEnemy(enemyIndex);
	else if(this.enemys[enemyIndex].type == 3)
	{
	    // emit barricade hit particles
	    barricadeHitEmitter.position = this.enemys[enemyIndex].position;
	    var scaled = this.enemys[enemyIndex].scale.x * barricadeHitEmitter.baseScale;
	    barricadeHitEmitter.setScale(scaled, 0, scaled, 0, barricadeHitEmitter.lifetime, undefined, false);
	    barricadeHitEmitter.explode(barricadeHitEmitter.lifetime, 4);

		if(this.enemys[enemyIndex].health == 6)
			this.enemys[enemyIndex].changeSprite('enemy4-2', 0x39c7ff);
		else if(this.enemys[enemyIndex].health == 3)
			this.enemys[enemyIndex].changeSprite('enemy4-3', 0x39c7ff);
	}
}

EnemyManager.prototype.deleteEnemy = function(enemyIndex){
    var temp = this.enemys[enemyIndex];

    // emit particles
    switch (temp.type) {
        case temp.EnemyType.STRAIGHT_FORWARD:
            kamikazeDestructionEmitter.position = temp.position;
            var scaled = temp.scale.x * kamikazeDestructionEmitter.baseScale;
            kamikazeDestructionEmitter.setScale(scaled, 0, scaled, 0, kamikazeDestructionEmitter.lifetime, undefined, false);
            kamikazeDestructionEmitter.explode(kamikazeDestructionEmitter.lifetime, 6);
            break;
        case temp.EnemyType.ROTATE_FORWARD:
            gruntDestructionEmitter.position = temp.position;
            var scaled = temp.scale.x * gruntDestructionEmitter.baseScale;
            gruntDestructionEmitter.setScale(scaled, 0, scaled, 0, gruntDestructionEmitter.lifetime, undefined, false);
            gruntDestructionEmitter.explode(gruntDestructionEmitter.lifetime, 6);
            break;
        case temp.EnemyType.BLOCK:
            barricadeDestructionEmitter.position = temp.position;
            var scaled = temp.scale.x * barricadeDestructionEmitter.baseScale;
            barricadeDestructionEmitter.setScale(scaled, 0, scaled, 0, barricadeDestructionEmitter.lifetime, undefined, false);
            barricadeDestructionEmitter.explode(barricadeDestructionEmitter.lifetime, 8);
            break;
    }

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
		if(this.bullets[i].radius > RADIUS[1] - 15)
			this.deleteBullet(i);
		else
			this.bullets[i].update();
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

EnemyManager.prototype.createFormation = function(enemies) {
	// check if there are any enemies to spawn
	if (enemies == null) {
		return;
	}

	// pick an initial angle index
	var initialAngleIndex = Math.floor(Math.random() * ANGLES.length);
	var angleCounter = -1;

	// get the formation pattern
	var formationPattern = this.getFormationPattern(enemies);
	console.log("Spawning enemy types:" + formationPattern);

	// create enemies and add them to a spawning list
	for (var i = 0; i < formationPattern.length; ++i) {
		if (initialAngleIndex + ++angleCounter >= ANGLES.length) {
			angleCounter = -initialAngleIndex;
		}

		var angleIndex = initialAngleIndex + angleCounter;
		var enemy = new Enemy(angleIndex, formationPattern[i]);
		enemy.setVisible(false);
		this.enemiesToSpawn.push(enemy);
	}

	// start spawning enemies
	this.enemySpawnDelayCounter = this.enemySpawnDelay;
};

EnemyManager.prototype.getFormationPattern = function(enemies) {
	var count = 0;
	var formationPattern = [];

	// get the required number of enemies for this formation
	var numEnemiesInFormation = enemies.min + Math.floor(Math.random() * (enemies.max - enemies.min));

	// get the maximum types of enemies for this formation
	var enemyTypesInFormation = enemies.types;

	// randomly pick one or more of the enemy types
	var actualEnemyTypes = enemyTypesInFormation;//.slice(0, Math.ceil(Math.random() * enemyTypesInFormation.length));

	// keep filling enemy types till we're full
	while (formationPattern.length < numEnemiesInFormation) {
		// fill one of each type
		for (var i = 0; i < actualEnemyTypes.length; ++i) {
			formationPattern.push(actualEnemyTypes[i]);
		}
	}

	// trim excess
	formationPattern = formationPattern.slice(0, numEnemiesInFormation);

	return formationPattern;
};