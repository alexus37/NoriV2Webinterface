/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/scene/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/scene/collapsed', boolean );

	} );

	container.addStatic( new UI.Text( 'SCENE' ) );
	container.add( new UI.Break() );

	var ignoreObjectSelectedSignal = false;

	var outliner = new UI.Outliner( editor );
	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.selectById( parseInt( outliner.getValue() ) );

		ignoreObjectSelectedSignal = false;

	} );
	outliner.onDblClick( function () {

		editor.focusById( parseInt( outliner.getValue() ) );

	} );
	container.add( outliner );
	container.add( new UI.Break() );

	var refreshUI = function () {

		var camera = editor.camera;
		var scene = editor.scene;

		var options = [];

		// options.push( { value: camera.id, html: '<span class="type ' + camera.type + '"></span> ' + camera.name } );
		options.push( { static: true, value: scene.id, html: '<span class="type ' + scene.type + '"></span> ' + scene.name } );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				var html = pad + '<span class="type ' + object.type + '"></span> ' + object.name;

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;
					var material = object.material;

					html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
					html += ' <span class="type ' + material.type + '"></span> ' + material.name;

				}

				options.push( { value: object.id, html: html } );

				addObjects( object.children, pad + '&nbsp;&nbsp;&nbsp;' );

			}

		} )( scene.children, '&nbsp;&nbsp;&nbsp;' );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}


	};


	refreshUI();

	// events

	signals.sceneGraphChanged.add( refreshUI );

	signals.objectSelected.add( function ( object ) {

		if ( ignoreObjectSelectedSignal === true ) return;

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

}
