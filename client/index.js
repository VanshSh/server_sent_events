let source

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeBtn')
  const retryBtn = document.getElementById('retryBtn')
  const connectionIcon = document.getElementById('connectionStatus')
  const disconnectedIcon = document.getElementById('disconnectedStatus')
  const messagesDiv = document.getElementById('messages')

  closeBtn.addEventListener('click', closeConnection)
  retryBtn.addEventListener('click', retryConnection)

  connectToServer()
})

function connectToServer() {
  if (source) {
    closeConnection()
  }

  source = new EventSource('http://localhost:3000/events')

  source.addEventListener('open', handleOpenEvent)
  source.addEventListener('error', handleErrorEvent)
  source.addEventListener('close', handleCloseEvent)
  source.addEventListener('message', handleMessageEvent)
}

function handleOpenEvent() {
  console.log('Connection opened')
  setConnectionStatus(true)
  setButtonAttributes(true)
}

function handleErrorEvent() {
  console.log('Error occurred')
  setConnectionStatus(false)
  setButtonAttributes(false)
}

function handleCloseEvent() {
  console.log('Connection closed')
  setConnectionStatus(false)
  setButtonAttributes(false)
}

function handleMessageEvent(event) {
  console.log('Message received')
  const dataReceived = JSON.parse(event.data)
  const newImage = createImage(dataReceived.image)
  appendImageToMessagesDiv(newImage)
}

function closeConnection() {
  if (source) {
    fetch('http://localhost:3000/close')
    source.close()
    source = null
    setConnectionStatus(false)
    setButtonAttributes(false)
  }
}

function retryConnection() {
  fetch('http://localhost:3000/retry')
  connectToServer()
}

function createImage(src) {
  const newImage = document.createElement('img')
  newImage.src = src
  newImage.classList.add('m-2', 'border', 'border-primary', 'rounded', 'shadow')
  return newImage
}

function appendImageToMessagesDiv(image) {
  const messagesDiv = document.getElementById('messages')
  messagesDiv.appendChild(image)
}

function setConnectionStatus(isConnected) {
  const connectionIcon = document.getElementById('connectionStatus')
  const disconnectedIcon = document.getElementById('disconnectedStatus')

  if (isConnected) {
    connectionIcon.classList.remove('d-none')
    disconnectedIcon.classList.add('d-none')
  } else {
    connectionIcon.classList.add('d-none')
    disconnectedIcon.classList.remove('d-none')
  }
}

function setButtonAttributes(isConnected) {
  const closeBtn = document.getElementById('closeBtn')
  const retryBtn = document.getElementById('retryBtn')

  if (isConnected) {
    closeBtn.removeAttribute('disabled')
    retryBtn.setAttribute('disabled', '')
  } else {
    closeBtn.setAttribute('disabled', '')
    retryBtn.removeAttribute('disabled')
  }
}
