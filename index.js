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

function main() {
    var score = 0;

    console.log("program start")
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
      'varying lowp vec4 vColor;'+
      ' void main(){' +
      ' gl_FragColor = vColor;'
      + '}'

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
  
    drawScore(score, ctx);

    //Create Spheres
    var spheres = [new Sphere(0, 0, 0, 0.6, program, gl)];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    console.log()

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), 
             radius*Math.cos(phi));
             
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    console.log(modelViewMatrix)
    spheres[0].draw(canvas)

    window.requestAnimationFrame(animate);

    function animate(time) {
      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

        modelViewMatrix = mult(modelViewMatrix, rotate(1, [1,1,0]))
      projectionMatrix = ortho(left, right, bottom, ytop, near, far);

      gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
      gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

      spheres[0].draw(canvas);
      window.requestAnimationFrame(animate);
    }

  }
  
  window.onload = main;
  