/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function ( editor ) {

	var config = editor.config;
	var signals = editor.signals;

	var rendererTypes = {

		'WebGLRenderer': THREE.WebGLRenderer,
		'CanvasRenderer': THREE.CanvasRenderer,
		'SVGRenderer': THREE.SVGRenderer,
		'SoftwareRenderer': THREE.SoftwareRenderer,
		'RaytracingRenderer': THREE.RaytracingRenderer

	};

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( config.getKey( 'ui/sidebar/project/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		config.setKey( 'ui/sidebar/project/collapsed', boolean );

	} );

	container.addStatic( new UI.Text( 'PROJECT' ) );
	container.add( new UI.Break() );

	// class

	var options = {};

	for ( var key in rendererTypes ) {

		if ( key.indexOf( 'WebGL' ) >= 0 && System.support.webgl === false ) continue;

		options[ key ] = key;

	}

	var rendererTypeRow = new UI.Panel();
	var rendererType = new UI.Select().setOptions( options ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		if ( value === 'WebGLRenderer' ) {

			rendererPropertiesRow.setDisplay( '' );

		} else {

			rendererPropertiesRow.setDisplay( 'none' );

		}

		config.setKey( 'project/renderer', value );
		updateRenderer();

	} );

	rendererTypeRow.add( new UI.Text( 'Renderer' ).setWidth( '90px' ) );
	rendererTypeRow.add( rendererType );

	container.add( rendererTypeRow );

	if ( config.getKey( 'project/renderer' ) !== undefined ) {

		rendererType.setValue( config.getKey( 'project/renderer' ) );

	}

	// antialiasing

	var rendererPropertiesRow = new UI.Panel();
	rendererPropertiesRow.add( new UI.Text( '' ).setWidth( '90px' ) );

	var rendererAntialiasSpan = new UI.Span().setMarginRight( '10px' );
	var rendererAntialias = new UI.Checkbox( config.getKey( 'project/renderer/antialias' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/renderer/antialias', this.getValue() );
		updateRenderer();

	} );

	rendererAntialiasSpan.add( rendererAntialias );
	rendererAntialiasSpan.add( new UI.Text( 'antialias' ).setMarginLeft( '3px' ) );

	rendererPropertiesRow.add( rendererAntialiasSpan );

	// shadow

	var rendererShadowsSpan = new UI.Span();
	var rendererShadows = new UI.Checkbox( config.getKey( 'project/renderer/shadows' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/renderer/shadows', this.getValue() );
		updateRenderer();

	} );

	rendererShadowsSpan.add( rendererShadows );
	rendererShadowsSpan.add( new UI.Text( 'shadows' ).setMarginLeft( '3px' ) );

	rendererPropertiesRow.add( rendererShadowsSpan );

	container.add( rendererPropertiesRow );

	// VR

	var vrRow = new UI.Panel();
	var vr = new UI.Checkbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/vr', this.getValue() );
		// updateRenderer();

	} );

	vrRow.add( new UI.Text( 'VR' ).setWidth( '90px' ) );
	vrRow.add( vr );

	container.add( vrRow );

	//

	function updateRenderer() {

		createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue() );

	}

	function createRenderer( type, antialias, shadows ) {

		if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

			type = 'CanvasRenderer';

		}

		var renderer = new rendererTypes[ type ]( { antialias: antialias } );
		if ( shadows && renderer.shadowMap ) renderer.shadowMap.enabled = true;
		signals.rendererChanged.dispatch( renderer );

	}

	createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ) );

	// SAMPLER
	var samplerTypes = {
		'independent': 'independent'
	};
	var samplerTypeRow = new UI.Panel();
	var samplerType = new UI.Select().setOptions( samplerTypes ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		if ( value === 'independent' ) {

			samplerPropertiesRow.setDisplay( '' );

		} else {

			samplerPropertiesRow.setDisplay( 'none' );

		}

		editor.sampler = value;
		config.setKey( 'project/sampler', value );
	} );

	samplerTypeRow.add( new UI.Text( 'Sampler' ).setWidth( '90px' ) );
	samplerTypeRow.add( samplerType );

	container.add( samplerTypeRow );

	// sampler properties
	var samplerPropertiesRow = new UI.Panel();
	samplerPropertiesRow.add( new UI.Text( 'Sample count' ).setWidth( '90px' ) );
	samplerPropertiesRow.add( new UI.Integer( 64 )
									.setRange( 1, Infinity )
									.setWidth( '50px' )
									.onChange( function() {
			var value = this.getValue();
			editor.samplerProps["sampleCount"] = value;
			config.setKey( 'project/sampler/sampleCount', value );

		}
	));

	container.add( samplerPropertiesRow );

	//INTEGRATOR
	var integratorTypes = {
		'path_mis': 'Path tracer MIS',
		'path_mats': 'Path tracer Matrial',
		'direct': 'Direct',
		'direct_mis': 'Direct MIS',
		'direct_ems': 'Direct EMS',
		'direct_mats': 'Direct MATS',
		'photonmapper':'Photon mapper',
		'av': 'Average visiblity'
	};
	var integratorTypeRow = new UI.Panel();
	var integratorType = new UI.Select().setOptions( integratorTypes ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		editor.integrator = value;
		config.setKey( 'project/integrator', value );
		update();
	} );

	integratorTypeRow.add( new UI.Text( 'Integrator' ).setWidth( '90px' ) );
	integratorTypeRow.add( integratorType );

	container.add( integratorTypeRow );

	

	// sampler properties
	var integratorPropertiesRow = new UI.Panel();
	integratorPropertiesRow.add( new UI.Text( '# Photons' ).setWidth( '90px' ) );
	var photonCount = new UI.Integer( 100000 )
		.setRange( 1, Infinity )
		.setWidth( '50px' )
		.onChange( function() {
			var value = this.getValue();
			editor.integratorProps["photonCount"] = value;
			config.setKey( 'project/integrator/photonCount', value );
		}
	);
	integratorPropertiesRow.add(photonCount);
	integratorPropertiesRow.add( new UI.Text( 'Photonradius' ).setWidth( '90px' ) );
	var photonRadius = new UI.Number( 1.0)
		.setRange( 1, Infinity )
		.setWidth( '50px' )
		.onChange( function() {
			var value = this.getValue();
			editor.integratorProps["photonRadius"] = value;
			config.setKey( 'project/integrator/photonRadius', value );
		}
	);
	integratorPropertiesRow.add(photonRadius);

	container.add( integratorPropertiesRow );

	var avPropertiesRow = new UI.Panel();
	avPropertiesRow.add( new UI.Text( '# Path length' ).setWidth( '90px' ) );
	var length = new UI.Integer( 10 )
		.setRange( 1, Infinity )
		.setWidth( '50px' )
		.onChange( function() {
			var value = this.getValue();
			editor.integratorProps["length"] = value;
			config.setKey( 'project/integrator/photonCount', value );
		}
	)
	avPropertiesRow.add(length);
	container.add(avPropertiesRow);
	function init() {
		var value = editor.integrator;
		integratorType.setValue(value);
		if(value === 'photonmapper'){
			photonRadius.setValue(editor.integratorProps["photonRadius"]);
			photonCount.setValue(editor.integratorProps["photonCount"]);
		}
		if(value === 'av') {
			length.setValue(editor.integratorProps["length"]);
		}
	}
	init();
	function update() {
		var value = editor.integrator;
		if ( value === 'photonmapper' ) {
			integratorPropertiesRow.setDisplay( '' );
		} else {
			integratorPropertiesRow.setDisplay( 'none' );
		}

		if ( value === 'av' ) {
			avPropertiesRow.setDisplay( '' );
		} else {
			avPropertiesRow.setDisplay( 'none' );
		}
		if (value == 'path_mis') {
			integratorPropertiesRow.setDisplay( 'none' ); 
			avPropertiesRow.setDisplay( 'none' );
		}
	}
	update();



	return container;

};
