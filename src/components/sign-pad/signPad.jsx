import React, { useRef, useEffect, useState } from 'react';
import './signPad.css';
// import getPlaceholder from './getPlaceholder';
import placeholder from './placeholder.png';

// Point TS
class Point {
  constructor(x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || Date.now();
  }

  distanceTo(start) {
    return Math.sqrt(
      Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2),
    );
  }

  equals(other) {
    return this.x === other.x && this.y === other.y && this.time === other.time;
  }

  velocityFrom(start) {
    return this.time !== start.time
      ? this.distanceTo(start) / (this.time - start.time)
      : 0;
  }
}

class Bezier {
  static fromPoints(points, widths, ) {
    const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
    const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
    return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
  }

  static calculateControlPoints(s1, s2, s3) {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.x - s3.x;
    const dy2 = s2.y - s3.y;

    const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
    const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const dxm = m1.x - m2.x;
    const dym = m1.y - m2.y;

    const k = l2 / (l1 + l2);
    const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };

    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;

    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m2.x + tx, m2.y + ty),
    };
  }

  constructor(startPoint, control2, control1, endPoint, startWidth, endWidth) {
    this.startPoint = startPoint;
    this.control1 = control1;
    this.control2 = control2;
    this.endPoint = endPoint;
    this.startWidth = startWidth;
    this.endWidth = endWidth;
    // console.log("Creating Bezier------",startPoint, control2, control1, endPoint, startWidth, endWidth);
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    const steps = 10;
    let length = 0;
    let px;
    let py;

    for (let i = 0; i <= steps; i += 1) {
      // console.log(this.startPoint.x);
      const t = i / steps;
      const cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
      const cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);

      if (i > 0) {
        const xdiff = cx - (px);
        const ydiff = cy - (py);

        length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      }

      px = cx;
      py = cy;
    }

    return length;
  }

  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(t, start, c1, c2, end, ) {
    // prettier-ignore
    return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
      + (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
      + (3.0 * c2 * (1.0 - t) * t * t)
      + (end * t * t * t);
  }
}

