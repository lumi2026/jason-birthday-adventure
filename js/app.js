const $ = (id) => document.getElementById(id);

let missionIndex = 0;

const introScreen = $("introScreen");
const missionScreen = $("missionScreen");
const successScreen = $("successScreen");
const finalScreen = $("finalScreen");
const statusChip = $("statusChip");
const route = $("route");
const missionCount = $("missionCount");
const missionEyebrow = $("missionEyebrow");
const missionTitle = $("missionTitle");
const missionMessage = $("missionMessage");
const answerInput = $("answerInput");
const decryptBtn = $("decryptBtn");
const feedback = $("feedback");
const progressBar = $("progressBar");
const destinationBox = $("destinationBox");
const planetName = $("planetName");
const planetLocation = $("planetLocation");
const continueBtn = $("continueBtn");

function showScreen(screen) {
  [introScreen, missionScreen, successScreen, finalScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function roman(n) {
  return ["I","II","III","IV","V"][n] || String(n + 1);
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildRoute() {
  route.innerHTML = "";
  CONFIG.missions.forEach((_, idx) => {
    const node = document.createElement("div");
    node.className = "route-node";
    if (idx < missionIndex) node.classList.add("done");
    if (idx === missionIndex) node.classList.add("active");

    const dot = document.createElement("div");
    dot.className = "planet-dot";
    dot.textContent = idx < missionIndex ? "✓" : idx + 1;

    const line = document.createElement("div");
    line.className = "route-line";

    node.appendChild(dot);
    node.appendChild(line);
    route.appendChild(node);
  });
  missionCount.textContent = `MISSION ${missionIndex + 1} OF ${CONFIG.missions.length}`;
}

function loadMission() {
  const m = CONFIG.missions[missionIndex];
  buildRoute();
  missionEyebrow.textContent = `MISSION ${roman(missionIndex)}`;
  missionTitle.textContent = m.title;
  missionMessage.textContent = m.message;
  answerInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  statusChip.textContent = "ACTIVE";
  showScreen(missionScreen);
  setTimeout(() => answerInput.focus(), 50);
}

function checkAnswer() {
  const m = CONFIG.missions[missionIndex];
  const value = normalize(answerInput.value);
  const ok = m.answers.map(normalize).includes(value);

  if (!value) {
    feedback.textContent = "⚠ ENTER AN AUTHORIZATION CODE";
    return;
  }

  if (!ok) {
    feedback.textContent = "⚠ IMPERIAL FIREWALL DETECTED — CODE REJECTED. TRY AGAIN, PADAWAN.";
    answerInput.select();
    return;
  }

  feedback.textContent = "AUTHORIZATION VERIFIED";
  feedback.className = "feedback ok";
  setTimeout(startSuccessSequence, 300);
}

function startSuccessSequence() {
  const m = CONFIG.missions[missionIndex];
  showScreen(successScreen);
  statusChip.textContent = "DECRYPTING";
  destinationBox.classList.add("hidden");
  progressBar.style.width = "0%";
  planetName.textContent = "";
  planetLocation.textContent = "";

  requestAnimationFrame(() => {
    setTimeout(() => progressBar.style.width = "100%", 100);
  });

  setTimeout(() => {
    planetName.textContent = m.planet;
    planetLocation.textContent = m.location;
    destinationBox.classList.remove("hidden");

    if (missionIndex === CONFIG.missions.length - 1) {
      continueBtn.textContent = "REVEAL TREASURE";
    } else {
      continueBtn.textContent = "CONTINUE MISSION";
    }
  }, 1750);
}

function nextStep() {
  if (missionIndex === CONFIG.missions.length - 1) {
    $("treasureLocation").textContent = CONFIG.giftLocation;
    statusChip.textContent = "SUCCESS";
    showScreen(finalScreen);
    launchConfetti();
    return;
  }
  missionIndex += 1;
  loadMission();
}

function launchConfetti() {
  const holder = $("confetti");
  holder.innerHTML = "";
  const colors = ["#ffd54a", "#52c8ff", "#55ff99", "#ffffff"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
    holder.appendChild(piece);
  }
}

$("startBtn").addEventListener("click", loadMission);
decryptBtn.addEventListener("click", checkAnswer);
continueBtn.addEventListener("click", nextStep);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});
