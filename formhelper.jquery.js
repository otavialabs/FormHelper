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
        }, options);

        return this.each(function () {

          var $fields = getFields(this),
            data = getData(this),
            helperContainer;

          // Return if plugin has already been initialized for this form
          if (data) {
            return;
          }

          helperContainer = createHelperContainer(settings);

          setData(helperContainer, {target: this});

          appendToDOM(helperContainer);

          $fields.each(function () {
            var newHelper = createHelper(settings, this);
            linkFieldToHelper(this, newHelper);
            processFieldStatus(this, newHelper);
            attachEventsToField(this);
            addHelper(newHelper, helperContainer);
          });

          setData(this, createFormData(this, $fields, helperContainer));

        });

      }
    };

    /* Conventional plugin method call routing */

    if (methods[method]) {
      return methods[method].apply(
        this, Array.prototype.slice.call(arguments, 1)
      );
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.formHelper');
    }

    /* Helper functions - Creators */

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

    function createHelperContainer(settings) {
      var helperContainer = createDivWithClass(settings.helperContainerClass);
      $(helperContainer).append(settings.helperHeader);
      return helperContainer;
    }

    function createHelper(settings, field) {
      var newHelper;
      if (settings.isFieldImportant(field)) {
        newHelper = createImportantHelperElement(field.name, field);
      } else {
        newHelper = createHelperElement(field.name, field);
      }
      return newHelper;
    }

    function createFormData(el, $fields, helperContainer) {
      return {
        target: $(el),
        fields: $fields,
        helperContainer: helperContainer
      };
    }

    /* Helper functions - Manipulators */

    function addHelper(helperElement, helperContainerElement) {
      $(helperContainerElement).append(helperElement);
    }

    function processFieldStatus(el, helper) {
      var $el = $(el),
        fieldIsInvalid = $el.val().length == 0 || (el.checkValidity && el.checkValidity() == false);
      if (fieldIsInvalid && helperIsImportant(el)) {
        setHelperToNegative(helper);
      } else if (helperIsImportant(el)) {
        setHelperToPositive(helper);
      }
    }

    function setHelperToPositive(helper) {
      $(helper).removeClass('incomplete').addClass('complete');
    }

    function setHelperToNegative(helper) {
      $(helper).removeClass('complete').addClass('incomplete')
    }

    function activateHelper(helper) {
      $(helper).addClass('active')
    }

    function deactivateHelper(helper) {
      $(helper).removeClass('active')
    }

    function attachEventsToField(field) {
      var $field = $(field);
      $field.focus(function () {
        activateHelper(getHelper(this));
      });
      $field.blur(function () {
        var helper = getHelper(this);
        deactivateHelper(helper);
        if (helperIsImportant(this)) {
          processFieldStatus(this, helper)
        }
      });
    }

    function setData(el, data) {
      $(el).data('formHelper', data);
    }

    function appendToDOM(el) {
      $('body').append(el);
    }

    /* Helper functions - Retrieval */

    function getHelper(field) {
      return $(field).data('formHelper').helper;
    }

    function helperIsImportant(field) {
      return $(getHelper(field)).hasClass('important');
    }

    function linkFieldToHelper(field, helper) {
      $(field).data('formHelper', {helper: helper});
    }

    function getFields(el) {
      return $('input[name]', el);
    }

    function getData(el) {
      return $(el).data('formHelper');
    }

  }

})(jQuery);
