/**
 * Webserver component
 */

"use strict";

var express    = require('express');
var bodyParser = require('body-parser');
var webapp     = express();
var webserver  = require('http').Server(webapp);
var Promise    = require('bluebird');
var coroutine  = Promise.coroutine;
var path       = require('path');

var webroot = path.resolve(__dirname, '..', '..', 'client');
var AjaxAPI = require('./webserver/ajax');
var RestAPI = require('./webserver/rest');

class Webserver {

    /**
     * Constructor
     */
    constructor() {
        this.ajax = new AjaxAPI();
        this.rest = new RestAPI();
    }

    /**
     * Start webserver
     * @param config  configuration params for webserver
     * @returns {Promise}
     */
    start(config) {

        var server = this;
        config     = config || {};

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

            webapp.use(bodyParser.json());
            webapp.use(express.static(webroot));

            webapp.get('/api/act',    server.rest.agentAct);
            webapp.get('/api/reward', server.rest.rewardAgent);
            
            webapp.post('/ajax/agent/delete', server.ajax.deleteAgent);
            webapp.post('/ajax/agent/load',   server.ajax.loadAgent);
            webapp.post('/ajax/agent/save',   server.ajax.saveAgent);
            webapp.post('/ajax/agent/search', server.ajax.searchAgents);
            
            // define a route handler for exporting agents
            webapp.get('/export/:name', function(request, response) {
                
                return coroutine(function*() {

                    var name   = request.params.name;
                    var result = yield app.deepq.exportAgent(name);

                    if (result instanceof Error)
                        return response.send(JSON.stringify({
                            status: 'error',
                            message: result.message
                        }));

                    response.send(JSON.stringify(result));

                })().catch(app.log.error);  

            });

            // start web server ..
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