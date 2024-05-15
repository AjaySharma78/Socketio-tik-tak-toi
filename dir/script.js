const socket = io();
let start = document.querySelector("#start");
let start_box = document.querySelector("#start_box");
start.addEventListener("click", () => {
  start_box.classList.toggle("visible" ? "invisible" : "visible");
});

let play_boxes_container = document.getElementById("main");
let play_boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
play_boxes.forEach(() => {
  play_boxes_container.innerHTML += `<button id="box"class="size-24 bg-[#000000] rounded-md text-5xl"></button>`;
});
let boxes = document.querySelectorAll("#box");
let reset_but = document.querySelector("#reset");
let text = document.querySelector("p");
let turnO = true;
let patten = [
  [0, 1, 2],
  [0, 4, 8],
  [0, 3, 6],
  [2, 5, 8],
  [2, 4, 6],
  [1, 4, 7],
  [3, 4, 5],
  [6, 7, 8],
];

var count = 0;
socket.on("resetGame", () => {
  reset();
});

function reset() {
  turnO = true;
  boxes.forEach((e) => {
    e.classList.remove("bg-gray-700");
    e.disabled = false;
    e.innerText = "";
    count = 0;
  });
  text.innerText = `Game was reset`;
  setTimeout(() => {
    text.innerText = `Play`;
  }, 1500);
}
reset_but.addEventListener("click", () => {
  reset();
  socket.emit("reset");
});

boxes.forEach((e, index) => {
  e.addEventListener("click", () => {
    if (turnO) {
      if (turnO) {
       
        e.innerText = "X";
        e.classList.add("bg-gray-700");
      } else {
       
        e.innerText = "O";
        e.classList.add("bg-gray-700");
      }
    }
    socket.emit("playerMove", index);
    e.disabled = false;
    check();
  });
});

socket.on("updateGame", (index) => {
  const box = boxes[index];

  if (turnO) {
    box.innerText = "0";
    turnO = false;
    text.innerText = `X turn`;
    box.classList.add("bg-gray-700");
  } else {
    box.innerText = "x";
    text.innerText = `O turn`;
    turnO = true;

    box.classList.add("bg-gray-700");
  }

  box.disabled = true;
  count++;
  if (count == 9) {
    text.innerText = `Match is draw`;
    show();
    setTimeout(() => {
      reset();
    }, 2000);
  }
  check();
});
const show = () => {
  boxes.forEach((e) => {
    e.disabled = true;
    e.classList.add("bg-gray-700");
  });
};

const check = () => {
  patten.forEach((e) => {
    let p1 = boxes[e[0]].innerText;
    let p2 = boxes[e[1]].innerText;
    let p3 = boxes[e[2]].innerText;
    if (p1 != "" && p2 != "" && p3 != "") {
      if (p1 === p2 && p2 === p3) {
        text.innerText = `${p1} is a winner`;
        show();
      }
    }
  });
};

socket.on("maxPlayersReached", () => {
  alert("Maximum players reached. Cannot join the game.");
});
