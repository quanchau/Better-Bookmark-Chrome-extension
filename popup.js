var slidedown = true;
var bookmarksSlide = true;
var dateTags = {};
$(document).ready(function(){

	$("#bookmarks").hide();
	$("#topic").hide();
	$("#addCurrentLink").click(function(){
		if (slidedown) {
			$("#topic").slideDown();
			slidedown = false;
		} else {
			$("#topic").slideUp();
			slidedown = true;
		}
	});

	$("#save").click(
		function saveLink() {
			var title = $("#title").val();
			if (title.length === 0) {
				$("#failmessage").text("Cannot save bookmarks with empty title");
				$("#success").text(""); 
			}
			else {
			//	var urla = "about:blank";
				 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			
    				$("#bookmarks").append('<a id="' + title + '" href= "' + tabs[0].url + '" target= "_blank" > <b>' + title+ '</b> </a> <br>');
 				 });

		$("#failmessage").text("");
		$("#success").text("Link added!"); 
	}
	$("#title").val("");
});


	$("#addAllLinks").click(function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		var hour = hours(today);
		var am_pm = ampm(today);
    	var tempID = "" + mm + dd + yyyy + hour; // need to make ID more specific with time
    	$("#topic").slideUp();
    	$("#success").text("All links added!"); 
    	var urls = {};
  	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				urls[i]= tabs[i].url;
			}
    		
 		});

 		dateTags[parseInt(tempID)] = urls;
    	
    	$("#bookmarks").append('<div id="dates" class="' + tempID + '"> <b>' + mm + '/' + dd + '/' + yyyy + ' ' + hour+''+ am_pm +'</b> </div>');

    });

	$("#openLink").click(function() {
		if (bookmarksSlide) {
			$("#bookmarks").slideDown();
			bookmarksSlide = false;
		} else {
			$("#bookmarks").slideUp();
			bookmarksSlide = true;
		}
	})

    $("#dates").click(function() {
    	var cl = $(this).attr("class");
    	var urls = dateTags[parseInt(cl)];
    	for (var i = 0; i < urls.length; i++) {
    		window.location.href = urls[i];
    	}

    });

});



function hours(date)
{
	var hours = date.getHours();
	if(hours > 12)
        return hours - 12; // Substract 12 hours when 13:00 and more
    return hours;
}

function ampm(date)
{
	if(date.getHours()==0 && date.getMinutes()==0 && date.getSeconds()==0)
        return ''; // No AM for MidNight
    if(date.getHours()==12 && date.getMinutes()==0 && date.getSeconds()==0)
        return ''; // No PM for Noon
    if(date.getHours()<12)
    	return ' AM';
    return ' PM';
}




