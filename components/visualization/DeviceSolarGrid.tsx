'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type SolarStatusInfo = { x: number; y: number; state: SolarStatus };

export enum SolarStatus {
  GOOD,
  WARNING,
  BAD,
}

const defaultSolarStatus: SolarStatusInfo[] = Array(25)
  .fill(0)
  .map((_, i) => ({
    x: (i % 5) + 1,
    y: Math.floor(i / 5) + 1,
    state:
      Math.random() < 0.7
        ? SolarStatus.GOOD
        : Math.random() < 0.3
          ? SolarStatus.BAD
          : SolarStatus.WARNING,
  }));

const SolarStatusToMaterial: Record<SolarStatus, THREE.Material> = {
  [SolarStatus.GOOD]: new THREE.MeshBasicMaterial({ color: 0x74c23d }),
  [SolarStatus.WARNING]: new THREE.MeshBasicMaterial({ color: 0xffb700 }),
  [SolarStatus.BAD]: new THREE.MeshBasicMaterial({ color: 0xe74818 }),
};

const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });

type Cell = {
  x: number;
  y: number;
  mesh: THREE.Mesh;
};

type DeviceSolarGridProps = {
  modelPath: string;
  rotationSpeed?: number;
  solarStatus?: SolarStatusInfo[];
  className?: string;
};

export const DeviceSolarGrid = ({
  modelPath,
  solarStatus = defaultSolarStatus,
  rotationSpeed = 20,
  className = '',
}: DeviceSolarGridProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(5);

  const [cells, setCells] = useState<Cell[]>([]);

  const updateCells = useCallback(() => {
    cells.forEach((cell) => {
      const status = solarStatus.find((ss) => ss.x === cell.x && ss.y === cell.y);

      if (status === undefined) {
        return;
      }

      cell.mesh.material = SolarStatusToMaterial[status.state];
    });
  }, [cells, solarStatus]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor('#e5e5e5');

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const loader = new GLTFLoader();

    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;

      const cells: Cell[] = [];

      model.traverse((child) => {
        if (child.name.startsWith('model')) {
          if (child.type === 'Mesh') {
            const c = child as THREE.Mesh;
            const wireframeMaterial = new THREE.MeshBasicMaterial({
              color: 0x777777,
              wireframe: true,
            });

            c.material = wireframeMaterial;
          }
        } else if (child.name.startsWith('cell_')) {
          const cellPositionString = child.name.replace('cell_', '');
          const cellPosition = cellPositionString.split('_');
          const [x, y] = cellPosition.map((cp) => parseInt(cp));

          cells.push({ x, y, mesh: child as THREE.Mesh });
        }
      });

      cells.forEach((cell) => {
        cell.mesh.material = defaultMaterial;
      });

      setCells(cells);

      scene.add(gltf.scene);

      // Calculate the bounding box of the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // const fov = camera.fov * (Math.PI / 180);
      const maxDimension = Math.max(size.x, size.y, size.z);
      const newCameraDistance = maxDimension * 0.6;

      setCameraDistance(newCameraDistance);

      // Position the model at the center
      gltf.scene.position.sub(center);

      setModelLoaded(true);
    });

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let angle = 0; // Rotation angle for the camera

    const animate = () => {
      requestAnimationFrame(animate);

      if (modelLoaded && cameraRef.current && modelRef.current) {
        const camera = cameraRef.current;

        angle += rotationSpeed * (1 / 60);
        camera.position.x = scene.position.x + cameraDistance * Math.cos((angle * Math.PI) / 180);
        camera.position.z = scene.position.z + cameraDistance * Math.sin((angle * Math.PI) / 180);
        camera.position.y = scene.position.y + cameraDistance;

        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (mountRef.current === null || cameraRef.current === null) {
        return;
      }

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, modelLoaded, cameraDistance, rotationSpeed]);

  useEffect(() => {
    updateCells();
  }, [updateCells]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} className={className} />;
};
