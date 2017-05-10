const lockBody = () => {
  document.querySelector('body').classList.add('overflow-hidden')
  document.querySelector('body').classList.add('fixed-top')
}


const unlockBody = () => {
  document.querySelector('body').classList.remove('overflow-hidden')
  document.querySelector('body').classList.remove('fixed-top')
}


export default {
  lockBody,
  unlockBody
}
