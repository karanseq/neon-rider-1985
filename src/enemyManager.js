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
		if(this.enemys[i].radius > RADIUS[1] - 5 || this.enemys[i].layerIndex < 0)
		{
			if(this.enemys[i].type == 2 || this.enemys[i].type == 3);
				//Game.sound.play('enemy_hit');

	
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
				if(!this.enemys[i].isRotate)
					this.createBullet(this.enemys[i]);
				this.enemys[i].shootFlag = false;
			}

		}
	}
};

EnemyManager.prototype.hitEnemy = function(enemyIndex){
	this.enemys[enemyIndex].health--;
	var enemyScore = 0;

	if(this.enemys[enemyIndex].health == 0) {
		
		enemyScore = this.enemys[enemyIndex].score;
		this.deleteEnemy(enemyIndex);
	}
	else if(this.enemys[enemyIndex].type ==2)
	{
		Game.sound.play('enemy_hit');
	}
	else if(this.enemys[enemyIndex].type == 3)
	{
		Game.sound.play('cover_hit');  
	    // emit barricade hit particles
	    barricadeHitEmitter.x = this.enemys[enemyIndex].position.x;
	    barricadeHitEmitter.y = this.enemys[enemyIndex].position.y;
	    var scaled = this.enemys[enemyIndex].scale.x * barricadeHitEmitter.baseScale;
	    barricadeHitEmitter.setScale(scaled, 0, scaled, 0, barricadeHitEmitter.lifespan, undefined, false);
	    barricadeHitEmitter.explode(barricadeHitEmitter.lifespan, 4);

	    setParticleTint(sparkEmitter, 0x39c7ff);
	    setParticleSpeed(sparkEmitter, 100);
	    sparkEmitter.x = this.enemys[enemyIndex].position.x;
	    sparkEmitter.y = this.enemys[enemyIndex].position.y;
	    sparkEmitter.explode(sparkEmitter.lifespan, 8);

		if(this.enemys[enemyIndex].health == 6)
			this.enemys[enemyIndex].changeSprite('enemy4-2', 0x39c7ff);
		else if(this.enemys[enemyIndex].health == 3)
			this.enemys[enemyIndex].changeSprite('enemy4-3', 0x39c7ff);
	}

	return enemyScore;
}

EnemyManager.prototype.deleteEnemy = function(enemyIndex){
    var temp = this.enemys[enemyIndex];
    sparkEmitter.x = temp.position.x;
    sparkEmitter.y = temp.position.y;
    setParticleSpeed(sparkEmitter, 100);

    // emit particles
    switch (temp.type) {
        case temp.EnemyType.STRAIGHT_FORWARD:
            kamikazeDestructionEmitter.x = temp.position.x;
            kamikazeDestructionEmitter.y = temp.position.y;
            kamikazeExplosionEmitter.x = temp.position.x;
            kamikazeExplosionEmitter.y = temp.position.y;
            var scaled1 = temp.scale.x * kamikazeDestructionEmitter.baseScale;
            var scaled2 = temp.scale.x * kamikazeExplosionEmitter.baseScale;
            kamikazeDestructionEmitter.setScale(scaled1, 0, scaled1, 0, kamikazeDestructionEmitter.lifespan, undefined, false);
            kamikazeExplosionEmitter.setScale(scaled2, 0, scaled2, 0, kamikazeExplosionEmitter.lifespan, undefined, false);
            kamikazeDestructionEmitter.explode(kamikazeDestructionEmitter.lifespan, 6);

            setParticleTint(sparkEmitter, 0xf26a4d);
            sparkEmitter.explode(sparkEmitter.lifespan, 8);

            var speed = kamikazeExplosionEmitter.speed;

            // explode center
            kamikazeExplosionEmitter.minParticleSpeed = new Phaser.Point(-speed, -speed);
            kamikazeExplosionEmitter.maxParticleSpeed = new Phaser.Point(speed, speed);
            kamikazeExplosionEmitter.explode(kamikazeExplosionEmitter.lifespan, 2);

            // explode left
            var l = left(temp.position);
            kamikazeExplosionEmitter.minParticleSpeed = new Phaser.Point(l.x * speed / 2, l.y * speed / 2);
            kamikazeExplosionEmitter.maxParticleSpeed = new Phaser.Point(l.x * speed, l.y * speed);
            kamikazeExplosionEmitter.explode(kamikazeExplosionEmitter.lifespan, 2);

            // explode right
            var r = right(temp.position);
            kamikazeExplosionEmitter.minParticleSpeed = new Phaser.Point(r.x * speed / 2, r.y * speed / 2);
            kamikazeExplosionEmitter.maxParticleSpeed = new Phaser.Point(r.x * speed, r.y * speed);
            kamikazeExplosionEmitter.explode(kamikazeExplosionEmitter.lifespan, 2);
            break;

        case temp.EnemyType.ROTATE_FORWARD:
            gruntDestructionEmitter.x = temp.position.x;
            gruntDestructionEmitter.y = temp.position.y;
            var scaled = temp.scale.x * gruntDestructionEmitter.baseScale;
            gruntDestructionEmitter.setScale(scaled, 0, scaled, 0, gruntDestructionEmitter.lifespan, undefined, false);
            gruntDestructionEmitter.explode(gruntDestructionEmitter.lifespan, 6);
            setParticleTint(sparkEmitter, 0xfff265);
            sparkEmitter.explode(sparkEmitter.lifespan, 8);
            break;

        case temp.EnemyType.GUN:
            turretDestructionEmitter.x = temp.position.x;
            turretDestructionEmitter.y = temp.position.y;
            var scaled = temp.scale.x * turretDestructionEmitter.baseScale;
            turretDestructionEmitter.setScale(scaled, 0, scaled, 0, turretDestructionEmitter.lifespan, undefined, false);
            turretDestructionEmitter.explode(turretDestructionEmitter.lifespan, 6);
            setParticleTint(sparkEmitter, 0x3df518);
            sparkEmitter.explode(sparkEmitter.lifespan, 8);
            break;

        case temp.EnemyType.BLOCK:
            barricadeDestructionEmitter.x = temp.position.x;
            barricadeDestructionEmitter.y = temp.position.y;
            var scaled = temp.scale.x * barricadeDestructionEmitter.baseScale;
            barricadeDestructionEmitter.setScale(scaled, 0, scaled, 0, barricadeDestructionEmitter.lifespan, undefined, false);
            barricadeDestructionEmitter.explode(barricadeDestructionEmitter.lifespan, 8);
            setParticleTint(sparkEmitter, 0x3df518);
            sparkEmitter.explode(sparkEmitter.lifespan, 8);
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
		if(this.bullets[i].radius > RADIUS[1] - 5)
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