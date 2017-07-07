const scrollToBotBySelector = selector => {
  const block = document.querySelector(selector)
  block.scrollTop = block.scrollHeight
}


export default {
  scrollToBotBySelector 
}
