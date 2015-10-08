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

	function ChoicePanel(element, titleElement, viewer, samples){
		var ctrl = this;
		this.viewer = viewer;
		this.titleElement = titleElement;
		this.element = element;

		this.itemsElt = document.createElement("DIV");
		this.itemsElt.className = "items"
		this.element.appendChild(this.itemsElt);

		this.titleElement.onclick = function(){
			ctrl.element.classList.toggle("visible");
			if (ctrl.element.classList.contains("visible")){
				overlay.classList.add("visible");
			}else{
				overlay.classList.remove("visible");
			}
		}

		samples.forEach(function(s){
			var sampleitem = document.createElement("DIV");
			sampleitem.className = "sample-item";
			sampleitem.innerHTML = s.name;
			ctrl.itemsElt.appendChild(sampleitem);
			sampleitem.onclick = function(){
				ctrl.setSelected(s);
				ctrl.hide();
			}
		})
	}

	ChoicePanel.prototype.setSelected = function(sample){
		var ctrl = this;
		ctrl.titleElement.innerText = sample.name;
		ctrl.viewer.loadContentFromUrl(sample.url, sample.format);
	}

	ChoicePanel.prototype.hide = function(){
		this.element.classList.remove("visible");
		overlay.classList.remove("visible");
	}


	var samplespanel = document.getElementById("molecule-choice-panel");
	var aboutpanel = document.getElementById("about-panel");
	var aboutlink = document.getElementById("about");
	var titleelement = document.getElementById("moleculetitle");
	var overlay = document.getElementById("overlay");
	var root = document.getElementById("molvwr-container");
	var viewer = new Molvwr.Viewer(root);
	
	var panel = new ChoicePanel(samplespanel, titleelement, viewer, samples);
	panel.setSelected(samples[samples.length-1]);
	
	function hideAbout(){
		overlay.classList.remove("visible");
		aboutpanel.classList.remove("visible");
	}
	aboutlink.onclick = function(){
		overlay.classList.add("visible");
		aboutpanel.classList.add("visible");
	}

	overlay.onclick = function(){
		panel.hide();
		hideAbout();
	}
})();