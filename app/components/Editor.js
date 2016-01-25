/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function () {

	var SIGNALS = signals;

	this.signals = {

	
		// actions

		showModal: new SIGNALS.Signal(),

		// notifications

		editorCleared: new SIGNALS.Signal(),

		savingStarted: new SIGNALS.Signal(),
		savingFinished: new SIGNALS.Signal(),

		themeChanged: new SIGNALS.Signal(),

		transformModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
		spaceChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		cameraChanged: new SIGNALS.Signal(),

		geometryChanged: new SIGNALS.Signal(),

		objectSelected: new SIGNALS.Signal(),
		objectFocused: new SIGNALS.Signal(),

		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),

		materialChanged: new SIGNALS.Signal(),

		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal(),

		showGridChanged: new SIGNALS.Signal()

	};

	this.xmlExporter = new XmlExporter();
	this.config = new Config();
	this.history = new History( this );
	this.storage = new Storage();
	this.loader = new Loader( this );

	

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';

	this.sceneHelpers = new THREE.Scene();
	//AX
	this.currentXML = "";
	this.setxmlFunction = null;
	this.showresultFunction = null;
	this.renderFunction = null;
	this.changeFunction = null;
	this.importobjFunction = null;
	this.defaultobjFunction = null;
	this.loadxmlFunction = null;
	this.loadmodelFunction = null;
	this.savesceneFunction = null;
	this.updatesceneFunction = null;
	this.sampler = "independent";
	this.samplerProps = {sampleCount: 64};
	this.integrator = "av";
	this.integratorProps = {
		length: 10,
		photonCount: 0,
		photonRadius: 0
	};

	this.width = 0;
	this.height = 0;
	this.thinLensCam = false;
	this.focusPoint = new THREE.Vector3(0, 0, 0);
	this.aperture = 0.05;
	this.currentSceneUrl = "";

	//AX end
	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 100000 );
	this.camera.position.set( 500, 250, 500 );
	this.camera.lookAt( new THREE.Vector3() );
	this.camera.name = 'Camera';


	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};

	this.selected = null;
	this.helpers = {};

};

