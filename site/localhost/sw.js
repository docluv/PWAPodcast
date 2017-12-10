

self.addEventListener("install", event => {

    event.waitUntil(

        console.log("service worker installed")

    );

});

self.addEventListener("activate", event => {
    //on activate
    event.waitUntil(

        console.log("service worker activated")

    );

});


self.addEventListener("fetch", event => {

    console.log("service worker fetching!");

});


self.addEventListener("push", event => {

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    try {
        //        var episode = JSON.parse(event.data.text());

        const title = "1. Start Here to Build a Career in Web Development";
        const options = {
            body: 'Yay it works.',
            icon: 'img/pwa-podstr-logo-70x70.png',
            badge: 'img/pwa-podstr-logo-70x70.png',
            image: '"http://i1.sndcdn.com/avatars-000227802710-27eerh-original.jpg"',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            actions: [{
                action: "listen",
                title: "Listen Now",
                icon: 'img/listen-now.png'
            },
            {
                action: "later",
                title: "Listen Later",
                icon: 'img/listen-later.png'
            }]
        };

        event.waitUntil(self.registration.showNotification(title, options));

    }
    catch (e) {
        console('invalid json - notification supressed');
    }

});

self.addEventListener("pushsubscriptionchange", event => {

    console.log("subscription change ", event);


});

function makeSlug(src) {

    if (typeof src === "string") {

        return src.replace(/ +/g, "-")
            .replace(/\'/g, "")
            .replace(/[^\w-]+/g, "")
            .replace(/-+/g, "-")
            .toLowerCase();

    }

    return "";

}

function listenToEpisode(notification) {

    console.log("listen to episode: ", notification.title);

    clients.openWindow('/episode/' + makeSlug(notification.title));

}

function saveEpisodeForLater(notification) {

    console.log("save episode for later");

}

function persistEpisode(episode, result){

    //store in IDB
    
}

function getEpisode(episode) {

    if (episode.link) {

        var self = this;

        fetch(episode.link)
            .then(function (response) {

                return response.blob();

            }).then(function (result) {

                persistEpisode(episode, result);

            })
            .catch(function (err) {
                console.log('Episode Fetch Error :-S', err);
            });

    }

}

self.addEventListener('notificationclick', event => {

    console.log('[Service Worker] Notification click Received. "${event}"');

    if (event.action === "listen") {

        listenToEpisode(event.notification);

    } else if (event.action === "later") {

        saveEpisodeForLater(event.notification);

    }

    event.notification.close();

});

self.addEventListener('sync', function (event) {

    if (event.tag == 'get-episode') {
//        event.waitUntil(getEpisode());
    }

});
