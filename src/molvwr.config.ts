module Molvwr {
	export interface IMolvwrConfig{
		renderer : string;
		scale: number;
		atomScaleFactor : number;
		sphereSegments : number;
	}
	
	export var defaultConfig : IMolvwrConfig = {
		renderer : 'Sphere',
		scale : 1.5,
		atomScaleFactor: 3,
		sphereSegments : 32
	};
}