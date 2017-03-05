/**
 * Manager object for agents
 */

"use strict";

var coroutine = require('bluebird').coroutine;
var Agent     = require('./agent');

module.exports = class DeepQ {
    
    /**
     * Constructor
     */
    constructor() {
        this.agent = {};
    }

    /**
     * Train or just run the specified agent (depending on spec)
     * @param {string} name    the name of the agent to run
     * @param {Array}  input   the input to pass it
     * @returns {int | Error}  the action if successful, or an Error object
     */
    act(name, input) {

        return coroutine(function*(deepq) {
            
            if (!(name in deepq.agent)) {

                let exists = yield deepq.agentExists(name);

                if (!exists)
                    return new Error(`The agent '${name}' does not exist.`);

                let loaded = yield deepq.loadAgent(name);

                if (!loaded)
                    return new Error(`The agent '${name}' could not be loaded.`);

            }

            var agent  = deepq.agent[name];
            var states = agent.getEnv().states;

            if (input.length != states)
                return new Error(`The agent '${name}' expects ${states} inputs (${input.length} supplied)`);

            return deepq.agent[name].act(input);

        })(this).catch(app.log.error); 

    }

    /**
     * Check if the specified agent exists in the database
     */
    agentExists(name) {

        return coroutine(function*() {

            var model  = app.entity.model.agent;
            var record = yield model.findOne({
                where: { name: name }
            });

            if (!record)
                return false;

            return true;

        })().catch(app.log.error);        

    }

    exportAgent(name) {

        return coroutine(function*(deepq) {
            
            if (!(name in deepq.agent)) {

                let exists = yield deepq.agentExists(name);

                if (!exists)
                    return new Error(`The agent '${name}' does not exist.`);

                let loaded = yield deepq.loadAgent(name);

                if (!loaded)
                    return new Error(`The agent '${name}' could not be loaded.`);

            }

            var agent = deepq.agent[name];

            return {

                name:  agent.name,
                env:   agent.getEnv(),
                spec:  agent.getSpec(),
                brain: agent.brain.toJSON()

            };

        })(this).catch(app.log.error); 
    
    }

    /**
     * Load an agent from the database
     * @param {string} name
     * @returns {bool}
     */
    loadAgent(name) {

        return coroutine(function*(deepq) {

            var agent  = new Agent(name);
            var loaded = yield agent.load();

            if (!loaded)
                return false;

            deepq.agent[name] = agent;
            return true;

        })(this).catch(app.log.error);

    }

    rewardAgent(name, reward) {
        
        return coroutine(function*(deepq) {
            
            if (!(name in deepq.agent))
                return new Error(`The agent '${name}' is not loaded`);

            var agent = deepq.agent[name];
            agent.reward(reward);
            yield agent.save();
            return true;

        })(this).catch(app.log.error);

    }

    saveAgent(name) {

        return coroutine(function*(deepq) {
            
            if (!(name in deepq.agent))
                return new Error(`The agent '${name}' is not loaded`);

            var result = yield deepq.agent[name].save();
            return result;

        })(this).catch(app.log.error);        

    }

    /**
     * Update the spec of a loaded agent, say if the spec was changed via the UI
     */
    updateAgentSpec(name, spec) {
        
        if (name in this.agent)
            this.agent[name].spec = spec;

    }

}
