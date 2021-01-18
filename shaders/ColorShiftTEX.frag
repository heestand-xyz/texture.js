#ifdef GL_ES
precision mediump float;
#endif

uniform ivec2 u_resolution;

uniform sampler2D u_sampler;

// vec3 rgb2hsv(float r, float g, float b) {
//     float h, s, v;
//     float mn, mx, d;
//     mn = r < g ? r : g;
//     mn = mn < b ? mn : b;
//     mx = r > g ? r : g;
//     mx = mx > b ? mx : b;
//     v = mx;
//     d = mx - mn;
//     if (d < 0.00001) {
//         s = 0;
//         h = 0;
//         return vec3(h, s, v);
//     }
//     if (mx > 0.0) {
//         s = (d / mx);
//     } else {
//         s = 0.0;
//         h = 0.0;
//         return vec3(h, s, v);
//     }
//     if (r >= mx) {
//         h = (g - b ) / d;
//     } else if (g >= mx) {
//         h = 2.0 + ( b - r ) / d;
//     } else {
//         h = 4.0 + ( r - g ) / d;
//     }
//     h *= 60.0;
//     if(h < 0.0) {
//         h += 360.0;
//     }
//     return vec3(h / 360, s, v);
// }

// vec3 hsv2rgb(float h, float s, float v) {
//     float hh, p, q, t, ff;
//     int i;
//     vec3 c;
//     if (s <= 0.0) {
//         c.r = v;
//         c.g = v;
//         c.b = v;
//         return c;
//     }
//     hh = (h - floor(h)) * 360;
//     hh /= 60.0;
//     i = int(hh);
//     ff = hh - i;
//     p = v * (1.0 - s);
//     q = v * (1.0 - (s * ff));
//     t = v * (1.0 - (s * (1.0 - ff)));
//     switch(i) {
//         case 0:
//             c.r = v;
//             c.g = t;
//             c.b = p;
//             break;
//         case 1:
//             c.r = q;
//             c.g = v;
//             c.b = p;
//             break;
//         case 2:
//             c.r = p;
//             c.g = v;
//             c.b = t;
//             break;
            
//         case 3:
//             c.r = p;
//             c.g = q;
//             c.b = v;
//             break;
//         case 4:
//             c.r = t;
//             c.g = p;
//             c.b = v;
//             break;
//         case 5:
//         default:
//             c.r = v;
//             c.g = p;
//             c.b = q;
//             break;
//     }
//     return c;
// }

void main() {
    vec2 uv = gl_FragCoord.xy / vec2(u_resolution);
    gl_FragColor = vec4(0.75, 0.5, 0.25, 1.0) + texture2D(u_sampler, uv);
}





// struct VertexOut{
//     float4 position [[position]];
//     float2 texCoord;
// };

// struct Uniforms{
//     float hue;
//     float sat;
//     float r;
//     float g;
//     float b;
//     float a;
// };

// fragment float4 effectSingleColorShiftPIX(VertexOut out [[stage_in]],
//                                           texture2d<float>  inTex [[ texture(0) ]],
//                                           const device Uniforms& in [[ buffer(0) ]],
//                                           sampler s [[ sampler(0) ]]) {
//     float u = out.texCoord[0];
//     float v = out.texCoord[1];
//     float2 uv = float2(u, v);
    
//     float4 c = inTex.sample(s, uv);
    
//     c *= float4(in.r, in.g, in.b, 1.0);
    
//     vec3 hsv = rgb2hsv(c.r, c.g, c.b);
    
//     hsv[0] += in.hue;
//     hsv[1] *= in.sat;
    
//     vec3 cc = hsv2rgb(hsv[0], hsv[1], hsv[2]);
    
//     return float4(cc.r * in.a, cc.g * in.a, cc.b * in.a, c.a * in.a);
// }
