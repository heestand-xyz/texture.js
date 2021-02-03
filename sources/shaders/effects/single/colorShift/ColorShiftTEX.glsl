#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;

uniform sampler2D u_sampler;

uniform float u_hue;
uniform float u_saturation;
uniform vec4 u_tintColor;

vec3 rgb2hsv(float r, float g, float b) {
    float h, s, v;
    float mn, mx, d;
    mn = r < g ? r : g;
    mn = mn < b ? mn : b;
    mx = r > g ? r : g;
    mx = mx > b ? mx : b;
    v = mx;
    d = mx - mn;
    if (d < 0.00001) {
        s = 0.0;
        h = 0.0;
        return vec3(h, s, v);
    }
    if (mx > 0.0) {
        s = (d / mx);
    } else {
        s = 0.0;
        h = 0.0;
        return vec3(h, s, v);
    }
    if (r >= mx) {
        h = (g - b ) / d;
    } else if (g >= mx) {
        h = 2.0 + ( b - r ) / d;
    } else {
        h = 4.0 + ( r - g ) / d;
    }
    h *= 60.0;
    if(h < 0.0) {
        h += 360.0;
    }
    return vec3(h / 360.0, s, v);
}

vec3 hsv2rgb(float h, float s, float v) {
    float hh, p, q, t, ff;
    int i;
    vec3 c;
    if (s <= 0.0) {
        c.r = v;
        c.g = v;
        c.b = v;
        return c;
    }
    hh = (h - floor(h)) * 360.0;
    hh /= 60.0;
    i = int(hh);
    ff = hh - float(i);
    p = v * (1.0 - s);
    q = v * (1.0 - (s * ff));
    t = v * (1.0 - (s * (1.0 - ff)));
    if (i == 0) {
        c.r = v;
        c.g = t;
        c.b = p;
    } else if (i == 1) {
        c.r = q;
        c.g = v;
        c.b = p;
    } else if (i == 2) {
        c.r = p;
        c.g = v;
        c.b = t;
    } else if (i == 3) {
        c.r = p;
        c.g = q;
        c.b = v;
    } else if (i == 4) {
        c.r = t;
        c.g = p;
        c.b = v;
    } else {
        c.r = v;
        c.g = p;
        c.b = q;
    }
    return c;
}

void main() {

    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);

    vec4 color = texture2D(u_sampler, uv);
    
    color *= u_tintColor;
    
    vec3 hsv = rgb2hsv(color.r, color.g, color.b);
    
    hsv[0] += u_hue;
    hsv[1] *= u_saturation;
    
    vec3 shiftedColor = hsv2rgb(hsv[0], hsv[1], hsv[2]);
    
    gl_FragColor = vec4(shiftedColor, color.a);

}
