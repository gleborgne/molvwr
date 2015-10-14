module Molvwr.Renderer {
	export class BondsCylinder {
		ctx: Molvwr.BabylonContext;
		config: Molvwr.Config.IMolvwrConfig;
		viewer: Molvwr.Viewer;
		meshes: any = {};

		constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig) {
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}

		render(molecule, completedCallback) {
			var cfg = this.config;
			var meshes = [];
			var diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor;
			var nbbonds = molecule.bonds.length;
			console.log("rendering " + nbbonds + " bonds as cylinder");
			this.prepareBonds(molecule, diameter);
			this.runBatch(0, 50, molecule, diameter, completedCallback); 
		}
		
		prepareBonds(molecule, diameter){
			for (var n in molecule.bondkinds){				
				this.meshes[n] = this.createMesh(molecule.bondkinds[n], diameter);
			}			
		}
		
		createMesh(binding, diameter){
			console.log("create bind mesh " + binding.key);
			if (this.config.cylinderLOD){
				console.log("cylinder LOD " + this.config.cylinderLOD.length)
				var rootConf = this.config.cylinderLOD[0];
				var rootMesh = this.createCylinder(binding, diameter, rootConf.segments, rootConf.texture, rootConf.color);
				for (var i=1, l=this.config.cylinderLOD.length; i<l ; i++){
					var conf = this.config.cylinderLOD[i];
					if (conf.segments){
						var childCylinder = this.createCylinder(binding, diameter, conf.segments, conf.texture, conf.color);
						rootMesh.addLODLevel(conf.depth, childCylinder);
					} else{
						rootMesh.addLODLevel(conf.depth, null);
					}
				}
				return rootMesh;
			}else{
				return this.createCylinder(binding, diameter, this.config.cylinderSegments, true, null);
			}	
			
		}
		
		createCylinder(binding, diameter, segments, texture, coloroverride){			
			//console.log("render cyl " + segments);
			var cylinder = BABYLON.Mesh.CreateCylinder("bondtemplate" + binding.key, binding.d, diameter, diameter, segments, 1, this.ctx.scene, false);
        	var atomMat = new BABYLON.StandardMaterial('materialFor' + binding.key, this.ctx.scene);
			atomMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			atomMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			atomMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
			
			atomMat.emissiveFresnelParameters = new BABYLON.FresnelParameters();
			atomMat.emissiveFresnelParameters.bias = 0.6;
			atomMat.emissiveFresnelParameters.power = 1;
			atomMat.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
			atomMat.emissiveFresnelParameters.rightColor = BABYLON.Color3.White();
		
			//atomMat.bumpTexture = new BABYLON.Texture('textures/bump.png', this.ctx.scene);
			//(<any>atomMat.bumpTexture).uScale = 6;
			//(<any>atomMat.bumpTexture).vScale = 6;
			//atomMat.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
			//atomMat.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;
			cylinder.material = atomMat;
			cylinder.isPickable = false;
			cylinder.setEnabled(false);
			
			return cylinder;
		}
		
		runBatch(offset, size, molecule, diameter, completedCallback){
			setTimeout(()=>{
				console.log("batch rendering bonds " + offset + "/" + molecule.bonds.length);
				var items = molecule.bonds.slice(offset, offset + size);
				
				items.forEach((b, index) => {
					var key = b.atomA.kind.symbol + "#" + b.atomB.kind.symbol;
					var mesh = this.meshes[key];
					var cylinder = mesh.createInstance("bond" + index);
					this.alignCylinderToBinding(b, cylinder);
				});
				
				if (items.length < size){
					console.log("batch end " + items.length);
					if (completedCallback) completedCallback();
				}else{
					this.runBatch(offset+size, size, molecule, diameter, completedCallback);
				}
			},10);
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
			v1.normalize();
			var v2 = new BABYLON.Vector3(0, 1, 0);
            
            // Using cross we will have a vector perpendicular to both vectors
            var axis = BABYLON.Vector3.Cross(v2, v1);
            axis.normalize();
			
            // Angle between vectors
            var angle = BABYLON.Vector3.Dot(v1, v2);
			angle = Math.acos(angle);
            
            // Then using axis rotation the result is obvious
            cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);

			if (this.vectorEqualsCloseEnough(v1, v2.negate())) {
				cylinder.position = pointA;
			}

            return cylinder;
		}

		vectorEqualsCloseEnough(v1, v2, tolerance: number = 0.00002) {
			if (typeof (v2) !== 'object') { throw ("v2 is supposed to be an object"); }
			if (typeof (v1) !== 'object') { throw ("v1 is supposed to be an object"); }

			if (v1.x < v2.x - tolerance || v1.x > v2.x + tolerance) {
				return false;
			}
			if (v1.y < v2.y - tolerance || v1.y > v2.y + tolerance) {
				return false;
			}
			if (v1.z < v2.z - tolerance || v1.z > v2.z + tolerance) {
				return false;
			}

			return true;
		}
	}
}