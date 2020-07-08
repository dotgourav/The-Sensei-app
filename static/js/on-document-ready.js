$(function () {
    initChosen();

    // Hide dropdowns on click outside, dropdown has to have ".j-dropdown", toggler to have ".dropdown-toggle"
    $(document).on('click', function (e) {
        $('.j-dropdown').each(function () {
            if($(this).is(':visible') && !$(e.target).hasClass('dropdown-toggle') && !$(e.target).hasClass('j-dropdown') && !$(e.target).parents().hasClass('j-dropdown')){

                $(this).hide();
            }
        });
    })

});