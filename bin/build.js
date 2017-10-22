var EpisodeModule = require("./make.episode");



var episode = new EpisodeModule("../data/syntax/accepting-money-on-the-internet-.json",
    "../site/src/html/templates/episode.html");

console.log(episode.render());


