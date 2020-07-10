const teacherDirectory = (function ($) {
  'use strict';


  // Cache DOM
  const $teachersTable = $('.js-teachers-table');

  teachersTable();

  return {}
  ///

  function teachersTable () {
    let teachersTable = $teachersTable.DataTable({
      'serverSide': true,
      'paging':   true,
      'ordering': true,
      'info': false,
      'searching': true,
      'iDisplayLength': 10,
      'stateSave': true,
      'dom': 'tp',  // Table, pagination
      ajax: {
        url: '/ajax/teacher-directory/',
        beforeSend: function () {
          showOverlaySpinner('body');
        },
        complete: function () {
          hideOverlaySpinner();
        }
      },
      aoColumns: [
        {
          mData: 'profile_picture',
          render: function (data, type, row, meta) {
            let ownerDiv = data.html_content;
            return ownerDiv;
          },
          bSortable: false
        },
        { mData: 'first_name' },
        { mData: 'last_name' },
        { mData: 'email' },
        { mData: 'phone' },
        { mData: 'room_number' },
        { mData: 'subjects' },
      ],
      'createdRow': function( nRow, aData){
        $(nRow).addClass('cursor-pointer');
        $(nRow).find('td:eq(0)').addClass('projects-list--owner-column');
      },
      'initComplete': function(settings, json) {
        initTooltip();
      }
    });

    $(".js-teachers-table tbody").on('click', 'tr', function () {
      const row = teachersTable.row(this).data();
      window.location = `/teacher/${row.id}`;
    });
  }

}(jQuery));
