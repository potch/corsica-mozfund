/* Description:
*   Fetch the latest fundraising total, and display it all pretty like
*
* Author:
*    potch
*/

var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;


var request;
var template = fs.readFileSync(path.join(__dirname,'payload.html')).toString();

module.exports = function (corsica) {
  request = corsica.request;

  var url = 'https://d3gxuc3bq48qfa.cloudfront.net/eoy-2014-total';

  // corsica.serveRoute('funds', function (req, res) {
  //   request(url, function (error, response, body) {
  //     res.set('Content-Type', 'application/json');
  //     res.end(body);
  //   });
  // });
  //
  
  corsica.on('fundraising', function(msg) {
    template = fs.readFileSync(path.join(__dirname,'payload.html')).toString();
    return new Promise(function(resolve, reject) {
      request(url, function (error, response, body) {
        if (error) {
          console.log('aw peas.');
          return;
        }
        corsica.sendMessage('content', {
          type: 'html',
          screen: msg.screen,
          content: template.replace('{{ amount }}', JSON.parse(body).sum|0)
        });
      });
    });
  });
};
