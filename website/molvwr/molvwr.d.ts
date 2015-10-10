declare module Molvwr {
    class BabylonContext {
        engine: BABYLON.Engine;
        scene: BABYLON.Scene;
        camera: BABYLON.Camera;
        canvas: HTMLCanvasElement;
        atomsMaterials: any;
        constructor(canvas: any);
        dispose(): void;
        getMaterial(atomsymbol: string): any;
        createScene(): void;
        useAmbientOcclusion(): void;
        useHDR(): void;
        testScene(): void;
    }
}

declare module Molvwr.Config {
    interface IMolvwrConfig {
        renderers: string[];
        atomScaleFactor: number;
        cylinderScale: number;
        sphereSegments: number;
    }
    function defaultConfig(): IMolvwrConfig;
    function spheres(): IMolvwrConfig;
    function ballsAndSticks(): IMolvwrConfig;
}

declare module Molvwr {
    class Viewer {
        element: HTMLElement;
        canvas: HTMLCanvasElement;
        config: Molvwr.Config.IMolvwrConfig;
        context: BabylonContext;
        molecule: any;
        constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig);
        private _loadContentFromString(content, contentFormat);
        renderMolecule(molecule: any): void;
        setOptions(options: any): void;
        createContext(): void;
        loadContentFromString(content: string, contentFormat: string): void;
        loadContentFromUrl(url: string, contentFormat: string): void;
        private _postProcessMolecule(molecule);
        private _calculateAtomsBonds(molecule);
        private _getCentroid(s);
        private _center(molecule);
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
    var MIN_ATOM_RADIUS: number;
    var MAX_ATOM_RADIUS: number;
}

declare module Molvwr.Parser {
    var mol: {
        parse: (content: string) => {
            atoms: any[];
            title: any;
        };
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
    class BondsCylinder {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any): void;
        getCylinderForBinding(diameter: any, binding: any, index: any): any;
        alignCylinderToBinding(b: any, cylinder: any): any;
        vectorEqualsCloseEnough(v1: any, v2: any, tolerance?: number): boolean;
    }
}

declare module Molvwr.Renderer {
    class BondsLines {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any): void;
    }
}

declare module Molvwr.Renderer {
    class Sphere {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any): void;
        renderAtom(atom: any, index: any): any;
    }
}

declare module Molvwr.Renderer {
    class Sticks {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any): void;
        getCylinderForBinding(diameter: any, binding: any, index: any): any;
        alignCylinderToBinding(b: any, cylinder: any): any;
    }
}
