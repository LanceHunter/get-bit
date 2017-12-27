(function () { // Front-end means it's IIFE time.

console.log("I see you."); // Confirming that we're here.

$('#submitButton').click(() => { // Click listener for the submit button.
  event.preventDefault();
  console.log('Button Pressed.');
  if ($('#email1').val() && $('#email2').val() && $('#password1').val() && $('#password2').val()) { // Making sure all four fields are filled out
    $('#email1').removeClass('error');
    $('#email2').removeClass('error');
    $('#password1').removeClass('error');
    $('#password2').removeClass('error');
    if (($('#email1').val() === $('#email2').val()) && ($('#password1').val() === $('#password2').val())) { // Making sure password and email match.
      let accountObj = {};
      accountObj.user_name = $('#email1').val();
      accountObj.password = $('#password1').val();
      console.log(accountObj);
//      $.post('accounts/create', accountObj, )
    } else { // Logic in case email or password fields don't match.
      if ($('#email1').val() !== $('#email2').val()) { // Putting up error if email fields don't match.
        $('#email1').addClass('error');
        $('#email2').addClass('error');
      }
      if ($('#password1').val() !== $('#password2').val()) { // Putting up error if password fields don't match.
        $('#password1').addClass('error');
        $('#password2').addClass('error');
      }
    }
  } else { // Logic in case all four fields aren't filled out. We turn any empty fields red.
    if (!$('#email1').val()) {
      $('#email1').addClass('error');
    }
    if (!$('#email2').val()) {
      $('#email2').addClass('error');
    }
    if (!$('#password1').val()) {
      $('#password1').addClass('error');
    }
    if (!$('#password2').val()) {
      $('#password2').addClass('error');
    }

  }
});

})();
