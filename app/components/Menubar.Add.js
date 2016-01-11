/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Add' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var lightCount = 0;
	var cameraCount = 0;

	editor.signals.editorCleared.add( function () {

		meshCount = 0;
		lightCount = 0;
		cameraCount = 0;

	} );

	// Plane

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Plane' );
	option.onClick( function () {
		editor.importDefaultObj('plane');
	} );
	options.add( option );

	// Box

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {
		editor.importDefaultObj('box');
	} );
	options.add( option );

	// Circle

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Circle' );
	option.onClick( function () {
		editor.importDefaultObj('circle');
	} );
	options.add( option );

	// Cylinder

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {
		editor.importDefaultObj('cylinder');
	} );
	options.add( option );

	// Sphere

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {
		editor.importDefaultObj('sphere');
	} );
	options.add( option );

	// Icosahedron

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Icosahedron' );
	option.onClick( function () {
		editor.importDefaultObj('icosahedron');
	} );
	options.add( option );

	// Torus

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Torus' );
	option.onClick( function () {
		editor.importDefaultObj('torus');
	} );
	options.add( option );

	// Teapot

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Teapot' );
	option.onClick( function () {
		editor.importDefaultObj('teapot');
	} );
	options.add( option );
	
	//

	options.add( new UI.HorizontalRule() );

	// PointLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'PointLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );

	} );
	options.add( option );

	// SpotLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'SpotLight' );
	option.onClick( function () {
		alert("Implement export and handling in nori");
		/*
		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var exponent = 10;

		var light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
		light.name = 'SpotLight ' + ( ++ lightCount );
		light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );
		*/

	} );
	options.add( option );

	// DirectionalLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'DirectionalLight' );
	option.onClick( function () {
		alert("Implement export and handling in nori");
		/*
		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );
		*/

	} );
	options.add( option );

	// HemisphereLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'HemisphereLight' );
	option.onClick( function () {
		alert("Implement export and handling in nori");
		/*
		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );
		*/

	} );
	options.add( option );

	// AmbientLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'AmbientLight' );
	option.onClick( function() {
		alert("Implement export and handling in nori");
		/*
		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );
		*/
	} );
	options.add( option );

	//
	/*
	options.add( new UI.HorizontalRule() );

	// PerspectiveCamera

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'PerspectiveCamera' );
	option.onClick( function() {

		var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000 );
		camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );

		editor.addObject( camera );
		editor.select( camera );

	} );
	options.add( option );
	*/

	return container;

}
