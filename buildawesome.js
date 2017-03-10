#!/usr/bin/env node

var execFileSync = require('child_process').execFileSync;

var outputFileSync = require('fs-extra').outputFileSync;
var spawn = require('child_process').spawn;
var join = require('path').join;

var server = spawn('serve', ['-s', 'build']);

var scrapedPaths = [];

var linkPrefix = require('./package.json').homepage.split('github.io/')[1];
console.log('yey', linkPrefix);

function scrapePath(path) {
  if (scrapedPaths.indexOf(path) !== -1) {
    return;
  }
  scrapedPaths.push(path);
  var scraped = JSON.parse(execFileSync('phantomjs', ['./scrape.js', path]));
  var url = scraped.url;
  var scrapedPath = url.split('http://localhost:5000')[1];
  if (scrapedPath !== path) {
    return;
  }
  var buildPath = path.split('/'+linkPrefix)[1];
  var htmlPath = join('build', buildPath, 'index.html');
  console.log('Writing output to '+htmlPath);
  outputFileSync(htmlPath, scraped.content);
      console.log('mhmm1 ', scraped.linkList);

  if (scraped.linkList) {
    scraped.linkList.map(function(link) {
      console.log('mhmm ', link);
      if (link.indexOf('/'+linkPrefix+'/') === 0) {
        scrapePath('/' + link.split('/'+linkPrefix+'/')[1]);
      }
    });
  }
}

scrapePath('/'+linkPrefix)
server.kill();
