export default function playSound(src) {
  const sound = new Audio(src);
  sound.volume = 1;
  sound.play();
}
