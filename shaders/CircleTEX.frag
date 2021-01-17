#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;
// uniform float u_radius;

void main() {
    
    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float aspect = float(u_resolution.x) / float(u_resolution.y);
    vec2 space = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float onePixel = 1.0 / float(u_resolution.y);

    float u_radius = 0.25;
    bool u_premultiply = false;

    float distance = sqrt(pow(space.x, 2.0) + pow(space.y, 2.0));
    float light = 0.0;
    if (distance < (u_radius - onePixel / 2.0)) {
        light = 1.0;
    } else if (distance < (u_radius + onePixel / 2.0)) {
        light = 1.0 - (distance - (u_radius - onePixel / 2.0)) / onePixel;
    }
    vec4 color = vec4(vec3(light), 1.0);
    if (u_premultiply) {
        color = color * color.a;
    }
    gl_FragColor = color;

}