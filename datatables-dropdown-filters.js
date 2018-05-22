/*! Copyright (c) 2018 Kelven Yao (https://github.com/gy594)
 * 
 * Version: 1.1.1
 *
 */
(function($) {

$.fn.dropdownFilters = function(table, columns) {

    table.columns().flatten().each(function (colIdx) {
        $('.dataTables_filter').hide();
        if (columns.indexOf(colIdx) != -1) {
            var th = table.column(colIdx).header();
            var title = $(th).html();
            $(th).wrapInner('<div style="display:none">');

            var select = $('<select class="column-filter-'+colIdx+'" style="max-width:350px" />')
                .appendTo(
                    table.column(colIdx).header()
                )
                .on('change', function () {
                    if ($(this).val() == '--All--') {
                        table.column(colIdx).search('').draw();
                    }
                    else {
                        var searchText = $(this).val()
                        searchText = "^" + replaceSpcialChars(searchText) + "$";
                        table.column(colIdx).search(searchText, true, false, false).draw();

                    }
                    
                })
            ;

            select.append($('<option value="--All--">' + title + '(All)</option>'));
            // Get the search data for the first column and add to the select list
            table
                .column(colIdx)
                .cache('search')
                .sort()
                .unique()
                .each(function (d) {
                    select.append($('<option value="' + d + '">' + d + '</option>'));
                });
        }
    });

};
    
function replaceSpcialChars (stringToReplace) {
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";
    for (var i = 0; i < specialChars.length; i++) {
        stringToReplace = stringToReplace.replace(new RegExp("\\" + specialChars[i], 'gi'), '\\' + specialChars[i]);
    }
    return stringToReplace;
}

$.fn.dataTableExt.oApi.fnFilterClear = function (oSettings) {
    var i, iLen;
    console.log("clear filter");
    /* Remove global filter */
    if (oSettings == 'undefined' || oSettings==null) {
        return;
    }
    if (oSettings.oPreviousSearch != 'undefined'|| oSettings.oPreviousSearch!=null) {
        oSettings.oPreviousSearch.sSearch = "";
    }

    /* Remove the text of the global filter in the input boxes */
    if (typeof oSettings.aanFeatures.f != 'undefined') {
        var n = oSettings.aanFeatures.f;
        for (i = 0, iLen = n.length ; i < iLen ; i++) {
            $('input', n[i]).val('');
        }
    }

    /* Remove the search text for the column filters - NOTE - if you have input boxes for these
     * filters, these will need to be reset
     */
    for (i = 0, iLen = oSettings.aoPreSearchCols.length ; i < iLen ; i++) {
        oSettings.aoPreSearchCols[i].sSearch = "";
    }

    /* Redraw */
    oSettings.oApi._fnReDraw(oSettings);
};

$.fn.dataTableExt.oApi.clearSearch = function (oSettings) {
    console.log("clear search");

    var table = this;

    var clearSearch = $('<img title="Delete" alt="" src="data:image/png;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD2SURBVHjaxFM7DoMwDH2pOESHHgDPcB223gKpAxK34EAMMIe1FCQOgFQxuflARVBSVepQS5Ht2PHn2RHMjF/ohB8p2gSZpprtyxEHX8dGTeMG0A5UlsD5rCSGvF55F4SpqpSm1GmCzPO3LXJy1LXllwvodoMsCpNVy2hbYBjCLRiaZ8u7Dng+QXlu9b4H7ncvBmKbwoYBWR4kaXv3YmAMyoEpjv2PdWUHcP1j1ECqFpyj777YA6Yss9KyuEeDaW0cCsCUJMDjYUE8kr5TNuOzC+JiMI5uz2rmJvNWvidwcJXXx8IAuwb6uMqrY2iVgzbx99/4EmAAarFu0IJle5oAAAAASUVORK5CYII=" style="vertical-align:text-bottom;cursor:pointer;" />');
    $(clearSearch).click(function () {
        table.fnFilter('');
        $('input[type=search]').val('');
    });
    $(oSettings.nTableWrapper).find('div.dataTables_filter').append(clearSearch);
    $(oSettings.nTableWrapper).find('div.dataTables_filter label').css('margin-right', '-16px');//16px the image width
    $(oSettings.nTableWrapper).find('div.dataTables_filter input').css('padding-right', '16px');
}

    //auto-execute, no code needs to be added
$.fn.dataTable.models.oSettings['aoInitComplete'].push({
    "fn": $.fn.dataTableExt.oApi.clearSearch,
    "sName": 'whatever'
});



})(jQuery);
