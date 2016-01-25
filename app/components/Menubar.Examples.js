/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Examples = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Examples' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );
	// New

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Simple' );
	option.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
			editor.clear();
			editor.getExample("simple");
		}
	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Tea pot' );
	option.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
			editor.clear();
			editor.getExample("teapot");

		}
	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Cornell box' );
	option.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
			editor.clear();
			editor.getExample("cornell");			
		}
	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Depth of field' );
	option.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
			editor.clear();
			editor.getExample("dragons");

		}
	} );
	options.add( option );

	return container;
};
