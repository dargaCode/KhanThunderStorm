var sketchProc=function(processingInstance){ with (processingInstance){

  size(400, 400);
  frameRate(30);

  var drawNamespace,
      initializeHistory,
      getIntensity,
      isLightning,
      drawScene,
      mousePressed,
      newDropDuration,
      addDrop,
      drawDrop,
      getGroundY,
      resetDrop,
      removeDrop,
      addSplash,
      drawSplash,
      removeSplash;

  var MAX_ANIM_FRAME = 200;
  var HORIZON_Y = 282;
  var DROP_MIN_H = 3.0;
  var DROP_MAX_H = 11.0;
  var DROP_MAX_COUNT = 50;
  var DROPS_FULL_INTENSITY = 30;
  var LIGHTNING_MIN_INTENSITY = 0.88;
  var DROP_MIN_DUR = 3;
  var DROP_MAX_DUR = 10;
  var DROP_DUR_PADDING = 25;
  var SPLASH_MAX_COUNT = 400;

  var dropXArray = [200];
  var dropYArray = [0];
  var dropHArray = [10];
  var dropDurationArray = [5];
  var historyArray = [];
  var splashXArray = [];
  var splashYArray = [];
  var splashMinWArray = [];
  var splashWArray = [];
  var splashColorArray = [];

  //immediately invoked
  initializeHistory = function() {
      historyArray = Array.apply(null, Array(MAX_ANIM_FRAME));
      //historyArray = Array(MAX_ANIM_FRAME);
      historyArray = historyArray.map(function(i) {return 0;});
  }();

  getIntensity = function() {
      var sum, avg, i;
      sum = 0;
      for (i = 0; i < historyArray.length; i++) {
          sum += historyArray[i];
      }
      avg = sum / historyArray.length;
      return min(1, avg / DROPS_FULL_INTENSITY);
  };

  isLightning = function(frame, intensity) {
      var flashArray, isFlashFrame;
      flashArray = [0, 25, 88, 100, 145, 150, 155];
      //flash on the listed frames
      isFlashFrame = flashArray.some(function(element, index, array) {return element === frame;});
      if (intensity >= LIGHTNING_MIN_INTENSITY && isFlashFrame) {
          return true;
      } else {
          return false;
      }
  };

  drawScene = function(frame, intensity) {
      var leftCloudX, rightCloudX, cloudHue;
      leftCloudX = -300 + 200 * intensity;
      rightCloudX = 400 - 200 * intensity;
      cloudHue = 255 - 145 * intensity;
      //sky
      background(95, 124, 250);
      fill(140, 160, 250, 150);
      rect(0, 39, 400, 400);
      fill(161, 192, 252, 150);
      rect(0, 66, 400, 400);
      fill(224, 252, 255, 85);
      rect(0, 87, 400, 400);
      fill(255, 255, 255, 130);
      rect(0, 102, 400, 400);
      fill(250, 179, 153, 140);
      rect(0, 170, 400, 400);
      fill(242, 146, 111, 140);
      rect(0, 183, 400, 400);
      fill(255, 123, 0, 160);
      rect(0, 197, 400, 400);
      fill(255, 4, 0, 110);
      rect(0, 214, 400, 400);
      //right clouds
      fill(cloudHue, cloudHue, cloudHue);
      rect(rightCloudX, 0, 400, 400);
      ellipse(rightCloudX - 5, -13, 116, 101);
      ellipse(rightCloudX - 15, 52, 77, 85);
      ellipse(rightCloudX - 7, 109, 77, 85);
      ellipse(rightCloudX + 8, 162, 78, 94);
      ellipse(rightCloudX + 34, 226, 116, 108);
      //left clouds
      rect(leftCloudX, 0, 300, 400);
      ellipse(leftCloudX + 290, 15, 116, 101);
      ellipse(leftCloudX + 297, 75, 92, 114);
      ellipse(leftCloudX + 299, 141, 78, 86);
      ellipse(leftCloudX + 275, 210, 116, 120);
      //lightning
      if (isLightning(frame, intensity)) {
          fill(255, 255, 255);
          rect(0, 0, 400, 400);
      }
      //draw hills
      fill(63, 110, 74);
      curve(-423, 1439, -70, 282, 241, 286, -95, 420);
      fill(66, 112, 77);
      curve(-143, 1018, 217, 287, 405, 286, -95, 420);
      fill(58, 107, 69);
      curve(-143, 721, 63, 285, 213, 284, -95, 228);
      fill(53, 110, 65);
      curve(-143, 1035, 142, 285, 292, 285, -95, 155);
      //ground
      fill(72, 110, 82);
      rect(0, HORIZON_Y, 400, 200);
      fill(79, 110, 88);
      rect(0, HORIZON_Y + 50, 400, 200);
  };

  addDrop = function() {
      if (dropXArray.length >= DROP_MAX_COUNT) {
          removeDrop();
      }
      dropXArray.push(random(mouseX - 15, mouseX + 15));
      dropYArray.push(mouseY);
      dropHArray.push(random(DROP_MIN_H, DROP_MAX_H));
      dropDurationArray.push(newDropDuration(getIntensity()));
  };

  newDropDuration = function(intensity) {
      var min, max;
      min = DROP_MIN_DUR + DROP_DUR_PADDING * intensity;
      max = DROP_MAX_DUR + DROP_DUR_PADDING * intensity;
      return round(random(min, max));
  };

  drawDrop = function(index, intensity) {
      var dropW;
      fill(126, 190, 224);
      dropW = dropHArray[index] * random(0.30, 0.50);
      ellipse(dropXArray[index], dropYArray[index], dropW, dropHArray[index]);
      //animate
      dropYArray[index] += dropHArray[index] * (0.8 + 1.5 * intensity);
  };

  getGroundY = function(index) {
      var proportion, groundY;
      proportion = (dropHArray[index] - DROP_MIN_H) / (DROP_MAX_H - DROP_MIN_H);
      groundY =  5 + HORIZON_Y + (410 - HORIZON_Y) * proportion;
      return groundY;
  };

  resetDrop = function(index) {
      //expired?
      if (dropDurationArray[index] <= 0) {
          removeDrop(index);
      } else {
          //off the screen?
          if (dropXArray[index] > 410 || dropXArray[index] < -10) {
              dropXArray[index] = random (50, 350);
          } else {
              dropXArray[index] += random(-20, 20);
          }
          dropYArray[index] = 0 - DROP_MAX_H;
          dropHArray[index] = random(DROP_MIN_H, DROP_MAX_H);
          dropDurationArray[index]--;
      }
  };

  removeDrop = function(index) {
      dropXArray.splice(index, 1);
      dropYArray.splice(index, 1);
      dropHArray.splice(index, 1);
      dropDurationArray.splice(index, 1);
  };

  addSplash = function(index, groundY) {
      if (splashXArray.length >= SPLASH_MAX_COUNT) {
          removeSplash();
      }
      //building arrays in reverse order so splashes don't flicker
      splashXArray.unshift(dropXArray[index]);
      splashYArray.unshift(groundY);
      splashMinWArray.unshift(dropHArray[index]);
      splashWArray.unshift(dropHArray[index]);
      splashColorArray.unshift(1.00);
  };

  drawSplash = function(index) {
      var splashHueMod, splashW, splashH;

      splashHueMod = splashColorArray[index];
      fill(144, 156, 168, 255);
      fill(144 * splashHueMod, 156 * splashHueMod, 168 * splashHueMod, 210 * splashHueMod);
      splashW = splashWArray[index] * 0.5;
      splashH = splashW * 0.2;
      //grow and fade
      if (splashWArray[index] >= splashMinWArray[index] * 4.2) {
          removeSplash();
      } else if (splashWArray[index] >= splashMinWArray[index] * 2) {
          splashWArray[index] *= 1.004;
          splashColorArray[index] -= 0.002;
      } else {
          splashWArray[index] *= 1.1;
      }
      ellipse(splashXArray[index], splashYArray[index], splashW, splashH);
  };

  removeSplash = function() {
      splashXArray.pop();
      splashYArray.pop();
      splashWArray.pop();
      splashMinWArray.pop();
      splashColorArray.pop();
  };

  mousePressed = function() {
      addDrop();
  };

  drawNamespace = function() {
      var drawLoopCount;

      noStroke();
      drawLoopCount= 0;
      draw = function() {
          var animFrame, stormIntensity, i, dropGroundY;
          //record drop count history
          animFrame = drawLoopCount % (MAX_ANIM_FRAME);
          historyArray[animFrame] = dropXArray.length;
          //intensity is a trailing average of drop count history
          stormIntensity = getIntensity();
          drawScene(animFrame, stormIntensity);
          //draw all drops
          for (i = 0; i < dropXArray.length; i++) {
              drawDrop(i, stormIntensity);
              //put the ground plane in perspective
              dropGroundY = getGroundY(i);
              //drops hit the ground
              if (dropYArray[i] >= dropGroundY) {
                  addSplash(i, dropGroundY);
                  resetDrop(i);
              }
          }
          //draw all splashes
          for (i = 0; i < splashXArray.length; i++) {
              drawSplash(i);
          }
          drawLoopCount++;
      };
  };

  drawNamespace();

}};

var canvas = document.getElementById('myCanvas');
// attaching the sketchProc function to the canvas
var processingInstance = new Processing(canvas, sketchProc);
