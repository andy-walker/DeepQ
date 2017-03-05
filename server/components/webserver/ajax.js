/**
 * Manager object for ajax requests from web client
 */

"use strict";

var coroutine = require('bluebird').coroutine;

module.exports = class AjaxAPI {
    
    /**
     * Delete an agent from the database
     */
    deleteAgent(request, response) {

    }

    /**
     * Load agent from the database / prepare edit form
     */
    loadAgent(request, response) {

        return coroutine(function*() {

            var result, defaults;
            
            if ('name' in request.body && request.body.name) {
                
                var model = app.entity.model.agent;
                var agent = yield model.findOne({
                    where: { name: request.body.name }
                });

                if (agent) {

                    result = {
                        status: 'ok',
                        result: agent
                    };

                } else {
                    
                    result = {
                        status:  'error',
                        message: `Agent '${request.body.id}' not found.` 
                    };

                }

            } else {
                
                defaults = app.config.get('defaults');

                result = {
                    status: 'ok',
                    result: {
                        name: '',
                        spec: defaults.spec,
                        env:  defaults.env
                    }
                }

            }

            response.send(JSON.stringify(result));

        })().catch(app.log.error);

    }

    /**
     * Save agent config to the database
     */
    saveAgent(request, response) {

        return coroutine(function*() {

            var result = {};

            if ('form' in request.body) {

                var form  = request.body.form;
                var model = app.entity.model.agent;

                try {
                    var agent = yield model.upsert({
                        name: form.name,
                        spec: form.spec,
                        env:  form.env
                    });
                } catch (e) {
                    result = {
                        status: 'error',
                        message: e.message
                    };
                }

                result = {
                    status: 'ok'
                };

            } else {
                result = {
                    status:  'error',
                    message: 'No data to save'
                };
            }

            response.send(JSON.stringify(result));

        })().catch(app.log.error);        

    }

    /**
     * Search for agents in the database 
     */
    searchAgents(request, response) {
        
        return coroutine(function*() {

            var result = {};

            if ('query' in request.body) {

                var model = app.entity.model.agent;

                // get search query and split into keywords
                var query = request.body.query;

                try {

                    var results = yield model.findAll({
                        where: {
                            name: {
                                $like: `%${query}%`
                            }
                        }
                    });

                    result = {
                        status:  'ok',
                        results: results.map(function(result) {
                            return {
                                name: result.name
                            };
                        })
                    };

                } catch (e) {
                    result = {
                        status: 'error',
                        message: e.message
                    };
                }

            } else {
                result = {
                    status:  'error',
                    message: 'No data to save'
                };
            }

            response.send(JSON.stringify(result));

        })().catch(app.log.error);

    }

}
