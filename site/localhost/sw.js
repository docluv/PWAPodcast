/*eslint-env es6, serviceworker */
/*global client, self */

"use strict";

/*
Constants used in the functions to ensure consistency
Adjust values to fit your desired naming and time frame conventions.
*/
const VERSION = "v1.02",
    PRECACHE_NAME = "pre-cache",
    // CACHE_MANIFEST = "cache-manifest.json",
    // CACHE_MANIFEST_KEY = "cache-manifest",
    // PRECACHE_KEY = "precache-assets",
    DYNAMIC_CACHE_NAME = "dynamic-cache",
    MP3_CACHE_NAME = "episode-mp3-cache",
    DYNAMIC_CACHE_MAX = 20,
    PRECACHE_URLS = [
        "css/libs/bootstrap.min.css",
        "https://fonts.googleapis.com/css?family=Oswald:300,400",
        "http://localhost:57662/css/libs/font-awesome.min.css",
        "http://localhost:57662/css/libs/font-awesome.min.css",
        "https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,600,700,800",
        "https://fonts.googleapis.com/css?family=Open+Sans+Condensed:700",
        "http://localhost:57662/css/app/site.css",
        "img/pwa-podstr-logo-144x70.png",
        "js/app/app.bootstrap.js",
        "js/libs/jquery.small.js",
        "js/libs/index.js",
        "js/libs/collapse.js",
        "js/libs/util.js",
        "js/app/app.js",
        "js/app/podcast.js",
        "js/app/podcasts.js",
        "js/app/config.js",
        "js/app/contact.js",
        "js/app/home.js",
        "js/libs/mustache.min.js",
        "js/app/search.js"
    ];
//    IDB_NAME = "sw_cache",
//    URL_CACHE_DB = "url-meta-cache",
//    CACHE_UPDATE_TTL_KEY = "cache-manifest-ttl",
//for development I recommend 1 minute or less ;)
//   PRECACHE_UPDATE_TTL = 1000; //1000 * 60 * 60 * 24; //1 day, can adjust to your desired time frame


function cacheName( key ) {
    return key + "-" + VERSION;
}

self.addEventListener( "install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open( PRECACHE_NAME )
        .then( cache => {

            PRECACHE_URLS.forEach( url => {

                fetch( url ).then( function ( response ) {

                    if ( !response.ok ) {
                        throw new TypeError( 'bad response status - ' + response.url );
                    }
                    return cache.put( url, response );
                } );

            } );

        } )

    );

} );

self.addEventListener( "activate", event => {

    event.waitUntil(

        caches.keys().then( cacheNames => {

            cacheNames.forEach( value => {

                if ( value.indexOf( VERSION ) < 0 ) {
                    caches.delete( value );
                }

            } );

            return;
        } )
    );

} );

self.addEventListener( "fetch", event => {

    let request = event.request;
    const destination = getDestination( event.request );

    //    if ( !destination || destination === "" ) {

    console.log( "fetch url: ", event.request.url );
    console.log( "destination: ", destination );

    //    }

    event.respondWith(

        fetch( event.request )

        // caches.match( event.request ).then(
        //     response => {

        //         return response || fetch( event.request ).then(
        //             response => {

        //                 let cacheResp = response.clone();

        //                 for ( var pair of response.headers.entries() ) {
        //                     console.log( "header - " + pair[ 0 ] + ': ' + pair[ 1 ] );
        //                 }

        //                 //only cache is the status is OK & not a chrome-extension URL
        //                 if ( [ 0, 200 ].includes( response.status ) &&
        //                     request.url.indexOf( "chrome-extension" ) ) {

        //                     caches.open( cacheName( DYNAMIC_CACHE_NAME ) ).then(
        //                         cache => {

        //                             cache.put( event.request, cacheResp );

        //                         } );

        //                 }

        //                 return response;
        //             }
        //         )

        //     } )

        /* end responseWith */

    );

} );

self.addEventListener( "push", event => {

    console.log( '[Service Worker] Push Received.' );
    console.log( `[Service Worker] Push had this data: "${event.data.text()}"` );

    let data = JSON.parse( event.data );

    try {
        //        var episode = JSON.parse(event.data.text());

        const title = "1. Start Here to Build a Career in Web Development";
        const options = {
            body: data.body,
            icon: 'img/pwa-podstr-logo-70x70.png',
            badge: 'img/pwa-podstr-logo-70x70.png',
            image: '"http://i1.sndcdn.com/avatars-000227802710-27eerh-original.jpg"',
            vibrate: data.vibrate,
            actions: [ {
                    action: "listen",
                    title: "Listen Now",
                    icon: 'img/listen-now.png'
                },
                {
                    action: "later",
                    title: "Listen Later",
                    icon: 'img/listen-later.png'
                }
            ]
        };

        event.waitUntil( self.registration.showNotification( title, options ) );

    } catch ( e ) {
        console( 'invalid json - notification supressed' );
    }

} );

self.addEventListener( "pushsubscriptionchange", event => {

    console.log( "subscription change ", event );


} );

function extensionToDestination( ext ) {

    switch ( ext ) {
        case "mp3":

            return "audio";

        case "mp4":
        case "ogg":

            return "video";

        case "gif":
        case "jpg":
        case "jpeg":
        case "png":
        case "webp":

            return "image";

        default:

            return "";
    }

}

function getDestination( request ) {

    if ( request.destination ) {
        return request.destination;
    }

    let url = new URL( request.url );

    let ext = url.pathname.split( "." );

    ext = ext[ ext.length - 1 ];

    return extensionToDestination( ext );

}

function makeSlug( src ) {

    if ( typeof src === "string" ) {

        return src.replace( / +/g, "-" )
            .replace( /\'/g, "" )
            .replace( /[^\w-]+/g, "" )
            .replace( /-+/g, "-" )
            .toLowerCase();

    }

    return "";

}

function listenToEpisode( notification ) {

    console.log( "listen to episode: ", notification.title );

    clients.openWindow( '/episode/' + makeSlug( notification.title ) );

}

function saveEpisodeForLater( notification ) {

    console.log( "save episode for later" );

}

function persistEpisode( episode, result ) {

    //store in IDB

}

function getEpisode( episode ) {

    if ( episode.link ) {

        var self = this;

        fetch( episode.link )
            .then( function ( response ) {

                return response.blob();

            } ).then( function ( result ) {

                persistEpisode( episode, result );

            } )
            .catch( function ( err ) {
                console.log( 'Episode Fetch Error :-S', err );
            } );

    }

}

self.addEventListener( 'notificationclick', event => {

    console.log( '[Service Worker] Notification click Received. "${event}"' );

    if ( event.action === "listen" ) {

        listenToEpisode( event.notification );

    } else if ( event.action === "later" ) {

        saveEpisodeForLater( event.notification );

    }

    event.notification.close();

} );

self.addEventListener( 'sync', event => {

    if ( event.tag === "get-episode" ) {
        //        event.waitUntil(getEpisode());
    }

} );