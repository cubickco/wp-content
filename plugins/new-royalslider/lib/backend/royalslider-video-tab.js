;(function($) {
	/**
	 * 
	 * NewRSVideoSelect
	 * 
	 */
	function NewRSVideoSelect(element, admin) {
		var self = this;
		var videoTab = self.el = element;
		self.admin = admin;

		var input = self.input = videoTab.find('[name="slides[video][url]"]');
		self.status = newRsVars.supports_video;
		self.urlstatus = $('<div class="video-url-status status-text"></div>').appendTo(element);
		self.currUrl = '';

		self.currTitle = '';
		self.currDesc = '';

		//self.vTitle = element.find('input[name="slides[video][title]"]');
		//self.vDescription = element.find('textarea');
		
		var timeout;
		
		input.bind('textchange.rsvt', function() {
			if(timeout) clearTimeout(timeout);
			timeout = setTimeout(function () {

				self.updateVideoData(self, input.val());
			}, 600);
		}).bind('change.rsvt', function() {
			if(timeout) clearTimeout(timeout);
			self.updateVideoData(self, input.val());
		});
		self.urlstatus.delegate('button', 'click', function() {
			self.admin.setTitleCaption(self.currTitle, self.currDesc, true);
			$(this).remove();
		});
			

		
				

			


	}


	NewRSVideoSelect.prototype = {
		updateVideoData: function(self, url, onChange) {
			var match,
				regExp,
				type,
				videoId;
			if(url) {
				type = '';
				videoId = '';
				if( url.match(/youtu\.be/i) || url.match(/youtube\.com/i) ) {
					regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				    match = url.match(regExp);
				    if (match && match[2].length==11){
				        videoId = match[2];
				    }
				    type = 'YouTube';
				} else if(url.match(/vimeo\.com/i)) {
					regExp = /(www\.)?vimeo.com\/(\d+)($|\/)/;
					match = url.match(regExp);
					if(match) {
						videoId = match[2];
					}
					type = 'Vimeo';
				}

				if(type && !videoId) {
					self.setStatus( newRsVars.incorrect_x_video_url.replace('%s',type) );
				} else if(!type && !videoId) {
					self.setStatus( newRsVars.incorrect_video_url );
				} else if(type && videoId) {
					newStatus = type + ' : ' + videoId;
					self.getImageData(type, videoId);
				}
			} else {
				self.currUrl = '';
				self.setStatus( '' );
				self.admin.setVideoImage('','');
			}
			
			
		},

		retrieveYouTubeAPIKey: function(type, videoId) {
			var self = this,
				youtubekeyvalue;

			if( !$('#youtube-api-code-form').length ) {
				$('body').append('<div id="youtube-api-code-form">'+
							    '<form style="padding: 10px;">'+
							    	
							    	'<p style="margin-bottom:10px;margin-top:0;">Please enter YouTube API code to fetch image, title and description. You need to enter it only once per website. Code can be also changed on RoyalSlider Settings page.<br/><a href="http://help.dimsemenov.com/kb/wordpress-royalslider-tutorials/wp-how-to-get-youtube-api-key" target="blank">Guide on how to generate the code &rarr;</a></p>'+
							        '<label style="margin-right:3px;" for="name">API code</label> '+
							        '<input type="text" autofocus name="youtube-api-code-inp" id="youtube-api-code-inp" class="text ui-widget-content ui-corner-all" />'+
							        '<div id="youtube-form-status"></div>' +
							   '</form>'+
							'</div>');
			}
			$('#youtube-form-status').html('');

			var errMsg = 'There was a problem saving YouTube API code option. Try entering it manually on RoyalSlider Settings page and refresh this page, or contact plugin support.';

			var dialog = $("#youtube-api-code-form").dialog({
		        autoOpen: true,
		        modal: true,
		        width:400,
		        buttons: {
		            "OK": function() {

		            	youtubekeyvalue = $("#youtube-api-code-inp").val();

		            	$('#youtube-form-status').html('updating...');

		            	$.ajax({
							url: newRsVars.ajaxurl,
							type: 'post',
							data: {
								action : 'updateYouTubeAPICode',
								youtube_api_code: youtubekeyvalue,
								_ajax_nonce : newRsVars.youTubeAPICodeNonce
							}
						}).done(function( data ) {
							if(data.indexOf('[UPDATED]') > -1) {
								$('#youtube-api-code-setting').val(youtubekeyvalue);
								self.getImageData(type, videoId, youtubekeyvalue);
							} else {
								alert( errMsg );
							}
							dialog.dialog("close");
							
						}).error(function() {
							alert( errMsg );
						});

		                //var youtubekeyvalue = $("#youtube-api-code-inp").val();
		               	//alert( youtubekeyvalue );
		                //$(this).dialog("close");
		            },
		            "Cancel": function() {
		                dialog.dialog("close");
		            }
		        }
		    });


			return '';


		},

		getImageData: function(type, videoId, updatedYouTubeAPIKey) {
			var self = this;
			var isVimeo = Boolean(type === 'Vimeo');
			var youTubeAPIKey = updatedYouTubeAPIKey || $('#youtube-api-code-setting').val() || '';
			
			if(!isVimeo && !youTubeAPIKey) {
				youTubeAPIKey = self.retrieveYouTubeAPIKey(type, videoId); //'AIzaSyA_IpXGVybnFnWEwFj0U7CEMmWvRkLmJ7k';
				if(!youTubeAPIKey) {
					return;
				}
			}

			var url = isVimeo ? 
				(window.location.protocol !== "https:" ? 'http' : 'https') + '://vimeo.com/api/v2/video/' + videoId+ '.json?callback=?' : 
				'https://www.googleapis.com/youtube/v3/videos?id='+videoId+'&key='+youTubeAPIKey+'&part=snippet';

			if(url === self.currUrl) {
				return;
			}

			if(self.currRequest){
				self.currRequest.abort();
			}


			self.requestTimeout = setTimeout(function() {
				self.setStatus( newRsVars.incorrect_id_url );
				self.currUrl = '';
			}, 12000);

			var img,
				thumb,
				title,
				description;

			self.setStatus( newRsVars.fetching_video_data );
			self.currUrl = url;
			self.currRequest = $.getJSON(
				url,
				function(data) {
					



					if(isVimeo) {
						data = data[0];
						img = data.thumbnail_large;
						thumb = data.thumbnail_small;
						title = data.title;
						description = data.description;
					} else {
						if(data.items && data.items.length && data.items[0].snippet) {

							var forceMaxResolution = $('#video-forceMaxVideoCoverResolution').val() === 'maximum';

							data = data.items[0].snippet;

							if(forceMaxResolution && data.thumbnails.maxres) {
								img = data.thumbnails.maxres.url; // 1280px+
							} else if(data.thumbnails.standard) {
								img = data.thumbnails.standard.url; // 640px
							} else {
								img = data.thumbnails.high.url; // 480px
							}
							
							thumb = data.thumbnails.default.url;
							title = data.title;
							description = data.description;
						}
						
					}

					var completeStatus = newRsVars.found_video + ' <strong>"' + title+ '"</strong>'; 
					if( !self.setVideoImagePaths(img, thumb, title, description) ) {
						completeStatus += ' <button class="button ">' + newRsVars.fetch_title_description + '</button>';
					}
					self.setStatus( completeStatus )
					self.currRequest = null;
					clearTimeout(self.requestTimeout);
					self.requestTimeout = null;
				}
			).error(function() {
				self.currUrl = '';
				self.currRequest = null;
				self.onVideoDataLoadError(type);
				clearTimeout(self.requestTimeout);
				self.requestTimeout = null;
			});


		},
		setStatus: function(newStatus) {
			var self = this;
			if(newStatus !== self.status) {
				self.status = newStatus;
				self.urlstatus.html(self.status);
			}
		},
		destroy: function() {
			var self = this;
			self.input.unbind('textchange.rsvt change.rsvt');
			self.urlstatus.undelegate('button', 'click');
			self.urlstatus.remove();
		},
		onVideoDataLoadError: function(type) {
			var self = this;
			self.setStatus( newRsVars.incorrect_x_video_url.replace('%s',type) );
		},
		setVideoImagePaths: function(img, thumb, title, description) {
			var self = this;

			self.currTitle = title;
			self.currDesc = description;
			self.admin.setVideoImage(img, thumb);
			return self.admin.setTitleCaption(title, description);

			//self.setStatus('');
			//ideoDataHolder.empty();
			
			//videoDataHolder.append('<img src="'+img+'" />');
			// videoDataHolder.append('<img src="'+thumb+'" />');
			////self.vTitle.val(title);
			//self.vDescription.html(description);
		}
	};



	$.fn.newRSVideoSelect = function(admin) {    
		return this.each(function(){
			var self = $(this);
			var o = new NewRSVideoSelect(self, admin);
			$(this).data('newRSVideoSelect', o);
		});
	};
})(jQuery);