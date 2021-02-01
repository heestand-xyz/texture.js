#ifdef GL_ES
precision mediump float;
#endif

const int MAX_COLOR_STOPS = 10;

uniform ivec2 u_resolution;
// uniform bool u_premultiply;

uniform vec4 u_backgroundColor;
uniform vec4 u_color;
uniform vec2 u_position;

uniform int u_direction;
uniform int u_extend;
uniform float u_scale;
uniform float u_offset;
uniform float u_stops[MAX_COLOR_STOPS];
uniform vec4 u_colors[MAX_COLOR_STOPS];
uniform int u_colorStopCount;

struct FractionAndZero {
    float fraction;
    bool zero;
};

struct ColorStop {
    float stop;
    vec4 color;
};

FractionAndZero fractionAndZero(float fraction, int extend) {
   
    bool zero = false;
    if (extend == 0) { // Zero
        if (fraction < 0.0) {
            zero = true;
        } else if (fraction > 1.0) {
            zero = true;
        }
    } else if (extend == 1) { // Hold
        if (fraction < 0.0001) {
            fraction = 0.0001;
        } else if (fraction > 0.9999) {
            fraction = 0.9999;
        }
    } else if (extend == 2) { // Loop
        fraction = fract(fraction);
    } else if (extend == 3) { // Mirror
        bool mirror = false;
        if (fraction / 2.0 - floor(fraction / 2.0) > 0.5) {
            mirror = true;
        }
        fraction = fract(fraction);
        if (mirror) {
            fraction = 1.0 - fraction;
        }
    }
    
    FractionAndZero fz = FractionAndZero(fraction, zero);
    
    return fz;
    
}

vec4 gradient(float fraction, ColorStop colorStops[MAX_COLOR_STOPS], int count) {
    
    ColorStop low_color_stop;
    bool low_color_stop_set = false;
    ColorStop high_color_stop;
    bool high_color_stop_set = false;
    for (int i = 0; i < MAX_COLOR_STOPS; ++i) {
        if (i >= count) { break; }
        if (colorStops[i].stop <= fraction && (!low_color_stop_set || colorStops[i].stop > low_color_stop.stop)) {
            low_color_stop = colorStops[i];
            low_color_stop_set = true;
        }
        if (colorStops[i].stop >= fraction && (!high_color_stop_set || colorStops[i].stop < high_color_stop.stop)) {
            high_color_stop = colorStops[i];
            high_color_stop_set = true;
        }
    }

    float stop_fraction = (fraction - low_color_stop.stop) / (high_color_stop.stop - low_color_stop.stop);

    if (stop_fraction < 0.0) {
        stop_fraction = 0.0;
    } else if (stop_fraction > 1.0) {
        stop_fraction = 1.0;
    }

    vec4 color = mix(low_color_stop.color, high_color_stop.color, stop_fraction);
    
    return color;
    
}

void main() {
    
    float pi = 3.14159265359;

    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float u = uv.x;
    float v = uv.y;
    float aspect = float(u_resolution.x) / float(u_resolution.y);
    vec2 space = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float onePixel = 1.0 / float(u_resolution.y);

    bool u_premultiply = false;

    vec2 pos = u_position * vec2(1.0 / aspect, 1.0);

    float fraction = 0.0;
    if (u_direction == 0) { // Horizontal
        fraction = (u - u_offset) / u_scale;
    } else if (u_direction == 1) { // Vertical
        fraction = (v - u_offset) / u_scale;
    } else if (u_direction == 2) { // Radial
        fraction = (sqrt(pow((u - 0.5 - pos.x) * aspect, 2.0) + pow(v - 0.5 - pos.y, 2.0)) * 2.0 - u_offset) / u_scale;
    } else if (u_direction == 3) { // Angle
        fraction = (atan(v - 0.5 - pos.y, -(u - 0.5 - pos.x) * aspect) / (pi * 2.0) + 0.5 - u_offset) / u_scale;
    }

    FractionAndZero fz = fractionAndZero(fraction, u_extend);
    fraction = fz.fraction;

    vec4 color = vec4(0.0);
    if (!fz.zero) {
        ColorStop colorStops[MAX_COLOR_STOPS];
        for (int i = 0; i < MAX_COLOR_STOPS; i++) {
            if (i >= u_colorStopCount) { break; }
            float stop = u_stops[i];
            vec4 color = u_colors[i];
            ColorStop colorStop = ColorStop(stop, color);
            colorStops[i] = colorStop;
        }
        color = gradient(fraction, colorStops, u_colorStopCount);
    }
    
    if (!fz.zero && u_premultiply) {
        color = color * color.a;
    }
    gl_FragColor = color;

}