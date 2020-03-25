var PI = 3.14;

class Sphere{
    constructor(x, y, z, radius, shader, gl) {
        /*Initalise Variables such as X position Y position, GL context, radius, pointer 
        to shader program, Vertex Buffer, Index Buffer, vertices, indices, and the number 
        of Indices*/
        this.x = x;
        this.y = y;
        this.z = z;
        this.gl = gl;
        this.Radius = radius;
        this.shaderProgram = shader;
        this.vbo;
        this.petri = false;
        this.indexbuffer;
        this.normals = []; //Definately not correct, fix later.
        this.vertices = [];
        this.indices = [];
        this.numIndices = 0;
        this.colour = [x, y, z];
        this.complete = false;
        this.poison = false;
        //Generate points of the sphere
        this.generate();

        //Generate vertex buffer and index buffer
        this.genBuffers(gl);
    }
    
    generate() {
    // Initialization
        var vertices, indices;
        var SPHERE_DIV = 36;
        var i, ai, si, ci;
        var j, aj, sj, cj;
        var p1, p2;
  
        // Vertices
        var vertices = [], indices = [];
        for (j = 0; j <= SPHERE_DIV; j++) {
          aj = j * Math.PI / SPHERE_DIV;
          sj = Math.sin(aj);
          cj = Math.cos(aj);
          for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);
  
            vertices.push(si * sj);  // X
            vertices.push(cj);       // Y
            vertices.push(ci * sj);  // Z
            
          }
        }
        this.vertices = new Float32Array(vertices);
  
        // Indices
        for (j = 0; j < SPHERE_DIV; j++) {
          for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV+1) + i;
            p2 = p1 + (SPHERE_DIV+1);
  
            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);
  
            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
          }
        }
        this.indices = new Uint16Array(indices);
    }

    setx(x) {
        this.x = x;
    }
    sety(y) {
        this.y = y;
    }
    setz(z) {
        this.z = z;
    }
    setRadius(radius) {
        this.Radius = radius;
    }
    setShader(shader) {
        this.Shader = shader;
    }
    setNumSlices(NumSlices) {
        this.NumSlices = NumSlices;
    }

    
    getx() {
        return this.x;
    }
    gety() {
        return this.y;
    }
    getz() {
        return this.z;
    }
    getRadius() {
        return this.Radius;
    }
    getShader() {
        return this.Shader;
    }
    getNumSlices() {
        return this.NumSlices;
    }
    getVertices() {
        return this.vertices;
    }

    genBuffers(gl) {
        //Generate a vertex buffer and give it our vertices
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        //Generate a new index buffer and give it our indices
        this.indexbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    draw(canvas) {
        
        //define local "gl" variable so it's easier to call, same for shader
        var gl = this.gl;
        var shaderProgram = this.shaderProgram;
        //Bind programs
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        //Set position
        var vpos = gl.getAttribLocation(shaderProgram, "vposition");
        gl.vertexAttribPointer(vpos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vpos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
        //var fColorLocation = gl.getUniformLocation(shaderProgram, "fColor");
        //gl.uniform4f(fColorLocation, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);

        // Set the view port
        gl.viewport(0, 0, canvas.width, canvas.height);

        //Draw the triangle
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

}