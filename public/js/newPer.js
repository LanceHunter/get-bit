(function() {

  console.log('I see you.');
  let chosenBits = [];
  let userID = $('body').attr('id');
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
  let stopPressed = false;
  let bitTitlesArr = [];
  let rawBitsArr;
  let starField = `<div class="form-item">
                    <label>Rate the set:</label>
                    <select id="theRating">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>`;
  let saveButton = `<button class="button large w100" id="saveButton">Save</button>`;
  let deleteButton = `<button class="button large redButton w100" id="deleteButton">Delete</button>`;
  let confirmDeleteButton = `<button class="button outline large redButtonOutLine w100" id="confirmDeleteButton">Confirm Delete</button>`;
  let theLight;


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
    givenTime = parseInt($('#setTime').val());
    lightTime = parseInt($('#lightTime').val());
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
    rawBitsArr = $('h5');
    for (let i=0; i < rawBitsArr.length; i++) {
      chosenBits.push(rawBitsArr[i].id);
      bitTitlesArr.push(`<h2>${rawBitsArr[i].innerText}</h2>`);
    }
    if (!givenTime) {
      $('#setTime').addClass('error');
      $('#setTimeReq').text('set time required')
    } else if (givenTime < lightTime) {
      console.log('Given time - ', givenTime);
      console.log('Light time - ', lightTime)
      $('#setTime').addClass('error');
      $('#lightTime').addClass('error');
      $('#setTimeReq').text('light time cannot exceed set time');
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
        bitTitlesArr.forEach((bitH1) => {
          $('#bitHolder').append(bitH1);
        });
        if (record) { // If the user wants to record the audio.
          $.get('/record')
          .done((replystring) => { // Starting the live performance logic.
            createTimer(newPerObj.given_time);
            if (lightTime) {
              theLight = window.setTimeout(flashTheLight, (lightTime*60000));
            }
            let replyArr = replystring.split(',');
            console.log('The reply is: ', replyArr);
            newPerObj.audio = `/static/audio/${replyArr[1]}.wav`;
            var session = {
              audio: true,
              video: false
            };
            var recordRTC = null;
            navigator.mediaDevices.getUserMedia(session)
            .then(initializeRecorder)
            .catch((err) => $('#livePer').append(`<h2>${err}<h2>`));
            var client = new BinaryClient(`wss://getbit.herokuapp.com/:${replyArr[0]}`);
            client.on('open', function() {
              console.log('stream is open');
              window.Stream = client.createStream();
            });
            $('#stopButton').click(() => {
              window.Stream.end();
              confirmPerformancePage();
            });
          });
        } else { // Live Performance page without recording audio.
          newPerObj.audio = null;
          createTimer(newPerObj.given_time);
          if (lightTime) {
            theLight = window.setTimeout(flashTheLight, (lightTime*60000));
          }
          $('#stopButton').click(() => {
            confirmPerformancePage();
            /*
            stopPressed = true;
            if (lightTime) {
              console.log('Light time - ', lightTime, weFlash);
              window.clearTimeout(theLight);
            }
            newPerObj.per_time = Math.round(perTime);
            // All the logic taking the values presenting the confirm page.
            $('#livePer').addClass('hide');
            $('#newPer').removeClass('hide');
            $('#setTitle').replaceWith(`<h2>${newPerObj.per_title}</h2>`);
            if (newPerObj.location) {
              $('#setLocation').replaceWith(`<h2>${newPerObj.location}</h2>`);
            } else {
              $('#setLocation').addClass(`hide`);
            }
            $('#setTimeDiv').replaceWith(`<div id="jokesPerformedDiv"></div>`);
            $('#lightTimeDiv').addClass('hide');
            $('#recordButton').addClass('hide');
            $('#setOptionsLegend').text('Options');
            $('#setlistField').addClass('hide');
            $('#setOptions').prepend(starField);
            $('#jokesPerformedDiv').append(rawBitsArr);
            $('#startButton').replaceWith(saveButton);
            $('#ditchButton').replaceWith(deleteButton);

            $('#deleteButton').click(() => {
              event.preventDefault();
              console.log('Delete button was clicked');
              $('#deleteButton').replaceWith(confirmDeleteButton);
              $('#confirmDeleteButton').click(() => {
                event.preventDefault();
                $.ajax({
                  url: `/performances/${newPerObj.per_id}`,
                  type: 'DELETE',
                  success : deleteCall,
                  data: newPerObj
                });
              });
            });

            $('#saveButton').click(() => {
              newPerObj.rating = $('#theRating').val();
              console.log('The rating - ', newPerObj.rating);
              $.post('/performances/live', newPerObj)
              .done(() => {
                console.log(`It's done.`);
                window.location.assign('/');
              });
            });
*/
          });
        }
      });
    }
  });

