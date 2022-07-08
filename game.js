kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0, 1, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("ground", "ground.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("mushroom", "mushroom.png");
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
loadSprite("logo" , "loop.png");
loadSprite("castle" , "castle.png");



scene("win", (score) => {
  add([
    text("mario win! \nScore: " + score + "\nMade by loop", 30),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
});
scene("vacation", (score) => {
  add([
    text("game over! \nScore: " + score + "\nMade by loop", 30),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
});

scene ("begin" ,() => {
  add([
    text("start game" , 30),
     origin("center"),
    pos(width()/ 2, height()/ 2),
  ])
   add([
    sprite("logo"),
    origin("center"),
pos(width()/ 2, height()/ 2 + 70),
scale (0.2),
   ]);
   keyRelease("enter", () => {
    go("game");
   });
  });


scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");
  const symbolmap = {
    width: 20,
    height: 20,

    "=": [sprite("ground"), solid(),scale(1.3)],
    "?": [sprite("surprise"), solid(), "surprise-coin"],
    "!": [sprite("surprise"), solid(), "surprise-mushroom"],
    $: [sprite("coin"), "coin"],
    M: [sprite("mushroom"), body(), "mushroom"],
    x: [sprite("unboxed"), solid()],
    g: [sprite("goomba"), solid(), body(), "goomba1"],
    f: [sprite("goomba"), solid(), body(), "goomba2"],
    d: [sprite("goomba"), solid(), body(), "goomba3"],
    c: [sprite("castle"), layer("bg"), "castle"],
  };
  const map = [
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                    ==                                                     ",
    "  $$            $             ?                    !                       ",
    "  ==!               $$                                                     ",
    "           g$       ==                            ===                  c   ",
    "  ====  =======                  ??     $$ ==                              ",
    "                  $                     ==                                 ",
    "      $$$$$      $  $$$       f      ==           d                        ",
    "===========================================================================",
    "===========================================================================",
    "===========================================================================",
    "===========================================================================",
  ];

  const speed = 120;
  const jumpForce = 400;
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpForce),
  ]);
  const gamelevel = addLevel(map, symbolmap);
  let isJumping = false;

  keyDown("right", () => {
    player.move(speed, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 10) player.move(-speed, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      player.jump(jumpForce);
      isJumping = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gamelevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      gamelevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos);
    }
  });
   let score = 0;
   const scoreLabel = add ([
    text ("score:" + score),
    pos(50,110),
    layer("ui"),
    {
      value : score,
    },
   ]);

  player.collides("coin", (x) => {
    destroy(x);
    scoreLabel.value+=1;
    scoreLabel.text = "Score :"+scoreLabel.value;
  });

  player.collides("mushroom", (x) => {
    destroy(x);
    scoreLabel.value+=5;
    scoreLabel.text = "Score :"+scoreLabel.value;
    player.biggify(5);
  });

  player.collides("goomba1", (gg) => {
    if (player.isBig())
    {
      if(!isJumping){
        player.smallify()
      }
      else{
        destroy(gg);
      }
    }
    else{
      if (isJumping) {
        destroy(gg);
      } else {
        go("vacation" , scoreLabel.value);
        destroy(player);
        scoreLabel.value+=10;
    scoreLabel.text = "Score :"+scoreLabel.value;
      }
    }
      
  });

  player.collides("goomba2", (gg) => {
    if (player.isBig())
    {
      if(!isJumping){
        player.smallify()
      }
      else{
        destroy(gg);
        scoreLabel.value+=10;
    scoreLabel.text = "Score :"+scoreLabel.value;
      }
    }
    else{
      if (isJumping) {
        destroy(gg);
      } else {
        go("vacation" , scoreLabel.value);
        destroy(player);
      }
    }
  });
  player.collides("goomba3", (gg) => {
    if (player.isBig())
    {
      if(!isJumping){
        player.smallify()
      }
      else{
        destroy(gg);
      }
    }
    else{
      if (isJumping) {
        destroy(gg);
      } else {
        go("vacation" , scoreLabel.value);
        destroy(player);
        scoreLabel.value+=10;
    scoreLabel.text = "Score :"+scoreLabel.value;
      }
    }
  });

  action("mushroom", (mush) => {
    mush.move(25, 0);
  });
  action("goomba1", (gege) => {
    gege.move(-20, 0);
  });
  action("goomba2", (gege) => {
    gege.move(-20, 0);
  });
  action("goomba3", (gege) => {
    gege.move(-20, 0);
  });

  player.action(() => {
    console.log(player.pos.x);
    camPos(player.pos);
    scoreLabel.pos.x = player.pos.x - 200;
    if(player.pos.x>= 1434.77192)
    {
      go("win", scoreLabel.value);
    }
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
    if (player.pos.y >= height()) {
      go("vacation" , scoreLabel.value);
    }
  });
});

start("begin"); 