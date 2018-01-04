(function() {

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
  let twoIDs = $('#deleteButton').val(); // This value is the user ID and the performance ID, comma-seperated.
  let idArr = twoIDs.split(','); // Splitting that value into an array.



  $('#listenButton').click(() => {
    event.preventDefault();
    let audioTarget = $('#listenButton').prop('href');
    $('#listenButton').replaceWith(`<audio controls="controls" class="w100">
                        <source src="${audioTarget}" type="audio/flac">
                        </audio>`);
  });

  $('#ditchButton').click(() => {
    event.preventDefault();
    console.log($('#ditchButton').val());
    window.location.assign($('#ditchButton').val());
  });

  $('#deleteButton').click(() => {
    event.preventDefault();
    console.log('The delete val - ', idArr[1]);
    $(`#deleteButton`).replaceWith(`<button class="outline redButtonOutLine" id="finalDeleteButton">Confirm Delete</button>`);
    $('#finalDeleteButton').click(() => {
      console.log('Deleting - ', idArr[1]);
      $.ajax({
        url: `/performances/${idArr[1]}`,
        type: 'DELETE',
        success : deleteFunction,
        data: deleteVal
      });
    });
  });

  $('#changeRate').click(() => {
    $('#currentRating').replaceWith(starField);
  });

  $('#saveButton').click(() => {
    event.preventDefault();
    let newRating = $('#theRating').val();
    let jokesPerformedArr = $('.jokePerformed');
    let jokeIDArr = [];
    for (let i=0; i < jokesPerformedArr.length; i++) {
      jokeIDArr.push(jokesPerformedArr[i].id);
    }
    let performedValueArr = jokeIDArr.map((jokeID) => {
      let idString = jokeID.slice(1);
      return {
        joke_id : idString,
        performed : document.getElementById(jokeID).checked,
        per_id : idArr[1]
      };
    });
    console.log('performedValueArr - ', performedValueArr);
  });

  function deleteFunction() {
    window.location.assign('/');
  }

})();
