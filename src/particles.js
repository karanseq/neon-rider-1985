// Player Shoot Particle

var playerShootEmitter;

function createPlayerShootEmitter() {

    playerShootEmitter = Game.add.emitter(0, 0, 128);

    playerShootEmitter.makeParticles(['glow_particle']);

    playerShootEmitter.lifespan = 1000;

    playerShootEmitter.frequency = 0;

    playerShootEmitter.gravity = 0;

    playerShootEmitter.speed = 100;

    playerShootEmitter.autoScale = true;
    playerShootEmitter.autoAlpha = true;

    playerShootEmitter.baseScale = 0.5;

    playerShootEmitter.setAlpha(1, 0, playerShootEmitter.lifespan, undefined, false);
    playerShootEmitter.setScale(0, playerShootEmitter.baseScale, 0, playerShootEmitter.baseScale, playerShootEmitter.lifespan, undefined, false);

    //playerShootEmitter.forEach(function (particle) {
    //    particle.tint = 0xfff265;
   // });
}

// Ring Destruction Main Particle
// (large ring fragments)

// Ring Destruction Mini Particle
// (small ring pieces)

// Grunt Destruction Particle
// (when grunts are killed)

var gruntDestructionEmitter;

function createGruntDestructionEmitter() {
    gruntDestructionEmitter = Game.add.emitter(0, 0, 128);
    gruntDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6']);
    gruntDestructionEmitter.lifespan = 3000;
    gruntDestructionEmitter.frequency = 0;
    gruntDestructionEmitter.gravity = 0;
    gruntDestructionEmitter.autoScale = true;
    gruntDestructionEmitter.autoAlpha = true;
    gruntDestructionEmitter.baseScale = 2;
    gruntDestructionEmitter.setAlpha(1, 0, gruntDestructionEmitter.lifespan, undefined, false);
    gruntDestructionEmitter.setScale(gruntDestructionEmitter.baseScale, 0, gruntDestructionEmitter.baseScale, 0, gruntDestructionEmitter.lifespan, undefined, false);
    gruntDestructionEmitter.forEach(function (particle) {
        particle.tint = 0xfff265;
    });
}

// Kamikaze Destruction Particle
// (when kamikaze are killed)

var kamikazeDestructionEmitter;

function createKamikazeDestructionEmitter() {
    kamikazeDestructionEmitter = Game.add.emitter(0, 0, 128);
    kamikazeDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6']);
    kamikazeDestructionEmitter.lifespan = 3000;
    kamikazeDestructionEmitter.frequency = 0;
    kamikazeDestructionEmitter.gravity = 0;
    kamikazeDestructionEmitter.speed = 300;
    kamikazeDestructionEmitter.autoScale = true;
    kamikazeDestructionEmitter.autoAlpha = true;
    kamikazeDestructionEmitter.baseScale = 1;
    kamikazeDestructionEmitter.setAlpha(1, 0, kamikazeDestructionEmitter.lifespan, undefined, false);
    kamikazeDestructionEmitter.setScale(kamikazeDestructionEmitter.baseScale, 0, kamikazeDestructionEmitter.baseScale, 0, kamikazeDestructionEmitter.lifespan, undefined, false);
    kamikazeDestructionEmitter.minParticleSpeed = new Phaser.Point(-kamikazeDestructionEmitter.speed, -kamikazeDestructionEmitter.speed);
    kamikazeDestructionEmitter.maxParticleSpeed = new Phaser.Point(kamikazeDestructionEmitter.speed, kamikazeDestructionEmitter.speed);
    kamikazeDestructionEmitter.forEach(function (particle) {
        particle.tint = 0xf26a4d;
    });
}

// Turret Destruction Particle
// (when turrets are killed)

var turretDestructionEmitter;

function createTurretDestructionEmitter() {
    turretDestructionEmitter = Game.add.emitter(0, 0, 128);
    turretDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6']);
    turretDestructionEmitter.lifespan = 3000;
    turretDestructionEmitter.frequency = 0;
    turretDestructionEmitter.gravity = 0;
    turretDestructionEmitter.autoScale = true;
    turretDestructionEmitter.autoAlpha = true;
    turretDestructionEmitter.baseScale = 1;
    turretDestructionEmitter.setAlpha(1, 0, turretDestructionEmitter.lifespan, undefined, false);
    turretDestructionEmitter.setScale(turretDestructionEmitter.baseScale, 0, turretDestructionEmitter.baseScale, 0, turretDestructionEmitter.lifespan, undefined, false);
    turretDestructionEmitter.forEach(function (particle) {
        particle.tint = 0x3df518;
    });
}

var kamikazeExplosionEmitter;

