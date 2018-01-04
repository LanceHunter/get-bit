(function() {

  console.log("Lets create a new Label");

  $('#submitButton').click(() => {
    event.preventDefault();
    console.log($('#submitButton').val());
    label = $('#newLabel').val();

    if (!label) {
      $('#newLabel').addClass('error')
      $('#newLabelReq').text('Label Required')
    } else {
      window.location.assign($('#submitButton').val());
      let labelObj = {}
      labelObj = {
        label: label
      };

      $.post(``, labelObj, (results) => {
        console.log(labelObj)
      })
    }

  });


})();
