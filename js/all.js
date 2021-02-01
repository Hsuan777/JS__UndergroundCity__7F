const drawDisplay = document.querySelector('.js-draw');
const drawUndo = document.querySelector('.js-undo');
const drawRedo = document.querySelector('.js-redo');
const drawClearAll = document.querySelector('.js-clearAll');
const colorSelect = document.querySelector('.js-colorSelect');
const colorType = document.querySelector('.custom__colorSelect');
const colorSecondaryType = document.querySelector('.custom__colorSelect__secondaryType');
const colorThirdType = document.querySelector('.custom__colorSelect__thirdType');

const draw = function (){
  let startXY = []
  let endXY = []
  let colors = []
  let linewidth = []
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
      ctx.strokeStyle = '#ffa500'
      ctx.lineWidth = 5
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
      ctx.clearRect(0,0, 700, 500)
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
      ctx.clearRect(0,0, 700, 500)
      lastDraw.onload = () => {
        ctx.drawImage(lastDraw, 0, 0)
      }
    }
  }
  this.clearAll = () => {
    ctx.clearRect(0,0, 700, 500)
    step = 0
    drawTemp = []
  }
  this.colorSelect = (e) => {
    let r = parseInt(e.target.value.substr(1,2), 16)
    let g = parseInt(e.target.value.substr(3,2), 16)
    let b = parseInt(e.target.value.substr(5,2), 16)
    colorType.style.backgroundColor = e.target.value
    colorSecondaryType.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.85)`
    colorThirdType.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.75)`
  }
}
  
const newDraw = new draw()
drawDisplay.addEventListener('mousedown', newDraw.mouseDown)  
drawUndo.addEventListener('click', newDraw.undo)  
drawRedo.addEventListener('click', newDraw.redo)  
drawClearAll.addEventListener('click', newDraw.clearAll)  
colorSelect.addEventListener('change', newDraw.colorSelect)