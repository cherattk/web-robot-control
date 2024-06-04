
/////////////////////////////////////////////////////////////////
const GEAR_RATIO = 4.5; // 90/20

const MOTOR_STEP_ANGLE = 1.8 / 2;

const MICROSTEP = 0.9;

const POS_LIMIT = {
  x: { max: 300, min: 70 },
  z: { max: 210, min: -70 },
  y: { max: 0, min: 0 }
};
const X_BRAS_LENGTH = 210;
const Z_BRAS_LENGTH = 190;
const HOME_POSITION = { x: X_BRAS_LENGTH, z: Z_BRAS_LENGTH, y: 0 };
var ACTUAL_POSITION = { x: HOME_POSITION.x, z: HOME_POSITION.z, y: HOME_POSITION.y };

const HOME_ANGLE = getAbsolutePositionAngle(HOME_POSITION.x, HOME_POSITION.z, HOME_POSITION.y);
var ACTUAL_ANGLE = {
  A: HOME_ANGLE.A,
  B: HOME_ANGLE.B,
  C: HOME_ANGLE.C
};

const INPUT_X = document.getElementById('num-input-x');
INPUT_X.value = X_BRAS_LENGTH;
INPUT_X.min = POS_LIMIT.x.min;
INPUT_X.min = POS_LIMIT.x.min;
//
const INPUT_Z = document.getElementById('num-input-z');
INPUT_Z.value = Z_BRAS_LENGTH;
INPUT_Z.max = POS_LIMIT.z.max;
INPUT_Z.min = POS_LIMIT.z.min;
//
const INPUT_Y = document.getElementById('num-input-y');
INPUT_Y.max = POS_LIMIT.y.max;
INPUT_Y.min = POS_LIMIT.y.min;

///////////////////////////////////////////////////////////


function getRobotAngle(anglePos) {
  //////////////////////////////////////////////
  // Adapter l'angle en fonction de la 
  // postition initiale des bras du robot
  //////////////////////////////////////////////
  return {
    A: 90 - anglePos.A,
    B: anglePos.B,
    C: anglePos.C
  }
}

function getAbsolutePositionAngle(X, Z, Y) {
  // Calcul L3
  var L3 = Math.sqrt(Math.pow(Z, 2) + Math.pow(X, 2));
  var theta1 = Math.atan(Z / X);
  var theta2 = Math.acos((Math.pow(L3, 2) + Math.pow(Z_BRAS_LENGTH, 2) - Math.pow(X_BRAS_LENGTH, 2)) / (2 * L3 * Z_BRAS_LENGTH));
  // Calcul A
  var A = theta1 + theta2;
  // calcul B
  // var B = Math.acos( ( X - (Math.cos(A) * Z_BRAS_LENGTH) ) / X_BRAS_LENGTH )  ;
  var B = Math.asin(((Math.sin(A) * Z_BRAS_LENGTH) - Z) / X_BRAS_LENGTH);
  // calcul C
  var C = 0;

  /////////////////////////////////////////////////////////
  // Conversion Degres
  /////////////////////////////////////////////////////////
  var A_deg = ((theta1 + theta2) * (180 / 3.14));
  var B_deg = (B * (180 / 3.14));
  var C_deg = (C * (180 / 3.14));
  return {
    A: A_deg,
    B: B_deg,
    C: C_deg
  }
}

function checkPositionLimits(next_pos, axe) {
  return (next_pos > POS_LIMIT[axe].min && next_pos < POS_LIMIT[axe].max);
}

function calculMarginalPosition(next_pos, axe) {
    console.log('ACTUAL_POSITION : ', ACTUAL_POSITION);
    console.log('ACTUAL_ANGLE : ', ACTUAL_ANGLE);
    //////////////////////////////////////////////////////////////
    var nextPosition = Object.assign({}, ACTUAL_POSITION);
    ///////////////////////////////////////////////////////////////
    nextPosition[axe] = next_pos;
    ///////////////////////////////////
    var abs_nextAngle = getAbsolutePositionAngle(nextPosition.x, nextPosition.z, nextPosition.y);
    console.log('next abs angle : ', abs_nextAngle);

    // var robotArmAngle = {
    //   A: ACTUAL_ANGLE.A - abs_nextAngle.A,
    //   B: ACTUAL_ANGLE.B - abs_nextAngle.B,
    //   C: ACTUAL_ANGLE.C - abs_nextAngle.C
    // }
    var robotArmAngle = {
      A: (90 - abs_nextAngle.A) - (90 - ACTUAL_ANGLE.A), 
      B: abs_nextAngle.B - ACTUAL_ANGLE.B,
      C: abs_nextAngle.C - ACTUAL_ANGLE.C 
    }
    //////////////////////////////////////////////////
    ACTUAL_POSITION = Object.assign({}, nextPosition);
    ACTUAL_ANGLE = Object.assign({}, abs_nextAngle);
    ///////////////////////////////////////////////////
    // var moveAngle = getRobotAngle(nextAngle);
    console.log('Marginal Angle A | B | C : ', robotArmAngle);
    return robotArmAngle;
  
}