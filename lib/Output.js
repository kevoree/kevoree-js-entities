'use strict';

var AbstractComponent = require('./AbstractComponent');

function Output(compInstance, portElem) {
  this.path = portElem.path();
  this.channels = {};

  var fieldName = AbstractComponent.OUT_PORT + portElem.name;

  if (typeof compInstance[fieldName] === 'undefined') {
    throw new Error('Unable to find output port field \'' + fieldName + '\' in component \'' + compInstance.name + '\'');
  } else {
    var self = this;
    compInstance[fieldName] = function internalSend(msg, callback) {
      var channelPaths = Object.keys(self.channels);
      if (channelPaths.length > 0) {
        compInstance.log.debug(compInstance.toString(), 'Output port ' + portElem.path() + ' sending "' + msg + '" to:');
      } else {
        compInstance.log.debug(compInstance.toString(), 'Output port ' + portElem.path() + ' sending "' + msg + '" to no channel. Port is not connected.');
      }
      channelPaths.forEach(function (chanPath) {
        compInstance.log.debug(compInstance.toString(), ' -> ' + chanPath);
        self.channels[chanPath].internalSend(portElem.path(), msg, callback);
      });
    };
  }
}

Output.prototype = {
  addChannel: function (chanInstance) {
    this.channels[chanInstance.path] = chanInstance;
  },

  removeChannel: function (chanInstance) {
    delete this.channels[chanInstance.path];
  }
};

module.exports = Output;