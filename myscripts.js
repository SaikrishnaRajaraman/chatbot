    var accessToken = "6018034332aa4d62919ab06771bf5cfb",
      baseUrl = "https://api.api.ai/v1/",
      $speechInput,
      $recBtn,
      recognition,
      messageRecording = "Recording...",
      messageCouldntHear = "I couldn't hear you, could you say that again?",
      messageInternalError = "Oh no, there has been an internal server error",
      messageSorry = "I'm sorry, I don't have the answer to that yet.";
    $(document).ready(function() {
      $speechInput = $("#speech");
      $recBtn = $("#rec");
      $speechInput.keypress(function(event) {
        if (event.which == 13) {
          event.preventDefault();
             var u=$speechInput.val();
             $("#usr").addClass("is-act").find(".usrp").html(u);
          send();
        }
      });
      $recBtn.on("click", function(event) {
        switchRecognition();
      });
      $(".debug__btn").on("click", function() {
        $(this).next().toggleClass("is-active");
        return false;
      });
    });
    function startRecognition() {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
          recognition.interimResults = false;
      recognition.onstart = function(event) {
        respond(messageRecording);
        updateRec();
      };
      recognition.onresult = function(event) {
        recognition.onend = null;
        
        var text = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInput(text);
        stopRecognition();
      };
      recognition.onend = function() {
        respond(messageCouldntHear);
        stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
    }
  
    function stopRecognition() {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
      updateRec();
    }
    function switchRecognition() {
      if (recognition) {
        stopRecognition();
      } else {
        startRecognition();
      }
    }
    function setInput(text) {
      $speechInput.val(text);
      send();
    }
    function updateRec() {
        if(recognition){
             $recBtn.text('' );
             $recBtn.append('<i class="material-icons md-48">mic off</i>');
        }else
            {
                $recBtn.text('' );
                $recBtn.append('<i class="material-icons md-48">mic</i>');}
    }
    function send() {
      var text = $speechInput.val();
      $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "saiki"}),
        success: function(data) {
          prepareResponse(data);
        },
        error: function() {
          respond(messageInternalError);
        }
      });
    }
    function prepareResponse(val) {
      var debugJSON = JSON.stringify(val, undefined, 2),
          spokenResponse = val.result.speech;
      respond(spokenResponse);
      debugRespond(debugJSON);
    }
    function debugRespond(val) {
      $("#response").text(val);
    }
    
    function respond(val) {
        
      if (val == "") {
        val = messageSorry;
      }
      if (val !== messageRecording) {
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val;
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
      }
      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
    }