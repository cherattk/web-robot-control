
$('#form-numeric-pos').on('submit' , function(e){
  e.preventDefault();

  var x_pos = parseInt(e.currentTarget.elements['x_pos'].value);
  var z_pos = parseInt(e.currentTarget.elements['z_pos'].value);
  var y_pos = parseInt(e.currentTarget.elements['y_pos'].value);
  
  var anglePos = getPositionAngle(x_pos , z_pos , y_pos);

  if(Number.isNaN(anglePos.A_deg)) return alert(' A angle Error');
  if(Number.isNaN(anglePos.B_deg)) return alert(' B Angle Error');
  if(Number.isNaN(anglePos.C_deg)) return alert(' C Angle Error');

  var dataPosition = `A${anglePos.A_deg}${anglePos.B_deg}${anglePos.C_deg}`;
  console.log('A command : ' , dataPosition);
  // writeToSerialPort(moveData);
});