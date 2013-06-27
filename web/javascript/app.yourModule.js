( function( $, app ) {

	var yourModule = {
		init : function( $els ) {
			$els.on( 'click', function() {
				var $el = $( this ),
					size = yourModule.getSize( $el );
				size += 1;
				yourModule.setFontSize( $el, size );
			});
		},
		getSize : function( $el ) {
			return parseInt( $el.css( 'font-size' ), 10 );
		},
		setFontSize : function( $el, size ) {
			$el.css( 'font-size', size );
		}
	};

	app.yourModule = yourModule;

})( jQuery, window.app || (window.app = {}) );
