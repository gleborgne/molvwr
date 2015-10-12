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
			// var knot00 = BABYLON.Mesh.CreateTorusKnot("knot0", 0.5, 0.2, 128, 64, 2, 3, scene);
			// var knot01 = BABYLON.Mesh.CreateTorusKnot("knot1", 0.5, 0.2, 32, 16, 2, 3, scene);
			// var knot02 = BABYLON.Mesh.CreateTorusKnot("knot2", 0.5, 0.2, 24, 12, 2, 3, scene);
			// var knot03 = BABYLON.Mesh.CreateTorusKnot("knot3", 0.5, 0.2, 16, 8, 2, 3, scene);
			// 
			// knot00.addLODLevel(15, knot01);
			// knot00.addLODLevel(30, knot02);
			// knot00.addLODLevel(45, knot03);
			// knot00.addLODLevel(55, null);
			
			var sphere = BABYLON.Mesh.CreateSphere("spheretemplate", this.config.sphereSegments, atomkind.radius * this.config.atomScaleFactor, this.ctx.scene);
			sphere.setEnabled(false);
			(<any>sphere).pickable = false;
			
			var atomMat = new BABYLON.StandardMaterial('materialFor' + atomkind.symbol, this.ctx.scene);
			atomMat.diffuseColor = new BABYLON.Color3(atomkind.color[0], atomkind.color[1], atomkind.color[2]);
			atomMat.specularColor = new BABYLON.Color3(0.1,0.1,0.1);
			atomMat.emissiveColor = new BABYLON.Color3(0.2,0.2,0.2);
			
			sphere.material = this.ctx.getMaterial(atomMat);
			
			
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