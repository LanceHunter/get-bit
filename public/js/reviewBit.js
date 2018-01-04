(function() {

console.log("Updating Bit");

$('#submitButton').click(() => {
  event.preventDefault();
  console.log($('#submitButton').val());
  window.location.assign($('#submitButton').val());
});


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
    window.location.assign($('#saveButton').val());

    $.post(``, updateJoke, (result)=>{
    })

  });


})();
