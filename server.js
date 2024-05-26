

//////////////////////////////////////////
var express = require('express');
var app = express();
app.use(express.static('.'));

///////////////////////////////////////////////////
// app.get('/move', function (req, res) {
//   var move = req.query.move;
// res.send('hello world');
// });

const HOST = "localhost";
const PORT = "3000";
app.listen(PORT, HOST, () => {
  console.log(`Server running at ${HOST + ":" + PORT}`);
});