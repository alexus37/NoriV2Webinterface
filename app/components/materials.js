/**
 * @author alexander
 */
//DIFFUSE MATERIAL
THREE.DIFFUSE = function() {
    THREE.Material.call( this );
    this.type = 'diffuse';
    this.albedo = {
			'red': 0.8,
			'green': 0.8,
			'blue': 0.8
		};

    this.setValues();
};

THREE.DIFFUSE.prototype = Object.create( THREE.Material.prototype );
THREE.DIFFUSE.prototype.constructor = THREE.DIFFUSE;
THREE.DIFFUSE.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.albedo['red'] = source.albedo['red'];
    this.albedo['green'] = source.albedo['green'];
    this.albedo['blue'] = source.albedo['blue'];

    return this;

};

//CONDUCTOR MATERIAL
THREE.CONDUCTOR = function() {
    THREE.Material.call( this );
    this.type = 'conductor';
    this.conductorType = 'Au';

    this.setValues();
};

THREE.CONDUCTOR.prototype = Object.create( THREE.Material.prototype );
THREE.CONDUCTOR.prototype.constructor = THREE.CONDUCTOR;
THREE.CONDUCTOR.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.conductorType = source.conductorType;

    return this;

};

//DIELECTRIC MATERIAL
THREE.DIELECTRIC = function() {
    THREE.Material.call( this );
    this.type = 'dielectric';
    this.intIor = 1.00028;
    this.extIor = 1.3330;


    this.setValues();
};

THREE.DIELECTRIC.prototype = Object.create( THREE.Material.prototype );
THREE.DIELECTRIC.prototype.constructor = THREE.DIELECTRIC;
THREE.DIELECTRIC.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.intIor = source.intIor;
    this.extIor = source.extIor;

    return this;

};

//MICROFACETBRDF MATERIAL
THREE.MICROFACETBRDF = function() {
    THREE.Material.call( this );
    this.type = 'microfacetBRDF';
    this.albedo = {
        'red': 0.8,
        'green': 0.8,
        'blue': 0.8
    };
    this.alpha = 0.3;

    this.setValues();
};

THREE.MICROFACETBRDF.prototype = Object.create( THREE.Material.prototype );
THREE.MICROFACETBRDF.prototype.constructor = THREE.MICROFACETBRDF;
THREE.MICROFACETBRDF.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );

    this.albedo['red'] = source.albedo['red'];
    this.albedo['green'] = source.albedo['green'];
    this.albedo['blue'] = source.albedo['blue'];
    this.alpha = source.alpha;

    return this;

};

//MIRROR MATERIAL
THREE.MIRROR = function() {
    THREE.Material.call( this );
    this.type = 'mirror';

    this.setValues();
};

THREE.MIRROR.prototype = Object.create( THREE.Material.prototype );
THREE.MIRROR.prototype.constructor = THREE.MIRROR;
THREE.MIRROR.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    return this;

};

//ROUGHCONDUCTOR MATERIAL
THREE.ROUGHCONDUCTOR = function() {
    THREE.Material.call( this );
    this.type = 'roughconductor';
    this.conductorType = 'Au';
    this.alpha = 0.3;

    this.setValues();
};

THREE.ROUGHCONDUCTOR.prototype = Object.create( THREE.Material.prototype );
THREE.ROUGHCONDUCTOR.prototype.constructor = THREE.ROUGHCONDUCTOR;
THREE.ROUGHCONDUCTOR.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.conductorType = source.conductorType;
    this.alpha = source.alpha;

    return this;

};