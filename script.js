const scenes = ['scene0.png','scene1.png','scene2.png','scene3.png','scene4.png'];
let currentScene = 0;
const bubble = document.getElementById('bubble');

const world = document.querySelector('.world');
world.style.backgroundImage = `url('${scenes[currentScene]}')`; // initial setup

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft' && currentScene < scenes.length - 1){
    currentScene++;
    world.style.backgroundImage = `url('${scenes[currentScene]}')`;
  }
  if(e.key === 'ArrowRight' && currentScene > 0){
    currentScene--;
    world.style.backgroundImage = `url('${scenes[currentScene]}')`;
  }
});

window.addEventListener('load', () => {
  const character = document.getElementById('character');
  const bubble = document.getElementById('bubble');

  // swap to waving after 500ms
  setTimeout(() => {
    character.src = 'waving.png';
    bubble.classList.add('show');
  }, 500);
  setTimeout(() => {
    character.src = 'standing.png';
    bubble.textContent = "Press the left arrow key to move forward and click the flowers to view each item!";
  }, 2500);

  setTimeout(() => {
    bubble.classList.add('hide');
  }, 6000);
});

