var imageSet = [ { key: 'layer', src: 'images/Ring.png' },
{ key: 'circle', src: 'images/Circle.png'}, 
{ key: 'player', src: 'images/Player01.png'},
{ key: 'playerbullet', src: 'images/PlayerBullet01.png'},
{ key: 'enemy1', src: 'images/Enemy01.png'},
{ key: 'enemy2', src: 'images/Enemy2.png'},
{ key: 'enemy3', src: 'images/Enemy3.png'},
{ key: 'enemybullet', src:'images/EnemyBullet01.png'},
{ key: 'playerExplosion', src:'images/PlayerExplosion.png'} ];

var fontSet = [ { key: 'carrier_command', img: 'fonts/carrier_command.png', data: 'fonts/carrier_command.xml' } ];

var levelSet = [
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 2, maxEnemiesInFormation: 5 },
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 3, maxEnemiesInFormation: 7 },
{ enemyTypes: [0, 1, 2, 3, 4], minEnemiesInFormation: 4, maxEnemiesInFormation: 10 }
];

function getRegularPolygonVertices(numVertices, circumRadius, startAngle)
{
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
