(function($){

	$.fn.swipeDelete = function(o){
		o = $.extend( {}, $.fn.swipeDelete.defaults, o );
		
		return this.filter('[data-swipeurl]').each(function(i, el){
			var $e = $(el);
			var $parent = $(el).parent('ul');

			$e.on(o.direction, function ( e ) {

				// reference the current item
				var $li = $(this);
				var cnt = $('.ui-btn', $li).length;
				// remove all currently displayed buttons
				$('div.ui-btn, .' + o.btnClass, $parent).animate({ width: 'toggle' }, 200, function(e) {
					$(this).remove();

				});

				// if there's an existing button we simply delete it, then stop
				if (!cnt) {
					// create button
					var $swipeBtn = $('<a>' + o.btnLabel + '</a>').attr({
										'data-role': 'button',
										'data-mini': true,
										'data-inline': 'true',
										'data-rel': 'dialog',
										'class': (o.btnClass === 'aSwipeBtn') ? o.btnClass : o.btnClass + ' aSwipeBtn',
										'data-theme': o.btnTheme,
									})
									.on('click tap', o.click);

					$swipeBtn.prependTo($li).button();
					$li.find('.ui-btn').hide().animate({ width: 'toggle' }, 200);

					$('div a:not(' + o.btnClass + ')', $li).on('click.swipe', function(e){
						
						e.stopPropagation();
						e.preventDefault();
						$(this).unbind('click.swipe');
						$li.removeClass('ui-btn-active').find('div.ui-btn').remove();
					});

				}


			});

		});
	};

	$.fn.swipeDelete.defaults = {
		direction: 'swiperight',
		btnLabel: '',
		btnClass: 'aSwipeBtn',
		click: function(e){
		 $("#deleteconfirmation").popup("open", {positionTo: 'window'});
			$(".deleteyes").click(function(){
				$('li .aSwipeBtn').closest('li').remove();
			});
			$(".deleteno").click(function(){
				$('.aSwipeBtn').remove();
			});
		}
	};
	
}(jQuery));	
	

