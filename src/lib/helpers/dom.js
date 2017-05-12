const lockBody = () => {
  document.querySelector('body').classList.add('overflow-hidden')
  document.querySelector('body').classList.add('fixed-top')
}


const unlockBody = () => {
  document.querySelector('body').classList.remove('overflow-hidden')
  document.querySelector('body').classList.remove('fixed-top')
}


const scrollToBotBySelector = selector => {
  const block = document.querySelector(selector)
  block.scrollTop = block.scrollHeight
}


export default {
  lockBody,
  unlockBody,
  scrollToBotBySelector 
}
