#ifdef GL_ES
precision mediump float;
#endif

const int MAX_COUNT = 32;

uniform ivec2 u_resolution;
// uniform float u_radius;
// uniform vec2 u_position;
// uniform float u_rotation;
// uniform int u_vertexCount;
// uniform vec4 u_foregroundColor;
// uniform vec4 u_backgroundColor;
// uniform float u_cornerRadius;
// uniform bool u_premultiply;

// float s;
// float x;
// float y;
// float r;
// float i;
// float ar;
// float ag;
// float ab;
// float aa;
// float br;
// float bg;
// float bb;
// float ba;
// float rad;
// float premultiply;

vec2 lerp2d(float fraction, vec2 from, vec2 to) {
    return from * (1.0 - fraction) + to * fraction;
}

vec2 proportion(vec2 point, float segment, float length, float dx, float dy) {
    float factor = segment / length;
    return vec2(point.x - dx * factor, point.y - dy * factor);
}

struct CornerCircle {
    vec2 p;
    vec2 c1;
    vec2 c2;
};

CornerCircle cornerCircle(vec2 p, vec2 p1, vec2 p2, float r) {
    
    float dx1 = p.x - p1.x;
    float dy1 = p.y - p1.y;
    
    float dx2 = p.x - p2.x;
    float dy2 = p.y - p2.y;
    
    float angle = (atan(dy1, dx1) - atan(dy2, dx2)) / 2.0;
    
    float _tan = abs(tan(angle));
    float segment = r / _tan;
    
    float length1 = sqrt(pow(dx1, 2.0) + pow(dy1, 2.0));
    float length2 = sqrt(pow(dx2, 2.0) + pow(dy2, 2.0));
    
    float _length = min(length1, length2);
    
    if (segment > _length) {
        segment = _length;
        r = _length * _tan;
    }
    
    vec2 p1Cross = proportion(p, segment, length1, dx1, dy1);
    vec2 p2Cross = proportion(p, segment, length2, dx2, dy2);
    
    float dx = p.x * 2.0 - p1Cross.x - p2Cross.x;
    float dy = p.y * 2.0 - p1Cross.y - p2Cross.y;
    
    float L = sqrt(pow(dx, 2.0) + pow(dy, 2.0));
    float d = sqrt(pow(segment, 2.0) + pow(r, 2.0));
    
    vec2 circlePoint = proportion(p, d, L, dx, dy);
    
    CornerCircle cc;
    cc.p = circlePoint;
    cc.c1 = p1Cross;
    cc.c2 = p2Cross;
    return cc;
    
}

