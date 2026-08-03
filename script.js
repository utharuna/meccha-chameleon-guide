(() => {
  "use strict";

  const menuButton = document.querySelector("#menu-toggle");
  const toc = document.querySelector("#toc");
  const search = document.querySelector("#search-input");
  const status = document.querySelector("#search-status");
  const sections = [...document.querySelectorAll(".manual-section")];
  const tocLinks = [...document.querySelectorAll(".toc nav a")];
  const topButton = document.querySelector("#to-top");

  const setMenu = (open) => {
    toc.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  };

  menuButton?.addEventListener("click", () => {
    setMenu(!toc.classList.contains("open"));
  });

  tocLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 1040 || !toc.classList.contains("open")) return;
    if (!toc.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });

  let timer;
  const runSearch = () => {
    const query = search.value.trim().toLocaleLowerCase("ja");
    let matches = 0;

    sections.forEach((section) => {
      const text = `${section.dataset.title || ""} ${section.textContent}`.toLocaleLowerCase("ja");
      const hit = !query || text.includes(query);
      section.hidden = !hit;
      section.classList.toggle("search-hit", Boolean(query && hit));
      if (query && hit) {
        matches += 1;
        section.querySelectorAll("details").forEach((item) => { item.open = true; });
      }
    });

    status.textContent = query
      ? `「${search.value.trim()}」が見つかった章：${matches}件`
      : "";
  };

  search?.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(runSearch, 120);
  });

  const faq = document.querySelector("#faq");
  document.querySelector("#open-all")?.addEventListener("click", () => {
    faq.querySelectorAll("details").forEach((item) => { item.open = true; });
  });
  document.querySelector("#close-all")?.addEventListener("click", () => {
    faq.querySelectorAll("details").forEach((item) => { item.open = false; });
  });

  const linkById = new Map(tocLinks.map((link) => [link.hash.slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting && !entry.target.hidden)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    tocLinks.forEach((link) => link.classList.remove("active"));
    linkById.get(visible.target.id)?.classList.add("active");
  }, { rootMargin: "-20% 0px -68% 0px", threshold: 0 });
  sections.filter((section) => section.id).forEach((section) => observer.observe(section));

  const updateTopButton = () => topButton.classList.toggle("show", window.scrollY > 650);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  updateTopButton();

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#d9f5ff",
        primaryTextColor: "#17324a",
        primaryBorderColor: "#1ab6d4",
        secondaryColor: "#edfbd5",
        tertiaryColor: "#fff0df",
        lineColor: "#5b6f80",
        fontFamily: "Yu Gothic UI, Yu Gothic, Meiryo, sans-serif"
      }
    });
  }
})();
