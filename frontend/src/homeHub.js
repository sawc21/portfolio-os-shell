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

function scheduleHubInit() {
  if (!container) {
    return;
  }

  setStatus(hubNodes[0]);

  if (shouldUseFallback() || !supportsWebGL()) {
    container.dataset.hubMode = "fallback";
    return;
  }

  let started = false;
  const start = () => {
    if (started) {
      return;
    }

    started = true;
    container.dataset.hubMode = "loading";
    import("./homeHubScene.js")
      .then(({ initThreeHub }) => initThreeHub({ container, statusText, hubNodes }))
      .catch(() => {
        container.dataset.hubMode = "fallback";
      });
  };

  const idleStart = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 1600 });
    } else {
      window.setTimeout(start, 350);
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        idleStart();
      }
    }, { rootMargin: "220px" });

    observer.observe(container);
    return;
  }

  idleStart();
}

scheduleHubInit();
