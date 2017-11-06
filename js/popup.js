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
			}
			else {
			//	var urla = "about:blank";
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

				$("#bookmarks").append('<a id="' + title + '" href= "' + tabs[0].url + '" target= "_blank" > <b>' + title+ '</b> </a> <br>');
				saveChanges();
			});

			$("#failmessage").text("");
			$("#success").text("Link added!");; 
		}
		$("#title").val("");
		saveChanges();
	});


	$("#addAllLinks").click(function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		var hour = hours(today);
		var min = today.getMinutes();
		var am_pm = ampm(today);
    	var tempID = "" + mm + dd + yyyy + hour + min; // need to make ID more specific with time
    	$("#topic").slideUp();
    	$("#success").text("All links added!"); 
    	chrome.windows.getCurrent({"populate":true}, function(currentWindow) {
    		var urls = "";
    		var tabs = currentWindow.tabs;
    		for (var i = 0; i < tabs.length; i++) {
    			urls = urls +  tabs[i].url;
    			urls = urls +  " ";
    		}

    		$("#bookmarks").append('<div class="dates" id="' + tempID + '"> <b>' + mm + '/' + dd + '/' + yyyy + ' ' + hour+':'+min+ am_pm +'</b> </div>');	
    		dateTags[tempID] = urls;
    	//	$("#bookmarks").append('<div>' + dateTags[tempID] + '</div>');

    		saveChanges();
    	});

    	saveChanges();

    });

	$("#openLink").click(function() {
		if (bookmarksSlide) {
			$("#bookmarks").slideDown();
			bookmarksSlide = false;
		} else {
			$("#bookmarks").slideUp();
			bookmarksSlide = true;
		}

	});

	$('body').on('click', 'div.dates', function() {
		var cl = $(this).attr('id');
		chrome.storage.sync.get("dateTags", function(result) {
			var urls = result.dateTags[cl];
			$("#bookmarks").append('<div>' + urls + '</div>');
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






