/**
 * FileApi Attachments
 *
 * Use's the HTML5-FileApi to upload Attachments
 * (only supported in modern Browsers, tested on FF 3.6 on Ubuntu)
 *
 * For now, this is only a proof-of-concept, there a many hacks in the code
 * If you have any hints or suggestions, feel free to contact me.
 *
 * This JS-Code is heavily based on a FileApi Demo by "The CSS Ninja"
 * @see http://www.thecssninja.com/javascript/drag-and-drop-upload
 * 
 * @author Matthias Krauser <matthias@krauser.eu>
 *
 */

if (typeof FileReader !== "undefined") {

  var FA = FA || {};
  (function(){
    var dropContainer,
    dropListing;

    FA.setup = function () {
      dropListing = document.getElementById("rcmAttachmentList");
      dropContainer = document.getElementById("compose-attachments");

      dropContainer.addEventListener("dragenter", function(event){
        this.style.backgroundColor = '#e2eeff';
        event.stopPropagation();
        event.preventDefault();
      }, false);
      dropContainer.addEventListener("dragleave", function(event){
        this.style.backgroundColor = '';
      }, false);
      dropContainer.addEventListener("dragover", function(event){
        event.stopPropagation();
        event.preventDefault();
      }, false);
      dropContainer.addEventListener("drop", FA.handleDrop, false);
    };

    FA.uploadProgressXHR = function (event) {
      if (event.lengthComputable) {
        var percentage = Math.round((event.loaded * 100) / event.total);
        if (percentage < 100) {
          event.target.log.firstChild.nextSibling.nextSibling.nextSibling.style.width = percentage + "%";
        }
      }
    };

    FA.loadedXHR = function (event) {
      currentImageItem = event.target.log;

      progressItem = currentImageItem.firstChild.nextSibling.nextSibling.nextSibling;
      currentImageItem.removeChild(progressItem);

      progressCircle = currentImageItem.firstChild.nextSibling;
      currentImageItem.removeChild(progressCircle);
    };

    FA.uploadError = function (error) {
      console.log("error: " + error);
    };

    FA.processXHR = function (file, index, ts, container) {
      xhr = new XMLHttpRequest(),
      //container = document.getElementById(ts),
      fileUpload = xhr.upload;
      fileUpload.log = container;

      fileUpload.addEventListener("progress", FA.uploadProgressXHR, false);
      fileUpload.addEventListener("load", FA.loadedXHR, false);
      xhr.onreadystatechange = FA.onReadyStateChange;
      fileUpload.addEventListener("error", FA.uploadError, false);

      xhr.open("POST", rcmail.env.comm_path+'&_action=plugin.upload_fileapi&_name=' + file.name + '&_uploadid='+ts);
      xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
      xhr.send(file);
    };

    FA.onReadyStateChange = function(event)
    {
      if(this.readyState == 4)
      {
        //This is a little hacky, but theres no way (i know of) to do a output without
        //iFrame-Code in RC, maybe this can be can be added to RC-Core?
        evl = this.responseText;
        evl = evl.substring(evl.indexOf('CDATA') + 'CDATA[ */ '.length);
        evl = evl.substring(0, evl.indexOf('/* ]]> */'));
        evl = evl.replace(/var rcmail = new rcube_webmail\(\);/g, '');
        evl = evl.replace('if(window.parent) {','');
        evl = evl.replace(/if\(window\.parent && parent\.rcmail\)/g, '');
        evl = evl.replace(/parent/g, 'window');
        evl = evl.substr(0,evl.lastIndexOf('}'));
        document.getElementById('rcmAttachmentList').removeChild(this.upload.log);
        eval(evl);
      }
    }

    FA.handleDrop = function (event) {
			this.style.backgroundColor = '';
      var dt = event.dataTransfer,
      files = dt.files,
      imgPreviewFragment = document.createDocumentFragment(),
      count = files.length,
      domElements;

      event.stopPropagation();
      event.preventDefault();
      var ts = new Date().getTime() * 10;

      for (var i = 0; i < count; i++) {
        //if(files[i].fileSize < 2097152) {
          domElements = [
          document.createElement('li'),
          document.createElement('a'),
          document.createElement('img'),
          document.createElement('img'),
          document.createElement('div'),
          document.createElement('img'),
          document.createElement('div')
          ];

          domElements[1].href= '#delete';
          domElements[1].onclick= function() {alert('x')/*return rcmail.command('remove-attachment','rcmfile11296501808069671300', this)*/;};
          domElements[1].title= 'Delete';
          domElements[2].src = 'skins/default/images/icons/delete.png';
          domElements[3].src = 'skins/default/images/display/loading_blue.gif';
          domElements[1].appendChild(domElements[2]);
          domElements[0].id = ts;
          domElements[0].appendChild(domElements[1]);
          domElements[0].appendChild(domElements[3]);

          domElements[0].appendChild(document.createTextNode(files[i].name));
          domElements[4].style.border = "1px solid #0000ff";
          domElements[4].style.width = 0;
          domElements[4].id = "progress_" + ts;

          domElements[0].appendChild(domElements[4]);

          imgPreviewFragment.appendChild(domElements[0]);

          dropListing.appendChild(imgPreviewFragment);
          ts++;
          FA.processXHR(files.item(i), i, ts, domElements[0]);
        /*} else {
          alert("file is too big, needs to be below 1mb");
        }*/
      }
    };

    window.addEventListener("load", FA.setup, false);
  })();
}