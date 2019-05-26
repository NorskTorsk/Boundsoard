const soundsElement = document.querySelector('#sounds');
const stopButton = document.querySelector('#stopButton');
const players = [];

let keyCodes = [81, 87, 69, 82, 65, 83, 68, 70, 90, 88, 67, 86];

stopButton.addEventListener('click', stopAll);

(async () => {
  const sounds = await getSounds();
  addSoundsToPage(sounds);
})();

async function getSounds() {
  const response = await fetch('./sounds.json');
  const json = await response.json();
  return json;
}

function addSoundsToPage(sounds) {
  sounds.forEach(addSoundToPage);

  listenKeyPress();
}

function addSoundToPage(sound, index) {
  const soundDiv = document.createElement('div');
  soundDiv.className = 'sound';

  const soundTitle = document.createElement('h2');
  /* soundTitle.textContent = sound.title; */
  soundTitle.textContent = sound.src;
  soundDiv.appendChild(soundTitle);


  const key = document.createElement('img');
  key.setAttribute('src', `keys/${keyCodes[index]}.png`)
  /* key.setAttribute('style', 'display: none') */
  soundDiv.appendChild(key);
  

    const soundText = document.createElement('span');
    soundText.textContent = `${String.fromCharCode(keyCodes[index])}`;
    soundText.className = 'KeyCodeText';
    soundDiv.appendChild(soundText);

  const player = document.createElement('audio');
  player.setAttribute('src', `sounds/${sound.src}`)
  soundDiv.appendChild(player);
  players.push({ player, soundDiv, key });

  soundDiv.addEventListener('mousedown', () => {
    soundPress(soundDiv, player);
  });

  soundDiv.addEventListener('mouseup', () => {
    soundDiv.style.background = '';
  });

  soundsElement.appendChild(soundDiv);
}

function soundPress(div, player) {
  div.style.background = '#00477a';
  player.currentTime = 0;
  player.play();
}

function listenKeyPress() {
  document.addEventListener('keydown', (event) => {
    /* console.log(event); */
    if (event.keyCode == 32) return stopAll();
    const playerIndex = keyCodes.indexOf(event.keyCode);
    const playerAndDiv = players[playerIndex];
    if (playerAndDiv && !playerAndDiv.keydown) {
      playerAndDiv.keydown = true;
      playerAndDiv.key.style.transform = 'scaleY(0.75)';
      soundPress(playerAndDiv.soundDiv, playerAndDiv.player);
    }
  });

  document.addEventListener('keyup', (event) => {
    const playerIndex = keyCodes.indexOf(event.keyCode);
    const playerAndDiv = players[playerIndex];
    if (playerAndDiv) {
      playerAndDiv.soundDiv.style.background = '';
      playerAndDiv.keydown = false;
      playerAndDiv.key.style.transform = '';
    }
  });
}

function stopAll() {
  players.forEach(({player}) => {
    player.pause();
  });
}