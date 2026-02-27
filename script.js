let position = 0;

document.addEventListener("keydown", (e) => {
  const world = document.querySelector('.world');
  if (e.key === "ArrowRight") {
    position += 50; // speed of movement
    world.style.transform = `translateX(-${position}px)`;
  }
  if (e.key === "ArrowLeft") {
    position = Math.max(0, position - 50);
    world.style.transform = `translateX(-${position}px)`;
  }
});