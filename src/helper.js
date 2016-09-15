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
