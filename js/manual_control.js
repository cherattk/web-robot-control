
/////////////////////////////////////////////////////////////////
var PressCount = 0;

var Position = {
  x: 0, z: 0, y: 0
}

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

const bras_max_limit = 21;
const bras_min_limit = 0;

function calculPosition(e) {
  var pos = e.currentTarget.value;
  var axe = e.currentTarget.dataset.axe;
  var _pos = Position[axe] + parseInt(pos);
  if (_pos > bras_min_limit && _pos < bras_max_limit) {
    Position[axe] += parseInt(pos);
    console.log('position : ', Position);
    var anglePos = getPositionAngle(Position.x, Position.z, Position.y);
    var dataPosition = `T${anglePos.A_deg}${anglePos.B_deg}${anglePos.C_deg}`;
    console.log(dataPosition);
  }
  else{
    console.log('out of reach : ' , Position[axe]);
  }
}

// ManualControl.find('button').on('click', function (e) {
ManualControl.find('button').on('mousedown', function (e) {
  // calculPosition(e);
  if (mousedownID == -1) {  //Prevent multimple loops!
    mousedownID = setInterval(function () {
      calculPosition(e);
      // writeToSerialPort(moveData);
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
