import React , { useRef, useEffect } from 'react';
import './signature.css';

function Signature(props) {
    const canvas = useRef();
    const image = useRef();
    let points = [];
    let surface, ctx,w, h, inProgress, cp1x, cp1y, cp2x, cp2y, skip1, skip2, prev_x, prev_y, curr_x, curr_y;

    function init() {
        surface = canvas.current;
        surface.width = 500;
        surface.height = 500;
        ctx = surface.getContext("2d");
        captureTouch();
        image.current.style.display = "none";
        // for clearing the canvas
        w = canvas.current.width;
        h = canvas.current.height;
    }

    function captureTouch() {
        surface.addEventListener('mousedown', function() {
            surface.addEventListener('mousemove', draw, false);
        }, false);
        surface.addEventListener('mouseup', function() {
            surface.removeEventListener('mousemove', draw, false);
            inProgress = false;
            ctx.save();
        }, false);
        surface.addEventListener('mouseout', function() {
            surface.removeEventListener('mousemove', draw, false);
            inProgress = false;
            ctx.save();
        }, false);
    }

    function draw(e) {
        prev_x = curr_x;
        prev_y = curr_y;
        curr_x = e.offsetX;
        curr_y = e.offsetY;
        // points.push({x:x,y:y});
        ctx.shadowColor = "rgba(0,0,0,.9)";
        ctx.shadowBlur = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#000';
        if (!inProgress) {
            ctx.beginPath();
            ctx.moveTo(curr_x, curr_y);
            inProgress = true;
            skip1 = true;
            skip2 = false;
        } else {
            if (skip1) {
                cp1x = curr_x;
                cp1y = curr_y;
                skip1 = false;
                skip2 = true;
            }
            if (skip2) {
                cp2x = curr_x;
                cp2y = curr_y;
                skip1 = false;
                skip2 = false;
            } else {
                console.table('prev-x',(prev_x + curr_x) / 2, 'prev-y', (prev_y + curr_y) / 2, 'x',curr_x, 'y',curr_y)
                // ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                ctx.quadraticCurveTo((prev_x + curr_x) / 2, (prev_y + curr_y) / 2, curr_x, curr_y);
                skip1 = true;
                skip2 = false;
            }
        }
        ctx.stroke();
    }

    function clear() {
        points = [];
        ctx.clearRect(0, 0, w, h);
        image.current.style.display = "none";
    }

    function save() {
        image.current.style.border = "2px solid";
        let dataURL = canvas.current.toDataURL();
        console.log(dataURL);
        image.current.src = dataURL;
        image.current.style.display = "inline";
        const fd = new FormData();
        fd.append('photo',dataURL);
        console.log(fd.getAll('photo'));
    }
    
    useEffect(() => {
        init();
    })

    return (
        <section>
            <p>The Signature Component</p>
            <canvas ref={canvas} ></canvas>
            <div>
                <button onClick={clear}>CLEAR</button>
                <button onClick={save}>SAVE</button>
                {/* <button onClick={upload}>UPLOAD</button> */}
            </div>
            {/* <p>
                <input ref={file} type="file"/>
            </p> */}
            <figure>
                <img ref={image} src="" alt="the converted"/>
            </figure>
        </section>
    )
}

export default Signature
