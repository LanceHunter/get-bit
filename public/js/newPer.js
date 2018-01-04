(function() {

  console.log('I see you.');
  let chosenBits = [];
  let chosenTitle = '';
  let record = false;
  let totalTime;
  let lightTime;
  let setTitle;
  let setDate;
  let setLocation;
  let newPerObj = {};

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
    totalTime = $('#setTime').val();
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
    console.log('The total time - ', totalTime);
    console.log('The light time - ', lightTime);
    console.log('The set title - ', setTitle);
    console.log('The set date - ', setDate);
    console.log('Are we recording? ', record);
    if (!totalTime) {
      $('#setTime').addClass('error');
      $('#setTimeReq').text('set time required')
    } else if (totalTime < lightTime) {
      $('#setTime').addClass('error');
      $('#lightTime').addClass('error');
      $('#setTimeReq').text('light time cannot exceed set time')
    } else {
      newPerObj = {
        per_title : setTitle,
        location : setLocation,
        given_time : totalTime * 60,
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
        if (record) {
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
        } else {

        }

      });
    }
  });

// Functions for recording if it is used.
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
  let counter = setInterval(function() {
    let timeLeftNow = timeLeft;
    minute = Math.floor(timeLeftNow/60);
    second = timeLeftNow-(minute*60);
    timeString = `${minute}:${second}`;
    $('#timer').text(timeString);
    timeLeft = timeLeft-1;
  }, 1000);
}



})();
