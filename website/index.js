(function(){
	'use strict';
	var root = document.getElementById("molvwr-container");
	var viewer = new Molvwr.Viewer(root);
	viewer.loadContentFromUrl("molsamples/xyz/dna.txt", "xyz");
})();