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
            }

            xml += ' \t </bsdf>\n';
            return xml;
        }

	}

};
