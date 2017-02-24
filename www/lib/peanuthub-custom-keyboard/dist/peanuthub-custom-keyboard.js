/*------------------------------------------------------
 Company:           Peanut Hub Ltda.
 Author:            Peanut Hub Ltda. <contacto@peanuthub.cl> (http://www.peanuthub.cl),David Gaete <david.munoz@peanuthub.cl> (https://github.com/dmunozgaete),Sebastian Moreno <sebastian.moreno@peanuthub.cl> (https://github.com/px740)
 
 Description:       Unobstrive Ionic Custom Keyboard for Ionic 1
 Github:            https://bitbucket.org/peanuthub/peanuthub-custom-keyboard

 Versión:           1.0.2
 Build Date:        2017-01-06 21:34:41
------------------------------------------------------*/

angular.module('peanuthub-custom-keyboard.templates', []).run(['$templateCache', function($templateCache) {
  "use strict";
  $templateCache.put("peanuthub-custom-keyboard/peanuthub-custom-keyboard.tpl.html",
    "<custom-keyboard-container class={{model.theme}}><custom-backdrop></custom-backdrop><custom-keyboard><custom-keyboard-addons></custom-keyboard-addons><custom-keyboard-header ng-show=!model.hideHeader><custom-keyboard-button ion-ripple ion-native-click ng-click=onDonePressed($event)>{{model.doneText}}</custom-keyboard-button></custom-keyboard-header><custom-keyboard-keys><custom-keyboard-key ion-native-click ion-ripple ng-click=onKeyPressed($event,key) ng-repeat=\"key in model.keys\"><div><div class=key-value ng-if=key.value>{{key.value}}</div><div class=key-icon ng-if=key.icon><i class=\"icon {{key.icon}}\"></i></div><div class=key-label>{{key.label}}</div></div></custom-keyboard-key></custom-keyboard-keys></custom-keyboard></custom-keyboard-container>");
}]);
;angular.module('peanuthub-custom-keyboard.components', []);
angular.module('peanuthub-custom-keyboard.services', []);
angular.module('peanuthub-custom-keyboard', [
    'peanuthub-custom-keyboard.templates',
    'peanuthub-custom-keyboard.services',
    'peanuthub-custom-keyboard.components'
]);
;angular.module('peanuthub-custom-keyboard.components')

.directive('ionNativeClick', function() {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', function($scope, $element) {}],
        link: function(scope, element, attributes) {

            element.on("click", function(ev) {
                if (ionic.Platform.isWebView() &&
                    typeof nativeclick !== "undefined") {
                    nativeclick.trigger();
                }
            });
        }
    };
});
;angular.module('peanuthub-custom-keyboard.components')

