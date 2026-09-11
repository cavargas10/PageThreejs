import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import monkeySrc from '/3d-models/monkey-head/scene.gltf?url';
import rabbitSrc from '/3d-models/rabbit/scene.gltf?url';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParticleModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    // Scroll trigger morph animation across page scroll
    gsap.to(uniforms.uProgress, {
      value: 1,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.05);

    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);

    const models = {
      monkey: null,
      rabbit: null,
    };

    manager.onLoad = () => {
      createParticles(models);
      createBackgroundParticles();
      createParticleRings();
    };

    loader.load(rabbitSrc, (gltf) => {
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      if (model) {
        model.geometry.scale(1.85, 1.85, 1.85);
        model.geometry.rotateY(Math.PI * 0.5);
        model.geometry.center();
        models.rabbit = model;
      }
    });

    loader.load(monkeySrc, (gltf) => {
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      if (model) {
        model.geometry.scale(2.1, 2.1, 2.1);
        models.monkey = model;
      }
    });

    let mainParticlesGroup = new THREE.Group();
    scene.add(mainParticlesGroup);

    const createParticles = ({ monkey, rabbit }) => {
      if (!monkey || !rabbit) return;

      const monkeySampler = new MeshSurfaceSampler(monkey).build();
      const rabbitSampler = new MeshSurfaceSampler(rabbit).build();

      const geometry = new THREE.BufferGeometry();
      const num = 14000;

      const positionArray = new Float32Array(num * 3);
      const position2Array = new Float32Array(num * 3);
      const colorArray = new Float32Array(num * 3);
      const offsetArray = new Float32Array(num);
      const sizeArray = new Float32Array(num);

      const pos = new THREE.Vector3();
      const colors = [
        new THREE.Color('#9d4edd'),
        new THREE.Color('#c77dff'),
        new THREE.Color('#e0aaff'),
        new THREE.Color('#00f5d4'),
        new THREE.Color('#7b2cbf'),
      ];

      for (let i = 0; i < num; i++) {
        monkeySampler.sample(pos);
        positionArray.set(pos.toArray(), i * 3);

        rabbitSampler.sample(pos);
        position2Array.set(pos.toArray(), i * 3);

        const color = colors[Math.floor(Math.random() * colors.length)];
        colorArray.set(color.toArray(), i * 3);

        offsetArray[i] = Math.random();
        sizeArray[i] = Math.random() * 0.8 + 0.6;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setAttribute('position2', new THREE.BufferAttribute(position2Array, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

      const material = new THREE.ShaderMaterial({
        uniforms,
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      mainParticlesGroup.add(particles);
    };

    const createBackgroundParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const num = 1200;

      const positionArray = new Float32Array(num * 3);
      const position2Array = new Float32Array(num * 3);
      const colorArray = new Float32Array(num * 3);
      const offsetArray = new Float32Array(num);
      const sizeArray = new Float32Array(num);

      const colors = [
        new THREE.Color('#5a189a'),
        new THREE.Color('#7b2cbf'),
        new THREE.Color('#00b4d8'),
      ];

      for (let i = 0; i < num; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 16;
        const z = (Math.random() - 0.5) * 12 - 2;

        positionArray.set([x, y, z], i * 3);
        position2Array.set([x * 1.3, y * 1.3, z * 1.3], i * 3);

        const color = colors[Math.floor(Math.random() * colors.length)];
        colorArray.set(color.toArray(), i * 3);

        offsetArray[i] = Math.random();
        sizeArray[i] = Math.random() * 0.6 + 0.3;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setAttribute('position2', new THREE.BufferAttribute(position2Array, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

      const material = new THREE.ShaderMaterial({
        uniforms,
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const bgParticles = new THREE.Points(geometry, material);
      scene.add(bgParticles);
    };

    let ringMesh;
    const createParticleRings = () => {
      const num = 600;
      const geometry = new THREE.BufferGeometry();
      const positionArray = new Float32Array(num * 3);
      const position2Array = new Float32Array(num * 3);
      const colorArray = new Float32Array(num * 3);
      const offsetArray = new Float32Array(num);
      const sizeArray = new Float32Array(num);

      const ringColor = new THREE.Color('#7000ff');

      for (let i = 0; i < num; i++) {
        const angle = (i / num) * Math.PI * 2;
        const radius = 3.2 + Math.random() * 0.3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.4;

        positionArray.set([x, y, z], i * 3);
        position2Array.set([x * 1.2, y * 1.2, z], i * 3);
        colorArray.set(ringColor.toArray(), i * 3);
        offsetArray[i] = Math.random();
        sizeArray[i] = 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setAttribute('position2', new THREE.BufferAttribute(position2Array, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

      const material = new THREE.ShaderMaterial({
        uniforms,
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      ringMesh = new THREE.Points(geometry, material);
      ringMesh.rotation.x = Math.PI * 0.35;
      scene.add(ringMesh);
    };

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handleMouseMove);

    const clock = new THREE.Clock();

    const tic = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Rotate particles subtly based on mouse
      mainParticlesGroup.rotation.y = elapsedTime * 0.05 + mouse.x * 0.4;
      mainParticlesGroup.rotation.x = mouse.y * 0.2;

      if (ringMesh) {
        ringMesh.rotation.z = elapsedTime * 0.1;
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tic);
    };

    tic();

    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const mountNode = mountRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleMouseMove);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="particle-canvas-container" />;
};

export default ParticleModel;
