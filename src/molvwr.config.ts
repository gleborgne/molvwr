module Molvwr.Config {
	export interface IMolvwrConfig{
		renderers : string[];
		atomScaleFactor : number;
		cylinderScale : number;
		cylinderLOD? : any[];
		sphereSegments : number;
		sphereLOD? : any[];		
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
			sphereSegments : 16,
			sphereLOD : [{ depth : 10, segments : 32}, { depth : 20, segments : 20}, {depth: 30, segments : 12}, {depth: 40, segments : 6}, {depth: 50, segments : null} ]
		};
	}
	
	export function ballsAndSticks() : IMolvwrConfig { 
		return {
			renderers : ['BondsCylinder', 'Sphere'],
			atomScaleFactor: 1.3,
			cylinderScale : 0.5,
			sphereSegments : 16
		};
	}
}