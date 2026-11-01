import{j as m}from"./jsx-runtime.BPgyfgyD.js";import{r as p}from"./index.BiFHKRHA.js";import{c as D}from"./utils.NkPzM0bF.js";const M=`
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`,I=`
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform float u_count;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  // domain-warped billow detail, moves with the cloud, evolves slowly
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one cloud and blends it over the current color
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;

  // sample density toward the sun (straight up) for self-shadowing
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);

  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);

  float alpha = smoothstep(0.02, 0.38, d);

  // silver lining on thin edges
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.10;

  // atmospheric perspective: far clouds fade into the sky
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;

  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;

  // faint haze band near the horizon
  color = mix(color, u_skyBottom * 1.06, smoothstep(0.35, 0.0, v_uv.y) * 0.5);

  // soft sun glow, upper area
  vec2 sunPos = vec2(aspect * 0.78, 0.92);
  float sunDist = length(p - sunPos);
  color += vec3(1.0, 0.95, 0.82) * exp(-sunDist * sunDist * 5.0) * 0.28;

  // thin cirrus streaks, stretched horizontally, high in the sky
  float cirrusBand = smoothstep(0.55, 0.8, v_uv.y) * (1.0 - smoothstep(0.9, 1.0, v_uv.y));
  if (cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    color = mix(color, u_cloud * 0.98, wisp * 0.35);
  }

  // far layer: small, high, slow
  if (u_count > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  }
  if (u_count > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  }

  // middle layer
  if (u_count > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  }
  if (u_count > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  }

  // near layer: big, low, fast
  if (u_count > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;function P(a){const c=a.trim();if(c.startsWith("#")){const t=c.slice(1);return t.length===3?[parseInt(t[0]+t[0],16)/255,parseInt(t[1]+t[1],16)/255,parseInt(t[2]+t[2],16)/255]:[parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255]}const r=c.match(/[\d.]+/g);return r&&r.length>=3?[Number(r[0])/255,Number(r[1])/255,Number(r[2])/255]:[.95,.95,.95]}function N(a,c,r){const t=a.createShader(c);return t?(a.shaderSource(t,r),a.compileShader(t),a.getShaderParameter(t,a.COMPILE_STATUS)?t:(a.deleteShader(t),null)):null}const j=({className:a,children:c,speed:r=1,count:t=6,cloudColor:y="#fbf8f2",skyTopColor:_="#3876ba",skyBottomColor:b="#8cbfe8"})=>{const S=p.useRef(null),v=p.useRef(()=>{}),T=p.useRef({speed:r,count:t,cloudColor:y,skyTopColor:_,skyBottomColor:b});return T.current={speed:r,count:t,cloudColor:y,skyTopColor:_,skyBottomColor:b},p.useEffect(()=>{v.current()},[r,t,y,_,b]),p.useEffect(()=>{const s=S.current;if(!s)return;const e=s.getContext("webgl",{alpha:!1,antialias:!1,premultipliedAlpha:!1});if(!e)return;const g=N(e,e.VERTEX_SHADER,M),x=N(e,e.FRAGMENT_SHADER,I);if(!g||!x)return;const o=e.createProgram();if(!o||(e.attachShader(o,g),e.attachShader(o,x),e.bindAttribLocation(o,0,"a_pos"),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)))return;e.useProgram(o);const B=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,B),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const u={res:e.getUniformLocation(o,"u_res"),time:e.getUniformLocation(o,"u_time"),count:e.getUniformLocation(o,"u_count"),cloud:e.getUniformLocation(o,"u_cloud"),skyTop:e.getUniformLocation(o,"u_skyTop"),skyBottom:e.getUniformLocation(o,"u_skyBottom")};let f=0,E=0,F=!0;const w=window.matchMedia("(prefers-reduced-motion: reduce)").matches,C=()=>{const d=Math.min(window.devicePixelRatio||1,.8),l=s.clientWidth,A=s.clientHeight,i=Math.max(1,Math.floor(l*d)),n=Math.max(1,Math.floor(A*d));(s.width!==i||s.height!==n)&&(s.width=i,s.height=n),e.viewport(0,0,i,n),e.uniform2f(u.res,i,n),v.current()},L=new ResizeObserver(C);L.observe(s),C();const U=performance.now(),h=d=>{if(!F)return;if(!w&&d-E<40){f=requestAnimationFrame(h);return}E=d;const l=T.current,A=w?0:(d-U)/1e3*l.speed,i=P(l.cloudColor),n=P(l.skyTopColor),R=P(l.skyBottomColor);e.uniform1f(u.time,A),e.uniform1f(u.count,Math.min(6,Math.max(1,l.count))),e.uniform3f(u.cloud,i[0],i[1],i[2]),e.uniform3f(u.skyTop,n[0],n[1],n[2]),e.uniform3f(u.skyBottom,R[0],R[1],R[2]),e.drawArrays(e.TRIANGLES,0,3),!w&&!document.hidden&&(f=requestAnimationFrame(h))},k=()=>{cancelAnimationFrame(f),document.hidden||(f=requestAnimationFrame(h))};return v.current=k,document.addEventListener("visibilitychange",k),f=requestAnimationFrame(h),()=>{F=!1,cancelAnimationFrame(f),L.disconnect(),document.removeEventListener("visibilitychange",k),v.current=()=>{},e.deleteBuffer(B),e.deleteProgram(o),e.deleteShader(g),e.deleteShader(x)}},[]),m.jsxs("div",{className:D("relative h-full min-h-80 w-full overflow-hidden",a),children:[m.jsx("canvas",{ref:S,"aria-hidden":"true",className:"pointer-events-none absolute inset-0 h-full w-full"}),c?m.jsx("div",{className:"relative z-10 flex h-full w-full items-center justify-center",children:c}):null]})};function G(){return m.jsxs("div",{className:"cloud-background","aria-hidden":"true",children:[m.jsx(j,{className:"cloud-field",speed:.45,count:6,cloudColor:"#fff9f3",skyTopColor:"#73b5ed",skyBottomColor:"#c4e6fb"}),m.jsx("div",{className:"cloud-wash"})]})}export{G as default};
