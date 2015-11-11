/**
 * @author mrdoob / http://mrdoob.com/
 */

var XmlExporter = function () {
	return {
		transformMatrixList: function(matrix) {
			return [ matrix[0],
				matrix[4],
				matrix[8],
				matrix[12],

				matrix[1],
				matrix[5],
				matrix[9],
				matrix[13],

				matrix[2],
				matrix[6],
				matrix[10],
				matrix[14],

				matrix[3],
				matrix[7],
				matrix[11],
				matrix[15]
			];
		},

		integratorXML: function (iType, parameters) {
			var xml = '<integrator type="';
			xml += iType + '">\n';

			if(iType == "photonmapper") {
				xml += '\t<integer name="photonCount" value="' + parameters["photonCount"] + '"/>\n';
				xml += '\t<float name="photonRadius" value="' + parameters["photonRadius"] + '"/>\n';
			}


			xml += '</integrator>\n';
			return xml;

		},

		samplerXML: function (sType, parameters) {
			var xml = '<sampler type="';
			xml += sType + '">\n';
			xml += '\t<integer name="sampleCount" value="'  + parameters["sampleCount"] + '"/>\n';
			xml += '</sampler>\n';
			return xml;

		},
		cameraXML: function (cType, parameters) {
			var xml = '<camera type="';
			xml += cType + '">\n';
            xml += '\t <float name="fov" value="'  + parameters["fov"] + '"/>\n';
            xml += '\t <float name="nearClip" value="'  + parameters["nearClip"] + '"/>\n';
            xml += '\t <float name="farClip" value="'  + parameters["farClip"] + '"/>\n';

            xml += '\t <integer name="width" value="'  + parameters["width"] + '"/>\n';
            xml += '\t <integer name="height" value="'  + parameters["height"] + '"/>\n';

			xml += '\t <transform name="toWorld">\n';

            xml += '\t \t <scale value="1.0 1.0 -1.0"/> \n';
			xml += '\t \t <matrix value="';
			for(var i = 0; i < 16; i++) {
				xml += parameters["toWorld"][i].toString();
				if(i +1 < 16) xml += ', ';
			}
			xml += '"/>\n';

			xml += '\t </transform>\n';




			xml += '</camera>\n';
			return xml;
		},
		meshXML: function (mType, parameters) {
			var xml = '<mesh type="';
			xml += mType + '">\n';
			xml += '\t <transform name="toWorld">\n';

			xml += '\t \t <matrix value="';
			for(var i = 0; i < 16; i++) {
				xml += parameters["toWorld"][i].toString();
				if(i +1 < 16) xml += ', ';
			}
			xml += '"/>\n';

			xml += '\t </transform>\n';
			xml += '\t<string name="filename" value="' + parameters["filename"] + '"/>\n';
            xml += this.bsdfXML(parameters["BSDFtype"], parameters["BSDFparameters"]);

            xml += '</mesh>\n';
			return xml;
		},
        bsdfXML : function(bType, parameters) {
            var xml = '\t<bsdf type="';
            xml += bType + '">\n';

            switch(bType) {
                case "diffuse":
                    xml += '\t \t <color name="albedo" value="' + parameters['albedo'][0] + ', ' + parameters['albedo'][1] + ', ' + parameters['albedo'][2] +'"/>\n';
                    break;
				case "dielectric":
					xml += '\t \t <float name="intIOR" value="' + parameters['intIOR'] + '"/>\n';
					xml += '\t \t <float name="extIOR" value="' + parameters['extIOR'] + '"/>\n';
					break;
				case "microfacet":
					xml += '\t \t <float name="alpha" value="' + parameters['alpha'] + '"/>\n';
					xml += '\t \t <color name="kd" value="' + parameters['kd'][0] + ', ' + parameters['kd'][1] + ', ' + parameters['kd'][2] +'"/>\n';
					break;
				case "mirror":
					break;
				case "conductor":
					xml += '\t \t <string name="materialName" value="' + parameters['materialName'] + '"/>\n';
					break;
				case "roughConductor":
					xml += '\t \t <float name="alpha" value="' + parameters['alpha'] + '"/>\n';
					xml += '\t \t <string name="materialName" value="' + parameters['materialName'] + '"/>\n';
					break;
            }

            xml += ' \t </bsdf>\n';
            return xml;
        },
		emitterXML: function(eType, parameters) {
			var xml = '\t<emitter type="point">\n';
			xml += '\t \t<point name="position" value="7.232569,-10.756189,10.827317"/>\n';
			xml += '\t \t<color name="power" value="500,250,250"/>\n';
			xml += '\t</emitter>\n';
			return xml;
		}

	}

};