.directive('ionRipple', ['$q', '$templateRequest', '$log', '$compile', '$timeout', '$rootScope', function($q, $templateRequest, $log, $compile, $timeout, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            ionRippleColor: '@'
        },
        link: function link(scope, element, attr) {
            var x;
            var y;
            var size;
            var offsets;
            var rippleClass = 'ion-ripple';
            var animateClassName = 'ion-ripple_animate';
            var ripple = document.createElement('span');

            // Use color from ion-ripple-color attribute if possible.
            if (attr.ionRippleColor) {
                ripple.style.backgroundColor = attr.ionRippleColor;
            }

            ripple.classList.add(rippleClass);
            element[0].insertBefore(ripple, element[0].firstChild);

            element.on('click', rippleHandler);
            angular.element(ripple).on('animationend webkitAnimationEnd', deactivateRipple);

            //remove the event listener on scope destroy
            scope.$on('$destroy', function() {
                element.off('click', rippleHandler);
                angular.element(ripple).off('animationend webkitAnimationEnd', deactivateRipple);
            });

            function deactivateRipple() {
                ripple.classList.remove(animateClassName);
            }

            function rippleHandler(event) {
                if (!ripple.offsetHeight && !ripple.offsetWidth) {
                    size = Math.max(element[0].offsetWidth, element[0].offsetHeight);
                    ripple.style.width = ripple.style.height = size + 'px';
                }

                x = event.pageX;
                y = event.pageY;

                function getPos(element) {
                    var de = document.documentElement;
                    var box = element.getBoundingClientRect();
                    var top = box.top + pageYOffset - de.clientTop;
                    var left = box.left + pageXOffset - de.clientLeft;

                    return { top: top, left: left };
                }

                offsets = getPos(element[0]);
                ripple.style.top = (y - offsets.top - size / 2) + 'px';
                ripple.style.left = (x - offsets.left - size / 2) + 'px';

                ripple.classList.add(animateClassName);
            }
        }
    };
}]);
;(function() {
    var buildCustomKeyBoard = function(keyboard)  {
        return function($q, $templateRequest, $log, $compile, $timeout, $rootScope, $peanuthubCustomKeyboard) {
            return {
                restrict: 'A',
                scope: {
                    keyboardOptions: '=',
                    keyboardOnKeypress: '&',
                    keyboardOnDoneKeypress: '&',
                    keyboardOnShow: '&',
                    keyboardOnHide: '&'
                },
                transclude: false,
                controller: function($scope, $element) {},
                link: function(scope, element, attributes) {

                    //var templateUrl = "bundles/peanuthub-custom-keyboard/js/components/peanuthub-custom-keyboard/peanuthub-custom-keyboard.tpl.html";
                    var templateUrl = "peanuthub-custom-keyboard/peanuthub-custom-keyboard.tpl.html";
                    var body = angular.element(document.body);
                    var input_element = element;


                    // ---------------------
                    // Model
                    var model = {
                        animation: {
                            duration: 350, //0.35s
                            slideUp: "slide-up",
                            slideDown: "slide-down"
                        },
                        doneText: "Aceptar",
                        keys: ((keyboard && keyboard.keys) || null),
                        addons: ((keyboard && keyboard.addons) || null),
                        theme: ""
                    };

                    //------------------------------------------    
                    // Configurations
                    (function(options) {
                        if (options.doneText) {
                            model.doneText = options.doneText.toString();
                        }

                        if (options.cleanTextOnClick || !angular.isUndefined(attributes.cleanTextOnClick)) {
                            model.cleanTextOnClick = true;
                        }

                        if (options.theme) {
                            model.theme = options.theme.toString();
                        }

                        if (options.enableWAI) {
                            model.theme += " wai-enabled";
                        }

                        if (options.hideHeader) {
                            model.hideHeader = true;
                        }

                        if (!model.keys) {
                            var keyboards = $peanuthubCustomKeyboard.getKeyboards();

                            //Find the template via the options
                            if (!options.keyboard || (options.keyboard && !keyboards[options.keyboard])) {
                                throw Error("KEYBOARD_TEMPLATE_NOT_INITIALIZED");
                            }

                            var configuredKeyboard = keyboards[options.keyboard];
                            model.keys = configuredKeyboard.keys;

                            //Add the addons list to the model for rendering
                            if (configuredKeyboard && configuredKeyboard.addons) {
                                model.addons = configuredKeyboard.addons;
                            }
                        }

                    })(scope.keyboardOptions || {});
                    scope.model = model;
                    //------------------------------------------    

                    //------------------------------------------    
                    // Action's
                    var destroy = function(container) {
                        var defer = $q.defer();


                        //----------------------------------
                        // ANIMATION (SLIDE UP)
                        var keyboard = container.find("custom-keyboard");
                        keyboard.addClass(model.animation.slideDown);
                        var delay = $timeout(function() {
                            $timeout.cancel(delay);

                            //FIX NG-MODEL
                            //  SET READONLY FALSE
                            //  CHANGE THE VALUE OF THE INPUT
                            //  AND RE-ENABLE READONLY
                            input_element.val(input_element.val());
                            input_element.triggerHandler("change");
                            input_element.attr("readonly", true);

                            defer.resolve();

                            //Fire Event Handler
                            var delegate = scope.keyboardOnHide();
                            if (delegate) {
                                delegate(input_element.val());
                            }

                        }, model.animation.duration);
                        //----------------------------------

                        input_element.removeAttr("readonly");

                        defer.promise.then(function() {

                            var clonedScope = container.scope();
                            container.remove();

                            //Always call to $destroy , for destroy the
                            //addons, and call the $destroy hook
                            if (clonedScope) {
                                try {
                                    clonedScope.$destroy();
                                } catch (ex) {}
                            }


                            //Reset 
                            _firstKeyPressed = true;
                        });

                        return defer.promise;
                    };

                    var _firstKeyPressed = true;
                    scope.onKeyPressed = function(ev, item) {


                        switch (item.type) {
                            case "CHAR_KEY":
                                if (_firstKeyPressed) {
                                    //Options 
                                    if (model.cleanTextOnClick) {
                                        input_element.val("");
                                    }
                                }
                                _firstKeyPressed = false;
                                input_element.val(input_element.val() + item.value);

                                break;
                            case "DELETE_KEY":
                                if (_firstKeyPressed) {
                                    input_element.val("");
                                } else {
                                    var str = input_element.val();
                                    str = str.substring(0, str.length - 1);
                                    input_element.val(str);
                                }
                                break;
                            case "DONE_KEY":
                                //Fire Event Handler
                                var done_handler = scope.keyboardOnDoneKeypress();
                                if (done_handler) {
                                    try {
                                        done_handler(input_element.val());
                                    } catch (ex) {}
                                }
                                break;
                        }

                        //Fire Event Handler
                        var delegate = scope.keyboardOnKeypress();
                        if (delegate) {
                            delegate(item, input_element.val());
                        }
                    };

                    scope.onDonePressed = function(ev) {
                        var item = {
                            type: "DONE_KEY",
                            value: model.doneText
                        };
                        scope.onKeyPressed(ev, item);
                    };

                    //------------------------------------------
                    var initialize = function(container) {
                        var keyboard = container.find("custom-keyboard");
                        var backdrop = container.find("custom-backdrop");
                        var doneKey = container.find("custom-keyboard-button");

                        backdrop.on("click", function(ev) {
                            destroy(container);
                        });

                        doneKey.on("click", function(ev) {
                            destroy(container);
                        });

                        //----------------------------------
                        // ANIMATION (SLIDE UP)
                        keyboard.addClass(model.animation.slideUp);
                        var delay = $timeout(function() {
                            $timeout.cancel(delay);

                            keyboard.removeClass(model.animation.slideUp);

                            //Fire Event Handler
                            var delegate = scope.keyboardOnShow();
                            if (delegate) {
                                delegate(input_element.val());
                            }


                            var api = {
                                sendKeys: function(text) {
                                    scope.onKeyPressed({}, {
                                        type: "CHAR_KEY",
                                        value: text
                                    });
                                },
                                hide: function() {
                                    destroy(container);
                                },
                                done: function() {
                                    destroy(container).then(function() {
                                        scope.onDonePressed({});
                                    });
                                }
                            };
                            scope.$broadcast("custom-keyboard-initialize", api);

                        }, model.animation.duration);
                        //----------------------------------
                    };


                    var last_container = null;
                    $rootScope.$on("$ionicView.beforeEnter", function(event, data) {
                        // handle event
                        if (last_container) {
                            destroy(last_container);
                            last_container = null;
                        }
                    });


                    input_element.attr("readonly", true);
                    input_element.on("click", function(ev) {
                        $templateRequest(templateUrl).then(function(html) {
                            //Add Keyboard Template
                            var template = angular.element(html);


                            //Add Addons to the Template
                            var addons = template.find("custom-keyboard-addons");
                            if (model.addons) {
                                angular.forEach(model.addons, function(addon) {
                                    var elm = angular.element('<' + addon.directive + '/>');

                                    if (addon.parameters) {
                                        for (var name in addon.parameters) {
                                            elm.attr(name, addon.parameters[name]);
                                        }
                                    }

                                    addons.append(elm);
                                });
                            }

                            body.append(template);

                            var newChildScope = scope.$new();
                            $compile(template)(newChildScope);

                            //BootStrap
                            last_container = template;
                            initialize(template);
                        });

                        //Simulate Effect
                        if (model.cleanTextOnClick) {
                            input_element.val("");
                        }

                    });

                }
            };
        };
    };


    angular.module('peanuthub-custom-keyboard.components')
        .directive('peanuthubCustomKeyboard', buildCustomKeyBoard())
        .directive('peanuthubNumericKeyboard', buildCustomKeyBoard({
            name: "NUMERIC",
            keys: [
                { type: "CHAR_KEY", value: "1" },
                { type: "CHAR_KEY", value: "2", label: "ABC" },
                { type: "CHAR_KEY", value: "3", label: "DEF" },
                { type: "CHAR_KEY", value: "4", label: "GHI" },
                { type: "CHAR_KEY", value: "5", label: "JKL" },
                { type: "CHAR_KEY", value: "6", label: "MNO" },
                { type: "CHAR_KEY", value: "7", label: "PQRS" },
                { type: "CHAR_KEY", value: "8", label: "TUV" },
                { type: "CHAR_KEY", value: "9", label: "WXYZ" },
                { type: "DUMMY_KEY", value: "" },
                { type: "CHAR_KEY", value: "0" },
                { type: "DELETE_KEY", icon: "ion-backspace-outline" }
            ]
        }));
})();
;angular.module('peanuthub-custom-keyboard.services')
    .provider('$peanuthubCustomKeyboard', function() {
        var $this = this;
        var _customKeyboards = {};

        this.addCustomKeyboard = function(keyboardName, configuration) {
            _customKeyboards[keyboardName] = configuration;
        };

        this.$get = ['$q', '$log', function($q, $log) {
            var self = {};

            self.getKeyboards = function() {
                if (!_customKeyboards) {
                    throw Error("KEYBOARDS_NOT_INITIALIZED");
                }
                return _customKeyboards;
            };

            return self;
        }];

    });
