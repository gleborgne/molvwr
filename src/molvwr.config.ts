module Molvwr.Config {
	export interface IMolvwrConfig{
		renderers : string[];
		atomScaleFactor : number;
		cylinderScale : number;
		cylinderLOD? : any[];
		sphereSegments : number;
		cylinderSegments? : number;
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
			sphereLOD : [{ depth : 0, segments : 32, texture : true}, { depth : 5, segments : 24, texture : true}, { depth : 10, segments : 16, texture : true}, {depth: 20, segments : 12, texture : true}, {depth: 40, segments : 6, texture : true}, {depth: 80, segments : 4} ]
		};
	}
	
	export function ballsAndSticks() : IMolvwrConfig { 
		return {
			renderers : ['BondsCylinder', 'Sphere'],
			atomScaleFactor: 1.3,
			cylinderScale : 0.5,
			sphereSegments : 16,
			cylinderSegments : 16,
			cylinderLOD : [{ depth : 0, segments : 8, texture : true}, { depth : 5, segments : 6, texture : true}, {depth: 20, segments : 4, texture : true}],
			sphereLOD : [{ depth : 0, segments : 32, texture : true}, { depth : 5, segments : 24, texture : true}, { depth : 10, segments : 16, texture : true}, {depth: 20, segments : 12, texture : true}, {depth: 40, segments : 6, texture : true}, {depth: 80, segments : 4} ]
		};
	}
}