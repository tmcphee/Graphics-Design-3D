var PI = 3.14;
var points = [];
var indices = [];
var baseNormals = [];

//Calculate normals of triangle
function CalculateSurfaceNormal(X1, X2, X3, Y1, Y2, Y3, Z1, Z2, Z3){
    var U = [];
    U[0] = (X2 - X1);
    U[1] = (Y2 - Y1);
    U[2] = (Z2 - Z1);

    var V = [];
    V[0] = (X3 - X1);
    V[1] = (Y3 - Y1);
    V[2]= (Z3 - Z1);

    var Normal = [(U[1] * V[2]) - (U[2] * V[1]), (U[2] * V[0]) - (U[0] * V[2]), (U[0] * V[1]) - (U[1] * V[0])];
    return Normal;
  }

function getPoints() {
    if (points.length == 0) {
        var SPHERE_DIV = 72
        console.log("here")
        for (var j = 0; j <= SPHERE_DIV; j++) {
            aj = j * Math.PI / SPHERE_DIV;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for (var i = 0; i <= SPHERE_DIV; i++) {
              ai = i * 2 * Math.PI / SPHERE_DIV;
              si = Math.sin(ai);
              ci = Math.cos(ai);
    
              points.push(si * sj);  // X
              points.push(cj);       // Y
              points.push(ci * sj);  // Z
              
            }
          }

          //Calculate Normals
        for (var i = 0; i < points.length; i+=9){
            var norm = this.CalculateSurfaceNormal(points[i + 0], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5], points[i + 6], points[i + 7], points[i + 8]);
            baseNormals.push(norm[0]);
            baseNormals.push(norm[1]);
            baseNormals.push(norm[2]);
        }

        // Indices
        for (var j = 0; j < SPHERE_DIV; j++) {
            for (var i = 0; i < SPHERE_DIV; i++) {
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
          indices = new Uint16Array(indices);
    }
    return points
}

class Sphere{
    constructor(x, y, z, radius, shader, gl) {
        /*Initalise Variables such as X position Y position, GL context, radius, pointer 
        to shader program, Vertex Buffer, Index Buffer, vertices, indices, and the number 
        of Indices*/
        
        //pointers to gl context and shader program
        this.gl = gl;
        this.shaderProgram = shader;

        //circle radius and quordinates
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.z = z;

        

        //If this circle is petri dish it is immune to collisions
        this.petri = false;

        //Buffers
        this.indexbuffer;
        this.normalbuffer;
        this.vbo;

        //arrays to store normals vertices and 
        this.normals = []; //Definately not correct, fix later.
        this.vertices = [];//Replace with points
        
        //Variables to store Colour
        this.colourRef = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
        this.colour = [this.colourRef[0] / 255, this.colourRef[1] / 255, this.colourRef[2] / 255];
        this.complete = false;

        //Model Matrix 
        this.modelMatrix = [];
        //Generate points of the sphere
        this.generate();

        //Generate vertex buffer and index buffer
        this.genBuffers(gl);

        //Set whether or not is particle
        this.isParticle = false;
    }
    
    generate() {
    // Initialization
        var vertices, indices;
        var SPHERE_DIV = 72;
        var p1, p2;
  
        // Vertices
        var vertices = [], points = getPoints();
        for (var i = 0; i < points.length; i += 3) {
            vertices.push(this.x + points[i] * this.radius);            // X
            vertices.push(this.y + points[i+1] * this.radius);          // Y
            vertices.push(this.z + points[i+2] * this.radius);          // Z
        }

        for (var i = 0; i < points.length; i += 3) {
            this.normals.push(this.x + baseNormals[i] * this.radius);            // X
            this.normals.push(this.y + baseNormals[i+1] * this.radius);          // Y
            this.normals.push(this.z + baseNormals[i+2] * this.radius);          // Z
        }

        this.vertices = new Float32Array(vertices);
    }
    

    collision(sphere){
                if (this.petri == true)
            return false;
        var d = Math.sqrt(Math.pow((this.x - sphere.x), 2) + 
                        Math.pow((this.y - sphere.y), 2) + 
                        Math.pow((this.z - sphere.z), 2));
        if(d <= (this.radius + sphere.radius)){ return true; }
        return false;
    }

    collisionCoordinate(colour) {
        console.log("start")
        console.log(colour)
        console.log(this.colourRef)
        if (colour[0] == this.colourRef[0] && colour[1] == this.colourRef[1] && colour[2] == this.colourRef[2]) {
            console.log("in here boys")
            return true;
        }
        return false;
    }

    absorb(circle, gl, canvas) {
        var a1 = ((this.getRadius() * this.getRadius()) * 3.14)
        var a2 = ((circle.getRadius() * circle.getRadius()) * 3.14 / 3)
        var newRadius = Math.sqrt(((a1 + a2) / 3.14))
        if (newRadius > 0.3)
            newRadius = 0.3
        this.setRadius(newRadius) 
        this.generate()
        this.genBuffers(gl)
        this.draw(canvas)
    }

    getRandomPoint() {
        var rand = Math.floor(Math.random() * (this.vertices.length));
        if (rand == 0)
            rand += 3
        if (rand == 1)
            rand += 2;
        if (rand == 2)
            rand++;
        if (rand % 3 != 0)
            while ((rand % 3) != 0) {
                rand--;
            }
        return [this.vertices[rand], this.vertices[rand + 1], this.vertices[rand + 2]];
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
        this.radius = radius;
    }
    setVertices(vertices) {
        this.vertices = vertices;
    }
    setShader(shader) {
        this.Shader = shader;
    }
    setNumSlices(NumSlices) {
        this.NumSlices = NumSlices;
    }
    setPoison(poison) {
        this.poison = poison
    }
    setComplete(complete) {
        this.complete = complete
    }
    setPetri() {
        this.petri = true;
        //this.colour = [1, 0.85, 1, 1]
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
        return this.radius;
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
    getPetri() {
        return this.petri;
    }
    getComplete() {
        return this.complete;
    }

    setParticle(){
        this.isParticle = true;
    }

    getParticle(){
        return this.isParticle;
    }

    setColour(val1){
        this.colour = val1;
    }

    getColour(){
        return this.colour;
    }

    genBuffers(gl) {
        //Generate a vertex buffer and give it our vertices
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        //Generate a new index buffer and give it our indices
        this.indexbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
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

        //Bind index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);

        //Pass colour to shader
        var fColorLocation = gl.getUniformLocation(shaderProgram, "fColor");
        gl.uniform4f(fColorLocation, this.colour[0], this.colour[1], this.colour[2], 1);

        //Draw the triangle
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

}