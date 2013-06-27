/*! Initr - v0.1.0 - 2013-06-24
* https://github.com/mindgruve/initr
* Copyright (c) 2013 Chris Kihneman | Mindgruve; Licensed MIT */
( function( $, window, undefined ) {

var initr, types;

function Initr( rootPath, deps ) {
	this.rootPath = rootPath || '';
	this.deps = deps;
	this.events = {};
	this.done = {};
	this.getDeps( deps );
}

Initr.prototype.getDeps = function( deps ) {

	// Make sure we have dependencies to load
	if ( !( deps && deps.length ) ) {
		if ( initr.isDev ) {
			console.log( '! Initr - no dependencies passed.' );
		}
		return;
	}

	// Load and run each dependency
	for ( var i = 0, l = deps.length; i < l; i++ ) {
		this.getDep( deps[ i ] );
	}
};

Initr.prototype.getDep = function( dep, isLoaded ) {
	var $els,
		_this = this;

	// Check to see if selector is on current page
	if ( dep.selector ) {
		$els = $( dep.selector );

		// If no matched elements, stop
		if ( !$els.length ) {
			if ( initr.isDev ) {
				console.log( '! Initr - selector did not match any elements.', dep );
			}
			return;
		}
	}

	// Check validate method if it exists
	if ( dep.validate ) {

		// If validate returns false, stop
		if ( !dep.validate( $els, dep ) ) {
			if ( initr.isDev ) {
				console.log( '! Initr - validate function did not pass.', dep );
			}
			return;
		}
	}

	// Check for scripts to load
	if ( (dep.src || dep.deps) && !isLoaded ) {
		this.loadDep( dep )
			.done( function() {
				_this.initDep( dep, $els );
			})
			.fail( function() {
				if ( initr.isDev ) {
					console.log( '! Initr:error - failed to load dependencies.', dep );
				}
			});
	} else {
		this.initDep( dep, $els );
	}
};

Initr.prototype.loadDep = function( dep ) {
	var scripts = dep.deps || [];
	if ( dep.src ) {
		scripts.push( dep.src );
	}

	// Load all scripts
	return Initr.getScripts( scripts, this.rootPath );
};

Initr.prototype.initDep = function( dep, $els ) {
	if ( dep.type && types[ dep.type ] ) {
		return types[ dep.type ].run.call( this, dep, $els );
	}
	if ( dep.init ) {
		if ( initr.isDev ) {
			console.log( '- Initr:anonymous -', dep );
		}
		dep.init( $els, dep );
	} else {
		if ( initr.isDev ) {
			console.log( '! Initr:error:anonymous - no `init` function.', dep );
		}
	}
};

// Event Handling
Initr.prototype.on = function( eventName, callback ) {
	var events;

	if ( !(eventName && callback) ) {
		return;
	}
	eventName = Initr.normalizeEventName( eventName );
	events = this.events[ eventName ];

	if ( !events ) {
		events = $.Callbacks();
		this.events[ eventName ] = events;
	}
	events.add( callback );

	var doneArr = this.done[ eventName.split(':')[0] ];
	if ( doneArr ) {
		callback.apply( null, doneArr );
	}
};

Initr.prototype.trigger = function( eventName, $els, dep ) {
	if ( !(eventName && this.events[eventName]) ) {
		return;
	}
	this.events[eventName].fire( $els, dep );
};

Initr.prototype.run = function( depName ) {
	var doneArr = this.done[ depName ];
	if ( doneArr && doneArr[1] ) {
		this.getDep( doneArr[1], true );
	}
};

Initr.prototype.addDone = function( dep, $els ) {
	var handle = dep.name || dep.handle;
	this.done[ handle ] = [ $els, dep ];
	if ( dep.done ) {
		dep.done( $els, dep );
	}
	this.trigger( handle + ':done', $els, dep );
};

// Helpers
Initr.normalizeEventName = function( eventName ) {
	var parts;
	eventName = $.trim( eventName );

	parts = eventName.split( ':' );

	if ( parts.length === 1 || !parts[1] ) {
		eventName = parts[0] + ':done';
	}
	return eventName;
};

Initr.regHttp = /^https?:\/\//;

Initr.getScripts = function( scripts, rootPath ) {
	var i, l, script, options,
		deferreds = [];
	if ( !rootPath ) {
		rootPath = '';
	}
	for ( i = 0, l = scripts.length; i < l; i++ ) {
		script = scripts[ i ];
		if ( !Initr.regHttp.test(script) ) {
			script = rootPath + script;
		}
		options = {
			type : 'GET',
			url  : script,
			dataType : 'script',
			cache : true
		};
		if ( initr.timeout ) {
			options.timeout = initr.timeout;
		}
		deferreds.push(
			$.ajax( options )
		);
	}
	return $.when.apply( null, deferreds );
};

Initr.checkHandle = function( dep, obj, objName ) {
	if ( !(dep && dep.handle) ) {
		if ( initr.isDev ) {
			console.log( '! Initr:error:' + objName + ' - no dependency handle.', dep );
		}
		return false;
	}

	if ( !(obj && obj[ dep.handle ]) ) {
		if ( initr.isDev ) {
			console.log( '! Initr:error:' + objName + ' - handle does not exist on `$.fn`.', dep );
		}
		return false;
	}

	return true;
};

types = {
	'$.fn' : {
		run : function( dep, $els ) {
			if ( !Initr.checkHandle( dep, window.$ && window.$.fn, '$.fn' ) ) {
				return;
			}
			if ( !dep.types ) {
				if ( initr.isDev ) {
					console.log( '- Initr:run:$.fn - no types.', dep.handle, dep );
				}
				$els[ dep.handle ]( dep.defaults );
			} else {
				$els.each( function() {
					var $el = $( this ),
						typeName = $el.data( 'type' ) || 'default',
						type = dep.types && dep.types[ typeName ],
						options = !type && !dep.defaults ? {} : $.extend( {}, dep.defaults, type );
					if ( initr.isDev ) {
						console.log( '- Initr:run:$.fn - type is `' + typeName + '` with options', options, dep.handle, dep );
					}
					$el[ dep.handle ]( options );
				});
			}
			this.addDone( dep, $els );
		}
	},
	'$' : {
		run : function( dep ) {
			if ( !Initr.checkHandle( dep, window.$, '$' ) ) {
				return;
			}
			if ( initr.isDev ) {
				console.log( '- Initr:run:$ -', dep.handle, dep );
			}
			$[ dep.handle ]( dep.defaults );
			this.addDone( dep, null );
		}
	},
	'app' : {
		run : function( dep, $els ) {
			if ( !Initr.checkHandle( dep, window.app, 'app' ) ) {
				return;
			}
			if ( initr.isDev ) {
				console.log( '- Initr:run:app -', dep.handle, dep );
			}
			var module = app[ dep.handle ];
			if ( module && module.init ) {
				module.init( $els, dep );
			}
			this.addDone( dep, $els );
		}
	}
};

// Make a factory
initr = function( rootPath, deps ) {
	return new Initr( rootPath, deps );
};

initr.Initr = Initr;

window.initr = initr;

})( jQuery, window );





