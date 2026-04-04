const data = window.siteData;

function setBranding(pageTitle) {
  const siteName = data.profile.name;
  const asciiName = data.profile.asciiName || siteName;
  const titles = {
    Home: `${siteName} | Personal Website`,
    About: `About ${siteName}`,
    CV: `CV | ${siteName}`,
    Projects: `Projects | ${siteName}`,
    Blog: `Blog | ${siteName}`,
    Contact: `Contact | ${siteName}`
  };

  document.title = titles[pageTitle] || `${pageTitle} | ${siteName}`;
  const brand = document.getElementById("brand-text");

  if (brand) {
    brand.textContent = siteName;
  }

  document.documentElement.lang = "en";
  document.body.dataset.asciiName = asciiName;
}

function createTagList(tags) {
  const list = document.createElement("div");
  list.className = "tag-list";

  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.className = "tag";
    item.textContent = tag;
    list.appendChild(item);
  });

  return list;
}

function createBulletList(items) {
  const list = document.createElement("ul");
  list.className = "bullet-list";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  return list;
}

function createCvEntry(item, options = {}) {
  const article = document.createElement("article");
  article.className = "cv-entry";

  const header = document.createElement("div");
  header.className = "cv-entry-header";
  header.innerHTML = `
    <div>
      <h3>${options.title(item)}</h3>
      <p class="cv-subtitle">${options.subtitle(item)}</p>
    </div>
    <div class="cv-meta">
      <span>${item.period}</span>
      <span>${item.meta}</span>
    </div>
  `;
  article.appendChild(header);

  if (item.note) {
    const note = document.createElement("p");
    note.className = "cv-note";
    note.textContent = item.note;
    article.appendChild(note);
  }

  if (item.detail) {
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    article.appendChild(detail);
  }

  if (item.tools) {
    article.appendChild(createTagList(item.tools));
  }

  if (item.bullets) {
    article.appendChild(createBulletList(item.bullets));
  }

  return article;
}

function createCard(item, options = {}) {
  const article = document.createElement("article");
  article.className = "card";
  const isProject = options.variant === "project";

  if (isProject) {
    article.classList.add("project-card");

    if (item.theme) {
      article.style.setProperty("--project-accent", item.theme.accent);
      article.style.setProperty("--project-soft", item.theme.soft);
      article.style.setProperty("--project-border", item.theme.border);
    }
  }

  if (options.meta) {
    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = options.meta(item);
    article.appendChild(meta);
  }

  const title = document.createElement("h3");
  title.textContent = item.title;
  article.appendChild(title);

  const body = document.createElement("p");
  body.textContent = item.description || item.summary;
  article.appendChild(body);

  if (item.note) {
    const note = document.createElement("p");
    note.className = "project-note";
    note.textContent = item.note;
    article.appendChild(note);
  }

  if (item.tags) {
    article.appendChild(createTagList(item.tags));
  }

  if (item.highlights) {
    article.appendChild(createBulletList(item.highlights));
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const link = document.createElement("a");
  link.className = "text-link";
  link.href = item.link;
  link.textContent = item.linkLabel || options.linkLabel || "Open";
  actions.appendChild(link);

  if (item.secondaryLink) {
    const secondary = document.createElement("a");
    secondary.className = "text-link text-link-secondary";
    secondary.href = item.secondaryLink;
    secondary.textContent = item.secondaryLabel || "Secondary link";
    actions.appendChild(secondary);
  }

  article.appendChild(actions);

  return article;
}

function renderHomePage() {
  setBranding("Home");
  document.getElementById("hero-location").textContent = data.profile.location;
  document.getElementById("hero-title").textContent = data.profile.name;
  document.getElementById("hero-summary").textContent = data.profile.summary;
}

function renderAboutPage() {
  setBranding("About");
  document.getElementById("about-summary").textContent = data.profile.summary;
  document.getElementById("about-bio").textContent = data.profile.bio;

  const focusList = document.getElementById("focus-list");
  data.profile.focus.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    focusList.appendChild(li);
  });

  const timeline = document.getElementById("timeline-list");
  data.timeline.forEach((item) => {
    const block = document.createElement("div");
    block.className = "timeline-item";
    block.innerHTML = `
      <p class="timeline-period">${item.period}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    timeline.appendChild(block);
  });
}

function renderCvPage() {
  setBranding("CV");

  const educationList = document.getElementById("education-list");
  data.education.forEach((item) => {
    educationList.appendChild(
      createCvEntry(item, {
        title: (entry) => entry.school,
        subtitle: () => "Education"
      })
    );
  });

  const experienceList = document.getElementById("experience-list");
  data.experience.forEach((item) => {
    experienceList.appendChild(
      createCvEntry(item, {
        title: (entry) => entry.title,
        subtitle: (entry) => entry.organization
      })
    );
  });

  const awardsList = document.getElementById("awards-list");
  data.awards.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    awardsList.appendChild(li);
  });

  const activitiesList = document.getElementById("activities-list");
  data.activities.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    activitiesList.appendChild(li);
  });

  const skillsList = document.getElementById("skills-list");
  data.skills.forEach((skill) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = skill;
    skillsList.appendChild(tag);
  });
}

function renderProjectsPage() {
  setBranding("Projects");
  const projectList = document.getElementById("project-list");

  data.projects.forEach((project) => {
    projectList.appendChild(
      createCard(project, {
        variant: "project",
        meta: (item) => item.category || "Project",
        linkLabel: "View project"
      })
    );
  });
}

function renderBlogPage() {
  setBranding("Blog");
  const archive = document.getElementById("blog-archive");

  data.posts.forEach((post) => {
    archive.appendChild(
      createCard(post, {
        meta: (item) => `${item.category} . ${item.date}`,
        linkLabel: "Open post"
      })
    );
  });
}

function renderContactPage() {
  setBranding("Contact");
  document.getElementById("contact-note").textContent = data.profile.contactNote;

  const contactLinks = document.getElementById("contact-links");
  data.contact.forEach((item) => {
    const anchor = document.createElement("a");
    anchor.className = "contact-link panel";
    anchor.href = item.href;
    anchor.innerHTML = `
      <span class="contact-label">${item.label}</span>
      <span class="contact-value">${item.value}</span>
    `;
    contactLinks.appendChild(anchor);
  });
}

const page = document.body.dataset.page;

if (page === "home") {
  renderHomePage();
}

if (page === "about") {
  renderAboutPage();
}

if (page === "cv") {
  renderCvPage();
}

if (page === "projects") {
  renderProjectsPage();
}

if (page === "blog") {
  renderBlogPage();
}

if (page === "contact") {
  renderContactPage();
}