function createKamikazeExplosionEmitter() {
    kamikazeExplosionEmitter = Game.add.emitter(0, 0, 128);
    kamikazeExplosionEmitter.makeParticles(['explosion']);
    kamikazeExplosionEmitter.lifespan = 1000;
    kamikazeExplosionEmitter.frequency = 0;
    kamikazeExplosionEmitter.gravity = 0;
    kamikazeExplosionEmitter.speed = 200;
    kamikazeExplosionEmitter.autoScale = true;
    kamikazeExplosionEmitter.autoAlpha = true;
    kamikazeExplosionEmitter.baseScale = 10;
    kamikazeExplosionEmitter.setAlpha(1, 0, kamikazeExplosionEmitter.lifespan, undefined, false);
    kamikazeExplosionEmitter.setScale(0, kamikazeExplosionEmitter.baseScale, 0, kamikazeExplosionEmitter.baseScale, kamikazeExplosionEmitter.lifespan, undefined, false);
}

// Barricade Hit Particle
// (when barricade are hit)

var barricadeHitEmitter;

function createBarricadeHitEmitter() {
    barricadeHitEmitter = Game.add.emitter(0, 0, 128);
    barricadeHitEmitter.makeParticles(['barricade_particle']);
    barricadeHitEmitter.lifespan = 1500;
    barricadeHitEmitter.frequency = 0;
    barricadeHitEmitter.gravity = 0;
    barricadeHitEmitter.autoScale = true;
    barricadeHitEmitter.autoAlpha = true;
    barricadeHitEmitter.baseScale = 0.9;
    barricadeHitEmitter.speed = 150;
    barricadeHitEmitter.setAlpha(1, 0, barricadeHitEmitter.lifespan, undefined, false);
    barricadeHitEmitter.setScale(createBarricadeHitEmitter.baseScale, 0, createBarricadeHitEmitter.baseScale, 0, barricadeHitEmitter.lifespan, undefined, false);
    barricadeHitEmitter.forEach(function (particle) {
        particle.tint = 0x39c7ff;
    });
    barricadeHitEmitter.minParticleSpeed = new Phaser.Point(-barricadeHitEmitter.speed, -barricadeHitEmitter.speed);
    barricadeHitEmitter.maxParticleSpeed = new Phaser.Point(barricadeHitEmitter.speed, barricadeHitEmitter.speed);
}

// Barricade Destruction Particle
// (when barricade are killed)

var barricadeDestructionEmitter;

function createBarricadeDestructionEmitter() {
    barricadeDestructionEmitter = Game.add.emitter(0, 0, 128);
    barricadeDestructionEmitter.makeParticles(['barricade_particle']);
    barricadeDestructionEmitter.lifespan = 2500;
    barricadeDestructionEmitter.frequency = 0;
    barricadeDestructionEmitter.gravity = 0;
    barricadeDestructionEmitter.autoScale = true;
    barricadeDestructionEmitter.autoAlpha = true;
    barricadeDestructionEmitter.baseScale = 1.5;
    barricadeDestructionEmitter.setAlpha(1, 0, barricadeDestructionEmitter.lifespan, undefined, false);
    barricadeDestructionEmitter.setScale(barricadeDestructionEmitter.baseScale, 0, barricadeDestructionEmitter.baseScale, 0, barricadeDestructionEmitter.lifespan, undefined, false);
    barricadeDestructionEmitter.forEach(function (particle) {
        particle.tint = 0x39c7ff;
    });
}

var playerBoostEmitter;

function createPlayerBoostEmitter() {
    playerBoostEmitter = Game.add.emitter(0, 0, 128);
    playerBoostEmitter.makeParticles(['glow_particle']);
    playerBoostEmitter.lifespan = 1000;
    playerBoostEmitter.frequency = 0;
    playerBoostEmitter.gravity = 0;
    playerBoostEmitter.speed = 200;
    playerBoostEmitter.autoScale = true;
    playerBoostEmitter.autoAlpha = true;
    playerBoostEmitter.baseScale = 1.5;
    playerBoostEmitter.setAlpha(1, 0, playerBoostEmitter.lifespan, undefined, false);
    playerBoostEmitter.setScale(0, playerBoostEmitter.baseScale, 0, playerBoostEmitter.baseScale, playerBoostEmitter.lifespan, undefined, false);
}

// Player Destruction Particle
// (when player are killed)

var playerDestructionEmitter;

