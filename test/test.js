'use strict';

var should = require('should'),
    jsxgettext = require('../'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    pj = require('path').join;

var createVinyl = function (jadeFileName, contents) {
    var base = pj(__dirname, 'fixtures');
    var filePath = pj(base, jadeFileName);

    return new gutil.File({
        cwd: __dirname,
        base: 'fixtures/',
        path: 'fixtures/example.jade',
        contents: contents || fs.readFileSync(filePath)
    });
}

describe('gulp-jsxgettext', function () {
    describe('in buffer mode', function () {
        
        it('should extract translation strings from given jade template', function (done) {
        
            var jadeFile = createVinyl('example.jade');
            
            var stream = jsxgettext();
            stream.once('data', function (potFile) {
                should.exist(potFile);
                should.exist(potFile.path);
                should.exist(potFile.relative);
                should.exist(potFile.contents);

                //ignore the header
                var result = potFile.contents.toString('utf8');
                result = result.slice(result.indexOf('\n\n') + 2);
                
                result.should.equal(
                    fs.readFileSync(pj(__dirname, 'expect/jade.pot'), 'utf8'));
                done();
            });
            stream.write(jadeFile);
            stream.end();
        });
        //
        //it('should create json object without converting variable names to camelcase', function(done) {
        //
        //    var lessFile = createVinyl('variables.less');
        //    
        //    var stream = less({
        //        camelCase: false
        //    });
        //    stream.once('data', function (jsonFile) {
        //        String(jsonFile.contents).should.equal(
        //            fs.readFileSync(pj(__dirname, 'expect/variablesWithoutCamelcase.json'), 'utf8'));
        //        done();
        //    });
        //    stream.write(lessFile);
        //    stream.end();
        //    
        //});
        //
        //it('should create json object omitting prefixed variables', function(done) {
        //
        //    var lessFile = createVinyl('prefixedVariables.less');
        //
        //    var stream = less({
        //        ignoreWithPrefix: 'prefix_'
        //    });
        //    stream.once('data', function (jsonFile) {
        //        String(jsonFile.contents).should.equal(
        //            fs.readFileSync(pj(__dirname, 'expect/prefixedVariables.json'), 'utf8'));
        //        done();
        //    });
        //    stream.write(lessFile);
        //    stream.end();
        //
        //});
        
    });
});