#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;

uniform sampler2D u_sampler;

uniform int u_style;
uniform float u_radius;
uniform int u_quality;
uniform float u_angle;
uniform vec2 u_position;

const float PI = 3.14159265359;
const int QUALITY_MAX = 100;

void main() {

    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    float u = uv.x;
    float v = uv.y;

    vec4 c = texture2D(u_sampler, uv);
    
    int iw = u_resolution.x;
    int ih = u_resolution.y;
    float aspect = float(iw) / float(ih);
    
    int res = int(u_quality);
    
    float angle = u_angle * PI * 2.0;
    vec2 pos = u_position;

    float radius = u_radius * float(ih);
    
    float amounts = 1.0;

    if (u_style == 1) {
        
        // Box

        for (int x = -QUALITY_MAX; x <= QUALITY_MAX; ++x) {
            if (x < -res) { continue; }
            if (x > res) { break; }
            for (int y = -QUALITY_MAX; y <= QUALITY_MAX; ++y) {
                if (y < -res) { continue; }
                if (y > res) { break; }
                if (x != 0 && y != 0) {
                    float dist = sqrt(pow(float(x), 2.0) + pow(float(y), 2.0));
                    if (dist <= float(res)) {
                        float amount = pow(1.0 - dist / (float(res) + 1.0), 0.5);
                        float xu = u;
                        float yv = v;
                        if (aspect < 1.0) {
                            xu += ((float(x) / float(iw)) * radius) / float(res);
                            yv += (((float(y) / float(iw)) * radius) / float(res)) * aspect;
                        } else {
                            xu += ((float(x) / float(ih)) * radius) / float(res);
                            yv += (((float(y) / float(ih)) * radius) / float(res)) * aspect;
                        }
                        c += texture2D(u_sampler, vec2(xu, yv)) * amount;
                        amounts += amount;
                    }
                }
            }
        }
        
    } else if (u_style == 2) {
        
        // Angle
        
        for (int x = -QUALITY_MAX; x <= QUALITY_MAX; ++x) {
            if (x < -res) { continue; }
            if (x > res) { break; }
            if (x != 0) {
                float amount = pow(1.0 - float(x) / (float(res) + 1.0), 0.5);
                float xu = u;
                float yv = v;
                if (aspect < 1.0) {
                    xu += ((float(x) / float(iw)) * cos(-angle) * radius) / float(res);
                    yv += (((float(x) / float(iw)) * sin(-angle) * radius) / float(res)) * aspect;
                } else {
                    xu += ((float(x) / float(ih)) * cos(-angle) * radius) / float(res);
                    yv += (((float(x) / float(ih)) * sin(-angle) * radius) / float(res)) * aspect;
                }
                c += texture2D(u_sampler, vec2(xu, yv)) * amount;
                amounts += amount;
            }
        }
        
    } else if (u_style == 3) {
        
        // Zoom
        
        for (int x = -QUALITY_MAX; x <= QUALITY_MAX; ++x) {
            if (x < -res) { continue; }
            if (x > res) { break; }
            if (x != 0) {
                float amount = pow(1.0 - float(x) / (float(res) + 1.0), 0.5);
                float xu = u;
                float yv = v;
                if (aspect < 1.0) {
                    xu += (((float(x) * (u - 0.5 - pos.x)) / float(iw)) * radius) / float(res);
                    yv += ((((float(x) * (v - 0.5 + pos.y)) / float(iw)) * radius) / float(res));// * aspect;
                } else {
                    xu += (((float(x) * (u - 0.5 - pos.x)) / float(ih)) * radius) / float(res);
                    yv += ((((float(x) * (v - 0.5 + pos.y)) / float(ih)) * radius) / float(res));// * aspect;
                }
                c += texture2D(u_sampler, vec2(xu, yv)) * amount;
                amounts += amount;
            }
        }
        
    }
    
    c /= amounts;

    gl_FragColor = c;

}
