var ArduinoSerialPort;
var COMMAND_PUSH_DELAY = 10;
const BAUD_RATE = 9600;
const SerialBufferSize = 64;
const ManualControl = $('#manual-control');
document.getElementById('usb-connection').addEventListener("click", async (e) => {
  ArduinoSerialPort = await navigator.serial.requestPort();
  // Initialize the list of available ports with `ports` on page load.
  console.log(ArduinoSerialPort);
  console.log(ArduinoSerialPort.getInfo());
  ArduinoSerialPort.addEventListener('onconnect', (e) => {
    // notify that the chosen port is connected
    console.log('port connected');
  });
  ArduinoSerialPort.addEventListener('disconnect', () => {
    console.log('port disconnected');
    e.target.innerHTML = "disconnected";
    $(e.target).removeClass('btn-info').addClass('btn-primary');
  });
  try {
    await ArduinoSerialPort.open({ baudRate: BAUD_RATE });
    console.log("connected to serial port");
    console.log(JSON.stringify(ArduinoSerialPort.getInfo()));
    $(e.target).removeClass('btn-primary').addClass('btn-info');
    e.target.innerHTML = "connected";

  } catch (error) {
    console.log(error);
  }
});

function readFromSerial() {
  if (ArduinoSerialPort.readable && !ArduinoSerialPort.readable.locked) {
    const reader = ArduinoSerialPort.readable.getReader();
    var decoder = new TextDecoder();
    try {
      reader.read().then(function (result) {
        if (!result.done) {
          console.log('read : ' + decoder.decode(result.value));
          reader.releaseLock();
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      // reader.releaseLock();
    }
  }
}

function writeToSerialPort(moveData) {
  ////
  // ArduinoSerialPort.writable.locked
  if (ArduinoSerialPort.writable && !ArduinoSerialPort.writable.locked) {

    const writer = ArduinoSerialPort.writable.getWriter();
    const encoder = new TextEncoder();
    try {
      if (moveData.length) {
        // delay code
        // for (let index = 0; index < 100; index++) { }
        writer.write(encoder.encode(moveData.trim()))
          .then(a => {
            // console.log("write : " + moveData);
          }).catch(err => {
            console.log(err);
          }).finally(function () {
            // Allow the serial port to be closed later.
            writer.releaseLock();
            // readFromSerial();
          });
      }
      // else {
      //   callback();
      // }
    } catch (error) {
      console.log(error);
    }
  }
  else {
    console.log("Error:");
    console.log("ArduinoSerialPort.writable.locked : " + ArduinoSerialPort.writable.locked);
  }
}