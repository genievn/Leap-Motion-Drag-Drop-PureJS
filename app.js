var stageHeight = $(window).innerHeight();
var stageWidth = $(window).innerWidth();

var hasImage = true;


var leap = new Leap.Controller();
leap.connect();

if(identity !== "center"){
  $("#content").attr("src","");
  hasImage = false;
}


var socket = io('http://localhost:9000')

socket.on('news',function(data){
    console.log(data);
    if(identity !== data){
        $("#content").attr("src","");

        hasImage = false;
    }

    if(identity === data){
      $("#content").attr("src","http://www.h3dwallpapers.com/wp-content/uploads/2014/08/Landscape-wallpapers-1.jpeg");
      $("#content").css("visibility","visible");
      $("#content").removeClass();
      $("#content").addClass("centerImageLayout");
      hasImage = true;
    }
});


// var pointer = $("#pointer");
// var leftDiv = $("#leftDiv");
// var rightDiv = $("#rightDiv");
// var upperDiv = $("#upperDiv");

function onScreenCoordinates(){
  var leapFrame = leap.frame();
  var handsInFrame = leapFrame.hands;
  if(handsInFrame.length > 0 ){
    var hand = handsInFrame[0];
    if(hand.grabStrength == 1 && hasImage){

      $("#leftDiv").addClass("dropZones left")
      $("#upperDiv").addClass("dropZones up")
      $("#rightDiv").addClass("dropZones right")
      $("#content").addClass("shadow")

      var iBox = leapFrame.interactionBox;
      var sphericalCoord = hand.sphereCenter;
      var normalizedPoint = iBox.normalizePoint(sphericalCoord,true);

      var imageX = normalizedPoint[0] * stageWidth;
      var imageY = (1 - normalizedPoint[1]) * stageHeight;

      $("#content").css({
        left: imageX + 'px',
        top: imageY + 'px'
      });

      var imageTop = $("#content").position().top - 200;
      var imageLeft = $("#content").position().left - 200;

      console.log(imageTop + " - " + (0.90*stageHeight));
      if(imageTop < 0){
        shareInfo("Up");
      }else{
        if(imageLeft < 0){
          shareInfo("Left")
        }else{
          imageLeft += 200;
          if(imageLeft > (.95*stageWidth)){
            shareInfo("Right")
          }else{
            imageTop += 200;
            if(imageTop > (.95*stageHeight)){
              shareInfo("Down")
            }
          }
        }
      }
    }else{
      if(hand.grabStrength == 0 ){
        $("#leftDiv").removeClass("dropZones left")
        $("#upperDiv").removeClass("dropZones up")
        $("#rightDiv").removeClass("dropZones right")
        $("#content").removeClass("shadow")
      }
    }
  }
}

function shareInfo(position){

  switch(position){
    case "Up":
        if(identity === "center" || identity ==="right" || identity ==="left"){
            socket.emit('update',"up");
            $("#content").css("visibility","hidden");
        }
        break;

    case "Right":
        if(identity === "center"){
          socket.emit('update','right');
          $("#content").css("visibility","hidden");
        }

        if(identity === "left"){
          socket.emit('update','center');
          $("#content").css("visibility","hidden");
        }

        if(identity === "up"){
          socket.emit('update','right');
          $("#content").css("visibility","hidden");
        }
        break;

    case "Left":
      if(identity === "center"){
        socket.emit('update','left');
        $("#content").css("visibility","hidden");
      }

      if(identity === "right"){
        socket.emit('update','center');
        $("#content").css("visibility","hidden");
      }

      if(identity === "up"){
        socket.emit('update','left');
        $("#content").css("visibility","hidden");
      }
      break;

    case "Down":
      if(identity === "up"){
        socket.emit('update','center');
        $("#content").css("visibility","hidden");
      }
      break;
  }
}



setInterval(function(){onScreenCoordinates()},10);



//HELPER FUNCTIONS START HERE


// var leapFrame = leap.frame();
// if(leapFrame.valid){
//   var iBox = leapFrame.interactionBox;
//   var pointables = leapFrame.pointables;
//   // var grabStrength = leapFrame.handss[0].grabStrength;
//   // var pinchStrength = leapFrame.hands[0].pinchStrength;
//   console.log(leapFrame.gestures);
//   if(leapFrame.gestures.length > 0){
//     console.log(leapFrame);
//   }
// }
