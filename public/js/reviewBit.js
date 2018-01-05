(function() {
  let userID = $("body").attr('id')
  console.log("Updating Bit");

  $('#submitButton').click(() => {
    event.preventDefault();
    console.log($('#submitButton').val());
    tag = $('#newTag').val();

    if (!tag) {
      $('#newTag').addClass('error')
      $('#newTagReq').text('Please Enter a New Tag')
    } else {
      // window.location.assign($('#submitButton').val());
      let tagObj = {}
      tagObj = {
        tag: tag
      };

      $.post(``, tagObj, (results) => {
        console.log(tagObj)
      })
        window.location.reload();
    }

  });

  $('#labelsubmitButton').click(() => {
    event.preventDefault();

    label = $('#newLabel').val();
    console.log(label)
    if (!label) {
      $('#newLabel').addClass('error')
      $('#newLabelReq').text('Label Required')
    } else {

      let labelObj = {}
      labelObj = {
        user_id: userID,
        label: label
      };

      $.post(`/bits/newLabel`, labelObj, (results) => {
        console.log(labelObj)
      })
      window.location.reload();
    }

  });


  $('#ditchButton').click(() => {
    event.preventDefault();
    console.log($('#ditchButton').val());
    window.location.assign($('#ditchButton').val());
  });

  $('#deleteButton').click(() => {
    event.preventDefault();
    let deleteVal = [];
    deleteVal.push({
      deleteId: $('#deleteButton').val()
    });
    console.log(deleteVal);
    $(`#deleteButton`).replaceWith(`<button class="outline redButtonOutLine" id="finalDeleteButton">Confirm Delete</button>`);
    $('#finalDeleteButton').click(() => {
      $.ajax({
        url: `/bits/${userID}/${deleteVal[0].deleteId}`,
        type: 'DELETE',
        data: deleteVal,
        success: postAjax
      });
    });
  });

  $('#saveButton').click(() => {
    event.preventDefault();
    let updateVal = [];
    updateVal.push({
      updateId: $('#saveButton').val()
    });

    let newTitle = $('#joke_title').val();
    let newBody = $('#body').val();
    let newLabel = $('#labelSelect').val();

    console.log(newLabel);

    let updateObj = {};

    updateObj = {
      joke_title: newTitle,
      body: newBody,
      label_id: newLabel
    }

    $.ajax({
      url: `/bits/${userID}/${updateVal[0].updateId}`,
      method: "PUT",
      data: updateObj,
      success: postAjax
    });
  });

  function postAjax() {
    console.log("postAjax is working");
    window.location.assign(`/bits/${userID}`)

  }

})();
