/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var argscheck = require('cordova/argscheck'),
  exec = require('cordova/exec'),
  utils = require('cordova/utils'),
  FusionResult = require('./FusionResult'),

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
        var co = new FusionResult(result.x, result.y, result.z, result.w, result.timestamp);
        successCallback(co);
      };
      var fail = errorCallback && function (code) {
        errorCallback(code);
      };

      // Get heading
      exec(win, fail, "SensorFusion", "getSensorFusion", [options]);
    },

    /**
     * Asynchronously acquires the heading repeatedly at a given interval.
     * @param {Function} successCallback The function to call each time the heading
     * data is available
     * @param {Function} errorCallback The function to call when there is an error
     * getting the heading data.
     * @param {HeadingOptions} options The options for getting the heading data
     * such as timeout and the frequency of the watch. For iOS, filter parameter
     * specifies to watch via a distance filter rather than time.
     */
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

    /**
     * Clears the specified heading watch.
     * @param {String} watchId The ID of the watch returned from #watchHeading.
     */
    clearWatch: function (id) {
      // Stop javascript timer & remove from timer list
      if (id && timers[id]) {
        clearInterval(timers[id]);
        delete timers[id];
      }
    }
  };

module.exports = fusion;