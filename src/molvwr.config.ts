module Molvwr.Config {
	export interface IMolvwrConfig{
		renderers : string[];
		atomScaleFactor : number;
		cylinderScale : number;
		sphereSegments : number;
	}
	
	export function defaultConfig() : IMolvwrConfig { 
		return {
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			cylinderScale : 0.6,
			sphereSegments : 16
		};
	}
	
	export function spheres() : IMolvwrConfig { 
		return {
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			cylinderScale : 0.6,
			sphereSegments : 16
		};
	}
	
	export function ballsAndSticks() : IMolvwrConfig { 
		return {
			renderers : ['BondsCylinder', 'Sphere'],
			atomScaleFactor: 1.3,
			cylinderScale : 0.6,
			sphereSegments : 16
		};
	}
}