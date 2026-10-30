(() => {
  var e = [, (e, t, n) => {
      const r = n(2),
        o = n(3);
      e.exports = function() {
        return {
          t: function(e) {
            const t = this;
            let n = e.url,
              i = o.o(n),
              s = o.i(n);
            if (i && s) {
              i = decodeURIComponent(i);
              try {
                i = JSON.parse(i)
              } catch (e) {}
              i.shortcode && i.child_comment_count ? t.u("post", s) : i.id && i.first && i.after && r._(e.tabId, (function(e) {
                /\/channel\/|\/tagged\/|\/guides\//.test(e) ? e.includes("/channel/") && t.u("channel", s) : t.u("owner", s)
              }))
            }
          },
          l: function() {
            const e = this;
            chrome.storage.local.get("query_hashes", (function(e) {
              e.query_hashes || chrome.storage.local.set({
                query_hashes: {
                  owner: "8c2a529969ee035a5063f2fc8602a0fd",
                  post: "2efa04f61586458cef44441f474eee7c",
                  channel: "bc78b344a68ed16dd5d7f264681c4c76"
                }
              })
            })), chrome.webRequest.onBeforeSendHeaders.addListener(e.t.bind(e), {
              urls: ["*://*.instagram.com/graphql/query/?*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"])
          },
          u: function(e, t) {
            chrome.storage.local.get("query_hashes", (function(n) {
              n.query_hashes[e] = t, chrome.storage.local.set({
                query_hashes: n.query_hashes
              })
            }))
          },
          h: function() {
            return chrome.storage.local.get("query_hashes").then((function(e) {
              if (e.query_hashes) return e.query_hashes;
              throw "No query_hashes"
            }))
          }
        }
      }()
    }, e => {
      e.exports = function() {
        return {
          m: "*://*.instagram.com/*",
          _: function(e, t) {
            e < 0 || chrome.tabs.get(e, (function(e) {
              t(e.url)
            }))
          },
          p: function(e) {
            const t = this;
            chrome.tabs.query({
              url: [t.m]
            }, (function(n) {
              let r = [];
              n.forEach((function(n) {
                r.push(n.id), t.$(r, e)
              }))
            }))
          },
          $: function(e, t) {
            const n = this;
            if (0 === e.length) return t(!1);
            let r = e.pop();
            chrome.tabs.sendMessage(r, "isBulkDownloadNowInTab", (function(r) {
              r && t(!0), n.$(e, t)
            }))
          }
        }
      }()
    }, (e, t, n) => {
      const r = n(4);
      e.exports = function() {
        return {
          v: [],
          o: function(e) {
            let t = e.match(/variables=([^&]+)/);
            return t && t[1] || null
          },
          i: function(e) {
            let t = e.match(/query_hash=([^&]+)/);
            return t && t[1] || null
          },
          P: function() {
            void 0 === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), void 0 === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach)
          },
          I: function(e) {
            let t = new Date,
              n = new Date(t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()).getTime();
            return Math.floor((n - 864e5 * e) / 1e3)
          },
          q: function(e) {
            let t = [];
            return e.forEach((function(e) {
              t = t.concat(e)
            })), t
          },
          k() {
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
          S: function(e, t) {
            let n = new XMLHttpRequest;
            n.open("GET", e, !0), n.responseType = "blob", n.onreadystatechange = function() {
              4 === this.readyState && (200 === this.status ? t(this.response) : t())
            }, n.send()
          },
          U: function() {
            let e = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
            return e && e[0]
          },
          R: function(e) {
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
            return Insta_Utils.C() || Insta_Utils.D() ? Insta_Utils.U() : void 0
          },
          T: function() {
            return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]')
          },
          N() {
            let e = location.pathname.match("^/reels/audio/[0-9]+/?$");
            return e && e[0]
          },
          C() {
            let e = location.pathname.match("^/reel/[^/]+/?$");
            return e && e[0]
          },
          A: function() {
            return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname)
          },
          H: function() {
            return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]'))
          },
          M: function() {
            let e = location.pathname.match("^/reels/.*/$");
            return e && e[0]
          },
          O: function() {
            return this.H() && location.href.includes("/tagged/")
          },
          F: function() {
            return this.H() && location.href.includes("/guides/")
          },
          L: function() {
            return null !== document.querySelector('a[href^="/accounts/edit"]')
          },
          B: function() {
            return this.L() && location.href.includes("/saved/")
          },
          j: function() {
            return /instagram\.com\/stories\/[^/]+\//.test(location.href)
          },
          V: function() {
            return "/explore/" === location.pathname
          },
          J: function() {
            return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href)
          },
          G: function() {
            return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href)
          },
          D: function() {
            return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href)
          },
          X: function() {
            return top !== self
          },
          Z: function() {
            return location.pathname.includes("stories/highlights")
          },
          Y: function(e, t) {
            if (!e) return null;
            let n = e.match(/\/([^\/?]+)(?:$|\?)/);
            return n = n && n[1], n ? (t && (n = t + "_" + n), n) : null
          },
          K: function(e) {
            return !("string" != typeof e || -1 != e.indexOf("blob:") || !e.match(/\.(png|jpg|mp4|flv)/))
          },
          h: function(e) {
            Insta_Utils.W("getQueryHashes", e)
          },
          ee: function(e, t, n) {
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
          te: function(e, t) {
            this.W({
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
          ne: function(e, t, n) {
            function r(e, r) {
              var o = parseInt(e[t]),
                i = parseInt(r[t]);
              return n ? o < i ? 1 : o > i ? -1 : 0 : o > i ? 1 : o < i ? -1 : 0
            }
            e.sort(r)
          },
          re: function(e) {
            var t, n, r;
            for (r = e.length - 1; r > 0; r--) t = Math.floor(Math.random() * (r + 1)), n = e[r], e[r] = e[t], e[t] = n;
            return e
          },
          oe: function() {
            if (location.href.indexOf("instagram.com/p/") > -1) return null;
            var e = location.href.match(/instagram\.com\/([^\/]+)/);
            return e && e[1].trim() || null
          },
          W: function(e, t) {
            void 0 === t ? chrome.runtime.sendMessage(e) : chrome.runtime.sendMessage(e, t)
          },
          ie: function(e) {
            var t = 0;
            return e.querySelectorAll("ul li").forEach((function(e) {
              e.querySelector("video") ? t++ : e.querySelectorAll("img").forEach((function(e) {
                e.width > 200 && e.height > 200 && t++
              }))
            })), t > 1
          },
          se: function(e) {
            if (!e) return 0;
            var t = 0,
              n = e.querySelector('button[aria-current="step"], button[aria-current="true"], [role="button"][aria-current="step"], [role="button"][aria-current="true"]');
            if (n) {
              var r, o = (n.getAttribute("aria-label") || "").match(/(\d+)(?!.*\d)/);
              if (o && (t = parseInt(o[1], 10) - 1, !isNaN(t) && t >= 0)) return t;
              var i = n.parentElement;
              if (i) {
                for (var s = [], u = 0; u < i.children.length; u++) {
                  var a = i.children[u];
                  a.tagName && n.tagName && a.tagName.toLowerCase() === n.tagName.toLowerCase() && s.push(a)
                }
                var c = s.indexOf(n);
                if (c >= 0) return t = c
              }
            }
            for (var _ = e.querySelectorAll("div div div div"), l = 0, f = []; _[l];) {
              var d = _[l];
              if (l++, d.offsetHeight < 10 && d.offsetHeight === d.offsetWidth && d.parentElement.offsetWidth > 20 * d.parentElement.offsetHeight) {
                var h = d.parentElement.children,
                  m = !0;
                if (h.forEach((function(e) {
                    e.offsetHeight < 10 && e.offsetHeight === e.offsetWidth || (m = !1)
                  })), h.length > 1 && m) {
                  f = h;
                  break
                }
              }
            }
            var p = 0;
            return f.forEach((function(e, n) {
              e.classList.length > p && (p = e.classList.length, t = n)
            })), t
          },
          ue: function(e) {
            var t = Math.floor(parseInt(e) / 60).toString(),
              n = Math.floor(parseInt(e) % 60).toString();
            return 1 === t.length && (t = "0" + t), 1 === n.length && (n = "0" + n), t + ":" + n
          },
          ae: function() {
            let e = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
            if (e) {
              let t = e.closest("section");
              return t && (t.style.overflow = "visible"), t && t.querySelector("div>div") || t || null
            }
          },
          ce: function(e) {
            return e.querySelector("video")
          },
          _e: function(e) {
            var t = e.getAttribute("src");
            if (t) return t;
            var n = e.querySelector("source");
            return n && (t = n.getAttribute("src")) ? t : null
          },
          le: function(e) {
            const t = "m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z";
            if (e.querySelector(`svg path[d="${t}"]`)) return !0;
            {
              let t = e.querySelector("video,img"),
                n = getComputedStyle(t);
              return this.fe(parseInt(n.width) / parseInt(n.height))
            }
          },
          fe: e => e >= .5 && e <= .6 || e === 9 / 16,
          de: function(e) {
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
              var s = n[o]
            }
            return "string" == typeof s && s.match(new RegExp("\\.(jpg|png)")) || (s = e.getAttribute("src")), s
          },
          he: function(e) {
            let t = null,
              n = e.querySelectorAll("img[src], img[srcset]");
            if (1 === n.length) t = n[0];
            else if (n.length > 1)
              for (let e = 0; n[e]; e++) n[e].width < 200 || n[e].height < 200 || (n[e].getAttribute("src") || n[e].getAttribute("srcset")) && (t = t || n[e], n[e].width > t.width && n[e].height > t.height && (t = n[e]));
            return t || null
          },
          me: function(e, t) {
            chrome.runtime.sendMessage({
              action: "requestUserId",
              userName: e
            }, (function(e) {
              if (!e || e && e.err) return t(null);
              t(e.userId)
            }))
          },
          pe: function(e, t) {
            chrome.runtime.sendMessage({
              action: "requestUserPostCount",
              userName: e
            }, (function(e) {
              if (!e || e && e.err) return t(null);
              t(e.postCount)
            }))
          },
          ge: function(e, t) {
            let n = e.width || e.config_width || null,
              r = t.width || t.config_width || null,
              o = e.height || e.config_height || null,
              i = t.height || t.config_height || null;
            return n && r && n !== o && r !== i ? n !== r ? r > n ? 1 : -1 : i > o ? 1 : -1 : 0
          },
          $e: function(e, t) {
            t && !Array.isArray(t) && (t = [t]);
            for (var n = [], r = {
                "{": 0,
                "[": 0
              }, o = {
                "}": "{",
                "]": "["
              }, i = /[{}\]\[":0-9.,-]/, s = /[\r\n\s\t]/, u = "", a = 0, c; c = e[a]; a++)
              if ('"' !== c) i.test(c) ? (u += c, "{" === c || "[" === c ? (r["{"] || r["["] || (u = c), r[c]++) : "}" !== c && "]" !== c || (r[o[c]]--, r["{"] || r["["] || n.push(u))) : "t" === c && "true" === e.substr(a, 4) ? (u += "true", a += 3) : "f" === c && "false" === e.substr(a, 5) ? (u += "false", a += 4) : "n" === c && "null" === e.substr(a, 4) ? (u += "null", a += 3) : s.test(c) || (r["{"] = 0, r["["] = 0, u = "");
              else {
                for (var _ = a; - 1 !== _ && (_ === a || "\\" === e[_ - 1]);) _ = e.indexOf('"', _ + 1); - 1 === _ && (_ = e.length - 1), u += e.substr(a, _ - a + 1), a = _
              } for (var l = [], a = 0, f; f = n[a]; a++)
              if ("{}" !== f && "[]" !== f) try {
                t ? t.every((function(e) {
                  return e.test(f)
                })) && l.push(JSON.parse(f)) : l.push(JSON.parse(f))
              } catch (e) {}
            return l
          },
          we: function() {
            return Array.from(document.querySelectorAll("section")).find((e => !e.closest("[hidden]")))
          },
          ye: function() {
            const e = this.we();
            return Array.from(e.querySelectorAll("div")).find((e => {
              let t = e.clientHeight || e.offsetHeight;
              if (t > 0 && t < 6) return e.parentElement
            }))
          },
          ve: function() {
            const e = this.ye();
            if (!e) return 0;
            let t = e.querySelectorAll("div[style]"),
              n;
            return t && t.length ? (t = t[t.length - 1].parentElement || null, null == t ? 0 : e.children && Array.from(e.children).indexOf(t) || 0) : 0
          },
          Pe(e) {
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
          be(e) {
            try {
              return chrome.storage.local.set(e).finally((() => chrome.storage.sync.set(e))).catch((() => {}))
            } catch (e) {
              return Promise.resolve()
            }
          },
          Ie(e) {
            return this.be({
              [r.qe]: e,
              [r.xe]: !0
            })
          },
          ke: () => Promise.all([chrome.storage.sync.get(r.xe), chrome.storage.local.get(r.xe)]).then((([e, t]) => !(!e.policy_accepted && !t.policy_accepted))).catch((e => {}))
        }
      }()
    }, e => {
      e.exports = function() {
        return {
          Se: "scrollUserFeedInfo",
          Ue: "baseUserFeedInfo",
          Re: "s_key",
          Ce: "mp4",
          De: "walk",
          Te: 2,
          Ne: "jpg",
          Ae: "hist",
          He: "tim",
          Me: "x-csrftoken",
          Oe: "doc_id",
          Fe: "x-instagram-ajax",
          Ee: "https://sites.google.com/view/downloader-promaster",
          Le: "x-asbd-id",
          Be: "data_skip",
          je: "x-ig-app-id",
          Ve: "x-requested-with",
          Je: "userFeed",
          qe: "promotional_allowed",
          Qe: "x-ig-app-id_upload",
          Ge: "user_id",
          Xe: "x-ig-www-claim",
          xe: "policy_accepted",
          Ze: "data_ad",
          ze: 1,
          Ye: "fb_dtsg"
        }
      }()
    }, (e, t, n) => {
      const r = n(4),
        o = n(6),
        i = n(1),
        s = n(7),
        u = n(2),
        a = n(8),
        c = n(12),
        _ = n(3);
      e.exports = function() {
        return {
          Ke() {
            chrome.tabs.create({
              url: chrome.runtime.getURL("html/pp.html"),
              active: !0
            })
          },
          We: function() {
            const e = this;
            chrome.runtime.onInstalled.addListener((async t => {
              _.ke().then((n => {
                n || "install" === t.reason && e.Ke()
              }))
            })), chrome.runtime.onConnect.addListener((function(e) {})), chrome.action.onClicked.addListener((function() {
              chrome.tabs.create({
                url: "https://www.instagram.com/"
              })
            })), chrome.runtime.onMessage.addListener((function(e, t, n) {
              if (e)
                if ("string" == typeof e) switch (e) {
                  case "getCookies":
                    return s.et().then(n).catch((() => n)), !0;
                  case "getAllHeaders":
                    return o.tt().then(n).catch((() => n)), !0;
                  case "getQueryHashes":
                    return i.h().then(n).catch((() => n)), !0;
                  case "checkBulkDownloadNow":
                    return u.p(n), !0;
                  case "check_policy_accept":
                    return _.ke().then(n), !0;
                  case "getCsrftoken":
                    return s.nt().then(n).catch((() => n)), !0;
                  case "is_bulk_advanced":
                    return chrome.storage.local.get("bulk_advanced", (function(e) {
                      n(e.bulk_advanced)
                    })), !0;
                  default:
                    return
                } else if ("object" == typeof e && "string" == typeof e.action) switch (e.action) {
                  case "downloadFile":
                    return _.ee(e.options, t, n), !0;
                  case "bulk_advanced":
                    chrome.storage.local.set({
                      bulk_advanced: e.value
                    });
                    break;
                  case "requestHighlights":
                    return a.ot(e.reel_ids, n), !0;
                  case "requestHtmlByShortcode":
                    return a.it(e.shortcode, n), !0;
                  case "requestStories":
                    return a.st(e.userId || e.reel_ids, n), !0;
                  case "requestUserId":
                    return a.ut(e.userName, n), !0;
                  case "requestUserPostCount":
                    return a.ct(e.userName, n), !0;
                  case "baseGraphqlQueryRequest":
                    return a._t(e.opts, n), !0;
                  case "baseMediaInfoRequest":
                    return a.lt(e.opts, n), !0;
                  case "uploadPhotoRequest":
                    return c.ft(e.opts, n), !0;
                  case "uploadVideoRequest":
                    return c.dt(e.opts, n), !0;
                  case "uploadPostConfigureRequest":
                    return c.ht(e.opts, n), !0;
                  case "getUserIdByUserName":
                    return a.gt(e.userName, n), !0;
                  case "getUserStoriesCount":
                    return a.$t(n), !0;
                  case "updateStorage":
                    return _.be(e.data).then(n), !0;
                  case "upd_promotional_status":
                    return _.Ie(e.status).then(n), !0;
                  default:
                    return
                }
            }))
          }
        }
      }()
    }, (e, t, n) => {
      const r = n(4);
      e.exports = function() {
        return {
          wt: {
            "x-instagram-ajax": "017fef72480c",
            "x-asbd-id": "437806",
            "x-requested-with": "XMLHttpRequest",
            "x-ig-app-id": "936619743392459",
            "x-ig-app-id_upload": "1217981644879628"
          },
          yt: function(e) {
            this.tt().then((function(t) {
              chrome.storage.local.set({
                headers: {
                  ...t,
                  ...e
                }
              })
            })).catch((function() {
              chrome.storage.local.set({
                headers: e
              })
            }))
          },
          tt: function() {
            return chrome.storage.local.get("headers").then((function(e) {
              if (e.headers) return e.headers;
              throw "No headers"
            }))
          },
          vt: function(e) {
            return this.tt().then((function(t) {
              let n = [];
              for (let r = 0; e[r]; r++) {
                if (!t.hasOwnProperty(e[r])) throw `Not found requested header [${e[r]}]`;
                n[e[r]] = t[e[r]]
              }
              return n
            }))
          },
          Pt(e) {
            let t = e.requestBody || null;
            if (!t) return;
            let n = t.formData && t.formData.fb_dtsg || null;
            n = n && n.length && n[0] || null, n && chrome.storage.local.set({
              fb_dtsg: n
            })
          },
          bt: function(e) {
            const t = [r.Xe, r.Fe, r.Le, r.Ve, r.je],
              n = {};
            for (let r = 0; e.requestHeaders[r]; r++) {
              let o = e.requestHeaders[r];
              t.includes(o.name.toLowerCase()) && o.value.length && (n[o.name.toLowerCase()] = o.value), this.yt(n)
            }
          },
          It: function(e) {
            const t = r.je,
              n = {};
            for (let r = 0; e.requestHeaders[r]; r++) {
              let o = e.requestHeaders[r];
              if (t === o.name.toLowerCase() && o.value.length) {
                n[t] = o.value;
                break
              }
              this.yt(n)
            }
          },
          l: function() {
            const e = this;
            e.tt().catch((function() {
              e.yt(e.wt)
            })), chrome.webRequest.onBeforeSendHeaders.addListener(e.bt.bind(e), {
              urls: ["*://*.instagram.com/*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"]), chrome.webRequest.onBeforeRequest.addListener(e.Pt.bind(e), {
              urls: ["*://*.instagram.com/*"],
              types: ["xmlhttprequest"]
            }, ["requestBody"]), chrome.webRequest.onBeforeSendHeaders.addListener(e.It.bind(e), {
              urls: ["*://*.instagram.com/rupload_igphoto/*", "*://*.instagram.com/rupload_igvideo/*", "*://*.instagram.com/api/v1/web/create/*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"])
          }
        }
      }()
    }, e => {
      e.exports = function() {
        return {
          et: function() {
            return chrome.cookies ? chrome.cookies.getAll({
              url: "https://*.instagram.com"
            }).then((function(e) {
              let t = {};
              if (e.forEach((function(e) {
                  t[e.name] = e.value
                })), t.ds_user_id && t.sessionid) return t;
              throw "Not authorized"
            })) : Promise.resolve()
          },
          nt: function() {
            return this.et().then((function(e) {
              return e && e.csrftoken || null
            }))
          }
        }
      }()
    }, (e, t, n) => {
      const r = n(4),
        o = n(7),
        i = n(6),
        s = n(1),
        u = n(9),
        a = n(10),
        c = n(11);
      e.exports = function() {
        return {
          it: function(e, t) {
            if (!e) return t(null);
            const n = `https://www.instagram.com/p/${e}/`,
              s = [r.Fe, r.Le, r.je, r.Ve];
            let u;
            return o.nt().then((function(e) {
              return u = e, i.vt(s)
            })).then((function(e) {
              return c.qt(n, {
                headers: {
                  ...e,
                  "x-csrftoken": u,
                  accept: "text/html"
                }
              })
            })).then((function(e) {
              t(e)
            }))
          },
          ut: function(e, t) {
            let r = "https://www.instagram.com/api/v1/users/web_profile_info/?username=" + encodeURIComponent(e);
            fetch(r, {
              headers: {
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "accept": "*/*"
              },
              credentials: "include"
            }).then((function(res) {
              if (200 !== res.status && 202 !== res.status) throw `request error [${r}]`;
              return res.json();
            })).then((function(data) {
              let n = data && data.data && data.data.user && data.data.user.id || null;
              if (!n) throw "Not found userId";
              t({
                userId: n
              });
            })).catch((function() {
              fetch("https://www.instagram.com/" + encodeURIComponent(e) + "/", { credentials: "include" })
                .then(function(res) { return res.text(); })
                .then(function(html) {
                  let m = html.match(/"props":\s*\{\s*"user_id":\s*"(\d+)"/) || html.match(/"profile_id":\s*"?(\d+)"?/) || html.match(/"id":\s*"(\d+)"/);
                  if (m && m[1]) {
                    t({ userId: m[1] });
                  } else {
                    t({ error: 1, err: 1 });
                  }
                })
                .catch(function() {
                  t({ error: 1, err: 1 });
                });
            }));
          },
          ct: function(e, t) {
            let r = "https://www.instagram.com/api/v1/users/web_profile_info/?username=" + encodeURIComponent(e);
            fetch(r, {
              headers: {
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "accept": "*/*"
              },
              credentials: "include"
            }).then((function(res) {
              if (200 !== res.status && 202 !== res.status) throw `request error [${r}]`;
              return res.json();
            })).then((function(data) {
              let n = data && data.data && data.data.user && data.data.user.edge_owner_to_timeline_media && data.data.user.edge_owner_to_timeline_media.count || null;
              if (!n) throw "Not found postCount";
              t({
                postCount: n
              });
            })).catch((function() {
              t({
                error: 1,
                err: 1
              });
            }));
          },
          st: function(e, t) {
            let isHighlight = typeof e === "string" && e.startsWith("highlight:");
            this.fetchStories(e, isHighlight, t);
          },
          ot: function(e, t) {
            this.fetchStories(e, true, t);
          },
          fetchStories: function(e, isHighlight, cb) {
            let ids = Array.isArray(e) ? e.slice() : [e];
            ids = ids.map(function(id) { return String(id || "").trim(); }).filter(Boolean);
            if (!ids.length) {
              return cb({ error: 1, err: "no_ids" });
            }
            if (ids.some(function(id) { return id.startsWith("highlight:"); })) {
              isHighlight = true;
            }
            let formattedIds = ids.map(function(id) {
              let clean = id.replace(/^highlight:/, "");
              return isHighlight ? `highlight:${clean}` : clean;
            });
            let initialReelId = formattedIds[0];
            let variables = {
              after: null,
              before: null,
              first: Math.max(1, formattedIds.length),
              initial_reel_id: initialReelId,
              is_highlight: !!isHighlight,
              last: null,
              reel_ids: formattedIds,
              __relay_internal__pv__PolarisCommunityNoteStoriesLabelEnabledrelayprovider: true
            };

            let docId = "29362383363379781";
            let friendlyName = "PolarisStoriesV3HighlightsPagePaginationQuery";

            let getDtsg = function() {
              return new Promise(function(resolve) {
                chrome.storage.local.get("fb_dtsg", function(r) {
                  let token = (r && r.fb_dtsg) || null;
                  if (token) return resolve(token);
                  fetch("https://www.instagram.com/", { credentials: "include" })
                    .then(function(res) { return res.text(); })
                    .then(function(html) {
                      let m = html.match(/"DTSGInitialData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) ||
                              html.match(/"token":\s*"([^"]+)"(?:,\s*"async_get_token")?/) ||
                              html.match(/name="fb_dtsg"\s+value="([^"]+)"/);
                      let t = m && m[1];
                      if (t) {
                        chrome.storage.local.set({ fb_dtsg: t });
                        resolve(t);
                      } else {
                        resolve(null);
                      }
                    })
                    .catch(function() { resolve(null); });
                });
              });
            };

            Promise.all([
              getDtsg(),
              o.nt().catch(function() { return null; }),
              i.tt().catch(function() { return i.wt; })
            ]).then(function(resArr) {
              let dtsg = resArr[0];
              let csrf = resArr[1];
              let storedHeaders = resArr[2] || i.wt || {};

              let headers = {
                ...storedHeaders,
                "content-type": "application/x-www-form-urlencoded",
                "accept": "*/*",
                "x-fb-friendly-name": friendlyName,
                "x-ig-app-id": storedHeaders["x-ig-app-id"] || (i.wt && i.wt["x-ig-app-id"]) || "936619743392459"
              };
              if (csrf) {
                headers["x-csrftoken"] = csrf;
              }

              let bodyParams = new URLSearchParams();
              bodyParams.set("doc_id", docId);
              bodyParams.set("variables", JSON.stringify(variables));
              bodyParams.set("fb_api_req_friendly_name", friendlyName);
              bodyParams.set("fb_api_caller_class", "RelayModern");
              bodyParams.set("server_timestamps", "true");
              if (dtsg) {
                bodyParams.set("fb_dtsg", dtsg);
              }

              return fetch("https://www.instagram.com/graphql/query", {
                method: "POST",
                headers: headers,
                credentials: "include",
                body: bodyParams.toString()
              });
            }).then(function(res) {
              if (200 !== res.status && 202 !== res.status) {
                throw new Error("request error [" + res.status + "]");
              }
              return res.json();
            }).then(function(data) {
              let connection = data && data.data && (data.data.xdt_api__v1__feed__reels_media__connection || data.data.reels_media_connection);
              let nodes = [];
              if (connection && Array.isArray(connection.edges)) {
                nodes = connection.edges.map(function(e) { return e && e.node; }).filter(Boolean);
              } else if (data && data.data && Array.isArray(data.data.reels_media)) {
                nodes = data.data.reels_media;
              } else if (data && Array.isArray(data.reels_media)) {
                nodes = data.reels_media;
              }

              nodes.forEach(function(node) {
                if (node) {
                  if (!node.owner && node.user) {
                    node.owner = node.user;
                  }
                  if (Array.isArray(node.items)) {
                    node.items.forEach(function(it) {
                      if (it) {
                        if (!it.user && node.user) it.user = node.user;
                        if (!it.owner && (node.owner || node.user)) it.owner = node.owner || node.user;
                      }
                    });
                  }
                }
              });

              let reelsObj = {};
              nodes.forEach(function(node) {
                if (node && node.id) {
                  let raw = String(node.id).replace(/^highlight:/, "");
                  reelsObj[node.id] = node;
                  reelsObj[raw] = node;
                }
              });
              if (nodes.length > 0) {
                formattedIds.forEach(function(fid) {
                  let raw = fid.replace(/^highlight:/, "");
                  if (!reelsObj[fid]) reelsObj[fid] = nodes[0];
                  if (!reelsObj[raw]) reelsObj[raw] = nodes[0];
                });
              }

              let normalized = {
                ...(data || {}),
                data: {
                  ...((data && data.data) || {}),
                  reels_media: nodes
                },
                reels_media: nodes,
                reel: nodes[0] || null,
                reels: reelsObj
              };
              cb(normalized);
            }).catch(function(err) {
              console.error("fetchStories error:", err);
              cb({
                error: 1,
                err: 1
              });
            });
          },
          _t: function(e, t) {
            s.h().then((function(t) {
              const n = void 0,
                r = "https://www.instagram.com/graphql/query/?query_hash=" + t[e.request_type] + "&variables=" + encodeURIComponent(JSON.stringify(e.data));
              return c.kt(r)
            })).then((function(e) {
              t(e)
            })).catch((function(e) {
              t({
                error: 1
              })
            }))
          },
          St: function(e, t) {
            const n = this;
            let o = e.after || null,
              i = o ? r.Se : r.Ue;
            u.Ut(i).then((function(n) {
              if (!n) return t(null);
              chrome.storage.local.get("fb_dtsg", (function(r) {
                let i = r && r.fb_dtsg || null,
                  s = {
                    data: {
                      count: 12,
                      include_reel_media_seen_timestamp: !0,
                      include_relationship_info: !0,
                      latest_besties_reel_media: !0,
                      latest_reel_media: !0
                    },
                    username: e.userName,
                    __relay_internal__pv__PolarisIsLoggedInrelayprovider: !0,
                    __relay_internal__pv__PolarisShareSheetV3relayprovider: !1
                  };
                o && (s = {
                  ...s,
                  first: 12,
                  last: null,
                  after: o || "",
                  before: null
                }), s = JSON.stringify(s);
                let u = {
                  fb_dtsg: i,
                  variables: s,
                  doc_id: n,
                  fb_api_caller_class: "RelayModern",
                  fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                  server_timestamps: !0
                };
                const a = "https://www.instagram.com/graphql/query";
                c.Rt(a, u).then((function(e) {
                  t(e)
                })).catch((function(e) {
                  t({
                    error: 1
                  })
                }))
              }))
            }))
          },
          lt: function(e, t) {
            const n = `https://www.instagram.com/api/v1/media/${e.data.pk}/info/`;
            return c.kt(n).then((function(e) {
              t(e)
            })).catch((function(e) {
              t({
                error: 1
              })
            }))
          },
          gt: function(e, t) {
            let n = "https://www.instagram.com/" + e + "/";
            c.Ct(n).then((function(e) {
              return e.text()
            })).then((function(e) {
              let r = e.match(/\"profile_id\":\s?\"(\d+)/);
              if (r = r && r[1], !r) throw `not received userId [${n}]`;
              t(r)
            })).catch((function() {
              return t()
            }))
          },
          $t: function(e) {
            return o.et().then((async function(t) {
              if (t || (t = await a.Dt()), !t) return Promise.reject();
              const n = "https://i.instagram.com/api/v1/feed/user/" + t.ds_user_id + "/story/";
              return i.vt(["x-ig-www-claim", "x-ig-app-id"]).then((function(r) {
                return c.xt(n, {
                  method: "GET",
                  headers: {
                    ...r,
                    "x-csrftoken": t.csrftoken
                  },
                  credentials: "include"
                }).then((function(t) {
                  return e(t && t.reel && t.reel.items && t.reel.items.length || 0)
                }))
              }))
            }))
          }
        }
      }()
    }, (e, t, n) => {
      const r = n(4);
      e.exports = function() {
        return {
          Tt: {
            userFeed: {
              title: "PolarisProfilePostsQuery_instagramRelayOperation",
              doc_id: {
                baseUserFeedInfo: {
                  defaultValue: "9066276850131169",
                  regexPattern: 'PolarisProfilePostsQuery_instagramRelayOperation".*?e\\.exports\\s*=\\s*"(\\d+)"'
                },
                scrollUserFeedInfo: {
                  defaultValue: "9310670392322965",
                  regexPattern: 'PolarisProfilePostsTabContentQuery_connection_instagramRelayOperation",\\[\\],\\(function\\(a,b,c,d,e,f\\){e\\.exports="(\\d+)"'
                }
              }
            }
          },
          Nt() {
            let e;
            return this.At([r.Je])
          },
          At(e) {
            let t = this;
            return new Promise((async function(n, r) {
              if (!e || !e.length) return r({
                error: "no_doc_tasks"
              });
              let o = Array.from(document.querySelectorAll('script[src*="static.cdninstagram.com/rsrc.php"]')).map((function(e) {
                  return e.src
                })),
                i = Array.from(performance.getEntries()).filter((function(e) {
                  return e.name.includes(".js") && e.name.includes("static.cdninstagram.com/rsrc.php")
                })).map((function(e) {
                  return e.name
                })),
                s = o;
              if (i.forEach((function(e) {
                  s.includes(e) || s.push(e)
                })), !s.length) return r({
                error: "no_doc_id_scripts"
              });
              let u = [];
              for (let n = 0; n < s.length; ++n) {
                let r = await fetch(s[n], {}).catch((function() {}));
                if (!r) continue;
                let o = await r.text().catch((function() {}));
                if (o) {
                  for (let n of e) {
                    if (u.includes(n)) continue;
                    let e = o.indexOf(t.Tt[n].title);
                    if (e > 0) {
                      o = o.substring(e);
                      for (let e in t.Tt[n].doc_id) {
                        if (t.Tt[n].doc_id[e].regexPattern) {
                          let r = o.match(t.Tt[n].doc_id[e].regexPattern),
                            i = r && r[1] || null;
                          if (i) {
                            u.push(e), await t.Ht(e, i);
                            continue
                          }
                        }
                        let r;
                        if ((t.Tt[n].doc_id[e].token && o.indexOf(t.Tt[n].doc_id[e].token) || -1) < 0) continue;
                        const i = void 0,
                          s = /params:\s*{\s*id:\s*"(\d+)"\s*,/.exec(o);
                        let a = null;
                        s && (a = s[1]), a && (u.push(e), await t.Ht(e, a))
                      }
                    }
                  }
                  if (u.length >= e.length) break
                }
              }
              return u.length < e.length ? r({
                error: "not_found_requested_keys",
                found: u,
                requested: e
              }) : n()
            }))
          },
          Ht: (e, t) => chrome.storage.local.get(r.Oe).then((function(n) {
            let r = n.doc_id || {};
            return r[e] = {
              value: t,
              updated_value_tm: Date.now()
            }, chrome.storage.local.set({
              doc_id: r
            })
          })),
          Ut(e) {
            let t = this;
            return new Promise((function(n) {
              return t.Mt(e).then((function(e) {
                return n(e)
              })).catch((function(n) {
                return t.At([r.Je]).then((function() {
                  return t.Mt(e)
                }))
              })).catch((function(o) {
                let i = t.Tt[r.Je].doc_id[e] || null;
                n(i.defaultValue || null)
              }))
            }))
          },
          Mt: e => new Promise((function(t, n) {
            return chrome.storage.local.get(r.Oe).then((function(r) {
              let o = r.doc_id && r.doc_id[e] || null;
              return o = o && o.value, o && t(o) || n()
            }))
          }))
        }
      }()
    }, e => {
      e.exports = function() {
        return {
          Ot: () => new Promise((function(e, t) {
            chrome.runtime.sendMessage("getCsrftoken", (function(n) {
              n ? e(n) : t()
            }))
          })),
          Dt: () => new Promise((function(e, t) {
            chrome.runtime.sendMessage("getCookies", (function(n) {
              n ? e(n) : t()
            }))
          }))
        }
      }()
    }, (e, t, n) => {
      const r = n(6),
        o = n(7),
        i = n(4),
        s = n(3),
        u = n(10);
      e.exports = function() {
        return {
          Ct: (e, t) => (t = t || {}, fetch(e, t).then((function(t) {
            if (200 !== t.status && 202 !== t.status) throw `request error [${e}]`;
            return t
          }))),
          xt(e, t) {
            return this.Ct(e, t).then((function(e) {
              return e.json()
            }))
          },
          qt: function(e, t) {
            return this.Ct(e, t).then((function(e) {
              return e.text()
            }))
          },
          kt(e) {
            const t = this,
              n = [i.Fe, i.Le, i.je, i.Ve];
            let s;
            return o.nt().then((function(e) {
              return s = e, r.vt(n)
            })).then((function(n) {
              return t.xt(e, {
                headers: {
                  ...n,
                  "x-csrftoken": s
                }
              })
            }))
          },
          Rt(e, t) {
            const n = this,
              a = [i.Le, i.je];
            let c;
            return s.W(), o.nt().then((async function(e) {
              return e || (e = await u.Ot()), c = e, r.vt(a)
            })).then((function(r) {
              return n.xt(e, {
                headers: {
                  ...r,
                  "x-csrftoken": c,
                  "x-fb-friendly-name": (t && t.fb_api_req_friendly_name) || "PolarisProfilePostsQuery",
                  accept: "*/*",
                  "content-type": "application/x-www-form-urlencoded"
                },
                credentials: "include",
                method: "POST",
                body: new URLSearchParams(t).toString()
              })
            }))
          }
        }
      }()
    }, (e, t, n) => {
      const r = n(4),
        o = n(7),
        i = n(6),
        s = n(10),
        u = n(11),
        a = n(8);
      e.exports = function() {
        return {
          Ft(e, t, n) {
            const a = [r.Fe, r.Qe, r.Le, r.Ve];
            let c;
            return n = n || {}, o.nt().then((async function(e) {
              return e || (e = await s.Ot()), c = e, i.vt(a)
            })).then((function(o) {
              return o[r.je] = o[r.Qe], delete o[r.Qe], u.Ct(e, {
                method: "POST",
                body: t,
                headers: {
                  ...o,
                  ...n,
                  "x-csrftoken": c
                }
              })
            }))
          },
          ft: function(e, t) {
            let n;
            const r = `https://www.instagram.com/rupload_igphoto/${"reels"===e.destination?"fb_uploader":e.destination}_${e.upload_id}`,
              o = new Uint8Array(e.data).buffer,
              i = {
                "x-entity-length": e.data.length,
                "x-entity-name": `${e.destination}_${e.upload_id}`,
                "x-entity-type": "image/jpeg",
                offset: "0",
                "x-instagram-rupload-params": JSON.stringify({
                  media_type: "reels" === e.destination ? "2" : "1",
                  upload_id: e.upload_id,
                  upload_media_height: e.media_height,
                  upload_media_width: e.media_width
                })
              };
            this.Ft(r, o, i).then((function() {
              t(!0)
            })).catch((function(e) {
              t()
            }))
          },
          dt: function(e, t) {
            let n;
            const r = `https://www.instagram.com/rupload_igvideo/${"reels"===e.destination?"fb_uploader":e.destination}_${e.upload_id}`,
              o = new Uint8Array(e.data).buffer,
              i = {
                media_type: "2",
                upload_id: e.upload_id,
                upload_media_height: e.media_height,
                upload_media_width: e.media_width,
                video_format: "",
                video_transform: null,
                upload_media_duration_ms: e.duration,
                "client-passthrough": "1",
                is_sidecar: "0",
                for_album: "story" === e.destination,
                is_clips_video: "reels" === e.destination
              };
            "feed" === e.destination && (i.is_unified_video = "0");
            const s = {
              "x-entity-length": e.data.length,
              "x-entity-name": `${e.destination}_${e.upload_id}`,
              offset: "0",
              "x-instagram-rupload-params": JSON.stringify(i)
            };
            this.Ft(r, o, s).then((function() {
              t(!0)
            })).catch((function() {
              t()
            }))
          },
          ht: function(e, t) {
            let n = "story" === e.destination,
              r, o = {
                upload_id: e.upload_id,
                caption: e.caption
              };
            "reels" === e.destination ? (r = "api/v1/media/configure_to_clips/", o.clips_share_preview_to_feed = !0 === e.shareReelsToFeed ? "1" : "0") : r = "create/" + (n ? "configure_to_story/" : "configure/");
            const i = this,
              s = "https://www.instagram.com/" + r,
              u = new URLSearchParams(o);
            return n && void 0 === e.previous_count ? a.$t((function(t) {
              return e.previous_count = t, c()
            })) : c();

            function c() {
              return i.Ft(s, u).then((function(r) {
                return e.responseCode = r && r.status || null, n ? i.Et(e, t) : i.Lt(e, t)
              })).catch((function() {
                t()
              }))
            }
          },
          Et: function(e, t) {
            const n = this;
            return e.attempt = e.attempt || 0, a.$t((function(r) {
              if (!(r > e.previous_count)) {
                if (e.attempt > 3) throw "FAIL";
                return e.attempt++, n.ht(e, t).then((function() {
                  return new Promise((function(r) {
                    setTimeout((function() {
                      r(n.Et(e, t))
                    }), 300)
                  }))
                }))
              }
              t(!0)
            }))
          },
          Lt: function(e, t) {
            const n = this;
            if (e.attempt = e.attempt || 0, 200 !== e.responseCode) {
              if (e.attempt > 4 && 202 === e.responseCode) throw "Error";
              return e.attempt++, n.ht(e, t).then((function() {
                return new Promise((function(r) {
                  setTimeout((function() {
                    r(n.Lt(e, t))
                  }), 300)
                }))
              }))
            }
            t(!0)
          }
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
  const r = n(1),
    o = n(5),
    i = n(6);

  function s() {
    o.We(), r.l(), i.l()
  }
  s()
})();