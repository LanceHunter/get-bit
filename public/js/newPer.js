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
    $('#recordButton').toggleClass('redButton');
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
    if ($('#setTitle').val() === 'Enter a title for this set') {
      setTitle = 'No Title';
    } else {
      setTitle = $('#setTitle').val();
    }
    if ($('#setLocation').val() === 'Enter location for set') {
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
      let newPerObj = {}
      if (chosenBits.length>0)
        newPerObj = {
          per_title : setTitle,
          location : setLocation,
          given_time : totalTime * 60,
          date : setDate,
          bits : chosenBits,
          record : record
        }
      $.post(``, newPerObj)
      .done((perID) => {
        console.log('Entry is posted - ', perID);
        $('#newPer').addClass('hide');
        $('#livePer').removeClass('hide');
      });
    }
  });


})();
