var page = require('webpage').create();
var system = require('system');
var path = system.args[1] || '/';
page.open('http://localhost:5000'+path, function(status) {
  if (status == 'success') {
    var linkList = page.evaluate(function() {
      var nodeList = document.getElementsByTagName('a');
      return Array.prototype.map.call(nodeList, function(n){
        return n.getAttribute('href');
      });
    });
    var pageData = {
      linkList: linkList,
      content: page.frameContent,
      url: page.frameUrl,
    };
    console.log(JSON.stringify(pageData));
  } else {
    console.log('null');
  }
  page.close();
  phantom.exit();
});