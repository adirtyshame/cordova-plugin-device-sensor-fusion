/**
 *  FusionError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var FusionError = function(err) {
    this.code = (err !== undefined ? err : null);
};

FusionError.FUSION_INTERNAL_ERR = 0;
FusionError.FUSION_NOT_SUPPORTED = 20;

module.exports = FusionError;