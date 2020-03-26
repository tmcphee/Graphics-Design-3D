attribute vec3 vposition;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying lowp vec4 vColor;

void main(){
    gl_Position = modelViewMatrix * vec4(vposition, 1.0);
    vColor = vec4(vposition, 1.0);
};