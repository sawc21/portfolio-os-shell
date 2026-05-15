import {
  BoxGeometry,
  Clock,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  WebGLRenderer
} from "three";

function setStatus(statusText, node) {
  if (!statusText || !node) {
    return;
  }

  statusText.textContent = `${node.label}: ${node.description}`;
}

function createNodeMesh(node) {
  const material = new MeshStandardMaterial({
    color: node.color,
    roughness: 0.58,
    metalness: 0.05
  });

  const geometry = {
    box: new BoxGeometry(0.9, 0.34, 0.9),
    sphere: new SphereGeometry(0.44, 32, 20),
    cylinder: new CylinderGeometry(0.42, 0.52, 0.48, 6),
    cone: new ConeGeometry(0.44, 0.82, 5),
    torus: new TorusGeometry(0.36, 0.12, 14, 30)
  }[node.shape];

  const mesh = new Mesh(geometry, material);
  mesh.position.set(...node.position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = node;
  return mesh;
}

export function initThreeHub({ container, statusText, hubNodes }) {
  const scene = new Scene();
  scene.background = null;

  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 3.15, 5.6);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.domElement.className = "hub-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.prepend(renderer.domElement);
  container.dataset.hubMode = "3d";

  const world = new Group();
  world.rotation.x = -0.08;
  scene.add(world);

  const base = new Mesh(
    new CylinderGeometry(2.65, 2.9, 0.28, 7),
    new MeshStandardMaterial({ color: 0xffffff, roughness: 0.72 })
  );
  base.position.y = -0.18;
  base.receiveShadow = true;
  world.add(base);

  const ring = new Mesh(
    new TorusGeometry(1.92, 0.018, 8, 96),
    new MeshBasicMaterial({ color: 0x111111 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  world.add(ring);

  const meshes = hubNodes.map(createNodeMesh);
  meshes.forEach((mesh) => world.add(mesh));

  scene.add(new HemisphereLight(0xffffff, 0xded8ce, 2.2));

  const key = new DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 5, 4);
  key.castShadow = true;
  scene.add(key);

  const pointer = new Vector2();
  const raycaster = new Raycaster();
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
      setStatus(statusText, activeMesh.userData);
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

  const clock = new Clock();
  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime();
    world.rotation.y = Math.sin(elapsed * 0.22) * 0.18 - 0.18;
    meshes.forEach((mesh, index) => {
      mesh.position.y = hubNodes[index].position[1] + Math.sin(elapsed * 0.8 + index) * 0.035;
    });
    renderer.render(scene, camera);
  });
}
