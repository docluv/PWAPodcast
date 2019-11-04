( function () {

    var listenLater = document.querySelector( ".btn-listen-later" );

    if ( listenLater ) {

        listenLater.addEventListener( "click", function ( evt ) {

            var guid = listenLater.getAttribute( "data-id" );

            if ( guid ) {
                saveEpisodeData( guid );
            }

        } );

    }

    function saveEpisodeData( guid ) {

        var episodeSource = "api/episodes/" + guid + ".json";

        fetch( episodeSource )
            .then( function ( response ) {

                if ( response && response.ok ) {

                    var resp = response.clone();

                    caches.open( "LISTEN_LATER" ).then(
                        cache => {

                            cache.put( episodeSource, response );

                        } );

                    resp.json()
                        .then( function ( episode ) {

                            saveEpisodeAudio( episode.src );

                        } );

                }

            } );

    }

    function saveEpisodeAudio( src ) {

        fetch( src, {
                mode: "no-cors"
            } )
            .then( function ( response ) {

                if ( response && [ 0, 200 ].includes( response.status ) ) {

                    localforage.setItem( src, response.blob() );

                }

            } );

    }


} )();