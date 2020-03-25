function main() {
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
      +'varying lowp vec4 vColor;'
      + 'void main(){'
      + '  gl_Position = vec4(vposition, 1.0);'
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
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
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
  
    //Create Circles
    var spheres = [new Sphere(0, 0, 0,  0.6, program, gl)];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    spheres[0].draw(canvas);
  }
  
  window.onload = main;
  
  