function createPlayerDestructionEmitter() {
    playerDestructionEmitter = Game.add.emitter(0, 0, 128);
    playerDestructionEmitter.makeParticles(['player_piece1', 'player_piece2', 'player_piece3', 'player_piece4', 'player_piece5']);
    playerDestructionEmitter.lifespan = 50000;
    playerDestructionEmitter.frequency = 0;
    playerDestructionEmitter.gravity = 0;
    playerDestructionEmitter.autoScale = true;
    playerDestructionEmitter.autoAlpha = true;
    playerDestructionEmitter.baseScale = 0.35;
    playerDestructionEmitter.baseSpeed = 60;
    playerDestructionEmitter.height = 192;
    playerDestructionEmitter.width = 192;
    playerDestructionEmitter.minParticleSpeed = new Phaser.Point(-playerDestructionEmitter.baseSpeed, -playerDestructionEmitter.baseSpeed);
    playerDestructionEmitter.maxParticleSpeed = new Phaser.Point(playerDestructionEmitter.baseSpeed, playerDestructionEmitter.baseSpeed);
    playerDestructionEmitter.setAlpha(1, 0, playerDestructionEmitter.lifespan, undefined, false);
    playerDestructionEmitter.setScale(playerDestructionEmitter.baseScale, 0, playerDestructionEmitter.baseScale, 0, playerDestructionEmitter.lifespan, undefined, false);
    playerDestructionEmitter.forEach(function (particle) {
        particle.tint = 0xeccd31;
    });
}

// Spark Particle

var sparkEmitter;

function createSparkEmitter() {
    sparkEmitter = Game.add.emitter(0, 0, 512);
    sparkEmitter.makeParticles(['glow_particle']);
    sparkEmitter.lifespan = 2000;
    sparkEmitter.frequency = 0;
    sparkEmitter.gravity = 0;
    sparkEmitter.autoScale = true;
    sparkEmitter.autoAlpha = true;
    sparkEmitter.baseScale = 0.4;
    sparkEmitter.speed = 100;
    sparkEmitter.minParticleSpeed = new Phaser.Point(-sparkEmitter.speed, -sparkEmitter.speed);
    sparkEmitter.maxParticleSpeed = new Phaser.Point(sparkEmitter.speed, sparkEmitter.speed);
    sparkEmitter.setAlpha(1, 0, sparkEmitter.lifespan, undefined, false);
    sparkEmitter.setScale(sparkEmitter.baseScale, 0, sparkEmitter.baseScale, 0, sparkEmitter.lifespan, undefined, false);
}

var warpEmitter;

function createWarpEmitter() {
    warpEmitter = Game.add.emitter(0, 0, 256);
    warpEmitter.makeParticles(['glow_particle']);
    warpEmitter.lifespan = 1500;
    warpEmitter.frequency = 10;
    warpEmitter.autoScale = true;
    warpEmitter.autoAlpha = true;
    warpEmitter.baseScale = 0.6;
    warpEmitter.speed = 50;
    warpEmitter.minParticleSpeed = new Phaser.Point(-warpEmitter.speed, -warpEmitter.speed);
    warpEmitter.maxParticleSpeed = new Phaser.Point(warpEmitter.speed, warpEmitter.speed);
    warpEmitter.setAlpha(1, 0, warpEmitter.lifespan, undefined, false);
    warpEmitter.setScale(warpEmitter.baseScale, 0, warpEmitter.baseScale, 0, warpEmitter.lifespan, undefined, false);
    setParticleTint(warpEmitter, '0xFFFFFF');
}

var ringEmitter;
function createRingEmitter() {
    ringEmitter = Game.add.emitter(GAME_WIDTH / 2, GAME_HEIGHT / 2, 512);
    ringEmitter.makeParticles(['glow_particle', 'ring_particle', 'glow_particle', 'glow_particle', 'glow_particle']);
    ringEmitter.lifespan = 30000;
    ringEmitter.frequency = 0;
    ringEmitter.gravity = 0;
    ringEmitter.autoScale = false;
    ringEmitter.autoAlpha = true;
    ringEmitter.baseScale = 0.8;
    ringEmitter.speed = 125;
    ringEmitter.minParticleSpeed = new Phaser.Point(-ringEmitter.speed, -ringEmitter.speed);
    ringEmitter.maxParticleSpeed = new Phaser.Point(ringEmitter.speed, ringEmitter.speed);
    ringEmitter.setAlpha(1, 0, ringEmitter.lifespan, undefined, false);
    ringEmitter.setScale(ringEmitter.baseScale, ringEmitter.baseScale, ringEmitter.baseScale, ringEmitter.baseScale, ringEmitter.lifespan, undefined, false);
}

function setParticleTint(particleEmitter, colorHexCode, forceAll) {
    if (typeof forceAll === 'undefined') { forceAll = false; }
    particleEmitter.forEach(function (particle) {
        if (!particle.alive || forceAll) particle.tint = colorHexCode;
    });
}

function setParticleSpeed(particleEmitter, speed) {
    particleEmitter.minParticleSpeed = new Phaser.Point(-speed, -speed);
    particleEmitter.maxParticleSpeed = new Phaser.Point(speed, speed);
}