var slidedown = true;
var bookmarksSlide = true;
var dateTags = {};
$(document).ready(function(){
	chrome.storage.sync.get("bmrks", function(obj) {
		console.log(obj);
		$("#bookmarks").append(obj.bmrks);
	});

	chrome.storage.sync.get(dateTags, function(result) {
		dateTags = result;
	});


//	chrome.storage.sync.clear();

$("#bookmarks").hide();
$("#topic").hide();
$("#addCurrentLink").click(function(){
	$("#bookmarks").slideUp();
	bookmarksSlide = true;
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
		} else if ($("#" + title).length > 0) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				$("#" + title).attr('href', tabs[0].url);
				saveChanges();
			});

			$("#failmessage").text("");
			$("#success").text("Link added to an existing title!");
		}
		else {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

				$("#bookmarks").append('<a id="' + title + '" href= "' + tabs[0].url + '" target= "_blank" > <b>' + title+ '</b> </a> <span class="delete" id="' + title + '">&nbsp; &nbsp;  X <br></span>');
				saveChanges();
			});

			$("#failmessage").text("");
			$("#success").text("Link added!");
		}
		$("#title").val("");
		saveChanges();
	});


$("#addAllLinks").click(function() {
	var today = new Date();
	var dd = "" + today.getDate();
	if (dd.length == 1) dd = "0" + dd;
	var mm = "" + (today.getMonth()+1);
	if (mm.length == 1) mm = "0" + mm;
	var yyyy = "" + (today.getFullYear());
	var hour = "" + (hours(today));
	if (hour.length == 1) hour = "0" + hour;
	var min = "" + (today.getMinutes());
	if (min.length == 1) min = "0" + min;
	var am_pm = ampm(today);
    	var tempID = "" + mm + dd + yyyy + hour + min; // need to make ID more specific with time
    	$("#topic").slideUp();
    	$("#success").text("All links added!"); 


    	if ($("#" + tempID).length > 0) {
    		chrome.windows.getCurrent({"populate":true}, function(currentWindow) {
    			var urls = "";
    			var tabs = currentWindow.tabs;
    			for (var i = 0; i < tabs.length; i++) {
    				urls = urls +  tabs[i].url;
    				urls = urls +  " ";
    			}
    			dateTags[tempID] = urls;
    			saveChanges();
    		}); 
    	} else {
    		chrome.windows.getCurrent({"populate":true}, function(currentWindow) {
    			var urls = "";
    			var tabs = currentWindow.tabs;
    			for (var i = 0; i < tabs.length; i++) {
    				urls = urls +  tabs[i].url;
    				urls = urls +  " ";
    			}

    			$("#bookmarks").append('<span class="dates" id="' + tempID + '"> <b>' + mm + '/' + dd + '/' + yyyy + ' ' + hour+':'+min+ am_pm +'</b> </span> <span class="delete" id="' + tempID + '">&nbsp; &nbsp;  X <br></span> ');	
    			dateTags[tempID] = urls;
    	//	$("#bookmarks").append('<div>' + dateTags[tempID] + '</div>');

    	saveChanges();
    	});
    	}

    	saveChanges();

    });

$("#openLink").click(function() {
	$("#topic").slideUp();
	slidedown = true;
	if (bookmarksSlide) {
		$("#bookmarks").slideDown();
		bookmarksSlide = false;
	} else {
		$("#bookmarks").slideUp();
		bookmarksSlide = true;
	}

});

$('body').on('click', 'span.dates', function() {
	var cl = $(this).attr('id');
	chrome.storage.sync.get("dateTags", function(result) {
		var urls = result.dateTags[cl];
		//	$("#bookmarks").append('<div>' + urls + '</div>');
		var res = urls.split(" ");
		for (var i = 0; i < res.length; i++) {
    			if (res[i].charAt(0) === 'h') { // check valid link
    				chrome.tabs.create({
    					url: res[i]
    				});
    			}


    		}

    	});

});

$('body').on('click', 'span.delete', function() {
	var tempID = $(this).attr('id');
	$("#" + tempID).remove();
	$("#" + tempID).remove();
	saveChanges();
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

function saveChanges() {
	
	chrome.storage.sync.set({"dateTags": dateTags}, function() {
          // Notify that we saved.
          message('Settings saved');
          $("#bookmarks").append('<div> saved saved! </div>');
      });

	var bm = $("#bookmarks").html();
	chrome.storage.sync.set({"bmrks": bm}, function() {
          // Notify that we saved.
          message('Settings saved');
      });
}






