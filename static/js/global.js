// Constants
var BOOTBOX_TYPES = Object.freeze({FORM: 1, NOTIFICATION: 2, ERROR: 3});

var DATE_FORMAT = 'dd M yy';


function validateForm($form, errors, only_visible_fields) {

    var $errors = $('.form-error');
    var extra_filter = '';
    var has_non_field_errors = false;
    $errors.remove();

    if (only_visible_fields === undefined) {
        only_visible_fields = true;
    }

    if (only_visible_fields) {
        extra_filter = ':visible';
    }

    if ($.type(errors) === 'object' && '__all__' in errors) {
        has_non_field_errors = true;
        errors = errors['__all__'];
    }

    if ($.type(errors) === "string" || has_non_field_errors) {
        showErrorDialog(errors);
    } else {
        $.each(errors, function (key, value) {
            var $field = $form.find("[name='" + key + "']" + extra_filter);
            if ($field.hasClass('chosen')) {
                $field = $field.next('.chosen-container');
            }
            $field
                .effect("highlight", {"color": "red"}, 1000)
                .after('<p class="form-error">' + value + '</p>');
        });
    }
}


// Dialogs
function openDialog(url, message, title, type, class_name, on_save, on_cancel, on_loaded, confirm_btn_title, cancel_btn_title) {

    var dismiss_callback = function () {
        if (on_cancel !== undefined) {
            on_cancel();
        }
        dialog.modal('hide');
    };

    var buttons = {
        cancel: {
            label: 'Close',
            className: 'btn-outline-secondary',
            callback: dismiss_callback
        }
    };

    if (type === BOOTBOX_TYPES.ERROR) {
        title = "Error";
    } else if (type === BOOTBOX_TYPES.NOTIFICATION) {
        title = "Notification";
    } else {
        buttons = {
            cancel: {
                label: cancel_btn_title !== undefined ? cancel_btn_title : 'Cancel',
                className: 'btn-outline-secondary',
                callback: dismiss_callback
            },
            confirm: {
                label: confirm_btn_title !== undefined ? confirm_btn_title : 'Save',
                className: 'btn-success',
                callback: function () {
                    on_save();
                    return false; // Disable default dismiss on click behavior
                }
            }
        };
    }

    var dialog = bootbox.dialog({
        title: title,
        message: message,
        buttons: buttons,
        onEscape: dismiss_callback,
        closeButton: false
    });

    if (class_name) {
        $(dialog).find('.modal-dialog').addClass(class_name);
    }

    if (url !== undefined) {
        $.get(url, function (response) {
            $('.datepicker').datepicker();
            initFileFormContainer();
            if (response.success) {
                dialog.find('.bootbox-body').html(response.html_content);
                if (on_loaded !== undefined) {
                    on_loaded();
                }
            }
        });
    }

    return dialog;
}

// options = url, title, type, on_save, on_cancel, on_loaded, confirm_btn_title
function openFormDialog(options) {
    return openDialog(
        options.url,
        '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
        options.title,
        options.type || BOOTBOX_TYPES.FORM,
        options.class_name,
        options.on_save,
        options.on_cancel,
        options.on_loaded,
        options.confirm_btn_title,
        options.cancel_btn_title
    );
}

function openMarketDojo() {
    $.ajax({
        url: "/ajax/create_event_on_marketdojo/",
        type: 'POST',
        success: function (response) {
            url = response.redirect_url;
            window.open(url, '_blank');
        },
        async: false
    });
}

// Forms
// options = url, dialog, form_id, on_success
function submitForm(options) {
    const $form = $('#' + $.escapeSelector(options.form_id));
    let disabled = $form.find( ':disabled' ).removeAttr( 'disabled' );
    const data = new FormData($form.get(0));
    disabled.attr( 'disabled', 'disabled' );
    $form.find(':submit').prop('disabled', true);
    if (options.dialog !== undefined) {
        console.log(options);
        options.dialog.find('.modal-footer :button').prop('disabled', true);
    }

    $.ajax({
        url: options.url,
        data: data,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (response) {

            if (response.success) {
                options.on_success(response);
            } else {
                validateForm($form, response.errors);
            }
            $form.find(':submit').removeAttr('disabled');
            if (options.dialog !== undefined) {
                options.dialog.find('.modal-footer :button').removeAttr('disabled');
            }
        }
    });
}


