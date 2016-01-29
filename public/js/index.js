var b1boolean = 1; // starts open
var b2boolean = 1;
var b3boolean = 1;

$(document).ready(function() {
	$("#b1").click(function() {
		if(b1boolean == 1) {
			b1boolean = 0;
			$("#list1").slideUp();
		} else if(b1boolean == 0) {
			b1boolean = 1;
			$("#list1").slideDown();
			
			b2boolean = 0;
			$("#list2").slideUp();
			b3boolean = 0;
			$("#list3").slideUp();
		}
	})
	$("#b2").click(function() {
		if(b2boolean == 1) {
			b2boolean = 0;
			$("#list2").slideUp();
		} else if(b2boolean == 0) {
			b2boolean = 1;
			$("#list2").slideDown();

			b1boolean = 0;
			$("#list1").slideUp();
			b3boolean = 0;
			$("#list3").slideUp();
		}
	})
	$("#b3").click(function() {
		if(b3boolean == 1) {
			b3boolean = 0;
			$("#list3").slideUp();
		} else if(b3boolean == 0) {
			b3boolean = 1;
			$("#list3").slideDown();

			b1boolean = 0;
			$("#list1").slideUp();
			b2boolean = 0;
			$("#list2").slideUp();
		}
	})
});