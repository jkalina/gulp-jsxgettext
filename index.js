'use strict';

var through2 = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    assign = require('object-assign'),
    jsxgettext = require('jsxgettext'),
    jade = require('jsxgettext/lib/parsers/jade').jade,

    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-jsxgettext';

module.exports = function (options) {

    options = assign({}, {
        compress: false,
        paths: []
    }, options);

    return through2.obj(function (file, enc, cb) {

        gutil.log(file.base);
        
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }


        var str = file.contents.toString(),
        //opts = assign({}, options);
            opts = {keyword: ['gettext', '_']},
            filename = file.path,
            sources = {};
        
            sources[filename] = str;
            var result = jsxgettext.generate.apply(jsxgettext, jade(sources, opts));


        file.contents = new Buffer(result);
        cb(null, file);

    });
};