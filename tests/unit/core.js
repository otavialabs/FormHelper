$(document).ready(function() {

  module('FormHelper.core');

  test('initialize container with default options', function() {
    $('#test-form').formHelper();
    equal($('.helper-container h2').text(), 'Fill out the form', 'Helper container default header text');
  });

  test('override default options', function() {
    var overrides = {
      helperHeader: 'My custom header'
    };
    $('#test-form').formHelper(overrides);
    equal($('.helper-container h2').text(), 'My custom header', 'Override default header');
  });

});
