/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Material = function ( editor ) {

	var signals = editor.signals;
	var currentObject;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/material/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/material/collapsed', boolean );

	} );
	container.setDisplay( 'none' );
	container.dom.classList.add( 'Material' );

	container.addStatic( new UI.Text().setValue( 'MATERIAL' ) );
	container.add( new UI.Break() );

	// class

	var materialClassRow = new UI.Panel();
	var materialClass = new UI.Select().setOptions( {
		'conductor': 'Conductor',
		'dielectric': 'Dielectric',
		'diffuse': 'Diffuse',
		'microfacetBRDF': 'Microfacet',
		'mirror': 'Mirror',
		'roughconductor': 'Roughconductor'
	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialClassRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	materialClassRow.add( materialClass );

	container.add( materialClassRow );

    // ALBEDO

    var albedo = new UI.Panel();
    var albedoR = new UI.Number().setWidth( '50px' ).onChange(update);
    var albedoG = new UI.Number().setWidth( '50px' ).onChange(update);
    var albedoB = new UI.Number().setWidth( '50px' ).onChange(update);

    albedo.add(new UI.Text( 'Albedo' ).setWidth( '90px' ) );
    albedo.add(albedoR, albedoG, albedoB);

    container.add(albedo);

    // intIOR

    var intIOR = new UI.Panel();
    var intIORNr = new UI.Select().setOptions( {
        '1.0': 'vacuum',
        '1.00004': 'helium',
        '1.00013': 'hydrogen',
        '1.00028': 'air',
        '1.00045': 'carbon dioxide',
        '1.3330': 'water',
        '1.36': 'acetone',
        '1.361': 'ethanol',
        '1.461': 'carbon tetrachloride',
        '1.4729': 'glycerol',
        '1.501': 'benzene',
        '1.52045': 'silicone oil',
        '1.661': 'bromine',
        '1.31': 'water ice',
        '1.458': 'fused quartz',
        '1.470': 'pyrex',
        '1.49': 'acrylic glass',
        '1.491': 'polypropylene',
        '1.5046': 'bk7',
        '1.544': 'sodium chloride',
        '1.55': 'amber',
        '1.575': 'pet',
        '2.419': 'diamond'
    } ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

    intIOR.add(new UI.Text( 'Interior IOR' ).setWidth( '90px' ) );
    intIOR.add(intIORNr);

    container.add(intIOR);

    // extIOR

    var extIOR = new UI.Panel();
    var extIORNr = new UI.Select().setOptions( {
        '1.0': 'vacuum',
        '1.00004': 'helium',
        '1.00013': 'hydrogen',
        '1.00028': 'air',
        '1.00045': 'carbon dioxide',
        '1.3330': 'water',
        '1.36': 'acetone',
        '1.361': 'ethanol',
        '1.461': 'carbon tetrachloride',
        '1.4729': 'glycerol',
        '1.501': 'benzene',
        '1.52045': 'silicone oil',
        '1.661': 'bromine',
        '1.31': 'water ice',
        '1.458': 'fused quartz',
        '1.470': 'pyrex',
        '1.49': 'acrylic glass',
        '1.491': 'polypropylene',
        '1.5046': 'bk7',
        '1.544': 'sodium chloride',
        '1.55': 'amber',
        '1.575': 'pet',
        '2.419': 'diamond'
    } ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

    extIOR.add(new UI.Text( 'Exterior IOR' ).setWidth( '90px' ) );
    extIOR.add(extIORNr);

    container.add(extIOR);


    //conductor TYPE
    var conductorType = new UI.Panel();
    var conductorTypeOpt = new UI.Select().setOptions( {
        'aC'  : 'Actinium',
        'Ag'  : 'Silver',
        'Al'  : 'Aluminum',
        'AlAs': 'Aluminium arsenide',
        'AlSb': 'Aluminium antimonide',
        'Au'  : 'Gold',
        'Be'  : 'Beryllium',
        'Cr'  : 'Chromium',
        'CsI' : 'Caesium iodide',
        'Cu'  : 'Copper',
        'Cu2O': 'Copper (I) oxide',
        'CuO' : 'Copper (II) oxide',
        'd-C' : 'Deuterium carbide',
        'Hg'  : 'Mercury',
        'HgTe': 'Mercury telluride',
        'Ir'  : 'Iridium',
        'K'   : 'Potassium',
        'Li'  : 'Lithium',
        'MgO' : 'Magnesium oxide',
        'Mo'  : 'Molybdenum',
        'Na'  : 'Sodium',
        'Nb'  : 'Niobium',
        'Ni'  : 'Nickel',
        'Rh'  : 'Rhodium',
        'Se'  : 'Selenium',
        'SiC' : 'Silicon carbide',
        'SnTe': 'Tin telluride',
        'Ta'  : 'Tantalum',
        'Te'  : 'Tellurium',
        'ThF4': 'Thorium tetrafluoride',
        'TiC' : 'Titanium carbide',
        'TiN' : 'Titanium',
        'TiO2': 'titanium dioxide',
        'VC'  : 'Vanadium carbide',
        'VN'  : 'Vanadium nitride',
        'V'   : 'Vanadium',
        'W'   : 'Tungsten'
    } ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

    conductorType.add( new UI.Text( 'Conductor Type' ).setWidth( '90px' ) );
    conductorType.add( conductorTypeOpt );

    container.add( conductorType );

    // ROUGHNESS

    var Roughness = new UI.Panel();
    var RoughnessAlpha = new UI.Number().setWidth( '50px' ).onChange(update);

    Roughness.add(new UI.Text( 'Roughness' ).setWidth( '90px' ) );
    Roughness.add(RoughnessAlpha);

    container.add(Roughness);


	// wireframe

	var materialWireframeRow = new UI.Panel();
	var materialWireframe = new UI.Checkbox( false ).onChange( update );
	var materialWireframeLinewidth = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 100 ).onChange( update );

	materialWireframeRow.add( new UI.Text( 'Wireframe' ).setWidth( '90px' ) );
	materialWireframeRow.add( materialWireframe );
	materialWireframeRow.add( materialWireframeLinewidth );

	container.add( materialWireframeRow );

    // area emiter
    var materialEmitterRow = new UI.Panel();
    var materialEmitter = new UI.Checkbox( false ).onChange( update );
    
    materialEmitterRow.add( new UI.Text( 'Emitter' ).setWidth( '90px' ) );
    materialEmitterRow.add( materialEmitter );
    
    container.add( materialEmitterRow );

    var radiance = new UI.Panel();
    var radianceR = new UI.Number().setWidth( '50px' ).onChange(update);
    var radianceG = new UI.Number().setWidth( '50px' ).onChange(update);
    var radianceB = new UI.Number().setWidth( '50px' ).onChange(update);

    radiance.add(new UI.Text( 'Radiance' ).setWidth( '90px' ) );
    radiance.add(radianceR, radianceG, radianceB);

    container.add(radiance);

	//

	function update() {

		var object = currentObject;

		var material = object.material;

		var textureWarning = false;



		if ( material ) {
            var mClass = materialClass.getValue();
            if(mClass == "") {
                mClass = "diffuse";
            }
            if (material instanceof THREE[mClass] === false ) {

                material = new THREE[mClass]();

                object.material = material;
            }

            if ( material.type == 'diffuse') {
                material.albedo.red = albedoR.getValue();
                material.albedo.green = albedoG.getValue();
                material.albedo.blue = albedoB.getValue();
                    
            }

            if ( material.type == 'conductor') {
                material.conductorType = conductorTypeOpt.getValue();
            }

            if ( material.type == 'dielectric') {
                material.intIor = intIORNr.getValue();
                material.extIor = extIORNr.getValue();
            }

            if ( material.type == 'microfacetBRDF') {
                material.albedo.red = albedoR.getValue();
                material.albedo.green = albedoG.getValue();
                material.albedo.blue = albedoB.getValue();
                material.alpha = RoughnessAlpha.getValue();
            }

            if ( material.type == 'mirror') {

            }

            if ( material.type == 'roughconductor') {
                material.conductorType = conductorTypeOpt.getValue();
                material.alpha = RoughnessAlpha.getValue();
            }

            if(material.emitter) {
                material.radiance.red = radianceR.getValue();
                material.radiance.green = radianceG.getValue();
                material.radiance.blue = radianceB.getValue();
            }
            material.emitter = materialEmitter.getValue();



			refreshUi(false);

			signals.materialChanged.dispatch( material );

		}

		if ( textureWarning ) {

			console.warn( "Can't set texture, model doesn't have texture coordinates" );

		}

	}
    function setAllInvisble() {
        materialWireframeRow.setDisplay('none');
        conductorType.setDisplay('none');
        Roughness.setDisplay('none');
        extIOR.setDisplay('none');
        intIOR.setDisplay('none');
        albedo.setDisplay('none');
        radiance.setDisplay('none');
    }
	//

	function setRowVisibility() {

		var properties = {
			'wireframe': materialWireframeRow
		};

		var material = currentObject.material;
        setAllInvisble();

        if(material["emitter"]) {
            radiance.setDisplay('');
        }

        if (material["type" ] == 'conductor') {
            conductorType.setDisplay('');
        } else if (material["type" ] == 'dielectric') {
            extIOR.setDisplay('');
            intIOR.setDisplay('');
        } else if (material["type" ] == 'diffuse') {
            albedo.setDisplay('');
        } else if (material["type" ] == 'microfacetBRDF') {
            albedo.setDisplay('');
            Roughness.setDisplay('');
        } else if (material["type" ] == 'mirror') {

        } else if (material["type" ] == 'roughconductor') {
            Roughness.setDisplay('');
            conductorType.setDisplay('');
        }

		for ( var property in properties ) {

			properties[ property ].setDisplay( material[ property ] !== undefined ? '' : 'none' );

		}

	}


	function refreshUi() {

		var material = currentObject.material;



		materialClass.setValue( material.type );

        if(material.emitter) {
            radianceR.setValue(material.radiance.red);
            radianceG.setValue(material.radiance.green);
            radianceB.setValue(material.radiance.blue);
        }

        if(material.type == 'diffuse') {
            albedoR.setValue(material.albedo.red);
            albedoG.setValue(material.albedo.green);
            albedoB.setValue(material.albedo.blue);
            
        }

        if ( material.type == 'conductor') {
            conductorTypeOpt.setValue(material.conductorType);
        }

        if ( material.type == 'dielectric') {
            intIORNr.setValue(material.intIor);
            extIORNr.setValue(material.extIor);
        }

        if ( material.type == 'microfacetBRDF') {
            albedoR.setValue(material.albedo.red);
            albedoG.setValue(material.albedo.green);
            albedoB.setValue(material.albedo.blue);
            RoughnessAlpha.setValue(material.alpha);
        }

        if ( material.type == 'mirror') {

        }

        if ( material.type == 'roughconductor') {
            conductorTypeOpt.setValue(material.conductorType);
            RoughnessAlpha.setValue(material.alpha);
        }



		if ( material.wireframe !== undefined ) {

			materialWireframe.setValue( material.wireframe );

		}

		if ( material.wireframeLinewidth !== undefined ) {

			materialWireframeLinewidth.setValue( material.wireframeLinewidth );

		}

		setRowVisibility();

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material ) {

			var objectChanged = object !== currentObject;

			currentObject = object;
			refreshUi(objectChanged);
			container.setDisplay( '' );

		} else {

			currentObject = null;
			container.setDisplay( 'none' );

		}

	} );

	return container;

};
