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

	$("#headingThree").click(function () {
		window.location.href = $('strong', this).attr('href');
	});

	$("#headingFour").click(function () {
		window.location.href = $('strong', this).attr('href');
	});
});