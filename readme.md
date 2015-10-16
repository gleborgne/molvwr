Molvwr
==========

This project is a WebGL molecule viewer made with Babylon.js.

While the main purpose is to have fun with WebGL and Babylon.js, the end goal is to provide a simple component to embed 3D molecules in your website.

Have a look at our [demo website](http://gleborgne.github.io/molvwr/). We have examples for a [rich molecule catalog](http://gleborgne.github.io/molvwr), or an example of how to [embed Molvwr in your website](http://gleborgne.github.io/molvwr/embedexample.html).

## Supported molecule file formats
Molvwr supports "xyz", "mol", "sdf", and "pdb" files. If you want an additional file format, please fill an issue

## How to embed Molvwr in your website
You could look at the [sample page](http://gleborgne.github.io/molvwr/embedexample.html) and use F12 developper tools to look at the source. Here is a brief summary.

Embedding Molvwr into your site is very easy. The most simple way is to add the script "molvwr-bundle.js" to your page, just like this:<br/>
```html
<script src="lib/molvwr-bundle.js"></script>
```

This script contains a bundle of Molvwr, [Babylon.js](http://www.babylonjs.com) (a WebGL 3D Engine) and hand.js (a polyfill for pointer events that enables touch interaction).<br/>
You could also add the different files separately if you would like to use Babylon somewhere else in your site.
            
When your script is ready, add a bloc in your page with a "data-molvwr" attribute containing the path of your molecule file :
```html
<div class="mol mol-left" data-molvwr="mol.sdf"></div>
```

Now you just need to call "Molvwr.process()" to have your bloc turning into a 3D molecule
```html
<script type="text/javascript">
  document.addEventListener("DOMContentLoaded", function() {
    Molvwr.process();
  });
</script>
````
The "process" function can be called without parameters, or you could explicitely provide an HTML element (or an array of elements).

## Advanced integration
If you want to go deep into the rabbit hole, you could work with Molvwr in advanced ways. It has been designed to be extensible and to tweek rendering if you would like. We will expand documentation in the near future but for now, you could have a look at the source code, and the [molecule catalog sample](http://gleborgne.github.io/molvwr) to get an idea.