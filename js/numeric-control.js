
$('#form-numeric-pos').on('submit' , function(e){
  e.preventDefault();

  var x_pos = parseInt(e.currentTarget.elements['x_pos'].value);
  var z_pos = parseInt(e.currentTarget.elements['z_pos'].value);
  var y_pos = parseInt(e.currentTarget.elements['y_pos'].value);
  
  var absoluteAngle = getAbsolutePositionAngle(x_pos , z_pos , y_pos);

  // var robotArmAngle = {
  //   A: (90 - absoluteAngle.A) - (90 - ACTUAL_ANGLE.A), 
  //   B: absoluteAngle.B - ACTUAL_ANGLE.B,
  //   C: absoluteAngle.C - ACTUAL_ANGLE.C 
  // }
  var robotArmAngle = {
    A: (90 - absoluteAngle.A), 
    B: absoluteAngle.B ,
    C: absoluteAngle.C  
  }
  //////////////////////////////////////////////////
  var nextPosition = {x : x_pos , z : z_pos , y : y_pos};
  ACTUAL_POSITION = Object.assign({}, nextPosition);
  ACTUAL_ANGLE = Object.assign({}, absoluteAngle);
  ///////////////////////////////////////////////////
  var num_angle_a = ((robotArmAngle.A * GEAR_RATIO) / MOTOR_STEP_ANGLE ).toFixed(0);
  var num_angle_b = ((robotArmAngle.B * GEAR_RATIO) / MOTOR_STEP_ANGLE).toFixed(0);
  var num_angle_c = (robotArmAngle.C).toFixed(0) ;
  ///////////////////////////////////////////////////
  var angle_a = format_T_Command(num_angle_a);
  var angle_b = format_T_Command(num_angle_b);
  var angle_c = format_T_Command(num_angle_c);
  ///////////////////////////////////////////////////
  console.log('Absolute Angle A | B | C : ', robotArmAngle);
  ///////////////////////////////////////////////////
  var dataPosition = `T${angle_a}${angle_b}${angle_c}`;
  console.log('command : ', dataPosition);
  // writeToSerialPort(dataPosition);
});