var imageSet = [ { key: 'layer', src: 'images/Ring.png' }, 
{ key: 'player', src: 'images/Player.png'},
{ key: 'bullet', src: 'images/Bullet.png'},
{ key: 'enemy', src: 'images/Enemy.png'},
{ key: 'enemybullet', src:'images/EnemyBullet.png'} ];

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
