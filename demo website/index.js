(function(){
	'use strict';
	var samples = [
		{ name : "daylife", id:"daylife", childs: [
			{ name : "Water", id:"water", url: "molsamples/pdb/water.txt", format: "pdb"},
			{ name : "Aspirin", id:"aspirin", url: "molsamples/mol/aspirin.txt", format: "mol"},
			{ name : "Cellulose", id:"cellulose", url: "molsamples/pdb/cellulose.txt", format: "pdb"},
		]},
		{ name : "food", id:"food", childs: [
			{ name : "misc.", id:"food-misc", childs: [
				{ name : "Caffeine", id:"caffeine", url: "molsamples/xyz/caffeine.txt", format: "xyz"},
			]},
			{ name : "lipids", id:"food-lipids", childs: [
				{ name : "Linoleic acid (aka Omega 3)", id:"linoleicacid", url : "molsamples/xyz/linoleic acid.txt", format : "xyz" },
				{ name : "Arachidonic", id:"arachidonic", url: "molsamples/pdb/lipids/arachidonic.txt", format: "pdb"},
				{ name : "Dlpe", id:"dlpe", url: "molsamples/pdb/lipids/dlpe.txt", format: "pdb"},
				{ name : "Dmpg", id:"dmpg", url: "molsamples/pdb/lipids/dmpg.txt", format: "pdb"},
				{ name : "Dppc", id:"dppc", url: "molsamples/pdb/lipids/dppc.txt", format: "pdb"},
				{ name : "Linoleic", id:"linoleic", url: "molsamples/pdb/lipids/linoleic.txt", format: "pdb"},
				{ name : "Oleic", id:"oleic", url: "molsamples/pdb/lipids/oleic.txt", format: "pdb"},
				{ name : "Palmitic", id:"palmitic", url: "molsamples/pdb/lipids/palmitic.txt", format: "pdb"},
				{ name : "Pdmpg", id:"pdmpg", url: "molsamples/pdb/lipids/pdmpg.txt", format: "pdb"},
				{ name : "Stearic", id:"stearic", url: "molsamples/pdb/lipids/stearic.txt", format: "pdb"},
			]},
			{ name : "sugars", id:"food-sugars", childs: [
				{ name : "Glucose", id:"glucose", url : "molsamples/mol/glucose.txt", format : "mol" },
				{ name : "Cellulose", id:"cellulose", url: "molsamples/pdb/cellulose.txt", format: "pdb"},
			]},
		]},
		{ name : "drugs", id:"drugs", childs: [
			{ name : "Pennicilin", id:"pennicilin", url : "molsamples/mol/pennicilin.txt", format : "mol" },
			{ name : "Morphine", id:"morphine", url: "molsamples/mol/morphine.txt", format: "mol"},
			{ name : "AZT", id:"azt", url: "molsamples/pdb/drugs/azt.txt", format: "pdb"},
			{ name : "Barbiturate", id:"barbiturate", url: "molsamples/pdb/drugs/barbiturate.txt", format: "pdb"},
			{ name : "Caffeine", id:"caffeine", url: "molsamples/xyz/caffeine.txt", format: "xyz"},
			{ name : "Cisplantin", id:"cisplantin", url: "molsamples/pdb/drugs/cisplantin.txt", format: "pdb"},
			{ name : "Ibuprofen", id:"ibuprofen", url: "molsamples/pdb/drugs/ibuprofen.txt", format: "pdb"},
			{ name : "Nicotine", id:"nicotine", url: "molsamples/pdb/drugs/nicotine.txt", format: "pdb"},
			{ name : "Streptomycin", id:"streptomycin", url: "molsamples/pdb/drugs/streptomycin.txt", format: "pdb"},
			{ name : "Taxol", id:"taxol", url: "molsamples/pdb/drugs/taxol.txt", format: "pdb"},
			{ name : "THC", id:"thc", url: "molsamples/pdb/drugs/thc.txt", format: "pdb"},
			{ name : "Valium", id:"valium", url: "molsamples/pdb/drugs/valium.txt", format: "pdb"},
			{ name : "Zantac", id:"zantac", url: "molsamples/pdb/drugs/zantac.txt", format: "pdb"},
		]},
		{ name : "life building blocks", id:"life", childs: [
			{ name : "amino acids", id:"aminoacids", childs: [
				{ name : "Alanine", id:"alanine", url: "molsamples/pdb/aminoacids/alanine.txt", format: "pdb"},
				{ name : "Arginine", id:"arginine", url: "molsamples/pdb/aminoacids/arginine.txt", format: "pdb"},
				{ name : "Asparagine", id:"asparagine", url: "molsamples/pdb/aminoacids/asparagine.txt", format: "pdb"},
				{ name : "Aspartic acid", id:"asparticacid", url: "molsamples/pdb/aminoacids/aspartic_acid.txt", format: "pdb"},
				{ name : "Cysteine", id:"cysteine", url: "molsamples/pdb/aminoacids/cysteine.txt", format: "pdb"},
				{ name : "Glutamic acid", id:"glutamicacid", url: "molsamples/pdb/aminoacids/glutamic_acid.txt", format: "pdb"},
				{ name : "Glutamine", id:"glutamine", url: "molsamples/pdb/aminoacids/glutamine.txt", format: "pdb"},
				{ name : "Glycine", id:"glycine", url: "molsamples/pdb/aminoacids/glycine.txt", format: "pdb"},
				{ name : "Histidine", id:"histidine", url: "molsamples/pdb/aminoacids/histidine.txt", format: "pdb"},
				{ name : "Isoleucine", id:"isoleucine", url: "molsamples/pdb/aminoacids/isoleucine.txt", format: "pdb"},
				{ name : "Leucine", id:"leucine", url: "molsamples/pdb/aminoacids/leucine.txt", format: "pdb"},
				{ name : "Lysine", id:"lysine", url: "molsamples/pdb/aminoacids/lysine.txt", format: "pdb"},
				{ name : "Methionine", id:"methionine", url: "molsamples/pdb/aminoacids/methionine.txt", format: "pdb"},
				{ name : "Phenalalanine", id:"phenalalanine", url: "molsamples/pdb/aminoacids/phenalalanine.txt", format: "pdb"},
				{ name : "Proline", id:"proline", url: "molsamples/pdb/aminoacids/proline.txt", format: "pdb"},
				{ name : "Serine", id:"serine", url: "molsamples/pdb/aminoacids/serine.txt", format: "pdb"},
				{ name : "Threonine", id:"threonine", url: "molsamples/pdb/aminoacids/threonine.txt", format: "pdb"},
				{ name : "Tryptophan", id:"tryptophan", url: "molsamples/pdb/aminoacids/tryptophan.txt", format: "pdb"},
				{ name : "Tyrosine", id:"tyrosine", url: "molsamples/pdb/aminoacids/tyrosine.txt", format: "pdb"},
				{ name : "Valine", id:"valine", url: "molsamples/pdb/aminoacids/valine.txt", format: "pdb"},
			]},
			{ name : "proteins", id:"proteins", childs: [
				{ name : "4E0O", id:"4E0O", url: "molsamples/xyz/4E0O.txt", format: "xyz"},
				{ name : "4QCI", id:"4QCI", url: "molsamples/xyz/4QCI.txt", format: "xyz"},
			]},
			{ name : "photosyntetic", id:"photosyntetic", childs: [
				{ name : "Carotene", id:"carotene", url: "molsamples/pdb/photosynthetic/carotene.txt", format: "pdb"},
				{ name : "Chlorophyll", id:"chlorophyll", url: "molsamples/pdb/photosynthetic/chlorophyll.txt", format: "pdb"},
				{ name : "Cytochrome", id:"cytochrome", url: "molsamples/pdb/photosynthetic/cytochrome.txt", format: "pdb"},
				{ name : "Pheophytin", id:"pheophytin", url: "molsamples/pdb/photosynthetic/pheophytin.txt", format: "pdb"},
				{ name : "prc", id:"prc", url: "molsamples/pdb/photosynthetic/prc.txt", format: "pdb"},
				{ name : "Quinone", id:"quinone", url: "molsamples/pdb/photosynthetic/quinone.txt", format: "pdb"},
			]},
			{ name : "hormons", id:"hormons", childs: [
				{ name : "Adrenaline", id:"adrenaline", url: "molsamples/pdb/drugs/adrenaline.txt", format: "pdb"},
				{ name : "Testosterone", id:"testosterone", url: "molsamples/xyz/testosterone.txt", format: "xyz"},
			]},
			
			{ name : "DNA fragment", id:"dna", url: "molsamples/xyz/dna.txt", format: "xyz"},		
			
		]},

		{ name : "carbon", id:"carbon", childs: [
			{ name : "Graphite", id:"carbongraphite", url: "molsamples/xyz/graphite.txt", format: "xyz"},
			{ name : "Diamond", id:"carbondiamond", url: "molsamples/xyz/diamond.txt", format: "xyz"},
			{ name : "Fullerene", id:"fullerene", url: "molsamples/xyz/fullerene.txt", format: "xyz"},
			{ name : "Graphene", id:"graphene", url: "molsamples/xyz/graphene.txt", format: "xyz"},
			{ name : "Nano tube", id:"nanotube", url: "molsamples/mol/btube.txt", format: "mol"},
		]},

		{ name : "organic chem.", id:"org chem", childs: [
			{ name : "Methane", id:"methane", url: "molsamples/xyz/methane.txt", format: "xyz"},
			{ name : "Benzene", id:"benzene", url: "molsamples/xyz/benzene.txt", format: "xyz"},			
		]},
		
		//{ name : "Creatin", id:"creatin", url: "molsamples/mol/creatin.txt", format: "mol"},
		//{ name : "Gold structure", id:"gold", url: "molsamples/xyz/Au.txt", format: "xyz"},
		//{ name : "Gold thiol complex", id:"goldthiol", url: "molsamples/xyz/au_thiol.txt", format: "xyz"},
		
	];

	var viewmodes = [
		{ name : 'spheres', id:"spheres", cfg : Molvwr.Config.spheres},
		{ name : 'balls and sticks', id:"ballsandsticks", cfg : Molvwr.Config.ballsAndSticks},
	];

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
			sampleitem.innerHTML = item.name;
			sampleitem.setAttribute("unselectable", "on");
			parent.appendChild(sampleitem);

			if (item.childs){
				sampleitem.classList.add("container");
				sampleitem.onclick = function(){
					ctrl.openDetail(item.childs, item.name);
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

		var itemsElt = document.createElement("DIV");
		itemsElt.className = "items"
		itemspanel.appendChild(itemsElt);

		if (hasPanels){
			itemsElt.classList.add("hasClose");

			if (title){
				var titleElt = document.createElement("DIV");
				titleElt.className = "title";
				titleElt.innerHTML = title;
				itemsElt.appendChild(titleElt);
			}

			var btnClose = document.createElement("DIV");
			btnClose.className = "btnclose";
			btnClose.innerHTML = '<i class="oi-chevron-left"></i> back';
			itemsElt.appendChild(btnClose);
			btnClose.onclick = function(){
				itemspanel.classList.remove("visible");
				ctrl.contentPanel.children[ctrl.contentPanel.children.length-2].classList.remove("away");

				setTimeout(function(){
					ctrl.contentPanel.removeChild(itemspanel);				
				}, 150);
			}
		}

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
			if (!ctrl.dontSetTitleText) ctrl.titleElement.innerText = item.name;
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
	var descriptionpanel = document.getElementById("description-panel");
	var loadingstate = document.getElementById("loadingstate");
	var viewer = new Molvwr.Viewer(root);

	var viewpanelctrl = new ChoicePanel(viewmodepanel, viewmodetitle, viewer, viewmodes, function(ctrl, item){
		loadingstate.classList.add("visible");
		ctrl.viewer.setOptions(item.cfg(), function(){
			loadingstate.classList.remove("visible");
		});
	});
	viewpanelctrl.dontSetTitleText = true;
	viewpanelctrl.setSelected("ballsandsticks");
		
	var samplespanelctrl = new ChoicePanel(samplespanel, titleelement, viewer, samples, function(ctrl, item){
		loadingstate.classList.add("visible");
		ctrl.viewer.loadContentFromUrl(item.url, item.format, function(){
			loadingstate.classList.remove("visible");
		});		
		window.location.hash = item.id;
		//moleculeinfo.classList.add("visible");
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
})();