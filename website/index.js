(function(){
	'use strict';
	var samples = [
		{ name : "methane", url: "molsamples/xyz/methane.txt", format: "xyz"},
		{ name : "benzene", url: "molsamples/xyz/benzene.txt", format: "xyz"},
		{ name : "caffeine", url: "molsamples/xyz/caffeine.txt", format: "xyz"},
		{ name : "testosterone", url: "molsamples/xyz/testosterone.txt", format: "xyz"},
		{ name : "Aspirin", url: "molsamples/mol/aspirin.txt", format: "mol"},
		{ name : "Morphine", url: "molsamples/mol/morphine.txt", format: "mol"},
		{ name : "4E0O", url: "molsamples/xyz/4E0O.txt", format: "xyz"},
		{ name : "4QCI", url: "molsamples/xyz/4QCI.txt", format: "xyz"},
		{ name : "Gold structure", url: "molsamples/xyz/Au.txt", format: "xyz"},
		{ name : "Gold thiol complex", url: "molsamples/xyz/au_thiol.txt", format: "xyz"},
		{ name : "DNA fragment", url: "molsamples/xyz/dna.txt", format: "xyz"},		
	];

	var viewmodes = [
		{ name : 'spheres', cfg : Molvwr.Config.spheres},
		{ name : 'balls and sticks', cfg : Molvwr.Config.ballsAndSticks},
	];

	function hideAllPanels(){
		var panels = document.querySelectorAll(".panel");
		for (var i=0, l=panels.length; i<l; i++){
			panels[i].classList.remove("visible");
		}
	}

	function ChoicePanel(element, titleElement, viewer, samples, onselected){
		var ctrl = this;
		this.viewer = viewer;
		this.titleElement = titleElement;
		this.element = element;
		this.onselected = onselected;

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

		samples.forEach(function(item){
			var sampleitem = document.createElement("DIV");
			sampleitem.className = "choice-item";
			sampleitem.innerHTML = item.name;
			ctrl.itemsElt.appendChild(sampleitem);
				sampleitem.onclick = function(){
					ctrl.setSelected(item);
					ctrl.hide();
				}
			
		})
	}

	ChoicePanel.prototype.setSelected = function(item){
		var ctrl = this;
		ctrl.titleElement.innerText = item.name;
		if (ctrl.onselected){
			ctrl.onselected(ctrl, item)
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
	viewpanelctrl.setSelected(viewmodes[1]);
		
	var samplespanelctrl = new ChoicePanel(samplespanel, titleelement, viewer, samples, function(ctrl, item){
		ctrl.viewer.loadContentFromUrl(item.url, item.format);
	});
	samplespanelctrl.setSelected(samples[5]);

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