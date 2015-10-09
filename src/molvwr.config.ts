module Molvwr.Config {
	export interface IMolvwrConfig{
		renderers : string[];
		atomScaleFactor : number;
		sphereSegments : number;
	}
	
	export function defaultConfig() : IMolvwrConfig { 
		return {
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			sphereSegments : 16
		};
	}
	
	export function sphere() : IMolvwrConfig { 
		return {
			renderers : ['Sphere'],
			atomScaleFactor: 3,
			sphereSegments : 16
		};
	}
	
	export function sphereAndLineBonds() : IMolvwrConfig { 
		return {
			renderers : ['BondsLines', 'Sphere'],
			atomScaleFactor: 1,
			sphereSegments : 16
		};
	}
}