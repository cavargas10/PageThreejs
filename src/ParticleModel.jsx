import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AmbientLight, DirectionalLight } from 'three';
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
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
    };

    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 2,
      ease: 'linear',
      scrollTrigger: {
        trigger: mountRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    const scene = new THREE.Scene();
    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);
    

    const models = {
      monkey: null,
      rabbit: null,
    };

    manager.onLoad = () => {
      createParticles(models);
      createBackgroundParticles(); 
    };

    loader.load(rabbitSrc, (gltf) => {
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      model.geometry.scale(1.75, 1.75, 1.75);
      model.geometry.rotateY(Math.PI * 0.5);
      model.geometry.center();
      models.rabbit = model;
    });

    loader.load(monkeySrc, (gltf) => {
      let model;
      gltf.scene.traverse((el) => {
        if (el instanceof THREE.Mesh) {
          model = el;
        }
      });

      model.geometry.scale(2, 2, 2);
      models.monkey = model;
    });

    const createParticles = ({ monkey, rabbit }) => {
      const monkeySampler = new MeshSurfaceSampler(monkey).build();
      const rabbitSampler = new MeshSurfaceSampler(rabbit).build();

      const geometry = new THREE.BufferGeometry();
      const num = 10000; 

      const positionArray = new Float32Array(num * 3);
      const position2Array = new Float32Array(num * 3);
      const colorArray = new Float32Array(num * 3);
      const offsetArray = new Float32Array(num);

      const pos = new THREE.Vector3();
      const colors = [
        new THREE.Color('purple'),
        new THREE.Color('mediumpurple'),
        new THREE.Color('plum'),
      ];

      for (let i = 0; i < num; i++) {
        monkeySampler.sample(pos);
        const [x, y, z] = pos.toArray();
        positionArray.set([x, y, z], i * 3);

        rabbitSampler.sample(pos);
        const [x2, y2, z2] = pos.toArray();
        position2Array.set([x2, y2, z2], i * 3);

        const color = colors[Math.floor(Math.random() * colors.length)];
        const [r, g, b] = color.toArray();
        const offset = Math.random();

        offsetArray[i] = offset;
        colorArray.set([r, g, b], i * 3);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setAttribute('position2', new THREE.BufferAttribute(position2Array, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { ...uniforms },
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const createBackgroundParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const num = 500; 

      const positionArray = new Float32Array(num * 3);
      const colorArray = new Float32Array(num * 3);
      const offsetArray = new Float32Array(num);

      const colors = [
        new THREE.Color('purple'),
        new THREE.Color('mediumpurple'),
        new THREE.Color('plum'),
      ];

      for (let i = 0; i < num; i++) {
        positionArray.set([
          (Math.random() - 0.2) * 8 - 2 ,
          (Math.random() - 0.2) * 5 - 1.5,
          (Math.random() - 0.2) * 2 + 1
        ], i * 3);

        const color = colors[Math.floor(Math.random() * colors.length)];
        colorArray.set(color.toArray(), i * 3);

        offsetArray[i] = Math.random();
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { ...uniforms },
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const fov = 60;
    const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1);
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 2.5, 0));

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new AmbientLight(0xffffff, 1.5);
    const directionalLight = new DirectionalLight(0xffffff, 4.5);
    directionalLight.position.set(3, 10, 7);
    scene.add(ambientLight, directionalLight);

    const clock = new THREE.Clock();

    const tic = () => {
      const time = clock.getElapsedTime();
      uniforms.uTime.value = time;
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

      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ParticleModel;
