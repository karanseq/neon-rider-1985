// Player Shoot Particle

var playerShootEmitter;

function createPlayerShootEmitter() {

    playerShootEmitter = Game.add.emitter(0, 0, 64);

    playerShootEmitter.makeParticles(['glow_particle']);

    playerShootEmitter.lifespan = 3000;

    playerShootEmitter.frequency = 0;

    playerShootEmitter.gravity = 0;

    playerShootEmitter.autoScale = true;
    playerShootEmitter.autoAlpha = true;

    playerShootEmitter.setAlpha(1, 0, playerShootEmitter.lifespan, undefined, false);
    playerShootEmitter.setScale(0.2, 0, 0.2, 0, playerShootEmitter.lifespan, undefined, false);

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

    gruntDestructionEmitter = Game.add.emitter(0, 0, 8);

    gruntDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6', 'glow_particle']);

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

    kamikazeDestructionEmitter = Game.add.emitter(0, 0, 8);

    kamikazeDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6', 'glow_particle']);

    kamikazeDestructionEmitter.lifespan = 3000;

    kamikazeDestructionEmitter.frequency = 0;

    kamikazeDestructionEmitter.gravity = 0;

    kamikazeDestructionEmitter.autoScale = true;
    kamikazeDestructionEmitter.autoAlpha = true;

    kamikazeDestructionEmitter.baseScale = 1;

    kamikazeDestructionEmitter.setAlpha(1, 0, kamikazeDestructionEmitter.lifespan, undefined, false);
    kamikazeDestructionEmitter.setScale(kamikazeDestructionEmitter.baseScale, 0, kamikazeDestructionEmitter.baseScale, 0, kamikazeDestructionEmitter.lifespan, undefined, false);

    kamikazeDestructionEmitter.forEach(function (particle) {
        particle.tint = 0xf26a4d;
    });
}

// Turret Destruction Particle
// (when turrets are killed)

var turretDestructionEmitter;

function createTurretDestructionEmitter() {

    turretDestructionEmitter = Game.add.emitter(0, 0, 8);

    turretDestructionEmitter.makeParticles(['enemy2_particle1', 'enemy2_particle2', 'enemy2_particle3', 'enemy2_particle4', 'enemy2_particle5', 'enemy2_particle6', 'glow_particle']);

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
    kamikazeExplosionEmitter = Game.add.emitter(0, 0, 3);

    kamikazeExplosionEmitter.makeParticles(['explosion']);

    kamikazeExplosionEmitter.lifespan = 2000;

    kamikazeExplosionEmitter.frequency = 0;

    kamikazeExplosionEmitter.gravity = 0;

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

    barricadeHitEmitter = Game.add.emitter(0, 0, 32);

    barricadeHitEmitter.makeParticles(['barricade_particle', 'glow_particle']);

    barricadeHitEmitter.lifespan = 1500;

    barricadeHitEmitter.frequency = 0;

    barricadeHitEmitter.gravity = 0;

    barricadeHitEmitter.autoScale = true;
    barricadeHitEmitter.autoAlpha = true;

    barricadeHitEmitter.baseScale = 0.9;

    barricadeHitEmitter.setAlpha(1, 0, barricadeHitEmitter.lifespan, undefined, false);
    barricadeHitEmitter.setScale(createBarricadeHitEmitter.baseScale, 0, createBarricadeHitEmitter.baseScale, 0, barricadeHitEmitter.lifespan, undefined, false);

    barricadeHitEmitter.forEach(function (particle) {
        particle.tint = 0x39c7ff;
    });
}

// Barricade Destruction Particle
// (when barricade are killed)

var barricadeDestructionEmitter;

function createBarricadeDestructionEmitter() {

    barricadeDestructionEmitter = Game.add.emitter(0, 0, 8);

    barricadeDestructionEmitter.makeParticles(['barricade_particle', 'glow_particle']);

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