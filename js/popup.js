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

			});
