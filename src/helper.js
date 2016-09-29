var CONFIG = null;


var titleImageSet =[ 
 { key: 'title', src: 'images/title.png' },
 { key: 'titleBackground', src: 'images/bg.png' }, 
 { key: 'startMenu', src: 'images/StartMenu.png' }
]

var titleAudioSet = [
 { key: 'titleBackgroundMusic', src: 'audio/Theme.ogg' },
  
]

var imageSet = [ { key: 'layer', src: 'images/Ring.png' },
{ key: 'player', src: 'images/Player.png'},
{ key: 'player_health_full', src: 'images/PlayerFullHealth.png'},
{ key: 'player_health_med', src: 'images/PlayerMidHealth.png'},
{ key: 'player_health_low', src: 'images/PlayerLowHealth.png'},
{ key: 'player_dash_3', src: 'images/Tempest_DashIcon_Behind_3Charge.png'},
{ key: 'player_dash_2', src: 'images/Tempest_DashIcon_Behind_2Charge.png'},
{ key: 'player_dash_1', src: 'images/Tempest_DashIcon_Behind_1Charge.png'},
{ key: 'player_dash_0', src: 'images/Tempest_DashIcon_Behind_Empty.png'},
{ key: 'playerbullet', src: 'images/PlayerBullet01.png'},
{ key: 'enemy1', src: 'images/Enemy1.png'},
{ key: 'enemy2', src: 'images/Enemy2.png'},
{ key: 'enemy3', src: 'images/Enemy3.png'},
{ key: 'enemy4-1', src: 'images/Enemy4-1.png'},
{ key: 'enemy4-2', src: 'images/Enemy4-2.png'},
{ key: 'enemy4-3', src: 'images/Enemy4-3.png'},
{ key: 'enemy2_particle1', src: 'images/enemy2_particle1.png' },
{ key: 'enemy2_particle2', src: 'images/enemy2_particle2.png' },
{ key: 'enemy2_particle3', src: 'images/enemy2_particle3.png' },
{ key: 'enemy2_particle4', src: 'images/enemy2_particle4.png' },
{ key: 'enemy2_particle5', src: 'images/enemy2_particle5.png' },
{ key: 'enemy2_particle6', src: 'images/enemy2_particle6.png' },
{ key: 'glow_particle', src: 'images/glow_particle.png' },
{ key: 'explosion', src: 'images/explosion.png' },
{ key: 'barricade_particle', src: 'images/barricade_particle.png' },
{ key: 'enemybullet', src:'images/EnemyBullet01.png'},
{ key: 'playerExplosion', src:'images/PlayerExplosion.png'},
{ key: 'background', src: 'images/Tempest_Background.png' },
{ key: 'level_finish', src: 'images/level_finish.png' },
{ key: 'game_over', src: 'images/game_over.png' }];

var fontSet = [{ key: 'carrier_command', img: 'fonts/carrier_command.png', data: 'fonts/carrier_command.xml' }];

var audioSet = [
    { key: 'player_death', src: 'audio/player_death.ogg' },
    { key: 'player_dash', src: 'audio/player_dash.ogg' },
    { key: 'player_shoot', src: 'audio/player_shoot.ogg' },
    { key: 'player_move', src: 'audio/player_move.ogg' },
    { key: 'ring_blink', src: 'audio/ring_blink.ogg' },
    { key: 'mainBackgroundMusic1', src: 'audio/Action1.ogg' },
    { key: 'mainBackgroundMusic2', src: 'audio/Action2.ogg' }
];

var levelSet = [
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 2, maxEnemiesInFormation: 5 },
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 3, maxEnemiesInFormation: 7 },
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 4, maxEnemiesInFormation: 10 }
];

var levelFileSet = [
	{ key: 'level_template', src: 'data/level_template.json' },
	{ key: 'level_1', src: 'data/level_1.json' },
	{ key: 'level_2', src: 'data/level_2.json' },
	{ key: 'level_3', src: 'data/level_3.json' },
	{ key: 'level_4', src: 'data/level_4.json' },
	{ key: 'level_5', src: 'data/level_5.json' }
];

// we should have one more value than the number of visible layers
var layerScale = [0.725, 0.575, 0.455, 0.36, 0.285, 0.2275, 0.18, 0.15, 0.12];

var RADIUS = [];
RADIUS[0] = 430 * 0.8;
for(var i = 1; i<layerScale.length; i++)
{
	RADIUS[i] = 430 *(layerScale[i - 1] + layerScale[i]) / 2;
}
var ANGLES = [-180, -135, -90, -45, 0, 45, 90, 135];

var MAX_ANGLE_INDEX = ANGLES.length;


var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;

var BULLET_COLLISION_DISTANCE = 10;
var ENEMY_COLLISION_DISTANCE = 20;
var PLAYER_COLLISION_DISTANCE = 20;

var BULLET_SCALE = {x:0.1, y:0.1};
var PLAYER_SCALE = {x:0.25, y:0.25};
var PLAYER_EXPLOSION_SCALE = { x: 0.1, y: 0.1 };

var MAX_PARTICLES = 1000;

var LAYER_IS_ANIMATION = false;

var LAYER_ANIMATION_TIMER = 30;
var PROTECT_LAYER_ANIMATION_TIMER = 31;

var caculatePosition = function(radius, angle)
{
	var pos = {x: GAME_WIDTH / 2 + radius * Math.sin(angle / 180 * Math.PI), y: GAME_HEIGHT / 2 + radius * Math.cos(angle / 180 * Math.PI)};
	return pos;
}

function getRegularPolygonVertices(numVertices, circumRadius, startAngle) {
	var vertices = new Array();
	var deltaTheta = 2 * Math.PI / numVertices;
	var theta = startAngle;
	for(var i = 0; i < numVertices; ++i, theta += deltaTheta)
	{
		vertices.push(new Phaser.Point(circumRadius * Math.cos(theta), circumRadius * Math.sin(theta)));
	}
	vertices.push(vertices[0]);
	return vertices;
}

function forward(angle) {
    var rad = angle * Math.PI / 180 + Math.PI / 2;
    return { x: Math.cos(rad), y: -Math.sin(rad) };
}

function backward(angle) {
    var rad = angle * Math.PI / 180 - Math.PI / 2;
    return { x: Math.cos(rad), y: -Math.sin(rad) };
}

function right(angle) {
    var rad = angle * Math.PI / 180;
    return { x: Math.cos(rad), y: -Math.sin(rad) };
}

function left(angle) {
    var rad = angle * Math.PI / 180 + Math.PI;
    return { x: Math.cos(rad), y: -Math.sin(rad) };
}
