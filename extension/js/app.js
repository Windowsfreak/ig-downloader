(() => {
  var t = [, (module, exports, require) => {
      const tabManager = require(2),
        instaUtils = require(3);
      module.exports = function () {
        return {
          captureGraphQLQueryHash: function (t) {
            const n = this;
            let e = t.url,
              o = instaUtils.extractVariablesFromUrl(e),
              s = instaUtils.extractQueryHashFromUrl(e);
            if (o && s) {
              o = decodeURIComponent(o);
              try {
                o = JSON.parse(o);
              } catch (t) {}
              o.shortcode && o.child_comment_count ? n.u("post", s) : o.id && o.first && o.after && tabManager.getTabUrl(t.tabId, function (t) {
                /\/channel\/|\/tagged\/|\/guides\//.test(t) ? t.includes("/channel/") && n.u("channel", s) : n.u("owner", s);
              });
            }
          },
          initStorage: function () {
            const t = this;
            chrome.storage.local.get("query_hashes", function (t) {
              t.query_hashes || chrome.storage.local.set({
                query_hashes: {
                  owner: "8c2a529969ee035a5063f2fc8602a0fd",
                  post: "2efa04f61586458cef44441f474eee7c",
                  channel: "bc78b344a68ed16dd5d7f264681c4c76"
                }
              });
            }), chrome.webRequest.onBeforeSendHeaders.addListener(t.t.bind(t), {
              urls: ["*://*.instagram.com/graphql/query/?*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"]);
          },
          updateQueryHash: function (t, n) {
            chrome.storage.local.get("query_hashes", function (e) {
              e.query_hashes[t] = n, chrome.storage.local.set({
                query_hashes: e.query_hashes
              });
            });
          },
          getQueryHashes: function () {
            return chrome.storage.local.get("query_hashes").then(function (t) {
              if (t.query_hashes) return t.query_hashes;
              throw "No query_hashes";
            });
          }
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          INSTAGRAM_URL_PATTERN: "*://*.instagram.com/*",
          getTabUrl: function (t, n) {
            t < 0 || chrome.tabs.get(t, function (t) {
              n(t.url);
            });
          },
          isBulkDownloadActiveInAnyTab: function (t) {
            const n = this;
            chrome.tabs.query({
              url: [n.m]
            }, function (e) {
              let r = [];
              e.forEach(function (e) {
                r.push(e.id), n.v(r, t);
              });
            });
          },
          checkTabsForBulkDownload: function (t, n) {
            const e = this;
            if (0 === t.length) return n(!1);
            let r = t.pop();
            chrome.tabs.sendMessage(r, "isBulkDownloadNowInTab", function (r) {
              r && n(!0), e.v(t, n);
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4);
      module.exports = function () {
        return {
          k: [],
          extractVariablesFromUrl: function (t) {
            let n = t.match(/variables=([^&]+)/);
            return n && n[1] || null;
          },
          extractQueryHashFromUrl: function (t) {
            let n = t.match(/query_hash=([^&]+)/);
            return n && n[1] || null;
          },
          polyfillNodeList: function () {
            void 0 === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), void 0 === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach);
          },
          getTimestampDaysAgo: function (t) {
            let n = new Date(),
              e = new Date(n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate()).getTime();
            return Math.floor((e - 864e5 * t) / 1e3);
          },
          flattenArray: function (t) {
            let n = [];
            return t.forEach(function (t) {
              n = n.concat(t);
            }), n;
          },
          generateRandomId() {
            const t = 6,
              n = 10,
              e = Math.floor(5 * Math.random()) + 6;
            let r = "";
            for (let t = 0; t < e; t++) {
              const t = void 0;
              r += Math.floor(10 * Math.random()).toString();
            }
            return r;
          },
          fetchBlob: function (t, n) {
            let e = new XMLHttpRequest();
            e.open("GET", t, !0), e.responseType = "blob", e.onreadystatechange = function () {
              4 === this.readyState && (200 === this.status ? n(this.response) : n());
            }, e.send();
          },
          extractShortcodeFromPath: function () {
            let t = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
            return t && t[0];
          },
          extractShortcodeFromElement: function (t) {
            if (!t || !t.tagName) return null;
            let n;
            if ("a" === t.tagName.toLowerCase()) n = t.getAttribute("href");else {
              let e = t.querySelector('a[href*="/p/"], a[href*="/tv/"], a[href*="/reel/"]');
              e && e.hasAttribute("href") && (n = e.getAttribute("href"));
            }
            if (n) {
              let t = n.match(/\/(tv|p|reel)\/([^/]+)/);
              return t && t[2];
            }
            return Insta_Utils.isSingleReelPage() || Insta_Utils.isPostOrReelDetailPage() ? Insta_Utils.extractShortcodeFromPath() : void 0;
          },
          isHomePage: function () {
            return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]');
          },
          isReelsAudioPage() {
            let t = location.pathname.match("^/reels/audio/[0-9]+/?$");
            return t && t[0];
          },
          isSingleReelPage() {
            let t = location.pathname.match("^/reel/[^/]+/?$");
            return t && t[0];
          },
          isSavedPostsPage: function () {
            return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname);
          },
          isProfilePage: function () {
            return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]') || null !== document.querySelector('a[href*="/reels/"]'));
          },
          isReelsTab: function () {
            return this.isProfilePage() && /\/reels\/?(\?.*)?$/.test(location.pathname + location.search);
          },
          parseCountText: function (txt) {
            if (!txt || typeof txt !== "string") return null;
            let m = txt.match(/([\d.,]+[kmKM]?)\s*(?:posts?|beitr[aä]ge?|publications?|publicaciones)/i);
            if (!m) {
              let numMatch = txt.trim().match(/^([\d.,]+[kmKM]?)$/);
              if (numMatch) m = numMatch;
            }
            if (!m) return null;
            let raw = m[1].trim();
            let kMatch = raw.match(/([\d.,]+)\s*k/i);
            if (kMatch) {
              return Math.round(parseFloat(kMatch[1].replace(/,/g, ".")) * 1000);
            }
            let mMatch = raw.match(/([\d.,]+)\s*m/i);
            if (mMatch) {
              return Math.round(parseFloat(mMatch[1].replace(/,/g, ".")) * 1000000);
            }
            let cleaned = raw.replace(/[^\d]/g, "");
            if (cleaned) {
              let parsed = parseInt(cleaned, 10);
              if (!isNaN(parsed) && parsed >= 0) return parsed;
            }
            return null;
          },
          getPostCountFromDOM: function () {
            try {
              let meta = document.querySelector('meta[name="description"], meta[property="og:description"]');
              if (meta && meta.content) {
                let count = this.parseCountText(meta.content);
                if (count !== null && count > 0) return count;
              }
              let followersLink = document.querySelector('a[href*="/followers/"]');
              if (followersLink) {
                let list = followersLink.closest("ul");
                if (list) {
                  let lis = list.querySelectorAll("li");
                  if (lis && lis.length > 0) {
                    let count = this.parseCountText(lis[0].innerText);
                    if (count !== null && count > 0) return count;
                  }
                }
                let statContainer = followersLink.parentElement ? followersLink.parentElement.parentElement || followersLink.parentElement : null;
                if (statContainer && statContainer.children && statContainer.children.length > 0) {
                  let count = this.parseCountText(statContainer.children[0].innerText);
                  if (count !== null && count > 0) return count;
                }
              }
              let candidateEls = document.querySelectorAll("header span, header div, header li, main header span, main header div, main header li, section span, section div, section li");
              for (let i = 0; i < candidateEls.length; i++) {
                let el = candidateEls[i];
                let txt = el.innerText;
                if (txt && /(?:posts?|beitr[aä]ge?|publications?|publicaciones)/i.test(txt)) {
                  let count = this.parseCountText(txt);
                  if (count !== null && count > 0) return count;
                }
              }
              let lis = document.querySelectorAll("header ul li, main header ul li, section ul li");
              if (lis && lis.length >= 1) {
                let count = this.parseCountText(lis[0].innerText);
                if (count !== null && count > 0) return count;
              }
            } catch (e) {}
            return null;
          },
          isUserReelsPath: function () {
            let t = location.pathname.match("^/reels/.*/$");
            return t && t[0];
          },
          isTaggedPage: function () {
            return this.isProfilePage() && location.href.includes("/tagged/");
          },
          isGuidesPage: function () {
            return this.isProfilePage() && location.href.includes("/guides/");
          },
          isOwnProfilePage: function () {
            return null !== document.querySelector('a[href^="/accounts/edit"]');
          },
          isSavedCollectionPage: function () {
            return this.isOwnProfilePage() && location.href.includes("/saved/");
          },
          isStoriesPage: function () {
            return /instagram\.com\/stories\/[^/]+\//.test(location.href);
          },
          isExplorePage: function () {
            return "/explore/" === location.pathname;
          },
          isLocationPage: function () {
            return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href);
          },
          isTagExplorePage: function () {
            return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href);
          },
          isPostOrReelDetailPage: function () {
            return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href);
          },
          isIframe: function () {
            return top !== self;
          },
          isHighlightsPage: function () {
            return location.pathname.includes("stories/highlights");
          },
          extractFilenameFromUrl: function (t, n) {
            if (!t) return null;
            let e = t.match(/\/([^\/?]+)(?:$|\?)/);
            return e = e && e[1], e ? (n && (e = n + "_" + e), e) : null;
          },
          isMediaUrl: function (t) {
            return !("string" != typeof t || -1 != t.indexOf("blob:") || !t.match(/\.(png|jpg|mp4|flv)/));
          },
          getQueryHashes: function (t) {
            Insta_Utils.sendMessage("getQueryHashes", t);
          },
          downloadWithChrome: function (t, n, e) {
            if (!t || !t.url) return e();
            var r = {
              url: t.url
            };
            t.filename && (r.filename = t.filename), chrome.downloads.download(r, function (n) {
              n ? e(n) : chrome.downloads.download({
                url: t.url
              }, function (t) {
                e(t);
              });
            });
          },
          downloadFileViaBackground: function (t, n) {
            this.sendMessage({
              action: "downloadFile",
              options: {
                url: t.url,
                filename: t.filename,
                isStory: void 0 !== t.isStory
              }
            }, function (t) {
              "function" == typeof n && n(t);
            });
          },
          sortByProperty: function (t, n, e) {
            function r(t, r) {
              var i = parseInt(t[n]),
                o = parseInt(r[n]);
              return e ? i < o ? 1 : i > o ? -1 : 0 : i > o ? 1 : i < o ? -1 : 0;
            }
            t.sort(r);
          },
          shuffleArray: function (t) {
            var n, e, r;
            for (r = t.length - 1; r > 0; r--) n = Math.floor(Math.random() * (r + 1)), e = t[r], t[r] = t[n], t[n] = e;
            return t;
          },
          extractUsernameFromUrl: function () {
            if (location.href.indexOf("instagram.com/p/") > -1) return null;
            var t = location.href.match(/instagram\.com\/([^\/]+)/);
            return t && t[1].trim() || null;
          },
          sendMessage: function (t, n) {
            void 0 === n ? chrome.runtime.sendMessage(t) : chrome.runtime.sendMessage(t, n);
          },
          countListItems: function (t) {
            var n = 0;
            return t.querySelectorAll("ul li").forEach(function (t) {
              t.querySelector("video") ? n++ : t.querySelectorAll("img").forEach(function (t) {
                t.width > 200 && t.height > 200 && n++;
              });
            }), n > 1;
          },
          extractCarouselIndex: function (t) {
            if (!t) return 0;
            var n = 0,
              e = t.querySelector('button[aria-current="step"], button[aria-current="true"], [role="button"][aria-current="step"], [role="button"][aria-current="true"]');
            if (e) {
              var r,
                i = (e.getAttribute("aria-label") || "").match(/(\d+)(?!.*\d)/);
              if (i && (n = parseInt(i[1], 10) - 1, !isNaN(n) && n >= 0)) return n;
              var o = e.parentElement;
              if (o) {
                for (var s = [], a = 0; a < o.children.length; a++) {
                  var u = o.children[a];
                  u.tagName && e.tagName && u.tagName.toLowerCase() === e.tagName.toLowerCase() && s.push(u);
                }
                var c = s.indexOf(e);
                if (c >= 0) return n = c;
              }
            }
            for (var f = t.querySelectorAll("div div div div"), l = 0, h = []; f[l];) {
              var d = f[l];
              if (l++, d.offsetHeight < 10 && d.offsetHeight === d.offsetWidth && d.parentElement.offsetWidth > 20 * d.parentElement.offsetHeight) {
                var _ = d.parentElement.children,
                  m = !0;
                if (_.forEach(function (t) {
                  t.offsetHeight < 10 && t.offsetHeight === t.offsetWidth || (m = !1);
                }), _.length > 1 && m) {
                  h = _;
                  break;
                }
              }
            }
            var p = 0;
            return h.forEach(function (t, e) {
              t.classList.length > p && (p = t.classList.length, n = e);
            }), n;
          },
          formatSecondsToTime: function (t) {
            var n = Math.floor(parseInt(t) / 60).toString(),
              e = Math.floor(parseInt(t) % 60).toString();
            return 1 === n.length && (n = "0" + n), 1 === e.length && (e = "0" + e), n + ":" + e;
          },
          getUsernameFromDOMHeader: function () {
            let t = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
            if (t) {
              let n = t.closest("section");
              return n && (n.style.overflow = "visible"), n && n.querySelector("div>div") || n || null;
            }
          },
          findVideoElement: function (t) {
            return t.querySelector("video");
          },
          getVideoSrc: function (t) {
            var n = t.getAttribute("src");
            if (n) return n;
            var e = t.querySelector("source");
            return e && (n = e.getAttribute("src")) ? n : null;
          },
          hasReelsIconSvg: function (t) {
            const n = "m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z";
            if (t.querySelector(`svg path[d="${n}"]`)) return !0;
            {
              let n = t.querySelector("video,img"),
                e = getComputedStyle(n);
              return this.isAspectRatioReel(parseInt(e.width) / parseInt(e.height));
            }
          },
          isAspectRatioReel: t => t >= .5 && t <= .6 || t === 9 / 16,
          getSrcsetFromImage: function (t) {
            if (!t) return null;
            var n = t.getAttribute("srcset");
            if (n) {
              var e = {},
                r;
              n.split(",").forEach(function (t) {
                var n = t.split(" "),
                  r = n[1].replace(/[^\d]/, "");
                e[r] || (e[r] = n[0]);
              });
              var i = 0;
              for (var o in e) +o > +i && (i = o);
              var s = e[i];
            }
            return "string" == typeof s && s.match(new RegExp("\\.(jpg|png)")) || (s = t.getAttribute("src")), s;
          },
          findLargestImageFromContainer: function (t) {
            let n = null,
              e = t.querySelectorAll("img[src], img[srcset]");
            if (1 === e.length) n = e[0];else if (e.length > 1) for (let t = 0; e[t]; t++) e[t].width < 200 || e[t].height < 200 || (e[t].getAttribute("src") || e[t].getAttribute("srcset")) && (n = n || e[t], e[t].width > n.width && e[t].height > n.height && (n = e[t]));
            return n || null;
          },
          requestUserId: function (t, n) {
            chrome.runtime.sendMessage({
              action: "requestUserId",
              userName: t
            }, function (t) {
              if (!t || t.err || t.error || !t.userId) return n(null);
              n(t.userId);
            });
          },
          requestUserPostCount: function (t, n) {
            let domCount = this.getPostCountFromDOM();
            if (domCount !== null && domCount > 0) {
              return n(domCount);
            }
            let self = this;
            chrome.runtime.sendMessage({
              action: "requestUserPostCount",
              userName: t
            }, function (res) {
              if (!res || res.err || res.error || res.postCount == null) {
                let retry = self.getPostCountFromDOM ? self.getPostCountFromDOM() : null;
                return n(retry != null ? retry : null);
              }
              n(res.postCount);
            });
          },
          compareMediaDimensions: function (t, n) {
            let e = t.width || t.config_width || null,
              r = n.width || n.config_width || null,
              i = t.height || t.config_height || null,
              o = n.height || n.config_height || null;
            return e && r && e !== i && r !== o ? e !== r ? r > e ? 1 : -1 : o > i ? 1 : -1 : 0;
          },
          filterMediaByAdvancedParams: function (t, n) {
            n && !Array.isArray(n) && (n = [n]);
            for (var e = [], r = {
                "{": 0,
                "[": 0
              }, i = {
                "}": "{",
                "]": "["
              }, o = /[{}\]\[":0-9.,-]/, s = /[\r\n\s\t]/, a = "", u = 0, c; c = t[u]; u++) if ('"' !== c) o.test(c) ? (a += c, "{" === c || "[" === c ? (r["{"] || r["["] || (a = c), r[c]++) : "}" !== c && "]" !== c || (r[i[c]]--, r["{"] || r["["] || e.push(a))) : "t" === c && "true" === t.substr(u, 4) ? (a += "true", u += 3) : "f" === c && "false" === t.substr(u, 5) ? (a += "false", u += 4) : "n" === c && "null" === t.substr(u, 4) ? (a += "null", u += 3) : s.test(c) || (r["{"] = 0, r["["] = 0, a = "");else {
              for (var f = u; -1 !== f && (f === u || "\\" === t[f - 1]);) f = t.indexOf('"', f + 1);
              -1 === f && (f = t.length - 1), a += t.substr(u, f - u + 1), u = f;
            }
            for (var l = [], u = 0, h; h = e[u]; u++) if ("{}" !== h && "[]" !== h) try {
              n ? n.every(function (t) {
                return t.test(h);
              }) && l.push(JSON.parse(h)) : l.push(JSON.parse(h));
            } catch (t) {}
            return l;
          },
          getActiveSection: function () {
            return Array.from(document.querySelectorAll("section")).find(t => !t.closest("[hidden]"));
          },
          findStoriesContainer: function () {
            const t = this.getActiveSection();
            return Array.from(t.querySelectorAll("div")).find(t => {
              let n = t.clientHeight || t.offsetHeight;
              if (n > 0 && n < 6) return t.parentElement;
            });
          },
          getStoriesCurrentIndex: function () {
            const t = this.findStoriesContainer();
            if (!t) return 0;
            let n = t.querySelectorAll("div[style]"),
              e;
            return n && n.length ? (n = n[n.length - 1].parentElement || null, null == n ? 0 : t.children && Array.from(t.children).indexOf(n) || 0) : 0;
          },
          shortcodeToPk(t) {
            t.length > 28 && (t = t.substr(0, t.length - 28));
            const n = "abcdefghijklmnopqrstuvwxyz",
              e = n.toUpperCase() + n + "0123456789-_";
            let r = BigInt(0);
            for (let n of t) {
              let t = e.indexOf(n);
              r *= BigInt(64), r += BigInt(t);
            }
            return r.toString();
          },
          saveToStorageSyncAndLocal(t) {
            try {
              return chrome.storage.local.set(t).finally(() => chrome.storage.sync.set(t)).catch(() => {});
            } catch (t) {
              return Promise.resolve();
            }
          },
          setPolicyAccepted(t) {
            return this.saveToStorageSyncAndLocal({
              ["promotional_allowed"]: t,
              ["policy_accepted"]: !0
            });
          },
          checkPolicyAccepted: () => Promise.all([chrome.storage.sync.get("policy_accepted"), chrome.storage.local.get("policy_accepted")]).then(([t, n]) => !(!t.policy_accepted && !n.policy_accepted)).catch(t => {})
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          QUERY_SCROLL_USER_FEED: "scrollUserFeedInfo",
          QUERY_BASE_USER_FEED: "baseUserFeedInfo",
          PARAM_S_KEY: "s_key",
          EXT_MP4: "mp4",
          ACTION_WALK: "walk",
          GRAPHQL_QUERIES: 2,
          EXT_JPG: "jpg",
          ACTION_HIST: "hist",
          ACTION_TIM: "tim",
          HEADER_CSRFTOKEN: "x-csrftoken",
          KEY_DOC_ID: "doc_id",
          HEADER_INSTAGRAM_AJAX: "x-instagram-ajax",
          POLICY_URL: "https://sites.google.com/view/downloader-promaster",
          HEADER_ASBD_ID: "x-asbd-id",
          KEY_DATA_SKIP: "data_skip",
          HEADER_IG_APP_ID: "x-ig-app-id",
          HEADER_REQUESTED_WITH: "x-requested-with",
          KEY_USER_FEED: "userFeed",
          KEY_PROMOTIONAL_ALLOWED: "promotional_allowed",
          HEADER_IG_APP_ID_UPLOAD: "x-ig-app-id_upload",
          KEY_USER_ID: "user_id",
          HEADER_IG_WWW_CLAIM: "x-ig-www-claim",
          KEY_POLICY_ACCEPTED: "policy_accepted",
          KEY_DATA_AD: "data_ad",
          Yt: 1,
          KEY_FB_DTSG: "fb_dtsg"
        };
      }();
    },, (module, exports, require) => {
      const constants = require(4);
      module.exports = function () {
        return {
          DEFAULT_HEADERS: {
            "x-instagram-ajax": "017fef72480c",
            "x-asbd-id": "437806",
            "x-requested-with": "XMLHttpRequest",
            "x-ig-app-id": "936619743392459",
            "x-ig-app-id_upload": "1217981644879628"
          },
          saveHeaders: function (t) {
            this.getHeaders().then(function (n) {
              chrome.storage.local.set({
                headers: {
                  ...n,
                  ...t
                }
              });
            }).catch(function () {
              chrome.storage.local.set({
                headers: t
              });
            });
          },
          getHeaders: function () {
            return chrome.storage.local.get("headers").then(function (t) {
              if (t.headers) return t.headers;
              throw "No headers";
            });
          },
          getSpecificHeaders: function (t) {
            return this.getHeaders().then(function (n) {
              let e = [];
              for (let r = 0; t[r]; r++) {
                if (!n.hasOwnProperty(t[r])) throw `Not found requested header [${t[r]}]`;
                e[t[r]] = n[t[r]];
              }
              return e;
            });
          },
          initWebRequestListeners(t) {
            let n = t.requestBody || null;
            if (!n) return;
            let e = n.formData && n.formData.fb_dtsg || null;
            e = e && e.length && e[0] || null, e && chrome.storage.local.set({
              fb_dtsg: e
            });
          },
          captureFbDtsgFromBody: function (t) {
            const n = ["x-ig-www-claim", "x-instagram-ajax", "x-asbd-id", "x-requested-with", "x-ig-app-id"],
              e = {};
            for (let r = 0; t.requestHeaders[r]; r++) {
              let i = t.requestHeaders[r];
              n.includes(i.name.toLowerCase()) && i.value.length && (e[i.name.toLowerCase()] = i.value), this.saveHeaders(e);
            }
          },
          captureHeadersFromRequest: function (t) {
            const n = "x-ig-app-id",
              e = {};
            for (let r = 0; t.requestHeaders[r]; r++) {
              let i = t.requestHeaders[r];
              if (n === i.name.toLowerCase() && i.value.length) {
                e[n] = i.value;
                break;
              }
              this.saveHeaders(e);
            }
          },
          initHeaderCaptureListeners: function () {
            const t = this;
            t.rn().catch(function () {
              t.en(t.DEFAULT_HEADERS);
            }), chrome.webRequest.onBeforeSendHeaders.addListener(t.un.bind(t), {
              urls: ["*://*.instagram.com/*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"]), chrome.webRequest.onBeforeRequest.addListener(t.initWebRequestListeners.bind(t), {
              urls: ["*://*.instagram.com/*"],
              types: ["xmlhttprequest"]
            }, ["requestBody"]), chrome.webRequest.onBeforeSendHeaders.addListener(t.cn.bind(t), {
              urls: ["*://*.instagram.com/rupload_igphoto/*", "*://*.instagram.com/rupload_igvideo/*", "*://*.instagram.com/api/v1/web/create/*"],
              types: ["xmlhttprequest"]
            }, ["requestHeaders"]);
          }
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          getAllCookies: function () {
            return chrome.cookies ? chrome.cookies.getAll({
              url: "https://www.instagram.com"
            }).then(function (t) {
              let n = {};
              if (t.forEach(function (t) {
                n[t.name] = t.value;
              }), n.ds_user_id && n.sessionid) return n;
              throw "Not authorized";
            }) : Promise.resolve();
          },
          getCsrfToken: function () {
            return this.getAllCookies().then(function (t) {
              return t && t.csrftoken || null;
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4),
        cookieManager = require(7),
        headerManager = require(6),
        queryHashManager = require(1),
        graphqlDefinitions = require(9),
        messageClient = require(10),
        httpClient = require(11);
      module.exports = function () {
        return {
          requestHtmlByShortcode: function (t, n) {
            if (!t) return n(null);
            const e = `https://www.instagram.com/p/${t}/`,
              s = ["x-instagram-ajax", "x-asbd-id", "x-ig-app-id", "x-requested-with"];
            let a;
            return cookieManager.getCsrfToken().then(function (t) {
              return a = t, headerManager.getSpecificHeaders(s);
            }).then(function (t) {
              return httpClient.fetchText(e, {
                headers: {
                  ...t,
                  "x-csrftoken": a,
                  accept: "text/html"
                }
              });
            }).then(function (t) {
              n(t);
            });
          },
          requestUserIdByUsername: function (t, n) {
            headerManager.getHeaders().then(e => {
              let r = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + t,
                i = {
                  method: "GET",
                  headers: e
                };
              i.headers["content-type"] = "application/x-www-form-urlencoded", httpClient.fetchJson(r, i).then(function (t) {
                let e = t && t.data && t.data.user && t.data.user.id || null;
                if (!e) throw `Not found userId [${JSON.stringify(t)}]`;
                n({
                  userId: e
                });
              }).catch(function () {
                n({
                  error: 1
                });
              });
            });
          },
          requestUserPostCount: function (t, n) {
            headerManager.getHeaders().then(e => {
              let r = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + t,
                i = {
                  method: "GET",
                  headers: e
                };
              i.headers["content-type"] = "application/x-www-form-urlencoded", httpClient.fetchJson(r, i).then(function (t) {
                let e = t && t.data && t.data.user && t.data.user.edge_owner_to_timeline_media && t.data.user.edge_owner_to_timeline_media.count || null;
                if (!e) throw `Not found postCount [${JSON.stringify(t)}]`;
                n({
                  postCount: e
                });
              }).catch(function () {
                n({
                  error: 1
                });
              });
            });
          },
          getUserStoriesCount: function (t, n) {
            const e = "https://i.instagram.com/api/v1/feed/user/" + t + "/story/";
            httpClient.postForm(e).then(function (t) {
              n(t);
            }).catch(function () {
              n({
                error: 1
              });
            });
          },
          requestStories: function (t, n) {
            const e = `https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(t)}`;
            httpClient.postForm(e).then(function (t) {
              n(t);
            }).catch(function () {
              n({
                error: 1
              });
            });
          },
          baseGraphqlQueryRequest: function (t, n) {
            queryHashManager.getQueryHashes().then(function (n) {
              const e = void 0,
                r = "https://www.instagram.com/graphql/query/?query_hash=" + n[t.request_type] + "&variables=" + encodeURIComponent(JSON.stringify(t.data));
              return httpClient.postForm(r);
            }).then(function (t) {
              n(t);
            }).catch(function (t) {
              n({
                error: 1
              });
            });
          },
          fetchUserFeed: function (t, n) {
            const e = this;
            let i = t.after || null,
              o = i ? "scrollUserFeedInfo" : "baseUserFeedInfo";
            graphqlDefinitions.saveDocId(o).then(function (e) {
              if (!e) return n(null);
              chrome.storage.local.get("fb_dtsg", function (r) {
                let o = r && r.fb_dtsg || null,
                  s = {
                    data: {
                      count: 12,
                      include_reel_media_seen_timestamp: !0,
                      include_relationship_info: !0,
                      latest_besties_reel_media: !0,
                      latest_reel_media: !0
                    },
                    username: t.userName,
                    __relay_internal__pv__PolarisIsLoggedInrelayprovider: !0,
                    __relay_internal__pv__PolarisShareSheetV3relayprovider: !1
                  };
                i && (s = {
                  ...s,
                  first: 12,
                  last: null,
                  after: i || "",
                  before: null
                }), s = JSON.stringify(s);
                let a = {
                  fb_dtsg: o,
                  variables: s,
                  doc_id: e,
                  fb_api_caller_class: "RelayModern",
                  fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                  server_timestamps: !0
                };
                const u = "https://www.instagram.com/graphql/query";
                httpClient.postJson(u, a).then(function (t) {
                  n(t);
                }).catch(function (t) {
                  n({
                    error: 1
                  });
                });
              });
            });
          },
          fetchUserClips: function (t, n) {
            let i = t.after || null;
            let docId = "27234427476213202";
            let s = {
              data: {
                include_feed_video: !0,
                page_size: 12,
                target_user_id: String(t.user_id)
              }
            };
            i && (s.after = i);
            let a = {
              variables: JSON.stringify(s),
              doc_id: docId
            };
            const u = "https://www.instagram.com/graphql/query";
            httpClient.postJson(u, a, null).then(function (t) {
              n(t);
            }).catch(function (t) {
              n({
                error: 1
              });
            });
          },
          baseMediaInfoRequest: function (t, n) {
            const e = `https://www.instagram.com/api/v1/media/${t.data.pk}/info/`;
            return httpClient.postForm(e).then(function (t) {
              n(t);
            }).catch(function (t) {
              n({
                error: 1
              });
            });
          },
          getUserIdByUserName: function (t, n) {
            let e = "https://www.instagram.com/" + t + "/";
            httpClient.fetchWithTimeout(e).then(function (t) {
              return t.text();
            }).then(function (t) {
              let r = t.match(/\"profile_id\":\s?\"(\d+)/) || t.match(/"props":\s*\{\s*"id":\s*"(\d+)"/) || t.match(/"user_id":\s*"(\d+)"/);
              if (r = r && r[1], !r) throw `not received userId [${e}]`;
              n(r);
            }).catch(function () {
              return n();
            });
          },
          requestHighlights: function (t) {
            return cookieManager.getAllCookies().then(async function (n) {
              if (n || (n = await messageClient.getCookies()), !n) return Promise.reject();
              const e = "https://i.instagram.com/api/v1/feed/user/" + n.ds_user_id + "/story/";
              return headerManager.getSpecificHeaders(["x-ig-www-claim", "x-ig-app-id"]).then(function (r) {
                return httpClient.fetchJson(e, {
                  method: "GET",
                  headers: {
                    ...r,
                    "x-csrftoken": n.csrftoken
                  },
                  credentials: "include"
                }).then(function (n) {
                  return t(n && n.reel && n.reel.items && n.reel.items.length || 0);
                });
              });
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4);
      module.exports = function () {
        return {
          GRAPHQL_QUERIES: {
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
          initDocIds() {
            let t;
            return this.extractDocIdsFromScripts(["userFeed"]).catch(function () {});
          },
          extractDocIdsFromScripts(t) {
            let n = this;
            return new Promise(async function (e, r) {
              if (!t || !t.length) return r({
                error: "no_doc_tasks"
              });
              let i = Array.from(document.querySelectorAll('script[src*="static.cdninstagram.com/rsrc.php"]')).map(function (t) {
                  return t.src;
                }),
                o = Array.from(performance.getEntries()).filter(function (t) {
                  return t.name.includes(".js") && t.name.includes("static.cdninstagram.com/rsrc.php");
                }).map(function (t) {
                  return t.name;
                }),
                s = i;
              if (o.forEach(function (t) {
                s.includes(t) || s.push(t);
              }), !s.length) return r({
                error: "no_doc_id_scripts"
              });
              let a = [];
              for (let e = 0; e < s.length; ++e) {
                let r = await fetch(s[e], {}).catch(function () {});
                if (!r) continue;
                let i = await r.text().catch(function () {});
                if (i) {
                  for (let e of t) {
                    if (a.includes(e)) continue;
                    let t = i.indexOf(n.GRAPHQL_QUERIES[e].title);
                    if (t > 0) {
                      i = i.substring(t);
                      for (let t in n.GRAPHQL_QUERIES[e].doc_id) {
                        if (n.GRAPHQL_QUERIES[e].doc_id[t].regexPattern) {
                          let r = i.match(n.GRAPHQL_QUERIES[e].doc_id[t].regexPattern),
                            o = r && r[1] || null;
                          if (o) {
                            a.push(t), await n.getDocId(t, o);
                            continue;
                          }
                        }
                        let r;
                        if ((n.GRAPHQL_QUERIES[e].doc_id[t].token && i.indexOf(n.GRAPHQL_QUERIES[e].doc_id[t].token) || -1) < 0) continue;
                        const o = void 0,
                          s = /params:\s*{\s*id:\s*"(\d+)"\s*,/.exec(i);
                        let u = null;
                        s && (u = s[1]), u && (a.push(t), await n.getDocId(t, u));
                      }
                    }
                  }
                  if (a.length >= t.length) break;
                }
              }
              return a.length < t.length ? r({
                error: "not_found_requested_keys",
                found: a,
                requested: t
              }) : e();
            });
          },
          getDocId: (t, n) => chrome.storage.local.get("doc_id").then(function (e) {
            let r = e.doc_id || {};
            return r[t] = {
              value: n,
              updated_value_tm: Date.now()
            }, chrome.storage.local.set({
              doc_id: r
            });
          }),
          saveDocId(t) {
            let n = this;
            return new Promise(function (e) {
              return n.getDocIdPromise(t).then(function (t) {
                return e(t);
              }).catch(function (e) {
                return n.extractDocIdsFromScripts(["userFeed"]).then(function () {
                  return n.getDocIdPromise(t);
                });
              }).catch(function (i) {
                let o = n.GRAPHQL_QUERIES["userFeed"].doc_id[t] || null;
                e(o.defaultValue || null);
              });
            });
          },
          getDocIdPromise: t => new Promise(function (n, e) {
            return chrome.storage.local.get("doc_id").then(function (r) {
              let i = r.doc_id && r.doc_id[t] || null;
              return i = i && i.value, i && n(i) || e();
            });
          })
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          getCsrfToken: () => new Promise(function (t, n) {
            chrome.runtime.sendMessage("getCsrftoken", function (e) {
              e ? t(e) : n();
            });
          }),
          getCookies: () => new Promise(function (t, n) {
            chrome.runtime.sendMessage("getCookies", function (e) {
              e ? t(e) : n();
            });
          })
        };
      }();
    }, (module, exports, require) => {
      const headerManager = require(6),
        cookieManager = require(7),
        constants = require(4),
        instaUtils = require(3),
        messageClient = require(10);
      module.exports = function () {
        return {
          fetchWithTimeout: (t, n) => (n = n || {}, fetch(t, n).then(function (n) {
            if (200 !== n.status && 202 !== n.status) throw `request error [${t}]`;
            return n;
          })),
          fetchJson(t, n) {
            return this.fetchWithTimeout(t, n).then(function (t) {
              return t.json();
            });
          },
          fetchText: function (t, n) {
            return this.fetchWithTimeout(t, n).then(function (t) {
              return t.text();
            });
          },
          postForm(t) {
            const n = this,
              e = ["x-instagram-ajax", "x-asbd-id", "x-ig-app-id", "x-requested-with"];
            let s;
            return cookieManager.getCsrfToken().then(function (t) {
              return s = t, headerManager.getSpecificHeaders(e);
            }).then(function (e) {
              return n.fetchJson(t, {
                headers: {
                  ...e,
                  "x-csrftoken": s
                }
              });
            });
          },
          postJson(t, n, friendlyName) {
            const e = this,
              u = ["x-asbd-id", "x-ig-app-id"];
            let c;
            return instaUtils.sendMessage(), cookieManager.getCsrfToken().then(async function (t) {
              return t || (t = await messageClient.getCsrfToken()), c = t, headerManager.getSpecificHeaders(u);
            }).then(function (r) {
              let headers = {
                ...r,
                "x-csrftoken": c,
                accept: "*/*",
                "content-type": "application/x-www-form-urlencoded"
              };
              if (friendlyName !== null && friendlyName !== false) {
                headers["x-fb-friendly-name"] = friendlyName || "PolarisProfilePostsQuery";
              }
              return e.fetchJson(t, {
                headers: headers,
                credentials: "include",
                method: "POST",
                body: new URLSearchParams(n).toString()
              });
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4),
        cookieManager = require(7),
        headerManager = require(6),
        messageClient = require(10),
        httpClient = require(11),
        apiClient = require(8);
      module.exports = function () {
        return {
          uploadRequest(t, n, e) {
            const u = ["x-instagram-ajax", "x-ig-app-id_upload", "x-asbd-id", "x-requested-with"];
            let c;
            return e = e || {}, cookieManager.getCsrfToken().then(async function (t) {
              return t || (t = await messageClient.getCsrfToken()), c = t, headerManager.getSpecificHeaders(u);
            }).then(function (i) {
              return i["x-ig-app-id"] = i["x-ig-app-id_upload"], delete i["x-ig-app-id_upload"], httpClient.fetchWithTimeout(t, {
                method: "POST",
                body: n,
                headers: {
                  ...i,
                  ...e,
                  "x-csrftoken": c
                }
              });
            });
          },
          uploadPhotoRequest: function (t, n) {
            let e;
            const r = `https://www.instagram.com/rupload_igphoto/${"reels" === t.destination ? "fb_uploader" : t.destination}_${t.upload_id}`,
              i = new Uint8Array(t.data).buffer,
              o = {
                "x-entity-length": t.data.length,
                "x-entity-name": `${t.destination}_${t.upload_id}`,
                "x-entity-type": "image/jpeg",
                offset: "0",
                "x-instagram-rupload-params": JSON.stringify({
                  media_type: "reels" === t.destination ? "2" : "1",
                  upload_id: t.upload_id,
                  upload_media_height: t.media_height,
                  upload_media_width: t.media_width
                })
              };
            this.uploadRequest(r, i, o).then(function () {
              n(!0);
            }).catch(function (t) {
              n();
            });
          },
          uploadVideoRequest: function (t, n) {
            let e;
            const r = `https://www.instagram.com/rupload_igvideo/${"reels" === t.destination ? "fb_uploader" : t.destination}_${t.upload_id}`,
              i = new Uint8Array(t.data).buffer,
              o = {
                media_type: "2",
                upload_id: t.upload_id,
                upload_media_height: t.media_height,
                upload_media_width: t.media_width,
                video_format: "",
                video_transform: null,
                upload_media_duration_ms: t.duration,
                "client-passthrough": "1",
                is_sidecar: "0",
                for_album: "story" === t.destination,
                is_clips_video: "reels" === t.destination
              };
            "feed" === t.destination && (o.is_unified_video = "0");
            const s = {
              "x-entity-length": t.data.length,
              "x-entity-name": `${t.destination}_${t.upload_id}`,
              offset: "0",
              "x-instagram-rupload-params": JSON.stringify(o)
            };
            this.uploadRequest(r, i, s).then(function () {
              n(!0);
            }).catch(function () {
              n();
            });
          },
          uploadPostConfigureRequest: function (t, n) {
            let e = "story" === t.destination,
              r,
              i = {
                upload_id: t.upload_id,
                caption: t.caption
              };
            "reels" === t.destination ? (r = "api/v1/media/configure_to_clips/", i.clips_share_preview_to_feed = !0 === t.shareReelsToFeed ? "1" : "0") : r = "create/" + (e ? "configure_to_story/" : "configure/");
            const o = this,
              s = "https://www.instagram.com/" + r,
              a = new URLSearchParams(i);
            return e && void 0 === t.previous_count ? apiClient.requestHighlights(function (n) {
              return t.previous_count = n, c();
            }) : c();
            function c() {
              return o.uploadRequest(s, a).then(function (r) {
                return t.responseCode = r && r.status || null, e ? o.retryUploadWithCsrf(t, n) : o.handleUploadResponse(t, n);
              }).catch(function () {
                n();
              });
            }
          },
          retryUploadWithCsrf: function (t, n) {
            const e = this;
            return t.attempt = t.attempt || 0, apiClient.requestHighlights(function (r) {
              if (!(r > t.previous_count)) {
                if (t.attempt > 3) throw "FAIL";
                return t.attempt++, e.Fn(t, n).then(function () {
                  return new Promise(function (r) {
                    setTimeout(function () {
                      r(e.retryUploadWithCsrf(t, n));
                    }, 300);
                  });
                });
              }
              n(!0);
            });
          },
          handleUploadResponse: function (t, n) {
            const e = this;
            if (t.attempt = t.attempt || 0, 200 !== t.responseCode) {
              if (t.attempt > 4 && 202 === t.responseCode) throw "Error";
              return t.attempt++, e.Fn(t, n).then(function () {
                return new Promise(function (r) {
                  setTimeout(function () {
                    r(e.handleUploadResponse(t, n));
                  }, 300);
                });
              });
            }
            n(!0);
          }
        };
      }();
    },,,,,,,,, (module, exports, require) => {
      const instaUtils = require(3),
        mediaItemFormatter = require(22),
        apiClient = require(8);
      module.exports = function () {
        return {
          fetchPostCommentsAndDetails: function (t, n) {
            chrome.runtime.sendMessage({
              action: "baseGraphqlQueryRequest",
              opts: {
                request_type: "post",
                data: {
                  child_comment_count: 3,
                  fetch_comment_count: 40,
                  has_threaded_comments: !0,
                  parent_comment_count: 24,
                  shortcode: t
                }
              }
            }, n);
          },
          fetchMediaInfoByShortcode: function (t, n) {
            let e = instaUtils.shortcodeToPk(t);
            chrome.runtime.sendMessage({
              action: "baseMediaInfoRequest",
              opts: {
                request_type: "get",
                data: {
                  pk: e
                }
              }
            }, n);
          },
          fetchOwnerPostsGraphQL: function (t, n) {
            let e = {
              request_type: "owner",
              data: {
                id: t.user_id,
                first: 12
              }
            };
            t.after && (e.data.after = t.after), chrome.runtime.sendMessage({
              action: "baseGraphqlQueryRequest",
              opts: e
            }, n);
          },
          fetchUserFeedAPI: function (t, n) {
            let e = {
              userName: t.userName,
              count: 12
            };
            t.after && (e.after = t.after), apiClient.fetchUserFeed(e, n);
          },
          fetchUserClips: function (t, n) {
            apiClient.fetchUserClips(t, n);
          },
          resolveMediaItemFromShortcode: function (t, n) {
            const e = void 0;
            this.fetchMediaInfoByShortcode(t.shortcode, function (e) {
              if (!e || e.error) return n({
                error: !0
              });
              try {
                let o = e.items && e.items[0] || null;
                if (!o) throw new Error();
                let s = o.owner && o.owner.username || null;
                if (t.is_carousel) var r = o.carousel_media && o.carousel_media[t.carousel_position || 0];else r = o;
                n(mediaItemFormatter.formatRestMediaItem(r, s));
              } catch (t) {
                return n({
                  error: !0
                });
              }
            });
          },
          getUserIdByUserName: function (t, n) {
            chrome.runtime.sendMessage({
              action: "getUserIdByUserName",
              userName: t
            }, n);
          }
        };
      }();
    }, (module, exports, require) => {
      const instaUtils = require(3),
        constants = require(4);
      module.exports = function () {
        return {
          formatGraphQLMediaItem: function (t, n, e) {
            let i,
              o,
              s,
              a,
              u = null,
              c = 0,
              f = 0;
            return t.is_video ? (u = t.product_type || null, i = t.video_url, s = "video", a = t.display_url) : (t.display_resources.forEach(function (t) {
              (t.config_width > c || t.config_height > f) && (c = t.config_width, f = t.config_height, i = t.src);
            }), s = "photo", a = i), o = instaUtils.extractFilenameFromUrl(i, n, e), {
              url: i,
              isReels: u,
              filename: o,
              type: s,
              prev: a,
              dimensions: t.dimensions
            };
          },
          formatFeedMediaItem: function (t, n, e) {
            let i = null,
              o,
              s,
              a,
              u = null;
            if (t.video_versions && t.video_versions.length) {
              u = t.product_type || null;
              let sortedV = t.video_versions.slice().sort(instaUtils.compareMediaDimensions);
              i = sortedV[0].src || sortedV[0].url;
              let sortedI = t.image_versions2 && t.image_versions2.candidates && t.image_versions2.candidates.slice().sort(instaUtils.compareMediaDimensions);
              a = sortedI && sortedI[0] ? sortedI[0].src || sortedI[0].url : i;
              s = "video";
            } else if (t.media_type === 2 || t.product_type === "clips") {
              u = "clips";
              s = "video";
              let sortedI = t.image_versions2 && t.image_versions2.candidates && t.image_versions2.candidates.slice().sort(instaUtils.compareMediaDimensions);
              a = sortedI && sortedI[0] ? sortedI[0].src || sortedI[0].url : null;
              i = null;
            } else {
              let sortedI = t.image_versions2 && t.image_versions2.candidates && t.image_versions2.candidates.slice().sort(instaUtils.compareMediaDimensions) || [];
              i = sortedI[0] && (sortedI[0].src || sortedI[0].url) || null;
              s = "photo";
              a = i;
            }
            let shortcode = t.code || t.shortcode;
            o = (n ? n + "_" : "") + (shortcode || t.pk || (i ? instaUtils.extractFilenameFromUrl(i, n, e) : "media")) + (s === "video" ? ".mp4" : ".jpg");
            return {
              url: i,
              pk: t.pk,
              shortcode: shortcode,
              isReels: u,
              filename: o,
              type: s,
              prev: a,
              dimensions: t.dimensions || {
                width: t.original_width,
                height: t.original_height
              }
            };
          },
          formatRestMediaItem: function (t, n) {
            let e,
              o,
              s,
              a,
              u = null,
              c = 0,
              f = 0;
            if (t.media_type === 2) {
              u = t.product_type || null, instaUtils.sortByProperty(t.video_versions, "width", !0);
              let n = t.video_versions;
              e = n && n[0] && n[0].url || null, s = "video";
              let i,
                o = null;
              t.image_versions2 && t.image_versions2.additional_candidates ? o = t.image_versions2.additional_candidates.igtv_first_frame || t.image_versions2.additional_candidates.first_frame || null : (o = t.image_versions2.candidates || null, o && instaUtils.sortByProperty(o, "width", !0), o = o && o[0] || null), a = o && o.url || null;
            } else t.image_versions2 && t.image_versions2.candidates && instaUtils.sortByProperty(t.image_versions2.candidates, "width", !0), e = t.image_versions2.candidates && t.image_versions2.candidates[0] && t.image_versions2.candidates[0].url || null, s = "photo", a = e;
            return o = instaUtils.extractFilenameFromUrl(e, n), {
              url: e,
              isReels: u,
              filename: o,
              type: s,
              prev: a,
              dimensions: t.dimensions
            };
          }
        };
      }();
    }, (module, exports, require) => {
      const instaUtils = require(3),
        postDetailsResolver = require(21),
        bulkDownloadController = require(24),
        constants = require(4),
        instaUtils_2 = require(3);
      module.exports = function () {
        return {
          getFbDtsg: function () {
            try {
              let scripts = document.querySelectorAll("script");
              for (let i = 0; i < scripts.length; i++) {
                let txt = scripts[i].textContent || "";
                if (txt.indexOf("dtsg") !== -1 || txt.indexOf("DTSG") !== -1 || txt.indexOf("token") !== -1) {
                  let m = txt.match(/"dtsg":\s*\{\s*"token":\s*"([^"]+)"/) || txt.match(/"DTSGInitialData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) || txt.match(/"DTSGInitData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) || txt.match(/"token":\s*"(NAf[^"]+)"/) || txt.match(/name="fb_dtsg"\s+value="([^"]+)"/);
                  if (m && m[1]) return m[1];
                }
              }
              let html = document.documentElement ? document.documentElement.innerHTML : "";
              let m = html.match(/"dtsg":\s*\{\s*"token":\s*"([^"]+)"/) || html.match(/"DTSGInitialData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) || html.match(/"DTSGInitData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) || html.match(/"token":\s*"(NAf[^"]+)"/) || html.match(/name="fb_dtsg"\s+value="([^"]+)"/);
              return m ? m[1] : null;
            } catch (e) {
              return null;
            }
          },
          getCsrf: function () {
            try {
              let m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
              return m ? m[1] : "";
            } catch (e) {
              return "";
            }
          },
          getStoryUsername: function (reel, fallbackId) {
            let u = reel && reel.owner && reel.owner.username || reel && reel.user && reel.user.username;
            if (u) return u;
            if (reel && Array.isArray(reel.items)) {
              for (let it of reel.items) {
                if (it && it.user && it.user.username) return it.user.username;
                if (it && it.owner && it.owner.username) return it.owner.username;
              }
            }
            try {
              let headerLink = document.querySelector('header a[href^="/"]:not([href="/"]):not([href^="/explore"]):not([href^="/reels"]):not([href^="/direct"]):not([href*="stories"])') || document.querySelector('section header a[role="link"][href^="/"]') || document.querySelector('header a[role="link"][href^="/"]');
              if (headerLink) {
                let href = headerLink.getAttribute("href") || "";
                let m = href.match(/^\/([A-Za-z0-9_.-]+)\/?$/);
                if (m && m[1] && m[1] !== "stories") return m[1];
                let txt = (headerLink.textContent || "").trim();
                if (txt && /^[A-Za-z0-9_.-]+$/.test(txt)) return txt;
              }
            } catch (e) {}
            try {
              let pathParts = location.pathname.split("/").filter(Boolean);
              if (pathParts[0] === "stories" && pathParts[1] && pathParts[1] !== "highlights") {
                return pathParts[1];
              }
              if (pathParts[0] && !["stories", "explore", "reels", "direct", "p"].includes(pathParts[0])) {
                return pathParts[0];
              }
              let m = (document.title || "").match(/\(@([A-Za-z0-9_.-]+)\)/);
              if (m && m[1]) return m[1];
            } catch (e) {}
            let pk = reel && reel.items && reel.items[0] && reel.items[0].user && (reel.items[0].user.pk || reel.items[0].user.id) || fallbackId;
            if (pk) return `user_${pk}`;
            return "story_user";
          },
          getHighlightTitle: function (reel) {
            if (reel && typeof reel.title === "string" && reel.title.trim()) {
              return reel.title.trim().replace(/[^\w\s.-]/g, "").trim();
            }
            try {
              let docTitle = (document.title || "").split(/[•·|]/)[0].trim();
              if (docTitle && !docTitle.toLowerCase().includes("instagram") && docTitle.length < 50) {
                let clean = docTitle.replace(/[^\w\s.-]/g, "").trim();
                if (clean) return clean;
              }
              let titleEl = document.querySelector('header div > span[dir="auto"], header h2, header h1');
              if (titleEl && titleEl.textContent) {
                let txt = titleEl.textContent.trim().replace(/[^\w\s.-]/g, "").trim();
                if (txt && txt.length < 50) return txt;
              }
            } catch (e) {}
            return "";
          },
          resolveUserId: async function (userName) {
            if (!userName) return null;
            let str = String(userName).trim();
            if (/^\d+$/.test(str)) return str;
            if (instaUtils.k && instaUtils.k[str]) return instaUtils.k[str];
            try {
              let res = await fetch("https://www.instagram.com/api/v1/users/web_profile_info/?username=" + encodeURIComponent(str), {
                headers: {
                  "x-ig-app-id": "936619743392459",
                  "x-requested-with": "XMLHttpRequest",
                  "accept": "*/*"
                },
                credentials: "include"
              });
              if (res.ok) {
                let data = await res.json();
                let uid = data && data.data && data.data.user && data.data.user.id;
                if (uid) {
                  instaUtils.k[str] = uid;
                  return uid;
                }
              }
            } catch (err) {}
            let uid = await new Promise(resolve => {
              instaUtils.requestUserId(str, resolve);
            });
            if (uid) {
              instaUtils.k[str] = uid;
              return uid;
            }
            return null;
          },
          fetchStories: async function (e, isHighlight) {
            let ids = Array.isArray(e) ? e.slice() : [e];
            ids = ids.map(function (id) {
              return String(id || "").trim();
            }).filter(Boolean);
            if (!ids.length) return null;
            if (ids.some(function (id) {
              return id.startsWith("highlight:");
            })) {
              isHighlight = true;
            }
            let formattedIds = ids.map(function (id) {
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
            let dtsg = this.getFbDtsg();
            if (!dtsg) {
              dtsg = await new Promise(res => {
                chrome.storage.local.get("fb_dtsg", r => res(r && r.fb_dtsg || null));
              });
            }
            if (!dtsg) {
              try {
                let rootRes = await fetch("https://www.instagram.com/");
                let rootHtml = await rootRes.text();
                let m = rootHtml.match(/"dtsg":\s*\{\s*"token":\s*"([^"]+)"/) || rootHtml.match(/"DTSGInitialData",\s*\[\],\s*\{\s*"token":\s*"([^"]+)"/) || rootHtml.match(/"token":\s*"(NAf[^"]+)"/);
                if (m && m[1]) dtsg = m[1];
              } catch (err) {}
            }
            if (dtsg) {
              chrome.storage.local.set({
                fb_dtsg: dtsg
              });
            }
            let csrf = this.getCsrf();
            let headers = {
              "content-type": "application/x-www-form-urlencoded",
              "accept": "*/*",
              "x-fb-friendly-name": friendlyName,
              "x-ig-app-id": "936619743392459",
              "x-asbd-id": "359341"
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
            console.log("[Downloader] Requesting stories for:", formattedIds, "isHighlight:", isHighlight);
            let res = await fetch("https://www.instagram.com/graphql/query", {
              method: "POST",
              headers: headers,
              credentials: "include",
              body: bodyParams.toString()
            }).catch(err => {
              console.error("[Downloader] GraphQL fetch error:", err);
              return null;
            });
            if (!res || res.status !== 200 && res.status !== 202) {
              console.warn("[Downloader] Direct fetch status:", res ? res.status : "null", "Trying background worker fallback...");
              return new Promise(resolve => {
                chrome.runtime.sendMessage({
                  action: isHighlight ? "requestHighlights" : "requestStories",
                  reel_ids: ids,
                  userId: ids[0],
                  fb_dtsg: dtsg,
                  csrftoken: csrf
                }, resolve);
              });
            }
            let data = await res.json().catch(err => {
              console.error("[Downloader] JSON parse error:", err);
              return null;
            });
            if (!data) return null;
            let connection = data && data.data && (data.data.xdt_api__v1__feed__reels_media__connection || data.data.reels_media_connection);
            let nodes = [];
            if (connection && Array.isArray(connection.edges)) {
              nodes = connection.edges.map(function (e) {
                return e && e.node;
              }).filter(Boolean);
            } else if (data && data.data && Array.isArray(data.data.reels_media)) {
              nodes = data.data.reels_media;
            } else if (data && Array.isArray(data.reels_media)) {
              nodes = data.reels_media;
            }
            console.log("[Downloader] Reel nodes count:", nodes.length);
            let fallbackUser = this.getStoryUsername ? this.getStoryUsername(nodes[0], initialReelId) : "story_user";
            let fallbackTitle = this.getHighlightTitle ? this.getHighlightTitle(nodes[0]) : "";
            nodes.forEach(function (node) {
              if (node) {
                if (!node.title && fallbackTitle) node.title = fallbackTitle;
                if (!node.owner && node.user) {
                  node.owner = node.user;
                }
                if (!node.owner && !node.user) {
                  node.owner = {
                    username: fallbackUser
                  };
                  node.user = {
                    username: fallbackUser
                  };
                }
                if (node.owner && !node.owner.username) {
                  node.owner.username = fallbackUser;
                }
                if (node.user && !node.user.username) {
                  node.user.username = fallbackUser;
                }
                if (Array.isArray(node.items)) {
                  node.items.forEach(function (it) {
                    if (it) {
                      if (!it.user && node.user) it.user = node.user;
                      if (!it.owner && (node.owner || node.user)) it.owner = node.owner || node.user;
                      if (it.user && !it.user.username) it.user.username = fallbackUser;
                      if (it.owner && !it.owner.username) it.owner.username = fallbackUser;
                    }
                  });
                }
              }
            });
            let reelsObj = {};
            nodes.forEach(function (node) {
              if (node && node.id) {
                let raw = String(node.id).replace(/^highlight:/, "");
                reelsObj[node.id] = node;
                reelsObj[raw] = node;
              }
            });
            if (nodes.length > 0) {
              formattedIds.forEach(function (fid) {
                let raw = fid.replace(/^highlight:/, "");
                if (!reelsObj[fid]) reelsObj[fid] = nodes[0];
                if (!reelsObj[raw]) reelsObj[raw] = nodes[0];
              });
            }
            return {
              ...(data || {}),
              data: {
                ...(data && data.data || {}),
                reels_media: nodes
              },
              reels_media: nodes,
              reel: nodes[0] || null,
              reels: reelsObj
            };
          },
          fetchStoriesForUser: function (t, n) {
            let e = this;
            e.resolveUserId(t).then(async function (r) {
              if (!r) return n();
              let res = await e.fetchStories(r, false);
              let reel = res && res.reels && (res.reels[r] || res.reels[String(r).replace(/^highlight:/, "")] || res.reels[`highlight:${String(r).replace(/^highlight:/, "")}`]) || res && (res.reel || res.reels_media && res.reels_media[0]);
              if (!(reel && reel.items && reel.items.length)) return n();
              n(e.Qn(reel.items, reel.owner || reel.user), t);
            }).catch(function () {
              n();
            });
          },
          normalizeStoryItems: function (t, n) {
            let e = [];
            let defaultUName = n && n.username || "";
            return (t || []).forEach(function (t) {
              let r = null;
              let isVideo = Boolean(t.is_video || t.media_type === 2 || String(t.media_type) === "2" || Array.isArray(t.video_versions) && t.video_versions.length > 0 || Array.isArray(t.video_resources) && t.video_resources.length > 0);
              let ext = isVideo ? "mp4" : "jpg";
              if (isVideo) {
                let vList = Array.isArray(t.video_resources) && t.video_resources.length && t.video_resources || Array.isArray(t.video_versions) && t.video_versions.length && t.video_versions || [];
                let sortedV = vList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
                let bestV = sortedV[0] || vList[0];
                r = bestV && (bestV.src || bestV.url);
              } else {
                let iList = t.image_versions2 && Array.isArray(t.image_versions2.candidates) && t.image_versions2.candidates || Array.isArray(t.display_resources) && t.display_resources || [];
                let sortedI = iList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
                let bestI = sortedI[0] || iList[0];
                r = bestI && (bestI.src || bestI.url) || t.display_url || null;
              }
              if (!r) return;
              let s = r.match(new RegExp("\\/([^/?]+)(?:$|\\?)"));
              s = s && s[1];
              let uName = t.user && t.user.username || t.owner && t.owner.username || defaultUName;
              if (s) {
                let baseClean = s.replace(/\.[a-zA-Z0-9]+$/, "");
                s = `${baseClean}.${ext}`;
                if (uName && uName.length) {
                  s = `${uName}_${s}`;
                }
              } else {
                let itemId = t.id || t.pk || Math.floor(Math.random() * 1e9);
                s = `${uName ? uName + "_" : ""}${itemId}.${ext}`;
              }
              e.push({
                url: r,
                filename: s
              });
            }), e;
          },
          pauseStoryVideo: function () {
            const t = "M15 1c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3zm18 0c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3z",
              n = document.querySelector(`svg path[d*="${t}"]`) || null;
            let e = n && n.closest("button") || null;
            e || (e = n && n.closest('div[role*="button"]') || null), e && e.click();
          },
          injectStoryActionButtons: function (t) {
            if (!location.pathname.match(/stories\/(locations|tags)\//) && !t.querySelector(".promaster_stories_actions_wrap")) {
              let n = document.createElement("div");
              n.innerHTML = `\n\t\t\t\t<div class="promaster_stories_actions_wrap">\n\t\t\t\t\t<a class="promaster_stories_actions_btn promaster_ns_rp_btn">\n\t\t\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("repost")}</span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<a class="promaster_stories_actions_btn promaster_ns_dl_btn">\n\t\t\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("download")}</span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<a class="promaster_stories_actions_btn promaster_ns_dl_all_btn">\n\t\t\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("download_all")}</span>\n\t\t\t\t\t\t<span class="promaster_stories_count"></span>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t`, t.append(n);
            }
          },
          formatStoryItem: function (t, owner) {
            let itemId = t && (t.id || t.pk);
            if (!itemId) return;
            let n = {
              id: itemId
            };
            let isVideo = Boolean(t.is_video || t.media_type === 2 || String(t.media_type) === "2" || Array.isArray(t.video_versions) && t.video_versions.length > 0 || Array.isArray(t.video_resources) && t.video_resources.length > 0);
            let ext = isVideo ? "mp4" : "jpg";
            if (isVideo) {
              let vList = Array.isArray(t.video_resources) && t.video_resources.length && t.video_resources || Array.isArray(t.video_versions) && t.video_versions.length && t.video_versions || [];
              let sortedV = vList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
              let bestV = sortedV[0] || vList[0];
              n.url = bestV && (bestV.src || bestV.url);
              let iList = t.image_versions2 && Array.isArray(t.image_versions2.candidates) && t.image_versions2.candidates || Array.isArray(t.display_resources) && t.display_resources || [];
              let sortedI = iList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
              let bestI = sortedI[0] || iList[0];
              n.prev = bestI && (bestI.src || bestI.url) || t.display_url || n.url;
              n.type = "video";
            } else {
              let iList = t.image_versions2 && Array.isArray(t.image_versions2.candidates) && t.image_versions2.candidates || Array.isArray(t.display_resources) && t.display_resources || [];
              let sortedI = iList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
              let bestI = sortedI[0] || iList[0];
              n.url = bestI && (bestI.src || bestI.url) || t.display_url;
              n.prev = n.url;
              n.type = "image";
            }
            if (!n.url) return;
            let e = n.url.match(new RegExp("\\/([^/?]+)(?:$|\\?)"));
            e = e && e[1];
            let username = owner && owner.username || t.owner && t.owner.username || t.user && t.user.username || "";
            if (e) {
              let baseClean = e.replace(/\.[a-zA-Z0-9]+$/, "");
              e = `${baseClean}.${ext}`;
              n.filename = username ? `${username}_${e}` : e;
            } else {
              n.filename = `${username ? username + "_" : ""}${itemId}.${ext}`;
            }
            return n;
          },
          fetchHighlightStories: function (t) {
            let eThis = this;
            return new Promise(async n => {
              let res = await eThis.fetchStories(t, true);
              let connectionEdges = res && res.data && res.data.xdt_api__v1__feed__reels_media__connection && res.data.xdt_api__v1__feed__reels_media__connection.edges;
              let reels = res && res.data && res.data.reels_media || connectionEdges && connectionEdges.map(e => e && e.node).filter(Boolean) || res && res.reels_media || [];
              if (!reels.length || !reels[0].items || !reels[0].items.length) {
                console.warn("[Downloader] No items found for highlight:", t, res);
                return n(null);
              }
              let firstReel = reels[0];
              let e = [];
              let uName = firstReel.owner && firstReel.owner.username || firstReel.user && firstReel.user.username || (eThis.getStoryUsername ? eThis.getStoryUsername(firstReel, t) : instaUtils_2.generateRandomId());
              let hTitle = firstReel.title || (eThis.getHighlightTitle ? eThis.getHighlightTitle(firstReel) : "");
              let r = hTitle ? `${uName}_${hTitle}` : uName;
              let i = firstReel.owner && firstReel.owner.id || firstReel.user && (firstReel.user.pk || firstReel.user.id) || null;
              for (let it of firstReel.items) {
                let isVideo = Boolean(it.is_video || it.media_type === 2 || String(it.media_type) === "2" || Array.isArray(it.video_versions) && it.video_versions.length > 0 || Array.isArray(it.video_resources) && it.video_resources.length > 0);
                let fileUrl, ext;
                if (isVideo) {
                  let vList = Array.isArray(it.video_resources) && it.video_resources.length && it.video_resources || Array.isArray(it.video_versions) && it.video_versions.length && it.video_versions || [];
                  let sortedV = vList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
                  let bestV = sortedV[0] || vList[0];
                  fileUrl = bestV && (bestV.src || bestV.url);
                  ext = "mp4";
                } else {
                  let iList = it.image_versions2 && Array.isArray(it.image_versions2.candidates) && it.image_versions2.candidates || Array.isArray(it.display_resources) && it.display_resources || [];
                  let sortedI = iList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
                  let bestI = sortedI[0] || iList[0];
                  fileUrl = bestI && (bestI.src || bestI.url) || it.display_url || null;
                  ext = "jpg";
                }
                if (fileUrl) {
                  e.push({
                    userName: r,
                    fileExt: ext,
                    url: fileUrl,
                    id: it.id || instaUtils_2.generateRandomId(),
                    userPk: i
                  });
                }
              }
              n(e.length ? e : null);
            });
          },
          fetchUserStories: async function (t, n) {
            let e = this;
            let uId = await e.resolveUserId(t);
            if (!uId) {
              console.warn("[Downloader] Could not resolve userId for:", t);
              bulkDownloadController.isDownloading = !1;
              return n(null);
            }
            let res = await e.fetchStories(uId, false);
            let connectionEdges = res && res.data && res.data.xdt_api__v1__feed__reels_media__connection && res.data.xdt_api__v1__feed__reels_media__connection.edges;
            let reel = res && res.data && res.data.reels_media && res.data.reels_media[0] || connectionEdges && connectionEdges[0] && connectionEdges[0].node || res && res.reel || res && res.reels_media && res.reels_media[0] || null;
            if (!reel || !reel.items || !reel.items.length) {
              console.warn("[Downloader] No story items for user:", t, uId, res);
              return n(null);
            }
            let oItems = [];
            let uname = reel.owner && reel.owner.username || reel.user && reel.user.username || (typeof t === "string" && !/^\d+$/.test(t) ? t : "") || (e.getStoryUsername ? e.getStoryUsername(reel, uId) : "story_user");
            let owner = {
              username: uname
            };
            for (let it of reel.items) {
              let parsed = e.Yn(it, owner);
              parsed && oItems.push(parsed);
            }
            n(oItems.length ? oItems : null, uname);
          },
          re(t) {
            let n = Array.from(t.querySelectorAll("div")).find(t => {
              let n = t.clientHeight || t.offsetHeight;
              if (n > 0 && n < 6) return t.parentElement;
            });
            return n && n.children && n.children.length || 1;
          },
          updateStoryDownloadAllCount: function () {
            let t = instaUtils_2.getActiveSection();
            if (!t) return;
            let n = document.querySelector(".promaster_ns_dl_all_btn");
            if (!n) return;
            let e = this.re(t);
            e > 1 ? (n.querySelector(".promaster_stories_count").innerText = `(${e})`, n.style.setProperty("display", "flex", "important")) : n.style.setProperty("display", "none", "important");
          }
        };
      }();
    }, (module, exports, require) => {
      const instaUtils = require(3),
        domHelpers = require(25),
        postDetailsResolver = require(21),
        taskQueue = require(26),
        mediaItemFormatter = require(22),
        policyStorage = require(30);
      module.exports = function () {
        return {
          isAdvancedMode: !1,
          isBulkRunning: !1,
          isAborted: !1,
          downloadPrefix: null,
          cachedMediaCount: null,
          userId: null,
          userName: null,
          nextCursor: null,
          collectedMediaPages: [],
          totalCountToFetch: 0,
          fetchedCount: 0,
          isDownloading: !1,
          advancedParamsStorage: {
            saveAdvancedParams: function (t) {
              chrome.storage.local.set({
                advanced_params: t
              });
            },
            getAdvancedParams: function (t) {
              let n = this;
              chrome.storage.local.get("advanced_params", function (e) {
                e.advanced_params ? t(e.advanced_params) : n.ve({
                  for_days: !0,
                  for_days_count: 30,
                  media_type: "all",
                  most_liked: !1,
                  most_liked_percent: 50,
                  most_viewed: !1,
                  most_viewed_percent: 50
                }, t);
              });
            }
          },
          resetDownloadState: function () {
            this.isBulkRunning = !1, this.isDownloading = !1;
          },
          showBulkDownloadButton: function () {
            let t = document.querySelector(".promaster_first_bulk_btn_wrap");
            if (t) return void (t.style.display = "block");
            let n = instaUtils.getUsernameFromDOMHeader();
            if (!n) return;
            if (this.downloadPrefix = instaUtils.extractUsernameFromUrl(), !this.downloadPrefix) {
              let t = document.querySelector("main header section h2");
              this.downloadPrefix = t && t.innerText;
            }
            if (!this.downloadPrefix) return;
            this.cachedMediaCount = null, this.userId = null, this.nextCursor = null, this.collectedMediaPages = [], this.fetchedCount = 0;
            let e = document.createElement("div");
            e.innerHTML = `\n\t\t\t\t<div class="promaster_first_bulk_btn_wrap">\n\t\t\t\t\t<div class="promaster_first_bulk_btn"></div>\n\t\t\t\t\t<div class="promaster_first_bulk_hint">${chrome.i18n.getMessage("bulk_download")}</div>\n\t\t\t\t</div>`, n.append(e.firstElementChild);
            const i = this;
            n.querySelector(".promaster_first_bulk_btn").addEventListener("click", () => {
              instaUtils.sendMessage("check_policy_accept", t => {
                t ? i.openBulkDownloadModal.call(i) : policyStorage.showPolicyModal(() => {
                  i.openBulkDownloadModal.bind(i);
                });
              });
            });
          },
          hideBulkDownloadButton: function () {
            let t = document.querySelector(".promaster_first_bulk_btn_wrap");
            t && (t.style.display = "none");
          },
          openBulkDownloadModal: function () {
            let t = this,
              n = new domHelpers();
            if (t.lastPath !== location.pathname) {
              t.cachedMediaCount = null;
              t.userId = null;
              t.nextCursor = null;
              t.Te = null;
              t.collectedMediaPages = [];
              t.fetchedCount = 0;
              t.downloadPrefix = instaUtils.extractUsernameFromUrl();
              t.lastPath = location.pathname;
            }
            let isReels = instaUtils.isReelsTab();
            t.isReels = isReels;
            n.$e({
              width: 300,
              height: 300
            }), instaUtils.sendMessage("checkBulkDownloadNow", function (e) {
              if (e) return n.showMessageModal(chrome.i18n.getMessage("synchronous_bulk_download_denied"));
              if (isReels) {
                if (null === t.userId || !t.collectedMediaPages || !t.collectedMediaPages.length) {
                  t.fetchInitialUserMedia(t.downloadPrefix, function (res) {
                    if (res && !res.error && res.success) {
                      t.nextCursor = res.after;
                      t.userId = res.user_id;
                      t.Te = res.has_next_page;
                      let count = t.collectedMediaPages ? t.collectedMediaPages.length : 12;
                      t.cachedMediaCount = count;
                      t.showModalPrompt({
                        count: count,
                        hasNextPage: res.has_next_page,
                        isReels: true
                      });
                    } else {
                      t.resetDownloadState();
                      n.showMessageModal(chrome.i18n.getMessage("sww_error"));
                    }
                  });
                } else {
                  t.showModalPrompt({
                    count: t.cachedMediaCount,
                    hasNextPage: t.Te,
                    isReels: true
                  });
                }
              } else {
                null === t.cachedMediaCount || isNaN(t.cachedMediaCount) ? instaUtils.requestUserPostCount(t.downloadPrefix, function (postCount) {
                  t.fetchInitialUserMedia(t.downloadPrefix, function (res) {
                    if (res && !res.error && res.success) {
                      let finalCount = postCount !== null && !isNaN(postCount) ? postCount : res.totalCount || null;
                      t.cachedMediaCount = finalCount;
                      t.nextCursor = res.after;
                      t.userId = res.user_id;
                      t.Te = res.has_next_page;
                      t.showModalPrompt({
                        count: finalCount,
                        hasNextPage: res.has_next_page,
                        isReels: false
                      });
                    } else {
                      t.resetDownloadState();
                      n.showMessageModal(chrome.i18n.getMessage("sww_error"));
                    }
                  });
                }) : t.showModalPrompt({
                  count: t.cachedMediaCount,
                  hasNextPage: t.Te,
                  isReels: false
                });
              }
            });
          },
          showModalPrompt: function (t) {
            let n = this;
            if (0 === t.count) return new domHelpers().showMessageModal(chrome.i18n.getMessage("no_media_found"));
            instaUtils.sendMessage("is_bulk_advanced", function (e) {
              n.isAdvancedMode = e, e ? n.showBasicBulkModal(t) : n.showAdvancedBulkModal(t);
            });
          },
          showBasicBulkModal: function (t) {
            let n = this,
              isReels = n.isReels || t && t.isReels,
              hasNext = t && t.hasNextPage,
              hasKnownCount = t.count !== null && t.count !== undefined && !isNaN(parseInt(t.count)),
              parsedCount = hasKnownCount ? parseInt(t.count) : null,
              displayCount = hasKnownCount ? parsedCount : (n.collectedMediaPages && n.collectedMediaPages.length || 12) + (hasNext ? "+" : ""),
              foundLabel = isReels ? chrome.i18n.getMessage("reels_found_on_page") || "reels found" : chrome.i18n.getMessage("files_found_on_page");
            n.advancedParamsStorage.we(function (e) {
              var o = `\n\t\t\t\t<div class="promaster_count_header">\n\t\t\t\t\t<span class="promaster_big_font_part">${displayCount}</span>\n\t\t\t\t\t<span class="promaster_small_font_part">&nbsp;${foundLabel}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="promaster_modal_header">${chrome.i18n.getMessage("bulk_advanced")}</div>\n\t\t\t\t<form class="promaster_bulk_form">\n\t\t\t\t\t<div class="promaster_form_block">\n\t\t\t\t\t\t<label class="promaster_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<input type="checkbox" name="for_days">\n\t\t\t\t\t\t\t<span class="promaster_form_custom_checkbox"><span class="promaster_form_custom_checkbox_checked"></span></span>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("for_days")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div class="promaster_form_number_input_wrap">\n\t\t\t\t\t\t\t<input type="number" name="for_days_count" max="999" min="1" value="30" disabled>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="promaster_form_block promaster_form_type_tabs">\n\t\t\t\t\t\t<label class="promaster_form_type_tab">${chrome.i18n.getMessage("all")}<input name="promaster_form_type_tab" type="radio" value="all"></label>\n\t\t\t\t\t\t<label class="promaster_form_type_tab">${chrome.i18n.getMessage("photo")}<input name="promaster_form_type_tab" type="radio" value="photo"></label>\n\t\t\t\t\t\t<label class="promaster_form_type_tab">${chrome.i18n.getMessage("video")}<input name="promaster_form_type_tab" type="radio" value="video"></label>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="promaster_form_block">\n\t\t\t\t\t\t<label class="promaster_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<div class="promaster_form_switch">\n\t\t\t\t\t\t\t\t<input type="checkbox" name="most_liked">\n\t\t\t\t\t\t\t\t<div class="promaster_form_switch_slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("most_liked")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t<div class="promaster_form_number_input_wrap">\n\t\t\t\t\t\t<input class="percent_count" name="most_liked_percent" type="number" max="100" min="1" value="50" disabled>\n\t\t\t\t\t\t<span class="promaster_form_number_input_note">%</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t\t<div class="promaster_form_block">\n\t\t\t\t\t\t<label class="promaster_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<div class="promaster_form_switch">\n\t\t\t\t\t\t\t\t<input type="checkbox" name="most_viewed">\n\t\t\t\t\t\t\t\t<div class="promaster_form_switch_slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("most_viewed")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div class="promaster_form_number_input_wrap">\n\t\t\t\t\t\t\t<input class="percent_count" name="most_viewed_percent" type="number" max="100" min="1" value="50" disabled>\n\t\t\t\t\t\t\t<span class="promaster_form_number_input_note">%</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="promaster_modal_btn_wrap">\n\t\t\t\t\t\t<button class="promaster_popup_dl_btn">${chrome.i18n.getMessage("download")}</button>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t\t<div class="promaster_form_advanced_switch"><span>${chrome.i18n.getMessage("hide_advanced")}</span></div>`;
              new domHelpers().showCustomModal(o), document.querySelector(".promaster_form_advanced_switch span").addEventListener("click", function () {
                n.isAdvancedMode = !1, instaUtils.sendMessage({
                  action: "bulk_advanced",
                  value: !1
                }), n.showAdvancedBulkModal(t);
              });
              let s = document.querySelector(".promaster_bulk_form"),
                a = s.querySelectorAll('[name="promaster_form_type_tab"]'),
                u = s.querySelector('[name="for_days"]'),
                c = s.querySelector('[name="for_days_count"]'),
                f = s.querySelector('[name="most_liked"]'),
                l = s.querySelector('[name="most_viewed"]'),
                h = s.querySelector('[name="most_liked_percent"]'),
                d = s.querySelector('[name="most_viewed_percent"]');
              function _(t) {
                if ("video" === t) {
                  l.removeAttribute("disabled"), l.closest(".promaster_form_block").style.opacity = "1";
                  let t = l.querySelector(".promaster_bulk_advanced_input_label");
                  t && (t.style.cursor = "pointer");
                } else {
                  l.setAttribute("disabled", "true"), l.closest(".promaster_form_block").style.opacity = "0";
                  let t = l.querySelector(".promaster_bulk_advanced_input_label");
                  t && (t.style.cursor = "default");
                }
              }
              document.querySelector(".promaster_popup_dl_btn").addEventListener("click", function (t) {
                t.stopPropagation(), t.preventDefault(), n.advancedParamsStorage.ve(e), n.startBulkDownload();
              }), s.addEventListener("change", function (t) {
                switch (t.target.name) {
                  case "for_days":
                    e.for_days = t.target.checked, t.target.checked ? (c.removeAttribute("disabled"), c.focus(), c.select()) : c.setAttribute("disabled", "true");
                    break;
                  case "for_days_count":
                    e.for_days_count = parseInt(t.target.value);
                    break;
                  case "most_liked":
                    e.most_liked = t.target.checked, t.target.checked ? (h.removeAttribute("disabled"), h.focus(), h.select(), l.checked = !1, d.setAttribute("disabled", "true"), e.most_viewed = !1) : h.setAttribute("disabled", "true");
                    break;
                  case "most_liked_percent":
                    e.most_liked_percent = parseInt(t.target.value);
                    break;
                  case "most_viewed":
                    e.most_viewed = t.target.checked, t.target.checked ? (d.removeAttribute("disabled"), d.focus(), d.select(), f.checked = !1, h.setAttribute("disabled", "true"), e.most_liked = !1) : d.setAttribute("disabled", "true");
                    break;
                  case "most_viewed_percent":
                    e.most_viewed_percent = parseInt(t.target.value);
                    break;
                }
              }), a.forEach(function (t) {
                t.addEventListener("click", function (t) {
                  let n;
                  e.media_type = t.target.value, document.querySelectorAll(".promaster_form_type_tab").forEach(function (t) {
                    t && t.classList.contains("promaster_selected") && t.classList.remove("promaster_selected");
                  }), t.target.closest(".promaster_form_type_tab").classList.add("promaster_selected"), _(t.target.value);
                });
              }), s.querySelector('[name="for_days_count"]').addEventListener("keydown", function (t) {
                let n = t.target;
                setTimeout(function () {
                  let t = parseInt(n.value);
                  isNaN(t) || t < 1 ? n.value = 1 : t > 999 && (n.value = 999);
                }, 200);
              }), s.querySelector(".percent_count").addEventListener("keydown", function (t) {
                let n = t.target;
                setTimeout(function () {
                  let t = parseInt(n.value);
                  isNaN(t) || t < 1 ? n.value = 1 : t > 100 && (n.value = 100);
                }, 200);
              }), e.for_days && (u.checked = !0, c.removeAttribute("disabled")), e.most_liked && (f.checked = !0, h.removeAttribute("disabled")), e.most_viewed && (l.checked = !0, d.removeAttribute("disabled")), _(e.media_type), c.value = e.for_days_count, h.value = e.most_liked_percent, d.vale = e.most_viewed_percent;
              let m = document.querySelector(`[name="promaster_form_type_tab"][value="${e.media_type}"]`);
              m && (m.checked = !0, m.closest(".promaster_form_type_tab").classList.add("promaster_selected"));
            });
          },
          showAdvancedBulkModal: function (t) {
            let n = this,
              isReels = n.isReels || t && t.isReels,
              hasNext = t && t.hasNextPage,
              hasKnownCount = t.count !== null && t.count !== undefined && !isNaN(parseInt(t.count)),
              parsedCount = hasKnownCount ? parseInt(t.count) : null,
              maxLimit = Math.max(parsedCount || 0, 1e4),
              displayCount,
              defaultEnd;
            if (hasKnownCount) {
              displayCount = parsedCount;
              defaultEnd = parsedCount > 1e3 ? 1e3 : parsedCount;
            } else if (hasNext) {
              let loadedCount = n.collectedMediaPages && n.collectedMediaPages.length || 12;
              displayCount = loadedCount + "+";
              defaultEnd = 1e3;
            } else {
              let loadedCount = n.collectedMediaPages && n.collectedMediaPages.length || 1;
              displayCount = loadedCount;
              defaultEnd = loadedCount;
            }
            let foundLabel = isReels ? chrome.i18n.getMessage("reels_found_on_page") || "reels found" : chrome.i18n.getMessage("files_found_on_page"),
              startMax = Math.max(1, defaultEnd - 1).toString(),
              endMin = defaultEnd > 1 ? 2 : 1,
              a = `\n\t\t\t<div class="promaster_count_header">\n\t\t\t\t<span class="promaster_big_font_part">${displayCount}</span>\n\t\t\t\t<span class="promaster_small_font_part">&nbsp;${foundLabel}</span>\n\t\t\t</div>\n\t\t\t<form class="promaster_bulk_form">\n\t\t\t\t<div class="promaster_form_block">\n\t\t\t\t\t<div class="promaster_form_number_input_wrap promaster_form_number_input_wrap_column">\n\t\t\t\t\t\t<span>${chrome.i18n.getMessage("from")}</span> \n\t\t\t\t\t\t<input id="promaster_dl_all_start" type="number" min="1" max="${startMax}" value="1">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="promaster_form_number_input_wrap promaster_form_number_input_wrap_column">\n\t\t\t\t\t\t<span>${chrome.i18n.getMessage("to")}</span>\n\t\t\t\t\t\t<input id="promaster_dl_all_end" type="number" min="${endMin}" value="${defaultEnd}" max="${maxLimit}">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="promaster_modal_btn_wrap">\n\t\t\t\t\t<button class="promaster_popup_dl_btn">${chrome.i18n.getMessage("download")}</button>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t\t<div class="promaster_form_advanced_switch"><span>${chrome.i18n.getMessage("bulk_advanced")}</span></div>`;
            new domHelpers().showCustomModal(a), document.querySelector(".promaster_form_advanced_switch span").addEventListener("click", function () {
              n.isAdvancedMode = !0, instaUtils.sendMessage({
                action: "bulk_advanced",
                value: !0
              }), n.showBasicBulkModal(t);
            }), document.querySelector(".promaster_popup_dl_btn").addEventListener("click", function (t) {
              t.stopPropagation(), t.preventDefault(), n.startBulkDownload();
            });
            let u = document.querySelector("#promaster_dl_all_end"),
              c = document.querySelector("#promaster_dl_all_start");
            u.addEventListener("keydown", function (t) {
              let n = t.target,
                e = parseInt(n.getAttribute("max")) || 1e4;
              setTimeout(function () {
                let t = parseInt(n.value);
                isNaN(t) || t < c.value ? n.value = c.value : t > e && (n.value = e);
              }, 1e3);
            }), c.addEventListener("keydown", function (t) {
              let n = t.target;
              setTimeout(function () {
                let t = parseInt(n.value);
                isNaN(t) || t < 1 ? n.value = 1 : t > u.value && (n.value = u.value);
              }, 1e3);
            }), u.addEventListener("focus", function (t) {
              t.target.select();
            }), c.addEventListener("focus", function (t) {
              t.target.select();
            });
          },
          startBulkDownload: function () {
            let t = this;
            t.isBulkRunning || (t.isBulkRunning = !0, t.isAborted = !1, t.isDownloading = !0, this.getDownloadRangeOrAdvancedOptions(function (n) {
              t.fetchRemainingMediaPages(n, function (e) {
                if (e.error) return t.resetDownloadState(), new domHelpers().showMessageModal(chrome.i18n.getMessage("sww_error"));
                let r = t.filterCollectedMedia(n);
                if (r && "not_match" === r.error && t.isAdvancedMode) return t.resetDownloadState(), new domHelpers().showMessageModal(chrome.i18n.getMessage("bulk_advanced_params_not_match"));
                taskQueue.startBulkDownloadZipStream({
                  files: r,
                  filename_prefix: t.downloadPrefix
                }, t, n => {
                  t.resetDownloadState(), n.err && new domHelpers().showMessageModal(chrome.i18n.getMessage("sww_error"));
                });
              });
            }));
          },
          fetchInitialUserMedia: function (t, n) {
            let e = this;
            postDetailsResolver.getUserIdByUserName(t, function (r) {
              if (!r) return n({
                error: 1
              });
              e.userName = t, e.userId = r;
              if (e.isReels) {
                postDetailsResolver.fetchUserClips({
                  user_id: r
                }, function (res) {
                  try {
                    if (!res || !res.data) return e.resetDownloadState(), n({
                      error: 1
                    });
                    e.extractMediaNodesFromGraphql(res.data);
                    let clipsConn = res.data.xdt_api__v1__clips__user__connection_v2;
                    let pageInfo = clipsConn && clipsConn.page_info;
                    return n({
                      success: 1,
                      count: e.collectedMediaPages.length,
                      after: pageInfo && pageInfo.end_cursor,
                      has_next_page: pageInfo && pageInfo.has_next_page,
                      user_id: r
                    });
                  } catch (err) {
                    return e.resetDownloadState(), n({
                      error: 1
                    });
                  }
                });
              } else {
                postDetailsResolver.fetchUserFeedAPI({
                  userName: e.userName,
                  user_id: r
                }, function (res) {
                  try {
                    if (!res || !res.data) return e.resetDownloadState(), n({
                      error: 1
                    });
                    e.extractMediaNodesFromGraphql(res.data);
                    let timelineConn = res.data.xdt_api__v1__feed__user_timeline_graphql_connection || res.data.user && res.data.user.edge_owner_to_timeline_media;
                    let pageInfo = timelineConn && timelineConn.page_info;
                    let totalCount = null;
                    if (res.data.user) {
                      if (res.data.user.media_count != null) {
                        totalCount = parseInt(res.data.user.media_count, 10);
                      } else if (res.data.user.edge_owner_to_timeline_media && res.data.user.edge_owner_to_timeline_media.count != null) {
                        totalCount = parseInt(res.data.user.edge_owner_to_timeline_media.count, 10);
                      }
                    }
                    if (totalCount == null && timelineConn && timelineConn.count != null) {
                      totalCount = parseInt(timelineConn.count, 10);
                    }
                    return n({
                      success: 1,
                      count: totalCount || e.collectedMediaPages.length,
                      totalCount: totalCount,
                      after: pageInfo && pageInfo.end_cursor,
                      has_next_page: pageInfo && pageInfo.has_next_page,
                      user_id: r
                    });
                  } catch (err) {
                    return e.resetDownloadState(), n({
                      error: 1
                    });
                  }
                });
              }
            });
          },
          extractMediaNodesFromGraphql: function (t) {
            let n = t && (t.xdt_api__v1__clips__user__connection_v2 || t.xdt_api__v1__feed__user_timeline_graphql_connection || t.user && t.user.edge_owner_to_timeline_media) || null;
            if (!n || !n.edges || !n.page_info) return;
            let e = this;
            e.Te = n.page_info.has_next_page, e.nextCursor = n.page_info.end_cursor;
            n.edges.forEach(function (edge) {
              let mediaNode = edge.node && edge.node.media ? edge.node.media : edge.node;
              if (!mediaNode) return;
              let items = [],
                r = {},
                loc = mediaNode.location && mediaNode.location.slug;
              if (mediaNode.carousel_media) {
                mediaNode.carousel_media.forEach(function (o) {
                  r = mediaItemFormatter.formatFeedMediaItem(o, e.downloadPrefix, loc);
                  r.taken_at_timestamp = mediaNode.taken_at_timestamp || mediaNode.taken_at;
                  r.likes_count = mediaNode.edge_media_preview_like && mediaNode.edge_media_preview_like.count || mediaNode.like_count || null;
                  r.video_view_count = mediaNode.video_view_count || mediaNode.play_count || mediaNode.view_count || null;
                  items.push(r);
                });
              } else {
                r = mediaItemFormatter.formatFeedMediaItem(mediaNode, e.downloadPrefix, loc);
                r.taken_at_timestamp = mediaNode.taken_at_timestamp || mediaNode.taken_at;
                r.likes_count = mediaNode.edge_media_preview_like && mediaNode.edge_media_preview_like.count || mediaNode.like_count || null;
                r.video_view_count = mediaNode.video_view_count || mediaNode.play_count || mediaNode.view_count || null;
                items.push(r);
              }
              e.collectedMediaPages.push(items);
            });
            if (n.edges.length) {
              let lastEdge = n.edges[n.edges.length - 1];
              let lastNode = lastEdge.node && lastEdge.node.media ? lastEdge.node.media : lastEdge.node;
              if (lastNode) {
                e.fetchedCount = lastNode.taken_at_timestamp || lastNode.taken_at || 0;
              }
            }
          },
          filterCollectedMedia: function (t) {
            if (!this.isAdvancedMode) return instaUtils.flattenArray(this.collectedMediaPages.slice(t.start - 1, t.end));
            let n = [],
              e = [];
            if (t.advanced_options.for_days && this.collectedMediaPages.forEach(function (e) {
              e.forEach(function (e) {
                e.taken_at_timestamp >= instaUtils.getTimestampDaysAgo(t.advanced_options.for_days_count) && n.push(e);
              });
            }), n.length || (n = instaUtils.flattenArray(this.collectedMediaPages.slice(t.start - 1, t.end))), "all" !== t.advanced_options.media_type) {
              if (n.forEach(function (n) {
                t.advanced_options.media_type === n.type && e.push(n);
              }), !e || !e.length) return {
                error: "not_match"
              };
            } else e = n;
            let i = null;
            return "video" === t.advanced_options.media_type && t.advanced_options.most_viewed ? (instaUtils.sortByProperty(e, "video_view_count", !0), i = Math.ceil(e.length * t.advanced_options.most_viewed_percent / 100)) : t.advanced_options.most_liked && (instaUtils.sortByProperty(e, "likes_count", !0), i = Math.ceil(e.length * t.advanced_options.most_liked_percent / 100)), i && (e = e.splice(0, i)), e;
          },
          fetchRemainingMediaPages: function (t, n) {
            let e = this,
              s = new domHelpers();
            function a() {
              return Math.floor(3e3 * Math.random());
            }
            function u(i) {
              return e.Te && e.nextCursor ? !e.isAdvancedMode && e.totalCountToFetch <= e.collectedMediaPages.length || e.isAdvancedMode && (t.advanced_options.for_days && instaUtils.getTimestampDaysAgo(t.advanced_options.for_days_count) >= e.fetchedCount || e.collectedMediaPages.length > 5e3) ? n({
                success: 1
              }) : void (e.isBulkRunning && (i = i || 1, (e.isReels ? postDetailsResolver.fetchUserClips.bind(postDetailsResolver, {
                user_id: e.userId,
                after: e.nextCursor
              }) : postDetailsResolver.fetchUserFeedAPI.bind(postDetailsResolver, {
                userName: e.userName,
                user_id: e.userId,
                after: e.nextCursor
              }))(function (r) {
                if (!r || r.error || !r.data) return i > 3 ? (e.resetDownloadState(), n({
                  error: 1,
                  reason: "request_error"
                })) : (i++, setTimeout(u.bind(e, i, n), a()));
                try {
                  e.extractMediaNodesFromGraphql(r.data);
                } catch (t) {
                  return e.resetDownloadState(), n({
                    error: 1,
                    reason: "media_list_adding_error"
                  });
                }
                let o;
                if (e.isAdvancedMode) {
                  if (t.advanced_options.for_days) {
                    let n;
                    o = (Date.now() / 1e3 - e.fetchedCount) / 86400 / t.advanced_options.for_days_count * 100;
                  } else {
                    let t = e.cachedMediaCount < 5e3 ? e.cachedMediaCount : 5e3;
                    o = e.collectedMediaPages.length / t * 100;
                  }
                } else o = e.collectedMediaPages.length / e.totalCountToFetch * 100;
                s.qe({
                  progress: o
                }), setTimeout(u.bind(e, !1, n), a());
              }))) : n({
                success: 1
              });
            }
            s.qe({}, {
              cancelCallback: function () {
                e.resetDownloadState();
              }
            }), u();
          },
          getDownloadRangeOrAdvancedOptions: function (t) {
            if (this.isAdvancedMode) this.advancedParamsStorage.we(function (n) {
              t({
                advanced_options: n
              });
            });else {
              let n = document.querySelector("#promaster_dl_all_start").value,
                e = document.querySelector("#promaster_dl_all_end").value;
              isNaN(n) && (n = 1), isNaN(e) && (e = 1), this.totalCountToFetch = e, t({
                start: n,
                end: e
              });
            }
          }
        };
      }();
    }, module => {
      module.exports = function () {
        return class t {
          Fe;
          Oe;
          ze;
          constructor() {
            return this.modalElement = document.querySelector(".promaster_modal"), this.modalElement || (this.modalElement = document.createElement("div"), this.modalElement.className = "promaster_modal", this.modalElement.innerHTML = '<div class="promaster_modal_content"></div>', document.querySelector("body").appendChild(this.modalElement)), this;
          }
          hideAndCleanup(t) {
            this.modalElement.remove(), document.body.classList.remove("promaster-scroll-hidden"), "function" == typeof t && t();
          }
          je(t) {
            t.stopPropagation();
            let n = this;
            t.target === this.modalElement && n.hideAndCleanup();
          }
          showModal() {
            this.modalElement.style.display = "block", document.body.classList.add("promaster-scroll-hidden"), setTimeout(function () {
              document.querySelector(".promaster_modal_content").style.opacity = "1";
            }, 100);
          }
          closeModal() {
            this.hideAndCleanup();
          }
          showPreparingLinksModal(t, n) {
            let e = this,
              r;
            this.modalElement.querySelector("#bulk_preparing") || (document.removeEventListener("click", e.handleBackdropClick), this.modalElement.innerHTML = `\n\t\t\t\t<div id="bulk_preparing" class="promaster_modal_content">\n\t\t\t\t\t<div class="promaster_modal_header">${chrome.i18n.getMessage("preparing_links")}...</div>\n\t\t\t\t\t<div class="promaster_modal_progress"><div class="promaster_modal_progressbar"></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="promaster_modal_btn_wrap promaster_one_btn_inside">\n\t\t\t\t\t<button class="promaster_btn_cancel">${chrome.i18n.getMessage("btn_cancel")}</button>\n\t\t\t\t</div>`, this.progressBarElement = this.modalElement.querySelector(".promaster_modal_progressbar"), this.modalElement.querySelector(".promaster_btn_cancel").addEventListener("click", function () {
              e.hideAndCleanup(n && n.cancelCallback);
            }), e.showModal());
            let i = t.progress || 0;
            if (i && this.progressBarElement) {
              const t = 100;
              i > t && (i = t), i > parseInt(this.progressBarElement.style.width || 0) && (this.progressBarElement.style.width = i + "%");
            }
          }
          showDownloadingModal(t, n) {
            let e = this,
              r;
            this.modalElement.querySelector("#bulk_downloading") || (document.removeEventListener("click", e.handleBackdropClick), this.modalElement.innerHTML = `\n\t\t\t\t<div id="bulk_downloading" class="promaster_modal_content">\n\t\t\t\t\t<div class="promaster_modal_header">\n\t\t\t\t\t\t${chrome.i18n.getMessage("downloading")}...\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="promaster_count_header promaster_margin0">\n\t\t\t\t\t\t<span class="promaster_big_font_part"></span>\n\t\t\t\t\t\t<span class="promaster_small_font_part">&nbsp;/&nbsp;${t.total}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="promaster_modal_progress">\n\t\t\t\t\t\t<div class="promaster_modal_progressbar"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="promaster_modal_btn_wrap promaster_align_right">\n\t\t\t\t\t\t<button class="promaster_btn_enough">${chrome.i18n.getMessage("btn_enough")}</button>\n\t\t\t\t\t\t<button class="promaster_btn_cancel cancel_download small_btn_cancel">${chrome.i18n.getMessage("btn_cancel")}</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>`, this.counterElement = this.modalElement.querySelector(".promaster_big_font_part"), this.progressBarElement = this.modalElement.querySelector(".promaster_modal_progressbar"), this.modalElement.querySelector(".promaster_btn_cancel").addEventListener("click", function () {
              e.hideAndCleanup(n && n.cancelCallback);
            }), this.modalElement.querySelector(".promaster_btn_enough").addEventListener("click", function () {
              e.hideAndCleanup(n && n.enoughCallback);
            }), e.showModal());
            let i = t.progress || 0;
            const o = 100;
            this.counterElement.innerText = t.done || 0, i > o && (i = o), this.progressBarElement.style.width = i + "%";
          }
          showZippingModal(t) {
            let n = this,
              e;
            if (n.modalElement.querySelector("#bulk_zipping") || (document.removeEventListener("click", n.handleBackdropClick), n.modalElement.innerHTML = `\n\t\t\t<div id="bulk_zipping" class="promaster_modal_content">\n\t\t\t\t<div class="promaster_modal_header">${chrome.i18n.getMessage("zipping_files")}...</div>\n\t\t\t\t<div class="promaster_count_header"></div>\n\t\t\t\t<div class="promaster_modal_progress">\n\t\t\t\t\t<div class="promaster_modal_progressbar"></div>\n\t\t\t\t</div>\n\t\t\t</div>`, n.progressBarElement = n.modalElement.querySelector(".promaster_modal_progressbar"), n.counterElement = n.modalElement.querySelector(".promaster_big_font_part"), n.showModal()), !n.counterElement || !n.progressBarElement) return;
            let r = t.progress || 0;
            n.counterElement.innerText = r + "%", n.progressBarElement.style.width = r + "%";
          }
          showMessageModal(t, n) {
            let e = this;
            this.modalElement.innerHTML = `\n\t\t<div class="promaster_modal_content">\n\t\t\t<span class="promaster_modal_close"></span>\n\t\t\t<div>${t}</div>\n\t\t</div>`, document.addEventListener("click", e.handleBackdropClick), this.modalElement.querySelector(".promaster_modal_close").addEventListener("click", function () {
              e.hideAndCleanup(n && n.cancelCallback);
            }), e.showModal();
          }
          showErrorModal(t) {
            this.showMessageModal(`<div class="promaster_modal_message_container">${t}</div>`);
          }
          showLoaderModal(t) {
            this.modalElement.innerHTML = `\n\t\t<div class="promaster_modal_content">\n\t\t\t<div class="promaster_modal_loader" style="width:${t && t.width || 300}px;height:${t && t.height || 300}px;">\n\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t</div>\n\t\t</div>`, this.showModal();
          }
        };
      }();
    }, (module, exports, require) => {
      const domHelpers = require(25),
        modalUiAndDownloadManager = require(27),
        fileSaver = require(28),
        ratingManager = require(29);
      module.exports = function () {
        return {
          isBusy: !1,
          createTaskQueue: function (t, n) {
            let e = this,
              r = 0,
              i = 1,
              o = 2,
              s = t.data,
              a = t.asyncCount || 48,
              u = !1,
              c = [],
              f,
              l,
              h,
              d,
              _,
              m = function () {
                u || (u = !0, "function" == typeof _.reject && (n = _.reject)(c));
              },
              p = function () {
                "function" == typeof _.resolve && (s = c, setTimeout(function () {
                  try {
                    _.resolve(s);
                  } catch (t) {
                    c = t, m();
                  }
                }, 0));
              },
              v = function () {
                h || (h = setInterval(function () {
                  0 !== d && (clearInterval(h), h = void 0, 1 === d ? p() : m());
                }, 10));
              },
              w;
            return function () {
              l = 0, f = s.length;
              let t = 0,
                r = function (n) {
                  return function (e) {
                    Array.isArray(c) && 2 != d && (t--, l++, c[n] = e, l === f && (d = 1));
                  };
                },
                i = function (t) {
                  d = 2, c = t;
                };
              d = 0, v();
              let o = setInterval(function () {
                if (e.He) return;
                if (!s.length || 0 != d) return void clearInterval(o);
                let u = a - t;
                u < 1 || s.splice(0, u).forEach(function (e, o) {
                  setTimeout(function () {
                    try {
                      t++, n(e, r(o), i);
                    } catch (t) {
                      c = t, d = 2;
                    }
                  }, 0);
                });
              }, 500);
            }(), {
              thenOne: function (t, n) {
                return _ = {
                  resolve: t,
                  reject: n
                }, v(), e;
              }
            };
          },
          startBulkDownloadZipStream: function (options, stateController, callback) {
            let downloadController = this,
              files = options.files,
              filenamePrefix = options.filename_prefix || "ig_toolkit",
              progressModal = new domHelpers(),
              total = files.length;
            if (!files.length) return "function" == typeof callback && callback({
              err: "true",
              reason: "no files to dw"
            });
            downloadController.se = !0;
            let cancelled = !1,
              stopped = !1,
              completedCount = 0,
              abortController = new AbortController(),
              seenNames = new Set();
            function makeCrcTable() {
              let table = new Uint32Array(256);
              for (let n = 0; n < 256; n++) {
                let val = n;
                for (let k = 0; k < 8; k++) {
                  val = val & 1 ? 0xedb88320 ^ val >>> 1 : val >>> 1;
                }
                table[n] = val;
              }
              return table;
            }
            const crcTable = makeCrcTable();
            function getCrc32(buf) {
              let u8 = new Uint8Array(buf);
              let crc = 0 ^ -1;
              for (let i = 0; i < u8.length; i++) {
                crc = crc >>> 8 ^ crcTable[(crc ^ u8[i]) & 0xff];
              }
              return (crc ^ -1) >>> 0;
            }
            function getDosDateTime(date = new Date()) {
              const dosTime = (date.getHours() << 11 | date.getMinutes() << 5 | date.getSeconds() >> 1) & 0xffff;
              const dosDate = (date.getFullYear() - 1980 << 9 | date.getMonth() + 1 << 5 | date.getDate()) & 0xffff;
              return {
                dosTime,
                dosDate
              };
            }
            class StreamZipWriter {
              constructor(controller) {
                this.controller = controller;
                this.entries = [];
                this.offset = 0;
              }
              addFile(name, buffer, date = new Date()) {
                const encoder = new TextEncoder();
                const nameBytes = encoder.encode(name);
                const {
                  dosTime,
                  dosDate
                } = getDosDateTime(date);
                const crc = getCrc32(buffer);
                const size = buffer.byteLength;
                const header = new Uint8Array(30 + nameBytes.length);
                const view = new DataView(header.buffer);
                view.setUint32(0, 0x04034b50, true);
                view.setUint16(4, 20, true);
                view.setUint16(6, 0x0800, true);
                view.setUint16(8, 0, true); // STORE
                view.setUint16(10, dosTime, true);
                view.setUint16(12, dosDate, true);
                view.setUint32(14, crc, true);
                view.setUint32(18, size, true);
                view.setUint32(22, size, true);
                view.setUint16(26, nameBytes.length, true);
                view.setUint16(28, 0, true);
                header.set(nameBytes, 30);
                const localOffset = this.offset;
                this.offset += header.byteLength + size;
                this.entries.push({
                  nameBytes,
                  dosTime,
                  dosDate,
                  crc,
                  size,
                  offset: localOffset
                });
                this.controller.enqueue(header);
                this.controller.enqueue(new Uint8Array(buffer));
              }
              finish() {
                const cdOffset = this.offset;
                let cdSize = 0;
                for (const entry of this.entries) {
                  const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
                  const view = new DataView(cdHeader.buffer);
                  view.setUint32(0, 0x02014b50, true);
                  view.setUint16(4, 0x0314, true);
                  view.setUint16(6, 20, true);
                  view.setUint16(8, 0x0800, true);
                  view.setUint16(10, 0, true);
                  view.setUint16(12, entry.dosTime, true);
                  view.setUint16(14, entry.dosDate, true);
                  view.setUint32(16, entry.crc, true);
                  view.setUint32(20, entry.size, true);
                  view.setUint32(24, entry.size, true);
                  view.setUint16(28, entry.nameBytes.length, true);
                  view.setUint16(30, 0, true);
                  view.setUint16(32, 0, true);
                  view.setUint16(34, 0, true);
                  view.setUint16(36, 0, true);
                  view.setUint32(38, 0x81a40000, true);
                  view.setUint32(42, entry.offset, true);
                  cdHeader.set(entry.nameBytes, 46);
                  cdSize += cdHeader.byteLength;
                  this.controller.enqueue(cdHeader);
                }
                const eocd = new Uint8Array(22);
                const view = new DataView(eocd.buffer);
                view.setUint32(0, 0x06054b50, true);
                view.setUint16(4, 0, true);
                view.setUint16(6, 0, true);
                view.setUint16(8, this.entries.length, true);
                view.setUint16(10, this.entries.length, true);
                view.setUint32(12, cdSize, true);
                view.setUint32(16, cdOffset, true);
                view.setUint16(20, 0, true);
                this.controller.enqueue(eocd);
                this.controller.close();
              }
            }
            function fetchBuffer(url, signal) {
              return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                if (signal) {
                  signal.addEventListener("abort", () => {
                    xhr.abort();
                    reject(new Error("aborted"));
                  });
                }
                xhr.onload = function () {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                  } else {
                    reject(new Error("HTTP " + xhr.status));
                  }
                };
                xhr.onerror = function () {
                  reject(new Error("Network error"));
                };
                xhr.send();
              });
            }
            async function downloadWithRetry(url, signal) {
              try {
                return await fetchBuffer(url, signal);
              } catch (err) {
                if (signal && signal.aborted) throw err;
                await new Promise(r => setTimeout(r, 1500));
                return await fetchBuffer(url, signal);
              }
            }
            let zipWriter;
            const zipStream = new ReadableStream({
              start(controller) {
                zipWriter = new StreamZipWriter(controller);
              }
            });
            const blobPromise = new Response(zipStream).blob();
            let cursor = 0;
            const concurrency = 6;
            async function resolveVideoUrl(pk) {
              if (!pk) return null;
              try {
                let res = await fetch(`https://www.instagram.com/api/v1/media/${pk}/info/`, {
                  headers: {
                    "x-ig-app-id": "936619743392459",
                    "accept": "*/*"
                  },
                  credentials: "include"
                });
                if (res.ok) {
                  let json = await res.json();
                  let item = json.items && json.items[0];
                  if (item) {
                    let vList = Array.isArray(item.video_resources) && item.video_resources.length && item.video_resources || Array.isArray(item.video_versions) && item.video_versions.length && item.video_versions || [];
                    if (vList.length) {
                      let sorted = vList.slice().sort((a, b) => (b.config_width || b.width || 0) - (a.config_width || a.width || 0));
                      return sorted[0].src || sorted[0].url || null;
                    }
                  }
                }
              } catch (e) {}
              return null;
            }
            async function worker() {
              while (cursor < files.length && !stopped && !cancelled) {
                const idx = cursor++;
                const item = files[idx];
                try {
                  let downloadUrl = item.url;
                  if ((item.type === "video" || item.isReels) && (!downloadUrl || !downloadUrl.includes(".mp4"))) {
                    if (item.pk) {
                      let resolved = await resolveVideoUrl(item.pk);
                      if (resolved) {
                        downloadUrl = resolved;
                        item.url = resolved;
                      }
                    }
                  }
                  if (!downloadUrl) downloadUrl = item.url || item.prev;
                  const buf = await downloadWithRetry(downloadUrl, abortController.signal);
                  if (buf && !cancelled) {
                    let filename = item.filename || `file_${idx}`;
                    if (seenNames.has(filename)) {
                      let extMatch = filename.match(/\.([^.]+)$/);
                      let ext = extMatch ? extMatch[1] : "";
                      let base = extMatch ? filename.slice(0, -(ext.length + 1)) : filename;
                      filename = `${base}_${idx}.${ext || "dat"}`;
                    }
                    seenNames.add(filename);
                    zipWriter.addFile(filename, buf);
                    completedCount++;
                    progressModal.showDownloadingModal({
                      total: total,
                      done: completedCount,
                      progress: parseFloat(completedCount / total * 100)
                    });
                  }
                } catch (err) {
                  if (cancelled) return;
                }
              }
            }
            async function finalizeZip() {
              if (zipWriter.entries.length > 0) {
                zipWriter.finish();
                const finalBlob = await blobPromise;
                let dateStr = new Date().toJSON().replace(/([^\w\-].+)/, "");
                fileSaver(finalBlob, `${filenamePrefix}_${dateStr}.zip`);
                progressModal.closeModal();
                "function" == typeof callback && callback({
                  success: 1
                });
              } else {
                progressModal.closeModal();
                "function" == typeof callback && callback({
                  err: "true",
                  reason: "no files downloaded"
                });
              }
              downloadController.se = !1;
              stateController.resetDownloadState();
            }
            progressModal.showDownloadingModal({
              total: total,
              done: 0,
              progress: 0
            }, {
              enoughCallback: function () {
                stopped = !0;
              },
              cancelCallback: function () {
                cancelled = !0;
                stopped = !0;
                abortController.abort();
                downloadController.se = !1;
                stateController.resetDownloadState();
                progressModal.closeModal();
                "function" == typeof callback && callback({
                  cancelled: 1
                });
              }
            });
            (async function () {
              try {
                const workers = [];
                for (let i = 0; i < Math.min(concurrency, total); i++) {
                  workers.push(worker());
                }
                await Promise.all(workers);
                if (!cancelled) {
                  await finalizeZip();
                }
              } catch (err) {
                downloadController.se = !1;
                stateController.resetDownloadState();
                progressModal.showErrorModal(chrome.i18n.getMessage("error_bulk"));
                "function" == typeof callback && callback({
                  error: 1
                });
              }
            })();
          }
        };
      }();
    }, (module, exports, require) => {
      !function (n) {
        module.exports = n();
      }(function () {
        return function t(n, e, r) {
          function i(s, a) {
            if (!e[s]) {
              if (!n[s]) {
                var u = void 0;
                if (0) return require(s, !0);
                if (o) return o(s, !0);
                var c = new Error("Cannot find module '" + s + "'");
                throw c.code = "MODULE_NOT_FOUND", c;
              }
              var f = e[s] = {
                exports: {}
              };
              n[s][0].call(f.exports, function (t) {
                var e;
                return i(n[s][1][t] || t);
              }, f, f.exports, t, n, e, r);
            }
            return e[s].exports;
          }
          for (var o = void 0, s = 0; s < r.length; s++) i(r[s]);
          return i;
        }({
          1: [function (t, n, e) {
            var r = t("./utils"),
              i = t("./support"),
              o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            e.encode = function (t) {
              for (var n, e, i, s, a, u, c, f = [], l = 0, h = t.length, d = h, _ = "string" !== r.getTypeOf(t); l < t.length;) d = h - l, i = _ ? (n = t[l++], e = l < h ? t[l++] : 0, l < h ? t[l++] : 0) : (n = t.charCodeAt(l++), e = l < h ? t.charCodeAt(l++) : 0, l < h ? t.charCodeAt(l++) : 0), s = n >> 2, a = (3 & n) << 4 | e >> 4, u = 1 < d ? (15 & e) << 2 | i >> 6 : 64, c = 2 < d ? 63 & i : 64, f.push(o.charAt(s) + o.charAt(a) + o.charAt(u) + o.charAt(c));
              return f.join("");
            }, e.decode = function (t) {
              var n,
                e,
                r,
                s,
                a,
                u,
                c = 0,
                f = 0,
                l = "data:";
              if (t.substr(0, 5) === l) throw new Error("Invalid base64 input, it looks like a data url.");
              var h,
                d = 3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
              if (t.charAt(t.length - 1) === o.charAt(64) && d--, t.charAt(t.length - 2) === o.charAt(64) && d--, d % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
              for (h = i.uint8array ? new Uint8Array(0 | d) : new Array(0 | d); c < t.length;) n = o.indexOf(t.charAt(c++)) << 2 | (s = o.indexOf(t.charAt(c++))) >> 4, e = (15 & s) << 4 | (a = o.indexOf(t.charAt(c++))) >> 2, r = (3 & a) << 6 | (u = o.indexOf(t.charAt(c++))), h[f++] = n, 64 !== a && (h[f++] = e), 64 !== u && (h[f++] = r);
              return h;
            };
          }, {
            "./support": 30,
            "./utils": 32
          }],
          2: [function (t, n, e) {
            var r = t("./external"),
              i = t("./stream/DataWorker"),
              o = t("./stream/DataLengthProbe"),
              s = t("./stream/Crc32Probe");
            function a(t, n, e, r, i) {
              this.compressedSize = t, this.uncompressedSize = n, this.crc32 = e, this.compression = r, this.compressedContent = i;
            }
            o = t("./stream/DataLengthProbe"), a.prototype = {
              getContentWorker: function () {
                var t = new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o("data_length")),
                  n = this;
                return t.on("end", function () {
                  if (this.streamInfo.data_length !== n.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
                }), t;
              },
              getCompressedWorker: function () {
                return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
              }
            }, a.createWorkerFrom = function (t, n, e) {
              return t.pipe(new s()).pipe(new o("uncompressedSize")).pipe(n.compressWorker(e)).pipe(new o("compressedSize")).withStreamInfo("compression", n);
            }, n.exports = a;
          }, {
            "./external": 6,
            "./stream/Crc32Probe": 25,
            "./stream/DataLengthProbe": 26,
            "./stream/DataWorker": 27
          }],
          3: [function (t, n, e) {
            var r = t("./stream/GenericWorker");
            e.STORE = {
              magic: "\0\0",
              compressWorker: function (t) {
                return new r("STORE compression");
              },
              uncompressWorker: function () {
                return new r("STORE decompression");
              }
            }, e.DEFLATE = t("./flate");
          }, {
            "./flate": 7,
            "./stream/GenericWorker": 28
          }],
          4: [function (t, n, e) {
            var r = t("./utils"),
              i = function () {
                for (var t, n = [], e = 0; e < 256; e++) {
                  t = e;
                  for (var r = 0; r < 8; r++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                  n[e] = t;
                }
                return n;
              }();
            n.exports = function (t, n) {
              return void 0 !== t && t.length ? "string" !== r.getTypeOf(t) ? function (t, n, e, r) {
                var o = i,
                  s = 0 + e;
                t ^= -1;
                for (var a = 0; a < s; a++) t = t >>> 8 ^ o[255 & (t ^ n[a])];
                return ~t;
              }(0 | n, t, t.length, 0) : function (t, n, e, r) {
                var o = i,
                  s = 0 + e;
                t ^= -1;
                for (var a = 0; a < s; a++) t = t >>> 8 ^ o[255 & (t ^ n.charCodeAt(a))];
                return ~t;
              }(0 | n, t, t.length, 0) : 0;
            };
          }, {
            "./utils": 32
          }],
          5: [function (t, n, e) {
            e.base64 = !1, e.binary = !1, e.dir = !1, e.createFolders = !0, e.date = null, e.compression = null, e.compressionOptions = null, e.comment = null, e.unixPermissions = null, e.dosPermissions = null;
          }, {}],
          6: [function (t, n, e) {
            var r = null;
            r = "undefined" != typeof Promise ? Promise : t("lie"), n.exports = {
              Promise: r
            };
          }, {
            lie: 37
          }],
          7: [function (t, n, e) {
            var r = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
              i = t("pako"),
              o = t("./utils"),
              s = t("./stream/GenericWorker"),
              a = r ? "uint8array" : "array";
            function u(t, n) {
              s.call(this, "FlateWorker/" + t), this._pako = null, this._pakoAction = t, this._pakoOptions = n, this.meta = {};
            }
            e.magic = "\b\0", o.inherits(u, s), u.prototype.processChunk = function (t) {
              this.meta = t.meta, null === this._pako && this._createPako(), this._pako.push(o.transformTo(a, t.data), !1);
            }, u.prototype.flush = function () {
              s.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
            }, u.prototype.cleanUp = function () {
              s.prototype.cleanUp.call(this), this._pako = null;
            }, u.prototype._createPako = function () {
              this._pako = new i[this._pakoAction]({
                raw: !0,
                level: this._pakoOptions.level || -1
              });
              var t = this;
              this._pako.onData = function (n) {
                t.push({
                  data: n,
                  meta: t.meta
                });
              };
            }, e.compressWorker = function (t) {
              return new u("Deflate", t);
            }, e.uncompressWorker = function () {
              return new u("Inflate", {});
            };
          }, {
            "./stream/GenericWorker": 28,
            "./utils": 32,
            pako: 38
          }],
          8: [function (t, n, e) {
            function r(t, n) {
              var e,
                r = "";
              for (e = 0; e < n; e++) r += String.fromCharCode(255 & t), t >>>= 8;
              return r;
            }
            function i(t, n, e, i, s, f) {
              var l,
                h,
                d = t.file,
                _ = t.compression,
                m = f !== a.utf8encode,
                p = o.transformTo("string", f(d.name)),
                v = o.transformTo("string", a.utf8encode(d.name)),
                w = d.comment,
                b = o.transformTo("string", f(w)),
                y = o.transformTo("string", a.utf8encode(w)),
                g = v.length !== d.name.length,
                k = y.length !== w.length,
                $ = "",
                S = "",
                E = "",
                A = d.dir,
                I = d.date,
                x = {
                  crc32: 0,
                  compressedSize: 0,
                  uncompressedSize: 0
                };
              n && !e || (x.crc32 = t.crc32, x.compressedSize = t.compressedSize, x.uncompressedSize = t.uncompressedSize);
              var P = 0;
              n && (P |= 8), m || !g && !k || (P |= 2048);
              var U = 0,
                R = 0;
              A && (U |= 16), "UNIX" === s ? (R = 798, U |= function (t, n) {
                var e = t;
                return t || (e = n ? 16893 : 33204), (65535 & e) << 16;
              }(d.unixPermissions, A)) : (R = 20, U |= function (t) {
                return 63 & (t || 0);
              }(d.dosPermissions)), l = I.getUTCHours(), l <<= 6, l |= I.getUTCMinutes(), l <<= 5, l |= I.getUTCSeconds() / 2, h = I.getUTCFullYear() - 1980, h <<= 4, h |= I.getUTCMonth() + 1, h <<= 5, h |= I.getUTCDate(), g && (S = r(1, 1) + r(u(p), 4) + v, $ += "up" + r(S.length, 2) + S), k && (E = r(1, 1) + r(u(b), 4) + y, $ += "uc" + r(E.length, 2) + E);
              var B = "";
              return B += "\n\0", B += r(P, 2), B += _.magic, B += r(l, 2), B += r(h, 2), B += r(x.crc32, 4), B += r(x.compressedSize, 4), B += r(x.uncompressedSize, 4), B += r(p.length, 2), B += r($.length, 2), {
                fileRecord: c.LOCAL_FILE_HEADER + B + p + $,
                dirRecord: c.CENTRAL_FILE_HEADER + r(R, 2) + B + r(b.length, 2) + "\0\0\0\0" + r(U, 4) + r(i, 4) + p + $ + b
              };
            }
            var o = t("../utils"),
              s = t("../stream/GenericWorker"),
              a = t("../utf8"),
              u = t("../crc32"),
              c = t("../signature");
            function f(t, n, e, r) {
              s.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = n, this.zipPlatform = e, this.encodeFileName = r, this.streamFiles = t, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
            }
            o.inherits(f, s), f.prototype.push = function (t) {
              var n = t.meta.percent || 0,
                e = this.entriesCount,
                r = this._sources.length;
              this.accumulate ? this.contentBuffer.push(t) : (this.bytesWritten += t.data.length, s.prototype.push.call(this, {
                data: t.data,
                meta: {
                  currentFile: this.currentFile,
                  percent: e ? (n + 100 * (e - r - 1)) / e : 100
                }
              }));
            }, f.prototype.openedSource = function (t) {
              this.currentSourceOffset = this.bytesWritten, this.currentFile = t.file.name;
              var n = this.streamFiles && !t.file.dir;
              if (n) {
                var e = i(t, n, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                this.push({
                  data: e.fileRecord,
                  meta: {
                    percent: 0
                  }
                });
              } else this.accumulate = !0;
            }, f.prototype.closedSource = function (t) {
              this.accumulate = !1;
              var n = this.streamFiles && !t.file.dir,
                e = i(t, n, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              if (this.dirRecords.push(e.dirRecord), n) this.push({
                data: function (t) {
                  return c.DATA_DESCRIPTOR + r(t.crc32, 4) + r(t.compressedSize, 4) + r(t.uncompressedSize, 4);
                }(t),
                meta: {
                  percent: 100
                }
              });else for (this.push({
                data: e.fileRecord,
                meta: {
                  percent: 0
                }
              }); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
              this.currentFile = null;
            }, f.prototype.flush = function () {
              for (var t = this.bytesWritten, n = 0; n < this.dirRecords.length; n++) this.push({
                data: this.dirRecords[n],
                meta: {
                  percent: 100
                }
              });
              var e = this.bytesWritten - t,
                i = function (t, n, e, i, s) {
                  var a = o.transformTo("string", s(i));
                  return c.CENTRAL_DIRECTORY_END + "\0\0\0\0" + r(t, 2) + r(t, 2) + r(n, 4) + r(e, 4) + r(a.length, 2) + a;
                }(this.dirRecords.length, e, t, this.zipComment, this.encodeFileName);
              this.push({
                data: i,
                meta: {
                  percent: 100
                }
              });
            }, f.prototype.prepareNextSource = function () {
              this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
            }, f.prototype.registerPrevious = function (t) {
              this._sources.push(t);
              var n = this;
              return t.on("data", function (t) {
                n.processChunk(t);
              }), t.on("end", function () {
                n.closedSource(n.previous.streamInfo), n._sources.length ? n.prepareNextSource() : n.end();
              }), t.on("error", function (t) {
                n.error(t);
              }), this;
            }, f.prototype.resume = function () {
              return !!s.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
            }, f.prototype.error = function (t) {
              var n = this._sources;
              if (!s.prototype.error.call(this, t)) return !1;
              for (var e = 0; e < n.length; e++) try {
                n[e].error(t);
              } catch (t) {}
              return !0;
            }, f.prototype.lock = function () {
              s.prototype.lock.call(this);
              for (var t = this._sources, n = 0; n < t.length; n++) t[n].lock();
            }, n.exports = f;
          }, {
            "../crc32": 4,
            "../signature": 23,
            "../stream/GenericWorker": 28,
            "../utf8": 31,
            "../utils": 32
          }],
          9: [function (t, n, e) {
            var r = t("../compressions"),
              i = t("./ZipFileWorker");
            e.generateWorker = function (t, n, e) {
              var o = new i(n.streamFiles, e, n.platform, n.encodeFileName),
                s = 0;
              try {
                t.forEach(function (t, e) {
                  s++;
                  var i = function (t, n) {
                      var e = t || n,
                        i = r[e];
                      if (!i) throw new Error(e + " is not a valid compression method !");
                      return i;
                    }(e.options.compression, n.compression),
                    a = e.options.compressionOptions || n.compressionOptions || {},
                    u = e.dir,
                    c = e.date;
                  e._compressWorker(i, a).withStreamInfo("file", {
                    name: t,
                    dir: u,
                    date: c,
                    comment: e.comment || "",
                    unixPermissions: e.unixPermissions,
                    dosPermissions: e.dosPermissions
                  }).pipe(o);
                }), o.entriesCount = s;
              } catch (t) {
                o.error(t);
              }
              return o;
            };
          }, {
            "../compressions": 3,
            "./ZipFileWorker": 8
          }],
          10: [function (t, n, e) {
            function r() {
              if (!(this instanceof r)) return new r();
              if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
              this.files = {}, this.comment = null, this.root = "", this.clone = function () {
                var t = new r();
                for (var n in this) "function" != typeof this[n] && (t[n] = this[n]);
                return t;
              };
            }
            (r.prototype = t("./object")).loadAsync = t("./load"), r.support = t("./support"), r.defaults = t("./defaults"), r.version = "3.5.0", r.loadAsync = function (t, n) {
              return new r().loadAsync(t, n);
            }, r.external = t("./external"), n.exports = r;
          }, {
            "./defaults": 5,
            "./external": 6,
            "./load": 11,
            "./object": 15,
            "./support": 30
          }],
          11: [function (t, n, e) {
            var r = t("./utils"),
              i = t("./external"),
              o = t("./utf8"),
              s = (r = t("./utils"), t("./zipEntries")),
              a = t("./stream/Crc32Probe"),
              u = t("./nodejsUtils");
            function c(t) {
              return new i.Promise(function (n, e) {
                var r = t.decompressed.getContentWorker().pipe(new a());
                r.on("error", function (t) {
                  e(t);
                }).on("end", function () {
                  r.streamInfo.crc32 !== t.decompressed.crc32 ? e(new Error("Corrupted zip : CRC32 mismatch")) : n();
                }).resume();
              });
            }
            n.exports = function (t, n) {
              var e = this;
              return n = r.extend(n || {}, {
                base64: !1,
                checkCRC32: !1,
                optimizedBinaryString: !1,
                createFolders: !1,
                decodeFileName: o.utf8decode
              }), u.isNode && u.isStream(t) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", t, !0, n.optimizedBinaryString, n.base64).then(function (t) {
                var e = new s(n);
                return e.load(t), e;
              }).then(function (t) {
                var e = [i.Promise.resolve(t)],
                  r = t.files;
                if (n.checkCRC32) for (var o = 0; o < r.length; o++) e.push(c(r[o]));
                return i.Promise.all(e);
              }).then(function (t) {
                for (var r = t.shift(), i = r.files, o = 0; o < i.length; o++) {
                  var s = i[o];
                  e.file(s.fileNameStr, s.decompressed, {
                    binary: !0,
                    optimizedBinaryString: !0,
                    date: s.date,
                    dir: s.dir,
                    comment: s.fileCommentStr.length ? s.fileCommentStr : null,
                    unixPermissions: s.unixPermissions,
                    dosPermissions: s.dosPermissions,
                    createFolders: n.createFolders
                  });
                }
                return r.zipComment.length && (e.comment = r.zipComment), e;
              });
            };
          }, {
            "./external": 6,
            "./nodejsUtils": 14,
            "./stream/Crc32Probe": 25,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntries": 33
          }],
          12: [function (t, n, e) {
            var r = t("../utils"),
              i = t("../stream/GenericWorker");
            function o(t, n) {
              i.call(this, "Nodejs stream input adapter for " + t), this._upstreamEnded = !1, this._bindStream(n);
            }
            r.inherits(o, i), o.prototype._bindStream = function (t) {
              var n = this;
              (this._stream = t).pause(), t.on("data", function (t) {
                n.push({
                  data: t,
                  meta: {
                    percent: 0
                  }
                });
              }).on("error", function (t) {
                n.isPaused ? this.generatedError = t : n.error(t);
              }).on("end", function () {
                n.isPaused ? n._upstreamEnded = !0 : n.end();
              });
            }, o.prototype.pause = function () {
              return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
            }, o.prototype.resume = function () {
              return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
            }, n.exports = o;
          }, {
            "../stream/GenericWorker": 28,
            "../utils": 32
          }],
          13: [function (t, n, e) {
            var r = t("readable-stream").Readable;
            function i(t, n, e) {
              r.call(this, n), this._helper = t;
              var i = this;
              t.on("data", function (t, n) {
                i.push(t) || i._helper.pause(), e && e(n);
              }).on("error", function (t) {
                i.emit("error", t);
              }).on("end", function () {
                i.push(null);
              });
            }
            t("../utils").inherits(i, r), i.prototype._read = function () {
              this._helper.resume();
            }, n.exports = i;
          }, {
            "../utils": 32,
            "readable-stream": 16
          }],
          14: [function (t, n, e) {
            n.exports = {
              isNode: "undefined" != typeof Buffer,
              newBufferFrom: function (t, n) {
                if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(t, n);
                if ("number" == typeof t) throw new Error('The "data" argument must not be a number');
                return new Buffer(t, n);
              },
              allocBuffer: function (t) {
                if (Buffer.alloc) return Buffer.alloc(t);
                var n = new Buffer(t);
                return n.fill(0), n;
              },
              isBuffer: function (t) {
                return Buffer.isBuffer(t);
              },
              isStream: function (t) {
                return t && "function" == typeof t.on && "function" == typeof t.pause && "function" == typeof t.resume;
              }
            };
          }, {}],
          15: [function (t, n, e) {
            function r(t, n, e) {
              var r,
                i = o.getTypeOf(n),
                a = o.extend(e || {}, u);
              a.date = a.date || new Date(), null !== a.compression && (a.compression = a.compression.toUpperCase()), "string" == typeof a.unixPermissions && (a.unixPermissions = parseInt(a.unixPermissions, 8)), a.unixPermissions && 16384 & a.unixPermissions && (a.dir = !0), a.dosPermissions && 16 & a.dosPermissions && (a.dir = !0), a.dir && (t = m(t)), a.createFolders && (r = _(t)) && p.call(this, r, !0);
              var l = "string" === i && !1 === a.binary && !1 === a.base64;
              e && void 0 !== e.binary || (a.binary = !l), (n instanceof c && 0 === n.uncompressedSize || a.dir || !n || 0 === n.length) && (a.base64 = !1, a.binary = !0, n = "", a.compression = "STORE", i = "string");
              var v = null;
              v = n instanceof c || n instanceof s ? n : h.isNode && h.isStream(n) ? new d(t, n) : o.prepareContent(t, n, a.binary, a.optimizedBinaryString, a.base64);
              var w = new f(t, v, a);
              this.files[t] = w;
            }
            var i = t("./utf8"),
              o = t("./utils"),
              s = t("./stream/GenericWorker"),
              a = t("./stream/StreamHelper"),
              u = t("./defaults"),
              c = t("./compressedObject"),
              f = t("./zipObject"),
              l = t("./generate"),
              h = t("./nodejsUtils"),
              d = t("./nodejs/NodejsStreamInputAdapter"),
              _ = function (t) {
                "/" === t.slice(-1) && (t = t.substring(0, t.length - 1));
                var n = t.lastIndexOf("/");
                return 0 < n ? t.substring(0, n) : "";
              },
              m = function (t) {
                return "/" !== t.slice(-1) && (t += "/"), t;
              },
              p = function (t, n) {
                return n = void 0 !== n ? n : u.createFolders, t = m(t), this.files[t] || r.call(this, t, null, {
                  dir: !0,
                  createFolders: n
                }), this.files[t];
              };
            function v(t) {
              return "[object RegExp]" === Object.prototype.toString.call(t);
            }
            var w = {
              load: function () {
                throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
              },
              forEach: function (t) {
                var n, e, r;
                for (n in this.files) this.files.hasOwnProperty(n) && (r = this.files[n], (e = n.slice(this.root.length, n.length)) && n.slice(0, this.root.length) === this.root && t(e, r));
              },
              filter: function (t) {
                var n = [];
                return this.forEach(function (e, r) {
                  t(e, r) && n.push(r);
                }), n;
              },
              file: function (t, n, e) {
                if (1 !== arguments.length) return t = this.root + t, r.call(this, t, n, e), this;
                if (v(t)) {
                  var i = t;
                  return this.filter(function (t, n) {
                    return !n.dir && i.test(t);
                  });
                }
                var o = this.files[this.root + t];
                return o && !o.dir ? o : null;
              },
              folder: function (t) {
                if (!t) return this;
                if (v(t)) return this.filter(function (n, e) {
                  return e.dir && t.test(n);
                });
                var n = this.root + t,
                  e = p.call(this, n),
                  r = this.clone();
                return r.root = e.name, r;
              },
              remove: function (t) {
                t = this.root + t;
                var n = this.files[t];
                if (n || ("/" !== t.slice(-1) && (t += "/"), n = this.files[t]), n && !n.dir) delete this.files[t];else for (var e = this.filter(function (n, e) {
                    return e.name.slice(0, t.length) === t;
                  }), r = 0; r < e.length; r++) delete this.files[e[r].name];
                return this;
              },
              generate: function (t) {
                throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
              },
              generateInternalStream: function (t) {
                var n,
                  e = {};
                try {
                  if ((e = o.extend(t || {}, {
                    streamFiles: !1,
                    compression: "STORE",
                    compressionOptions: null,
                    type: "",
                    platform: "DOS",
                    comment: null,
                    mimeType: "application/zip",
                    encodeFileName: i.utf8encode
                  })).type = e.type.toLowerCase(), e.compression = e.compression.toUpperCase(), "binarystring" === e.type && (e.type = "string"), !e.type) throw new Error("No output type specified.");
                  o.checkSupport(e.type), "darwin" !== e.platform && "freebsd" !== e.platform && "linux" !== e.platform && "sunos" !== e.platform || (e.platform = "UNIX"), "win32" === e.platform && (e.platform = "DOS");
                  var r = e.comment || this.comment || "";
                  n = l.generateWorker(this, e, r);
                } catch (t) {
                  (n = new s("error")).error(t);
                }
                return new a(n, e.type || "string", e.mimeType);
              },
              generateAsync: function (t, n) {
                return this.generateInternalStream(t).accumulate(n);
              },
              generateNodeStream: function (t, n) {
                return (t = t || {}).type || (t.type = "nodebuffer"), this.generateInternalStream(t).toNodejsStream(n);
              }
            };
            n.exports = w;
          }, {
            "./compressedObject": 2,
            "./defaults": 5,
            "./generate": 9,
            "./nodejs/NodejsStreamInputAdapter": 12,
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31,
            "./utils": 32,
            "./zipObject": 35
          }],
          16: [function (t, n, e) {
            n.exports = t("stream");
          }, {
            stream: void 0
          }],
          17: [function (t, n, e) {
            var r = t("./DataReader");
            function i(t) {
              r.call(this, t);
              for (var n = 0; n < this.data.length; n++) t[n] = 255 & t[n];
            }
            t("../utils").inherits(i, r), i.prototype.byteAt = function (t) {
              return this.data[this.zero + t];
            }, i.prototype.lastIndexOfSignature = function (t) {
              for (var n = t.charCodeAt(0), e = t.charCodeAt(1), r = t.charCodeAt(2), i = t.charCodeAt(3), o = this.length - 4; 0 <= o; --o) if (this.data[o] === n && this.data[o + 1] === e && this.data[o + 2] === r && this.data[o + 3] === i) return o - this.zero;
              return -1;
            }, i.prototype.readAndCheckSignature = function (t) {
              var n = t.charCodeAt(0),
                e = t.charCodeAt(1),
                r = t.charCodeAt(2),
                i = t.charCodeAt(3),
                o = this.readData(4);
              return n === o[0] && e === o[1] && r === o[2] && i === o[3];
            }, i.prototype.readData = function (t) {
              if (this.checkOffset(t), 0 === t) return [];
              var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
              return this.index += t, n;
            }, n.exports = i;
          }, {
            "../utils": 32,
            "./DataReader": 18
          }],
          18: [function (t, n, e) {
            var r = t("../utils");
            function i(t) {
              this.data = t, this.length = t.length, this.index = 0, this.zero = 0;
            }
            i.prototype = {
              checkOffset: function (t) {
                this.checkIndex(this.index + t);
              },
              checkIndex: function (t) {
                if (this.length < this.zero + t || t < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?");
              },
              setIndex: function (t) {
                this.checkIndex(t), this.index = t;
              },
              skip: function (t) {
                this.setIndex(this.index + t);
              },
              byteAt: function (t) {},
              readInt: function (t) {
                var n,
                  e = 0;
                for (this.checkOffset(t), n = this.index + t - 1; n >= this.index; n--) e = (e << 8) + this.byteAt(n);
                return this.index += t, e;
              },
              readString: function (t) {
                return r.transformTo("string", this.readData(t));
              },
              readData: function (t) {},
              lastIndexOfSignature: function (t) {},
              readAndCheckSignature: function (t) {},
              readDate: function () {
                var t = this.readInt(4);
                return new Date(Date.UTC(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1));
              }
            }, n.exports = i;
          }, {
            "../utils": 32
          }],
          19: [function (t, n, e) {
            var r = t("./Uint8ArrayReader");
            function i(t) {
              r.call(this, t);
            }
            t("../utils").inherits(i, r), i.prototype.readData = function (t) {
              this.checkOffset(t);
              var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
              return this.index += t, n;
            }, n.exports = i;
          }, {
            "../utils": 32,
            "./Uint8ArrayReader": 21
          }],
          20: [function (t, n, e) {
            var r = t("./DataReader");
            function i(t) {
              r.call(this, t);
            }
            t("../utils").inherits(i, r), i.prototype.byteAt = function (t) {
              return this.data.charCodeAt(this.zero + t);
            }, i.prototype.lastIndexOfSignature = function (t) {
              return this.data.lastIndexOf(t) - this.zero;
            }, i.prototype.readAndCheckSignature = function (t) {
              return t === this.readData(4);
            }, i.prototype.readData = function (t) {
              this.checkOffset(t);
              var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
              return this.index += t, n;
            }, n.exports = i;
          }, {
            "../utils": 32,
            "./DataReader": 18
          }],
          21: [function (t, n, e) {
            var r = t("./ArrayReader");
            function i(t) {
              r.call(this, t);
            }
            t("../utils").inherits(i, r), i.prototype.readData = function (t) {
              if (this.checkOffset(t), 0 === t) return new Uint8Array(0);
              var n = this.data.subarray(this.zero + this.index, this.zero + this.index + t);
              return this.index += t, n;
            }, n.exports = i;
          }, {
            "../utils": 32,
            "./ArrayReader": 17
          }],
          22: [function (t, n, e) {
            var r = t("../utils"),
              i = t("../support"),
              o = t("./ArrayReader"),
              s = t("./StringReader"),
              a = t("./NodeBufferReader"),
              u = t("./Uint8ArrayReader");
            n.exports = function (t) {
              var n = r.getTypeOf(t);
              return r.checkSupport(n), "string" !== n || i.uint8array ? "nodebuffer" === n ? new a(t) : i.uint8array ? new u(r.transformTo("uint8array", t)) : new o(r.transformTo("array", t)) : new s(t);
            };
          }, {
            "../support": 30,
            "../utils": 32,
            "./ArrayReader": 17,
            "./NodeBufferReader": 19,
            "./StringReader": 20,
            "./Uint8ArrayReader": 21
          }],
          23: [function (t, n, e) {
            e.LOCAL_FILE_HEADER = "PK", e.CENTRAL_FILE_HEADER = "PK", e.CENTRAL_DIRECTORY_END = "PK", e.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", e.ZIP64_CENTRAL_DIRECTORY_END = "PK", e.DATA_DESCRIPTOR = "PK\b";
          }, {}],
          24: [function (t, n, e) {
            var r = t("./GenericWorker"),
              i = t("../utils");
            function o(t) {
              r.call(this, "ConvertWorker to " + t), this.destType = t;
            }
            i.inherits(o, r), o.prototype.processChunk = function (t) {
              this.push({
                data: i.transformTo(this.destType, t.data),
                meta: t.meta
              });
            }, n.exports = o;
          }, {
            "../utils": 32,
            "./GenericWorker": 28
          }],
          25: [function (t, n, e) {
            var r = t("./GenericWorker"),
              i = t("../crc32");
            function o() {
              r.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
            }
            t("../utils").inherits(o, r), o.prototype.processChunk = function (t) {
              this.streamInfo.crc32 = i(t.data, this.streamInfo.crc32 || 0), this.push(t);
            }, n.exports = o;
          }, {
            "../crc32": 4,
            "../utils": 32,
            "./GenericWorker": 28
          }],
          26: [function (t, n, e) {
            var r = t("../utils"),
              i = t("./GenericWorker");
            function o(t) {
              i.call(this, "DataLengthProbe for " + t), this.propName = t, this.withStreamInfo(t, 0);
            }
            r.inherits(o, i), o.prototype.processChunk = function (t) {
              if (t) {
                var n = this.streamInfo[this.propName] || 0;
                this.streamInfo[this.propName] = n + t.data.length;
              }
              i.prototype.processChunk.call(this, t);
            }, n.exports = o;
          }, {
            "../utils": 32,
            "./GenericWorker": 28
          }],
          27: [function (t, n, e) {
            var r = t("../utils"),
              i = t("./GenericWorker");
            function o(t) {
              i.call(this, "DataWorker");
              var n = this;
              this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, t.then(function (t) {
                n.dataIsReady = !0, n.data = t, n.max = t && t.length || 0, n.type = r.getTypeOf(t), n.isPaused || n._tickAndRepeat();
              }, function (t) {
                n.error(t);
              });
            }
            r.inherits(o, i), o.prototype.cleanUp = function () {
              i.prototype.cleanUp.call(this), this.data = null;
            }, o.prototype.resume = function () {
              return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, r.delay(this._tickAndRepeat, [], this)), !0);
            }, o.prototype._tickAndRepeat = function () {
              this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (r.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
            }, o.prototype._tick = function () {
              if (this.isPaused || this.isFinished) return !1;
              var t = null,
                n = Math.min(this.max, this.index + 16384);
              if (this.index >= this.max) return this.end();
              switch (this.type) {
                case "string":
                  t = this.data.substring(this.index, n);
                  break;
                case "uint8array":
                  t = this.data.subarray(this.index, n);
                  break;
                case "array":
                case "nodebuffer":
                  t = this.data.slice(this.index, n);
              }
              return this.index = n, this.push({
                data: t,
                meta: {
                  percent: this.max ? this.index / this.max * 100 : 0
                }
              });
            }, n.exports = o;
          }, {
            "../utils": 32,
            "./GenericWorker": 28
          }],
          28: [function (t, n, e) {
            function r(t) {
              this.name = t || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
                data: [],
                end: [],
                error: []
              }, this.previous = null;
            }
            r.prototype = {
              push: function (t) {
                this.emit("data", t);
              },
              end: function () {
                if (this.isFinished) return !1;
                this.flush();
                try {
                  this.emit("end"), this.cleanUp(), this.isFinished = !0;
                } catch (t) {
                  this.emit("error", t);
                }
                return !0;
              },
              error: function (t) {
                return !this.isFinished && (this.isPaused ? this.generatedError = t : (this.isFinished = !0, this.emit("error", t), this.previous && this.previous.error(t), this.cleanUp()), !0);
              },
              on: function (t, n) {
                return this._listeners[t].push(n), this;
              },
              cleanUp: function () {
                this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
              },
              emit: function (t, n) {
                if (this._listeners[t]) for (var e = 0; e < this._listeners[t].length; e++) this._listeners[t][e].call(this, n);
              },
              pipe: function (t) {
                return t.registerPrevious(this);
              },
              registerPrevious: function (t) {
                if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                this.streamInfo = t.streamInfo, this.mergeStreamInfo(), this.previous = t;
                var n = this;
                return t.on("data", function (t) {
                  n.processChunk(t);
                }), t.on("end", function () {
                  n.end();
                }), t.on("error", function (t) {
                  n.error(t);
                }), this;
              },
              pause: function () {
                return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
              },
              resume: function () {
                if (!this.isPaused || this.isFinished) return !1;
                var t = this.isPaused = !1;
                return this.generatedError && (this.error(this.generatedError), t = !0), this.previous && this.previous.resume(), !t;
              },
              flush: function () {},
              processChunk: function (t) {
                this.push(t);
              },
              withStreamInfo: function (t, n) {
                return this.extraStreamInfo[t] = n, this.mergeStreamInfo(), this;
              },
              mergeStreamInfo: function () {
                for (var t in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(t) && (this.streamInfo[t] = this.extraStreamInfo[t]);
              },
              lock: function () {
                if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                this.isLocked = !0, this.previous && this.previous.lock();
              },
              toString: function () {
                var t = "Worker " + this.name;
                return this.previous ? this.previous + " -> " + t : t;
              }
            }, n.exports = r;
          }, {}],
          29: [function (t, n, e) {
            var r = t("../utils"),
              i = t("./ConvertWorker"),
              o = t("./GenericWorker"),
              s = t("../base64"),
              a = t("../support"),
              u = t("../external"),
              c = null;
            if (a.nodestream) try {
              c = t("../nodejs/NodejsStreamOutputAdapter");
            } catch (t) {}
            function f(t, n) {
              return new u.Promise(function (e, i) {
                var o = [],
                  a = t._internalType,
                  u = t._outputType,
                  c = t._mimeType;
                t.on("data", function (t, e) {
                  o.push(t), n && n(e);
                }).on("error", function (t) {
                  o = [], i(t);
                }).on("end", function () {
                  try {
                    var t = function (t, n, e) {
                      switch (t) {
                        case "blob":
                          return r.newBlob(r.transformTo("arraybuffer", n), e);
                        case "base64":
                          return s.encode(n);
                        default:
                          return r.transformTo(t, n);
                      }
                    }(u, function (t, n) {
                      var e,
                        r = 0,
                        i = null,
                        o = 0;
                      for (e = 0; e < n.length; e++) o += n[e].length;
                      switch (t) {
                        case "string":
                          return n.join("");
                        case "array":
                          return Array.prototype.concat.apply([], n);
                        case "uint8array":
                          for (i = new Uint8Array(o), e = 0; e < n.length; e++) i.set(n[e], r), r += n[e].length;
                          return i;
                        case "nodebuffer":
                          return Buffer.concat(n);
                        default:
                          throw new Error("concat : unsupported type '" + t + "'");
                      }
                    }(a, o), c);
                    e(t);
                  } catch (t) {
                    i(t);
                  }
                  o = [];
                }).resume();
              });
            }
            function l(t, n, e) {
              var s = n;
              switch (n) {
                case "blob":
                case "arraybuffer":
                  s = "uint8array";
                  break;
                case "base64":
                  s = "string";
              }
              try {
                this._internalType = s, this._outputType = n, this._mimeType = e, r.checkSupport(s), this._worker = t.pipe(new i(s)), t.lock();
              } catch (t) {
                this._worker = new o("error"), this._worker.error(t);
              }
            }
            l.prototype = {
              accumulate: function (t) {
                return f(this, t);
              },
              on: function (t, n) {
                var e = this;
                return "data" === t ? this._worker.on(t, function (t) {
                  n.call(e, t.data, t.meta);
                }) : this._worker.on(t, function () {
                  r.delay(n, arguments, e);
                }), this;
              },
              resume: function () {
                return r.delay(this._worker.resume, [], this._worker), this;
              },
              pause: function () {
                return this._worker.pause(), this;
              },
              toNodejsStream: function (t) {
                if (r.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
                return new c(this, {
                  objectMode: "nodebuffer" !== this._outputType
                }, t);
              }
            }, n.exports = l;
          }, {
            "../base64": 1,
            "../external": 6,
            "../nodejs/NodejsStreamOutputAdapter": 13,
            "../support": 30,
            "../utils": 32,
            "./ConvertWorker": 24,
            "./GenericWorker": 28
          }],
          30: [function (t, n, e) {
            if (e.base64 = !0, e.array = !0, e.string = !0, e.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, e.nodebuffer = "undefined" != typeof Buffer, e.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) e.blob = !1;else {
              var r = new ArrayBuffer(0);
              try {
                e.blob = 0 === new Blob([r], {
                  type: "application/zip"
                }).size;
              } catch (t) {
                try {
                  var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                  i.append(r), e.blob = 0 === i.getBlob("application/zip").size;
                } catch (t) {
                  e.blob = !1;
                }
              }
            }
            try {
              e.nodestream = !!t("readable-stream").Readable;
            } catch (t) {
              e.nodestream = !1;
            }
          }, {
            "readable-stream": 16
          }],
          31: [function (t, n, e) {
            for (var r = t("./utils"), i = t("./support"), o = t("./nodejsUtils"), s = t("./stream/GenericWorker"), a = new Array(256), u = 0; u < 256; u++) a[u] = 252 <= u ? 6 : 248 <= u ? 5 : 240 <= u ? 4 : 224 <= u ? 3 : 192 <= u ? 2 : 1;
            function c() {
              s.call(this, "utf-8 decode"), this.leftOver = null;
            }
            function f() {
              s.call(this, "utf-8 encode");
            }
            a[254] = a[254] = 1, e.utf8encode = function (t) {
              return i.nodebuffer ? o.newBufferFrom(t, "utf-8") : function (t) {
                var n,
                  e,
                  r,
                  o,
                  s,
                  a = t.length,
                  u = 0;
                for (o = 0; o < a; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (r = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++), u += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
                for (n = i.uint8array ? new Uint8Array(u) : new Array(u), o = s = 0; s < u; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (r = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++), e < 128 ? n[s++] = e : (e < 2048 ? n[s++] = 192 | e >>> 6 : (e < 65536 ? n[s++] = 224 | e >>> 12 : (n[s++] = 240 | e >>> 18, n[s++] = 128 | e >>> 12 & 63), n[s++] = 128 | e >>> 6 & 63), n[s++] = 128 | 63 & e);
                return n;
              }(t);
            }, e.utf8decode = function (t) {
              return i.nodebuffer ? r.transformTo("nodebuffer", t).toString("utf-8") : function (t) {
                var n,
                  e,
                  i,
                  o,
                  s = t.length,
                  u = new Array(2 * s);
                for (n = e = 0; n < s;) if ((i = t[n++]) < 128) u[e++] = i;else if (4 < (o = a[i])) u[e++] = 65533, n += o - 1;else {
                  for (i &= 2 === o ? 31 : 3 === o ? 15 : 7; 1 < o && n < s;) i = i << 6 | 63 & t[n++], o--;
                  1 < o ? u[e++] = 65533 : i < 65536 ? u[e++] = i : (i -= 65536, u[e++] = 55296 | i >> 10 & 1023, u[e++] = 56320 | 1023 & i);
                }
                return u.length !== e && (u.subarray ? u = u.subarray(0, e) : u.length = e), r.applyFromCharCode(u);
              }(t = r.transformTo(i.uint8array ? "uint8array" : "array", t));
            }, r.inherits(c, s), c.prototype.processChunk = function (t) {
              var n = r.transformTo(i.uint8array ? "uint8array" : "array", t.data);
              if (this.leftOver && this.leftOver.length) {
                if (i.uint8array) {
                  var o = n;
                  (n = new Uint8Array(o.length + this.leftOver.length)).set(this.leftOver, 0), n.set(o, this.leftOver.length);
                } else n = this.leftOver.concat(n);
                this.leftOver = null;
              }
              var s = function (t, n) {
                  var e;
                  for ((n = n || t.length) > t.length && (n = t.length), e = n - 1; 0 <= e && 128 == (192 & t[e]);) e--;
                  return e < 0 || 0 === e ? n : e + a[t[e]] > n ? e : n;
                }(n),
                u = n;
              s !== n.length && (i.uint8array ? (u = n.subarray(0, s), this.leftOver = n.subarray(s, n.length)) : (u = n.slice(0, s), this.leftOver = n.slice(s, n.length))), this.push({
                data: e.utf8decode(u),
                meta: t.meta
              });
            }, c.prototype.flush = function () {
              this.leftOver && this.leftOver.length && (this.push({
                data: e.utf8decode(this.leftOver),
                meta: {}
              }), this.leftOver = null);
            }, e.Utf8DecodeWorker = c, r.inherits(f, s), f.prototype.processChunk = function (t) {
              this.push({
                data: e.utf8encode(t.data),
                meta: t.meta
              });
            }, e.Utf8EncodeWorker = f;
          }, {
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./support": 30,
            "./utils": 32
          }],
          32: [function (t, n, e) {
            var r = t("./support"),
              i = t("./base64"),
              o = t("./nodejsUtils"),
              s = t("set-immediate-shim"),
              a = t("./external");
            function u(t) {
              return t;
            }
            function c(t, n) {
              for (var e = 0; e < t.length; ++e) n[e] = 255 & t.charCodeAt(e);
              return n;
            }
            e.newBlob = function (t, n) {
              e.checkSupport("blob");
              try {
                return new Blob([t], {
                  type: n
                });
              } catch (e) {
                try {
                  var r = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                  return r.append(t), r.getBlob(n);
                } catch (t) {
                  throw new Error("Bug : can't construct the Blob.");
                }
              }
            };
            var f = {
              stringifyByChunk: function (t, n, e) {
                var r = [],
                  i = 0,
                  o = t.length;
                if (o <= e) return String.fromCharCode.apply(null, t);
                for (; i < o;) "array" === n || "nodebuffer" === n ? r.push(String.fromCharCode.apply(null, t.slice(i, Math.min(i + e, o)))) : r.push(String.fromCharCode.apply(null, t.subarray(i, Math.min(i + e, o)))), i += e;
                return r.join("");
              },
              stringifyByChar: function (t) {
                for (var n = "", e = 0; e < t.length; e++) n += String.fromCharCode(t[e]);
                return n;
              },
              applyCanBeUsed: {
                uint8array: function () {
                  try {
                    return r.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
                  } catch (t) {
                    return !1;
                  }
                }(),
                nodebuffer: function () {
                  try {
                    return r.nodebuffer && 1 === String.fromCharCode.apply(null, o.allocBuffer(1)).length;
                  } catch (t) {
                    return !1;
                  }
                }()
              }
            };
            function l(t) {
              var n = 65536,
                r = e.getTypeOf(t),
                i = !0;
              if ("uint8array" === r ? i = f.applyCanBeUsed.uint8array : "nodebuffer" === r && (i = f.applyCanBeUsed.nodebuffer), i) for (; 1 < n;) try {
                return f.stringifyByChunk(t, r, n);
              } catch (t) {
                n = Math.floor(n / 2);
              }
              return f.stringifyByChar(t);
            }
            function h(t, n) {
              for (var e = 0; e < t.length; e++) n[e] = t[e];
              return n;
            }
            e.applyFromCharCode = l;
            var d = {};
            d.string = {
              string: u,
              array: function (t) {
                return c(t, new Array(t.length));
              },
              arraybuffer: function (t) {
                return d.string.uint8array(t).buffer;
              },
              uint8array: function (t) {
                return c(t, new Uint8Array(t.length));
              },
              nodebuffer: function (t) {
                return c(t, o.allocBuffer(t.length));
              }
            }, d.array = {
              string: l,
              array: u,
              arraybuffer: function (t) {
                return new Uint8Array(t).buffer;
              },
              uint8array: function (t) {
                return new Uint8Array(t);
              },
              nodebuffer: function (t) {
                return o.newBufferFrom(t);
              }
            }, d.arraybuffer = {
              string: function (t) {
                return l(new Uint8Array(t));
              },
              array: function (t) {
                return h(new Uint8Array(t), new Array(t.byteLength));
              },
              arraybuffer: u,
              uint8array: function (t) {
                return new Uint8Array(t);
              },
              nodebuffer: function (t) {
                return o.newBufferFrom(new Uint8Array(t));
              }
            }, d.uint8array = {
              string: l,
              array: function (t) {
                return h(t, new Array(t.length));
              },
              arraybuffer: function (t) {
                return t.buffer;
              },
              uint8array: u,
              nodebuffer: function (t) {
                return o.newBufferFrom(t);
              }
            }, d.nodebuffer = {
              string: l,
              array: function (t) {
                return h(t, new Array(t.length));
              },
              arraybuffer: function (t) {
                return d.nodebuffer.uint8array(t).buffer;
              },
              uint8array: function (t) {
                return h(t, new Uint8Array(t.length));
              },
              nodebuffer: u
            }, e.transformTo = function (t, n) {
              if (n = n || "", !t) return n;
              e.checkSupport(t);
              var r = e.getTypeOf(n);
              return d[r][t](n);
            }, e.getTypeOf = function (t) {
              return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : r.nodebuffer && o.isBuffer(t) ? "nodebuffer" : r.uint8array && t instanceof Uint8Array ? "uint8array" : r.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : void 0;
            }, e.checkSupport = function (t) {
              if (!r[t.toLowerCase()]) throw new Error(t + " is not supported by this platform");
            }, e.MAX_VALUE_16BITS = 65535, e.MAX_VALUE_32BITS = -1, e.pretty = function (t) {
              var n,
                e,
                r = "";
              for (e = 0; e < (t || "").length; e++) r += "\\x" + ((n = t.charCodeAt(e)) < 16 ? "0" : "") + n.toString(16).toUpperCase();
              return r;
            }, e.delay = function (t, n, e) {
              s(function () {
                t.apply(e || null, n || []);
              });
            }, e.inherits = function (t, n) {
              function e() {}
              e.prototype = n.prototype, t.prototype = new e();
            }, e.extend = function () {
              var t,
                n,
                e = {};
              for (t = 0; t < arguments.length; t++) for (n in arguments[t]) arguments[t].hasOwnProperty(n) && void 0 === e[n] && (e[n] = arguments[t][n]);
              return e;
            }, e.prepareContent = function (t, n, o, s, u) {
              return a.Promise.resolve(n).then(function (t) {
                return r.blob && (t instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(t))) && "undefined" != typeof FileReader ? new a.Promise(function (n, e) {
                  var r = new FileReader();
                  r.onload = function (t) {
                    n(t.target.result);
                  }, r.onerror = function (t) {
                    e(t.target.error);
                  }, r.readAsArrayBuffer(t);
                }) : t;
              }).then(function (n) {
                var f = e.getTypeOf(n);
                return f ? ("arraybuffer" === f ? n = e.transformTo("uint8array", n) : "string" === f && (u ? n = i.decode(n) : o && !0 !== s && (n = function (t) {
                  return c(t, r.uint8array ? new Uint8Array(t.length) : new Array(t.length));
                }(n))), n) : a.Promise.reject(new Error("Can't read the data of '" + t + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
              });
            };
          }, {
            "./base64": 1,
            "./external": 6,
            "./nodejsUtils": 14,
            "./support": 30,
            "set-immediate-shim": 54
          }],
          33: [function (t, n, e) {
            var r = t("./reader/readerFor"),
              i = t("./utils"),
              o = t("./signature"),
              s = t("./zipEntry"),
              a = (t("./utf8"), t("./support"));
            function u(t) {
              this.files = [], this.loadOptions = t;
            }
            u.prototype = {
              checkSignature: function (t) {
                if (!this.reader.readAndCheckSignature(t)) {
                  this.reader.index -= 4;
                  var n = this.reader.readString(4);
                  throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(n) + ", expected " + i.pretty(t) + ")");
                }
              },
              isSignature: function (t, n) {
                var e = this.reader.index;
                this.reader.setIndex(t);
                var r = this.reader.readString(4) === n;
                return this.reader.setIndex(e), r;
              },
              readBlockEndOfCentral: function () {
                this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                var t = this.reader.readData(this.zipCommentLength),
                  n = a.uint8array ? "uint8array" : "array",
                  e = i.transformTo(n, t);
                this.zipComment = this.loadOptions.decodeFileName(e);
              },
              readBlockZip64EndOfCentral: function () {
                this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                for (var t, n, e, r = this.zip64EndOfCentralSize - 44; 0 < r;) t = this.reader.readInt(2), n = this.reader.readInt(4), e = this.reader.readData(n), this.zip64ExtensibleData[t] = {
                  id: t,
                  length: n,
                  value: e
                };
              },
              readBlockZip64EndOfCentralLocator: function () {
                if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
              },
              readLocalFiles: function () {
                var t, n;
                for (t = 0; t < this.files.length; t++) n = this.files[t], this.reader.setIndex(n.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), n.readLocalPart(this.reader), n.handleUTF8(), n.processAttributes();
              },
              readCentralDir: function () {
                var t;
                for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER);) (t = new s({
                  zip64: this.zip64
                }, this.loadOptions)).readCentralPart(this.reader), this.files.push(t);
                if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
              },
              readEndOfCentral: function () {
                var t = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
                if (t < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
                this.reader.setIndex(t);
                var n = t;
                if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
                  if (this.zip64 = !0, (t = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                  if (this.reader.setIndex(t), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                  this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
                }
                var e = this.centralDirOffset + this.centralDirSize;
                this.zip64 && (e += 20, e += 12 + this.zip64EndOfCentralSize);
                var r = n - e;
                if (0 < r) this.isSignature(n, o.CENTRAL_FILE_HEADER) || (this.reader.zero = r);else if (r < 0) throw new Error("Corrupted zip: missing " + Math.abs(r) + " bytes.");
              },
              prepareReader: function (t) {
                this.reader = r(t);
              },
              load: function (t) {
                this.prepareReader(t), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
              }
            }, n.exports = u;
          }, {
            "./reader/readerFor": 22,
            "./signature": 23,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntry": 34
          }],
          34: [function (t, n, e) {
            var r = t("./reader/readerFor"),
              i = t("./utils"),
              o = t("./compressedObject"),
              s = t("./crc32"),
              a = t("./utf8"),
              u = t("./compressions"),
              c = t("./support");
            function f(t, n) {
              this.options = t, this.loadOptions = n;
            }
            f.prototype = {
              isEncrypted: function () {
                return !(1 & ~this.bitFlag);
              },
              useUTF8: function () {
                return !(2048 & ~this.bitFlag);
              },
              readLocalPart: function (t) {
                var n, e;
                if (t.skip(22), this.fileNameLength = t.readInt(2), e = t.readInt(2), this.fileName = t.readData(this.fileNameLength), t.skip(e), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                if (null === (n = function (t) {
                  for (var n in u) if (u.hasOwnProperty(n) && u[n].magic === t) return u[n];
                  return null;
                }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
                this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, n, t.readData(this.compressedSize));
              },
              readCentralPart: function (t) {
                this.versionMadeBy = t.readInt(2), t.skip(2), this.bitFlag = t.readInt(2), this.compressionMethod = t.readString(2), this.date = t.readDate(), this.crc32 = t.readInt(4), this.compressedSize = t.readInt(4), this.uncompressedSize = t.readInt(4);
                var n = t.readInt(2);
                if (this.extraFieldsLength = t.readInt(2), this.fileCommentLength = t.readInt(2), this.diskNumberStart = t.readInt(2), this.internalFileAttributes = t.readInt(2), this.externalFileAttributes = t.readInt(4), this.localHeaderOffset = t.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                t.skip(n), this.readExtraFields(t), this.parseZIP64ExtraField(t), this.fileComment = t.readData(this.fileCommentLength);
              },
              processAttributes: function () {
                this.unixPermissions = null, this.dosPermissions = null;
                var t = this.versionMadeBy >> 8;
                this.dir = !!(16 & this.externalFileAttributes), 0 == t && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == t && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
              },
              parseZIP64ExtraField: function (t) {
                if (this.extraFields[1]) {
                  var n = r(this.extraFields[1].value);
                  this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = n.readInt(8)), this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = n.readInt(8)), this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = n.readInt(8)), this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = n.readInt(4));
                }
              },
              readExtraFields: function (t) {
                var n,
                  e,
                  r,
                  i = t.index + this.extraFieldsLength;
                for (this.extraFields || (this.extraFields = {}); t.index + 4 < i;) n = t.readInt(2), e = t.readInt(2), r = t.readData(e), this.extraFields[n] = {
                  id: n,
                  length: e,
                  value: r
                };
                t.setIndex(i);
              },
              handleUTF8: function () {
                var t = c.uint8array ? "uint8array" : "array";
                if (this.useUTF8()) this.fileNameStr = a.utf8decode(this.fileName), this.fileCommentStr = a.utf8decode(this.fileComment);else {
                  var n = this.findExtraFieldUnicodePath();
                  if (null !== n) this.fileNameStr = n;else {
                    var e = i.transformTo(t, this.fileName);
                    this.fileNameStr = this.loadOptions.decodeFileName(e);
                  }
                  var r = this.findExtraFieldUnicodeComment();
                  if (null !== r) this.fileCommentStr = r;else {
                    var o = i.transformTo(t, this.fileComment);
                    this.fileCommentStr = this.loadOptions.decodeFileName(o);
                  }
                }
              },
              findExtraFieldUnicodePath: function () {
                var t = this.extraFields[28789];
                if (t) {
                  var n = r(t.value);
                  return 1 !== n.readInt(1) || s(this.fileName) !== n.readInt(4) ? null : a.utf8decode(n.readData(t.length - 5));
                }
                return null;
              },
              findExtraFieldUnicodeComment: function () {
                var t = this.extraFields[25461];
                if (t) {
                  var n = r(t.value);
                  return 1 !== n.readInt(1) || s(this.fileComment) !== n.readInt(4) ? null : a.utf8decode(n.readData(t.length - 5));
                }
                return null;
              }
            }, n.exports = f;
          }, {
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./reader/readerFor": 22,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32
          }],
          35: [function (t, n, e) {
            function r(t, n, e) {
              this.name = t, this.dir = e.dir, this.date = e.date, this.comment = e.comment, this.unixPermissions = e.unixPermissions, this.dosPermissions = e.dosPermissions, this._data = n, this._dataBinary = e.binary, this.options = {
                compression: e.compression,
                compressionOptions: e.compressionOptions
              };
            }
            var i = t("./stream/StreamHelper"),
              o = t("./stream/DataWorker"),
              s = t("./utf8"),
              a = t("./compressedObject"),
              u = t("./stream/GenericWorker");
            r.prototype = {
              internalStream: function (t) {
                var n = null,
                  e = "string";
                try {
                  if (!t) throw new Error("No output type specified.");
                  var r = "string" === (e = t.toLowerCase()) || "text" === e;
                  "binarystring" !== e && "text" !== e || (e = "string"), n = this._decompressWorker();
                  var o = !this._dataBinary;
                  o && !r && (n = n.pipe(new s.Utf8EncodeWorker())), !o && r && (n = n.pipe(new s.Utf8DecodeWorker()));
                } catch (t) {
                  (n = new u("error")).error(t);
                }
                return new i(n, e, "");
              },
              async: function (t, n) {
                return this.internalStream(t).accumulate(n);
              },
              nodeStream: function (t, n) {
                return this.internalStream(t || "nodebuffer").toNodejsStream(n);
              },
              _compressWorker: function (t, n) {
                if (this._data instanceof a && this._data.compression.magic === t.magic) return this._data.getCompressedWorker();
                var e = this._decompressWorker();
                return this._dataBinary || (e = e.pipe(new s.Utf8EncodeWorker())), a.createWorkerFrom(e, t, n);
              },
              _decompressWorker: function () {
                return this._data instanceof a ? this._data.getContentWorker() : this._data instanceof u ? this._data : new o(this._data);
              }
            };
            for (var c = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], f = function () {
                throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
              }, l = 0; l < c.length; l++) r.prototype[c[l]] = f;
            n.exports = r;
          }, {
            "./compressedObject": 2,
            "./stream/DataWorker": 27,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31
          }],
          36: [function (t, n, r) {
            (function (t) {
              var e,
                r,
                i = t.MutationObserver || t.WebKitMutationObserver;
              if (i) {
                var o = 0,
                  s = new i(f),
                  a = t.document.createTextNode("");
                s.observe(a, {
                  characterData: !0
                }), e = function () {
                  a.data = o = ++o % 2;
                };
              } else if (t.setImmediate || void 0 === t.MessageChannel) e = "document" in t && "onreadystatechange" in t.document.createElement("script") ? function () {
                var n = t.document.createElement("script");
                n.onreadystatechange = function () {
                  f(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null;
                }, t.document.documentElement.appendChild(n);
              } : function () {
                setTimeout(f, 0);
              };else {
                var u = new t.MessageChannel();
                u.port1.onmessage = f, e = function () {
                  u.port2.postMessage(0);
                };
              }
              var c = [];
              function f() {
                var t, n;
                r = !0;
                for (var e = c.length; e;) {
                  for (n = c, c = [], t = -1; ++t < e;) n[t]();
                  e = c.length;
                }
                r = !1;
              }
              n.exports = function (t) {
                1 !== c.push(t) || r || e();
              };
            }).call(this, void 0 !== require.g ? require.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
          }, {}],
          37: [function (t, n, e) {
            var r = t("immediate");
            function i() {}
            var o = {},
              s = ["REJECTED"],
              a = ["FULFILLED"],
              u = ["PENDING"];
            function c(t) {
              if ("function" != typeof t) throw new TypeError("resolver must be a function");
              this.state = u, this.queue = [], this.outcome = void 0, t !== i && d(this, t);
            }
            function f(t, n, e) {
              this.promise = t, "function" == typeof n && (this.onFulfilled = n, this.callFulfilled = this.otherCallFulfilled), "function" == typeof e && (this.onRejected = e, this.callRejected = this.otherCallRejected);
            }
            function l(t, n, e) {
              r(function () {
                var r;
                try {
                  r = n(e);
                } catch (r) {
                  return o.reject(t, r);
                }
                r === t ? o.reject(t, new TypeError("Cannot resolve promise with itself")) : o.resolve(t, r);
              });
            }
            function h(t) {
              var n = t && t.then;
              if (t && ("object" == typeof t || "function" == typeof t) && "function" == typeof n) return function () {
                n.apply(t, arguments);
              };
            }
            function d(t, n) {
              var e = !1;
              function r(n) {
                e || (e = !0, o.reject(t, n));
              }
              function i(n) {
                e || (e = !0, o.resolve(t, n));
              }
              var s = _(function () {
                n(i, r);
              });
              "error" === s.status && r(s.value);
            }
            function _(t, n) {
              var e = {};
              try {
                e.value = t(n), e.status = "success";
              } catch (t) {
                e.status = "error", e.value = t;
              }
              return e;
            }
            (n.exports = c).prototype.finally = function (t) {
              if ("function" != typeof t) return this;
              var n = this.constructor;
              return this.then(function (e) {
                return n.resolve(t()).then(function () {
                  return e;
                });
              }, function (e) {
                return n.resolve(t()).then(function () {
                  throw e;
                });
              });
            }, c.prototype.catch = function (t) {
              return this.then(null, t);
            }, c.prototype.then = function (t, n) {
              if ("function" != typeof t && this.state === a || "function" != typeof n && this.state === s) return this;
              var e = new this.constructor(i);
              return this.state !== u ? l(e, this.state === a ? t : n, this.outcome) : this.queue.push(new f(e, t, n)), e;
            }, f.prototype.callFulfilled = function (t) {
              o.resolve(this.promise, t);
            }, f.prototype.otherCallFulfilled = function (t) {
              l(this.promise, this.onFulfilled, t);
            }, f.prototype.callRejected = function (t) {
              o.reject(this.promise, t);
            }, f.prototype.otherCallRejected = function (t) {
              l(this.promise, this.onRejected, t);
            }, o.resolve = function (t, n) {
              var e = _(h, n);
              if ("error" === e.status) return o.reject(t, e.value);
              var r = e.value;
              if (r) d(t, r);else {
                t.state = a, t.outcome = n;
                for (var i = -1, s = t.queue.length; ++i < s;) t.queue[i].callFulfilled(n);
              }
              return t;
            }, o.reject = function (t, n) {
              t.state = s, t.outcome = n;
              for (var e = -1, r = t.queue.length; ++e < r;) t.queue[e].callRejected(n);
              return t;
            }, c.resolve = function (t) {
              return t instanceof this ? t : o.resolve(new this(i), t);
            }, c.reject = function (t) {
              var n = new this(i);
              return o.reject(n, t);
            }, c.all = function (t) {
              var n = this;
              if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
              var e = t.length,
                r = !1;
              if (!e) return this.resolve([]);
              for (var s = new Array(e), a = 0, u = -1, c = new this(i); ++u < e;) f(t[u], u);
              return c;
              function f(t, i) {
                n.resolve(t).then(function (t) {
                  s[i] = t, ++a !== e || r || (r = !0, o.resolve(c, s));
                }, function (t) {
                  r || (r = !0, o.reject(c, t));
                });
              }
            }, c.race = function (t) {
              var n = this;
              if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
              var e = t.length,
                r = !1;
              if (!e) return this.resolve([]);
              for (var s = -1, a = new this(i), u; ++s < e;) u = t[s], n.resolve(u).then(function (t) {
                r || (r = !0, o.resolve(a, t));
              }, function (t) {
                r || (r = !0, o.reject(a, t));
              });
              return a;
            };
          }, {
            immediate: 36
          }],
          38: [function (t, n, e) {
            var r = {};
            (0, t("./lib/utils/common").assign)(r, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), n.exports = r;
          }, {
            "./lib/deflate": 39,
            "./lib/inflate": 40,
            "./lib/utils/common": 41,
            "./lib/zlib/constants": 44
          }],
          39: [function (t, n, e) {
            var r = t("./zlib/deflate"),
              i = t("./utils/common"),
              o = t("./utils/strings"),
              s = t("./zlib/messages"),
              a = t("./zlib/zstream"),
              u = Object.prototype.toString,
              c = 0,
              f = -1,
              l = 0,
              h = 8;
            function d(t) {
              if (!(this instanceof d)) return new d(t);
              this.options = i.assign({
                level: f,
                method: 8,
                chunkSize: 16384,
                windowBits: 15,
                memLevel: 8,
                strategy: 0,
                to: ""
              }, t || {});
              var n = this.options;
              n.raw && 0 < n.windowBits ? n.windowBits = -n.windowBits : n.gzip && 0 < n.windowBits && n.windowBits < 16 && (n.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;
              var e = r.deflateInit2(this.strm, n.level, n.method, n.windowBits, n.memLevel, n.strategy);
              if (0 !== e) throw new Error(s[e]);
              if (n.header && r.deflateSetHeader(this.strm, n.header), n.dictionary) {
                var c;
                if (c = "string" == typeof n.dictionary ? o.string2buf(n.dictionary) : "[object ArrayBuffer]" === u.call(n.dictionary) ? new Uint8Array(n.dictionary) : n.dictionary, 0 !== (e = r.deflateSetDictionary(this.strm, c))) throw new Error(s[e]);
                this._dict_set = !0;
              }
            }
            function _(t, n) {
              var e = new d(n);
              if (e.push(t, !0), e.err) throw e.msg || s[e.err];
              return e.result;
            }
            d.prototype.push = function (t, n) {
              var e,
                s,
                a = this.strm,
                c = this.options.chunkSize;
              if (this.ended) return !1;
              s = n === ~~n ? n : !0 === n ? 4 : 0, "string" == typeof t ? a.input = o.string2buf(t) : "[object ArrayBuffer]" === u.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;
              do {
                if (0 === a.avail_out && (a.output = new i.Buf8(c), a.next_out = 0, a.avail_out = c), 1 !== (e = r.deflate(a, s)) && 0 !== e) return this.onEnd(e), !(this.ended = !0);
                0 !== a.avail_out && (0 !== a.avail_in || 4 !== s && 2 !== s) || ("string" === this.options.to ? this.onData(o.buf2binstring(i.shrinkBuf(a.output, a.next_out))) : this.onData(i.shrinkBuf(a.output, a.next_out)));
              } while ((0 < a.avail_in || 0 === a.avail_out) && 1 !== e);
              return 4 === s ? (e = r.deflateEnd(this.strm), this.onEnd(e), this.ended = !0, 0 === e) : 2 !== s || (this.onEnd(0), !(a.avail_out = 0));
            }, d.prototype.onData = function (t) {
              this.chunks.push(t);
            }, d.prototype.onEnd = function (t) {
              0 === t && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
            }, e.Deflate = d, e.deflate = _, e.deflateRaw = function (t, n) {
              return (n = n || {}).raw = !0, _(t, n);
            }, e.gzip = function (t, n) {
              return (n = n || {}).gzip = !0, _(t, n);
            };
          }, {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/deflate": 46,
            "./zlib/messages": 51,
            "./zlib/zstream": 53
          }],
          40: [function (t, n, e) {
            var r = t("./zlib/inflate"),
              i = t("./utils/common"),
              o = t("./utils/strings"),
              s = t("./zlib/constants"),
              a = t("./zlib/messages"),
              u = t("./zlib/zstream"),
              c = t("./zlib/gzheader"),
              f = Object.prototype.toString;
            function l(t) {
              if (!(this instanceof l)) return new l(t);
              this.options = i.assign({
                chunkSize: 16384,
                windowBits: 0,
                to: ""
              }, t || {});
              var n = this.options;
              n.raw && 0 <= n.windowBits && n.windowBits < 16 && (n.windowBits = -n.windowBits, 0 === n.windowBits && (n.windowBits = -15)), !(0 <= n.windowBits && n.windowBits < 16) || t && t.windowBits || (n.windowBits += 32), 15 < n.windowBits && n.windowBits < 48 && !(15 & n.windowBits) && (n.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new u(), this.strm.avail_out = 0;
              var e = r.inflateInit2(this.strm, n.windowBits);
              if (e !== s.Z_OK) throw new Error(a[e]);
              this.header = new c(), r.inflateGetHeader(this.strm, this.header);
            }
            function h(t, n) {
              var e = new l(n);
              if (e.push(t, !0), e.err) throw e.msg || a[e.err];
              return e.result;
            }
            l.prototype.push = function (t, n) {
              var e,
                a,
                u,
                c,
                l,
                h,
                d = this.strm,
                _ = this.options.chunkSize,
                m = this.options.dictionary,
                p = !1;
              if (this.ended) return !1;
              a = n === ~~n ? n : !0 === n ? s.Z_FINISH : s.Z_NO_FLUSH, "string" == typeof t ? d.input = o.binstring2buf(t) : "[object ArrayBuffer]" === f.call(t) ? d.input = new Uint8Array(t) : d.input = t, d.next_in = 0, d.avail_in = d.input.length;
              do {
                if (0 === d.avail_out && (d.output = new i.Buf8(_), d.next_out = 0, d.avail_out = _), (e = r.inflate(d, s.Z_NO_FLUSH)) === s.Z_NEED_DICT && m && (h = "string" == typeof m ? o.string2buf(m) : "[object ArrayBuffer]" === f.call(m) ? new Uint8Array(m) : m, e = r.inflateSetDictionary(this.strm, h)), e === s.Z_BUF_ERROR && !0 === p && (e = s.Z_OK, p = !1), e !== s.Z_STREAM_END && e !== s.Z_OK) return this.onEnd(e), !(this.ended = !0);
                d.next_out && (0 !== d.avail_out && e !== s.Z_STREAM_END && (0 !== d.avail_in || a !== s.Z_FINISH && a !== s.Z_SYNC_FLUSH) || ("string" === this.options.to ? (u = o.utf8border(d.output, d.next_out), c = d.next_out - u, l = o.buf2string(d.output, u), d.next_out = c, d.avail_out = _ - c, c && i.arraySet(d.output, d.output, u, c, 0), this.onData(l)) : this.onData(i.shrinkBuf(d.output, d.next_out)))), 0 === d.avail_in && 0 === d.avail_out && (p = !0);
              } while ((0 < d.avail_in || 0 === d.avail_out) && e !== s.Z_STREAM_END);
              return e === s.Z_STREAM_END && (a = s.Z_FINISH), a === s.Z_FINISH ? (e = r.inflateEnd(this.strm), this.onEnd(e), this.ended = !0, e === s.Z_OK) : a !== s.Z_SYNC_FLUSH || (this.onEnd(s.Z_OK), !(d.avail_out = 0));
            }, l.prototype.onData = function (t) {
              this.chunks.push(t);
            }, l.prototype.onEnd = function (t) {
              t === s.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
            }, e.Inflate = l, e.inflate = h, e.inflateRaw = function (t, n) {
              return (n = n || {}).raw = !0, h(t, n);
            }, e.ungzip = h;
          }, {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/constants": 44,
            "./zlib/gzheader": 47,
            "./zlib/inflate": 49,
            "./zlib/messages": 51,
            "./zlib/zstream": 53
          }],
          41: [function (t, n, e) {
            var r = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            e.assign = function (t) {
              for (var n = Array.prototype.slice.call(arguments, 1); n.length;) {
                var e = n.shift();
                if (e) {
                  if ("object" != typeof e) throw new TypeError(e + "must be non-object");
                  for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
                }
              }
              return t;
            }, e.shrinkBuf = function (t, n) {
              return t.length === n ? t : t.subarray ? t.subarray(0, n) : (t.length = n, t);
            };
            var i = {
                arraySet: function (t, n, e, r, i) {
                  if (n.subarray && t.subarray) t.set(n.subarray(e, e + r), i);else for (var o = 0; o < r; o++) t[i + o] = n[e + o];
                },
                flattenChunks: function (t) {
                  var n, e, r, i, o, s;
                  for (n = r = 0, e = t.length; n < e; n++) r += t[n].length;
                  for (s = new Uint8Array(r), n = i = 0, e = t.length; n < e; n++) o = t[n], s.set(o, i), i += o.length;
                  return s;
                }
              },
              o = {
                arraySet: function (t, n, e, r, i) {
                  for (var o = 0; o < r; o++) t[i + o] = n[e + o];
                },
                flattenChunks: function (t) {
                  return [].concat.apply([], t);
                }
              };
            e.setTyped = function (t) {
              t ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, i)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, o));
            }, e.setTyped(r);
          }, {}],
          42: [function (t, n, e) {
            var r = t("./common"),
              i = !0,
              o = !0;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (t) {
              i = !1;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (t) {
              o = !1;
            }
            for (var s = new r.Buf8(256), a = 0; a < 256; a++) s[a] = 252 <= a ? 6 : 248 <= a ? 5 : 240 <= a ? 4 : 224 <= a ? 3 : 192 <= a ? 2 : 1;
            function u(t, n) {
              if (n < 65537 && (t.subarray && o || !t.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(t, n));
              for (var e = "", s = 0; s < n; s++) e += String.fromCharCode(t[s]);
              return e;
            }
            s[254] = s[254] = 1, e.string2buf = function (t) {
              var n,
                e,
                i,
                o,
                s,
                a = t.length,
                u = 0;
              for (o = 0; o < a; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (i = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (i - 56320), o++), u += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
              for (n = new r.Buf8(u), o = s = 0; s < u; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (i = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (i - 56320), o++), e < 128 ? n[s++] = e : (e < 2048 ? n[s++] = 192 | e >>> 6 : (e < 65536 ? n[s++] = 224 | e >>> 12 : (n[s++] = 240 | e >>> 18, n[s++] = 128 | e >>> 12 & 63), n[s++] = 128 | e >>> 6 & 63), n[s++] = 128 | 63 & e);
              return n;
            }, e.buf2binstring = function (t) {
              return u(t, t.length);
            }, e.binstring2buf = function (t) {
              for (var n = new r.Buf8(t.length), e = 0, i = n.length; e < i; e++) n[e] = t.charCodeAt(e);
              return n;
            }, e.buf2string = function (t, n) {
              var e,
                r,
                i,
                o,
                a = n || t.length,
                c = new Array(2 * a);
              for (e = r = 0; e < a;) if ((i = t[e++]) < 128) c[r++] = i;else if (4 < (o = s[i])) c[r++] = 65533, e += o - 1;else {
                for (i &= 2 === o ? 31 : 3 === o ? 15 : 7; 1 < o && e < a;) i = i << 6 | 63 & t[e++], o--;
                1 < o ? c[r++] = 65533 : i < 65536 ? c[r++] = i : (i -= 65536, c[r++] = 55296 | i >> 10 & 1023, c[r++] = 56320 | 1023 & i);
              }
              return u(c, r);
            }, e.utf8border = function (t, n) {
              var e;
              for ((n = n || t.length) > t.length && (n = t.length), e = n - 1; 0 <= e && 128 == (192 & t[e]);) e--;
              return e < 0 || 0 === e ? n : e + s[t[e]] > n ? e : n;
            };
          }, {
            "./common": 41
          }],
          43: [function (t, n, e) {
            n.exports = function (t, n, e, r) {
              for (var i = 65535 & t, o = t >>> 16 & 65535, s = 0; 0 !== e;) {
                for (e -= s = 2e3 < e ? 2e3 : e; o = o + (i = i + n[r++] | 0) | 0, --s;);
                i %= 65521, o %= 65521;
              }
              return i | o << 16;
            };
          }, {}],
          44: [function (t, n, e) {
            n.exports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8
            };
          }, {}],
          45: [function (t, n, e) {
            var r = function () {
              for (var t, n = [], e = 0; e < 256; e++) {
                t = e;
                for (var r = 0; r < 8; r++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                n[e] = t;
              }
              return n;
            }();
            n.exports = function (t, n, e, i) {
              var o = r,
                s = i + e;
              t ^= -1;
              for (var a = i; a < s; a++) t = t >>> 8 ^ o[255 & (t ^ n[a])];
              return ~t;
            };
          }, {}],
          46: [function (t, n, e) {
            var r,
              i = t("../utils/common"),
              o = t("./trees"),
              s = t("./adler32"),
              a = t("./crc32"),
              u = t("./messages"),
              c = 0,
              f = 4,
              l = 0,
              h = -2,
              d = -1,
              _ = 4,
              m = 2,
              p = 8,
              v = 9,
              w = 286,
              b = 30,
              y = 19,
              g = 573,
              k = 15,
              $ = 3,
              S = 258,
              E = 262,
              A = 42,
              I = 113,
              x = 1,
              P = 2,
              U = 3,
              R = 4;
            function B(t, n) {
              return t.msg = u[n], n;
            }
            function C(t) {
              return (t << 1) - (4 < t ? 9 : 0);
            }
            function D(t) {
              for (var n = t.length; 0 <= --n;) t[n] = 0;
            }
            function N(t) {
              var n = t.state,
                e = n.pending;
              e > t.avail_out && (e = t.avail_out), 0 !== e && (i.arraySet(t.output, n.pending_buf, n.pending_out, e, t.next_out), t.next_out += e, n.pending_out += e, t.total_out += e, t.avail_out -= e, n.pending -= e, 0 === n.pending && (n.pending_out = 0));
            }
            function T(t, n) {
              o._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, n), t.block_start = t.strstart, N(t.strm);
            }
            function q(t, n) {
              t.pending_buf[t.pending++] = n;
            }
            function F(t, n) {
              t.pending_buf[t.pending++] = n >>> 8 & 255, t.pending_buf[t.pending++] = 255 & n;
            }
            function O(t, n) {
              var e,
                r,
                i = t.max_chain_length,
                o = t.strstart,
                s = t.prev_length,
                a = t.nice_match,
                u = t.strstart > t.w_size - E ? t.strstart - (t.w_size - E) : 0,
                c = t.window,
                f = t.w_mask,
                l = t.prev,
                h = t.strstart + S,
                d = c[o + s - 1],
                _ = c[o + s];
              t.prev_length >= t.good_match && (i >>= 2), a > t.lookahead && (a = t.lookahead);
              do {
                if (c[(e = n) + s] === _ && c[e + s - 1] === d && c[e] === c[o] && c[++e] === c[o + 1]) {
                  o += 2, e++;
                  do {} while (c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && o < h);
                  if (r = S - (h - o), o = h - S, s < r) {
                    if (t.match_start = n, a <= (s = r)) break;
                    d = c[o + s - 1], _ = c[o + s];
                  }
                }
              } while ((n = l[n & f]) > u && 0 != --i);
              return s <= t.lookahead ? s : t.lookahead;
            }
            function z(t) {
              var n,
                e,
                r,
                o,
                u,
                c,
                f,
                l,
                h,
                d,
                _ = t.w_size;
              do {
                if (o = t.window_size - t.lookahead - t.strstart, t.strstart >= _ + (_ - E)) {
                  for (i.arraySet(t.window, t.window, _, _, 0), t.match_start -= _, t.strstart -= _, t.block_start -= _, n = e = t.hash_size; r = t.head[--n], t.head[n] = _ <= r ? r - _ : 0, --e;);
                  for (n = e = _; r = t.prev[--n], t.prev[n] = _ <= r ? r - _ : 0, --e;);
                  o += _;
                }
                if (0 === t.strm.avail_in) break;
                if (c = t.strm, f = t.window, l = t.strstart + t.lookahead, d = void 0, (h = o) < (d = c.avail_in) && (d = h), e = 0 === d ? 0 : (c.avail_in -= d, i.arraySet(f, c.input, c.next_in, d, l), 1 === c.state.wrap ? c.adler = s(c.adler, f, d, l) : 2 === c.state.wrap && (c.adler = a(c.adler, f, d, l)), c.next_in += d, c.total_in += d, d), t.lookahead += e, t.lookahead + t.insert >= 3) for (u = t.strstart - t.insert, t.ins_h = t.window[u], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[u + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[u + 3 - 1]) & t.hash_mask, t.prev[u & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = u, u++, t.insert--, !(t.lookahead + t.insert < 3)););
              } while (t.lookahead < E && 0 !== t.strm.avail_in);
            }
            function M(t, n) {
              for (var e, r;;) {
                if (t.lookahead < E) {
                  if (z(t), t.lookahead < E && 0 === n) return 1;
                  if (0 === t.lookahead) break;
                }
                if (e = 0, t.lookahead >= 3 && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== e && t.strstart - e <= t.w_size - E && (t.match_length = O(t, e)), t.match_length >= 3) {
                  if (r = o._tr_tally(t, t.strstart - t.match_start, t.match_length - 3), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= 3) {
                    for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, 0 != --t.match_length;);
                    t.strstart++;
                  } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                } else r = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
                if (r && (T(t, !1), 0 === t.strm.avail_out)) return 1;
              }
              return t.insert = t.strstart < 2 ? t.strstart : 2, 4 === n ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
            }
            function j(t, n) {
              for (var e, r, i;;) {
                if (t.lookahead < E) {
                  if (z(t), t.lookahead < E && 0 === n) return 1;
                  if (0 === t.lookahead) break;
                }
                if (e = 0, t.lookahead >= 3 && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = 2, 0 !== e && t.prev_length < t.max_lazy_match && t.strstart - e <= t.w_size - E && (t.match_length = O(t, e), t.match_length <= 5 && (1 === t.strategy || 3 === t.match_length && 4096 < t.strstart - t.match_start) && (t.match_length = 2)), t.prev_length >= 3 && t.match_length <= t.prev_length) {
                  for (i = t.strstart + t.lookahead - 3, r = o._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - 3), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= i && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 3 - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 != --t.prev_length;);
                  if (t.match_available = 0, t.match_length = 2, t.strstart++, r && (T(t, !1), 0 === t.strm.avail_out)) return 1;
                } else if (t.match_available) {
                  if ((r = o._tr_tally(t, 0, t.window[t.strstart - 1])) && T(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return 1;
                } else t.match_available = 1, t.strstart++, t.lookahead--;
              }
              return t.match_available && (r = o._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < 2 ? t.strstart : 2, 4 === n ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
            }
            function L(t, n, e, r, i) {
              this.good_length = t, this.max_lazy = n, this.nice_length = e, this.max_chain = r, this.func = i;
            }
            function W() {
              this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new i.Buf16(2 * g), this.dyn_dtree = new i.Buf16(122), this.bl_tree = new i.Buf16(78), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new i.Buf16(16), this.heap = new i.Buf16(573), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new i.Buf16(573), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
            }
            function G(t) {
              var n;
              return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = 2, (n = t.state).pending = 0, n.pending_out = 0, n.wrap < 0 && (n.wrap = -n.wrap), n.status = n.wrap ? A : I, t.adler = 2 === n.wrap ? 0 : 1, n.last_flush = 0, o._tr_init(n), 0) : B(t, h);
            }
            function Z(t) {
              var n = G(t);
              return 0 === n && function (t) {
                t.window_size = 2 * t.w_size, D(t.head), t.max_lazy_match = r[t.level].max_lazy, t.good_match = r[t.level].good_length, t.nice_match = r[t.level].nice_length, t.max_chain_length = r[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = 2, t.match_available = 0, t.ins_h = 0;
              }(t.state), n;
            }
            function H(t, n, e, r, o, s) {
              if (!t) return h;
              var a = 1;
              if (n === d && (n = 6), r < 0 ? (a = 0, r = -r) : 15 < r && (a = 2, r -= 16), o < 1 || 9 < o || 8 !== e || r < 8 || 15 < r || n < 0 || 9 < n || s < 0 || 4 < s) return B(t, h);
              8 === r && (r = 9);
              var u = new W();
              return (t.state = u).strm = t, u.wrap = a, u.gzhead = null, u.w_bits = r, u.w_size = 1 << u.w_bits, u.w_mask = u.w_size - 1, u.hash_bits = o + 7, u.hash_size = 1 << u.hash_bits, u.hash_mask = u.hash_size - 1, u.hash_shift = ~~((u.hash_bits + 3 - 1) / 3), u.window = new i.Buf8(2 * u.w_size), u.head = new i.Buf16(u.hash_size), u.prev = new i.Buf16(u.w_size), u.lit_bufsize = 1 << o + 6, u.pending_buf_size = 4 * u.lit_bufsize, u.pending_buf = new i.Buf8(u.pending_buf_size), u.d_buf = 1 * u.lit_bufsize, u.l_buf = 3 * u.lit_bufsize, u.level = n, u.strategy = s, u.method = e, Z(t);
            }
            r = [new L(0, 0, 0, 0, function (t, n) {
              var e = 65535;
              for (e > t.pending_buf_size - 5 && (e = t.pending_buf_size - 5);;) {
                if (t.lookahead <= 1) {
                  if (z(t), 0 === t.lookahead && 0 === n) return 1;
                  if (0 === t.lookahead) break;
                }
                t.strstart += t.lookahead, t.lookahead = 0;
                var r = t.block_start + e;
                if ((0 === t.strstart || t.strstart >= r) && (t.lookahead = t.strstart - r, t.strstart = r, T(t, !1), 0 === t.strm.avail_out)) return 1;
                if (t.strstart - t.block_start >= t.w_size - E && (T(t, !1), 0 === t.strm.avail_out)) return 1;
              }
              return t.insert = 0, 4 === n ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (T(t, !1), t.strm.avail_out), 1);
            }), new L(4, 4, 8, 4, M), new L(4, 5, 16, 8, M), new L(4, 6, 32, 32, M), new L(4, 4, 16, 16, j), new L(8, 16, 32, 32, j), new L(8, 16, 128, 128, j), new L(8, 32, 128, 256, j), new L(32, 128, 258, 1024, j), new L(32, 258, 258, 4096, j)], e.deflateInit = function (t, n) {
              return H(t, n, 8, 15, 8, 0);
            }, e.deflateInit2 = H, e.deflateReset = Z, e.deflateResetKeep = G, e.deflateSetHeader = function (t, n) {
              return t && t.state ? 2 !== t.state.wrap ? h : (t.state.gzhead = n, 0) : h;
            }, e.deflate = function (t, n) {
              var e, i, s, u;
              if (!t || !t.state || 5 < n || n < 0) return t ? B(t, h) : h;
              if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || 666 === i.status && 4 !== n) return B(t, 0 === t.avail_out ? -5 : h);
              if (i.strm = t, e = i.last_flush, i.last_flush = n, i.status === A) if (2 === i.wrap) t.adler = 0, q(i, 31), q(i, 139), q(i, 8), i.gzhead ? (q(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), q(i, 255 & i.gzhead.time), q(i, i.gzhead.time >> 8 & 255), q(i, i.gzhead.time >> 16 & 255), q(i, i.gzhead.time >> 24 & 255), q(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), q(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (q(i, 255 & i.gzhead.extra.length), q(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = a(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (q(i, 0), q(i, 0), q(i, 0), q(i, 0), q(i, 0), q(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), q(i, 3), i.status = I);else {
                var c = 8 + (i.w_bits - 8 << 4) << 8;
                c |= (2 <= i.strategy || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (c |= 32), c += 31 - c % 31, i.status = I, F(i, c), 0 !== i.strstart && (F(i, t.adler >>> 16), F(i, 65535 & t.adler)), t.adler = 1;
              }
              if (69 === i.status) if (i.gzhead.extra) {
                for (s = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), N(t), s = i.pending, i.pending !== i.pending_buf_size));) q(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
                i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);
              } else i.status = 73;
              if (73 === i.status) if (i.gzhead.name) {
                s = i.pending;
                do {
                  if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), N(t), s = i.pending, i.pending === i.pending_buf_size)) {
                    u = 1;
                    break;
                  }
                  u = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, q(i, u);
                } while (0 !== u);
                i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), 0 === u && (i.gzindex = 0, i.status = 91);
              } else i.status = 91;
              if (91 === i.status) if (i.gzhead.comment) {
                s = i.pending;
                do {
                  if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), N(t), s = i.pending, i.pending === i.pending_buf_size)) {
                    u = 1;
                    break;
                  }
                  u = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, q(i, u);
                } while (0 !== u);
                i.gzhead.hcrc && i.pending > s && (t.adler = a(t.adler, i.pending_buf, i.pending - s, s)), 0 === u && (i.status = 103);
              } else i.status = 103;
              if (103 === i.status && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && N(t), i.pending + 2 <= i.pending_buf_size && (q(i, 255 & t.adler), q(i, t.adler >> 8 & 255), t.adler = 0, i.status = I)) : i.status = I), 0 !== i.pending) {
                if (N(t), 0 === t.avail_out) return i.last_flush = -1, 0;
              } else if (0 === t.avail_in && C(n) <= C(e) && 4 !== n) return B(t, -5);
              if (666 === i.status && 0 !== t.avail_in) return B(t, -5);
              if (0 !== t.avail_in || 0 !== i.lookahead || 0 !== n && 666 !== i.status) {
                var f = 2 === i.strategy ? function (t, n) {
                  for (var e;;) {
                    if (0 === t.lookahead && (z(t), 0 === t.lookahead)) {
                      if (0 === n) return 1;
                      break;
                    }
                    if (t.match_length = 0, e = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, e && (T(t, !1), 0 === t.strm.avail_out)) return 1;
                  }
                  return t.insert = 0, 4 === n ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
                }(i, n) : 3 === i.strategy ? function (t, n) {
                  for (var e, r, i, s, a = t.window;;) {
                    if (t.lookahead <= S) {
                      if (z(t), t.lookahead <= S && 0 === n) return 1;
                      if (0 === t.lookahead) break;
                    }
                    if (t.match_length = 0, t.lookahead >= 3 && 0 < t.strstart && (r = a[i = t.strstart - 1]) === a[++i] && r === a[++i] && r === a[++i]) {
                      s = t.strstart + S;
                      do {} while (r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && i < s);
                      t.match_length = S - (s - i), t.match_length > t.lookahead && (t.match_length = t.lookahead);
                    }
                    if (t.match_length >= 3 ? (e = o._tr_tally(t, 1, t.match_length - 3), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (e = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), e && (T(t, !1), 0 === t.strm.avail_out)) return 1;
                  }
                  return t.insert = 0, 4 === n ? (T(t, !0), 0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1), 0 === t.strm.avail_out) ? 1 : 2;
                }(i, n) : r[i.level].func(i, n);
                if (3 !== f && 4 !== f || (i.status = 666), 1 === f || 3 === f) return 0 === t.avail_out && (i.last_flush = -1), 0;
                if (2 === f && (1 === n ? o._tr_align(i) : 5 !== n && (o._tr_stored_block(i, 0, 0, !1), 3 === n && (D(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), N(t), 0 === t.avail_out)) return i.last_flush = -1, 0;
              }
              return 4 !== n ? 0 : i.wrap <= 0 ? 1 : (2 === i.wrap ? (q(i, 255 & t.adler), q(i, t.adler >> 8 & 255), q(i, t.adler >> 16 & 255), q(i, t.adler >> 24 & 255), q(i, 255 & t.total_in), q(i, t.total_in >> 8 & 255), q(i, t.total_in >> 16 & 255), q(i, t.total_in >> 24 & 255)) : (F(i, t.adler >>> 16), F(i, 65535 & t.adler)), N(t), 0 < i.wrap && (i.wrap = -i.wrap), 0 !== i.pending ? 0 : 1);
            }, e.deflateEnd = function (t) {
              var n;
              return t && t.state ? (n = t.state.status) !== A && 69 !== n && 73 !== n && 91 !== n && 103 !== n && n !== I && 666 !== n ? B(t, h) : (t.state = null, n === I ? B(t, -3) : 0) : h;
            }, e.deflateSetDictionary = function (t, n) {
              var e,
                r,
                o,
                a,
                u,
                c,
                f,
                l,
                d = n.length;
              if (!t || !t.state) return h;
              if (2 === (a = (e = t.state).wrap) || 1 === a && e.status !== A || e.lookahead) return h;
              for (1 === a && (t.adler = s(t.adler, n, d, 0)), e.wrap = 0, d >= e.w_size && (0 === a && (D(e.head), e.strstart = 0, e.block_start = 0, e.insert = 0), l = new i.Buf8(e.w_size), i.arraySet(l, n, d - e.w_size, e.w_size, 0), n = l, d = e.w_size), u = t.avail_in, c = t.next_in, f = t.input, t.avail_in = d, t.next_in = 0, t.input = n, z(e); e.lookahead >= 3;) {
                for (r = e.strstart, o = e.lookahead - 2; e.ins_h = (e.ins_h << e.hash_shift ^ e.window[r + 3 - 1]) & e.hash_mask, e.prev[r & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = r, r++, --o;);
                e.strstart = r, e.lookahead = 2, z(e);
              }
              return e.strstart += e.lookahead, e.block_start = e.strstart, e.insert = e.lookahead, e.lookahead = 0, e.match_length = e.prev_length = 2, e.match_available = 0, t.next_in = c, t.input = f, t.avail_in = u, e.wrap = a, 0;
            }, e.deflateInfo = "pako deflate (from Nodeca project)";
          }, {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./messages": 51,
            "./trees": 52
          }],
          47: [function (t, n, e) {
            n.exports = function () {
              this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
            };
          }, {}],
          48: [function (t, n, e) {
            n.exports = function (t, n) {
              var e, r, i, o, s, a, u, c, f, l, h, d, _, m, p, v, w, b, y, g, k, $, S, E, A;
              e = t.state, r = t.next_in, E = t.input, i = r + (t.avail_in - 5), o = t.next_out, A = t.output, s = o - (n - t.avail_out), a = o + (t.avail_out - 257), u = e.dmax, c = e.wsize, f = e.whave, l = e.wnext, h = e.window, d = e.hold, _ = e.bits, m = e.lencode, p = e.distcode, v = (1 << e.lenbits) - 1, w = (1 << e.distbits) - 1;
              t: do {
                _ < 15 && (d += E[r++] << _, _ += 8, d += E[r++] << _, _ += 8), b = m[d & v];
                n: for (;;) {
                  if (d >>>= y = b >>> 24, _ -= y, 0 == (y = b >>> 16 & 255)) A[o++] = 65535 & b;else {
                    if (!(16 & y)) {
                      if (!(64 & y)) {
                        b = m[(65535 & b) + (d & (1 << y) - 1)];
                        continue n;
                      }
                      if (32 & y) {
                        e.mode = 12;
                        break t;
                      }
                      t.msg = "invalid literal/length code", e.mode = 30;
                      break t;
                    }
                    g = 65535 & b, (y &= 15) && (_ < y && (d += E[r++] << _, _ += 8), g += d & (1 << y) - 1, d >>>= y, _ -= y), _ < 15 && (d += E[r++] << _, _ += 8, d += E[r++] << _, _ += 8), b = p[d & w];
                    e: for (;;) {
                      if (d >>>= y = b >>> 24, _ -= y, !(16 & (y = b >>> 16 & 255))) {
                        if (!(64 & y)) {
                          b = p[(65535 & b) + (d & (1 << y) - 1)];
                          continue e;
                        }
                        t.msg = "invalid distance code", e.mode = 30;
                        break t;
                      }
                      if (k = 65535 & b, _ < (y &= 15) && (d += E[r++] << _, (_ += 8) < y && (d += E[r++] << _, _ += 8)), u < (k += d & (1 << y) - 1)) {
                        t.msg = "invalid distance too far back", e.mode = 30;
                        break t;
                      }
                      if (d >>>= y, _ -= y, (y = o - s) < k) {
                        if (f < (y = k - y) && e.sane) {
                          t.msg = "invalid distance too far back", e.mode = 30;
                          break t;
                        }
                        if (S = h, ($ = 0) === l) {
                          if ($ += c - y, y < g) {
                            for (g -= y; A[o++] = h[$++], --y;);
                            $ = o - k, S = A;
                          }
                        } else if (l < y) {
                          if ($ += c + l - y, (y -= l) < g) {
                            for (g -= y; A[o++] = h[$++], --y;);
                            if ($ = 0, l < g) {
                              for (g -= y = l; A[o++] = h[$++], --y;);
                              $ = o - k, S = A;
                            }
                          }
                        } else if ($ += l - y, y < g) {
                          for (g -= y; A[o++] = h[$++], --y;);
                          $ = o - k, S = A;
                        }
                        for (; 2 < g;) A[o++] = S[$++], A[o++] = S[$++], A[o++] = S[$++], g -= 3;
                        g && (A[o++] = S[$++], 1 < g && (A[o++] = S[$++]));
                      } else {
                        for ($ = o - k; A[o++] = A[$++], A[o++] = A[$++], A[o++] = A[$++], 2 < (g -= 3););
                        g && (A[o++] = A[$++], 1 < g && (A[o++] = A[$++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (r < i && o < a);
              r -= g = _ >> 3, d &= (1 << (_ -= g << 3)) - 1, t.next_in = r, t.next_out = o, t.avail_in = r < i ? i - r + 5 : 5 - (r - i), t.avail_out = o < a ? a - o + 257 : 257 - (o - a), e.hold = d, e.bits = _;
            };
          }, {}],
          49: [function (t, n, e) {
            var r = t("../utils/common"),
              i = t("./adler32"),
              o = t("./crc32"),
              s = t("./inffast"),
              a = t("./inftrees"),
              u = 1,
              c = 2,
              f = 0,
              l = -2,
              h = 1,
              d = 852,
              _ = 592;
            function m(t) {
              return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);
            }
            function p() {
              this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
            }
            function v(t) {
              var n;
              return t && t.state ? (n = t.state, t.total_in = t.total_out = n.total = 0, t.msg = "", n.wrap && (t.adler = 1 & n.wrap), n.mode = 1, n.last = 0, n.havedict = 0, n.dmax = 32768, n.head = null, n.hold = 0, n.bits = 0, n.lencode = n.lendyn = new r.Buf32(d), n.distcode = n.distdyn = new r.Buf32(_), n.sane = 1, n.back = -1, 0) : l;
            }
            function w(t) {
              var n;
              return t && t.state ? ((n = t.state).wsize = 0, n.whave = 0, n.wnext = 0, v(t)) : l;
            }
            function b(t, n) {
              var e, r;
              return t && t.state ? (r = t.state, n < 0 ? (e = 0, n = -n) : (e = 1 + (n >> 4), n < 48 && (n &= 15)), n && (n < 8 || 15 < n) ? l : (null !== r.window && r.wbits !== n && (r.window = null), r.wrap = e, r.wbits = n, w(t))) : l;
            }
            function y(t, n) {
              var e, r;
              return t ? (r = new p(), (t.state = r).window = null, 0 !== (e = b(t, n)) && (t.state = null), e) : l;
            }
            var g,
              k,
              $ = !0;
            function S(t) {
              if ($) {
                var n;
                for (g = new r.Buf32(512), k = new r.Buf32(32), n = 0; n < 144;) t.lens[n++] = 8;
                for (; n < 256;) t.lens[n++] = 9;
                for (; n < 280;) t.lens[n++] = 7;
                for (; n < 288;) t.lens[n++] = 8;
                for (a(1, t.lens, 0, 288, g, 0, t.work, {
                  bits: 9
                }), n = 0; n < 32;) t.lens[n++] = 5;
                a(2, t.lens, 0, 32, k, 0, t.work, {
                  bits: 5
                }), $ = !1;
              }
              t.lencode = g, t.lenbits = 9, t.distcode = k, t.distbits = 5;
            }
            function E(t, n, e, i) {
              var o,
                s = t.state;
              return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new r.Buf8(s.wsize)), i >= s.wsize ? (r.arraySet(s.window, n, e - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (i < (o = s.wsize - s.wnext) && (o = i), r.arraySet(s.window, n, e - i, o, s.wnext), (i -= o) ? (r.arraySet(s.window, n, e - i, i, 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += o, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += o))), 0;
            }
            e.inflateReset = w, e.inflateReset2 = b, e.inflateResetKeep = v, e.inflateInit = function (t) {
              return y(t, 15);
            }, e.inflateInit2 = y, e.inflate = function (t, n) {
              var e,
                u,
                c,
                f,
                h,
                d,
                _,
                p,
                v,
                w,
                b,
                y,
                g,
                k,
                $,
                A,
                I,
                x,
                P,
                U,
                R,
                B,
                C,
                D,
                N = 0,
                T = new r.Buf8(4),
                q = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
              if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return l;
              12 === (e = t.state).mode && (e.mode = 13), h = t.next_out, c = t.output, _ = t.avail_out, f = t.next_in, u = t.input, d = t.avail_in, p = e.hold, v = e.bits, w = d, b = _, B = 0;
              t: for (;;) switch (e.mode) {
                case 1:
                  if (0 === e.wrap) {
                    e.mode = 13;
                    break;
                  }
                  for (; v < 16;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if (2 & e.wrap && 35615 === p) {
                    T[e.check = 0] = 255 & p, T[1] = p >>> 8 & 255, e.check = o(e.check, T, 2, 0), v = p = 0, e.mode = 2;
                    break;
                  }
                  if (e.flags = 0, e.head && (e.head.done = !1), !(1 & e.wrap) || (((255 & p) << 8) + (p >> 8)) % 31) {
                    t.msg = "incorrect header check", e.mode = 30;
                    break;
                  }
                  if (8 != (15 & p)) {
                    t.msg = "unknown compression method", e.mode = 30;
                    break;
                  }
                  if (v -= 4, R = 8 + (15 & (p >>>= 4)), 0 === e.wbits) e.wbits = R;else if (R > e.wbits) {
                    t.msg = "invalid window size", e.mode = 30;
                    break;
                  }
                  e.dmax = 1 << R, t.adler = e.check = 1, e.mode = 512 & p ? 10 : 12, v = p = 0;
                  break;
                case 2:
                  for (; v < 16;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if (e.flags = p, 8 != (255 & e.flags)) {
                    t.msg = "unknown compression method", e.mode = 30;
                    break;
                  }
                  if (57344 & e.flags) {
                    t.msg = "unknown header flags set", e.mode = 30;
                    break;
                  }
                  e.head && (e.head.text = p >> 8 & 1), 512 & e.flags && (T[0] = 255 & p, T[1] = p >>> 8 & 255, e.check = o(e.check, T, 2, 0)), v = p = 0, e.mode = 3;
                case 3:
                  for (; v < 32;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  e.head && (e.head.time = p), 512 & e.flags && (T[0] = 255 & p, T[1] = p >>> 8 & 255, T[2] = p >>> 16 & 255, T[3] = p >>> 24 & 255, e.check = o(e.check, T, 4, 0)), v = p = 0, e.mode = 4;
                case 4:
                  for (; v < 16;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  e.head && (e.head.xflags = 255 & p, e.head.os = p >> 8), 512 & e.flags && (T[0] = 255 & p, T[1] = p >>> 8 & 255, e.check = o(e.check, T, 2, 0)), v = p = 0, e.mode = 5;
                case 5:
                  if (1024 & e.flags) {
                    for (; v < 16;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    e.length = p, e.head && (e.head.extra_len = p), 512 & e.flags && (T[0] = 255 & p, T[1] = p >>> 8 & 255, e.check = o(e.check, T, 2, 0)), v = p = 0;
                  } else e.head && (e.head.extra = null);
                  e.mode = 6;
                case 6:
                  if (1024 & e.flags && (d < (y = e.length) && (y = d), y && (e.head && (R = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Array(e.head.extra_len)), r.arraySet(e.head.extra, u, f, y, R)), 512 & e.flags && (e.check = o(e.check, u, y, f)), d -= y, f += y, e.length -= y), e.length)) break t;
                  e.length = 0, e.mode = 7;
                case 7:
                  if (2048 & e.flags) {
                    if (0 === d) break t;
                    for (y = 0; R = u[f + y++], e.head && R && e.length < 65536 && (e.head.name += String.fromCharCode(R)), R && y < d;);
                    if (512 & e.flags && (e.check = o(e.check, u, y, f)), d -= y, f += y, R) break t;
                  } else e.head && (e.head.name = null);
                  e.length = 0, e.mode = 8;
                case 8:
                  if (4096 & e.flags) {
                    if (0 === d) break t;
                    for (y = 0; R = u[f + y++], e.head && R && e.length < 65536 && (e.head.comment += String.fromCharCode(R)), R && y < d;);
                    if (512 & e.flags && (e.check = o(e.check, u, y, f)), d -= y, f += y, R) break t;
                  } else e.head && (e.head.comment = null);
                  e.mode = 9;
                case 9:
                  if (512 & e.flags) {
                    for (; v < 16;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    if (p !== (65535 & e.check)) {
                      t.msg = "header crc mismatch", e.mode = 30;
                      break;
                    }
                    v = p = 0;
                  }
                  e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), t.adler = e.check = 0, e.mode = 12;
                  break;
                case 10:
                  for (; v < 32;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  t.adler = e.check = m(p), v = p = 0, e.mode = 11;
                case 11:
                  if (0 === e.havedict) return t.next_out = h, t.avail_out = _, t.next_in = f, t.avail_in = d, e.hold = p, e.bits = v, 2;
                  t.adler = e.check = 1, e.mode = 12;
                case 12:
                  if (5 === n || 6 === n) break t;
                case 13:
                  if (e.last) {
                    p >>>= 7 & v, v -= 7 & v, e.mode = 27;
                    break;
                  }
                  for (; v < 3;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  switch (e.last = 1 & p, v -= 1, 3 & (p >>>= 1)) {
                    case 0:
                      e.mode = 14;
                      break;
                    case 1:
                      if (S(e), e.mode = 20, 6 !== n) break;
                      p >>>= 2, v -= 2;
                      break t;
                    case 2:
                      e.mode = 17;
                      break;
                    case 3:
                      t.msg = "invalid block type", e.mode = 30;
                  }
                  p >>>= 2, v -= 2;
                  break;
                case 14:
                  for (p >>>= 7 & v, v -= 7 & v; v < 32;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if ((65535 & p) != (p >>> 16 ^ 65535)) {
                    t.msg = "invalid stored block lengths", e.mode = 30;
                    break;
                  }
                  if (e.length = 65535 & p, v = p = 0, e.mode = 15, 6 === n) break t;
                case 15:
                  e.mode = 16;
                case 16:
                  if (y = e.length) {
                    if (d < y && (y = d), _ < y && (y = _), 0 === y) break t;
                    r.arraySet(c, u, f, y, h), d -= y, f += y, _ -= y, h += y, e.length -= y;
                    break;
                  }
                  e.mode = 12;
                  break;
                case 17:
                  for (; v < 14;) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if (e.nlen = 257 + (31 & p), p >>>= 5, v -= 5, e.ndist = 1 + (31 & p), p >>>= 5, v -= 5, e.ncode = 4 + (15 & p), p >>>= 4, v -= 4, 286 < e.nlen || 30 < e.ndist) {
                    t.msg = "too many length or distance symbols", e.mode = 30;
                    break;
                  }
                  e.have = 0, e.mode = 18;
                case 18:
                  for (; e.have < e.ncode;) {
                    for (; v < 3;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    e.lens[q[e.have++]] = 7 & p, p >>>= 3, v -= 3;
                  }
                  for (; e.have < 19;) e.lens[q[e.have++]] = 0;
                  if (e.lencode = e.lendyn, e.lenbits = 7, C = {
                    bits: e.lenbits
                  }, B = a(0, e.lens, 0, 19, e.lencode, 0, e.work, C), e.lenbits = C.bits, B) {
                    t.msg = "invalid code lengths set", e.mode = 30;
                    break;
                  }
                  e.have = 0, e.mode = 19;
                case 19:
                  for (; e.have < e.nlen + e.ndist;) {
                    for (; A = (N = e.lencode[p & (1 << e.lenbits) - 1]) >>> 16 & 255, I = 65535 & N, !(($ = N >>> 24) <= v);) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    if (I < 16) p >>>= $, v -= $, e.lens[e.have++] = I;else {
                      if (16 === I) {
                        for (D = $ + 2; v < D;) {
                          if (0 === d) break t;
                          d--, p += u[f++] << v, v += 8;
                        }
                        if (p >>>= $, v -= $, 0 === e.have) {
                          t.msg = "invalid bit length repeat", e.mode = 30;
                          break;
                        }
                        R = e.lens[e.have - 1], y = 3 + (3 & p), p >>>= 2, v -= 2;
                      } else if (17 === I) {
                        for (D = $ + 3; v < D;) {
                          if (0 === d) break t;
                          d--, p += u[f++] << v, v += 8;
                        }
                        v -= $, R = 0, y = 3 + (7 & (p >>>= $)), p >>>= 3, v -= 3;
                      } else {
                        for (D = $ + 7; v < D;) {
                          if (0 === d) break t;
                          d--, p += u[f++] << v, v += 8;
                        }
                        v -= $, R = 0, y = 11 + (127 & (p >>>= $)), p >>>= 7, v -= 7;
                      }
                      if (e.have + y > e.nlen + e.ndist) {
                        t.msg = "invalid bit length repeat", e.mode = 30;
                        break;
                      }
                      for (; y--;) e.lens[e.have++] = R;
                    }
                  }
                  if (30 === e.mode) break;
                  if (0 === e.lens[256]) {
                    t.msg = "invalid code -- missing end-of-block", e.mode = 30;
                    break;
                  }
                  if (e.lenbits = 9, C = {
                    bits: e.lenbits
                  }, B = a(1, e.lens, 0, e.nlen, e.lencode, 0, e.work, C), e.lenbits = C.bits, B) {
                    t.msg = "invalid literal/lengths set", e.mode = 30;
                    break;
                  }
                  if (e.distbits = 6, e.distcode = e.distdyn, C = {
                    bits: e.distbits
                  }, B = a(2, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, C), e.distbits = C.bits, B) {
                    t.msg = "invalid distances set", e.mode = 30;
                    break;
                  }
                  if (e.mode = 20, 6 === n) break t;
                case 20:
                  e.mode = 21;
                case 21:
                  if (6 <= d && 258 <= _) {
                    t.next_out = h, t.avail_out = _, t.next_in = f, t.avail_in = d, e.hold = p, e.bits = v, s(t, b), h = t.next_out, c = t.output, _ = t.avail_out, f = t.next_in, u = t.input, d = t.avail_in, p = e.hold, v = e.bits, 12 === e.mode && (e.back = -1);
                    break;
                  }
                  for (e.back = 0; A = (N = e.lencode[p & (1 << e.lenbits) - 1]) >>> 16 & 255, I = 65535 & N, !(($ = N >>> 24) <= v);) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if (A && !(240 & A)) {
                    for (x = $, P = A, U = I; A = (N = e.lencode[U + ((p & (1 << x + P) - 1) >> x)]) >>> 16 & 255, I = 65535 & N, !(x + ($ = N >>> 24) <= v);) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    p >>>= x, v -= x, e.back += x;
                  }
                  if (p >>>= $, v -= $, e.back += $, e.length = I, 0 === A) {
                    e.mode = 26;
                    break;
                  }
                  if (32 & A) {
                    e.back = -1, e.mode = 12;
                    break;
                  }
                  if (64 & A) {
                    t.msg = "invalid literal/length code", e.mode = 30;
                    break;
                  }
                  e.extra = 15 & A, e.mode = 22;
                case 22:
                  if (e.extra) {
                    for (D = e.extra; v < D;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    e.length += p & (1 << e.extra) - 1, p >>>= e.extra, v -= e.extra, e.back += e.extra;
                  }
                  e.was = e.length, e.mode = 23;
                case 23:
                  for (; A = (N = e.distcode[p & (1 << e.distbits) - 1]) >>> 16 & 255, I = 65535 & N, !(($ = N >>> 24) <= v);) {
                    if (0 === d) break t;
                    d--, p += u[f++] << v, v += 8;
                  }
                  if (!(240 & A)) {
                    for (x = $, P = A, U = I; A = (N = e.distcode[U + ((p & (1 << x + P) - 1) >> x)]) >>> 16 & 255, I = 65535 & N, !(x + ($ = N >>> 24) <= v);) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    p >>>= x, v -= x, e.back += x;
                  }
                  if (p >>>= $, v -= $, e.back += $, 64 & A) {
                    t.msg = "invalid distance code", e.mode = 30;
                    break;
                  }
                  e.offset = I, e.extra = 15 & A, e.mode = 24;
                case 24:
                  if (e.extra) {
                    for (D = e.extra; v < D;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    e.offset += p & (1 << e.extra) - 1, p >>>= e.extra, v -= e.extra, e.back += e.extra;
                  }
                  if (e.offset > e.dmax) {
                    t.msg = "invalid distance too far back", e.mode = 30;
                    break;
                  }
                  e.mode = 25;
                case 25:
                  if (0 === _) break t;
                  if (y = b - _, e.offset > y) {
                    if ((y = e.offset - y) > e.whave && e.sane) {
                      t.msg = "invalid distance too far back", e.mode = 30;
                      break;
                    }
                    g = y > e.wnext ? (y -= e.wnext, e.wsize - y) : e.wnext - y, y > e.length && (y = e.length), k = e.window;
                  } else k = c, g = h - e.offset, y = e.length;
                  for (_ < y && (y = _), _ -= y, e.length -= y; c[h++] = k[g++], --y;);
                  0 === e.length && (e.mode = 21);
                  break;
                case 26:
                  if (0 === _) break t;
                  c[h++] = e.length, _--, e.mode = 21;
                  break;
                case 27:
                  if (e.wrap) {
                    for (; v < 32;) {
                      if (0 === d) break t;
                      d--, p |= u[f++] << v, v += 8;
                    }
                    if (b -= _, t.total_out += b, e.total += b, b && (t.adler = e.check = e.flags ? o(e.check, c, b, h - b) : i(e.check, c, b, h - b)), b = _, (e.flags ? p : m(p)) !== e.check) {
                      t.msg = "incorrect data check", e.mode = 30;
                      break;
                    }
                    v = p = 0;
                  }
                  e.mode = 28;
                case 28:
                  if (e.wrap && e.flags) {
                    for (; v < 32;) {
                      if (0 === d) break t;
                      d--, p += u[f++] << v, v += 8;
                    }
                    if (p !== (4294967295 & e.total)) {
                      t.msg = "incorrect length check", e.mode = 30;
                      break;
                    }
                    v = p = 0;
                  }
                  e.mode = 29;
                case 29:
                  B = 1;
                  break t;
                case 30:
                  B = -3;
                  break t;
                case 31:
                  return -4;
                case 32:
                default:
                  return l;
              }
              return t.next_out = h, t.avail_out = _, t.next_in = f, t.avail_in = d, e.hold = p, e.bits = v, (e.wsize || b !== t.avail_out && e.mode < 30 && (e.mode < 27 || 4 !== n)) && E(t, t.output, t.next_out, b - t.avail_out) ? (e.mode = 31, -4) : (w -= t.avail_in, b -= t.avail_out, t.total_in += w, t.total_out += b, e.total += b, e.wrap && b && (t.adler = e.check = e.flags ? o(e.check, c, b, t.next_out - b) : i(e.check, c, b, t.next_out - b)), t.data_type = e.bits + (e.last ? 64 : 0) + (12 === e.mode ? 128 : 0) + (20 === e.mode || 15 === e.mode ? 256 : 0), (0 == w && 0 === b || 4 === n) && 0 === B && (B = -5), B);
            }, e.inflateEnd = function (t) {
              if (!t || !t.state) return l;
              var n = t.state;
              return n.window && (n.window = null), t.state = null, 0;
            }, e.inflateGetHeader = function (t, n) {
              var e;
              return t && t.state && 2 & (e = t.state).wrap ? ((e.head = n).done = !1, 0) : l;
            }, e.inflateSetDictionary = function (t, n) {
              var e,
                r = n.length;
              return t && t.state ? 0 !== (e = t.state).wrap && 11 !== e.mode ? l : 11 === e.mode && i(1, n, r, 0) !== e.check ? -3 : E(t, n, r, r) ? (e.mode = 31, -4) : (e.havedict = 1, 0) : l;
            }, e.inflateInfo = "pako inflate (from Nodeca project)";
          }, {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./inffast": 48,
            "./inftrees": 50
          }],
          50: [function (t, n, e) {
            var r = t("../utils/common"),
              i = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
              o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
              s = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
              a = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            n.exports = function (t, n, e, u, c, f, l, h) {
              var d,
                _,
                m,
                p,
                v,
                w,
                b,
                y,
                g,
                k = h.bits,
                $ = 0,
                S = 0,
                E = 0,
                A = 0,
                I = 0,
                x = 0,
                P = 0,
                U = 0,
                R = 0,
                B = 0,
                C = null,
                D = 0,
                N = new r.Buf16(16),
                T = new r.Buf16(16),
                q = null,
                F = 0;
              for ($ = 0; $ <= 15; $++) N[$] = 0;
              for (S = 0; S < u; S++) N[n[e + S]]++;
              for (I = k, A = 15; 1 <= A && 0 === N[A]; A--);
              if (A < I && (I = A), 0 === A) return c[f++] = 20971520, c[f++] = 20971520, h.bits = 1, 0;
              for (E = 1; E < A && 0 === N[E]; E++);
              for (I < E && (I = E), $ = U = 1; $ <= 15; $++) if (U <<= 1, (U -= N[$]) < 0) return -1;
              if (0 < U && (0 === t || 1 !== A)) return -1;
              for (T[1] = 0, $ = 1; $ < 15; $++) T[$ + 1] = T[$] + N[$];
              for (S = 0; S < u; S++) 0 !== n[e + S] && (l[T[n[e + S]]++] = S);
              if (w = 0 === t ? (C = q = l, 19) : 1 === t ? (C = i, D -= 257, q = o, F -= 257, 256) : (C = s, q = a, -1), $ = E, v = f, P = S = B = 0, m = -1, p = (R = 1 << (x = I)) - 1, 1 === t && 852 < R || 2 === t && 592 < R) return 1;
              for (;;) {
                for (b = $ - P, g = l[S] < w ? (y = 0, l[S]) : l[S] > w ? (y = q[F + l[S]], C[D + l[S]]) : (y = 96, 0), d = 1 << $ - P, E = _ = 1 << x; c[v + (B >> P) + (_ -= d)] = b << 24 | y << 16 | g, 0 !== _;);
                for (d = 1 << $ - 1; B & d;) d >>= 1;
                if (0 !== d ? (B &= d - 1, B += d) : B = 0, S++, 0 == --N[$]) {
                  if ($ === A) break;
                  $ = n[e + l[S]];
                }
                if (I < $ && (B & p) !== m) {
                  for (0 === P && (P = I), v += E, U = 1 << (x = $ - P); x + P < A && !((U -= N[x + P]) <= 0);) x++, U <<= 1;
                  if (R += 1 << x, 1 === t && 852 < R || 2 === t && 592 < R) return 1;
                  c[m = B & p] = I << 24 | x << 16 | v - f;
                }
              }
              return 0 !== B && (c[v + B] = $ - P << 24 | 64 << 16), h.bits = I, 0;
            };
          }, {
            "../utils/common": 41
          }],
          51: [function (t, n, e) {
            n.exports = {
              2: "need dictionary",
              1: "stream end",
              0: "",
              "-1": "file error",
              "-2": "stream error",
              "-3": "data error",
              "-4": "insufficient memory",
              "-5": "buffer error",
              "-6": "incompatible version"
            };
          }, {}],
          52: [function (t, n, e) {
            var r = t("../utils/common"),
              i = 0,
              o = 1;
            function s(t) {
              for (var n = t.length; 0 <= --n;) t[n] = 0;
            }
            var a = 0,
              u = 29,
              c = 256,
              f = 286,
              l = 30,
              h = 19,
              d = 573,
              _ = 15,
              m = 16,
              p = 7,
              v = 256,
              w = 16,
              b = 17,
              y = 18,
              g = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
              k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
              $ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
              S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
              E = new Array(576);
            s(E);
            var A = new Array(60);
            s(A);
            var I = new Array(512);
            s(I);
            var x = new Array(256);
            s(x);
            var P = new Array(u);
            s(P);
            var U,
              R,
              B,
              C = new Array(l);
            function D(t, n, e, r, i) {
              this.static_tree = t, this.extra_bits = n, this.extra_base = e, this.elems = r, this.max_length = i, this.has_stree = t && t.length;
            }
            function N(t, n) {
              this.dyn_tree = t, this.max_code = 0, this.stat_desc = n;
            }
            function T(t) {
              return t < 256 ? I[t] : I[256 + (t >>> 7)];
            }
            function q(t, n) {
              t.pending_buf[t.pending++] = 255 & n, t.pending_buf[t.pending++] = n >>> 8 & 255;
            }
            function F(t, n, e) {
              t.bi_valid > m - e ? (t.bi_buf |= n << t.bi_valid & 65535, q(t, t.bi_buf), t.bi_buf = n >> m - t.bi_valid, t.bi_valid += e - m) : (t.bi_buf |= n << t.bi_valid & 65535, t.bi_valid += e);
            }
            function O(t, n, e) {
              F(t, e[2 * n], e[2 * n + 1]);
            }
            function z(t, n) {
              for (var e = 0; e |= 1 & t, t >>>= 1, e <<= 1, 0 < --n;);
              return e >>> 1;
            }
            function M(t, n, e) {
              var r,
                i,
                o = new Array(16),
                s = 0;
              for (r = 1; r <= _; r++) o[r] = s = s + e[r - 1] << 1;
              for (i = 0; i <= n; i++) {
                var a = t[2 * i + 1];
                0 !== a && (t[2 * i] = z(o[a]++, a));
              }
            }
            function j(t) {
              var n;
              for (n = 0; n < f; n++) t.dyn_ltree[2 * n] = 0;
              for (n = 0; n < l; n++) t.dyn_dtree[2 * n] = 0;
              for (n = 0; n < h; n++) t.bl_tree[2 * n] = 0;
              t.dyn_ltree[512] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
            }
            function L(t) {
              8 < t.bi_valid ? q(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
            }
            function W(t, n, e, r) {
              var i = 2 * n,
                o = 2 * e;
              return t[i] < t[o] || t[i] === t[o] && r[n] <= r[e];
            }
            function G(t, n, e) {
              for (var r = t.heap[e], i = e << 1; i <= t.heap_len && (i < t.heap_len && W(n, t.heap[i + 1], t.heap[i], t.depth) && i++, !W(n, r, t.heap[i], t.depth));) t.heap[e] = t.heap[i], e = i, i <<= 1;
              t.heap[e] = r;
            }
            function Z(t, n, e) {
              var r,
                i,
                o,
                s,
                a = 0;
              if (0 !== t.last_lit) for (; r = t.pending_buf[t.d_buf + 2 * a] << 8 | t.pending_buf[t.d_buf + 2 * a + 1], i = t.pending_buf[t.l_buf + a], a++, 0 === r ? O(t, i, n) : (O(t, (o = x[i]) + c + 1, n), 0 !== (s = g[o]) && F(t, i -= P[o], s), O(t, o = T(--r), e), 0 !== (s = k[o]) && F(t, r -= C[o], s)), a < t.last_lit;);
              O(t, v, n);
            }
            function H(t, n) {
              var e,
                r,
                i,
                o = n.dyn_tree,
                s = n.stat_desc.static_tree,
                a = n.stat_desc.has_stree,
                u = n.stat_desc.elems,
                c = -1;
              for (t.heap_len = 0, t.heap_max = d, e = 0; e < u; e++) 0 !== o[2 * e] ? (t.heap[++t.heap_len] = c = e, t.depth[e] = 0) : o[2 * e + 1] = 0;
              for (; t.heap_len < 2;) o[2 * (i = t.heap[++t.heap_len] = c < 2 ? ++c : 0)] = 1, t.depth[i] = 0, t.opt_len--, a && (t.static_len -= s[2 * i + 1]);
              for (n.max_code = c, e = t.heap_len >> 1; 1 <= e; e--) G(t, o, e);
              for (i = u; e = t.heap[1], t.heap[1] = t.heap[t.heap_len--], G(t, o, 1), r = t.heap[1], t.heap[--t.heap_max] = e, t.heap[--t.heap_max] = r, o[2 * i] = o[2 * e] + o[2 * r], t.depth[i] = (t.depth[e] >= t.depth[r] ? t.depth[e] : t.depth[r]) + 1, o[2 * e + 1] = o[2 * r + 1] = i, t.heap[1] = i++, G(t, o, 1), 2 <= t.heap_len;);
              t.heap[--t.heap_max] = t.heap[1], function (t, n) {
                var e,
                  r,
                  i,
                  o,
                  s,
                  a,
                  u = n.dyn_tree,
                  c = n.max_code,
                  f = n.stat_desc.static_tree,
                  l = n.stat_desc.has_stree,
                  h = n.stat_desc.extra_bits,
                  m = n.stat_desc.extra_base,
                  p = n.stat_desc.max_length,
                  v = 0;
                for (o = 0; o <= _; o++) t.bl_count[o] = 0;
                for (u[2 * t.heap[t.heap_max] + 1] = 0, e = t.heap_max + 1; e < d; e++) p < (o = u[2 * u[2 * (r = t.heap[e]) + 1] + 1] + 1) && (o = p, v++), u[2 * r + 1] = o, c < r || (t.bl_count[o]++, s = 0, m <= r && (s = h[r - m]), a = u[2 * r], t.opt_len += a * (o + s), l && (t.static_len += a * (f[2 * r + 1] + s)));
                if (0 !== v) {
                  do {
                    for (o = p - 1; 0 === t.bl_count[o];) o--;
                    t.bl_count[o]--, t.bl_count[o + 1] += 2, t.bl_count[p]--, v -= 2;
                  } while (0 < v);
                  for (o = p; 0 !== o; o--) for (r = t.bl_count[o]; 0 !== r;) c < (i = t.heap[--e]) || (u[2 * i + 1] !== o && (t.opt_len += (o - u[2 * i + 1]) * u[2 * i], u[2 * i + 1] = o), r--);
                }
              }(t, n), M(o, c, t.bl_count);
            }
            function J(t, n, e) {
              var r,
                i,
                o = -1,
                s = n[1],
                a = 0,
                u = 7,
                c = 4;
              for (0 === s && (u = 138, c = 3), n[2 * (e + 1) + 1] = 65535, r = 0; r <= e; r++) i = s, s = n[2 * (r + 1) + 1], ++a < u && i === s || (a < c ? t.bl_tree[2 * i] += a : 0 !== i ? (i !== o && t.bl_tree[2 * i]++, t.bl_tree[32]++) : a <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++, o = i, c = (a = 0) === s ? (u = 138, 3) : i === s ? (u = 6, 3) : (u = 7, 4));
            }
            function V(t, n, e) {
              var r,
                i,
                o = -1,
                s = n[1],
                a = 0,
                u = 7,
                c = 4;
              for (0 === s && (u = 138, c = 3), r = 0; r <= e; r++) if (i = s, s = n[2 * (r + 1) + 1], !(++a < u && i === s)) {
                if (a < c) for (; O(t, i, t.bl_tree), 0 != --a;);else 0 !== i ? (i !== o && (O(t, i, t.bl_tree), a--), O(t, w, t.bl_tree), F(t, a - 3, 2)) : a <= 10 ? (O(t, b, t.bl_tree), F(t, a - 3, 3)) : (O(t, y, t.bl_tree), F(t, a - 11, 7));
                o = i, c = (a = 0) === s ? (u = 138, 3) : i === s ? (u = 6, 3) : (u = 7, 4);
              }
            }
            s(C);
            var Q = !1;
            function X(t, n, e, i) {
              F(t, 0 + (i ? 1 : 0), 3), function (t, n, e, i) {
                L(t), q(t, e), q(t, ~e), r.arraySet(t.pending_buf, t.window, n, e, t.pending), t.pending += e;
              }(t, n, e, !0);
            }
            e._tr_init = function (t) {
              Q || (function () {
                var t,
                  n,
                  e,
                  r,
                  i,
                  o = new Array(16);
                for (r = e = 0; r < 28; r++) for (P[r] = e, t = 0; t < 1 << g[r]; t++) x[e++] = r;
                for (x[e - 1] = r, r = i = 0; r < 16; r++) for (C[r] = i, t = 0; t < 1 << k[r]; t++) I[i++] = r;
                for (i >>= 7; r < l; r++) for (C[r] = i << 7, t = 0; t < 1 << k[r] - 7; t++) I[256 + i++] = r;
                for (n = 0; n <= _; n++) o[n] = 0;
                for (t = 0; t <= 143;) E[2 * t + 1] = 8, t++, o[8]++;
                for (; t <= 255;) E[2 * t + 1] = 9, t++, o[9]++;
                for (; t <= 279;) E[2 * t + 1] = 7, t++, o[7]++;
                for (; t <= 287;) E[2 * t + 1] = 8, t++, o[8]++;
                for (M(E, 287, o), t = 0; t < l; t++) A[2 * t + 1] = 5, A[2 * t] = z(t, 5);
                U = new D(E, g, 257, f, _), R = new D(A, k, 0, l, _), B = new D(new Array(0), $, 0, h, 7);
              }(), Q = !0), t.l_desc = new N(t.dyn_ltree, U), t.d_desc = new N(t.dyn_dtree, R), t.bl_desc = new N(t.bl_tree, B), t.bi_buf = 0, t.bi_valid = 0, j(t);
            }, e._tr_stored_block = X, e._tr_flush_block = function (t, n, e, r) {
              var i,
                o,
                s = 0;
              0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {
                var n,
                  e = 4093624447;
                for (n = 0; n <= 31; n++, e >>>= 1) if (1 & e && 0 !== t.dyn_ltree[2 * n]) return 0;
                if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return 1;
                for (n = 32; n < c; n++) if (0 !== t.dyn_ltree[2 * n]) return 1;
                return 0;
              }(t)), H(t, t.l_desc), H(t, t.d_desc), s = function (t) {
                var n;
                for (J(t, t.dyn_ltree, t.l_desc.max_code), J(t, t.dyn_dtree, t.d_desc.max_code), H(t, t.bl_desc), n = 18; 3 <= n && 0 === t.bl_tree[2 * S[n] + 1]; n--);
                return t.opt_len += 3 * (n + 1) + 5 + 5 + 4, n;
              }(t), i = t.opt_len + 3 + 7 >>> 3, (o = t.static_len + 3 + 7 >>> 3) <= i && (i = o)) : i = o = e + 5, e + 4 <= i && -1 !== n ? X(t, n, e, r) : 4 === t.strategy || o === i ? (F(t, 2 + (r ? 1 : 0), 3), Z(t, E, A)) : (F(t, 4 + (r ? 1 : 0), 3), function (t, n, e, r) {
                var i;
                for (F(t, n - 257, 5), F(t, e - 1, 5), F(t, r - 4, 4), i = 0; i < r; i++) F(t, t.bl_tree[2 * S[i] + 1], 3);
                V(t, t.dyn_ltree, n - 1), V(t, t.dyn_dtree, e - 1);
              }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1), Z(t, t.dyn_ltree, t.dyn_dtree)), j(t), r && L(t);
            }, e._tr_tally = function (t, n, e) {
              return t.pending_buf[t.d_buf + 2 * t.last_lit] = n >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & n, t.pending_buf[t.l_buf + t.last_lit] = 255 & e, t.last_lit++, 0 === n ? t.dyn_ltree[2 * e]++ : (t.matches++, n--, t.dyn_ltree[2 * (x[e] + c + 1)]++, t.dyn_dtree[2 * T(n)]++), t.last_lit === t.lit_bufsize - 1;
            }, e._tr_align = function (t) {
              F(t, 2, 3), O(t, v, E), function (t) {
                16 === t.bi_valid ? (q(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : 8 <= t.bi_valid && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);
              }(t);
            };
          }, {
            "../utils/common": 41
          }],
          53: [function (t, n, e) {
            n.exports = function () {
              this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
            };
          }, {}],
          54: [function (t, n, e) {
            n.exports = "function" == typeof setImmediate ? setImmediate : function () {
              var t = [].slice.apply(arguments);
              t.splice(1, 0, 0), setTimeout.apply(null, t);
            };
          }, {}]
        }, {}, [10])(10);
      });
    }, function (t) {
      var n = n || "undefined" != typeof navigator && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator) || function (t) {
        if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
          var n = t.document,
            e = function () {
              return t.URL || t.webkitURL || t;
            },
            r = t.URL || t.webkitURL || t,
            i = n.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            o = !t.externalHost && "download" in i,
            s = function (e) {
              var r = n.createEvent("MouseEvents");
              r.initMouseEvent("click", !0, !1, t, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), e.dispatchEvent(r);
            },
            a = t.webkitRequestFileSystem,
            u = t.requestFileSystem || a || t.mozRequestFileSystem,
            c = function (n) {
              (t.setImmediate || t.setTimeout)(function () {
                throw n;
              }, 0);
            },
            f = "application/octet-stream",
            l = 0,
            h = [],
            d = function () {
              for (var t = h.length; t--;) {
                var n = h[t];
                "string" == typeof n ? r.revokeObjectURL(n) : n.remove();
              }
              h.length = 0;
            },
            _ = function (t, n, e) {
              for (var r = (n = [].concat(n)).length; r--;) {
                var i = t["on" + n[r]];
                if ("function" == typeof i) try {
                  i.call(t, e || t);
                } catch (t) {
                  c(t);
                }
              }
            },
            m = function (r, s) {
              var c = this,
                d = r.type,
                m = !1,
                p,
                v,
                w = function () {
                  var t = e().createObjectURL(r);
                  return h.push(t), t;
                },
                b = function () {
                  _(c, "writestart progress write writeend".split(" "));
                },
                y = function () {
                  !m && p || (p = w(r)), v ? v.location.href = p : window.open(p, "_blank"), c.readyState = c.DONE, b();
                },
                g = function (t) {
                  return function () {
                    if (c.readyState !== c.DONE) return t.apply(this, arguments);
                  };
                },
                k = {
                  create: !0,
                  exclusive: !1
                },
                $;
              if (c.readyState = c.INIT, s || (s = "download"), o) {
                p = w(r), n = t.document, (i = n.createElementNS("http://www.w3.org/1999/xhtml", "a")).href = p, i.download = s;
                var S = n.createEvent("MouseEvents");
                return S.initMouseEvent("click", !0, !1, t, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), i.dispatchEvent(S), c.readyState = c.DONE, void b();
              }
              t.chrome && d && d !== f && ($ = r.slice || r.webkitSlice, r = $.call(r, 0, r.size, f), m = !0), a && "download" !== s && (s += ".download"), (d === f || a) && (v = t), u ? (l += r.size, u(t.TEMPORARY, l, g(function (t) {
                t.root.getDirectory("saved", k, g(function (t) {
                  var n = function () {
                    t.getFile(s, k, g(function (t) {
                      t.createWriter(g(function (n) {
                        n.onwriteend = function (n) {
                          v.location.href = t.toURL(), h.push(t), c.readyState = c.DONE, _(c, "writeend", n);
                        }, n.onerror = function () {
                          var t = n.error;
                          t.code !== t.ABORT_ERR && y();
                        }, "writestart progress write abort".split(" ").forEach(function (t) {
                          n["on" + t] = c["on" + t];
                        }), n.write(r), c.abort = function () {
                          n.abort(), c.readyState = c.DONE;
                        }, c.readyState = c.WRITING;
                      }), y);
                    }), y);
                  };
                  t.getFile(s, {
                    create: !1
                  }, g(function (t) {
                    t.remove(), n();
                  }), g(function (t) {
                    t.code === t.NOT_FOUND_ERR ? n() : y();
                  }));
                }), y);
              }), y)) : y();
            },
            p = m.prototype,
            v = function (t, n) {
              return new m(t, n);
            };
          return p.abort = function () {
            var t = this;
            t.readyState = t.DONE, _(t, "abort");
          }, p.readyState = p.INIT = 0, p.WRITING = 1, p.DONE = 2, p.error = p.onwritestart = p.onprogress = p.onwrite = p.onabort = p.onerror = p.onwriteend = null, t.addEventListener("unload", d, !1), v.unload = function () {
            d(), t.removeEventListener("unload", d, !1);
          }, v;
        }
      }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
      t.exports = n;
    }, module => {
      module.exports = function () {
        return {
          promptRateUs() {
            chrome.storage.local.get("rate_us", function (t) {
              if (t && t.rate_us) return;
              const n = document.createElement("div");
              n.className = "promaster-rate-us", n.innerHTML = `\n\t\t\t<div class="title">\n\t\t\t\t<span class="logo"></span>\n\t\t\t</div>\n\t\t\t<div class="main">\n\t\t\t\t<div class="descr">\n\t\t\t\t\t<span>${chrome.i18n.getMessage("rate_us_descr")}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="stars-root">\n\t\t\t\t\t<i class="star-empty" data-position="1"></i>\n\t\t\t\t\t<i class="star-empty" data-position="2"></i>\n\t\t\t\t\t<i class="star-empty" data-position="3"></i>\n\t\t\t\t\t<i class="star-empty" data-position="4"></i>\n\t\t\t\t\t<i class="star-empty" data-position="5"></i>\n\t\t\t\t</div>\n\t\t\t</div>`, document.body.appendChild(n);
              const e = n.querySelectorAll("i");
              let r = !1,
                i = !1,
                o = !1;
              function s(t) {
                o = !0;
                const n = this.dataset.position;
                e.forEach(function (t) {
                  t.dataset.position <= n ? t.className = "star-full" : t.className = "star-empty";
                });
              }
              function a(t) {
                r || (o = !1, setTimeout(function () {
                  o || e.forEach(function (t) {
                    t.className = "star-empty";
                  });
                }, 100));
              }
              function u(t) {
                r = !0;
                const o = this.dataset.position;
                e.forEach(function (t) {
                  t.dataset.position <= o && (t.className = "star-full");
                }), e.forEach(function (t) {
                  t.removeEventListener("mouseover", s), t.removeEventListener("mouseout", a), t.removeEventListener("click", u);
                }), o > 3 && !i && (i = !0, window.open("https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/reviews")), n.remove(), chrome.storage.local.set({
                  rate_us: !0
                });
              }
              e.forEach(function (t) {
                t.addEventListener("mouseover", s), t.addEventListener("mouseout", a), t.addEventListener("click", u);
              });
            });
          },
          markSuccessAction() {
            chrome.storage.local.get(["success_dw", "rate_us"], t => {
              if (t.rate_us) return;
              const n = (parseInt(t.success_dw) || 0) + 1;
              chrome.storage.local.set({
                success_dw: n
              }), n % 5 == 0 && (n % 20 != 0 ? this.initHeaderCaptureListeners() : chrome.storage.local.set({
                rate_us: !0
              }));
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4),
        instaUtils = require(3);
      module.exports = function () {
        return {
          showPolicyModal(t) {
            if (document.querySelector(".promaster_policy_modal")) return;
            const n = chrome.i18n.getMessage("policyTitle"),
              e = `<a href="${"https://sites.google.com/view/downloader-promaster"}" target="_blank" class="link">${n}</a>`,
              o = void 0,
              s = `\n<div class="promaster_modal_overlay">\n      <div class="promaster_policy_modal">\n               <span class="logo"></span>\n            \t<span class="text">${chrome.i18n.getMessage("policyModalText", [e])}</span>\n               <button class="accept"> ${chrome.i18n.getMessage("policyModalAccept")}\n               </button>\n            </span>\n         </div>\n      </div>\n</div>\n   `,
              a = document.createElement("div");
            a.innerHTML = s;
            const u = a.firstElementChild;
            document.body.appendChild(u);
            const c = void 0;
            u.querySelector(".promaster_policy_modal .accept").addEventListener("click", n => {
              u.remove(), t(), instaUtils.sendMessage({
                action: "updateStorage",
                data: {
                  policy_accepted: !0,
                  ["promotional_allowed"]: !0
                }
              });
            }), u.addEventListener("click", t => {
              t.target === u && u.remove();
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const constants = require(4),
        domHelpers = require(25),
        uploadSessionManager = require(32),
        ratingManager = require(29);
      let a = function () {
        let t = document.querySelector(".promaster_modal_btn_wrap");
        t && (t.innerHTML = '<div class="promaster_repost_loader_wrap"><span class="promaster_repost_loader"></span></div>');
      };
      module.exports = function () {
        return {
          mediaType: null,
          mediaData: null,
          destination: null,
          resetSession: function () {
            this.mediaType = null, this.mediaData = null, this.destination = null;
          },
          openUploadDialog: function (t) {
            if (!t || !t.file) return;
            let n = this;
            n.mediaData = {
              type: t.file.type,
              size: t.file.size,
              file: t.file,
              dimensions: t.dimensions
            }, t.file.type.includes("video") ? (n.mediaType = 2, n.mediaData.prev = t.prev) : n.mediaType = 1, n.destination = t.destination, n.showRepostModal();
          },
          showRepostModal: function () {
            let t = this;
            if ("feed" === t.destination) var n = chrome.i18n.getMessage("repost"),
              e = `<textarea id="promaster_post_textarea" maxlength="2000" placeholder="${chrome.i18n.getMessage("write_caption")}" ></textarea>`;else "reels" === t.destination ? (n = chrome.i18n.getMessage("repost_reels"), e = `<input type="checkbox" id="allow-share-feed" checked>${chrome.i18n.getMessage("allow_share_to_feed")}`) : (n = chrome.i18n.getMessage("repost_story"), e = "");
            let u = t.mediaType === 2 ? t.mediaData.prev : t.mediaData.file,
              c = `\n\t\t\t<div class="promaster_modal_header">${n}</div>\n\t\t\t<div class="promaster_repost_preview">\n\t\t\t\t<div>\n\t\t\t\t\t<img src="${URL.createObjectURL(u)}">\n\t\t\t\t</div>\n\t\t\t${e}\n\t\t\t</div>\n\t\t\t<div class="promaster_modal_btn_wrap">\n\t\t\t\t<button class="share_btn">${chrome.i18n.getMessage("share")}</button>\n\t\t\t</div>`;
            new domHelpers().showCustomModal(c, {
              cancelCallback: function () {
                t.resetSession();
              }
            });
            let f = document.querySelector("#allow-share-feed"),
              l = f && f.checked || null;
            f && f.addEventListener("change", function (t) {
              l = t.target.checked;
            }), document.querySelector(".share_btn").addEventListener("click", function (n) {
              n.stopPropagation(), a();
              let e = document.querySelector("#promaster_post_textarea");
              e && (t.mediaData.caption = e.value, e.remove());
              let r = {
                media: t.mediaData,
                media_type: t.mediaType,
                destination: t.destination
              };
              "reels" === t.destination && (r.shareReelsToFeed = l), uploadSessionManager.startUpload(r, function (t) {
                return t ? (ratingManager.markSuccessAction(), new domHelpers().showMessageModal(chrome.i18n.getMessage("reposted"))) : new domHelpers().showMessageModal(chrome.i18n.getMessage("repost_error"));
              });
            });
          }
        };
      }();
    }, (module, exports, require) => {
      const instaUtils = require(3),
        domHelpers = require(25),
        uploadClient = require(12),
        uploadApiBridge = require(33);
      module.exports = function () {
        return {
          sessionState: {
            upload_id: null,
            media: null,
            media_type: null,
            destination: null
          },
          startUpload: function (t, n) {
            let e = this;
            e.sessionState = t, t.shareReelsToFeed && (e.shareReelsToFeed = t.shareReelsToFeed), instaUtils.sendMessage("getCookies", function (t) {
              if (!t) return new domHelpers().showMessageModal(chrome.i18n.getMessage("not_authorized_upload_attempt"));
              e.sessionState.upload_id = Date.now(), 2 === e.sessionState.media_type ? e.uploadVideo({
                blob: e.sessionState.media.file
              }).then(function (t) {
                if (!t) throw new Error();
                return e.uploadPhoto({
                  blob: e.sessionState.media.prev
                });
              }).then(function (t) {
                if (!t) throw new Error();
                return e.configurePost();
              }).then(function (t) {
                if (!t) throw new Error();
                n(!0);
              }).catch(function (t) {
                n(!1);
              }) : e.uploadPhoto({
                blob: e.sessionState.media.file
              }).then(function (t) {
                if (!t) throw new Error();
                return e.configurePost();
              }).then(function (t) {
                if (!t) throw new Error();
                n(!0);
              }).catch(function (t) {
                n(!1);
              });
            });
          },
          uploadPhoto: function (t) {
            let n = this;
            return new Promise(function (e, r) {
              let i = new FileReader();
              i.readAsArrayBuffer(t.blob), i.onload = function (t) {
                uploadApiBridge.uploadPhoto({
                  upload_id: n.sessionState.upload_id,
                  destination: n.sessionState.destination,
                  media_height: n.sessionState.media.height,
                  media_width: n.sessionState.media.width,
                  data: Array.from(new Uint8Array(i.result))
                }, function (t) {
                  t ? e(t) : r();
                });
              };
            });
          },
          uploadVideo: function (t) {
            let n = this;
            return new Promise(function (e, r) {
              let i = new FileReader();
              i.readAsArrayBuffer(t.blob), i.onload = function (t) {
                uploadClient.uploadVideoRequest({
                  upload_id: n.sessionState.upload_id,
                  destination: n.sessionState.destination,
                  media_height: n.sessionState.media.height,
                  media_width: n.sessionState.media.width,
                  duration: n.sessionState.media.duration,
                  data: Array.from(new Uint8Array(i.result))
                }, function (t) {
                  t ? e(t) : r();
                });
              };
            });
          },
          configurePost: function () {
            let t = this;
            return new Promise(function (n, e) {
              return uploadApiBridge.configurePost({
                upload_id: t.sessionState.upload_id,
                caption: t.sessionState.media.caption || "",
                destination: t.sessionState.destination,
                shareReelsToFeed: t.shareReelsToFeed || null
              }, function (t) {
                t ? n(t) : e();
              });
            });
          }
        };
      }();
    }, module => {
      module.exports = function () {
        return {
          uploadPhoto: function (t, n) {
            chrome.runtime.sendMessage({
              action: "uploadPhotoRequest",
              opts: t
            }, n);
          },
          configurePost: function (t, n) {
            chrome.runtime.sendMessage({
              action: "uploadPostConfigureRequest",
              opts: t
            }, n);
          }
        };
      }();
    }, (module, exports, require) => {
      const fileSaver = require(28);
      module.exports = function () {
        return {
          downloadDirect: function (t, n) {
            if (!t || !t.url) return n({
              err: !0
            });
            var e = new XMLHttpRequest();
            e.open("GET", t.url, !0), e.responseType = "arraybuffer", e.onreadystatechange = function () {
              if (4 === this.readyState) if (200 === this.status) try {
                var e = this.response || this.responseText,
                  i = new Blob([e], {
                    type: "application/octet-stream"
                  });
                let o = t.filename || t.fileName || null;
                fileSaver(i, o), "function" == typeof n && n({
                  ok: !0
                });
              } catch (e) {
                Insta_Utils.downloadFileViaBackground(t, n);
              } else if ("function" == typeof n) return n({
                err: !0
              });
            }, e.send();
          }
        };
      }();
    }],
    n = {};
  function e(r) {
    var i = n[r];
    if (void 0 !== i) return i.exports;
    var o = n[r] = {
      exports: {}
    };
    return t[r].call(o.exports, o, o.exports, e), o.exports;
  }
  (() => {
    e.g = function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (t) {
        if ("object" == typeof window) return window;
      }
    }();
  })();
  const instaUtils = e(3),
    postDetailsResolver = e(21),
    domExtractor = e(23),
    mediaUploadUI = e(31),
    bulkDownloadController = e(24),
    domHelpers = e(25),
    bulkDownloadController_2 = e(24),
    taskQueue = e(26),
    ratingManager = e(29),
    octetStreamDownloader = e(34),
    instaUtils_2 = e(3),
    graphqlDefinitions = e(9),
    policyStorage = e(30);
  let p = "";
  var uiController = {
    DOWNLOAD_BTN_CLASS: "promaster_dl_btn",
    REPOST_BTN_CLASS: "promaster_rpst_btn",
    handleStoryDownloadClick: function (t) {
      domExtractor.pauseStoryVideo(), uiController.buttonStateManager.showButtonLoader(t.target);
      let n = location.pathname.match(/stories\/([^\/]+)/);
      n = n && n[1], n ? domExtractor.fetchUserStories(n, function (n) {
        if (!n || !n.length) return void uiController.buttonStateManager.hideButtonLoader(t.target);
        let e = instaUtils_2.getStoriesCurrentIndex(),
          i = n && n[e] || null;
        if (!i) return void uiController.buttonStateManager.hideButtonLoader(t.target);
        instaUtils.fetchBlob(i.url, function (n) {
          "video" === i.type && i.prev ? instaUtils.fetchBlob(i.prev, function (t) {
            mediaUploadUI.openUploadDialog({
              file: n,
              prev: t,
              destination: "story"
            });
          }) : mediaUploadUI.openUploadDialog({
            file: n,
            destination: "story"
          }), uiController.buttonStateManager.hideButtonLoader(t.target);
        });
      }) : uiController.buttonStateManager.hideButtonLoader(t.target);
    },
    handleMediaDownloadClick: function (t) {
      if (bulkDownloadController.isStoryDownloadActive = !1, uiController.buttonStateManager.showButtonLoader(t.target), domExtractor.pauseStoryVideo(), instaUtils.isHighlightsPage()) {
        let n = location.pathname.match(new RegExp("stories\\/highlights\\/([^/]+)"));
        if (n = n && n[1], n) {
          let e = "highlight:" + n;
          return domExtractor.fetchHighlightStories(e).then(function (n) {
            uiController.buttonStateManager.hideButtonLoader(t.target);
            if (!n) return;
            domExtractor.pauseStoryVideo();
            let e = instaUtils_2.getStoriesCurrentIndex();
            let activeMedia = document.querySelector("section video, section img[srcset], article video, article img[srcset]");
            if (activeMedia && n.length > 1) {
              let curSrc = activeMedia.currentSrc || activeMedia.src || "";
              if (curSrc) {
                let cleanSrc = curSrc.split("?")[0];
                let foundIdx = n.findIndex(item => item.url && item.url.split("?")[0] === cleanSrc);
                if (foundIdx !== -1) e = foundIdx;
              }
            }
            let item = n[e] || n[0];
            if (!item) return;
            let r = {
              url: item.url,
              filename: `${item.userName}_${item.id}.${item.fileExt}`
            };
            uiController.executeDownload(r, t.target);
          });
        }
      }
      let n = location.pathname.match(/stories\/([^\/]+)/);
      n = n && n[1], n ? domExtractor.fetchUserStories(n, function (n) {
        uiController.buttonStateManager.hideButtonLoader(t.target);
        if (!n || !n.length) return;
        domExtractor.pauseStoryVideo();
        let e = instaUtils_2.getStoriesCurrentIndex();
        let activeMedia = document.querySelector("section video, section img[srcset], article video, article img[srcset]");
        if (activeMedia && n.length > 1) {
          let curSrc = activeMedia.currentSrc || activeMedia.src || "";
          if (curSrc) {
            let cleanSrc = curSrc.split("?")[0];
            let foundIdx = n.findIndex(item => item.url && item.url.split("?")[0] === cleanSrc);
            if (foundIdx !== -1) e = foundIdx;
          }
        }
        let r = n[e] || n[0];
        if (r) uiController.executeDownload(r, t.target);
      }) : uiController.buttonStateManager.hideButtonLoader(t.target);
    },
    handleBulkDownloadClick: function (t) {
      instaUtils.sendMessage("checkBulkDownloadNow", function (n) {
        if (n) return new domHelpers().showMessageModal(chrome.i18n.getMessage("synchronous_bulk_download_denied"));
        function e(n, prefix) {
          uiController.buttonStateManager.hideButtonLoader(t.target);
          if (n && n.length) {
            domExtractor.pauseStoryVideo();
            taskQueue.startBulkDownloadZipStream({
              files: n,
              filename_prefix: prefix || "stories"
            }, bulkDownloadController, function () {
              bulkDownloadController.isDownloading = !1;
            });
          } else {
            bulkDownloadController.isDownloading = !1;
          }
        }
        if (bulkDownloadController.isDownloading = !0, bulkDownloadController.isStoryDownloadActive = !1, uiController.buttonStateManager.showButtonLoader(t.target), domExtractor.pauseStoryVideo(), instaUtils.isHighlightsPage()) {
          let tLoc = location.pathname.match(new RegExp("stories\\/highlights\\/([^/]+)"));
          if (tLoc = tLoc && tLoc[1], tLoc) {
            let nReel = "highlight:" + tLoc;
            return void domExtractor.fetchStories(nReel, true).then(function (res) {
              let connectionEdges = res && res.data && res.data.xdt_api__v1__feed__reels_media__connection && res.data.xdt_api__v1__feed__reels_media__connection.edges;
              let reels = res && res.data && res.data.reels_media || connectionEdges && connectionEdges.map(e => e && e.node).filter(Boolean) || res && res.reels_media || [];
              if (!reels.length || !reels[0].items) {
                uiController.buttonStateManager.hideButtonLoader(t.target);
                return void (bulkDownloadController.isDownloading = !1);
              }
              let reel = reels[0];
              let uname = reel.owner && reel.owner.username || reel.user && reel.user.username || (domExtractor.getStoryUsername ? domExtractor.getStoryUsername(reel, tLoc) : "highlight");
              let hTitle = reel.title || (domExtractor.getHighlightTitle ? domExtractor.getHighlightTitle(reel) : "");
              let title = hTitle ? `${uname}_${hTitle}` : uname;
              let parsedItems = domExtractor.normalizeStoryItems(reel.items, {
                username: uname
              });
              e(parsedItems, title);
            });
          }
        }
        let i = location.pathname.match(/stories\/([^\/]+)/);
        i = i && i[1], i ? domExtractor.fetchUserStories(i, e) : (uiController.buttonStateManager.hideButtonLoader(t.target), bulkDownloadController.isDownloading = !1);
      });
    },
    handleReelsDownloadClick: function (t) {
      let n = t.target;
      n = "div" === n.nodeName.toLowerCase() ? n : n.parentElement, "div" === n.nodeName.toLowerCase() && (uiController.buttonStateManager.showButtonLoader(n), uiController.extractMediaInfoFromElement(n, function (t) {
        t.hasAlt = !0, uiController.executeDownload.call(uiController, t, n);
      }));
    },
    handleAudioDownloadClick: function (t) {
      let n = t.target.parentElement;
      uiController.buttonStateManager.showButtonLoader(n), uiController.extractMediaInfoFromElement(n, function (t) {
        instaUtils.fetchBlob(t.url, function (e) {
          if ("video" === t.type && t.prev) {
            let i = t.isReels ? "reels" : "feed";
            instaUtils.fetchBlob(t.prev, function (r) {
              uiController.buttonStateManager.hideButtonLoader(n), mediaUploadUI.openUploadDialog({
                file: e,
                prev: r,
                destination: i,
                dimensions: t.dimensions
              });
            });
          } else uiController.buttonStateManager.hideButtonLoader(n), mediaUploadUI.openUploadDialog({
            file: e,
            destination: "feed",
            dimensions: t.dimensions
          });
        });
      });
    },
    executeDownload: function (t, n) {
      let e = this;
      t && t.error && !t.hasAlt && (t = e.Sr(n)), octetStreamDownloader.downloadDirect(t, function (r) {
        return r.err && t.hasAlt ? e.Er(t, n) : (e.mr.pr(n), r.err ? e.Ar(n) : void ratingManager.markSuccessAction());
      });
    },
    Ir: function (t, n) {
      let e;
      for (e in t) {
        if (!t.hasOwnProperty(e)) continue;
        if (!t[e] || "object" != typeof t[e]) continue;
        if (t[e].items && t[e] && t[e].items && 1 === t[e].items.length && t[e].items[0].code === n) return {
          items: t[e].items
        };
        let r = this.Ir(t[e], n);
        if (r) return r;
      }
      return null;
    },
    fallbackDownloadViaShortcode: function (t, n) {
      let e = this;
      chrome.runtime.sendMessage({
        action: "requestHtmlByShortcode",
        shortcode: t.shortcode
      }, i => {
        t.hasAlt = !1;
        const o = instaUtils.filterMediaByAdvancedParams(i, new RegExp(t.shortcode));
        for (let i of o) {
          i = e.Ir(i, t.shortcode);
          let o = i && i.items && i.items[0] || null;
          if (o && (o.video_versions = o.video_versions && o.video_versions.sort(instaUtils.compareMediaDimensions) || null, o && o.video_versions.length && (t.url = o.video_versions[0].url || null, t.url))) return e.br(t, n);
        }
      });
    },
    showDownloadError: function (t) {
      if (!t) return;
      let n = t.parentNode,
        e = document.createElement("div");
      e.innerHTML = '<div class="error_dl_msg_desktop">' + chrome.i18n.getMessage("error_dl_msg") + "</div>", n.append(e.firstElementChild), setTimeout(function () {
        let t = document.querySelector(".error_dl_msg_desktop");
        t && t.remove();
      }, 2e3);
    },
    buttonStateManager: {
      showButtonLoader: function (t) {
        let n = t.querySelector(".promaster_icon") || t.parentNode.querySelector(".promaster_icon");
        n && n.classList.add("promaster_loader");
      },
      hideButtonLoader: function (t) {
        let n = t.querySelector(".promaster_loader") || t.parentNode.querySelector(".promaster_loader");
        n && n.classList.contains("promaster_loader") && n.classList.remove("promaster_loader");
      }
    },
    findMediaContainer: function (t, n) {
      let e;
      if (n || instaUtils.isHomePage()) {
        let n = t.closest("article") || t.closest('div[role*="button"]');
        if (n) {
          let t = n.querySelector("header > div + div a");
          e = t && t.getAttribute("href"), e = e && e.replace(/\//g, "");
        }
      } else {
        if (!instaUtils.isSavedCollectionPage() || !t) return document.querySelector("._aacl ._aacs ._aact ._aacx ._aada").innerText;
        {
          let n = t.getAttribute("alt");
          n && (n = n.substr(0, 50), e = n);
        }
      }
      return e;
    },
    extractMediaInfoFromElement: function (t, n) {
      let e = t.closest("article") || t.closest('div[role*="button"]'),
        o = {
          shortcode: t.dataset.shortcode,
          is_carousel: t.dataset.carousel,
          carousel_position: t.dataset.carousel ? instaUtils.extractCarouselIndex(e) : void 0
        };
      "reels" === o.shortcode && (o.shortcode = instaUtils.extractShortcodeFromPath()), postDetailsResolver.resolveMediaItemFromShortcode(o, function (t) {
        return t.shortcode = o.shortcode, t.isCarousel = o.is_carousel, n(t);
      });
    },
    resolveAlternativeMedia: function (t) {
      let n = uiController.findMediaContainer(t, !0),
        e = instaUtils.findVideoElement(t.parentNode),
        i,
        o,
        s;
      return e ? (i = instaUtils.getVideoSrc(e), s = i.videoWidth, o = i.videoHeight) : (e = instaUtils.findLargestImageFromContainer(t.parentNode), e && (i = instaUtils.getSrcsetFromImage(e), s = i.naturalWidth, o = i.naturalHeight)), instaUtils.isMediaUrl(i) ? {
        url: i,
        filename: instaUtils.extractFilenameFromUrl(i, n),
        dimensions: {
          width: s,
          height: o
        }
      } : null;
    },
    injectDownloadButton: function (t, n) {
      let e = document.createElement("div");
      e.innerHTML = `\n\t\t\t<div class="${this.DOWNLOAD_BTN_CLASS}" data-shortcode="${t.shortcode}">\n\t\t\t\t<span class="promaster_dl_pregress_loader"></span>\n\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("download")}</span>\n\t\t\t</div>`, t.isCarousel && e.firstElementChild.setAttribute("data-carousel", "1"), n.append(e.firstElementChild);
    },
    injectPostOverlayButtons: function (t, n, e) {
      if (n.closest("article") && n.closest("article").querySelector('header [href*=""]')) return;
      let r = 5 === e || 7 === e ? "reels" : "feed",
        i = document.createElement("div");
      i.innerHTML = `\n\t\t\t\t<div class="${this.REPOST_BTN_CLASS}" data-shortcode="${t.shortcode}" data-dest="${r}" >\n\t\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("repost")}</span>\n\t\t\t\t</div>`, t.isCarousel && i.firstElementChild.setAttribute("data-carousel", "1"), n.append(i.firstElementChild);
    },
    injectButtonsIfNotPresent: function (t, n, e = null) {
      if (t.getElementsByClassName(uiController.DOWNLOAD_BTN_CLASS).length) return;
      let i,
        o,
        s = e,
        a = !1;
      if (1 === n) {
        i = t, t = Array.from(t.querySelectorAll("img, video")).filter(function (t) {
          return "img" !== t.nodeName.toLowerCase() || t.width > 200 && t.height > 200;
        });
        const n = i.querySelector("video");
        n ? ((t = this.formatFilename(n, "a")) || (t = this.formatFilename(n, "div", '[role*="button"]')), t = t.parentNode) : t = t[0].parentElement.parentElement.parentElement.parentElement;
      } else 2 === n || 5 === n || 6 === n ? i = t : 3 === n ? i = t.querySelector(".EmbeddedMedia") : 4 === n ? (i = t, t = t.querySelector('div[role*="presentation"]').parentElement || t, a = !0) : 7 === n && (s = "reels", t = this.formatFilename(t, "img").parentNode);
      if (!i && 7 !== n) return;
      if (!s) try {
        s = instaUtils.extractShortcodeFromElement(i);
      } catch (t) {}
      if (!s) return;
      let u = {
        shortcode: s,
        page_type: n,
        isCarousel: a
      };
      6 === n && (t.style.position = "relative"), this.injectDownloadButton(u, t), this.injectPostOverlayButtons(u, t, n), t.dataset.ig_toolkit_marked = "1";
    },
    Cr(t, n, e = "") {
      if (!t || !n) return null;
      let r = t;
      const i = `${n}${e}`;
      for (; r;) {
        const t = void 0;
        if (Array.from(r.children).some(t => t.matches(i))) return r;
        r = r.parentElement;
      }
      return null;
    },
    startDOMObserverAndInjectors: function () {
      function t() {
        let t = instaUtils_2.getActiveSection();
        t && (!t.dataset.ig_toolkit_marked && instaUtils_2.findStoriesContainer() && (t.dataset.ig_toolkit_marked = "1", domExtractor.injectStoryActionButtons(t)), domExtractor.updateStoryDownloadAllCount());
      }
      function n(t) {
        return document.querySelectorAll(t.join(","));
      }
      function e() {
        n(["article img:not([data-ig_toolkit_marked])", "article video:not([data-ig_toolkit_marked])", 'div[role*="button"] video:not([data-ig_toolkit_marked])', 'div[role*="button"] img:not([data-ig_toolkit_marked])']).forEach(function (t) {
          if ("IMG" === t.tagName && (t.width < 300 || t.height < 300)) return;
          t.dataset.ig_toolkit_marked = "1", t.parentElement.dataset.ig_toolkit_marked = "1";
          let n = t.closest("article");
          n || (n = t.closest('div[role*="presentation"]'), n = n && n.closest("div[role=button]") || t.closest('div[role*="button"]') || null);
          let e = instaUtils.extractShortcodeFromPath();
          t.innerWidth < 400 && t.innerHeight < 400 && t.closest("a[href]") ? uiController.injectButtonsIfNotPresent(t.closest("a[href]").parentNode, 2, e) : n && instaUtils.countListItems(n) ? uiController.injectButtonsIfNotPresent(n, 4, e) : n && uiController.injectButtonsIfNotPresent(n, 1, e);
        });
      }
      function i() {
        document.querySelectorAll('a[href*="/p/"]').forEach(function (t) {
          if (t.parentElement.dataset.ig_toolkit_marked) return;
          let n = t.querySelector("img");
          if (!n || !(n.width > 250 && n.height > 250)) return;
          let e = instaUtils.hasReelsIconSvg(t.parentNode) ? 5 : 2;
          uiController.injectButtonsIfNotPresent(t.parentNode, e);
        }), document.querySelectorAll('a[href*="/reel/"]:not([ig_toolkit_marked])').forEach(function (t) {
          t.parentElement.ig_toolkit_marked || uiController.injectButtonsIfNotPresent(t.parentNode, 5);
        }), document.querySelectorAll("video").forEach(function (t) {
          if (t.parentElement.dataset.ig_toolkit_marked) return;
          let n;
          n = instaUtils.isUserReelsPath() ? 7 : instaUtils.hasReelsIconSvg(t.parentNode) ? 5 : 2, t.parentElement.dataset.ig_toolkit_marked = "1", uiController.injectButtonsIfNotPresent(t.parentNode, n);
        });
      }
      function s() {
        document.querySelectorAll(".Embed > .Header + div").forEach(function (t) {
          if (t.dataset.ig_toolkit_marked) return !1;
          uiController.injectButtonsIfNotPresent(t, 3);
        });
      }
      function u() {
        instaUtils.isProfilePage() && !(instaUtils.isTaggedPage() || instaUtils.isSavedCollectionPage() || instaUtils.isGuidesPage()) && document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]').length > 1 ? bulkDownloadController.showBulkDownloadButton() : bulkDownloadController.hideBulkDownloadButton(), instaUtils.isStoriesPage() ? t() : (e(), i());
      }
      instaUtils.isIframe() ? s() : (u(), setInterval(function () {
        u();
      }, 1e3));
    },
    initRuntimeMessageListener: function () {
      chrome.runtime.onMessage.addListener(function (t, n, e) {
        if (!t) return !1;
        "string" == typeof t && "handshake" === t ? e(!0) : "string" == typeof t && "isBulkDownloadNowInTab" === t ? e(bulkDownloadController.isDownloading) : "setDownloadingStatus" === t.action ? bulkDownloadController_2.ee = t.options.status : t.action;
      });
    },
    initClickEventInterceptors: function () {
      let t = Date.now(),
        n = function (n) {
          n.preventDefault(), n.stopPropagation();
          let e = Date.now();
          return t + 500 > e || (t = e, !1);
        };
      document.body.addEventListener("click", function (t) {
        const e = this;
        if (t.target.classList.contains(`${uiController.DOWNLOAD_BTN_CLASS}`) || t.target.parentElement && t.target.parentElement.classList.contains(uiController.DOWNLOAD_BTN_CLASS)) {
          if (n(t)) return;
          instaUtils.sendMessage("check_policy_accept", n => {
            n ? uiController.handleReelsDownloadClick.call(e, t) : policyStorage.showPolicyModal(() => {
              uiController.handleReelsDownloadClick.call(e, t);
            });
          });
        } else if (t.target.classList.contains(uiController.REPOST_BTN_CLASS) || t.target.parentElement.classList.contains(uiController.REPOST_BTN_CLASS)) {
          if (n(t)) return;
          instaUtils.sendMessage("check_policy_accept", n => {
            n ? uiController.handleAudioDownloadClick.call(e, t) : policyStorage.showPolicyModal(() => {
              uiController.handleAudioDownloadClick.call(e, t);
            });
          });
        }
        if (!instaUtils.isIframe()) if (t.target.classList.contains("promaster_ns_dl_btn") || t.target.parentElement.classList.contains("promaster_ns_dl_btn")) {
          if (n(t)) return;
          instaUtils.sendMessage("check_policy_accept", n => {
            n ? uiController.handleMediaDownloadClick.call(e, t) : policyStorage.showPolicyModal(() => {
              uiController.handleMediaDownloadClick.call(e, t);
            });
          });
        } else if (t.target.classList.contains("promaster_ns_rp_btn") || t.target.parentElement.classList.contains("promaster_ns_rp_btn")) {
          if (n(t)) return;
          instaUtils.sendMessage("check_policy_accept", n => {
            n ? uiController.handleStoryDownloadClick.call(e, t) : policyStorage.showPolicyModal(() => {
              uiController.handleStoryDownloadClick.call(e, t);
            });
          });
        } else if (t.target.classList.contains("promaster_ns_dl_all_btn") || t.target.parentElement.classList.contains("promaster_ns_dl_all_btn")) {
          if (n(t)) return;
          instaUtils.sendMessage("check_policy_accept", n => {
            n ? uiController.handleBulkDownloadClick.call(e, t) : policyStorage.showPolicyModal(() => {
              uiController.handleBulkDownloadClick.call(e, t);
            });
          });
        } else if (t.target.classList.contains("promaster_video_range") || t.target.parentElement.classList.contains("promaster_video_range")) {
          let t = e.closest("[data-ig_toolkit_marked]").querySelector("video");
          t.pause(), t.currentTime = e.value / 10, t.play();
        } else if (t.target.classList.contains("promaster_video_play_pause") || t.target.parentElement.classList.contains("promaster_video_play_pause")) {
          if (n(t)) return;
          let r = e.closest("[data-ig_toolkit_marked]").querySelector("video");
          e.classList.contains("promaster_paused") ? (e.dataset.playing = "1", r.play()) : e.parentElement.classList.contains("promaster_paused") ? (e.parentElement.dataset.playing = "1", r.play()) : (e.dataset.playing = "0", r.pause());
        }
      });
    },
    initPortConnection: function () {
      let t = this,
        n = chrome.runtime.connect(),
        e = !1,
        r = setTimeout(function () {
          n && (e = !0, n.disconnect()), t.qr();
        }, 295e3);
      n.onDisconnect.addListener(function () {
        e || (clearTimeout(r), t.qr());
      });
    },
    initContentScript: function () {
      instaUtils.polyfillNodeList(), this.initPortConnection(), this.startDOMObserverAndInjectors(), this.initRuntimeMessageListener(), this.initClickEventInterceptors(), graphqlDefinitions.initDocIds().catch(function () {});
    }
  };
  uiController.initContentScript();
})();