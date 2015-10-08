declare module Molvwr {
    class BabylonContext {
        engine: BABYLON.Engine;
        scene: BABYLON.Scene;
        camera: BABYLON.Camera;
        canvas: HTMLCanvasElement;
        atomsMaterials: any;
        constructor(canvas: any);
        getMaterial(atomsymbol: string): any;
        createScene(): void;
        useAmbientOcclusion(): void;
        useHDR(): void;
        testScene(): void;
    }
}

declare module Molvwr {
    interface IMolvwrConfig {
        renderer: string;
        scale: number;
        atomScaleFactor: number;
        sphereSegments: number;
    }
    var defaultConfig: IMolvwrConfig;
}

declare module Molvwr {
    class Viewer {
        element: HTMLElement;
        canvas: HTMLCanvasElement;
        config: IMolvwrConfig;
        context: BabylonContext;
        constructor(element: HTMLElement, config?: IMolvwrConfig);
        loadContentFromString(content: string, contentFormat: string): void;
        loadContentFromUrl(url: string, contentFormat: string): void;
    }
}

declare module Molvwr.Elements {
    interface PeriodicElement {
        symbol: string;
        name: string;
        mass: number;
        radius: number;
        color: number[];
        number: number;
    }
    var elements: PeriodicElement[];
    var elementsBySymbol: {};
    var elementsByNumber: {};
}

declare module Molvwr.Parser {
    var mol: {
        parse: (content: string) => void;
    };
}

declare module Molvwr.Parser {
    var xyz: {
        parse: (content: string) => {
            atoms: any[];
            title: any;
        };
    };
}

declare module Molvwr.Renderer {
    class Sphere {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.IMolvwrConfig);
        render(molecule: any): void;
        renderAtom(atom: any, index: any): any;
    }
}
