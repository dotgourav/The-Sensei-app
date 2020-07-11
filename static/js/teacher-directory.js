const teacherDirectory = (function ($) {
  'use strict';


  // Cache DOM
  let activeFilters = null;
  const $teachersTable = $('.js-teachers-table');
  const $filterDropdownButton = $('.js-filter-dropdown');
  const $filterForm = $('.js-filter-form');
  const $applyFiltersButton = $('.js-apply-filters');

  // Bind events
  $filterDropdownButton.on('click', __toggleFilterDropdown);
  $applyFiltersButton.on('click', __applyFilters);

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
        'data': function (d) {
          d.selectedFilters = activeFilters;
        },
        beforeSend: function () {
          showOverlaySpinner('body');
        },
        complete: function () {
          hideOverlaySpinner();
          initChosen();
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

  function __toggleFilterDropdown () {
    $filterForm.toggle();
  }

  function __applyFilters () {
    let selectedFilters = $filterForm.serialize();
    setActiveFilters(selectedFilters);
    __toggleFilterDropdown();
    _reloadTeacherListTable();
  }

  function setActiveFilters (selectedFilters) {
    activeFilters = selectedFilters;
    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      $filterDropdownButton.addClass('btn-success option-selected')
    } else {
      $filterDropdownButton.removeClass('btn-success option-selected')
    }
  }

  function getActiveFilters () {
    return activeFilters;
  }

  function _reloadTeacherListTable () {
    $teachersTable.DataTable().ajax.reload();
  }
}(jQuery));
