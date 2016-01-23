angular.module("tjsEditor", [])
	.directive(
		"tjsEditor",
		[function () {
			return {
				restrict: "E",
				scope: {
                    renderFkt: "&renderFunction", 
                    changeFkt: "&changeFunction",
                    setxmlFkt: "&setxmlFunction",
                    showresultFkt: "&showresultFunction",
                    importobjFkt: "&importobjFunction",
                    loadxmlFkt: "&loadxmlFunction",
                    defaultobjFkt: "&defaultobjFunction",
                    loadmodelFkt: "&loadmodelFunction",
                    savesceneFkt: "&savesceneFunction"
				},
				link: function (scope, elem, attr) {

					window.URL = window.URL || window.webkitURL;
					window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
					Number.prototype.format = function (){
						return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					};
					//
					var editor = new Editor();

                    // set the render function for the editor

                    editor.renderFunction = scope.renderFkt;
                    editor.importobjFunction = scope.importobjFkt;
                    editor.changeFunction = scope.changeFkt;
					editor.showresultFunction = scope.showresultFkt;
					editor.defaultobjFunction = scope.defaultobjFkt;
					editor.loadxmlFunction = scope.loadxmlFkt;
					editor.loadmodelFunction = scope.loadmodelFkt;
					editor.savesceneFunction = scope.savesceneFkt;

                    editor.setxmlFunction = scope.setxmlFkt;
					var viewport = new Viewport( editor );
					elem[0].appendChild( viewport.dom );

					var script = new Script( editor );
					elem[0].appendChild( script.dom );
					var toolbar = new Toolbar( editor );
					elem[0].appendChild( toolbar.dom );
					var menubar = new Menubar( editor );
					elem[0].appendChild( menubar.dom );
					var sidebar = new Sidebar( editor );
					elem[0].appendChild( sidebar.dom );
					var modal = new UI.Modal();
					elem[0].appendChild( modal.dom );
					//
					editor.setTheme( editor.config.getKey( 'theme' ) );
					editor.storage.init( function () {
						editor.storage.get( function ( state ) {
							
							
							
							if ( state !== undefined ) {
								editor.fromJSON( state );
							}
							var selected = editor.config.getKey( 'selected' );
							if ( selected !== undefined ) {
								editor.selectByUuid( selected );
							}
						} );
						//
						var timeout;
						function saveState( scene ) {
							if ( editor.config.getKey( 'autosave' ) === false ) {
								return;
							}
							clearTimeout( timeout );
							timeout = setTimeout( function () {
								editor.signals.savingStarted.dispatch();
								timeout = setTimeout( function () {
									editor.storage.set( editor.toJSON() );
									editor.signals.savingFinished.dispatch();
								}, 100 );
							}, 1000 );
						}

						var signals = editor.signals;
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
							editor.loader.loadFile( event.dataTransfer.files[ 0 ] );
						}
					}, false );
					elem[0].addEventListener( 'keydown', function ( event ) {
						switch ( event.keyCode ) {
							case 8:
								event.preventDefault(); // prevent browser back
								var object = editor.selected;
								if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
								var parent = object.parent;
								editor.removeObject( object );
								editor.select( parent );
								break;
						}
					}, false );
					function onWindowResize( event ) {
						editor.signals.windowResize.dispatch();
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
								editor.clear();
								editor.fromJSON( json );
							} );
						}
					}
					window.addEventListener( 'message', function ( event ) {
						editor.clear();
						editor.fromJSON( event.data );
					}, false );

					

					
				}
			}
		}
	]);