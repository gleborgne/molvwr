module Molvwr.ViewModes {
	export interface StandardViewModeOptions {
		texture?: boolean;
		onpreparescene? : (ctx: BabylonContext) => void;
		clearColor? : number[];
		fogDensity? : number;
		fogColor? : number[];
		groundColor? : number[];
		specular? : number[];
		wheelPrecision? : number;
		pinchPrecision? : number;
		panningSensibility? : number;
		emisivefresnel?: BABYLON.FresnelParameters
		sphere?: {
			diffuseTexture? : string;
			specularTexture?: string;
			bumpTexture?: string;
			textureScale?: number;
		};
		cylinder?: {
			diffuseTexture?: string;
			specularTexture?: string;
			bumpTexture?: string;
			textureScale?: number;
		};
	}

	export class Standard implements Molvwr.IViewMode {
		options: StandardViewModeOptions;

		constructor(viewoptions?: StandardViewModeOptions) {
			this.options = viewoptions;
			if (!viewoptions){
				console.log("default viewmode config");
				this.options = Molvwr.ViewModes.Standard.defaultConfig();
			}
			if (!this.options.sphere)
				this.options.sphere= {};
			if (!this.options.cylinder)
				this.options.cylinder= {};
		}		
		
		public static defaultConfig(){
			var res = <StandardViewModeOptions>{
					texture : false,
					emisivefresnel : new BABYLON.FresnelParameters(),
					cylinder: {
						
					},
					sphere : {						
					}	
			};
			res.emisivefresnel.bias = 0.3;
			res.emisivefresnel.power = 1;
			res.emisivefresnel.leftColor = BABYLON.Color3.Black();
			res.emisivefresnel.rightColor = BABYLON.Color3.White();
			return res;
		}
		
		getColor(config, defaultColor){
			if (config && config.length >= 3){
				return new BABYLON.Color3(config[0], config[1], config[2]);
			}else{
				return new BABYLON.Color3(defaultColor[0], defaultColor[1], defaultColor[2]);
			}
		}

		createScene(context: BabylonContext) {
			context.scene.clearColor = this.getColor(this.options.clearColor, [0.9,0.9, 0.95]);			
			context.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
			context.scene.fogColor = this.getColor(this.options.fogColor, [0.9,0.9, 0.85]);			
			context.scene.fogDensity = this.options.fogDensity || 0.01;

			var camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 28, new BABYLON.Vector3(0, 0, 0), context.scene);
			camera.wheelPrecision = this.options.wheelPrecision || 10;
			camera.pinchPrecision = this.options.pinchPrecision || 7;
			camera.panningSensibility = this.options.panningSensibility || 70;
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.attachControl(context.canvas, false);
			context.camera = camera;
			
			//var light = new BABYLON.Light("simplelight", scene);
			
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), context.scene);
			light.intensity = 0.7;
			light.groundColor = this.getColor(this.options.groundColor, [0.4, 0.4, 0.4]);
			light.specular = this.getColor(this.options.specular, [0.5, 0.5, 0.5]);
		}

		applyTexture(context: BabylonContext, material: BABYLON.StandardMaterial, texture) {
			if (texture.diffuseTexture) {
				material.diffuseTexture = new BABYLON.Texture(texture.diffuseTexture, context.scene);
				// (<any>material.diffuseTexture).alpha = 0.3;
				// material.diffuseTexture.hasAlpha = true;
				
				(<any>material.diffuseTexture).uScale = texture.textureScale || 1;
				(<any>material.diffuseTexture).vScale = texture.textureScale || 1;
			}
			
			if (texture.specularTexture) {
				material.specularTexture = new BABYLON.Texture(texture.specularTexture, context.scene);
				(<any>material.specularTexture).uScale = texture.textureScale || 1;
				(<any>material.specularTexture).vScale = texture.textureScale || 1;
			}

			if (texture.bumpTexture) {
				material.bumpTexture = new BABYLON.Texture(texture.bumpTexture, context.scene);
				(<any>material.bumpTexture).uScale = texture.textureScale || 1;
				(<any>material.bumpTexture).vScale = texture.textureScale || 1;
			}
		}

		sphereMaterial(context: BabylonContext, mesh : BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean) {
			material.ambientColor = new BABYLON.Color3(0, 0, 1);
			material.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
			material.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
						
			if (useEffects) {
				if (this.options.emisivefresnel) {
					material.emissiveFresnelParameters = this.options.emisivefresnel;
				}

				if (this.options.sphere) {
					this.applyTexture(context, material, this.options.sphere);
				}
			}
		}

		cylinderMaterial(context: BabylonContext, mesh : BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean) {
			material.ambientColor = new BABYLON.Color3(0, 0, 1);
			material.specularColor = new BABYLON.Color3(0.2,0.2,0.2);
			material.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
			
			if (useEffects) {
				if (this.options.emisivefresnel) {
					material.emissiveFresnelParameters = this.options.emisivefresnel;
				}

				if (this.options.cylinder) {
					this.applyTexture(context, material, this.options.cylinder);
				}
			}
		}
	}
}