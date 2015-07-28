;
(function () {
  var socket = io.connect(window.location.hostname);
  var editor = ace.edit("editor");
  editor.setByAPI = false;
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  var runCode = document.getElementsByClassName('runCode')[0];
  var resetCode = document.getElementsByClassName('runCode')[1];

  runCode.addEventListener('click', function () {
    var code = editor.getValue();

    var script = document.createElement('script');
    script.appendChild(document.createTextNode(code));
    document.body.appendChild(script);
  });

  resetCode.addEventListener('click', function () {
    log.innerHTML = '';
  });

  var log = document.getElementsByClassName('log')[0];
  console.log = function (message) {
    if (typeof message == 'object') {
      log.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
      log.innerHTML += message + '<br />';
    }
  };

  socket.on('editorUpdate', function (data) {
    editor.setByAPI = true;
    editor.setValue(data.contents);
    editor.clearSelection();
    editor.setByAPI = false;
  });

  editor.on('change', function () {
    if (!editor.setByAPI) {
      socket.emit('editorUpdate', {
        contents: editor.getValue()
      });
    }
  });
})();