function SignaturePad(canvas, options) {
  let dotSize;
  let minWidth;
  let maxWidth;
  let minDistance;
  let backgroundColor;
  let penColor;
  let velocityFilterWeight;
  let onBegin;
  let onEnd;
  let dpr = window.devicePixelRatio || 1;

  let _ctx;
  let _mouseButtonDown;
  let _isEmpty;
  let _lastPoints = []; // Stores up to 4 most recent points; used to generate a new curve
  let _data = []; // Stores all points in groups (one group per line or dot)
  let _lastVelocity;
  let _lastWidth;

  function init() {
    velocityFilterWeight = options.velocityFilterWeight || 0.7;
    minWidth = options.minWidth || 0.5;
    maxWidth = options.maxWidth || 2.5;
    minDistance = ('minDistance' in options ? options.minDistance : 5); // in pixels
    dotSize = options.dotSize || function dotSize() {
      return (minWidth + maxWidth) / 2;
    };
    penColor = options.penColor || 'black';
    backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)';
    onBegin = options.onBegin;
    onEnd = options.onEnd;
    _ctx = canvas.getContext('2d');
    clear();
    // Enable mouse and touch event handlers
    on();
  }// end of init

  function clear() {
    console.log("clearing....");
    const ctx = _ctx;
    const _canvas = canvas;
    // Clear canvas using background color
    ctx.fillStyle = backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    _data = [];
    _reset();
    _isEmpty = true;
  }
  // Called when a new line is started
  function _reset() {
    _lastPoints = [];
    _lastVelocity = 0;
    _lastWidth = (minWidth + maxWidth) / 2;
    _ctx.fillStyle = penColor;
  }

  // turn on canvas gimmick
  function on() {
    // Disable panning/zooming when touching canvas element
    canvas.style.touchAction = 'none';
    canvas.style.msTouchAction = 'none';
    _handleMouseEvents();
    _handleTouchEvents();
  }
  function off() {
    // Enable panning/zooming when touching canvas element
    canvas.style.touchAction = 'auto';
    canvas.style.msTouchAction = 'auto';
    // Removing mouse events
    canvas.removeEventListener('mousedown', _handleMouseDown);
    canvas.removeEventListener('mousemove', _handleMouseMove);
    document.removeEventListener('mouseup', _handleMouseUp);
    // Removing Touch Events
    canvas.removeEventListener('touchstart', _handleTouchStart);
    canvas.removeEventListener('touchmove', _handleTouchMove);
    canvas.removeEventListener('touchend', _handleTouchEnd);

  }

  function isEmpty() {
    return _isEmpty;
  }

  function fromData(pointGroups) {
    clear();

    _fromData(
      pointGroups,
      ({ color, curve }) => _drawCurve({ color, curve }),
      ({ color, point }) => _drawDot({ color, point }),
    );

    _data = pointGroups;
  }

  function toData() {
    return _data;
  }

  // ADDING EVENT HANDLERS
  function _handleMouseEvents() {
    _mouseButtonDown = false;
    canvas.addEventListener('mousedown', _handleMouseDown);
    canvas.addEventListener('mousemove', _handleMouseMove);
    document.addEventListener('mouseup', _handleMouseUp);
  }
  function _handleTouchEvents() {
    canvas.addEventListener('touchstart', _handleTouchStart);
    canvas.addEventListener('touchmove', _handleTouchMove);
    canvas.addEventListener('touchend', _handleTouchEnd);
  }

  // Event handlers
  // MOUSE
  let _handleMouseDown = (event) => {
    if (event.which === 1) {
      _mouseButtonDown = true;
      _strokeBegin(event);
    }
  };
  let _handleMouseMove = (event) => {
    if (_mouseButtonDown) {
      _strokeUpdate(event);
    }
  };
  let _handleMouseUp = (event) => {
    if (event.which === 1 && _mouseButtonDown) {
      _mouseButtonDown = false;
      _strokeEnd(event);
    }
  };
  // TOUCH
  let _handleTouchStart = (event) => {
    // Prevent scrolling.
    event.preventDefault();

    if (event.targetTouches.length === 1) {
      const touch = event.changedTouches[0];
      _strokeBegin(touch);
    }
  };
  let _handleTouchMove = (event) => {
    // Prevent scrolling.
    event.preventDefault();

    const touch = event.targetTouches[0];
    _strokeUpdate(touch);
  };
  let _handleTouchEnd = (event) => {
    const wasCanvasTouched = event.target === canvas;
    if (wasCanvasTouched) {
      event.preventDefault();

      const touch = event.changedTouches[0];
      _strokeEnd(touch);
    }
  };

  // Private methods
  // STROKE METHODS
  function _strokeBegin(event) {
    const newPointGroup = {
      color: penColor,
      points: [],
    };

    // do something on begining of stroke if required by user
    if (typeof onBegin === 'function') {
      onBegin(event);
    }

    _data.push(newPointGroup);
    _reset();
    _strokeUpdate(event);
  }

  function _strokeUpdate(event) {
    const x = event.clientX;
    const y = event.clientY;

    const point = _createPoint(x, y);
    const lastPointGroup = _data[_data.length - 1];
    const lastPoints = lastPointGroup.points;
    const lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
    const isLastPointTooClose = lastPoint ? point.distanceTo(lastPoint) <= minDistance : false;
    const color = lastPointGroup.color;

    // Skip this point if it's too close to the previous one
    if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
      const curve = _addPoint(point);
      if (!lastPoint) {
        _drawDot({ color, point });
      } else if (curve) {
        _drawCurve({ color, curve });
      }

      lastPoints.push({ time: point.time, x: point.x, y: point.y, });
    }
  }

  function _strokeEnd(event) {
    _strokeUpdate(event);

    if (typeof onEnd === 'function') {
      onEnd(event);
    }
  }

  function _createPoint(x, y) {
    const rect = canvas.getBoundingClientRect();

    return new Point(x - rect.left, y - rect.top, new Date().getTime());
  }

  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  function _addPoint(point) {
    // const { _lastPoints } = this;

    _lastPoints.push(point);

    if (_lastPoints.length > 2) {
      // To reduce the initial lag make it work with 3 points
      // by copying the first point to the beginning.
      if (_lastPoints.length === 3) {
        _lastPoints.unshift(_lastPoints[0]);
      }

      // _points array will always have 4 points here.
      const widths = _calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
      const curve = Bezier.fromPoints(_lastPoints, widths);
      // Remove the first element from the list, so that there are no more than 4 points at any time.
      _lastPoints.shift();

      return curve;
    }

    return null;
  }

  function _calculateCurveWidths(startPoint, endPoint, ) {
    const velocity =
      velocityFilterWeight * endPoint.velocityFrom(startPoint) +
      (1 - velocityFilterWeight) * _lastVelocity;

    const newWidth = _strokeWidth(velocity);

    const widths = {
      end: newWidth,
      start: _lastWidth,
    };

    _lastVelocity = velocity;
    _lastWidth = newWidth;

    return widths;
  }

  function _strokeWidth(velocity) {
    return Math.max(maxWidth / (velocity + 1), minWidth);
  }

  function _drawCurveSegment(x, y, width) {
    const ctx = _ctx;

    ctx.moveTo(x, y);
    ctx.arc(x, y, width, 0, 2 * Math.PI, false);
    _isEmpty = false;
  }

  function _drawCurve({ color, curve }) {
    const ctx = _ctx;
    const widthDelta = curve.endWidth - curve.startWidth;
    // '2' is just an arbitrary number here. If only lenght is used, then
    // there are gaps between curve segments :/
    const drawSteps = Math.floor(curve.length()) * 2;

    ctx.beginPath();
    ctx.fillStyle = color;

    for (let i = 0; i < drawSteps; i += 1) {
      // Calculate the Bezier (x, y) coordinate for this step.
      const t = i / drawSteps;
      const tt = t * t;
      const ttt = tt * t;
      const u = 1 - t;
      const uu = u * u;
      const uuu = uu * u;

      let x = uuu * curve.startPoint.x;
      x += 3 * uu * t * curve.control1.x;
      x += 3 * u * tt * curve.control2.x;
      x += ttt * curve.endPoint.x;

      let y = uuu * curve.startPoint.y;
      y += 3 * uu * t * curve.control1.y;
      y += 3 * u * tt * curve.control2.y;
      y += ttt * curve.endPoint.y;

      const width = Math.min(curve.startWidth + ttt * widthDelta, maxWidth);
      _drawCurveSegment(x, y, width);
    }

    ctx.closePath();
    ctx.fill();
  }

  function _drawDot({ color, point, }) {
    const ctx = _ctx;
    const width =
      typeof dotSize === 'function' ? dotSize() : dotSize;

    ctx.beginPath();
    _drawCurveSegment(point.x, point.y, width);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function _fromData(pointGroups, drawCurve, drawDot) {
    for (const group of pointGroups) {
      const {
        color,
        points
      } = group;

      if (points.length > 1) {
        for (let j = 0; j < points.length; j += 1) {
          const basicPoint = points[j];
          const point = new Point(basicPoint.x, basicPoint.y, basicPoint.time);

          // All points in the group have the same color, so it's enough to set
          // penColor just at the beginning.
          penColor = color;

          if (j === 0) {
            _reset();
          }

          const curve = _addPoint(point);

          if (curve) {
            drawCurve({
              color,
              curve
            });
          }
        }
      } else {
        _reset();

        drawDot({
          color,
          point: points[0],
        });
      }
    }
  }

  init();

  return { clear, _ctx, canvas, dpr }
}

