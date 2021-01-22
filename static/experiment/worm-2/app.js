(function () {
  if (window.$fsx) {
    return;
  }
  var $fsx = (window.$fsx = {});
  $fsx.f = {};
  // cached modules
  $fsx.m = {};
  $fsx.r = function (id) {
    var cached = $fsx.m[id];
    // resolve if in cache
    if (cached) {
      return cached.m.exports;
    }
    var file = $fsx.f[id];
    if (!file) return;
    cached = $fsx.m[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    file.call(cached.exports, cached.m, cached.exports);
    return cached.m.exports;
  };
})();
(function ($fsx) {
  // default/sketch.js
  $fsx.f[0] = function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var p5 = $fsx.r("p5");
    $fsx.r(1);
    var sketch = function (p) {
      var WORM_JOINT_COUNT = 10;
      var WORM_JOINT_DIST = 10;
      var WORM_COUNT = 20;
      var DELAY_FACTOR = 0.003;
      var wormList = generateWorms();
      p.setup = function () {
        p.createCanvas(
          document.body.clientWidth,
          document.body.clientHeight,
          p.WEBGL
        );
        p.rectMode(p.CENTER);
      };
      p.draw = function () {
        p.clear();
        p.background(0);
        p.noStroke();
        updateWorms(wormList);
        p.translate(-p.width / 2, -p.height / 2);
        drawWorms(wormList);
      };
      function generateWorms() {
        var worms = [];
        for (var i = 0; i < WORM_COUNT; i++) {
          worms[i] = {
            pos: p.createVector(0, 0, 0),
            vel: p.createVector(0, 0, 0),
            accel: p.createVector(0, 0, 0),
            joints: createInitialWormJoints(WORM_JOINT_COUNT, WORM_JOINT_DIST),
            index: i,
          };
        }
        return worms;
      }
      function getRandomScreenPos() {
        return p.createVector(
          Math.random() * p.width,
          Math.random() * p.height
        );
      }
      function createInitialWormJoints(jointLength, jointDist) {
        var wormJoints = [];
        for (var i = 0; i < jointLength; i++) {
          wormJoints[i] = p.createVector(i * jointDist, 0);
        }
        return wormJoints;
      }
      var randomLocation = [];
      function updateWormLogic(worm) {
        var mouseVec = p.createVector(p.mouseX, p.mouseY);
        var mouseWormDistVec = mouseVec.sub(worm.pos);
        var mouseMovementProjectionOffset = mouseWormDistVec.copy().mult(0.1);
        if (!p.mouseIsPressed) {
          randomLocation[worm.index] = null;
          var attractivenessByWormGene = worm.index / wormList.length;
          var geneVariationInfluence = 5;
          var attractiveness =
            DELAY_FACTOR *
            (attractivenessByWormGene * geneVariationInfluence + 1);
          worm.vel.set(
            mouseWormDistVec
              .add(mouseMovementProjectionOffset)
              .mult(attractiveness)
          );
        } else {
          if (!randomLocation[worm.index]) {
            var vec = getRandomScreenPos();
            randomLocation[worm.index] = vec;
          }
          worm.vel.set(
            randomLocation[worm.index].copy().sub(worm.pos).mult(0.1)
          );
        }
        updateWormOrbit(worm);
        updateWormJoints(worm);
      }
      function updateWormOrbit(worm) {
        worm.pos.add(
          (p.noise(worm.pos.x, worm.pos.y) - 0.46) * 50,
          (p.noise(worm.pos.y, worm.pos.x) - 0.46) * 50
        );
      }
      function getOrbitModeModulation() {
        return p.cos(p.radians(p.frameCount) / 4);
      }
      function updateWormJoints(worm) {
        worm.joints[0] = worm.pos.copy();
        worm.joints[1] = followJoint(worm.joints[0], worm.joints[1]);
        for (var i = 1; i < worm.joints.length; i++) {
          worm.joints[i] = followJoint(worm.joints[i - 1], worm.joints[i]);
        }
      }
      function followJoint(leadingJoint, followingJoint) {
        return leadingJoint.copy().add(followingJoint).div(2);
      }
      function interpolateWorm(worm) {
        worm.vel.add(worm.accel);
        worm.pos.add(worm.vel);
      }
      function updateWorms(worms) {
        for (var i = 0; i < worms.length; i++) {
          updateWormLogic(worms[i]);
        }
        for (var i = 0; i < worms.length; i++) {
          interpolateWorm(worms[i]);
        }
      }
      function drawWorms(worms) {
        for (var i = 0; i < worms.length; i++) {
          p.push();
          drawWorm(worms[i]);
          p.pop();
        }
      }
      function drawWorm(worm) {
        p.noFill();
        p.strokeWeight(5);
        p.stroke(255);
        p.beginShape();
        for (var i = 0; i < worm.joints.length; i++) {
          p.curveVertex(worm.joints[i].x, worm.joints[i].y);
        }
        p.endShape();
      }
      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };
    new p5(sketch);
  };
  // default/style.css
  $fsx.f[1] = function () {
    $fsx.r("fuse-box-css")(
      "default/style.css",
      "* {\n  margin: 0rem;\n  box-sizing: border-box;\n}\n\nhtml,\ncanvas,\nbody {\n  display: block;\n  /* width: 100%;\n    height: 100vh; */\n  position: absolute;\n  bottom: 0rem;\n  top: 0rem;\n  left: 0rem;\n  right: 0rem;\n}\n"
    );
  };
  $fsx.r(0);
})($fsx);
// mime type change
