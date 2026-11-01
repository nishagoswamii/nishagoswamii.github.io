import { useEffect, useRef, useState } from 'react';
import type * as T from 'three';

const ASSETS = '/Images/avatar';
const SIZE = 1430;
const BPM = 104;
// Pixel positions of the charms inside portrait.webp.
const LAYERS = {
  star: { cx: 852.5, cy: 237, w: 135, h: 122 },
  sparkle: { cx: 333.5, cy: 828.5, w: 71, h: 77 },
  heart: { cx: 1094, cy: 620, w: 80, h: 104 },
};
const NECK = [728, 988];
const CUP = [1038, 618];
// Parts of the portrait that react to a tap, checked in order. Ellipses in portrait pixels.
const ZONES = [
  { part: 'star', x: 852, y: 237, rx: 95, ry: 90 },
  { part: 'glasses', x: 673, y: 566, rx: 255, ry: 110 },
  { part: 'headphones', x: 1040, y: 620, rx: 125, ry: 160 },
  { part: 'face', x: 650, y: 760, rx: 230, ry: 250 },
  { part: 'hair', x: 720, y: 715, rx: 570, ry: 610 },
] as const;
const zoneAt = (x: number, y: number) => ZONES.find(zone => ((x - zone.x) / zone.rx) ** 2 + ((y - zone.y) / zone.ry) ** 2 <= 1)?.part;

const worldX = (x: number) => (x - SIZE / 2) / SIZE;
const worldY = (y: number) => (SIZE / 2 - y) / SIZE;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => { const k = clamp01((v - a) / (b - a)); return k * k * (3 - 2 * k); };

const VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const FRAGMENT = `
  uniform sampler2D portrait, maps;
  uniform vec2 uParallax, uSway;
  uniform float uTime, uSmile, uBrow, uBeat, uLift, uTilt, uFlash;
  varying vec2 vUv;
  float bump(vec2 p, vec2 c, vec2 s) { vec2 d = (p - c) / s; return exp(-dot(d, d)); }
  void main() {
    vec2 uv = vUv;
    // Small local warps that lift the smile and eyebrows.
    uv.y -= uSmile * .007 * (bump(uv, vec2(.401, .456), vec2(.05, .03)) + bump(uv, vec2(.537, .481), vec2(.05, .03)));
    uv.y -= uBrow * .009 * (bump(uv, vec2(.380, .641), vec2(.075, .022)) + bump(uv, vec2(.509, .669), vec2(.085, .022)));
    // The sunglasses hop and wobble on the nose.
    float frame = bump(uv, vec2(.47, .604), vec2(.2, .085));
    uv.y -= frame * (uLift * .03 + uTilt * (uv.x - .47) * .16);
    // Depth parallax makes the flat image turn toward the pointer.
    vec2 warped = uv;
    for (int i = 0; i < 2; i++) uv = warped - uParallax * (texture2D(maps, uv).r - .45);
    float hair = texture2D(maps, uv).g;
    uv.x += hair * (sin(uTime * 1.5 + uv.y * 9.0 + uv.x * 3.0) * .011 + uSway.x);
    uv.y += hair * (cos(uTime * 1.15 + uv.x * 7.0) * .005 + uSway.y);
    vec4 color = texture2D(portrait, uv);
    float lens = texture2D(maps, uv).b;
    if (lens > .001) {
      // Clouds drift across the mirrored lenses and a glint sweeps past.
      vec3 drift = texture2D(portrait, uv + vec2(sin(uTime * .32) * .007, cos(uTime * .24) * .003)).rgb;
      color.rgb = mix(color.rgb, drift, lens);
      float band = smoothstep(.055, .0, abs(fract(uv.x * .9 + uv.y * .55 - uTime * .13) - .5));
      color.rgb += lens * band * vec3(.62, .42, .62);
      color.rgb += lens * uBeat * .05 * vec3(1.0, .55, 1.0);
      color.rgb += lens * uFlash * vec3(.9, .8, .9);
    }
    gl_FragColor = color;
  }`;

