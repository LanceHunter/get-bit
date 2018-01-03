'use strict';

//Setting up express routing
const express = require('express');
const router = express.Router();


// A randomizer function. Taken from MDN.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

router.get('/', (req, res) => {
  let thisPort = getRandomInt(1,65536);
  let filename = new Date();
  filename = filename.toISOString();
  console.log('The port is: ', thisPort);
  console.log('The file name is: ', filename);
  console.log('The user ID, ', req.session.userID);
  let filestring = `./public/audio/${filename}.wav`;
  res.send(`${thisPort},${filename}`);

  // Binary connection.
  const binaryServer = require('binaryjs').BinaryServer;
  const wav = require('wav');
  const bserver = binaryServer({port: thisPort});

  bserver.on('connection', function(client) {
    var fileWriter = null;
    console.log('connection attempted')
    client.on('stream', function(stream, meta) {
      var fileWriter = new wav.FileWriter(filestring, {
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
      });
      stream.pipe(fileWriter);
      stream.on('end', function() {
        fileWriter.end();
        stream.end();
      });
    });

    client.on('close', function() {
      if (fileWriter != null) {
        fileWriter.end();
      }
    });
  });

});



module.exports = router;
