'use strict';

var KevoreeEntity = require('./KevoreeEntity');

/**
 * AbstractChannel entity
 *
 * @class
 */
var AbstractChannel = KevoreeEntity.extend({
  toString: 'AbstractChannel',

  /**
   * @constructs
   */
  construct: function () {
    this.inputs = {};
  },

  /**
   * @param {String} outputPath
   * @param {String} msg
   * @param {Function} callback
   */
  internalSend: function (outputPath, msg, callback) {
    var paths = [];
    for (var inputPath in this.inputs) {
      if (this.inputs.hasOwnProperty(inputPath)) {
        var model = this.getKevoreeCore().getCurrentModel();
        if (model) {
          var port = model.findByPath(inputPath);
          if (port) {
            var comp = port.eContainer();
            if (comp && comp.started) {
              // do not send message to stopped component
              paths.push(inputPath);
            }
          }
        }
      }
    }

    if (this.started) {
      this.log.debug(this.toString(), '');
      this.onSend(outputPath, paths, msg + '', callback);
    }
  },

  /**
   * Method to override in channels implementation to provide a way
   * to dispatch messages to the different connected input ports
   *
   * @param {String} fromPortPath
   * @param {Array} destPortPaths Array
   * @param {String} msg
   * @param {Function} callback
   *
   * @abstract
   */
  onSend: function () {},

  /**
   * Dispatch messages to all bound ports
   *
   * @param msg
   * @param {Function} [callback]
   */
  localDispatch: function (msg, callback) {
    // if no callback given, then prevent exception to be thrown
    callback = callback || function () {};

    for (var path in this.inputs) {
      this.inputs[path].call(msg, callback);
    }
  },

  /**
   * Returns this channel output port paths
   * @returns {Array}
   */
  getOutputs: function () {
    var outputs = [];

    var chan = this.getModelEntity();
    if (chan) {
      chan.bindings.array.forEach(function (binding) {
        if (binding.port && binding.port.getRefInParent() === 'required') {
          if (binding.port.eContainer().eContainer().name === this.getNodeName()) {
            if (outputs.indexOf(binding.port.path()) === -1) {
              outputs.push(binding.port.path());
            }
          }
        }
      }.bind(this));
    }

    return outputs;
  },

  /**
   * Returns this channel input port paths
   * @returns {Array}
   */
  getInputs: function () {
    var inputs = [];

    var chan = this.getModelEntity();
    if (chan) {
      chan.bindings.array.forEach(function (binding) {
        if (binding.port && binding.port.getRefInParent() === 'provided') {
          if (binding.port.eContainer().eContainer().name === this.getNodeName()) {
            if (inputs.indexOf(binding.port.path()) === -1) {
              inputs.push(binding.port.path());
            }
          }
        }
      }.bind(this));
    }

    return inputs;
  },

  /**
   *
   * @param port
   */
  addInputPort: function (port) {
    this.inputs[port.path] = port;
  },

  /**
   *
   * @param port
   */
  removeInputPort: function (port) {
    delete this.inputs[port.path];
  }
});

module.exports = AbstractChannel;
