jQuery(function($) {
  var LARGE_SIZE = 'large';
  var THUMBNAIL_SIZE = 'small_square';
  
  var links = $('.lpk-gallery-images a');
  
  links.each(function(i, link) {
    var url = $(link).find('img').first().attr('data-large');
    var title = $(link).find('span').first().text();
    $(link).attr('href', url);
    $(link).attr('title', title);
    $(link).attr('rel', 'gallery');
  });
  
  links.fancybox({
    padding: 10,
    margin: 20,
    fitToView: true,
    loop: true,
    nextEffect: 'fade',
    prevEffect: 'fade'
  });
});
