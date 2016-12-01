'use strict';

const Good = require('good'),
  GoodFile = require('good-file'),
  Hapi = require('hapi'),
  Inert = require('inert'),
  Vision = require('vision');
/**
 * Construct the server
 */
const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
      log: true
    },
    router: {
      stripTrailingSlash: true
    }
  }
});


/**
 * Create the connection
 */
server.connection({
  port: process.env.PORT || 4000

});


server.register([Inert, Vision], function (err) {
  if (err)
    console.log("Inert or Vision plugin failed, it will stop swagger");
});



//Static file serving - if you want to serve static files - keep all your static (html/js/etc.) inside below given path folder
server.route({
  method: 'get',
  path: '/{param*}',
  handler: {
    directory: {
      path: __dirname + '/www',
      listing: true
    }
  }
});

/**
 * Add logging
 */
server.register({
  register: Good

}, function (err) {
  if (err)
    throw new Error(err);
  console.log(__dirname);
  console.log('registered Good for logging with reporters');
});



/**
 * Start the server
 */

server.start(function (err) {
  if (err)
    throw new Error(err);
  console.log('server started!');
  const summary = server.connections.map(function (cn) {
    return {
      labels: cn.settings.labels,
      uri: cn.info.uri
    };
  });
  console.log('server', 'started: ' + JSON.stringify(summary));
});

module.exports = server;
