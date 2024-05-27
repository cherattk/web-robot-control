
function getPositionAngle(X, Z, Y) {

  const L1 = 20;
  const L2 = 20;

  // Calcul L3
  var L3 = Math.sqrt(Math.pow(Z,2) + Math.pow(X , 2));
  var theta1 = Math.atan(Z / X);
  var theta2 = Math.acos( ( Math.pow(L3,2) + Math.pow(L1 , 2) - Math.pow(L2 , 2) ) / (2 * L3 * L1));
  // Calcul A
  var A = theta1 + theta2;
  // calcul B
  // var B = Math.acos( ( X - (Math.cos(A) * L1) ) / L2 )  ;
  var B = Math.asin( ( (Math.sin(A) * L1) - Z ) / L2 )  ;
  // calcul C
  var C = 0;
  
  /////////////////////////////////////////////////////////
  // Conversion Degres
  /////////////////////////////////////////////////////////
  var A_deg = ((theta1 + theta2) * (180 / 3.14) ).toFixed(0);
  var B_deg = (B * (180 / 3.14) ).toFixed(0);
  var C_deg = (C * (180 / 3.14)).toFixed(0);

  return {
    A: A_deg,
    B: B_deg,
    C: C_deg
  }
}