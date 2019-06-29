( function () {

    "use strict";

    var srcFiles = [];

    var fileName = "155 - How Building a Rockstar Team Helped Nate Ginsburg To Grow a Million Dollar Amazon Business_1.mp3";
    //"3 reasons to use a CDN.mp4";


    function initialize() {

        getCapacity();
        saveAudioFile();
    }

    function getCapacity() {

        if ( "storage" in navigator &&
            "estimate" in navigator.storage ) {

            navigator.storage.estimate()
                .then( function ( estimate ) {

                    var $usage = document.querySelector( ".storage-usage" ),
                        $capacity = document.querySelector( ".storage-capacity" );

                    $usage.innerText = estimate.usage / 1000000;
                    $capacity.innerText = estimate.quota / 1000000;

                } );
        }

    }

    function saveAudioFile() {

        fetch( "data/" + fileName )
            .then( function ( response ) {

                if ( response.ok ) {

                    localforage.setItem( fileName, response.blob() )
                        .then( function ( obj ) {

                            if ( obj ) {
                                console.log( "file peresisted" );

                                playAudio();
                                //playVideo();

                            } else {
                                console.error( "file not persisted" );
                            }

                        } ).catch( function ( err ) {
                            // This code runs if there were any errors
                            console.error( err );
                        } );
                }

            } )
            .catch( function ( error ) {
                console.error( error );
            } );

    }

    function playVideo() {

        localforage.getItem( fileName )
            .then( function ( value ) {

                // Create and revoke ObjectURL
                var vidURL = URL.createObjectURL( value );

                // Set vid src to ObjectURL

                var $video = document.querySelector( "[name='test-video']" );

                $video.setAttribute( "src", vidURL );

            } ).catch( function ( err ) {
                // This code runs if there were any errors
                console.error( err );
            } );

    }

    function playAudio() {

        localforage.getItem( fileName )
            .then( function ( value ) {

                // Create and revoke ObjectURL
                var audioURL = URL.createObjectURL( value );

                // Set vid src to ObjectURL

                var $video = document.querySelector( "[name='test-audio']" );

                $video.setAttribute( "src", audioURL );

            } ).catch( function ( err ) {
                // This code runs if there were any errors
                console.error( err );
            } );

    }

    initialize();

} )();