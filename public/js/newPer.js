(function() {

  console.log('I see you.');
  let chosenBits = [];
  let chosenTitle = '';
  let record = false;
  let givenTime;
  let perTime = 0;
  let lightTime;
  let setTitle;
  let setDate;
  let setLocation;
  let newPerObj = {};
  let weFlash = false;
  let flashEnd = false;

  $('#addSelectButton').click(() => {
    event.preventDefault();
    if ($('#bitSelect').val()) {
      let bitID = $('#bitSelect').val();
      let preSelectedBit = $(`#${bitID}`).text().trim().split(' ');
      let selectedBitArr = [];
      preSelectedBit.forEach((word) => {
        if (word) {
          selectedBitArr.push(word.trim());
        }
      });
      let selectedBit = selectedBitArr.join(' ');
      console.log(selectedBit);
      let chosenBit = $('#bitSelect').val().slice(1);
      chosenBits.push(chosenBit);
      let chosenBitIndex = chosenBits.length-1;
      console.log(chosenBits, " length - ", chosenBitIndex);
      $('#setlistField').append(`<h5 id="${chosenBit}">${selectedBit} <span class="close" id="close${chosenBitIndex}"></span></h5>`);
      $(`#close${chosenBitIndex}`).click(() => {
        $(`#close${chosenBitIndex}`).parent().remove();
        console.log($('h5'));
      });
    }
  });

  $('#recordButton').click(() => {
    $('#recordButton').toggleClass('secondary');
    $('#recordButton').toggleClass('recordButton');
    if (!record) {
      record = true;
      $('#recordButton').text('Record!');
    } else {
      record = false;
      $('#recordButton').text('Record?');
    }
  });

  $('#ditchButton').click(() => {
    event.preventDefault();
    window.location.assign(`/performances/${$('#ditchButton').val()}`);
  });

  $('#startButton').click(() => {
    event.preventDefault();
    givenTime = $('#setTime').val();
    lightTime = $('#lightTime').val();
    if (!$('#setTitle').val()) {
      setTitle = 'No Title';
    } else {
      setTitle = $('#setTitle').val();
    }
    if (!$('#setLocation').val()) {
      setLocation = '';
    } else {
      setLocation = $('#setLocation').val();
    }
    setDate = new Date();
    setDate = setDate.toISOString();
    while (chosenBits.length > 0) {
      chosenBits.pop();
    }
    let rawBitsArr = $('h5');
    for (let i=0; i < rawBitsArr.length; i++) {
      chosenBits.push(rawBitsArr[i].id);
    }
    console.log('The bits - ', chosenBits);
    console.log('The total time - ', givenTime);
    console.log('The light time - ', lightTime);
    console.log('The set title - ', setTitle);
    console.log('The set date - ', setDate);
    console.log('Are we recording? ', record);
    if (!givenTime) {
      $('#setTime').addClass('error');
      $('#setTimeReq').text('set time required')
    } else if (givenTime < lightTime) {
      $('#setTime').addClass('error');
      $('#lightTime').addClass('error');
      $('#setTimeReq').text('light time cannot exceed set time')
    } else {
      newPerObj = {
        per_title : setTitle,
        location : setLocation,
        given_time : givenTime * 60,
        date : setDate,
        bits : chosenBits,
        record : record
      };
      $.post(``, newPerObj)
      .done((perID) => {
        newPerObj.per_id = perID[0];
        console.log('Entry is posted - ', perID);
        $('#newPer').addClass('hide');
        $('#livePer').removeClass('hide');
        if (record) { // If the user wants to record the audio.
          $.get('/record')
          .done((replystring) => {
            let replyArr = replystring.split(',');
            console.log('The reply is: ', replyArr);
            newPerObj.audio = `/static/audio/${replyArr[1]}`;
            var session = {
              audio: true,
              video: false
            };
            var recordRTC = null;
            navigator.mediaDevices.getUserMedia(session)
            .then(initializeRecorder)
            .catch((err) => $('#livePer').append(`<h2>${err}<h2>`));
            var client = new BinaryClient(`ws://localhost:${replyArr[0]}`);
            client.on('open', function() {
              console.log('stream is open');
              window.Stream = client.createStream();
            });
            createTimer(newPerObj.given_time);
            $('#stopButton').click(() => {
              window.Stream.end();
              $.post('/performances/live', newPerObj)
              .done(() => {
                console.log(`It's done.`);
              });
            });
          });
        } else { // Live Performance page without recording audio.
          createTimer(newPerObj.given_time);
          newPerObj.audio = null;
          if (lightTime) {
            var theLight = window.setTimeout(flashTheLight, (lightTime*60000));
          }
          $('#stopButton').click(() => {
            flashEnd = true;
            if (lightTime) {
              console.log('Light time - ', lightTime, weFlash);
              window.clearTimeout(theLight);
            }
            newPerObj.per_time = perTime;
            $.post('/performances/live', newPerObj)
            .done(() => {
              console.log(`It's done.`);
            });
          });
        }

      });
    }
  });

// Functions for recording if user selects it. Much of these are from Gabriel Poça at http://codetheory.in/controlling-the-volume-of-an-audio-file-in-javascript/
function initializeRecorder(stream) {
  var audioContext = window.AudioContext;
  var context = new audioContext();
  var audioInput = context.createMediaStreamSource(stream);
  var bufferSize = 2048;
  // create a javascript node
  var recorder = context.createScriptProcessor(bufferSize, 1, 1);
  // specify the processing function
  recorder.onaudioprocess = recorderProcess;
  // connect stream to our recorder
  audioInput.connect(recorder);
  // connect our recorder to the previous destination
  recorder.connect(context.destination);
}

function convertFloat32ToInt16(buffer) {
  l = buffer.length;
  buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}

function recorderProcess(e) {
  var left = e.inputBuffer.getChannelData(0);
  window.Stream.write(convertFloat32ToInt16(left));
}

// The function to put a timer on the page.
function createTimer(timeLeft) {
  console.log('The time left is ', timeLeft);
  let startTime = timeLeft;
  let minute = Math.floor(startTime/60);
  let second = startTime-(minute*60);
  if (second===0) {second = '00'};
  timeString = `${minute}:${second}`;
  $('#livePer').prepend(`<h1 class="title text-center" id="timer">${timeString}</h1>`);
  timeLeft--;
  let counter = setInterval(() => {
    let timeLeftNow = timeLeft;
    minute = Math.floor(timeLeftNow/60);
    second = timeLeftNow-(minute*60);
    if (second<10) {second = `0${second}`;}
    timeString = `${minute}:${second}`;
    $('#timer').text(timeString);
    if ((timeLeft === 0) || flashEnd) {clearInterval(counter);}
    timeLeft = timeLeft-1;
    perTime++;
  }, 1000);
}

function flashTheLight() {
  weFlash = true;
  let flashingScreen = setInterval(function() {
    $('#livePer').toggleClass('hide');
    $('#theLightDiv').toggleClass('hide');
    if (flashEnd) {
      $('#livePer').removeClass('hide');
      $('#theLightDiv').addClass('hide');
      clearInterval(flashingScreen);
    }
  }, 500);
  // Put in something to make the screen flash...
}


})();
