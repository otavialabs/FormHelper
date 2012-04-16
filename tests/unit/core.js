$(document).ready(function() {

  module('FormHelper.core');

  test('FormHelper.core', function() {
    $('#test-form').formHelper();
    equal($('.helper-container h2').text(), 'Fill out the form', 'Helper container default header text');
  });

});
