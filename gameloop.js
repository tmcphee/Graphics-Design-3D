function gameloop(sphere, shader, gl) {
    if (Math.floor(Math.random() * 100) < 1 ) {
        var temp = sphere[0].getRandomPoint();
        if (sphere.length < 16) {
            var x = parseFloat(temp[0])
            var y = parseFloat(temp[1])
            var z = parseFloat(temp[2])
        }
            return (new Sphere(x,y,z, 0.05, shader, gl));
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
    circles.map(x => {
        if (x.getRadius() < 0.3 && !x.getPetri()) {
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
    return circles;
}

function endGame(circles) {
    var count = 0;
    for (var i = 0; i < circles.length; i++) {
        if (circles[i].getComplete() == true)
            count += 1;
    }
    if (count > 2)
        return true;
    return false;
}
function drawGameOver(ctx) {
    ctx.canvas.style.display = 'initial'
    ctx.font = "32px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5", "red");
    gradient.addColorStop("1.0", "cyan");
    ctx.fillStyle = gradient;
    ctx.fillText("GAMEOVER", 1, 30);
}