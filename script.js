const stageData = [
  {
    label: "STAGE 01 / RECORD CREATED",
    title: "Draft",
    description: "Vehicle is newly added and information may still be incomplete.",
    progress: 25,
    points: [
      "Core vehicle identity is created",
      "Record remains open for editing"
    ]
  },
  {
    label: "STAGE 02 / VEHICLE PREPARATION",
    title: "In Progress",
    description: "Vehicle preparation including maintenance, expenses, images, and updates.",
    progress: 50,
    points: [
      "Maintenance and expenses are recorded",
      "Images and vehicle details are updated"
    ]
  },
  {
    label: "STAGE 03 / SALES READINESS",
    title: "Ready To Sell",
    description: "Vehicle becomes fully prepared and ready for selling.",
    progress: 75,
    points: [
      "Vehicle record is complete",
      "Sales information is ready to present"
    ]
  },
  {
    label: "STAGE 04 / LIFECYCLE COMPLETE",
    title: "Sold",
    description: "Sale is completed and profit information is recorded.",
    progress: 100,
    points: [
      "Final sale value is stored",
      "Profit and lifecycle history remain available"
    ]
  }
];

const header = document.getElementById("siteHeader");
const progressBar = document.getElementById("scrollProgress");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navLinks");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const stageCards = [...document.querySelectorAll(".stage-card")];
const stageDetail = document.getElementById("stageDetail");
const detailLabel = document.getElementById("detailLabel");
const detailTitle = document.getElementById("detailTitle");
const detailDescription = document.getElementById("detailDescription");
const detailPoints = document.getElementById("detailPoints");
const meterPercent = document.getElementById("meterPercent");
const meterFill = document.getElementById("meterFill");
const meterCar = document.getElementById("meterCar");
const presentButton = document.getElementById("presentButton");
const heroVisual = document.getElementById("heroVisual");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  header.classList.toggle("scrolled", scrollTop > 18);
}

function closeNavigation() {
  navPanel.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -45px"
});

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${visible.target.id}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}, {
  threshold: [0.2, 0.45, 0.7],
  rootMargin: "-20% 0px -55%"
});

sections.forEach((section) => sectionObserver.observe(section));

function renderStage(index) {
  const stage = stageData[index];

  stageCards.forEach((card, cardIndex) => {
    const active = cardIndex === index;
    card.classList.toggle("active", active);
    card.setAttribute("aria-selected", String(active));
    card.tabIndex = active ? 0 : -1;
  });

  stageDetail.classList.add("changing");

  window.setTimeout(() => {
    detailLabel.textContent = stage.label;
    detailTitle.textContent = stage.title;
    detailDescription.textContent = stage.description;
    meterPercent.textContent = `${stage.progress}%`;
    meterFill.style.width = `${stage.progress}%`;
    meterCar.style.left = `${Math.min(stage.progress, 97)}%`;

    detailPoints.innerHTML = stage.points
      .map((point) => `
        <span>
          <svg class="icon" aria-hidden="true"><use href="#icon-check-small"></use></svg>
          ${point}
        </span>
      `)
      .join("");

    stageDetail.classList.remove("changing");
  }, 160);
}

stageCards.forEach((card, index) => {
  card.addEventListener("click", () => renderStage(index));
  card.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();

    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const nextIndex = (index + direction + stageCards.length) % stageCards.length;
    renderStage(nextIndex);
    stageCards[nextIndex].focus();
  });
});

async function togglePresentationMode() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    presentButton.title = "Fullscreen presentation mode is not available in this browser.";
  }
}

if (!document.documentElement.requestFullscreen) {
  presentButton.hidden = true;
} else {
  presentButton.addEventListener("click", togglePresentationMode);
  document.addEventListener("fullscreenchange", () => {
    presentButton.querySelector("span").textContent = document.fullscreenElement ? "Exit" : "Present";
  });
}

if (window.matchMedia("(pointer: fine)").matches && heroVisual) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.transform = `perspective(1000px) rotateY(${x * 2.3}deg) rotateX(${y * -2.3}deg)`;
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "";
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
