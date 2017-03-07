/**
 * DeepQ - a server for training RL agents
 * @author andyw@home, 11/02/2017
 */
 
"use strict";

require('./server/lib/rl.js');

var Component = {
    
    Config:    require('./server/components/config'),
    Entities:  require('./server/components/entities'),
    Server:    require('./server/components/webserver'),
    DeepQ:     require('./server/components/deepq')

};

class AgentServer {

    /**
     * Constructor
     */
     constructor() {

        this.log = require('winston');
        this.dir = __dirname;

        this.config = {};
        this.db     = {};
        this.server = {};
        this.deepq  = {};

     }

     /**
      * Start application
      */
     start() {

        var log = this.log;

        log.info('Starting server ...');

        // instantiate components
        this.config = new Component.Config();
        this.entity = new Component.Entities();
        this.server = new Component.Server();
        this.deepq  = new Component.DeepQ();

        // start components
        require('bluebird').coroutine(function*(app) {

            var success = yield app.config.load();

            // abort startup if config was not successfully loaded
            if (!success)
                return;

            var webconfig = app.config.get('server');

            if (!webconfig)
                log.warn('No server configuration was defined in config.yml, using defaults.');
              
            yield app.entity.initialize();
            yield app.server.start(webconfig);

        })(this).catch(log.error);

     }

}

global.app = new AgentServer();
app.start();
