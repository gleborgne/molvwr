var MolvwrSamples = MolvwrSamples || {};

(function(){
	'use strict';

	function hideAllPanels(){
		var panels = document.querySelectorAll(".panel");
		for (var i=0, l=panels.length; i<l; i++){
			var panel = panels[i];
			if (panel.molvwrControl){
				panel.molvwrControl.hide();
			}else{
				panels[i].classList.remove("visible");
			}
		}
		overlay.classList.remove("visible");
		document.body.classList.remove("haspanel");
	}

	function showPanel(panelElt){
		if (panelElt.classList.contains("visible")){
			hideAllPanels();		
		}else{
			hideAllPanels();
			document.body.classList.add("haspanel");
			panelElt.classList.add("visible");
			overlay.classList.add("visible");
		}
	}

	function ChoicePanel(element, titleElement, viewer, items, onselected){
		var ctrl = this;
		this.viewer = viewer;
		this.titleElement = titleElement;
		this.element = element;
		this.element.molvwrControl = this;
		this.onselected = onselected;
		this.items = items;

		this.contentPanel = document.createElement("DIV");
		this.contentPanel.className = "panel-content";
		this.element.appendChild(this.contentPanel);

		this.titleElement.onclick = function(){
			showPanel(ctrl.element);
		}

		ctrl.openDetail(this.items);
	}

	ChoicePanel.prototype.renderItems = function(items, parent){
		var ctrl = this;
		

		items.forEach(function(item){
			var sampleitem = document.createElement("DIV");
			sampleitem.className = "choice-item noselect";
			sampleitem.innerHTML = '<span class="title">' + item.name + '</span>';
			sampleitem.setAttribute("unselectable", "on");
			parent.appendChild(sampleitem);

			if (item.childs){
				if (item.inline){
					sampleitem.classList.add("inline-container");
					var container = document.createElement("DIV");
					container.className = "child-items";
					sampleitem.appendChild(container);
					ctrl.renderItems(item.childs, container);
				}else{
					sampleitem.classList.add("container");
					sampleitem.onclick = function(){
						ctrl.openDetail(item.childs, item.name);
					}
				}
			}else{
				sampleitem.onclick = function(){
					ctrl.setSelected(item.id);
					hideAllPanels();
				}	
			}		
		});
	}

	ChoicePanel.prototype.openDetail = function(items, title){
		var ctrl = this;
		var hasPanels = ctrl.contentPanel.children.length > 0;
		if (hasPanels){
			ctrl.contentPanel.children[ctrl.contentPanel.children.length-1].classList.add("away");
		}

		var itemspanel = document.createElement("DIV");
		itemspanel.className = "paneldetail";
		ctrl.contentPanel.appendChild(itemspanel);		
		
		if (hasPanels){
			var panelHeader = document.createElement("DIV");
			panelHeader.className = "panelheader";
			itemspanel.appendChild(panelHeader);
			
			var panelHeaderContent = document.createElement("DIV");
			panelHeaderContent.className = "panelheadercontent";
			panelHeader.appendChild(panelHeaderContent);


			itemspanel.classList.add("hasClose");

			var titleElt = document.createElement("DIV");
			titleElt.className = "title";
			titleElt.innerHTML = title;
			panelHeaderContent.appendChild(titleElt);

			var btnClose = document.createElement("DIV");
			btnClose.className = "btnclose";
			btnClose.innerHTML = '<i class="oi-chevron-left"></i> back';
			panelHeaderContent.appendChild(btnClose);

			btnClose.onclick = function(){
				itemspanel.classList.remove("visible");
				ctrl.contentPanel.children[ctrl.contentPanel.children.length-2].classList.remove("away");

				setTimeout(function(){
					ctrl.contentPanel.removeChild(itemspanel);				
				}, 150);
			}
		}

		var itemsElt = document.createElement("DIV");
		itemsElt.className = "items"
		itemspanel.appendChild(itemsElt);


		ctrl.renderItems(items, itemsElt);
		setTimeout(function(){
			itemspanel.classList.add("visible");
		},0);
	}

	ChoicePanel.prototype._getItemById = function(items, itemid){
		for (var i=0, l=items.length ; i<l ; i++){
			if (items[i].id == itemid){
				return items[i];
			} else if (items[i].childs) {
				var res = this._getItemById(items[i].childs, itemid);
				if  (res)
					return res;
			}
		}
	}

	ChoicePanel.prototype.getItemById = function(itemid){
		return this._getItemById(this.items, itemid);
	}

	ChoicePanel.prototype.setSelected = function(itemid){
		var ctrl = this;
		var item = this.getItemById(itemid);
		if (item){
			if (!ctrl.dontSetTitleText) ctrl.titleElement.innerHTML = item.name;
			if (ctrl.onselected){
				ctrl.onselected(ctrl, item)
			}
		}
	}

	ChoicePanel.prototype.hide = function(){
		var ctrl = this;
		this.element.classList.remove("visible");
		overlay.classList.remove("visible");
	}


	var samplespanel = document.getElementById("molecule-choice-panel");
	var aboutpanel = document.getElementById("about-panel");
	var aboutlink = document.getElementById("about");
	var titleelement = document.getElementById("moleculetitle");
	var viewmodetitle = document.getElementById("viewmodetitle");
	var viewmodepanel = document.getElementById("viewmode-choice-panel");
	var overlay = document.getElementById("overlay");
	var root = document.getElementById("molvwr-container");
	var moleculeinfo = document.getElementById("moleculeinfo");
	var formula = document.getElementById("formula");
	var descriptionpanel = document.getElementById("description-panel");
	var atomslegend = document.getElementById("atomslegend");
	var moleculedesc = document.getElementById("moleculedesc");
	var loadingstate = document.getElementById("loadingstate");
	var savepic = document.getElementById("savepic");
	var screencapturepanel = document.getElementById("screencapture-panel");
	var screencaptureImg = document.getElementById("screencapture");

	function renderAtomLegend(atomkind, parentFormulaElt, parentElt){
		var node = document.createElement("span");
		node.className= "atomformula";
		node.innerHTML = '<span class="atomsymbol">' + atomkind.kind.symbol + '</span><span class="atomcount">' + (atomkind.count > 1 ? atomkind.count : "") + '</span>';
		parentFormulaElt.appendChild(node);

		var node = document.createElement("DIV");
		node.className= "atomlegend";
		node.innerHTML = '<div class="dot atom-' + atomkind.kind.symbol + '" style="background-color:rgb(' + ((255*atomkind.kind.color[0])>>0) + ',' + ((255*atomkind.kind.color[1])>>0) + ',' + ((255*atomkind.kind.color[2])>>0) + ')">' + atomkind.kind.symbol + '</div><div class="name">' + atomkind.kind.name + '</div>';
		parentElt.appendChild(node);
	}

	function renderSelectedMoleculeInfo(item, molecule){
		atomslegend.innerHTML = "";
		moleculedesc.innerHTML = "";
		formula.innerHTML = "";

		var kinds = [];
		//console.log("render molecule info", molecule);
		for (var n in molecule.kinds){
			kinds.push(molecule.kinds[n]);			
		}

		kinds.sort(function(a,b){
			return a.kind.symbol.localeCompare(b.kind.symbol);
		});

		kinds.forEach(function(k){
			renderAtomLegend(k, formula, atomslegend);
		})
	}

	var viewer = new Molvwr.Viewer(root);
	Molvwr.ViewModes.sphereBumpTexture = 'textures/174_norm.jpg';
	Molvwr.ViewModes.sphereSpecularTexture = 'textures/174.jpg';
	Molvwr.ViewModes.sphereTextureScale = 6;

	var viewpanelctrl = new ChoicePanel(viewmodepanel, viewmodetitle, viewer, MolvwrSamples.viewmodes, function(ctrl, item){
		loadingstate.classList.add("visible");
		if (item.type == "viewtype"){
			ctrl.viewer.setOptions(item.cfg(), function(){
				loadingstate.classList.remove("visible");
			});
		}else if(item.type == "rendering"){
			ctrl.viewer.setViewMode(item.cfg(), function(){
				loadingstate.classList.remove("visible");
			});			
		}
	});
	viewpanelctrl.dontSetTitleText = true;
	viewpanelctrl.setSelected("ballsandsticks");
		
	var samplespanelctrl = new ChoicePanel(samplespanel, titleelement, viewer, MolvwrSamples.molecules, function(ctrl, item){
		loadingstate.classList.add("visible");
		moleculeinfo.classList.remove("visible");
		ctrl.viewer.loadContentFromUrl(item.url, item.format, function(molecule){
			moleculeinfo.classList.add("visible");
			renderSelectedMoleculeInfo(item, molecule);			
		}, function(molecule){
			loadingstate.classList.remove("visible");			
		});		
		window.location.hash = item.id;
		//moleculeinfo.classList.add("visible");
	});

	var currentmolecule = "cyanocobalamin";
	if (window.location.hash){
		var item = samplespanelctrl.getItemById(window.location.hash.substr(1));
		if (item){
			currentmolecule = item.id;
		}
	}

	samplespanelctrl.setSelected(currentmolecule);

	function hideAbout(){
		hideAllPanels();
	}

	aboutlink.onclick = function(){
		showPanel(aboutpanel);
	}

	moleculeinfo.onclick = function(){
		showPanel(descriptionpanel);
	}

	overlay.onclick = function(){
		hideAllPanels();
	}

	savepic.onclick = function(){
		var pic = viewer.exportScreenshot();
		screencaptureImg.src = pic;
		showPanel(screencapturepanel);
	}
})();