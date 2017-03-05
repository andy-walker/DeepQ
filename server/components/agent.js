/**
 * Container class for an agent instance
 */

"use strict";

var coroutine = require('bluebird').coroutine;

module.exports = class {

    /**
     * Constructor
     */
    constructor(name) {
        
        this.name    = name;
        this.env     = {};
        this.spec    = {};
        this.brain   = {};
        this.changed = false;

    }

    act(input) {

        var action = this.brain.act(input);
        this.changed = true;
        return action;

    }

    delete() {
        
    }

    getBrain() {
        return this.brain.toJSON();
    }

    getEnv() {
        return this.env;
    }

    getSpec() {
        return this.spec;
    }

    /**
     * Load the agent from the database 
     */
    load() {

        return coroutine(function*(agent) {

            var model  = app.entity.model.agent;
            var record = yield model.findOne({
                where: { name: agent.name }
            });

            if (!record)
                return false;

            agent.spec = record.spec;
            agent.env  = record.env;

            // temporary - get this to return the real number of states / actions
            agent.env.getNumStates = function() { return 8; };
            agent.env.getMaxNumActions = function() { return 4; };

            agent.brain = new RL.DQNAgent(agent.env, agent.spec);
            
            if (record.brain)
                agent.brain.fromJSON(record.brain);

            return true;

        })(this).catch(app.log.error);

    }

    reward(value) {
        this.brain.learn(parseFloat(value));
        this.changed = true;
    }

    save() {

        return coroutine(function*(agent) {

            var model = app.entity.model.agent;
            var env   = agent.getEnv();
            var spec  = agent.getSpec();
            var brain = agent.getBrain();

            model.upsert({
                name: agent.name,
                env: {
                    states:  env.states,
                    actions: env.actions
                },
                spec:  spec,
                brain: brain
            });

            agent.changed = false;

        })(this).catch(app.log.error);

    }

    setBrain(brain) {
        this.brain.fromJSON(brain);
        this.changed = true;
    }

    setEnv(env) {
        this.env = env;
        this.changed = true;
    }

    setSpec(spec) {
        this.spec = spec;
        this.changed = true;
    }

}