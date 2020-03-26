class Camera {
    constructor(gl) {
        this.gl = gl;
        this.zNear = 1;
        this.zFar = 1;
        this.fieldOfViewRadians = 1;
        this.numFs = 5;
        this.radius = 200;
    }

    generate_projectionmatrix() {
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    }

    compute_cameramatrix() {
        this.cameraMatrix = m4.yRotation(cameraAngleRadians);
        this.cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5)
    }

}