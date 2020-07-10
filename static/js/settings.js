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
      openDialog(undefined, response.errors, "Upload", BOOTBOX_TYPES.NOTIFICATION);
    }
  });
}
