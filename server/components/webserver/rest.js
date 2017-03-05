/**
 * Manager object for rest api requests
 */

"use strict";

var coroutine = require('bluebird').coroutine;

module.exports = class RestAPI {

    agentAct(request, response) {

        return coroutine(function*() {

            var agent = request.query.agent;
            var input = request.query.input;

            input = input.split('/');

            var result = yield app.deepq.act(agent, input);

            if (result instanceof Error)
                response.send('ERROR:' + result.message);
            else
                response.send('OK:' + result);


        })().catch(app.log.error);

    }

    rewardAgent(request, response) {

        return coroutine(function*() {

            var agent  = request.query.agent;
            var reward = request.query.value;

            var result = yield app.deepq.rewardAgent(agent, reward);

            if (result instanceof Error)
                response.send('ERROR:' + result.message);
            else
                response.send('OK:1');


        })().catch(app.log.error);        

    }

}
