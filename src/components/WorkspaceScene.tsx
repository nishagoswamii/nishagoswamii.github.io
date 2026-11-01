import { useEffect, useRef, useState } from 'react';

/** Original procedural scene; all models are created locally from geometry. */
export default function WorkspaceScene({ wave, scanning }: { wave: number; scanning: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const trigger = useRef({ wave, scanning });
  const requestRender = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  trigger.current = { wave, scanning };
  useEffect(() => { requestRender.current(); }, [wave, scanning]);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    async function create() {
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
      if (cancelled || !host.current) return;
      const container = host.current;
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(renderer.domElement);
      const camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
      camera.position.set(6.7, 5.2, 9.7);
      camera.lookAt(0, 1.35, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb0a3b9, 3));
      const sun = new THREE.DirectionalLight(0xfff3df, 4.5);
      sun.position.set(-3, 8, 5); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, {left:-6,right:6,top:6,bottom:-6});
      sun.shadow.normalBias = .04;
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xc7d6ff, 2);
      fill.position.set(5, 3, -3); scene.add(fill);
      const world = new THREE.Group(); scene.add(world);
      const mat = (color: string, roughness = .7) => new THREE.MeshStandardMaterial({ color, roughness });
      const cream = mat('#fff6e6'), lilac = mat('#b6a2de'), dark = mat('#343245'), pink = mat('#e5a0b3');
      const skin = mat('#c88e6c'), hair = mat('#302733'), wood = mat('#c8a17f');
      function mesh(geometry: import('three').BufferGeometry, material: import('three').Material, x: number, y: number, z: number, parent: import('three').Object3D = world) {
        const o = new THREE.Mesh(geometry, material); o.position.set(x,y,z); o.castShadow=true; o.receiveShadow=true; parent.add(o); return o;
      }
      const box = (w:number,h:number,d:number,m:import('three').Material,x:number,y:number,z:number,p:import('three').Object3D=world,r=.08) => mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),m,x,y,z,p);
      const ball = (r:number,m:import('three').Material,x:number,y:number,z:number,p:import('three').Object3D=world) => mesh(new THREE.SphereGeometry(r,28,20),m,x,y,z,p);
      const rod = (a: number[], b: number[], radius:number, material:import('three').Material, parent:import('three').Object3D=world) => {
        const from=new THREE.Vector3(a[0],a[1],a[2]), to=new THREE.Vector3(b[0],b[1],b[2]), delta=to.clone().sub(from);
        const o=mesh(new THREE.CylinderGeometry(radius,radius,delta.length(),16),material,0,0,0,parent);
        o.position.copy(from.add(to).multiplyScalar(.5)); o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()); return o;
      };
      box(5.6,.18,4.5,cream,0,-.13,0,world,.15);
      box(4.7,.04,3.75,mat('#c2b0df'),0,-.015,.1);
      box(4.35,.025,3.4,mat('#d5c6eb'),0,.012,.1);
      box(4,.19,1.65,cream,0,1.65,-.65,world,.16);
      for(const x of [-1.65,1.65]) for(const z of [-1.23,-.05]) rod([x,.03,z],[x,1.58,z],.09,wood);
      function monitor(x:number, angle:number, editor:boolean) {
        const screen=new THREE.Group(); screen.position.set(x,2.27,-.96);screen.rotation.y=angle;world.add(screen);
        box(1.57,1.03,.13,lilac,0,0,0,screen);
        box(1.43,.88,.022,dark,0,0,.081,screen);
        rod([x,1.77,-.96],[x,2,-.96],.065,lilac);
        box(.63,.05,.36,lilac,x,1.78,-.88);
        if(editor) {
          const colors=['#c8b3ef','#e2a4b4','#f0cf95','#a9d5b8'];
          for(let i=0;i<12;i++) box(.3+(i*17%8)*.09,.018,.008,mat(colors[i%4]),-.4+(i%3)*.045,.32-i*.054,.099,screen,.002);
        } else {
          box(.88,.045,.009,cream,-.1,.23,.1,screen);
          for(let i=0;i<4;i++) box(.21,.2,.01,mat(['#ecc7ad','#b6a2de','#bad3cb','#e6afc0'][i]),-.48+(i%2)*.48,-.02-Math.floor(i/2)*.25,.1,screen);
        }
      }
      monitor(-.87,.15,false); monitor(.87,-.15,true);
      box(.95,.035,.33,lilac,.3,1.775,-.11);
      for(let row=0;row<3;row++) for(let col=0;col<10;col++) box(.063,.012,.055,cream,-.1+col*.082,1.8,-.22+row*.08);
      ball(.09,cream,1.13,1.81,-.1).scale.set(.8,.45,1.2);
      for(let i=0;i<3;i++) box(.43,.08,.52,mat(['#dba582','#b5a1d2','#f0dcc0'][i]),-1.62,1.81+i*.09,-.8);
      mesh(new THREE.CylinderGeometry(.13,.11,.25,28),pink,-1.38,1.88,-.12);
      mesh(new THREE.TorusGeometry(.09,.025,10,24),pink,-1.23,1.9,-.12).rotation.y=.4;
      rod([1.65,1.78,-1.1],[1.65,2.65,-1.1],.035,wood);
      rod([1.65,2.65,-1.1],[1.3,2.75,-1.1],.035,wood);
      mesh(new THREE.ConeGeometry(.22,.24,32),cream,1.28,2.66,-1.1);
      function plant(x:number,z:number,size:number) {
        mesh(new THREE.CylinderGeometry(.22*size,.15*size,.34*size,24),cream,x,.17*size,z);
        mesh(new THREE.CylinderGeometry(.18*size,.18*size,.025,24),hair,x,.35*size,z);
        for(let i=0;i<7;i++) {
          const a=i*2.4;const leaf=ball(.16*size,mat(i%2?'#85a38a':'#a7bf93'),x+Math.sin(a)*.17*size,.65*size+(i%3)*.12*size,z+Math.cos(a)*.17*size);
          leaf.scale.set(.5,2.4,.65);leaf.rotation.z=Math.sin(a)*.45;leaf.rotation.x=Math.cos(a)*.45;
        }
      }
      plant(2.28,.65,1.12);
      const person=new THREE.Group();person.position.set(-.38,0,.65);person.rotation.y=.27;person.scale.setScalar(1.08);world.add(person);
      box(.95,.15,.9,lilac,0,.84,0,person);
      rod([0,.12,0],[0,.8,0],.085,dark,person);
      for(let i=0;i<4;i++){const a=i*Math.PI/2;rod([0,.15,0],[Math.cos(a)*.5,.12,Math.sin(a)*.5],.04,dark,person);ball(.07,dark,Math.cos(a)*.5,.09,Math.sin(a)*.5,person);}
      box(.96,1,.16,lilac,0,1.3,-.38,person,.12);
      box(.84,.84,.55,lilac,0,1.4,.03,person,.2);
      mesh(new THREE.CylinderGeometry(.16,.18,.22,20),skin,0,1.82,.05,person);
      for(const x of [-.23,.23]) {
        rod([x,.95,.16],[x,.69,.64],.14,dark,person);
        rod([x,.69,.64],[x,.22,.8],.12,dark,person);
        box(.3,.19,.48,cream,x,.16,.94,person,.09);
      }
      const head=new THREE.Group();head.position.set(0,2.13,.07);person.add(head);
      ball(.54,hair,0,.07,-.09,head).scale.set(1,1.1,.87);
      ball(.465,skin,0,0,.115,head).scale.set(.91,1.03,.87);
      const glasses: import('three').Object3D[] = [];
      for(const x of [-.17,.17]) {
        const frame=mesh(new THREE.TorusGeometry(.105,.014,8,24),dark,x,.015,.515,head);
        glasses.push(frame);
      }
      rod([-.065,.015,.515],[.065,.015,.515],.014,dark,head);
      const hairClip=mesh(new THREE.TorusGeometry(.075,.018,8,20),pink,-.3,.28,.28,head);
      hairClip.rotation.x=Math.PI/2;
      for(const side of [-1,1]) {
        ball(.12,skin,side*.42,-.04,.08,head);
        const lock=ball(.22,hair,side*.36,-.23,-.04,head);lock.scale.set(.75,2.4,1.1);lock.rotation.z=side*-.14;
        const bang=ball(.31,hair,side*.16,.33,.27,head);bang.scale.set(1.1,.55,.5);bang.rotation.z=side*-.35;
        mesh(new THREE.TorusGeometry(.065,.015,8,20),mat('#e5bb6a',.3),side*.44,-.16,.16,head);
      }
      const eyes: import('three').Mesh[]=[];
      for(const x of [-.17,.17]) {
        const eye=ball(.041,hair,x,.015,.489,head);eye.scale.set(1,1.2,.45);eyes.push(eye);
        ball(.012,cream,x+.008,.029,.508,head);
        const brow=box(.115,.022,.025,hair,x,.12,.464,head);brow.rotation.z=x>0?.12:-.12;
        ball(.065,mat('#d99489'),x*1.25,-.105,.454,head).scale.set(1,.48,.12);
      }
      ball(.065,skin,0,-.055,.51,head).scale.set(.7,.8,.6);
      const smile=mesh(new THREE.TorusGeometry(.1,.014,8,24,Math.PI*.75),hair,0,-.13,.478,head);smile.rotation.z=Math.PI*1.12;
      const necklace=mesh(new THREE.TorusGeometry(.16,.018,8,24,Math.PI),mat('#e5bb6a',.3),0,1.58,.29,person);
      necklace.rotation.x=Math.PI;
      ball(.045,mat('#f3b35f',.3),0,1.42,.43,person);
      rod([-.4,1.65,.04],[-.61,1.32,.25],.105,lilac,person);
      rod([-.61,1.32,.25],[-.47,1.25,.6],.085,skin,person);ball(.1,skin,-.47,1.25,.63,person);
      const waving=new THREE.Group();waving.position.set(.39,1.64,.08);person.add(waving);
      rod([0,0,0],[.28,-.17,.05],.105,lilac,waving);
      rod([.28,-.17,.05],[.4,.18,.07],.085,skin,waving);
      ball(.115,skin,.4,.28,.07,waving).scale.set(.8,1.2,.65);
      for(let i=0;i<4;i++) rod([.34+i*.035,.31,.07],[.33+i*.04,.43-(i%3)*.015,.07],.021,skin,waving);
      const ornaments: import('three').Group[]=[];
      for(let i=0;i<3;i++) {
        const card=new THREE.Group();card.position.set(-1.55+i*1.4,3.1+(i%2)*.25,-1.05);card.rotation.y=.1-i*.1;card.rotation.z=(i-1)*-.13;world.add(card);
        box(.57,.65,.07,mat(['#efcfab','#d9cee9','#bfd8c8'][i]),0,0,0,card);
        for(let j=0;j<3;j++) box(.32-j*.045,.025,.008,cream,-.025,.12-j*.1,.044,card);
        ornaments.push(card);
      }
      const ring=mesh(new THREE.TorusGeometry(1.1,.012,8,80),mat('#fba36b'),-.35,1.8,.7);ring.visible=false;
      let frame=0,visible=true,lastWave=-1,waveStart=0,lastDraw=0;
      const pointer={x:0,y:0};
      const reduced=matchMedia('(prefers-reduced-motion: reduce)');
      const move=(e:PointerEvent)=>{const r=container.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2;};
      const leave=()=>{pointer.x=0;pointer.y=0;};
      container.addEventListener('pointermove',move);container.addEventListener('pointerleave',leave);
      const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();requestRender.current();};
      const observer=new ResizeObserver(resize);observer.observe(container);resize();
      const start=performance.now();
      function draw(now:number) {
        if(now-lastDraw<32){if(visible&&!document.hidden&&!cancelled)frame=requestAnimationFrame(draw);return;}
        lastDraw=now;
        const t=(now-start)/1000;
        if(lastWave!==trigger.current.wave){lastWave=trigger.current.wave;waveStart=t;}
        if(!reduced.matches){
          world.rotation.y += (pointer.x*.09-world.rotation.y)*.04;
          head.rotation.y += (pointer.x*.18-head.rotation.y)*.05;
          head.rotation.x += (pointer.y*.08-head.rotation.x)*.05;
          person.position.y=Math.sin(t*1.6)*.012;
          person.rotation.z += (Math.sin(t*.85)*.018-person.rotation.z)*.04;
          person.rotation.y += (.27+Math.sin(t*.55)*.025-person.rotation.y)*.03;
          head.position.y += (2.13+Math.sin(t*1.9)*.018-head.position.y)*.08;
          waving.rotation.z=t-waveStart<2.5?Math.sin((t-waveStart)*9)*.22:Math.sin(t*1.2)*.025;
          glasses.forEach((frame,i)=>{frame.rotation.z=Math.sin(t*1.3+i)*.012;});
          hairClip.rotation.z=Math.sin(t*.9)*.04;
          for(const eye of eyes) eye.scale.y=Math.sin(t*1.15)>.995?.12:1.2;
          ornaments.forEach((card,i)=>{card.position.y=3.1+(i%2)*.25+Math.sin(t*.9+i)*.06;});
        }
        ring.visible=trigger.current.scanning;
        ring.position.y=1.8+(reduced.matches?0:Math.sin(t*2)*.9);
        renderer.render(scene,camera);
        if(visible && !document.hidden && !cancelled && !reduced.matches)frame=requestAnimationFrame(draw);
      }
      const resume=()=>{cancelAnimationFrame(frame);if(visible&&!document.hidden)frame=requestAnimationFrame(draw);};
      requestRender.current=resume;
      reduced.addEventListener('change',resume);
      const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});intersection.observe(container);
      document.addEventListener('visibilitychange',resume);
      frame=requestAnimationFrame(draw);
      dispose=()=>{
        cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',resume);
        reduced.removeEventListener('change',resume);requestRender.current=()=>{};
        container.removeEventListener('pointermove',move);container.removeEventListener('pointerleave',leave);
        scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});
        renderer.dispose();renderer.domElement.remove();
      };
    }
    create().catch(()=>{if(!cancelled)setFailed(true);});
    return ()=>{cancelled=true;dispose?.();};
  },[]);
  return <div ref={host} className="workspace-canvas" role="img" aria-label="An animated 3D female engineer with long dark hair, waving from her lilac desk with two monitors, books, coffee and a plant.">
    {failed && <div className="scene-fallback"><span>✳</span><strong>Curiosity at work.</strong><p>AI, automation & a little imagination.</p><a href="#projects">Explore my projects ↗</a></div>}
  </div>;
}
