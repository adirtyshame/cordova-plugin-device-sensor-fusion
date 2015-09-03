var FusionResult = function(x, y, z, w, timestamp) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  this.timestamp = timestamp || new Date().getTime();
};

module.exports = FusionResult;
