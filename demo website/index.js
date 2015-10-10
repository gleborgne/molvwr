(function(){
	'use strict';
	var samples = [
		{ name : "Water", id:"water", url: "molsamples/pdb/water.txt", format: "pdb"},
		{ name : "Methane", id:"methane", url: "molsamples/xyz/methane.txt", format: "xyz"},
		{ name : "Benzene", id:"benzene", url: "molsamples/xyz/benzene.txt", format: "xyz"},
		{ name : "Caffeine", id:"caffeine", url: "molsamples/xyz/caffeine.txt", format: "xyz"},
		{ name : "Testosterone", id:"testosterone", url: "molsamples/xyz/testosterone.txt", format: "xyz"},
		{ name : "Aspirin", id:"aspirin", url: "molsamples/mol/aspirin.txt", format: "mol"},
		{ name : "Morphine", id:"morphine", url: "molsamples/mol/morphine.txt", format: "mol"},
		{ name : "Creatin", id:"creatin", url: "molsamples/mol/creatin.txt", format: "mol"},
		{ name : "Linoleic acid (aka Omega 3)", id:"linoleicacid", url : "molsamples/xyz/linoleic acid.txt", format : "xyz" },
		{ name : "Glucose", id:"glucose", url : "molsamples/mol/glucose.txt", format : "mol" },
		{ name : "Cellulose", id:"cellulose", url: "molsamples/pdb/cellulose.txt", format: "pdb"},
		{ name : "Pennicilin", id:"pennicilin", url : "molsamples/mol/pennicilin.txt", format : "mol" },
		{ name : "Carbon (graphite)", id:"carbongraphite", url: "molsamples/xyz/graphite.txt", format: "xyz"},
		{ name : "Carbon (diamond)", id:"carbondiamond", url: "molsamples/xyz/diamond.txt", format: "xyz"},
		{ name : "Carbon Fullerene", id:"fullerene", url: "molsamples/xyz/fullerene.txt", format: "xyz"},
		{ name : "Carbon Graphene", id:"graphene", url: "molsamples/xyz/graphene.txt", format: "xyz"},
		{ name : "Carbon nano tube", id:"nanotube", url: "molsamples/mol/btube.txt", format: "mol"},
		{ name : "4E0O", id:"4E0O", url: "molsamples/xyz/4E0O.txt", format: "xyz"},
		{ name : "4QCI", id:"4QCI", url: "molsamples/xyz/4QCI.txt", format: "xyz"},
		{ name : "Gold structure", id:"gold", url: "molsamples/xyz/Au.txt", format: "xyz"},
		{ name : "Gold thiol complex", id:"goldthiol", url: "molsamples/xyz/au_thiol.txt", format: "xyz"},
		{ name : "DNA fragment", id:"dna", url: "molsamples/xyz/dna.txt", format: "xyz"},		
	];

	var viewmodes = [
		{ name : 'spheres', id:"spheres", cfg : Molvwr.Config.spheres},
		{ name : 'balls and sticks', id:"ballsandsticks", cfg : Molvwr.Config.ballsAndSticks},
	];

	function hideAllPanels(){
		var panels = document.querySelectorAll(".panel");
		for (var i=0, l=panels.length; i<l; i++){
			panels[i].classList.remove("visible");
		}
	}

	function ChoicePanel(element, titleElement, viewer, items, onselected){
		var ctrl = this;
		this.viewer = viewer;
		this.titleElement = titleElement;
		this.element = element;
		this.onselected = onselected;
		this.items = items;

		this.itemsElt = document.createElement("DIV");
		this.itemsElt.className = "items"
		this.element.appendChild(this.itemsElt);

		this.titleElement.onclick = function(){
			hideAllPanels();
			ctrl.element.classList.toggle("visible");
			if (ctrl.element.classList.contains("visible")){
				overlay.classList.add("visible");
			}else{
				overlay.classList.remove("visible");
			}
		}

		this.items.forEach(function(item){
			var sampleitem = document.createElement("DIV");
			sampleitem.className = "choice-item";
			sampleitem.innerHTML = item.name;
			ctrl.itemsElt.appendChild(sampleitem);
				sampleitem.onclick = function(){
					ctrl.setSelected(item.id);
					ctrl.hide();
				}
			
		})
	}

	ChoicePanel.prototype.getItemById = function(itemid){
		var item = this.items.filter(function(mol){
			if (mol.id == itemid){
				return true;
			}
		})[0];

		return item;
	}

	ChoicePanel.prototype.setSelected = function(itemid){
		var ctrl = this;
		var item = this.getItemById(itemid);
		if (item){
			ctrl.titleElement.innerText = item.name;
			if (ctrl.onselected){
				ctrl.onselected(ctrl, item)
			}
		}
	}

	ChoicePanel.prototype.hide = function(){
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
	var viewer = new Molvwr.Viewer(root);

	var viewpanelctrl = new ChoicePanel(viewmodepanel, viewmodetitle, viewer, viewmodes, function(ctrl, item){
		ctrl.viewer.setOptions(item.cfg());
	});
	viewpanelctrl.setSelected("ballsandsticks");
		
	var samplespanelctrl = new ChoicePanel(samplespanel, titleelement, viewer, samples, function(ctrl, item){
		ctrl.viewer.loadContentFromUrl(item.url, item.format);
		window.location.hash = item.id;
	});

	var currentmolecule = "morphine";
	if (window.location.hash){
		var item = samplespanelctrl.getItemById(window.location.hash.substr(1));
		if (item){
			currentmolecule = item.id;
		}
	}

	samplespanelctrl.setSelected(currentmolecule);

	function hideAbout(){
		overlay.classList.remove("visible");
		aboutpanel.classList.remove("visible");
	}
	aboutlink.onclick = function(){
		hideAllPanels();
		overlay.classList.add("visible");
		aboutpanel.classList.add("visible");
	}

	overlay.onclick = function(){
		hideAllPanels();
	}
})();