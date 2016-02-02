var b1boolean = 0; // starts closed
var b2boolean = 0;
var b3boolean = 0;

$(document).ready(function() {
	$(".accordionLists").hide();
});

$(document).ready(function() {

	var slideSpeed = 200;

	$("#b1").click(function() {
		if(b1boolean == 1) {
			b1boolean = 0;
			$("#list1").slideUp(slideSpeed);
		} else if(b1boolean == 0) {
			b1boolean = 1;
			$("#list1").slideDown(slideSpeed);

			b2boolean = 0;
			$("#list2").slideUp(slideSpeed);
			b3boolean = 0;
			$("#list3").slideUp(slideSpeed);
		}
	});
	$("#b2").click(function() {
		if(b2boolean == 1) {
			b2boolean = 0;
			$("#list2").slideUp(slideSpeed);
		} else if(b2boolean == 0) {
			b2boolean = 1;
			$("#list2").slideDown(slideSpeed);

			b1boolean = 0;
			$("#list1").slideUp(slideSpeed);
			b3boolean = 0;
			$("#list3").slideUp(slideSpeed);
		}
	});
});

// for navigation on main page (index.html)
$(document).ready(function () {
	$("#b1sb1").click(function () {
		window.location.href = $('a', this).attr('href');
	});

	$("#b1sb2").click(function () {
		window.location.href = $('a', this).attr('href');
	});

	$("#b2sb1").click(function () {
		window.location.href = $('a', this).attr('href');
	});

	$("#b2sb2").click(function () {
		window.location.href = $('a', this).attr('href');
	});
});