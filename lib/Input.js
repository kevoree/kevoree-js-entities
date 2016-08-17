'use strict';

var AbstractComponent = require('./AbstractComponent');

function Input(compInstance, portElem) {
  this.path = portElem.path();
  this.compInstance = compInstance;
  this.portElem = portElem;
  this.methodName = AbstractComponent.IN_PORT + this.portElem.name;

  if (typeof this.compInstance[this.methodName] === 'undefined') {
    throw new Error('Unable to find input port method \'' + this.methodName + '\' in component \'' + compInstance.name + '\'');
  }
}

Input.prototype = {
  call: function (msg, callback) {
    // convert msg to an array if it isn't already one
    msg = [].concat(msg);

    if (this.compInstance.started) {
      this.compInstance.log.debug(this.compInstance.toString(), 'Input port ' + this.portElem.path() + ' receiving "' + msg + '"');
      var result, error;
      try {
        result = this.compInstance[this.methodName].apply(this.compInstance, msg);
      } catch (err) {
        error = err;
        error.message = 'Input port ' + this.portElem.path() + ' method threw an exception';
      }
      callback(error, result);
    } else {
      // TODO store call ?
    }
  }
};

module.exports = Input;
