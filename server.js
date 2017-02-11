/**
 * RL Agent Server
 * @author andyw@home, 11/02/2017
 */
 
 "use strict";

var app        = {};
var Components = {
	DB:     require('./server/components/db'),
	Config: require('./server/components/config'),
	Server: require('./server/components/webserver'),
	Zoo:    require('./server/components/zoo')
};

app.config = new Components.Config();
app.db     = new Components.DB();
app.server = new Components.Server();
app.zoo    = new Components.Zoo();

require('bluebird').coroutine(function*() {

	var success = app.config.load();

})().catch(app.log.error);