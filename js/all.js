const drawDisplay = document.querySelector('.js-draw');
const draw3by3  = document.querySelector('.js-draw3by3');
const drawSave = document.querySelector('.js-save');
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
const checkBox3by3 = document.getElementById('3by3');

const draw = function (){
  // 開始與結束座標 [x 軸, y 軸]
  let startXY = []
  let endXY = []
  // 畫筆顏色暫存 [所選顏色，淺, 更淺]
  let newColors = []
  // 所選顏色
  let newColor = ''
  // 畫筆粗細，預設為 5
  let lineWidth = 5
  // 畫版圖案暫存，[第一筆, 第二筆, 第三筆, ...] 
  let drawTemp = []
  // base64 暫存圖檔之字串
  let base64Temp = ''
  // 畫筆步驟，當畫下第一筆後，讓數值與陣列索引相同
  // 第一筆為暫存圖檔之陣列[0]
  let step = -1
  let vm = this
  // canvas 繪製使用 '2d' 
  let ctx = drawDisplay.getContext('2d');
  let ctx3by3 = draw3by3.getContext('2d');
  let ctxWidth = 1280
  let ctxHeight = 768
  
  // 繪製圖樣
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
  this.canvas3by3 = (e) => {
    if (draw3by3.getContext && e.target.checked === true) {
      // 橫向兩條
      ctx3by3.beginPath();
      ctx3by3.moveTo(0, ctxHeight*0.33)
      ctx3by3.lineTo(ctxWidth, ctxHeight*0.33)
      ctx3by3.strokeStyle = '#aaaaaa'
      ctx3by3.lineWidth = 1
      ctx3by3.stroke(); 
      ctx3by3.beginPath();
      ctx3by3.moveTo(0, ctxHeight*0.66)
      ctx3by3.lineTo(ctxWidth, ctxHeight*0.66)
      ctx3by3.stroke(); 
      // 直向兩條
      ctx3by3.beginPath();
      ctx3by3.moveTo(ctxWidth*0.33, 0)
      ctx3by3.lineTo(ctxWidth*0.33, ctxHeight)
      ctx3by3.stroke(); 
      ctx3by3.beginPath();
      ctx3by3.moveTo(ctxWidth*0.66, 0)
      ctx3by3.lineTo(ctxWidth*0.66, ctxHeight)
      ctx3by3.stroke(); 
      ctx3by3.strokeStyle = '#000000'
      ctx3by3.lineWidth = 5
      drawDisplay.style.backgroundColor = 'transparent'
    } else {
      drawDisplay.style.backgroundColor = '#E8E8E8'
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
      ctx.clearRect(0,0, ctxWidth, ctxHeight)
      lastDraw.onload = () => {
        ctx.drawImage(lastDraw, 0, 0)
      }
    }
  }
  this.save = () => {
    drawSave.href = base64Temp 
  }
  this.redo = () => {
    let lastDraw  = new Image()
    if (step < drawTemp.length - 1) {
      step++
      lastDraw.src = drawTemp[step]
      ctx.beginPath();
      ctx.clearRect(0,0, ctxWidth, ctxHeight)
      lastDraw.onload = () => {
        ctx.drawImage(lastDraw, 0, 0)
      }
    }
  }
  this.clearAll = () => {
    ctx.clearRect(0,0, ctxWidth, ctxHeight)
    step = 0
    drawTemp = []
  }
  // 畫筆顏色初始化，顏色依照相近色顯示
  this.colorsInit = (color) => {
    newColors = []
    // 將 hex 格式轉成 rgb 格式
    let r = parseInt(color.substr(1,2), 16)
    let g = parseInt(color.substr(3,2), 16)
    let b = parseInt(color.substr(5,2), 16)
    let secondaryColor = `rgba(${r}, ${g}, ${b}, 0.75)`
    let thirdColor = `rgba(${r}, ${g}, ${b}, 0.55)`
    let newArray = Array.from(colorBtns) 
    newArray[2].style.backgroundColor = color
    newArray[3].style.backgroundColor = secondaryColor     
    newArray[4].style.backgroundColor = thirdColor  
    newColors.push(color, secondaryColor , thirdColor) 
    colorBtns.forEach(item => {
      item.classList.remove('custom__colorBtn--active')
    })
  }
  // 顏色選擇後，初始化畫筆顏色
  this.colorSelect = (e) => {
    vm.colorsInit(e.target.value)
  }
  // 選擇畫筆顏色與選擇時效果
  this.drawPen = (e) => {
    colorBtns.forEach(item => {
      item.classList.remove('custom__colorBtn--active')
    })
    e.target.classList.add('custom__colorBtn--active')
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
  // 更改畫筆粗細
  this.range = (e) => {
    lineWidth__value.textContent = e.target.value
    lineWidth = e.target.value
  }
  // 重置畫版大小
  this.resize = () => {
    ctxWidth =  window.innerWidth
    ctxHeight =  window.innerHeight
    drawDisplay.width =  window.innerWidth
    draw3by3.width =  window.innerWidth
    drawDisplay.height =  window.innerHeight
    draw3by3.height =  window.innerHeight
    checkBox3by3.checked = false
  }
  vm.colorsInit(colorSelect.value)
  vm.resize()
}
  
const newDraw = new draw()
drawDisplay.addEventListener('mousedown', newDraw.mouseDown)  

/* 畫版功能列 */
drawSave .addEventListener('click', newDraw.save)  
drawUndo.addEventListener('click', newDraw.undo)  
drawRedo.addEventListener('click', newDraw.redo)  
drawClearAll.addEventListener('click', newDraw.clearAll)  

/* 畫版工具列 */
colorSelect.addEventListener('change', newDraw.colorSelect)
colorBtns.forEach( item => {
  item.addEventListener('click', newDraw.drawPen)
})
lineWidth.addEventListener('change', newDraw.range)
checkBox3by3.addEventListener('change', newDraw.canvas3by3)

/* 摺疊開關 */
nav__btn.addEventListener('click', (e) => {
  if (e.target.textContent === 'arrow_drop_up' ) {
    e.target.textContent = 'arrow_drop_down'
    nav.style.top = '-47px'
    e.target.style.top = '0px'
  } else {
    e.target.textContent = 'arrow_drop_up'
    nav.style.top = '0'
    e.target.style.top = '47px'
  }
}) 
drawTool__btn.addEventListener('click', (e) => {
  console.log(e.target.textContent)
  if (e.target.textContent === 'arrow_drop_down') {
    e.target.style.bottom = '8%'
    e.target.textContent = 'brush'
    drawTool.style.opacity = '0'
    drawTool.classList.add('d-none')
  } else {
    e.target.style.bottom = '13%'
    e.target.textContent = 'arrow_drop_down'
    drawTool.style.opacity = '1'
    drawTool.classList.remove('d-none')
  }
})
window.addEventListener('resize', newDraw.resize)