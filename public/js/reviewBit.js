(function() {
  $('#ditchButton').click(() => {
    event.preventDefault();
    console.log($('#ditchButton').val());
    window.location.assign($('#ditchButton').val());
  });

  $('#deleteButton').click(() => {
    event.preventDefault();
    let deleteRoute = $('#deleteButton').val();
    $(`#deleteButton`).replaceWith(`<button class="outline redButtonOutLine" value="/bits/<%= userID %>/<%= bitID %>" id="finalDeleteButton">Confirm Delete</button>`);
    $('#finalDeleteButton').click(() => {
      console.log('Deleting - ', deleteRoute);
      //Logic for the AJAX delete call goes here later.
    });
  });

  $('#saveButton').click(() => {
    event.preventDefault();

    $.post('/bits/:id/new', updateJoke, (result)=>{
    })

  });


})();