/** Animates the supplied portrait itself, so the likeness always matches the original image. */
export default function AvatarScene() {
  const host = useRef<HTMLDivElement>(null);
  const requestRender = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    async function create() {
      const THREE = await import('three');
      const loader = new THREE.TextureLoader();
      const names = ['portrait', 'maps', ...Object.keys(LAYERS)];
      const loaded = await Promise.all(names.map(name => loader.loadAsync(`${ASSETS}/${name}.${name === 'maps' ? 'png' : 'webp'}`)));
      const textures = Object.fromEntries(names.map((name, i) => [name, loaded[i]])) as Record<string, T.Texture>;
      if (cancelled || !host.current) { loaded.forEach(t => t.dispose()); return; }
      for (const name of Object.keys(LAYERS)) textures[name].colorSpace = THREE.SRGBColorSpace;
      const container = host.current;
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(renderer.domElement);
      const camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, -5, 5);

      const rig = new THREE.Group(); scene.add(rig);
      rig.position.set(worldX(NECK[0]), worldY(NECK[1]), 0);
      const body = new THREE.Group(); body.position.set(-worldX(NECK[0]), -worldY(NECK[1]), 0); rig.add(body);
      const uniforms = {
        portrait: { value: textures.portrait }, maps: { value: textures.maps },
        uParallax: { value: new THREE.Vector2() }, uSway: { value: new THREE.Vector2() },
        uTime: { value: 0 }, uSmile: { value: 0 }, uBrow: { value: 0 }, uBeat: { value: 0 },
        uLift: { value: 0 }, uTilt: { value: 0 }, uFlash: { value: 0 },
      };
      const portrait = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthTest: false }));
      body.add(portrait);

      const sprite = (name: keyof typeof LAYERS, order = 2, parent: T.Object3D = body) => {
        const { w, h } = LAYERS[name];
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w / SIZE, h / SIZE), new THREE.MeshBasicMaterial({ map: textures[name], transparent: true, depthTest: false }));
        m.renderOrder = order; parent.add(m); return m;
      };
      const place = (m: T.Object3D, name: keyof typeof LAYERS) => m.position.set(worldX(LAYERS[name].cx), worldY(LAYERS[name].cy), 0);
      const star = sprite('star'); place(star, 'star');
      const heart = sprite('heart'); place(heart, 'heart');
      const sparkles = [[333.5, 828.5, 1], [150, 240, 1.15], [1290, 210, .9], [1330, 620, .7], [115, 640, .6], [1250, 1250, .75], [300, 1330, .55]].map(([x, y, size], i) => {
        const m = sprite('sparkle', i ? -1 : 2, i ? rig : body);
        if (i) m.position.set(worldX(x) - rig.position.x, worldY(y) - rig.position.y, 0); else place(m, 'sparkle');
        return { mesh: m, size, y: m.position.y };
      });

      const flyingHearts = Array.from({ length: 10 }, () => {
        const m = sprite('heart', 3, rig);
        (m.material as T.MeshBasicMaterial).color.set('#ff77b8'); m.visible = false; return m;
      });
      const soundRings = [0, 1].map(() => {
        const m = new THREE.Mesh(new THREE.RingGeometry(.128, .132, 72), new THREE.MeshBasicMaterial({ color: '#ff5fae', transparent: true, depthTest: false, depthWrite: false }));
        m.position.set(worldX(CUP[0]), worldY(CUP[1]), 0); m.renderOrder = -1; body.add(m); return m;
      });
      let raf = 0, visible = true, helloStart = -99, pendingHello = false;
      let pendingTap: (typeof ZONES)[number]['part'] | undefined;
      let glassesStart = -99, musicStart = -99, starStart = -99, burstStart = -99;
      let swayX = 0, previousPointerX = 0, lastTime = 0;
      const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      // The face follows the cursor anywhere on the page, not just over the avatar.
      const move = (e: PointerEvent) => {
        const r = container.getBoundingClientRect();
        pointer.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth * .32)));
        pointer.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight * .42)));
      };
      const leave = () => { pointer.x = 0; pointer.y = 0; };
      const lift = (e: PointerEvent) => { if (e.pointerType === 'touch') leave(); };
      const partAt = (e: MouseEvent) => {
        const r = container.getBoundingClientRect();
        const worldPointX = camera.left + (e.clientX - r.left) / r.width * (camera.right - camera.left);
        const worldPointY = camera.top - (e.clientY - r.top) / r.height * (camera.top - camera.bottom);
        return zoneAt((worldPointX - (rig.position.x - worldX(NECK[0])) + .5) * SIZE, (.5 - (worldPointY - (rig.position.y - worldY(NECK[1])))) * SIZE);
      };
      const hover = (e: PointerEvent) => { container.style.cursor = partAt(e) ? 'pointer' : 'default'; };
      const tap = (e: MouseEvent) => { const part = partAt(e); if (!part) return; pendingTap = part; requestRender.current(); };
      const boop = () => { pendingHello = true; requestRender.current(); };
      window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerup', lift); window.addEventListener('pointercancel', lift); document.documentElement.addEventListener('pointerleave', leave);
      container.addEventListener('pointermove', hover); container.addEventListener('click', tap); window.addEventListener('avatar:hello', boop);
      const resize = () => {
        const w = container.clientWidth, h = container.clientHeight, aspect = w / h;
        renderer.setSize(w, h);
        const height = Math.max(1, 1 / aspect) * 1.01;
        camera.left = -height * aspect / 2; camera.right = height * aspect / 2; camera.top = height / 2; camera.bottom = -height / 2;
        camera.updateProjectionMatrix(); requestRender.current();
      };
      const observer = new ResizeObserver(resize); observer.observe(container); resize();
      const start = performance.now();

      const restPose = () => {
        rig.scale.setScalar(1); rig.rotation.z = 0;
        sparkles.forEach(s => s.mesh.scale.setScalar(s.size)); star.rotation.z = 0; star.scale.setScalar(1); heart.scale.setScalar(1);
        place(star, 'star'); place(heart, 'heart');
        uniforms.uLift.value = 0; uniforms.uTilt.value = 0; uniforms.uFlash.value = 0;
        flyingHearts.forEach(h => { h.visible = false; });
        soundRings.forEach(r => { r.visible = false; }); uniforms.uParallax.value.set(0, 0); uniforms.uSway.value.set(0, 0);
        uniforms.uSmile.value = 0; uniforms.uBrow.value = 0; uniforms.uBeat.value = 0;
      };

      function draw(now: number) {
        const t = (now - start) / 1000;
        if (pendingHello) { helloStart = t; burstStart = t; pendingHello = false; }
        if (pendingTap === 'face') { helloStart = t; burstStart = t; }
        if (pendingTap === 'glasses') glassesStart = t;
        if (pendingTap === 'headphones') { musicStart = t; burstStart = t; }
        if (pendingTap === 'star') starStart = t;
        if (pendingTap === 'hair') swayX += (Math.random() < .5 ? -1 : 1) * .05;
        pendingTap = undefined;
        if (reduced.matches) {
          restPose();
          renderer.render(scene, camera);
          return;
        }

        const dt = Math.min(.1, t - lastTime); lastTime = t;
        const follow = 1 - Math.exp(-dt * 5);
        eased.x += (pointer.x - eased.x) * follow; eased.y += (pointer.y - eased.y) * follow;
        const beats = t * BPM / 60;
        const beat = (1 - (beats % 1)) ** 3;
        const hello = t - helloStart;
        const inHello = hello >= 0 && hello < 2.6;
        const greet = inHello ? smooth(0, .3, hello) * (1 - smooth(1.9, 2.6, hello)) : 0;
        const sinceMusic = t - musicStart;
        const music = sinceMusic < 3.4 ? smooth(0, .2, sinceMusic) * (1 - smooth(2.8, 3.4, sinceMusic)) : 0;
        const wiggle = inHello ? Math.sin(hello * 8) * (1 - hello / 2.6) * .04 : 0;

        rig.position.y = worldY(NECK[1]) + Math.sin(t * 1.05) * .007 - eased.y * .009 + beat * music * .016 + (inHello ? Math.sin(Math.min(1, hello / .7) * Math.PI) * .018 : 0);
        // The whole person moves across toward the cursor, not just the face.
        rig.position.x = worldX(NECK[0]) + eased.x * .09;
        rig.rotation.z = Math.sin(beats * Math.PI / 2) * (.012 + music * .05) + wiggle - eased.x * .05;
        uniforms.uParallax.value.set(eased.x * .042 + Math.sin(t * .45) * .004, -eased.y * .03 - beat * .0035);
        const lookX = uniforms.uParallax.value.x, lookY = uniforms.uParallax.value.y;
        swayX += (eased.x - previousPointerX) * -.1; swayX *= Math.exp(-dt * 2.6); previousPointerX = eased.x;
        uniforms.uSway.value.set(Math.max(-.05, Math.min(.05, swayX)), beat * .0018);
        uniforms.uTime.value = t; uniforms.uBeat.value = beat;
        uniforms.uSmile.value = greet; uniforms.uBrow.value = greet * (.65 + Math.sin(Math.min(hello, 2) * 7) * .35);

        // The sunglasses hop on the nose and catch the light.
        const sinceGlasses = t - glassesStart;
        const hop = sinceGlasses < 1.3 ? Math.abs(Math.sin(sinceGlasses * 8)) * Math.exp(-sinceGlasses * 2.8) : 0;
        uniforms.uLift.value = hop;
        uniforms.uTilt.value = sinceGlasses < 1.3 ? Math.sin(sinceGlasses * 11) * Math.exp(-sinceGlasses * 3) : 0;
        uniforms.uFlash.value = sinceGlasses < .3 ? (1 - sinceGlasses / .3) * .8 : 0;
        // Charms sit on the warped portrait, so they move with the same parallax.
        place(star, 'star'); star.position.x += lookX * (.28 - .45); star.position.y += lookY * (.28 - .45);
        place(heart, 'heart'); heart.position.x += lookX * (.655 - .45); heart.position.y += lookY * (.655 - .45);
        const sinceStar = t - starStart;
        star.rotation.z = Math.sin(t * 1.4) * .1 + (inHello ? smooth(.1, 1.3, hello) * Math.PI * 2 : 0) + (sinceStar < 1.2 ? smooth(0, 1.2, sinceStar) * Math.PI * 4 : 0);
        star.scale.setScalar(1 + beat * .07 + (sinceStar < 1.2 ? Math.sin(sinceStar / 1.2 * Math.PI) * .9 : 0));
        heart.scale.setScalar(1 + beat * (.13 + music * .35));
        sparkles.forEach((sparkle, i) => {
          const twinkle = smooth(-.4, 1, Math.sin(t * 1.7 + i * 1.9));
          sparkle.mesh.scale.setScalar(sparkle.size * (i ? .45 + .55 * twinkle : .75 + beat * .35));
          if (i) (sparkle.mesh.material as T.MeshBasicMaterial).opacity = twinkle;
          sparkle.mesh.rotation.z = i ? t * .5 + i : Math.sin(t) * .2;
          if (i) sparkle.mesh.position.y = sparkle.y + Math.sin(t * .8 + i) * .007;
        });
        soundRings.forEach((ring, i) => {
          const k = (beats / 2 + i * .5) % 1;
          ring.visible = true;
          ring.scale.setScalar(1 + k * (1.05 + music * .9));
          (ring.material as T.MeshBasicMaterial).opacity = (1 - k) ** 2 * .75;
        });

        flyingHearts.forEach((m, i) => {
          const age = t - burstStart - .15 - i * .12;
          m.visible = age > 0 && age < 1.5;
          if (!m.visible) return;
          const k = age / 1.5, a = -.7 + i * .42;
          m.position.set(worldX(LAYERS.heart.cx) - rig.position.x + Math.sin(a) * k * .2 + Math.sin(age * 6 + i) * .008, worldY(LAYERS.heart.cy) - rig.position.y + k * .36, 0);
          m.scale.setScalar((.3 + (i % 3) * .1) * Math.sin(Math.min(1, k * 5) * Math.PI / 2) * (1 - k ** 4) + .001);
          m.rotation.z = Math.sin(age * 5 + i) * .3;
        });

        renderer.render(scene, camera);
        if (visible && !document.hidden && !cancelled) raf = requestAnimationFrame(draw);
      }
      const resume = () => { cancelAnimationFrame(raf); if (visible && !document.hidden) raf = requestAnimationFrame(draw); };
      requestRender.current = resume;
      reduced.addEventListener('change', resume);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); }); intersection.observe(container);
      document.addEventListener('visibilitychange', resume);
      raf = requestAnimationFrame(draw);
      (window as unknown as { __avatarReady?: boolean }).__avatarReady = true;
      window.dispatchEvent(new Event('avatar:ready'));
      dispose = () => {
        (window as unknown as { __avatarReady?: boolean }).__avatarReady = false;
        cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', resume);
        reduced.removeEventListener('change', resume); requestRender.current = () => {};
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', lift); window.removeEventListener('pointercancel', lift); document.documentElement.removeEventListener('pointerleave', leave);
        container.removeEventListener('pointermove', hover); container.removeEventListener('click', tap); window.removeEventListener('avatar:hello', boop);
        scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); o.material.dispose(); } });
        loaded.forEach(t => t.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }
    create().catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; dispose?.(); };
  }, []);
  return <div ref={host} className="workspace-canvas avatar-canvas" role="img" aria-label="An animated portrait of Nisha with long dark wavy hair, pink mirrored sunglasses and pink headphones, nodding to music.">
    {failed && <img src={`${ASSETS}/portrait.webp`} alt="" className="h-full w-full object-contain" />}
  </div>;
}
