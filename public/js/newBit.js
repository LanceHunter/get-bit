(function() {

console.log("Lets create a new Bit");

let jokeTitle;
let jokeBody;
let tag;
let label;


$('#saveButton').click(() => { // Click listener for the submit button.
  event.preventDefault();
  console.log('Button Pressed.');

  jokeTitle = $('#joke_Title').val();
  jokebody = $('#body').val();
  tag = $('#tag').val();
  label = $('#label').val();


});

  $('#ditchButton').click(() => {
    event.preventDefault();
    console.log($('#ditchButton').val());
    window.location.assign($('#ditchButton').val());
  });


})();
