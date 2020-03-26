function gameloop(sphere, shader, gl) {
    if (Math.floor(Math.random() * 100) < 3) {
        var temp = sphere[0].getRandomPoint();
        if (sphere.length < 12)
            return (new Sphere(parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[3]), 0.05, shader, gl));
    }
    return null;
}

function drawScore(score, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.font = "32px Verdana";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score.toFixed(2), 1, 30);
}

function checkCollision(spheres, index) {
    for (var i = 1; i < spheres.length; i++) {
        if (i == index || spheres[i] == null)
            continue;
        if (spheres[i].collision(spheres[index]))
            return i;
    }
    return -1;
}

function myScale(circles, gl, speed) {
    if (circles.length == 1)
        return circles;
    origin = circles.shift(1);
    circles.map(x => {
        if (x.getRadius() < 0.4) {
            vertices = x.getVertices()
            for (var i = 0; i < vertices.length; i += 3) {
                vertices[i] = ((vertices[i] - x.getx()) * speed) + x.getx();
                vertices[i + 1] = ((vertices[i + 1] - x.gety()) * speed) + x.gety();
                vertices[i + 2] = ((vertices[i + 2] - x.getz()) * speed) + x.getz();
            }
            x.setVertices(vertices);
            x.setRadius(x.getRadius() * speed);
            x.genBuffers(gl);
        }
        else 
            x.setComplete(true);
    });
    circles.unshift(origin)
    return circles;
}

