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

	// Render

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Render' );
	option.onClick( function () {
		editor.exportXML();
	} );
	options.add( option );

	// xml

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'See scene xml' );
	option.onClick( function () {
		var xmlOutPut = editor.getSceneXML();
		editor.setxmlFunction({xml: xmlOutPut});
		editor.changeView('basicWebSocketPatches');
	});
	options.add( option );

	// show result

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Show rendering' );
	option.onClick( function () {
		editor.showresultFunction({});	
	});
	options.add( option );




	return container;

};
