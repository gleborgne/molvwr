module Molvwr.Config {
	export interface IMolvwrConfig{
		allowLOD: boolean;
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
			allowLOD: false,
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			cylinderScale : 0.6,
			sphereSegments : 16
		};
	}
	
	export function spheres() : IMolvwrConfig { 
		return {
			allowLOD: true,
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			cylinderScale : 0.6,
			sphereSegments : 16,
			sphereLOD : [{ depth : 0, segments : 32, effects : true}, { depth : 5, segments : 24, effects : true}, { depth : 10, segments : 16, effects : true}, {depth: 20, segments : 12, effects : true}, {depth: 40, segments : 6, effects : true}, {depth: 60, segments : 6}, {depth: 80, segments : 4} ]
		};
	}
	
	export function ballsAndSticks() : IMolvwrConfig { 
		return {
			allowLOD: true,
			renderers : ['BondsCylinder', 'Sphere'],
			atomScaleFactor: 1.3,
			cylinderScale : 0.4,
			sphereSegments : 16,
			cylinderSegments : 8,
			cylinderLOD : [{ depth : 0, segments : 20, effects : true}, { depth : 5, segments : 12, effects : true}, {depth: 20, segments : 8, effects : true}, {depth: 60, segments : 4, effects : true}],
			sphereLOD : [{ depth : 0, segments : 32, effects : true}, { depth : 5, segments : 24, effects : true}, { depth : 10, segments : 16, effects : true}, {depth: 20, segments : 12, effects : true}, {depth: 40, segments : 6, effects : true}, {depth: 60, segments : 6}, {depth: 80, segments : 4} ]
		};
	}
}