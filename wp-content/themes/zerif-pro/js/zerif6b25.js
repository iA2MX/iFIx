/* LOADER */
/* global Parallax */
/* global zerifSettings */

(function ( $ ) {
	$.isMobile = {
		Android: function () {
			return navigator.userAgent.match( /Android/i );
		},
		BlackBerry: function () {
			return navigator.userAgent.match( /BlackBerry/i );
		},
		iOS: function () {
			return navigator.userAgent.match( /iPhone|iPad|iPod/i );
		},
		Opera: function () {
			return navigator.userAgent.match( /Opera Mini/i );
		},
		Windows: function () {
			return navigator.userAgent.match( /IEMobile/i );
		},
		any: function () {
			return ($.isMobile.Android() || $.isMobile.BlackBerry() || $.isMobile.iOS() || $.isMobile.Opera() || $.isMobile.Windows());
		}
	};

	$.generalActions = {
		init: function () {
			this.disablePreloader();
			this.smoothScroll();
			this.initMasonry();
			this.focusTabs();
			this.hideRecaptcha();
		},

		/**
		 * Disable preloader after an amount of time.
		 */
		disablePreloader: function () {
			jQuery( '.status' ).fadeOut();
			jQuery( '.preloader' ).delay( 500 ).fadeOut( 'slow' );
		},

		/**
		 * Smooth scroll when clicking on menu anchors.
		 */
		smoothScroll: function () {
			var anchorSelector = $( '#site-navigation a[href*="#"]:not([href="#"]), .navbar.navbar-inverse .primary-menu a[href*="#"]:not([href="#"]), header.header a[href*="#"]:not([href="#"]), #focus .focus-box .service-icon a[href*="#"]:not([href="#"])' );
			anchorSelector.addClass('page-anchor');
			anchorSelector.bind(
				'click', function () {
					var headerHeight;

					headerHeight = 0;
					if ( $( window ).width() >= 751 ) {
						headerHeight = $( '#main-nav' ).height();
					}

					if ( location.pathname.replace( /^\//, '' ) === this.pathname.replace( /^\//, '' ) && location.hostname === this.hostname ) {
						var target = $( this.hash );
						target = target.length ? target : $( '[name=' + this.hash.slice( 1 ) + ']' );
						if ( target.length ) {
							$( 'html,body' ).animate(
								{
									scrollTop: target.offset().top - headerHeight + 5
								}, 1200
							);

							// Close dropdown menu on mobile, after an anchor is clicked
							$( '.navbar .navbar-collapse.in' ).removeClass( 'in' );
							$( '.navbar li.dropdown.open' ).removeClass( 'open' );

							return false;
						}
					}
				}
			);
		},

		stickyFooter: function () {
			var content = $( '.site-content > .container' );
			var headerHeight = $( 'header.header' ).outerHeight();
			var footerHeight = $( 'footer#footer' ).outerHeight();
			var contentHeight = content.outerHeight();
			var windowHeight = $( window ).height();
			var topBar = $( '.zerif-top-bar' ).length > 0 ? 40 : 0;

			var totalHeight = topBar + headerHeight + footerHeight + contentHeight;

			if ( totalHeight < windowHeight ) {
				content.css( 'min-height', windowHeight - headerHeight - footerHeight - topBar );
			} else {
				content.css( 'min-height', '1px' );
			}
		},

		/**
		 * Initiate Masonry.
		 */
		initMasonry: function () {
			if ( typeof zerifSettings === 'undefined' ) {
				return;
			}

			if ( !zerifSettings.masonry ) {
				return;
			}

			if ( jQuery( '.masonry-card-style' ).length < 1 ) {
				return;
			}

			var siteMain = jQuery( '.site-main' );

			var containerStyle = {
					position: 'relative'
				},
				pagination = siteMain.children( '.navigation.paging-navigation' );

			// masonry will make the articles absolute so we need to re adjust the nav position.
			if ( pagination.length > 0 ) {

				var bottomSpace = parseInt( pagination.css( 'height' ) ) + 40;

				containerStyle.marginBottom = bottomSpace + 'px';

				pagination.css( 'bottom', '-' + bottomSpace + 'px' );
				pagination.css( 'position', 'absolute' );
				pagination.css( 'left', '0' );
				pagination.css( 'right', '0' );
			}

			siteMain.masonry( {
				// set itemSelector so .grid-sizer is not used in layout
				itemSelector: '.masonry-card-style',
				// use element for option
				columnWidth: '.masonry-card-style',
				percentPosition: true,
				containerStyle: containerStyle
			} );
		},

		/**
		 * Focus customizer tabs.
		 */
		focusTabs: function () {
			$( '.customize-partial-edit-shortcut' ).on( 'DOMNodeInserted', function () {
				jQuery( this ).on( 'click', function () {
					var parent = $( this ).parent();
					var control_type = parent.data( 'customize-partial-type' );

					if ( control_type === 'widget' ) {
						wp.customize.preview.send( 'tab-previewer-edit', $( '.custom-customizer-tab>.widgets' ) );
						return;
					}

					var control_id = $( this ).attr( 'class' ).replace( 'customize-partial-edit-shortcut customize-partial-edit-shortcut-', '' );
					wp.customize.preview.send( 'tab-previewer-edit', $( '.custom-customizer-tab>.' + control_id ) );
					wp.customize.preview.send( 'focus-control', control_id );

				} );
			} );
		},

		/**
		 * Hide recaptcha
		 */
		hideRecaptcha: function () {
			var thisOpen = false;
			jQuery( '.contact-form .form-control' ).each(
				function () {
					if ( (typeof jQuery( this ).val() !== 'undefined') && (jQuery( this ).val().length > 0) ) {
						thisOpen = true;
						jQuery( '.zerif-g-recaptcha' ).css( 'display', 'block' ).delay( 1000 ).css( 'opacity', '1' );
						return false;
					}
				}
			);
			if ( thisOpen === false && (typeof jQuery( '.contact-form textarea' ).val() !== 'undefined') && (jQuery( '.contact-form textarea' ).val().length > 0) ) {
				thisOpen = true;
				jQuery( '.zerif-g-recaptcha' ).css( 'display', 'block' ).delay( 1000 ).css( 'opacity', '1' );
			}
			jQuery( '.contact-form input, .contact-form textarea' ).focus(
				function () {
					if ( !jQuery( '.zerif-g-recaptcha' ).hasClass( 'recaptcha-display' ) ) {
						jQuery( '.zerif-g-recaptcha' ).css( 'display', 'block' ).delay( 1000 ).css( 'opacity', '1' );
					}
				}
			);
		}
	};

	$.portfolioLightbox = {

		init: function () {
			this.openModal();
			this.closeModal();
		},

		openModal: function () {
			$( '.zerif-with-modal' ).on('click touchstart',
				function () {
					var modal = $( this ).parent().find( '.zerif-modal-wrap' );
					$( 'html' ).css( 'overflow', 'hidden' );
					modal.show();
				}
			);
		},

		closeModal: function () {
			$( '.zerif-close-modal, .zerif-close-modal-button' ).click(
				function () {
					var modal = $( this ).closest( '.zerif-modal-wrap' );

					/**
					 * Stop the iframes and the videos from playing.
					 */
					var iframes = modal.find( 'iframe' );
					$.each( iframes, function () {
						var src = $( this ).attr( 'src' );
						$( this ).attr( 'src', src );
					} );

					var videos = modal.find( 'video' );
					$.each( videos, function () {
						var src = $( $( this )[ 0 ] ).attr( 'src' );
						$( $( this )[ 0 ] ).attr( 'src', src );
					} );

					/**
					 * Hide modal and let body scroll
					 */
					$( 'html' ).css( 'overflow-y', 'scroll' );
					modal.hide();
				}
			);
		}
	};

	$.bigTitle = {
		init: function () {
			this.handleSliderTransition();
			this.handleParallax();
		},

		handleSliderTransition: function () {
			var slides = $( '.fadein-slider .slide-item' );
			if ( slides.length <= 1 ) {
				return;
			}
			slides.slice( 1 ).hide();
			setInterval(
				function () {
					$( '.fadein-slider :first-child' ).fadeOut( 2000 ).next( '.slide-item' ).fadeIn( 2000 ).end().appendTo( '.fadein-slider' );
				}, 10000
			);
		},

		handleParallax: function () {
			var parallaxItem = $( '#parallax_move' );
			if ( parallaxItem.length <= 0 ) {
				return;
			}

			var scene = document.getElementById( 'parallax_move' );
			var window_width = jQuery( window ).outerWidth();
			parallaxItem.css(
				{
					'width': window_width + 120,
					'margin-left': -60,
					'margin-top': -60,
					'position': 'absolute',
				}
			);
			var h = jQuery( 'header#home' ).outerHeight();
			parallaxItem.children().each(
				function () {
					jQuery( this ).css(
						{
							'height': h + 100,
						}
					);
				}
			);
			if ( !$.isMobile.any() ) {
				new Parallax( scene );
			} else {
				parallaxItem.css(
					{
						'z-index': '0',
					}
				);
				parallaxItem.find( '.layer' ).css(
					{
						'position': 'absolute',
						'top': '0',
						'left': '0',
						'z-index': '1',
					}
				);
			}
		}
	};

	$.navMenu = {
		init: function () {
			this.handleMobileDropDown();
			this.handleTopBar();
			this.menuAlign();
			this.menuOrientation();
		},

		handleMobileDropDown: function () {
			/**
			 * Do not execute this function if mega menu is active.
			 */
			if ( $( '.wr-megamenu-container' ).length > 0 || $( '.mega-menu-wrap' ).length > 0 ) {
				return;
			}
			this.addMenuCaret();
			this.handleMenuCaret();
		},

		addMenuCaret: function () {
			var navLi = $( '#site-navigation li' );
			navLi.each( function () {
				if ( $( this ).find( 'ul' ).length > 0 && !$( this ).hasClass( 'has_children' ) ) {
					$( this ).addClass( 'has_children' );
					$( this ).find( 'a' ).first().after( '<p class="dropdownmenu"></p>' );
				}
			} );
			navLi.find( 'a' ).on( 'click', function () {
					$( '#site-navigation' ).parent().find( '.navbar-toggle' ).addClass( 'collapsed' );
					$( '#site-navigation' ).parent().find( '.collapse' ).removeClass( 'in' );
				}
			);
		},

		handleMenuCaret: function () {
			$( '.dropdownmenu' ).click( function () {
				$( this ).parent( 'li' ).toggleClass( 'this-open' );
			} );
		},

		handleTopBar: function () {
			/* Handle the very top bar on scroll*/
			var currentScrollPosition = window.pageYOffset,
				topBar = $( '.zerif-top-bar' ),
				nav = $( '#main-nav' );

			if ( topBar.length === 0 ) {
				return;
			}
			var margin = currentScrollPosition;
			if ( margin < 0 ) {
				margin = 0;
			}
			if ( margin > 40 ) {
				margin = 40;
			}

			nav.css( 'margin-top', '-' + margin + 'px' );
		},

		/**
		 * Add class current on nav anchor when section is in viewport
		 */
		sectionInViewport: function () {
			if ( $( window ).width() < 751 ) {
				return;
			}
			var zerif_scrollTop = $( window ).scrollTop();       // cursor position
			var headerHeight = $( '#main-nav' ).outerHeight();   // header height
			var isInOneSection = 'no';                              // used for checking if the cursor is in one section or not
			// for all sections check if the cursor is inside a section
			$( 'section, header' ).each(
				function () {
					var thisID = '#' + $( this ).attr( 'id' );           // section id
					var zerif_offset = $( this ).offset().top;         // distance between top and our section
					var thisHeight = $( this ).outerHeight();         // section height
					var thisBegin = zerif_offset - headerHeight;                      // where the section begins
					var thisEnd = zerif_offset + thisHeight - headerHeight;         // where the section ends
					// if position of the cursor is inside of the this section
					if ( zerif_scrollTop >= thisBegin && zerif_scrollTop <= thisEnd ) {
						isInOneSection = 'yes';
						$( '#site-navigation .current, .navbar.navbar-inverse .primary-menu .current' ).removeClass( 'current' );
						$( '#site-navigation a[href$="' + thisID + '"], .navbar.navbar-inverse .primary-menu a[href$="' + thisID + '"]' ).parent( 'li' ).addClass( 'current' );    // find the menu button with the same ID section
						return false;
					}
					if ( isInOneSection === 'no' ) {
						$( '#site-navigation .current, .navbar.navbar-inverse .primary-menu .current' ).removeClass( 'current' );
					}
				}
			);

		},

		/**
		 * Align menu on center if its width is grater than nav.
		 */
		menuAlign: function () {
			var headerWrap = jQuery( '.header' );
			var navWrap = jQuery( '#site-navigation, .navbar.navbar-inverse .primary-menu nav' );
			var maxMenuNavWrap = jQuery( ' #mega-menu-primary' );
			var logoWrap = jQuery( '.responsive-logo' );
			var containerWrap = jQuery( '.container' );
			var classToAdd = 'menu-align-center';

			if ( headerWrap.hasClass( classToAdd ) ) {
				headerWrap.removeClass( classToAdd );
			}
			var logoWidth = logoWrap.outerWidth();
			var menuWidth = navWrap.outerWidth() + maxMenuNavWrap.outerWidth();
			var containerWidth = containerWrap.width();

			if ( menuWidth + logoWidth > containerWidth ) {
				headerWrap.addClass( classToAdd );
			} else {
				if ( headerWrap.hasClass( classToAdd ) ) {
					headerWrap.removeClass( classToAdd );
				}
			}
		},

		/**
		 * Menu orientation.
		 */
		menuOrientation: function () {
			jQuery( '#site-navigation, .navbar.navbar-inverse .primary-menu' ).zerifsubmenuorientation();
		}
	};

	$.frontpageSections = {
		init: function () {
			this.teamSection();
			this.portfolioSection();
			this.latestNewsSection();
			this.testimonialsSection();
		},

		/**
		 * JS for team section.
		 */
		teamSection: function () {
			if ( $( 'section.our-team' ).length <= 0 ) {
				return;
			}
			if ( !$.isMobile.any() ) {
				return;
			}

			/**
			 * Open team member description.
			 */
			$( '.team-member' ).on(
				'click', function () {
					$( '.team-member-open' ).removeClass( 'team-member-open' );
					$( this ).addClass( 'team-member-open' );
					event.stopPropagation();
				}
			);

			/**
			 * Close team member description on touch/click outside.
			 */
			$( 'html' ).on( 'touchstart click', function () {
				jQuery( '.team-member-open' ).removeClass( 'team-member-open' );
			} );

		},

		/**
		 * JS for portfolio section.
		 */
		portfolioSection: function () {
			if ( $( 'section.works' ).length <= 0 ) {
				return;
			}
			if ( !$.isMobile.any() ) {
				return;
			}
			var responsiveGrid = $( '.cbp-rfgrid li' );
			responsiveGrid.prepend( '<p class="cbp-rfgrid-tr"></p>' );

			responsiveGrid.on( 'click', function () {
					if ( $( this ).hasClass( 'cbp-rfgrid-open' ) ) {
						return;
					}
					$( '.cbp-rfgrid-tr' ).css( 'display', 'block' );
					$( '.cbp-rfgrid-open' ).removeClass( 'cbp-rfgrid-open' );

					$( this ).addClass( 'cbp-rfgrid-open' );
					$( this ).find( '.cbp-rfgrid-tr' ).css( 'display', 'none' );
					event.stopPropagation();
				}
			);

			$( 'html' ).on( 'touchstart click', function () {
				var responsiveGrid = $( '.cbp-rfgrid li' );
				if ( $( responsiveGrid ).hasClass( 'cbp-rfgrid-open' ) ) {
					$( '.cbp-rfgrid-tr' ).css( 'display', 'none' );
				}else{
					$( '.cbp-rfgrid-tr' ).css( 'display', 'block' );
				}
					$( '.cbp-rfgrid-open' ).removeClass( 'cbp-rfgrid-open' );
				}
			);
		},

		/**
		 * JS for latest news section.
		 */
		latestNewsSection: function () {
			if ( $( '#carousel-homepage-latestnews' ).length <= 0 ) {
				return;
			}
			if ( !$.isMobile.any() ) {
				return;
			}

			/**
			 * Hide next and previous arrow
			 */
			if ( jQuery( '#carousel-homepage-latestnews div.item' ).length < 2 ) {
				jQuery( '#carousel-homepage-latestnews > a' ).css( 'display', 'none' );
			}

			/**
			 * Get the maximum height of a slide and set each slide to that height.
			 */
			var maxheight = 0;
			jQuery( '#carousel-homepage-latestnews div.item' ).each(
				function () {
					if ( jQuery( this ).height() > maxheight ) {
						maxheight = jQuery( this ).height();
					}
				}
			);
			jQuery( '#carousel-homepage-latestnews div.item' ).height( maxheight );
		},

		/**
		 * JS for testimonials section.
		 */
		testimonialsSection: function () {
			if ( jQuery( '.testimonial-masonry' ).length <= 0 ) {
				return;
			}

			var window_width_old = jQuery( '.container' ).outerWidth();
			if ( window_width_old < 970 ) {
				jQuery( '.testimonial-masonry' ).zerifgridpinterest( { columns: 1, selector: '.feedback-box' } );
			} else {
				jQuery( '.testimonial-masonry' ).zerifgridpinterest( { columns: 3, selector: '.feedback-box' } );
			}
		}
	};

	var portraitViewInit = 0, resize = false; // Initial viewport orientation: Default Landscape
	$.responsiveBackground = {
		init: function () {
			if ( $( '#mobile-bg-responsive' ).length <= 0 ) {
				return;
			}
			if ( $( 'body.custom-background' ).length <= 0 ) {
				return;
			}
			if ( !$.isMobile.any() ) {
				return;
			}

			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
			// Check if orientation is Portrait or Landscape: Default is Landscape
			var portraitView = 0;
			if ( windowHeight >= windowWidth ) {
				portraitView = 1;
			}
			if ( jQuery.isMobile.iOS() ) {
				windowHeight += 100;
			}

			if ( portraitViewInit === portraitView ) {
				return;
			}

			var bgHelper = jQuery( '.zerif-mobile-bg-helper-bg' );
			if ( !resize ) {
				var imgURL = jQuery( 'body.custom-background' ).css( 'background-image' );
				jQuery( '.zerif-mobile-bg-helper-bg-inside' ).css(
					{
						'background-image': imgURL,
					}
				).addClass( 'zerif-mobile-h-inside' );
				jQuery( '.zerif-mobile-bg-helper-wrap-all' ).addClass( 'zerif-mobile-h-all' );
				jQuery( '.zerif-mobile-bg-helper-content' ).addClass( 'zerif-mobile-h-content' );
				bgHelper.css(
					{
						'width': windowWidth,
						'height': windowHeight
					}
				).addClass( 'zerif-mobile-h-bg' );
				portraitViewInit = portraitView;
				resize = true;
			} else {
				// Resize window
				bgHelper.css(
					{
						'width': windowWidth,
						'height': windowHeight
					}
				);
				portraitViewInit = portraitView;
			}
		}
	};

})( jQuery );

jQuery( document ).ready(
	function () {
		jQuery.generalActions.init();
		jQuery.portfolioLightbox.init();
		jQuery.bigTitle.init();
		jQuery.navMenu.init();
		jQuery.frontpageSections.init();
		jQuery.responsiveBackground.init();
	}
);

jQuery( window ).on( 'load', function () {
	jQuery.generalActions.stickyFooter();
} );

jQuery( window ).on( 'resize', function () {
	jQuery.navMenu.menuAlign();
	jQuery.bigTitle.handleParallax();
	jQuery.frontpageSections.testimonialsSection();
	jQuery.responsiveBackground.init();
} );

jQuery( window ).on( 'scroll', function () {
	jQuery.navMenu.handleTopBar();
	jQuery.navMenu.sectionInViewport();
} );

/**
 * Masonry script.
 */
(function ( $ ) {
	var defaults = {
		columns: 3,
		selector: 'div',
		excludeParentClass: '',
	};

	function ZerifGridPinterest( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this.defaults = defaults;
		this.init();
	}

	ZerifGridPinterest.prototype.init = function () {
		var self = this,
			$container = $( this.element ),
			$select_options = $( this.element ).children();
		self.make_magic( $container, $select_options );
	};
	ZerifGridPinterest.prototype.make_magic = function ( container ) {
		var self = this,
			$container = $( container ),
			columns_height = [],
			prefix = 'zerif',
			unique_class = prefix + '_grid_' + self.make_unique(),
			local_class = prefix + '_grid';
		var classname;
		var substr_index = this.element.className.indexOf( prefix + '_grid_' );
		if ( substr_index > -1 ) {
			classname = this.element.className.substr( 0, this.element.className.length - unique_class.length - local_class.length - 2 );
		} else {
			classname = this.element.className;
		}
		var my_id;
		if ( this.element.id === '' ) {
			my_id = prefix + '_id_' + self.make_unique();
		} else {
			my_id = this.element.id;
		}
		$container.after( '<div id="' + my_id + '" class="' + classname + ' ' + local_class + ' ' + unique_class + '"></div>' );
		var i;
		for ( i = 1; i <= this.options.columns; i++ ) {
			columns_height.push( 0 );
			var first_cols = '';
			var last_cols = '';
			if ( i % self.options.columns === 1 ) {
				first_cols = prefix + '_grid_first';
			}
			if ( i % self.options.columns === 0 ) {
				first_cols = prefix + '_grid_last';
			}
			$( '.' + unique_class ).append( '<div class="' + prefix + '_grid_col_' + this.options.columns + ' ' + prefix + '_grid_column_' + i + ' ' + first_cols + ' ' + last_cols + '"></div>' );
		}
		if ( this.element.className.indexOf( local_class ) < 0 ) {
			$container.children( this.options.selector ).each(
				function ( index ) {
					var min = Math.min.apply( null, columns_height );
					var this_index = columns_height.indexOf( min ) + 1;
					$( this ).attr( prefix + 'grid-attr', 'this-' + index ).appendTo( '.' + unique_class + ' .' + prefix + '_grid_column_' + this_index );
					columns_height[ this_index - 1 ] = $( '.' + unique_class + ' .' + prefix + '_grid_column_' + this_index ).height();
				}
			);
		} else {
			var no_boxes = $container.find( this.options.selector ).length;
			for ( i = 0; i < no_boxes; i++ ) {
				var min = Math.min.apply( null, columns_height );
				var this_index = columns_height.indexOf( min ) + 1;
				$( '#' + this.element.id ).find( '[' + prefix + 'grid-attr="this-' + i + '"]' ).appendTo( '.' + unique_class + ' .' + prefix + '_grid_column_' + this_index );
				columns_height[ this_index - 1 ] = $( '.' + unique_class + ' .' + prefix + '_grid_column_' + this_index ).height();
			}
		}
		$container.remove();
	};
	ZerifGridPinterest.prototype.make_unique = function () {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for ( var i = 0; i < 10; i++ ) {
			text += possible.charAt( Math.floor( Math.random() * possible.length ) );
		}
		return text;
	};
	$.fn.zerifgridpinterest = function ( options ) {
		return this.each(
			function () {
				var value = '';
				if ( !$.data( this, value ) ) {
					$.data( this, value, new ZerifGridPinterest( this, options ) );
				}
			}
		);
	};
})( jQuery );

/**
 * Accessibility menu.
 */
(function ( $ ) {
	'use strict';
	// make dropdowns functional on focus
	$( '.primary-menu' ).find( 'a' ).on(
		'focus blur', function () {
			$( this ).parents( 'ul, li' ).toggleClass( 'acc-focus' );
		}
	);

	$( '.primary-menu ul' ).find( '.dropdownmenu' ).remove();

	// menu navigation with arrow keys
	$( '.menu-item a' ).on(
		'keydown', function ( e ) {

			// left key
			if ( e.which === 37 ) {
				e.preventDefault();
				$( this ).parent().prev().children( 'a' ).focus();
			} // right key
			else if ( e.which === 39 ) {
				e.preventDefault();
				$( this ).parent().next().children( 'a' ).focus();
			} // down key
			else if ( e.which === 40 ) {
				e.preventDefault();
				if ( $( this ).next().length ) {
					$( this ).next().next().find( 'li:first-child a' ).first().focus();
				} else {
					$( this ).parent().next().children( 'a' ).focus();
				}
			} // up key
			else if ( e.which === 38 ) {
				e.preventDefault();
				if ( $( this ).parent().prev().length ) {
					$( this ).parent().prev().children( 'a' ).focus();
				} else {
					$( this ).parents( 'ul' ).first().prev().prev().focus();
				}
			}

		}
	);

	$( '.navbar-toggle' ).click(
		function () {

			$( '.primary-menu' ).slideToggle(
				'slow', function () {
					$( this ).toggleClass( 'zerif-hide-on-mobile', $( this ).is( ':visible' ) );
				}
			);
			$( this ).removeAttr( 'style' );
		}
	);

	if ( jQuery( '.wr-megamenu-container' ).length === 0 && jQuery( '.mega-menu-wrap' ).length === 0 ) {

		$( '.primary-menu ul:not(.zerif-nav-menu-callback) li.menu-item-has-children' ).children( 'a' ).after( '<button class="dropdownmenu dropdown-toggle"><span class="screen-reader-text">Submenu</span></button>' );
		$( '.primary-menu ul:not(.zerif-nav-menu-callback) li.menu-item-has-children .dropdownmenu' ).click(
			function () {
				$( this ).parent().find( '.sub-menu' ).slideToggle();
			}
		);

		$( '.primary-menu ul:not(.zerif-nav-menu-callback) li.page_item_has_children' ).children( 'a' ).after( '<button class="dropdownmenu dropdown-toggle"><span class="screen-reader-text">Submenu</span></button>' );
		$( '.primary-menu ul:not(.zerif-nav-menu-callback) li.page_item_has_children .dropdownmenu' ).click(
			function () {
				$( this ).parent().find( '.sub-menu' ).slideToggle();
			}
		);

	}

})( jQuery );

/**
 * Sub-menu orientation.
 */
(function ( $, window ) {
	var defaults = {
		allItems: false,
	};

	function ZerifSubmenuOrientation( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this.defaults = defaults;
		this.init();
	}

	ZerifSubmenuOrientation.prototype.init = function () {
		var self = this,
			$container = $( this.element ),
			$select_options = $( this.element ).children();
		var resize_finish;
		if ( self.options.allItems !== true ) {
			$( window ).resize(
				function () {
					clearTimeout( resize_finish );
					resize_finish = setTimeout(
						function () {
							self.make_magic( $container, $select_options );
						}, 11
					);
				}
			);
		}
		self.make_magic( $container, $select_options );
		if ( self.options.allItems !== true ) {
			setTimeout(
				function () {
					$( window ).resize();
				}, 500
			);
		}
	};
	ZerifSubmenuOrientation.prototype.make_magic = function ( container ) {
		var self = this,
			$container = $( container );
		var itemWrap;
		if ( $container[ 0 ].tagName === 'UL' ) {
			itemWrap = $container[ 0 ];
		} else {
			itemWrap = $container.find( 'ul' )[ 0 ];
		}
		var windowsWidth = window.innerWidth;
		if ( typeof itemWrap !== 'undefined' ) {

			var itemId = '#' + itemWrap.id;

			$( itemId ).children( 'li' ).each(
				function () {
					if ( this.id === '' ) {
						return;
					}
					var max_deep = self.max_deep( '#' + this.id );
					var offsetLeft = $( '#' + this.id ).offset().left;
					var submenuWidthItem = $( '#' + this.id ).find( 'ul' ).width();
					var submenuTotalWidth = max_deep * submenuWidthItem;
					if ( submenuTotalWidth > 0 && windowsWidth < offsetLeft + submenuTotalWidth ) {
						if ( self.options.allItems === true ) {
							$( '#' + itemWrap.id ).addClass( 'menu-item-open-left-all' );
							return false;
						}
						$( '#' + this.id ).addClass( 'menu-item-open-left' );
					} else if ( $( '#' + this.id ).hasClass( 'menu-item-open-left' ) ) {
						$( '#' + this.id ).removeClass( 'menu-item-open-left' );
					}
				}
			);
		}
	};
	ZerifSubmenuOrientation.prototype.max_deep = function ( item ) {
		var maxDepth = -1,
			currentDepth = -1;
		$( item + ' li:not(:has(ul))' ).each(
			function () {
				currentDepth = $( this ).parents( 'ul' ).length;
				if ( currentDepth > maxDepth ) {
					maxDepth = currentDepth;
				}
			}
		);
		return maxDepth - 1;
	};
	$.fn.zerifsubmenuorientation = function ( options ) {
		return this.each(
			function () {
				var value = '';
				if ( !$.data( this, value ) ) {
					$.data( this, value, new ZerifSubmenuOrientation( this, options ) );
				}
			}
		);
	};
})( jQuery, window );

/* Menu levels */
jQuery( document ).ready(
	function () {
		jQuery( '#site-navigation, .navbar.navbar-inverse .primary-menu' ).zerifsubmenuorientation();
	}
);