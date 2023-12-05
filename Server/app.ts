const express = require('express');
const path = require('path');

const app = express(); 

app.use(express.static(path.join(__dirname, '../Client/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../Client/build/index.html'));
});

app.listen(8080, () => {
  console.log('Listening on 8080')
})