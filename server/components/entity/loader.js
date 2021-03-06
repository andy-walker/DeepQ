"use strict";

var coroutine = require('bluebird').coroutine;
var yaml      = require('js-yaml');
var _         = require('lodash');
var fs        = require('fs-promise');
var path      = require('path');
var Sequelize = require('sequelize');

module.exports = class EntityLoader {

    fromDirectory(directory) {

        var log = app.log;

        return coroutine(function*() {

            var associations = {};
            var files        = yield fs.readdirAsync(directory);
            
            for (let filename of files) {
                
                if (path.extname(filename) != '.yml')
                    continue;

                let yamlData = yield fs.readFileAsync(path.join(directory, filename));         
                let model;

                try {
                    model = yaml.load(yamlData);
                } catch (e) {
                    log.error(`Failed parsing model: ${filename}`);
                    continue;
                }

                if (!('name' in model))
                    model.name = path.basename(filename, '.yml');

                if (!('attributes' in model) || !Object.keys(model.attributes).length) {
                    log.error(`Failed parsing model: ${filename} - attributes section is mandatory.`);
                    continue;
                }

                // post process parsed yaml data
                for (let field in model.attributes) {
                    
                    if ('type' in model.attributes[field]) {
                        
                        let type = model.attributes[field].type;
                        
                        if (_.isObject(type)) {
                            
                            let keys = Object.keys(type);

                            if (keys.length > 1) 
                                log.warn(`Type definition for ${type} has multiple keys - defaulting to first.`);
                            
                            if (keys.length) {
                                let dataType = keys[0];
                                model.attributes[field].type = Sequelize[dataType](type[dataType]);
                            }

                        } else if (!(type in Sequelize)) {

                            log.warn(`Unknown type: Sequelize.${type} - defaulting to Sequelize.STRING`)
                            model.attributes[field].type = Sequelize.STRING;

                        } else if ((type == 'JSON' || type == 'JSONB') && app.entity.db.getDialect() != 'postgres') {

                            // emulate JSON fields for dialects other than postgres
                            let JsonField = require('sequelize-json');
                            model.attributes[field] = JsonField(app.entity.db, model.name, field);

                        } else {
                            model.attributes[field].type = Sequelize[type];  
                        }
                        
                    }
                    
                }

                if (!('options' in model))
                    model.options = {};

                if ('associations' in model)
                    associations[model.name] = model.associations;

                yield app.entity.create(model.name, model.attributes, model.options);

            }

            for (let name in associations)
                app.entity.createAssociation(name, associations[name]);

        })().catch(log.error);

    }

}