function confirmPopup(message, on_accept, yes_label, success_btn_cls_name, on_cancel, cancel_label) {

    if (message === undefined) {
        message = 'Entity will be permanently deleted. Are you sure?'
    }
    bootbox.dialog({
        message: message,
        title: "Confirmation",
        closeButton: false,
        buttons: {
            Cancel: {
                label: cancel_label || "Cancel",
                className: 'btn-outline-secondary',
                callback: function () {
                    if (on_cancel !== undefined) {
                        on_cancel();
                    }
                }
            },
            Yes: {
                label: yes_label || "Yes",
                className: success_btn_cls_name || 'btn-success',
                callback: function () {
                    if (on_accept !== undefined) {
                        on_accept();
                    }
                }
            }
        }
    });
}

function errorPopup(message, cancel_label) {
    var error_msg = 'Pending tasks';
    if (message === undefined) {
        message = 'Entity will be permanently deleted. Are you sure?';
        error_msg = 'Error!'
    }
    bootbox.dialog({
        message: message,
        title: error_msg,
        closeButton: false,
        buttons: {
            Cancel: {
                label: "Cancel",
                className: 'btn-outline-secondary',
                callback: cancel_label
            },
        }
    });
}


function initSection($container, url_from, show_loading, on_done) {

    if (show_loading == undefined) {
        show_loading = true;
    }

    if (show_loading) {
        var loading_class = 'whirl traditional';

        $container.css({'minHeight': '20%'});
        $container.addClass(loading_class);
    }


    $.get(url_from, function (response) {

        if (response.success) {

            $container.html(response.html_content);

            if (show_loading) {
                $container.css('minHeight', '');
                $container.removeClass(loading_class);
            }

            on_done();

        }

    });

}


function notificationsPopup() {

    var container = $('#notifications-popup-id'),
        data = '?';

    if (!container.is(':visible')) {
        initSection(container, '/ajax/notifications_popup/' + data, false, function (response) {
        });
    }
    toggleOverlay();

    container.toggle();
}

function walletPopup() {

    var container = $('#wallet-popup-id'),
        data = '?';

    if (!container.is(':visible')) {
        initSection(container, '/ajax/wallet_popup/' + data, false, function (response) {
        });
    }
    toggleOverlay();

    container.toggle();
}


function toggleOverlay() {
    var $container1 = $('#notifications-popup-id');
    var $container2 = $('#wallet-popup-id');

    var $overlay = $('.overlay');
    if ($overlay.css('display') === 'none') {
        $overlay.fadeIn(200);
    } else {
        $overlay.fadeOut(200);
        ([$container1, $container2]).forEach(function (elem) {
            if (elem.is(':visible')) {
                elem.toggle();
            }
        });

        var $btm_dock = $('#btm_dock');
        if ($btm_dock.is(':visible')) {
            $('#btm_dock_summoner').show();
            $btm_dock.animate({bottom: -150}, 200, function(){$btm_dock.hide()});
        }
    }
}


function initChosen(opts) {

    var selector = '.chosen',
        opts = opts || {},
        default_opts = {
            'search_contains': true
        };

    $.extend(opts, default_opts);
    $(selector).not('.chosen-select-all').chosen(opts);
    initMultiSelect(opts);
}


