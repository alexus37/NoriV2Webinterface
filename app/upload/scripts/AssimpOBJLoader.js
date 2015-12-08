/**
 * @author mrdoob / http://mrdoob.com/
 * @author wadeb / http://wadeb.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		} );

	},

	parse: function ( text ) {

		var verts = [];
		var faces = [];

		function parseVertexIndex( value ) {

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + mesh.verts.length );

		}

		function parseUVIndex( value ) {

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + mesh.uvs.length );

		}

		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

		var face_vert_pattern = / +(-?\d+)(\/(-?\d+)?)?(\/(-?\d+)?)?/;

		//

		var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				verts.push(
					new THREE.Vector3(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					)
				);

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				// mesh.uvs.push(
				// 	parseFloat( result[ 1 ] ),
				// 	parseFloat( result[ 2 ] )
				// );

			} else if ( /^f /.test( line ) ) {

				var faceVerts = [];
				// var faceUVs = [];

				line = line.substring( 1 );

				while ( ( result = face_vert_pattern.exec( line ) ) != null ) {

					// [" 0/1/2", "0", "/1", "1", "/2", "2"]

					faceVerts.push( parseVertexIndex( result[ 1 ] ) );
					// faceUVs.push( parseUVIndex( result[ 3 ] ) );

					line = line.substring( result[ 0 ].length );
				}

				if(faceVerts.length == 3)
					faces.push( new THREE.Face3(faceVerts[0],faceVerts[1],faceVerts[2]) );
				else if(faceVerts.length == 4)
					faces.push( new THREE.Face4(faceVerts[0],faceVerts[1],faceVerts[2],faceVerts[3]) );
				else
					console.log('Wrong input');

			} else if ( /^o /.test( line ) ) {

				// object

			} else if ( /^g /.test( line ) ) {

				// group

			} else if ( /^usemtl /.test( line ) ) {

				// material

			} else if ( /^mtllib /.test( line ) ) {

				// mtl file

			} else if ( /^s /.test( line ) ) {

				// smooth shading

			} else {

				// console.log( "THREE.OBJLoader: Unhandled line " + line );

			}

		}

		var geo = new THREE.Geometry();
		geo.vertices = verts;
		geo.faces = faces;
		return geo;

	}

};
