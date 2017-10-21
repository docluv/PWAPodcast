

self.addEventListener("install", function (event) {

    event.waitUntil(

        console.log("service worker installed")

    );

});

self.addEventListener("activate", function (event) {
    //on activate
    event.waitUntil(

        console.log("service worker activated")

    );

});


self.addEventListener("fetch", function (event) {

    console.log("service worker fetching!");

});


self.addEventListener("push", function (event) {

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    try {
        var episode = JSON.parse(event.data.text());

        const title = episode.title;
        const options = {
            body: 'Yay it works.',
            icon: 'img/pwa-podstr-logo-70x70.png',
            badge: 'img/pwa-podstr-logo-70x70.png',
            image: episode.image,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            actions: [{
                action: "listen",
                title: "Listen Now",
                icon: 'img/pwa-podstr-logo-70x70.png'
            },
            {
                action: "later",
                title: "Listen Later",
                icon: 'img/heart-logo.gif'
            }]
        };

        event.waitUntil(self.registration.showNotification(title, options));

    }
    catch (e) {
        console('invalid json - notification supressed');
    }

});

function listenToEpisode(notification){

    console.log("listen to episode");

}

function saveEpisodeForLater(notification){

    console.log("save episode for later");

}

self.addEventListener('notificationclick', function (event) {

    console.log('[Service Worker] Notification click Received. "${event}"');

    if(event.action === "listen"){

        listenToEpisode(event.notification);
        
    }else if(event.action === "later"){

        saveEpisodeForLater(event.notification);

    }

    event.notification.close();

})
