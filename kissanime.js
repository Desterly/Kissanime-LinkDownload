var _URL = window.location.origin;

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });

$.ajaxSetup({async:false});
$.getScript("http://kissanime.com/Scripts/asp.js");

var api_key = "AIzaSyB3rh1o1g5PRkaPldxW-laX-12e7mhZ5Tg";
var long_url; 

var startEpisode; 
do {
	startEpisode = prompt("Enter episode number you want to start from");
	if(startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps"); 
	} else {
		break; 
	}
} while(true); 

var endEpisode; 
do {
	endEpisode = prompt("Enter episode number you want to end at");
	if(endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps");
	} else {
		break;
	}
} while(true); 
var videoQuality = prompt("Enter video quality you want to download. Example - '960x720.mp4' (without the quotes)"); 

var i; 
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
         url:    _URL + episodeLinks[i], 
         success: function(result) {
                    var $result = eval($(result));
					var stringStart = result.search("var wra"); 
					var stringEnd = result.search("document.write"); 
					var javascriptToExecute = result.substring(stringStart, stringEnd);
					eval(javascriptToExecute);
					
					$("body").append('<div id="episode' + i + '" style="display: none;"></div>');
					$('#episode' + i).append(wra); 
					
					var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
					var j; 
					for(j = 0; j < downloadQualityOptions.length; j++) {
						if(videoQuality === downloadQualityOptions[j].html()) {
							long_url = downloadQualityOptions[j].attr('href');
							console.log(i); 
							get_short_url(long_url, api_key);
						}
					}
                  },
         async:   false, 
		 script:  true
    });       
}


function get_short_url(long_url, api_key)
{
    $.ajax({
       url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + api_key,
       type: 'POST',
       contentType: 'application/json; charset=utf-8',
       data: '{ longUrl: "' + long_url + '"}',
       dataType: 'json',
       async: true,
       success: function(response) {
           console.log(response.id);
       }
    });
}
