
/////////////////////////////////////////////////////////////////
var PressCount = 0;

const HOME_POSITION = { x: 20, z: 20, y: 0 };
const POS_LIMIT = {
  x: { max: 30, min: 5 },
  z: { max: 20, min: 0 },
  y: { max: 0, min: 0 }
};

var ACTUAL_POSITION = { x : HOME_POSITION.x , z : HOME_POSITION.z , y : HOME_POSITION.y};

$('#home-position').click(function () {
  ACTUAL_POSITION = { x : HOME_POSITION.x , z : HOME_POSITION.z , y : HOME_POSITION.y};
});

var PressTimeStart = 0;
var PressTimeEnd = 0;
var mousedownID = -1;  //Global ID of mouse down interval
function clearMouseDonwInterval(event) {
  if (mousedownID != -1) {  //Only stop if exists
    clearInterval(mousedownID);
    mousedownID = -1;
    PressTimeEnd = Date.now();
    // console.log(PressTimeEnd);
    // console.log(Math.floor((PressTimeEnd - PressTimeStart) / 1000));
    // console.log(PressCount);
    // PressCount = 0;
  }
}

function format_T_Command(angle){
  if(angle == 0){
    return "+00";
  }
  if(angle < 0 && angle >= -9){
    return "-0" + Math.abs(angle);
  }
  if(angle < -9){
    return "-" + Math.abs(angle);
  }
  if(angle > 0 && angle <= 9){
    return "+0" + Math.abs(angle);
  }
  if(angle > 9){
    return "+" + Math.abs(angle);
  }
}

function calculPosition(e) {
  var pos = e.currentTarget.value;
  var axe = e.currentTarget.dataset.axe;
  var _pos = ACTUAL_POSITION[axe] + parseInt(pos);
  if (_pos > POS_LIMIT[axe].min && _pos < POS_LIMIT[axe].max) {
    ACTUAL_POSITION[axe] = _pos;
    console.log('ACTUAL_POSITION : ', ACTUAL_POSITION);
    var anglePos = getPositionAngle(ACTUAL_POSITION.x, ACTUAL_POSITION.z, ACTUAL_POSITION.y);
    console.log('angle absolute A | B | C :', anglePos.A, "|" + anglePos.B, "|" + anglePos.C);
    //////////////////////////////////////////////
    // Adapter l'angle en fonction de la 
    // postition initiale des bras du robot
    //////////////////////////////////////////////
    var angle_a = 90 - anglePos.A;
    var angle_b = anglePos.B;
    var angle_c = anglePos.C;
    ///////////////////////////////////
    // Format ANGLE as Arduino Command
    ///////////////////////////////////
    angle_a = format_T_Command(angle_a);
    angle_b = format_T_Command(angle_b);
    angle_c = format_T_Command(angle_c);

    var dataPosition = `T${angle_a}${angle_b}${angle_c}`;
    console.log("Angles Relatifs : ", dataPosition);
    console.log("=====================================");
  }
  else {
    console.log('out of reach : ', ACTUAL_POSITION[axe]);
  }



}

ManualControl.find('button').on('click', function (e) {
  calculPosition(e);
});

// ManualControl.find('button').on('mousedown', function (e) {
//   // calculPosition(e);
//   if (mousedownID == -1) {  //Prevent multimple loops!
//     mousedownID = setInterval(function () {
//       calculPosition(e);
//       // writeToSerialPort(moveData);
//     }, COMMAND_PUSH_DELAY /*execute every ms*/);
//   }
// });

ManualControl.find('button').on('mouseup', function (e) {
  clearMouseDonwInterval();
});

//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", function (e) {
  clearMouseDonwInterval();
});

///// cirlcle control ****************/
(function () {
  $(document).ready(function () {
    var is_dragging;
    is_dragging = false;
    // $(document).on("mousedown touchstart", ".circle", function(e) {
    $('#rotation-control').on("mousedown touchstart", ".circle", function (e) {
      return is_dragging = true;
    });
    // $(document).on("mouseup touchend", function(e) {
    $('#rotation-control').on("mouseup touchend", function (e) {
      return is_dragging = false;
    });
    // return $(window).on("mousemove touchmove", function(e) {
    return $('#rotation-control').on("mousemove touchmove", function (e) {
      var angle, center_x, center_y, circle, delta_x, delta_y, pos_x, pos_y, touch;
      if (is_dragging) {
        circle = $(".circle");
        touch = void 0;
        if (e.originalEvent.touches) {
          touch = e.originalEvent.touches[0];
        }
        center_x = ($(circle).outerWidth() / 2) + $(circle).offset().left;
        center_y = ($(circle).outerHeight() / 2) + $(circle).offset().top;
        pos_x = e.pageX || touch.pageX;
        pos_y = e.pageY || touch.pageY;
        delta_y = center_y - pos_y;
        delta_x = center_x - pos_x;
        angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI); // Calculate Angle between circle center and mouse pos
        angle -= 90;
        if (angle < 0) {
          angle = 360 + angle; // Always show angle positive
        }
        angle = Math.round(angle);
        $("#rotation-dot").css("transform", "rotate(" + angle + "deg)");
        return $("#rotation-value").html(angle + "deg");
      }
    });
  });

}).call(this);
/****************** */
