var EpisodesModule = require("./make.episodes");
var PodcastsModule = require("./make.podcasts");

/*
var episodes = new EpisodesModule("../data/syntax/accepting-money-on-the-internet-.json",
    "../site/src/html/templates/episode.html");

episodes.render("../data/", "../data/pages/");
*/

//PodcastsModule.render();
PodcastsModule.transformPodcasts();



