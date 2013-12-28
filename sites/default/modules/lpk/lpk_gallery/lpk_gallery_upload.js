jQuery(function($) {
  var uploadField;
  var galleryId = parseInt(location.pathname.split('/')[3]);
  var ieWorkaroundFirstUpload = false;
  
  function setup() {
    //UI
    $("#lpk-gallery-add-images").html('<div id="lpk-gallery-dd-upload">Vedä ja pudota kuvia tähän tai <a href="#">selaa kuvia</a>.</div>');
    uploadField = $('<input type="file" multiple name="files[]" id="lpk-files">');
    uploadField.hide();
    $("#lpk-gallery-dd-upload").append(uploadField);
    $("#lpk-gallery-add-images").append('<div id="lpk-uploaded-files"></div>');
    
    //File selection
    $("#lpk-gallery-add-images a").click(function(event) {
      ieWorkaroundFirstUpload = true;
      event.preventDefault && event.preventDefault();
      uploadField.click();
    });
    //IE-specific upload handler for select-and-upload - onchange won't trigger in IE < 11
    if(uploadField[0].attachEvent) {
      uploadField[0].onpropertychange = function(event) {
        //IE triggers onpropertychange several times...
        if(window.event.propertyName == 'value' && ieWorkaroundFirstUpload) {
          uploadFiles(this.files);
          ieWorkaroundFirstUpload = false;
        }
      };
    } else {
      uploadField.change(function(evt) {
        uploadFiles(this.files);
      });
    }
    
    //Drag and drop
    var timeout;
    $('body').live('dragover', function(evt) {
      $('body').addClass('dragging');
      clearTimeout(timeout);
      timeout = setTimeout(function(evt) {
        $('body').removeClass('dragging');
      }, 100);
      return false;
    });
    $('body').live('drop', function(evt) {
      evt.preventDefault && evt.preventDefault();
      $('body').removeClass('dragging');
      uploadFiles(evt.originalEvent.dataTransfer.files);
      return false;
    });
  }
  
  function getImageUI(galleryId, file) {
    var ui = {};
    var elem = $('<div class="image uploading" data-id="0"><img alt="" class="img placeholder" src=""><div class="name"> ' + file.name + '</div><div class="state">Ladataan...</div>');
    
    function updateElem(name, status, progress, classNames, id, imageurl) {
      name && elem.find('.name').text(name);
      status && elem.find('.state').html(status);
      classNames && elem.attr('class', 'image ' + classNames);
      id && elem.attr("data-id", id);
      imageurl && elem.find('img').attr('src', imageurl);
      elem.find('.progbar').remove(); //remove existing progress bar if there is one
      if(progress) {
        elem.append('<div class="progbar"><div class="indicator" style="width: ' + progress + '%"></div></div>')
      }
    }
    
    ui.ui = elem[0];
    ui.ok = function(evt, response) {
      updateElem(response.title, 'Ladattu', null, 'ready', response.nid, response.thumbnail);
    }
    ui.err = function(evt, response) {
      updateElem(null, 'Virhe: ' + (response && response.error || 'tuntematon virhe'), null, 'error');
    }
    ui.progress = function(evt) {
      if(evt.lengthComputable) {
        var complete = Math.round(evt.loaded / evt.total * 100 | 0);
        updateElem(null, 'Ladataan... ' + complete + " %", complete);
      }
    }
    return ui;
  }
  
  function uploadFile(galleryId, file, progressCallback, successCallback, errorCallback) {
    var formData = new FormData();
    formData.append('files[img-1]', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/johtajat/galleria/' + galleryId + '/lisaa-kuvia/ajax');
    xhr.onload = function(evt) {
      try {
        var response = JSON.parse(evt.target.response);
      } catch(e) {}
      if(xhr.status == 200 && response && !response.error) {
        successCallback && successCallback(evt, response)
      } else {
        errorCallback && errorCallback(evt, response)
      }
    }
    errorCallback && (xhr.onerror = errorCallback);
    progressCallback && (xhr.upload.onprogress = progressCallback);
    xhr.send(formData);
  }
  
  function uploadFiles(files) {
    var fragment = document.createDocumentFragment();
    $.each(files, function(index, file) {
      var ui = getImageUI(galleryId, file);
      fragment.appendChild(ui.ui);
      
      uploadFile(galleryId, file, ui.progress, ui.ok, ui.err);
    })
    $("#lpk-uploaded-files").prepend(fragment);
  }
  
  function decentBrowser() {
    var input = $('<input type="file" multiple>')[0];
    if(!"multiple" in input) return false;
    if(!"ondrop" in input) return false;
    if(!"upload" in new XMLHttpRequest()) return false;
    if(!FormData) return false;
    return true;
  }
  
  if(decentBrowser()) {
    setup();
  }
});
