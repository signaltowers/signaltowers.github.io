/* 信号塔 SignalTower —— 交互（导航 / 复制优惠码 / 目录高亮） */
(function () {
  "use strict";

  /* 移动端导航 */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* 复制优惠码 */
  document.querySelectorAll(".copybtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest("[data-codebox]");
      var codeEl = box && box.querySelector("[data-code]");
      var text = codeEl ? codeEl.textContent.trim() : "";
      if (!text) return;
      var done = function () {
        var old = btn.textContent; btn.textContent = "已复制";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var t = document.createElement("textarea");
        t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });

  /* 详情页目录高亮 */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.style.color = ""; a.style.borderColor = ""; });
          var a = map[en.target.id];
          if (a) { a.style.color = "var(--cyan)"; a.style.borderColor = "var(--cyan)"; }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { obs.observe(document.getElementById(id)); });
  }

  /* 页脚年份 */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();

/* 信号塔攻略悬浮件 .hd-dock：与 in-flow .hd-rail 互斥（rail 在场即隐、滚过即由把手接棒）+ 点击展开/关闭。
   宽屏(≥1760)面板为纯 CSS 常驻，与本脚本无关；本脚本只管窄屏的「把手现身 + 抽屉开合」。 */
(function () {
  "use strict";
  var dock = document.querySelector(".hd-dock");
  if (!dock) return;
  var rail = document.querySelector(".hd-rail");
  var handle = dock.querySelector(".hd-handle");

  function open() { dock.classList.add("is-open"); if (handle) handle.setAttribute("aria-expanded", "true"); }
  function close() { dock.classList.remove("is-open"); if (handle) handle.setAttribute("aria-expanded", "false"); }

  if (handle) {
    handle.addEventListener("click", function () {
      dock.classList.contains("is-open") ? close() : open();
    });
  }
  /* 关闭：点遮罩 / 点面板内 [data-hd-close] / Esc；事件委托到 dock，面板内的链接不受影响 */
  dock.addEventListener("click", function (e) {
    if (e.target.closest("[data-hd-close]") || e.target.classList.contains("hd-scrim")) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* 互斥接棒：滚过 in-flow 的 .hd-rail（进入 AI 专区/CTA/页脚）后把手才现身；回到正文区自动收起 */
  if (rail && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var past = e.boundingClientRect.top < 0 && !e.isIntersecting;
        dock.classList.toggle("is-live", past);
        if (!past) close();
      });
    }, { rootMargin: "-40px 0px 0px 0px" }).observe(rail);
  } else {
    dock.classList.add("is-live");
  }
})();

/* Leonis AI 中转站推广位：顶部通栏（P2）+ 右下角悬浮窗（P3）
   · 两者默认带 hidden 属性输出，本脚本按「7 天免打扰」记忆决定是否放行，避免闪一下再消失
   · 悬浮窗首次进入延迟 3 秒才出现，不打断首屏阅读
   · 关闭（FAB 角标 × / 面板底部「7 天内不再显示」/ 通栏 ×）→ localStorage.leonis_dismiss = 时间戳
   · 与「信号塔攻略」.hd-dock 的位置错开纯由 CSS（.hd-dock ~ .leo-dock）负责，两套脚本互不干涉 */
(function () {
  "use strict";
  var KEY = "leonis_dismiss", WEEK = 6048e5; /* 7 天（毫秒） */
  var dock = document.querySelector("[data-leo-dock]");
  var bar = document.querySelector("[data-leo-topbar]");
  if (!dock && !bar) return;

  function dismissed() {
    try {
      var t = parseInt(localStorage.getItem(KEY) || "0", 10);
      return t > 0 && (Date.now() - t) < WEEK;
    } catch (e) { return false; }
  }
  function hideAll() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    if (bar) bar.hidden = true;
    if (dock) { dock.classList.remove("is-open", "is-live"); dock.hidden = true; }
  }
  if (dismissed()) return;

  if (bar) {
    bar.hidden = false;
    bar.addEventListener("click", function (e) {
      if (e.target.closest("[data-leo-dismiss]")) hideAll();
    });
  }
  if (!dock) return;

  dock.hidden = false;
  var handle = dock.querySelector(".leo-handle");
  function open() { dock.classList.add("is-open"); if (handle) handle.setAttribute("aria-expanded", "true"); }
  function collapse() { dock.classList.remove("is-open"); if (handle) handle.setAttribute("aria-expanded", "false"); }

  /* 延迟 3s 出现 */
  setTimeout(function () { if (!dock.hidden) dock.classList.add("is-live"); }, 3000);

  if (handle) {
    handle.addEventListener("click", function () {
      dock.classList.contains("is-open") ? collapse() : open();
    });
  }
  dock.addEventListener("click", function (e) {
    if (e.target.closest("[data-leo-dismiss]")) { hideAll(); return; }
    if (e.target.closest("[data-leo-collapse]") || e.target.classList.contains("leo-scrim")) collapse();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") collapse(); });
})();
