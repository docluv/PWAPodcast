var SiteModule = require("./site.module"),
    utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    _ = require("lodash"),
    mustache = require("mustache"),
    stripBom = require("strip-bom"),
    utf8 = 'utf-8';


class EpisodeModule extends SiteModule {

    constructor(src, template, defaultEpisode) {

        super("EpisodeModule", template);

        this.defaultEpisode = defaultEpisode ||
            utils.readJSONFile("default.episode.json");

        this.src = src;

    }

    render() {

        var episodeObj = _.assignIn(this.getDefaultEpisode(), this.getEpisode());

        episodeObj.body = mustache.render(this.template, episodeObj);

        return this.episode = episodeObj;

    }


    getDefaultEpisode() {

        if (this.defaultEpisode) {

            return this.defaultEpisode;

        }

        this.defaultEpisode = utils.readJSONFile("default.episode.json");

        return this.defaultEpisode;

    }

    getEpisode() {

        if (this._episode) {

            return this._episode;

        }

        this._episode = utils.readJSONFile(this.src);

        return this._episode;

    }

    generatePageJSON(srcObj) { }

}


module.exports = EpisodeModule;