export default function SignPad(props) {
  const canvas  = useRef();
  const image   = useRef();
  const modal   = useRef();
  const close   = useRef();
  let signPad;
  // Methods
  let save = () => {
    image.current.src = canvas.current.toDataURL();
    closeModal();
  }
  let approve = () => {

  }
  let clear = () => {
    signPad.clear();
  }
  let clearImage = () => {
    image.current.src = placeholder;
  }
  let openModal = () => {
    modal.current.style.display = 'block';
  }
  let closeModal = () => {
    modal.current.style.display = 'none';
    signPad.clear();
  }
  // click outside to close modal
  
  // Hooks lifecycle
  useEffect(() => {
    signPad = SignaturePad(canvas.current, {});
    canvas.current.width = (props.width || 300) * signPad.dpr;
    canvas.current.height = (props.height || 200) * signPad.dpr;
    image.current.src = placeholder;
  })

  return (
    <section className="container">
      {/* <canvas ref={canvas}></canvas> */}
      <figure className="image" height={props.height} width={props.width}>
        <img ref={image} onClick={openModal} alt="sign here" />
      </figure>
      <p className="buttons">
        <button className="secondary" onClick={clearImage}>Clear</button>
        <button className="primary" onClick={approve}>Approve</button>
      </p>
      <div ref={modal} className="modal">
        <div className="modal-content">
          <section>
            <p ref={close} onClick={closeModal} className="close">
              Draw your signature.
              <span>&times;</span>
              </p>
            <canvas ref={canvas}></canvas>
            <p className="buttons">
              <button className="primary" onClick={save}>Confirm</button>
              <button className="secondary" onClick={closeModal}>Cancel</button>
            </p>
          </section>
        </div>

      </div>
    </section>
  )
}