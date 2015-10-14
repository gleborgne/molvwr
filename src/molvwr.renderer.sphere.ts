module Molvwr.Renderer {
	export class Sphere {	
		ctx: Molvwr.BabylonContext;
		config : Molvwr.Config.IMolvwrConfig;
		viewer : Molvwr.Viewer;
		meshes : any = {};
		
		constructor(viewer : Molvwr.Viewer, ctx: Molvwr.BabylonContext, config:Molvwr.Config.IMolvwrConfig){
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}	
		
		render(molecule, completedCallback){
			this.prepareMeshes(molecule);
			console.log("sphere rendering");
			this.runBatch(0,100,molecule, completedCallback);
		}
		
		prepareMeshes(molecule){
			for (var n in molecule.kinds){				
				this.meshes[n] = this.createMesh(molecule.kinds[n].kind);
			}			
		}
		
		createMesh(atomkind){			
			if (this.config.sphereLOD){
				console.log("sphere " + atomkind.symbol + "use LOD " + this.config.sphereLOD.length);
				var rootConf = this.config.sphereLOD[0];
				var rootMesh = this.createSphere(atomkind, rootConf.segments, rootConf.texture, rootConf.color);
				for (var i=1, l=this.config.sphereLOD.length; i<l ; i++){
					var conf = this.config.sphereLOD[i];
					if (conf.segments){
						var childSphere = this.createSphere(atomkind, conf.segments, conf.texture, conf.color);
						rootMesh.addLODLevel(conf.depth, childSphere);
					} else{
						rootMesh.addLODLevel(conf.depth, null);
					}
				}
				return rootMesh;
			}else{
				return this.createSphere(atomkind, this.config.sphereSegments, true, null);
			}
			// var knot00 = BABYLON.Mesh.CreateTorusKnot("knot0", 0.5, 0.2, 128, 64, 2, 3, scene);
			// var knot01 = BABYLON.Mesh.CreateTorusKnot("knot1", 0.5, 0.2, 32, 16, 2, 3, scene);
			// var knot02 = BABYLON.Mesh.CreateTorusKnot("knot2", 0.5, 0.2, 24, 12, 2, 3, scene);
			// var knot03 = BABYLON.Mesh.CreateTorusKnot("knot3", 0.5, 0.2, 16, 8, 2, 3, scene);
			// 
			// knot00.addLODLevel(15, knot01);
			// knot00.addLODLevel(30, knot02);
			// knot00.addLODLevel(45, knot03);
			// knot00.addLODLevel(55, null);
		}
		
		createSphere(atomkind, segments, useTexture, overridecolor){
			var sphere = BABYLON.Mesh.CreateSphere("spheretemplate", segments, atomkind.radius * this.config.atomScaleFactor, this.ctx.scene);
			sphere.setEnabled(false);
			sphere.isPickable = false;
			
			var atomMat = new BABYLON.StandardMaterial('materialFor' + atomkind.symbol, this.ctx.scene);
			var color = overridecolor || atomkind.color;
			atomMat.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2]);
			atomMat.ambientColor = new BABYLON.Color3(0, 0, 1);
			atomMat.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
			atomMat.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
			
			if (useTexture){
				this.ctx.getMaterial(atomMat);
			}
			sphere.material = atomMat;
			
			return sphere;
		}
		
		runBatch(offset, size, molecule, completedCallback){
			setTimeout(()=>{
//				console.log("batch rendering bonds " + offset + "/" + molecule.bonds.length);
				var items = molecule.atoms.slice(offset, offset + size);
								
				items.forEach((atom, index) => {
					this.renderAtom(atom, index);
				});
				
				if (items.length < size){
//					console.log("batch end " + items.length);
					if (completedCallback) completedCallback();
				}else{
					this.runBatch(offset+size, size, molecule, completedCallback);
				}
			},10);
		}
		
		renderAtom(atom, index){
			var cfg= this.config;
			var mesh = this.meshes[atom.kind.symbol];
			if (!mesh){
				console.warn("no mesh for " + atom.kind.symbol);
			}
			var sphere = mesh.createInstance("sphere" + index);
			
			// sphere = BABYLON.Mesh.CreateSphere("sphere" + index, cfg.sphereSegments, atomKind.radius * cfg.scale * cfg.atomScaleFactor, this.ctx.scene);
			// sphere.material = this.ctx.getMaterial(atom.symbol);
			sphere.pickable = false;
			sphere.position.x = atom.x;
			sphere.position.y = atom.y;
			sphere.position.z = atom.z;
			
			return sphere;
		}
	}
}