float sign(vec2 p1, vec2 p2, vec2 p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool pointInTriangle(vec2 pt, vec2 v1, vec2 v2, vec2 v3) {
    bool b1, b2, b3;
    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;
    return (b1 == b2) && (b2 == b3);
}

vec4 roundedPolygon(vec2 uv, vec2 space, float aspect, int count, vec2 offset, float radius, float rotation, float cornerRadius) {
    
    float pi = 3.14159265359;
    
    vec2 location = vec2(offset.x / aspect, offset.y);
    
    if (radius <= 0.0) {
        return vec4(0.0);
    }
    
    for (int i = 0; i < MAX_COUNT; i++) {
        if (i >= count) { break; }

        float fia = float(i) / float(count);
        float fib = float(i + 1) / float(count);
        float fic = float(i + 2) / float(count);
        float fid = float(i + 3) / float(count);

        vec2 p1 = 0.5 + location;
        float p2r = (fia + rotation) * pi * 2.0;
        vec2 p2 = p1 + vec2((sin(p2r) * radius) / aspect, cos(p2r) * radius);
        float p3r = (fib + rotation) * pi * 2.0;
        vec2 p3 = p1 + vec2((sin(p3r) * radius) / aspect, cos(p3r) * radius);
        
        vec2 p23 = (p2 + p3) / 2.0;
        float d123 = sqrt(pow(p23.x - p1.x, 2.0) + pow(p23.y - p1.y, 2.0));
        
        float r = cornerRadius;
        if (r <= 0.0) {
            
            bool pit = pointInTriangle(uv, p1, p2, p3);
            
            if (pit) {
                return vec4(1.0);
            }
            
        } else {

            float p4r = (fic + rotation) * pi * 2.0;
            vec2 p4 = p1 + vec2((sin(p4r) * radius) / aspect, cos(p4r) * radius);
            float p5r = (fid + rotation) * pi * 2.0;
            vec2 p5 = p1 + vec2((sin(p5r) * radius) / aspect, cos(p5r) * radius);

            vec2 p1x = vec2((p1.x - 0.5) * aspect, p1.y - 0.5);
            vec2 p2x = vec2((p2.x - 0.5) * aspect, p2.y - 0.5);
            vec2 p3x = vec2((p3.x - 0.5) * aspect, p3.y - 0.5);
            vec2 p4x = vec2((p4.x - 0.5) * aspect, p4.y - 0.5);
            vec2 p5x = vec2((p5.x - 0.5) * aspect, p5.y - 0.5);
            
            CornerCircle cc1 = cornerCircle(p3x, p2x, p4x, r);
            CornerCircle cc2 = cornerCircle(p4x, p3x, p5x, r);
            
            float p12d = sqrt(pow(cc1.p.x - space.x, 2.0) + pow(cc1.p.y - space.y, 2.0));
            float p13d = sqrt(pow(cc2.p.x - space.x, 2.0) + pow(cc2.p.y - space.y, 2.0));
            
            vec2 cc1p = vec2(cc1.p.x / aspect + 0.5, cc1.p.y + 0.5);
            vec2 cc1c1 = vec2(cc1.c1.x / aspect + 0.5, cc1.c1.y + 0.5);
            vec2 cc1c2 = vec2(cc1.c2.x / aspect + 0.5, cc1.c2.y + 0.5);
            vec2 cc2p = vec2(cc2.p.x / aspect + 0.5, cc2.p.y + 0.5);
            vec2 cc2c1 = vec2(cc2.c1.x / aspect + 0.5, cc2.c1.y + 0.5);
            vec2 cc2c2 = vec2(cc2.c2.x / aspect + 0.5, cc2.c2.y + 0.5);
            
            bool pit = pointInTriangle(uv, p1, cc1p, cc2p);
            bool pit1 = pointInTriangle(uv, cc1p, cc1c2, cc2c1);
            bool pit2 = pointInTriangle(uv, cc2p, cc1p, cc2c1);
            
            // if (p12d < r || p13d < r || pit || pit1 || pit2) {
            //     return 1.0;
            // }
            if (p12d < r) {
                return vec4(1.0, 0.0, 0.0, 1.0);
            } else if (p13d < r) {
                return vec4(1.0, 1.0, 0.0, 1.0);
            } else if (pit) {
                return vec4(0.0, 1.0, 0.0, 1.0);
            } else if (pit1) {
                return vec4(0.0, 1.0, 1.0, 1.0);
            } else if (pit2) {
                return vec4(0.0, 0.0, 1.0, 1.0);
            }
            
        }

    }
    
    return vec4(0.0);
        
}

void main() {
    
    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float aspect = float(u_resolution.x) / float(u_resolution.y);
    vec2 space = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float onePixel = 1.0 / float(u_resolution.y);

    float u_radius = 0.25;
    vec2 u_position = vec2(0.0, 0.0);
    float u_rotation = 0.0;
    int u_vertexCount = 3;
    vec4 u_foregroundColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 u_backgroundColor = vec4(0.0, 0.0, 0.0, 1.0);
    float u_cornerRadius = 0.0;
    bool u_premultiply = false;

    vec4 light = roundedPolygon(uv, space, aspect, u_vertexCount, u_position, u_radius, u_rotation, u_cornerRadius);
    // float light = 0.0;
    // if (distance < (u_radius - onePixel / 2.0)) {
    //     light = 1.0;
    // } else if (distance < (u_radius + onePixel / 2.0)) {
    //     light = 1.0 - (distance - (u_radius - onePixel / 2.0)) / onePixel;
    // }
    vec4 color = light; //vec4(vec3(light), 1.0);
    if (u_premultiply) {
        color = color * color.a;
    }
    gl_FragColor = color;

}
