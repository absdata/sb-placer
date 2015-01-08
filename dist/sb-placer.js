;(function(root, factory) {

  "use strict";
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.sbPlacer = factory();
  }

}(this, function() {

  "use strict";
   if (!Array.prototype.indexOf) {
     Array.prototype.indexOf = function(searchElement, fromIndex) {
   
       if (this == null) throw new TypeError('"this" is null or not defined');       // jshint ignore:line
       var O = Object(this);
       var len = O.length >>> 0;                                                     // jshint ignore:line
       if (len === 0) return -1;
       var n = +fromIndex || 0;
       if (Math.abs(n) === Infinity) n = 0;
       if (n >= len) return -1;
       var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
       while (k < len) {
         if (k in O && O[k] === searchElement) return k;
         k++;
       }
       return -1;
   
     };
   }
   

   var select = document.querySelectorAll || function(selector) {
   
     var style = document.styleSheets[0] || document.createStyleSheet();
     style.addRule(selector, 'foo:bar');
     var all = document.all, resultSet = [];
     for (var i = 0, l = all.length; i < l; i++) {
       if (all[i].currentStyle.foo === 'bar') resultSet[resultSet.length] = all[i];
     }
     style.removeRule(0);
     return resultSet;
   
   };
   
   

   var type = {
   
     isArray: Array.isArray || function(o) {
       return (
           typeof o === 'object' && Object.prototype.toString.call(o) === '[object Array]'
       );
     },
   
     isRegExp: function(o) {
       return (
           Object.prototype.toString.call(o) === '[object RegExp]'
       );
     },
   
     isFunction: function(o) {
       return (
           typeof o === 'function' && Object.prototype.toString.call(o) === '[object Function]'
       );
     }
   
   };
   

   var core = {
   
     go: function(placer, targets, params) {
   
       var terms = params.conditions;
   
       for (var i = 0; i < terms.length; i++) {
   
         if (this.isIncompatibleArrays(terms[i].check, terms[i].when)) continue;
   
         if (this.isCompatibleArrays(terms[i].check, terms[i].when)) {
           var place_it = false;
           for (var ii = 0; ii < terms[i].check.length; ii++) {
             if (this.isMatch(terms[i].check[ii], terms[i].when[ii])) {
               place_it = true;
             } else {
               place_it = false;
               break;
             }
           }
           if (place_it) {
             placer(targets, terms[i].place);
             this.execCallback(params.callback, terms[i].check, terms[i].when, terms[i].place);
             return true;
           }
         }
   
         if (this.isMatch(terms[i].check, terms[i].when)) {
           placer(targets, terms[i].place);
           this.execCallback(params.callback, terms[i].check, terms[i].when, terms[i].place);
           return true;
         }
   
       }
   
       // Oops, no match
       placer(targets, params.default_value);
       this.execCallback(params.callback, false, false, params.default_value);
       return true;
   
     },
   
     isIncompatibleArrays: function(check, when) {
       return (
         type.isArray(check) && type.isArray(when) && check.length !== when.length
       );
     },
   
     isCompatibleArrays: function(check, when) {
       return (
         type.isArray(check) && type.isArray(when) && check.length === when.length
       );
     },
   
     isMatch: function(check, when) {
       return (
         (type.isRegExp(when) && check.match(when)) ||
         (!type.isRegExp(when) && type.isArray(when) && when.indexOf(check) !== -1) ||
         (!type.isRegExp(when) && !type.isArray(when) && when === check)
       );
     },
   
     execCallback: function(cb, check, when, place) {
       if (cb && type.isFunction(cb)) cb(check, when, place);
     }
   
   };
   

   var actions = {
   
     place: function(targets, value) {
       for (var i = 0; i < targets.length; i++) {
         targets[i].innerHTML = value;
       }
     },
   
     getTargets: function(selectors) {
       return select.call(document, selectors);
     }
   
   };
   


  return function(params) {

    var placer  = actions.place,
        targets = actions.getTargets(params.targets);

    core.go(placer, targets, params);

  };

}));