// Functions for recording if user selects it. Most of these next three functions are from Gabriel Poça at https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/
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
    if ((timeLeft === 0) || stopPressed) {clearInterval(counter);}
    let timeLeftNow = timeLeft;
    minute = Math.floor(timeLeftNow/60);
    second = Math.floor(timeLeftNow-(minute*60));
    if (second<10) {second = `0${second}`;}
    timeString = `${minute}:${second}`;
    $('#timer').text(timeString);
    timeLeft = timeLeft-0.01;
    perTime = perTime+0.01;
  }, 10);
}

function flashTheLight() {
  weFlash = true;
  let flashingScreen = setInterval(function() {
    $('#livePer').toggleClass('hide');
    $('#theLightDiv').toggleClass('hide');
    if (stopPressed) {
      $('#livePer').removeClass('hide');
      $('#theLightDiv').addClass('hide');
      clearInterval(flashingScreen);
    }
  }, 500);
}

function deleteCall() {
  window.location.assign(`/`);
}

function confirmPerformancePage() {
  stopPressed = true;
  if (lightTime) {
    console.log('Light time - ', lightTime, weFlash);
    window.clearTimeout(theLight);
  }
  newPerObj.per_time = Math.round(perTime);
  // All the logic taking the values presenting the confirm page.
  $('#livePer').addClass('hide');
  $('#newPer').removeClass('hide');
  $('#setTitle').replaceWith(`<h2>${newPerObj.per_title}</h2>`);
  if (newPerObj.location) {
    $('#setLocation').replaceWith(`<h2>${newPerObj.location}</h2>`);
  } else {
    $('#setLocation').addClass(`hide`);
  }
  $('#setTimeDiv').replaceWith(`<div id="jokesPerformedDiv"></div>`);
  $('#lightTimeDiv').addClass('hide');
  $('#recordButton').addClass('hide');
  $('#setOptionsLegend').text('Options');
  $('#setlistField').addClass('hide');
  $('#setOptions').prepend(starField);
  $('#jokesPerformedDiv').append(`<dl id="performedBitsList"></dl>`);
  console.log('RawbitsArr - ', rawBitsArr);
  for (let i=0; i<rawBitsArr.length; i++) {
    console.log('This bits ID - ', rawBitsArr[i].id);
    console.log('This bits ID - ', rawBitsArr[i].innerText);
    $('#performedBitsList').append(`<dt>
      ${rawBitsArr[i].innerText}
    </dt>
    <dd>
      <label class="checkbox"><input class="jokePerformed" type="checkbox" id="${rawBitsArr[i].id}" checked> Performed</label>
    </dd>`);
  }

/*

<dl>
  <% per.forEach((bit) => { %>
    <dt>
      <%= bit.joke_title %>
    </dt>
    <dd>
      <% if (bit.performed) { %>
        <label class="checkbox"><input class="jokePerformed" type="checkbox" id="p<%= bit.joke_id %>" checked> Performed</label>
      <% } else { %>
        <label class="checkbox"><input class="jokePerformed" type="checkbox" id="p<%= bit.joke_id %>">Performed</label>
      <% } %>
    </dd>
  <% }); %>
</dl>


*/

  $('#startButton').replaceWith(saveButton);
  $('#ditchButton').replaceWith(deleteButton);

  $('#saveButton').click(() => {
    newPerObj.rating = $('#theRating').val();
    console.log('Body id - ', userID);
    let jokesPerformedArr = $('.jokePerformed');
    let jokeIDArr = [];
    for (let i=0; i < jokesPerformedArr.length; i++) {
      jokeIDArr.push(jokesPerformedArr[i].id);
    }
    newPerObj.user_id = userID;
    newPerObj.performedValueArr = jokeIDArr.map((jokeID) => {
      let idString = jokeID;
      return {
        joke_id : idString,
        performed : document.getElementById(jokeID).checked,
        per_id : newPerObj.per_id
      };
    });

    console.log('The rating - ', newPerObj.rating);
    $.post('/performances/live', newPerObj)
    .done(() => {
      console.log(`It's done.`);
      window.location.assign(`/performances/${userID}`);
    });
  });

  $('#deleteButton').click(() => {
    event.preventDefault();
    console.log('Delete button was clicked');
    $('#deleteButton').replaceWith(confirmDeleteButton);
    $('#confirmDeleteButton').click(() => {
      event.preventDefault();
      $.ajax({
        url: `/performances/${newPerObj.per_id}`,
        type: 'DELETE',
        success : deleteCall,
        data: newPerObj
      });
    });
  });

}

})();
