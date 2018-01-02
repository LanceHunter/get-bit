(function() { // Once again, we immediately invoke the front-end function.

  // Getting the values of the fields when they load and setting up variables for any new values.
  let oldEmail = $('#emailField').val();
  let newEmail = '';
  let oldURL = $('#photoField').val();
  let newURL = '';
  let pass1 = '';
  let pass2 = '';

  // Creating eventlisteners for any changes in the fields.
  $('#emailField').on('input', () => {
    newEmail = $('#emailField').val();
  });
  $('#photoField').on('input', () => {
    newURL = $('#photoField').val();
  });
  $('#password1').on('input', () => {
    pass1 = $('#password1').val();
  });
  $('#password2').on('input', () => {
    pass2 = $('#password2').val();
  });


  $('#updateButton').click(() => {
    event.preventDefault();
    let updateObj = {};
    let update = false;
    $('#updateButton').replaceWith(`<button class="button secondary round outline" id="confirmButton">Confirm</button>`);
    $('#confirmButton').click(() => {
      event.preventDefault();
      if (newEmail && (oldEmail !== newEmail)) {
        updateObj.user_name = newEmail;
        update = true;
      }
      if (newURL && (oldURL !== newURL)) {
        updateObj.photo_url = newURL;
        update = true;
      }
      if (pass1 || pass2) {
        if (pass1 === pass2) {
          updateObj.password = pass1;
          update = true;
        } else {
          $('#password1').addClass('error');
          $('#password2').addClass('error');
          update = false;
        }
      }
      if (update) {
        $.ajax({
          url : '/accounts/update',
          method : "PUT",
          data : updateObj,
          dataType: 'json',
          success : function(data) {
            console.log(data);
            window.location.assign('/');
          }
        })
        .always((reply) => {
          console.log(reply);
          window.location.assign('/');
        });
      }
    });
  });

})();
