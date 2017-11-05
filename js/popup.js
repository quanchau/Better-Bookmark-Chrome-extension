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

	$("#addAllLinks").click(function() {
		$("#success").text("All links added!"); 
		/**chrome.tabs.query({}, function(tabs) {
    		var urls = tabs.map(function() {
		        return tab.url;
   			 });
    		All URL
		});*/
    });


	
        
	




});

