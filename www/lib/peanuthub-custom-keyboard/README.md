# Peanut Hub - Custom Keyboard

---
**[Download RC Version](https://bitbucket.org/peanuthub/peanuthub-custom-keyboard) |**
**[Get Started](#get-started) |**
**[Guide](https://angular-gale.azurewebsites.net) |**
**[Report Issues](#report-an-issue)**
 
---

Unobstrive AngularJs/Ionic Component for Ionic 1

**Note:** *Custom Keyboard is under active development. As such, while this library is well-tested, the API may change. Consider using it in production applications only if you're comfortable following a changelog and updating your usage accordingly.*


# Get Started

**(1)** Get Custom Keyboard in one of the following ways:
 - [download the release](https://bitbucket.org/peanuthub/peanuthub-custom-keyboard)
 - or via **[Bower](http://bower.io/)**: by running `$ bower install peanuthub-custom-keyboard --save` from your console

**(2)** Include `peanuthub-custom-keyboard.js` (or `peanuthub-custom-keyboard.min.js`) in your `index.html`

**(3)** Include `peanuthub-custom-keyboard.css` (or `peanuthub-custom-keyboard.min.css`) in your `index.html`

**(4)** Add `peanuthub-custom-keyboard` to your main module's list of dependencies

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>
	<!-- IONIC STUFF -->
    <script src="lib/angular/angular.js"></script>
    <script src="lib/ngCordova/dist/ng-cordova.js"></script>
    <script src="lib/ionic/js/ionic.js"></script>
    <script src="lib/ionic/js/ionic-angular.js"></script>
    <link rel="stylesheet" href="lib/ionic/css/ionic.css">
    <!-- PEANUT HUB COMPONENT -->
    <script src="lib/peanuthub-custom-keyboard.min.js"></script>
    <link href="lib/peanuthub-custom-keyboard.min.css" rel="stylesheet">
    <script>
        angular.module('myApp', ['peanuthub-custom-keyboard'])
        
        
        //Add Custom Keyboard 
        .config(function($peanuthubCustomKeyboardProvider) {
          $peanuthubCustomKeyboardProvider.addCustomKeyboard('CUSTOM_SKU', {
          keys: [
           { type: "CHAR_KEY", value: "1" },
           { type: "CHAR_KEY", value: "2", label: "ABC" },
           { type: "CHAR_KEY", value: "3", label: "DEF" },
           { type: "CHAR_KEY", value: "4" },
           { type: "CHAR_KEY", value: "5" },
           { type: "CHAR_KEY", value: "6" },
           { type: "CHAR_KEY", value: "7" },
           { type: "CHAR_KEY", value: "8" },
           { type: "CHAR_KEY", value: "9" },
           { type: "CHAR_KEY", value: "X" },
           { type: "CHAR_KEY", value: "0" },
           { type: "DELETE_KEY", icon: "ion-backspace-outline" }
         ]})

          //Add Custom Keyboard  With Directive Addon
        .config(function($peanuthubCustomKeyboardProvider) {
          $peanuthubCustomKeyboardProvider.addCustomKeyboard('KEYBOARD_WITH_ADDON', {
          keys: [
            { type: "CHAR_KEY", value: "1" },
            { type: "CHAR_KEY", value: "2", label: "ABC" },
            { type: "CHAR_KEY", value: "3", label: "DEF" },
            { type: "CHAR_KEY", value: "4" },
            { type: "CHAR_KEY", value: "5" },
            { type: "CHAR_KEY", value: "6" }
          ],
          addons: [{
            directive: "camera-read-addon",
            parameters: {
                "read-label": "Escanear código de barra"
            }
        }]})

       });
    </script>
    ...
</head>
<body>
    ...
    <!-- NUMERIC DIRECTIVE -->
    <input 
    	ng-model="numeric_value" 
    	peanuthub-numeric-keyboard 
    	keyboard-options="{doneText: 'Buscar', cleanTextOnClick: true}" 
    	keyboard-on-done-keypress="onSearch" 
    	type="text" 
    	placeholder="" />
	<!-- CUSTOM DIRECTIVE -->
	<input 
    	ng-model="custom_value" 
    	peanuthub-custom-keyboard 
    	keyboard-options="{keyboard:'CUSTOM_SKU', doneText: 'Ok', cleanTextOnClick: true, enableWAI:true, theme:'dark'}" 
    	keyboard-on-done-keypress="onSearch" 
    	type="text" 
    	placeholder="" />
    ...
</body>
</html>
```

**Note:** if you want the unstable version use: `$ bower install https://bitbucket.org/peanuthub/peanuthub-custom-keyboard#master --save` from your console


# Report an Issue

Help us make Peanut Hub Components better! If you think you might have found a bug, or some other weirdness, start by making sure
it hasn't already been reported. You can [search through existing issues](https://bitbucket.org/peanuthub/peanuthub-custom-keyboard/issues)
to see if someone's reported one similar to yours.

If not, then [create a plunkr](http://bit.ly/UIR-Plunk) that demonstrates the problem (try to use as little code
as possible: the more minimalist, the faster we can debug it).

Next, [create a new issue](https://bitbucket.org/peanuthub/peanuthub-custom-keyboard/issues) that briefly explains the problem,
and provides a bit of background as to the circumstances that triggered it. Don't forget to include the link to
that plunkr you created!

Issues only! |
-------------|
Please keep in mind that the issue tracker is for *issues*. Please do *not* post an issue if you need help or support. 

# Contribute

**(1)** See the **[Developing](#developing)** section below, to get the development version of the component up and running on your local machine.

**(2)** Check out the [roadmap](#) to see where the project is headed, and if your feature idea fits with where we're headed.

**(4)** Finally, commit some code and open a pull request. Code & commits should abide by the following rules:

*Always*
- Commits should represent one logical change each; if a feature goes through multiple iterations, squash your commits down to one
- Changes should always respect the coding style of the project

## Resources 

- [Angular Gale Doc's](http://angular-gale.azurewebsites.net/)
- [Peanut Hub](http://www.peanuthub.cl)

## Developing

```bash
 npm install & bower install
 grunt compile
```