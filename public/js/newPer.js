(function() {

  console.log('I see you.');
  let chosenBits = [];
  let chosenTitle = '';
  let record = false;

  $('#addSelectButton').click(() => {
    event.preventDefault();
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
    chosenBits.push($('#bitSelect').val().slice(1));
    console.log(chosenBits);
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




})();
