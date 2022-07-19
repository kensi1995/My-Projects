function StopWatch() {
  var mmilliSeconds = 0;
  var seconds = 0;
  var minutes = 0;
  var interval;
  var timer = document.getElementById("timer");
  var lap = document.getElementById("lap-container");
  var isRunning = false;
  isLapClicked = false;
  var currentTime = function () {
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }:${mmilliSeconds < 10 ? "0" + mmilliSeconds : mmilliSeconds}`;
  };
  var counter = function () {
    mmilliSeconds++;
    if (mmilliSeconds > 99) {
      seconds++;
      mmilliSeconds = 0;
    }
    if (seconds > 59) {
      minutes++;
      seconds = 0;
    }
    timer.innerHTML = currentTime();
  };
  this.start = function () {
    if (isRunning) return;
    isRunning = true;
    interval = setInterval(counter, 10);
    console.log("start");
  };
  this.stop = function () {
    if (!isRunning) return;
    clearInterval(interval);
    isRunning = false;
    isLapClicked = false;
  };
  this.lap = function () {
    if (mmilliSeconds === 0 && seconds === 0 && minutes === 0) return;
    if (!isRunning && isLapClicked) return;
    var h3 = document.createElement("h3");
    lap.appendChild(h3);
    h3.innerHTML = currentTime();
    isLapClicked = true;
  };
  this.restart = function () {
    mmilliSeconds = 0;
    seconds = 0;
    minutes = 0;
    lap.innerHTML = "";
    clearInterval(interval);
    timer.innerHTML = currentTime();
    isRunning = false;
  };
}
