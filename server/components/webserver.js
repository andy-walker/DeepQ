/**
 * Webserver component
 */

"use strict";

var express   = require('express');
var webapp    = express();
var webserver = require('http').Server(webapp);
var Promise   = require('bluebird');
var path      = require('path');

var webroot = path.resolve(__dirname, '..', '..', 'client');

class Webserver {

    /**
     * Start webserver
     * @param config  configuration params for webserver
     * @returns {Promise}
     */
    start(config) {

        config = config || {};

        return new Promise((resolve, reject) => {

            var port  = 'port' in config ? config.port : 8095;
            var ip    = 'ip' in config ? config.ip : '0.0.0.0';
            var admin = app.config.get('admin'); 

            // Authentication callback
            webapp.use(function(req, res, next) {
                
                var auth;

                // bypass auth on /api requests
                if (req.url == '/api') {
                    next();
                    return;
                }

                // check whether an authorization header was sent   
                if (req.headers.authorization) {
                    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
                }

                if (!auth || auth[0] !== admin.authName || auth[1] !== admin.authPass) {
                    // if any of the tests failed ..
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="Please log in.."');
                    res.end('Unauthorized');
                } else {
                    // continue with processing, user was authenticated
                    next();
                }

            });

            webapp.use(express.static(webroot));

            webapp.get('/api', function(req, res) {
                res.send('OK:1');
            });

            webserver.listen(port, ip, 511, (error, result) => {
                
                if (error) {
                    app.log.error(error);
                    reject(error);
                } else {
                    app.log.info(`Listening for connections on port ${port}.`);
                    resolve();
                }

            });

        });

    }

}

module.exports = Webserver;