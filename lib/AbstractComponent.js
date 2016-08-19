'use strict';

var KevoreeEntity = require('./KevoreeEntity');
var Input = require('./Input');
var Output = require('./Output');

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
    this.outputs = {};

    var comp = this.getModelEntity();
    comp.provided.array.forEach(function (port) {
      this.inputs[port.path()] = new Input(this, port);
    }.bind(this));
    comp.required.array.forEach(function (port) {
      this.outputs[port.path()] = new Output(this, port);
    }.bind(this));
  }
});

AbstractComponent.IN_PORT = 'in_';
AbstractComponent.OUT_PORT = 'out_';

module.exports = AbstractComponent;
