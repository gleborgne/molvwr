module Molvwr {	
	export class Viewer {
		element: HTMLElement;
		canvas: HTMLCanvasElement;

		config: IMolvwrConfig;
		context: BabylonContext;

		constructor(element: HTMLElement, config?: IMolvwrConfig) {
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.defaultConfig;
			this.element = element;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);
			this.context.createScene();			
		}

		loadContentFromString(content: string, contentFormat: string) {
			var parser = Molvwr.Parser[contentFormat];
			if (parser) {
				var molecule = parser.parse(content);
				if (molecule) {
					var rendererClass = Molvwr.Renderer[this.config.renderer];
					if (rendererClass) {
						var renderer = new rendererClass(this.context, this.config);
						renderer.render(molecule);
					} else {
						console.warn("no renderer for " + this.config.renderer);
					}
				} else {
					console.warn("no molecule from parser " + contentFormat);
				}
			} else {
				console.warn("no parser for " + contentFormat);
			}
		}

		loadContentFromUrl(url: string, contentFormat: string) {
			try {           
                var xhr = new XMLHttpRequest(); 
                xhr.onreadystatechange = () => { 
                    if(xhr.readyState == 4)
                    {
                        if(xhr.status == 200)
                        { 
                            this.loadContentFromString(xhr.responseText, contentFormat);
                        } 
                        else  {
							console.warn("cannot get content from " + url + " " + xhr.status + " " + xhr.statusText);
                        } 
                    } 
                };
                
                xhr.open("GET", url, true);                
                xhr.send(null); 
            } catch(e) {
                console.error(e);                 
            }
		}
	}
}