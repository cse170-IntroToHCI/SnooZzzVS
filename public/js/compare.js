if(!compareVisited) {
    $('#infoIcon').attr("data-original-title", "Click me!");
    $('#infoIcon').tooltip('show');

    $('#infoIcon').click(function() {
        $('#infoIcon').tooltip('toggle');
        $('#infoIcon').attr("data-original-title", "Toggle between the buttons and see the mood level for each category that corresponds to the color on the graph");
        $('#infoIcon').tooltip('show');
    });
} else {
    $('#infoIcon').click(function() {
        $('#infoIcon').tooltip('toggle');
        $('#infoIcon').attr("data-original-title", "Toggle between the buttons and see the mood level for each category that corresponds to the color on the graph");
//					$('#infoIcon').tooltip('show');
    });
}