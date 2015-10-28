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