
function getPositionAngle(X, Z, Y) {

  const L1 = 20;
  const L2 = 20;


  // Calcul L3
  var L3 = Math.sqrt((Z * Z) + (X * X));
  var theta1 = Math.atan(Z / X);
  var theta2 = Math.acos( ( (L3 * L3) + (L1 * L1) - (L2 * L2) ) / (2 * L3 * L1));
  // Calcul A
  var A = theta1 + theta2;  
  // calcul B
  var B = Math.acos( ( X - (Math.cos(A) * L1) ) / L2 )  ;
  // calcul C
  var C = 0;
  
  /////////////////////////////////////////////////////////
  // Conversion Degres
  /////////////////////////////////////////////////////////
  var A_deg = ((theta1 + theta2) * (180 / 3.14) ).toFixed(0);
  var B_deg = (B * (180 / 3.14) ).toFixed(0);
  var C_deg = (C * (180 / 3.14)).toFixed(0);

  //////////////////////////////////////////////
  // Adapter l'angle en fonction de la 
  // position initiale des bras du robot
  //////////////////////////////////////////////
  var _A = 90 - A_deg;
  var _B = B_deg;

  return {
    A_deg: _A,
    B_deg: _B,
    C_deg: C_deg
  }
}