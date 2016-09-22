// Test Particle
// (used for stress tests)

var testParticleEmitter;

function createTestParticleSystem() {

    testParticleEmitter = Game.add.emitter(Game.world.centerX, 200, 200, MAX_PARTICLES);

    testParticleEmitter.makeParticles(['player']);

    testParticleEmitter.lifespan = 3000;

    testParticleEmitter.frequency = 100;

    //testParticleEmitter.minParticleAlpha = 1;

    //testParticleEmitter.maxParticleScale = 0.2;
   // testParticleEmitter.minParticleScale = 0.05;

    testParticleEmitter.on = true;

    testParticleEmitter.autoScale = true;
    testParticleEmitter.autoAlpha = true;

    testParticleEmitter.setAlpha(1, 0, testParticleEmitter.lifespan, undefined, false);
    testParticleEmitter.setScale(0.2, 0, 0.2, 0, testParticleEmitter.lifespan, undefined, false);
}

// Ring Destruction Main Particle
// (large ring fragments)

// Ring Destruction Mini Particle
// (small ring pieces)

// Grunt Enemy Destruction Particle
// (when grunts are killed)