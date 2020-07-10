function fileChanged(sender) {
  if($(sender).get(0).files.length === 1 && $(sender).parent().children().length === 1) {
    importTeachers()
  }
}

function importTeachers() {
  showOverlaySpinner('body');
  submitForm({
    url: "/settings/import-teachers-process/",
    form_id: "settings-upload-teachers",
    on_success: function(response) {
      hideOverlaySpinner();
      openDialog(
        undefined,
        response.errors,
        "Upload", BOOTBOX_TYPES.NOTIFICATION,
        undefined,
        undefined,
        () => location.reload(true)
      );
    }
  });
}

function personalSettingsProcess() {
  submitForm({
    url: "/ajax/me-process/",
    form_id: "settings-me-form",
    on_success: function(response) {
      location.reload();
    }
  });
}

function deleteProfilePicture() {
  confirmPopup(
    "Do you want to delete the profile picture?",
    function () {
      $.ajax({
        url: '/ajax/profile-picture-delete/',
        type: 'POST',
        success: function(response) {
          if (response.success) {
            location.reload();
          } else {
            validateForm($("settings-me-form"), response.errors);
          }
        }

      })
    }
  )
}

$(function () {
  let $profilePictureDeleteButton = $(".js-profile-picture-delete");
  $profilePictureDeleteButton.on("click", deleteProfilePicture);
});
