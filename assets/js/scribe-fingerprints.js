document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.scribe-profile img').forEach(function(img){
    // make clickable if IIIF-looking URL
    var src = img.getAttribute('src') || '';
    if(src.indexOf('/max/0')!==-1 || src.indexOf('/0/default')!==-1){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(e){
        window.open(src, '_blank');
      });
    }
  });
});
