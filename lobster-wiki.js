const g = "https://hacknock.github.io/lobsterjs/lobster.js", b = "./content/", u = "intro";
let h = null;
async function L(n) {
  if (h) return { loadMarkdown: h };
  const e = await import(
    /* @vite-ignore */
    n
  );
  return h = e.loadMarkdown, { loadMarkdown: e.loadMarkdown };
}
function E(n) {
  return n.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
}
function C(n) {
  document.body.innerHTML = "";
  const e = document.createElement("header");
  e.className = "lbw-header", e.appendChild(document.createElement("div")), e.firstElementChild.className = "lbw-header-inner";
  const o = document.createElement("div");
  o.className = "lbw-body";
  const r = document.createElement("nav");
  r.className = "lbw-sidebar";
  const a = document.createElement("main");
  a.className = "lbw-main";
  const t = document.createElement("nav");
  t.className = "lbw-toc", o.appendChild(r), o.appendChild(a), n.tableOfContents && o.appendChild(t);
  const s = document.createElement("footer");
  return s.className = "lbw-footer", document.body.appendChild(e), document.body.appendChild(o), document.body.appendChild(s), { header: e, sidebar: r, main: a, toc: t, footer: s };
}
function m(n) {
  return n.routing ?? "query";
}
function p(n) {
  const e = m(n), o = n.defaultPage ?? u;
  if (e === "hash") {
    const r = location.hash.slice(1);
    return new URLSearchParams(r).get("page") ?? o;
  }
  return new URLSearchParams(location.search).get("page") ?? o;
}
function y(n, e) {
  const o = m(n), r = o === "hash" ? 'a[href*="#page="]' : 'a[href*="?page="]';
  document.addEventListener("click", (a) => {
    var c, l;
    const t = (l = (c = a.target).closest) == null ? void 0 : l.call(c, r);
    if (!t) return;
    a.preventDefault();
    let s;
    if (o === "hash") {
      const i = new URL(t.href, location.href).hash.slice(1);
      s = new URLSearchParams(i).get("page");
    } else
      s = new URL(t.href, location.href).searchParams.get("page");
    s && (o === "hash" ? location.hash = `page=${s}` : history.pushState({ page: s }, "", `?page=${s}`), e(s));
  }), o === "hash" ? window.addEventListener("hashchange", () => {
    e(p(n));
  }) : window.addEventListener("popstate", (a) => {
    var s;
    const t = ((s = a.state) == null ? void 0 : s.page) ?? n.defaultPage ?? u;
    e(t);
  });
}
function v(n, e, o) {
  const r = m(o);
  n.querySelectorAll("a").forEach((a) => {
    let t;
    if (r === "hash") {
      const s = new URL(a.href, location.href).hash.slice(1);
      t = new URLSearchParams(s).get("page");
    } else
      t = new URL(a.href, location.href).searchParams.get("page");
    a.classList.toggle("lbw-active", t === e);
  });
}
function $(n, e, o) {
  var s;
  const r = e.split(",")[0], a = n.querySelector(
    `a[href*="page=${r}"]`
  ), t = (s = a == null ? void 0 : a.textContent) == null ? void 0 : s.trim();
  document.title = t && o ? `${t} - ${o}` : t ?? o ?? "";
}
function k(n, e) {
  const o = typeof e.tableOfContents == "object" ? e.tableOfContents : {}, r = o.minLevel ?? 2, a = o.maxLevel ?? 4, t = [];
  return n.querySelectorAll(
    [2, 3, 4, 5, 6].filter((c) => c >= r && c <= a).map((c) => `.lbs-heading-${c}`).join(",")
  ).forEach((c) => {
    var d, f;
    const l = parseInt(
      ((d = Array.from(c.classList).find((w) => w.startsWith("lbs-heading-"))) == null ? void 0 : d.replace("lbs-heading-", "")) ?? "2",
      10
    ), i = ((f = c.textContent) == null ? void 0 : f.trim()) ?? "";
    c.id || (c.id = E(i)), t.push({ level: l, text: i, id: c.id });
  }), t;
}
function P(n, e) {
  if (e.length === 0) {
    n.innerHTML = "";
    return;
  }
  const o = document.createElement("div");
  o.className = "lbw-toc-title", o.textContent = "On this page";
  const r = document.createElement("ul");
  r.className = "lbw-toc-list";
  for (const a of e) {
    const t = document.createElement("li");
    t.className = `lbw-toc-item lbw-toc-level-${a.level}`;
    const s = document.createElement("a");
    s.href = `#${a.id}`, s.textContent = a.text, s.addEventListener("click", (c) => {
      c.preventDefault();
      const l = document.getElementById(a.id);
      l && (l.scrollIntoView({ behavior: "smooth" }), history.replaceState(null, "", `#${a.id}`));
    }), t.appendChild(s), r.appendChild(t);
  }
  n.innerHTML = "", n.appendChild(o), n.appendChild(r);
}
async function R(n) {
  let e;
  if (typeof n == "string") {
    const l = await fetch(new URL(n, location.href).href);
    if (!l.ok)
      throw new Error(
        `Failed to load wiki config from ${n}: ${l.status} ${l.statusText}`
      );
    e = await l.json();
  } else
    e = n;
  const o = e.lobsterUrl ?? g, r = e.contentDir ?? b, { loadMarkdown: a } = await L(o), t = C(e);
  e.header && await a(e.header, t.header.querySelector(".lbw-header-inner")), e.footer && await a(e.footer, t.footer), await a(e.navigation, t.sidebar);
  async function s(l) {
    const i = l.split(",").map((d) => `${r}${d.trim()}.md`);
    if (await a(i.length === 1 ? i[0] : i, t.main), v(t.sidebar, l, e), $(t.sidebar, l, e.title), window.scrollTo(0, 0), e.tableOfContents) {
      const d = k(t.main, e);
      P(t.toc, d);
    }
  }
  y(e, s);
  const c = p(e);
  await s(c);
}
export {
  R as initWiki
};
