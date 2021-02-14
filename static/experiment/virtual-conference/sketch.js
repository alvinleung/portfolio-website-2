let avatars = [];
let user;
let conversations = [];

function preload() {
  // sound format
  soundFormats("mp3", "ogg", "wav");
  conversations.push(loadSound("assets/conversation1"));
  conversations.push(loadSound("assets/conversation2"));
  conversations.push(loadSound("assets/conversation3"));
  conversations.push(loadSound("assets/conversation4"));
  conversations.push(loadSound("assets/conversation5"));
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);

  avatars = createAvatars(conversations);
  playAvatarsSound(avatars);

  // setup user here
  user = createUser();
}

function draw() {
  // clear bg
  clear();

  // put drawing code here
  background(255);

  // update and render the avatar here
  for (let i = 0; i < avatars.length; i++) {
    avatars[i].update(user);
  }
  user.update();
  for (let i = 0; i < avatars.length; i++) {
    avatars[i].draw();
  }
  user.draw();
}
function createUser() {
  return new User();
}
function playAvatarsSound(avatars) {
  avatars.forEach((a) => {
    a.startSpeaking();
  });
}
function createAvatars(sounds) {
  let avatars = [];
  sounds.forEach((sound, index) => {
    avatars.push(new Avatar(getRandomPos(), conversations[index]));
  });

  return avatars;
}

function getRandomPos() {
  return createVector(random(0, windowWidth), random(0, windowHeight));
}

function getRandomVel() {
  return createVector(random(-1, 1), random(-1, 1));
}

class Avatar {
  constructor(pos, sound) {
    this.pos = pos;
    this.size = 50;
    this.soundSize = 600;
    // this.vel = getRandomVel();
    this.vel = createVector(0, 0);
    this.sound = sound;
    this.distToUser = 0;
    this.color = color(random(0, 255), random(0, 255), random(0, 255));
  }
  startSpeaking() {
    // initialise the sound
    this.sound.loop();
  }

  update(user) {
    // calculate the position to the user base
    this.distToUser = user.pos.dist(this.pos);

    // play sound volume base on the user dist
    const maxSoundDist = this.soundSize / 2;

    if (this.distToUser < maxSoundDist) {
      // play sound base on the dist
      if (this.sound !== null) {
        const vol = map(this.distToUser, 0, maxSoundDist, 1, 0);
        // text(vol, this.pos.x + 20, this.pos.y);
        this.sound.setVolume(vol);
      }
    } else {
      if (this.sound !== null) this.sound.setVolume(0);
    }

    // move randomly

    if (this.pos.x > windowWidth || this.pos.x < 0) this.vel.x = -this.vel.x;
    if (this.pos.y > windowHeight || this.pos.y < 0) this.vel.y = -this.vel.y;

    // random walker
    this.pos.add(this.vel);
  }

  draw() {
    fill(this.color);
    // draw the avatar
    strokeWeight(4);
    stroke(noise(frameCount * 0.2 * noise(frameCount)) * 255);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    noFill();

    // map teh colour base on dist
    strokeWeight(1);
    stroke(map(this.distToUser, 0, this.soundSize / 2, 0, 255));
    ellipse(this.pos.x, this.pos.y, this.soundSize, this.soundSize);
  }
}

class User extends Avatar {
  constructor() {
    super(createVector(0, 0), null);

    this.isDragging = false;
    this.dragOffset = createVector(0, 0);
  }
  update() {
    if (mouseIsPressed && !this.isDragging) {
      this.isDragging = true;
      this.dragOffset = createVector(this.pos.x - mouseX, this.pos.y - mouseY);
    } else if (!mouseIsPressed && this.isDragging) {
      this.isDragging = false;
    }

    if (this.isDragging) {
      this.pos.x = mouseX + this.dragOffset.x;
      this.pos.y = mouseY + this.dragOffset.y;
    }
  }
  draw() {
    fill("#AAEE00");
    // draw the avatar
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    text("Me", this.pos.x + 50, this.pos.y);
    // noFill();
    // stroke("#AAEE00");
    // ellipse(this.pos.x, this.pos.y, this.soundSize, this.soundSize);
  }
}
