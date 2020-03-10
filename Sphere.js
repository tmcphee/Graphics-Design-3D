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
        this.vertices = [x, y, 0];
        this.indices = [0];
        this.numIndices = 0;
        this.colour = [x + 0.2, y + 0.2, 0.5, 1];
        this.complete = false;
        this.poison = false;
        //Generate points of the sphere
        this.generate();

        //Generate vertex buffer and index buffer
        //this.genBuffers(gl);
    }
    
    genereate(){
        for(var i = 0; i < 360; i++){
            for(var j = 0; j < 360; j++){
                
            }
        }
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

}