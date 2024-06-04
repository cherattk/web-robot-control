

var PressCount = 0;
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

$('#home-position').click(function () {

  ////////////////////////////////////////////////
  var move_angle_a = ACTUAL_ANGLE.A - HOME_ANGLE.A;
  var move_angle_b = ACTUAL_ANGLE.B - HOME_ANGLE.B;
  var move_angle_c = ACTUAL_ANGLE.C - HOME_ANGLE.C;
  ////////////////////////////////////////////////
  var angle_a = format_T_Command(move_angle_a);
  var angle_b = format_T_Command(move_angle_b);
  var angle_c = format_T_Command(move_angle_c);
  //////////////////////////////////////////////////
  var dataPosition = `T${angle_a}${angle_b}${angle_c}`;
  console.log("Move HOME Angle : ", dataPosition);
  console.log("=====================================");
  ////////////////////////////////////////////////
  ACTUAL_POSITION = Object.assign({}, HOME_POSITION);
  ACTUAL_ANGLE = Object.assign({}, HOME_ANGLE);
  ////////////////////////////////////////////////
  document.getElementById('num-input-x').value = HOME_POSITION.x;
  document.getElementById('num-input-z').value = HOME_POSITION.z;
  document.getElementById('num-input-y').value = HOME_POSITION.y;
  ////////////////////////////////////////////////
  // writeToSerialPort(dataPosition);

});

function getTeachCommand(button) {
  var pos = button.value;
  var axe = button.dataset.axe;
  var next_pos = ACTUAL_POSITION[axe] + parseInt(pos);
  if (checkPositionLimits(next_pos, axe)) {
    var marginAngel = calculMarginalPosition(next_pos, axe);
    ///////////////////////////////////////////////////
    // Format ANGLE as Arduino Command
    ///////////////////////////////////
    var angle_a = format_T_Command(marginAngel.A * GEAR_RATIO);
    var angle_b = format_T_Command(marginAngel.B * GEAR_RATIO);
    var angle_c = format_T_Command(marginAngel.C);
    var dataPosition = `T${angle_a}${angle_b}${angle_c}`;
    console.log("Move Marginal Angle : ", dataPosition);
    console.log("=====================================");
    return dataPosition;
  }
  else {
    console.log('reach limit');
  }
}

ManualControl.find('button').on('click', function (e) {
  getTeachCommand(e.currentTarget);
});


ManualControl.find('button').on('mousedown', function (e) {
  // calculPosition(e);
  if (mousedownID == -1 && ArduinoSerialPort) {  //Prevent multimple loops!
    mousedownID = setInterval(function () {
      var teachCommand = getTeachCommand(e.currentTarget);
      if (teachCommand) {
        writeToSerialPort(teachCommand);
      }
    }, COMMAND_PUSH_DELAY /*execute every ms*/);
  }
});

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
