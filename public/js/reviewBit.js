(function() {

console.log("Updating Bit");

$('#submitButton').click(() => {
  event.preventDefault();
  console.log($('#submitButton').val());
  tag = $('#newTag').val();

  if (!tag) {
    $('#newTag').addClass('error')
    $('#newTagReq').text('Please Enter a New Tag')
  } else {
    window.location.assign($('#submitButton').val());
    let tagObj = {}
    tagObj = {
      tag: tag
    };

    $.post(``, tagObj, (results) => {
      console.log(tagObj)
    })
  }

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
