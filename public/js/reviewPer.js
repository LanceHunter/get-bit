(function() {

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
    let deleteVal = $('#deleteButton').val();
    console.log('The delete val - ', deleteVal);
    $(`#deleteButton`).replaceWith(`<button class="outline redButtonOutLine" id="finalDeleteButton">Confirm Delete</button>`);
    $('#finalDeleteButton').click(() => {
      console.log('Deleting - ', deleteVal);
      $.ajax({
        url: `/performances/${deleteVal}`,
        type: 'DELETE',
        success : deleteFunction,
        data: deleteVal
      });
    });
  });

  $('#saveButton').click(() => {
    event.preventDefault();
    console.log('Adding save/update logic later.');
  });

  function deleteFunction() {
    window.location.assign('/');
  }

})();
