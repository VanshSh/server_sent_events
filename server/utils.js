const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export function generateData() {
  const currentTime = new Date().toLocaleTimeString()
  const message = {
    time: currentTime,
    image: `https://picsum.photos/50/50?random=${randomNumber(1, 100)}`,
  }
  return JSON.stringify(message)
}
