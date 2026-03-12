const PROJECTS_FILE = "data/projects.json";
const FALLBACK_IMAGE = "assets/images/projects/placeholder-project.svg";

const projectGrid = document.getElementById("projectGrid");
const projectFilters = document.getElementById("projectFilters");
const yearEl = document.getElementById("year");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

const modal = document.getElementById("projectModal");
const modalCloseBtn = document.getElementById("modalClose");

let projects = [];
let selectedCategory = "All";

yearEl.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

async function loadProjects() {
  try {
    const response = await fetch(PROJECTS_FILE);
    if (!response.ok) {
      throw new Error("Unable to load project data.");
    }

    projects = await response.json();
    renderFilters(projects);
    renderProjects(projects);
  } catch (error) {
    const inlineProjects = Array.isArray(window.PORTFOLIO_PROJECTS)
      ? window.PORTFOLIO_PROJECTS
      : [];

    if (inlineProjects.length) {
      projects = inlineProjects;
      renderFilters(projects);
      renderProjects(projects);
      return;
    }

    projectGrid.innerHTML = `<p>Project data failed to load. Check ${PROJECTS_FILE}.</p>`;
    console.error(error);
  }
}

function renderFilters(projectList) {
  const categories = ["All", ...new Set(projectList.map((project) => project.category).filter(Boolean))];

  projectFilters.innerHTML = categories
    .map(
      (category) =>
        `<button class="filter-btn" role="tab" aria-selected="${category === selectedCategory}" data-category="${category}">${category}</button>`
    )
    .join("");

  projectFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category || "All";
      const filteredProjects = selectedCategory === "All"
        ? projects
        : projects.filter((project) => project.category === selectedCategory);

      renderProjects(filteredProjects);
      renderFilters(projects);
    });
  });
}

function renderProjects(projectList) {
  if (!projectList.length) {
    projectGrid.innerHTML = "<p>No projects found for this category.</p>";
    return;
  }

  projectGrid.innerHTML = projectList
    .map((project) => {
      const tools = (project.tools || []).map((tool) => `<span>${tool}</span>`).join("");
      const reportButtonLabel = getReportButtonLabel(project.reportUrl);
      const githubButton = project.githubUrl
        ? `<a class="btn btn-ghost" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>`
        : "";

      return `
        <article class="project-card reveal" data-slug="${project.slug}">
          <div class="project-thumb-wrap">
            <img
              class="project-thumb"
              src="${project.image || FALLBACK_IMAGE}"
              alt="${escapeHtml(project.title)} dashboard screenshot"
              loading="lazy"
              onerror="this.src='${FALLBACK_IMAGE}'"
            />
          </div>
          <div class="project-content">
            <h4>${escapeHtml(project.title)}</h4>
            <p class="project-summary">${escapeHtml(project.summary || "Summary coming soon.")}</p>
            <div class="project-tools">${tools}</div>
            <div class="project-actions">
              ${project.reportUrl ? `<a class="btn btn-secondary" href="${project.reportUrl}" target="_blank" rel="noopener noreferrer">${reportButtonLabel}</a>` : ""}
              <button class="btn btn-primary" data-open-case="${project.slug}">Case Study</button>
              ${githubButton}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  attachModalHandlers();
  observeReveal();
}

function attachModalHandlers() {
  document.querySelectorAll("[data-open-case]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find((item) => item.slug === button.dataset.openCase);
      if (project) {
        openProjectModal(project);
      }
    });
  });
}

function openProjectModal(project) {
  document.getElementById("modalCategory").textContent = project.category || "Project";
  document.getElementById("projectModalTitle").textContent = project.title || "Project";
  document.getElementById("modalSummary").textContent = project.summary || "";

  const modalImage = document.getElementById("modalImage");
  modalImage.src = project.image || FALLBACK_IMAGE;
  modalImage.onerror = () => {
    modalImage.src = FALLBACK_IMAGE;
  };

  // Project detail fields from data/projects.json
  document.getElementById("modalOverview").textContent = project.overview || "Not provided.";
  document.getElementById("modalBusinessProblem").textContent = project.businessProblem || "Not provided.";
  document.getElementById("modalObjective").textContent = project.objective || "Not provided.";
  document.getElementById("modalProcess").textContent = project.process || "Not provided.";
  document.getElementById("modalInsights").textContent = project.insights || "Not provided.";
  document.getElementById("modalOutcome").textContent = project.outcome || "Not provided.";
  document.getElementById("modalChallenges").textContent = project.challenges || "Not provided.";
  document.getElementById("modalNextSteps").textContent = project.nextSteps || "Not provided.";

  const tools = project.tools || [];
  document.getElementById("modalTools").innerHTML = tools.map((tool) => `<span>${tool}</span>`).join("");

  const embedContainer = document.getElementById("embedContainer");
  const modalEmbed = document.getElementById("modalEmbed");
  const reportFallback = document.getElementById("reportFallback");
  const modalReportLink = document.getElementById("modalReportLink");

  // If embedUrl exists in data/projects.json, render responsive iframe.
  if (project.embedUrl) {
    modalEmbed.src = project.embedUrl;
    embedContainer.hidden = false;
    reportFallback.hidden = true;
  } else {
    modalEmbed.src = "";
    embedContainer.hidden = true;
    reportFallback.hidden = false;
    modalReportLink.textContent = getReportButtonLabel(project.reportUrl);

    if (project.reportUrl) {
      modalReportLink.hidden = false;
      modalReportLink.href = project.reportUrl;
    } else {
      modalReportLink.hidden = true;
      modalReportLink.href = "#";
    }
  }

  const modalGithubLink = document.getElementById("modalGithubLink");
  // If githubUrl exists in data/projects.json, display repository button.
  if (project.githubUrl) {
    modalGithubLink.hidden = false;
    modalGithubLink.href = project.githubUrl;
  } else {
    modalGithubLink.hidden = true;
    modalGithubLink.href = "#";
  }

  modal.showModal();
}

modalCloseBtn.addEventListener("click", () => closeProjectModal());

modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const clickedInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;

  if (!clickedInDialog) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.open) {
    closeProjectModal();
  }
});

function closeProjectModal() {
  const modalEmbed = document.getElementById("modalEmbed");
  modalEmbed.src = "";
  modal.close();
}

function getReportButtonLabel(url) {
  if (!url) {
    return "View Report";
  }

  return url.includes("app.powerbi.com") ? "Live Dashboard" : "View Project";
}

function observeReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((item) => observer.observe(item));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

observeReveal();
loadProjects();
