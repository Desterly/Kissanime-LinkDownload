var _URL = window.location.origin;

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });

$.ajaxSetup({async:false});
$.getScript("https://kissanime.com/Scripts/asp.js");

var api_key = "AIzaSyB3rh1o1g5PRkaPldxW-laX-12e7mhZ5Tg";
var long_url;

var startEpisode;
do {
	startEpisode = prompt("Enter episode number you want to start from");
	if(startEpisode === null) {
    throw new Error("Script canceled by user!");
  }
	if(Number(startEpisode) <= 0 || Number(startEpisode) > episodeLinks.length) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps");
	} else {
		break;
	}
} while(true);

var endEpisode;
do {
	endEpisode = prompt("Enter episode number you want to end at");
	if(endEpisode === null) {
	  throw new Error("Script canceled by user!");
	}
	if(Number(endEpisode) <= 0 || Number(endEpisode) > episodeLinks.length || Number(endEpisode) < Number(startEpisode)) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps");
	} else {
		break;
	}
} while(true);
var videoQuality = prompt("Enter video quality you want to download. Example - '1280x720.mp4' (without the quotes)");

// Defining a sensible default value for video quality so we can skip this prompt
if(videoQuality === null) {
  videoQuality = '1280x720.mp4';
}

var links = '\n';
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
					j = 0;
					//for(j = 0; j < downloadQualityOptions.length; j++) {
					//	if(videoQuality === downloadQualityOptions[j].html()) {
							long_url = downloadQualityOptions[j].attr('href');
							long_desc = 'Episode_' + (episodeLinks.length - i) + '_' + videoQuality;
							console.log(i);
							get_short_url(long_desc,long_url, api_key);
					//	}
					//}
                  },
         async:   false,
		 script:  true
    });
}

console.log(links);

function get_short_url(long_desc,long_url, api_key)
{
    $.ajax({
       url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + api_key,
       type: 'POST',
       contentType: 'application/json; charset=utf-8',
       data: '{ longUrl: "' + long_url + '"}',
       dataType: 'json',
       success: function(response) {
           links += '<a href="' + response.id + '">' + long_desc + '</a>\n';
       }
    });
}
