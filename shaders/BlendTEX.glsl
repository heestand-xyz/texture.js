#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;

uniform sampler2D u_samplerA;
uniform sampler2D u_samplerB;

void main() {
    
    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    uv = vec2(uv.x, 1.0 - uv.y);

    vec4 colorA = texture2D(u_samplerA, uv);
    vec4 colorB = texture2D(u_samplerB, uv);
    
    gl_FragColor = colorA + colorB;

}