(function() {

console.log("Lets create a new Label");

$('#submitButton').click(() => {
  event.preventDefault();
  console.log($('#submitButton').val());


  label = $('#newLabel').val();

  if (!label){
    $('#newLabel').addClass('error')
    $('#newLabelReq').text('Label Required')
  } else {
    let labelObj = {}
    labelObj = {
      label: label
    };

    $.post(`/bits/${userID}/label`, labelObj, (results)=>{
      console.log(labelObj)
    })
  }

});


})();
