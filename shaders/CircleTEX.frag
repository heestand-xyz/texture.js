void main() {
    gl_FragColor = vec4(gl_FragCoord.x / 100.0, gl_FragCoord.y / 100.0, 0.0, 1.0);
}