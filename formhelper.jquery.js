(function ($) {

  jQuery.fn.formHelper = function (method) {

    var methods = {

      init: function (options) {

        var settings = $.extend({
          helperHeader: '<h2>Fill out the form</h2>',
          helperContainerClass: 'helper-container',
          isFieldImportant: function (el) {
            return $(el).hasClass('required')
          }
        }, options),

          appendHelperContainerToBody = function () {
            var helperContainer = createDivWithClass(settings.helperContainerClass);
            $(helperContainer).append(settings.helperHeader);
            $('body').append(helperContainer);
          },

          appendHelperToContainer = function (helperElement) {
            $('.' + settings.helperContainerClass).append(helperElement);
          },

          processElementStatus = function (el, helper) {
            var $el = $(el),
              fieldIsEmpty = $el.val().length == 0;
            if (fieldIsEmpty) {
              $(helper).addClass('incomplete').removeClass('complete');
            } else {
              $(helper).removeClass('incomplete').addClass('complete');
            }
          };

        return this.each(function () {

          var $this = $(this),
            $fields = $('input[name]', this),
            data = $this.data('formHelper');

          // Return if plugin has already been initialized for this form
          if (data) {
            return;
          }

          appendHelperContainerToBody();

          $fields.each(function () {
            var $this = $(this), newHelper;
            if (settings.isFieldImportant(this)) {
              newHelper = createImportantHelperElement(this.name, this);
              $this.blur(function () {
                processElementStatus(this, newHelper);
              });
              processElementStatus(this, newHelper);
            } else {
              newHelper = createHelperElement(this.name, this);
            }
            appendHelperToContainer(newHelper);

          });

          $(this).data('formHelper', {
              target : $this,
              fields : $fields
          });

        });

      }
    };

    if (methods[method]) {
      return methods[method].apply(
        this, Array.prototype.slice.call(arguments, 1)
      );
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.formHelper');
    }

    /* Helper functions */

    function createDivWithClass(className) {
      var div = document.createElement('div');
      div.className = className;
      return div;
    }

    function createHelperElement(name, el) {
      var helperDiv = createDivWithClass('helper');
      $(helperDiv).text(name.replace('-', ' '));
      $(helperDiv).click(function () {
        $(el).focus();
      });
      return helperDiv;
    }

    function createImportantHelperElement(name, el) {
      var importantHelper = createHelperElement(name, el);
      $(importantHelper).addClass('important');
      return importantHelper;
    }

  }

})(jQuery);
