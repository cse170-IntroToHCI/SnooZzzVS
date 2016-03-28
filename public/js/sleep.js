
var flipFlop = false;
var clickLogCounter = 0;

// default Form values
var today = new Date();
var theDay = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
var theHour = today.getHours() % 12; // scale = [0 - 23]. (13 = 1pm)
var theMinute = today.getMinutes();
var theMeridiem = today.getHours();
$("#loadingMask").hide();
function alertClick() {
	$("#cancelAlert").show('medium');
}

function successClick() {
	$("#setAlert").show('medium');
}

window.onload = function() {
	// preserving html to flipflop
	var preserveCalendar = $("#calendarContainer").html(),
		preserveClock = $("#clockContainer").html(),
		preserveSlider = $("#sliderContainer").html(),
		preserveTest = $("#mainForm").html();

	alertClick;

	// Calendar
	var datePicker = $('#datePicker').datepicker({format: 'mm/dd/yyyy'});
	datePicker.datepicker("setDate", today);

	// happiness slider
	var mySlider = new Slider("#happinessSlider", {});

	var defaultHour = document.getElementById("selectHour");
	if(theHour === 12 || theHour === 0) {
		theHour = 11;
	} else if(theHour >= 13) {
		theHour -= 12;
	} else {
		--theHour;
	}
	defaultHour[theHour].setAttribute("selected", "selected"); // -1 b/c array begins at zero

	var defaultMinute = document.getElementById("selectMinute");
	defaultMinute[theMinute].setAttribute("selected", "selected");

	var defaultMeridiem = document.getElementById("selectMeridiem");
	if(theMeridiem < 12) {
		defaultMeridiem[0].setAttribute("selected", "selected");
	} else {
		defaultMeridiem[1].setAttribute("selected", "selected");
	}

	$('form').submit(function() {

		// current Form values
		var dayValue = $("#selectDate").val();
		var hourValue = $("#selectHour").val();
		var minuteValue = $("#selectMinute").val();
		var meridiemValue = $("#selectMeridiem").val();
		var moodValue = mySlider.getValue();

		// Post data to JSON
		$.ajax({
			type: 'GET',
			url: '/sleepData/search?date='+dayValue,
			success: function(req) {
				// Data Not Found
				if(req === null || req === undefined || req === "") {
					// Post data to JSON
					$.ajax({
						type: 'POST',
						url: '/sleepData',
						data: {
							"date": dayValue,
							"hour": hourValue,
							"minute": minuteValue,
							"meridiem": meridiemValue,
							"feeling": mySlider.getValue()
						},
						success: function() {
							$("#setAlert").show('medium');
							$("#btnShow").hide();

							//************************************************************
							// Update Page Layout
							//************************************************************
							var newCalendarHTML = "<h3><span class='label label-info'>"+dayValue+"</span></h3>";
							var newTimeHTML = "<h3><span class='label label-info'>"+hourValue+":"+minuteValue+" "+meridiemValue+"</span></h3>";
							var newFeelingHTML = "<h3><span class='label label-info'>"+moodValue+"</span></h3><br>";

							$("#calendarContainer").html(newCalendarHTML);
							$("#sleepingAtH4").html("You went to sleepData at:");
							$("#clockContainer").html(newTimeHTML);
							$("#sliderContainer").html("<h4>Your mood level was:</h4>" + newFeelingHTML);


							var setButton = $("#setBtn");
							setButton.html("Edit")
								.attr("id", "editBtn")
								.attr("type", "button");

							flipFlop = true;
							// ----- EDITING LAYOUT ENDS HERE -----
						}
					});
				// Data already Exists
				} else {
					console.log("req:");
					console.log(req);

					for(var reqIndex in req) {
						console.log("req["+parseInt(reqIndex)+"].date = ", req[reqIndex].date);
						console.log("req["+parseInt(reqIndex)+"].mood = ", req[reqIndex].feeling);
						var idOfModals = "#preexistingLogs"+reqIndex;
						console.log("idOfModals:", idOfModals);
						var preexistingLogsText = $(idOfModals);
						preexistingLogsText.html(
							"Date: " + req[reqIndex].date + "<br>" +
							"Time: " + req[reqIndex].hour + ":" + req[reqIndex].minute + " " + req[reqIndex].meridiem + "<br>" +
							"Mood: " + req[reqIndex].feeling + "<br>" + // todo - change the id names for the buttons
							"<button id='ZZZZ'  type='submit' class='btn btn-danger' style='float: right;'>Delete</button>" +
							"<button id='ZZZZZ' type='submit' class='btn btn-primary' style='float: right; margin-right: 8px;'>Update</button>"
						);
						console.log("reqIndex = ", (parseInt(reqIndex) + 1));
						console.log("req.len  = ", req.length);
						if((parseInt(reqIndex) + 1) !== req.length) {
							var newLogsId = parseInt(reqIndex) + 1;
							preexistingLogsText.after(
								"<hr id='hr"+newLogsId+"' class='logModals' style='margin-bottom: 0; margin-top: 15px;'>" +
								"<div id='preexistingLogs" + newLogsId + "' class='modal-body logModals'></div>"
							);
							console.log("parseInt(reqIndex + 1)", newLogsId);
						}
					}

					$("#myModal").modal('show');
					$("#addSleepLogButton").click(function() {
						//$("#myModal").modal('hide');

						$("#loadingMask").show();
						$.ajax({
							type: 'POST',
							url: '/sleepData',
							data: {
								date: $("#selectDate").val(),
								hour: $("#selectHour").val(),
								minute: $("#selectMinute").val(),
								meridiem: $("#selectMeridiem").val(),
								feeling: $("#happinessSlider").val()
							},
							success: function() {
								//$("#setAlert").show('medium');
								$("#loadingMask").hide();

								// add to the current modal
								var idOfLastModal = "preexistingLogs"+(parseInt(req.length - 1));
								console.log("idOfLastModal", idOfLastModal);
								$(idOfLastModal).after(
									"<hr id='hr"+req.length+"' class='logModals' style='margin-bottom: 0; margin-top: 15px;'>" +
									"<div id='preexistingLogs" + req.length + "' class='modal-body logModals'></div>"
								);

								var tempSleepData = {
									"date": $("#selectDate").val(),
									"hour": $("#selectHour").val(),
									"minute": $("#selectMinute").val(),
									"meridiem": $("#selectMeridiem").val(),
									"feeling": $("#happinessSlider").val()
								};

								req.push(tempSleepData);

								idOfLastModal = "preexistingLogs"+req.length;
								$(idOfLastModal).html(
									"Date: " + req[req.length-1].date + "<br>" +
									"Time: " + req[req.length-1].hour + ":" + req[req.length-1].minute + " " + req[req.length-1].meridiem + "<br>" +
									"Mood: " + req[req.length-1].feeling + "<br>" + // todo - change the id names for the buttons
									"<button id='ZZZZ'  type='submit' class='btn btn-danger' style='float: right;'>Delete</button>"
								);
							},
							error: function() {
								alert("Failed to Log - Try again later :)");
							}
						});
					});
				}
			}
		});

		return false;
	});

	$("#setBtn").click(function() {
		if(flipFlop === true) {
			$("#setAlert").hide('medium');
			$("#sleepingAtH4").html("Going to sleep at:");
			$("#clockContainer").html(preserveClock);
			$("#sliderContainer").html(preserveSlider);

			$(this).html("Update")
				.attr("id", "editBtn")
				.attr("type", "button");

			new Slider("#happinessSlider", {});
			flipFlop = 2;
		} else if(flipFlop === 2) {
			$.ajax({
				type: 'PUT',
				url: '/sleepData',
				data: {
					date: $("#calendarContainer h3 span").html(),
					hour: $("#selectHour").val(),
					minute: $("#selectMinute").val(),
					meridiem: $("#selectMeridiem").val(),
					feeling: $("#happinessSlider").val()
				},
				success: function() {
					$("#sleepUpdateSuccessModal").modal('show');
				}
			});
		}
	});

	$("#okayButton").click(function() {
		window.location = './index';
	});

	// hide-listener for the modal
	$("#myModal").on('hidden.bs.modal', function() {
		$("#preexistingLogs0").html("");
		$(".logModals").remove();
	});
};

