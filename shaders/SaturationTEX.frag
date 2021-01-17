#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;

void main() {
    gl_FragColor = vec4(0.75, 0.5, 0.25, 1.0);
}