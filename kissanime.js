var URL = window.location.origin;
var hostName = window.location.hostname;
var fullURL = window.location.href;
var resolutions = ["1280x720.mp4","1080x720.mp4","960x720.mp4","640x360.mp4","480x360.mp4","320x230.3gp","320x180.3gp"];
var api_key = "AIzaSyB3rh1o1g5PRkaPldxW-laX-12e7mhZ5Tg";
// determine if user is on KissAnime and on the anime's main episode page
if (hostName.search(/kissanime\.\w+/i) != -1){	
	if (fullURL.search(/kissanime\.\w+\/Anime\//i) == -1) {
		alert("You are not on the Anime's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}
// determine if user is on KissCartoon and on the cartoon's main episode page
else if (hostName.search(/kisscartoon\.\w+/i) != -1){
	if (fullURL.search(/kisscartoon\.\w+\/Cartoon\//i) == -1) {
		alert("You are not on the Cartoon's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}
// determine if user is on KissAsian and on the drama's main episode page
else if (hostName.search(/kissasian\.\w+/i) != -1){
	if (fullURL.search(/kissasian\.\w+\/Drama\//i) == -1) {
		alert("You are not on the Drama's main episode page.");
		//fake function to cause script to terminate
		AbortJavaScript();
	}
}
else {
	alert("You are not on a valid Kiss (Anime/Cartoon/Asian) site to use this script.");
	//fake function to cause script to terminate
	AbortJavaScript();
}

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });
console.log('Found ' + episodeLinks.length + ' episode links on current page.');
if (episodeLinks === 0 || episodeLinks === null) {
	alert("There are no episode links on this page.");
	//fake function to cause script to terminate
	AbortJavaScript();
}

$.ajaxSetup({async:false});
$.getScript(URL + "/Scripts/asp.js");

var startEpisode; 
do {
	startEpisode = prompt("There are " + episodeLinks.length + " episodes found.\nEnter the episode number that you want to start from:");
	if (startEpisode === null) {
		throw new Error("Script cancelled by user!");
	}
	startEpisode = Number(startEpisode);
	if (startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length); 
	} else {
		break; 
	}
} while(true); 
console.log('Starting episode: ' + startEpisode)

var endEpisode; 
do {
	endEpisode = prompt("Starting from episode " + startEpisode + "\nEnter the episode number that you want to end at :");
	if (endEpisode === null) {
		throw new Error("Script cancelled by user!");
	}
	endEpisode = Number(endEpisode);
	if (endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
		alert("Episode number must be greater than 0 and less than " + episodeLinks.length);
	} else {
		break;
	}
} while(true); 
console.log('Ending episode: ' + endEpisode)

var links = '\n';
var i;
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
         url:    URL + episodeLinks[i],
         success: function(result) {
					var $result = eval($(result));
					
					$("body").append('<div id="episode' + i + '" style="display: none;"></div>');
					$('#episode' + i).append($result.find('#divDownload'));

					var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
					var j;
					j = 0;
					var k;
					k = 0;
					resolutionloop:
					for(j=0;j< resolutions.length;j++) {
						qualityloop:
						for(k = 0; k < downloadQualityOptions.length;k++)
						{
							if (resolutions[j] === downloadQualityOptions[k].html()) {
								long_url = downloadQualityOptions[k].attr('href');
								long_desc = 'Episode_' + (episodeLinks.length - i) + '_' + resolutions[j];
								console.log(i);
								get_short_url(long_desc,long_url, api_key);
								break resolutionloop;
							}
						}
					}
		//console.log('Completed: ' + count + '/' + ((endEpisode-startEpisode)+1));
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
