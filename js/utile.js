////////////////////////////////////////////////////
function format_T_Command(angle) {
  // var _angle = (angle / MICROSTEP).toFixed(0);
  var _angle = angle;
  if (_angle == 0) {
    return "+000";
  }
  if (_angle < 0 && _angle >= -9) {
    return "-00" + Math.abs(_angle);
  }
  if (_angle < -9 && _angle > -100) {
    return "-0" + Math.abs(_angle);
  }
  if (_angle < -100) {
    return "-" + Math.abs(_angle);
  }
  ///////////////////////////////////////////
  if (_angle > 0 && _angle <= 9) {
    return "+00" + Math.abs(_angle);
  }
  if (_angle > 9 && _angle < 100) {
    return "+0" + Math.abs(_angle);
  }
  if (_angle > 100) {
    return "+" + Math.abs(_angle);
  }
}
////////////////////////////////////////////////////