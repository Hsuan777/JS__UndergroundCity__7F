const drawDisplay = document.querySelector('.js-draw');
const drawUndo = document.querySelector('.js-undo');
const drawRedo = document.querySelector('.js-redo');
const drawClearAll = document.querySelector('.js-clearAll');
const jsImg = document.querySelector('.jsImg');

const draw = function (){
  let startXY = []
  let endXY = []
  let colors = []
  let linewidth = []
  let drawTemp = []
  let base64temp = ''
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
      ctx.stroke() 
      base64temp = drawDisplay.toDataURL()
      jsImg.src = base64temp 
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
    step++
    if (step < drawTemp.length) drawTemp.length = step
    drawTemp.push(base64temp)
    drawDisplay.removeEventListener('mousemove', vm.mouseMove) 
    drawDisplay.removeEventListener('mouseup', vm.mouseUp) 
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
    if (step >= 0) step--
    lastDraw.src = drawTemp[step]
    jsImg.src = drawTemp[step]
    ctx.beginPath()
    ctx.clearRect(0,0, 700, 500)
    ctx.drawImage(lastDraw, 0, 0)
  }
  this.redo = () => {
    let lastDraw  = new Image()
    if (step < drawTemp.length) step++
    lastDraw.src = drawTemp[step]
    jsImg.src = drawTemp[step]
    ctx.beginPath()
    ctx.clearRect(0,0, 700, 500)
    ctx.drawImage(lastDraw, 0, 0)
  }
  this.clearAll = () => {
    ctx.clearRect(0,0, 700, 500)
    step = 0
    drawTemp = []
  }
}
  
const newDraw = new draw()
drawDisplay.addEventListener('mousedown', newDraw.mouseDown)  
drawUndo.addEventListener('click', newDraw.undo)  
drawRedo.addEventListener('click', newDraw.redo)  
drawClearAll.addEventListener('click', newDraw.clearAll)  
  