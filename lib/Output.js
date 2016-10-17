'use strict';

var PREFIX = 'out_';

function Output(compInstance, portElem) {
  this.path = portElem.path();
  this.channels = {};

  var fieldName = PREFIX + portElem.name;

  if (typeof compInstance[fieldName] === 'undefined') {
    throw new Error('Unable to find output port field \'' + fieldName + '\' in component \'' + compInstance.name + '\'');
  } else {
    var self = this;
    var mixin = {};
    mixin[fieldName] = function internalSend(msg, callback) {
      this._super(msg, callback);
      var channelPaths = Object.keys(self.channels);
      if (channelPaths.length > 0) {
        this.log.debug(compInstance.toString(), 'Output port ' + portElem.path() + ' sending "' + msg + '" to:');
      } else {
        this.log.debug(compInstance.toString(), 'Output port ' + portElem.path() + ' sending "' + msg + '" to no channel. Port is not connected.');
      }
      channelPaths.forEach(function (chanPath) {
        compInstance.log.debug(compInstance.toString(), ' -> ' + chanPath);
        self.channels[chanPath].internalSend(portElem.path(), msg, callback);
      });
    };
    compInstance.mixin(mixin);
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
module.exports.PREFIX = PREFIX;
