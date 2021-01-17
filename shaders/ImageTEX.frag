#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;
uniform ivec2 u_imageResolution;

uniform sampler2D u_sampler;

void main() {

    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float aspect = float(u_resolution.x) / float(u_resolution.y);

    float imageAspect = float(u_imageResolution.x) / float(u_imageResolution.y);

    float coordX = ((uv.x - 0.5) * aspect) / imageAspect + 0.5;
    vec2 coord = vec2(coordX, 1.0 - uv.y);

    gl_FragColor = texture2D(u_sampler, coord);

}