function initFileFormContainer() {
    $('.project-import-form-container').html('<div id="project-import-form-container"></div>\n' +
    '<button type="button" id="btn_upld" class="btn btn-primary btn-success add-attachment-btn" onclick="addAttachment();">Upload</button>');
}

function addAttachment() {
    var $container = $("#project-import-form-container");
    var text = "<div  style='height: 38px;'>" +
    "<input type='file' name='files' onchange='fileChanged(this);'>" +
    "</div>";
    $container.append(text);
    $("#btn_upld").prop('disabled', true);
}

function fileChanged(sender) {
    if($(sender).get(0).files.length === 1 && $(sender).parent().children().length === 1) {
        importProjects()
        // $(sender).parent().append("<button class='btn btn-sm btn-danger badge ml-2' onclick='deleteInput(this);'>x</button>");
        // $("#btn_upld").hide();
        // $(sender).parent().append('<button style="position: relative; left: 20px" type="button" ' +
        //     'class="btn btn-primary btn-success add-attachment-btn" onclick="importProjects();">Send</button>');
    }
}

function importProjects() {
    submitForm({
    url: "/ajax/settings/company_import_projects/",
    form_id: "settings-company-upload-projects",
    on_success: function(response) {
        openDialog(undefined, response.errors, "Upload", BOOTBOX_TYPES.NOTIFICATION);
        // location.reload();
    }
  });
}

function deleteInput(sender) {
    $(sender).parent().remove();
    $("#btn_upld").prop('disabled', false);
    $("#btn_upld").show()
}

$(function() {
    initFileFormContainer();
});