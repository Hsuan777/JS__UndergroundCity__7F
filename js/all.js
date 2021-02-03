const drawDisplay = document.querySelector('.js-draw');
const drawUndo = document.querySelector('.js-undo');
const drawRedo = document.querySelector('.js-redo');
const drawClearAll = document.querySelector('.js-clearAll');
const colorSelect = document.querySelector('.js-colorSelect');
const colorBtns = document.querySelectorAll('.custom__colorBtn');
const lineWidth = document.querySelector('.js-lineWidth');
const lineWidth__value = document.querySelector('.js-lineWidth__value');
const nav = document.querySelector('.js-nav');
const nav__btn = document.querySelector('.js-nav__btn');
const drawTool = document.querySelector('.js-tool');
const drawTool__btn  = document.querySelector('.js-tool__btn');

const draw = function (){
  let startXY = []
  let endXY = []
  let newColors = []
  let newColor = '#000000'
  let lineWidth = 5 
  let drawTemp = []
  let base64Temp = ''
  let step = -1
  let vm = this 
  let ctx = drawDisplay.getContext('2d');
  
  this.canvas = () => {
    if (drawDisplay.getContext){
      ctx.beginPath();
      ctx.moveTo(startXY[0], startXY[1]);
      ctx.lineTo(endXY[0], endXY[1]);
      ctx.strokeStyle = newColor
      ctx.lineWidth = lineWidth 
      ctx.stroke(); 
      base64Temp = drawDisplay.toDataURL();
    }
  }
  // 滑鼠經過的所有座標
  this.mouseMove = (e) => {
    endXY = [startXY[0], startXY[1]]
    startXY = [e.offsetX, e.offsetY]
    vm.canvas()
  }
  // 滑鼠放開為終點
  this.mouseUp = () => {
    endXY = []
    drawDisplay.removeEventListener('mousemove', vm.mouseMove) 
    drawDisplay.removeEventListener('mouseup', vm.mouseUp) 
    step++
    if (step < drawTemp.length) {
      drawTemp.length = step
    }
    drawTemp.push(base64Temp)
  }
  // 滑鼠按下為起點
  this.mouseDown = (e) => {
    startXY = []
    drawDisplay.addEventListener('mousemove', vm.mouseMove)  
    drawDisplay.addEventListener('mouseup', vm.mouseUp)
    startXY = [e.offsetX, e.offsetY]
  }
  this.undo = () => {
    let lastDraw  = new Image()
    if (step >= 0) {
      step--
      lastDraw.src = drawTemp[step]
      ctx.beginPath();
      ctx.clearRect(0,0, 1280, 768)
      lastDraw.onload = () => {
        ctx.drawImage(lastDraw, 0, 0)
      }
    }
  }
  this.redo = () => {
    let lastDraw  = new Image()
    if (step < drawTemp.length - 1) {
      step++
      lastDraw.src = drawTemp[step]
      ctx.beginPath();
      ctx.clearRect(0,0, 1280, 768)
      lastDraw.onload = () => {
        ctx.drawImage(lastDraw, 0, 0)
      }
    }
  }
  this.clearAll = () => {
    ctx.clearRect(0,0, 1280, 768)
    step = 0
    drawTemp = []
  }
  this.colorsInit = (color) => {
    newColors = []
    let r = parseInt(color.substr(1,2), 16)
    let g = parseInt(color.substr(3,2), 16)
    let b = parseInt(color.substr(5,2), 16)
    let secondaryColor = `rgba(${r}, ${g}, ${b}, 0.75)`
    let thridColor = `rgba(${r}, ${g}, ${b}, 0.55)`
    let newArray = Array.from(colorBtns) 
    newArray[2].style.backgroundColor = color
    newArray[3].style.backgroundColor = secondaryColor     
    newArray[4].style.backgroundColor = thridColor  
    newColors.push(color, secondaryColor , thridColor) 
    colorBtns.forEach(item => {
      item.classList.remove('custom__colorBtn--active')
    })
  }
  this.colorSelect = (e) => {
    vm.colorsInit(e.target.value)
  }
  this.drawPen = (e) => {
    colorBtns.forEach(item => {
      item.classList.remove('custom__colorBtn--active')
    })
    e.target.classList.add('custom__colorBtn--active')
    console.dir(e.target)
    switch(e.target.value){
      case 'primaryColor':
        newColor = newColors[0]
        break;
      case 'secondaryColor':
        newColor = newColors[1]
        break;
      case 'thirdColor':
        newColor = newColors[2]
        break;
      case 'white':
        newColor = '#ffffff'
        break;
      case 'dark':
        newColor = '#000000'
        break;
    }
  }
  this.range = (e) => {
    lineWidth__value.textContent = e.target.value
    lineWidth = e.target.value
  }
  vm.colorsInit(colorSelect.value)
}
  
const newDraw = new draw()
drawDisplay.addEventListener('mousedown', newDraw.mouseDown)  
drawUndo.addEventListener('click', newDraw.undo)  
drawRedo.addEventListener('click', newDraw.redo)  
drawClearAll.addEventListener('click', newDraw.clearAll)  
colorSelect.addEventListener('change', newDraw.colorSelect)
colorBtns.forEach( item => {
  item.addEventListener('click', newDraw.drawPen)
})
lineWidth.addEventListener('change', newDraw.range)
nav__btn.addEventListener('click', (e) => {
  if (e.target.textContent === 'arrow_drop_up' ) {
    e.target.textContent = 'arrow_drop_down'
    nav.style.transform = 'translateY(-38px)'
    e.target.style.top = '0px'
  } else {
    e.target.textContent = 'arrow_drop_up'
    nav.style.transform = 'translateY(0px)'
    e.target.style.top = '38px'
  }
}) 
drawTool__btn.addEventListener('click', (e) => {
  if (drawTool.style.opacity === '1') {
    e.target.style.bottom = '5%'
    e.target.textContent = 'brush'
    drawTool.style.opacity = '0'
    drawTool.classList.add('d-none')
  } else {
    e.target.style.bottom = '10%'
    e.target.textContent = 'arrow_drop_down'
    drawTool.style.opacity = '1'
    drawTool.classList.remove('d-none')
  }
})
