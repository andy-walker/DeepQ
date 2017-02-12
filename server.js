/**
 * RL Agent Server
 * @author andyw@home, 11/02/2017
 */
 
 "use strict";

var Component = {
    //DB:     require('./server/components/db'),
    Config: require('./server/components/config')//,
    //Server: require('./server/components/webserver'),
    //Zoo:    require('./server/components/zoo')
};

class AgentServer {

    /**
     * Constructor
     */
     constructor() {

        this.log = require('winston');

        this.config = {};
        this.db     = {};
        this.server = {};
        this.zoo    = {};

     }

     /**
      * Start application
      */
     start() {

        var log = this.log;

        log.info('Starting server ...');

        this.config = new Component.Config();
        /*
        this.db     = new Component.DB();
        this.server = new Component.Server();
        this.zoo    = new Component.Zoo();
        */

        this.server = new Component.Server();

        require('bluebird').coroutine(function*(app) {

            var success = yield app.config.load();

            // abort startup if config was not successfully loaded
            if (!success)
                return; 

        })(this).catch(log.error);


     }

}

global.app = new AgentServer();
app.start();
