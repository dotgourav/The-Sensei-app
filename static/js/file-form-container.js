function initFileFormContainer() {
    $('.file-form-container').html('<div id="file-inputs-container"></div>\n' +
    '<button type="button" class="btn btn-primary bg-app-blue add-attachment-btn" onclick="addAttachment();">Add attachment</button>');
}

function addAttachment() {
    var $container = $("#file-inputs-container");
    var text = "<div class='mb-2 mt-2 d-flex align-items-center' style='height: 38px;'>" +
    "<input type='file' name='files' onchange='fileChanged(this);'>" +
    "</div>";
    $container.append(text);
}

function fileChanged(sender) {
    if($(sender).get(0).files.length === 1 && $(sender).parent().children().length === 1) {
        $(sender).parent().append("<button class='btn btn-sm btn-danger badge ml-2' onclick='deleteInput(this);'>x</button>");
    }
}

function deleteInput(sender) {
    $(sender).parent().remove();
}

$(function() {
    initFileFormContainer();
});


function handleFiles ( target, save_target, files_block, is_file ) {
  const $save_el = $( save_target );
  let filesArray = [...$save_el[0].files || [], ...target.files];

  const dT = new ClipboardEvent( '' ).clipboardData || new DataTransfer(); // specs compliant (as of March 2018 only Chrome)

  $.each( filesArray, function ( index, value ) {
    dT.items.add( value );
  } );

  $save_el[0].files = dT.files;

  renderFiles( filesArray, save_target, files_block,  is_file );
}


function renderFiles ( files, save_target, files_block, is_file ) {

  const $selectedFiles = $( files_block );
  $selectedFiles.find( '.attached-file' ).not( '.remote_file' ).remove();

  $.each( files, function ( index, value ) {
      addFile( value, save_target, files_block, is_file )
  });
}

function addFile ( file, save_target, files_block ) {
  const $selectedFiles = $( files_block );

  $selectedFiles.append( "<div class='attached-file  attachment-row' style='margin-right: 10px'>" +
    "  <span>" + file.name + "</span>" +
    "  <a class='fa fa-trash' onclick='deleteInput(this);' href='javascript:void(0);'></a>" +
    "</div>" );
}