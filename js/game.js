//initial images
const pig = new Image();
const background = new Image();
const fox = new Image();
const hole = new Image();
const man = new Image();
const codesford = new Image();
let startGame = false;

//find canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//initial coordinates
const pigHeight = 200;
const pigWidth = 250;
let xPos = 0;
let speed = 30;
let jumpUp = 200
let jumpDown = 100
let backgroundSpeed = 2;
let background1X = 0;
let background1Y = 0;
let background2X = 0;
let background2Y = 0;
const roadHeight = 20;
const normalPigY = canvas.height - pigHeight - roadHeight;
let yPos = canvas.height - pigHeight - roadHeight;

//functions for change display style
const hide = (elem) => {
  elem.style.display = "none";
}
const show = (elem) => {
  elem.style.display = "flex";
}

//find elements in HTML
const login = document.getElementById("loginScreen");
const occupation = document.getElementById("occupationScreen");
const country = document.getElementById("countryScreen");
const transport = document.getElementById("transportScreen");
const win = document.getElementById("winScreen");
const fail = document.getElementById("failScreen");

//arr with occupation HTML-elements
const occupationOptions = [document.getElementById("frond"), document.getElementById("back"),
  document.getElementById("qa"), document.getElementById("designer")];

//arr with transport HTML-elements
const transportOptions = [document.getElementById("tractor"), document.getElementById("rocket"),
  document.getElementById("turbo"), document.getElementById("car")];

//arr with country HTML-elements
const countryOptions = [document.getElementById("australia"), document.getElementById("canada"),
  document.getElementById("sweden"), document.getElementById("usa")];

//add event listener on HTML-elements
login.addEventListener('submit', (e) => {
  e.preventDefault();
  hide(login);
  show(occupation);
})
occupationOptions.forEach((option) => {
  option.addEventListener('click', () => {
    hide(occupation);
    show(transport);
  })
});
transportOptions.forEach((option) => {
  option.addEventListener('click', () => {
    pig.src = `img/transport/${option.id}.png`;
    hide(transport);
    show(country);
  })
});
countryOptions.forEach((option) => {
  option.addEventListener('click', () => {
    hide(country);
    show(canvas);
    startGame = true;
    fox.src = "img/barriers/fox.png";
    hole.src = "img/barriers/hole.png";
    man.src = "img/barriers/man.png";
    codesford.src = "img/codesford.png";
    background.src = `img/background/${option.id}.png`;
    // when background is loaded we can find background2X and draw on canvas
    background.onload = () => {
      background2X = background.width;
      draw();
    }
  })
});

//audio
const jump = new Audio();
const winMusic = new Audio();
jump.src = "audio/fly.mp3";
winMusic.src = "audio/score.mp3";


//keypress handler
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case 'ArrowLeft':
      movePig(-1);
      break;

    case 'ArrowRight':
      movePig(1);
      break;

    case 'ArrowUp':
      jumpPig(1);
      break;

    case 'ArrowDown':
      jumpPig(-1);
      break;

    default:
      break;
  }
});


document.addEventListener("mousedown", () => {
  jumpPig(1);
});

//move pig up or down
function jumpPig(direction) {
  if (startGame) {
    if (direction === 1 && yPos > 40) {
      jump.play();
      yPos -= jumpUp
    } else if (direction === -1 && yPos < canvas.height - pigHeight - jumpDown) {
      jump.play();
      yPos += jumpDown
    }
  }
}

//coordinates of barriers
const barriers = {
  fox: {
    name: fox,
    x: 1000,
    y: 610
  },
  man: {
    name: man,
    x: 2000,
    y: 360
  },
  hole: {
    name: hole,
    x: 2600,
    y: 670,
  },
  codesford: {
    name: codesford,
    x: 3500,
    y: 150,
  },
};

//names of barriers
const allBarriers = Object.keys(barriers);

//move pig left or right
function movePig(direction) {
  xPos += speed * direction;
}

//illusion of the infinite background
function moveBackground () {
  background1X -= backgroundSpeed;
  background2X -= backgroundSpeed;
  if (background1X <= -background.width) {
    background1X = 0;
    background2X = background.width;
  }
}

//collision check
const checkCollision = (barrierX, barrierY, image) => {
  const collisionX = barrierX <= xPos + pigWidth - speed && barrierX + image.width >= xPos + pigWidth
  const collisionY = barrierY <= yPos + pigHeight - jumpDown;
  return collisionX && collisionY;
}

function draw() {
  //draw all images on canvas
  ctx.drawImage(background, background1X, background1Y);
  ctx.drawImage(background, background2X, background2Y);
  ctx.drawImage(pig, xPos, yPos, pigWidth, pigHeight);

  //draw all barriers on canvas
  allBarriers.forEach((key) => {
    const { name, x, y } = barriers[key];
    ctx.drawImage(name, x, y);
    //move barriers to the left
    barriers[key].x -= backgroundSpeed;
    // collision check
    if (checkCollision(x, y, name)) {
      if (name === codesford) {
        if (startGame) {
          startGame = false;
          winMusic.play();
          hide(canvas);
          show(win);
        }
      } else {
        startGame = false;
        hide(canvas);
        show(fail);
      }
    }
  });

  //if pig is not on the road we let it down
  if (yPos < normalPigY) {
    yPos += 1;
  }

  //move background
  moveBackground();

  //update canvas(redrawing with news coordinates)
  requestAnimationFrame(draw);
}
