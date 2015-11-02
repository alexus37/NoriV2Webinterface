/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Render = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Rendering' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Undo

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Render' );
	option.onClick( function () {
		editor.exportXML();
	} );
	options.add( option );




	return container;

};
