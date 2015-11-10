/**
 * @author alexander
 */
//DIFFUSE MATERIAL
THREE.Diffuse = function(r, g, b) {
    THREE.Material.call( this );
    this.type = 'diffuse';
    this.albedo = {
			'red': r,
			'green': g,
			'blue': b
		};

    this.setValues();
};

THREE.Diffuse.prototype = Object.create( THREE.Material.prototype );
THREE.Diffuse.prototype.constructor = THREE.Diffuse;
THREE.Diffuse.prototype.copy = function ( source ) {

    THREE.Material.prototype.copy.call( this, source );
    this.albedo['red'] = source.albedo['red'];
    this.albedo['green'] = source.albedo['green'];
    this.albedo['blue'] = source.albedo['blue'];

    return this;

};