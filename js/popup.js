var slidedown = true;
$(document).ready(function(){
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
		var pathname = window.location.pathname; // Returns path only
		var url      = window.location.href;
		if ($("#" + title).val > 0) { 
			$("#" + title).append("<p> url </p>");
		} else {
			$("#bookmarks").append('<a id="' + title + '" href= "' + url + '" target= "_blank" > <b>' + title+ '</b> </a> <br>');
		}
			$("#failmessage").text("");
			$("#success").text("Link added!"); 
		}
		 $("#title").val("");
	});
	var dateTags = {};

	$("#addAllLinks").click(function() {
		var today = new Date();
    	var dd = today.getDate();
    	var mm = today.getMonth()+1;
    	var yyyy = today.getFullYear();
    	var tempID = "" + mm + dd + yyyy;
		$("#topic").slideUp();
		$("#success").text("All links added!"); 
		chrome.tabs.query({}, function(tabs) {
    		var urls = tabs.map(function() {
		    	 return tab.url;
   			});
   			dateTags[parseInt(tempID)] = urls;

   		 });

    	
    	$("#bookmarks").append('<div id="dates" class="' + tempID + '"> <b>' + mm + '/' + dd + '/' + yyyy+ '</b> </div>');
  
    });

    $("#dates").click(function() {
    	var cl = "" + $(this).attr("class");
    	var urls = dateTags[parseInt(cl)];
    	for (var i = 0; i < urls.length; i++) {
    		window.location.href = ""+urls[i];
    	}

    });


 /**   $("#dates").click(function() {

    }); */


	
        
	




});

