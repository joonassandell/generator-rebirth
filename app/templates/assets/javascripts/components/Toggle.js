/* ========================================
 * Toggle (beta)
 * ======================================== */

var App = App || {};

(function($) {
  App.ToggleObjects = [];

  App.Toggle = function(options) {

    var config, self = {};

    config = $.extend({
      trigger: $(),
      triggerClass: false,
      element: $(),
      elementClass: 'is-open',
      elementStopPropagation: true,
      toggleParent: false,
      disableFirstClickOnTouch: false,
      unToggleParentSiblings: false,
      unToggleOtherToggles: true,
      unTogglable: true
    }, options);

    self.init = function() {
      App.ToggleObjects.push(config);
      config.trigger.on('click', clickTrigger);

      if(config.elementStopPropagation) {
        config.element.on('click', function(e){
          e.stopPropagation();
        });
      }
    }

    clickTrigger = function(e) {
      var $this = $(this),
          isToggled;

      if(config.unToggleOtherToggles) {

        if (config.toggleParent) {
          isToggled = !$this.closest(config.element).hasClass(config.elementClass);
        } else if (!config.toggleParent) {
          isToggled = !config.element.hasClass(config.elementClass);
        }

        if(isToggled) {
          self.removeToggles();
        }
      }

      var firstClick = $this.hasClass('first-touch');
      var whyToDisable = $this.siblings(config.disableFirstClickOnTouch).length;

      if (config.disableFirstClickOnTouch && whyToDisable
        && !firstClick && Modernizr.touch) {

        $this.addClass('first-touch')
        e.preventDefault();

        setTimeout(function(){
          $this.removeClass('first-touch')
        }, 950);
      }

      if (config.toggleParent) {
        $this.each(function() {
          $this
            .closest(config.element)
            .toggleClass(config.elementClass);
        });
      } else {
        config.element.toggleClass(config.elementClass);
      }

      if (config.unToggleParentSiblings) {
        $this.each(function() {
          $this
            .parent()
            .siblings(config.element)
            .removeClass(config.elementClass);
        });
      }

      if (config.triggerClass) {
        $this.toggleClass(config.triggerClass);
      }

      if(!config.disableFirstClickOnTouch) {
        e.preventDefault();
      }

      e.stopPropagation();
    };

    self.removeToggles = function() {
      $.each(App.ToggleObjects, function(index, value) {
        value.element.each(function() {
          if (!$(this).hasClass(value.elementClass) || !value.unTogglable) {
            return
          }

          $(this).removeClass(value.elementClass);
        });
      });
    };

    return {
      init: config.trigger.length ? self.init() : false,
      removeToggles: self.removeToggles
    }
  };

  $(window).on('click', function(e){
    App.Toggle().removeToggles();
  });
}(jQuery));