var near = -1;
var far = 1;
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

var  angle = 0.0;
var  axis = [0, 0, 1];

var 	trackingMouse = false;
var   trackballMove = false;

var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;

function main() {
    var score = 0;

    const canvas = document.querySelector("#glCanvas");
    const scoreCanvas = document.getElementById("score");
    const goCanvas = document.getElementById("gameOver");

    // Initialize the GL context and text contexts
    const gl = canvas.getContext("webgl");
    const ctx = scoreCanvas.getContext("2d");
    const goctx = goCanvas.getContext("2d");
    goCanvas.style.display = "none";

    //Initialise vertex shader
    var vs =
      'attribute vec3 vposition;'
      +'uniform mat4 projectionMatrix;'
      +'uniform mat4 modelViewMatrix;'
      +'varying lowp vec4 vColor;'
      + 'void main(){'
      + '  gl_Position = modelViewMatrix * vec4(vposition, 1.0);'
      +'vColor = vec4(vposition, 1.0);'
      + '}';

    //initialise fragment shader
    var fs =
    'precision mediump float;' +
    'uniform vec4 fColor;' +
    ' void main(){' +
    '' +
    ' gl_FragColor = fColor;'
    + '}'

    //Compile and attach shader to GL context
    var vshader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fshader = createShader(gl, fs, gl.FRAGMENT_SHADER);
    var program = gl.createProgram(); 

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program)
    gl.clearColor(0.0, 0.5, 0.0, 1.0);
    gl.depthFunc(gl.LESS);

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
  
    drawScore(score, ctx);
    
    //Create Spheres
    var spheres = [new Sphere(0, 0, 0, 0.6, program, gl), new Sphere(0,0.6,0,0.2,program,gl),new Sphere(0.6,0,0,0.2,program,gl), new Sphere(0,0,0.6,0.2,program,gl)];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    console.log(spheres[0].getVertices())

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), 
             radius*Math.cos(phi));
             
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    spheres[1].draw(canvas);
    spheres[2].draw(canvas);
    spheres[3].draw(canvas);
    spheres[0].draw(canvas);

    function trackballView( x,  y ) {
      var d, a;
      var v = [];
    
      v[0] = x;
      v[1] = y;
    
      d = v[0]*v[0] + v[1]*v[1];
      if (d < 1.0)
        v[2] = Math.sqrt(1.0 - d);
      else {
        v[2] = 0.0;
        a = 1.0 /  Math.sqrt(d);
        v[0] *= a;
        v[1] *= a;
      }
      return v;
    }

    function CalculateSurfaceNormal(X1, X2, X3, Y1, Y2, Y3, Z1, Z2, Z3){
      var U = [x, y, z];
      U.x = (X2 - X1);
      U.y = (Y2 - Y1);
      U.z = (Z2 - Z1);

      var V = [x, y, z];
      V.x = (X3 - X1);
      V.y = (Y3 - Y1);
      V.z = (Z3 - Z1);

      var Normal = [x, y, z];
      Normal.x = (U.y * V.z) - (U.z * V.y);
      Normal.y = (U.z * V.x) - (U.x * V.z);
      Normal.z = (U.x * V.y) - (U.y * V.x);

      return Normal;
    }
    
    
    function mouseMotion( x,  y)
    {
        var dx, dy, dz;
    
        var curPos = trackballView(x, y);
        if(trackingMouse) {
          dx = curPos[0] - lastPos[0];
          dy = curPos[1] - lastPos[1];
          dz = curPos[2] - lastPos[2];
    
          if (dx || dy || dz) {
             angle = -0.1 * Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    
             axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
             axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
             axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];
    
             lastPos[0] = curPos[0];
             lastPos[1] = curPos[1];
             lastPos[2] = curPos[2];
          }
        }
        animate();
    }
    
    function startMotion( x,  y)
    {
        trackingMouse = true;
        startX = x;
        startY = y;
        curx = x;
        cury = y;
    
        lastPos = trackballView(x, y);
        trackballMove=true;
    }
    
    function stopMotion( x,  y)
    {
        trackingMouse = false;
        if (startX != x || startY != y) {
        }
        else {
           angle = 0.0;
           trackballMove = false;
        }
    }
    

    canvas.addEventListener("mousedown", function(event){
      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      startMotion(x, y);
    });

    canvas.addEventListener("mouseup", function(event){
      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      stopMotion(x, y);
    });

    canvas.addEventListener("mousemove", function(event){

      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      mouseMotion(x, y);
    } );
    window.requestAnimationFrame(animate);

    function animate(time) {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if(trackballMove) {
        axis = normalize(axis);
        modelViewMatrix = mult(modelViewMatrix, rotate(angle, axis));
      }
      // eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
      //   radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

      // modelViewMatrix = lookAt( eye, at, up );//mult(modelViewMatrix, rotate(0.3, [1,0,0]))
      projectionMatrix = ortho(left, right, bottom, ytop, near, far);

      gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
      gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
      spheres[0].draw(canvas);
      spheres[1].draw(canvas);
      spheres[2].draw(canvas);
      spheres[3].draw(canvas);
      window.requestAnimationFrame(animate);
    }

  }
  window.onload = main;
  