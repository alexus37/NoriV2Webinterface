angular.module("tjsModelViewer", [])
	.directive(
		"tjsModelViewer",
		[function () {
			return {
				restrict: "E",
				scope: {
					assimpUrl: "=assimpUrl"
				},
				link: function (scope, elem, attr) {
					var camera;
					var scene;
					var renderer;
					var previous;
					var cube;
					var controls;
					var axis;
					var geometryIndex = 0;

					var createSomething = function( klass, args ) {

						var F = function( klass, args ) {
						    return klass.apply( this, args );
						}
						F.prototype = klass.prototype;

						return new F( klass, args );
					};

					// Load jeep model using the AssimpOBJLoader
					var loader1 = new THREE.OBJLoader();

					scope.$watch("assimpUrl", function(newValue, oldValue) {
						if (newValue != oldValue) loadModel(newValue);
					});

					function loadModel(modelUrl) {
						if (modelUrl != "") {
							loader1.load(modelUrl, function (geometry) {
								//if (previous) scene.remove(previous);
								//scene.add(assimpjson);
								THREE.objGeometry = function() {
									return geometry.clone();
								};
								//previous = assimpjson;
								addStuff();
							});
						}
					}
					function buildAxis( src, dst, colorHex, dashed ) {
						var geom = new THREE.Geometry(),
							mat; 

						if(dashed) {
							mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 1, gapSize: 1});
						} else {
							mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
						}

						geom.vertices.push( src.clone() );
						geom.vertices.push( dst.clone() );
						geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

						var axis = new THREE.Line( geom, mat, THREE.LineSegments );

						return axis;

					}

					function buildAxes( length ) {
				        var axes = new THREE.Object3D();

				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
				        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

				        return axes;

					}

					loadModel(scope.assimpUrl);
					// init scene
					init();
					animate();

					function addStuff() {

						if ( cube ) {
							scene.remove( group );
							scene.remove( cube );
						}
						

						geometry = createSomething( THREE["objGeometry"], [] );
						geometry.mergeVertices();
						geometry.computeFaceNormals();
						geometry.computeVertexNormals();

						camera.lookAt(geometry);

						var faceABCD = "abcd";
						var color, f, p, n, vertexIndex;

						for ( i = 0; i < geometry.faces.length; i ++ ) {
							f  = geometry.faces[ i ];
							n = ( f instanceof THREE.Face3 ) ? 3 : 4;

							for( var j = 0; j < n; j++ ) {
								vertexIndex = f[ faceABCD.charAt( j ) ];
								p = geometry.vertices[ vertexIndex ];
								color = new THREE.Color( 0xffffff );
								color.setHSL( ( p.y ) / 200 + 0.5, 1.0, 0.5 );
								f.vertexColors[ j ] = color;
							}
						}

						group = new THREE.Group();
						scene.add( group );

						var material = new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.8 } );
						var mesh = new THREE.Mesh( geometry, material )
						group.add( mesh );

						var meshMaterials = [
							new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.SmoothShading, vertexColors: THREE.VertexColors } ),
							new THREE.MeshBasicMaterial( { color: 0x405040, wireframe: true, opacity: 0.8, transparent: true } )
						];

						cube = THREE.SceneUtils.createMultiMaterialObject( geometry, meshMaterials );


						cube.scale.x = 1;
						cube.scale.y = 1;
						cube.scale.z = 1;

						scene.add( cube );

						group.scale.copy( cube.scale );
					}

					function init() {
						var canvasWidth = 1024;
						var canvasHeight = 1024;

						// set up camera
						camera = new THREE.PerspectiveCamera(50, canvasWidth / canvasHeight, 1, 2000);						
						camera.position.z = 50;
						
						//create scene
						scene = new THREE.Scene();

						// add some axis
						axis = buildAxes(10);
						scene.add(axis);

						var gridXZ = new THREE.GridHelper(10, 1);
						scene.add(gridXZ);


						// Lights
						scene.add(new THREE.AmbientLight(0xcccccc));
						var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee);
						directionalLight.position.x = Math.random() - 0.5;
						directionalLight.position.y = Math.random() - 0.5;
						directionalLight.position.z = Math.random() - 0.5;
						directionalLight.position.normalize();
						scene.add(directionalLight);


						

						// Renderer
						renderer = new THREE.WebGLRenderer({ antialias: true } );
						renderer.setClearColor( 0xc0c0c0 );
						renderer.setSize(canvasWidth, canvasHeight);
						elem[0].appendChild(renderer.domElement);

						// Mouse control
						controls = new THREE.OrbitControls( camera, renderer.domElement );

						// Events
						window.addEventListener('resize', onWindowResize, false);
					}

					//
					function onWindowResize(event) {
						/*
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
						*/
					}

					//
					var t = 0;

					function animate() {
						requestAnimationFrame(animate);
						controls.update();
						render();
					}

					//
					function render() {
						renderer.render( scene, camera );
					}
				}
			}
		}
	]);