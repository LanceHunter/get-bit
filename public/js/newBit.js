(function() {

console.log("Lets create a new Bit");

$('#saveButton').click(() => { // Click listener for the submit button.
  event.preventDefault();
  console.log('Button Pressed.');

  if($('#joke_title').val() && $('#body').val()){

    $.post('/bits/:id/new', )


  }


});

  $('#ditchButton').click(() => {
    event.preventDefault();
    console.log($('#ditchButton').val());
    window.location.assign($('#ditchButton').val());
  });


})();
