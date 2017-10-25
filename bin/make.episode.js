var SiteModule = require("./site.module"),
    utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    _ = require("lodash"),
    sizeOf = require('image-size'),
    mustache = require("mustache"),
    stripBom = require("strip-bom"),
    url = require('url'),
    http = require('http'),
    https = require('https'),
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

        this.makePageJSON(episodeObj);

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

    transformToPage(srcObj) {

        srcObj.published = srcObj.pubdate;

        srcObj = _.assignIn(this.getDefaultPage(), srcObj);

        utils.createFile(path.resolve("../data/pages/episodes/",
            srcObj.slug + ".json"),
            JSON.stringify(srcObj), true);

    }

    makePageJSON(srcObj) {

        srcObj.slug = utils.makeSlug(srcObj.title);

        if(srcObj.slug === "episode-title"){
            return;
        }
        
        var self = this,
            method = http;

        if (typeof srcObj.image === "object") {
            srcObj.image = srcObj.image.url;
        }

        if (srcObj.image) {

            let options = url.parse(srcObj.image);

            if (options.protocol) {

                if (options.protocol === "https:") {
                    method = https;
                } else {
                    method = http;
                }

                console.log("srcObj.slug: ", srcObj.slug);
                
                method.get(options, function (response) {

                    var chunks = [];

                    response.on('data', function (chunk) {

                        chunks.push(chunk);

                    }).on('end', function () {

                        let buffer = Buffer.concat(chunks);

                        let dimensions = sizeOf(buffer);

                        srcObj.image = {
                            "url": srcObj.image,
                            "width": dimensions.width,
                            "height": dimensions.height
                        };

                        self.transformToPage(srcObj);

                    });

                });

            } else {

                srcObj.image = {
                    "url": srcObj.image,
                    "width": 310,
                    "height": 310
                };

                self.transformToPage(srcObj);
                
            }

        } else {

            self.transformToPage(srcObj);

        }

    }

}


module.exports = EpisodeModule;