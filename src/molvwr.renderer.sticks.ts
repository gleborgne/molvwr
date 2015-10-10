module Molvwr.Renderer {
	export class Sticks {	
		ctx: Molvwr.BabylonContext;
		config : Molvwr.Config.IMolvwrConfig;
		viewer : Molvwr.Viewer;
		meshes : any = {};
		
		constructor(viewer : Molvwr.Viewer, ctx: Molvwr.BabylonContext, config:Molvwr.Config.IMolvwrConfig){
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}	
		
		render(molecule){
			var cfg= this.config;
			var meshes = [];
			console.log("rendering bonds as lines");
			var diameter = Molvwr.Elements.MIN_ATOM_RADIUS*0.6*this.config.atomScaleFactor;
			
			molecule.bonds.forEach((b, index) => {
				var cylinder = this.getCylinderForBinding(diameter, b, index); 
				this.alignCylinderToBinding(b, cylinder);
				// this.createCylinderBetweenPoints(
				// 	new BABYLON.Vector3(b.atomA.x, b.atomA.y, b.atomA.z),
				// 	new BABYLON.Vector3(b.atomB.x, b.atomB.y, b.atomB.z),
				// 	"bond"+index,
				// 	Molvwr.Elements.MIN_ATOM_RADIUS*0.8*this.config.atomScaleFactor)
			});			
		}	
		
		getCylinderForBinding(diameter, binding, index){
			var key = binding.atomA.kind.symbol + "#" + binding.atomB.kind.symbol;
			if (this.meshes[key])
				return this.meshes[key].createInstance("bond"+index);
			
			
			var cylinder = BABYLON.Mesh.CreateCylinder("bond"+index, binding.d, diameter, diameter, this.config.sphereSegments, 1, this.ctx.scene, false);
            this.meshes[key] = cylinder;
			
			var atomMat = new BABYLON.StandardMaterial('materialFor' + key, this.ctx.scene);
				atomMat.diffuseColor = new BABYLON.Color3(0.3,0.3,0.3);
				atomMat.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
				atomMat.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
				atomMat.bumpTexture   = new BABYLON.Texture('bump.png', this.ctx.scene);
				(<any>atomMat.bumpTexture).uScale = 6;
				(<any>atomMat.bumpTexture).vScale = 6;
				atomMat.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
				atomMat.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;
			cylinder.material = atomMat;
			
			return cylinder;
		}
		
		alignCylinderToBinding(b, cylinder) {
			var pointA = new BABYLON.Vector3(b.atomA.x, b.atomA.y, b.atomA.z);
			var pointB = new BABYLON.Vector3(b.atomB.x, b.atomB.y, b.atomB.z);
            
            // First of all we have to set the pivot not in the center of the cylinder:
            cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -b.d / 2, 0));
         
            // Then move the cylinder to red sphere
            cylinder.position = pointB;
        
            // Then find the vector between spheres
            var v1 = pointB.subtract(pointA);
        	console.log(v1);
            v1.normalize();
        	console.log(v1);
            var v2 = new BABYLON.Vector3(0, 1, 0);
            
            // Using cross we will have a vector perpendicular to both vectors
            var axis = BABYLON.Vector3.Cross(v2, v1);
            axis.normalize();
            console.log(axis);
            
            // Angle between vectors
            var angle = BABYLON.Vector3.Dot(v1, v2);
        	
        	angle = Math.acos(angle);
            console.log(angle);
            
            // Then using axis rotation the result is obvious
            cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
        
            return cylinder;
		}	
	}
}