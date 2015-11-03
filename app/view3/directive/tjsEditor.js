angular.module("tjsEditor", [])
	.directive(
		"tjsEditor",
		[function () {
			return {
				restrict: "E",
				scope: {
					isolateEditor: "=editorParameter"
				},
				link: function (scope, elem, attr) {
					/*
					scope.$watch("parameter", function(newValue, oldValue) {
						if (newValue != oldValue) console.log(newValue);
					});
					*/

					window.URL = window.URL || window.webkitURL;
					window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
					Number.prototype.format = function (){
						return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					};
					//
					scope.isolateEditor = new Editor();
					var viewport = new Viewport( scope.isolateEditor );
					elem[0].appendChild( viewport.dom );
					var player = new Player( scope.isolateEditor );
					elem[0].appendChild( player.dom );
					var script = new Script( scope.isolateEditor );
					elem[0].appendChild( script.dom );
					var toolbar = new Toolbar( scope.isolateEditor );
					elem[0].appendChild( toolbar.dom );
					var menubar = new Menubar( scope.isolateEditor );
					elem[0].appendChild( menubar.dom );
					var sidebar = new Sidebar( scope.isolateEditor );
					elem[0].appendChild( sidebar.dom );
					var modal = new UI.Modal();
					elem[0].appendChild( modal.dom );
					//
					scope.isolateEditor.setTheme( scope.isolateEditor.config.getKey( 'theme' ) );
					scope.isolateEditor.storage.init( function () {
						scope.isolateEditor.storage.get( function ( state ) {
							if ( state !== undefined ) {
								scope.isolateEditor.fromJSON( state );
							}
							var selected = scope.isolateEditor.config.getKey( 'selected' );
							if ( selected !== undefined ) {
								scope.isolateEditor.selectByUuid( selected );
							}
						} );
						//
						var timeout;
						function saveState( scene ) {
							if ( scope.isolateEditor.config.getKey( 'autosave' ) === false ) {
								return;
							}
							clearTimeout( timeout );
							timeout = setTimeout( function () {
								scope.isolateEditor.signals.savingStarted.dispatch();
								timeout = setTimeout( function () {
									scope.isolateEditor.storage.set( scope.isolateEditor.toJSON() );
									scope.isolateEditor.signals.savingFinished.dispatch();
								}, 100 );
							}, 1000 );
						}

						var signals = scope.isolateEditor.signals;
						signals.geometryChanged.add( saveState );
						signals.objectAdded.add( saveState );
						signals.objectChanged.add( saveState );
						signals.objectRemoved.add( saveState );
						signals.materialChanged.add( saveState );
						signals.sceneGraphChanged.add( saveState );
						signals.scriptChanged.add( saveState );
						signals.showModal.add( function ( content ) {
							modal.show( content );
						} );
					} );
					//
					elem[0].addEventListener( 'dragover', function ( event ) {
						event.preventDefault();
						event.dataTransfer.dropEffect = 'copy';
					}, false );
					elem[0].addEventListener( 'drop', function ( event ) {
						event.preventDefault();
						if ( event.dataTransfer.files.length > 0 ) {
							scope.isolateEditor.loader.loadFile( event.dataTransfer.files[ 0 ] );
						}
					}, false );
					elem[0].addEventListener( 'keydown', function ( event ) {
						switch ( event.keyCode ) {
							case 8:
								event.preventDefault(); // prevent browser back
								var object = scope.isolateEditor.selected;
								if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
								var parent = object.parent;
								scope.isolateEditor.removeObject( object );
								scope.isolateEditor.select( parent );
								break;
						}
					}, false );
					function onWindowResize( event ) {
						scope.isolateEditor.signals.windowResize.dispatch();
					}
					window.addEventListener( 'resize', onWindowResize, false );
					onWindowResize();
					//
					var file = null;
					var hash = window.location.hash;
					if ( hash.substr( 1, 4 ) === 'app=' ) file = hash.substr( 5 );
					if ( hash.substr( 1, 6 ) === 'scene=' ) file = hash.substr( 7 );
					if ( file !== null ) {
						if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
							var loader = new THREE.XHRLoader();
							loader.crossOrigin = '';
							loader.load( file, function ( text ) {
								var json = JSON.parse( text );
								scope.isolateEditor.clear();
								scope.isolateEditor.fromJSON( json );
							} );
						}
					}
					window.addEventListener( 'message', function ( event ) {
						scope.isolateEditor.clear();
						scope.isolateEditor.fromJSON( event.data );
					}, false );

					

					
				}
			}
		}
	]);