'use strict';

var KevoreeEntity = require('./KevoreeEntity');

/**
 * AbstractComponent entity
 *
 * @class
 */
var AbstractComponent = KevoreeEntity.extend({
    toString: 'AbstractComponent',

    /**
     * @constructs
     */
    construct: function () {
        this.inputs = {};
    },

    addInternalInputPort: function (port) {
        this.inputs[port.getPath()] = port;
        if (typeof(this[AbstractComponent.IN_PORT+port.getName()]) === 'undefined') {
            throw new Error('Unable to find provided port \''+AbstractComponent.IN_PORT+port.getName()+'\' (Function defined in class?)');
        } else {
          port.setInputPortMethodName(AbstractComponent.IN_PORT+port.getName());
        }
    },

    addInternalOutputPort: function (port) {
        this[AbstractComponent.OUT_PORT+port.getName()] = function (msg, callback) {
            port.processSend(msg+'', callback);
        };
    },

    removeInternalInputPort: function (port) {
        delete this.inputs[port.getPath()];
    },

    removeInternalOutputPort: function (port) {
        this[AbstractComponent.OUT_PORT+port.getName()] = function () {}; // reset function binding to an empty one
    }
});

AbstractComponent.IN_PORT = 'in_';
AbstractComponent.OUT_PORT = 'out_';

module.exports = AbstractComponent;
