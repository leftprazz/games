/*? no js js needed from me */
const board = document.querySelector(".board");
const toggleButton = document.querySelector(".toggle-controls");
const controlsDiv = document.querySelector(".controls");
document.documentElement.requestFullscreen();

console.log(board);

function requestFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

document.addEventListener("click", function () {
  requestFullscreen();
});

function randomPosition() {
  return ~~(Math.random() * 15) + 1;
}

toggleButton.addEventListener("click", () => {
  controlsDiv.classList.toggle("hidden");
});


let config = {
  speed: 250, //milli second
  level: 0,
  score: 0,
  player: {
    x: randomPosition(),
    y: randomPosition(),
  },
  food: {
    x: randomPosition(),
    y: randomPosition(),
  },
  velocity: {
    x: 0,
    y: 0,
  },
  titles: [
    "Hello there!",
    "My name is Pras",
    "I'm a DevOps Engineer",
    "Informatics graduate students",
    "With a 3.72 GPA \u{1F60E}",
    {
      title: "✨ Klik teks ini untuk melihat Portfolioku ✨",
      link: "https://portfolio.leftprazz.com",
    },
    "Enjoy the game :)",
  ],
  currentIndex: 0,
  showTitle() {
    const title = document.getElementById("title__1");
    const currentTitle = this.titles[this.currentIndex];
    if (typeof currentTitle === "object") {
      title.innerHTML = `<a href="${currentTitle.link}" target="_blank">${currentTitle.title}</a>`;
    } else {
      title.innerText = currentTitle;
    }
    title.style.opacity = "1";
    title.style.visibility = "visible";
    title.style.zIndex = "1";

    if (
      currentTitle.title === "✨ Klik teks ini untuk melihat Portfolioku ✨"
    ) {
      setTimeout(() => {
        title.style.opacity = "0";
        title.style.visibility = "hidden";
        title.style.zIndex = "-1";
        this.currentIndex = (this.currentIndex + 1) % this.titles.length;
      }, 5000);
      return;
    }

    setTimeout(() => {
      title.style.opacity = "0";
      title.style.visibility = "hidden";
      title.style.zIndex = "-1";
      this.currentIndex = (this.currentIndex + 1) % this.titles.length;
    }, 2000);
  },
};

let lastPosition = { x: 0, y: 0 };

const games = {
  createFood() {
    board.innerHTML = `<div class="food" style="grid-area: ${config.food.y} / ${config.food.x}"></div>`;
  },
  createPlayer() {
    board.innerHTML += `<div class="player" id="player" style="grid-area: ${config.player.y} / ${config.player.x}"></div>`;
  },
  movePlayer() {
    config.player.x += config.velocity.x;
    config.player.y += config.velocity.y;
  },
  resetPlayerPosition() {
    if (
      config.player.x <= 0 ||
      config.player.x > 15 ||
      config.player.y <= 0 ||
      config.player.y > 15
    ) {
      console.log("aw kalah....");
      // Perubahan pada bagian ini
      config.velocity.x *= -1;
      config.velocity.y *= -1;
      config.player.x = lastPosition.x;
      config.player.y = lastPosition.y;
      config.score = 0;
      document.getElementById("score").innerHTML = config.score;
    } else {
      lastPosition.x = config.player.x;
      lastPosition.y = config.player.y;
    }
  },
  levelUp() {
    config.level += 1;
    config.score += 1; // tambahkan 11 poin pada setiap level up
    console.log(config.level);
    console.log(config.score); // tampilkan nilai skor pada konsol
  },
  isWin() {
    if (
      config.player.x === config.food.x &&
      config.player.y === config.food.y
    ) {
      config.showTitle();
      this.levelUp();
      const scoreEl = document.getElementById("score"); // ambil elemen untuk menampilkan skor
      scoreEl.textContent = config.score; // tampilkan nilai skor pada halaman HTML
      return true;
    }
    return false;
  },

  randomFoodPosition() {
    config.food.x = randomPosition();
    config.food.y = randomPosition();
  },
};
function movement(listen) {
  switch (listen.key) {
    case "w": //ArrowUp
      config.velocity.y = -1;
      config.velocity.x = 0;
      break;
    case "s": //ArrowDown
      config.velocity.y = 1;
      config.velocity.x = 0;
      break;
    case "a": //ArrowLeft
      config.velocity.x = -1;
      config.velocity.y = 0;
      break;
    case "d": //ArrowRight
      config.velocity.x = 1;
      config.velocity.y = 0;
      break;
    default:
      break;
  }
}

function headMovement() {
  const playerEl = document.getElementById("player");
  if (config.velocity.x == 1) {
    playerEl.style.transform = "scaleX(-1)";
  }
  if (config.velocity.y == -1) {
    playerEl.style.transform = "rotate(90deg)";
  }
  if (config.velocity.y == 1) {
    playerEl.style.transform = "rotate(-90deg)";
  }
}

// Event listener untuk tombol panah atas
document.getElementById("right").addEventListener("click", function () {
  movement({ key: "w" });
});

// Event listener untuk tombol panah bawah
document.getElementById("left").addEventListener("click", function () {
  movement({ key: "s" });
});

// Event listener untuk tombol panah kiri
document.getElementById("up").addEventListener("click", function () {
  movement({ key: "a" });
});

// Event listener untuk tombol panah kanan
document.getElementById("down").addEventListener("click", function () {
  movement({ key: "d" });
});

function start() {
  games.createFood();
  games.createPlayer();
  games.movePlayer();
  headMovement();
  console.log(games.score);

  games.resetPlayerPosition();
  const win = games.isWin();
  if (win) games.randomFoodPosition();
}

setInterval(start, config.speed);
document.addEventListener("keydown", movement);