Editor.prototype = {
	setTheme: function ( value ) {

		document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},


	//

	setScene: function ( scene ) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );

		} );

		this.scene.add( object );

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},
	setCamera: function(camera) {
		var str2tjsVec = function(str) {
			var elm = str.split(",");
			return  new THREE.Vector3(elm[0], elm[1], elm[2]);
		};
		var handleFloat = function(floatObj) {
			var val = parseFloat(floatObj._value);
			switch(floatObj._name) {				
				case "fov":
					var hFov = val;
					var invAspect = this.height / this.width;
					this.camera.fov = 2 * Math.atan( Math.tan( hFov * Math.PI / 180 / 2 ) * invAspect ) * 180 / Math.PI; // degrees;
					
				break;
				case "nearClip":
					this.camera.near = val;
				break;
				case "farClip":
					this.camera.far = val;
				break;
				case "apertureRadius":
					this.aperture = val;
				break;
				case "focusDistance":
					//compute the point fitting to the focus distance
					var lookAtVector = new THREE.Vector3(0,0, -1);
					lookAtVector.applyQuaternion(this.camera.quaternion);
					this.focusPoint.add(this.camera.position, lookAtVector.multiplyScalar(val)) ;
				break;
				default:
					console.log("camera float not handled");
			}

		}
		var handleInteger = function(integerObj) {
			var val =  parseInt(integerObj._value);
			switch(integerObj._name) {
				case "width":
					this.width = val;
				break;
				case "height":
					this.height = val;
				break;
				default:
					console.log("camera integer not handled");
			}
		}
		//switch(camera._type){
			//case "perspective":
		if("transform" in camera) {
			var T = [];
			if(camera.transform._name == "toWorld") {
				if("matrix" in camera.transform) {
					T = this.string2Arr(camera.transform.matrix._value);
					// 
					var m = new THREE.Matrix4();
					var position = new THREE.Vector3();
					var quaternion = new THREE.Quaternion();
					var scale = new THREE.Vector3();

					m.set(T[0], T[1], T[2], T[3],
						  T[4], T[5], T[6], T[7],
						  T[8], T[9], T[10], T[11],
						  T[12], T[13], T[14], T[15]);

					m.decompose( position, quaternion, scale );

					this.camera.quaternion.copy( quaternion );
					this.camera.position.copy(position);
					
					this.camera.updateMatrixWorld(true);
					
				} else if("lookat" in camera.transform) {
					var elm = this.string2Arr(camera.transform.lookat._origin);
					this.camera.position.set(elm[0], elm[1], elm[2] );
					this.camera.up = str2tjsVec(camera.transform.lookat._up);
					this.camera.lookAt(str2tjsVec(camera.transform.lookat._target));
				} else {
					// ToDo: handle other transforms (scale rotation)
					console.log("Transform " + camera.transform._name + " not handled (setCamera)");
				}

			}
			if("integer" in camera){
				if(camera.integer instanceof Array) {
					for (var i = 0; i < camera.integer.length; i++) {
						handleInteger(camera.integer[i])
					};
				} else {
					handleInteger(camera.integer);
				}
			}
			var aspect = this.width / this.height;
			this.camera.aspect = aspect;
			if("float" in camera){
				if(camera.float instanceof Array) {
					for (var i = 0; i < camera.float.length; i++) {
						handleFloat.call(this, camera.float[i])
					};
				} else {
					handleFloat.call(this, camera.float);
				}
			}
			

			this.camera.updateProjectionMatrix();

		}
				/*break;
			default:
				console.log("Camera type not jet supperted!");
		}*/
	},
	setEmitter: function(emitter) {
		var componentToHex = function (c) {
    		var hex = c.toString(16);
    		return hex.length == 1 ? "0" + hex : hex;
		}

		var rgbToHex = function (r, g, b) {
    		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}
		switch(emitter._type){
			case 'point':
				var color = 0xffffff;
				var intensity = 1;
				var distance = 0;

				if("color" in emitter && emitter.color._name == "power") {
					var elm = this.string2Arr(emitter.color._value);
					elm[0] /= 255;
					elm[1] /= 255;
					elm[2] /= 255;
					// index of the max
					var rgb = [0, 0, 0];
					var x = elm.indexOf(Math.max.apply(Math, elm));
					intensity = elm[x];
					rgb[x] = 1;
					for (var i = 0; i < 3; i++) {
						if(i != x) {
							rgb[i] = elm[i] / intensity;
						}
					}
					color = rgbToHex(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
				}


				var light = new THREE.PointLight( color, intensity, distance );
				light.name = 'PointLight';

				if("point" in emitter && emitter.point._name == "position") {
					var elm = this.string2Arr(emitter.point._value);
					light.position.set(elm[0], elm[1], elm[2]);
					light.updateMatrixWorld(true);
				}

				this.addObject( light );				

			break;
			default:
				console.log("Emitter type " + emitter._type + " not jet supported");
		}


		

	},
	string2Arr: function(str) {
		var elm = str.split(',');
		if(elm.length == 1) {
			elm = str.split(' ');
		}
		for (var i = 0; i < elm.length; i++) {
			elm[i] = parseFloat(elm[i]);
		}; 
		return elm;
	},
	setMesh: function(mesh) {
		var handledEmitter = function(emitter) {
			return {type: "area",
					radiance: this.string2Arr(emitter.color._value)}
		};
		var handleBSDF = function(bsdf) {
			var cBSDF = {};
			cBSDF["type"] = bsdf._type;
			switch(cBSDF["type"]) {
				case 'diffuse':
					cBSDF["albedo"] = [0, 0, 0];
                    if ("color" in bsdf) {
                    	cBSDF["albedo"] = this.string2Arr(bsdf.color._value);
                    }	                
	                break;
	            case'conductor':
            		cBSDF["materialName"] = "Au";
            		if("string" in bsdf && bsdf.string._name == "materialName"){
						cBSDF["materialName"] = bsdf.string._value;
            		}
	                
	                break;
	            case 'dielectric':
	            		cBSDF["intIOR"] = 1.5;
	            		cBSDF["extIOR"] = 1.0;
	            		if("float" in bsdf) {
	            			for (var i = 0; i < bsdf.float.length; i++) {
	            				var val = parseFloat(bsdf.float[i]._value);
	            				if(bsdf.float[i]._name =="intIOR") {
	            					cBSDF["intIOR"] = val;
	            				} else {
	            					cBSDF["extIOR"] = val;
	            				}
	            			}
	            		}                   	            
	                break;

	            case 'mirror':
	            	cBSDF["type"] = 'mirror';
	                break;
	            case 'roughConductor':
            		cBSDF["materialName"] = "Au";
            		if("string" in bsdf && bsdf.string._name == "materialName"){
						cBSDF["materialName"] = bsdf.string._value;
            		}
            		cBSDF["alpha"] = 0.3;	            		
            		if("float" in bsdf  && bsdf.float._name == "alpha") {
            			cBSDF["alpha"] = parseFloat(bsdf.float._value);
            		}	                    
	               
	                break;
				default:
					console.log("BSDF " + cBSDF["type"] +" not handled yet");
					return undefined;
			}
			return cBSDF;

		};
		switch(mesh._type){
			case "obj":
				if("string" in mesh) {
					if(mesh.string._name == "filename"){
						var m = undefined;
						var curEmitter = undefined;
						var curBSDF = undefined;
						if("transform" in mesh && mesh.transform._name == "toWorld") {							
							var m = new THREE.Matrix4();
							m.identity();
							if("matrix" in mesh.transform) {
								var T = mesh.transform.matrix._value.split(",");
								m.set(T[0], T[1], T[2], T[3],
									  T[4], T[5], T[6], T[7],
									  T[8], T[9], T[10], T[11],
									  T[12], T[13], T[14], T[15]);
							} else {
								// ToDo: handle other transforms (scale rotation)
								console.log("Transform " + mesh.transform._name + " not handled (setMesh)");
							} 
						} 
						if("bsdf" in mesh) {
							curBSDF = handleBSDF.call(this, mesh.bsdf);
						}

						if("emitter" in mesh) {
							curEmitter = handledEmitter.call(this, mesh.emitter);
						}


						this.loadmodelFunction({callback: this.loader.loadObj,												
												model: mesh.string._value,
												transform: m,
												bsdf: curBSDF,
												emitter: curEmitter})

						

					}
				}
				
				break;
			default:
				alert("Camera type not jet supperted!");
		}
	},
	setIntegrator: function(integrator) {
		this.integrator = integrator._type;
		switch(integrator._type){
			case "av":
				if("float" in integrator) {
					if(integrator.float._name == "length") {
						// parseInt is correct 
						this.integratorProps.length = parseInt(integrator.float._value);
					}
				}
				break;
			case "photonmapper":
				if("integer" in integrator) {
					if(integrator.integer._name == "photonCount") {
						this.integratorProps.photonCount = parseInt(integrator.integer._value);
					}
				}
				if("float" in integrator) {
					if(integrator.float._name == "photonRadius") {
						this.integratorProps.photonRadius = parseFloat(integrator.float._value);
					}
				}
			case "path_mis":
			case "path_mats":
			case "direct":
			case "direct_mis":
			case "direct_ems":
			case "direct_mats":
			break;
				
			default:
				console.log("integrator type " + integrator._type + " not jet supperted!");
		}
	},
	setSampler: function(sampler) {
		switch(sampler._type){
			case "independent":
				this.sampler = "independent";
				
				if("integer" in sampler) {
					if(sampler.integer._name == "sampleCount") {
						this.samplerProps.sampleCount = parseFloat(sampler.integer._value);
					}
				}
				break;
			default:
				console.log("sampler type " + sampler._type +" not jet supperted!");
		}
	},

	setSceneXML: function(scene, url) {
		this.setCurrentSceneUrl.call(this, url);		

		//set the camera
		if("camera" in scene) {
			this.setCamera(scene.camera)
		}
		if("integrator" in scene) {
			this.setIntegrator(scene.integrator)
		}
		if("mesh" in scene) {
			if(scene.mesh instanceof Array) {
				for (var i = scene.mesh.length - 1; i >= 0; i--) {
					this.setMesh(scene.mesh[i]);
				};
			} else {
				//only one mesh
				this.setMesh(scene.mesh)
			}
		}
		if("emitter" in scene) {
			if(scene.emitter instanceof Array) {
				for (var i = scene.emitter.length - 1; i >= 0; i--) {
					this.setEmitter(scene.emitter[i]);
				};
			} else {
				//only one mesh
				this.setEmitter(scene.emitter)
			}
		}
		if("sampler" in scene) {
			this.setSampler(scene.sampler)
		}
		this.signals.sceneGraphChanged.dispatch();
	},

	getScene: function() {
		this.loadxmlFunction({callback: this.setSceneXML, editor: this})
	},

	getExample: function(exampleFile) {
		var exampleURL = "../examples/?type=" + exampleFile;
		this.loadxmlFunction({callback: this.setSceneXML, editor: this, url: exampleURL});
	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},
	changeView: function(viewName) {
		this.changeFunction({name: viewName});
	},
	setCurrentSceneUrl: function(url) {
		if(url != "") {
			this.currentSceneUrl = url;
			this.config.setKey( 'project/currentSceneUrl', url );
		}
	},
	saveScene: function() {
		var xmlOutPut = this.getSceneXML();
		this.setxmlFunction({xml: xmlOutPut});
		this.savesceneFunction({callback: this.setCurrentSceneUrl, editor: this});
	},
	updateScene: function() {
		var xmlOutPut = this.getSceneXML();
		this.setxmlFunction({xml: xmlOutPut});
		this.updatesceneFunction({target: this.currentSceneUrl});
	},
	importobj : function() {
		this.importobjFunction({callback: this.loader.loadObj});
	},
	importDefaultObj: function(dType) {
		this.defaultobjFunction({callback: this.loader.loadObj, geometry: dType});		
	}, 
	getSceneXML: function(){
		var xmlOutPut = '<?xml version="1.0" encoding="utf-8"?>\n';
		xmlOutPut += '<scene>\n';

		//add the integrator
		xmlOutPut += this.xmlExporter.integratorXML(this.integrator, this.integratorProps);


		//add the sampler
		xmlOutPut += this.xmlExporter.samplerXML(this.sampler, this.samplerProps);

		var transposeCamMat = this.xmlExporter.transformMatrixList(this.camera.matrixWorld.elements);

		//add the camera
		var aspect = this.width / this.height;
		var hFOV = 2 * Math.atan( Math.tan( this.camera.fov * Math.PI / 180 / 2 ) * aspect ) * 180 / Math.PI; // degrees
		var cameraProps = {
			toWorld: transposeCamMat,
			fov: hFOV, //this.camera.fov,
			nearClip: this.camera.near,
			farClip: this.camera.far,
			width: this.width,
			height: this.height
		};
		var camType = "perspective";
		if(this.thinLensCam) {
			camType = "thinlens";
			cameraProps["apertureRadius"] = this.aperture;

			var camPos = this.camera.position;
			var distVec = new THREE.Vector3();
			distVec.sub(camPos, this.focusPoint);
			cameraProps["focusDistance"] = distVec.length();
		}

		xmlOutPut += this.xmlExporter.cameraXML(camType, cameraProps);

		for(var i = 0; i < this.scene.children.length; i++) {
			if(this.scene.children[i].type == "Object3D") {
				var meshType = "obj";
                var bsdfType = "diffuse";
                var bsdfParameters = {
                    albedo: [0.201901, 0.116948, 0.078615]
                };
                if(this.scene.children[i].children.length > 0) {
	                var material = this.scene.children[i].children[0].material;
	                if(material.type == 'diffuse') {
	                    bsdfType = "diffuse";
	                    bsdfParameters = {
	                        albedo: [material.albedo.red, material.albedo.green, material.albedo.blue]
	                    };
	                }

	                if ( material.type == 'conductor') {
	                    bsdfType = "conductor";
	                    bsdfParameters = {
	                        materialName: material.conductorType
	                    };
	                }

	                if ( material.type == 'dielectric') {
	                    bsdfType = "dielectric";
	                    bsdfParameters = {
	                        intIOR: material.intIor,
	                        extIOR: material.extIor
	                    };
	                }

	                if ( material.type == 'microfacetBRDF') {
	                    bsdfType = "microfacet";
	                    bsdfParameters = {
	                        kd: [material.albedo.red, material.albedo.green, material.albedo.blue],
	                        alpha: material.alpha
	                    };
	                }

	                if ( material.type == 'mirror') {
	                    bsdfType = "mirror";
	                }

	                if ( material.type == 'roughConductor') {
	                    bsdfType = "roughConductor";
	                    bsdfParameters = {
	                        materialName: material.conductorType,
	                        alpha: material.alpha
	                    };
	                }


					var meshProps = {
						toWorld: this.xmlExporter.transformMatrixList(this.scene.children[i].children[0].matrixWorld.elements),
						filename: this.scene.children[i].name,
						BSDFtype: bsdfType,
						BSDFparameters: bsdfParameters,
						emitter: material.emitter,
						radiance: material.emitter? [material.radiance.red, material.radiance.green, material.radiance.blue]: []
					};
					xmlOutPut += this.xmlExporter.meshXML(meshType, meshProps);
				}
			}
			if(this.scene.children[i].type == "PointLight") {
				var intensity = this.scene.children[i].intensity;
				var pointLightProperties = {
					position: [	this.scene.children[i].position.x, 
								this.scene.children[i].position.y, 
								this.scene.children[i].position.z],
					power:[this.scene.children[i].color.r * 255 * intensity, 
						   this.scene.children[i].color.g * 255 * intensity,
						   this.scene.children[i].color.b * 255 * intensity]
				}
				xmlOutPut += this.xmlExporter.emitterXML("point", pointLightProperties)
			}
		}

		xmlOutPut += '</scene>';
		return xmlOutPut;
	},

	exportXML: function() {
		//console.log(xmlOutPut);
		var xmlOutPut = this.getSceneXML();
        this.renderFunction({xml: xmlOutPut});
	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 20, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 10 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 10 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 20 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 10 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 10 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	select: function ( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},

	focus: function ( object ) {

		this.signals.objectFocused.dispatch( object );

	},

	focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},

	clear: function () {

		this.history.clear();
		this.storage.clear();
		this.currentSceneUrl = "";

		this.camera.position.set( 500, 250, 500 );
		this.camera.lookAt( new THREE.Vector3() );

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.deselect();

		this.signals.editorCleared.dispatch();

	},

	//

	fromJSON: function ( json ) {

		var loader = new THREE.ObjectLoader();

		// backwards
		if(this.config.getKey( 'project/currentSceneUrl') !== undefined) {
			this.currentSceneUrl = this.config.getKey( 'project/currentSceneUrl');
		}
		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ) );
			return;

		}


		// TODO: Clean this up somehow

		var camera = loader.parse( json.camera );

		this.camera.position.copy( camera.position );
		this.camera.rotation.copy( camera.rotation );
		this.camera.aspect = camera.aspect;
		this.camera.near = camera.near;
		this.camera.far = camera.far;

		this.setScene( loader.parse( json.scene ) );
		this.scripts = json.scripts;

	},

	toJSON: function () {

		return {

			project: {
				shadows: this.config.getKey( 'project/renderer/shadows' ),
				vr: this.config.getKey( 'project/vr' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts

		};

	}

}
