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
    let deleteRoute = $('#deleteButton').val();
    $(`#deleteButton`).replaceWith(`<button class="outline redButtonOutLine" value="/performances/<%= userID %>/<%= per[0].per_id %>" id="finalDeleteButton">Confirm Delete</button>`);
    $('#finalDeleteButton').click(() => {
      console.log('Deleting - ', deleteRoute);
      //Logic for the AJAX delete call goes here later.
    });
  });

  $('#saveButton').click(() => {
    event.preventDefault();
    console.log('Adding save/update logic later.');
  });

})();
