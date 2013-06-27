// Open up your IIFE to protect our global namespace.
( function( $, app ) {

	// Initialize some variables to be used later.
	var rootPath, deps;

	// Set a timeout for your script fetches. (Optional)
	initr.timeout = 12000;

	// Set the path to your scripts.
	rootPath = 'javascript/';

	// If app is in production mode
	if ( !app.IS_DEV ) {

		// Append the path to our minified scripts to our `rootPath`
		rootPath += 'min/';
	} else {

		// Set Initr to be in dev mode or not. (Optional)
		// When you are in dev mode, initr will `console.log` everything it does.
		initr.isDev = app.IS_DEV;
	}

	// This `deps` variable will hold all of our modules and plugins.
	// There are various types of dependencies (as we will call them) that Initr can handle.
	// Our defined types are `$.fn`, `$` and `app`. You can also run anonymous modules to
	// run arbitrary/small bits of code.
	deps = [

		// `$.fn`
		// This is your normal, everyday jQuery plugin.
		// As you may know, jQuery plugins that run on the DOM,
		// live on the jQuery prototype, or `$.fn`.
		{

			// Set the type so initr knows how to handle it.
			type : '$.fn',

			// The handle is just the namespace of your plugin on the jQuery prototype.
			// In this case, its the all-mighty datepicker jQuery UI plugin.
			handle : 'datepicker',

			// The path to your plugin, relative to the root path set above.
			src : 'vendor/jquery-ui-1.10.3.custom.min.js',

			// Your selector to where you would initialize the plugin.
			// Initr will check your page for this selector, ensure it has found elements,
			// then initialize the plugin on these elements with the options below.
			selector : '.datepicker',

			// These are your default options for this dependency.
			// When your selector is found, it will get passed these defaults.
			defaults : {
				showOtherMonths: true,
				selectOtherMonths: true
			},

			// Optional `done` function to be called after plugin has been loaded and called.
			done : function( $els, dep ) {
				console.log( 'datepicker is loaded and has been called.', $els, dep );
			}

			// We now have a solution to initialize a datepicker on any page of your website.
		},

		// `$`
		{
			type : '$',

			// Property name on the `$` namespace.
			handle : 'formIt',

			// Your source file.
			src : 'vendor/jquery.formit.min.js',

			// Only initialize if this selector is found on the page.
			selector : 'form'

			// This dependency would call `$.formIt()` if your selector passed.
		},

		// `app`
		{
			type : 'app',

			// Property name on the `app` namespace.
			handle : 'yourModule',

			// Your app source file.
			src : 'app.yourModule.js',

			// Only initialize if this selector is found on the page.
			// The elements found with this selector will be passed into your
			// modules init function.
			// Ex: `app.yourModule.init( $('[data-plugin=yourModule]') )`
			selector : '[data-plugin=yourModule]'
		},

		// Anonymous dependency with selector.
		{
			selector : '.your-selector',

			// Store variables in your dependency to be used in `init`.
			color : 'blue',

			// If your selector returns elements, this function will be called
			// and will be passed elements found from your selector and the dependency.
			init : function( $els, dep ) {
				$els.css( 'color', dep.color );
			}
		},

		// Anonymous dependency with selector and validate function.
		{
			selector : '.another-selector li',

			// Optional function to validate your dependency.
			validate : function( $els ) {

				// Returning `true` allows the `init` function to be called,
				// returning `false` will stop `init` from being called.
				return $els && ($els.length > 2);
			},

			// If your selector returns elements, and validate returns `true`,
			// this function will run.
			init : function( $els ) {
				$els.last().insertBefore( $els.first() );
			}
		}

	];

	// Kick off initr.
	// Cache the reference to `initr` on our `app` global namespace.
	app.initr = initr( rootPath, deps );

	// Use your initr reference add callbacks to dependencies finishing.
	app.initr.on( 'datepicker', function( $els, dep ) {
		console.log( 'TRIGGER datepicker:done', $els, dep );
	});

})( jQuery, window.app || (window.app = {}) );
