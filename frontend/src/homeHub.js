import * as THREE from "three";

const container = document.querySelector("[data-home-hub]");
const statusText = document.querySelector("[data-hub-status]");

const hubNodes = [
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    description: "Creative branches, case studies, and shipped product thinking.",
    color: 0x70d7b2,
    position: [-1.75, 0.18, 0.1],
    shape: "box"
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    description: "Build logs, decisions, and learning notes from the process.",
    color: 0xf1a084,
    position: [1.35, 0.25, 0.25],
    shape: "sphere"
  },
  {
    id: "resume",
    label: "Resume",
    href: "/resume",
    description: "Technical credibility, stack depth, and professional profile.",
    color: 0xa9dfe7,
    position: [-0.25, 0.3, -1.1],
    shape: "cylinder"
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    description: "The direct path for collaboration, interviews, and project notes.",
    color: 0xf6c35f,
    position: [1.1, 0.18, -1.2],
    shape: "cone"
  },
  {
    id: "lab",
    label: "Lab planned",
    href: "",
    description: "Future self-hosting notes, deployment diagrams, and infrastructure experiments.",
    color: 0xe6d8c8,
    position: [-1.15, 0.12, 1.1],
    shape: "torus"
  }
];

function setStatus(node) {
  if (!statusText || !node) {
    return;
  }

  statusText.textContent = `${node.label}: ${node.description}`;
}

function shouldUseFallback() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactViewport = window.matchMedia("(max-width: 760px)").matches;
  return reducedMotion || compactViewport;
}

function supportsWebGL() {
  const canvas = document.createElement("canvas");
  return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
}

function createNodeMesh(node) {
  const material = new THREE.MeshStandardMaterial({
    color: node.color,
    roughness: 0.58,
    metalness: 0.05
  });

  const geometry = {
    box: new THREE.BoxGeometry(0.9, 0.34, 0.9),
    sphere: new THREE.SphereGeometry(0.44, 32, 20),
    cylinder: new THREE.CylinderGeometry(0.42, 0.52, 0.48, 6),
    cone: new THREE.ConeGeometry(0.44, 0.82, 5),
    torus: new THREE.TorusGeometry(0.36, 0.12, 14, 30)
  }[node.shape];

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...node.position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = node;
  return mesh;
}

function initHub() {
  if (!container) {
    return;
  }

  setStatus(hubNodes[0]);

  if (shouldUseFallback() || !supportsWebGL()) {
    container.dataset.hubMode = "fallback";
    return;
  }

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 3.15, 5.6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "hub-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.prepend(renderer.domElement);
  container.dataset.hubMode = "3d";

  const world = new THREE.Group();
  world.rotation.x = -0.08;
  scene.add(world);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.65, 2.9, 0.28, 7),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72 })
  );
  base.position.y = -0.18;
  base.receiveShadow = true;
  world.add(base);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.92, 0.018, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  world.add(ring);

  const meshes = hubNodes.map(createNodeMesh);
  meshes.forEach((mesh) => world.add(mesh));

  const ambient = new THREE.HemisphereLight(0xffffff, 0xded8ce, 2.2);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 5, 4);
  key.castShadow = true;
  scene.add(key);

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let activeMesh = null;

  function resize() {
    const bounds = container.getBoundingClientRect();
    const width = Math.max(bounds.width, 320);
    const height = Math.max(bounds.height, 320);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function updatePointer(event) {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  }

  function setActive(mesh) {
    if (activeMesh === mesh) {
      return;
    }

    if (activeMesh) {
      activeMesh.scale.setScalar(1);
      activeMesh.material.emissive?.setHex(0x000000);
    }

    activeMesh = mesh;
    container.dataset.activeHubNode = mesh?.userData?.id ?? "";

    if (activeMesh) {
      activeMesh.scale.setScalar(1.12);
      activeMesh.material.emissive?.setHex(0x161616);
      setStatus(activeMesh.userData);
    }
  }

  function pick(event) {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const [hit] = raycaster.intersectObjects(meshes, false);
    setActive(hit?.object ?? null);
    container.style.cursor = hit ? "pointer" : "default";
  }

  renderer.domElement.addEventListener("pointermove", pick);
  renderer.domElement.addEventListener("pointerleave", () => {
    setActive(null);
    container.style.cursor = "default";
  });
  renderer.domElement.addEventListener("click", (event) => {
    pick(event);
    const href = activeMesh?.userData?.href;
    if (href) {
      window.location.assign(href);
    }
  });

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime();
    world.rotation.y = Math.sin(elapsed * 0.22) * 0.18 - 0.18;
    meshes.forEach((mesh, index) => {
      mesh.position.y = hubNodes[index].position[1] + Math.sin(elapsed * 0.8 + index) * 0.035;
    });
    renderer.render(scene, camera);
  });
}

initHub();
