var near = -10;
var far = 10;
var radius = 1;
var theta  = 0.0;
var phi    = 0.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function main() {
    var score = 0;

    var audio = new Audio('Assets/pop.mp3');
    
    const canvas = document.querySelector("#glCanvas");
    const scoreCanvas = document.getElementById("score");
    const goCanvas = document.getElementById("gameOver");

    // Initialize the GL context and text contexts
    const gl = canvas.getContext("webgl",  {preserveDrawingBuffer: true});
    const ctx = scoreCanvas.getContext("2d");
    const goctx = goCanvas.getContext("2d");
    goCanvas.style.display = "none";

    //Initialise vertex shader
    var vs =
       'attribute vec3 vposition; '
      +'attribute vec3 normal;'
      +'uniform mat4 projectionMatrix;'
      +'uniform mat4 modelViewMatrix;'
      +'varying vec3 v_Vertex;'
      +'varying vec3 v_Normal;'
      +'varying vec3 light_pos;'
      +'void main(){'
      +'  gl_Position = projectionMatrix * modelViewMatrix * vec4(vposition, 1.0);'
      +'}';

    //initialise fragment shader
    var fs =
    'precision mediump float;' 
    +'uniform vec4 fColor;' 
    +'void main(){' 
    +'  gl_FragColor =   1.0 * fColor;'
    +'}'

    //Compile and attach shader to GL context
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);
    var program = gl.createProgram(); 

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.enable(gl.DEPTH_TEST);

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program)
    gl.clearColor(0.0, 0.5, 0.0, 1.0);

    //Function to create a shader from input text
    function createShader(gl, sourceCode, type) {
      // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
      var shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
  
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw 'Could not compile WebGL program. shader \n\n' + info;
      }
      console.log("shader compiled succesfully!");
      return shader;
    }
  
    var intervalID = window.setInterval(function() { 
      for (var i = 0; i < particles.length; i++){
        particles[i] = null;
      }
      console.log("Got rid of them particles boss"); }, 1500);

    drawScore(score, ctx);
    
    //Create Spheres
    var spheres = [new Sphere(0, 0, 0, 0.6, program, gl)];
    spheres[0].setPetri();
    
    var particles = [];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), 
             radius*Math.cos(phi));
             
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    spheres[0].draw(canvas);

    var xStart = 0;
    var yStart = 0;
    var xEnd = 0;
    var yEnd = 0;
    var zStart = 0;
    var zEnd = 0;
    var angle = 0;
    var axis = [0,0,1];

    canvas.addEventListener("mousedown", function(event){
      xStart = 2*event.clientX/canvas.width-1;
      yStart = 2*(canvas.height-event.clientY)/canvas.height-1;
      var d = (xStart * xStart) + (yStart * yStart);
      if (d < 1.0)
        zStart = Math.sqrt(1.0 - d);
      else {
        zStart = 0.0;
        var a = 1.0 / Math.sqrt(d);
        xStart *= a;
        yStart *= a;
      }
    }); 

    canvas.addEventListener('mouseup', function(event) {
      xEnd = 2*event.clientX/canvas.width-1;
      yEnd = 2*(canvas.height-event.clientY)/canvas.height-1;
      d = (xEnd * xEnd) + (yEnd * yEnd);
      if (d < 1.0)
        zEnd = Math.sqrt(1.0 - d);
      else {
        zEnd = 0.0;
        var a = 1.0 / Math.sqrt(d);
        xEnd *= a;
        yEnd *= a;
      }
      stopMotion();
    }); 

    canvas.addEventListener('mouseout', function(event) {
      xEnd = 2*event.clientX/canvas.width-1;
      yEnd = 2*(canvas.height-event.clientY)/canvas.height-1;
      d = (xEnd * xEnd) + (yEnd * yEnd);
      if (d < 1.0)
        zEnd = Math.sqrt(1.0 - d);
      else {
        zEnd = 0.0;
        var a = 1.0 / Math.sqrt(d);
        xEnd *= a;
        yEnd *= a;
      }
      stopMotion();
    }); 

    function stopMotion() {
      angle = 0.8//Math.sqrt(Math.pow(xEnd - xStart, 2),Math.pow(yEnd - yStart, 2),Math.pow(zEnd - zStart, 2))
      axis = [(yStart * zEnd) - (zStart * yEnd), (zStart * xEnd) - (xStart * zEnd), (xStart * yEnd) - (yStart * xEnd)];
      if (!(axis[0]) && !(axis[1]) && !(axis[2])) {
        var x = event.clientX
        var y = 720 - event.clientY
        var pixels = new Uint8Array(4);
        gl.readPixels(x-2,y+2,1,1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        for (var i = 0; i < spheres.length; i++) {
          if (spheres[i] != null && !spheres[i].getPetri() && spheres[i].collisionCoordinate(pixels)) {

            for (var j = 0; j < 5; j++){
              particles.push (this.particles(spheres[i], program, gl));
            }
            audio.play();
            score = score + ((spheres[i].getRadius()) * 10)
            console.log(score)
            spheres[i] = null;
          }
        }
        console.log(x)
        console.log(y)
        spheres = spheres.filter(x => x != null);}
    }

    console.log(axis)
    window.requestAnimationFrame(animate);

    function animate(time) {
      if (spheres.length < 16) {
        var c = gameloop(spheres, program, gl);
        console.log(c)
        if (c != null) {
          spheres[spheres.length] = c;
        }
      }

      spheres = myScale(spheres, gl, 1.0006)
      
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      spheres[0].draw(canvas);
      for (var i = 1; i < spheres.length; i++) {
        if (spheres[i] == null)
          continue;
        var check = checkCollision(spheres, i)
        if (check == -1 || spheres[i].getPetri()) {
          spheres[i].draw(canvas);
        } else if (check > i) {
          spheres[i].absorb(spheres[check], gl, canvas)
          spheres[check] = null;
        } 
      }

        particles.map(x => {
          var speed = 0.9;
          if (x != null){
            if (x.getRadius() > 0.0 && !x.getPetri()) {
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
          }
        });

      for (var i = 0; i < particles.length; i++){
        if (particles[i] != null){
          if (particles[i].getRadius < 0.008){
            particles[i] = null;
          }
          particles[i].draw(canvas)
        }
      }
      spheres = spheres.filter(x => x != null);
      particles = particles.filter(x => x != null);

      if (axis[0] || axis[1] || axis[2]) {
        modelViewMatrix = mult(modelViewMatrix, rotate(angle, axis))
      }
      projectionMatrix = ortho(left, right, bottom, ytop, near, far);

      gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
      gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

      drawScore(score, ctx);
      if (!endGame(spheres))
        window.requestAnimationFrame(animate);
      else {
        window.cancelAnimationFrame(animate)
        drawGameOver(goctx)
      }
    }

  }

  function particles(s, program, gl){
    var temp = s.getRandomPoint();
    var x = parseFloat(temp[0])
    var y = parseFloat(temp[1])
    var z = parseFloat(temp[2])
    var sph = new Sphere(x,y,z, 0.025, program, gl);
    sph.setParticle();
    sph.setColour(s.getColour());
    return sph;
  }

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  } 

  window.onload = main;

