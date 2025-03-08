(function () {
    // ✅ Auto-Detect Website Name
    const siteName = document.title || "My PWA App";

    // ✅ Auto-Detect Website Favicon
    let favicon = document.querySelector("link[rel~='icon']");
    let iconURL = favicon ? favicon.href : "https://via.placeholder.com/192";

    // ✅ HTML को Auto-Inject कर रहे हैं
    document.body.innerHTML = `
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <img src="${iconURL}" width="100" height="100" style="border-radius:20px;">
            <h1 style="color:#ff5722;">Welcome to ${siteName}</h1>
            <p>Install this app for a better experience!</p>
            <button id="installButton" style="
                display:none; position:fixed; bottom:20px; left:50%;
                transform:translateX(-50%); padding:10px 20px;
                background:#ff5722; color:white; border:none;
                border-radius:5px; cursor:pointer; font-size:16px;">
                Install ${siteName}
            </button>
        </div>
    `;

    // ✅ Install Prompt Logic (Auto-Detect)
    let deferredPrompt;
    const installButton = document.getElementById("installButton");

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = "block";
    });

    installButton.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
                if (choice.outcome === "accepted") {
                    console.log("PWA Installed");
                    installButton.style.display = "none";
                }
            });
        }
    });

    // ✅ Manifest को Auto-Inject कर रहे हैं
    const manifest = {
        "name": siteName,
        "short_name": siteName,
        "description": `${siteName} - PWA Web App`,
        "start_url": "/",
        "display": "standalone",
        "background_color": "#121212",
        "theme_color": "#ff5722",
        "icons": [
            { "src": iconURL, "sizes": "192x192", "type": "image/png" },
            { "src": iconURL, "sizes": "512x512", "type": "image/png" }
        ]
    };

    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);
    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = manifestURL;
    document.head.appendChild(manifestLink);

    // ✅ Service Worker (Offline Support)
    const swCode = `
        const CACHE_NAME = "pwa-cache-v1";
        const urlsToCache = ["/", "${iconURL}"];

        self.addEventListener("install", event => {
            event.waitUntil(
                caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
            );
        });

        self.addEventListener("fetch", event => {
            event.respondWith(
                caches.match(event.request).then(response => response || fetch(event.request))
            );
        });

        self.addEventListener("activate", event => {
            event.waitUntil(
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.map(cache => {
                            if (cache !== CACHE_NAME) return caches.delete(cache);
                        })
                    );
                })
            );
        });
    `;

    // ✅ Service Worker को Register करने के लिए Auto-Inject
    const swBlob = new Blob([swCode], { type: "text/javascript" });
    const swURL = URL.createObjectURL(swBlob);
    
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(swURL).then(() => {
            console.log("Service Worker Registered");
        }).catch((error) => {
            console.log("Service Worker Error:", error);
        });
    }
})();
