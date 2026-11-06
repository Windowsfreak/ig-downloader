(() => {
  var t = [,,, (module, exports, require) => {
      const constants = require(4);
      module.exports = function () {
        return {
          t: [],
          o: function (t) {
            let e = t.match(/variables=([^&]+)/);
            return e && e[1] || null;
          },
          i: function (t) {
            let e = t.match(/query_hash=([^&]+)/);
            return e && e[1] || null;
          },
          _: function () {
            void 0 === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), void 0 === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach);
          },
          u: function (t) {
            let e = new Date(),
              n = new Date(e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate()).getTime();
            return Math.floor((n - 864e5 * t) / 1e3);
          },
          l: function (t) {
            let e = [];
            return t.forEach(function (t) {
              e = e.concat(t);
            }), e;
          },
          m() {
            const t = 6,
              e = 10,
              n = Math.floor(5 * Math.random()) + 6;
            let r = "";
            for (let t = 0; t < n; t++) {
              const t = void 0;
              r += Math.floor(10 * Math.random()).toString();
            }
            return r;
          },
          $: function (t, e) {
            let n = new XMLHttpRequest();
            n.open("GET", t, !0), n.responseType = "blob", n.onreadystatechange = function () {
              4 === this.readyState && (200 === this.status ? e(this.response) : e());
            }, n.send();
          },
          h: function () {
            let t = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
            return t && t[0];
          },
          p: function (t) {
            if (!t || !t.tagName) return null;
            let e;
            if ("a" === t.tagName.toLowerCase()) e = t.getAttribute("href");else {
              let n = t.querySelector('a[href*="/p/"], a[href*="/tv/"], a[href*="/reel/"]');
              n && n.hasAttribute("href") && (e = n.getAttribute("href"));
            }
            if (e) {
              let t = e.match(/\/(tv|p|reel)\/([^/]+)/);
              return t && t[2];
            }
            return Insta_Utils.v() || Insta_Utils.I() ? Insta_Utils.h() : void 0;
          },
          P: function () {
            return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]');
          },
          S() {
            let t = location.pathname.match("^/reels/audio/[0-9]+/?$");
            return t && t[0];
          },
          v() {
            let t = location.pathname.match("^/reel/[^/]+/?$");
            return t && t[0];
          },
          k: function () {
            return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname);
          },
          M: function () {
            return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]'));
          },
          U: function () {
            let t = location.pathname.match("^/reels/.*/$");
            return t && t[0];
          },
          F: function () {
            return this.M() && location.href.includes("/tagged/");
          },
          T: function () {
            return this.M() && location.href.includes("/guides/");
          },
          A: function () {
            return null !== document.querySelector('a[href^="/accounts/edit"]');
          },
          C: function () {
            return this.A() && location.href.includes("/saved/");
          },
          D: function () {
            return /instagram\.com\/stories\/[^/]+\//.test(location.href);
          },
          L: function () {
            return "/explore/" === location.pathname;
          },
          R: function () {
            return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href);
          },
          O: function () {
            return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href);
          },
          I: function () {
            return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href);
          },
          N: function () {
            return top !== self;
          },
          q: function () {
            return location.pathname.includes("stories/highlights");
          },
          H: function (t, e) {
            if (!t) return null;
            let n = t.match(/\/([^\/?]+)(?:$|\?)/);
            return n = n && n[1], n ? (e && (n = e + "_" + n), n) : null;
          },
          V: function (t) {
            return !("string" != typeof t || -1 != t.indexOf("blob:") || !t.match(/\.(png|jpg|mp4|flv)/));
          },
          B: function (t) {
            Insta_Utils.j("getQueryHashes", t);
          },
          G: function (t, e, n) {
            if (!t || !t.url) return n();
            var r = {
              url: t.url
            };
            t.filename && (r.filename = t.filename), chrome.downloads.download(r, function (e) {
              e ? n(e) : chrome.downloads.download({
                url: t.url
              }, function (t) {
                n(t);
              });
            });
          },
          Z: function (t, e) {
            this.j({
              action: "downloadFile",
              options: {
                url: t.url,
                filename: t.filename,
                isStory: void 0 !== t.isStory
              }
            }, function (t) {
              "function" == typeof e && e(t);
            });
          },
          J: function (t, e, n) {
            function r(t, r) {
              var o = parseInt(t[e]),
                i = parseInt(r[e]);
              return n ? o < i ? 1 : o > i ? -1 : 0 : o > i ? 1 : o < i ? -1 : 0;
            }
            t.sort(r);
          },
          X: function (t) {
            var e, n, r;
            for (r = t.length - 1; r > 0; r--) e = Math.floor(Math.random() * (r + 1)), n = t[r], t[r] = t[e], t[e] = n;
            return t;
          },
          Y: function () {
            if (location.href.indexOf("instagram.com/p/") > -1) return null;
            var t = location.href.match(/instagram\.com\/([^\/]+)/);
            return t && t[1].trim() || null;
          },
          j: function (t, e) {
            void 0 === e ? chrome.runtime.sendMessage(t) : chrome.runtime.sendMessage(t, e);
          },
          K: function (t) {
            var e = 0;
            return t.querySelectorAll("ul li").forEach(function (t) {
              t.querySelector("video") ? e++ : t.querySelectorAll("img").forEach(function (t) {
                t.width > 200 && t.height > 200 && e++;
              });
            }), e > 1;
          },
          W: function (t) {
            if (!t) return 0;
            var e = 0,
              n = t.querySelector('button[aria-current="step"], button[aria-current="true"], [role="button"][aria-current="step"], [role="button"][aria-current="true"]');
            if (n) {
              var r,
                o = (n.getAttribute("aria-label") || "").match(/(\d+)(?!.*\d)/);
              if (o && (e = parseInt(o[1], 10) - 1, !isNaN(e) && e >= 0)) return e;
              var i = n.parentElement;
              if (i) {
                for (var a = [], _ = 0; _ < i.children.length; _++) {
                  var u = i.children[_];
                  u.tagName && n.tagName && u.tagName.toLowerCase() === n.tagName.toLowerCase() && a.push(u);
                }
                var s = a.indexOf(n);
                if (s >= 0) return e = s;
              }
            }
            for (var l = t.querySelectorAll("div div div div"), c = 0, f = []; l[c];) {
              var d = l[c];
              if (c++, d.offsetHeight < 10 && d.offsetHeight === d.offsetWidth && d.parentElement.offsetWidth > 20 * d.parentElement.offsetHeight) {
                var g = d.parentElement.children,
                  m = !0;
                if (g.forEach(function (t) {
                  t.offsetHeight < 10 && t.offsetHeight === t.offsetWidth || (m = !1);
                }), g.length > 1 && m) {
                  f = g;
                  break;
                }
              }
            }
            var $ = 0;
            return f.forEach(function (t, n) {
              t.classList.length > $ && ($ = t.classList.length, e = n);
            }), e;
          },
          tt: function (t) {
            var e = Math.floor(parseInt(t) / 60).toString(),
              n = Math.floor(parseInt(t) % 60).toString();
            return 1 === e.length && (e = "0" + e), 1 === n.length && (n = "0" + n), e + ":" + n;
          },
          et: function () {
            let t = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
            if (t) {
              let e = t.closest("section");
              return e && (e.style.overflow = "visible"), e && e.querySelector("div>div") || e || null;
            }
          },
          nt: function (t) {
            return t.querySelector("video");
          },
          rt: function (t) {
            var e = t.getAttribute("src");
            if (e) return e;
            var n = t.querySelector("source");
            return n && (e = n.getAttribute("src")) ? e : null;
          },
          ot: function (t) {
            const e = "m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z";
            if (t.querySelector(`svg path[d="${e}"]`)) return !0;
            {
              let e = t.querySelector("video,img"),
                n = getComputedStyle(e);
              return this.it(parseInt(n.width) / parseInt(n.height));
            }
          },
          it: t => t >= .5 && t <= .6 || t === 9 / 16,
          _t: function (t) {
            if (!t) return null;
            var e = t.getAttribute("srcset");
            if (e) {
              var n = {},
                r;
              e.split(",").forEach(function (t) {
                var e = t.split(" "),
                  r = e[1].replace(/[^\d]/, "");
                n[r] || (n[r] = e[0]);
              });
              var o = 0;
              for (var i in n) +i > +o && (o = i);
              var a = n[o];
            }
            return "string" == typeof a && a.match(new RegExp("\\.(jpg|png)")) || (a = t.getAttribute("src")), a;
          },
          ut: function (t) {
            let e = null,
              n = t.querySelectorAll("img[src], img[srcset]");
            if (1 === n.length) e = n[0];else if (n.length > 1) for (let t = 0; n[t]; t++) n[t].width < 200 || n[t].height < 200 || (n[t].getAttribute("src") || n[t].getAttribute("srcset")) && (e = e || n[t], n[t].width > e.width && n[t].height > e.height && (e = n[t]));
            return e || null;
          },
          st: function (t, e) {
            chrome.runtime.sendMessage({
              action: "requestUserId",
              userName: t
            }, function (t) {
              if (!t || t && t.err) return e(null);
              e(t.userId);
            });
          },
          lt: function (t, e) {
            chrome.runtime.sendMessage({
              action: "requestUserPostCount",
              userName: t
            }, function (t) {
              if (!t || t && t.err) return e(null);
              e(t.postCount);
            });
          },
          ct: function (t, e) {
            let n = t.width || t.config_width || null,
              r = e.width || e.config_width || null,
              o = t.height || t.config_height || null,
              i = e.height || e.config_height || null;
            return n && r && n !== o && r !== i ? n !== r ? r > n ? 1 : -1 : i > o ? 1 : -1 : 0;
          },
          ft: function (t, e) {
            e && !Array.isArray(e) && (e = [e]);
            for (var n = [], r = {
                "{": 0,
                "[": 0
              }, o = {
                "}": "{",
                "]": "["
              }, i = /[{}\]\[":0-9.,-]/, a = /[\r\n\s\t]/, _ = "", u = 0, s; s = t[u]; u++) if ('"' !== s) i.test(s) ? (_ += s, "{" === s || "[" === s ? (r["{"] || r["["] || (_ = s), r[s]++) : "}" !== s && "]" !== s || (r[o[s]]--, r["{"] || r["["] || n.push(_))) : "t" === s && "true" === t.substr(u, 4) ? (_ += "true", u += 3) : "f" === s && "false" === t.substr(u, 5) ? (_ += "false", u += 4) : "n" === s && "null" === t.substr(u, 4) ? (_ += "null", u += 3) : a.test(s) || (r["{"] = 0, r["["] = 0, _ = "");else {
              for (var l = u; -1 !== l && (l === u || "\\" === t[l - 1]);) l = t.indexOf('"', l + 1);
              -1 === l && (l = t.length - 1), _ += t.substr(u, l - u + 1), u = l;
            }
            for (var c = [], u = 0, f; f = n[u]; u++) if ("{}" !== f && "[]" !== f) try {
              e ? e.every(function (t) {
                return t.test(f);
              }) && c.push(JSON.parse(f)) : c.push(JSON.parse(f));
            } catch (t) {}
            return c;
          },
          dt: function () {
            return Array.from(document.querySelectorAll("section")).find(t => !t.closest("[hidden]"));
          },
          gt: function () {
            const t = this.dt();
            return Array.from(t.querySelectorAll("div")).find(t => {
              let e = t.clientHeight || t.offsetHeight;
              if (e > 0 && e < 6) return t.parentElement;
            });
          },
          $t: function () {
            const t = this.gt();
            if (!t) return 0;
            let e = t.querySelectorAll("div[style]"),
              n;
            return e && e.length ? (e = e[e.length - 1].parentElement || null, null == e ? 0 : t.children && Array.from(t.children).indexOf(e) || 0) : 0;
          },
          ht(t) {
            t.length > 28 && (t = t.substr(0, t.length - 28));
            const e = "abcdefghijklmnopqrstuvwxyz",
              n = e.toUpperCase() + e + "0123456789-_";
            let r = BigInt(0);
            for (let e of t) {
              let t = n.indexOf(e);
              r *= BigInt(64), r += BigInt(t);
            }
            return r.toString();
          },
          vt(t) {
            try {
              return chrome.storage.local.set(t).finally(() => chrome.storage.sync.set(t)).catch(() => {});
            } catch (t) {
              return Promise.resolve();
            }
          },
          yt(t) {
            return this.vt({
              ["promotional_allowed"]: t,
              ["policy_accepted"]: !0
            });
          },
          bt: () => Promise.all([chrome.storage.sync.get("policy_accepted"), chrome.storage.local.get("policy_accepted")]).then(([t, e]) => !(!t.policy_accepted && !e.policy_accepted)).catch(t => {})
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          wt: "scrollUserFeedInfo",
          xt: "baseUserFeedInfo",
          Et: "s_key",
          St: "mp4",
          kt: "walk",
          Mt: 2,
          Ut: "jpg",
          Ft: "hist",
          Tt: "tim",
          At: "x-csrftoken",
          Ct: "doc_id",
          Dt: "x-instagram-ajax",
          Lt: "https://sites.google.com/view/downloader-promaster",
          Rt: "x-asbd-id",
          Ot: "data_skip",
          Nt: "x-ig-app-id",
          qt: "x-requested-with",
          Ht: "userFeed",
          It: "promotional_allowed",
          Vt: "x-ig-app-id_upload",
          Bt: "user_id",
          jt: "x-ig-www-claim",
          Pt: "policy_accepted",
          Gt: "data_ad",
          Zt: 1,
          Jt: "fb_dtsg"
        };
      }();
    }],
    e = {};
  function n(r) {
    var o = e[r];
    if (void 0 !== o) return o.exports;
    var i = e[r] = {
      exports: {}
    };
    return t[r](i, i.exports, n), i.exports;
  }
  const instaUtils = n(3),
    constants = n(4);
  function i() {
    for (var t = document.getElementsByTagName("html"), e = 0; e < t.length; e++) {
      var n = t[e],
        r = n.innerHTML.toString(),
        o = r.replace(/__MSG_(\w+)__/g, function (t, e) {
          return e ? chrome.i18n.getMessage(e) : "";
        });
      o != r && (n.innerHTML = o);
    }
  }
  function a() {
    i();
    let t = document.querySelector(".options .promotional") || null;
    t && chrome.storage.sync.get(null).then(e => {
      let n;
      e && e["promotional_allowed"] && (t.checked = !0);
      let r = document.querySelector(".save");
      r && r.addEventListener("click", _);
    });
  }
  function _(t) {
    let e = document.querySelector(".options .promotional") || null;
    if (!e) return;
    let n = e.checked || !1;
    instaUtils.j({
      action: "upd_promotional_status",
      status: n
    });
  }
  a();
})();