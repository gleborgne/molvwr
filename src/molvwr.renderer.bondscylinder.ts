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

		render(molecule) {
			var cfg = this.config;
			var meshes = [];
			console.log("rendering bonds as lines");
			var diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor;

			molecule.bonds.forEach((b, index) => {
				var cylinder = this.getCylinderForBinding(diameter, b, index);
				cylinder.pickable = false;
				this.alignCylinderToBinding(b, cylinder);
			});
		}

		getCylinderForBinding(diameter, binding, index) {
			var key = binding.atomA.kind.symbol + "#" + binding.atomB.kind.symbol;
			if (this.meshes[key])
				return this.meshes[key].createInstance("bond" + index);

			var cylinder = BABYLON.Mesh.CreateCylinder("bond" + index, binding.d, diameter, diameter, this.config.sphereSegments, 1, this.ctx.scene, false);
            this.meshes[key] = cylinder;

			var atomMat = new BABYLON.StandardMaterial('materialFor' + key, this.ctx.scene);
			atomMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
			atomMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
			atomMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
			atomMat.bumpTexture = new BABYLON.Texture('bump.png', this.ctx.scene);
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