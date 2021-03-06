// 
// Adapted from three.js
// license: MIT (https://github.com/mrdoob/three.js/blob/dev/LICENSE)
// url: https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js
//

export class Vector3{

	constructor(x, y, z){
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.z = z ?? 0;
	}

	set(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	copy(b){
		this.x = b.x;
		this.y = b.y;
		this.z = b.z;

		return this;
	}

	multiplyScalar(s){
		this.x = this.x * s;
		this.y = this.y * s;
		this.z = this.z * s;

		return this;
	}

	add(b){
		this.x = this.x + b.x;
		this.y = this.y + b.y;
		this.z = this.z + b.z;

		return this;
	}

	sub(b){
		this.x = this.x - b.x;
		this.y = this.y - b.y;
		this.z = this.z - b.z;

		return this;
	}

	dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	distanceTo(b){
		let a = this;

		let dd = (a.x - b.x) ** 2 
		       + (a.y - b.y) ** 2 
		       + (a.z - b.z) ** 2;

		return Math.sqrt(dd);
	}

	clone(){
		return new Vector3(this.x, this.y, this.z);
	}

	applyMatrix4(m){
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;
	}

	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}

	normalize(){
		let l = this.length();

		this.x = this.x / l;
		this.y = this.y / l;
		this.z = this.z / l;

		return this;
	}

	toString(precision){
		if(precision != null){
			return `${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)}`;
		}else{
			return `${this.x}, ${this.y}, ${this.z}`;
		}
	}

	toArray(){
		return [this.x, this.y, this.z];
	}

};