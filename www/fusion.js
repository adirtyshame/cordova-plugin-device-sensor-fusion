var argscheck = require('cordova/argscheck'),
  exec = require('cordova/exec'),
  utils = require('cordova/utils'),
  FusionResult = require('./FusionResult'),
  FusionError = require('./FusionError'),

  timers = {},
  fusion = {
    setMode: function (successCallback, errorCallback, options) {
      argscheck.checkArgs('fFO', 'fusion.setMode', arguments);
      
      var win = function (result) {
        successCallback(result);
      };
      
      var fail = function (code) {
        var ce = new FusionError(code);
        errorCallback(ce);
      };

      exec(win, fail, "SensorFusion", "setMode", [options.mode]);
    },
    getMode: function (successCallback, errorCallback, options) {
      argscheck.checkArgs('fFO', 'fusion.getMode', arguments);
      
      var win = function (result) {
        successCallback(result);
      };
      
      var fail = function (code) {
        var ce = new FusionError(code);
        errorCallback(ce);
      };

      exec(win, fail, "SensorFusion", "getMode", [options]);
    },
    getCurrentSensorFusion: function (successCallback, errorCallback, options) {
      argscheck.checkArgs('fFO', 'fusion.getCurrentSensorFusion', arguments);

      var win = function (result) {
        //var co = new FusionResult(result.x, result.y, result.z, result.w, result.timestamp);
        successCallback(result);
      };
      var fail = errorCallback && function (code) {
        errorCallback(code);
      };

      exec(win, fail, "SensorFusion", "getSensorFusion", [options]);
    },

    watchSensorFusion: function (successCallback, errorCallback, options) {
      argscheck.checkArgs('fFO', 'fusion.watchSensorFusion', arguments);
      // Default interval (100 msec)
      var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;

      var id = utils.createUUID();
      timers[id] = window.setInterval(function () {
        fusion.getCurrentSensorFusion(successCallback, errorCallback);
      }, frequency);

      return id;
    },

    clearWatch: function (id) {
      // Stop javascript timer & remove from timer list
      if (id && timers[id]) {
        clearInterval(timers[id]);
        delete timers[id];
      }
    }
  };

module.exports = fusion;