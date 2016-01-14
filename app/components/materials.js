/**
 * @author alexander
 */
//diffuse MATERIAL
THREE.diffuse = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'diffuse';
    this.albedo = {
			'red': 0.8,
			'green': 0.8,
			'blue': 0.8
		};
    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        };
    if(bsdfParameters !== undefined) {
        this.albedo.red = bsdfParameters.albedo[0];
        this.albedo.green = bsdfParameters.albedo[1];
        this.albedo.blue = bsdfParameters.albedo[2];
    }

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.diffuse.prototype = Object.create( THREE.Material.prototype );
THREE.diffuse.prototype.constructor = THREE.diffuse;
THREE.diffuse.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.albedo['red'] = source.albedo['red'];
    this.albedo['green'] = source.albedo['green'];
    this.albedo['blue'] = source.albedo['blue'];

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;

    return this;

};

//conductor MATERIAL
THREE.conductor = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'conductor';
    this.conductorType = 'Au';
    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        }; 

    if(bsdfParameters !== undefined) {
        this.conductorType = bsdfParameters.materialName;        
    }

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.conductor.prototype = Object.create( THREE.Material.prototype );
THREE.conductor.prototype.constructor = THREE.conductor;
THREE.conductor.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.conductorType = source.conductorType;

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;

    return this;

};

//dielectric MATERIAL
THREE.dielectric = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'dielectric';
    this.intIor = 1.00028;
    this.extIor = 1.3330;

    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        }; 
    if(bsdfParameters !== undefined) {
        this.intIor = bsdfParameters.intIor;
        this.extIor = bsdfParameters.extIor;
    }

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.dielectric.prototype = Object.create( THREE.Material.prototype );
THREE.dielectric.prototype.constructor = THREE.dielectric;
THREE.dielectric.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.intIor = source.intIor;
    this.extIor = source.extIor;

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;

    return this;

};

//microfacetBRDF MATERIAL
THREE.microfacetBRDF = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'microfacetBRDF';
    this.albedo = {
        'red': 0.8,
        'green': 0.8,
        'blue': 0.8
    };
    this.alpha = 0.3;

    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        }; 
    if(bsdfParameters !== undefined) {
        this.alpha = bsdfParameters.alpha;
        this.albedo.red = bsdfParameters.albedo[0];
        this.albedo.green = bsdfParameters.albedo[1];
        this.albedo.blue = bsdfParameters.albedo[2];
    }

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.microfacetBRDF.prototype = Object.create( THREE.Material.prototype );
THREE.microfacetBRDF.prototype.constructor = THREE.microfacetBRDF;
THREE.microfacetBRDF.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );

    this.albedo['red'] = source.albedo['red'];
    this.albedo['green'] = source.albedo['green'];
    this.albedo['blue'] = source.albedo['blue'];
    this.alpha = source.alpha;

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;

    return this;

};

//mirror MATERIAL
THREE.mirror = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'mirror';

    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        }; 

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.mirror.prototype = Object.create( THREE.Material.prototype );
THREE.mirror.prototype.constructor = THREE.mirror;
THREE.mirror.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;
    
    return this;

};

//roughconductor MATERIAL
THREE.roughconductor = function(bsdfParameters, emitterParameters) {
    THREE.Material.call( this );
    this.type = 'roughconductor';
    this.conductorType = 'Au';
    this.alpha = 0.3;
    this.emitter = false;
    this.radiance = {
            'red': 15,
            'green': 15,
            'blue': 15
        }; 

    if(bsdfParameters !== undefined) {
        this.conductorType = bsdfParameters.materialName;
        this.alpha = bsdfParameters.alpha;
    }

    if(emitterParameters !== undefined) {
        this.emitter = true;
        this.radiance.red = emitterParameters.radiance[0];
        this.radiance.green = emitterParameters.radiance[1];
        this.radiance.blue = emitterParameters.radiance[2];
    }

    this.setValues();
};

THREE.roughconductor.prototype = Object.create( THREE.Material.prototype );
THREE.roughconductor.prototype.constructor = THREE.roughconductor;
THREE.roughconductor.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.conductorType = source.conductorType;
    this.alpha = source.alpha;

    this.radiance['red'] = source.radiance['red'];
    this.radiance['green'] = source.radiance['green'];
    this.radiance['blue'] = source.radiance['blue'];
    
    this.emitter = source.emitter;

    return this;

};