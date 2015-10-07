module Molvwr.Renderer {
	export class Sphere {	
		ctx: Molvwr.BabylonContext;
		config:Molvwr.IMolvwrConfig;
		
		constructor(ctx: Molvwr.BabylonContext, config:Molvwr.IMolvwrConfig){
			this.ctx = ctx;
			this.config = config;
		}	
		
		render(molecule){
			console.log("sphere rendering");
			if (molecule && molecule.atoms){
				molecule.atoms.forEach((atom, index) => {
					this.renderAtom(atom, index);
				});
			}
		}
		
		renderAtom(atom, index){
			var cfg= this.config;
			var atomKind = Molvwr.Elements.elementsBySymbol[atom.symbol];
			var sphere = BABYLON.Mesh.CreateSphere("sphere" + index, cfg.sphereSegments, atomKind.radius * cfg.scale * cfg.atomScaleFactor, this.ctx.scene);
			sphere.position.x = atom.x * cfg.scale;
			sphere.position.y = atom.y * cfg.scale;
			sphere.position.z = atom.z * cfg.scale;
			sphere.material = this.ctx.getMaterial(atom.symbol);
		}
	}
}