
// see https://colorbrewer2.org/#type=diverging&scheme=Spectral&n=11

export class Gradient{

	constructor(steps){
		this.steps = steps;
	}

	get(u){

		let n = u * (this.steps.length - 1);
		let v = n % 1;

		let i = Math.floor(n) % this.steps.length;
		let j = Math.ceil(n) % this.steps.length;

		let a = this.steps[i];
		let b = this.steps[j];

		let color = [
			(1 - v) * a[0] + v * b[0],
			(1 - v) * a[1] + v * b[1],
			(1 - v) * a[2] + v * b[2],
		];

		return color;
	}

}

export let SPECTRAL = new Gradient([
	[158,1,66],
	[213,62,79],
	[244,109,67],
	[253,174,97],
	[254,224,139],
	[255,255,191],
	[230,245,152],
	[171,221,164],
	[102,194,165],
	[50,136,189],
	[94,79,162],
]);