function initMultiSelect(opts) {

    var selector = '.chosen-select-all',
        default_opts = {
            numberDisplayed: 1,
            includeSelectAllOption: true,
            enableFiltering: true,
            maxHeight: 300,
            templates: {
                filter:
                '<li class="multiselect-item filter">' +
                '<div class="input-group">' +
                '<input class="form-control multiselect-search" type="text">' +
                '</div>' +
                '</li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fa fa-remove"></i></button></span>'
            }

        };

    $.extend(opts, default_opts);

    $(selector).multiselect(opts);
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function generateMpn65Colors(count) {
    return palette('mpn65', count).map(function (x) {
        return '#' + x
    });
}

$(function () {
    $(window).on('resize', function () {
        repositionPopover();
    });
    repositionPopover();
});

function repositionPopover() {
    const width = $(window).width();
    if (width > 1024) {
        const rectEl = $('#notifications-popup-button');

        if (rectEl.length > 0) {
            const rect = rectEl.get(0).getBoundingClientRect();
            $('#notifications-popup-id').css('right', width - rect.right - (rect.width / 2) + 'px');
        }


        // rect = $('#wallet-popup-button').get(0).getBoundingClientRect();
        // $('#wallet-popup-id').css('right', width - rect.right - (rect.width / 2) + 'px');
    }
}

function clearAllNotifications() {
    $.post(
        '/ajax/notifications/delete_all/',
        function(response) {
            location.href = '/';
        }
    )
}

// function sharePopup() {
//     var dialog = openFormDialog({
//         url: '/ajax/share_popup/',
//         title: 'Share',
//         class_name: 'modal-lg bg-gray',
//         on_save: function(response) {
//             submitForm({
//                 url: '/ajax/share_process/',
//                 form_id: 'share_form',
//                 dialog: dialog,
//                 on_success: function(response) {
//                     dialog.modal('hide');
//                     location.reload();
//                 }
//             });
//         }
//     });
// }

/**
 *
 * @param minDate
 */
function initializeDatePickers(minDate) {
    var options = {
        minDate: minDate,
        dateFormat: DATE_FORMAT
    };
    $('.datepicker').datepicker(options);
}

/**
 * Show error dialog with the given errors.
 * @param errors
 */
function showErrorDialog(errors) {
  bootbox.dialog({
    title: 'Notification',
    message: errors,
    closeButton: false,
    buttons: {
      Close: {
        callback: function () {
          setTimeout(function () {
            if ($('.modal-dialog').length !== 0) {
              $('body').addClass('modal-open').css('paddingTop', '15px');
            }
          }, 500)
        }
      }
    }
  });
}

/**
 * Shows notification using Noty.js library.
 *
 */
function notifyShow(text, opts) {

    if (text == undefined) {
        text= "Action successfully completed!";
    }

    let defaultOpts = {
        text: text,
        type: "success",
        theme: "bootstrap-v4",
        timeout: 2000,
        animation: {
            open: "animated bounceInDown",
            close: "animated bounceOutUp"
        },
        layout: 'topCenter',
        closeWith: ['click', 'button']
    };

    opts = $.extend(defaultOpts, opts);

    new Noty(opts).show();
}

/**
 * Initialize Bootstrap's tooltip
 */
function initTooltip() {

    $(".tooltip").remove();

    $("[data-toggle='tooltip']").tooltip();

}

/**
 * Initialize Choices JS on a input element
 */

function initializeTagsInput(elementId) {
    var firstElement = document.getElementById(elementId);
    var choices1 = new Choices(firstElement, {
        delimiter: ',',
        editItems: true,
        maxItems: 5,
        removeButton: true,
        removeItemButton: true,
        duplicateItemsAllowed: false
    });
}

/**
 * BlockUI wrapper
 */

function blockUICss(message, opts) {

    var default_opts = {
        css: {
            border: "none",
            padding: "15px",
            backgroundColor: "#000",
            "-webkit-border-radius": "10px",
            "-moz-border-radius": "10px",
            opacity: .5,
            color: "#fff"
            //                zIndex: 1050
        },
        baseZ: 9999,
        message: message,
        forceIframe: false
    };

    if (message === undefined) {
        default_opts["message"] = "<h3>Please wait a few seconds.</h3>";
    }

    opts = $.extend(default_opts, opts);

    $.blockUI(opts);
}

/**
 * Loading spinner
 */
function showOverlaySpinner (selector) {
   const loadingDiv = $('<div>', {'class': 'loading-overlay'});
   $(selector).append(loadingDiv);
}

function hideOverlaySpinner () {
    $('.loading-overlay').remove();
}
