molvwr
==========

This project is a molecule viewer made with Babylon.js.

While the main purpose is to have fun with WebGL and Babylon.js, the end goal is to provide a simple component to embed 3D molecules in your website.

Have a look at our [demo website](http://gleborgne.github.io/molvwr/)

## supported molecule file formats
Molvwr supports "xyz", "mol", "sdf", and "pdb" files. If you want an additional file format, please fill an issue

## How to embed Molvwr in your website
Embedding Molvwr into your site is very easy. The most simple way is to add the script "molvwr-bundle.js" to your page, just like this:<br/>
```html
&lt;script src="lib/molvwr-bundle.js"&gt;&lt;/script&gt;
```

This script contains a bundle of Molvwr, [Babylon.js](http://www.babylonjs.com) (a WebGL 3D Engine) and hand.js (a polyfill for pointer events that enables touch interaction).<br/>
You could also add the different files separately if you would like to use Babylon somewhere else in your site.
            
When your script is ready, add a bloc in your page with a "data-molvwr" attribute containing the path of your molecule file :
```html
&lt;div class="mol mol-left" data-molvwr="mol.sdf"&gt;&lt;/div&gt;
```

Now you just need to call "Molvwr.process()" to have your bloc turning into a 3D molecule
```html
&lt;script type="text/javascript"&gt;
  document.addEventListener("DOMContentLoaded", function() {
    Molvwr.process();
  });
&lt;/script&gt;</pre>
````
The "process" function can be called without parameters, or you could explicitely provide an HTML element (or an array of elements).