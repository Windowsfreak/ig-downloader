(() => {
  var e = [, , , (e, t, n) => {
      const r = n(4);
      e.exports = function() {
        return {
          t: [],
          o: function(e) {
            let t = e.match(/variables=([^&]+)/);
            return t && t[1] || null
          },
          i: function(e) {
            let t = e.match(/query_hash=([^&]+)/);
            return t && t[1] || null
          },
          _: function() {
            void 0 === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), void 0 === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach)
          },
          u: function(e) {
            let t = new Date,
              n = new Date(t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()).getTime();
            return Math.floor((n - 864e5 * e) / 1e3)
          },
          l: function(e) {
            let t = [];
            return e.forEach((function(e) {
              t = t.concat(e)
            })), t
          },
          $() {
            const e = 6,
              t = 10,
              n = Math.floor(5 * Math.random()) + 6;
            let r = "";
            for (let e = 0; e < n; e++) {
              const e = void 0;
              r += Math.floor(10 * Math.random()).toString()
            }
            return r
          },
          m: function(e, t) {
            let n = new XMLHttpRequest;
            n.open("GET", e, !0), n.responseType = "blob", n.onreadystatechange = function() {
              4 === this.readyState && (200 === this.status ? t(this.response) : t())
            }, n.send()
          },
          h: function() {
            let e = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
            return e && e[0]
          },
          p: function(e) {
            if (!e || !e.tagName) return null;
            let t;
            if ("a" === e.tagName.toLowerCase()) t = e.getAttribute("href");
            else {
              let n = e.querySelector('a[href*="/p/"], a[href*="/tv/"], a[href*="/reel/"]');
              n && n.hasAttribute("href") && (t = n.getAttribute("href"))
            }
            if (t) {
              let e = t.match(/\/(tv|p|reel)\/([^/]+)/);
              return e && e[2]
            }
            return Insta_Utils.v() || Insta_Utils.I() ? Insta_Utils.h() : void 0
          },
          P: function() {
            return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]')
          },
          S() {
            let e = location.pathname.match("^/reels/audio/[0-9]+/?$");
            return e && e[0]
          },
          v() {
            let e = location.pathname.match("^/reel/[^/]+/?$");
            return e && e[0]
          },
          k: function() {
            return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname)
          },
          M: function() {
            return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]'))
          },
          U: function() {
            let e = location.pathname.match("^/reels/.*/$");
            return e && e[0]
          },
          F: function() {
            return this.M() && location.href.includes("/tagged/")
          },
          T: function() {
            return this.M() && location.href.includes("/guides/")
          },
          A: function() {
            return null !== document.querySelector('a[href^="/accounts/edit"]')
          },
          C: function() {
            return this.A() && location.href.includes("/saved/")
          },
          D: function() {
            return /instagram\.com\/stories\/[^/]+\//.test(location.href)
          },
          L: function() {
            return "/explore/" === location.pathname
          },
          R: function() {
            return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href)
          },
          O: function() {
            return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href)
          },
          I: function() {
            return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href)
          },
          N: function() {
            return top !== self
          },
          q: function() {
            return location.pathname.includes("stories/highlights")
          },
          H: function(e, t) {
            if (!e) return null;
            let n = e.match(/\/([^\/?]+)(?:$|\?)/);
            return n = n && n[1], n ? (t && (n = t + "_" + n), n) : null
          },
          V: function(e) {
            return !("string" != typeof e || -1 != e.indexOf("blob:") || !e.match(/\.(png|jpg|mp4|flv)/))
          },
          B: function(e) {
            Insta_Utils.j("getQueryHashes", e)
          },
          G: function(e, t, n) {
            if (!e || !e.url) return n();
            var r = {
              url: e.url
            };
            e.filename && (r.filename = e.filename), chrome.downloads.download(r, (function(t) {
              t ? n(t) : chrome.downloads.download({
                url: e.url
              }, (function(e) {
                n(e)
              }))
            }))
          },
          Z: function(e, t) {
            this.j({
              action: "downloadFile",
              options: {
                url: e.url,
                filename: e.filename,
                isStory: void 0 !== e.isStory
              }
            }, (function(e) {
              "function" == typeof t && t(e)
            }))
          },
          J: function(e, t, n) {
            function r(e, r) {
              var o = parseInt(e[t]),
                i = parseInt(r[t]);
              return n ? o < i ? 1 : o > i ? -1 : 0 : o > i ? 1 : o < i ? -1 : 0
            }
            e.sort(r)
          },
          X: function(e) {
            var t, n, r;
            for (r = e.length - 1; r > 0; r--) t = Math.floor(Math.random() * (r + 1)), n = e[r], e[r] = e[t], e[t] = n;
            return e
          },
          Y: function() {
            if (location.href.indexOf("instagram.com/p/") > -1) return null;
            var e = location.href.match(/instagram\.com\/([^\/]+)/);
            return e && e[1].trim() || null
          },
          j: function(e, t) {
            void 0 === t ? chrome.runtime.sendMessage(e) : chrome.runtime.sendMessage(e, t)
          },
          K: function(e) {
            var t = 0;
            return e.querySelectorAll("ul li").forEach((function(e) {
              e.querySelector("video") ? t++ : e.querySelectorAll("img").forEach((function(e) {
                e.width > 200 && e.height > 200 && t++
              }))
            })), t > 1
          },
          W: function(e) {
            if (!e) return 0;
            var t = 0,
              n = e.querySelector('button[aria-current="step"], button[aria-current="true"], [role="button"][aria-current="step"], [role="button"][aria-current="true"]');
            if (n) {
              var r, o = (n.getAttribute("aria-label") || "").match(/(\d+)(?!.*\d)/);
              if (o && (t = parseInt(o[1], 10) - 1, !isNaN(t) && t >= 0)) return t;
              var i = n.parentElement;
              if (i) {
                for (var a = [], _ = 0; _ < i.children.length; _++) {
                  var u = i.children[_];
                  u.tagName && n.tagName && u.tagName.toLowerCase() === n.tagName.toLowerCase() && a.push(u)
                }
                var s = a.indexOf(n);
                if (s >= 0) return t = s
              }
            }
            for (var l = e.querySelectorAll("div div div div"), c = 0, f = []; l[c];) {
              var d = l[c];
              if (c++, d.offsetHeight < 10 && d.offsetHeight === d.offsetWidth && d.parentElement.offsetWidth > 20 * d.parentElement.offsetHeight) {
                var g = d.parentElement.children,
                  $ = !0;
                if (g.forEach((function(e) {
                    e.offsetHeight < 10 && e.offsetHeight === e.offsetWidth || ($ = !1)
                  })), g.length > 1 && $) {
                  f = g;
                  break
                }
              }
            }
            var m = 0;
            return f.forEach((function(e, n) {
              e.classList.length > m && (m = e.classList.length, t = n)
            })), t
          },
          ee: function(e) {
            var t = Math.floor(parseInt(e) / 60).toString(),
              n = Math.floor(parseInt(e) % 60).toString();
            return 1 === t.length && (t = "0" + t), 1 === n.length && (n = "0" + n), t + ":" + n
          },
          te: function() {
            let e = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
            if (e) {
              let t = e.closest("section");
              return t && (t.style.overflow = "visible"), t && t.querySelector("div>div") || t || null
            }
          },
          ne: function(e) {
            return e.querySelector("video")
          },
          re: function(e) {
            var t = e.getAttribute("src");
            if (t) return t;
            var n = e.querySelector("source");
            return n && (t = n.getAttribute("src")) ? t : null
          },
          oe: function(e) {
            const t = "m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z";
            if (e.querySelector(`svg path[d="${t}"]`)) return !0;
            {
              let t = e.querySelector("video,img"),
                n = getComputedStyle(t);
              return this.ie(parseInt(n.width) / parseInt(n.height))
            }
          },
          ie: e => e >= .5 && e <= .6 || e === 9 / 16,
          ae: function(e) {
            if (!e) return null;
            var t = e.getAttribute("srcset");
            if (t) {
              var n = {},
                r;
              t.split(",").forEach((function(e) {
                var t = e.split(" "),
                  r = t[1].replace(/[^\d]/, "");
                n[r] || (n[r] = t[0])
              }));
              var o = 0;
              for (var i in n) + i > +o && (o = i);
              var a = n[o]
            }
            return "string" == typeof a && a.match(new RegExp("\\.(jpg|png)")) || (a = e.getAttribute("src")), a
          },
          _e: function(e) {
            let t = null,
              n = e.querySelectorAll("img[src], img[srcset]");
            if (1 === n.length) t = n[0];
            else if (n.length > 1)
              for (let e = 0; n[e]; e++) n[e].width < 200 || n[e].height < 200 || (n[e].getAttribute("src") || n[e].getAttribute("srcset")) && (t = t || n[e], n[e].width > t.width && n[e].height > t.height && (t = n[e]));
            return t || null
          },
          ue: function(e, t) {
            chrome.runtime.sendMessage({
              action: "requestUserId",
              userName: e
            }, (function(e) {
              if (!e || e && e.err) return t(null);
              t(e.userId)
            }))
          },
          se: function(e, t) {
            chrome.runtime.sendMessage({
              action: "requestUserPostCount",
              userName: e
            }, (function(e) {
              if (!e || e && e.err) return t(null);
              t(e.postCount)
            }))
          },
          le: function(e, t) {
            let n = e.width || e.config_width || null,
              r = t.width || t.config_width || null,
              o = e.height || e.config_height || null,
              i = t.height || t.config_height || null;
            return n && r && n !== o && r !== i ? n !== r ? r > n ? 1 : -1 : i > o ? 1 : -1 : 0
          },
          ce: function(e, t) {
            t && !Array.isArray(t) && (t = [t]);
            for (var n = [], r = {
                "{": 0,
                "[": 0
              }, o = {
                "}": "{",
                "]": "["
              }, i = /[{}\]\[":0-9.,-]/, a = /[\r\n\s\t]/, _ = "", u = 0, s; s = e[u]; u++)
              if ('"' !== s) i.test(s) ? (_ += s, "{" === s || "[" === s ? (r["{"] || r["["] || (_ = s), r[s]++) : "}" !== s && "]" !== s || (r[o[s]]--, r["{"] || r["["] || n.push(_))) : "t" === s && "true" === e.substr(u, 4) ? (_ += "true", u += 3) : "f" === s && "false" === e.substr(u, 5) ? (_ += "false", u += 4) : "n" === s && "null" === e.substr(u, 4) ? (_ += "null", u += 3) : a.test(s) || (r["{"] = 0, r["["] = 0, _ = "");
              else {
                for (var l = u; - 1 !== l && (l === u || "\\" === e[l - 1]);) l = e.indexOf('"', l + 1); - 1 === l && (l = e.length - 1), _ += e.substr(u, l - u + 1), u = l
              } for (var c = [], u = 0, f; f = n[u]; u++)
              if ("{}" !== f && "[]" !== f) try {
                t ? t.every((function(e) {
                  return e.test(f)
                })) && c.push(JSON.parse(f)) : c.push(JSON.parse(f))
              } catch (e) {}
            return c
          },
          fe: function() {
            return Array.from(document.querySelectorAll("section")).find((e => !e.closest("[hidden]")))
          },
          de: function() {
            const e = this.fe();
            return Array.from(e.querySelectorAll("div")).find((e => {
              let t = e.clientHeight || e.offsetHeight;
              if (t > 0 && t < 6) return e.parentElement
            }))
          },
          ge: function() {
            const e = this.de();
            if (!e) return 0;
            let t = e.querySelectorAll("div[style]"),
              n;
            return t && t.length ? (t = t[t.length - 1].parentElement || null, null == t ? 0 : e.children && Array.from(e.children).indexOf(t) || 0) : 0
          },
          $e(e) {
            e.length > 28 && (e = e.substr(0, e.length - 28));
            const t = "abcdefghijklmnopqrstuvwxyz",
              n = t.toUpperCase() + t + "0123456789-_";
            let r = BigInt(0);
            for (let t of e) {
              let e = n.indexOf(t);
              r *= BigInt(64), r += BigInt(e)
            }
            return r.toString()
          },
          me(e) {
            try {
              return chrome.storage.local.set(e).finally((() => chrome.storage.sync.set(e))).catch((() => {}))
            } catch (e) {
              return Promise.resolve()
            }
          },
          he(e) {
            return this.me({
              [r.pe]: e,
              [r.ve]: !0
            })
          },
          ye: () => Promise.all([chrome.storage.sync.get(r.ve), chrome.storage.local.get(r.ve)]).then((([e, t]) => !(!e.policy_accepted && !t.policy_accepted))).catch((e => {}))
        }
      }()
    }, e => {
      e.exports = function() {
        return {
          Ie: "scrollUserFeedInfo",
          we: "baseUserFeedInfo",
          Pe: "s_key",
          be: "mp4",
          Se: "walk",
          xe: 2,
          Ee: "jpg",
          ke: "hist",
          Me: "tim",
          Ue: "x-csrftoken",
          Fe: "doc_id",
          Te: "x-instagram-ajax",
          Ae: "https://sites.google.com/view/downloader-promaster",
          Ce: "x-asbd-id",
          De: "data_skip",
          Le: "x-ig-app-id",
          Re: "x-requested-with",
          Oe: "userFeed",
          pe: "promotional_allowed",
          Ne: "x-ig-app-id_upload",
          qe: "user_id",
          He: "x-ig-www-claim",
          ve: "policy_accepted",
          Ve: "data_ad",
          Be: 1,
          je: "fb_dtsg"
        }
      }()
    }],
    t = {};

  function n(r) {
    var o = t[r];
    if (void 0 !== o) return o.exports;
    var i = t[r] = {
      exports: {}
    };
    return e[r](i, i.exports, n), i.exports
  }
  const r = n(4),
    o = n(3);

  function i() {
    for (var e = document.getElementsByTagName("html"), t = 0; t < e.length; t++) {
      var n = e[t],
        r = n.innerHTML.toString(),
        o = r.replace(/__MSG_(\w+)__/g, (function(e, t) {
          return t ? chrome.i18n.getMessage(t) : ""
        }));
      o != r && (n.innerHTML = o)
    }
  }

  function a() {
    i();
    const e = document.querySelector(".accept");
    e && o.ye().then((t => {
      t || e.addEventListener("click", (() => {
        o.j({
          action: "updateStorage",
          data: {
            policy_accepted: !0,
            [r.pe]: !0
          }
        }, (() => {
          window.close()
        }))
      }))
    }))
  }
  a()
})();