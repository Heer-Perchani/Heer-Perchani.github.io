const scenes = ['scene0.png','scene1.png','scene2.png','scene3.png','scene4.png'];
let currentScene = 0;

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