// for navigation on main page (index.html)
$(document).ready(function () {
	$("#b1sb1").click(function () {
		window.location.href = "/wake";
	});

	$("#b1sb2").click(function () {
		window.location.href = "sleep";
	});

	$("#b2").click(function () {
		window.location.href = "/happinessHistory";
	});

	$("#b3").click(function () {
		window.location.href = "/compare";
	});

	$("#b4").click(function () {
		window.location.href = "/alarm";
	});
});