import React , { useRef, useEffect } from 'react';
import './signature2.css';

function Signature2(props) {
    // const canvas = useRef();
    // const image = useRef();
    let sketch, sketch_style, canvas, ctx, tmp_canvas, tmp_ctx,mouse, ppts;
    function init(){
        sketch = document.querySelector('#sketch');
        sketch_style = getComputedStyle(sketch); // get the styles as an object after its computed by rendering engine
        canvas = document.querySelector('#paint');
        ctx = canvas.getContext('2d');
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
        // Creating a tmp canvas
        tmp_canvas = document.createElement('canvas');
        tmp_ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = 'tmp_canvas';
        tmp_canvas.width = canvas.width;
        tmp_canvas.height = canvas.height;
        sketch.appendChild(tmp_canvas);
        // init mouse poits
        mouse = {x: 0, y: 0};
        // last_mouse = {x: 0, y: 0};
        // Pencil Points
        ppts = [];
        
        /* Drawing on Paint App */
        // ctx.shadowColor = "rgba(0,0,0,.9)";
        // ctx.shadowBlur = 1.2;
        tmp_ctx.lineWidth = 5;
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.lineCap = 'round';
        tmp_ctx.strokeStyle = 'blue';
        tmp_ctx.fillStyle = 'blue';
    
        /* Mouse Capturing Work , to get the starting x and y positions */
        tmp_canvas.addEventListener('mousemove', function(e) {
            // e.layerX is for Firefox
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
        }, false);
        
        // add mouse event after mouse click
        tmp_canvas.addEventListener('mousedown', function(e) {
            tmp_canvas.addEventListener('mousemove', onPaint, false);
            // e.layerX is for Firefox
            mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
            mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
            ppts.push({x: mouse.x, y: mouse.y});
            onPaint();
        }, false);
        
        tmp_canvas.addEventListener('mouseup', function() {
            tmp_canvas.removeEventListener('mousemove', onPaint, false);
            generateCurve();
        }, false);
        
        var onPaint = function() {
            // Saving all the points in an array
            ppts.push({x: mouse.x, y: mouse.y});
            strokePath(false);
        };

        function strokePath(regenerate = false){
            tmp_ctx.lineWidth = 5;
            if (ppts.length < 3) {
                var b = ppts[0];
                tmp_ctx.beginPath();
                //ctx.moveTo(b.x, b.y);
                //ctx.lineTo(b.x+50, b.y+50);
                tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                tmp_ctx.fill();
                tmp_ctx.closePath();
                return;
            }
            
            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            tmp_ctx.beginPath();
            tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

            for (var i = 1; i < ppts.length - 2; i++) {
                var c = (ppts[i].x + ppts[i + 1].x) / 2;
                var d = (ppts[i].y + ppts[i + 1].y) / 2;
                // if(regenerate){
                //     tmp_ctx.lineWidth = tmp_ctx.lineWidth - ( 5 / ppts.length).toFixed(4);
                // }
                tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
            }
            
            // For the last 2 points
            tmp_ctx.quadraticCurveTo(
                ppts[i].x,
                ppts[i].y,
                ppts[i + 1].x,
                ppts[i + 1].y
            );
            tmp_ctx.stroke();
        }

        function generateCurve(){
            strokePath(true);
            // Writing down to real canvas now
            console.log(ppts.length);
            ctx.drawImage(tmp_canvas, 0, 0);
            // Clearing tmp canvas
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
            // Emptying up Pencil Points
            ppts = [];
        }
    }
    // clear canvas
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    
    useEffect(() => {
        init();
    })

    return (
        <div id="sketch">
            <canvas id="paint"></canvas>
            <div>
                <button onClick={clear}>CLEAR</button>
                {/* <button onClick={upload}>UPLOAD</button> */}
            </div>
        </div>
    )
}

export default Signature2
