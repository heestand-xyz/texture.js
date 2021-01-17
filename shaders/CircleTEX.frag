#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;
// uniform bool u_premultiply;

uniform vec4 u_backgroundColor;
uniform vec4 u_color;
uniform vec2 u_position;

uniform float u_radius;

void main() {
    
    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float aspect = float(u_resolution.x) / float(u_resolution.y);
    vec2 space = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float onePixel = 1.0 / float(u_resolution.y);

    bool u_premultiply = false;

    float distance = sqrt(pow(space.x - u_position.x, 2.0) + pow(space.y - u_position.y, 2.0));
    float light = 0.0;
    if (distance < (u_radius - onePixel / 2.0)) {
        light = 1.0;
    } else if (distance < (u_radius + onePixel / 2.0)) {
        light = 1.0 - (distance - (u_radius - onePixel / 2.0)) / onePixel;
    }
    vec4 color = u_backgroundColor * (1.0 - light) + u_color * light;
    if (u_premultiply) {
        color = color * color.a;
    }
    gl_FragColor = color;

}