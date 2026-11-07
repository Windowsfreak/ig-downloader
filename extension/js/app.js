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
              o.shortcode && o.child_comment_count ? n.updateQueryHash("post", s) : o.id && o.first && o.after && tabManager.getTabUrl(t.tabId, function (t) {
                /\/channel\/|\/tagged\/|\/guides\//.test(t) ? t.includes("/channel/") && n.updateQueryHash("channel", s) : n.updateQueryHash("owner", s);
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
            }), chrome.webRequest && chrome.webRequest.onBeforeSendHeaders && chrome.webRequest.onBeforeSendHeaders.addListener(t.captureGraphQLQueryHash.bind(t), {
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
          u: function (t, n) {
            return this.updateQueryHash(t, n);
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
          m: "*://*.instagram.com/*",
          getTabUrl: function (t, n) {
            t < 0 || chrome.tabs.get(t, function (t) {
              n(t.url);
            });
          },
          isBulkDownloadActiveInAnyTab: function (t) {
            const n = this;
            chrome.tabs.query({
              url: [n.INSTAGRAM_URL_PATTERN]
            }, function (e) {
              let r = [];
              e.forEach(function (e) {
                r.push(e.id);
              });
              n.checkTabsForBulkDownload(r, t);
            });
          },
          checkTabsForBulkDownload: function (t, n) {
            const e = this;
            if (0 === t.length) return n(!1);
            let r = t.pop();
            chrome.tabs.sendMessage(r, "isBulkDownloadNowInTab", function (res) {
              res && n(!0), e.checkTabsForBulkDownload(t, n);
            });
          },
          v: function (t, n) {
            return this.checkTabsForBulkDownload(t, n);
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
          checkPolicyAccepted: () => Promise.resolve(!0)
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
          POLICY_URL: "",
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
            t.getHeaders().catch(function () {
              t.saveHeaders(t.DEFAULT_HEADERS);
            }), chrome.webRequest && chrome.webRequest.onBeforeSendHeaders && chrome.webRequest.onBeforeSendHeaders.addListener(t.captureHeadersFromRequest.bind(t), {
              urls: ["*://*.instagram.com/*"],
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
                return t.attempt++, e.uploadPostConfigureRequest(t, n).then(function () {
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
              return t.attempt++, e.uploadPostConfigureRequest(t, n).then(function () {
                return new Promise(function (r) {
                  setTimeout(function () {
                    r(e.handleUploadResponse(t, n));
                  }, 300);
                });
              });
            }
            n(!0);
          },
          Fn: function (t, n) {
            return this.uploadPostConfigureRequest(t, n);
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
        constants = require(4);
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
            // Quick check: inspect in-page script tags if already on this user's page
            try {
              let scripts = document.querySelectorAll("script");
              for (let i = 0; i < scripts.length; i++) {
                let txt = scripts[i].textContent || "";
                if (txt.includes(str)) {
                  let m = txt.match(new RegExp(`"username"\\s*:\\s*"${str}"[^{}]*"id"\\s*:\\s*"(\\d+)"`)) ||
                          txt.match(new RegExp(`"id"\\s*:\\s*"(\\d+)"[^{}]*"username"\\s*:\\s*"${str}"`)) ||
                          txt.match(/"profile_id":\s*"?(\d+)"?/);
                  if (m && m[1]) {
                    instaUtils.k[str] = m[1];
                    return m[1];
                  }
                }
              }
            } catch (e) {}
            // Try web_profile_info with full Instagram headers
            try {
              let csrf = this.getCsrf ? this.getCsrf() : null;
              let headers = {
                "x-ig-app-id": "936619743392459",
                "x-asbd-id": "359341",
                "x-requested-with": "XMLHttpRequest",
                "accept": "*/*"
              };
              if (csrf) headers["x-csrftoken"] = csrf;
              let res = await fetch("https://www.instagram.com/api/v1/users/web_profile_info/?username=" + encodeURIComponent(str), {
                headers: headers,
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
            // Background worker fallback (fetches profile HTML and extracts profile_id)
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
              n(e.normalizeStoryItems(reel.items, reel.owner || reel.user), t);
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
              let uName = firstReel.owner && firstReel.owner.username || firstReel.user && firstReel.user.username || (eThis.getStoryUsername ? eThis.getStoryUsername(firstReel, t) : instaUtils.generateRandomId());
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
                    id: it.id || instaUtils.generateRandomId(),
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
              let parsed = e.formatStoryItem(it, owner);
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
            let t = instaUtils.getActiveSection();
            if (!t) return;
            let n = document.querySelector(".promaster_ns_dl_all_btn");
            if (!n) return;
            let e = this.re(t);
            e > 1 ? (n.querySelector(".promaster_stories_count").innerText = `(${e})`, n.style.setProperty("display", "flex", "important")) : n.style.setProperty("display", "none", "important");
          },
          Yn: function (t, owner) {
            return this.formatStoryItem(t, owner);
          },
          Qn: function (t, n) {
            return this.normalizeStoryItems(t, n);
          },
          Xn: function () {
            return this.pauseStoryVideo();
          },
          Kn: function (t) {
            return this.injectStoryActionButtons(t);
          },
          te: function (t) {
            return this.fetchHighlightStories(t);
          },
          ne: function (t, n) {
            return this.fetchUserStories(t, n);
          },
          Vn: function (t, n) {
            return this.fetchStoriesForUser(t, n);
          },
          ie: function () {
            return this.updateStoryDownloadAllCount();
          }
        };
      }();
    }, (module, exports, require) => {
      const instaUtils = require(3),
        domHelpers = require(25),
        postDetailsResolver = require(21),
        taskQueue = require(26),
        mediaItemFormatter = require(22);
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
            saveAdvancedParams: function (t, cb) {
              chrome.storage.local.set({
                advanced_params: t
              }, function () {
                if (typeof cb === "function") cb(t);
              });
            },
            getAdvancedParams: function (t) {
              let n = this;
              chrome.storage.local.get("advanced_params", function (e) {
                e.advanced_params ? t(e.advanced_params) : n.saveAdvancedParams({
                  for_days: !0,
                  for_days_count: 30,
                  media_type: "all",
                  most_liked: !1,
                  most_liked_percent: 50,
                  most_viewed: !1,
                  most_viewed_percent: 50
                }, t);
              });
            },
            ve: function (t, cb) {
              return this.saveAdvancedParams(t, cb);
            },
            we: function (cb) {
              return this.getAdvancedParams(cb);
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
              i.openBulkDownloadModal();
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
            n.showLoaderModal({
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
            n.advancedParamsStorage.getAdvancedParams(function (e) {
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
                t.stopPropagation(), t.preventDefault(), n.advancedParamsStorage.saveAdvancedParams(e), n.startBulkDownload();
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
                s.showPreparingLinksModal({
                  progress: o
                }), setTimeout(u.bind(e, !1, n), a());
              }))) : n({
                success: 1
              });
            }
            s.showPreparingLinksModal({}, {
              cancelCallback: function () {
                e.resetDownloadState();
              }
            }), u();
          },
          getDownloadRangeOrAdvancedOptions: function (t) {
            if (this.isAdvancedMode) this.advancedParamsStorage.getAdvancedParams(function (n) {
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
            this.handleBackdropClick = this.handleBackdropClick.bind(this);
            this.modalElement = document.querySelector(".promaster_modal");
            this.modalElement || (this.modalElement = document.createElement("div"), this.modalElement.className = "promaster_modal", this.modalElement.innerHTML = '<div class="promaster_modal_content"></div>', document.querySelector("body").appendChild(this.modalElement));
            this.ze = this.modalElement;
            return this;
          }
          hideAndCleanup(t) {
            document.removeEventListener("click", this.handleBackdropClick);
            this.modalElement.remove();
            document.body.classList.remove("promaster-scroll-hidden");
            "function" == typeof t && t();
          }
          handleBackdropClick(t) {
            t.stopPropagation();
            t.target === this.modalElement && this.hideAndCleanup();
          }
          je(t) {
            return this.handleBackdropClick(t);
          }
          showModal() {
            this.modalElement.style.display = "block";
            document.body.classList.add("promaster-scroll-hidden");
            setTimeout(function () {
              const content = document.querySelector(".promaster_modal_content");
              if (content) content.style.opacity = "1";
            }, 100);
          }
          closeModal() {
            this.hideAndCleanup();
          }
          showPreparingLinksModal(t, n) {
            let e = this;
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
            let e = this;
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
            let n = this;
            if (n.modalElement.querySelector("#bulk_zipping") || (document.removeEventListener("click", n.handleBackdropClick), n.modalElement.innerHTML = `\n\t\t\t<div id="bulk_zipping" class="promaster_modal_content">\n\t\t\t\t<div class="promaster_modal_header">${chrome.i18n.getMessage("zipping_files")}...</div>\n\t\t\t\t<div class="promaster_count_header"></div>\n\t\t\t\t<div class="promaster_modal_progress">\n\t\t\t\t\t<div class="promaster_modal_progressbar"></div>\n\t\t\t\t</div>\n\t\t\t</div>`, n.progressBarElement = n.modalElement.querySelector(".promaster_modal_progressbar"), n.counterElement = n.modalElement.querySelector(".promaster_big_font_part"), n.showModal()), !n.counterElement || !n.progressBarElement) return;
            let r = t.progress || 0;
            n.counterElement.innerText = r + "%", n.progressBarElement.style.width = r + "%";
          }
          showCustomModal(t, n) {
            let e = this;
            this.modalElement.innerHTML = `\n\t\t<div class="promaster_modal_content">\n\t\t\t<span class="promaster_modal_close"></span>\n\t\t\t<div>${t}</div>\n\t\t</div>`;
            document.addEventListener("click", e.handleBackdropClick);
            let closeBtn = this.modalElement.querySelector(".promaster_modal_close");
            if (closeBtn) {
              closeBtn.addEventListener("click", function () {
                e.hideAndCleanup(n && n.cancelCallback);
              });
            }
            e.showModal();
          }
          showMessageModal(t, n) {
            return this.showCustomModal(t, n);
          }
          showErrorModal(t) {
            this.showCustomModal(`<div class="promaster_modal_message_container">${t}</div>`);
          }
          showLoaderModal(t) {
            this.modalElement.innerHTML = `\n\t\t<div class="promaster_modal_content">\n\t\t\t<div class="promaster_modal_loader" style="width:${t && t.width || 300}px;height:${t && t.height || 300}px;">\n\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t</div>\n\t\t</div>`;
            this.showModal();
          }
          Pe(t, n) {
            return this.showCustomModal(t, n);
          }
          Me(t) {
            return this.hideAndCleanup(t);
          }
          Le() {
            return this.showModal();
          }
          Se(t) {
            return this.showErrorModal(t);
          }
          $e(t) {
            return this.showLoaderModal(t);
          }
        };
      }();
    }, (module, exports, require) => {
      const domHelpers = require(25),
        fileSaver = require(28);
      module.exports = function () {
        return {
          isBusy: !1,
          createTaskQueue: function (options, taskWorker) {
            let queueController = this;
            const STATUS_PENDING = 0;
            const STATUS_SUCCESS = 1;
            const STATUS_ERROR = 2;
            let itemsQueue = options && options.data || [];
            let concurrencyLimit = options && options.asyncCount || 48;
            let isDone = false;
            let results = [];
            let totalCount = 0;
            let completedCount = 0;
            let pollTimer;
            let queueStatus = STATUS_PENDING;
            let promiseHandlers;
            const handleReject = function () {
              if (!isDone) {
                isDone = true;
                if (promiseHandlers && typeof promiseHandlers.reject === "function") {
                  promiseHandlers.reject(results);
                }
              }
            };
            const handleResolve = function () {
              if (promiseHandlers && typeof promiseHandlers.resolve === "function") {
                let resolvedData = results;
                setTimeout(function () {
                  try {
                    promiseHandlers.resolve(resolvedData);
                  } catch (err) {
                    results = err;
                    handleReject();
                  }
                }, 0);
              }
            };
            const startCompletionPolling = function () {
              if (!pollTimer) {
                pollTimer = setInterval(function () {
                  if (queueStatus !== STATUS_PENDING) {
                    clearInterval(pollTimer);
                    pollTimer = undefined;
                    if (queueStatus === STATUS_SUCCESS) {
                      handleResolve();
                    } else {
                      handleReject();
                    }
                  }
                }, 10);
              }
            };

            // Immediately start task scheduler
            (function startScheduler() {
              completedCount = 0;
              totalCount = itemsQueue.length;
              let runningTasks = 0;
              const createSuccessCallback = function (itemIndex) {
                return function (itemResult) {
                  if (Array.isArray(results) && queueStatus !== STATUS_ERROR) {
                    runningTasks--;
                    completedCount++;
                    results[itemIndex] = itemResult;
                    if (completedCount === totalCount) {
                      queueStatus = STATUS_SUCCESS;
                    }
                  }
                };
              };
              const handleTaskError = function (error) {
                queueStatus = STATUS_ERROR;
                results = error;
              };
              queueStatus = STATUS_PENDING;
              startCompletionPolling();
              let schedulerInterval = setInterval(function () {
                if (queueController.isBusy) return;
                if (!itemsQueue.length || queueStatus !== STATUS_PENDING) {
                  clearInterval(schedulerInterval);
                  return;
                }
                let availableSlots = concurrencyLimit - runningTasks;
                if (availableSlots < 1) return;
                itemsQueue.splice(0, availableSlots).forEach(function (taskItem, itemIndex) {
                  setTimeout(function () {
                    try {
                      runningTasks++;
                      taskWorker(taskItem, createSuccessCallback(itemIndex), handleTaskError);
                    } catch (err) {
                      results = err;
                      queueStatus = STATUS_ERROR;
                    }
                  }, 0);
                });
              }, 500);
            })();
            return {
              thenOne: function (onResolve, onReject) {
                promiseHandlers = {
                  resolve: onResolve,
                  reject: onReject
                };
                startCompletionPolling();
                return queueController;
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
    }, (module, exports) => {
      // Unused legacy JSZip bundle stub - removed to eliminate 3,140+ lines of dead code
      module.exports = {};
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
    }, (module, exports) => {
      module.exports = {};
    }, (module, exports) => {
      module.exports = {};
    }, (module, exports, require) => {
      const constants = require(4),
        domHelpers = require(25),
        uploadSessionManager = require(32);
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
                return t ? new domHelpers().showMessageModal(chrome.i18n.getMessage("reposted")) : new domHelpers().showMessageModal(chrome.i18n.getMessage("repost_error"));
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
      const fileSaver = require(28),
        instaUtils = require(3);
      const Insta_Utils = instaUtils;
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
                instaUtils.downloadFileViaBackground(t, n);
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
    taskQueue = e(26),
    octetStreamDownloader = e(34),
    graphqlDefinitions = e(9);
  let p = "";
  var uiController = {
    DOWNLOAD_BTN_CLASS: "promaster_dl_btn",
    REPOST_BTN_CLASS: "promaster_rpst_btn",
    handleStoryDownloadClick: function (t) {
      domExtractor.pauseStoryVideo(), uiController.buttonStateManager.showButtonLoader(t.target);
      let n = location.pathname.match(/stories\/([^\/]+)/);
      n = n && n[1], n ? domExtractor.fetchUserStories(n, function (n) {
        if (!n || !n.length) return void uiController.buttonStateManager.hideButtonLoader(t.target);
        let e = instaUtils.getStoriesCurrentIndex(),
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
            let e = instaUtils.getStoriesCurrentIndex();
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
        let e = instaUtils.getStoriesCurrentIndex();
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
      t && t.error && !t.hasAlt && (t = e.resolveAlternativeMedia(n)), octetStreamDownloader.downloadDirect(t, function (r) {
        if (r && r.err && t && t.hasAlt) return e.fallbackDownloadViaShortcode(t, n);
        e.buttonStateManager.hideButtonLoader(n);
        if (r && r.err) e.showDownloadError(n);
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
          if (o && (o.video_versions = o.video_versions && o.video_versions.sort(instaUtils.compareMediaDimensions) || null, o && o.video_versions.length && (t.url = o.video_versions[0].url || null, t.url))) return e.executeDownload(t, n);
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
      if (!n || typeof n.append !== "function") return;
      let e = document.createElement("div");
      e.innerHTML = `\n\t\t\t<div class="${this.DOWNLOAD_BTN_CLASS}" data-shortcode="${t.shortcode}">\n\t\t\t\t<span class="promaster_dl_pregress_loader"></span>\n\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("download")}</span>\n\t\t\t</div>`, t.isCarousel && e.firstElementChild.setAttribute("data-carousel", "1"), n.append(e.firstElementChild);
    },
    injectPostOverlayButtons: function (t, n, e) {
      if (!n || typeof n.closest !== "function" || typeof n.append !== "function") return;
      if (n.closest("article") && n.closest("article").querySelector('header [href*=""]')) return;
      let r = 5 === e || 7 === e ? "reels" : "feed",
        i = document.createElement("div");
      i.innerHTML = `\n\t\t\t\t<div class="${this.REPOST_BTN_CLASS}" data-shortcode="${t.shortcode}" data-dest="${r}" >\n\t\t\t\t\t<span class="promaster_icon"></span>\n\t\t\t\t\t<span class="promaster_text">${chrome.i18n.getMessage("repost")}</span>\n\t\t\t\t</div>`, t.isCarousel && i.firstElementChild.setAttribute("data-carousel", "1"), n.append(i.firstElementChild);
    },
    injectButtonsIfNotPresent: function (t, n, e = null) {
      if (!t || typeof t.getElementsByClassName !== "function") return;
      if (t.getElementsByClassName(uiController.DOWNLOAD_BTN_CLASS).length) return;
      let i,
        s = e,
        a = !1;
      if (1 === n) {
        i = t;
        const mediaList = Array.from(t.querySelectorAll("img, video")).filter(function (el) {
          return "img" !== el.nodeName.toLowerCase() || el.width > 200 && el.height > 200;
        });
        const videoEl = i.querySelector("video");
        if (videoEl) {
          let matched = this.findMatchingAncestor(videoEl, "a") || this.findMatchingAncestor(videoEl, "div", '[role*="button"]');
          t = matched && matched.parentNode ? matched.parentNode : (videoEl.closest("article") || videoEl.parentElement || i);
        } else if (mediaList.length && mediaList[0].parentElement) {
          let target = mediaList[0].parentElement;
          for (let lvl = 0; lvl < 3 && target && target.parentElement; lvl++) {
            target = target.parentElement;
          }
          t = target || mediaList[0].parentElement || i;
        } else {
          t = i;
        }
      } else if (2 === n || 5 === n || 6 === n) {
        i = t;
      } else if (3 === n) {
        i = t.querySelector(".EmbeddedMedia") || t;
      } else if (4 === n) {
        i = t;
        let pres = t.querySelector('div[role*="presentation"]');
        t = pres && pres.parentElement ? pres.parentElement : t;
        a = !0;
      } else if (7 === n) {
        s = "reels";
        let matched = this.findMatchingAncestor(t, "img") || this.findMatchingAncestor(t, "video");
        t = matched && matched.parentNode ? matched.parentNode : t;
      }
      if (!t || typeof t.append !== "function") return;
      if (!i && 7 !== n) return;
      if (!s) try {
        s = instaUtils.extractShortcodeFromElement(i);
      } catch (err) {}
      if (!s) return;
      let u = {
        shortcode: s,
        page_type: n,
        isCarousel: a
      };
      6 === n && (t.style.position = "relative");
      this.injectDownloadButton(u, t);
      this.injectPostOverlayButtons(u, t, n);
      if (t.dataset) t.dataset.ig_toolkit_marked = "1";
    },
    findMatchingAncestor: function (t, n, e = "") {
      if (!t || !n) return null;
      let r = t;
      const i = `${n}${e}`;
      try {
        for (; r;) {
          if (r.children && Array.from(r.children).some(child => {
            try {
              return child && typeof child.matches === "function" && child.matches(i);
            } catch (_) {
              return false;
            }
          })) return r;
          r = r.parentElement;
        }
      } catch (_) {}
      return null;
    },
    formatFilename: function (t, n, e = "") {
      return this.findMatchingAncestor(t, n, e);
    },
    Cr: function (t, n, e = "") {
      return this.findMatchingAncestor(t, n, e);
    },
    startDOMObserverAndInjectors: function () {
      function t() {
        let t = instaUtils.getActiveSection();
        t && (!t.dataset.ig_toolkit_marked && instaUtils.findStoriesContainer() && (t.dataset.ig_toolkit_marked = "1", domExtractor.injectStoryActionButtons(t)), domExtractor.updateStoryDownloadAllCount());
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
        "string" == typeof t && "handshake" === t ? e(!0) : "string" == typeof t && "isBulkDownloadNowInTab" === t ? e(bulkDownloadController.isDownloading) : "setDownloadingStatus" === t.action ? bulkDownloadController.isDownloading = t.options.status : t.action;
      });
    },
    initClickEventInterceptors: function () {
      const e = this;
      function n(t) {
        return t.target.classList.contains("promaster_btn_cancel") || t.target.classList.contains("promaster_btn_enough") || t.target.closest(".promaster_modal");
      }
      document.addEventListener("click", function (t) {
        if (t.target.classList.contains(uiController.DOWNLOAD_BTN_CLASS) || t.target.parentElement && t.target.parentElement.classList.contains(uiController.DOWNLOAD_BTN_CLASS)) {
          if (n(t)) return;
          uiController.handleReelsDownloadClick.call(e, t);
        } else if (t.target.classList.contains(uiController.REPOST_BTN_CLASS) || t.target.parentElement && t.target.parentElement.classList.contains(uiController.REPOST_BTN_CLASS)) {
          if (n(t)) return;
          uiController.handleAudioDownloadClick.call(e, t);
        }
        if (!instaUtils.isIframe()) {
          if (t.target.classList.contains("promaster_ns_dl_btn") || t.target.parentElement && t.target.parentElement.classList.contains("promaster_ns_dl_btn")) {
            if (n(t)) return;
            uiController.handleMediaDownloadClick.call(e, t);
          } else if (t.target.classList.contains("promaster_ns_rp_btn") || t.target.parentElement && t.target.parentElement.classList.contains("promaster_ns_rp_btn")) {
            if (n(t)) return;
            uiController.handleStoryDownloadClick.call(e, t);
          } else if (t.target.classList.contains("promaster_ns_dl_all_btn") || t.target.parentElement && t.target.parentElement.classList.contains("promaster_ns_dl_all_btn")) {
            if (n(t)) return;
            uiController.handleBulkDownloadClick.call(e, t);
          }
        }
      });
    },
    initPortConnection: function () {
      let t = this,
        n = chrome.runtime.connect(),
        e = !1,
        r = setTimeout(function () {
          n && (e = !0, n.disconnect()), t.initPortConnection();
        }, 295e3);
      n.onDisconnect.addListener(function () {
        e || (clearTimeout(r), t.initPortConnection());
      });
    },
    qr: function () {
      return this.initPortConnection();
    },
    Sr: function (t) {
      return this.resolveAlternativeMedia(t);
    },
    Er: function (t, n) {
      return this.fallbackDownloadViaShortcode(t, n);
    },
    Ar: function (t) {
      return this.showDownloadError(t);
    },
    br: function (t, n) {
      return this.executeDownload(t, n);
    },
    kr: function (t, n) {
      return this.extractMediaInfoFromElement(t, n);
    },
    Ur: function (t, n) {
      return this.injectDownloadButton(t, n);
    },
    Rr: function (t, n, e) {
      return this.injectPostOverlayButtons(t, n, e);
    },
    Br: function (t, n, e) {
      return this.injectButtonsIfNotPresent(t, n, e);
    },
    Dr: function () {
      return this.startDOMObserverAndInjectors();
    },
    Nr: function () {
      return this.initRuntimeMessageListener();
    },
    Tr: function () {
      return this.initClickEventInterceptors();
    },
    Fr: function () {
      return this.initContentScript();
    },
    mr: {
      _r: function (t) {
        uiController.buttonStateManager.showButtonLoader(t);
      },
      pr: function (t) {
        uiController.buttonStateManager.hideButtonLoader(t);
      }
    },
    lr: "promaster_dl_btn",
    hr: "promaster_rpst_btn",
    initContentScript: function () {
      instaUtils.polyfillNodeList(), this.initPortConnection(), this.startDOMObserverAndInjectors(), this.initRuntimeMessageListener(), this.initClickEventInterceptors(), graphqlDefinitions.initDocIds().catch(function () {});
    }
  };
  uiController.initContentScript();
})();