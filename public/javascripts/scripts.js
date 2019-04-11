(function () {
    var canvas = document.querySelector('#paint')
    var ctx = canvas.getContext('2d')
    var ctx2 = canvas.getContext('2d')
    var socket = io()


    var sketch = document.querySelector('#sketch')
    var sketch_style = getComputedStyle(sketch)
    var sketch_board = document.querySelector('#sketch_board')
    canvas.width = parseInt(sketch_style.getPropertyValue('width'))
    canvas.height = parseInt(sketch_style.getPropertyValue('height'))

    var mouse = { x: 0, y: 0 }

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function (e) {
        mouse.x = e.pageX - sketch_board.offsetLeft
        mouse.y = e.pageY - sketch_board.offsetTop
    }, false)

    /* Drawing on Paint App */
    ctx.lineWidth = document.querySelector('#slider1').value = 5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = document.querySelector('#colorpicker').value = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

    canvas.addEventListener('mousedown', function (e) {
        ctx.strokeStyle = document.querySelector('#colorpicker').value
        ctx.beginPath()
        ctx.moveTo(mouse.x, mouse.y)
        canvas.addEventListener('mousemove', onPaint, false)

    }, false)

    canvas.addEventListener('mouseup', function () {
        canvas.removeEventListener('mousemove', onPaint, false)

    }, false)

    var onPaint = function () {
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
        socket.emit('draw_data', { data: mouse, color: ctx.strokeStyle, size: ctx.lineWidth })
    }
    document.querySelector('#colorpicker').addEventListener('change', function (data) {
        ctx.strokeStyle = event.target.value
    }, false)

    document.querySelector('#slider1').addEventListener('change', function () {
        ctx.lineWidth = this.value
    })

    ///drawing the other 
    socket.on('drawother', function (data) {
        drawothers(data)
    })
    var drawothers = function (data) {
        ctx2.lineWidth = data.size
        ctx2.lineJoin = 'round'
        ctx2.lineCap = 'round'
        ctx2.strokeStyle = data.color
        ctx2.beginPath()
        ctx2.moveTo(data.data.x, data.data.y)
        canvas.addEventListener('mousemove', paintother(data), false)
    }
    var paintother = function (data) {
        ctx2.lineTo(data.data.x, data.data.y)
        ctx2.stroke()
    }

}()) 