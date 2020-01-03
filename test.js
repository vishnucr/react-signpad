(function() {
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch); // get the styles as an object after its computed by rendering engine
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));

	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	sketch.appendChild(tmp_canvas);
	// init mouse poits
	var mouse = {x: 0, y: 0};
	// var last_mouse = {x: 0, y: 0};
	// Pencil Points
	var ppts = [];
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';

	/* Mouse Capturing Work */
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
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		// Emptying up Pencil Points
		ppts = [];
	}, false);
	
	var onPaint = function() {
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
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
		
	};
	
}());

// // docsketch
// function editorInit() {
//     $(".editor").trumbowyg()
// }

// function imagesDelete() {
//     $(".image-preview .delete").on("click", function() {
//         $(this).parent().remove()
//     })
// }

// function showAdvanced() {
//     $(".show-advanced").on("click", function() {
//         $(".advanced-content").toggle()
//     })
// }

// function holmesInit() {
//     var t = document.querySelector("#search-template");
//     if (document.body.contains(t)) holmes({
//         input: "#search-template",
//         find: ".template-item",
//         placeholder: "<h3>No results...</h3>",
//         mark: !1,
//         hiddenAttr: !0,
//         "class": {
//             visible: "visible",
//             hidden: "hidden"
//         }
//     })
// }

// function signaturePad() {
//     function t() {
//         var t = Math.max(window.devicePixelRatio || 1, 1);
//         e.width = e.offsetWidth * t, e.height = e.offsetHeight * t, e.getContext("2d").scale(t, t), r.clear()
//     }
//     var e = document.getElementById("canvas_signature"),
//         n = document.getElementById("reset_btn");
//     if (document.body.contains(e)) {
//         window.addEventListener("resize", t);
//         var i, r = new SignaturePad(e, {
//             backgroundColor: "rgba(255, 255, 255, 100)"
//         });
//         r.onEnd = new SignaturePadSmooth(r, {
//             takePointsEvery: 3,
//             thresholdSmooth: 20
//         }), t(), n.addEventListener("click", function() {
//             r.clear()
//         }, !1), $(".color-controls input").on("change", function() {
//             var e = $(this).val();
//             r.penColor = e;
//             var n = r.toData();
//             jQuery.each(n, function(t) {
//                 setPenColor(n[t], e)
//             }), r.clear(), r.fromData(n)
//         }), $(".range-slider").slider(), $(".range-slider").on("change", function() {
//             r.onEnd = new SignaturePadSmooth(r, {
//                 takePointsEvery: $(this).val(),
//                 thresholdSmooth: 20
//             })
//         }), $(".signature-transparent input").on("change", function() {
//             var t = r.toData();
//             $(".signature-transparent input").is(":checked") ? r.backgroundColor = "rgba(255, 255, 255, 0)" : r.backgroundColor = "rgba(255, 255, 255, 100)", r.clear(), r.fromData(t), i = e.toDataURL("image/png"), $(".signature-preview").css("background-image", "url(" + i + ")")
//         }), $("#signature-save").on("click", function() {
//             r.isEmpty() || (i = e.toDataURL("image/png"), $(".signature-preview").css("background-image", "url(" + i + ")"), $("#preview-modal").modal("show"))
//         }), $("#signature-preview-close").on("click", function() {
//             $("#preview-modal").modal("hide")
//         })
//     }
// }

// function setPenColor(t, n) {
//     return jQuery.each(t, function(t, e) {
//         jQuery.each(e, function(t) {
//             "color" == t && (e[t] = n)
//         })
//     }), t
// }

// function colorPicker() {
//     $("#colorpicker").spectrum({
//         showButtons: !1,
//         color: "#51b7c5",
//         replacerClassName: "color-item",
//         preferredFormat: "hex"
//     }), $("#colorpicker").on("beforeShow.spectrum", function() {
//         $(this).click()
//     })
// }

// function bom(t, e) {
//     return void 0 === e ? e = {
//         autoBom: !1
//     } : "object" != typeof e && (console.warn("Deprecated: Expected third argument to be a object"), e = {
//         autoBom: !e
//     }), e.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob([String.fromCharCode(65279), t], {
//         type: t.type
//     }) : t
// }

// function download(t, e, n) {
//     var i = new XMLHttpRequest;
//     i.open("GET", t), i.responseType = "blob", i.onload = function() {
//         saveAs(i.response, e, n)
//     }, i.onerror = function() {
//         console.error("could not download file")
//     }, i.send()
// }

// function corsEnabled(t) {
//     var e = new XMLHttpRequest;
//     e.open("HEAD", t, !1);
//     try {
//         e.send()
//     } catch (n) {}
//     return 200 <= e.status && e.status <= 299
// }

// function click(t) {
//     try {
//         t.dispatchEvent(new MouseEvent("click"))
//     } catch (n) {
//         var e = document.createEvent("MouseEvents");
//         e.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), t.dispatchEvent(e)
//     }
// }

// function createTypedSignature() {
//     function e() {
//         var t = $("#type-signature").val();
//         if ("" == t) return !1;
//         $(".created-signature").attr("data-text", t), $("#create-typed-signature").text("Update"), $(".created-signatures").fadeIn("300", function() {
//             $("#editor-modal").modal("hide")
//         })
//     }
//     $("#create-typed-signature, #reset-typed-signature").on("click", function() {
//         e()
//     }), $("#type-signature").keypress(function(t) {
//         13 == t.keyCode && e()
//     })
// }

// function loadMoreSignatures() {
//     itemsSize = $(".created-signature").length, x = 6, $(".created-signature:lt(" + x + ")").fadeIn("300"), $("#load-more-signatures").on("click", function() {
//         x = x + 6 <= itemsSize ? x + 6 : itemsSize, $(".created-signature:lt(" + x + ")").fadeIn("300"), 31 <= x && $("#load-more-signatures").hide()
//     })
// }

// function editSignature() {
//     var l = document.querySelector(".typed-signature-editor canvas");
//     if (document.body.contains(l)) {
//         var u = l.getContext("2d");
//         $(".created-signature").on("click", function() {
//             function e() {
//                 u.setTransform(1, 0, -s, 1, 0, 0), u.fillText(o, l.width / 2 + s * a, l.height / 2, l.width - s * a)
//             }

//             function t() {
//                 u.clearRect(0, 0, l.width, l.height)
//             }

//             function n() {
//                 $(".signature-transparent input").is(":checked") ? u.clearRect(0, 0, l.width, l.height) : (u.fillStyle = "rgba(255, 255, 255, 100)", u.fillRect(0, 0, l.width, l.height))
//             }
//             var i, r = $(this).css("font-family"),
//                 o = $(".created-signature").attr("data-text"),
//                 s = 0,
//                 a = 60;
//             $("#editor-modal").modal("show"), setTimeout(function() {
//                 $(".range-slider").slider()
//             }, 300), t(), u.fillStyle = "rgba(255, 255, 255, 100)", u.fillRect(0, 0, l.width, l.height), u.fillStyle = "#000000", u.textBaseline = "middle", u.textAlign = "center", u.font = "48px " + r, e(), $(".color-controls input").on("change", function() {
//                 var t = $(this).val();
//                 u.clearRect(0, 0, l.width, l.height), n(), u.fillStyle = t, e()
//             }), $(".range-slider").on("change", function() {
//                 s = $(this).val(), t(), e()
//             }), $(".signature-transparent input").on("change", function() {
//                 if ($(".signature-transparent input").is(":checked")) {
//                     u.clearRect(0, 0, l.width, l.height);
//                     var t = $(".color-controls input:checked").val();
//                     u.fillStyle = t, e()
//                 } else {
//                     u.fillStyle = "rgba(255, 255, 255, 100)", u.fillRect(0, 0, l.width, l.height);
//                     t = $(".color-controls input:checked").val();
//                     u.fillStyle = t, e()
//                 }
//                 i = l.toDataURL("image/png"), $(".signature-preview").css("background-image", "url(" + i + ")")
//             }), $("#signature-save").on("click", function() {
//                 i = l.toDataURL("image/png"), $(".signature-preview").css("background-image", "url(" + i + ")"), $("#preview-modal").modal("show")
//             }), $("#signature-preview-close").on("click", function() {
//                 $("#preview-modal").modal("hide")
//             }), $("#preview-modal").on("hidden.bs.modal", function() {
//                 $("body").addClass("modal-open")
//             })
//         })
//     }
// }

// function saveImageDownload() {
//     var t = document.getElementById("edit-typed-signature");
//     if (!document.body.contains(t)) t = document.getElementById("canvas_signature");
//     var e = t.toDataURL("image/png");
//     new Blob([e], {
//         type: "image/png"
//     });
//     t.toBlob(function(t) {
//         saveAs(t, "signature.png")
//     })
// }! function(t, e) {
//     "use strict";
//     "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
//         if (!t.document) throw new Error("jQuery requires a window with a document");
//         return e(t)
//     } : e(t)
// }("undefined" != typeof window ? window : this, function(E, t) {
//     "use strict";

//     function m(t, e, n) {
//         var i, r = (e = e || st).createElement("script");
//         if (r.text = t, n)
//             for (i in wt) n[i] && (r[i] = n[i]);
//         e.head.appendChild(r).parentNode.removeChild(r)
//     }

//     function g(t) {
//         return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? dt[ft.call(t)] || "object" : typeof t
//     }

//     function a(t) {
//         var e = !!t && "length" in t && t.length,
//             n = g(t);
//         return !yt(t) && !bt(t) && ("array" === n || 0 === e || "number" == typeof e && 0 < e && e - 1 in t)
//     }

//     function u(t, e) {
//         return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
//     }

//     function e(t, n, i) {
//         return yt(n) ? kt.grep(t, function(t, e) {
//             return !!n.call(t, e, t) !== i
//         }) : n.nodeType ? kt.grep(t, function(t) {
//             return t === n !== i
//         }) : "string" != typeof n ? kt.grep(t, function(t) {
//             return -1 < ht.call(n, t) !== i
//         }) : kt.filter(n, t, i)
//     }

//     function n(t, e) {
//         for (;
//             (t = t[e]) && 1 !== t.nodeType;);
//         return t
//     }

//     function c(t) {
//         var n = {};
//         return kt.each(t.match(Rt) || [], function(t, e) {
//             n[e] = !0
//         }), n
//     }

//     function h(t) {
//         return t
//     }

//     function d(t) {
//         throw t
//     }

//     function l(t, e, n, i) {
//         var r;
//         try {
//             t && yt(r = t.promise) ? r.call(t).done(e).fail(n) : t && yt(r = t.then) ? r.call(t, e, n) : e.apply(undefined, [t].slice(i))
//         } catch (t) {
//             n.apply(undefined, [t])
//         }
//     }

//     function i() {
//         st.removeEventListener("DOMContentLoaded", i), E.removeEventListener("load", i), kt.ready()
//     }

//     function r(t, e) {
//         return e.toUpperCase()
//     }

//     function f(t) {
//         return t.replace(qt, "ms-").replace(Ht, r)
//     }

//     function o() {
//         this.expando = kt.expando + o.uid++
//     }

//     function s(t) {
//         return "true" === t || "false" !== t && ("null" === t ? null : t === +t + "" ? +t : Bt.test(t) ? JSON.parse(t) : t)
//     }

//     function p(t, e, n) {
//         var i;
//         if (n === undefined && 1 === t.nodeType)
//             if (i = "data-" + e.replace(Vt, "-$&").toLowerCase(), "string" == typeof(n = t.getAttribute(i))) {
//                 try {
//                     n = s(n)
//                 } catch (r) {}
//                 Ft.set(t, e, n)
//             } else n = undefined;
//         return n
//     }

//     function v(t, e, n, i) {
//         var r, o, s = 20,
//             a = i ? function() {
//                 return i.cur()
//             } : function() {
//                 return kt.css(t, e, "")
//             },
//             l = a(),
//             u = n && n[3] || (kt.cssNumber[e] ? "" : "px"),
//             c = (kt.cssNumber[e] || "px" !== u && +l) && Ut.exec(kt.css(t, e));
//         if (c && c[3] !== u) {
//             for (l /= 2, u = u || c[3], c = +l || 1; s--;) kt.style(t, e, c + u), (1 - o) * (1 - (o = a() / l || .5)) <= 0 && (s = 0), c /= o;
//             c *= 2, kt.style(t, e, c + u), n = n || []
//         }
//         return n && (c = +c || +l || 0, r = n[1] ? c + (n[1] + 1) * n[2] : +n[2], i && (i.unit = u, i.start = c, i.end = r)), r
//     }

//     function y(t) {
//         var e, n = t.ownerDocument,
//             i = t.nodeName,
//             r = Qt[i];
//         return r || (e = n.body.appendChild(n.createElement(i)), r = kt.css(e, "display"), e.parentNode.removeChild(e), "none" === r && (r = "block"), Qt[i] = r)
//     }

//     function b(t, e) {
//         for (var n, i, r = [], o = 0, s = t.length; o < s; o++)(i = t[o]).style && (n = i.style.display, e ? ("none" === n && (r[o] = Ot.get(i, "display") || null, r[o] || (i.style.display = "")), "" === i.style.display && Xt(i) && (r[o] = y(i))) : "none" !== n && (r[o] = "none", Ot.set(i, "display", n)));
//         for (o = 0; o < s; o++) null != r[o] && (t[o].style.display = r[o]);
//         return t
//     }

//     function w(t, e) {
//         var n;
//         return n = "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e || "*") : "undefined" != typeof t.querySelectorAll ? t.querySelectorAll(e || "*") : [], e === undefined || e && u(t, e) ? kt.merge([t], n) : n
//     }

//     function x(t, e) {
//         for (var n = 0, i = t.length; n < i; n++) Ot.set(t[n], "globalEval", !e || Ot.get(e[n], "globalEval"))
//     }

//     function k(t, e, n, i, r) {
//         for (var o, s, a, l, u, c, h = e.createDocumentFragment(), d = [], f = 0, p = t.length; f < p; f++)
//             if ((o = t[f]) || 0 === o)
//                 if ("object" === g(o)) kt.merge(d, o.nodeType ? [o] : o);
//                 else if (ne.test(o)) {
//             for (s = s || h.appendChild(e.createElement("div")), a = (Gt.exec(o) || ["", ""])[1].toLowerCase(), l = Zt[a] || Zt._default, s.innerHTML = l[1] + kt.htmlPrefilter(o) + l[2], c = l[0]; c--;) s = s.lastChild;
//             kt.merge(d, s.childNodes), (s = h.firstChild).textContent = ""
//         } else d.push(e.createTextNode(o));
//         for (h.textContent = "", f = 0; o = d[f++];)
//             if (i && -1 < kt.inArray(o, i)) r && r.push(o);
//             else if (u = kt.contains(o.ownerDocument, o), s = w(h.appendChild(o), "script"), u && x(s), n)
//             for (c = 0; o = s[c++];) Jt.test(o.type || "") && n.push(o);
//         return h
//     }

//     function _() {
//         return !0
//     }

//     function C() {
//         return !1
//     }

//     function T() {
//         try {
//             return st.activeElement
//         } catch (t) {}
//     }

//     function S(t, e, n, i, r, o) {
//         var s, a;
//         if ("object" == typeof e) {
//             for (a in "string" != typeof n && (i = i || n, n = undefined), e) S(t, a, n, i, e[a], o);
//             return t
//         }
//         if (null == i && null == r ? (r = n, i = n = undefined) : null == r && ("string" == typeof n ? (r = i, i = undefined) : (r = i, i = n, n = undefined)), !1 === r) r = C;
//         else if (!r) return t;
//         return 1 === o && (s = r, (r = function(t) {
//             return kt().off(t), s.apply(this, arguments)
//         }).guid = s.guid || (s.guid = kt.guid++)), t.each(function() {
//             kt.event.add(this, e, r, i, n)
//         })
//     }

//     function A(t, e) {
//         return u(t, "table") && u(11 !== e.nodeType ? e : e.firstChild, "tr") && kt(t).children("tbody")[0] || t
//     }

//     function L(t) {
//         return t.type = (null !== t.getAttribute("type")) + "/" + t.type, t
//     }

//     function P(t) {
//         return "true/" === (t.type || "").slice(0, 5) ? t.type = t.type.slice(5) : t.removeAttribute("type"), t
//     }

//     function M(t, e) {
//         var n, i, r, o, s, a, l, u;
//         if (1 === e.nodeType) {
//             if (Ot.hasData(t) && (o = Ot.access(t), s = Ot.set(e, o), u = o.events))
//                 for (r in delete s.handle, s.events = {}, u)
//                     for (n = 0, i = u[r].length; n < i; n++) kt.event.add(e, r, u[r][n]);
//             Ft.hasData(t) && (a = Ft.access(t), l = kt.extend({}, a), Ft.set(e, l))
//         }
//     }

//     function D(t, e) {
//         var n = e.nodeName.toLowerCase();
//         "input" === n && Kt.test(t.type) ? e.checked = t.checked : "input" !== n && "textarea" !== n || (e.defaultValue = t.defaultValue)
//     }

//     function R(n, i, r, o) {
//         i = ut.apply([], i);
//         var t, e, s, a, l, u, c = 0,
//             h = n.length,
//             d = h - 1,
//             f = i[0],
//             p = yt(f);
//         if (p || 1 < h && "string" == typeof f && !vt.checkClone && ue.test(f)) return n.each(function(t) {
//             var e = n.eq(t);
//             p && (i[0] = f.call(this, t, e.html())), R(e, i, r, o)
//         });
//         if (h && (e = (t = k(i, n[0].ownerDocument, !1, n, o)).firstChild, 1 === t.childNodes.length && (t = e), e || o)) {
//             for (a = (s = kt.map(w(t, "script"), L)).length; c < h; c++) l = t, c !== d && (l = kt.clone(l, !0, !0), a && kt.merge(s, w(l, "script"))), r.call(n[c], l, c);
//             if (a)
//                 for (u = s[s.length - 1].ownerDocument, kt.map(s, P), c = 0; c < a; c++) l = s[c], Jt.test(l.type || "") && !Ot.access(l, "globalEval") && kt.contains(u, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? kt._evalUrl && kt._evalUrl(l.src) : m(l.textContent.replace(ce, ""), u, l))
//         }
//         return n
//     }

//     function j(t, e, n) {
//         for (var i, r = e ? kt.filter(e, t) : t, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || kt.cleanData(w(i)), i.parentNode && (n && kt.contains(i.ownerDocument, i) && x(w(i, "script")), i.parentNode.removeChild(i));
//         return t
//     }

//     function N(t, e, n) {
//         var i, r, o, s, a = t.style;
//         return (n = n || de(t)) && ("" !== (s = n.getPropertyValue(e) || n[e]) || kt.contains(t.ownerDocument, t) || (s = kt.style(t, e)), !vt.pixelBoxStyles() && he.test(s) && fe.test(e) && (i = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = r, a.maxWidth = o)), s !== undefined ? s + "" : s
//     }

//     function $(t, e) {
//         return {
//             get: function() {
//                 if (!t()) return (this.get = e).apply(this, arguments);
//                 delete this.get
//             }
//         }
//     }

//     function q(t) {
//         if (t in be) return t;
//         for (var e = t[0].toUpperCase() + t.slice(1), n = ye.length; n--;)
//             if ((t = ye[n] + e) in be) return t
//     }

//     function H(t) {
//         var e = kt.cssProps[t];
//         return e || (e = kt.cssProps[t] = q(t) || t), e
//     }

//     function I(t, e, n) {
//         var i = Ut.exec(e);
//         return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : e
//     }

//     function O(t, e, n, i, r, o) {
//         var s = "width" === e ? 1 : 0,
//             a = 0,
//             l = 0;
//         if (n === (i ? "border" : "content")) return 0;
//         for (; s < 4; s += 2) "margin" === n && (l += kt.css(t, n + zt[s], !0, r)), i ? ("content" === n && (l -= kt.css(t, "padding" + zt[s], !0, r)), "margin" !== n && (l -= kt.css(t, "border" + zt[s] + "Width", !0, r))) : (l += kt.css(t, "padding" + zt[s], !0, r), "padding" !== n ? l += kt.css(t, "border" + zt[s] + "Width", !0, r) : a += kt.css(t, "border" + zt[s] + "Width", !0, r));
//         return !i && 0 <= o && (l += Math.max(0, Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - o - l - a - .5))), l
//     }

//     function F(t, e, n) {
//         var i = de(t),
//             r = N(t, e, i),
//             o = "border-box" === kt.css(t, "boxSizing", !1, i),
//             s = o;
//         if (he.test(r)) {
//             if (!n) return r;
//             r = "auto"
//         }
//         return s = s && (vt.boxSizingReliable() || r === t.style[e]), ("auto" === r || !parseFloat(r) && "inline" === kt.css(t, "display", !1, i)) && (r = t["offset" + e[0].toUpperCase() + e.slice(1)], s = !0), (r = parseFloat(r) || 0) + O(t, e, n || (o ? "border" : "content"), s, i, r) + "px"
//     }

//     function B(t, e, n, i, r) {
//         return new B.prototype.init(t, e, n, i, r)
//     }

//     function V() {
//         xe && (!1 === st.hidden && E.requestAnimationFrame ? E.requestAnimationFrame(V) : E.setTimeout(V, kt.fx.interval), kt.fx.tick())
//     }

//     function W() {
//         return E.setTimeout(function() {
//             we = undefined
//         }), we = Date.now()
//     }

//     function U(t, e) {
//         var n, i = 0,
//             r = {
//                 height: t
//             };
//         for (e = e ? 1 : 0; i < 4; i += 2 - e) r["margin" + (n = zt[i])] = r["padding" + n] = t;
//         return e && (r.opacity = r.width = t), r
//     }

//     function z(t, e, n) {
//         for (var i, r = (Q.tweeners[e] || []).concat(Q.tweeners["*"]), o = 0, s = r.length; o < s; o++)
//             if (i = r[o].call(n, e, t)) return i
//     }

//     function X(t, e, n) {
//         var i, r, o, s, a, l, u, c, h = "width" in e || "height" in e,
//             d = this,
//             f = {},
//             p = t.style,
//             m = t.nodeType && Xt(t),
//             g = Ot.get(t, "fxshow");
//         for (i in n.queue || (null == (s = kt._queueHooks(t, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function() {
//                 s.unqueued || a()
//             }), s.unqueued++, d.always(function() {
//                 d.always(function() {
//                     s.unqueued--, kt.queue(t, "fx").length || s.empty.fire()
//                 })
//             })), e)
//             if (r = e[i], Ee.test(r)) {
//                 if (delete e[i], o = o || "toggle" === r, r === (m ? "hide" : "show")) {
//                     if ("show" !== r || !g || g[i] === undefined) continue;
//                     m = !0
//                 }
//                 f[i] = g && g[i] || kt.style(t, i)
//             } if ((l = !kt.isEmptyObject(e)) || !kt.isEmptyObject(f))
//             for (i in h && 1 === t.nodeType && (n.overflow = [p.overflow, p.overflowX, p.overflowY], null == (u = g && g.display) && (u = Ot.get(t, "display")), "none" === (c = kt.css(t, "display")) && (u ? c = u : (b([t], !0), u = t.style.display || u, c = kt.css(t, "display"), b([t]))), ("inline" === c || "inline-block" === c && null != u) && "none" === kt.css(t, "float") && (l || (d.done(function() {
//                     p.display = u
//                 }), null == u && (c = p.display, u = "none" === c ? "" : c)), p.display = "inline-block")), n.overflow && (p.overflow = "hidden", d.always(function() {
//                     p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
//                 })), l = !1, f) l || (g ? "hidden" in g && (m = g.hidden) : g = Ot.access(t, "fxshow", {
//                 display: u
//             }), o && (g.hidden = !m), m && b([t], !0), d.done(function() {
//                 for (i in m || b([t]), Ot.remove(t, "fxshow"), f) kt.style(t, i, f[i])
//             })), l = z(m ? g[i] : 0, i, d), i in g || (g[i] = l.start, m && (l.end = l.start, l.start = 0))
//     }

//     function Y(t, e) {
//         var n, i, r, o, s;
//         for (n in t)
//             if (r = e[i = f(n)], o = t[n], Array.isArray(o) && (r = o[1], o = t[n] = o[0]), n !== i && (t[i] = o, delete t[n]), (s = kt.cssHooks[i]) && "expand" in s)
//                 for (n in o = s.expand(o), delete t[i], o) n in t || (t[n] = o[n], e[n] = r);
//             else e[i] = r
//     }

//     function Q(o, t, e) {
//         var n, s, i = 0,
//             r = Q.prefilters.length,
//             a = kt.Deferred().always(function() {
//                 delete l.elem
//             }),
//             l = function() {
//                 if (s) return !1;
//                 for (var t = we || W(), e = Math.max(0, u.startTime + u.duration - t), n = 1 - (e / u.duration || 0), i = 0, r = u.tweens.length; i < r; i++) u.tweens[i].run(n);
//                 return a.notifyWith(o, [u, n, e]), n < 1 && r ? e : (r || a.notifyWith(o, [u, 1, 0]), a.resolveWith(o, [u]), !1)
//             },
//             u = a.promise({
//                 elem: o,
//                 props: kt.extend({}, t),
//                 opts: kt.extend(!0, {
//                     specialEasing: {},
//                     easing: kt.easing._default
//                 }, e),
//                 originalProperties: t,
//                 originalOptions: e,
//                 startTime: we || W(),
//                 duration: e.duration,
//                 tweens: [],
//                 createTween: function(t, e) {
//                     var n = kt.Tween(o, u.opts, t, e, u.opts.specialEasing[t] || u.opts.easing);
//                     return u.tweens.push(n), n
//                 },
//                 stop: function(t) {
//                     var e = 0,
//                         n = t ? u.tweens.length : 0;
//                     if (s) return this;
//                     for (s = !0; e < n; e++) u.tweens[e].run(1);
//                     return t ? (a.notifyWith(o, [u, 1, 0]), a.resolveWith(o, [u, t])) : a.rejectWith(o, [u, t]), this
//                 }
//             }),
//             c = u.props;
//         for (Y(c, u.opts.specialEasing); i < r; i++)
//             if (n = Q.prefilters[i].call(u, o, c, u.opts)) return yt(n.stop) && (kt._queueHooks(u.elem, u.opts.queue).stop = n.stop.bind(n)), n;
//         return kt.map(c, z, u), yt(u.opts.start) && u.opts.start.call(o, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), kt.fx.timer(kt.extend(l, {
//             elem: o,
//             anim: u,
//             queue: u.opts.queue
//         })), u
//     }

//     function K(t) {
//         return (t.match(Rt) || []).join(" ")
//     }

//     function G(t) {
//         return t.getAttribute && t.getAttribute("class") || ""
//     }

//     function J(t) {
//         return Array.isArray(t) ? t : "string" == typeof t && t.match(Rt) || []
//     }

//     function Z(n, t, i, r) {
//         var e;
//         if (Array.isArray(t)) kt.each(t, function(t, e) {
//             i || $e.test(n) ? r(n, e) : Z(n + "[" + ("object" == typeof e && null != e ? t : "") + "]", e, i, r)
//         });
//         else if (i || "object" !== g(t)) r(n, t);
//         else
//             for (e in t) Z(n + "[" + e + "]", t[e], i, r)
//     }

//     function tt(o) {
//         return function(t, e) {
//             "string" != typeof t && (e = t, t = "*");
//             var n, i = 0,
//                 r = t.toLowerCase().match(Rt) || [];
//             if (yt(e))
//                 for (; n = r[i++];) "+" === n[0] ? (n = n.slice(1) || "*", (o[n] = o[n] || []).unshift(e)) : (o[n] = o[n] || []).push(e)
//         }
//     }

//     function et(e, r, o, s) {
//         function a(t) {
//             var i;
//             return l[t] = !0, kt.each(e[t] || [], function(t, e) {
//                 var n = e(r, o, s);
//                 return "string" != typeof n || u || l[n] ? u ? !(i = n) : void 0 : (r.dataTypes.unshift(n), a(n), !1)
//             }), i
//         }
//         var l = {},
//             u = e === Ye;
//         return a(r.dataTypes[0]) || !l["*"] && a("*")
//     }

//     function nt(t, e) {
//         var n, i, r = kt.ajaxSettings.flatOptions || {};
//         for (n in e) e[n] !== undefined && ((r[n] ? t : i || (i = {}))[n] = e[n]);
//         return i && kt.extend(!0, t, i), t
//     }

//     function it(t, e, n) {
//         for (var i, r, o, s, a = t.contents, l = t.dataTypes;
//             "*" === l[0];) l.shift(), i === undefined && (i = t.mimeType || e.getResponseHeader("Content-Type"));
//         if (i)
//             for (r in a)
//                 if (a[r] && a[r].test(i)) {
//                     l.unshift(r);
//                     break
//                 } if (l[0] in n) o = l[0];
//         else {
//             for (r in n) {
//                 if (!l[0] || t.converters[r + " " + l[0]]) {
//                     o = r;
//                     break
//                 }
//                 s || (s = r)
//             }
//             o = o || s
//         }
//         if (o) return o !== l[0] && l.unshift(o), n[o]
//     }

//     function rt(t, e, n, i) {
//         var r, o, s, a, l, u = {},
//             c = t.dataTypes.slice();
//         if (c[1])
//             for (s in t.converters) u[s.toLowerCase()] = t.converters[s];
//         for (o = c.shift(); o;)
//             if (t.responseFields[o] && (n[t.responseFields[o]] = e), !l && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)), l = o, o = c.shift())
//                 if ("*" === o) o = l;
//                 else if ("*" !== l && l !== o) {
//             if (!(s = u[l + " " + o] || u["* " + o]))
//                 for (r in u)
//                     if ((a = r.split(" "))[1] === o && (s = u[l + " " + a[0]] || u["* " + a[0]])) {
//                         !0 === s ? s = u[r] : !0 !== u[r] && (o = a[0], c.unshift(a[1]));
//                         break
//                     } if (!0 !== s)
//                 if (s && t["throws"]) e = s(e);
//                 else try {
//                     e = s(e)
//                 } catch (h) {
//                     return {
//                         state: "parsererror",
//                         error: s ? h : "No conversion from " + l + " to " + o
//                     }
//                 }
//         }
//         return {
//             state: "success",
//             data: e
//         }
//     }
//     var ot = [],
//         st = E.document,
//         at = Object.getPrototypeOf,
//         lt = ot.slice,
//         ut = ot.concat,
//         ct = ot.push,
//         ht = ot.indexOf,
//         dt = {},
//         ft = dt.toString,
//         pt = dt.hasOwnProperty,
//         mt = pt.toString,
//         gt = mt.call(Object),
//         vt = {},
//         yt = function yt(t) {
//             return "function" == typeof t && "number" != typeof t.nodeType
//         },
//         bt = function bt(t) {
//             return null != t && t === t.window
//         },
//         wt = {
//             type: !0,
//             src: !0,
//             noModule: !0
//         },
//         xt = "3.3.1",
//         kt = function(t, e) {
//             return new kt.fn.init(t, e)
//         },
//         _t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
//     kt.fn = kt.prototype = {
//         jquery: xt,
//         constructor: kt,
//         length: 0,
//         toArray: function() {
//             return lt.call(this)
//         },
//         get: function(t) {
//             return null == t ? lt.call(this) : t < 0 ? this[t + this.length] : this[t]
//         },
//         pushStack: function(t) {
//             var e = kt.merge(this.constructor(), t);
//             return e.prevObject = this, e
//         },
//         each: function(t) {
//             return kt.each(this, t)
//         },
//         map: function(n) {
//             return this.pushStack(kt.map(this, function(t, e) {
//                 return n.call(t, e, t)
//             }))
//         },
//         slice: function() {
//             return this.pushStack(lt.apply(this, arguments))
//         },
//         first: function() {
//             return this.eq(0)
//         },
//         last: function() {
//             return this.eq(-1)
//         },
//         eq: function(t) {
//             var e = this.length,
//                 n = +t + (t < 0 ? e : 0);
//             return this.pushStack(0 <= n && n < e ? [this[n]] : [])
//         },
//         end: function() {
//             return this.prevObject || this.constructor()
//         },
//         push: ct,
//         sort: ot.sort,
//         splice: ot.splice
//     }, kt.extend = kt.fn.extend = function(t) {
//         var e, n, i, r, o, s, a = t || {},
//             l = 1,
//             u = arguments.length,
//             c = !1;
//         for ("boolean" == typeof a && (c = a, a = arguments[l] || {}, l++), "object" == typeof a || yt(a) || (a = {}), l === u && (a = this, l--); l < u; l++)
//             if (null != (e = arguments[l]))
//                 for (n in e) i = a[n], a !== (r = e[n]) && (c && r && (kt.isPlainObject(r) || (o = Array.isArray(r))) ? (o ? (o = !1, s = i && Array.isArray(i) ? i : []) : s = i && kt.isPlainObject(i) ? i : {}, a[n] = kt.extend(c, s, r)) : r !== undefined && (a[n] = r));
//         return a
//     }, kt.extend({
//         expando: "jQuery" + (xt + Math.random()).replace(/\D/g, ""),
//         isReady: !0,
//         error: function(t) {
//             throw new Error(t)
//         },
//         noop: function() {},
//         isPlainObject: function(t) {
//             var e, n;
//             return !(!t || "[object Object]" !== ft.call(t)) && (!(e = at(t)) || "function" == typeof(n = pt.call(e, "constructor") && e.constructor) && mt.call(n) === gt)
//         },
//         isEmptyObject: function(t) {
//             var e;
//             for (e in t) return !1;
//             return !0
//         },
//         globalEval: function(t) {
//             m(t)
//         },
//         each: function(t, e) {
//             var n, i = 0;
//             if (a(t))
//                 for (n = t.length; i < n && !1 !== e.call(t[i], i, t[i]); i++);
//             else
//                 for (i in t)
//                     if (!1 === e.call(t[i], i, t[i])) break;
//             return t
//         },
//         trim: function(t) {
//             return null == t ? "" : (t + "").replace(_t, "")
//         },
//         makeArray: function(t, e) {
//             var n = e || [];
//             return null != t && (a(Object(t)) ? kt.merge(n, "string" == typeof t ? [t] : t) : ct.call(n, t)), n
//         },
//         inArray: function(t, e, n) {
//             return null == e ? -1 : ht.call(e, t, n)
//         },
//         merge: function(t, e) {
//             for (var n = +e.length, i = 0, r = t.length; i < n; i++) t[r++] = e[i];
//             return t.length = r, t
//         },
//         grep: function(t, e, n) {
//             for (var i = [], r = 0, o = t.length, s = !n; r < o; r++) !e(t[r], r) !== s && i.push(t[r]);
//             return i
//         },
//         map: function(t, e, n) {
//             var i, r, o = 0,
//                 s = [];
//             if (a(t))
//                 for (i = t.length; o < i; o++) null != (r = e(t[o], o, n)) && s.push(r);
//             else
//                 for (o in t) null != (r = e(t[o], o, n)) && s.push(r);
//             return ut.apply([], s)
//         },
//         guid: 1,
//         support: vt
//     }), "function" == typeof Symbol && (kt.fn[Symbol.iterator] = ot[Symbol.iterator]), kt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
//         dt["[object " + e + "]"] = e.toLowerCase()
//     });
//     var Et = function(n) {
//         function w(t, e, n, i) {
//             var r, o, s, a, l, u, c, h = e && e.ownerDocument,
//                 d = e ? e.nodeType : 9;
//             if (n = n || [], "string" != typeof t || !t || 1 !== d && 9 !== d && 11 !== d) return n;
//             if (!i && ((e ? e.ownerDocument || e : F) !== R && D(e), e = e || R, N)) {
//                 if (11 !== d && (l = vt.exec(t)))
//                     if (r = l[1]) {
//                         if (9 === d) {
//                             if (!(s = e.getElementById(r))) return n;
//                             if (s.id === r) return n.push(s), n
//                         } else if (h && (s = h.getElementById(r)) && I(e, s) && s.id === r) return n.push(s), n
//                     } else {
//                         if (l[2]) return J.apply(n, e.getElementsByTagName(t)), n;
//                         if ((r = l[3]) && k.getElementsByClassName && e.getElementsByClassName) return J.apply(n, e.getElementsByClassName(r)), n
//                     } if (k.qsa && !z[t + " "] && (!$ || !$.test(t))) {
//                     if (1 !== d) h = e, c = t;
//                     else if ("object" !== e.nodeName.toLowerCase()) {
//                         for ((a = e.getAttribute("id")) ? a = a.replace(xt, kt) : e.setAttribute("id", a = O), o = (u = T(t)).length; o--;) u[o] = "#" + a + " " + m(u[o]);
//                         c = u.join(","), h = yt.test(t) && p(e.parentNode) || e
//                     }
//                     if (c) try {
//                         return J.apply(n, h.querySelectorAll(c)), n
//                     } catch (f) {} finally {
//                         a === O && e.removeAttribute("id")
//                     }
//                 }
//             }
//             return A(t.replace(at, "$1"), e, n, i)
//         }

//         function t() {
//             function n(t, e) {
//                 return i.push(t + " ") > _.cacheLength && delete n[i.shift()], n[t + " "] = e
//             }
//             var i = [];
//             return n
//         }

//         function l(t) {
//             return t[O] = !0, t
//         }

//         function r(t) {
//             var e = R.createElement("fieldset");
//             try {
//                 return !!t(e)
//             } catch (n) {
//                 return !1
//             } finally {
//                 e.parentNode && e.parentNode.removeChild(e), e = null
//             }
//         }

//         function e(t, e) {
//             for (var n = t.split("|"), i = n.length; i--;) _.attrHandle[n[i]] = e
//         }

//         function u(t, e) {
//             var n = e && t,
//                 i = n && 1 === t.nodeType && 1 === e.nodeType && t.sourceIndex - e.sourceIndex;
//             if (i) return i;
//             if (n)
//                 for (; n = n.nextSibling;)
//                     if (n === e) return -1;
//             return t ? 1 : -1
//         }

//         function i(e) {
//             return function(t) {
//                 return "input" === t.nodeName.toLowerCase() && t.type === e
//             }
//         }

//         function o(n) {
//             return function(t) {
//                 var e = t.nodeName.toLowerCase();
//                 return ("input" === e || "button" === e) && t.type === n
//             }
//         }

//         function s(e) {
//             return function(t) {
//                 return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Et(t) === e : t.disabled === e : "label" in t && t.disabled === e
//             }
//         }

//         function a(s) {
//             return l(function(o) {
//                 return o = +o, l(function(t, e) {
//                     for (var n, i = s([], t.length, o), r = i.length; r--;) t[n = i[r]] && (t[n] = !(e[n] = t[n]))
//                 })
//             })
//         }

//         function p(t) {
//             return t && "undefined" != typeof t.getElementsByTagName && t
//         }

//         function c() {}

//         function m(t) {
//             for (var e = 0, n = t.length, i = ""; e < n; e++) i += t[e].value;
//             return i
//         }

//         function h(a, t, e) {
//             var l = t.dir,
//                 u = t.next,
//                 c = u || l,
//                 h = e && "parentNode" === c,
//                 d = V++;
//             return t.first ? function(t, e, n) {
//                 for (; t = t[l];)
//                     if (1 === t.nodeType || h) return a(t, e, n);
//                 return !1
//             } : function(t, e, n) {
//                 var i, r, o, s = [B, d];
//                 if (n) {
//                     for (; t = t[l];)
//                         if ((1 === t.nodeType || h) && a(t, e, n)) return !0
//                 } else
//                     for (; t = t[l];)
//                         if (1 === t.nodeType || h)
//                             if (r = (o = t[O] || (t[O] = {}))[t.uniqueID] || (o[t.uniqueID] = {}), u && u === t.nodeName.toLowerCase()) t = t[l] || t;
//                             else {
//                                 if ((i = r[c]) && i[0] === B && i[1] === d) return s[2] = i[2];
//                                 if ((r[c] = s)[2] = a(t, e, n)) return !0
//                             } return !1
//             }
//         }

//         function d(r) {
//             return 1 < r.length ? function(t, e, n) {
//                 for (var i = r.length; i--;)
//                     if (!r[i](t, e, n)) return !1;
//                 return !0
//             } : r[0]
//         }

//         function y(t, e, n) {
//             for (var i = 0, r = e.length; i < r; i++) w(t, e[i], n);
//             return n
//         }

//         function x(t, e, n, i, r) {
//             for (var o, s = [], a = 0, l = t.length, u = null != e; a < l; a++)(o = t[a]) && (n && !n(o, i, r) || (s.push(o), u && e.push(a)));
//             return s
//         }

//         function b(f, p, m, g, v, t) {
//             return g && !g[O] && (g = b(g)), v && !v[O] && (v = b(v, t)), l(function(t, e, n, i) {
//                 var r, o, s, a = [],
//                     l = [],
//                     u = e.length,
//                     c = t || y(p || "*", n.nodeType ? [n] : n, []),
//                     h = !f || !t && p ? c : x(c, a, f, n, i),
//                     d = m ? v || (t ? f : u || g) ? [] : e : h;
//                 if (m && m(h, d, n, i), g)
//                     for (r = x(d, l), g(r, [], n, i), o = r.length; o--;)(s = r[o]) && (d[l[o]] = !(h[l[o]] = s));
//                 if (t) {
//                     if (v || f) {
//                         if (v) {
//                             for (r = [], o = d.length; o--;)(s = d[o]) && r.push(h[o] = s);
//                             v(null, d = [], r, i)
//                         }
//                         for (o = d.length; o--;)(s = d[o]) && -1 < (r = v ? tt(t, s) : a[o]) && (t[r] = !(e[r] = s))
//                     }
//                 } else d = x(d === e ? d.splice(u, d.length) : d), v ? v(null, e, d, i) : J.apply(e, d)
//             })
//         }

//         function f(t) {
//             for (var r, e, n, i = t.length, o = _.relative[t[0].type], s = o || _.relative[" "], a = o ? 1 : 0, l = h(function(t) {
//                     return t === r
//                 }, s, !0), u = h(function(t) {
//                     return -1 < tt(r, t)
//                 }, s, !0), c = [function(t, e, n) {
//                     var i = !o && (n || e !== L) || ((r = e).nodeType ? l(t, e, n) : u(t, e, n));
//                     return r = null, i
//                 }]; a < i; a++)
//                 if (e = _.relative[t[a].type]) c = [h(d(c), e)];
//                 else {
//                     if ((e = _.filter[t[a].type].apply(null, t[a].matches))[O]) {
//                         for (n = ++a; n < i && !_.relative[t[n].type]; n++);
//                         return b(1 < a && d(c), 1 < a && m(t.slice(0, a - 1).concat({
//                             value: " " === t[a - 2].type ? "*" : ""
//                         })).replace(at, "$1"), e, a < n && f(t.slice(a, n)), n < i && f(t = t.slice(n)), n < i && m(t))
//                     }
//                     c.push(e)
//                 } return d(c)
//         }

//         function g(g, v) {
//             var y = 0 < v.length,
//                 b = 0 < g.length,
//                 t = function(t, e, n, i, r) {
//                     var o, s, a, l = 0,
//                         u = "0",
//                         c = t && [],
//                         h = [],
//                         d = L,
//                         f = t || b && _.find.TAG("*", r),
//                         p = B += null == d ? 1 : Math.random() || .1,
//                         m = f.length;
//                     for (r && (L = e === R || e || r); u !== m && null != (o = f[u]); u++) {
//                         if (b && o) {
//                             for (s = 0, e || o.ownerDocument === R || (D(o), n = !N); a = g[s++];)
//                                 if (a(o, e || R, n)) {
//                                     i.push(o);
//                                     break
//                                 } r && (B = p)
//                         }
//                         y && ((o = !a && o) && l--, t && c.push(o))
//                     }
//                     if (l += u, y && u !== l) {
//                         for (s = 0; a = v[s++];) a(c, h, e, n);
//                         if (t) {
//                             if (0 < l)
//                                 for (; u--;) c[u] || h[u] || (h[u] = K.call(i));
//                             h = x(h)
//                         }
//                         J.apply(i, h), r && !t && 0 < h.length && 1 < l + v.length && w.uniqueSort(i)
//                     }
//                     return r && (B = p, L = d), c
//                 };
//             return y ? l(t) : t
//         }
//         var v, k, _, E, C, T, S, A, L, P, M, D, R, j, N, $, q, H, I, O = "sizzle" + 1 * new Date,
//             F = n.document,
//             B = 0,
//             V = 0,
//             W = t(),
//             U = t(),
//             z = t(),
//             X = function(t, e) {
//                 return t === e && (M = !0), 0
//             },
//             Y = {}.hasOwnProperty,
//             Q = [],
//             K = Q.pop,
//             G = Q.push,
//             J = Q.push,
//             Z = Q.slice,
//             tt = function(t, e) {
//                 for (var n = 0, i = t.length; n < i; n++)
//                     if (t[n] === e) return n;
//                 return -1
//             },
//             et = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
//             nt = "[\\x20\\t\\r\\n\\f]",
//             it = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
//             rt = "\\[" + nt + "*(" + it + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + nt + "*\\]",
//             ot = ":(" + it + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + rt + ")*)|.*)\\)|)",
//             st = new RegExp(nt + "+", "g"),
//             at = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
//             lt = new RegExp("^" + nt + "*," + nt + "*"),
//             ut = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
//             ct = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
//             ht = new RegExp(ot),
//             dt = new RegExp("^" + it + "$"),
//             ft = {
//                 ID: new RegExp("^#(" + it + ")"),
//                 CLASS: new RegExp("^\\.(" + it + ")"),
//                 TAG: new RegExp("^(" + it + "|[*])"),
//                 ATTR: new RegExp("^" + rt),
//                 PSEUDO: new RegExp("^" + ot),
//                 CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
//                 bool: new RegExp("^(?:" + et + ")$", "i"),
//                 needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
//             },
//             pt = /^(?:input|select|textarea|button)$/i,
//             mt = /^h\d$/i,
//             gt = /^[^{]+\{\s*\[native \w/,
//             vt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
//             yt = /[+~]/,
//             bt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
//             wt = function(t, e, n) {
//                 var i = "0x" + e - 65536;
//                 return i != i || n ? e : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
//             },
//             xt = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
//             kt = function(t, e) {
//                 return e ? "\0" === t ? "\ufffd" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t
//             },
//             _t = function() {
//                 D()
//             },
//             Et = h(function(t) {
//                 return !0 === t.disabled && ("form" in t || "label" in t)
//             }, {
//                 dir: "parentNode",
//                 next: "legend"
//             });
//         try {
//             J.apply(Q = Z.call(F.childNodes), F.childNodes), Q[F.childNodes.length].nodeType
//         } catch (Ct) {
//             J = {
//                 apply: Q.length ? function(t, e) {
//                     G.apply(t, Z.call(e))
//                 } : function(t, e) {
//                     for (var n = t.length, i = 0; t[n++] = e[i++];);
//                     t.length = n - 1
//                 }
//             }
//         }
//         for (v in k = w.support = {}, C = w.isXML = function(t) {
//                 var e = t && (t.ownerDocument || t).documentElement;
//                 return !!e && "HTML" !== e.nodeName
//             }, D = w.setDocument = function(t) {
//                 var e, n, i = t ? t.ownerDocument || t : F;
//                 return i !== R && 9 === i.nodeType && i.documentElement && (j = (R = i).documentElement, N = !C(R), F !== R && (n = R.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", _t, !1) : n.attachEvent && n.attachEvent("onunload", _t)), k.attributes = r(function(t) {
//                     return t.className = "i", !t.getAttribute("className")
//                 }), k.getElementsByTagName = r(function(t) {
//                     return t.appendChild(R.createComment("")), !t.getElementsByTagName("*").length
//                 }), k.getElementsByClassName = gt.test(R.getElementsByClassName), k.getById = r(function(t) {
//                     return j.appendChild(t).id = O, !R.getElementsByName || !R.getElementsByName(O).length
//                 }), k.getById ? (_.filter.ID = function(t) {
//                     var e = t.replace(bt, wt);
//                     return function(t) {
//                         return t.getAttribute("id") === e
//                     }
//                 }, _.find.ID = function(t, e) {
//                     if ("undefined" != typeof e.getElementById && N) {
//                         var n = e.getElementById(t);
//                         return n ? [n] : []
//                     }
//                 }) : (_.filter.ID = function(t) {
//                     var n = t.replace(bt, wt);
//                     return function(t) {
//                         var e = "undefined" != typeof t.getAttributeNode && t.getAttributeNode("id");
//                         return e && e.value === n
//                     }
//                 }, _.find.ID = function(t, e) {
//                     if ("undefined" != typeof e.getElementById && N) {
//                         var n, i, r, o = e.getElementById(t);
//                         if (o) {
//                             if ((n = o.getAttributeNode("id")) && n.value === t) return [o];
//                             for (r = e.getElementsByName(t), i = 0; o = r[i++];)
//                                 if ((n = o.getAttributeNode("id")) && n.value === t) return [o]
//                         }
//                         return []
//                     }
//                 }), _.find.TAG = k.getElementsByTagName ? function(t, e) {
//                     return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t) : k.qsa ? e.querySelectorAll(t) : void 0
//                 } : function(t, e) {
//                     var n, i = [],
//                         r = 0,
//                         o = e.getElementsByTagName(t);
//                     if ("*" !== t) return o;
//                     for (; n = o[r++];) 1 === n.nodeType && i.push(n);
//                     return i
//                 }, _.find.CLASS = k.getElementsByClassName && function(t, e) {
//                     if ("undefined" != typeof e.getElementsByClassName && N) return e.getElementsByClassName(t)
//                 }, q = [], $ = [], (k.qsa = gt.test(R.querySelectorAll)) && (r(function(t) {
//                     j.appendChild(t).innerHTML = "<a id='" + O + "'></a><select id='" + O + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && $.push("[*^$]=" + nt + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || $.push("\\[" + nt + "*(?:value|" + et + ")"), t.querySelectorAll("[id~=" + O + "-]").length || $.push("~="), t.querySelectorAll(":checked").length || $.push(":checked"), t.querySelectorAll("a#" + O + "+*").length || $.push(".#.+[+~]")
//                 }), r(function(t) {
//                     t.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
//                     var e = R.createElement("input");
//                     e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && $.push("name" + nt + "*[*^$|!~]?="), 2 !== t.querySelectorAll(":enabled").length && $.push(":enabled", ":disabled"), j.appendChild(t).disabled = !0, 2 !== t.querySelectorAll(":disabled").length && $.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), $.push(",.*:")
//                 })), (k.matchesSelector = gt.test(H = j.matches || j.webkitMatchesSelector || j.mozMatchesSelector || j.oMatchesSelector || j.msMatchesSelector)) && r(function(t) {
//                     k.disconnectedMatch = H.call(t, "*"), H.call(t, "[s!='']:x"), q.push("!=", ot)
//                 }), $ = $.length && new RegExp($.join("|")), q = q.length && new RegExp(q.join("|")), e = gt.test(j.compareDocumentPosition), I = e || gt.test(j.contains) ? function(t, e) {
//                     var n = 9 === t.nodeType ? t.documentElement : t,
//                         i = e && e.parentNode;
//                     return t === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(i)))
//                 } : function(t, e) {
//                     if (e)
//                         for (; e = e.parentNode;)
//                             if (e === t) return !0;
//                     return !1
//                 }, X = e ? function(t, e) {
//                     if (t === e) return M = !0, 0;
//                     var n = !t.compareDocumentPosition - !e.compareDocumentPosition;
//                     return n || (1 & (n = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1) || !k.sortDetached && e.compareDocumentPosition(t) === n ? t === R || t.ownerDocument === F && I(F, t) ? -1 : e === R || e.ownerDocument === F && I(F, e) ? 1 : P ? tt(P, t) - tt(P, e) : 0 : 4 & n ? -1 : 1)
//                 } : function(t, e) {
//                     if (t === e) return M = !0, 0;
//                     var n, i = 0,
//                         r = t.parentNode,
//                         o = e.parentNode,
//                         s = [t],
//                         a = [e];
//                     if (!r || !o) return t === R ? -1 : e === R ? 1 : r ? -1 : o ? 1 : P ? tt(P, t) - tt(P, e) : 0;
//                     if (r === o) return u(t, e);
//                     for (n = t; n = n.parentNode;) s.unshift(n);
//                     for (n = e; n = n.parentNode;) a.unshift(n);
//                     for (; s[i] === a[i];) i++;
//                     return i ? u(s[i], a[i]) : s[i] === F ? -1 : a[i] === F ? 1 : 0
//                 }), R
//             }, w.matches = function(t, e) {
//                 return w(t, null, null, e)
//             }, w.matchesSelector = function(t, e) {
//                 if ((t.ownerDocument || t) !== R && D(t), e = e.replace(ct, "='$1']"), k.matchesSelector && N && !z[e + " "] && (!q || !q.test(e)) && (!$ || !$.test(e))) try {
//                     var n = H.call(t, e);
//                     if (n || k.disconnectedMatch || t.document && 11 !== t.document.nodeType) return n
//                 } catch (Ct) {}
//                 return 0 < w(e, R, null, [t]).length
//             }, w.contains = function(t, e) {
//                 return (t.ownerDocument || t) !== R && D(t), I(t, e)
//             }, w.attr = function(t, e) {
//                 (t.ownerDocument || t) !== R && D(t);
//                 var n = _.attrHandle[e.toLowerCase()],
//                     i = n && Y.call(_.attrHandle, e.toLowerCase()) ? n(t, e, !N) : undefined;
//                 return i !== undefined ? i : k.attributes || !N ? t.getAttribute(e) : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
//             }, w.escape = function(t) {
//                 return (t + "").replace(xt, kt)
//             }, w.error = function(t) {
//                 throw new Error("Syntax error, unrecognized expression: " + t)
//             }, w.uniqueSort = function(t) {
//                 var e, n = [],
//                     i = 0,
//                     r = 0;
//                 if (M = !k.detectDuplicates, P = !k.sortStable && t.slice(0), t.sort(X), M) {
//                     for (; e = t[r++];) e === t[r] && (i = n.push(r));
//                     for (; i--;) t.splice(n[i], 1)
//                 }
//                 return P = null, t
//             }, E = w.getText = function(t) {
//                 var e, n = "",
//                     i = 0,
//                     r = t.nodeType;
//                 if (r) {
//                     if (1 === r || 9 === r || 11 === r) {
//                         if ("string" == typeof t.textContent) return t.textContent;
//                         for (t = t.firstChild; t; t = t.nextSibling) n += E(t)
//                     } else if (3 === r || 4 === r) return t.nodeValue
//                 } else
//                     for (; e = t[i++];) n += E(e);
//                 return n
//             }, (_ = w.selectors = {
//                 cacheLength: 50,
//                 createPseudo: l,
//                 match: ft,
//                 attrHandle: {},
//                 find: {},
//                 relative: {
//                     ">": {
//                         dir: "parentNode",
//                         first: !0
//                     },
//                     " ": {
//                         dir: "parentNode"
//                     },
//                     "+": {
//                         dir: "previousSibling",
//                         first: !0
//                     },
//                     "~": {
//                         dir: "previousSibling"
//                     }
//                 },
//                 preFilter: {
//                     ATTR: function(t) {
//                         return t[1] = t[1].replace(bt, wt), t[3] = (t[3] || t[4] || t[5] || "").replace(bt, wt), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
//                     },
//                     CHILD: function(t) {
//                         return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || w.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && w.error(t[0]), t
//                     },
//                     PSEUDO: function(t) {
//                         var e, n = !t[6] && t[2];
//                         return ft.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && ht.test(n) && (e = T(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
//                     }
//                 },
//                 filter: {
//                     TAG: function(t) {
//                         var e = t.replace(bt, wt).toLowerCase();
//                         return "*" === t ? function() {
//                             return !0
//                         } : function(t) {
//                             return t.nodeName && t.nodeName.toLowerCase() === e
//                         }
//                     },
//                     CLASS: function(t) {
//                         var e = W[t + " "];
//                         return e || (e = new RegExp("(^|" + nt + ")" + t + "(" + nt + "|$)")) && W(t, function(t) {
//                             return e.test("string" == typeof t.className && t.className || "undefined" != typeof t.getAttribute && t.getAttribute("class") || "")
//                         })
//                     },
//                     ATTR: function(n, i, r) {
//                         return function(t) {
//                             var e = w.attr(t, n);
//                             return null == e ? "!=" === i : !i || (e += "", "=" === i ? e === r : "!=" === i ? e !== r : "^=" === i ? r && 0 === e.indexOf(r) : "*=" === i ? r && -1 < e.indexOf(r) : "$=" === i ? r && e.slice(-r.length) === r : "~=" === i ? -1 < (" " + e.replace(st, " ") + " ").indexOf(r) : "|=" === i && (e === r || e.slice(0, r.length + 1) === r + "-"))
//                         }
//                     },
//                     CHILD: function(p, t, e, m, g) {
//                         var v = "nth" !== p.slice(0, 3),
//                             y = "last" !== p.slice(-4),
//                             b = "of-type" === t;
//                         return 1 === m && 0 === g ? function(t) {
//                             return !!t.parentNode
//                         } : function(t, e, n) {
//                             var i, r, o, s, a, l, u = v !== y ? "nextSibling" : "previousSibling",
//                                 c = t.parentNode,
//                                 h = b && t.nodeName.toLowerCase(),
//                                 d = !n && !b,
//                                 f = !1;
//                             if (c) {
//                                 if (v) {
//                                     for (; u;) {
//                                         for (s = t; s = s[u];)
//                                             if (b ? s.nodeName.toLowerCase() === h : 1 === s.nodeType) return !1;
//                                         l = u = "only" === p && !l && "nextSibling"
//                                     }
//                                     return !0
//                                 }
//                                 if (l = [y ? c.firstChild : c.lastChild], y && d) {
//                                     for (f = (a = (i = (r = (o = (s = c)[O] || (s[O] = {}))[s.uniqueID] || (o[s.uniqueID] = {}))[p] || [])[0] === B && i[1]) && i[2], s = a && c.childNodes[a]; s = ++a && s && s[u] || (f = a = 0) || l.pop();)
//                                         if (1 === s.nodeType && ++f && s === t) {
//                                             r[p] = [B, a, f];
//                                             break
//                                         }
//                                 } else if (d && (f = a = (i = (r = (o = (s = t)[O] || (s[O] = {}))[s.uniqueID] || (o[s.uniqueID] = {}))[p] || [])[0] === B && i[1]), !1 === f)
//                                     for (;
//                                         (s = ++a && s && s[u] || (f = a = 0) || l.pop()) && ((b ? s.nodeName.toLowerCase() !== h : 1 !== s.nodeType) || !++f || (d && ((r = (o = s[O] || (s[O] = {}))[s.uniqueID] || (o[s.uniqueID] = {}))[p] = [B, f]), s !== t)););
//                                 return (f -= g) === m || f % m == 0 && 0 <= f / m
//                             }
//                         }
//                     },
//                     PSEUDO: function(t, o) {
//                         var e, s = _.pseudos[t] || _.setFilters[t.toLowerCase()] || w.error("unsupported pseudo: " + t);
//                         return s[O] ? s(o) : 1 < s.length ? (e = [t, t, "", o], _.setFilters.hasOwnProperty(t.toLowerCase()) ? l(function(t, e) {
//                             for (var n, i = s(t, o), r = i.length; r--;) t[n = tt(t, i[r])] = !(e[n] = i[r])
//                         }) : function(t) {
//                             return s(t, 0, e)
//                         }) : s
//                     }
//                 },
//                 pseudos: {
//                     not: l(function(t) {
//                         var i = [],
//                             r = [],
//                             a = S(t.replace(at, "$1"));
//                         return a[O] ? l(function(t, e, n, i) {
//                             for (var r, o = a(t, null, i, []), s = t.length; s--;)(r = o[s]) && (t[s] = !(e[s] = r))
//                         }) : function(t, e, n) {
//                             return i[0] = t, a(i, null, n, r), i[0] = null, !r.pop()
//                         }
//                     }),
//                     has: l(function(e) {
//                         return function(t) {
//                             return 0 < w(e, t).length
//                         }
//                     }),
//                     contains: l(function(e) {
//                         return e = e.replace(bt, wt),
//                             function(t) {
//                                 return -1 < (t.textContent || t.innerText || E(t)).indexOf(e)
//                             }
//                     }),
//                     lang: l(function(n) {
//                         return dt.test(n || "") || w.error("unsupported lang: " + n), n = n.replace(bt, wt).toLowerCase(),
//                             function(t) {
//                                 var e;
//                                 do {
//                                     if (e = N ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (e = e.toLowerCase()) === n || 0 === e.indexOf(n + "-")
//                                 } while ((t = t.parentNode) && 1 === t.nodeType);
//                                 return !1
//                             }
//                     }),
//                     target: function(t) {
//                         var e = n.location && n.location.hash;
//                         return e && e.slice(1) === t.id
//                     },
//                     root: function(t) {
//                         return t === j
//                     },
//                     focus: function(t) {
//                         return t === R.activeElement && (!R.hasFocus || R.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
//                     },
//                     enabled: s(!1),
//                     disabled: s(!0),
//                     checked: function(t) {
//                         var e = t.nodeName.toLowerCase();
//                         return "input" === e && !!t.checked || "option" === e && !!t.selected
//                     },
//                     selected: function(t) {
//                         return t.parentNode && t.parentNode.selectedIndex, !0 === t.selected
//                     },
//                     empty: function(t) {
//                         for (t = t.firstChild; t; t = t.nextSibling)
//                             if (t.nodeType < 6) return !1;
//                         return !0
//                     },
//                     parent: function(t) {
//                         return !_.pseudos.empty(t)
//                     },
//                     header: function(t) {
//                         return mt.test(t.nodeName)
//                     },
//                     input: function(t) {
//                         return pt.test(t.nodeName)
//                     },
//                     button: function(t) {
//                         var e = t.nodeName.toLowerCase();
//                         return "input" === e && "button" === t.type || "button" === e
//                     },
//                     text: function(t) {
//                         var e;
//                         return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
//                     },
//                     first: a(function() {
//                         return [0]
//                     }),
//                     last: a(function(t, e) {
//                         return [e - 1]
//                     }),
//                     eq: a(function(t, e, n) {
//                         return [n < 0 ? n + e : n]
//                     }),
//                     even: a(function(t, e) {
//                         for (var n = 0; n < e; n += 2) t.push(n);
//                         return t
//                     }),
//                     odd: a(function(t, e) {
//                         for (var n = 1; n < e; n += 2) t.push(n);
//                         return t
//                     }),
//                     lt: a(function(t, e, n) {
//                         for (var i = n < 0 ? n + e : n; 0 <= --i;) t.push(i);
//                         return t
//                     }),
//                     gt: a(function(t, e, n) {
//                         for (var i = n < 0 ? n + e : n; ++i < e;) t.push(i);
//                         return t
//                     })
//                 }
//             }).pseudos.nth = _.pseudos.eq, {
//                 radio: !0,
//                 checkbox: !0,
//                 file: !0,
//                 password: !0,
//                 image: !0
//             }) _.pseudos[v] = i(v);
//         for (v in {
//                 submit: !0,
//                 reset: !0
//             }) _.pseudos[v] = o(v);
//         return c.prototype = _.filters = _.pseudos, _.setFilters = new c, T = w.tokenize = function(t, e) {
//             var n, i, r, o, s, a, l, u = U[t + " "];
//             if (u) return e ? 0 : u.slice(0);
//             for (s = t, a = [], l = _.preFilter; s;) {
//                 for (o in n && !(i = lt.exec(s)) || (i && (s = s.slice(i[0].length) || s), a.push(r = [])), n = !1, (i = ut.exec(s)) && (n = i.shift(), r.push({
//                         value: n,
//                         type: i[0].replace(at, " ")
//                     }), s = s.slice(n.length)), _.filter) !(i = ft[o].exec(s)) || l[o] && !(i = l[o](i)) || (n = i.shift(), r.push({
//                     value: n,
//                     type: o,
//                     matches: i
//                 }), s = s.slice(n.length));
//                 if (!n) break
//             }
//             return e ? s.length : s ? w.error(t) : U(t, a).slice(0)
//         }, S = w.compile = function(t, e) {
//             var n, i = [],
//                 r = [],
//                 o = z[t + " "];
//             if (!o) {
//                 for (e || (e = T(t)), n = e.length; n--;)(o = f(e[n]))[O] ? i.push(o) : r.push(o);
//                 (o = z(t, g(r, i))).selector = t
//             }
//             return o
//         }, A = w.select = function(t, e, n, i) {
//             var r, o, s, a, l, u = "function" == typeof t && t,
//                 c = !i && T(t = u.selector || t);
//             if (n = n || [], 1 === c.length) {
//                 if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (s = o[0]).type && 9 === e.nodeType && N && _.relative[o[1].type]) {
//                     if (!(e = (_.find.ID(s.matches[0].replace(bt, wt), e) || [])[0])) return n;
//                     u && (e = e.parentNode), t = t.slice(o.shift().value.length)
//                 }
//                 for (r = ft.needsContext.test(t) ? 0 : o.length; r-- && (s = o[r], !_.relative[a = s.type]);)
//                     if ((l = _.find[a]) && (i = l(s.matches[0].replace(bt, wt), yt.test(o[0].type) && p(e.parentNode) || e))) {
//                         if (o.splice(r, 1), !(t = i.length && m(o))) return J.apply(n, i), n;
//                         break
//                     }
//             }
//             return (u || S(t, c))(i, e, !N, n, !e || yt.test(t) && p(e.parentNode) || e), n
//         }, k.sortStable = O.split("").sort(X).join("") === O, k.detectDuplicates = !!M, D(), k.sortDetached = r(function(t) {
//             return 1 & t.compareDocumentPosition(R.createElement("fieldset"))
//         }), r(function(t) {
//             return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
//         }) || e("type|href|height|width", function(t, e, n) {
//             if (!n) return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
//         }), k.attributes && r(function(t) {
//             return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
//         }) || e("value", function(t, e, n) {
//             if (!n && "input" === t.nodeName.toLowerCase()) return t.defaultValue
//         }), r(function(t) {
//             return null == t.getAttribute("disabled")
//         }) || e(et, function(t, e, n) {
//             var i;
//             if (!n) return !0 === t[e] ? e.toLowerCase() : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
//         }), w
//     }(E);
//     kt.find = Et, kt.expr = Et.selectors, kt.expr[":"] = kt.expr.pseudos, kt.uniqueSort = kt.unique = Et.uniqueSort, kt.text = Et.getText, kt.isXMLDoc = Et.isXML, kt.contains = Et.contains, kt.escapeSelector = Et.escape;
//     var Ct = function(t, e, n) {
//             for (var i = [], r = n !== undefined;
//                 (t = t[e]) && 9 !== t.nodeType;)
//                 if (1 === t.nodeType) {
//                     if (r && kt(t).is(n)) break;
//                     i.push(t)
//                 } return i
//         },
//         Tt = function(t, e) {
//             for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
//             return n
//         },
//         St = kt.expr.match.needsContext,
//         At = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
//     kt.filter = function(t, e, n) {
//         var i = e[0];
//         return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === i.nodeType ? kt.find.matchesSelector(i, t) ? [i] : [] : kt.find.matches(t, kt.grep(e, function(t) {
//             return 1 === t.nodeType
//         }))
//     }, kt.fn.extend({
//         find: function(t) {
//             var e, n, i = this.length,
//                 r = this;
//             if ("string" != typeof t) return this.pushStack(kt(t).filter(function() {
//                 for (e = 0; e < i; e++)
//                     if (kt.contains(r[e], this)) return !0
//             }));
//             for (n = this.pushStack([]), e = 0; e < i; e++) kt.find(t, r[e], n);
//             return 1 < i ? kt.uniqueSort(n) : n
//         },
//         filter: function(t) {
//             return this.pushStack(e(this, t || [], !1))
//         },
//         not: function(t) {
//             return this.pushStack(e(this, t || [], !0))
//         },
//         is: function(t) {
//             return !!e(this, "string" == typeof t && St.test(t) ? kt(t) : t || [], !1).length
//         }
//     });
//     var Lt, Pt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
//     (kt.fn.init = function(t, e, n) {
//         var i, r;
//         if (!t) return this;
//         if (n = n || Lt, "string" != typeof t) return t.nodeType ? (this[0] = t, this.length = 1, this) : yt(t) ? n.ready !== undefined ? n.ready(t) : t(kt) : kt.makeArray(t, this);
//         if (!(i = "<" === t[0] && ">" === t[t.length - 1] && 3 <= t.length ? [null, t, null] : Pt.exec(t)) || !i[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
//         if (i[1]) {
//             if (e = e instanceof kt ? e[0] : e, kt.merge(this, kt.parseHTML(i[1], e && e.nodeType ? e.ownerDocument || e : st, !0)), At.test(i[1]) && kt.isPlainObject(e))
//                 for (i in e) yt(this[i]) ? this[i](e[i]) : this.attr(i, e[i]);
//             return this
//         }
//         return (r = st.getElementById(i[2])) && (this[0] = r, this.length = 1), this
//     }).prototype = kt.fn, Lt = kt(st);
//     var Mt = /^(?:parents|prev(?:Until|All))/,
//         Dt = {
//             children: !0,
//             contents: !0,
//             next: !0,
//             prev: !0
//         };
//     kt.fn.extend({
//         has: function(t) {
//             var e = kt(t, this),
//                 n = e.length;
//             return this.filter(function() {
//                 for (var t = 0; t < n; t++)
//                     if (kt.contains(this, e[t])) return !0
//             })
//         },
//         closest: function(t, e) {
//             var n, i = 0,
//                 r = this.length,
//                 o = [],
//                 s = "string" != typeof t && kt(t);
//             if (!St.test(t))
//                 for (; i < r; i++)
//                     for (n = this[i]; n && n !== e; n = n.parentNode)
//                         if (n.nodeType < 11 && (s ? -1 < s.index(n) : 1 === n.nodeType && kt.find.matchesSelector(n, t))) {
//                             o.push(n);
//                             break
//                         } return this.pushStack(1 < o.length ? kt.uniqueSort(o) : o)
//         },
//         index: function(t) {
//             return t ? "string" == typeof t ? ht.call(kt(t), this[0]) : ht.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
//         },
//         add: function(t, e) {
//             return this.pushStack(kt.uniqueSort(kt.merge(this.get(), kt(t, e))))
//         },
//         addBack: function(t) {
//             return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
//         }
//     }), kt.each({
//         parent: function(t) {
//             var e = t.parentNode;
//             return e && 11 !== e.nodeType ? e : null
//         },
//         parents: function(t) {
//             return Ct(t, "parentNode")
//         },
//         parentsUntil: function(t, e, n) {
//             return Ct(t, "parentNode", n)
//         },
//         next: function(t) {
//             return n(t, "nextSibling")
//         },
//         prev: function(t) {
//             return n(t, "previousSibling")
//         },
//         nextAll: function(t) {
//             return Ct(t, "nextSibling")
//         },
//         prevAll: function(t) {
//             return Ct(t, "previousSibling")
//         },
//         nextUntil: function(t, e, n) {
//             return Ct(t, "nextSibling", n)
//         },
//         prevUntil: function(t, e, n) {
//             return Ct(t, "previousSibling", n)
//         },
//         siblings: function(t) {
//             return Tt((t.parentNode || {}).firstChild, t)
//         },
//         children: function(t) {
//             return Tt(t.firstChild)
//         },
//         contents: function(t) {
//             return u(t, "iframe") ? t.contentDocument : (u(t, "template") && (t = t.content || t), kt.merge([], t.childNodes))
//         }
//     }, function(i, r) {
//         kt.fn[i] = function(t, e) {
//             var n = kt.map(this, r, t);
//             return "Until" !== i.slice(-5) && (e = t), e && "string" == typeof e && (n = kt.filter(e, n)), 1 < this.length && (Dt[i] || kt.uniqueSort(n), Mt.test(i) && n.reverse()), this.pushStack(n)
//         }
//     });
//     var Rt = /[^\x20\t\r\n\f]+/g;
//     kt.Callbacks = function(i) {
//         i = "string" == typeof i ? c(i) : kt.extend({}, i);
//         var r, t, e, n, o = [],
//             s = [],
//             a = -1,
//             l = function() {
//                 for (n = n || i.once, e = r = !0; s.length; a = -1)
//                     for (t = s.shift(); ++a < o.length;) !1 === o[a].apply(t[0], t[1]) && i.stopOnFalse && (a = o.length, t = !1);
//                 i.memory || (t = !1), r = !1, n && (o = t ? [] : "")
//             },
//             u = {
//                 add: function() {
//                     return o && (t && !r && (a = o.length - 1, s.push(t)), function n(t) {
//                         kt.each(t, function(t, e) {
//                             yt(e) ? i.unique && u.has(e) || o.push(e) : e && e.length && "string" !== g(e) && n(e)
//                         })
//                     }(arguments), t && !r && l()), this
//                 },
//                 remove: function() {
//                     return kt.each(arguments, function(t, e) {
//                         for (var n; - 1 < (n = kt.inArray(e, o, n));) o.splice(n, 1), n <= a && a--
//                     }), this
//                 },
//                 has: function(t) {
//                     return t ? -1 < kt.inArray(t, o) : 0 < o.length
//                 },
//                 empty: function() {
//                     return o && (o = []), this
//                 },
//                 disable: function() {
//                     return n = s = [], o = t = "", this
//                 },
//                 disabled: function() {
//                     return !o
//                 },
//                 lock: function() {
//                     return n = s = [], t || r || (o = t = ""), this
//                 },
//                 locked: function() {
//                     return !!n
//                 },
//                 fireWith: function(t, e) {
//                     return n || (e = [t, (e = e || []).slice ? e.slice() : e], s.push(e), r || l()), this
//                 },
//                 fire: function() {
//                     return u.fireWith(this, arguments), this
//                 },
//                 fired: function() {
//                     return !!e
//                 }
//             };
//         return u
//     }, kt.extend({
//         Deferred: function(t) {
//             var o = [
//                     ["notify", "progress", kt.Callbacks("memory"), kt.Callbacks("memory"), 2],
//                     ["resolve", "done", kt.Callbacks("once memory"), kt.Callbacks("once memory"), 0, "resolved"],
//                     ["reject", "fail", kt.Callbacks("once memory"), kt.Callbacks("once memory"), 1, "rejected"]
//                 ],
//                 r = "pending",
//                 s = {
//                     state: function() {
//                         return r
//                     },
//                     always: function() {
//                         return a.done(arguments).fail(arguments), this
//                     },
//                     "catch": function(t) {
//                         return s.then(null, t)
//                     },
//                     pipe: function() {
//                         var r = arguments;
//                         return kt.Deferred(function(i) {
//                             kt.each(o, function(t, e) {
//                                 var n = yt(r[e[4]]) && r[e[4]];
//                                 a[e[1]](function() {
//                                     var t = n && n.apply(this, arguments);
//                                     t && yt(t.promise) ? t.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[e[0] + "With"](this, n ? [t] : arguments)
//                                 })
//                             }), r = null
//                         }).promise()
//                     },
//                     then: function(e, n, i) {
//                         function u(o, s, a, l) {
//                             return function() {
//                                 var n = this,
//                                     i = arguments,
//                                     e = function() {
//                                         var t, e;
//                                         if (!(o < c)) {
//                                             if ((t = a.apply(n, i)) === s.promise()) throw new TypeError("Thenable self-resolution");
//                                             e = t && ("object" == typeof t || "function" == typeof t) && t.then, yt(e) ? l ? e.call(t, u(c, s, h, l), u(c, s, d, l)) : (c++, e.call(t, u(c, s, h, l), u(c, s, d, l), u(c, s, h, s.notifyWith))) : (a !== h && (n = undefined, i = [t]), (l || s.resolveWith)(n, i))
//                                         }
//                                     },
//                                     r = l ? e : function() {
//                                         try {
//                                             e()
//                                         } catch (t) {
//                                             kt.Deferred.exceptionHook && kt.Deferred.exceptionHook(t, r.stackTrace), c <= o + 1 && (a !== d && (n = undefined, i = [t]), s.rejectWith(n, i))
//                                         }
//                                     };
//                                 o ? r() : (kt.Deferred.getStackHook && (r.stackTrace = kt.Deferred.getStackHook()), E.setTimeout(r))
//                             }
//                         }
//                         var c = 0;
//                         return kt.Deferred(function(t) {
//                             o[0][3].add(u(0, t, yt(i) ? i : h, t.notifyWith)), o[1][3].add(u(0, t, yt(e) ? e : h)), o[2][3].add(u(0, t, yt(n) ? n : d))
//                         }).promise()
//                     },
//                     promise: function(t) {
//                         return null != t ? kt.extend(t, s) : s
//                     }
//                 },
//                 a = {};
//             return kt.each(o, function(t, e) {
//                 var n = e[2],
//                     i = e[5];
//                 s[e[1]] = n.add, i && n.add(function() {
//                     r = i
//                 }, o[3 - t][2].disable, o[3 - t][3].disable, o[0][2].lock, o[0][3].lock), n.add(e[3].fire), a[e[0]] = function() {
//                     return a[e[0] + "With"](this === a ? undefined : this, arguments), this
//                 }, a[e[0] + "With"] = n.fireWith
//             }), s.promise(a), t && t.call(a, a), a
//         },
//         when: function(t) {
//             var n = arguments.length,
//                 e = n,
//                 i = Array(e),
//                 r = lt.call(arguments),
//                 o = kt.Deferred(),
//                 s = function(e) {
//                     return function(t) {
//                         i[e] = this, r[e] = 1 < arguments.length ? lt.call(arguments) : t, --n || o.resolveWith(i, r)
//                     }
//                 };
//             if (n <= 1 && (l(t, o.done(s(e)).resolve, o.reject, !n), "pending" === o.state() || yt(r[e] && r[e].then))) return o.then();
//             for (; e--;) l(r[e], s(e), o.reject);
//             return o.promise()
//         }
//     });
//     var jt = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
//     kt.Deferred.exceptionHook = function(t, e) {
//         E.console && E.console.warn && t && jt.test(t.name) && E.console.warn("jQuery.Deferred exception: " + t.message, t.stack, e)
//     }, kt.readyException = function(t) {
//         E.setTimeout(function() {
//             throw t
//         })
//     };
//     var Nt = kt.Deferred();
//     kt.fn.ready = function(t) {
//         return Nt.then(t)["catch"](function(t) {
//             kt.readyException(t)
//         }), this
//     }, kt.extend({
//         isReady: !1,
//         readyWait: 1,
//         ready: function(t) {
//             (!0 === t ? --kt.readyWait : kt.isReady) || (kt.isReady = !0) !== t && 0 < --kt.readyWait || Nt.resolveWith(st, [kt])
//         }
//     }), kt.ready.then = Nt.then, "complete" === st.readyState || "loading" !== st.readyState && !st.documentElement.doScroll ? E.setTimeout(kt.ready) : (st.addEventListener("DOMContentLoaded", i), E.addEventListener("load", i));
//     var $t = function(t, e, n, i, r, o, s) {
//             var a = 0,
//                 l = t.length,
//                 u = null == n;
//             if ("object" === g(n))
//                 for (a in r = !0, n) $t(t, e, a, n[a], !0, o, s);
//             else if (i !== undefined && (r = !0, yt(i) || (s = !0), u && (s ? (e.call(t, i), e = null) : (u = e, e = function(t, e, n) {
//                     return u.call(kt(t), n)
//                 })), e))
//                 for (; a < l; a++) e(t[a], n, s ? i : i.call(t[a], a, e(t[a], n)));
//             return r ? t : u ? e.call(t) : l ? e(t[0], n) : o
//         },
//         qt = /^-ms-/,
//         Ht = /-([a-z])/g,
//         It = function(t) {
//             return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
//         };
//     o.uid = 1, o.prototype = {
//         cache: function(t) {
//             var e = t[this.expando];
//             return e || (e = {}, It(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, {
//                 value: e,
//                 configurable: !0
//             }))), e
//         },
//         set: function(t, e, n) {
//             var i, r = this.cache(t);
//             if ("string" == typeof e) r[f(e)] = n;
//             else
//                 for (i in e) r[f(i)] = e[i];
//             return r
//         },
//         get: function(t, e) {
//             return e === undefined ? this.cache(t) : t[this.expando] && t[this.expando][f(e)]
//         },
//         access: function(t, e, n) {
//             return e === undefined || e && "string" == typeof e && n === undefined ? this.get(t, e) : (this.set(t, e, n), n !== undefined ? n : e)
//         },
//         remove: function(t, e) {
//             var n, i = t[this.expando];
//             if (i !== undefined) {
//                 if (e !== undefined) {
//                     n = (e = Array.isArray(e) ? e.map(f) : (e = f(e)) in i ? [e] : e.match(Rt) || []).length;
//                     for (; n--;) delete i[e[n]]
//                 }(e === undefined || kt.isEmptyObject(i)) && (t.nodeType ? t[this.expando] = undefined : delete t[this.expando])
//             }
//         },
//         hasData: function(t) {
//             var e = t[this.expando];
//             return e !== undefined && !kt.isEmptyObject(e)
//         }
//     };
//     var Ot = new o,
//         Ft = new o,
//         Bt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
//         Vt = /[A-Z]/g;
//     kt.extend({
//         hasData: function(t) {
//             return Ft.hasData(t) || Ot.hasData(t)
//         },
//         data: function(t, e, n) {
//             return Ft.access(t, e, n)
//         },
//         removeData: function(t, e) {
//             Ft.remove(t, e)
//         },
//         _data: function(t, e, n) {
//             return Ot.access(t, e, n)
//         },
//         _removeData: function(t, e) {
//             Ot.remove(t, e)
//         }
//     }), kt.fn.extend({
//         data: function(n, t) {
//             var e, i, r, o = this[0],
//                 s = o && o.attributes;
//             if (n !== undefined) return "object" == typeof n ? this.each(function() {
//                 Ft.set(this, n)
//             }) : $t(this, function(t) {
//                 var e;
//                 if (o && t === undefined) return (e = Ft.get(o, n)) !== undefined ? e : (e = p(o, n)) !== undefined ? e : void 0;
//                 this.each(function() {
//                     Ft.set(this, n, t)
//                 })
//             }, null, t, 1 < arguments.length, null, !0);
//             if (this.length && (r = Ft.get(o), 1 === o.nodeType && !Ot.get(o, "hasDataAttrs"))) {
//                 for (e = s.length; e--;) s[e] && 0 === (i = s[e].name).indexOf("data-") && (i = f(i.slice(5)), p(o, i, r[i]));
//                 Ot.set(o, "hasDataAttrs", !0)
//             }
//             return r
//         },
//         removeData: function(t) {
//             return this.each(function() {
//                 Ft.remove(this, t)
//             })
//         }
//     }), kt.extend({
//         queue: function(t, e, n) {
//             var i;
//             if (t) return e = (e || "fx") + "queue", i = Ot.get(t, e), n && (!i || Array.isArray(n) ? i = Ot.access(t, e, kt.makeArray(n)) : i.push(n)), i || []
//         },
//         dequeue: function(t, e) {
//             e = e || "fx";
//             var n = kt.queue(t, e),
//                 i = n.length,
//                 r = n.shift(),
//                 o = kt._queueHooks(t, e),
//                 s = function() {
//                     kt.dequeue(t, e)
//                 };
//             "inprogress" === r && (r = n.shift(), i--), r && ("fx" === e && n.unshift("inprogress"), delete o.stop, r.call(t, s, o)), !i && o && o.empty.fire()
//         },
//         _queueHooks: function(t, e) {
//             var n = e + "queueHooks";
//             return Ot.get(t, n) || Ot.access(t, n, {
//                 empty: kt.Callbacks("once memory").add(function() {
//                     Ot.remove(t, [e + "queue", n])
//                 })
//             })
//         }
//     }), kt.fn.extend({
//         queue: function(e, n) {
//             var t = 2;
//             return "string" != typeof e && (n = e, e = "fx", t--), arguments.length < t ? kt.queue(this[0], e) : n === undefined ? this : this.each(function() {
//                 var t = kt.queue(this, e, n);
//                 kt._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && kt.dequeue(this, e)
//             })
//         },
//         dequeue: function(t) {
//             return this.each(function() {
//                 kt.dequeue(this, t)
//             })
//         },
//         clearQueue: function(t) {
//             return this.queue(t || "fx", [])
//         },
//         promise: function(t, e) {
//             var n, i = 1,
//                 r = kt.Deferred(),
//                 o = this,
//                 s = this.length,
//                 a = function() {
//                     --i || r.resolveWith(o, [o])
//                 };
//             for ("string" != typeof t && (e = t, t = undefined), t = t || "fx"; s--;)(n = Ot.get(o[s], t + "queueHooks")) && n.empty && (i++, n.empty.add(a));
//             return a(), r.promise(e)
//         }
//     });
//     var Wt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
//         Ut = new RegExp("^(?:([+-])=|)(" + Wt + ")([a-z%]*)$", "i"),
//         zt = ["Top", "Right", "Bottom", "Left"],
//         Xt = function(t, e) {
//             return "none" === (t = e || t).style.display || "" === t.style.display && kt.contains(t.ownerDocument, t) && "none" === kt.css(t, "display")
//         },
//         Yt = function(t, e, n, i) {
//             var r, o, s = {};
//             for (o in e) s[o] = t.style[o], t.style[o] = e[o];
//             for (o in r = n.apply(t, i || []), e) t.style[o] = s[o];
//             return r
//         },
//         Qt = {};
//     kt.fn.extend({
//         show: function() {
//             return b(this, !0)
//         },
//         hide: function() {
//             return b(this)
//         },
//         toggle: function(t) {
//             return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
//                 Xt(this) ? kt(this).show() : kt(this).hide()
//             })
//         }
//     });
//     var Kt = /^(?:checkbox|radio)$/i,
//         Gt = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
//         Jt = /^$|^module$|\/(?:java|ecma)script/i,
//         Zt = {
//             option: [1, "<select multiple='multiple'>", "</select>"],
//             thead: [1, "<table>", "</table>"],
//             col: [2, "<table><colgroup>", "</colgroup></table>"],
//             tr: [2, "<table><tbody>", "</tbody></table>"],
//             td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
//             _default: [0, "", ""]
//         };
//     Zt.optgroup = Zt.option, Zt.tbody = Zt.tfoot = Zt.colgroup = Zt.caption = Zt.thead, Zt.th = Zt.td;
//     var te, ee, ne = /<|&#?\w+;/;
//     te = st.createDocumentFragment().appendChild(st.createElement("div")), (ee = st.createElement("input")).setAttribute("type", "radio"), ee.setAttribute("checked", "checked"), ee.setAttribute("name", "t"), te.appendChild(ee), vt.checkClone = te.cloneNode(!0).cloneNode(!0).lastChild.checked, te.innerHTML = "<textarea>x</textarea>", vt.noCloneChecked = !!te.cloneNode(!0).lastChild.defaultValue;
//     var ie = st.documentElement,
//         re = /^key/,
//         oe = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
//         se = /^([^.]*)(?:\.(.+)|)/;
//     kt.event = {
//         global: {},
//         add: function(e, t, n, i, r) {
//             var o, s, a, l, u, c, h, d, f, p, m, g = Ot.get(e);
//             if (g)
//                 for (n.handler && (n = (o = n).handler, r = o.selector), r && kt.find.matchesSelector(ie, r), n.guid || (n.guid = kt.guid++), (l = g.events) || (l = g.events = {}), (s = g.handle) || (s = g.handle = function(t) {
//                         return void 0 !== kt && kt.event.triggered !== t.type ? kt.event.dispatch.apply(e, arguments) : undefined
//                     }), u = (t = (t || "").match(Rt) || [""]).length; u--;) f = m = (a = se.exec(t[u]) || [])[1], p = (a[2] || "").split(".").sort(), f && (h = kt.event.special[f] || {}, f = (r ? h.delegateType : h.bindType) || f, h = kt.event.special[f] || {}, c = kt.extend({
//                     type: f,
//                     origType: m,
//                     data: i,
//                     handler: n,
//                     guid: n.guid,
//                     selector: r,
//                     needsContext: r && kt.expr.match.needsContext.test(r),
//                     namespace: p.join(".")
//                 }, o), (d = l[f]) || ((d = l[f] = []).delegateCount = 0, h.setup && !1 !== h.setup.call(e, i, p, s) || e.addEventListener && e.addEventListener(f, s)), h.add && (h.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), r ? d.splice(d.delegateCount++, 0, c) : d.push(c), kt.event.global[f] = !0)
//         },
//         remove: function(t, e, n, i, r) {
//             var o, s, a, l, u, c, h, d, f, p, m, g = Ot.hasData(t) && Ot.get(t);
//             if (g && (l = g.events)) {
//                 for (u = (e = (e || "").match(Rt) || [""]).length; u--;)
//                     if (f = m = (a = se.exec(e[u]) || [])[1], p = (a[2] || "").split(".").sort(), f) {
//                         for (h = kt.event.special[f] || {}, d = l[f = (i ? h.delegateType : h.bindType) || f] || [], a = a[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = o = d.length; o--;) c = d[o], !r && m !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || i && i !== c.selector && ("**" !== i || !c.selector) || (d.splice(o, 1), c.selector && d.delegateCount--, h.remove && h.remove.call(t, c));
//                         s && !d.length && (h.teardown && !1 !== h.teardown.call(t, p, g.handle) || kt.removeEvent(t, f, g.handle), delete l[f])
//                     } else
//                         for (f in l) kt.event.remove(t, f + e[u], n, i, !0);
//                 kt.isEmptyObject(l) && Ot.remove(t, "handle events")
//             }
//         },
//         dispatch: function(t) {
//             var e, n, i, r, o, s, a = kt.event.fix(t),
//                 l = new Array(arguments.length),
//                 u = (Ot.get(this, "events") || {})[a.type] || [],
//                 c = kt.event.special[a.type] || {};
//             for (l[0] = a, e = 1; e < arguments.length; e++) l[e] = arguments[e];
//             if (a.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, a)) {
//                 for (s = kt.event.handlers.call(this, a, u), e = 0;
//                     (r = s[e++]) && !a.isPropagationStopped();)
//                     for (a.currentTarget = r.elem, n = 0;
//                         (o = r.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !a.rnamespace.test(o.namespace) || (a.handleObj = o, a.data = o.data, (i = ((kt.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, l)) !== undefined && !1 === (a.result = i) && (a.preventDefault(), a.stopPropagation()));
//                 return c.postDispatch && c.postDispatch.call(this, a), a.result
//             }
//         },
//         handlers: function(t, e) {
//             var n, i, r, o, s, a = [],
//                 l = e.delegateCount,
//                 u = t.target;
//             if (l && u.nodeType && !("click" === t.type && 1 <= t.button))
//                 for (; u !== this; u = u.parentNode || this)
//                     if (1 === u.nodeType && ("click" !== t.type || !0 !== u.disabled)) {
//                         for (o = [], s = {}, n = 0; n < l; n++) s[r = (i = e[n]).selector + " "] === undefined && (s[r] = i.needsContext ? -1 < kt(r, this).index(u) : kt.find(r, this, null, [u]).length), s[r] && o.push(i);
//                         o.length && a.push({
//                             elem: u,
//                             handlers: o
//                         })
//                     } return u = this, l < e.length && a.push({
//                 elem: u,
//                 handlers: e.slice(l)
//             }), a
//         },
//         addProp: function(e, t) {
//             Object.defineProperty(kt.Event.prototype, e, {
//                 enumerable: !0,
//                 configurable: !0,
//                 get: yt(t) ? function() {
//                     if (this.originalEvent) return t(this.originalEvent)
//                 } : function() {
//                     if (this.originalEvent) return this.originalEvent[e]
//                 },
//                 set: function(t) {
//                     Object.defineProperty(this, e, {
//                         enumerable: !0,
//                         configurable: !0,
//                         writable: !0,
//                         value: t
//                     })
//                 }
//             })
//         },
//         fix: function(t) {
//             return t[kt.expando] ? t : new kt.Event(t)
//         },
//         special: {
//             load: {
//                 noBubble: !0
//             },
//             focus: {
//                 trigger: function() {
//                     if (this !== T() && this.focus) return this.focus(), !1
//                 },
//                 delegateType: "focusin"
//             },
//             blur: {
//                 trigger: function() {
//                     if (this === T() && this.blur) return this.blur(), !1
//                 },
//                 delegateType: "focusout"
//             },
//             click: {
//                 trigger: function() {
//                     if ("checkbox" === this.type && this.click && u(this, "input")) return this.click(), !1
//                 },
//                 _default: function(t) {
//                     return u(t.target, "a")
//                 }
//             },
//             beforeunload: {
//                 postDispatch: function(t) {
//                     t.result !== undefined && t.originalEvent && (t.originalEvent.returnValue = t.result)
//                 }
//             }
//         }
//     }, kt.removeEvent = function(t, e, n) {
//         t.removeEventListener && t.removeEventListener(e, n)
//     }, kt.Event = function(t, e) {
//         if (!(this instanceof kt.Event)) return new kt.Event(t, e);
//         t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.defaultPrevented === undefined && !1 === t.returnValue ? _ : C, this.target = t.target && 3 === t.target.nodeType ? t.target.parentNode : t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget) : this.type = t, e && kt.extend(this, e), this.timeStamp = t && t.timeStamp || Date.now(), this[kt.expando] = !0
//     }, kt.Event.prototype = {
//         constructor: kt.Event,
//         isDefaultPrevented: C,
//         isPropagationStopped: C,
//         isImmediatePropagationStopped: C,
//         isSimulated: !1,
//         preventDefault: function() {
//             var t = this.originalEvent;
//             this.isDefaultPrevented = _, t && !this.isSimulated && t.preventDefault()
//         },
//         stopPropagation: function() {
//             var t = this.originalEvent;
//             this.isPropagationStopped = _, t && !this.isSimulated && t.stopPropagation()
//         },
//         stopImmediatePropagation: function() {
//             var t = this.originalEvent;
//             this.isImmediatePropagationStopped = _, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation()
//         }
//     }, kt.each({
//         altKey: !0,
//         bubbles: !0,
//         cancelable: !0,
//         changedTouches: !0,
//         ctrlKey: !0,
//         detail: !0,
//         eventPhase: !0,
//         metaKey: !0,
//         pageX: !0,
//         pageY: !0,
//         shiftKey: !0,
//         view: !0,
//         "char": !0,
//         charCode: !0,
//         key: !0,
//         keyCode: !0,
//         button: !0,
//         buttons: !0,
//         clientX: !0,
//         clientY: !0,
//         offsetX: !0,
//         offsetY: !0,
//         pointerId: !0,
//         pointerType: !0,
//         screenX: !0,
//         screenY: !0,
//         targetTouches: !0,
//         toElement: !0,
//         touches: !0,
//         which: function(t) {
//             var e = t.button;
//             return null == t.which && re.test(t.type) ? null != t.charCode ? t.charCode : t.keyCode : !t.which && e !== undefined && oe.test(t.type) ? 1 & e ? 1 : 2 & e ? 3 : 4 & e ? 2 : 0 : t.which
//         }
//     }, kt.event.addProp), kt.each({
//         mouseenter: "mouseover",
//         mouseleave: "mouseout",
//         pointerenter: "pointerover",
//         pointerleave: "pointerout"
//     }, function(t, o) {
//         kt.event.special[t] = {
//             delegateType: o,
//             bindType: o,
//             handle: function(t) {
//                 var e, n = this,
//                     i = t.relatedTarget,
//                     r = t.handleObj;
//                 return i && (i === n || kt.contains(n, i)) || (t.type = r.origType, e = r.handler.apply(this, arguments), t.type = o), e
//             }
//         }
//     }), kt.fn.extend({
//         on: function(t, e, n, i) {
//             return S(this, t, e, n, i)
//         },
//         one: function(t, e, n, i) {
//             return S(this, t, e, n, i, 1)
//         },
//         off: function(t, e, n) {
//             var i, r;
//             if (t && t.preventDefault && t.handleObj) return i = t.handleObj, kt(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
//             if ("object" != typeof t) return !1 !== e && "function" != typeof e || (n = e, e = undefined), !1 === n && (n = C), this.each(function() {
//                 kt.event.remove(this, t, n, e)
//             });
//             for (r in t) this.off(r, e, t[r]);
//             return this
//         }
//     });
//     var ae = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
//         le = /<script|<style|<link/i,
//         ue = /checked\s*(?:[^=]|=\s*.checked.)/i,
//         ce = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
//     kt.extend({
//         htmlPrefilter: function(t) {
//             return t.replace(ae, "<$1></$2>")
//         },
//         clone: function(t, e, n) {
//             var i, r, o, s, a = t.cloneNode(!0),
//                 l = kt.contains(t.ownerDocument, t);
//             if (!(vt.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || kt.isXMLDoc(t)))
//                 for (s = w(a), i = 0, r = (o = w(t)).length; i < r; i++) D(o[i], s[i]);
//             if (e)
//                 if (n)
//                     for (o = o || w(t), s = s || w(a), i = 0, r = o.length; i < r; i++) M(o[i], s[i]);
//                 else M(t, a);
//             return 0 < (s = w(a, "script")).length && x(s, !l && w(t, "script")), a
//         },
//         cleanData: function(t) {
//             for (var e, n, i, r = kt.event.special, o = 0;
//                 (n = t[o]) !== undefined; o++)
//                 if (It(n)) {
//                     if (e = n[Ot.expando]) {
//                         if (e.events)
//                             for (i in e.events) r[i] ? kt.event.remove(n, i) : kt.removeEvent(n, i, e.handle);
//                         n[Ot.expando] = undefined
//                     }
//                     n[Ft.expando] && (n[Ft.expando] = undefined)
//                 }
//         }
//     }), kt.fn.extend({
//         detach: function(t) {
//             return j(this, t, !0)
//         },
//         remove: function(t) {
//             return j(this, t)
//         },
//         text: function(t) {
//             return $t(this, function(t) {
//                 return t === undefined ? kt.text(this) : this.empty().each(function() {
//                     1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = t)
//                 })
//             }, null, t, arguments.length)
//         },
//         append: function() {
//             return R(this, arguments, function(t) {
//                 1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || A(this, t).appendChild(t)
//             })
//         },
//         prepend: function() {
//             return R(this, arguments, function(t) {
//                 if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
//                     var e = A(this, t);
//                     e.insertBefore(t, e.firstChild)
//                 }
//             })
//         },
//         before: function() {
//             return R(this, arguments, function(t) {
//                 this.parentNode && this.parentNode.insertBefore(t, this)
//             })
//         },
//         after: function() {
//             return R(this, arguments, function(t) {
//                 this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
//             })
//         },
//         empty: function() {
//             for (var t, e = 0; null != (t = this[e]); e++) 1 === t.nodeType && (kt.cleanData(w(t, !1)), t.textContent = "");
//             return this
//         },
//         clone: function(t, e) {
//             return t = null != t && t, e = null == e ? t : e, this.map(function() {
//                 return kt.clone(this, t, e)
//             })
//         },
//         html: function(t) {
//             return $t(this, function(t) {
//                 var e = this[0] || {},
//                     n = 0,
//                     i = this.length;
//                 if (t === undefined && 1 === e.nodeType) return e.innerHTML;
//                 if ("string" == typeof t && !le.test(t) && !Zt[(Gt.exec(t) || ["", ""])[1].toLowerCase()]) {
//                     t = kt.htmlPrefilter(t);
//                     try {
//                         for (; n < i; n++) 1 === (e = this[n] || {}).nodeType && (kt.cleanData(w(e, !1)), e.innerHTML = t);
//                         e = 0
//                     } catch (r) {}
//                 }
//                 e && this.empty().append(t)
//             }, null, t, arguments.length)
//         },
//         replaceWith: function() {
//             var n = [];
//             return R(this, arguments, function(t) {
//                 var e = this.parentNode;
//                 kt.inArray(this, n) < 0 && (kt.cleanData(w(this)), e && e.replaceChild(t, this))
//             }, n)
//         }
//     }), kt.each({
//         appendTo: "append",
//         prependTo: "prepend",
//         insertBefore: "before",
//         insertAfter: "after",
//         replaceAll: "replaceWith"
//     }, function(t, s) {
//         kt.fn[t] = function(t) {
//             for (var e, n = [], i = kt(t), r = i.length - 1, o = 0; o <= r; o++) e = o === r ? this : this.clone(!0), kt(i[o])[s](e), ct.apply(n, e.get());
//             return this.pushStack(n)
//         }
//     });
//     var he = new RegExp("^(" + Wt + ")(?!px)[a-z%]+$", "i"),
//         de = function(t) {
//             var e = t.ownerDocument.defaultView;
//             return e && e.opener || (e = E), e.getComputedStyle(t)
//         },
//         fe = new RegExp(zt.join("|"), "i");
//     ! function() {
//         function t() {
//             if (l) {
//                 a.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", ie.appendChild(a).appendChild(l);
//                 var t = E.getComputedStyle(l);
//                 n = "1%" !== t.top, s = 12 === e(t.marginLeft), l.style.right = "60%", o = 36 === e(t.right), i = 36 === e(t.width), l.style.position = "absolute", r = 36 === l.offsetWidth || "absolute", ie.removeChild(a), l = null
//             }
//         }

//         function e(t) {
//             return Math.round(parseFloat(t))
//         }
//         var n, i, r, o, s, a = st.createElement("div"),
//             l = st.createElement("div");
//         l.style && (l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", vt.clearCloneStyle = "content-box" === l.style.backgroundClip, kt.extend(vt, {
//             boxSizingReliable: function() {
//                 return t(), i
//             },
//             pixelBoxStyles: function() {
//                 return t(), o
//             },
//             pixelPosition: function() {
//                 return t(), n
//             },
//             reliableMarginLeft: function() {
//                 return t(), s
//             },
//             scrollboxSize: function() {
//                 return t(), r
//             }
//         }))
//     }();
//     var pe = /^(none|table(?!-c[ea]).+)/,
//         me = /^--/,
//         ge = {
//             position: "absolute",
//             visibility: "hidden",
//             display: "block"
//         },
//         ve = {
//             letterSpacing: "0",
//             fontWeight: "400"
//         },
//         ye = ["Webkit", "Moz", "ms"],
//         be = st.createElement("div").style;
//     kt.extend({
//         cssHooks: {
//             opacity: {
//                 get: function(t, e) {
//                     if (e) {
//                         var n = N(t, "opacity");
//                         return "" === n ? "1" : n
//                     }
//                 }
//             }
//         },
//         cssNumber: {
//             animationIterationCount: !0,
//             columnCount: !0,
//             fillOpacity: !0,
//             flexGrow: !0,
//             flexShrink: !0,
//             fontWeight: !0,
//             lineHeight: !0,
//             opacity: !0,
//             order: !0,
//             orphans: !0,
//             widows: !0,
//             zIndex: !0,
//             zoom: !0
//         },
//         cssProps: {},
//         style: function(t, e, n, i) {
//             if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
//                 var r, o, s, a = f(e),
//                     l = me.test(e),
//                     u = t.style;
//                 if (l || (e = H(a)), s = kt.cssHooks[e] || kt.cssHooks[a], n === undefined) return s && "get" in s && (r = s.get(t, !1, i)) !== undefined ? r : u[e];
//                 "string" === (o = typeof n) && (r = Ut.exec(n)) && r[1] && (n = v(t, e, r), o = "number"), null != n && n == n && ("number" === o && (n += r && r[3] || (kt.cssNumber[a] ? "" : "px")), vt.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (u[e] = "inherit"), s && "set" in s && (n = s.set(t, n, i)) === undefined || (
//                     l ? u.setProperty(e, n) : u[e] = n))
//             }
//         },
//         css: function(t, e, n, i) {
//             var r, o, s, a = f(e);
//             return me.test(e) || (e = H(a)), (s = kt.cssHooks[e] || kt.cssHooks[a]) && "get" in s && (r = s.get(t, !0, n)), r === undefined && (r = N(t, e, i)), "normal" === r && e in ve && (r = ve[e]), "" === n || n ? (o = parseFloat(r), !0 === n || isFinite(o) ? o || 0 : r) : r
//         }
//     }), kt.each(["height", "width"], function(t, a) {
//         kt.cssHooks[a] = {
//             get: function(t, e, n) {
//                 if (e) return !pe.test(kt.css(t, "display")) || t.getClientRects().length && t.getBoundingClientRect().width ? F(t, a, n) : Yt(t, ge, function() {
//                     return F(t, a, n)
//                 })
//             },
//             set: function(t, e, n) {
//                 var i, r = de(t),
//                     o = "border-box" === kt.css(t, "boxSizing", !1, r),
//                     s = n && O(t, a, n, o, r);
//                 return o && vt.scrollboxSize() === r.position && (s -= Math.ceil(t["offset" + a[0].toUpperCase() + a.slice(1)] - parseFloat(r[a]) - O(t, a, "border", !1, r) - .5)), s && (i = Ut.exec(e)) && "px" !== (i[3] || "px") && (t.style[a] = e, e = kt.css(t, a)), I(t, e, s)
//             }
//         }
//     }), kt.cssHooks.marginLeft = $(vt.reliableMarginLeft, function(t, e) {
//         if (e) return (parseFloat(N(t, "marginLeft")) || t.getBoundingClientRect().left - Yt(t, {
//             marginLeft: 0
//         }, function() {
//             return t.getBoundingClientRect().left
//         })) + "px"
//     }), kt.each({
//         margin: "",
//         padding: "",
//         border: "Width"
//     }, function(r, o) {
//         kt.cssHooks[r + o] = {
//             expand: function(t) {
//                 for (var e = 0, n = {}, i = "string" == typeof t ? t.split(" ") : [t]; e < 4; e++) n[r + zt[e] + o] = i[e] || i[e - 2] || i[0];
//                 return n
//             }
//         }, "margin" !== r && (kt.cssHooks[r + o].set = I)
//     }), kt.fn.extend({
//         css: function(t, e) {
//             return $t(this, function(t, e, n) {
//                 var i, r, o = {},
//                     s = 0;
//                 if (Array.isArray(e)) {
//                     for (i = de(t), r = e.length; s < r; s++) o[e[s]] = kt.css(t, e[s], !1, i);
//                     return o
//                 }
//                 return n !== undefined ? kt.style(t, e, n) : kt.css(t, e)
//             }, t, e, 1 < arguments.length)
//         }
//     }), (kt.Tween = B).prototype = {
//         constructor: B,
//         init: function(t, e, n, i, r, o) {
//             this.elem = t, this.prop = n, this.easing = r || kt.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = i, this.unit = o || (kt.cssNumber[n] ? "" : "px")
//         },
//         cur: function() {
//             var t = B.propHooks[this.prop];
//             return t && t.get ? t.get(this) : B.propHooks._default.get(this)
//         },
//         run: function(t) {
//             var e, n = B.propHooks[this.prop];
//             return this.options.duration ? this.pos = e = kt.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : B.propHooks._default.set(this), this
//         }
//     }, B.prototype.init.prototype = B.prototype, B.propHooks = {
//         _default: {
//             get: function(t) {
//                 var e;
//                 return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = kt.css(t.elem, t.prop, "")) && "auto" !== e ? e : 0
//             },
//             set: function(t) {
//                 kt.fx.step[t.prop] ? kt.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[kt.cssProps[t.prop]] && !kt.cssHooks[t.prop] ? t.elem[t.prop] = t.now : kt.style(t.elem, t.prop, t.now + t.unit)
//             }
//         }
//     }, B.propHooks.scrollTop = B.propHooks.scrollLeft = {
//         set: function(t) {
//             t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
//         }
//     }, kt.easing = {
//         linear: function(t) {
//             return t
//         },
//         swing: function(t) {
//             return .5 - Math.cos(t * Math.PI) / 2
//         },
//         _default: "swing"
//     }, kt.fx = B.prototype.init, kt.fx.step = {};
//     var we, xe, ke, _e, Ee = /^(?:toggle|show|hide)$/,
//         Ce = /queueHooks$/;
//     kt.Animation = kt.extend(Q, {
//         tweeners: {
//             "*": [function(t, e) {
//                 var n = this.createTween(t, e);
//                 return v(n.elem, t, Ut.exec(e), n), n
//             }]
//         },
//         tweener: function(t, e) {
//             yt(t) ? (e = t, t = ["*"]) : t = t.match(Rt);
//             for (var n, i = 0, r = t.length; i < r; i++) n = t[i], Q.tweeners[n] = Q.tweeners[n] || [], Q.tweeners[n].unshift(e)
//         },
//         prefilters: [X],
//         prefilter: function(t, e) {
//             e ? Q.prefilters.unshift(t) : Q.prefilters.push(t)
//         }
//     }), kt.speed = function(t, e, n) {
//         var i = t && "object" == typeof t ? kt.extend({}, t) : {
//             complete: n || !n && e || yt(t) && t,
//             duration: t,
//             easing: n && e || e && !yt(e) && e
//         };
//         return kt.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in kt.fx.speeds ? i.duration = kt.fx.speeds[i.duration] : i.duration = kt.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
//             yt(i.old) && i.old.call(this), i.queue && kt.dequeue(this, i.queue)
//         }, i
//     }, kt.fn.extend({
//         fadeTo: function(t, e, n, i) {
//             return this.filter(Xt).css("opacity", 0).show().end().animate({
//                 opacity: e
//             }, t, n, i)
//         },
//         animate: function(e, t, n, i) {
//             var r = kt.isEmptyObject(e),
//                 o = kt.speed(t, n, i),
//                 s = function() {
//                     var t = Q(this, kt.extend({}, e), o);
//                     (r || Ot.get(this, "finish")) && t.stop(!0)
//                 };
//             return s.finish = s, r || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
//         },
//         stop: function(r, t, o) {
//             var s = function(t) {
//                 var e = t.stop;
//                 delete t.stop, e(o)
//             };
//             return "string" != typeof r && (o = t, t = r, r = undefined), t && !1 !== r && this.queue(r || "fx", []), this.each(function() {
//                 var t = !0,
//                     e = null != r && r + "queueHooks",
//                     n = kt.timers,
//                     i = Ot.get(this);
//                 if (e) i[e] && i[e].stop && s(i[e]);
//                 else
//                     for (e in i) i[e] && i[e].stop && Ce.test(e) && s(i[e]);
//                 for (e = n.length; e--;) n[e].elem !== this || null != r && n[e].queue !== r || (n[e].anim.stop(o), t = !1, n.splice(e, 1));
//                 !t && o || kt.dequeue(this, r)
//             })
//         },
//         finish: function(s) {
//             return !1 !== s && (s = s || "fx"), this.each(function() {
//                 var t, e = Ot.get(this),
//                     n = e[s + "queue"],
//                     i = e[s + "queueHooks"],
//                     r = kt.timers,
//                     o = n ? n.length : 0;
//                 for (e.finish = !0, kt.queue(this, s, []), i && i.stop && i.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === s && (r[t].anim.stop(!0), r.splice(t, 1));
//                 for (t = 0; t < o; t++) n[t] && n[t].finish && n[t].finish.call(this);
//                 delete e.finish
//             })
//         }
//     }), kt.each(["toggle", "show", "hide"], function(t, i) {
//         var r = kt.fn[i];
//         kt.fn[i] = function(t, e, n) {
//             return null == t || "boolean" == typeof t ? r.apply(this, arguments) : this.animate(U(i, !0), t, e, n)
//         }
//     }), kt.each({
//         slideDown: U("show"),
//         slideUp: U("hide"),
//         slideToggle: U("toggle"),
//         fadeIn: {
//             opacity: "show"
//         },
//         fadeOut: {
//             opacity: "hide"
//         },
//         fadeToggle: {
//             opacity: "toggle"
//         }
//     }, function(t, i) {
//         kt.fn[t] = function(t, e, n) {
//             return this.animate(i, t, e, n)
//         }
//     }), kt.timers = [], kt.fx.tick = function() {
//         var t, e = 0,
//             n = kt.timers;
//         for (we = Date.now(); e < n.length; e++)(t = n[e])() || n[e] !== t || n.splice(e--, 1);
//         n.length || kt.fx.stop(), we = undefined
//     }, kt.fx.timer = function(t) {
//         kt.timers.push(t), kt.fx.start()
//     }, kt.fx.interval = 13, kt.fx.start = function() {
//         xe || (xe = !0, V())
//     }, kt.fx.stop = function() {
//         xe = null
//     }, kt.fx.speeds = {
//         slow: 600,
//         fast: 200,
//         _default: 400
//     }, kt.fn.delay = function(i, t) {
//         return i = kt.fx && kt.fx.speeds[i] || i, t = t || "fx", this.queue(t, function(t, e) {
//             var n = E.setTimeout(t, i);
//             e.stop = function() {
//                 E.clearTimeout(n)
//             }
//         })
//     }, ke = st.createElement("input"), _e = st.createElement("select").appendChild(st.createElement("option")), ke.type = "checkbox", vt.checkOn = "" !== ke.value, vt.optSelected = _e.selected, (ke = st.createElement("input")).value = "t", ke.type = "radio", vt.radioValue = "t" === ke.value;
//     var Te, Se = kt.expr.attrHandle;
//     kt.fn.extend({
//         attr: function(t, e) {
//             return $t(this, kt.attr, t, e, 1 < arguments.length)
//         },
//         removeAttr: function(t) {
//             return this.each(function() {
//                 kt.removeAttr(this, t)
//             })
//         }
//     }), kt.extend({
//         attr: function(t, e, n) {
//             var i, r, o = t.nodeType;
//             if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof t.getAttribute ? kt.prop(t, e, n) : (1 === o && kt.isXMLDoc(t) || (r = kt.attrHooks[e.toLowerCase()] || (kt.expr.match.bool.test(e) ? Te : undefined)), n !== undefined ? null === n ? void kt.removeAttr(t, e) : r && "set" in r && (i = r.set(t, n, e)) !== undefined ? i : (t.setAttribute(e, n + ""), n) : r && "get" in r && null !== (i = r.get(t, e)) ? i : null == (i = kt.find.attr(t, e)) ? undefined : i)
//         },
//         attrHooks: {
//             type: {
//                 set: function(t, e) {
//                     if (!vt.radioValue && "radio" === e && u(t, "input")) {
//                         var n = t.value;
//                         return t.setAttribute("type", e), n && (t.value = n), e
//                     }
//                 }
//             }
//         },
//         removeAttr: function(t, e) {
//             var n, i = 0,
//                 r = e && e.match(Rt);
//             if (r && 1 === t.nodeType)
//                 for (; n = r[i++];) t.removeAttribute(n)
//         }
//     }), Te = {
//         set: function(t, e, n) {
//             return !1 === e ? kt.removeAttr(t, n) : t.setAttribute(n, n), n
//         }
//     }, kt.each(kt.expr.match.bool.source.match(/\w+/g), function(t, e) {
//         var s = Se[e] || kt.find.attr;
//         Se[e] = function(t, e, n) {
//             var i, r, o = e.toLowerCase();
//             return n || (r = Se[o], Se[o] = i, i = null != s(t, e, n) ? o : null, Se[o] = r), i
//         }
//     });
//     var Ae = /^(?:input|select|textarea|button)$/i,
//         Le = /^(?:a|area)$/i;
//     kt.fn.extend({
//         prop: function(t, e) {
//             return $t(this, kt.prop, t, e, 1 < arguments.length)
//         },
//         removeProp: function(t) {
//             return this.each(function() {
//                 delete this[kt.propFix[t] || t]
//             })
//         }
//     }), kt.extend({
//         prop: function(t, e, n) {
//             var i, r, o = t.nodeType;
//             if (3 !== o && 8 !== o && 2 !== o) return 1 === o && kt.isXMLDoc(t) || (e = kt.propFix[e] || e, r = kt.propHooks[e]), n !== undefined ? r && "set" in r && (i = r.set(t, n, e)) !== undefined ? i : t[e] = n : r && "get" in r && null !== (i = r.get(t, e)) ? i : t[e]
//         },
//         propHooks: {
//             tabIndex: {
//                 get: function(t) {
//                     var e = kt.find.attr(t, "tabindex");
//                     return e ? parseInt(e, 10) : Ae.test(t.nodeName) || Le.test(t.nodeName) && t.href ? 0 : -1
//                 }
//             }
//         },
//         propFix: {
//             "for": "htmlFor",
//             "class": "className"
//         }
//     }), vt.optSelected || (kt.propHooks.selected = {
//         get: function(t) {
//             var e = t.parentNode;
//             return e && e.parentNode && e.parentNode.selectedIndex, null
//         },
//         set: function(t) {
//             var e = t.parentNode;
//             e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
//         }
//     }), kt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
//         kt.propFix[this.toLowerCase()] = this
//     }), kt.fn.extend({
//         addClass: function(e) {
//             var t, n, i, r, o, s, a, l = 0;
//             if (yt(e)) return this.each(function(t) {
//                 kt(this).addClass(e.call(this, t, G(this)))
//             });
//             if ((t = J(e)).length)
//                 for (; n = this[l++];)
//                     if (r = G(n), i = 1 === n.nodeType && " " + K(r) + " ") {
//                         for (s = 0; o = t[s++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
//                         r !== (a = K(i)) && n.setAttribute("class", a)
//                     } return this
//         },
//         removeClass: function(e) {
//             var t, n, i, r, o, s, a, l = 0;
//             if (yt(e)) return this.each(function(t) {
//                 kt(this).removeClass(e.call(this, t, G(this)))
//             });
//             if (!arguments.length) return this.attr("class", "");
//             if ((t = J(e)).length)
//                 for (; n = this[l++];)
//                     if (r = G(n), i = 1 === n.nodeType && " " + K(r) + " ") {
//                         for (s = 0; o = t[s++];)
//                             for (; - 1 < i.indexOf(" " + o + " ");) i = i.replace(" " + o + " ", " ");
//                         r !== (a = K(i)) && n.setAttribute("class", a)
//                     } return this
//         },
//         toggleClass: function(r, e) {
//             var o = typeof r,
//                 s = "string" === o || Array.isArray(r);
//             return "boolean" == typeof e && s ? e ? this.addClass(r) : this.removeClass(r) : yt(r) ? this.each(function(t) {
//                 kt(this).toggleClass(r.call(this, t, G(this), e), e)
//             }) : this.each(function() {
//                 var t, e, n, i;
//                 if (s)
//                     for (e = 0, n = kt(this), i = J(r); t = i[e++];) n.hasClass(t) ? n.removeClass(t) : n.addClass(t);
//                 else r !== undefined && "boolean" !== o || ((t = G(this)) && Ot.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === r ? "" : Ot.get(this, "__className__") || ""))
//             })
//         },
//         hasClass: function(t) {
//             var e, n, i = 0;
//             for (e = " " + t + " "; n = this[i++];)
//                 if (1 === n.nodeType && -1 < (" " + K(G(n)) + " ").indexOf(e)) return !0;
//             return !1
//         }
//     });
//     var Pe = /\r/g;
//     kt.fn.extend({
//         val: function(n) {
//             var i, t, r, e = this[0];
//             return arguments.length ? (r = yt(n), this.each(function(t) {
//                 var e;
//                 1 === this.nodeType && (null == (e = r ? n.call(this, t, kt(this).val()) : n) ? e = "" : "number" == typeof e ? e += "" : Array.isArray(e) && (e = kt.map(e, function(t) {
//                     return null == t ? "" : t + ""
//                 })), (i = kt.valHooks[this.type] || kt.valHooks[this.nodeName.toLowerCase()]) && "set" in i && i.set(this, e, "value") !== undefined || (this.value = e))
//             })) : e ? (i = kt.valHooks[e.type] || kt.valHooks[e.nodeName.toLowerCase()]) && "get" in i && (t = i.get(e, "value")) !== undefined ? t : "string" == typeof(t = e.value) ? t.replace(Pe, "") : null == t ? "" : t : void 0
//         }
//     }), kt.extend({
//         valHooks: {
//             option: {
//                 get: function(t) {
//                     var e = kt.find.attr(t, "value");
//                     return null != e ? e : K(kt.text(t))
//                 }
//             },
//             select: {
//                 get: function(t) {
//                     var e, n, i, r = t.options,
//                         o = t.selectedIndex,
//                         s = "select-one" === t.type,
//                         a = s ? null : [],
//                         l = s ? o + 1 : r.length;
//                     for (i = o < 0 ? l : s ? o : 0; i < l; i++)
//                         if (((n = r[i]).selected || i === o) && !n.disabled && (!n.parentNode.disabled || !u(n.parentNode, "optgroup"))) {
//                             if (e = kt(n).val(), s) return e;
//                             a.push(e)
//                         } return a
//                 },
//                 set: function(t, e) {
//                     for (var n, i, r = t.options, o = kt.makeArray(e), s = r.length; s--;)((i = r[s]).selected = -1 < kt.inArray(kt.valHooks.option.get(i), o)) && (n = !0);
//                     return n || (t.selectedIndex = -1), o
//                 }
//             }
//         }
//     }), kt.each(["radio", "checkbox"], function() {
//         kt.valHooks[this] = {
//             set: function(t, e) {
//                 if (Array.isArray(e)) return t.checked = -1 < kt.inArray(kt(t).val(), e)
//             }
//         }, vt.checkOn || (kt.valHooks[this].get = function(t) {
//             return null === t.getAttribute("value") ? "on" : t.value
//         })
//     }), vt.focusin = "onfocusin" in E;
//     var Me = /^(?:focusinfocus|focusoutblur)$/,
//         De = function(t) {
//             t.stopPropagation()
//         };
//     kt.extend(kt.event, {
//         trigger: function(t, e, n, i) {
//             var r, o, s, a, l, u, c, h, d = [n || st],
//                 f = pt.call(t, "type") ? t.type : t,
//                 p = pt.call(t, "namespace") ? t.namespace.split(".") : [];
//             if (o = h = s = n = n || st, 3 !== n.nodeType && 8 !== n.nodeType && !Me.test(f + kt.event.triggered) && (-1 < f.indexOf(".") && (f = (p = f.split(".")).shift(), p.sort()), l = f.indexOf(":") < 0 && "on" + f, (t = t[kt.expando] ? t : new kt.Event(f, "object" == typeof t && t)).isTrigger = i ? 2 : 3, t.namespace = p.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target || (t.target = n), e = null == e ? [t] : kt.makeArray(e, [t]), c = kt.event.special[f] || {}, i || !c.trigger || !1 !== c.trigger.apply(n, e))) {
//                 if (!i && !c.noBubble && !bt(n)) {
//                     for (a = c.delegateType || f, Me.test(a + f) || (o = o.parentNode); o; o = o.parentNode) d.push(o), s = o;
//                     s === (n.ownerDocument || st) && d.push(s.defaultView || s.parentWindow || E)
//                 }
//                 for (r = 0;
//                     (o = d[r++]) && !t.isPropagationStopped();) h = o, t.type = 1 < r ? a : c.bindType || f, (u = (Ot.get(o, "events") || {})[t.type] && Ot.get(o, "handle")) && u.apply(o, e), (u = l && o[l]) && u.apply && It(o) && (t.result = u.apply(o, e), !1 === t.result && t.preventDefault());
//                 return t.type = f, i || t.isDefaultPrevented() || c._default && !1 !== c._default.apply(d.pop(), e) || !It(n) || l && yt(n[f]) && !bt(n) && ((s = n[l]) && (n[l] = null), kt.event.triggered = f, t.isPropagationStopped() && h.addEventListener(f, De), n[f](), t.isPropagationStopped() && h.removeEventListener(f, De), kt.event.triggered = undefined, s && (n[l] = s)), t.result
//             }
//         },
//         simulate: function(t, e, n) {
//             var i = kt.extend(new kt.Event, n, {
//                 type: t,
//                 isSimulated: !0
//             });
//             kt.event.trigger(i, null, e)
//         }
//     }), kt.fn.extend({
//         trigger: function(t, e) {
//             return this.each(function() {
//                 kt.event.trigger(t, e, this)
//             })
//         },
//         triggerHandler: function(t, e) {
//             var n = this[0];
//             if (n) return kt.event.trigger(t, e, n, !0)
//         }
//     }), vt.focusin || kt.each({
//         focus: "focusin",
//         blur: "focusout"
//     }, function(n, i) {
//         var r = function(t) {
//             kt.event.simulate(i, t.target, kt.event.fix(t))
//         };
//         kt.event.special[i] = {
//             setup: function() {
//                 var t = this.ownerDocument || this,
//                     e = Ot.access(t, i);
//                 e || t.addEventListener(n, r, !0), Ot.access(t, i, (e || 0) + 1)
//             },
//             teardown: function() {
//                 var t = this.ownerDocument || this,
//                     e = Ot.access(t, i) - 1;
//                 e ? Ot.access(t, i, e) : (t.removeEventListener(n, r, !0), Ot.remove(t, i))
//             }
//         }
//     });
//     var Re = E.location,
//         je = Date.now(),
//         Ne = /\?/;
//     kt.parseXML = function(t) {
//         var e;
//         if (!t || "string" != typeof t) return null;
//         try {
//             e = (new E.DOMParser).parseFromString(t, "text/xml")
//         } catch (n) {
//             e = undefined
//         }
//         return e && !e.getElementsByTagName("parsererror").length || kt.error("Invalid XML: " + t), e
//     };
//     var $e = /\[\]$/,
//         qe = /\r?\n/g,
//         He = /^(?:submit|button|image|reset|file)$/i,
//         Ie = /^(?:input|select|textarea|keygen)/i;
//     kt.param = function(t, e) {
//         var n, i = [],
//             r = function(t, e) {
//                 var n = yt(e) ? e() : e;
//                 i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(null == n ? "" : n)
//             };
//         if (Array.isArray(t) || t.jquery && !kt.isPlainObject(t)) kt.each(t, function() {
//             r(this.name, this.value)
//         });
//         else
//             for (n in t) Z(n, t[n], e, r);
//         return i.join("&")
//     }, kt.fn.extend({
//         serialize: function() {
//             return kt.param(this.serializeArray())
//         },
//         serializeArray: function() {
//             return this.map(function() {
//                 var t = kt.prop(this, "elements");
//                 return t ? kt.makeArray(t) : this
//             }).filter(function() {
//                 var t = this.type;
//                 return this.name && !kt(this).is(":disabled") && Ie.test(this.nodeName) && !He.test(t) && (this.checked || !Kt.test(t))
//             }).map(function(t, e) {
//                 var n = kt(this).val();
//                 return null == n ? null : Array.isArray(n) ? kt.map(n, function(t) {
//                     return {
//                         name: e.name,
//                         value: t.replace(qe, "\r\n")
//                     }
//                 }) : {
//                     name: e.name,
//                     value: n.replace(qe, "\r\n")
//                 }
//             }).get()
//         }
//     });
//     var Oe = /%20/g,
//         Fe = /#.*$/,
//         Be = /([?&])_=[^&]*/,
//         Ve = /^(.*?):[ \t]*([^\r\n]*)$/gm,
//         We = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
//         Ue = /^(?:GET|HEAD)$/,
//         ze = /^\/\//,
//         Xe = {},
//         Ye = {},
//         Qe = "*/".concat("*"),
//         Ke = st.createElement("a");
//     Ke.href = Re.href, kt.extend({
//         active: 0,
//         lastModified: {},
//         etag: {},
//         ajaxSettings: {
//             url: Re.href,
//             type: "GET",
//             isLocal: We.test(Re.protocol),
//             global: !0,
//             processData: !0,
//             async: !0,
//             contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//             accepts: {
//                 "*": Qe,
//                 text: "text/plain",
//                 html: "text/html",
//                 xml: "application/xml, text/xml",
//                 json: "application/json, text/javascript"
//             },
//             contents: {
//                 xml: /\bxml\b/,
//                 html: /\bhtml/,
//                 json: /\bjson\b/
//             },
//             responseFields: {
//                 xml: "responseXML",
//                 text: "responseText",
//                 json: "responseJSON"
//             },
//             converters: {
//                 "* text": String,
//                 "text html": !0,
//                 "text json": JSON.parse,
//                 "text xml": kt.parseXML
//             },
//             flatOptions: {
//                 url: !0,
//                 context: !0
//             }
//         },
//         ajaxSetup: function(t, e) {
//             return e ? nt(nt(t, kt.ajaxSettings), e) : nt(kt.ajaxSettings, t)
//         },
//         ajaxPrefilter: tt(Xe),
//         ajaxTransport: tt(Ye),
//         ajax: function(t, e) {
//             function n(t, e, n, i) {
//                 var r, o, s, a, l, u = e;
//                 p || (p = !0, f && E.clearTimeout(f), c = undefined, d = i || "", k.readyState = 0 < t ? 4 : 0, r = 200 <= t && t < 300 || 304 === t, n && (a = it(g, k, n)), a = rt(g, a, k, r), r ? (g.ifModified && ((l = k.getResponseHeader("Last-Modified")) && (kt.lastModified[h] = l), (l = k.getResponseHeader("etag")) && (kt.etag[h] = l)), 204 === t || "HEAD" === g.type ? u = "nocontent" : 304 === t ? u = "notmodified" : (u = a.state, o = a.data, r = !(s = a.error))) : (s = u, !t && u || (u = "error", t < 0 && (t = 0))), k.status = t, k.statusText = (e || u) + "", r ? b.resolveWith(v, [o, u, k]) : b.rejectWith(v, [k, u, s]), k.statusCode(x), x = undefined, m && y.trigger(r ? "ajaxSuccess" : "ajaxError", [k, g, r ? o : s]), w.fireWith(v, [k, u]), m && (y.trigger("ajaxComplete", [k, g]), --kt.active || kt.event.trigger("ajaxStop")))
//             }
//             "object" == typeof t && (e = t, t = undefined), e = e || {};
//             var c, h, d, i, f, r, p, m, o, s, g = kt.ajaxSetup({}, e),
//                 v = g.context || g,
//                 y = g.context && (v.nodeType || v.jquery) ? kt(v) : kt.event,
//                 b = kt.Deferred(),
//                 w = kt.Callbacks("once memory"),
//                 x = g.statusCode || {},
//                 a = {},
//                 l = {},
//                 u = "canceled",
//                 k = {
//                     readyState: 0,
//                     getResponseHeader: function(t) {
//                         var e;
//                         if (p) {
//                             if (!i)
//                                 for (i = {}; e = Ve.exec(d);) i[e[1].toLowerCase()] = e[2];
//                             e = i[t.toLowerCase()]
//                         }
//                         return null == e ? null : e
//                     },
//                     getAllResponseHeaders: function() {
//                         return p ? d : null
//                     },
//                     setRequestHeader: function(t, e) {
//                         return null == p && (t = l[t.toLowerCase()] = l[t.toLowerCase()] || t, a[t] = e), this
//                     },
//                     overrideMimeType: function(t) {
//                         return null == p && (g.mimeType = t), this
//                     },
//                     statusCode: function(t) {
//                         var e;
//                         if (t)
//                             if (p) k.always(t[k.status]);
//                             else
//                                 for (e in t) x[e] = [x[e], t[e]];
//                         return this
//                     },
//                     abort: function(t) {
//                         var e = t || u;
//                         return c && c.abort(e), n(0, e), this
//                     }
//                 };
//             if (b.promise(k), g.url = ((t || g.url || Re.href) + "").replace(ze, Re.protocol + "//"), g.type = e.method || e.type || g.method || g.type, g.dataTypes = (g.dataType || "*").toLowerCase().match(Rt) || [""], null == g.crossDomain) {
//                 r = st.createElement("a");
//                 try {
//                     r.href = g.url, r.href = r.href, g.crossDomain = Ke.protocol + "//" + Ke.host != r.protocol + "//" + r.host
//                 } catch (_) {
//                     g.crossDomain = !0
//                 }
//             }
//             if (g.data && g.processData && "string" != typeof g.data && (g.data = kt.param(g.data, g.traditional)), et(Xe, g, e, k), p) return k;
//             for (o in (m = kt.event && g.global) && 0 == kt.active++ && kt.event.trigger("ajaxStart"), g.type = g.type.toUpperCase(), g.hasContent = !Ue.test(g.type), h = g.url.replace(Fe, ""), g.hasContent ? g.data && g.processData && 0 === (g.contentType || "").indexOf("application/x-www-form-urlencoded") && (g.data = g.data.replace(Oe, "+")) : (s = g.url.slice(h.length), g.data && (g.processData || "string" == typeof g.data) && (h += (Ne.test(h) ? "&" : "?") + g.data, delete g.data), !1 === g.cache && (h = h.replace(Be, "$1"), s = (Ne.test(h) ? "&" : "?") + "_=" + je++ + s), g.url = h + s), g.ifModified && (kt.lastModified[h] && k.setRequestHeader("If-Modified-Since", kt.lastModified[h]), kt.etag[h] && k.setRequestHeader("If-None-Match", kt.etag[h])), (g.data && g.hasContent && !1 !== g.contentType || e.contentType) && k.setRequestHeader("Content-Type", g.contentType), k.setRequestHeader("Accept", g.dataTypes[0] && g.accepts[g.dataTypes[0]] ? g.accepts[g.dataTypes[0]] + ("*" !== g.dataTypes[0] ? ", " + Qe + "; q=0.01" : "") : g.accepts["*"]), g.headers) k.setRequestHeader(o, g.headers[o]);
//             if (g.beforeSend && (!1 === g.beforeSend.call(v, k, g) || p)) return k.abort();
//             if (u = "abort", w.add(g.complete), k.done(g.success), k.fail(g.error), c = et(Ye, g, e, k)) {
//                 if (k.readyState = 1, m && y.trigger("ajaxSend", [k, g]), p) return k;
//                 g.async && 0 < g.timeout && (f = E.setTimeout(function() {
//                     k.abort("timeout")
//                 }, g.timeout));
//                 try {
//                     p = !1, c.send(a, n)
//                 } catch (_) {
//                     if (p) throw _;
//                     n(-1, _)
//                 }
//             } else n(-1, "No Transport");
//             return k
//         },
//         getJSON: function(t, e, n) {
//             return kt.get(t, e, n, "json")
//         },
//         getScript: function(t, e) {
//             return kt.get(t, undefined, e, "script")
//         }
//     }), kt.each(["get", "post"], function(t, r) {
//         kt[r] = function(t, e, n, i) {
//             return yt(e) && (i = i || n, n = e, e = undefined), kt.ajax(kt.extend({
//                 url: t,
//                 type: r,
//                 dataType: i,
//                 data: e,
//                 success: n
//             }, kt.isPlainObject(t) && t))
//         }
//     }), kt._evalUrl = function(t) {
//         return kt.ajax({
//             url: t,
//             type: "GET",
//             dataType: "script",
//             cache: !0,
//             async: !1,
//             global: !1,
//             "throws": !0
//         })
//     }, kt.fn.extend({
//         wrapAll: function(t) {
//             var e;
//             return this[0] && (yt(t) && (t = t.call(this[0])), e = kt(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
//                 for (var t = this; t.firstElementChild;) t = t.firstElementChild;
//                 return t
//             }).append(this)), this
//         },
//         wrapInner: function(n) {
//             return yt(n) ? this.each(function(t) {
//                 kt(this).wrapInner(n.call(this, t))
//             }) : this.each(function() {
//                 var t = kt(this),
//                     e = t.contents();
//                 e.length ? e.wrapAll(n) : t.append(n)
//             })
//         },
//         wrap: function(e) {
//             var n = yt(e);
//             return this.each(function(t) {
//                 kt(this).wrapAll(n ? e.call(this, t) : e)
//             })
//         },
//         unwrap: function(t) {
//             return this.parent(t).not("body").each(function() {
//                 kt(this).replaceWith(this.childNodes)
//             }), this
//         }
//     }), kt.expr.pseudos.hidden = function(t) {
//         return !kt.expr.pseudos.visible(t)
//     }, kt.expr.pseudos.visible = function(t) {
//         return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length)
//     }, kt.ajaxSettings.xhr = function() {
//         try {
//             return new E.XMLHttpRequest
//         } catch (t) {}
//     };
//     var Ge = {
//             0: 200,
//             1223: 204
//         },
//         Je = kt.ajaxSettings.xhr();
//     vt.cors = !!Je && "withCredentials" in Je, vt.ajax = Je = !!Je, kt.ajaxTransport(function(o) {
//         var s, a;
//         if (vt.cors || Je && !o.crossDomain) return {
//             send: function(t, e) {
//                 var n, i = o.xhr();
//                 if (i.open(o.type, o.url, o.async, o.username, o.password), o.xhrFields)
//                     for (n in o.xhrFields) i[n] = o.xhrFields[n];
//                 for (n in o.mimeType && i.overrideMimeType && i.overrideMimeType(o.mimeType), o.crossDomain || t["X-Requested-With"] || (t["X-Requested-With"] = "XMLHttpRequest"), t) i.setRequestHeader(n, t[n]);
//                 s = function(t) {
//                     return function() {
//                         s && (s = a = i.onload = i.onerror = i.onabort = i.ontimeout = i.onreadystatechange = null, "abort" === t ? i.abort() : "error" === t ? "number" != typeof i.status ? e(0, "error") : e(i.status, i.statusText) : e(Ge[i.status] || i.status, i.statusText, "text" !== (i.responseType || "text") || "string" != typeof i.responseText ? {
//                             binary: i.response
//                         } : {
//                             text: i.responseText
//                         }, i.getAllResponseHeaders()))
//                     }
//                 }, i.onload = s(), a = i.onerror = i.ontimeout = s("error"), i.onabort !== undefined ? i.onabort = a : i.onreadystatechange = function() {
//                     4 === i.readyState && E.setTimeout(function() {
//                         s && a()
//                     })
//                 }, s = s("abort");
//                 try {
//                     i.send(o.hasContent && o.data || null)
//                 } catch (r) {
//                     if (s) throw r
//                 }
//             },
//             abort: function() {
//                 s && s()
//             }
//         }
//     }), kt.ajaxPrefilter(function(t) {
//         t.crossDomain && (t.contents.script = !1)
//     }), kt.ajaxSetup({
//         accepts: {
//             script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
//         },
//         contents: {
//             script: /\b(?:java|ecma)script\b/
//         },
//         converters: {
//             "text script": function(t) {
//                 return kt.globalEval(t), t
//             }
//         }
//     }), kt.ajaxPrefilter("script", function(t) {
//         t.cache === undefined && (t.cache = !1), t.crossDomain && (t.type = "GET")
//     }), kt.ajaxTransport("script", function(n) {
//         var i, r;
//         if (n.crossDomain) return {
//             send: function(t, e) {
//                 i = kt("<script>").prop({
//                     charset: n.scriptCharset,
//                     src: n.url
//                 }).on("load error", r = function(t) {
//                     i.remove(), r = null, t && e("error" === t.type ? 404 : 200, t.type)
//                 }), st.head.appendChild(i[0])
//             },
//             abort: function() {
//                 r && r()
//             }
//         }
//     });
//     var Ze, tn = [],
//         en = /(=)\?(?=&|$)|\?\?/;
//     kt.ajaxSetup({
//         jsonp: "callback",
//         jsonpCallback: function() {
//             var t = tn.pop() || kt.expando + "_" + je++;
//             return this[t] = !0, t
//         }
//     }), kt.ajaxPrefilter("json jsonp", function(t, e, n) {
//         var i, r, o, s = !1 !== t.jsonp && (en.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && en.test(t.data) && "data");
//         if (s || "jsonp" === t.dataTypes[0]) return i = t.jsonpCallback = yt(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(en, "$1" + i) : !1 !== t.jsonp && (t.url += (Ne.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
//             return o || kt.error(i + " was not called"), o[0]
//         }, t.dataTypes[0] = "json", r = E[i], E[i] = function() {
//             o = arguments
//         }, n.always(function() {
//             r === undefined ? kt(E).removeProp(i) : E[i] = r, t[i] && (t.jsonpCallback = e.jsonpCallback, tn.push(i)), o && yt(r) && r(o[0]), o = r = undefined
//         }), "script"
//     }), vt.createHTMLDocument = ((Ze = st.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Ze.childNodes.length), kt.parseHTML = function(t, e, n) {
//         return "string" != typeof t ? [] : ("boolean" == typeof e && (n = e, e = !1), e || (vt.createHTMLDocument ? ((i = (e = st.implementation.createHTMLDocument("")).createElement("base")).href = st.location.href, e.head.appendChild(i)) : e = st), o = !n && [], (r = At.exec(t)) ? [e.createElement(r[1])] : (r = k([t], e, o), o && o.length && kt(o).remove(), kt.merge([], r.childNodes)));
//         var i, r, o
//     }, kt.fn.load = function(t, e, n) {
//         var i, r, o, s = this,
//             a = t.indexOf(" ");
//         return -1 < a && (i = K(t.slice(a)), t = t.slice(0, a)), yt(e) ? (n = e, e = undefined) : e && "object" == typeof e && (r = "POST"), 0 < s.length && kt.ajax({
//             url: t,
//             type: r || "GET",
//             dataType: "html",
//             data: e
//         }).done(function(t) {
//             o = arguments, s.html(i ? kt("<div>").append(kt.parseHTML(t)).find(i) : t)
//         }).always(n && function(t, e) {
//             s.each(function() {
//                 n.apply(this, o || [t.responseText, e, t])
//             })
//         }), this
//     }, kt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
//         kt.fn[e] = function(t) {
//             return this.on(e, t)
//         }
//     }), kt.expr.pseudos.animated = function(e) {
//         return kt.grep(kt.timers, function(t) {
//             return e === t.elem
//         }).length
//     }, kt.offset = {
//         setOffset: function(t, e, n) {
//             var i, r, o, s, a, l, u = kt.css(t, "position"),
//                 c = kt(t),
//                 h = {};
//             "static" === u && (t.style.position = "relative"), a = c.offset(), o = kt.css(t, "top"), l = kt.css(t, "left"), ("absolute" === u || "fixed" === u) && -1 < (o + l).indexOf("auto") ? (s = (i = c.position()).top, r = i.left) : (s = parseFloat(o) || 0, r = parseFloat(l) || 0), yt(e) && (e = e.call(t, n, kt.extend({}, a))), null != e.top && (h.top = e.top - a.top + s), null != e.left && (h.left = e.left - a.left + r), "using" in e ? e.using.call(t, h) : c.css(h)
//         }
//     }, kt.fn.extend({
//         offset: function(e) {
//             if (arguments.length) return e === undefined ? this : this.each(function(t) {
//                 kt.offset.setOffset(this, e, t)
//             });
//             var t, n, i = this[0];
//             return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
//                 top: t.top + n.pageYOffset,
//                 left: t.left + n.pageXOffset
//             }) : {
//                 top: 0,
//                 left: 0
//             } : void 0
//         },
//         position: function() {
//             if (this[0]) {
//                 var t, e, n, i = this[0],
//                     r = {
//                         top: 0,
//                         left: 0
//                     };
//                 if ("fixed" === kt.css(i, "position")) e = i.getBoundingClientRect();
//                 else {
//                     for (e = this.offset(), n = i.ownerDocument, t = i.offsetParent || n.documentElement; t && (t === n.body || t === n.documentElement) && "static" === kt.css(t, "position");) t = t.parentNode;
//                     t && t !== i && 1 === t.nodeType && ((r = kt(t).offset()).top += kt.css(t, "borderTopWidth", !0), r.left += kt.css(t, "borderLeftWidth", !0))
//                 }
//                 return {
//                     top: e.top - r.top - kt.css(i, "marginTop", !0),
//                     left: e.left - r.left - kt.css(i, "marginLeft", !0)
//                 }
//             }
//         },
//         offsetParent: function() {
//             return this.map(function() {
//                 for (var t = this.offsetParent; t && "static" === kt.css(t, "position");) t = t.offsetParent;
//                 return t || ie
//             })
//         }
//     }), kt.each({
//         scrollLeft: "pageXOffset",
//         scrollTop: "pageYOffset"
//     }, function(e, r) {
//         var o = "pageYOffset" === r;
//         kt.fn[e] = function(t) {
//             return $t(this, function(t, e, n) {
//                 var i;
//                 if (bt(t) ? i = t : 9 === t.nodeType && (i = t.defaultView), n === undefined) return i ? i[r] : t[e];
//                 i ? i.scrollTo(o ? i.pageXOffset : n, o ? n : i.pageYOffset) : t[e] = n
//             }, e, t, arguments.length)
//         }
//     }), kt.each(["top", "left"], function(t, n) {
//         kt.cssHooks[n] = $(vt.pixelPosition, function(t, e) {
//             if (e) return e = N(t, n), he.test(e) ? kt(t).position()[n] + "px" : e
//         })
//     }), kt.each({
//         Height: "height",
//         Width: "width"
//     }, function(s, a) {
//         kt.each({
//             padding: "inner" + s,
//             content: a,
//             "": "outer" + s
//         }, function(i, o) {
//             kt.fn[o] = function(t, e) {
//                 var n = arguments.length && (i || "boolean" != typeof t),
//                     r = i || (!0 === t || !0 === e ? "margin" : "border");
//                 return $t(this, function(t, e, n) {
//                     var i;
//                     return bt(t) ? 0 === o.indexOf("outer") ? t["inner" + s] : t.document.documentElement["client" + s] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + s], i["scroll" + s], t.body["offset" + s], i["offset" + s], i["client" + s])) : n === undefined ? kt.css(t, e, r) : kt.style(t, e, n, r)
//                 }, a, n ? t : undefined, n)
//             }
//         })
//     }), kt.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(t, n) {
//         kt.fn[n] = function(t, e) {
//             return 0 < arguments.length ? this.on(n, null, t, e) : this.trigger(n)
//         }
//     }), kt.fn.extend({
//         hover: function(t, e) {
//             return this.mouseenter(t).mouseleave(e || t)
//         }
//     }), kt.fn.extend({
//         bind: function(t, e, n) {
//             return this.on(t, null, e, n)
//         },
//         unbind: function(t, e) {
//             return this.off(t, null, e)
//         },
//         delegate: function(t, e, n, i) {
//             return this.on(e, t, n, i)
//         },
//         undelegate: function(t, e, n) {
//             return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
//         }
//     }), kt.proxy = function(t, e) {
//         var n, i, r;
//         return "string" == typeof e && (n = t[e], e = t, t = n), yt(t) ? (i = lt.call(arguments, 2), (r = function() {
//             return t.apply(e || this, i.concat(lt.call(arguments)))
//         }).guid = t.guid = t.guid || kt.guid++, r) : undefined
//     }, kt.holdReady = function(t) {
//         t ? kt.readyWait++ : kt.ready(!0)
//     }, kt.isArray = Array.isArray, kt.parseJSON = JSON.parse, kt.nodeName = u, kt.isFunction = yt, kt.isWindow = bt, kt.camelCase = f, kt.type = g, kt.now = Date.now, kt.isNumeric = function(t) {
//         var e = kt.type(t);
//         return ("number" === e || "string" === e) && !isNaN(t - parseFloat(t))
//     }, "function" == typeof define && define.amd && define("jquery", [], function() {
//         return kt
//     });
//     var nn = E.jQuery,
//         rn = E.$;
//     return kt.noConflict = function(t) {
//         return E.$ === kt && (E.$ = rn), t && E.jQuery === kt && (E.jQuery = nn), kt
//     }, t || (E.jQuery = E.$ = kt), kt
// }),
// function(c, l) {
//     "use strict";
//     var u;
//     c.rails !== l && c.error("jquery-ujs has already been loaded!");
//     var t = c(document);
//     c.rails = u = {
//         linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
//         buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
//         inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
//         formSubmitSelector: "form",
//         formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
//         disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
//         enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
//         requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
//         fileInputSelector: "input[name][type=file]:not([disabled])",
//         linkDisableSelector: "a[data-disable-with], a[data-disable]",
//         buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
//         csrfToken: function() {
//             return c("meta[name=csrf-token]").attr("content")
//         },
//         csrfParam: function() {
//             return c("meta[name=csrf-param]").attr("content")
//         },
//         CSRFProtection: function(t) {
//             var e = u.csrfToken();
//             e && t.setRequestHeader("X-CSRF-Token", e)
//         },
//         refreshCSRFTokens: function() {
//             c('form input[name="' + u.csrfParam() + '"]').val(u.csrfToken())
//         },
//         fire: function(t, e, n) {
//             var i = c.Event(e);
//             return t.trigger(i, n), !1 !== i.result
//         },
//         confirm: function(t) {
//             return confirm(t)
//         },
//         ajax: function(t) {
//             return c.ajax(t)
//         },
//         href: function(t) {
//             return t[0].href
//         },
//         isRemote: function(t) {
//             return t.data("remote") !== l && !1 !== t.data("remote")
//         },
//         handleRemote: function(i) {
//             var t, e, n, r, o, s;
//             if (u.fire(i, "ajax:before")) {
//                 if (r = i.data("with-credentials") || null, o = i.data("type") || c.ajaxSettings && c.ajaxSettings.dataType, i.is("form")) {
//                     t = i.data("ujs:submit-button-formmethod") || i.attr("method"), e = i.data("ujs:submit-button-formaction") || i.attr("action"), n = c(i[0]).serializeArray();
//                     var a = i.data("ujs:submit-button");
//                     a && (n.push(a), i.data("ujs:submit-button", null)), i.data("ujs:submit-button-formmethod", null), i.data("ujs:submit-button-formaction", null)
//                 } else i.is(u.inputChangeSelector) ? (t = i.data("method"), e = i.data("url"), n = i.serialize(), i.data("params") && (n = n + "&" + i.data("params"))) : i.is(u.buttonClickSelector) ? (t = i.data("method") || "get", e = i.data("url"), n = i.serialize(), i.data("params") && (n = n + "&" + i.data("params"))) : (t = i.data("method"), e = u.href(i), n = i.data("params") || null);
//                 return s = {
//                     type: t || "GET",
//                     data: n,
//                     dataType: o,
//                     beforeSend: function(t, e) {
//                         if (e.dataType === l && t.setRequestHeader("accept", "*/*;q=0.5, " + e.accepts.script), !u.fire(i, "ajax:beforeSend", [t, e])) return !1;
//                         i.trigger("ajax:send", t)
//                     },
//                     success: function(t, e, n) {
//                         i.trigger("ajax:success", [t, e, n])
//                     },
//                     complete: function(t, e) {
//                         i.trigger("ajax:complete", [t, e])
//                     },
//                     error: function(t, e, n) {
//                         i.trigger("ajax:error", [t, e, n])
//                     },
//                     crossDomain: u.isCrossDomain(e)
//                 }, r && (s.xhrFields = {
//                     withCredentials: r
//                 }), e && (s.url = e), u.ajax(s)
//             }
//             return !1
//         },
//         isCrossDomain: function(t) {
//             var e = document.createElement("a");
//             e.href = location.href;
//             var n = document.createElement("a");
//             try {
//                 return n.href = t, n.href = n.href, !((!n.protocol || ":" === n.protocol) && !n.host || e.protocol + "//" + e.host == n.protocol + "//" + n.host)
//             } catch (i) {
//                 return !0
//             }
//         },
//         handleMethod: function(t) {
//             var e = u.href(t),
//                 n = t.data("method"),
//                 i = t.attr("target"),
//                 r = u.csrfToken(),
//                 o = u.csrfParam(),
//                 s = c('<form method="post" action="' + e + '"></form>'),
//                 a = '<input name="_method" value="' + n + '" type="hidden" />';
//             o === l || r === l || u.isCrossDomain(e) || (a += '<input name="' + o + '" value="' + r + '" type="hidden" />'), i && s.attr("target", i), s.hide().append(a).appendTo("body"), s.submit()
//         },
//         formElements: function(t, e) {
//             return t.is("form") ? c(t[0].elements).filter(e) : t.find(e)
//         },
//         disableFormElements: function(t) {
//             u.formElements(t, u.disableSelector).each(function() {
//                 u.disableFormElement(c(this))
//             })
//         },
//         disableFormElement: function(t) {
//             var e, n;
//             e = t.is("button") ? "html" : "val", (n = t.data("disable-with")) !== l && (t.data("ujs:enable-with", t[e]()), t[e](n)), t.prop("disabled", !0), t.data("ujs:disabled", !0)
//         },
//         enableFormElements: function(t) {
//             u.formElements(t, u.enableSelector).each(function() {
//                 u.enableFormElement(c(this))
//             })
//         },
//         enableFormElement: function(t) {
//             var e = t.is("button") ? "html" : "val";
//             t.data("ujs:enable-with") !== l && (t[e](t.data("ujs:enable-with")), t.removeData("ujs:enable-with")), t.prop("disabled", !1), t.removeData("ujs:disabled")
//         },
//         allowAction: function(t) {
//             var e, n = t.data("confirm"),
//                 i = !1;
//             if (!n) return !0;
//             if (u.fire(t, "confirm")) {
//                 try {
//                     i = u.confirm(n)
//                 } catch (r) {
//                     (
//                         console.error || console.log).call(console, r.stack || r)
//                 }
//                 e = u.fire(t, "confirm:complete", [i])
//             }
//             return i && e
//         },
//         blankInputs: function(t, e, n) {
//             var i, r, o, s = c(),
//                 a = e || "input,textarea",
//                 l = t.find(a),
//                 u = {};
//             return l.each(function() {
//                 (i = c(this)).is("input[type=radio]") ? (o = i.attr("name"), u[o] || (0 === t.find('input[type=radio]:checked[name="' + o + '"]').length && (r = t.find('input[type=radio][name="' + o + '"]'), s = s.add(r)), u[o] = o)) : (i.is("input[type=checkbox],input[type=radio]") ? i.is(":checked") : !!i.val()) === n && (s = s.add(i))
//             }), !!s.length && s
//         },
//         nonBlankInputs: function(t, e) {
//             return u.blankInputs(t, e, !0)
//         },
//         stopEverything: function(t) {
//             return c(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
//         },
//         disableElement: function(t) {
//             var e = t.data("disable-with");
//             e !== l && (t.data("ujs:enable-with", t.html()), t.html(e)), t.bind("click.railsDisable", function(t) {
//                 return u.stopEverything(t)
//             }), t.data("ujs:disabled", !0)
//         },
//         enableElement: function(t) {
//             t.data("ujs:enable-with") !== l && (t.html(t.data("ujs:enable-with")), t.removeData("ujs:enable-with")), t.unbind("click.railsDisable"), t.removeData("ujs:disabled")
//         }
//     }, u.fire(t, "rails:attachBindings") && (c.ajaxPrefilter(function(t, e, n) {
//         t.crossDomain || u.CSRFProtection(n)
//     }), c(window).on("pageshow.rails", function() {
//         c(c.rails.enableSelector).each(function() {
//             var t = c(this);
//             t.data("ujs:disabled") && c.rails.enableFormElement(t)
//         }), c(c.rails.linkDisableSelector).each(function() {
//             var t = c(this);
//             t.data("ujs:disabled") && c.rails.enableElement(t)
//         })
//     }), t.on("ajax:complete", u.linkDisableSelector, function() {
//         u.enableElement(c(this))
//     }), t.on("ajax:complete", u.buttonDisableSelector, function() {
//         u.enableFormElement(c(this))
//     }), t.on("click.rails", u.linkClickSelector, function(t) {
//         var e = c(this),
//             n = e.data("method"),
//             i = e.data("params"),
//             r = t.metaKey || t.ctrlKey;
//         if (!u.allowAction(e)) return u.stopEverything(t);
//         if (!r && e.is(u.linkDisableSelector) && u.disableElement(e), u.isRemote(e)) {
//             if (r && (!n || "GET" === n) && !i) return !0;
//             var o = u.handleRemote(e);
//             return !1 === o ? u.enableElement(e) : o.fail(function() {
//                 u.enableElement(e)
//             }), !1
//         }
//         return n ? (u.handleMethod(e), !1) : void 0
//     }), t.on("click.rails", u.buttonClickSelector, function(t) {
//         var e = c(this);
//         if (!u.allowAction(e) || !u.isRemote(e)) return u.stopEverything(t);
//         e.is(u.buttonDisableSelector) && u.disableFormElement(e);
//         var n = u.handleRemote(e);
//         return !1 === n ? u.enableFormElement(e) : n.fail(function() {
//             u.enableFormElement(e)
//         }), !1
//     }), t.on("change.rails", u.inputChangeSelector, function(t) {
//         var e = c(this);
//         return u.allowAction(e) && u.isRemote(e) ? (u.handleRemote(e), !1) : u.stopEverything(t)
//     }), t.on("submit.rails", u.formSubmitSelector, function(t) {
//         var e, n, i = c(this),
//             r = u.isRemote(i);
//         if (!u.allowAction(i)) return u.stopEverything(t);
//         if (i.attr("novalidate") === l)
//             if (i.data("ujs:formnovalidate-button") === l) {
//                 if ((e = u.blankInputs(i, u.requiredInputSelector, !1)) && u.fire(i, "ajax:aborted:required", [e])) return u.stopEverything(t)
//             } else i.data("ujs:formnovalidate-button", l);
//         if (r) {
//             if (n = u.nonBlankInputs(i, u.fileInputSelector)) {
//                 setTimeout(function() {
//                     u.disableFormElements(i)
//                 }, 13);
//                 var o = u.fire(i, "ajax:aborted:file", [n]);
//                 return o || setTimeout(function() {
//                     u.enableFormElements(i)
//                 }, 13), o
//             }
//             return u.handleRemote(i), !1
//         }
//         setTimeout(function() {
//             u.disableFormElements(i)
//         }, 13)
//     }), t.on("click.rails", u.formInputClickSelector, function(t) {
//         var e = c(this);
//         if (!u.allowAction(e)) return u.stopEverything(t);
//         var n = e.attr("name"),
//             i = n ? {
//                 name: n,
//                 value: e.val()
//             } : null,
//             r = e.closest("form");
//         0 === r.length && (r = c("#" + e.attr("form"))), r.data("ujs:submit-button", i), r.data("ujs:formnovalidate-button", e.attr("formnovalidate")), r.data("ujs:submit-button-formaction", e.attr("formaction")), r.data("ujs:submit-button-formmethod", e.attr("formmethod"))
//     }), t.on("ajax:send.rails", u.formSubmitSelector, function(t) {
//         this === t.target && u.disableFormElements(c(this))
//     }), t.on("ajax:complete.rails", u.formSubmitSelector, function(t) {
//         this === t.target && u.enableFormElements(c(this))
//     }), c(function() {
//         u.refreshCSRFTokens()
//     }))
// }(jQuery),
// function() {
//     var t = this;
//     (function() {
//         (function() {
//             this.Turbolinks = {
//                 supported: null != window.history.pushState && null != window.requestAnimationFrame && null != window.addEventListener,
//                 visit: function(t, e) {
//                     return c.controller.visit(t, e)
//                 },
//                 clearCache: function() {
//                     return c.controller.clearCache()
//                 },
//                 setProgressBarDelay: function(t) {
//                     return c.controller.setProgressBarDelay(t)
//                 }
//             }
//         }).call(this)
//     }).call(t);
//     var c = t.Turbolinks;
//     (function() {
//         (function() {
//             var n, i, l, t, e, r, o, s, a, u = [].slice;
//             c.copyObject = function(t) {
//                 var e, n, i;
//                 for (e in n = {}, t) i = t[e], n[e] = i;
//                 return n
//             }, c.closest = function(t, e) {
//                 return n.call(t, e)
//             }, n = null != (a = document.documentElement.closest) ? a : function(t) {
//                 var e;
//                 for (e = this; e;) {
//                     if (e.nodeType === Node.ELEMENT_NODE && i.call(e, t)) return e;
//                     e = e.parentNode
//                 }
//             }, c.defer = function(t) {
//                 return setTimeout(t, 1)
//             }, c.throttle = function(n) {
//                 var i;
//                 return i = null,
//                     function() {
//                         var t, e;
//                         return t = 1 <= arguments.length ? u.call(arguments, 0) : [], null != i ? i : i = requestAnimationFrame((e = this, function() {
//                             return i = null, n.apply(e, t)
//                         }))
//                     }
//             }, c.dispatch = function(t, e) {
//                 var n, i, r, o, s, a;
//                 return a = (s = null != e ? e : {}).target, n = s.cancelable, i = s.data, (r = document.createEvent("Events")).initEvent(t, !0, !0 === n), r.data = null != i ? i : {}, r.cancelable && !l && (o = r.preventDefault, r.preventDefault = function() {
//                     return this.defaultPrevented || Object.defineProperty(this, "defaultPrevented", {
//                         get: function() {
//                             return !0
//                         }
//                     }), o.call(this)
//                 }), (null != a ? a : document).dispatchEvent(r), r
//             }, (s = document.createEvent("Events")).initEvent("test", !0, !0), s.preventDefault(), l = s.defaultPrevented, c.match = function(t, e) {
//                 return i.call(t, e)
//             }, i = null != (e = null != (r = null != (o = (t = document.documentElement).matchesSelector) ? o : t.webkitMatchesSelector) ? r : t.msMatchesSelector) ? e : t.mozMatchesSelector, c.uuid = function() {
//                 var t, e, n;
//                 for (n = "", t = e = 1; e <= 36; t = ++e) n += 9 === t || 14 === t || 19 === t || 24 === t ? "-" : 15 === t ? "4" : 20 === t ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(15 * Math.random()).toString(16);
//                 return n
//             }
//         }).call(this),
//             function() {
//                 c.Location = function() {
//                     function t(t) {
//                         var e, n;
//                         null == t && (t = ""), (n = document.createElement("a")).href = t.toString(), this.absoluteURL = n.href, (e = n.hash.length) < 2 ? this.requestURL = this.absoluteURL : (this.requestURL = this.absoluteURL.slice(0, -e), this.anchor = n.hash.slice(1))
//                     }
//                     var e, n, i, r;
//                     return t.wrap = function(t) {
//                         return t instanceof this ? t : new this(t)
//                     }, t.prototype.getOrigin = function() {
//                         return this.absoluteURL.split("/", 3).join("/")
//                     }, t.prototype.getPath = function() {
//                         var t, e;
//                         return null != (t = null != (e = this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/)) ? e[1] : void 0) ? t : "/"
//                     }, t.prototype.getPathComponents = function() {
//                         return this.getPath().split("/").slice(1)
//                     }, t.prototype.getLastPathComponent = function() {
//                         return this.getPathComponents().slice(-1)[0]
//                     }, t.prototype.getExtension = function() {
//                         var t, e;
//                         return null != (t = null != (e = this.getLastPathComponent().match(/\.[^.]*$/)) ? e[0] : void 0) ? t : ""
//                     }, t.prototype.isHTML = function() {
//                         return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)
//                     }, t.prototype.isPrefixedBy = function(t) {
//                         var e;
//                         return e = n(t), this.isEqualTo(t) || r(this.absoluteURL, e)
//                     }, t.prototype.isEqualTo = function(t) {
//                         return this.absoluteURL === (null != t ? t.absoluteURL : void 0)
//                     }, t.prototype.toCacheKey = function() {
//                         return this.requestURL
//                     }, t.prototype.toJSON = function() {
//                         return this.absoluteURL
//                     }, t.prototype.toString = function() {
//                         return this.absoluteURL
//                     }, t.prototype.valueOf = function() {
//                         return this.absoluteURL
//                     }, n = function(t) {
//                         return e(t.getOrigin() + t.getPath())
//                     }, e = function(t) {
//                         return i(t, "/") ? t : t + "/"
//                     }, r = function(t, e) {
//                         return t.slice(0, e.length) === e
//                     }, i = function(t, e) {
//                         return t.slice(-e.length) === e
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var i = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.HttpRequest = function() {
//                     function t(t, e, n) {
//                         this.delegate = t, this.requestCanceled = i(this.requestCanceled, this), this.requestTimedOut = i(this.requestTimedOut, this), this.requestFailed = i(this.requestFailed, this), this.requestLoaded = i(this.requestLoaded, this), this.requestProgressed = i(this.requestProgressed, this), this.url = c.Location.wrap(e).requestURL, this.referrer = c.Location.wrap(n).absoluteURL, this.createXHR()
//                     }
//                     return t.NETWORK_FAILURE = 0, t.TIMEOUT_FAILURE = -1, t.timeout = 60, t.prototype.send = function() {
//                         var t;
//                         return this.xhr && !this.sent ? (this.notifyApplicationBeforeRequestStart(), this.setProgress(0), this.xhr.send(), this.sent = !0, "function" == typeof(t = this.delegate).requestStarted ? t.requestStarted() : void 0) : void 0
//                     }, t.prototype.cancel = function() {
//                         return this.xhr && this.sent ? this.xhr.abort() : void 0
//                     }, t.prototype.requestProgressed = function(t) {
//                         return t.lengthComputable ? this.setProgress(t.loaded / t.total) : void 0
//                     }, t.prototype.requestLoaded = function() {
//                         return this.endRequest((e = this, function() {
//                             var t;
//                             return 200 <= (t = e.xhr.status) && t < 300 ? e.delegate.requestCompletedWithResponse(e.xhr.responseText, e.xhr.getResponseHeader("Turbolinks-Location")) : (e.failed = !0, e.delegate.requestFailedWithStatusCode(e.xhr.status, e.xhr.responseText))
//                         }));
//                         var e
//                     }, t.prototype.requestFailed = function() {
//                         return this.endRequest((t = this, function() {
//                             return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)
//                         }));
//                         var t
//                     }, t.prototype.requestTimedOut = function() {
//                         return this.endRequest((t = this, function() {
//                             return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)
//                         }));
//                         var t
//                     }, t.prototype.requestCanceled = function() {
//                         return this.endRequest()
//                     }, t.prototype.notifyApplicationBeforeRequestStart = function() {
//                         return c.dispatch("turbolinks:request-start", {
//                             data: {
//                                 url: this.url,
//                                 xhr: this.xhr
//                             }
//                         })
//                     }, t.prototype.notifyApplicationAfterRequestEnd = function() {
//                         return c.dispatch("turbolinks:request-end", {
//                             data: {
//                                 url: this.url,
//                                 xhr: this.xhr
//                             }
//                         })
//                     }, t.prototype.createXHR = function() {
//                         return this.xhr = new XMLHttpRequest, this.xhr.open("GET", this.url, !0), this.xhr.timeout = 1e3 * this.constructor.timeout, this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml"), this.xhr.setRequestHeader("Turbolinks-Referrer", this.referrer), this.xhr.onprogress = this.requestProgressed, this.xhr.onload = this.requestLoaded, this.xhr.onerror = this.requestFailed, this.xhr.ontimeout = this.requestTimedOut, this.xhr.onabort = this.requestCanceled
//                     }, t.prototype.endRequest = function(t) {
//                         return this.xhr ? (this.notifyApplicationAfterRequestEnd(), null != t && t.call(this), this.destroy()) : void 0
//                     }, t.prototype.setProgress = function(t) {
//                         var e;
//                         return this.progress = t, "function" == typeof(e = this.delegate).requestProgressed ? e.requestProgressed(this.progress) : void 0
//                     }, t.prototype.destroy = function() {
//                         var t;
//                         return this.setProgress(1), "function" == typeof(t = this.delegate).requestFinished && t.requestFinished(), this.delegate = null, this.xhr = null
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var n = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.ProgressBar = function() {
//                     function t() {
//                         this.trickle = n(this.trickle, this), this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement()
//                     }
//                     var e;
//                     return e = 300, t.defaultCSS = ".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width " + e + "ms ease-out, opacity " + e / 2 + "ms " + e / 2 + "ms ease-in;\n  transform: translate3d(0, 0, 0);\n}", t.prototype.show = function() {
//                         return this.visible ? void 0 : (this.visible = !0, this.installStylesheetElement(), this.installProgressElement(), this.startTrickling())
//                     }, t.prototype.hide = function() {
//                         return this.visible && !this.hiding ? (this.hiding = !0, this.fadeProgressElement((t = this, function() {
//                             return t.uninstallProgressElement(), t.stopTrickling(), t.visible = !1, t.hiding = !1
//                         }))) : void 0;
//                         var t
//                     }, t.prototype.setValue = function(t) {
//                         return this.value = t, this.refresh()
//                     }, t.prototype.installStylesheetElement = function() {
//                         return document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
//                     }, t.prototype.installProgressElement = function() {
//                         return this.progressElement.style.width = 0, this.progressElement.style.opacity = 1, document.documentElement.insertBefore(this.progressElement, document.body), this.refresh()
//                     }, t.prototype.fadeProgressElement = function(t) {
//                         return this.progressElement.style.opacity = 0, setTimeout(t, 1.5 * e)
//                     }, t.prototype.uninstallProgressElement = function() {
//                         return this.progressElement.parentNode ? document.documentElement.removeChild(this.progressElement) : void 0
//                     }, t.prototype.startTrickling = function() {
//                         return null != this.trickleInterval ? this.trickleInterval : this.trickleInterval = setInterval(this.trickle, e)
//                     }, t.prototype.stopTrickling = function() {
//                         return clearInterval(this.trickleInterval), this.trickleInterval = null
//                     }, t.prototype.trickle = function() {
//                         return this.setValue(this.value + Math.random() / 100)
//                     }, t.prototype.refresh = function() {
//                         return requestAnimationFrame((t = this, function() {
//                             return t.progressElement.style.width = 10 + 90 * t.value + "%"
//                         }));
//                         var t
//                     }, t.prototype.createStylesheetElement = function() {
//                         var t;
//                         return (t = document.createElement("style")).type = "text/css", t.textContent = this.constructor.defaultCSS, t
//                     }, t.prototype.createProgressElement = function() {
//                         var t;
//                         return (t = document.createElement("div")).className = "turbolinks-progress-bar", t
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var r = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.BrowserAdapter = function() {
//                     function t(t) {
//                         this.controller = t, this.showProgressBar = r(this.showProgressBar, this), this.progressBar = new c.ProgressBar
//                     }
//                     var n, i, e;
//                     return e = c.HttpRequest, n = e.NETWORK_FAILURE, i = e.TIMEOUT_FAILURE, t.prototype.visitProposedToLocationWithAction = function(t, e) {
//                         return this.controller.startVisitToLocationWithAction(t, e)
//                     }, t.prototype.visitStarted = function(t) {
//                         return t.issueRequest(), t.changeHistory(), t.loadCachedSnapshot()
//                     }, t.prototype.visitRequestStarted = function(t) {
//                         return this.progressBar.setValue(0), t.hasCachedSnapshot() || "restore" !== t.action ? this.showProgressBarAfterDelay() : this.showProgressBar()
//                     }, t.prototype.visitRequestProgressed = function(t) {
//                         return this.progressBar.setValue(t.progress)
//                     }, t.prototype.visitRequestCompleted = function(t) {
//                         return t.loadResponse()
//                     }, t.prototype.visitRequestFailedWithStatusCode = function(t, e) {
//                         switch (e) {
//                             case n:
//                             case i:
//                                 return this.reload();
//                             default:
//                                 return t.loadResponse()
//                         }
//                     }, t.prototype.visitRequestFinished = function() {
//                         return this.hideProgressBar()
//                     }, t.prototype.visitCompleted = function(t) {
//                         return t.followRedirect()
//                     }, t.prototype.pageInvalidated = function() {
//                         return this.reload()
//                     }, t.prototype.showProgressBarAfterDelay = function() {
//                         return this.progressBarTimeout = setTimeout(this.showProgressBar, this.controller.progressBarDelay)
//                     }, t.prototype.showProgressBar = function() {
//                         return this.progressBar.show()
//                     }, t.prototype.hideProgressBar = function() {
//                         return this.progressBar.hide(), clearTimeout(this.progressBarTimeout)
//                     }, t.prototype.reload = function() {
//                         return window.location.reload()
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var e = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.History = function() {
//                     function t(t) {
//                         this.delegate = t, this.onPageLoad = e(this.onPageLoad, this), this.onPopState = e(this.onPopState, this)
//                     }
//                     return t.prototype.start = function() {
//                         return this.started ? void 0 : (addEventListener("popstate", this.onPopState, !1), addEventListener("load", this.onPageLoad, !1), this.started = !0)
//                     }, t.prototype.stop = function() {
//                         return this.started ? (removeEventListener("popstate", this.onPopState, !1), removeEventListener("load", this.onPageLoad, !1), this.started = !1) : void 0
//                     }, t.prototype.push = function(t, e) {
//                         return t = c.Location.wrap(t), this.update("push", t, e)
//                     }, t.prototype.replace = function(t, e) {
//                         return t = c.Location.wrap(t), this.update("replace", t, e)
//                     }, t.prototype.onPopState = function(t) {
//                         var e, n, i, r;
//                         return this.shouldHandlePopState() && (r = null != (n = t.state) ? n.turbolinks : void 0) ? (e = c.Location.wrap(window.location), i = r.restorationIdentifier, this.delegate.historyPoppedToLocationWithRestorationIdentifier(e, i)) : void 0
//                     }, t.prototype.onPageLoad = function() {
//                         return c.defer((t = this, function() {
//                             return t.pageLoaded = !0
//                         }));
//                         var t
//                     }, t.prototype.shouldHandlePopState = function() {
//                         return this.pageIsLoaded()
//                     }, t.prototype.pageIsLoaded = function() {
//                         return this.pageLoaded || "complete" === document.readyState
//                     }, t.prototype.update = function(t, e, n) {
//                         var i;
//                         return i = {
//                             turbolinks: {
//                                 restorationIdentifier: n
//                             }
//                         }, history[t + "State"](i, null, e)
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 c.HeadDetails = function() {
//                     function t(t) {
//                         var e, n, i, r, o;
//                         for (this.elements = {}, n = 0, r = t.length; n < r; n++)(o = t[n]).nodeType === Node.ELEMENT_NODE && (i = o.outerHTML, (null != (e = this.elements)[i] ? e[i] : e[i] = {
//                             type: a(o),
//                             tracked: s(o),
//                             elements: []
//                         }).elements.push(o))
//                     }
//                     var o, e, n, s, a;
//                     return t.fromHeadElement = function(t) {
//                         var e;
//                         return new this(null != (e = null != t ? t.childNodes : void 0) ? e : [])
//                     }, t.prototype.hasElementWithKey = function(t) {
//                         return t in this.elements
//                     }, t.prototype.getTrackedElementSignature = function() {
//                         var n;
//                         return function() {
//                             var t, e;
//                             for (n in e = [], t = this.elements) t[n].tracked && e.push(n);
//                             return e
//                         }.call(this).join("")
//                     }, t.prototype.getScriptElementsNotInDetails = function(t) {
//                         return this.getElementsMatchingTypeNotInDetails("script", t)
//                     }, t.prototype.getStylesheetElementsNotInDetails = function(t) {
//                         return this.getElementsMatchingTypeNotInDetails("stylesheet", t)
//                     }, t.prototype.getElementsMatchingTypeNotInDetails = function(t, e) {
//                         var n, i, r, o, s, a;
//                         for (i in s = [], r = this.elements) a = (o = r[i]).type, n = o.elements, a !== t || e.hasElementWithKey(i) || s.push(n[0]);
//                         return s
//                     }, t.prototype.getProvisionalElements = function() {
//                         var t, e, n, i, r, o, s;
//                         for (e in n = [], i = this.elements) s = (r = i[e]).type, o = r.tracked, t = r.elements, null != s || o ? 1 < t.length && n.push.apply(n, t.slice(1)) : n.push.apply(n, t);
//                         return n
//                     }, t.prototype.getMetaValue = function(t) {
//                         var e;
//                         return null != (e = this.findMetaElementByName(t)) ? e.getAttribute("content") : void 0
//                     }, t.prototype.findMetaElementByName = function(t) {
//                         var e, n, i, r;
//                         for (i in e = void 0, r = this.elements) n = r[i].elements, o(n[0], t) && (e = n[0]);
//                         return e
//                     }, a = function(t) {
//                         return e(t) ? "script" : n(t) ? "stylesheet" : void 0
//                     }, s = function(t) {
//                         return "reload" === t.getAttribute("data-turbolinks-track")
//                     }, e = function(t) {
//                         return "script" === t.tagName.toLowerCase()
//                     }, n = function(t) {
//                         var e;
//                         return "style" === (e = t.tagName.toLowerCase()) || "link" === e && "stylesheet" === t.getAttribute("rel")
//                     }, o = function(t, e) {
//                         return "meta" === t.tagName.toLowerCase() && t.getAttribute("name") === e
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 c.Snapshot = function() {
//                     function t(t, e) {
//                         this.headDetails = t, this.bodyElement = e
//                     }
//                     return t.wrap = function(t) {
//                         return t instanceof this ? t : "string" == typeof t ? this.fromHTMLString(t) : this.fromHTMLElement(t)
//                     }, t.fromHTMLString = function(t) {
//                         var e;
//                         return (e = document.createElement("html")).innerHTML = t, this.fromHTMLElement(e)
//                     }, t.fromHTMLElement = function(t) {
//                         var e, n, i;
//                         return n = t.querySelector("head"), e = null != (i = t.querySelector("body")) ? i : document.createElement("body"), new this(c.HeadDetails.fromHeadElement(n), e)
//                     }, t.prototype.clone = function() {
//                         return new this.constructor(this.headDetails, this.bodyElement.cloneNode(!0))
//                     }, t.prototype.getRootLocation = function() {
//                         var t, e;
//                         return e = null != (t = this.getSetting("root")) ? t : "/", new c.Location(e)
//                     }, t.prototype.getCacheControlValue = function() {
//                         return this.getSetting("cache-control")
//                     }, t.prototype.getElementForAnchor = function(t) {
//                         try {
//                             return this.bodyElement.querySelector("[id='" + t + "'], a[name='" + t + "']")
//                         } catch (c) {}
//                     }, t.prototype.getPermanentElements = function() {
//                         return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")
//                     }, t.prototype.getPermanentElementById = function(t) {
//                         return this.bodyElement.querySelector("#" + t + "[data-turbolinks-permanent]")
//                     }, t.prototype.getPermanentElementsPresentInSnapshot = function(t) {
//                         var e, n, i, r, o;
//                         for (o = [], n = 0, i = (r = this.getPermanentElements()).length; n < i; n++) e = r[n], t.getPermanentElementById(e.id) && o.push(e);
//                         return o
//                     }, t.prototype.findFirstAutofocusableElement = function() {
//                         return this.bodyElement.querySelector("[autofocus]")
//                     }, t.prototype.hasAnchor = function(t) {
//                         return null != this.getElementForAnchor(t)
//                     }, t.prototype.isPreviewable = function() {
//                         return "no-preview" !== this.getCacheControlValue()
//                     }, t.prototype.isCacheable = function() {
//                         return "no-cache" !== this.getCacheControlValue()
//                     }, t.prototype.isVisitable = function() {
//                         return "reload" !== this.getSetting("visit-control")
//                     }, t.prototype.getSetting = function(t) {
//                         return this.headDetails.getMetaValue("turbolinks-" + t)
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var o = [].slice;
//                 c.Renderer = function() {
//                     function t() {}
//                     var n;
//                     return t.render = function(t, e) {
//                         var n, i, r;
//                         return i = t, n = e, (r = function(t, e, n) {
//                             n.prototype = t.prototype;
//                             var i = new n,
//                                 r = t.apply(i, e);
//                             return Object(r) === r ? r : i
//                         }(this, 3 <= arguments.length ? o.call(arguments, 2) : [], function() {})).delegate = i, r.render(n), r
//                     }, t.prototype.renderView = function(t) {
//                         return this.delegate.viewWillRender(this.newBody), t(), this.delegate.viewRendered(this.newBody)
//                     }, t.prototype.invalidateView = function() {
//                         return this.delegate.viewInvalidated()
//                     }, t.prototype.createScriptElement = function(t) {
//                         var e;
//                         return "false" === t.getAttribute("data-turbolinks-eval") ? t : ((e = document.createElement("script")).textContent = t.textContent, e.async = !1, n(e, t), e)
//                     }, n = function(t, e) {
//                         var n, i, r, o, s, a, l;
//                         for (a = [], n = 0, i = (o = e.attributes).length; n < i; n++) r = (s = o[n]).name, l = s.value, a.push(t.setAttribute(r, l));
//                         return a
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var a, l, n = function(t, e) {
//                         function n() {
//                             this.constructor = t
//                         }
//                         for (var i in e) r.call(e, i) && (t[i] = e[i]);
//                         return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
//                     },
//                     r = {}.hasOwnProperty;
//                 c.SnapshotRenderer = function(t) {
//                     function e(t, e, n) {
//                         this.currentSnapshot = t, this.newSnapshot = e, this.isPreview = n, this.currentHeadDetails = this.currentSnapshot.headDetails, this.newHeadDetails = this.newSnapshot.headDetails, this.currentBody = this.currentSnapshot.bodyElement, this.newBody = this.newSnapshot.bodyElement
//                     }
//                     return n(e, t), e.prototype.render = function(t) {
//                         return this.shouldRender() ? (this.mergeHead(), this.renderView((e = this, function() {
//                             return e.replaceBody(), e.isPreview || e.focusFirstAutofocusableElement(), t()
//                         }))) : this.invalidateView();
//                         var e
//                     }, e.prototype.mergeHead = function() {
//                         return this.copyNewHeadStylesheetElements(), this.copyNewHeadScriptElements(), this.removeCurrentHeadProvisionalElements(), this.copyNewHeadProvisionalElements()
//                     }, e.prototype.replaceBody = function() {
//                         var t;
//                         return t = this.relocateCurrentBodyPermanentElements(), this.activateNewBodyScriptElements(), this.assignNewBody(), this.replacePlaceholderElementsWithClonedPermanentElements(t)
//                     }, e.prototype.shouldRender = function() {
//                         return this.newSnapshot.isVisitable() && this.trackedElementsAreIdentical()
//                     }, e.prototype.trackedElementsAreIdentical = function() {
//                         return this.currentHeadDetails.getTrackedElementSignature() === this.newHeadDetails.getTrackedElementSignature()
//                     }, e.prototype.copyNewHeadStylesheetElements = function() {
//                         var t, e, n, i, r;
//                         for (r = [], e = 0, n = (i = this.getNewHeadStylesheetElements()).length; e < n; e++) t = i[e], r.push(document.head.appendChild(t));
//                         return r
//                     }, e.prototype.copyNewHeadScriptElements = function() {
//                         var t, e, n, i, r;
//                         for (r = [], e = 0, n = (i = this.getNewHeadScriptElements()).length; e < n; e++) t = i[e], r.push(document.head.appendChild(this.createScriptElement(t)));
//                         return r
//                     }, e.prototype.removeCurrentHeadProvisionalElements = function() {
//                         var t, e, n, i, r;
//                         for (r = [], e = 0, n = (i = this.getCurrentHeadProvisionalElements()).length; e < n; e++) t = i[e], r.push(document.head.removeChild(t));
//                         return r
//                     }, e.prototype.copyNewHeadProvisionalElements = function() {
//                         var t, e, n, i, r;
//                         for (r = [], e = 0, n = (i = this.getNewHeadProvisionalElements()).length; e < n; e++) t = i[e], r.push(document.head.appendChild(t));
//                         return r
//                     }, e.prototype.relocateCurrentBodyPermanentElements = function() {
//                         var t, e, n, i, r, o, s;
//                         for (s = [], t = 0, e = (o = this.getCurrentBodyPermanentElements()).length; t < e; t++) i = o[t], r = a(i), n = this.newSnapshot.getPermanentElementById(i.id), l(i, r.element), l(n, i), s.push(r);
//                         return s
//                     }, e.prototype.replacePlaceholderElementsWithClonedPermanentElements = function(t) {
//                         var e, n, i, r, o, s;
//                         for (s = [], i = 0, r = t.length; i < r; i++) n = (o = t[i]).element, e = o.permanentElement.cloneNode(!0), s.push(l(n, e));
//                         return s
//                     }, e.prototype.activateNewBodyScriptElements = function() {
//                         var t, e, n, i, r, o;
//                         for (o = [], e = 0, i = (r = this.getNewBodyScriptElements()).length; e < i; e++) n = r[e], t = this.createScriptElement(n), o.push(l(n, t));
//                         return o
//                     }, e.prototype.assignNewBody = function() {
//                         return document.body = this.newBody
//                     }, e.prototype.focusFirstAutofocusableElement = function() {
//                         var t;
//                         return null != (t = this.newSnapshot.findFirstAutofocusableElement()) ? t.focus() : void 0
//                     }, e.prototype.getNewHeadStylesheetElements = function() {
//                         return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)
//                     }, e.prototype.getNewHeadScriptElements = function() {
//                         return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)
//                     }, e.prototype.getCurrentHeadProvisionalElements = function() {
//                         return this.currentHeadDetails.getProvisionalElements()
//                     }, e.prototype.getNewHeadProvisionalElements = function() {
//                         return this.newHeadDetails.getProvisionalElements()
//                     }, e.prototype.getCurrentBodyPermanentElements = function() {
//                         return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)
//                     }, e.prototype.getNewBodyScriptElements = function() {
//                         return this.newBody.querySelectorAll("script")
//                     }, e
//                 }(c.Renderer), a = function(t) {
//                     var e;
//                     return (e = document.createElement("meta")).setAttribute("name", "turbolinks-permanent-placeholder"), e.setAttribute("content", t.id), {
//                         element: e,
//                         permanentElement: t
//                     }
//                 }, l = function(t, e) {
//                     var n;
//                     return (n = t.parentNode) ? n.replaceChild(e, t) : void 0
//                 }
//             }.call(this),
//             function() {
//                 var n = function(t, e) {
//                         function n() {
//                             this.constructor = t
//                         }
//                         for (var i in e) r.call(e, i) && (t[i] = e[i]);
//                         return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
//                     },
//                     r = {}.hasOwnProperty;
//                 c.ErrorRenderer = function(t) {
//                     function e(t) {
//                         var e;
//                         (e = document.createElement("html")).innerHTML = t, this.newHead = e.querySelector("head"), this.newBody = e.querySelector("body")
//                     }
//                     return n(e, t), e.prototype.render = function(t) {
//                         return this.renderView((e = this, function() {
//                             return e.replaceHeadAndBody(), e.activateBodyScriptElements(), t()
//                         }));
//                         var e
//                     }, e.prototype.replaceHeadAndBody = function() {
//                         var t, e;
//                         return e = document.head, t = document.body, e.parentNode.replaceChild(this.newHead, e), t.parentNode.replaceChild(this.newBody, t)
//                     }, e.prototype.activateBodyScriptElements = function() {
//                         var t, e, n, i, r, o;
//                         for (o = [], e = 0, n = (i = this.getScriptElements()).length; e < n; e++) r = i[e], t = this.createScriptElement(r), o.push(r.parentNode.replaceChild(t, r));
//                         return o
//                     }, e.prototype.getScriptElements = function() {
//                         return document.documentElement.querySelectorAll("script")
//                     }, e
//                 }(c.Renderer)
//             }.call(this),
//             function() {
//                 c.View = function() {
//                     function t(t) {
//                         this.delegate = t, this.htmlElement = document.documentElement
//                     }
//                     return t.prototype.getRootLocation = function() {
//                         return this.getSnapshot().getRootLocation()
//                     }, t.prototype.getElementForAnchor = function(t) {
//                         return this.getSnapshot().getElementForAnchor(t)
//                     }, t.prototype.getSnapshot = function() {
//                         return c.Snapshot.fromHTMLElement(this.htmlElement)
//                     }, t.prototype.render = function(t, e) {
//                         var n, i, r;
//                         return r = t.snapshot, n = t.error, i = t.isPreview, this.markAsPreview(i), null != r ? this.renderSnapshot(r, i, e) : this.renderError(n, e)
//                     }, t.prototype.markAsPreview = function(t) {
//                         return t ? this.htmlElement.setAttribute("data-turbolinks-preview", "") : this.htmlElement.removeAttribute("data-turbolinks-preview")
//                     }, t.prototype.renderSnapshot = function(t, e, n) {
//                         return c.SnapshotRenderer.render(this.delegate, n, this.getSnapshot(), c.Snapshot.wrap(t), e)
//                     }, t.prototype.renderError = function(t, e) {
//                         return c.ErrorRenderer.render(this.delegate, e, t)
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var e = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.ScrollManager = function() {
//                     function t(t) {
//                         this.delegate = t, this.onScroll = e(this.onScroll, this), this.onScroll = c.throttle(this.onScroll)
//                     }
//                     return t.prototype.start = function() {
//                         return this.started ? void 0 : (addEventListener("scroll", this.onScroll, !1), this.onScroll(), this.started = !0)
//                     }, t.prototype.stop = function() {
//                         return this.started ? (removeEventListener("scroll", this.onScroll, !1), this.started = !1) : void 0
//                     }, t.prototype.scrollToElement = function(t) {
//                         return t.scrollIntoView()
//                     }, t.prototype.scrollToPosition = function(t) {
//                         var e, n;
//                         return e = t.x, n = t.y, window.scrollTo(e, n)
//                     }, t.prototype.onScroll = function() {
//                         return this.updatePosition({
//                             x: window.pageXOffset,
//                             y: window.pageYOffset
//                         })
//                     }, t.prototype.updatePosition = function(t) {
//                         var e;
//                         return this.position = t, null != (e = this.delegate) ? e.scrollPositionChanged(this.position) : void 0
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 c.SnapshotCache = function() {
//                     function t(t) {
//                         this.size = t, this.keys = [], this.snapshots = {}
//                     }
//                     var i;
//                     return t.prototype.has = function(t) {
//                         return i(t) in this.snapshots
//                     }, t.prototype.get = function(t) {
//                         var e;
//                         if (this.has(t)) return e = this.read(t), this.touch(t), e
//                     }, t.prototype.put = function(t, e) {
//                         return this.write(t, e), this.touch(t), e
//                     }, t.prototype.read = function(t) {
//                         var e;
//                         return e = i(t), this.snapshots[e]
//                     }, t.prototype.write = function(t, e) {
//                         var n;
//                         return n = i(t), this.snapshots[n] = e
//                     }, t.prototype.touch = function(t) {
//                         var e, n;
//                         return n = i(t), -1 < (e = this.keys.indexOf(n)) && this.keys.splice(e, 1), this.keys.unshift(n), this.trim()
//                     }, t.prototype.trim = function() {
//                         var t, e, n, i, r;
//                         for (r = [], t = 0, n = (i = this.keys.splice(this.size)).length; t < n; t++) e = i[t], r.push(delete this.snapshots[e]);
//                         return r
//                     }, i = function(t) {
//                         return c.Location.wrap(t).toCacheKey()
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var i = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.Visit = function() {
//                     function t(t, e, n) {
//                         this.controller = t, this.action = n, this.performScroll = i(this.performScroll, this), this.identifier = c.uuid(), this.location = c.Location.wrap(e), this.adapter = this.controller.adapter, this.state = "initialized", this.timingMetrics = {}
//                     }
//                     var n;
//                     return t.prototype.start = function() {
//                         return "initialized" === this.state ? (this.recordTimingMetric("visitStart"), this.state = "started", this.adapter.visitStarted(this)) : void 0
//                     }, t.prototype.cancel = function() {
//                         var t;
//                         return "started" === this.state ? (null != (t = this.request) && t.cancel(), this.cancelRender(), this.state = "canceled") : void 0
//                     }, t.prototype.complete = function() {
//                         var t;
//                         return "started" === this.state ? (this.recordTimingMetric("visitEnd"), this.state = "completed", "function" == typeof(t = this.adapter).visitCompleted && t.visitCompleted(this), this.controller.visitCompleted(this)) : void 0
//                     }, t.prototype.fail = function() {
//                         var t;
//                         return "started" === this.state ? (this.state = "failed", "function" == typeof(t = this.adapter).visitFailed ? t.visitFailed(this) : void 0) : void 0
//                     }, t.prototype.changeHistory = function() {
//                         var t, e;
//                         return this.historyChanged ? void 0 : (t = this.location.isEqualTo(this.referrer) ? "replace" : this.action, e = n(t), this.controller[e](this.location, this.restorationIdentifier), this.historyChanged = !0)
//                     }, t.prototype.issueRequest = function() {
//                         return this.shouldIssueRequest() && null == this.request ? (this.progress = 0, this.request = new c.HttpRequest(this, this.location, this.referrer), this.request.send()) : void 0
//                     }, t.prototype.getCachedSnapshot = function() {
//                         var t;
//                         return !(t = this.controller.getCachedSnapshotForLocation(this.location)) || null != this.location.anchor && !t.hasAnchor(this.location.anchor) || "restore" !== this.action && !t.isPreviewable() ? void 0 : t
//                     }, t.prototype.hasCachedSnapshot = function() {
//                         return null != this.getCachedSnapshot()
//                     }, t.prototype.loadCachedSnapshot = function() {
//                         var e, n;
//                         return (n = this.getCachedSnapshot()) ? (e = this.shouldIssueRequest(), this.render(function() {
//                             var t;
//                             return this.cacheSnapshot(), this.controller.render({
//                                 snapshot: n,
//                                 isPreview: e
//                             }, this.performScroll), "function" == typeof(t = this.adapter).visitRendered && t.visitRendered(this), e ? void 0 : this.complete()
//                         })) : void 0
//                     }, t.prototype.loadResponse = function() {
//                         return null != this.response ? this.render(function() {
//                             var t, e;
//                             return this.cacheSnapshot(), this.request.failed ? (this.controller.render({
//                                 error: this.response
//                             }, this.performScroll), "function" == typeof(t = this.adapter).visitRendered && t.visitRendered(this), this.fail()) : (this.controller.render({
//                                 snapshot: this.response
//                             }, this.performScroll), "function" == typeof(e = this.adapter).visitRendered && e.visitRendered(this), this.complete())
//                         }) : void 0
//                     }, t.prototype.followRedirect = function() {
//                         return this.redirectedToLocation && !this.followedRedirect ? (this.location = this.redirectedToLocation, this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier), this.followedRedirect = !0) : void 0
//                     }, t.prototype.requestStarted = function() {
//                         var t;
//                         return this.recordTimingMetric("requestStart"), "function" == typeof(t = this.adapter).visitRequestStarted ? t.visitRequestStarted(this) : void 0
//                     }, t.prototype.requestProgressed = function(t) {
//                         var e;
//                         return this.progress = t, "function" == typeof(e = this.adapter).visitRequestProgressed ? e.visitRequestProgressed(this) : void 0
//                     }, t.prototype.requestCompletedWithResponse = function(t, e) {
//                         return this.response = t, null != e && (this.redirectedToLocation = c.Location.wrap(e)), this.adapter.visitRequestCompleted(this)
//                     }, t.prototype.requestFailedWithStatusCode = function(t, e) {
//                         return this.response = e, this.adapter.visitRequestFailedWithStatusCode(this, t)
//                     }, t.prototype.requestFinished = function() {
//                         var t;
//                         return this.recordTimingMetric("requestEnd"), "function" == typeof(t = this.adapter).visitRequestFinished ? t.visitRequestFinished(this) : void 0
//                     }, t.prototype.performScroll = function() {
//                         return this.scrolled ? void 0 : ("restore" === this.action ? this.scrollToRestoredPosition() || this.scrollToTop() : this.scrollToAnchor() || this.scrollToTop(), this.scrolled = !0)
//                     }, t.prototype.scrollToRestoredPosition = function() {
//                         var t, e;
//                         return null != (t = null != (e = this.restorationData) ? e.scrollPosition : void 0) ? (this.controller.scrollToPosition(t), !0) : void 0
//                     }, t.prototype.scrollToAnchor = function() {
//                         return null != this.location.anchor ? (this.controller.scrollToAnchor(this.location.anchor), !0) : void 0
//                     }, t.prototype.scrollToTop = function() {
//                         return this.controller.scrollToPosition({
//                             x: 0,
//                             y: 0
//                         })
//                     }, t.prototype.recordTimingMetric = function(t) {
//                         var e;
//                         return null != (e = this.timingMetrics)[t] ? e[t] : e[t] = (new Date).getTime()
//                     }, t.prototype.getTimingMetrics = function() {
//                         return c.copyObject(
//                             this.timingMetrics)
//                     }, n = function(t) {
//                         switch (t) {
//                             case "replace":
//                                 return "replaceHistoryWithLocationAndRestorationIdentifier";
//                             case "advance":
//                             case "restore":
//                                 return "pushHistoryWithLocationAndRestorationIdentifier"
//                         }
//                     }, t.prototype.shouldIssueRequest = function() {
//                         return "restore" !== this.action || !this.hasCachedSnapshot()
//                     }, t.prototype.cacheSnapshot = function() {
//                         return this.snapshotCached ? void 0 : (this.controller.cacheSnapshot(), this.snapshotCached = !0)
//                     }, t.prototype.render = function(t) {
//                         return this.cancelRender(), this.frame = requestAnimationFrame((e = this, function() {
//                             return e.frame = null, t.call(e)
//                         }));
//                         var e
//                     }, t.prototype.cancelRender = function() {
//                         return this.frame ? cancelAnimationFrame(this.frame) : void 0
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 var e = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 c.Controller = function() {
//                     function t() {
//                         this.clickBubbled = e(this.clickBubbled, this), this.clickCaptured = e(this.clickCaptured, this), this.pageLoaded = e(this.pageLoaded, this), this.history = new c.History(this), this.view = new c.View(this), this.scrollManager = new c.ScrollManager(this), this.restorationData = {}, this.clearCache(), this.setProgressBarDelay(500)
//                     }
//                     return t.prototype.start = function() {
//                         return c.supported && !this.started ? (addEventListener("click", this.clickCaptured, !0), addEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.start(), this.startHistory(), this.started = !0, this.enabled = !0) : void 0
//                     }, t.prototype.disable = function() {
//                         return this.enabled = !1
//                     }, t.prototype.stop = function() {
//                         return this.started ? (removeEventListener("click", this.clickCaptured, !0), removeEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.stop(), this.stopHistory(), this.started = !1) : void 0
//                     }, t.prototype.clearCache = function() {
//                         return this.cache = new c.SnapshotCache(10)
//                     }, t.prototype.visit = function(t, e) {
//                         var n, i;
//                         return null == e && (e = {}), t = c.Location.wrap(t), this.applicationAllowsVisitingLocation(t) ? this.locationIsVisitable(t) ? (n = null != (i = e.action) ? i : "advance", this.adapter.visitProposedToLocationWithAction(t, n)) : window.location = t : void 0
//                     }, t.prototype.startVisitToLocationWithAction = function(t, e, n) {
//                         var i;
//                         return c.supported ? (i = this.getRestorationDataForIdentifier(n), this.startVisit(t, e, {
//                             restorationData: i
//                         })) : window.location = t
//                     }, t.prototype.setProgressBarDelay = function(t) {
//                         return this.progressBarDelay = t
//                     }, t.prototype.startHistory = function() {
//                         return this.location = c.Location.wrap(window.location), this.restorationIdentifier = c.uuid(), this.history.start(), this.history.replace(this.location, this.restorationIdentifier)
//                     }, t.prototype.stopHistory = function() {
//                         return this.history.stop()
//                     }, t.prototype.pushHistoryWithLocationAndRestorationIdentifier = function(t, e) {
//                         return this.restorationIdentifier = e, this.location = c.Location.wrap(t), this.history.push(this.location, this.restorationIdentifier)
//                     }, t.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function(t, e) {
//                         return this.restorationIdentifier = e, this.location = c.Location.wrap(t), this.history.replace(this.location, this.restorationIdentifier)
//                     }, t.prototype.historyPoppedToLocationWithRestorationIdentifier = function(t, e) {
//                         var n;
//                         return this.restorationIdentifier = e, this.enabled ? (n = this.getRestorationDataForIdentifier(this.restorationIdentifier), this.startVisit(t, "restore", {
//                             restorationIdentifier: this.restorationIdentifier,
//                             restorationData: n,
//                             historyChanged: !0
//                         }), this.location = c.Location.wrap(t)) : this.adapter.pageInvalidated()
//                     }, t.prototype.getCachedSnapshotForLocation = function(t) {
//                         var e;
//                         return null != (e = this.cache.get(t)) ? e.clone() : void 0
//                     }, t.prototype.shouldCacheSnapshot = function() {
//                         return this.view.getSnapshot().isCacheable()
//                     }, t.prototype.cacheSnapshot = function() {
//                         var t, e, n;
//                         return this.shouldCacheSnapshot() ? (this.notifyApplicationBeforeCachingSnapshot(), e = this.view.getSnapshot(), t = this.lastRenderedLocation, c.defer((n = this, function() {
//                             return n.cache.put(t, e.clone())
//                         }))) : void 0
//                     }, t.prototype.scrollToAnchor = function(t) {
//                         var e;
//                         return (e = this.view.getElementForAnchor(t)) ? this.scrollToElement(e) : this.scrollToPosition({
//                             x: 0,
//                             y: 0
//                         })
//                     }, t.prototype.scrollToElement = function(t) {
//                         return this.scrollManager.scrollToElement(t)
//                     }, t.prototype.scrollToPosition = function(t) {
//                         return this.scrollManager.scrollToPosition(t)
//                     }, t.prototype.scrollPositionChanged = function(t) {
//                         return this.getCurrentRestorationData().scrollPosition = t
//                     }, t.prototype.render = function(t, e) {
//                         return this.view.render(t, e)
//                     }, t.prototype.viewInvalidated = function() {
//                         return this.adapter.pageInvalidated()
//                     }, t.prototype.viewWillRender = function(t) {
//                         return this.notifyApplicationBeforeRender(t)
//                     }, t.prototype.viewRendered = function() {
//                         return this.lastRenderedLocation = this.currentVisit.location, this.notifyApplicationAfterRender()
//                     }, t.prototype.pageLoaded = function() {
//                         return this.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad()
//                     }, t.prototype.clickCaptured = function() {
//                         return removeEventListener("click", this.clickBubbled, !1), addEventListener("click", this.clickBubbled, !1)
//                     }, t.prototype.clickBubbled = function(t) {
//                         var e, n, i;
//                         return this.enabled && this.clickEventIsSignificant(t) && (n = this.getVisitableLinkForNode(t.target)) && (i = this.getVisitableLocationForLink(n)) && this.applicationAllowsFollowingLinkToLocation(n, i) ? (t.preventDefault(), e = this.getActionForLink(n), this.visit(i, {
//                             action: e
//                         })) : void 0
//                     }, t.prototype.applicationAllowsFollowingLinkToLocation = function(t, e) {
//                         return !this.notifyApplicationAfterClickingLinkToLocation(t, e).defaultPrevented
//                     }, t.prototype.applicationAllowsVisitingLocation = function(t) {
//                         return !this.notifyApplicationBeforeVisitingLocation(t).defaultPrevented
//                     }, t.prototype.notifyApplicationAfterClickingLinkToLocation = function(t, e) {
//                         return c.dispatch("turbolinks:click", {
//                             target: t,
//                             data: {
//                                 url: e.absoluteURL
//                             },
//                             cancelable: !0
//                         })
//                     }, t.prototype.notifyApplicationBeforeVisitingLocation = function(t) {
//                         return c.dispatch("turbolinks:before-visit", {
//                             data: {
//                                 url: t.absoluteURL
//                             },
//                             cancelable: !0
//                         })
//                     }, t.prototype.notifyApplicationAfterVisitingLocation = function(t) {
//                         return c.dispatch("turbolinks:visit", {
//                             data: {
//                                 url: t.absoluteURL
//                             }
//                         })
//                     }, t.prototype.notifyApplicationBeforeCachingSnapshot = function() {
//                         return c.dispatch("turbolinks:before-cache")
//                     }, t.prototype.notifyApplicationBeforeRender = function(t) {
//                         return c.dispatch("turbolinks:before-render", {
//                             data: {
//                                 newBody: t
//                             }
//                         })
//                     }, t.prototype.notifyApplicationAfterRender = function() {
//                         return c.dispatch("turbolinks:render")
//                     }, t.prototype.notifyApplicationAfterPageLoad = function(t) {
//                         return null == t && (t = {}), c.dispatch("turbolinks:load", {
//                             data: {
//                                 url: this.location.absoluteURL,
//                                 timing: t
//                             }
//                         })
//                     }, t.prototype.startVisit = function(t, e, n) {
//                         var i;
//                         return null != (i = this.currentVisit) && i.cancel(), this.currentVisit = this.createVisit(t, e, n), this.currentVisit.start(), this.notifyApplicationAfterVisitingLocation(t)
//                     }, t.prototype.createVisit = function(t, e, n) {
//                         var i, r, o, s, a;
//                         return s = (r = null != n ? n : {}).restorationIdentifier, o = r.restorationData, i = r.historyChanged, (a = new c.Visit(this, t, e)).restorationIdentifier = null != s ? s : c.uuid(), a.restorationData = c.copyObject(o), a.historyChanged = i, a.referrer = this.location, a
//                     }, t.prototype.visitCompleted = function(t) {
//                         return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())
//                     }, t.prototype.clickEventIsSignificant = function(t) {
//                         return !(t.defaultPrevented || t.target.isContentEditable || 1 < t.which || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey)
//                     }, t.prototype.getVisitableLinkForNode = function(t) {
//                         return this.nodeIsVisitable(t) ? c.closest(t, "a[href]:not([target]):not([download])") : void 0
//                     }, t.prototype.getVisitableLocationForLink = function(t) {
//                         var e;
//                         return e = new c.Location(t.getAttribute("href")), this.locationIsVisitable(e) ? e : void 0
//                     }, t.prototype.getActionForLink = function(t) {
//                         var e;
//                         return null != (e = t.getAttribute("data-turbolinks-action")) ? e : "advance"
//                     }, t.prototype.nodeIsVisitable = function(t) {
//                         var e;
//                         return !(e = c.closest(t, "[data-turbolinks]")) || "false" !== e.getAttribute("data-turbolinks")
//                     }, t.prototype.locationIsVisitable = function(t) {
//                         return t.isPrefixedBy(this.view.getRootLocation()) && t.isHTML()
//                     }, t.prototype.getCurrentRestorationData = function() {
//                         return this.getRestorationDataForIdentifier(this.restorationIdentifier)
//                     }, t.prototype.getRestorationDataForIdentifier = function(t) {
//                         var e;
//                         return null != (e = this.restorationData)[t] ? e[t] : e[t] = {}
//                     }, t
//                 }()
//             }.call(this),
//             function() {
//                 ! function() {
//                     var t, e;
//                     if ((t = e = document.currentScript) && !e.hasAttribute("data-turbolinks-suppress-warning"))
//                         for (; t = t.parentNode;)
//                             if (t === document.body) return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s", e.outerHTML)
//                 }()
//             }.call(this),
//             function() {
//                 var t, e, n;
//                 c.start = function() {
//                     return e() ? (null == c.controller && (c.controller = t()), c.controller.start()) : void 0
//                 }, e = function() {
//                     return null == window.Turbolinks && (window.Turbolinks = c), n()
//                 }, t = function() {
//                     var t;
//                     return (t = new c.Controller).adapter = new c.BrowserAdapter(t), t
//                 }, (n = function() {
//                     return window.Turbolinks === c
//                 })() && c.start()
//             }.call(this)
//     }).call(this), "object" == typeof module && module.exports ? module.exports = c : "function" == typeof define && define.amd && define(c)
// }.call(this),
//     function(t, e) {
//         "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.SignaturePad = e()
//     }(this, function() {
//         "use strict";

//         function v(t, e, n) {
//             this.x = t, this.y = e, this.time = n || (new Date).getTime()
//         }

//         function s(t, e, n, i) {
//             this.startPoint = t, this.control1 = e, this.control2 = n, this.endPoint = i
//         }

//         function r(n, i, r) {
//             var o, s, a, l = null,
//                 u = 0;
//             r || (r = {});
//             var c = function c() {
//                 u = !1 === r.leading ? 0 : Date.now(), l = null, a = n.apply(o, s), l || (o = s = null)
//             };
//             return function() {
//                 var t = Date.now();
//                 u || !1 !== r.leading || (u = t);
//                 var e = i - (t - u);
//                 return o = this, s = arguments, e <= 0 || i < e ? (l && (clearTimeout(l), l = null), u = t, a = n.apply(o, s), l || (o = s = null)) : l || !1 === r.trailing || (l = setTimeout(c, e)), a
//             }
//         }

//         function o(t, e) {
//             var n = this,
//                 i = e || {};
//             this.velocityFilterWeight = i.velocityFilterWeight || .7, this.minWidth = i.minWidth || .5, this.maxWidth = i.maxWidth || 2.5, this.throttle = "throttle" in i ? i.throttle : 16, this.minDistance = "minDistance" in i ? i.minDistance : 5, this.throttle ? this._strokeMoveUpdate = r(o.prototype._strokeUpdate, this.throttle) : this._strokeMoveUpdate = o.prototype._strokeUpdate, this.dotSize = i.dotSize || function() {
//                 return (this.minWidth + this.maxWidth) / 2
//             }, this.penColor = i.penColor || "black", this.backgroundColor = i.backgroundColor || "rgba(0,0,0,0)", this.onBegin = i.onBegin, this.onEnd = i.onEnd, this._canvas = t, this._ctx = t.getContext("2d"), this.clear(), this._handleMouseDown = function(t) {
//                 1 === t.which && (n._mouseButtonDown = !0, n._strokeBegin(t))
//             }, this._handleMouseMove = function(t) {
//                 n._mouseButtonDown && n._strokeMoveUpdate(t)
//             }, this._handleMouseUp = function(t) {
//                 1 === t.which && n._mouseButtonDown && (n._mouseButtonDown = !1, n._strokeEnd(t))
//             }, this._handleTouchStart = function(t) {
//                 if (1 === t.targetTouches.length) {
//                     var e = t.changedTouches[0];
//                     n._strokeBegin(e)
//                 }
//             }, this._handleTouchMove = function(t) {
//                 t.preventDefault();
//                 var e = t.targetTouches[0];
//                 n._strokeMoveUpdate(e)
//             }, this._handleTouchEnd = function(t) {
//                 t.target === n._canvas && (t.preventDefault(), n._strokeEnd(t))
//             }, this.on()
//         }
//         return v.prototype.velocityFrom = function(t) {
//             return this.time !== t.time ? this.distanceTo(t) / (this.time - t.time) : 1
//         }, v.prototype.distanceTo = function(t) {
//             return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2))
//         }, v.prototype.equals = function(t) {
//             return this.x === t.x && this.y === t.y && this.time === t.time
//         }, s.prototype.length = function() {
//             for (var t = 10, e = 0, n = void 0, i = void 0, r = 0; r <= t; r += 1) {
//                 var o = r / t,
//                     s = this._point(o, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x),
//                     a = this._point(o, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
//                 if (0 < r) {
//                     var l = s - n,
//                         u = a - i;
//                     e += Math.sqrt(l * l + u * u)
//                 }
//                 n = s, i = a
//             }
//             return e
//         }, s.prototype._point = function(t, e, n, i, r) {
//             return e * (1 - t) * (1 - t) * (1 - t) + 3 * n * (1 - t) * (1 - t) * t + 3 * i * (1 - t) * t * t + r * t * t * t
//         }, o.prototype.clear = function() {
//             var t = this._ctx,
//                 e = this._canvas;
//             t.fillStyle = this.backgroundColor, t.clearRect(0, 0, e.width, e.height), t.fillRect(0, 0, e.width, e.height), this._data = [], this._reset(), this._isEmpty = !0
//         }, o.prototype.fromDataURL = function(t, e) {
//             var n = this,
//                 i = 1 < arguments.length && e !== undefined ? arguments[1] : {},
//                 r = new Image,
//                 o = i.ratio || window.devicePixelRatio || 1,
//                 s = i.width || this._canvas.width / o,
//                 a = i.height || this._canvas.height / o;
//             this._reset(), r.src = t, r.onload = function() {
//                 n._ctx.drawImage(r, 0, 0, s, a)
//             }, this._isEmpty = !1
//         }, o.prototype.toDataURL = function(t) {
//             var e;
//             switch (t) {
//                 case "image/svg+xml":
//                     return this._toSVG();
//                 default:
//                     for (var n = arguments.length, i = Array(1 < n ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
//                     return (e = this._canvas).toDataURL.apply(e, [t].concat(i))
//             }
//         }, o.prototype.on = function() {
//             this._handleMouseEvents(), this._handleTouchEvents()
//         }, o.prototype.off = function() {
//             this._canvas.removeEventListener("mousedown", this._handleMouseDown), this._canvas.removeEventListener("mousemove", this._handleMouseMove), document.removeEventListener("mouseup", this._handleMouseUp), this._canvas.removeEventListener("touchstart", this._handleTouchStart), this._canvas.removeEventListener("touchmove", this._handleTouchMove), this._canvas.removeEventListener("touchend", this._handleTouchEnd)
//         }, o.prototype.isEmpty = function() {
//             return this._isEmpty
//         }, o.prototype._strokeBegin = function(t) {
//             this._data.push([]), this._reset(), this._strokeUpdate(t), "function" == typeof this.onBegin && this.onBegin(t)
//         }, o.prototype._strokeUpdate = function(t) {
//             var e = t.clientX,
//                 n = t.clientY,
//                 i = this._createPoint(e, n),
//                 r = this._data[this._data.length - 1],
//                 o = r && r[r.length - 1],
//                 s = o && i.distanceTo(o) < this.minDistance;
//             if (!o || !s) {
//                 var a = this._addPoint(i),
//                     l = a.curve,
//                     u = a.widths;
//                 l && u && this._drawCurve(l, u.start, u.end), this._data[this._data.length - 1].push({
//                     x: i.x,
//                     y: i.y,
//                     time: i.time,
//                     color: this.penColor
//                 })
//             }
//         }, o.prototype._strokeEnd = function(t) {
//             var e = 2 < this.points.length,
//                 n = this.points[0];
//             if (!e && n && this._drawDot(n), n) {
//                 var i = this._data[this._data.length - 1],
//                     r = i[i.length - 1];
//                 n.equals(r) || i.push({
//                     x: n.x,
//                     y: n.y,
//                     time: n.time,
//                     color: this.penColor
//                 })
//             }
//             "function" == typeof this.onEnd && this.onEnd(t)
//         }, o.prototype._handleMouseEvents = function() {
//             this._mouseButtonDown = !1, this._canvas.addEventListener("mousedown", this._handleMouseDown), this._canvas.addEventListener("mousemove", this._handleMouseMove), document.addEventListener("mouseup", this._handleMouseUp)
//         }, o.prototype._handleTouchEvents = function() {
//             this._canvas.style.msTouchAction = "none", this._canvas.style.touchAction = "none", this._canvas.addEventListener("touchstart", this._handleTouchStart), this._canvas.addEventListener("touchmove", this._handleTouchMove), this._canvas.addEventListener("touchend", this._handleTouchEnd)
//         }, o.prototype._reset = function() {
//             this.points = [], this._lastVelocity = 0, this._lastWidth = (this.minWidth + this.maxWidth) / 2, this._ctx.fillStyle = this.penColor
//         }, o.prototype._createPoint = function(t, e, n) {
//             var i = this._canvas.getBoundingClientRect();
//             return new v(t - i.left, e - i.top, n || (new Date).getTime())
//         }, o.prototype._addPoint = function(t) {
//             var e = this.points;
//             if (e.push(t), 2 < e.length) {
//                 3 === e.length && e.unshift(e[0]);
//                 var n = this._calculateCurveControlPoints(e[0], e[1], e[2]).c2,
//                     i = this._calculateCurveControlPoints(e[1], e[2], e[3]).c1,
//                     r = new s(e[1], n, i, e[2]),
//                     o = this._calculateCurveWidths(r);
//                 return e.shift(), {
//                     curve: r,
//                     widths: o
//                 }
//             }
//             return {}
//         }, o.prototype._calculateCurveControlPoints = function(t, e, n) {
//             var i = t.x - e.x,
//                 r = t.y - e.y,
//                 o = e.x - n.x,
//                 s = e.y - n.y,
//                 a = {
//                     x: (t.x + e.x) / 2,
//                     y: (t.y + e.y) / 2
//                 },
//                 l = {
//                     x: (e.x + n.x) / 2,
//                     y: (e.y + n.y) / 2
//                 },
//                 u = Math.sqrt(i * i + r * r),
//                 c = Math.sqrt(o * o + s * s),
//                 h = a.x - l.x,
//                 d = a.y - l.y,
//                 f = c / (u + c),
//                 p = {
//                     x: l.x + h * f,
//                     y: l.y + d * f
//                 },
//                 m = e.x - p.x,
//                 g = e.y - p.y;
//             return {
//                 c1: new v(a.x + m, a.y + g),
//                 c2: new v(l.x + m, l.y + g)
//             }
//         }, o.prototype._calculateCurveWidths = function(t) {
//             var e = t.startPoint,
//                 n = t.endPoint,
//                 i = {
//                     start: null,
//                     end: null
//                 },
//                 r = this.velocityFilterWeight * n.velocityFrom(e) + (1 - this.velocityFilterWeight) * this._lastVelocity,
//                 o = this._strokeWidth(r);
//             return i.start = this._lastWidth, i.end = o, this._lastVelocity = r, this._lastWidth = o, i
//         }, o.prototype._strokeWidth = function(t) {
//             return Math.max(this.maxWidth / (t + 1), this.minWidth)
//         }, o.prototype._drawPoint = function(t, e, n) {
//             var i = this._ctx;
//             i.moveTo(t, e), i.arc(t, e, n, 0, 2 * Math.PI, !1), this._isEmpty = !1
//         }, o.prototype._drawCurve = function(t, e, n) {
//             var i = this._ctx,
//                 r = n - e,
//                 o = Math.floor(t.length());
//             i.beginPath();
//             for (var s = 0; s < o; s += 1) {
//                 var a = s / o,
//                     l = a * a,
//                     u = l * a,
//                     c = 1 - a,
//                     h = c * c,
//                     d = h * c,
//                     f = d * t.startPoint.x;
//                 f += 3 * h * a * t.control1.x, f += 3 * c * l * t.control2.x, f += u * t.endPoint.x;
//                 var p = d * t.startPoint.y;
//                 p += 3 * h * a * t.control1.y, p += 3 * c * l * t.control2.y, p += u * t.endPoint.y;
//                 var m = e + u * r;
//                 this._drawPoint(f, p, m)
//             }
//             i.closePath(), i.fill()
//         }, o.prototype._drawDot = function(t) {
//             var e = this._ctx,
//                 n = "function" == typeof this.dotSize ? this.dotSize() : this.dotSize;
//             e.beginPath(), this._drawPoint(t.x, t.y, n), e.closePath(), e.fill()
//         }, o.prototype._fromData = function(t, e, n) {
//             for (var i = 0; i < t.length; i += 1) {
//                 var r = t[i];
//                 if (1 < r.length)
//                     for (var o = 0; o < r.length; o += 1) {
//                         var s = r[o],
//                             a = new v(s.x, s.y, s.time),
//                             l = s.color;
//                         if (0 === o) this.penColor = l, this._reset(), this._addPoint(a);
//                         else if (o !== r.length - 1) {
//                             var u = this._addPoint(a),
//                                 c = u.curve,
//                                 h = u.widths;
//                             c && h && e(c, h, l)
//                         }
//                     } else this._reset(), n(r[0])
//             }
//         }, o.prototype._toSVG = function() {
//             var i = this,
//                 t = this._data,
//                 e = this._canvas,
//                 n = Math.max(window.devicePixelRatio || 1, 1),
//                 r = 0,
//                 o = 0,
//                 s = e.width / n,
//                 a = e.height / n,
//                 l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//             l.setAttributeNS(null, "width", e.width), l.setAttributeNS(null, "height", e.height), this._fromData(t, function(t, e, n) {
//                 var i = document.createElement("path");
//                 if (!(isNaN(t.control1.x) || isNaN(t.control1.y) || isNaN(t.control2.x) || isNaN(t.control2.y))) {
//                     var r = "M " + t.startPoint.x.toFixed(3) + "," + t.startPoint.y.toFixed(3) + " C " + t.control1.x.toFixed(3) + "," + t.control1.y.toFixed(3) + " " + t.control2.x.toFixed(3) + "," + t.control2.y.toFixed(3) + " " + t.endPoint.x.toFixed(3) + "," + t.endPoint.y.toFixed(3);
//                     i.setAttribute("d", r), i.setAttribute("stroke-width", (2.25 * e.end).toFixed(3)), i.setAttribute("stroke", n), i.setAttribute("fill", "none"), i.setAttribute("stroke-linecap", "round"), l.appendChild(i)
//                 }
//             }, function(t) {
//                 var e = document.createElement("circle"),
//                     n = "function" == typeof i.dotSize ? i.dotSize() : i.dotSize;
//                 e.setAttribute("r", n), e.setAttribute("cx", t.x), e.setAttribute("cy", t.y), e.setAttribute("fill", t.color), l.appendChild(e)
//             });
//             var u = "data:image/svg+xml;base64,",
//                 c = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="' + r + " " + o + " " + s + " " + a + '" width="' + s + '" height="' + a + '">',
//                 h = l.innerHTML;
//             if (h === undefined) {
//                 var d = document.createElement("dummy"),
//                     f = l.childNodes;
//                 d.innerHTML = "";
//                 for (var p = 0; p < f.length; p += 1) d.appendChild(f[p].cloneNode(!0));
//                 h = d.innerHTML
//             }
//             return u + btoa(c + h + "</svg>")
//         }, o.prototype.fromData = function(t) {
//             var n = this;
//             this.clear(), this._fromData(t, function(t, e) {
//                 return n._drawCurve(t, e.start, e.end)
//             }, function(t) {
//                 return n._drawDot(t)
//             }), this._data = t
//         }, o.prototype.toData = function() {
//             return this._data
//         }, o
//     });
// var numeric = "undefined" == typeof exports ? function() {} : exports;
// "undefined" != typeof global && (global.numeric = numeric), numeric.version = "1.2.6", numeric.bench = function(t, e) {
//         var n, i, r;
//         for (void 0 === e && (e = 15), i = .5, n = new Date;;) {
//             for (r = i *= 2; 3 < r; r -= 4) t(), t(), t(), t();
//             for (; 0 < r;) t(), r--;
//             if (e < new Date - n) break
//         }
//         for (r = i; 3 < r; r -= 4) t(), t(), t(), t();
//         for (; 0 < r;) t(), r--;
//         return 1e3 * (3 * i - 1) / (new Date - n)
//     }, numeric._myIndexOf = function(t) {
//         var e, n = this.length;
//         for (e = 0; e < n; ++e)
//             if (this[e] === t) return e;
//         return -1
//     }, numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf, numeric.Function = Function, numeric.precision = 4, numeric.largeArray = 50, numeric.prettyPrint = function(t) {
//         function a(t) {
//             if (0 === t) return "0";
//             if (isNaN(t)) return "NaN";
//             if (t < 0) return "-" + a(-t);
//             if (isFinite(t)) {
//                 var e = Math.floor(Math.log(t) / Math.log(10)),
//                     n = t / Math.pow(10, e),
//                     i = n.toPrecision(numeric.precision);
//                 return 10 === parseFloat(i) && (e++, i = (n = 1).toPrecision(numeric.precision)), parseFloat(i).toString() + "e" + e.toString()
//             }
//             return "Infinity"
//         }

//         function l(t) {
//             var e;
//             if (void 0 === t) return u.push(Array(numeric.precision + 8).join(" ")), !1;
//             if ("string" == typeof t) return u.push('"' + t + '"'), !1;
//             if ("boolean" == typeof t) return u.push(t.toString()), !1;
//             if ("number" == typeof t) {
//                 var n = a(t),
//                     i = t.toPrecision(numeric.precision),
//                     r = parseFloat(t.toString()).toString(),
//                     o = [n, i, r, parseFloat(i).toString(), parseFloat(r).toString()];
//                 for (e = 1; e < o.length; e++) o[e].length < n.length && (n = o[e]);
//                 return u.push(Array(numeric.precision + 8 - n.length).join(" ") + n), !1
//             }
//             if (null === t) return u.push("null"), !1;
//             if ("function" == typeof t) {
//                 u.push(t.toString());
//                 var s = !1;
//                 for (e in t) t.hasOwnProperty(e) && (s ? u.push(",\n") : u.push("\n{"), s = !0, u.push(e), u.push(": \n"), l(t[e]));
//                 return s && u.push("}\n"), !0
//             }
//             if (t instanceof Array) {
//                 if (t.length > numeric.largeArray) return u.push("...Large Array..."), !0;
//                 s = !1;
//                 for (u.push("["), e = 0; e < t.length; e++) 0 < e && (u.push(","), s && u.push("\n ")), s = l(t[e]);
//                 return u.push("]"), !0
//             }
//             u.push("{");
//             s = !1;
//             for (e in t) t.hasOwnProperty(e) && (s && u.push(",\n"), s = !0, u.push(e), u.push(": \n"), l(t[e]));
//             return u.push("}"), !0
//         }
//         var u = [];
//         return l(t), u.join("")
//     }, numeric.parseDate = function(t) {
//         function i(t) {
//             if ("string" == typeof t) return Date.parse(t.replace(/-/g, "/"));
//             if (t instanceof Array) {
//                 var e, n = [];
//                 for (e = 0; e < t.length; e++) n[e] = i(t[e]);
//                 return n
//             }
//             throw new Error("parseDate: parameter must be arrays of strings")
//         }
//         return i(t)
//     }, numeric.parseFloat = function(t) {
//         function i(t) {
//             if ("string" == typeof t) return parseFloat(t);
//             if (t instanceof Array) {
//                 var e, n = [];
//                 for (e = 0; e < t.length; e++) n[e] = i(t[e]);
//                 return n
//             }
//             throw new Error("parseFloat: parameter must be arrays of strings")
//         }
//         return i(t)
//     }, numeric.parseCSV = function(t) {
//         var e, n, i = t.split("\n"),
//             r = [],
//             o = /(([^'",]*)|('[^']*')|("[^"]*")),/g,
//             s = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/,
//             a = function(t) {
//                 return t.substr(0, t.length - 1)
//             },
//             l = 0;
//         for (n = 0; n < i.length; n++) {
//             var u, c = (i[n] + ",").match(o);
//             if (0 < c.length) {
//                 for (r[l] = [], e = 0; e < c.length; e++) u = a(c[e]), s.test(u) ? r[l][e] = parseFloat(u) : r[l][e] = u;
//                 l++
//             }
//         }
//         return r
//     }, numeric.toCSV = function(t) {
//         var e, n, i, r, o, s = numeric.dim(t);
//         for (i = s[0], s[1], o = [], e = 0; e < i; e++) {
//             for (r = [], n = 0; n < i; n++) r[n] = t[e][n].toString();
//             o[e] = r.join(", ")
//         }
//         return o.join("\n") + "\n"
//     }, numeric.getURL = function(t) {
//         var e = new XMLHttpRequest;
//         return e.open("GET", t, !1), e.send(), e
//     }, numeric.imageURL = function(t) {
//         function e(t) {
//             var e, n, i, r, o, s, a, l, u = t.length,
//                 c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
//                 h = "";
//             for (e = 0; e < u; e += 3) o = (n = t[e]) >> 2, s = ((3 & n) << 4) + ((i = t[e + 1]) >> 4), a = ((15 & i) << 2) + ((r = t[e + 2]) >> 6), l = 63 & r, u <= e + 1 ? a = l = 64 : u <= e + 2 && (l = 64), h += c.charAt(o) + c.charAt(s) + c.charAt(a) + c.charAt(l);
//             return h
//         }

//         function n(t, e, n) {
//             void 0 === e && (e = 0), void 0 === n && (n = t.length);
//             var i, r = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
//                 o = -1;
//             t.length;
//             for (i = e; i < n; i++) o = o >>> 8 ^ r[255 & (o ^ t[i])];
//             return -1 ^ o
//         }
//         var i, r, o, s, a, l, u, c, h, d, f = t[0].length,
//             p = t[0][0].length,
//             m = [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, p >> 24 & 255, p >> 16 & 255, p >> 8 & 255, 255 & p, f >> 24 & 255, f >> 16 & 255, f >> 8 & 255, 255 & f, 8, 2, 0, 0, 0, -1, -2, -3, -4, -5, -6, -7, -8, 73, 68, 65, 84, 8, 29];
//         for (d = n(m, 12, 29), m[29] = d >> 24 & 255, m[30] = d >> 16 & 255, m[31] = d >> 8 & 255, m[32] = 255 & d, i = 1, u = r = 0; u < f; u++) {
//             for (u < f - 1 ? m.push(0) : m.push(1), a = 3 * p + 1 + (0 === u) & 255, l = 3 * p + 1 + (0 === u) >> 8 & 255, m.push(a), m.push(l), m.push(255 & ~a), m.push(255 & ~l), 0 === u && m.push(0), c = 0; c < p; c++)
//                 for (o = 0; o < 3; o++) r = (r + (i = (i + (a = 255 < (a = t[o][u][c]) ? 255 : a < 0 ? 0 : Math.round(a))) % 65521)) % 65521, m.push(a);
//             m.push(0)
//         }
//         return h = (r << 16) + i, m.push(h >> 24 & 255), m.push(h >> 16 & 255), m.push(h >> 8 & 255), m.push(255 & h), s = m.length - 41, m[33] = s >> 24 & 255, m[34] = s >> 16 & 255, m[35] = s >> 8 & 255, m[36] = 255 & s, d = n(m, 37), m.push(d >> 24 & 255), m.push(d >> 16 & 255), m.push(d >> 8 & 255), m.push(255 & d), m.push(0), m.push(0), m.push(0), m.push(0), m.push(73), m.push(69), m.push(78), m.push(68), m.push(174), m.push(66), m.push(96), m.push(130), "data:image/png;base64," + e(m)
//     }, numeric._dim = function(t) {
//         for (var e = [];
//             "object" == typeof t;) e.push(t.length), t = t[0];
//         return e
//     }, numeric.dim = function(t) {
//         var e;
//         return "object" == typeof t ? "object" == typeof(e = t[0]) ? "object" == typeof e[0] ? numeric._dim(t) : [t.length, e.length] : [t.length] : []
//     }, numeric.mapreduce = function(t, e) {
//         return Function("x", "accum", "_s", "_k", 'if(typeof accum === "undefined") accum = ' + e + ';\nif(typeof x === "number") { var xi = x; ' + t + '; return accum; }\nif(typeof _s === "undefined") _s = numeric.dim(x);\nif(typeof _k === "undefined") _k = 0;\nvar _n = _s[_k];\nvar i,xi;\nif(_k < _s.length-1) {\n    for(i=_n-1;i>=0;i--) {\n        accum = arguments.callee(x[i],accum,_s,_k+1);\n    }    return accum;\n}\nfor(i=_n-1;i>=1;i-=2) { \n    xi = x[i];\n    ' + t + ";\n    xi = x[i-1];\n    " + t + ";\n}\nif(i === 0) {\n    xi = x[i];\n    " + t + "\n}\nreturn accum;")
//     }, numeric.mapreduce2 = function(t, e) {
//         return Function("x", "var n = x.length;\nvar i,xi;\n" + e + ";\nfor(i=n-1;i!==-1;--i) { \n    xi = x[i];\n    " + t + ";\n}\nreturn accum;")
//     }, numeric.same = function same(t, e) {
//         var n, i;
//         if (t instanceof Array && e instanceof Array) {
//             if ((i = t.length) !== e.length) return !1;
//             for (n = 0; n < i; n++)
//                 if (t[n] !== e[n]) {
//                     if ("object" != typeof t[n]) return !1;
//                     if (!same(t[n], e[n])) return !1
//                 } return !0
//         }
//         return !1
//     }, numeric.rep = function(t, e, n) {
//         void 0 === n && (n = 0);
//         var i, r = t[n],
//             o = Array(r);
//         if (n === t.length - 1) {
//             for (i = r - 2; 0 <= i; i -= 2) o[i + 1] = e, o[i] = e;
//             return -1 === i && (o[0] = e), o
//         }
//         for (i = r - 1; 0 <= i; i--) o[i] = numeric.rep(t, e, n + 1);
//         return o
//     }, numeric.dotMMsmall = function(t, e) {
//         var n, i, r, o, s, a, l, u, c, h, d;
//         for (o = t.length, s = e.length, a = e[0].length, l = Array(o), n = o - 1; 0 <= n; n--) {
//             for (u = Array(a), c = t[n], r = a - 1; 0 <= r; r--) {
//                 for (h = c[s - 1] * e[s - 1][r], i = s - 2; 1 <= i; i -= 2) d = i - 1, h += c[i] * e[i][r] + c[d] * e[d][r];
//                 0 === i && (h += c[0] * e[0][r]), u[r] = h
//             }
//             l[n] = u
//         }
//         return l
//     }, numeric._getCol = function(t, e, n) {
//         var i;
//         for (i = t.length - 1; 0 < i; --i) n[i] = t[i][e], n[--i] = t[i][e];
//         0 === i && (n[0] = t[0][e])
//     }, numeric.dotMMbig = function(t, e) {
//         var n, i, r, o = numeric._getCol,
//             s = e.length,
//             a = Array(s),
//             l = t.length,
//             u = e[0].length,
//             c = new Array(l),
//             h = numeric.dotVV;
//         for (--s, i = --l; - 1 !== i; --i) c[i] = Array(u);
//         for (i = --u; - 1 !== i; --i)
//             for (o(e, i, a), r = l; - 1 !== r; --r) 0, n = t[r], c[r][i] = h(n, a);
//         return c
//     }, numeric.dotMV = function(t, e) {
//         var n, i = t.length,
//             r = (e.length, Array(i)),
//             o = numeric.dotVV;
//         for (n = i - 1; 0 <= n; n--) r[n] = o(t[n], e);
//         return r
//     }, numeric.dotVM = function(t, e) {
//         var n, i, r, o, s, a, l;
//         for (r = t.length, o = e[0].length, s = Array(o), i = o - 1; 0 <= i; i--) {
//             for (a = t[r - 1] * e[r - 1][i], n = r - 2; 1 <= n; n -= 2) l = n - 1, a += t[n] * e[n][i] + t[l] * e[l][i];
//             0 === n && (a += t[0] * e[0][i]), s[i] = a
//         }
//         return s
//     }, numeric.dotVV = function(t, e) {
//         var n, i, r = t.length,
//             o = t[r - 1] * e[r - 1];
//         for (n = r - 2; 1 <= n; n -= 2) i = n - 1, o += t[n] * e[n] + t[i] * e[i];
//         return 0 === n && (o += t[0] * e[0]), o
//     }, numeric.dot = function(t, e) {
//         var n = numeric.dim;
//         switch (1e3 * n(t).length + n(e).length) {
//             case 2002:
//                 return e.length < 10 ? numeric.dotMMsmall(t, e) : numeric.dotMMbig(t, e);
//             case 2001:
//                 return numeric.dotMV(t, e);
//             case 1002:
//                 return numeric.dotVM(t, e);
//             case 1001:
//                 return numeric.dotVV(t, e);
//             case 1e3:
//                 return numeric.mulVS(t, e);
//             case 1:
//                 return numeric.mulSV(t, e);
//             case 0:
//                 return t * e;
//             default:
//                 throw new Error("numeric.dot only works on vectors and matrices")
//         }
//     }, numeric.diag = function(t) {
//         var e, n, i, r, o = t.length,
//             s = Array(o);
//         for (e = o - 1; 0 <= e; e--) {
//             for (r = Array(o), n = e + 2, i = o - 1; n <= i; i -= 2) r[i] = 0, r[i - 1] = 0;
//             for (e < i && (r[i] = 0), r[e] = t[e], i = e - 1; 1 <= i; i -= 2) r[i] = 0, r[i - 1] = 0;
//             0 === i && (r[0] = 0), s[e] = r
//         }
//         return s
//     }, numeric.getDiag = function(t) {
//         var e, n = Math.min(t.length, t[0].length),
//             i = Array(n);
//         for (e = n - 1; 1 <= e; --e) i[e] = t[e][e], i[--e] = t[e][e];
//         return 0 === e && (i[0] = t[0][0]), i
//     }, numeric.identity = function(t) {
//         return numeric.diag(numeric.rep([t], 1))
//     }, numeric.pointwise = function(t, e, n) {
//         void 0 === n && (n = "");
//         var i, r, o = [],
//             s = /\[i\]$/,
//             a = "",
//             l = !1;
//         for (i = 0; i < t.length; i++) s.test(t[i]) ? a = r = t[i].substring(0, t[i].length - 3) : r = t[i], "ret" === r && (l = !0), o.push(r);
//         return o[t.length] = "_s", o[t.length + 1] = "_k", o[t.length + 2] = 'if(typeof _s === "undefined") _s = numeric.dim(' + a + ');\nif(typeof _k === "undefined") _k = 0;\nvar _n = _s[_k];\nvar i' + (l ? "" : ", ret = Array(_n)") + ";\nif(_k < _s.length-1) {\n    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(" + t.join(",") + ",_s,_k+1);\n    return ret;\n}\n" + n + "\nfor(i=_n-1;i!==-1;--i) {\n    " + e + "\n}\nreturn ret;", Function.apply(null, o)
//     }, numeric.pointwise2 = function(t, e, n) {
//         void 0 === n && (n = "");
//         var i, r, o = [],
//             s = /\[i\]$/,
//             a = "",
//             l = !1;
//         for (i = 0; i < t.length; i++) s.test(t[i]) ? a = r = t[i].substring(0, t[i].length - 3) : r = t[i], "ret" === r && (l = !0), o.push(r);
//         return o[t.length] = "var _n = " + a + ".length;\nvar i" + (l ? "" : ", ret = Array(_n)") + ";\n" + n + "\nfor(i=_n-1;i!==-1;--i) {\n" + e + "\n}\nreturn ret;", Function.apply(null, o)
//     }, numeric._biforeach = function _biforeach(t, e, n, i, r) {
//         var o;
//         if (i !== n.length - 1)
//             for (o = n[i] - 1; 0 <= o; o--) _biforeach("object" == typeof t ? t[o] : t, "object" == typeof e ? e[o] : e, n, i + 1, r);
//         else r(t, e)
//     }, numeric._biforeach2 = function _biforeach2(t, e, n, i, r) {
//         if (i === n.length - 1) return r(t, e);
//         var o, s = n[i],
//             a = Array(s);
//         for (o = s - 1; 0 <= o; --o) a[o] = _biforeach2("object" == typeof t ? t[o] : t, "object" == typeof e ? e[o] : e, n, i + 1, r);
//         return a
//     }, numeric._foreach = function _foreach(t, e, n, i) {
//         var r;
//         if (n !== e.length - 1)
//             for (r = e[n] - 1; 0 <= r; r--) _foreach(t[r], e, n + 1, i);
//         else i(t)
//     }, numeric._foreach2 = function _foreach2(t, e, n, i) {
//         if (n === e.length - 1) return i(t);
//         var r, o = e[n],
//             s = Array(o);
//         for (r = o - 1; 0 <= r; r--) s[r] = _foreach2(t[r], e, n + 1, i);
//         return s
//     }, numeric.ops2 = {
//         add: "+",
//         sub: "-",
//         mul: "*",
//         div: "/",
//         mod: "%",
//         and: "&&",
//         or: "||",
//         eq: "===",
//         neq: "!==",
//         lt: "<",
//         gt: ">",
//         leq: "<=",
//         geq: ">=",
//         band: "&",
//         bor: "|",
//         bxor: "^",
//         lshift: "<<",
//         rshift: ">>",
//         rrshift: ">>>"
//     }, numeric.opseq = {
//         addeq: "+=",
//         subeq: "-=",
//         muleq: "*=",
//         diveq: "/=",
//         modeq: "%=",
//         lshifteq: "<<=",
//         rshifteq: ">>=",
//         rrshifteq: ">>>=",
//         bandeq: "&=",
//         boreq: "|=",
//         bxoreq: "^="
//     }, numeric.mathfuns = ["abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan", "isNaN", "isFinite"], numeric.mathfuns2 = ["atan2", "pow", "max", "min"], numeric.ops1 = {
//         neg: "-",
//         not: "!",
//         bnot: "~",
//         clone: ""
//     }, numeric.mapreducers = {
//         any: ["if(xi) return true;", "var accum = false;"],
//         all: ["if(!xi) return false;", "var accum = true;"],
//         sum: ["accum += xi;", "var accum = 0;"],
//         prod: ["accum *= xi;", "var accum = 1;"],
//         norm2Squared: ["accum += xi*xi;", "var accum = 0;"],
//         norminf: ["accum = max(accum,abs(xi));", "var accum = 0, max = Math.max, abs = Math.abs;"],
//         norm1: ["accum += abs(xi)", "var accum = 0, abs = Math.abs;"],
//         sup: ["accum = max(accum,xi);", "var accum = -Infinity, max = Math.max;"],
//         inf: ["accum = min(accum,xi);", "var accum = Infinity, min = Math.min;"]
//     },
//     function() {
//         var t, i;
//         for (t = 0; t < numeric.mathfuns2.length; ++t) i = numeric.mathfuns2[t], numeric.ops2[i] = i;
//         for (t in numeric.ops2)
//             if (numeric.ops2.hasOwnProperty(t)) {
//                 i = numeric.ops2[t];
//                 var e, n, r = ""; - 1 !== numeric.myIndexOf.call(numeric.mathfuns2, t) ? (r = "var " + i + " = Math." + i + ";\n", e = function(t, e, n) {
//                     return t + " = " + i + "(" + e + "," + n + ")"
//                 }, n = function(t, e) {
//                     return t + " = " + i + "(" + t + "," + e + ")"
//                 }) : (e = function(t, e, n) {
//                     return t + " = " + e + " " + i + " " + n
//                 }, n = numeric.opseq.hasOwnProperty(t + "eq") ? function(t, e) {
//                     return t + " " + i + "= " + e
//                 } : function(t, e) {
//                     return t + " = " + t + " " + i + " " + e
//                 }), numeric[t + "VV"] = numeric.pointwise2(["x[i]", "y[i]"],
//                     e("ret[i]", "x[i]", "y[i]"), r), numeric[t + "SV"] = numeric.pointwise2(["x", "y[i]"], e("ret[i]", "x", "y[i]"), r), numeric[t + "VS"] = numeric.pointwise2(["x[i]", "y"], e("ret[i]", "x[i]", "y"), r), numeric[t] = Function("var n = arguments.length, i, x = arguments[0], y;\nvar VV = numeric." + t + "VV, VS = numeric." + t + "VS, SV = numeric." + t + 'SV;\nvar dim = numeric.dim;\nfor(i=1;i!==n;++i) { \n  y = arguments[i];\n  if(typeof x === "object") {\n      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n  else ' + n("x", "y") + "\n}\nreturn x;\n"), numeric[i] = numeric[t], numeric[t + "eqV"] = numeric.pointwise2(["ret[i]", "x[i]"], n("ret[i]", "x[i]"), r), numeric[t + "eqS"] = numeric.pointwise2(["ret[i]", "x"], n("ret[i]", "x"), r), numeric[t + "eq"] = Function("var n = arguments.length, i, x = arguments[0], y;\nvar V = numeric." + t + "eqV, S = numeric." + t + 'eqS\nvar s = numeric.dim(x);\nfor(i=1;i!==n;++i) { \n  y = arguments[i];\n  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n  else numeric._biforeach(x,y,s,0,S);\n}\nreturn x;\n')
//             } for (t = 0; t < numeric.mathfuns2.length; ++t) i = numeric.mathfuns2[t], delete numeric.ops2[i];
//         for (t = 0; t < numeric.mathfuns.length; ++t) i = numeric.mathfuns[t], numeric.ops1[i] = i;
//         for (t in numeric.ops1) numeric.ops1.hasOwnProperty(t) && (r = "", i = numeric.ops1[t], -1 !== numeric.myIndexOf.call(numeric.mathfuns, t) && Math.hasOwnProperty(i) && (r = "var " + i + " = Math." + i + ";\n"), numeric[t + "eqV"] = numeric.pointwise2(["ret[i]"], "ret[i] = " + i + "(ret[i]);", r), numeric[t + "eq"] = Function("x", 'if(typeof x !== "object") return ' + i + "x\nvar i;\nvar V = numeric." + t + "eqV;\nvar s = numeric.dim(x);\nnumeric._foreach(x,s,0,V);\nreturn x;\n"), numeric[t + "V"] = numeric.pointwise2(["x[i]"], "ret[i] = " + i + "(x[i]);", r), numeric[t] = Function("x", 'if(typeof x !== "object") return ' + i + "(x)\nvar i;\nvar V = numeric." + t + "V;\nvar s = numeric.dim(x);\nreturn numeric._foreach2(x,s,0,V);\n"));
//         for (t = 0; t < numeric.mathfuns.length; ++t) i = numeric.mathfuns[t], delete numeric.ops1[i];
//         for (t in numeric.mapreducers) numeric.mapreducers.hasOwnProperty(t) && (i = numeric.mapreducers[t], numeric[t + "V"] = numeric.mapreduce2(i[0], i[1]), numeric[t] = Function("x", "s", "k", i[1] + 'if(typeof x !== "object") {    xi = x;\n' + i[0] + ';\n    return accum;\n}if(typeof s === "undefined") s = numeric.dim(x);\nif(typeof k === "undefined") k = 0;\nif(k === s.length-1) return numeric.' + t + "V(x);\nvar xi;\nvar n = x.length, i;\nfor(i=n-1;i!==-1;--i) {\n   xi = arguments.callee(x[i]);\n" + i[0] + ";\n}\nreturn accum;\n"))
//     }(), numeric.truncVV = numeric.pointwise(["x[i]", "y[i]"], "ret[i] = round(x[i]/y[i])*y[i];", "var round = Math.round;"), numeric.truncVS = numeric.pointwise(["x[i]", "y"], "ret[i] = round(x[i]/y)*y;", "var round = Math.round;"), numeric.truncSV = numeric.pointwise(["x", "y[i]"], "ret[i] = round(x/y[i])*y[i];", "var round = Math.round;"), numeric.trunc = function(t, e) {
//         return "object" == typeof t ? "object" == typeof e ? numeric.truncVV(t, e) : numeric.truncVS(t, e) : "object" == typeof e ? numeric.truncSV(t, e) : Math.round(t / e) * e
//     }, numeric.inv = function(t) {
//         var e, n, i, r, o, s, a, l = numeric.dim(t),
//             u = Math.abs,
//             c = l[0],
//             h = l[1],
//             d = numeric.clone(t),
//             f = numeric.identity(c);
//         for (s = 0; s < h; ++s) {
//             var p = -1,
//                 m = -1;
//             for (o = s; o !== c; ++o) m < (a = u(d[o][s])) && (p = o, m = a);
//             for (n = d[p], d[p] = d[s], d[s] = n, r = f[p], f[p] = f[s], f[s] = r, t = n[s], a = s; a !== h; ++a) n[a] /= t;
//             for (a = h - 1; - 1 !== a; --a) r[a] /= t;
//             for (o = c - 1; - 1 !== o; --o)
//                 if (o !== s) {
//                     for (e = d[o], i = f[o], t = e[s], a = s + 1; a !== h; ++a) e[a] -= n[a] * t;
//                     for (a = h - 1; 0 < a; --a) i[a] -= r[a] * t, i[--a] -= r[a] * t;
//                     0 === a && (i[0] -= r[0] * t)
//                 }
//         }
//         return f
//     }, numeric.det = function(t) {
//         var e = numeric.dim(t);
//         if (2 !== e.length || e[0] !== e[1]) throw new Error("numeric: det() only works on square matrices");
//         var n, i, r, o, s, a, l, u, c = e[0],
//             h = 1,
//             d = numeric.clone(t);
//         for (i = 0; i < c - 1; i++) {
//             for (n = (r = i) + 1; n < c; n++) Math.abs(d[n][i]) > Math.abs(d[r][i]) && (r = n);
//             for (r !== i && (l = d[r], d[r] = d[i], d[i] = l, h *= -1), o = d[i], n = i + 1; n < c; n++) {
//                 for (a = (s = d[n])[i] / o[i], r = i + 1; r < c - 1; r += 2) u = r + 1, s[r] -= o[r] * a, s[u] -= o[u] * a;
//                 r !== c && (s[r] -= o[r] * a)
//             }
//             if (0 === o[i]) return 0;
//             h *= o[i]
//         }
//         return h * d[i][i]
//     }, numeric.transpose = function(t) {
//         var e, n, i, r, o, s = t.length,
//             a = t[0].length,
//             l = Array(a);
//         for (n = 0; n < a; n++) l[n] = Array(s);
//         for (e = s - 1; 1 <= e; e -= 2) {
//             for (r = t[e], i = t[e - 1], n = a - 1; 1 <= n; --n)(o = l[n])[e] = r[n], o[e - 1] = i[n], (o = l[--n])[e] = r[n], o[e - 1] = i[n];
//             0 === n && ((o = l[0])[e] = r[0], o[e - 1] = i[0])
//         }
//         if (0 === e) {
//             for (i = t[0], n = a - 1; 1 <= n; --n) l[n][0] = i[n], l[--n][0] = i[n];
//             0 === n && (l[0][0] = i[0])
//         }
//         return l
//     }, numeric.negtranspose = function(t) {
//         var e, n, i, r, o, s = t.length,
//             a = t[0].length,
//             l = Array(a);
//         for (n = 0; n < a; n++) l[n] = Array(s);
//         for (e = s - 1; 1 <= e; e -= 2) {
//             for (r = t[e], i = t[e - 1], n = a - 1; 1 <= n; --n)(o = l[n])[e] = -r[n], o[e - 1] = -i[n], (o = l[--n])[e] = -r[n], o[e - 1] = -i[n];
//             0 === n && ((o = l[0])[e] = -r[0], o[e - 1] = -i[0])
//         }
//         if (0 === e) {
//             for (i = t[0], n = a - 1; 1 <= n; --n) l[n][0] = -i[n], l[--n][0] = -i[n];
//             0 === n && (l[0][0] = -i[0])
//         }
//         return l
//     }, numeric._random = function _random(t, e) {
//         var n, i, r = t[e],
//             o = Array(r);
//         if (e === t.length - 1) {
//             for (i = Math.random, n = r - 1; 1 <= n; n -= 2) o[n] = i(), o[n - 1] = i();
//             return 0 === n && (o[0] = i()), o
//         }
//         for (n = r - 1; 0 <= n; n--) o[n] = _random(t, e + 1);
//         return o
//     }, numeric.random = function(t) {
//         return numeric._random(t, 0)
//     }, numeric.norm2 = function(t) {
//         return Math.sqrt(numeric.norm2Squared(t))
//     }, numeric.linspace = function(t, e, n) {
//         if (void 0 === n && (n = Math.max(Math.round(e - t) + 1, 1)), n < 2) return 1 === n ? [t] : [];
//         var i, r = Array(n);
//         for (i = --n; 0 <= i; i--) r[i] = (i * e + (n - i) * t) / n;
//         return r
//     }, numeric.getBlock = function(t, s, a) {
//         function l(t, e) {
//             var n, i = s[e],
//                 r = a[e] - i,
//                 o = Array(r);
//             if (e === u.length - 1) {
//                 for (n = r; 0 <= n; n--) o[n] = t[n + i];
//                 return o
//             }
//             for (n = r; 0 <= n; n--) o[n] = l(t[n + i], e + 1);
//             return o
//         }
//         var u = numeric.dim(t);
//         return l(t, 0)
//     }, numeric.setBlock = function(t, s, a, e) {
//         function l(t, e, n) {
//             var i, r = s[n],
//                 o = a[n] - r;
//             if (n === u.length - 1)
//                 for (i = o; 0 <= i; i--) t[i + r] = e[i];
//             for (i = o; 0 <= i; i--) l(t[i + r], e[i], n + 1)
//         }
//         var u = numeric.dim(t);
//         return l(t, e, 0), t
//     }, numeric.getRange = function(t, e, n) {
//         var i, r, o, s, a = e.length,
//             l = n.length,
//             u = Array(a);
//         for (i = a - 1; - 1 !== i; --i)
//             for (u[i] = Array(l), o = u[i], s = t[e[i]], r = l - 1; - 1 !== r; --r) o[r] = s[n[r]];
//         return u
//     }, numeric.blockMatrix = function(t) {
//         var e = numeric.dim(t);
//         if (e.length < 4) return numeric.blockMatrix([t]);
//         var n, i, r, o, s, a = e[0],
//             l = e[1];
//         for (r = i = n = 0; r < a; ++r) n += t[r][0].length;
//         for (o = 0; o < l; ++o) i += t[0][o][0].length;
//         var u = Array(n);
//         for (r = 0; r < n; ++r) u[r] = Array(i);
//         var c, h, d, f, p, m = 0;
//         for (r = 0; r < a; ++r) {
//             for (c = i, o = l - 1; - 1 !== o; --o)
//                 for (c -= (s = t[r][o])[0].length, d = s.length - 1; - 1 !== d; --d)
//                     for (p = s[d], h = u[m + d], f = p.length - 1; - 1 !== f; --f) h[c + f] = p[f];
//             m += t[r][0].length
//         }
//         return u
//     }, numeric.tensor = function(t, e) {
//         if ("number" == typeof t || "number" == typeof e) return numeric.mul(t, e);
//         var n = numeric.dim(t),
//             i = numeric.dim(e);
//         if (1 !== n.length || 1 !== i.length) throw new Error("numeric: tensor product is only defined for vectors");
//         var r, o, s, a, l = n[0],
//             u = i[0],
//             c = Array(l);
//         for (o = l - 1; 0 <= o; o--) {
//             for (r = Array(u), a = t[o], s = u - 1; 3 <= s; --s) r[s] = a * e[s], r[--s] = a * e[s], r[--s] = a * e[s], r[--s] = a * e[s];
//             for (; 0 <= s;) r[s] = a * e[s], --s;
//             c[o] = r
//         }
//         return c
//     }, numeric.T = function(t, e) {
//         this.x = t, this.y = e
//     }, numeric.t = function(t, e) {
//         return new numeric.T(t, e)
//     }, numeric.Tbinop = function(t, e, n, i, r) {
//         var o;
//         numeric.indexOf;
//         if ("string" != typeof r)
//             for (o in r = "", numeric) numeric.hasOwnProperty(o) && (0 <= t.indexOf(o) || 0 <= e.indexOf(o) || 0 <= n.indexOf(o) || 0 <= i.indexOf(o)) && 1 < o.length && (r += "var " + o + " = numeric." + o + ";\n");
//         return Function(["y"], "var x = this;\nif(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n" + r + "\nif(x.y) {  if(y.y) {    return new numeric.T(" + i + ");\n  }\n  return new numeric.T(" + n + ");\n}\nif(y.y) {\n  return new numeric.T(" + e + ");\n}\nreturn new numeric.T(" + t + ");\n")
//     }, numeric.T.prototype.add = numeric.Tbinop("add(x.x,y.x)", "add(x.x,y.x),y.y", "add(x.x,y.x),x.y", "add(x.x,y.x),add(x.y,y.y)"), numeric.T.prototype.sub = numeric.Tbinop("sub(x.x,y.x)", "sub(x.x,y.x),neg(y.y)", "sub(x.x,y.x),x.y", "sub(x.x,y.x),sub(x.y,y.y)"), numeric.T.prototype.mul = numeric.Tbinop("mul(x.x,y.x)", "mul(x.x,y.x),mul(x.x,y.y)", "mul(x.x,y.x),mul(x.y,y.x)", "sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))"), numeric.T.prototype.reciprocal = function() {
//         var t = numeric.mul,
//             e = numeric.div;
//         if (this.y) {
//             var n = numeric.add(t(this.x, this.x), t(this.y, this.y));
//             return new numeric.T(e(this.x, n), e(numeric.neg(this.y), n))
//         }
//         return new T(e(1, this.x))
//     }, numeric.T.prototype.div = function t(e) {
//         if (e instanceof numeric.T || (e = new numeric.T(e)), e.y) return this.mul(e.reciprocal());
//         var t = numeric.div;
//         return this.y ? new numeric.T(t(this.x, e.x), t(this.y, e.x)) : new numeric.T(t(this.x, e.x))
//     }, numeric.T.prototype.dot = numeric.Tbinop("dot(x.x,y.x)", "dot(x.x,y.x),dot(x.x,y.y)", "dot(x.x,y.x),dot(x.y,y.x)", "sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))"), numeric.T.prototype.transpose = function() {
//         var t = numeric.transpose,
//             e = this.x,
//             n = this.y;
//         return n ? new numeric.T(t(e), t(n)) : new numeric.T(t(e))
//     }, numeric.T.prototype.transjugate = function() {
//         var t = numeric.transpose,
//             e = this.x,
//             n = this.y;
//         return n ? new numeric.T(t(e), numeric.negtranspose(n)) : new numeric.T(t(e))
//     }, numeric.Tunop = function(t, e, n) {
//         return "string" != typeof n && (n = ""), Function("var x = this;\n" + n + "\nif(x.y) {  " + e + ";\n}\n" + t + ";\n")
//     }, numeric.T.prototype.exp = numeric.Tunop("return new numeric.T(ex)", "return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))", "var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;"), numeric.T.prototype.conj = numeric.Tunop("return new numeric.T(x.x);", "return new numeric.T(x.x,numeric.neg(x.y));"), numeric.T.prototype.neg = numeric.Tunop("return new numeric.T(neg(x.x));", "return new numeric.T(neg(x.x),neg(x.y));", "var neg = numeric.neg;"), numeric.T.prototype.sin = numeric.Tunop("return new numeric.T(numeric.sin(x.x))", "return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));"), numeric.T.prototype.cos = numeric.Tunop("return new numeric.T(numeric.cos(x.x))", "return x.exp().add(x.neg().exp()).div(2);"), numeric.T.prototype.abs = numeric.Tunop("return new numeric.T(numeric.abs(x.x));", "return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));", "var mul = numeric.mul;"), numeric.T.prototype.log = numeric.Tunop("return new numeric.T(numeric.log(x.x));", "var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\nreturn new numeric.T(numeric.log(r.x),theta.x);"), numeric.T.prototype.norm2 = numeric.Tunop("return numeric.norm2(x.x);", "var f = numeric.norm2Squared;\nreturn Math.sqrt(f(x.x)+f(x.y));"), numeric.T.prototype.inv = function() {
//         var t = this;
//         if ("undefined" == typeof t.y) return new numeric.T(numeric.inv(t.x));
//         var e, n, i, r, o, s, a, l, u, c, h, d, f, p, m, g, v, y, b = t.x.length,
//             w = numeric.identity(b),
//             x = numeric.rep([b, b], 0),
//             k = numeric.clone(t.x),
//             _ = numeric.clone(t.y);
//         for (u = 0; u < b; u++) {
//             for (d = (p = k[u][u]) * p + (m = _[u][u]) * m, c = (h = u) + 1; c < b; c++) d < (f = (p = k[c][u]) * p + (m = _[c][u]) * m) && (h = c, d = f);
//             for (h !== u && (y = k[u], k[u] = k[h], k[h] = y, y = _[u], _[u] = _[h], _[h] = y, y = w[u], w[u] = w[h], w[h] = y, y = x[u], x[u] = x[h], x[h] = y), e = k[u], n = _[u], o = w[u], s = x[u], p = e[u], m = n[u], c = u + 1; c < b; c++) g = e[c], v = n[c], e[c] = (g * p + v * m) / d, n[c] = (v * p - g * m) / d;
//             for (c = 0; c < b; c++) g = o[c], v = s[c], o[c] = (g * p + v * m) / d, s[c] = (v * p - g * m) / d;
//             for (c = u + 1; c < b; c++) {
//                 for (i = k[c], r = _[c], a = w[c], l = x[c], p = i[u], m = r[u], h = u + 1; h < b; h++) g = e[h], v = n[h], i[h] -= g * p - v * m, r[h] -= v * p + g * m;
//                 for (h = 0; h < b; h++) g = o[h], v = s[h], a[h] -= g * p - v * m, l[h] -= v * p + g * m
//             }
//         }
//         for (u = b - 1; 0 < u; u--)
//             for (o = w[u], s = x[u], c = u - 1; 0 <= c; c--)
//                 for (a = w[c], l = x[c], p = k[c][u], m = _[c][u], h = b - 1; 0 <= h; h--) g = o[h], v = s[h], a[h] -= p * g - m * v, l[h] -= p * v + m * g;
//         return new numeric.T(w, x)
//     }, numeric.T.prototype.get = function(t) {
//         var e, n = this.x,
//             i = this.y,
//             r = 0,
//             o = t.length;
//         if (i) {
//             for (; r < o;) n = n[e = t[r]], i = i[e], r++;
//             return new numeric.T(n, i)
//         }
//         for (; r < o;) n = n[e = t[r]], r++;
//         return new numeric.T(n)
//     }, numeric.T.prototype.set = function(t, e) {
//         var n, i = this.x,
//             r = this.y,
//             o = 0,
//             s = t.length,
//             a = e.x,
//             l = e.y;
//         if (0 === s) return l ? this.y = l : r && (this.y = undefined), this.x = i, this;
//         if (l) {
//             for (r || (r = numeric.rep(numeric.dim(i), 0), this.y = r); o < s - 1;) i = i[n = t[o]], r = r[n], o++;
//             return i[n = t[o]] = a, r[n] = l, this
//         }
//         if (r) {
//             for (; o < s - 1;) i = i[n = t[o]], r = r[n], o++;
//             return (i[n = t[o]] = a) instanceof Array ? r[n] = numeric.rep(numeric.dim(a), 0) : r[n] = 0, this
//         }
//         for (; o < s - 1;) i = i[n = t[o]], o++;
//         return i[n = t[o]] = a, this
//     }, numeric.T.prototype.getRows = function(t, e) {
//         var n, i, r = e - t + 1,
//             o = Array(r),
//             s = this.x,
//             a = this.y;
//         for (n = t; n <= e; n++) o[n - t] = s[n];
//         if (a) {
//             for (i = Array(r), n = t; n <= e; n++) i[n - t] = a[n];
//             return new numeric.T(o, i)
//         }
//         return new numeric.T(o)
//     }, numeric.T.prototype.setRows = function(t, e, n) {
//         var i, r = this.x,
//             o = this.y,
//             s = n.x,
//             a = n.y;
//         for (i = t; i <= e; i++) r[i] = s[i - t];
//         if (a)
//             for (o || (o = numeric.rep(numeric.dim(r), 0), this.y = o), i = t; i <= e; i++) o[i] = a[i - t];
//         else if (o)
//             for (i = t; i <= e; i++) o[i] = numeric.rep([s[i - t].length], 0);
//         return this
//     }, numeric.T.prototype.getRow = function(t) {
//         var e = this.x,
//             n = this.y;
//         return n ? new numeric.T(e[t], n[t]) : new numeric.T(e[t])
//     }, numeric.T.prototype.setRow = function(t, e) {
//         var n = this.x,
//             i = this.y,
//             r = e.x,
//             o = e.y;
//         return n[t] = r, o ? (i || (i = numeric.rep(numeric.dim(n), 0), this.y = i), i[t] = o) : i && (i = numeric.rep([r.length], 0)), this
//     }, numeric.T.prototype.getBlock = function(t, e) {
//         var n = this.x,
//             i = this.y,
//             r = numeric.getBlock;
//         return i ? new numeric.T(r(n, t, e), r(i, t, e)) : new numeric.T(r(n, t, e))
//     }, numeric.T.prototype.setBlock = function(t, e, n) {
//         n instanceof numeric.T || (n = new numeric.T(n));
//         var i = this.x,
//             r = this.y,
//             o = numeric.setBlock,
//             s = n.x,
//             a = n.y;
//         if (a) return r || (this.y = numeric.rep(numeric.dim(this), 0), r = this.y), o(i, t, e, s), o(r, t, e, a), this;
//         o(i, t, e, s), r && o(r, t, e, numeric.rep(numeric.dim(s), 0))
//     }, numeric.T.rep = function(t, e) {
//         var n = numeric.T;
//         e instanceof n || (e = new n(e));
//         var i = e.x,
//             r = e.y,
//             o = numeric.rep;
//         return r ? new n(o(t, i), o(t, r)) : new n(o(t, i))
//     }, numeric.T.diag = function t(e) {
//         e instanceof numeric.T || (e = new numeric.T(e));
//         var n = e.x,
//             i = e.y,
//             t = numeric.diag;
//         return i ? new numeric.T(t(n), t(i)) : new numeric.T(t(n))
//     }, numeric.T.eig = function() {
//         if (this.y) throw new Error("eig: not implemented for complex matrices.");
//         return numeric.eig(this.x)
//     }, numeric.T.identity = function(t) {
//         return new numeric.T(numeric.identity(t))
//     }, numeric.T.prototype.getDiag = function() {
//         var t = numeric,
//             e = this.x,
//             n = this.y;
//         return n ? new t.T(t.getDiag(e), t.getDiag(n)) : new t.T(t.getDiag(e))
//     }, numeric.house = function(t) {
//         var e = numeric.clone(t),
//             n = (0 <= t[0] ? 1 : -1) * numeric.norm2(t);
//         e[0] += n;
//         var i = numeric.norm2(e);
//         if (0 === i) throw new Error("eig: internal error");
//         return numeric.div(e, i)
//     }, numeric.toUpperHessenberg = function(t) {
//         var e = numeric.dim(t);
//         if (2 !== e.length || e[0] !== e[1]) throw new Error("numeric: toUpperHessenberg() only works on square matrices");
//         var n, i, r, o, s, a, l, u, c, h, d = e[0],
//             f = numeric.clone(t),
//             p = numeric.identity(d);
//         for (i = 0; i < d - 2; i++) {
//             for (o = Array(d - i - 1), n = i + 1; n < d; n++) o[n - i - 1] = f[n][i];
//             if (0 < numeric.norm2(o)) {
//                 for (s = numeric.house(o), a = numeric.getBlock(f, [i + 1, i], [d - 1, d - 1]), l = numeric.tensor(s, numeric.dot(s, a)), n = i + 1; n < d; n++)
//                     for (u = f[n], c = l[n - i - 1], r = i; r < d; r++) u[r] -= 2 * c[r - i];
//                 for (a = numeric.getBlock(f, [0, i + 1], [d - 1, d - 1]), l = numeric.tensor(numeric.dot(a, s), s), n = 0; n < d; n++)
//                     for (u = f[n], c = l[n], r = i + 1; r < d; r++) u[r] -= 2 * c[r - i - 1];
//                 for (a = Array(d - i - 1), n = i + 1; n < d; n++) a[n - i - 1] = p[n];
//                 for (l = numeric.tensor(s, numeric.dot(s, a)), n = i + 1; n < d; n++)
//                     for (h = p[n], c = l[n - i - 1], r = 0; r < d; r++) h[r] -= 2 * c[r]
//             }
//         }
//         return {
//             H: f,
//             Q: p
//         }
//     }, numeric.epsilon = 2220446049250313e-31, numeric.QRFrancis = function(t, e) {
//         void 0 === e && (e = 1e4), t = numeric.clone(t);
//         numeric.clone(t);
//         var n, i, r, o, s, a, l, u, c, h, d, f, p, m, g, v, y, b, w = numeric.dim(t)[0],
//             x = numeric.identity(w);
//         if (w < 3) return {
//             Q: x,
//             B: [
//                 [0, w - 1]
//             ]
//         };
//         var k = numeric.epsilon;
//         for (b = 0; b < e; b++) {
//             for (v = 0; v < w - 1; v++)
//                 if (Math.abs(t[v + 1][v]) < k * (Math.abs(t[v][v]) + Math.abs(t[v + 1][v + 1]))) {
//                     var _ = numeric.QRFrancis(numeric.getBlock(t, [0, 0], [v, v]), e),
//                         E = numeric.QRFrancis(numeric.getBlock(t, [v + 1, v + 1], [w - 1, w - 1]), e);
//                     for (f = Array(v + 1), g = 0; g <= v; g++) f[g] = x[g];
//                     for (p = numeric.dot(_.Q, f), g = 0; g <= v; g++) x[g] = p[g];
//                     for (f = Array(w - v - 1), g = v + 1; g < w; g++) f[g - v - 1] = x[g];
//                     for (p = numeric.dot(E.Q, f), g = v + 1; g < w; g++) x[g] = p[g - v - 1];
//                     return {
//                         Q: x,
//                         B: _.B.concat(numeric.add(E.B, v + 1))
//                     }
//                 } var C, T, S;
//             if (r = t[w - 2][w - 2], o = t[w - 2][w - 1], s = t[w - 1][w - 2], u = r + (a = t[w - 1][w - 1]), l = r * a - o * s, c = numeric.getBlock(t, [0, 0], [2, 2]), 4 * l <= u * u) C = .5 * (u + Math.sqrt(u * u - 4 * l)), T = .5 * (u - Math.sqrt(u * u - 4 * l)), c = numeric.add(numeric.sub(numeric.dot(c, c), numeric.mul(c, C + T)), numeric.diag(numeric.rep([3], C * T)));
//             else c = numeric.add(numeric.sub(numeric.dot(c, c), numeric.mul(c, u)), numeric.diag(numeric.rep([3], l)));
//             for (n = [c[0][0], c[1][0], c[2][0]], i = numeric.house(n), f = [t[0], t[1], t[2]], p = numeric.tensor(i, numeric.dot(i, f)), g = 0; g < 3; g++)
//                 for (d = t[g], m = p[g], y = 0; y < w; y++) d[y] -= 2 * m[y];
//             for (f = numeric.getBlock(t, [0, 0], [w - 1, 2]), p = numeric.tensor(numeric.dot(f, i), i), g = 0; g < w; g++)
//                 for (d = t[g], m = p[g], y = 0; y < 3; y++) d[y] -= 2 * m[y];
//             for (f = [x[0], x[1], x[2]], p = numeric.tensor(i, numeric.dot(i, f)), g = 0; g < 3; g++)
//                 for (h = x[g], m = p[g], y = 0; y < w; y++) h[y] -= 2 * m[y];
//             for (v = 0; v < w - 2; v++) {
//                 for (y = v; y <= v + 1; y++)
//                     if (Math.abs(t[y + 1][y]) < k * (Math.abs(t[y][y]) + Math.abs(t[y + 1][y + 1]))) {
//                         _ = numeric.QRFrancis(numeric.getBlock(t, [0, 0], [y, y]), e), E = numeric.QRFrancis(numeric.getBlock(t, [y + 1, y + 1], [w - 1, w - 1]), e);
//                         for (f = Array(y + 1), g = 0; g <= y; g++) f[g] = x[g];
//                         for (p = numeric.dot(_.Q, f), g = 0; g <= y; g++) x[g] = p[g];
//                         for (f = Array(w - y - 1), g = y + 1; g < w; g++) f[g - y - 1] = x[g];
//                         for (p = numeric.dot(E.Q, f), g = y + 1; g < w; g++) x[g] = p[g - y - 1];
//                         return {
//                             Q: x,
//                             B: _.B.concat(numeric.add(E.B, y + 1))
//                         }
//                     } for (S = Math.min(w - 1, v + 3), n = Array(S - v), g = v + 1; g <= S; g++) n[g - v - 1] = t[g][v];
//                 for (i = numeric.house(n), f = numeric.getBlock(t, [v + 1, v], [S, w - 1]), p = numeric.tensor(i, numeric.dot(i, f)), g = v + 1; g <= S; g++)
//                     for (d = t[g], m = p[g - v - 1], y = v; y < w; y++) d[y] -= 2 * m[y - v];
//                 for (f = numeric.getBlock(t, [0, v + 1], [w - 1, S]), p = numeric.tensor(numeric.dot(f, i), i), g = 0; g < w; g++)
//                     for (d = t[g], m = p[g], y = v + 1; y <= S; y++) d[y] -= 2 * m[y - v - 1];
//                 for (f = Array(S - v), g = v + 1; g <= S; g++) f[g - v - 1] = x[g];
//                 for (p = numeric.tensor(i, numeric.dot(i, f)), g = v + 1; g <= S; g++)
//                     for (h = x[g], m = p[g - v - 1], y = 0; y < w; y++) h[y] -= 2 * m[y]
//             }
//         }
//         throw new Error("numeric: eigenvalue iteration does not converge -- increase maxiter?")
//     }, numeric.eig = function(t, e) {
//         var n, i, r, o, s, a, l, u, c, h, d, f, p, m, g, v, y = numeric.toUpperHessenberg(t),
//             b = numeric.QRFrancis(y.H, e),
//             w = numeric.T,
//             x = t.length,
//             k = b.B,
//             _ = numeric.dot(b.Q, numeric.dot(y.H, numeric.transpose(b.Q))),
//             E = new w(numeric.dot(b.Q, y.Q)),
//             C = k.length,
//             T = Math.sqrt;
//         for (i = 0; i < C; i++)
//             if ((n = k[i][0]) !== k[i][1]) {
//                 if (o = n + 1, s = _[n][n], a = _[n][o], l = _[o][n], u = _[o][o], 0 === a && 0 === l) continue;
//                 0 <= (h = (c = -s - u) * c - 4 * (s * u - a * l)) ? ((v = l * l + (u - (d = c < 0 ? -.5 * (c - T(h)) : -.5 * (c + T(h)))) * (u - d)) < (g = (s - d) * (s - d) + a * a) ? (p = (s - d) / (g = T(g)), m = a / g) : (p = l / (v = T(v)), m = (u - d) / v), r = new w([
//                     [m, -p],
//                     [p, m]
//                 ])) : (d = -.5 * c, f = .5 * T(-h), (v = l * l + (u - d) * (u - d)) < (g = (s - d) * (s - d) + a * a) ? (p = (s - d) / (g = T(g + f * f)), m = a / g, d = 0, f /= g) : (p = l / (v = T(v + f * f)), m = (u - d) / v, d = f / v, f = 0), r = new w([
//                     [m, -p],
//                     [p, m]
//                 ], [
//                     [d, f],
//                     [f, -d]
//                 ])), E.setRows(n, o, r.dot(E.getRows(n, o)))
//             } var S = E.dot(t).dot(E.transjugate()),
//             A = (x = t.length, numeric.T.identity(x));
//         for (o = 0; o < x; o++)
//             if (0 < o)
//                 for (i = o - 1; 0 <= i; i--) {
//                     var L = S.get([i, i]),
//                         P = S.get([o, o]);
//                     numeric.neq(L.x, P.x) || numeric.neq(L.y, P.y) ? (d = S.getRow(i).getBlock([i], [o - 1]), f = A.getRow(o).getBlock([i], [o - 1]), A.set([o, i], S.get([i, o]).neg().sub(d.dot(f)).div(L.sub(P)))) : A.setRow(o, A.getRow(i))
//                 }
//         for (o = 0; o < x; o++) d = A.getRow(o), A.setRow(o, d.div(d.norm2()));
//         return A = A.transpose(), A = E.transjugate().dot(A), {
//             lambda: S.getDiag(),
//             E: A
//         }
//     }, numeric.ccsSparse = function(t) {
//         var e, n, i, r = t.length,
//             o = [];
//         for (n = r - 1; - 1 !== n; --n)
//             for (i in e = t[n]) {
//                 for (i = parseInt(i); i >= o.length;) o[o.length] = 0;
//                 0 !== e[i] && o[i]++
//             }
//         var s = o.length,
//             a = Array(s + 1);
//         for (n = a[0] = 0; n < s; ++n) a[n + 1] = a[n] + o[n];
//         var l = Array(a[s]),
//             u = Array(a[s]);
//         for (n = r - 1; - 1 !== n; --n)
//             for (i in e = t[n]) 0 !== e[i] && (o[i]--, l[a[i] + o[i]] = n, u[a[i] + o[i]] = e[i]);
//         return [a, l, u]
//     }, numeric.ccsFull = function(t) {
//         var e, n, i, r, o = t[0],
//             s = t[1],
//             a = t[2],
//             l = numeric.ccsDim(t),
//             u = l[0],
//             c = l[1],
//             h = numeric.rep([u, c], 0);
//         for (e = 0; e < c; e++)
//             for (i = o[e], r = o[e + 1], n = i; n < r; ++n) h[s[n]][e] = a[n];
//         return h
//     }, numeric.ccsTSolve = function(t, e, n, i, r) {
//         function o(t) {
//             var e;
//             if (0 === n[t]) {
//                 for (n[t] = 1, e = f[t]; e < f[t + 1]; ++e) o(p[e]);
//                 r[y] = t, ++y
//             }
//         }
//         var s, a, l, u, c, h, d, f = t[0],
//             p = t[1],
//             m = t[2],
//             g = f.length - 1,
//             v = Math.max,
//             y = 0;
//         for (void 0 === i && (n = numeric.rep([g], 0)), void 0 === i && (i = numeric.linspace(0, n.length - 1)), void 0 === r && (r = []), s = i.length - 1; - 1 !== s; --s) o(i[s]);
//         for (r.length = y, s = r.length - 1; - 1 !== s; --s) n[r[s]] = 0;
//         for (s = i.length - 1; - 1 !== s; --s) a = i[s], n[a] = e[a];
//         for (s = r.length - 1; - 1 !== s; --s) {
//             for (a = r[s], l = f[a], u = v(f[a + 1], l), c = l; c !== u; ++c)
//                 if (p[c] === a) {
//                     n[a] /= m[c];
//                     break
//                 } for (d = n[a], c = l; c !== u; ++c)(h = p[c]) !== a && (n[h] -= d * m[c])
//         }
//         return n
//     }, numeric.ccsDFS = function(t) {
//         this.k = Array(t), this.k1 = Array(t), this.j = Array(t)
//     }, numeric.ccsDFS.prototype.dfs = function(t, e, n, i, r, o) {
//         var s, a, l, u = 0,
//             c = r.length,
//             h = this.k,
//             d = this.k1,
//             f = this.j;
//         if (0 === i[t])
//             for (i[t] = 1, f[0] = t, h[0] = a = e[t], d[0] = l = e[t + 1];;)
//                 if (l <= a) {
//                     if (r[c] = f[u], 0 === u) return;
//                     ++c, a = h[--u], l = d[u]
//                 } else 0 === i[s = o[n[a]]] ? (i[s] = 1, h[u] = a, a = e[f[++u] = s], d[u] = l = e[s + 1]) : ++a
//     }, numeric.ccsLPSolve = function(t, e, n, i, r, o, s) {
//         var a, l, u, c, h, d, f, p, m, g = t[0],
//             v = t[1],
//             y = t[2],
//             b = (g.length, e[0]),
//             w = e[1],
//             x = e[2];
//         for (l = b[r], u = b[r + 1], i.length = 0, a = l; a < u; ++a) s.dfs(o[w[a]], g, v, n, i, o);
//         for (a = i.length - 1; - 1 !== a; --a) n[i[a]] = 0;
//         for (a = l; a !== u; ++a) n[c = o[w[a]]] = x[a];
//         for (a = i.length - 1; - 1 !== a; --a) {
//             for (h = g[c = i[a]], d = g[c + 1], f = h; f < d; ++f)
//                 if (o[v[f]] === c) {
//                     n[c] /= y[f];
//                     break
//                 } for (m = n[c], f = h; f < d; ++f)(p = o[v[f]]) !== c && (n[p] -= m * y[f])
//         }
//         return n
//     }, numeric.ccsLUP1 = function(t, e) {
//         var n, i, r, o, s, a, l, u = t[0].length - 1,
//             c = [numeric.rep([u + 1], 0), [],
//                 []
//             ],
//             h = [numeric.rep([u + 1], 0), [],
//                 []
//             ],
//             d = c[0],
//             f = c[1],
//             p = c[2],
//             m = h[0],
//             g = h[1],
//             v = h[2],
//             y = numeric.rep([u], 0),
//             b = numeric.rep([u], 0),
//             w = numeric.ccsLPSolve,
//             x = (Math.max, Math.abs),
//             k = numeric.linspace(0, u - 1),
//             _ = numeric.linspace(0, u - 1),
//             E = new numeric.ccsDFS(u);
//         for (void 0 === e && (e = 1), n = 0; n < u; ++n) {
//             for (w(c, t, y, b, n, _, E), s = o = -1, i = b.length - 1; - 1 !== i; --i)(r = b[i]) <= n || o < (a = x(y[r])) && (s = r, o = a);
//             for (x(y[n]) < e * o && (i = k[n], o = k[s], _[k[n] = o] = n, _[k[s] = i] = s, o = y[n], y[n] = y[s], y[s] = o), o = d[n], s = m[n], l = y[n], f[o] = k[n], p[o] = 1, ++o, i = b.length - 1; - 1 !== i; --i) a = y[r = b[i]], b[i] = 0, y[r] = 0, r <= n ? (g[s] = r, v[s] = a, ++s) : (f[o] = k[r], p[o] = a / l, ++o);
//             d[n + 1] = o, m[n + 1] = s
//         }
//         for (i = f.length - 1; - 1 !== i; --i) f[i] = _[f[i]];
//         return {
//             L: c,
//             U: h,
//             P: k,
//             Pinv: _
//         }
//     }, numeric.ccsDFS0 = function(t) {
//         this.k = Array(t), this.k1 = Array(t), this.j = Array(t)
//     }, numeric.ccsDFS0.prototype.dfs = function(t, e, n, i, r, o) {
//         var s, a, l, u = 0,
//             c = r.length,
//             h = this.k,
//             d = this.k1,
//             f = this.j;
//         if (0 === i[t])
//             for (i[t] = 1, f[0] = t, h[0] = a = e[o[t]], d[0] = l = e[o[t] + 1];;) {
//                 if (isNaN(a)) throw new Error("Ow!");
//                 if (l <= a) {
//                     if (r[c] = o[f[u]], 0 === u) return;
//                     ++c, a = h[--u], l = d[u]
//                 } else 0 === i[s = n[a]] ? (i[s] = 1, h[u] = a, a = e[s = o[f[++u] = s]], d[u] = l = e[s + 1]) : ++a
//             }
//     }, numeric.ccsLPSolve0 = function(t, e, n, i, r, o, s, a) {
//         var l, u, c, h, d, f, p, m, g, v = t[0],
//             y = t[1],
//             b = t[2],
//             w = (v.length, e[0]),
//             x = e[1],
//             k = e[2];
//         for (u = w[r], c = w[r + 1], i.length = 0, l = u; l < c; ++l) a.dfs(x[l], v, y, n, i, o, s);
//         for (l = i.length - 1; - 1 !== l; --l) n[s[h = i[l]]] = 0;
//         for (l = u; l !== c; ++l) n[h = x[l]] = k[l];
//         for (l = i.length - 1; - 1 !== l; --l) {
//             for (m = s[h = i[l]], d = v[h], f = v[h + 1], p = d; p < f; ++p)
//                 if (y[p] === m) {
//                     n[m] /= b[p];
//                     break
//                 } for (g = n[m], p = d; p < f; ++p) n[y[p]] -= g * b[p];
//             n[m] = g
//         }
//     }, numeric.ccsLUP0 = function(t, e) {
//         var n, i, r, o, s, a, l, u = t[0].length - 1,
//             c = [numeric.rep([u + 1], 0), [],
//                 []
//             ],
//             h = [numeric.rep([u + 1], 0), [],
//                 []
//             ],
//             d = c[0],
//             f = c[1],
//             p = c[2],
//             m = h[0],
//             g = h[1],
//             v = h[2],
//             y = numeric.rep([u], 0),
//             b = numeric.rep([u], 0),
//             w = numeric.ccsLPSolve0,
//             x = (Math.max, Math.abs),
//             k = numeric.linspace(0, u - 1),
//             _ = numeric.linspace(0, u - 1),
//             E = new numeric.ccsDFS0(u);
//         for (void 0 === e && (e = 1), n = 0; n < u; ++n) {
//             for (w(c, t, y, b, n, _, k, E), s = o = -1, i = b.length - 1; - 1 !== i; --i)(r = b[i]) <= n || o < (a = x(y[k[r]])) && (s = r, o = a);
//             for (x(y[k[n]]) < e * o && (i = k[n], o = k[s], _[k[n] = o] = n, _[k[s] = i] = s), o = d[n], s = m[n], l = y[k[n]], f[o] = k[n], p[o] = 1, ++o, i = b.length - 1; - 1 !== i; --i) a = y[k[r = b[i]]], b[i] = 0, y[k[r]] = 0, r <= n ? (g[s] = r, v[s] = a, ++s) : (f[o] = k[r], p[o] = a / l, ++o);
//             d[n + 1] = o, m[n + 1] = s
//         }
//         for (i = f.length - 1; - 1 !== i; --i) f[i] = _[f[i]];
//         return {
//             L: c,
//             U: h,
//             P: k,
//             Pinv: _
//         }
//     }, numeric.ccsLUP = numeric.ccsLUP0, numeric.ccsDim = function(t) {
//         return [numeric.sup(t[1]) + 1, t[0].length - 1]
//     }, numeric.ccsGetBlock = function(t, e, n) {
//         var i = numeric.ccsDim(t),
//             r = i[0],
//             o = i[1];
//         void 0 === e ? e = numeric.linspace(0, r - 1) : "number" == typeof e && (e = [e]), void 0 === n ? n = numeric.linspace(0, o - 1) : "number" == typeof n && (n = [n]);
//         var s, a, l, u, c = e.length,
//             h = n.length,
//             d = numeric.rep([o], 0),
//             f = [],
//             p = [],
//             m = [d, f, p],
//             g = t[0],
//             v = t[1],
//             y = t[2],
//             b = numeric.rep([r], 0),
//             w = 0,
//             x = numeric.rep([r], 0);
//         for (a = 0; a < h; ++a) {
//             var k = g[u = n[a]],
//                 _ = g[u + 1];
//             for (s = k; s < _; ++s) x[l = v[s]] = 1, b[l] = y[s];
//             for (s = 0; s < c; ++s) x[e[s]] && (f[w] = s, p[w] = b[e[s]], ++w);
//             for (s = k; s < _; ++s) x[l = v[s]] = 0;
//             d[a + 1] = w
//         }
//         return m
//     }, numeric.ccsDot = function(t, e) {
//         var n, i, r, o, s, a, l, u, c, h, d, f = t[0],
//             p = t[1],
//             m = t[2],
//             g = e[0],
//             v = e[1],
//             y = e[2],
//             b = numeric.ccsDim(t),
//             w = numeric.ccsDim(e),
//             x = b[0],
//             k = (b[1], w[1]),
//             _ = numeric.rep([x], 0),
//             E = numeric.rep([x], 0),
//             C = Array(x),
//             T = numeric.rep([k], 0),
//             S = [],
//             A = [],
//             L = [T, S, A];
//         for (r = 0; r !== k; ++r) {
//             for (o = g[r], s = g[r + 1], c = 0, i = o; i < s; ++i)
//                 for (h = v[i], d = y[i], a = f[h], l = f[h + 1], n = a; n < l; ++n) 0 === E[u = p[n]] && (c += E[C[c] = u] = 1), _[u] = _[u] + m[n] * d;
//             for (s = (o = T[r]) + c, T[r + 1] = s, i = c - 1; - 1 !== i; --i) d = o + i, n = C[i], S[d] = n, A[d] = _[n], E[n] = 0, _[n] = 0;
//             T[r + 1] = T[r] + c
//         }
//         return L
//     }, numeric.ccsLUPSolve = function(t, e) {
//         var n = t.L,
//             i = t.U,
//             r = (t.P, e[0]),
//             o = !1;
//         "object" != typeof r && (r = (e = [
//             [0, e.length], numeric.linspace(0, e.length - 1), e
//         ])[0], o = !0);
//         var s, a, l, u, c, h, d = e[1],
//             f = e[2],
//             p = n[0].length - 1,
//             m = r.length - 1,
//             g = numeric.rep([p], 0),
//             v = Array(p),
//             y = numeric.rep([p], 0),
//             b = Array(p),
//             w = numeric.rep([m + 1], 0),
//             x = [],
//             k = [],
//             _ = numeric.ccsTSolve,
//             E = 0;
//         for (s = 0; s < m; ++s) {
//             for (c = 0, l = r[s], u = r[s + 1], a = l; a < u; ++a) h = t.Pinv[d[a]], y[b[c] = h] = f[a], ++c;
//             for (b.length = c, _(n, y, g, b, v), a = b.length - 1; - 1 !== a; --a) y[b[a]] = 0;
//             if (_(i, g, y, v, b), o) return y;
//             for (a = v.length - 1; - 1 !== a; --a) g[v[a]] = 0;
//             for (a = b.length - 1; - 1 !== a; --a) h = b[a], x[E] = h, k[E] = y[h], y[h] = 0, ++E;
//             w[s + 1] = E
//         }
//         return [w, x, k]
//     }, numeric.ccsbinop = function(t, e) {
//         return void 0 === e && (e = ""), Function("X", "Y", "var Xi = X[0], Xj = X[1], Xv = X[2];\nvar Yi = Y[0], Yj = Y[1], Yv = Y[2];\nvar n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\nvar Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\nvar x = numeric.rep([m],0),y = numeric.rep([m],0);\nvar xk,yk,zk;\nvar i,j,j0,j1,k,p=0;\n" + e + "for(i=0;i<n;++i) {\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Xj[j];\n    x[k] = 1;\n    Zj[p] = k;\n    ++p;\n  }\n  j0 = Yi[i]; j1 = Yi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Yj[j];\n    y[k] = Yv[j];\n    if(x[k] === 0) {\n      Zj[p] = k;\n      ++p;\n    }\n  }\n  Zi[i+1] = p;\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n  j0 = Zi[i]; j1 = Zi[i+1];\n  for(j=j0;j!==j1;++j) {\n    k = Zj[j];\n    xk = x[k];\n    yk = y[k];\n" + t + "\n    Zv[j] = zk;\n  }\n  j0 = Xi[i]; j1 = Xi[i+1];\n  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n  j0 = Yi[i]; j1 = Yi[i+1];\n  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n}\nreturn [Zi,Zj,Zv];")
//     },
//     function() {
//         var k, A, B, C;
//         for (k in numeric.ops2) A = isFinite(eval("1" + numeric.ops2[k] + "0")) ? "[Y[0],Y[1],numeric." + k + "(X,Y[2])]" : "NaN", B = isFinite(eval("0" + numeric.ops2[k] + "1")) ? "[X[0],X[1],numeric." + k + "(X[2],Y)]" : "NaN", C = isFinite(eval("1" + numeric.ops2[k] + "0")) && isFinite(eval("0" + numeric.ops2[k] + "1")) ? "numeric.ccs" + k + "MM(X,Y)" : "NaN", numeric["ccs" + k + "MM"] = numeric.ccsbinop("zk = xk " + numeric.ops2[k] + "yk;"), numeric["ccs" + k] = Function("X", "Y", 'if(typeof X === "number") return ' + A + ';\nif(typeof Y === "number") return ' + B + ";\nreturn " + C + ";\n")
//     }(), numeric.ccsScatter = function(t) {
//         var e, n = t[0],
//             i = t[1],
//             r = t[2],
//             o = numeric.sup(i) + 1,
//             s = n.length,
//             a = numeric.rep([o], 0),
//             l = Array(s),
//             u = Array(s),
//             c = numeric.rep([o], 0);
//         for (e = 0; e < s; ++e) c[i[e]]++;
//         for (e = 0; e < o; ++e) a[e + 1] = a[e] + c[e];
//         var h, d, f = a.slice(0);
//         for (e = 0; e < s; ++e) l[h = f[d = i[e]]] = n[e], u[h] = r[e], f[d] = f[d] + 1;
//         return [a, l, u]
//     }, numeric.ccsGather = function(t) {
//         var e, n, i, r, o, s = t[0],
//             a = t[1],
//             l = t[2],
//             u = s.length - 1,
//             c = a.length,
//             h = Array(c),
//             d = Array(c),
//             f = Array(c);
//         for (e = o = 0; e < u; ++e)
//             for (i = s[e], r = s[e + 1], n = i; n !== r; ++n) d[o] = e, h[o] = a[n], f[o] = l[n], ++o;
//         return [h, d, f]
//     }, numeric.sdim = function dim(t, e, n) {
//         if (void 0 === e && (e = []), "object" != typeof t) return e;
//         var i;
//         for (i in void 0 === n && (n = 0), n in e || (e[n] = 0), t.length > e[n] && (e[n] = t.length), t) t.hasOwnProperty(i) && dim(t[i], e, n + 1);
//         return e
//     }, numeric.sclone = function clone(t, e, n) {
//         void 0 === e && (e = 0), void 0 === n && (n = numeric.sdim(t).length);
//         var i, r = Array(t.length);
//         if (e === n - 1) {
//             for (i in t) t.hasOwnProperty(i) && (r[i] = t[i]);
//             return r
//         }
//         for (i in t) t.hasOwnProperty(i) && (r[i] = clone(t[i], e + 1, n));
//         return r
//     }, numeric.sdiag = function(t) {
//         var e, n, i = t.length,
//             r = Array(i);
//         for (e = i - 1; 1 <= e; e -= 2) n = e - 1, r[e] = [], r[e][e] = t[e], r[n] = [], r[n][n] = t[n];
//         return 0 === e && (r[0] = [], r[0][0] = t[e]), r
//     }, numeric.sidentity = function(t) {
//         return numeric.sdiag(numeric.rep([t], 1))
//     }, numeric.stranspose = function(t) {
//         var e, n, i, r = [];
//         t.length;
//         for (e in t)
//             if (t.hasOwnProperty(e))
//                 for (n in i = t[e]) i.hasOwnProperty(n) && ("object" != typeof r[n] && (r[n] = []), r[n][e] = i[n]);
//         return r
//     }, numeric.sLUP = function() {
//         throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.")
//     }, numeric.sdotMM = function(t, e) {
//         var n, i, r, o, s, a, l, u = t.length,
//             c = (e.length, numeric.stranspose(e)),
//             h = c.length,
//             d = Array(u);
//         for (r = u - 1; 0 <= r; r--) {
//             for (l = [], n = t[r], s = h - 1; 0 <= s; s--) {
//                 for (o in a = 0, i = c[s], n) n.hasOwnProperty(o) && o in i && (a += n[o] * i[o]);
//                 a && (l[s] = a)
//             }
//             d[r] = l
//         }
//         return d
//     }, numeric.sdotMV = function(t, e) {
//         var n, i, r, o, s = t.length,
//             a = Array(s);
//         for (i = s - 1; 0 <= i; i--) {
//             for (r in o = 0, n = t[i]) n.hasOwnProperty(r) && e[r] && (o += n[r] * e[r]);
//             o && (a[i] = o)
//         }
//         return a
//     }, numeric.sdotVM = function(t, e) {
//         var n, i, r, o, s = [];
//         for (n in t)
//             if (t.hasOwnProperty(n))
//                 for (i in r = e[n], o = t[n], r) r.hasOwnProperty(i) && (s[i] || (s[i] = 0), s[i] += o * r[i]);
//         return s
//     }, numeric.sdotVV = function(t, e) {
//         var n, i = 0;
//         for (n in t) t[n] && e[n] && (i += t[n] * e[n]);
//         return i
//     }, numeric.sdot = function(t, e) {
//         var n = numeric.sdim(t).length,
//             i = numeric.sdim(e).length;
//         switch (1e3 * n + i) {
//             case 0:
//                 return t * e;
//             case 1001:
//                 return numeric.sdotVV(t, e);
//             case 2001:
//                 return numeric.sdotMV(t, e);
//             case 1002:
//                 return numeric.sdotVM(t, e);
//             case 2002:
//                 return numeric.sdotMM(t, e);
//             default:
//                 throw new Error("numeric.sdot not implemented for tensors of order " + n + " and " + i)
//         }
//     }, numeric.sscatter = function(t) {
//         var e, n, i, r, o = t[0].length,
//             s = t.length,
//             a = [];
//         for (n = o - 1; 0 <= n; --n)
//             if (t[s - 1][n]) {
//                 for (r = a, i = 0; i < s - 2; i++) r[e = t[i][n]] || (r[e] = []), r = r[e];
//                 r[t[i][n]] = t[i + 1][n]
//             } return a
//     }, numeric.sgather = function gather(t, e, n) {
//         var i, r, o;
//         for (r in void 0 === e && (e = []), void 0 === n && (n = []), i = n.length, t)
//             if (t.hasOwnProperty(r))
//                 if (n[i] = parseInt(r), "number" == typeof(o = t[r])) {
//                     if (o) {
//                         if (0 === e.length)
//                             for (r = i + 1; 0 <= r; --r) e[r] = [];
//                         for (r = i; 0 <= r; --r) e[r].push(n[r]);
//                         e[i + 1].push(o)
//                     }
//                 } else gather(o, e, n);
//         return n.length > i && n.pop(), e
//     }, numeric.cLU = function(t) {
//         var e, n, i, r, o, s, a = t[0],
//             l = t[1],
//             u = t[2],
//             c = a.length,
//             h = 0;
//         for (e = 0; e < c; e++) a[e] > h && (h = a[e]);
//         h++;
//         var d, f = Array(h),
//             p = Array(h),
//             m = numeric.rep([h], Infinity),
//             g = numeric.rep([h], -Infinity);
//         for (i = 0; i < c; i++) e = a[i], (n = l[i]) < m[e] && (m[e] = n), n > g[e] && (g[e] = n);
//         for (e = 0; e < h - 1; e++) g[e] > g[e + 1] && (g[e + 1] = g[e]);
//         for (e = h - 1; 1 <= e; e--) m[e] < m[e - 1] && (m[e - 1] = m[e]);
//         for (e = 0; e < h; e++) p[e] = numeric.rep([g[e] - m[e] + 1], 0), f[e] = numeric.rep([e - m[e]], 0), e - m[e] + 1, g[e] - e + 1;
//         for (i = 0; i < c; i++) p[e = a[i]][l[i] - m[e]] = u[i];
//         for (e = 0; e < h - 1; e++)
//             for (r = e - m[e], b = p[e], n = e + 1; m[n] <= e && n < h; n++)
//                 if (o = e - m[n], s = g[e] - e, d = (w = p[n])[o] / b[r]) {
//                     for (i = 1; i <= s; i++) w[i + o] -= d * b[i + r];
//                     f[n][e - m[n]] = d
//                 } var v, y, b = [],
//             w = [],
//             x = [],
//             k = [],
//             _ = [],
//             E = [];
//         for (e = v = c = 0; e < h; e++) {
//             for (r = m[e], o = g[e], y = p[e], n = e; n <= o; n++) y[n - r] && (b[c] = e, w[c] = n, x[c] = y[n - r], c++);
//             for (y = f[e], n = r; n < e; n++) y[n - r] && (k[v] = e, _[v] = n, E[v] = y[n - r], v++);
//             k[v] = e, _[v] = e, E[v] = 1, v++
//         }
//         return {
//             U: [b, w, x],
//             L: [k, _, E]
//         }
//     }, numeric.cLUsolve = function(t, e) {
//         var n, i, r = t.L,
//             o = t.U,
//             s = numeric.clone(e),
//             a = r[0],
//             l = r[1],
//             u = r[2],
//             c = o[0],
//             h = o[1],
//             d = o[2],
//             f = c.length,
//             p = (a.length, s.length);
//         for (n = i = 0; n < p; n++) {
//             for (; l[i] < n;) s[n] -= u[i] * s[l[i]], i++;
//             i++
//         }
//         for (i = f - 1, n = p - 1; 0 <= n; n--) {
//             for (; h[i] > n;) s[n] -= d[i] * s[h[i]], i--;
//             s[n] /= d[i], i--
//         }
//         return s
//     }, numeric.cgrid = function(n, t) {
//         "number" == typeof n && (n = [n, n]);
//         var e, i, r, o = numeric.rep(n, -1);
//         if ("function" != typeof t) switch (t) {
//             case "L":
//                 t = function(t, e) {
//                     return t >= n[0] / 2 || e < n[1] / 2
//                 };
//                 break;
//             default:
//                 t = function() {
//                     return !0
//                 }
//         }
//         for (r = 0, e = 1; e < n[0] - 1; e++)
//             for (i = 1; i < n[1] - 1; i++) t(e, i) && (o[e][i] = r, r++);
//         return o
//     }, numeric.cdelsq = function(t) {
//         var e, n, i, r, o, s = [
//                 [-1, 0],
//                 [0, -1],
//                 [0, 1],
//                 [1, 0]
//             ],
//             a = numeric.dim(t),
//             l = a[0],
//             u = a[1],
//             c = [],
//             h = [],
//             d = [];
//         for (e = 1; e < l - 1; e++)
//             for (n = 1; n < u - 1; n++)
//                 if (!(t[e][n] < 0)) {
//                     for (i = 0; i < 4; i++) r = e + s[i][0], o = n + s[i][1], t[r][o] < 0 || (c.push(t[e][n]), h.push(t[r][o]), d.push(-1));
//                     c.push(t[e][n]), h.push(t[e][n]), d.push(4)
//                 } return [c, h, d]
//     }, numeric.cdotMV = function(t, e) {
//         var n, i, r, o = t[0],
//             s = t[1],
//             a = t[2],
//             l = o.length;
//         for (i = r = 0; i < l; i++) o[i] > r && (r = o[i]);
//         for (r++, n = numeric.rep([r], 0), i = 0; i < l; i++) n[o[i]] += a[i] * e[s[i]];
//         return n
//     }, numeric.Spline = function(t, e, n, i, r) {
//         this.x = t, this.yl = e, this.yr = n, this.kl = i, this.kr = r
//     }, numeric.Spline.prototype._at = function(t, e) {
//         var n, i, r, o = this.x,
//             s = this.yl,
//             a = this.yr,
//             l = this.kl,
//             u = this.kr,
//             c = numeric.add,
//             h = numeric.sub,
//             d = numeric.mul;
//         n = h(d(l[e], o[e + 1] - o[e]), h(a[e + 1], s[e])), i = c(d(u[e + 1], o[e] - o[e + 1]), h(a[e + 1], s[e]));
//         var f = (r = (t - o[e]) / (o[e + 1] - o[e])) * (1 - r);
//         return c(c(c(d(1 - r, s[e]), d(r, a[e + 1])), d(n, f * (1 - r))), d(i, f * r))
//     }, numeric.Spline.prototype.at = function(t) {
//         if ("number" == typeof t) {
//             var e, n, i, r = this.x,
//                 o = r.length,
//                 s = Math.floor;
//             for (e = 0, n = o - 1; 1 < n - e;) r[i = s((e + n) / 2)] <= t ? e = i : n = i;
//             return this._at(t, e)
//         }
//         o = t.length;
//         var a, l = Array(o);
//         for (a = o - 1; - 1 !== a; --a) l[a] = this.at(t[a]);
//         return l
//     }, numeric.Spline.prototype.diff = function() {
//         var t, e, n, i = this.x,
//             r = this.yl,
//             o = this.yr,
//             s = this.kl,
//             a = this.kr,
//             l = r.length,
//             u = s,
//             c = a,
//             h = Array(l),
//             d = Array(l),
//             f = numeric.add,
//             p = numeric.mul,
//             m = numeric.div,
//             g = numeric.sub;
//         for (t = l - 1; - 1 !== t; --t) e = i[t + 1] - i[t], n = g(o[t + 1], r[t]), h[t] = m(f(p(n, 6), p(s[t], -4 * e), p(a[t + 1], -2 * e)), e * e), d[t + 1] = m(f(p(n, -6), p(s[t], 2 * e), p(a[t + 1], 4 * e)), e * e);
//         return new numeric.Spline(i, u, c, h, d)
//     }, numeric.Spline.prototype.roots = function() {
//         function t(t) {
//             return t * t
//         }
//         var e = [],
//             n = this.x,
//             i = this.yl,
//             r = this.yr,
//             o = this.kl,
//             s = this.kr;
//         "number" == typeof i[0] && (i = [i], r = [r], o = [o], s = [s]);
//         var a, l, u, c, h, d, f, p, m, g, v, y, b, w, x, k, _, E, C, T, S, A, L, P = i.length,
//             M = n.length - 1,
//             D = (e = Array(P), Math.sqrt);
//         for (a = 0; a !== P; ++a) {
//             for (c = i[a], h = r[a], d = o[a], f = s[a], p = [], l = 0; l !== M; l++) {
//                 for (0 < l && h[l] * c[l] < 0 && p.push(n[l]), k = n[l + 1] - n[l], n[l], v = c[l], y = h[l + 1], m = d[l] / k, b = (g = f[l + 1] / k) + 3 * v + 2 * m - 3 * y, w = 3 * (g + m + 2 * (v - y)), (x = t(m - g + 3 * (v - y)) + 12 * g * v) <= 0 ? _ = (E = b / w) > n[l] && E < n[l + 1] ? [n[l], E, n[l + 1]] : [n[l], n[l + 1]] : (E = (b - D(x)) / w, C = (b + D(x)) / w, _ = [n[l]], E > n[l] && E < n[l + 1] && _.push(E),
//                         C > n[l] && C < n[l + 1] && _.push(C), _.push(n[l + 1])), S = _[0], E = this._at(S, l), u = 0; u < _.length - 1; u++)
//                     if (A = _[u + 1], C = this._at(A, l), 0 !== E)
//                         if (0 === C || 0 < E * C) S = A, E = C;
//                         else {
//                             for (var R = 0; !((L = (E * A - C * S) / (E - C)) <= S || A <= L);)
//                                 if (0 < (T = this._at(L, l)) * C) A = L, C = T, -1 === R && (E *= .5), R = -1;
//                                 else {
//                                     if (!(0 < T * E)) break;
//                                     S = L, E = T, 1 === R && (C *= .5), R = 1
//                                 } p.push(L), S = _[u + 1], E = this._at(S, l)
//                         }
//                 else p.push(S), S = A, E = C;
//                 0 === C && p.push(A)
//             }
//             e[a] = p
//         }
//         return "number" == typeof this.yl[0] ? e[0] : e
//     }, numeric.spline = function(t, e, n, i) {
//         var r, o = t.length,
//             s = [],
//             a = [],
//             l = [],
//             u = numeric.sub,
//             c = numeric.mul,
//             h = numeric.add;
//         for (r = o - 2; 0 <= r; r--) a[r] = t[r + 1] - t[r], l[r] = u(e[r + 1], e[r]);
//         "string" != typeof n && "string" != typeof i || (n = i = "periodic");
//         var d = [
//             [],
//             [],
//             []
//         ];
//         switch (typeof n) {
//             case "undefined":
//                 s[0] = c(3 / (a[0] * a[0]), l[0]), d[0].push(0, 0), d[1].push(0, 1), d[2].push(2 / a[0], 1 / a[0]);
//                 break;
//             case "string":
//                 s[0] = h(c(3 / (a[o - 2] * a[o - 2]), l[o - 2]), c(3 / (a[0] * a[0]), l[0])), d[0].push(0, 0, 0), d[1].push(o - 2, 0, 1), d[2].push(1 / a[o - 2], 2 / a[o - 2] + 2 / a[0], 1 / a[0]);
//                 break;
//             default:
//                 s[0] = n, d[0].push(0), d[1].push(0), d[2].push(1)
//         }
//         for (r = 1; r < o - 1; r++) s[r] = h(c(3 / (a[r - 1] * a[r - 1]), l[r - 1]), c(3 / (a[r] * a[r]), l[r])), d[0].push(r, r, r), d[1].push(r - 1, r, r + 1), d[2].push(1 / a[r - 1], 2 / a[r - 1] + 2 / a[r], 1 / a[r]);
//         switch (typeof i) {
//             case "undefined":
//                 s[o - 1] = c(3 / (a[o - 2] * a[o - 2]), l[o - 2]), d[0].push(o - 1, o - 1), d[1].push(o - 2, o - 1), d[2].push(1 / a[o - 2], 2 / a[o - 2]);
//                 break;
//             case "string":
//                 d[1][d[1].length - 1] = 0;
//                 break;
//             default:
//                 s[o - 1] = i, d[0].push(o - 1), d[1].push(o - 1), d[2].push(1)
//         }
//         s = "number" != typeof s[0] ? numeric.transpose(s) : [s];
//         var f = Array(s.length);
//         if ("string" == typeof n)
//             for (r = f.length - 1; - 1 !== r; --r) f[r] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(d)), s[r]), f[r][o - 1] = f[r][0];
//         else
//             for (r = f.length - 1; - 1 !== r; --r) f[r] = numeric.cLUsolve(numeric.cLU(d), s[r]);
//         return f = "number" == typeof e[0] ? f[0] : numeric.transpose(f), new numeric.Spline(t, e, e, f, f)
//     }, numeric.fftpow2 = function fftpow2(t, e) {
//         var n = t.length;
//         if (1 !== n) {
//             var i, r, o = Math.cos,
//                 s = Math.sin,
//                 a = Array(n / 2),
//                 l = Array(n / 2),
//                 u = Array(n / 2),
//                 c = Array(n / 2);
//             for (r = n / 2, i = n - 1; - 1 !== i; --i) u[--r] = t[i], c[r] = e[i], --i, a[r] = t[i], l[r] = e[i];
//             fftpow2(a, l), fftpow2(u, c), r = n / 2;
//             var h, d, f, p = -6.283185307179586 / n;
//             for (i = n - 1; - 1 !== i; --i) - 1 === --r && (r = n / 2 - 1), d = o(h = p * i), f = s(h), t[i] = a[r] + d * u[r] - f * c[r], e[i] = l[r] + d * c[r] + f * u[r]
//         }
//     }, numeric._ifftpow2 = function _ifftpow2(t, e) {
//         var n = t.length;
//         if (1 !== n) {
//             var i, r, o = Math.cos,
//                 s = Math.sin,
//                 a = Array(n / 2),
//                 l = Array(n / 2),
//                 u = Array(n / 2),
//                 c = Array(n / 2);
//             for (r = n / 2, i = n - 1; - 1 !== i; --i) u[--r] = t[i], c[r] = e[i], --i, a[r] = t[i], l[r] = e[i];
//             _ifftpow2(a, l), _ifftpow2(u, c), r = n / 2;
//             var h, d, f, p = 6.283185307179586 / n;
//             for (i = n - 1; - 1 !== i; --i) - 1 === --r && (r = n / 2 - 1), d = o(h = p * i), f = s(h), t[i] = a[r] + d * u[r] - f * c[r], e[i] = l[r] + d * c[r] + f * u[r]
//         }
//     }, numeric.ifftpow2 = function(t, e) {
//         numeric._ifftpow2(t, e), numeric.diveq(t, t.length), numeric.diveq(e, e.length)
//     }, numeric.convpow2 = function(t, e, n, i) {
//         var r, o, s, a, l;
//         for (numeric.fftpow2(t, e), numeric.fftpow2(n, i), r = t.length - 1; - 1 !== r; --r) o = t[r], a = e[r], s = n[r], l = i[r], t[r] = o * s - a * l, e[r] = o * l + a * s;
//         numeric.ifftpow2(t, e)
//     }, numeric.T.prototype.fft = function() {
//         var t, e, n = this.x,
//             i = this.y,
//             r = n.length,
//             o = Math.log,
//             s = o(2),
//             a = Math.ceil(o(2 * r - 1) / s),
//             l = Math.pow(2, a),
//             u = numeric.rep([l], 0),
//             c = numeric.rep([l], 0),
//             h = Math.cos,
//             d = Math.sin,
//             f = -3.141592653589793 / r,
//             p = numeric.rep([l], 0),
//             m = numeric.rep([l], 0);
//         Math.floor(r / 2);
//         for (t = 0; t < r; t++) p[t] = n[t];
//         if (void 0 !== i)
//             for (t = 0; t < r; t++) m[t] = i[t];
//         for (t = u[0] = 1; t <= l / 2; t++) e = f * t * t, u[t] = h(e), c[t] = d(e), u[l - t] = h(e), c[l - t] = d(e);
//         var g = new numeric.T(p, m),
//             v = new numeric.T(u, c);
//         return g = g.mul(v), numeric.convpow2(g.x, g.y, numeric.clone(v.x), numeric.neg(v.y)), (g = g.mul(v)).x.length = r, g.y.length = r, g
//     }, numeric.T.prototype.ifft = function() {
//         var t, e, n = this.x,
//             i = this.y,
//             r = n.length,
//             o = Math.log,
//             s = o(2),
//             a = Math.ceil(o(2 * r - 1) / s),
//             l = Math.pow(2, a),
//             u = numeric.rep([l], 0),
//             c = numeric.rep([l], 0),
//             h = Math.cos,
//             d = Math.sin,
//             f = 3.141592653589793 / r,
//             p = numeric.rep([l], 0),
//             m = numeric.rep([l], 0);
//         Math.floor(r / 2);
//         for (t = 0; t < r; t++) p[t] = n[t];
//         if (void 0 !== i)
//             for (t = 0; t < r; t++) m[t] = i[t];
//         for (t = u[0] = 1; t <= l / 2; t++) e = f * t * t, u[t] = h(e), c[t] = d(e), u[l - t] = h(e), c[l - t] = d(e);
//         var g = new numeric.T(p, m),
//             v = new numeric.T(u, c);
//         return g = g.mul(v), numeric.convpow2(g.x, g.y, numeric.clone(v.x), numeric.neg(v.y)), (g = g.mul(v)).x.length = r, g.y.length = r, g.div(r)
//     }, numeric.gradient = function(t, e) {
//         var n = e.length,
//             i = t(e);
//         if (isNaN(i)) throw new Error("gradient: f(x) is a NaN!");
//         var r, o, s, a, l, u, c, h, d, f = Math.max,
//             p = numeric.clone(e),
//             m = Array(n),
//             g = (numeric.div, numeric.sub, f = Math.max, .001),
//             v = Math.abs,
//             y = Math.min,
//             b = 0;
//         for (r = 0; r < n; r++)
//             for (var w = f(1e-6 * i, 1e-8);;) {
//                 if (20 < ++b) throw new Error("Numerical gradient fails");
//                 if (p[r] = e[r] + w, o = t(p), p[r] = e[r] - w, s = t(p), p[r] = e[r], isNaN(o) || isNaN(s)) w /= 16;
//                 else {
//                     if (m[r] = (o - s) / (2 * w), a = e[r] - w, l = e[r], u = e[r] + w, c = (o - i) / w, h = (i - s) / w, d = f(v(m[r]), v(i), v(o), v(s), v(a), v(l), v(u), 1e-8), !(g < y(f(v(c - m[r]), v(h - m[r]), v(c - h)) / d, w / d))) break;
//                     w /= 16
//                 }
//             }
//         return m
//     }, numeric.uncmin = function(e, t, n, i, r, o, s) {
//         var a = numeric.gradient;
//         void 0 === s && (s = {}), void 0 === n && (n = 1e-8), void 0 === i && (i = function(t) {
//             return a(e, t)
//         }), void 0 === r && (r = 1e3);
//         var l, u, c = (t = numeric.clone(t)).length,
//             h = e(t);
//         if (isNaN(h)) throw new Error("uncmin: f(x0) is a NaN!");
//         var d = Math.max,
//             f = numeric.norm2;
//         n = d(n, numeric.epsilon);
//         var p, m, g, v, y, b, w, x, k, _, E = s.Hinv || numeric.identity(c),
//             C = numeric.dot,
//             T = (numeric.inv, numeric.sub),
//             S = numeric.add,
//             A = numeric.tensor,
//             L = numeric.div,
//             P = numeric.mul,
//             M = numeric.all,
//             D = numeric.isFinite,
//             R = numeric.neg,
//             j = 0,
//             N = "";
//         for (m = i(t); j < r;) {
//             if ("function" == typeof o && o(j, t, h, m, E)) {
//                 N = "Callback returned true";
//                 break
//             }
//             if (!M(D(m))) {
//                 N = "Gradient has Infinity or NaN";
//                 break
//             }
//             if (!M(D(p = R(C(E, m))))) {
//                 N = "Search direction has Infinity or NaN";
//                 break
//             }
//             if ((_ = f(p)) < n) {
//                 N = "Newton step smaller than tol";
//                 break
//             }
//             for (k = 1, u = C(m, p), y = t; j < r && !(k * _ < n) && (y = S(t, v = P(p, k)), .1 * k * u <= (l = e(y)) - h || isNaN(l));) k *= .5, ++j;
//             if (k * _ < n) {
//                 N = "Line search step size smaller than tol";
//                 break
//             }
//             if (j === r) {
//                 N = "maxit reached during line search";
//                 break
//             }
//             E = T(S(E, P(((x = C(b = T(g = i(y), m), v)) + C(b, w = C(E, b))) / (x * x), A(v, v))), L(S(A(w, v), A(v, w)), x)), t = y, h = l, m = g, ++j
//         }
//         return {
//             solution: t,
//             f: h,
//             gradient: m,
//             invHessian: E,
//             iterations: j,
//             message: N
//         }
//     }, numeric.Dopri = function(t, e, n, i, r, o, s) {
//         this.x = t, this.y = e, this.f = n, this.ymid = i, this.iterations = r, this.events = s, this.message = o
//     }, numeric.Dopri.prototype._at = function(t, e) {
//         function n(t) {
//             return t * t
//         }
//         var i, r, o, s, a, l, u, c, h, d = this,
//             f = d.x,
//             p = d.y,
//             m = d.f,
//             g = d.ymid,
//             v = (f.length, Math.floor, .5),
//             y = numeric.add,
//             b = numeric.mul,
//             w = numeric.sub;
//         return i = f[e], r = f[e + 1], s = p[e], a = p[e + 1], o = i + v * (r - i), l = g[e], u = w(m[e], b(s, 1 / (i - o) + 2 / (i - r))), c = w(m[e + 1], b(a, 1 / (r - o) + 2 / (r - i))), y(y(y(y(b(s, (h = [n(t - r) * (t - o) / n(i - r) / (i - o), n(t - i) * n(t - r) / n(i - o) / n(r - o), n(t - i) * (t - o) / n(r - i) / (r - o), (t - i) * n(t - r) * (t - o) / n(i - r) / (i - o), (t - r) * n(t - i) * (t - o) / n(i - r) / (r - o)])[0]), b(l, h[1])), b(a, h[2])), b(u, h[3])), b(c, h[4]))
//     }, numeric.Dopri.prototype.at = function(t) {
//         var e, n, i, r = Math.floor;
//         if ("number" != typeof t) {
//             var o = t.length,
//                 s = Array(o);
//             for (e = o - 1; - 1 !== e; --e) s[e] = this.at(t[e]);
//             return s
//         }
//         var a = this.x;
//         for (e = 0, n = a.length - 1; 1 < n - e;) a[i = r(.5 * (e + n))] <= t ? e = i : n = i;
//         return this._at(t, e)
//     }, numeric.dopri = function(t, e, n, i, r, o, s) {
//         void 0 === r && (r = 1e-6), void 0 === o && (o = 1e3);
//         var a, l, u, c, h, d, f, p, m, g, v, y, b, w = [t],
//             x = [n],
//             k = [i(t, n)],
//             _ = [],
//             E = .2,
//             C = [.075, .225],
//             T = [44 / 45, -56 / 15, 32 / 9],
//             S = [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
//             A = [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
//             L = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84],
//             P = [.10013431883002395, 0, .3918321794184259, -.02982460176594817, .05893268337240795, -.04497888809104361, .023904308236133973],
//             M = [.2, .3, .8, 8 / 9, 1, 1],
//             D = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, .025],
//             R = 0,
//             j = (e - t) / 10,
//             N = 0,
//             $ = numeric.add,
//             q = numeric.mul,
//             H = (Math.max, Math.min),
//             I = Math.abs,
//             O = numeric.norminf,
//             F = Math.pow,
//             B = numeric.any,
//             V = numeric.lt,
//             W = numeric.and,
//             U = (numeric.sub, new numeric.Dopri(w, x, k, _, -1, ""));
//         for ("function" == typeof s && (v = s(t, n)); t < e && N < o;) {
//             if (++N, e < t + j && (j = e - t), a = i(t + M[0] * j, $(n, q(E * j, k[R]))), l = i(t + M[1] * j, $($(n, q(C[0] * j, k[R])), q(C[1] * j, a))), u = i(t + M[2] * j, $($($(n, q(T[0] * j, k[R])), q(T[1] * j, a)), q(T[2] * j, l))), c = i(t + M[3] * j, $($($($(n, q(S[0] * j, k[R])), q(S[1] * j, a)), q(S[2] * j, l)), q(S[3] * j, u))), h = i(t + M[4] * j, $($($($($(n, q(A[0] * j, k[R])), q(A[1] * j, a)), q(A[2] * j, l)), q(A[3] * j, u)), q(A[4] * j, c))), d = i(t + j, m = $($($($($(n, q(k[R], j * L[0])), q(l, j * L[2])), q(u, j * L[3])), q(c, j * L[4])), q(h, j * L[5]))), r < (g = "number" == typeof(f = $($($($($(q(k[R], j * D[0]), q(l, j * D[2])), q(u, j * D[3])), q(c, j * D[4])), q(h, j * D[5])), q(d, j * D[6]))) ? I(f) : O(f))) {
//                 if (t + (j = .2 * j * F(r / g, .25)) !== t) continue;
//                 U.msg = "Step size became too small";
//                 break
//             }
//             if (_[R] = $($($($($($(n, q(k[R], j * P[0])), q(l, j * P[2])), q(u, j * P[3])), q(c, j * P[4])), q(h, j * P[5])), q(d, j * P[6])), w[++R] = t + j, x[R] = m, k[R] = d, "function" == typeof s) {
//                 var z, X, Y = t,
//                     Q = t + .5 * j;
//                 if (y = s(Q, _[R - 1]), B(b = W(V(v, 0), V(0, y))) || (Y = Q, v = y, y = s(Q = t + j, m), b = W(V(v, 0), V(0, y))), B(b)) {
//                     for (var K, G, J = 0, Z = 1, tt = 1;;) {
//                         if ("number" == typeof v) X = (tt * y * Y - Z * v * Q) / (tt * y - Z * v);
//                         else
//                             for (X = Q, p = v.length - 1; - 1 !== p; --p) v[p] < 0 && 0 < y[p] && (X = H(X, (tt * y[p] * Y - Z * v[p] * Q) / (tt * y[p] - Z * v[p])));
//                         if (X <= Y || Q <= X) break;
//                         G = s(X, z = U._at(X, R - 1)), B(K = W(V(v, 0), V(0, G))) ? (Q = X, y = G, b = K, -(tt = 1) === J ? Z *= .5 : Z = 1, J = -1) : (Y = X, v = G, (Z = 1) === J ? tt *= .5 : tt = 1, J = 1)
//                     }
//                     return m = U._at(.5 * (t + X), R - 1), U.f[R] = i(X, z), U.x[R] = X, U.y[R] = z, U.ymid[R - 1] = m, U.events = b, U.iterations = N, U
//                 }
//             }
//             t += j, n = m, v = y, j = H(.8 * j * F(r / g, .25), 4 * j)
//         }
//         return U.iterations = N, U
//     }, numeric.LU = function(t, e) {
//         e = e || !1;
//         var n, i, r, o, s, a, l, u, c, h = Math.abs,
//             d = t.length,
//             f = d - 1,
//             p = new Array(d);
//         for (e || (t = numeric.clone(t)), r = 0; r < d; ++r) {
//             for (c = h((a = t[l = r])[r]), i = r + 1; i < d; ++i) c < (o = h(t[i][r])) && (c = o, l = i);
//             for ((p[r] = l) != r && (t[r] = t[l], t[l] = a, a = t[r]), s = a[r], n = r + 1; n < d; ++n) t[n][r] /= s;
//             for (n = r + 1; n < d; ++n) {
//                 for (u = t[n], i = r + 1; i < f; ++i) u[i] -= u[r] * a[i], u[++i] -= u[r] * a[i];
//                 i === f && (u[i] -= u[r] * a[i])
//             }
//         }
//         return {
//             LU: t,
//             P: p
//         }
//     }, numeric.LUsolve = function(t, e) {
//         var n, i, r, o, s, a = t.LU,
//             l = a.length,
//             u = numeric.clone(e),
//             c = t.P;
//         for (n = l - 1; - 1 !== n; --n) u[n] = e[n];
//         for (n = 0; n < l; ++n)
//             for (r = c[n], c[n] !== n && (s = u[n], u[n] = u[r], u[r] = s), o = a[n], i = 0; i < n; ++i) u[n] -= u[i] * o[i];
//         for (n = l - 1; 0 <= n; --n) {
//             for (o = a[n], i = n + 1; i < l; ++i) u[n] -= u[i] * o[i];
//             u[n] /= o[n]
//         }
//         return u
//     }, numeric.solve = function(t, e, n) {
//         return numeric.LUsolve(numeric.LU(t, n), e)
//     }, numeric.echelonize = function(t) {
//         var e, n, i, r, o, s, a, l, u = numeric.dim(t),
//             c = u[0],
//             h = u[1],
//             d = numeric.identity(c),
//             f = Array(c),
//             p = Math.abs,
//             m = numeric.diveq;
//         for (t = numeric.clone(t), e = 0; e < c; ++e) {
//             for (i = 0, o = t[e], s = d[e], n = 1; n < h; ++n) p(o[i]) < p(o[n]) && (i = n);
//             for (m(s, o[f[e] = i]), m(o, o[i]), n = 0; n < c; ++n)
//                 if (n !== e) {
//                     for (l = (a = t[n])[i], r = h - 1; - 1 !== r; --r) a[r] -= o[r] * l;
//                     for (a = d[n], r = c - 1; - 1 !== r; --r) a[r] -= s[r] * l
//                 }
//         }
//         return {
//             I: d,
//             A: t,
//             P: f
//         }
//     }, numeric.__solveLP = function(t, e, n, i, r, o, s) {
//         var a, l, u, c, h = numeric.sum,
//             d = (numeric.log, numeric.mul),
//             f = numeric.sub,
//             p = numeric.dot,
//             m = numeric.div,
//             g = numeric.add,
//             v = t.length,
//             y = n.length,
//             b = !1,
//             w = 0,
//             x = 1,
//             k = (numeric.transpose(e), numeric.svd, numeric.transpose),
//             _ = (numeric.leq, Math.sqrt),
//             E = Math.abs,
//             C = (numeric.muleq, numeric.norminf, numeric.any, Math.min),
//             T = numeric.all,
//             S = numeric.gt,
//             A = Array(v),
//             L = Array(y),
//             P = (numeric.rep([y], 1), numeric.solve),
//             M = f(n, p(e, o)),
//             D = p(t, t);
//         for (u = w; u < r; ++u) {
//             var R, j;
//             for (R = y - 1; - 1 !== R; --R) L[R] = m(e[R], M[R]);
//             var N = k(L);
//             for (R = v - 1; - 1 !== R; --R) A[R] = h(N[R]);
//             x = .25 * E(D / p(t, A));
//             var $ = 100 * _(D / p(A, A));
//             for ((!isFinite(x) || $ < x) && (x = $), c = g(t, d(x, A)), l = p(N, L), R = v - 1; - 1 !== R; --R) l[R][R] += 1;
//             var q = m(M, p(e, j = P(l, m(c, x), !0))),
//                 H = 1;
//             for (R = y - 1; - 1 !== R; --R) q[R] < 0 && (H = C(H, -.999 * q[R]));
//             if (!T(S(M = f(n, p(e, a = f(o, d(j, H)))), 0))) return {
//                 solution: o,
//                 message: "",
//                 iterations: u
//             };
//             if (o = a, x < i) return {
//                 solution: a,
//                 message: "",
//                 iterations: u
//             };
//             if (s) {
//                 var I = p(t, c),
//                     O = p(e, c);
//                 for (b = !0, R = y - 1; - 1 !== R; --R)
//                     if (I * O[R] < 0) {
//                         b = !1;
//                         break
//                     }
//             } else b = !(0 <= o[v - 1]);
//             if (b) return {
//                 solution: a,
//                 message: "Unbounded",
//                 iterations: u
//             }
//         }
//         return {
//             solution: o,
//             message: "maximum iteration count exceeded",
//             iterations: u
//         }
//     }, numeric._solveLP = function(t, e, n, i, r) {
//         var o = t.length,
//             s = n.length,
//             a = (numeric.sum, numeric.log, numeric.mul, numeric.sub),
//             l = numeric.dot,
//             u = (numeric.div, numeric.add, numeric.rep([o], 0).concat([1])),
//             c = numeric.rep([s, 1], -1),
//             h = numeric.blockMatrix([
//                 [e, c]
//             ]),
//             d = n,
//             f = numeric.rep([o], 0).concat(Math.max(0, numeric.sup(numeric.neg(n))) + 1),
//             p = numeric.__solveLP(u, h, d, i, r, f, !1),
//             m = numeric.clone(p.solution);
//         if (m.length = o, numeric.inf(a(n, l(e, m))) < 0) return {
//             solution: NaN,
//             message: "Infeasible",
//             iterations: p.iterations
//         };
//         var g = numeric.__solveLP(t, e, n, i, r - p.iterations, m, !0);
//         return g.iterations += p.iterations, g
//     }, numeric.solveLP = function(t, e, n, i, r, o, s) {
//         if (void 0 === s && (s = 1e3), void 0 === o && (o = numeric.epsilon), void 0 === i) return numeric._solveLP(t, e, n, o, s);
//         var a, l = i.length,
//             u = i[0].length,
//             c = e.length,
//             h = numeric.echelonize(i),
//             d = numeric.rep([u], 0),
//             f = h.P,
//             p = [];
//         for (a = f.length - 1; - 1 !== a; --a) d[f[a]] = 1;
//         for (a = u - 1; - 1 !== a; --a) 0 === d[a] && p.push(a);
//         var m = numeric.getRange,
//             g = numeric.linspace(0, l - 1),
//             v = numeric.linspace(0, c - 1),
//             y = m(i, g, p),
//             b = m(e, v, f),
//             w = m(e, v, p),
//             x = numeric.dot,
//             k = numeric.sub,
//             _ = x(b, h.I),
//             E = k(w, x(_, y)),
//             C = k(n, x(_, r)),
//             T = Array(f.length),
//             S = Array(p.length);
//         for (a = f.length - 1; - 1 !== a; --a) T[a] = t[f[a]];
//         for (a = p.length - 1; - 1 !== a; --a) S[a] = t[p[a]];
//         var A = k(S, x(T, x(h.I, y))),
//             L = numeric._solveLP(A, E, C, o, s),
//             P = L.solution;
//         if (P != P) return L;
//         var M = x(h.I, k(r, x(y, P))),
//             D = Array(t.length);
//         for (a = f.length - 1; - 1 !== a; --a) D[f[a]] = M[a];
//         for (a = p.length - 1; - 1 !== a; --a) D[p[a]] = P[a];
//         return {
//             solution: D,
//             message: L.message,
//             iterations: L.iterations
//         }
//     }, numeric.MPStoLP = function(e) {
//         function t(t) {
//             throw new Error("MPStoLP: " + t + "\nLine " + n + ": " + e[n] + "\nCurrent state: " + a[s] + "\n")
//         }
//         e instanceof String && e.split("\n");
//         var n, i, r, o, s = 0,
//             a = ["Initial state", "NAME", "ROWS", "COLUMNS", "RHS", "BOUNDS", "ENDATA"],
//             l = e.length,
//             u = 0,
//             c = {},
//             h = [],
//             d = 0,
//             f = {},
//             p = 0,
//             m = [],
//             g = [],
//             v = [];
//         for (n = 0; n < l; ++n) {
//             var y = (r = e[n]).match(/\S*/g),
//                 b = [];
//             for (i = 0; i < y.length; ++i) "" !== y[i] && b.push(y[i]);
//             if (0 !== b.length) {
//                 for (i = 0; i < a.length && r.substr(0, a[i].length) !== a[i]; ++i);
//                 if (i < a.length) {
//                     if (1 === (s = i) && (o = b[1]), 6 === i) return {
//                         name: o,
//                         c: m,
//                         A: numeric.transpose(g),
//                         b: v,
//                         rows: c,
//                         vars: f
//                     }
//                 } else switch (s) {
//                     case 0:
//                     case 1:
//                         t("Unexpected line");
//                     case 2:
//                         switch (b[0]) {
//                             case "N":
//                                 0 === u ? u = b[1] : t("Two or more N rows");
//                                 break;
//                             case "L":
//                                 h[c[b[1]] = d] = 1, v[d] = 0, ++d;
//                                 break;
//                             case "G":
//                                 h[c[b[1]] = d] = -1, v[d] = 0, ++d;
//                                 break;
//                             case "E":
//                                 h[c[b[1]] = d] = 0, v[d] = 0, ++d;
//                                 break;
//                             default:
//                                 t("Parse error " + numeric.prettyPrint(b))
//                         }
//                         break;
//                     case 3:
//                         f.hasOwnProperty(b[0]) || (m[f[b[0]] = p] = 0, g[p] = numeric.rep([d], 0), ++p);
//                         var w = f[b[0]];
//                         for (i = 1; i < b.length; i += 2)
//                             if (b[i] !== u) {
//                                 var x = c[b[i]];
//                                 g[w][x] = (h[x] < 0 ? -1 : 1) * parseFloat(b[i + 1])
//                             } else m[w] = parseFloat(b[i + 1]);
//                         break;
//                     case 4:
//                         for (i = 1; i < b.length; i += 2) v[c[b[i]]] = (h[c[b[i]]] < 0 ? -1 : 1) * parseFloat(b[i + 1]);
//                         break;
//                     case 5:
//                         break;
//                     case 6:
//                         t("Internal error")
//                 }
//             }
//         }
//         t("Reached end of file without ENDATA")
//     }, numeric.seedrandom = {
//         pow: Math.pow,
//         random: Math.random
//     },
//     function(r, o, l, s, a, u, c) {
//         function h(t) {
//             var e, n, a = this,
//                 i = t.length,
//                 r = 0,
//                 o = a.i = a.j = a.m = 0;
//             for (a.S = [], a.c = [], i || (t = [i++]); r < l;) a.S[r] = r++;
//             for (r = 0; r < l; r++) o = p(o + (e = a.S[r]) + t[r % i]), n = a.S[o], a.S[r] = n, a.S[o] = e;
//             a.g = function(t) {
//                 var e = a.S,
//                     n = p(a.i + 1),
//                     i = e[n],
//                     r = p(a.j + i),
//                     o = e[r];
//                 e[n] = o, e[r] = i;
//                 for (var s = e[p(i + o)]; --t;) o = e[r = p(r + (i = e[n = p(n + 1)]))], e[n] = o, e[r] = i, s = s * l + e[p(i + o)];
//                 return a.i = n, a.j = r, s
//             }, a.g(l)
//         }

//         function d(t, e, n, i, r) {
//             if (n = [], r = typeof t, e && "object" == r)
//                 for (i in t)
//                     if (i.indexOf("S") < 5) try {
//                         n.push(d(t[i], e - 1))
//                     } catch (u) {}
//             return n.length ? n : t + ("string" != r ? "\0" : "")
//         }

//         function f(t, e, n, i) {
//             for (t += "", i = n = 0; i < t.length; i++) e[p(i)] = p((n ^= 19 * e[p(i)]) + t.charCodeAt(i));
//             for (i in t = "", e) t += String.fromCharCode(e[i]);
//             return t
//         }

//         function p(t) {
//             return t & l - 1
//         }
//         o.seedrandom = function(t, e) {
//             var i, n = [];
//             return t = f(d(e ? [t, r] : arguments.length ? t : [(new Date).getTime(), r, window], 3), n), f((i = new h(n)).S, r), o.random = function() {
//                 for (var t = i.g(s), e = c, n = 0; t < a;) t = (t + n) * l, e *= l, n = i.g(1);
//                 for (; u <= t;) t /= 2, e /= 2, n >>>= 1;
//                 return (t + n) / e
//             }, t
//         }, c = o.pow(l, s), a = o.pow(2, a), u = 2 * a, f(o.random(), r)
//     }([], numeric.seedrandom, 256, 6, 52),
//     function() {
//         function v(t) {
//             if ("object" != typeof t) return t;
//             var e, n = [],
//                 i = t.length;
//             for (e = 0; e < i; e++) n[e + 1] = v(t[e]);
//             return n
//         }

//         function y(t) {
//             if ("object" != typeof t) return t;
//             var e, n = [],
//                 i = t.length;
//             for (e = 1; e < i; e++) n[e - 1] = y(t[e]);
//             return n
//         }

//         function z(t, e, n) {
//             var i, r, o, s, a;
//             for (o = 1; o <= n; o += 1) {
//                 for (t[o][o] = 1 / t[o][o], a = -t[o][o], i = 1; i < o; i += 1) t[i][o] = a * t[i][o];
//                 if (n < (s = o + 1)) break;
//                 for (r = s; r <= n; r += 1)
//                     for (a = t[o][r], t[o][r] = 0, i = 1; i <= o; i += 1) t[i][r] = t[i][r] + a * t[i][o]
//             }
//         }

//         function X(t, e, n, i) {
//             var r, o, s, a;
//             for (o = 1; o <= n; o += 1) {
//                 for (a = 0, r = 1; r < o; r += 1) a += t[r][o] * i[r];
//                 i[o] = (i[o] - a) / t[o][o]
//             }
//             for (s = 1; s <= n; s += 1)
//                 for (i[o = n + 1 - s] = i[o] / t[o][o], a = -i[o], r = 1; r < o; r += 1) i[r] = i[r] + a * t[r][o]
//         }

//         function Y(t, e, n, i) {
//             var r, o, s, a, l, u;
//             for (o = 1; o <= n; o += 1) {
//                 if (u = 0, (s = (i[1] = o) - 1) < 1) {
//                     if ((u = t[o][o] - u) <= 0) break;
//                     t[o][o] = Math.sqrt(u)
//                 } else {
//                     for (a = 1; a <= s; a += 1) {
//                         for (l = t[a][o], r = 1; r < a; r += 1) l -= t[r][o] * t[r][a];
//                         l /= t[a][a], u += (t[a][o] = l) * l
//                     }
//                     if ((u = t[o][o] - u) <= 0) break;
//                     t[o][o] = Math.sqrt(u)
//                 }
//                 i[1] = 0
//             }
//         }

//         function b(t, e, n, i, r, o, s, a, l, u, c, h, d, f, p, m) {
//             function g() {
//                 for (f[1] = f[1] + 1, _ = P, x = 1; x <= u; x += 1) {
//                     for (_ += 1, $ = -a[x], k = 1; k <= i; k += 1) $ += s[k][x] * r[k];
//                     if (Math.abs($) < W && ($ = 0), c < x) p[_] = $;
//                     else if (p[_] = -Math.abs($), 0 < $) {
//                         for (k = 1; k <= i; k += 1) s[k][x] = -s[k][x];
//                         a[x] = -a[x]
//                     }
//                 }
//                 for (x = 1; x <= d; x += 1) p[P + h[x]] = 0;
//                 for (N = D = 0, x = 1; x <= u; x += 1) p[P + x] < N * p[j + x] && (N = p[P + (D = x)] / p[j + x]);
//                 return 0 === D ? 999 : 0
//             }

//             function v() {
//                 for (x = 1; x <= i; x += 1) {
//                     for ($ = 0, k = 1; k <= i; k += 1) $ += t[k][x] * s[k][D];
//                     p[x] = $
//                 }
//                 for (E = S, x = 1; x <= i; x += 1) p[E + x] = 0;
//                 for (k = d + 1; k <= i; k += 1)
//                     for (x = 1; x <= i; x += 1) p[E + x] = p[E + x] + t[x][k] * p[k];
//                 for (B = !0, x = d; 1 <= x; x -= 1) {
//                     for ($ = p[x], E = (_ = L + x * (x + 3) / 2) - x, k = x + 1; k <= d; k += 1) $ -= p[_] * p[A + k], _ += k;
//                     if ($ /= p[E], p[A + x] = $, h[x] < c) break;
//                     if ($ < 0) break;
//                     B = !1, T = x
//                 }
//                 if (!B)
//                     for (q = p[M + T] / p[A + T], x = 1; x <= d && !(h[x] < c) && !(p[A + x] < 0); x += 1)(N = p[M + x] / p[A + x]) < q && (q = N, T = x);
//                 for ($ = 0, x = S + 1; x <= S + i; x += 1) $ += p[x] * p[x];
//                 if (Math.abs($) <= W) {
//                     if (B) return m[1] = 1, 999;
//                     for (x = 1; x <= d; x += 1) p[M + x] = p[M + x] - q * p[A + x];
//                     return p[M + d + 1] = p[M + d + 1] + q, 700
//                 }
//                 for ($ = 0, x = 1; x <= i; x += 1) $ += p[S + x] * s[x][D];
//                 for (H = -p[P + D] / $, V = !0, B || q < H && (H = q, V = !1), x = 1; x <= i; x += 1) r[x] = r[x] + H * p[S + x], Math.abs(r[x]) < W && (r[x] = 0);
//                 for (o[1] = o[1] + H * $ * (H / 2 + p[M + d + 1]), x = 1; x <= d; x += 1) p[M + x] = p[M + x] - H * p[A + x];
//                 if (p[M + d + 1] = p[M + d + 1] + H, !V) {
//                     for ($ = -a[D], k = 1; k <= i; k += 1) $ += r[k] * s[k][D];
//                     if (c < D) p[P + D] = $;
//                     else if (p[P + D] = -Math.abs($), 0 < $) {
//                         for (k = 1; k <= i; k += 1) s[k][D] = -s[k][D];
//                         a[D] = -a[D]
//                     }
//                     return 700
//                 }
//                 for (h[d += 1] = D, _ = L + (d - 1) * d / 2 + 1, x = 1; x <= d - 1; x += 1) p[_] = p[x], _ += 1;
//                 if (d === i) p[_] = p[i];
//                 else {
//                     for (x = i; d + 1 <= x && 0 !== p[x] && (I = Math.max(Math.abs(p[x - 1]), Math.abs(p[x])), O = Math.min(Math.abs(p[x - 1]), Math.abs(p[x])), N = 0 <= p[x - 1] ? Math.abs(I * Math.sqrt(1 + O * O / (I * I))) : -Math.abs(I * Math.sqrt(1 + O * O / (I * I))), I = p[x - 1] / N, O = p[x] / N, 1 !== I); x -= 1)
//                         if (0 === I)
//                             for (p[x - 1] = O * N, k = 1; k <= i; k += 1) N = t[k][x - 1], t[k][x - 1] = t[k][x], t[k][x] = N;
//                         else
//                             for (p[x - 1] = N, F = O / (1 + I), k = 1; k <= i; k += 1) N = I * t[k][x - 1] + O * t[k][x], t[k][x] = F * (t[k][x - 1] + N) - t[k][x], t[k][x - 1] = N;
//                     p[_] = p[d]
//                 }
//                 return 0
//             }

//             function y() {
//                 if (0 === p[E = (_ = L + T * (T + 1) / 2 + 1) + T]) return 798;
//                 if (I = Math.max(Math.abs(p[E - 1]), Math.abs(p[E])), O = Math.min(Math.abs(p[E - 1]), Math.abs(p[E])), N = 0 <= p[E - 1] ? Math.abs(I * Math.sqrt(1 + O * O / (I * I))) : -Math.abs(I * Math.sqrt(1 + O * O / (I * I))), I = p[E - 1] / N, O = p[E] / N, 1 === I) return 798;
//                 if (0 === I) {
//                     for (x = T + 1; x <= d; x += 1) N = p[E - 1], p[E - 1] = p[E], p[E] = N, E += x;
//                     for (x = 1; x <= i; x += 1) N = t[x][T], t[x][T] = t[x][T + 1], t[x][T + 1] = N
//                 } else {
//                     for (F = O / (1 + I), x = T + 1; x <= d; x += 1) N = I * p[E - 1] + O * p[E], p[E] = F * (p[E - 1] + N) - p[E], p[E - 1] = N, E += x;
//                     for (x = 1; x <= i; x += 1) N = I * t[x][T] + O * t[x][T + 1], t[x][T + 1] = F * (t[x][T] + N) - t[x][T + 1], t[x][T] = N
//                 }
//                 return 0
//             }

//             function b() {
//                 for (E = _ - T, x = 1; x <= T; x += 1) p[E] = p[_], _ += 1, E += 1;
//                 return p[M + T] = p[M + T + 1], h[T] = h[T + 1], (T += 1) < d ? 797 : 0
//             }

//             function w() {
//                 return p[M + d] = p[M + d + 1], p[M + d + 1] = 0, h[d] = 0, d -= 1, f[2] = f[2] + 1, 0
//             }
//             var x, k, _, E, C, T, S, A, L, P, M, D, R, j, N, $, q, H, I, O, F, B, V, W, U;
//             for (R = Math.min(i, u), _ = 2 * i + R * (R + 5) / 2 + 2 * u + 1, W = 1e-60; 1 + .1 * (W += W) <= 1 || 1 + .2 * W <= 1;);
//             for (x = 1; x <= i; x += 1) p[x] = e[x];
//             for (x = i + 1; x <= _; x += 1) p[x] = 0;
//             for (x = 1; x <= u; x += 1) h[x] = 0;
//             if (C = [], 0 === m[1]) {
//                 if (Y(t, n, i, C), 0 !== C[1]) return void(m[1] = 2);
//                 X(t, n, i, e), z(t, n, i)
//             } else {
//                 for (k = 1; k <= i; k += 1)
//                     for (r[k] = 0, x = 1; x <= k; x += 1) r[k] = r[k] + t[x][k] * e[x];
//                 for (k = 1; k <= i; k += 1)
//                     for (e[k] = 0, x = k; x <= i; x += 1) e[k] = e[k] + t[k][x] * r[x]
//             }
//             for (o[1] = 0, k = 1; k <= i; k += 1)
//                 for (r[k] = e[k], o[1] = o[1] + p[k] * r[k], p[k] = 0, x = k + 1; x <= i; x += 1) t[x][k] = 0;
//             for (o[1] = -o[1] / 2, m[1] = 0, j = (P = (L = (M = (A = (S = i) + i) + R) + R + 1) + R * (R + 1) / 2) + u, x = 1; x <= u; x += 1) {
//                 for ($ = 0, k = 1; k <= i; k += 1) $ += s[k][x] * s[k][x];
//                 p[j + x] = Math.sqrt($)
//             }
//             for (d = 0, f[1] = 0, U = f[2] = 0;;) {
//                 if (999 === (U = g())) return;
//                 for (; 0 !== (U = v());) {
//                     if (999 === U) return;
//                     if (700 === U)
//                         if (T === d) w();
//                         else {
//                             for (; y(), 797 === (U = b()););
//                             w()
//                         }
//                 }
//             }
//         }

//         function t(t, e, n, i, r, o) {
//             t = v(t), e = v(e), n = v(n);
//             var s, a, l, u, c, h, d = [],
//                 f = [],
//                 p = [],
//                 m = [],
//                 g = [];
//             if (r = r || 0, o = o ? v(o) : [undefined, 0], i = i ? v(i) : [], a = t.length - 1, l = n[1].length - 1, !i)
//                 for (s = 1; s <= l; s += 1) i[s] = 0;
//             for (s = 1; s <= l; s += 1) f[s] = 0;
//             for (u = 0, c = Math.min(a, l), s = 1; s <= a; s += 1) p[s] = 0;
//             for (d[1] = 0, s = 1; s <= 2 * a + c * (c + 5) / 2 + 2 * l + 1; s += 1) m[s] = 0;
//             for (s = 1; s <= 2; s += 1) g[s] = 0;
//             return b(t, e, a, a, p, d, n, i, a, l, r, f, u, g, m, o), h = "", 1 === o[1] && (h = "constraints are inconsistent, no solution!"), 2 === o[1] && (h = "matrix D in quadratic function is not positive definite!"), {
//                 solution: y(p),
//                 value: y(d),
//                 unconstrained_solution: y(e),
//                 iterations: y(g),
//                 iact: y(f),
//                 message: h
//             }
//         }
//         numeric.solveQP = t
//     }(), numeric.svd = function(t) {
//         function e(t, e) {
//             return t = Math.abs(t), (e = Math.abs(e)) < t ? t * Math.sqrt(1 + e * e / t / t) : 0 == e ? t : e * Math.sqrt(1 + t * t / e / e)
//         }
//         var n, i = numeric.epsilon,
//             r = 1e-64 / i,
//             o = 50,
//             s = 0,
//             a = 0,
//             l = 0,
//             u = 0,
//             c = 0,
//             h = numeric.clone(t),
//             d = h.length,
//             f = h[0].length;
//         if (d < f) throw "Need more rows than columns";
//         var p = new Array(f),
//             m = new Array(f);
//         for (a = 0; a < f; a++) p[a] = m[a] = 0;
//         var g = numeric.rep([f, f], 0),
//             v = 0,
//             y = 0,
//             b = 0,
//             w = 0,
//             x = 0,
//             k = 0,
//             _ = 0;
//         for (a = 0; a < f; a++) {
//             for (p[a] = y, _ = 0, c = a + 1, l = a; l < d; l++) _ += h[l][a] * h[l][a];
//             if (_ <= r) y = 0;
//             else
//                 for (v = h[a][a], y = Math.sqrt(_), 0 <= v && (y = -y), b = v * y - _, h[a][a] = v - y, l = c; l < f; l++) {
//                     for (_ = 0, u = a; u < d; u++) _ += h[u][a] * h[u][l];
//                     for (v = _ / b, u = a; u < d; u++) h[u][l] += v * h[u][a]
//                 }
//             for (m[a] = y, _ = 0, l = c; l < f; l++) _ += h[a][l] * h[a][l];
//             if (_ <= r) y = 0;
//             else {
//                 for (v = h[a][a + 1], y = Math.sqrt(_), 0 <= v && (y = -y), b = v * y - _, h[a][a + 1] = v - y, l = c; l < f; l++) p[l] = h[a][l] / b;
//                 for (l = c; l < d; l++) {
//                     for (_ = 0, u = c; u < f; u++) _ += h[l][u] * h[a][u];
//                     for (u = c; u < f; u++) h[l][u] += _ * p[u]
//                 }
//             }
//             w < (x = Math.abs(m[a]) + Math.abs(p[a])) && (w = x)
//         }
//         for (a = f - 1; - 1 != a; a += -1) {
//             if (0 != y) {
//                 for (b = y * h[a][a + 1], l = c; l < f; l++) g[l][a] = h[a][l] / b;
//                 for (l = c; l < f; l++) {
//                     for (_ = 0, u = c; u < f; u++) _ += h[a][u] * g[u][l];
//                     for (u = c; u < f; u++) g[u][l] += _ * g[u][a]
//                 }
//             }
//             for (l = c; l < f; l++) g[a][l] = 0, g[l][a] = 0;
//             g[a][a] = 1, y = p[a], c = a
//         }
//         for (a = f - 1; - 1 != a; a += -1) {
//             for (c = a + 1, y = m[a], l = c; l < f; l++) h[a][l] = 0;
//             if (0 != y) {
//                 for (b = h[a][a] * y, l = c; l < f; l++) {
//                     for (_ = 0, u = c; u < d; u++) _ += h[u][a] * h[u][l];
//                     for (v = _ / b, u = a; u < d; u++) h[u][l] += v * h[u][a]
//                 }
//                 for (l = a; l < d; l++) h[l][a] = h[l][a] / y
//             } else
//                 for (l = a; l < d; l++) h[l][a] = 0;
//             h[a][a] += 1
//         }
//         for (i *= w, u = f - 1; - 1 != u; u += -1)
//             for (var E = 0; E < o; E++) {
//                 var C = !1;
//                 for (c = u; - 1 != c; c += -1) {
//                     if (Math.abs(p[c]) <= i) {
//                         C = !0;
//                         break
//                     }
//                     if (Math.abs(m[c - 1]) <= i) break
//                 }
//                 if (!C) {
//                     s = 0;
//                     var T = c - (_ = 1);
//                     for (a = c; a < u + 1 && (v = _ * p[a], p[a] = s * p[a], !(Math.abs(v) <= i)); a++)
//                         for (b = e(v, y = m[a]), s = y / (m[a] = b), _ = -v / b, l = 0; l < d; l++) x = h[l][T], k = h[l][a], h[l][T] = x * s + k * _, h[l][a] = -x * _ + k * s
//                 }
//                 if (k = m[u], c == u) {
//                     if (k < 0)
//                         for (m[u] = -k, l = 0; l < f; l++) g[l][u] = -g[l][u];
//                     break
//                 }
//                 if (o - 1 <= E) throw "Error: no convergence.";
//                 for (w = m[c], y = e(v = (((x = m[u - 1]) - k) * (x + k) + ((y = p[u - 1]) - (b = p[u])) * (y + b)) / (2 * b * x), 1), v = v < 0 ? ((w - k) * (w + k) + b * (x / (v - y) - b)) / w : ((w - k) * (w + k) + b * (x / (v + y) - b)) / w, a = c + (_ = s = 1); a < u + 1; a++) {
//                     for (y = p[a], x = m[a], b = _ * y, y *= s, k = e(v, b), v = w * (s = v / (p[a - 1] = k)) + y * (_ = b / k), y = -w * _ + y * s, b = x * _, x *= s, l = 0; l < f; l++) w = g[l][a - 1], k = g[l][a], g[l][a - 1] = w * s + k * _, g[l][a] = -w * _ + k * s;
//                     for (k = e(v, b), v = (s = v / (m[a - 1] = k)) * y + (_ = b / k) * x, w = -_ * y + s * x, l = 0; l < d; l++) x = h[l][a - 1], k = h[l][a], h[l][a - 1] = x * s + k * _, h[l][a] = -x * _ + k * s
//                 }
//                 p[c] = 0, p[u] = v, m[u] = w
//             }
//         for (a = 0; a < m.length; a++) m[a] < i && (m[a] = 0);
//         for (a = 0; a < f; a++)
//             for (l = a - 1; 0 <= l; l--)
//                 if (m[l] < m[a]) {
//                     for (s = m[l], m[l] = m[a], m[a] = s, u = 0; u < h.length; u++) n = h[u][a], h[u][a] = h[u][l], h[u][l] = n;
//                     for (u = 0; u < g.length; u++) n = g[u][a], g[u][a] = g[u][l], g[u][l] = n;
//                     a = l
//                 } return {
//             U: h,
//             S: m,
//             V: g
//         }
//     };
// var SignaturePadSmooth = function(n, t) {
//         var d = -1,
//             b = t.takePointsEvery || 4,
//             w = t.thresholdSmooth || 20,
//             x = {
//                 stats: function(t) {
//                     for (var e, n = {
//                             mean: 0,
//                             variance: 0,
//                             deviation: 0
//                         }, i = t.length, r = 0, o = i; o--; r += t[o]);
//                     for (e = n.mean = r / i, o = i, r = 0; o--; r += Math.pow(t[o] - e, 2));
//                     return n.deviation = Math.sqrt(n.variance = r / i), n
//                 },
//                 generate141Matrix: function(t) {
//                     for (var e = [], n = 0; n < t; n++) {
//                         for (var i = [], r = 0; r < t; r++) r === n ? i.push(4) : 1 === Math.abs(n - r) ? i.push(1) : i.push(0);
//                         e.push(i)
//                     }
//                     return e
//                 },
//                 generateConstantMatrix: function(t) {
//                     var e = [];
//                     e.push(numeric.sub(numeric.mul(t[1], 6), t[0]));
//                     for (var n = 2; n < t.length - 2; n++) e.push(numeric.mul(t[n], 6));
//                     return e.push(numeric.sub(numeric.mul(t[t.length - 2], 6), t[t.length - 1])), e
//                 },
//                 convertBSplineControlPointsToBezierControlPoints: function(t) {
//                     for (var e = [], n = 0; n < t.length - 1; n++) {
//                         if (0 === n) var i = t[0];
//                         else i = s;
//                         var r = numeric.add(numeric.mul(2 / 3, t[n]), numeric.mul(1 / 3, t[n + 1])),
//                             o = numeric.add(numeric.mul(1 / 3, t[n]), numeric.mul(2 / 3, t[n + 1]));
//                         if (n == t.length - 2) var s = t[t.length - 1];
//                         else s = numeric.add(numeric.mul(1 / 6, t[n]), numeric.mul(2 / 3, t[n + 1]), numeric.mul(1 / 6, t[n + 2]));
//                         var a = [i, r, o, s];
//                         e.push(a)
//                     }
//                     return e
//                 },
//                 getBezierControlPoints: function(t) {
//                     if (t.length < 4) {
//                         if (3 === t.length) return [r = [t[0], t[1], t[1], t[2]]];
//                         if (2 === t.length) return [r = [t[0], t[0], t[1], t[1]]];
//                         if (1 === t.length) return [r = [t[0], t[0], t[0], t[0]]]
//                     }
//                     var e = x.generate141Matrix(t.length - 2),
//                         n = x.generateConstantMatrix(t),
//                         i = numeric.dot(numeric.inv(e), n);
//                     i.splice(0, 0, t[0]), i.push(t[t.length - 1]);
//                     var r = x.convertBSplineControlPointsToBezierControlPoints(i);
//                     return r
//                 }
//             },
//             f = {
//                 _subSample: function(t) {
//                     for (var e, n, i, r = 0, o = t.slice(), s = t.length - 1; 0 <= s; s -= 1) {
//                         if (1 <= (e = t[s]).length && e.length <= 2 && e[0].x === d && e[0].y === d) {
//                             r = s;
//                             break
//                         }
//                         i = [];
//                         for (var a = e[0].time, l = (e[e.length - 1].time - a) / e.length, u = w < l ? b : Math.floor(b / 2), c = 0, h = e.length; c < h; c += 1) c % u == 0 && i.push(e[c]);
//                         (h - 1) % u != 0 && i.push(e[h - 1]), n || (n = i[i.length - 1]), o[s] = f._interpolateWithBeziers(i)
//                     }
//                     return r && o.splice(r, 1), n && o.push([{
//                         x: d,
//                         y: d,
//                         color: n.color,
//                         time: n.time + 1
//                     }]), o
//                 },
//                 _interpolateWithBeziers: function(t) {
//                     if (b < 2) return t;
//                     for (var e, n, i, r, o, s, a = new Array(t.length), l = [], u = .35, c = u * u, h = c * u, d = .65, f = d * d, p = f * d, m = 0, g = t.length; m < g; m += 1) n = t[m], a[m] = [n.x, n.y];
//                     for (var v = 0, y = (e = x.getBezierControlPoints(a)).length; v < y; v += 1) i = e[v], s = t[v + 1] ? t[v + 1].time - t[v].time : w, r = {
//                         x: p * i[0][0] + 3 * f * u * i[1][0] + 3 * d * c * i[2][0] + h * i[3][0],
//                         y: p * i[0][1] + 3 * f * u * i[1][1] + 3 * d * c * i[2][1] + h * i[3][1],
//                         color: t[v].color,
//                         time: Math.floor(t[v].time + s * u)
//                     }, o = {
//                         x: h * i[0][0] + 3 * c * d * i[1][0] + 3 * u * f * i[2][0] + p * i[3][0],
//                         y: h * i[0][1] + 3 * c * d * i[1][1] + 3 * u * f * i[2][1] + p * i[3][1],
//                         color: t[v].color,
//                         time: Math.floor(t[v].time + s * d)
//                     }, l.push(t[v]), l.push(r), l.push(o);
//                     return l.push(t[t.length - 1]), l
//                 },
//                 onEndCallBack: function() {
//                     console.time("Processing smooth");
//                     var t = n.toData(),
//                         e = f._subSample(t);
//                     n.fromData(e), console.timeEnd("Processing smooth")
//                 }
//             };
//         return f.onEndCallBack
//     },
//     _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
//         return typeof t
//     } : function(t) {
//         return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
//     },
//     windowIsDefined = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window));
// ! function(t) {
//     if ("function" == typeof define && define.amd) define(["jquery"], t);
//     else if ("object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports) {
//         var e;
//         try {
//             e = require("jquery")
//         } catch (n) {
//             e = null
//         }
//         module.exports = t(e)
//     } else window && (window.Slider = t(window.jQuery))
// }(function(t) {
//     var mt, gt = "slider",
//         vt = "bootstrapSlider";
//     return windowIsDefined && !window.console && (window.console = {}), windowIsDefined && !window.console.log && (window.console.log = function() {}), windowIsDefined && !window.console.warn && (window.console.warn = function() {}),
//         function(t) {
//             "use strict";

//             function e() {}

//             function n(c) {
//                 function n(t) {
//                     t.prototype.option || (t.prototype.option = function(t) {
//                         c.isPlainObject(t) && (this.options = c.extend(!0, this.options, t))
//                     })
//                 }

//                 function i(l, u) {
//                     c.fn[l] = function(e) {
//                         if ("string" == typeof e) {
//                             for (var t = d.call(arguments, 1), n = 0, i = this.length; n < i; n++) {
//                                 var r = this[n],
//                                     o = c.data(r, l);
//                                 if (o)
//                                     if (c.isFunction(o[e]) && "_" !== e.charAt(0)) {
//                                         var s = o[e].apply(o, t);
//                                         if (s !== undefined && s !== o) return s
//                                     } else h("no such method '" + e + "' for " + l + " instance");
//                                 else h("cannot call methods on " + l + " prior to initialization; attempted to call '" + e + "'")
//                             }
//                             return this
//                         }
//                         var a = this.map(function() {
//                             var t = c.data(this, l);
//                             return t ? (t.option(e), t._init()) : (t = new u(this, e), c.data(this, l, t)), c(this)
//                         });
//                         return !a || 1 < a.length ? a : a[0]
//                     }
//                 }
//                 if (c) {
//                     var h = "undefined" == typeof console ? e : function(t) {
//                         console.error(t)
//                     };
//                     return c.bridget = function(t, e) {
//                         n(e), i(t, e)
//                     }, c.bridget
//                 }
//             }
//             var d = Array.prototype.slice;
//             n(t)
//         }(t),
//         function(F) {
//             function n(t, e) {
//                 function n(t, e) {
//                     var n = "data-slider-" + e.replace(/_/g, "-"),
//                         i = t.getAttribute(n);
//                     try {
//                         return JSON.parse(i)
//                     } catch (r) {
//                         return i
//                     }
//                 }
//                 this._state = {
//                     value: null,
//                     enabled: null,
//                     offset: null,
//                     size: null,
//                     percentage: null,
//                     inDrag: !1,
//                     over: !1
//                 }, this.ticksCallbackMap = {}, this.handleCallbackMap = {}, "string" == typeof t ? this.element = document.querySelector(t) : t instanceof HTMLElement && (this.element = t), e = e || {};
//                 for (var i = Object.keys(this.defaultOptions), r = 0; r < i.length; r++) {
//                     var o = i[r],
//                         s = e[o];
//                     s = null !== (s = void 0 !== s ? s : n(this.element, o)) ? s : this.defaultOptions[o], this.options || (this.options = {}), this.options[o] = s
//                 }
//                 if ("auto" === this.options.rtl) {
//                     var a = window.getComputedStyle(this.element);
//                     this.options.rtl = null != a ? "rtl" === a.direction : "rtl" === this.element.style.direction
//                 }
//                 "vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.rtl ? this.options.tooltip_position = "left" : this.options.tooltip_position = "right";
//                 var l, u, c, h, d, f = this.element.style.width,
//                     p = !1,
//                     m = this.element.parentNode;
//                 if (this.sliderElem) p = !0;
//                 else {
//                     this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider";
//                     var g = document.createElement("div");
//                     g.className = "slider-track", (u = document.createElement("div")).className = "slider-track-low", (l = document.createElement("div")).className = "slider-selection", (c = document.createElement("div")).className = "slider-track-high", (h = document.createElement("div")).className = "slider-handle min-slider-handle", h.setAttribute("role", "slider"), h.setAttribute("aria-valuemin", this.options.min), h.setAttribute("aria-valuemax", this.options.max), (d = document.createElement("div")).className = "slider-handle max-slider-handle", d.setAttribute("role", "slider"), d.setAttribute("aria-valuemin", this.options.min), d.setAttribute("aria-valuemax", this.options.max), g.appendChild(u), g.appendChild(l), g.appendChild(c), this.rangeHighlightElements = [];
//                     var v = this.options.rangeHighlights;
//                     if (Array.isArray(v) && 0 < v.length)
//                         for (var y = 0; y < v.length; y++) {
//                             var b = document.createElement("div"),
//                                 w = v[y]["class"] || "";
//                             b.className = "slider-rangeHighlight slider-selection " + w, this.rangeHighlightElements.push(b), g.appendChild(b)
//                         }
//                     var x = Array.isArray(this.options.labelledby);
//                     if (x && this.options.labelledby[0] && h.setAttribute("aria-labelledby", this.options.labelledby[0]), x && this.options.labelledby[1] && d.setAttribute("aria-labelledby", this.options.labelledby[1]), !x && this.options.labelledby && (h.setAttribute("aria-labelledby", this.options.labelledby), d.setAttribute("aria-labelledby", this.options.labelledby)), this.ticks = [], Array.isArray(this.options.ticks) && 0 < this.options.ticks.length) {
//                         for (this.ticksContainer = document.createElement("div"), this.ticksContainer.className = "slider-tick-container", r = 0; r < this.options.ticks.length; r++) {
//                             var k = document.createElement("div");
//                             if (k.className = "slider-tick", this.options.ticks_tooltip) {
//                                 var _ = this._addTickListener(),
//                                     E = _.addMouseEnter(this, k, r),
//                                     C = _.addMouseLeave(this, k);
//                                 this.ticksCallbackMap[r] = {
//                                     mouseEnter: E,
//                                     mouseLeave: C
//                                 }
//                             }
//                             this.ticks.push(k), this.ticksContainer.appendChild(k)
//                         }
//                         l.className += " tick-slider-selection"
//                     }
//                     if (this.tickLabels = [], Array.isArray(this.options.ticks_labels) && 0 < this.options.ticks_labels.length)
//                         for (this.tickLabelContainer = document.createElement("div"), this.tickLabelContainer.className = "slider-tick-label-container", r = 0; r < this.options.ticks_labels.length; r++) {
//                             var T = document.createElement("div"),
//                                 S = 0 === this.options.ticks_positions.length,
//                                 A = this.options.reversed && S ? this.options.ticks_labels.length - (r + 1) : r;
//                             T.className = "slider-tick-label", T.innerHTML = this.options.ticks_labels[A], this.tickLabels.push(T), this.tickLabelContainer.appendChild(T)
//                         }
//                     var L = function L(t) {
//                             var e = document.createElement("div");
//                             e.className = "tooltip-arrow";
//                             var n = document.createElement("div");
//                             n.className = "tooltip-inner", t.appendChild(e), t.appendChild(n)
//                         },
//                         P = document.createElement("div");
//                     P.className = "tooltip tooltip-main", P.setAttribute("role", "presentation"), L(P);
//                     var M = document.createElement("div");
//                     M.className = "tooltip tooltip-min", M.setAttribute("role", "presentation"), L(M);
//                     var D = document.createElement("div");
//                     D.className = "tooltip tooltip-max", D.setAttribute("role", "presentation"), L(D), this.sliderElem.appendChild(g), this.sliderElem.appendChild(P), this.sliderElem.appendChild(M), this.sliderElem.appendChild(D), this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer), this.ticksContainer && this.sliderElem.appendChild(this.ticksContainer), this.sliderElem.appendChild(h), this.sliderElem.appendChild(d), m.insertBefore(this.sliderElem, this.element), this.element.style.display = "none"
//                 }
//                 if (F && (this.$element = F(this.element), this.$sliderElem = F(this.sliderElem)), this.eventToCallbackMap = {}, this.sliderElem.id = this.options.id, this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, this.touchX = 0, this.touchY = 0, this.tooltip = this.sliderElem.querySelector(".tooltip-main"), this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"), this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"), this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"), this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"), this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"), B[this.options.scale] && (this.options.scale = B[this.options.scale]), !0 === p && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.sliderElem, "slider-rtl"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "right", "top",
//                         "width", "height"
//                     ].forEach(function(t) {
//                         this._removeProperty(this.trackLow, t), this._removeProperty(this.trackSelection, t), this._removeProperty(this.trackHigh, t)
//                     }, this), [this.handle1, this.handle2].forEach(function(t) {
//                         this._removeProperty(t, "left"), this._removeProperty(t, "right"), this._removeProperty(t, "top")
//                     }, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(t) {
//                         this._removeProperty(t, "left"), this._removeProperty(t, "right"), this._removeProperty(t, "top"), this._removeClass(t, "right"), this._removeClass(t, "left"), this._removeClass(t, "top")
//                     }, this)), "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = f, this.options.orientation = "horizontal", this.options.rtl ? this.stylePos = "right" : this.stylePos = "left", this.mousePos = "clientX", this.sizePos = "offsetWidth"), this.options.rtl && this._addClass(this.sliderElem, "slider-rtl"), this._setTooltipPosition(), Array.isArray(this.options.ticks) && 0 < this.options.ticks.length && (this.options.max = Math.max.apply(Math, this.options.ticks), this.options.min = Math.min.apply(Math, this.options.ticks)), Array.isArray(this.options.value) ? (this.options.range = !0, this._state.value = this.options.value) : this.options.range ? this._state.value = [this.options.value, this.options.max] : this._state.value = this.options.value, this.trackLow = u || this.trackLow, this.trackSelection = l || this.trackSelection, this.trackHigh = c || this.trackHigh, "none" === this.options.selection ? (this._addClass(this.trackLow, "hide"), this._addClass(this.trackSelection, "hide"), this._addClass(this.trackHigh, "hide")) : "after" !== this.options.selection && "before" !== this.options.selection || (this._removeClass(this.trackLow, "hide"), this._removeClass(this.trackSelection, "hide"), this._removeClass(this.trackHigh, "hide")), this.handle1 = h || this.handle1, this.handle2 = d || this.handle2, !0 === p)
//                     for (this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"), r = 0; r < this.ticks.length; r++) this._removeClass(this.ticks[r], "round triangle hide");
//                 if (-1 !== ["round", "triangle", "custom"].indexOf(this.options.handle))
//                     for (this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle), r = 0; r < this.ticks.length; r++) this._addClass(this.ticks[r], this.options.handle);
//                 if (this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this.setValue(this._state.value), this.handle1Keydown = this._keydown.bind(this, 0), this.handle1.addEventListener("keydown", this.handle1Keydown, !1), this.handle2Keydown = this._keydown.bind(this, 1), this.handle2.addEventListener("keydown", this.handle2Keydown, !1), this.mousedown = this._mousedown.bind(this), this.touchstart = this._touchstart.bind(this), this.touchmove = this._touchmove.bind(this), this.touchCapable) {
//                     var R = !1;
//                     try {
//                         var j = Object.defineProperty({}, "passive", {
//                             get: function I() {
//                                 R = !0
//                             }
//                         });
//                         window.addEventListener("test", null, j)
//                     } catch (O) {}
//                     var N = !!R && {
//                         passive: !0
//                     };
//                     this.sliderElem.addEventListener("touchstart", this.touchstart, N), this.sliderElem.addEventListener("touchmove", this.touchmove, N)
//                 }
//                 if (this.sliderElem.addEventListener("mousedown", this.mousedown, !1), this.resize = this._resize.bind(this), window.addEventListener("resize", this.resize, !1), "hide" === this.options.tooltip) this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide");
//                 else if ("always" === this.options.tooltip) this._showTooltip(), this._alwaysShowTooltip = !0;
//                 else {
//                     if (this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.options.ticks_tooltip) {
//                         var $ = this._addTickListener(),
//                             q = $.addMouseEnter(this, this.handle1),
//                             H = $.addMouseLeave(this, this.handle1);
//                         this.handleCallbackMap.handle1 = {
//                             mouseEnter: q,
//                             mouseLeave: H
//                         }, q = $.addMouseEnter(this, this.handle2), H = $.addMouseLeave(this, this.handle2), this.handleCallbackMap.handle2 = {
//                             mouseEnter: q,
//                             mouseLeave: H
//                         }
//                     } else this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1);
//                     this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1)
//                 }
//                 this.options.enabled ? this.enable() : this.disable()
//             }
//             var i = {
//                     formatInvalidInputErrorMsg: function e(t) {
//                         return "Invalid input value '" + t + "' passed in"
//                     },
//                     callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
//                 },
//                 B = {
//                     linear: {
//                         toValue: function u(t) {
//                             var e = t / 100 * (this.options.max - this.options.min),
//                                 n = !0;
//                             if (0 < this.options.ticks_positions.length) {
//                                 for (var i, r, o, s = 0, a = 1; a < this.options.ticks_positions.length; a++)
//                                     if (t <= this.options.ticks_positions[a]) {
//                                         i = this.options.ticks[a - 1], o = this.options.ticks_positions[a - 1], r = this.options.ticks[a], s = this.options.ticks_positions[a];
//                                         break
//                                     } e = i + (t - o) / (s - o) * (r - i), n = !1
//                             }
//                             var l = (n ? this.options.min : 0) + Math.round(e / this.options.step) * this.options.step;
//                             return l < this.options.min ? this.options.min : l > this.options.max ? this.options.max : l
//                         },
//                         toPercentage: function s(t) {
//                             if (this.options.max === this.options.min) return 0;
//                             if (0 < this.options.ticks_positions.length) {
//                                 for (var e, n, i, r = 0, o = 0; o < this.options.ticks.length; o++)
//                                     if (t <= this.options.ticks[o]) {
//                                         e = 0 < o ? this.options.ticks[o - 1] : 0, i = 0 < o ? this.options.ticks_positions[o - 1] : 0, n = this.options.ticks[o], r = this.options.ticks_positions[o];
//                                         break
//                                     } if (0 < o) return i + (t - e) / (n - e) * (r - i)
//                             }
//                             return 100 * (t - this.options.min) / (this.options.max - this.options.min)
//                         }
//                     },
//                     logarithmic: {
//                         toValue: function u(t) {
//                             var e = 1 - this.options.min,
//                                 n = Math.log(this.options.min + e),
//                                 i = Math.log(this.options.max + e),
//                                 r = Math.exp(n + (i - n) * t / 100) - e;
//                             return Math.round(r) === i ? i : (r = this.options.min + Math.round((r - this.options.min) / this.options.step) * this.options.step) < this.options.min ? this.options.min : r > this.options.max ? this.options.max : r
//                         },
//                         toPercentage: function s(t) {
//                             if (this.options.max === this.options.min) return 0;
//                             var e = 1 - this.options.min,
//                                 n = Math.log(this.options.max + e),
//                                 i = Math.log(this.options.min + e);
//                             return 100 * (Math.log(t + e) - i) / (n - i)
//                         }
//                     }
//                 };
//             if ((mt = function r(t, e) {
//                     return n.call(this, t, e), this
//                 }).prototype = {
//                     _init: function o() {},
//                     constructor: mt,
//                     defaultOptions: {
//                         id: "",
//                         min: 0,
//                         max: 10,
//                         step: 1,
//                         precision: 0,
//                         orientation: "horizontal",
//                         value: 5,
//                         range: !1,
//                         selection: "before",
//                         tooltip: "show",
//                         tooltip_split: !1,
//                         handle: "round",
//                         reversed: !1,
//                         rtl: "auto",
//                         enabled: !0,
//                         formatter: function a(t) {
//                             return Array.isArray(t) ? t[0] + " : " + t[1] : t
//                         },
//                         natural_arrow_keys: !1,
//                         ticks: [],
//                         ticks_positions: [],
//                         ticks_labels: [],
//                         ticks_snap_bounds: 0,
//                         ticks_tooltip: !1,
//                         scale: "linear",
//                         focus: !1,
//                         tooltip_position: null,
//                         labelledby: null,
//                         rangeHighlights: []
//                     },
//                     getElement: function l() {
//                         return this.sliderElem
//                     },
//                     getValue: function c() {
//                         return this.options.range ? this._state.value : this._state.value[0]
//                     },
//                     setValue: function h(t, e, n) {
//                         t || (t = 0);
//                         var i = this.getValue();
//                         this._state.value = this._validateInputValue(t);
//                         var r = this._applyPrecision.bind(this);
//                         this.options.range ? (this._state.value[0] = r(this._state.value[0]), this._state.value[1] = r(this._state.value[1]), this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])), this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = r(this._state.value), this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))], this._addClass(this.handle2, "hide"), "after" === this.options.selection ? this._state.value[1] = this.options.max : this._state.value[1] = this.options.min), this.options.max > this.options.min ? this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : this._state.percentage = [0, 0, 100], this._layout();
//                         var o = this.options.range ? this._state.value : this._state.value[0];
//                         return this._setDataVal(o), !0 === e && this._trigger("slide", o), i !== o && !0 === n && this._trigger("change", {
//                             oldValue: i,
//                             newValue: o
//                         }), this
//                     },
//                     destroy: function d() {
//                         this._removeSliderEventHandlers(), this.sliderElem.parentNode.removeChild(this.sliderElem), this.element.style.display = "", this._cleanUpEventCallbacksMap(), this.element.removeAttribute("data"), F && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"))
//                     },
//                     disable: function f() {
//                         return this._state.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this
//                     },
//                     enable: function p() {
//                         return this._state.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this
//                     },
//                     toggle: function m() {
//                         return this._state.enabled ? this.disable() : this.enable(), this
//                     },
//                     isEnabled: function g() {
//                         return this._state.enabled
//                     },
//                     on: function v(t, e) {
//                         return this._bindNonQueryEventHandler(t, e), this
//                     },
//                     off: function y(t, e) {
//                         F ? (this.$element.off(t, e), this.$sliderElem.off(t, e)) : this._unbindNonQueryEventHandler(t, e)
//                     },
//                     getAttribute: function b(t) {
//                         return t ? this.options[t] : this.options
//                     },
//                     setAttribute: function w(t, e) {
//                         return this.options[t] = e, this
//                     },
//                     refresh: function x() {
//                         return this._removeSliderEventHandlers(), n.call(this, this.element, this.options), F && F.data(this.element, "slider", this), this
//                     },
//                     relayout: function k() {
//                         return this._resize(), this
//                     },
//                     _removeSliderEventHandlers: function _() {
//                         if (this.handle1.removeEventListener("keydown", this.handle1Keydown, !1), this.handle2.removeEventListener("keydown", this.handle2Keydown, !1), this.options.ticks_tooltip) {
//                             for (var t = this.ticksContainer.getElementsByClassName("slider-tick"), e = 0; e < t.length; e++) t[e].removeEventListener("mouseenter", this.ticksCallbackMap[e].mouseEnter, !1), t[e].removeEventListener("mouseleave", this.ticksCallbackMap[e].mouseLeave, !1);
//                             this.handle1.removeEventListener("mouseenter", this.handleCallbackMap.handle1.mouseEnter, !1), this.handle2.removeEventListener("mouseenter", this.handleCallbackMap.handle2.mouseEnter, !1), this.handle1.removeEventListener("mouseleave", this.handleCallbackMap.handle1.mouseLeave, !1), this.handle2.removeEventListener("mouseleave", this.handleCallbackMap.handle2.mouseLeave, !1)
//                         }
//                         this.handleCallbackMap = null, this.ticksCallbackMap = null, this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1), this.handle2.removeEventListener("focus", this.showTooltip, !1)), this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1), this.handle2.removeEventListener("blur", this.hideTooltip, !1)), this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1), this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1), this.sliderElem.removeEventListener("touchstart", this.touchstart, !1), this.sliderElem.removeEventListener("touchmove", this.touchmove, !1), this.sliderElem.removeEventListener("mousedown", this.mousedown, !1), window.removeEventListener("resize", this.resize, !1)
//                     },
//                     _bindNonQueryEventHandler: function E(t, e) {
//                         this.eventToCallbackMap[t] === undefined && (this.eventToCallbackMap[t] = []), this.eventToCallbackMap[t].push(e)
//                     },
//                     _unbindNonQueryEventHandler: function C(t, e) {
//                         var n = this.eventToCallbackMap[t];
//                         if (n !== undefined)
//                             for (var i = 0; i < n.length; i++)
//                                 if (n[i] === e) {
//                                     n.splice(i, 1);
//                                     break
//                                 }
//                     },
//                     _cleanUpEventCallbacksMap: function T() {
//                         for (var t = Object.keys(this.eventToCallbackMap), e = 0; e < t.length; e++) {
//                             var n = t[e];
//                             delete this.eventToCallbackMap[n]
//                         }
//                     },
//                     _showTooltip: function S() {
//                         !1 === this.options.tooltip_split ? (this._addClass(this.tooltip, "in"), this.tooltip_min.style.display = "none", this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"), this.tooltip.style.display = "none"), this._state.over = !0
//                     },
//                     _hideTooltip: function A() {
//                         !1 === this._state.inDrag && !0 !== this.alwaysShowTooltip && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in")), this._state.over = !1
//                     },
//                     _setToolTipOnMouseOver: function L(t) {
//                         function e(t, e) {
//                             return e ? [100 - t.percentage[0], this.options.range ? 100 - t.percentage[1] : t.percentage[1]] : [t.percentage[0], t.percentage[1]]
//                         }
//                         var n = this.options.formatter(t ? t.value[0] : this._state.value[0]),
//                             i = e(t || this._state, this.options.reversed);
//                         this._setText(this.tooltipInner, n), this.tooltip.style[this.stylePos] = i[0] + "%"
//                     },
//                     _addTickListener: function P() {
//                         return {
//                             addMouseEnter: function e(i, t, r) {
//                                 var o = function o() {
//                                     var t = i._state,
//                                         e = 0 <= r ? r : this.attributes["aria-valuenow"].value,
//                                         n = parseInt(e, 10);
//                                     t.value[0] = n, t.percentage[0] = i.options.ticks_positions[n], i._setToolTipOnMouseOver(t), i._showTooltip()
//                                 };
//                                 return t.addEventListener("mouseenter", o, !1), o
//                             },
//                             addMouseLeave: function i(t, e) {
//                                 var n = function n() {
//                                     t._hideTooltip()
//                                 };
//                                 return e.addEventListener("mouseleave", n, !1), n
//                             }
//                         }
//                     },
//                     _layout: function M() {
//                         var t, e;
//                         if (t = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]], this.handle1.style[this.stylePos] = t[0] + "%", this.handle1.setAttribute("aria-valuenow", this._state.value[0]), isNaN(this.options.formatter(this._state.value[0])) && this.handle1.setAttribute("aria-valuetext", this.options.formatter(this._state.value[0])), this.handle2.style[this.stylePos] = t[1] + "%", this.handle2.setAttribute("aria-valuenow", this._state.value[1]), isNaN(this.options.formatter(this._state.value[1])) && this.handle2.setAttribute("aria-valuetext", this.options.formatter(this._state.value[1])), 0 < this.rangeHighlightElements.length && Array.isArray(this.options.rangeHighlights) && 0 < this.options.rangeHighlights.length)
//                             for (var n = 0; n < this.options.rangeHighlights.length; n++) {
//                                 var i = this._toPercentage(this.options.rangeHighlights[n].start),
//                                     r = this._toPercentage(this.options.rangeHighlights[n].end);
//                                 if (this.options.reversed) {
//                                     var o = 100 - r;
//                                     r = 100 - i, i = o
//                                 }
//                                 var s = this._createHighlightRange(i, r);
//                                 s ? "vertical" === this.options.orientation ? (this.rangeHighlightElements[n].style.top = s.start + "%", this.rangeHighlightElements[n].style.height = s.size + "%") : (this.options.rtl ? this.rangeHighlightElements[n].style.right = s.start + "%" : this.rangeHighlightElements[n].style.left = s.start + "%", this.rangeHighlightElements[n].style.width = s.size + "%") : this.rangeHighlightElements[n].style.display = "none"
//                             }
//                         if (Array.isArray(this.options.ticks) && 0 < this.options.ticks.length) {
//                             var a, l = "vertical" === this.options.orientation ? "height" : "width";
//                             a = "vertical" === this.options.orientation ? "marginTop" : this.options.rtl ? "marginRight" : "marginLeft";
//                             var u = this._state.size / (this.options.ticks.length - 1);
//                             if (this.tickLabelContainer) {
//                                 var c = 0;
//                                 if (0 === this.options.ticks_positions.length) "vertical" !== this.options.orientation && (this.tickLabelContainer.style[a] = -u / 2 + "px"), c = this.tickLabelContainer.offsetHeight;
//                                 else
//                                     for (h = 0; h < this.tickLabelContainer.childNodes.length; h++) this.tickLabelContainer.childNodes[h].offsetHeight > c && (c = this.tickLabelContainer.childNodes[h].offsetHeight);
//                                 "horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = c + "px")
//                             }
//                             for (var h = 0; h < this.options.ticks.length; h++) {
//                                 var d = this.options.ticks_positions[h] || this._toPercentage(this.options.ticks[h]);
//                                 this.options.reversed && (d = 100 - d), this.ticks[h].style[this.stylePos] = d + "%", this._removeClass(this.ticks[h], "in-selection"), this.options.range ? d >= t[0] && d <= t[1] && this._addClass(this.ticks[h], "in-selection") : "after" === this.options.selection && d >= t[0] ? this._addClass(this.ticks[h], "in-selection") : "before" === this.options.selection && d <= t[0] && this._addClass(this.ticks[h], "in-selection"), this.tickLabels[h] && (this.tickLabels[h].style[l] = u + "px", "vertical" !== this.options.orientation && this.options.ticks_positions[h] !== undefined ? (this.tickLabels[h].style.position = "absolute", this.tickLabels[h].style[this.stylePos] = d + "%", this.tickLabels[h].style[a] = -u / 2 + "px") : "vertical" === this.options.orientation && (this.options.rtl ? this.tickLabels[h].style.marginRight = this.sliderElem.offsetWidth + "px" : this.tickLabels[h].style.marginLeft = this.sliderElem.offsetWidth + "px", this.tickLabelContainer.style[a] = this.sliderElem.offsetWidth / 2 * -1 + "px"), this._removeClass(this.tickLabels[h], "label-in-selection label-is-selection"), this.options.range ? d >= t[0] && d <= t[1] && (this._addClass(this.tickLabels[h], "label-in-selection"), (d === t[0] || t[1]) && this._addClass(this.tickLabels[h], "label-is-selection")) : ("after" === this.options.selection && d >= t[0] ? this._addClass(this.tickLabels[h], "label-in-selection") : "before" === this.options.selection && d <= t[0] && this._addClass(this.tickLabels[h], "label-in-selection"), d === t[0] && this._addClass(this.tickLabels[h], "label-is-selection")))
//                             }
//                         }
//                         if (this.options.range) {
//                             e = this.options.formatter(this._state.value), this._setText(this.tooltipInner, e), this.tooltip.style[this.stylePos] = (t[1] + t[0]) / 2 + "%";
//                             var f = this.options.formatter(this._state.value[0]);
//                             this._setText(this.tooltipInner_min, f);
//                             var p = this.options.formatter(this._state.value[1]);
//                             this._setText(this.tooltipInner_max, p), this.tooltip_min.style[this.stylePos] = t[0] + "%", this.tooltip_max.style[this.stylePos] = t[1] + "%"
//                         } else e = this.options.formatter(this._state.value[0]), this._setText(this.tooltipInner, e), this.tooltip.style[this.stylePos] = t[0] + "%";
//                         if ("vertical" === this.options.orientation) this.trackLow.style.top = "0", this.trackLow.style.height = Math.min(t[0], t[1]) + "%", this.trackSelection.style.top = Math.min(t[0], t[1]) + "%", this.trackSelection.style.height = Math.abs(t[0] - t[1]) + "%", this.trackHigh.style.bottom = "0", this.trackHigh.style.height = 100 - Math.min(t[0], t[1]) - Math.abs(t[0] - t[1]) + "%";
//                         else {
//                             "right" === this.stylePos ? this.trackLow.style.right = "0" : this.trackLow.style.left = "0", this.trackLow.style.width = Math.min(t[0], t[1]) + "%", "right" === this.stylePos ? this.trackSelection.style.right = Math.min(t[0], t[1]) + "%" : this.trackSelection.style.left = Math.min(t[0], t[1]) + "%", this.trackSelection.style.width = Math.abs(t[0] - t[1]) + "%", "right" === this.stylePos ? this.trackHigh.style.left = "0" : this.trackHigh.style.right = "0", this.trackHigh.style.width = 100 - Math.min(t[0], t[1]) - Math.abs(t[0] - t[1]) + "%";
//                             var m = this.tooltip_min.getBoundingClientRect(),
//                                 g = this.tooltip_max.getBoundingClientRect();
//                             "bottom" === this.options.tooltip_position ? m.right > g.left ? (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = "", this.tooltip_max.style.bottom = "22px") : (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = this.tooltip_min.style.top, this.tooltip_max.style.bottom = "") : m.right > g.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = this.tooltip_min.style.top)
//                         }
//                     },
//                     _createHighlightRange: function D(t, e) {
//                         return this._isHighlightRange(t, e) ? e < t ? {
//                             start: e,
//                             size: t - e
//                         } : {
//                             start: t,
//                             size: e - t
//                         } : null
//                     },
//                     _isHighlightRange: function R(t, e) {
//                         return 0 <= t && t <= 100 && 0 <= e && e <= 100
//                     },
//                     _resize: function j() {
//                         this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this._layout()
//                     },
//                     _removeProperty: function N(t, e) {
//                         t.style.removeProperty ? t.style.removeProperty(e) : t.style.removeAttribute(e)
//                     },
//                     _mousedown: function $(t) {
//                         if (!this._state.enabled) return !1;
//                         t.preventDefault && t.preventDefault(), this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos];
//                         var e = this._getPercentage(t);
//                         if (this.options.range) {
//                             var n = Math.abs(this._state.percentage[0] - e),
//                                 i = Math.abs(this._state.percentage[1] - e);
//                             this._state.dragged = n < i ? 0 : 1, this._adjustPercentageForRangeSliders(e)
//                         } else this._state.dragged = 0;
//                         this._state.percentage[this._state.dragged] = e, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !0;
//                         var r = this._calculateValue();
//                         return this._trigger("slideStart", r), this._setDataVal(r), this.setValue(r, !1, !0), t.returnValue = !1, this.options.focus && this._triggerFocusOnHandle(this._state.dragged), !0
//                     },
//                     _touchstart: function q(t) {
//                         if (t.changedTouches !== undefined) {
//                             var e = t.changedTouches[0];
//                             this.touchX = e.pageX, this.touchY = e.pageY
//                         } else this._mousedown(t)
//                     },
//                     _triggerFocusOnHandle: function H(t) {
//                         0 === t && this.handle1.focus(), 1 === t && this.handle2.focus()
//                     },
//                     _keydown: function I(t, e) {
//                         if (!this._state.enabled) return !1;
//                         var n;
//                         switch (e.keyCode) {
//                             case 37:
//                             case 40:
//                                 n = -1;
//                                 break;
//                             case 39:
//                             case 38:
//                                 n = 1
//                         }
//                         if (n) {
//                             if (this.options.natural_arrow_keys) {
//                                 var i = "vertical" === this.options.orientation && !this.options.reversed,
//                                     r = "horizontal" === this.options.orientation && this.options.reversed;
//                                 (i || r) && (n = -n)
//                             }
//                             var o = this._state.value[t] + n * this.options.step,
//                                 s = o / this.options.max * 100;
//                             if (this._state.keyCtrl = t, this.options.range) this._adjustPercentageForRangeSliders(s), o = [this._state.keyCtrl ? this._state.value[0] : o, this._state.keyCtrl ? o : this._state.value[1]];
//                             return this._trigger("slideStart", o), this._setDataVal(o), this.setValue(o, !0, !0), this._setDataVal(o), this._trigger("slideStop", o), this._layout(), this._pauseEvent(e), delete this._state.keyCtrl, !1
//                         }
//                     },
//                     _pauseEvent: function O(t) {
//                         t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault(), t.cancelBubble = !0, t.returnValue = !1
//                     },
//                     _mousemove: function V(t) {
//                         if (!this._state.enabled) return !1;
//                         var e = this._getPercentage(t);
//                         this._adjustPercentageForRangeSliders(e), this._state.percentage[this._state.dragged] = e, this._layout();
//                         var n = this._calculateValue(!0);
//                         return this.setValue(n, !0, !0), !1
//                     },
//                     _touchmove: function W(t) {
//                         if (t.changedTouches !== undefined) {
//                             var e = t.changedTouches[0],
//                                 n = e.pageX - this.touchX,
//                                 i = e.pageY - this.touchY;
//                             this._state.inDrag || ("vertical" === this.options.orientation && n <= 5 && -5 <= n && (15 <= i || i <= -15) ? this._mousedown(t) : i <= 5 && -5 <= i && (15 <= n || n <= -15) && this._mousedown(t))
//                         }
//                     },
//                     _adjustPercentageForRangeSliders: function U(t) {
//                         if (this.options.range) {
//                             var e = this._getNumDigitsAfterDecimalPlace(t);
//                             e = e ? e - 1 : 0;
//                             var n = this._applyToFixedAndParseFloat(t, e);
//                             0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], e) < n ? (this._state.percentage[0] = this._state.percentage[1], this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], e) > n ? (this._state.percentage[1] = this._state.percentage[0], this._state.dragged = 0) : 0 === this._state.keyCtrl && this._state.value[1] / this.options.max * 100 < t ? (this._state.percentage[0] = this._state.percentage[1], this._state.keyCtrl = 1, this.handle2.focus()) : 1 === this._state.keyCtrl && this._state.value[0] / this.options.max * 100 > t && (this._state.percentage[1] = this._state.percentage[0], this._state.keyCtrl = 0, this.handle1.focus())
//                         }
//                     },
//                     _mouseup: function z() {
//                         if (!this._state.enabled) return !1;
//                         this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), document.removeEventListener("mousemove", this.mousemove, !1), document.removeEventListener("mouseup", this.mouseup, !1), (this._state.inDrag = !1) === this._state.over && this._hideTooltip();
//                         var t = this._calculateValue(!0);
//                         return this._layout(), this._setDataVal(t), this._trigger("slideStop", t), this._state.dragged = null, !1
//                     },
//                     _calculateValue: function X(t) {
//                         var e;
//                         if (this.options.range ? (e = [this.options.min, this.options.max], 0 !== this._state.percentage[0] && (e[0] = this._toValue(this._state.percentage[0]), e[0] = this._applyPrecision(e[0])), 100 !== this._state.percentage[1] && (e[1] = this._toValue(this._state.percentage[1]), e[1] = this._applyPrecision(e[1]))) : (e = this._toValue(this._state.percentage[0]), e = parseFloat(e), e = this._applyPrecision(e)), t) {
//                             for (var n = [e, Infinity], i = 0; i < this.options.ticks.length; i++) {
//                                 var r = Math.abs(this.options.ticks[i] - e);
//                                 r <= n[1] && (n = [this.options.ticks[i], r])
//                             }
//                             if (n[1] <= this.options.ticks_snap_bounds) return n[0]
//                         }
//                         return e
//                     },
//                     _applyPrecision: function Y(t) {
//                         var e = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
//                         return this._applyToFixedAndParseFloat(t, e)
//                     },
//                     _getNumDigitsAfterDecimalPlace: function Q(t) {
//                         var e = ("" + t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
//                         return e ? Math.max(0, (e[1] ? e[1].length : 0) - (e[2] ? +e[2] : 0)) : 0
//                     },
//                     _applyToFixedAndParseFloat: function K(t, e) {
//                         var n = t.toFixed(e);
//                         return parseFloat(n)
//                     },
//                     _getPercentage: function G(t) {
//                         !this.touchCapable || "touchstart" !== t.type && "touchmove" !== t.type || (t = t.touches[0]);
//                         var e = t[this.mousePos] - this._state.offset[this.stylePos];
//                         "right" === this.stylePos && (e = -e);
//                         var n = e / this._state.size * 100;
//                         return n = Math.round(n / this._state.percentage[2]) * this._state.percentage[2], this.options.reversed && (n = 100 - n), Math.max(0, Math.min(100, n))
//                     },
//                     _validateInputValue: function J(t) {
//                         if (isNaN(+t)) {
//                             if (Array.isArray(t)) return this._validateArray(t), t;
//                             throw new Error(i.formatInvalidInputErrorMsg(t))
//                         }
//                         return +t
//                     },
//                     _validateArray: function Z(t) {
//                         for (var e = 0; e < t.length; e++) {
//                             var n = t[e];
//                             if ("number" != typeof n) throw new Error(i.formatInvalidInputErrorMsg(n))
//                         }
//                     },
//                     _setDataVal: function tt(t) {
//                         this.element.setAttribute("data-value", t), this.element.setAttribute("value", t), this.element.value = t
//                     },
//                     _trigger: function et(t, e) {
//                         e = e || 0 === e ? e : undefined;
//                         var n = this.eventToCallbackMap[t];
//                         if (n && n.length)
//                             for (var i = 0; i < n.length; i++) {
//                                 (0, n[i])(e)
//                             }
//                         F && this._triggerJQueryEvent(t, e)
//                     },
//                     _triggerJQueryEvent: function nt(t, e) {
//                         var n = {
//                             type: t,
//                             value: e
//                         };
//                         this.$element.trigger(n), this.$sliderElem.trigger(n)
//                     },
//                     _unbindJQueryEventHandlers: function it() {
//                         this.$element.off(), this.$sliderElem.off()
//                     },
//                     _setText: function rt(t, e) {
//                         "undefined" != typeof t.textContent ? t.textContent = e : "undefined" != typeof t.innerText && (t.innerText = e)
//                     },
//                     _removeClass: function ot(t, e) {
//                         for (var n = e.split(" "), i = t.className, r = 0; r < n.length; r++) {
//                             var o = n[r],
//                                 s = new RegExp("(?:\\s|^)" + o + "(?:\\s|$)");
//                             i = i.replace(s, " ")
//                         }
//                         t.className = i.trim()
//                     },
//                     _addClass: function st(t, e) {
//                         for (var n = e.split(" "), i = t.className, r = 0; r < n.length; r++) {
//                             var o = n[r];
//                             new RegExp("(?:\\s|^)" + o + "(?:\\s|$)").test(i) || (i += " " + o)
//                         }
//                         t.className = i.trim()
//                     },
//                     _offsetLeft: function at(t) {
//                         return t.getBoundingClientRect().left
//                     },
//                     _offsetRight: function lt(t) {
//                         return t.getBoundingClientRect().right
//                     },
//                     _offsetTop: function ut(t) {
//                         for (var e = t.offsetTop;
//                             (t = t.offsetParent) && !isNaN(t.offsetTop);) e += t.offsetTop, "BODY" !== t.tagName && (e -= t.scrollTop);
//                         return e
//                     },
//                     _offset: function ct(t) {
//                         return {
//                             left: this._offsetLeft(t),
//                             right: this._offsetRight(t),
//                             top: this._offsetTop(t)
//                         }
//                     },
//                     _css: function ht(t, e, n) {
//                         if (F) F.style(t, e, n);
//                         else {
//                             var i = e.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(t, e) {
//                                 return e.toUpperCase()
//                             });
//                             t.style[i] = n
//                         }
//                     },
//                     _toValue: function dt(t) {
//                         return this.options.scale.toValue.apply(this, [t])
//                     },
//                     _toPercentage: function ft(t) {
//                         return this.options.scale.toPercentage.apply(this, [t])
//                     },
//                     _setTooltipPosition: function pt() {
//                         var t = [this.tooltip, this.tooltip_min, this.tooltip_max];
//                         if ("vertical" === this.options.orientation) {
//                             var e, n = "left" === (e = this.options.tooltip_position ? this.options.tooltip_position : this.options.rtl ? "left" : "right") ? "right" : "left";
//                             t.forEach(function(t) {
//                                 this._addClass(t, e), t.style[n] = "100%"
//                             }.bind(this))
//                         } else "bottom" === this.options.tooltip_position ? t.forEach(function(t) {
//                             this._addClass(t, "bottom"), t.style.top = "22px"
//                         }.bind(this)) : t.forEach(function(t) {
//                             this._addClass(t, "top"), t.style.top = -this.tooltip.outerHeight - 14 + "px"
//                         }.bind(this))
//                     }
//                 }, F && F.fn) {
//                 var t = void 0;
//                 F.fn.slider ? (windowIsDefined && window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."), t = vt) : (F.bridget(gt, mt), t = gt), F.bridget(vt, mt), F(function() {
//                     F("input[data-provide=slider]")[t]()
//                 })
//             }
//         }(t), mt
// }),
// function(t) {
//     "use strict";
//     "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports && "object" == typeof module ? module.exports = t(require("jquery")) : t(jQuery)
// }(function($t, qt) {
//     "use strict";

//     function Ht(t, e, n, i) {
//         for (var r = [], o = 0; o < t.length; o++) {
//             var s = t[o];
//             if (s) {
//                 var a = tinycolor(s),
//                     l = a.toHsl().l < .5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
//                 l += tinycolor.equals(e, s) ? " sp-thumb-active" : "";
//                 var u = a.toString(i.preferredFormat || "rgb"),
//                     c = Yt ? "background-color:" + a.toRgbString() : "filter:" + a.toFilter();
//                 r.push('<span title="' + u + '" data-color="' + a.toRgbString() + '" class="' + l + '"><span class="sp-thumb-inner" style="' + c + ';" /></span>')
//             } else {
//                 var h = "sp-clear-display";
//                 r.push($t("<div />").append($t('<span data-color="" style="background-color:transparent;" class="' + h + '"></span>').attr("title", i.noColorSelectedText)).html())
//             }
//         }
//         return "<div class='sp-cf " + n + "'>" + r.join("") + "</div>"
//     }

//     function It() {
//         for (var t = 0; t < zt.length; t++) zt[t] && zt[t].hide()
//     }

//     function Ot(t, e) {
//         var n = $t.extend({}, r, t);
//         return n.callbacks = {
//             move: i(n.move, e),
//             change: i(n.change, e),
//             show: i(n.show, e),
//             hide: i(n.hide, e),
//             beforeShow: i(n.beforeShow, e)
//         }, n
//     }

//     function e(t, e) {
//         function i() {
//             if (M.showPaletteOnly && (M.showPalette = !0), kt.text(M.showPaletteOnly ? M.togglePaletteMoreText : M.togglePaletteLessText), M.palette) {
//                 G = M.palette.slice(0), J = $t.isArray(G[0]) ? G : [G], Z = {};
//                 for (var t = 0; t < J.length; t++)
//                     for (var e = 0; e < J[t].length; e++) {
//                         var n = tinycolor(J[t][e]).toRgbString();
//                         Z[n] = !0
//                     }
//             }
//             at.toggleClass("sp-flat", D), at.toggleClass("sp-input-disabled", !M.showInput), at.toggleClass("sp-alpha-enabled", M.showAlpha), at.toggleClass("sp-clear-enabled", jt), at.toggleClass("sp-buttons-disabled", !M.showButtons), at.toggleClass("sp-palette-buttons-disabled", !M.togglePaletteOnly), at.toggleClass("sp-palette-disabled", !M.showPalette), at.toggleClass("sp-palette-only", M.showPaletteOnly), at.toggleClass("sp-initial-disabled", !M.showInitial), at.addClass(M.className).addClass(M.containerClassName), C()
//         }

//         function n() {
//             function t(t) {
//                 return t.data && t.data.ignore ? (y($t(t.target).closest(".sp-thumb-el").data("color")), x()) : (y($t(t.target).closest(".sp-thumb-el").data("color")), x(), E(!0), M.hideAfterPaletteSelect && g()), !1
//             }
//             if (Xt && at.find("*:not(input)").attr("unselectable", "on"), i(), Ct && ot.after(Tt).hide(), jt || wt.hide(), D) ot.after(at).hide();
//             else {
//                 var e = "parent" === M.appendTo ? ot.parent() : $t(M.appendTo);
//                 1 !== e.length && (e = $t("body")), e.append(at)
//             }
//             r(), St.bind("click.spectrum touchstart.spectrum", function(t) {
//                 st || d(), t.stopPropagation(), $t(t.target).is("input") || t.preventDefault()
//             }), (ot.is(":disabled") || !0 === M.disabled) && L(), at.click(Bt), gt.change(h), gt.bind("paste", function() {
//                 setTimeout(h, 1)
//             }), gt.keydown(function(t) {
//                 13 == t.keyCode && h()
//             }), bt.text(M.cancelText), bt.bind("click.spectrum", function(t) {
//                 t.stopPropagation(), t.preventDefault(), v(), g()
//             }), wt.attr("title", M.clearText), wt.bind("click.spectrum", function(t) {
//                 t.stopPropagation(), t.preventDefault(), Rt = !0, x(), D && E(!0)
//             }), xt.text(M.chooseText), xt.bind("click.spectrum", function(t) {
//                 t.stopPropagation(), t.preventDefault(), Xt && gt.is(":focus") && gt.trigger("change"), w() && (E(!0), g())
//             }), kt.text(M.showPaletteOnly ? M.togglePaletteMoreText : M.togglePaletteLessText), kt.bind("click.spectrum", function(t) {
//                 t.stopPropagation(), t.preventDefault(), M.showPaletteOnly = !M.showPaletteOnly, M.showPaletteOnly || D || at.css("left", "-=" + (lt.outerWidth(!0) + 5)), i()
//             }), Vt(pt, function(t, e, n) {
//                 K = t / W, Rt = !1, n.shiftKey && (K = Math.round(10 * K) / 10), x()
//             }, a, l), Vt(ht, function(t, e) {
//                 X = parseFloat(e / V), Rt = !1, M.showAlpha || (K = 1), x()
//             }, a, l), Vt(ut, function(t, e, n) {
//                 if (n.shiftKey) {
//                     if (!it) {
//                         var i = Y * O,
//                             r = F - Q * F,
//                             o = Math.abs(t - i) > Math.abs(e - r);
//                         it = o ? "x" : "y"
//                     }
//                 } else it = null;
//                 var s = !it || "y" === it;
//                 (!it || "x" === it) && (Y = parseFloat(t / O)), s && (Q = parseFloat((F - e) / F)), Rt = !1, M.showAlpha || (K = 1), x()
//             }, a, l), Lt ? (y(Lt), k(), Mt = M.preferredFormat || tinycolor(Lt).format, o(Lt)) : k(), D && f();
//             var n = Xt ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
//             vt.delegate(".sp-thumb-el", n, t), yt.delegate(".sp-thumb-el:nth-child(1)", n, {
//                 ignore: !0
//             }, t)
//         }

//         function r() {
//             if (j && window.localStorage) {
//                 try {
//                     var t = window.localStorage[j].split(",#");
//                     1 < t.length && (delete window.localStorage[j], $t.each(t, function(t, e) {
//                         o(e)
//                     }))
//                 } catch (e) {}
//                 try {
//                     tt = window.localStorage[j].split(";")
//                 } catch (e) {}
//             }
//         }

//         function o(t) {
//             if (R) {
//                 var e = tinycolor(t).toRgbString();
//                 if (!Z[e] && -1 === $t.inArray(e, tt))
//                     for (tt.push(e); tt.length > et;) tt.shift();
//                 if (j && window.localStorage) try {
//                     window.localStorage[j] = tt.join(";")
//                 } catch (n) {}
//             }
//         }

//         function s() {
//             var t = [];
//             if (M.showPalette)
//                 for (var e = 0; e < tt.length; e++) {
//                     var n = tinycolor(tt[e]).toRgbString();
//                     Z[n] || t.push(tt[e])
//                 }
//             return t.reverse().slice(0, M.maxSelectionSize)
//         }

//         function u() {
//             var n = b(),
//                 t = $t.map(J, function(t, e) {
//                     return Ht(t, n, "sp-palette-row sp-palette-row-" + e, M)
//                 });
//             r(), tt && t.push(Ht(s(), n, "sp-palette-row sp-palette-row-selection", M)), vt.html(t.join(""))
//         }

//         function c() {
//             if (M.showInitial) {
//                 var t = Pt,
//                     e = b();
//                 yt.html(Ht([t, e], e, "sp-palette-row-initial", M))
//             }
//         }

//         function a() {
//             (F <= 0 || O <= 0 || V <= 0) && C(), I = !0, at.addClass(nt), it = null, ot.trigger("dragstart.spectrum", [b()])
//         }

//         function l() {
//             I = !1, at.removeClass(nt), ot.trigger("dragstop.spectrum", [b()])
//         }

//         function h() {
//             var t = gt.val();
//             if (null !== t && "" !== t || !jt) {
//                 var e = tinycolor(t);
//                 e.isValid() ? (y(e), E(!0)) : gt.addClass("sp-validation-error")
//             } else y(null), E(!0)
//         }

//         function d() {
//             H ? g() : f()
//         }

//         function f() {
//             var t = $t.Event("beforeShow.spectrum");
//             H ? C() : (ot.trigger(t, [b()]), !1 === $.beforeShow(b()) || t.isDefaultPrevented() || (It(), H = !0, $t(rt).bind("keydown.spectrum", p), $t(rt).bind("click.spectrum", m), $t(window).bind("resize.spectrum", q), Tt.addClass("sp-active"), at.removeClass("sp-hidden"), C(), k(), Pt = b(), c(), $.show(Pt), ot.trigger("show.spectrum", [Pt])))
//         }

//         function p(t) {
//             27 === t.keyCode && g()
//         }

//         function m(t) {
//             2 != t.button && (I || (Dt ? E(!0) : v(), g()))
//         }

//         function g() {
//             H && !D && (H = !1, $t(rt).unbind("keydown.spectrum", p), $t(rt).unbind("click.spectrum", m), $t(window).unbind("resize.spectrum", q), Tt.removeClass("sp-active"), at.addClass("sp-hidden"), $.hide(b()), ot.trigger("hide.spectrum", [b()]))
//         }

//         function v() {
//             y(Pt, !0)
//         }

//         function y(t, e) {
//             var n, i;
//             tinycolor.equals(t, b()) ? k() : (!t && jt ? Rt = !0 : (Rt = !1, i = (n = tinycolor(t)).toHsv(), X = i.h % 360 / 360, Y = i.s, Q = i.v, K = i.a), k(), n && n.isValid() && !e && (Mt = M.preferredFormat || n.getFormat()))
//         }

//         function b(t) {
//             return t = t || {}, jt && Rt ? null : tinycolor.fromRatio({
//                 h: X,
//                 s: Y,
//                 v: Q,
//                 a: Math.round(100 * K) / 100
//             }, {
//                 format: t.format || Mt
//             })
//         }

//         function w() {
//             return !gt.hasClass("sp-validation-error")
//         }

//         function x() {
//             k(), $.move(b()), ot.trigger("move.spectrum", [b()])
//         }

//         function k() {
//             gt.removeClass("sp-validation-error"), _();
//             var t = tinycolor.fromRatio({
//                 h: X,
//                 s: 1,
//                 v: 1
//             });
//             ut.css("background-color", t.toHexString());
//             var e = Mt;
//             K < 1 && (0 !== K || "name" !== e) && ("hex" !== e && "hex3" !== e && "hex6" !== e && "name" !== e || (e = "rgb"));
//             var n = b({
//                     format: e
//                 }),
//                 i = "";
//             if (At.removeClass("sp-clear-display"), At.css("background-color", "transparent"), !n && jt) At.addClass("sp-clear-display");
//             else {
//                 var r = n.toHexString(),
//                     o = n.toRgbString();
//                 if (Yt || 1 === n.alpha ? At.css("background-color", o) : (At.css("background-color", "transparent"), At.css("filter", n.toFilter())), M.showAlpha) {
//                     var s = n.toRgb();
//                     s.a = 0;
//                     var a = tinycolor(s).toRgbString(),
//                         l = "linear-gradient(left, " + a + ", " + r + ")";
//                     Xt ? ft.css("filter", tinycolor(a).toFilter({
//                         gradientType: 1
//                     }, r)) : (ft.css("background", "-webkit-" + l), ft.css("background", "-moz-" + l), ft.css("background", "-ms-" + l), ft.css("background", "linear-gradient(to right, " + a + ", " + r + ")"))
//                 }
//                 i = n.toString(e)
//             }
//             M.showInput && gt.val(i), M.showPalette && u(), c()
//         }

//         function _() {
//             var t = Y,
//                 e = Q;
//             if (jt && Rt) mt.hide(), dt.hide(), ct.hide();
//             else {
//                 mt.show(), dt.show(), ct.show();
//                 var n = t * O,
//                     i = F - e * F;
//                 n = Math.max(-B, Math.min(O - B, n - B)), i = Math.max(-B, Math.min(F - B, i - B)), ct.css({
//                     top: i + "px",
//                     left: n + "px"
//                 });
//                 var r = K * W;
//                 mt.css({
//                     left: r - U / 2 + "px"
//                 });
//                 var o = X * V;
//                 dt.css({
//                     top: o - z + "px"
//                 })
//             }
//         }

//         function E(t) {
//             var e = b(),
//                 n = "",
//                 i = !tinycolor.equals(e, Pt);
//             e && (n = e.toString(Mt), o(e)), _t && ot.val(n), t && i && ($.change(e), ot.trigger("change", [e]))
//         }

//         function C() {
//             H && (O = ut.width(), F = ut.height(), B = ct.height(), ht.width(), V = ht.height(), z = dt.height(), W = pt.width(), U = mt.width(), D || (at.css("position", "absolute"), M.offset ? at.offset(M.offset) : at.offset(Ft(at, St))), _(), M.showPalette && u(), ot.trigger("reflow.spectrum"))
//         }

//         function T() {
//             ot.show(), St.unbind("click.spectrum touchstart.spectrum"), at.remove(), Tt.remove(), zt[Nt.id] = null
//         }

//         function S(t, e) {
//             return t === qt ? $t.extend({}, M) : e === qt ? M[t] : (M[t] = e, "preferredFormat" === t && (Mt = M.preferredFormat), void i())
//         }

//         function A() {
//             st = !1, ot.attr("disabled", !1), St.removeClass("sp-disabled")
//         }

//         function L() {
//             g(), st = !0, ot.attr("disabled", !0), St.addClass("sp-disabled")
//         }

//         function P(t) {
//             M.offset = t, C()
//         }
//         var M = Ot(e, t),
//             D = M.flat,
//             R = M.showSelectionPalette,
//             j = M.localStorageKey,
//             N = M.theme,
//             $ = M.callbacks,
//             q = Wt(C, 10),
//             H = !1,
//             I = !1,
//             O = 0,
//             F = 0,
//             B = 0,
//             V = 0,
//             W = 0,
//             U = 0,
//             z = 0,
//             X = 0,
//             Y = 0,
//             Q = 0,
//             K = 1,
//             G = [],
//             J = [],
//             Z = {},
//             tt = M.selectionPalette.slice(0),
//             et = M.maxSelectionSize,
//             nt = "sp-dragging",
//             it = null,
//             rt = t.ownerDocument,
//             ot = (rt.body, $t(t)),
//             st = !1,
//             at = $t(Kt, rt).addClass(N),
//             lt = at.find(".sp-picker-container"),
//             ut = at.find(".sp-color"),
//             ct = at.find(".sp-dragger"),
//             ht = at.find(".sp-hue"),
//             dt = at.find(".sp-slider"),
//             ft = at.find(".sp-alpha-inner"),
//             pt = at.find(".sp-alpha"),
//             mt = at.find(".sp-alpha-handle"),
//             gt = at.find(".sp-input"),
//             vt = at.find(".sp-palette"),
//             yt = at.find(".sp-initial"),
//             bt = at.find(".sp-cancel"),
//             wt = at.find(".sp-clear"),
//             xt = at.find(".sp-choose"),
//             kt = at.find(".sp-palette-toggle"),
//             _t = ot.is("input"),
//             Et = _t && "color" === ot.attr("type") && Ut(),
//             Ct = _t && !D,
//             Tt = Ct ? $t(Qt).addClass(N).addClass(M.className).addClass(M.replacerClassName) : $t([]),
//             St = Ct ? Tt : ot,
//             At = Tt.find(".sp-preview-inner"),
//             Lt = M.color || _t && ot.val(),
//             Pt = !1,
//             Mt = M.preferredFormat,
//             Dt = !M.showButtons || M.clickoutFiresChange,
//             Rt = !Lt,
//             jt = M.allowEmpty && !Et;
//         n();
//         var Nt = {
//             show: f,
//             hide: g,
//             toggle: d,
//             reflow: C,
//             option: S,
//             enable: A,
//             disable: L,
//             offset: P,
//             set: function(t) {
//                 y(t), E()
//             },
//             get: b,
//             destroy: T,
//             container: at
//         };
//         return Nt.id = zt.push(Nt) - 1, Nt
//     }

//     function Ft(t, e) {
//         var n = 0,
//             i = t.outerWidth(),
//             r = t.outerHeight(),
//             o = e.outerHeight(),
//             s = t[0].ownerDocument,
//             a = s.documentElement,
//             l = a.clientWidth + $t(s).scrollLeft(),
//             u = a.clientHeight + $t(s).scrollTop(),
//             c = e.offset();
//         return c.top += o, c.left -= Math.min(c.left, c.left + i > l && i < l ? Math.abs(c.left + i - l) : 0), c.top -= Math.min(c.top, c.top + r > u && r < u ? Math.abs(r + o - n) : n), c
//     }

//     function t() {}

//     function Bt(t) {
//         t.stopPropagation()
//     }

//     function i(t, e) {
//         var n = Array.prototype.slice,
//             i = n.call(arguments, 2);
//         return function() {
//             return t.apply(e, i.concat(n.call(arguments)))
//         }
//     }

//     function Vt(s, a, e, t) {
//         function l(t) {
//             t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault(), t.returnValue = !1
//         }

//         function n(t) {
//             if (h) {
//                 if (Xt && c.documentMode < 9 && !t.button) return u();
//                 var e = t.originalEvent && t.originalEvent.touches && t.originalEvent.touches[0],
//                     n = e && e.pageX || t.pageX,
//                     i = e && e.pageY || t.pageY,
//                     r = Math.max(0, Math.min(n - d.left, p)),
//                     o = Math.max(0, Math.min(i - d.top, f));
//                 m && l(t), a.apply(s, [r, o, t])
//             }
//         }

//         function i(t) {
//             (t.which ? 3 == t.which : 2 == t.button) || h || !1 !== e.apply(s, arguments) && (h = !0, f = $t(s).height(), p = $t(s).width(), d = $t(s).offset(), $t(c).bind(r), $t(c.body).addClass("sp-dragging"), n(t), l(t))
//         }

//         function u() {
//             h && ($t(c).unbind(r), $t(c.body).removeClass("sp-dragging"), setTimeout(function() {
//                 t.apply(s, arguments)
//             }, 0)), h = !1
//         }
//         a = a || function() {}, e = e || function() {}, t = t || function() {};
//         var c = document,
//             h = !1,
//             d = {},
//             f = 0,
//             p = 0,
//             m = "ontouchstart" in window,
//             r = {};
//         r.selectstart = l, r.dragstart = l, r["touchmove mousemove"] = n, r["touchend mouseup"] = u, $t(s).bind("touchstart mousedown", i)
//     }

//     function Wt(i, r, o) {
//         var s;
//         return function() {
//             var t = this,
//                 e = arguments,
//                 n = function() {
//                     s = null, i.apply(t, e)
//                 };
//             o && clearTimeout(s), !o && s || (s = setTimeout(n, r))
//         }
//     }

//     function Ut() {
//         return $t.fn.spectrum.inputTypeColorSupport()
//     }
//     var r = {
//             beforeShow: t,
//             move: t,
//             change: t,
//             show: t,
//             hide: t,
//             color: !1,
//             flat: !1,
//             showInput: !1,
//             allowEmpty: !1,
//             showButtons: !0,
//             clickoutFiresChange: !0,
//             showInitial: !1,
//             showPalette: !1,
//             showPaletteOnly: !1,
//             hideAfterPaletteSelect: !1,
//             togglePaletteOnly: !1,
//             showSelectionPalette: !0,
//             localStorageKey: !1,
//             appendTo: "body",
//             maxSelectionSize: 7,
//             cancelText: "cancel",
//             chooseText: "choose",
//             togglePaletteMoreText: "more",
//             togglePaletteLessText: "less",
//             clearText: "Clear Color Selection",
//             noColorSelectedText: "No Color Selected",
//             preferredFormat: !1,
//             className: "",
//             containerClassName: "",
//             replacerClassName: "",
//             showAlpha: !1,
//             theme: "sp-light",
//             palette: [
//                 ["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]
//             ],
//             selectionPalette: [],
//             disabled: !1,
//             offset: null
//         },
//         zt = [],
//         Xt = !!/msie/i.exec(window.navigator.userAgent),
//         Yt = function() {
//             function t(t, e) {
//                 return !!~("" + t).indexOf(e)
//             }
//             var e = document.createElement("div").style;
//             return e.cssText = "background-color:rgba(0,0,0,.5)", t(e.backgroundColor, "rgba") || t(e.backgroundColor, "hsla")
//         }(),
//         Qt = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "<div class='sp-dd'>&#9660;</div>", "</div>"].join(""),
//         Kt = function() {
//             var t = "";
//             if (Xt)
//                 for (var e = 1; e <= 6; e++) t += "<div class='sp-" + e + "'></div>";
//             return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", t, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("")
//         }(),
//         o = "spectrum.id";
//     $t.fn.spectrum = function(n) {
//             if ("string" != typeof n) return this.spectrum("destroy").each(function() {
//                 var t = e(this, $t.extend({}, n, $t(this).data()));
//                 $t(this).data(o, t.id)
//             });
//             var i = this,
//                 r = Array.prototype.slice.call(arguments, 1);
//             return this.each(function() {
//                 var t = zt[$t(this).data(o)];
//                 if (t) {
//                     var e = t[n];
//                     if (!e) throw new Error("Spectrum: no such method: '" + n + "'");
//                     "get" == n ? i = t.get() : "container" == n ? i = t.container : "option" == n ? i = t.option.apply(t, r) : "destroy" == n ? (t.destroy(), $t(this).removeData(o)) : e.apply(t, r)
//                 }
//             }), i
//         }, $t.fn.spectrum.load = !0, $t.fn.spectrum.loadOpts = {}, $t.fn.spectrum.draggable = Vt, $t.fn.spectrum.defaults = r, $t.fn.spectrum.inputTypeColorSupport = function Ut() {
//             if ("undefined" == typeof Ut._cachedResult) {
//                 var t = $t("<input type='color'/>")[0];
//                 Ut._cachedResult = "color" === t.type && "" !== t.value
//             }
//             return Ut._cachedResult
//         }, $t.spectrum = {}, $t.spectrum.localization = {}, $t.spectrum.palettes = {}, $t.fn.spectrum.processNativeColorInputs = function() {
//             var t = $t("input[type=color]");
//             t.length && !Ut() && t.spectrum({
//                 preferredFormat: "hex6"
//             })
//         },
//         function() {
//             function i(t) {
//                 var e = {
//                         r: 0,
//                         g: 0,
//                         b: 0
//                     },
//                     n = 1,
//                     i = !1,
//                     r = !1;
//                 return "string" == typeof t && (t = D(t)), "object" == typeof t && (t.hasOwnProperty("r") && t.hasOwnProperty("g") && t.hasOwnProperty("b") ? (e = o(t.r, t.g, t.b), i = !0, r = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("v") ? (t.s = L(t.s), t.v = L(t.v), e = l(t.h, t.s, t.v), i = !0, r = "hsv") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("l") && (t.s = L(t.s), t.l = L(t.l), e = s(t.h, t.s, t.l), i = !0, r = "hsl"), t.hasOwnProperty("a") && (n = t.a)), n = k(n), {
//                     ok: i,
//                     format: t.format || r,
//                     r: H(255, I(e.r, 0)),
//                     g: H(255, I(e.g, 0)),
//                     b: H(255, I(e.b, 0)),
//                     a: n
//                 }
//             }

//             function o(t, e, n) {
//                 return {
//                     r: 255 * _(t, 255),
//                     g: 255 * _(e, 255),
//                     b: 255 * _(n, 255)
//                 }
//             }

//             function r(t, e, n) {
//                 t = _(t, 255), e = _(e, 255), n = _(n, 255);
//                 var i, r, o = I(t, e, n),
//                     s = H(t, e, n),
//                     a = (o + s) / 2;
//                 if (o == s) i = r = 0;
//                 else {
//                     var l = o - s;
//                     switch (r = .5 < a ? l / (2 - o - s) : l / (o + s), o) {
//                         case t:
//                             i = (e - n) / l + (e < n ? 6 : 0);
//                             break;
//                         case e:
//                             i = (n - t) / l + 2;
//                             break;
//                         case n:
//                             i = (t - e) / l + 4
//                     }
//                     i /= 6
//                 }
//                 return {
//                     h: i,
//                     s: r,
//                     l: a
//                 }
//             }

//             function s(t, e, n) {
//                 function i(t, e, n) {
//                     return n < 0 && (n += 1), 1 < n && (n -= 1), n < 1 / 6 ? t + 6 * (e - t) * n : n < .5 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t
//                 }
//                 var r, o, s;
//                 if (t = _(t, 360), e = _(e, 100), n = _(n, 100), 0 === e) r = o = s = n;
//                 else {
//                     var a = n < .5 ? n * (1 + e) : n + e - n * e,
//                         l = 2 * n - a;
//                     r = i(l, a, t + 1 / 3), o = i(l, a, t), s = i(l, a, t - 1 / 3)
//                 }
//                 return {
//                     r: 255 * r,
//                     g: 255 * o,
//                     b: 255 * s
//                 }
//             }

//             function a(t, e, n) {
//                 t = _(t, 255), e = _(e, 255), n = _(n, 255);
//                 var i, r, o = I(t, e, n),
//                     s = H(t, e, n),
//                     a = o,
//                     l = o - s;
//                 if (r = 0 === o ? 0 : l / o, o == s) i = 0;
//                 else {
//                     switch (o) {
//                         case t:
//                             i = (e - n) / l + (e < n ? 6 : 0);
//                             break;
//                         case e:
//                             i = (n - t) / l + 2;
//                             break;
//                         case n:
//                             i = (t - e) / l + 4
//                     }
//                     i /= 6
//                 }
//                 return {
//                     h: i,
//                     s: r,
//                     v: a
//                 }
//             }

//             function l(t, e, n) {
//                 t = 6 * _(t, 360), e = _(e, 100), n = _(n, 100);
//                 var i = $.floor(t),
//                     r = t - i,
//                     o = n * (1 - e),
//                     s = n * (1 - r * e),
//                     a = n * (1 - (1 - r) * e),
//                     l = i % 6;
//                 return {
//                     r: 255 * [n, s, o, o, a, n][l],
//                     g: 255 * [a, n, n, s, o, o][l],
//                     b: 255 * [o, o, a, n, n, s][l]
//                 }
//             }

//             function e(t, e, n, i) {
//                 var r = [A(q(t).toString(16)), A(q(e).toString(16)), A(q(n).toString(16))];
//                 return i && r[0].charAt(0) == r[0].charAt(1) && r[1].charAt(0) == r[1].charAt(1) && r[2].charAt(0) == r[2].charAt(1) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("")
//             }

//             function u(t, e, n, i) {
//                 return [A(P(i)), A(q(t).toString(16)), A(q(e).toString(16)), A(q(n).toString(16))].join("")
//             }

//             function t(t, e) {
//                 e = 0 === e ? 0 : e || 10;
//                 var n = F(t).toHsl();
//                 return n.s -= e / 100, n.s = E(n.s), F(n)
//             }

//             function n(t, e) {
//                 e = 0 === e ? 0 : e || 10;
//                 var n = F(t).toHsl();
//                 return n.s += e / 100, n.s = E(n.s), F(n)
//             }

//             function c(t) {
//                 return F(t).desaturate(100)
//             }

//             function h(t, e) {
//                 e = 0 === e ? 0 : e || 10;
//                 var n = F(t).toHsl();
//                 return n.l += e / 100, n.l = E(n.l), F(n)
//             }

//             function d(t, e) {
//                 e = 0 === e ? 0 : e || 10;
//                 var n = F(t).toRgb();
//                 return n.r = I(0, H(255, n.r - q(-e / 100 * 255))), n.g = I(0, H(255, n.g - q(-e / 100 * 255))), n.b = I(0, H(255, n.b - q(-e / 100 * 255))), F(n)
//             }

//             function f(t, e) {
//                 e = 0 === e ? 0 : e || 10;
//                 var n = F(t).toHsl();
//                 return n.l -= e / 100, n.l = E(n.l), F(n)
//             }

//             function p(t, e) {
//                 var n = F(t).toHsl(),
//                     i = (q(n.h) + e) % 360;
//                 return n.h = i < 0 ? 360 + i : i, F(n)
//             }

//             function m(t) {
//                 var e = F(t).toHsl();
//                 return e.h = (e.h + 180) % 360, F(e)
//             }

//             function g(t) {
//                 var e = F(t).toHsl(),
//                     n = e.h;
//                 return [F(t), F({
//                     h: (n + 120) % 360,
//                     s: e.s,
//                     l: e.l
//                 }), F({
//                     h: (n + 240) % 360,
//                     s: e.s,
//                     l: e.l
//                 })]
//             }

//             function v(t) {
//                 var e = F(t).toHsl(),
//                     n = e.h;
//                 return [F(t), F({
//                     h: (n + 90) % 360,
//                     s: e.s,
//                     l: e.l
//                 }), F({
//                     h: (n + 180) % 360,
//                     s: e.s,
//                     l: e.l
//                 }), F({
//                     h: (n + 270) % 360,
//                     s: e.s,
//                     l: e.l
//                 })]
//             }

//             function y(t) {
//                 var e = F(t).toHsl(),
//                     n = e.h;
//                 return [F(t), F({
//                     h: (n + 72) % 360,
//                     s: e.s,
//                     l: e.l
//                 }), F({
//                     h: (n + 216) % 360,
//                     s: e.s,
//                     l: e.l
//                 })]
//             }

//             function b(t, e, n) {
//                 e = e || 6, n = n || 30;
//                 var i = F(t).toHsl(),
//                     r = 360 / n,
//                     o = [F(t)];
//                 for (i.h = (i.h - (r * e >> 1) + 720) % 360; --e;) i.h = (i.h + r) % 360, o.push(F(i));
//                 return o
//             }

//             function w(t, e) {
//                 e = e || 6;
//                 for (var n = F(t).toHsv(), i = n.h, r = n.s, o = n.v, s = [], a = 1 / e; e--;) s.push(F({
//                     h: i,
//                     s: r,
//                     v: o
//                 })), o = (o + a) % 1;
//                 return s
//             }

//             function x(t) {
//                 var e = {};
//                 for (var n in t) t.hasOwnProperty(n) && (e[t[n]] = n);
//                 return e
//             }

//             function k(t) {
//                 return t = parseFloat(t), (isNaN(t) || t < 0 || 1 < t) && (t = 1), t
//             }

//             function _(t, e) {
//                 T(t) && (t = "100%");
//                 var n = S(t);
//                 return t = H(e, I(0, parseFloat(t))), n && (t = parseInt(t * e, 10) / 100), $.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
//             }

//             function E(t) {
//                 return H(1, I(0, t))
//             }

//             function C(t) {
//                 return parseInt(t, 16)
//             }

//             function T(t) {
//                 return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t)
//             }

//             function S(t) {
//                 return "string" == typeof t && -1 != t.indexOf("%")
//             }

//             function A(t) {
//                 return 1 == t.length ? "0" + t : "" + t
//             }

//             function L(t) {
//                 return t <= 1 && (t = 100 * t + "%"), t
//             }

//             function P(t) {
//                 return Math.round(255 * parseFloat(t)).toString(16)
//             }

//             function M(t) {
//                 return C(t) / 255
//             }

//             function D(t) {
//                 t = t.replace(R, "").replace(j, "").toLowerCase();
//                 var e, n = !1;
//                 if (U[t]) t = U[t], n = !0;
//                 else if ("transparent" == t) return {
//                     r: 0,
//                     g: 0,
//                     b: 0,
//                     a: 0,
//                     format: "name"
//                 };
//                 return (e = X.rgb.exec(t)) ? {
//                     r: e[1],
//                     g: e[2],
//                     b: e[3]
//                 } : (e = X.rgba.exec(t)) ? {
//                     r: e[1],
//                     g: e[2],
//                     b: e[3],
//                     a: e[4]
//                 } : (e = X.hsl.exec(t)) ? {
//                     h: e[1],
//                     s: e[2],
//                     l: e[3]
//                 } : (e = X.hsla.exec(t)) ? {
//                     h: e[1],
//                     s: e[2],
//                     l: e[3],
//                     a: e[4]
//                 } : (e = X.hsv.exec(t)) ? {
//                     h: e[1],
//                     s: e[2],
//                     v: e[3]
//                 } : (e = X.hsva.exec(t)) ? {
//                     h: e[1],
//                     s: e[2],
//                     v: e[3],
//                     a: e[4]
//                 } : (e = X.hex8.exec(t)) ? {
//                     a: M(e[1]),
//                     r: C(e[2]),
//                     g: C(e[3]),
//                     b: C(e[4]),
//                     format: n ? "name" : "hex8"
//                 } : (e = X.hex6.exec(t)) ? {
//                     r: C(e[1]),
//                     g: C(e[2]),
//                     b: C(e[3]),
//                     format: n ? "name" : "hex"
//                 } : !!(e = X.hex3.exec(t)) && {
//                     r: C(e[1] + "" + e[1]),
//                     g: C(e[2] + "" + e[2]),
//                     b: C(e[3] + "" + e[3]),
//                     format: n ? "name" : "hex"
//                 }
//             }
//             var R = /^[\s,#]+/,
//                 j = /\s+$/,
//                 N = 0,
//                 $ = Math,
//                 q = $.round,
//                 H = $.min,
//                 I = $.max,
//                 O = $.random,
//                 F = function(t, e) {
//                     if (e = e || {}, (t = t || "") instanceof F) return t;
//                     if (!(this instanceof F)) return new F(t, e);
//                     var n = i(t);
//                     this._originalInput = t, this._r = n.r, this._g = n.g, this._b = n.b, this._a = n.a, this._roundA = q(100 * this._a) / 100, this._format = e.format || n.format, this._gradientType = e.gradientType, this._r < 1 && (this._r = q(this._r)), this._g < 1 && (this._g = q(this._g)), this._b < 1 && (this._b = q(this._b)), this._ok = n.ok, this._tc_id = N++
//                 };
//             F.prototype = {
//                 isDark: function() {
//                     return this.getBrightness() < 128
//                 },
//                 isLight: function() {
//                     return !this.isDark()
//                 },
//                 isValid: function() {
//                     return this._ok
//                 },
//                 getOriginalInput: function() {
//                     return this._originalInput
//                 },
//                 getFormat: function() {
//                     return this._format
//                 },
//                 getAlpha: function() {
//                     return this._a
//                 },
//                 getBrightness: function() {
//                     var t = this.toRgb();
//                     return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
//                 },
//                 setAlpha: function(t) {
//                     return this._a = k(t), this._roundA = q(100 * this._a) / 100, this
//                 },
//                 toHsv: function() {
//                     var t = a(this._r, this._g, this._b);
//                     return {
//                         h: 360 * t.h,
//                         s: t.s,
//                         v: t.v,
//                         a: this._a
//                     }
//                 },
//                 toHsvString: function() {
//                     var t = a(this._r, this._g, this._b),
//                         e = q(360 * t.h),
//                         n = q(100 * t.s),
//                         i = q(100 * t.v);
//                     return 1 == this._a ? "hsv(" + e + ", " + n + "%, " + i + "%)" : "hsva(" + e + ", " + n + "%, " + i + "%, " + this._roundA + ")"
//                 },
//                 toHsl: function() {
//                     var t = r(this._r, this._g, this._b);
//                     return {
//                         h: 360 * t.h,
//                         s: t.s,
//                         l: t.l,
//                         a: this._a
//                     }
//                 },
//                 toHslString: function() {
//                     var t = r(this._r, this._g, this._b),
//                         e = q(360 * t.h),
//                         n = q(100 * t.s),
//                         i = q(100 * t.l);
//                     return 1 == this._a ? "hsl(" + e + ", " + n + "%, " + i + "%)" : "hsla(" + e + ", " + n + "%, " + i + "%, " + this._roundA + ")"
//                 },
//                 toHex: function(t) {
//                     return e(this._r, this._g, this._b, t)
//                 },
//                 toHexString: function(t) {
//                     return "#" + this.toHex(t)
//                 },
//                 toHex8: function() {
//                     return u(this._r, this._g, this._b, this._a)
//                 },
//                 toHex8String: function() {
//                     return "#" + this.toHex8()
//                 },
//                 toRgb: function() {
//                     return {
//                         r: q(this._r),
//                         g: q(this._g),
//                         b: q(this._b),
//                         a: this._a
//                     }
//                 },
//                 toRgbString: function() {
//                     return 1 == this._a ? "rgb(" + q(this._r) + ", " + q(this._g) + ", " + q(this._b) + ")" : "rgba(" + q(this._r) + ", " + q(this._g) + ", " + q(this._b) + ", " + this._roundA + ")"
//                 },
//                 toPercentageRgb: function() {
//                     return {
//                         r: q(100 * _(this._r, 255)) + "%",
//                         g: q(100 * _(this._g, 255)) + "%",
//                         b: q(100 * _(this._b, 255)) + "%",
//                         a: this._a
//                     }
//                 },
//                 toPercentageRgbString: function() {
//                     return 1 == this._a ? "rgb(" + q(100 * _(this._r, 255)) + "%, " + q(100 * _(this._g, 255)) + "%, " + q(100 * _(this._b, 255)) + "%)" : "rgba(" + q(100 * _(this._r, 255)) + "%, " + q(100 * _(this._g, 255)) + "%, " + q(100 * _(this._b, 255)) + "%, " + this._roundA + ")"
//                 },
//                 toName: function() {
//                     return 0 === this._a ? "transparent" : !(this._a < 1) && (z[e(this._r, this._g, this._b, !0)] || !1)
//                 },
//                 toFilter: function(t) {
//                     var e = "#" + u(this._r, this._g, this._b, this._a),
//                         n = e,
//                         i = this._gradientType ? "GradientType = 1, " : "";
//                     t && (n = F(t).toHex8String());
//                     return "progid:DXImageTransform.Microsoft.gradient(" + i + "startColorstr=" + e + ",endColorstr=" + n + ")"
//                 },
//                 toString: function(t) {
//                     var e = !!t;
//                     t = t || this._format;
//                     var n = !1,
//                         i = this._a < 1 && 0 <= this._a;
//                     return e || !i || "hex" !== t && "hex6" !== t && "hex3" !== t && "name" !== t ? ("rgb" === t && (n = this.toRgbString()), "prgb" === t && (n = this.toPercentageRgbString()), "hex" !== t && "hex6" !== t || (n = this.toHexString()), "hex3" === t && (n = this.toHexString(!0)), "hex8" === t && (n = this.toHex8String()), "name" === t && (n = this.toName()), "hsl" === t && (n = this.toHslString()), "hsv" === t && (n = this.toHsvString()), n || this.toHexString()) : "name" === t && 0 === this._a ? this.toName() : this.toRgbString()
//                 },
//                 _applyModification: function(t, e) {
//                     var n = t.apply(null, [this].concat([].slice.call(e)));
//                     return this._r = n._r, this._g = n._g, this._b = n._b, this.setAlpha(n._a), this
//                 },
//                 lighten: function() {
//                     return this._applyModification(h, arguments)
//                 },
//                 brighten: function() {
//                     return this._applyModification(d, arguments)
//                 },
//                 darken: function() {
//                     return this._applyModification(f, arguments)
//                 },
//                 desaturate: function() {
//                     return this._applyModification(t, arguments)
//                 },
//                 saturate: function() {
//                     return this._applyModification(n, arguments)
//                 },
//                 greyscale: function() {
//                     return this._applyModification(c, arguments)
//                 },
//                 spin: function() {
//                     return this._applyModification(p, arguments)
//                 },
//                 _applyCombination: function(t, e) {
//                     return t.apply(null, [this].concat([].slice.call(e)))
//                 },
//                 analogous: function() {
//                     return this._applyCombination(b, arguments)
//                 },
//                 complement: function() {
//                     return this._applyCombination(m, arguments)
//                 },
//                 monochromatic: function() {
//                     return this._applyCombination(w, arguments)
//                 },
//                 splitcomplement: function() {
//                     return this._applyCombination(y, arguments)
//                 },
//                 triad: function() {
//                     return this._applyCombination(g, arguments)
//                 },
//                 tetrad: function() {
//                     return this._applyCombination(v, arguments)
//                 }
//             }, F.fromRatio = function(t, e) {
//                 if ("object" == typeof t) {
//                     var n = {};
//                     for (var i in t) t.hasOwnProperty(i) && (n[i] = "a" === i ? t[i] : L(t[i]));
//                     t = n
//                 }
//                 return F(t, e)
//             }, F.equals = function(t, e) {
//                 return !(!t || !e) && F(t).toRgbString() == F(e).toRgbString()
//             }, F.random = function() {
//                 return F.fromRatio({
//                     r: O(),
//                     g: O(),
//                     b: O()
//                 })
//             }, F.mix = function(t, e, n) {
//                 n = 0 === n ? 0 : n || 50;
//                 var i, r = F(t).toRgb(),
//                     o = F(e).toRgb(),
//                     s = n / 100,
//                     a = 2 * s - 1,
//                     l = o.a - r.a,
//                     u = 1 - (i = ((i = a * l == -1 ? a : (a + l) / (1 + a * l)) + 1) / 2),
//                     c = {
//                         r: o.r * i + r.r * u,
//                         g: o.g * i + r.g * u,
//                         b: o.b * i + r.b * u,
//                         a: o.a * s + r.a * (1 - s)
//                     };
//                 return F(c)
//             }, F.readability = function(t, e) {
//                 var n = F(t),
//                     i = F(e),
//                     r = n.toRgb(),
//                     o = i.toRgb(),
//                     s = n.getBrightness(),
//                     a = i.getBrightness(),
//                     l = Math.max(r.r, o.r) - Math.min(r.r, o.r) + Math.max(r.g, o.g) - Math.min(r.g, o.g) + Math.max(r.b, o.b) - Math.min(r.b, o.b);
//                 return {
//                     brightness: Math.abs(s - a),
//                     color: l
//                 }
//             }, F.isReadable = function(t, e) {
//                 var n = F.readability(t, e);
//                 return 125 < n.brightness && 500 < n.color
//             }, F.mostReadable = function(t, e) {
//                 for (var n = null, i = 0, r = !1, o = 0; o < e.length; o++) {
//                     var s = F.readability(t, e[o]),
//                         a = 125 < s.brightness && 500 < s.color,
//                         l = s.brightness / 125 * 3 + s.color / 500;
//                     (a && !r || a && r && i < l || !a && !r && i < l) && (r = a, i = l, n = F(e[o]))
//                 }
//                 return n
//             };
//             var B, V, W, U = F.names = {
//                     aliceblue: "f0f8ff",
//                     antiquewhite: "faebd7",
//                     aqua: "0ff",
//                     aquamarine: "7fffd4",
//                     azure: "f0ffff",
//                     beige: "f5f5dc",
//                     bisque: "ffe4c4",
//                     black: "000",
//                     blanchedalmond: "ffebcd",
//                     blue: "00f",
//                     blueviolet: "8a2be2",
//                     brown: "a52a2a",
//                     burlywood: "deb887",
//                     burntsienna: "ea7e5d",
//                     cadetblue: "5f9ea0",
//                     chartreuse: "7fff00",
//                     chocolate: "d2691e",
//                     coral: "ff7f50",
//                     cornflowerblue: "6495ed",
//                     cornsilk: "fff8dc",
//                     crimson: "dc143c",
//                     cyan: "0ff",
//                     darkblue: "00008b",
//                     darkcyan: "008b8b",
//                     darkgoldenrod: "b8860b",
//                     darkgray: "a9a9a9",
//                     darkgreen: "006400",
//                     darkgrey: "a9a9a9",
//                     darkkhaki: "bdb76b",
//                     darkmagenta: "8b008b",
//                     darkolivegreen: "556b2f",
//                     darkorange: "ff8c00",
//                     darkorchid: "9932cc",
//                     darkred: "8b0000",
//                     darksalmon: "e9967a",
//                     darkseagreen: "8fbc8f",
//                     darkslateblue: "483d8b",
//                     darkslategray: "2f4f4f",
//                     darkslategrey: "2f4f4f",
//                     darkturquoise: "00ced1",
//                     darkviolet: "9400d3",
//                     deeppink: "ff1493",
//                     deepskyblue: "00bfff",
//                     dimgray: "696969",
//                     dimgrey: "696969",
//                     dodgerblue: "1e90ff",
//                     firebrick: "b22222",
//                     floralwhite: "fffaf0",
//                     forestgreen: "228b22",
//                     fuchsia: "f0f",
//                     gainsboro: "dcdcdc",
//                     ghostwhite: "f8f8ff",
//                     gold: "ffd700",
//                     goldenrod: "daa520",
//                     gray: "808080",
//                     green: "008000",
//                     greenyellow: "adff2f",
//                     grey: "808080",
//                     honeydew: "f0fff0",
//                     hotpink: "ff69b4",
//                     indianred: "cd5c5c",
//                     indigo: "4b0082",
//                     ivory: "fffff0",
//                     khaki: "f0e68c",
//                     lavender: "e6e6fa",
//                     lavenderblush: "fff0f5",
//                     lawngreen: "7cfc00",
//                     lemonchiffon: "fffacd",
//                     lightblue: "add8e6",
//                     lightcoral: "f08080",
//                     lightcyan: "e0ffff",
//                     lightgoldenrodyellow: "fafad2",
//                     lightgray: "d3d3d3",
//                     lightgreen: "90ee90",
//                     lightgrey: "d3d3d3",
//                     lightpink: "ffb6c1",
//                     lightsalmon: "ffa07a",
//                     lightseagreen: "20b2aa",
//                     lightskyblue: "87cefa",
//                     lightslategray: "789",
//                     lightslategrey: "789",
//                     lightsteelblue: "b0c4de",
//                     lightyellow: "ffffe0",
//                     lime: "0f0",
//                     limegreen: "32cd32",
//                     linen: "faf0e6",
//                     magenta: "f0f",
//                     maroon: "800000",
//                     mediumaquamarine: "66cdaa",
//                     mediumblue: "0000cd",
//                     mediumorchid: "ba55d3",
//                     mediumpurple: "9370db",
//                     mediumseagreen: "3cb371",
//                     mediumslateblue: "7b68ee",
//                     mediumspringgreen: "00fa9a",
//                     mediumturquoise: "48d1cc",
//                     mediumvioletred: "c71585",
//                     midnightblue: "191970",
//                     mintcream: "f5fffa",
//                     mistyrose: "ffe4e1",
//                     moccasin: "ffe4b5",
//                     navajowhite: "ffdead",
//                     navy: "000080",
//                     oldlace: "fdf5e6",
//                     olive: "808000",
//                     olivedrab: "6b8e23",
//                     orange: "ffa500",
//                     orangered: "ff4500",
//                     orchid: "da70d6",
//                     palegoldenrod: "eee8aa",
//                     palegreen: "98fb98",
//                     paleturquoise: "afeeee",
//                     palevioletred: "db7093",
//                     papayawhip: "ffefd5",
//                     peachpuff: "ffdab9",
//                     peru: "cd853f",
//                     pink: "ffc0cb",
//                     plum: "dda0dd",
//                     powderblue: "b0e0e6",
//                     purple: "800080",
//                     rebeccapurple: "663399",
//                     red: "f00",
//                     rosybrown: "bc8f8f",
//                     royalblue: "4169e1",
//                     saddlebrown: "8b4513",
//                     salmon: "fa8072",
//                     sandybrown: "f4a460",
//                     seagreen: "2e8b57",
//                     seashell: "fff5ee",
//                     sienna: "a0522d",
//                     silver: "c0c0c0",
//                     skyblue: "87ceeb",
//                     slateblue: "6a5acd",
//                     slategray: "708090",
//                     slategrey: "708090",
//                     snow: "fffafa",
//                     springgreen: "00ff7f",
//                     steelblue: "4682b4",
//                     tan: "d2b48c",
//                     teal: "008080",
//                     thistle: "d8bfd8",
//                     tomato: "ff6347",
//                     turquoise: "40e0d0",
//                     violet: "ee82ee",
//                     wheat: "f5deb3",
//                     white: "fff",
//                     whitesmoke: "f5f5f5",
//                     yellow: "ff0",
//                     yellowgreen: "9acd32"
//                 },
//                 z = F.hexNames = x(U),
//                 X = (V = "[\\s|\\(]+(" + (B = "(?:" + "[-\\+]?\\d*\\.\\d+%?" + ")|(?:" + "[-\\+]?\\d+%?" + ")") + ")[,|\\s]+(" + B + ")[,|\\s]+(" + B + ")\\s*\\)?", W = "[\\s|\\(]+(" + B + ")[,|\\s]+(" + B + ")[,|\\s]+(" + B + ")[,|\\s]+(" + B + ")\\s*\\)?", {
//                     rgb: new RegExp("rgb" + V),
//                     rgba: new RegExp("rgba" + W),
//                     hsl: new RegExp("hsl" + V),
//                     hsla: new RegExp("hsla" + W),
//                     hsv: new RegExp("hsv" + V),
//                     hsva: new RegExp("hsva" + W),
//                     hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
//                     hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
//                     hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
//                 });
//             window.tinycolor = F
//         }(), $t(function() {
//             $t.fn.spectrum.load && $t.fn.spectrum.processNativeColorInputs()
//         })
// }),
// function(o) {
//     "use strict";

//     function s(i, r) {
//         return this.each(function() {
//             var t = o(this),
//                 e = t.data("bs.modal"),
//                 n = o.extend({}, a.DEFAULTS, t.data(), "object" == typeof i && i);
//             e || t.data("bs.modal", e = new a(this, n)), "string" == typeof i ? e[i](r) : n.show && e.show(r)
//         })
//     }
//     var a = function(t, e) {
//         this.options = e, this.$body = o(document.body), this.$element = o(t), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, o.proxy(function() {
//             this.$element.trigger("loaded.bs.modal")
//         }, this))
//     };
//     a.VERSION = "3.3.7", a.TRANSITION_DURATION = 300, a.BACKDROP_TRANSITION_DURATION = 150, a.DEFAULTS = {
//         backdrop: !0,
//         keyboard: !0,
//         show: !0
//     }, a.prototype.toggle = function(t) {
//         return this.isShown ? this.hide() : this.show(t)
//     }, a.prototype.show = function(n) {
//         var i = this,
//             t = o.Event("show.bs.modal", {
//                 relatedTarget: n
//             });
//         this.$element.trigger(t), this.isShown || t.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', o.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
//             i.$element.one("mouseup.dismiss.bs.modal", function(t) {
//                 o(t.target).is(i.$element) && (i.ignoreBackdropClick = !0)
//             })
//         }), this.backdrop(function() {
//             var t = o.support.transition && i.$element.hasClass("fade");
//             i.$element.parent().length || i.$element.appendTo(i.$body), i.$element.show().scrollTop(0), i.adjustDialog(), t && i.$element[0].offsetWidth, i.$element.addClass("in"), i.enforceFocus();
//             var e = o.Event("shown.bs.modal", {
//                 relatedTarget: n
//             });
//             t ? i.$dialog.one("bsTransitionEnd", function() {
//                 i.$element.trigger("focus").trigger(e)
//             }).emulateTransitionEnd(a.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(e)
//         }))
//     }, a.prototype.hide = function(t) {
//         t && t.preventDefault(), t = o.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), o(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), o.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", o.proxy(this.hideModal, this)).emulateTransitionEnd(a.TRANSITION_DURATION) : this.hideModal())
//     }, a.prototype.enforceFocus = function() {
//         o(document).off("focusin.bs.modal").on("focusin.bs.modal", o.proxy(function(t) {
//             document === t.target || this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
//         }, this))
//     }, a.prototype.escape = function() {
//         this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", o.proxy(function(t) {
//             27 == t.which && this.hide()
//         }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
//     }, a.prototype.resize = function() {
//         this.isShown ? o(window).on("resize.bs.modal", o.proxy(this.handleUpdate, this)) : o(window).off("resize.bs.modal")
//     }, a.prototype.hideModal = function() {
//         var t = this;
//         this.$element.hide(), this.backdrop(function() {
//             t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
//         })
//     }, a.prototype.removeBackdrop = function() {
//         this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
//     }, a.prototype.backdrop = function(t) {
//         var e = this,
//             n = this.$element.hasClass("fade") ? "fade" : "";
//         if (this.isShown && this.options.backdrop) {
//             var i = o.support.transition && n;
//             if (this.$backdrop = o(document.createElement("div")).addClass("modal-backdrop " + n).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", o.proxy(function(t) {
//                     this.ignoreBackdropClick ? this.ignoreBackdropClick = !1 : t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide())
//                 }, this)), i && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
//             i ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : t()
//         } else if (!this.isShown && this.$backdrop) {
//             this.$backdrop.removeClass("in");
//             var r = function() {
//                 e.removeBackdrop(), t && t()
//             };
//             o.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(a.BACKDROP_TRANSITION_DURATION) : r()
//         } else t && t()
//     }, a.prototype.handleUpdate = function() {
//         this.adjustDialog()
//     }, a.prototype.adjustDialog = function() {
//         var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
//         this.$element.css({
//             paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
//             paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
//         })
//     }, a.prototype.resetAdjustments = function() {
//         this.$element.css({
//             paddingLeft: "",
//             paddingRight: ""
//         })
//     }, a.prototype.checkScrollbar = function() {
//         var t = window.innerWidth;
//         if (!t) {
//             var e = document.documentElement.getBoundingClientRect();
//             t = e.right - Math.abs(e.left)
//         }
//         this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
//     }, a.prototype.setScrollbar = function() {
//         var t = parseInt(this.$body.css("padding-right") || 0, 10);
//         this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
//     }, a.prototype.resetScrollbar = function() {
//         this.$body.css("padding-right", this.originalBodyPad)
//     }, a.prototype.measureScrollbar = function() {
//         var t = document.createElement("div");
//         t.className = "modal-scrollbar-measure", this.$body.append(t);
//         var e = t.offsetWidth - t.clientWidth;
//         return this.$body[0].removeChild(t), e
//     };
//     var t = o.fn.modal;
//     o.fn.modal = s, o.fn.modal.Constructor = a, o.fn.modal.noConflict = function() {
//         return o.fn.modal = t, this
//     }, o(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
//         var e = o(this),
//             n = e.attr("href"),
//             i = o(e.attr("data-target") || n && n.replace(/.*(?=#[^\s]+$)/, "")),
//             r = i.data("bs.modal") ? "toggle" : o.extend({
//                 remote: !/#/.test(n) && n
//             }, i.data(), e.data());
//         e.is("a") && t.preventDefault(), i.one("show.bs.modal", function(t) {
//             t.isDefaultPrevented() || i.one("hidden.bs.modal", function() {
//                 e.is(":visible") && e.trigger("focus")
//             })
//         }), s.call(i, r, this)
//     })
// }(jQuery),
// function(i) {
//     "use strict";

//     function t() {
//         var t = document.createElement("bootstrap"),
//             e = {
//                 WebkitTransition: "webkitTransitionEnd",
//                 MozTransition: "transitionend",
//                 OTransition: "oTransitionEnd otransitionend",
//                 transition: "transitionend"
//             };
//         for (var n in e)
//             if (t.style[n] !== undefined) return {
//                 end: e[n]
//             };
//         return !1
//     }
//     i.fn.emulateTransitionEnd = function(t) {
//         var e = !1,
//             n = this;
//         return i(this).one("bsTransitionEnd", function() {
//             e = !0
//         }), setTimeout(function() {
//             e || i(n).trigger(i.support.transition.end)
//         }, t), this
//     }, i(function() {
//         i.support.transition = t(), i.support.transition && (i.event.special.bsTransitionEnd = {
//             bindType: i.support.transition.end,
//             delegateType: i.support.transition.end,
//             handle: function(t) {
//                 if (i(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
//             }
//         })
//     })
// }(jQuery),
// function(t, e) {
//     "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.holmes = e()
// }(this, function() {
//     "use strict";
//     var i, t, r = "undefined" == typeof window ? global : window,
//         o = function(t, e) {
//             return -1 !== t.indexOf(e)
//         },
//         s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
//             return typeof t
//         } : function(t) {
//             return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
//         },
//         a = (function() {
//             function u(t) {
//                 this.value = t
//             }

//             function t(r) {
//                 function o(t, e) {
//                     try {
//                         var n = r[t](e),
//                             i = n.value;
//                         i instanceof u ? Promise.resolve(i.value).then(function(t) {
//                             o("next", t)
//                         }, function(t) {
//                             o("throw", t)
//                         }) : s(n.done ? "return" : "normal", n.value)
//                     } catch (u) {
//                         s("throw", u)
//                     }
//                 }

//                 function s(t, e) {
//                     "return" === t ? a.resolve({
//                         value: e,
//                         done: !0
//                     }) : "throw" === t ? a.reject(e) : a.resolve({
//                         value: e,
//                         done: !1
//                     }), (a = a.next) ? o(a.key, a.arg) : l = null
//                 }
//                 var a, l;
//                 this._invoke = function(i, r) {
//                     return new Promise(function(t, e) {
//                         var n = {
//                             key: i,
//                             arg: r,
//                             resolve: t,
//                             reject: e,
//                             next: null
//                         };
//                         l ? l = l.next = n : (a = l = n, o(i, r))
//                     })
//                 }, "function" != typeof r["return"] && (this["return"] = void 0)
//             }
//             "function" == typeof Symbol && Symbol.asyncIterator && (t.prototype[Symbol.asyncIterator] = function() {
//                 return this
//             }), t.prototype.next = function(t) {
//                 return this._invoke("next", t)
//             }, t.prototype["throw"] = function(t) {
//                 return this._invoke("throw", t)
//             }, t.prototype["return"] = function(t) {
//                 return this._invoke("return", t)
//             }
//         }(), function(t, e) {
//             if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
//         }),
//         e = function() {
//             function i(t, e) {
//                 for (var n, i = 0; i < e.length; i++)(n = e[i]).enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
//             }
//             return function(t, e, n) {
//                 return e && i(t.prototype, e), n && i(t, n), t
//             }
//         }(),
//         l = {
//             invalidInput: "The Holmes input was no <input> or contenteditable.",
//             optionsObject: 'The options need to be given inside an object like this:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',
//             findOption: 'A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',
//             noInput: "Your Holmes.input didn't match a querySelector",
//             impossiblePlaceholder: "The Holmes placeholder couldn't be put; the elements had no parent."
//         },
//         u = function() {
//             function r(t) {
//                 var n = this;
//                 a(this, r);
//                 var i = !1;
//                 if ("object" !== (void 0 === t ? "undefined" : s(t))) throw new Error(l.optionsObject);
//                 if ("string" != typeof t.find) throw new Error(l.findOption);
//                 var e = {
//                     input: "input[type=search]",
//                     find: "",
//                     placeholder: void 0,
//                     mark: !1,
//                     "class": {
//                         visible: void 0,
//                         hidden: "hidden"
//                     },
//                     dynamic: !1,
//                     minCharacters: 0,
//                     hiddenAttr: !1,
//                     shouldShow: o,
//                     onHidden: void 0,
//                     onVisible: void 0,
//                     onEmpty: void 0,
//                     onFound: void 0,
//                     onInput: void 0
//                 };
//                 this.options = Object.assign({}, e, t), this.options["class"] = Object.assign({}, e["class"], t["class"]), this.hidden = 0, this.running = !1,
//                     window.addEventListener("DOMContentLoaded", function() {
//                         return n.start()
//                     }), this.search = function() {
//                         var e = !(n.running = !0);
//                         n.searchString = n.inputString(), n.options.minCharacters && 0 !== n.searchString.length && n.options.minCharacters > n.searchString.length || (n.options.dynamic && (n.elements = document.querySelectorAll(n.options.find), n.elementsLength = n.elements.length, n.elementsArray = Array.prototype.slice.call(n.elements)), n.options.mark && (n._regex = new RegExp("(" + n.searchString + ")(?![^<]*>)", "gi")), n.elementsArray.forEach(function(t) {
//                             n.options.shouldShow(t.textContent.toLowerCase(), n.searchString) ? (n._showElement(t), i && "function" == typeof n.options.onFound && n.options.onFound(n.placeholderNode), e = !0) : n._hideElement(t)
//                         }), "function" == typeof n.options.onInput && n.options.onInput(n.searchString), e ? n.options.placeholder && n._hideElement(n.placeholderNode) : (n.options.placeholder && n._showElement(n.placeholderNode), 0 == i && (i = !0, "function" == typeof n.options.onEmpty && n.options.onEmpty(n.placeholderNode))))
//                     }
//             }
//             return e(r, [{
//                 key: "_hideElement",
//                 value: function(t) {
//                     this.options["class"].visible && t.classList.remove(this.options["class"].visible), t.classList.contains(this.options["class"].hidden) || (t.classList.add(this.options["class"].hidden), this.hidden++, "function" == typeof this.options.onHidden && this.options.onHidden(t)), this.options.hiddenAttr && t.setAttribute("hidden", "true"), this.options.mark && (t.innerHTML = t.innerHTML.replace(/<\/?mark>/g, ""))
//                 }
//             }, {
//                 key: "_showElement",
//                 value: function(t) {
//                     this.options["class"].visible && t.classList.add(this.options["class"].visible), t.classList.contains(this.options["class"].hidden) && (t.classList.remove(this.options["class"].hidden), this.hidden--, "function" == typeof this.options.onVisible && this.options.onVisible(t)), this.options.hiddenAttr && t.removeAttribute("hidden"), this.options.mark && (t.innerHTML = t.innerHTML.replace(/<\/?mark>/g, ""), this.searchString.length && (t.innerHTML = t.innerHTML.replace(this._regex, "<mark>$1</mark>")))
//                 }
//             }, {
//                 key: "_inputHandler",
//                 value: function() {
//                     console.warn("You can now directly call .search() to refresh the results"), this.search()
//                 }
//             }, {
//                 key: "inputString",
//                 value: function() {
//                     if (this.input instanceof HTMLInputElement) return this.input.value.toLowerCase();
//                     if (this.input.isContentEditable) return this.input.textContent.toLowerCase();
//                     throw new Error(l.invalidInput)
//                 }
//             }, {
//                 key: "setInput",
//                 value: function(t) {
//                     if (this.input instanceof HTMLInputElement) this.input.value = t;
//                     else {
//                         if (!this.input.isContentEditable) throw new Error(l.invalidInput);
//                         this.input.textContent = t
//                     }
//                 }
//             }, {
//                 key: "start",
//                 value: function() {
//                     var t = document.querySelector(this.options.input);
//                     if (!(t instanceof HTMLElement)) throw new Error(l.noInput);
//                     if (this.input = t, "string" != typeof this.options.find) throw new Error(l.findOption);
//                     if (this.elements = document.querySelectorAll(this.options.find), this.elementsLength = this.elements.length, this.elementsArray = Array.prototype.slice.call(this.elements), this.hidden = 0, "string" == typeof this.options.placeholder) {
//                         var e = this.options.placeholder;
//                         if (this.placeholderNode = document.createElement("div"), this.placeholderNode.id = "holmes-placeholder", this._hideElement(this.placeholderNode), this.placeholderNode.innerHTML = e, !(this.elements[0].parentNode instanceof Element)) throw new Error(l.impossiblePlaceholder);
//                         this.elements[0].parentNode.appendChild(this.placeholderNode)
//                     }
//                     if (this.options["class"].visible) {
//                         var n = this.options["class"].visible;
//                         this.elementsArray.forEach(function(t) {
//                             t.classList.add(n)
//                         })
//                     }
//                     this.input.addEventListener("input", this.search)
//                 }
//             }, {
//                 key: "stop",
//                 value: function() {
//                     var n = this;
//                     return new Promise(function(t, e) {
//                         try {
//                             n.input.removeEventListener("input", n.search), n.options.placeholder && (n.placeholderNode.parentNode ? n.placeholderNode.parentNode.removeChild(n.placeholderNode) : e(new Error(l.impossiblePlaceholder))), n.options.mark && n.elementsArray.forEach(function(t) {
//                                 t.innerHTML = t.innerHTML.replace(/<\/?mark>/g, "")
//                             }), n.running = !1, t("This instance of Holmes has been stopped.")
//                         } catch (u) {
//                             e(u)
//                         }
//                     })
//                 }
//             }, {
//                 key: "clear",
//                 value: function() {
//                     var e = this;
//                     this.setInput(""), this.elementsArray.forEach(function(t) {
//                         e._showElement(t)
//                     }), this.options.placeholder && this._hideElement(this.placeholderNode), this.hidden = 0
//                 }
//             }, {
//                 key: "count",
//                 value: function() {
//                     return {
//                         all: this.elementsLength,
//                         hidden: this.hidden,
//                         visible: this.elementsLength - this.hidden
//                     }
//                 }
//             }]), r
//         }();
//     return i = u, (t = function() {
//         for (var t = arguments.length, e = Array(t), n = 0; n < t; n++) e[n] = arguments[n];
//         return void 0 !== this && this !== r ? i.call.apply(i, [this].concat(e)) : new(Function.prototype.bind.apply(i, [null].concat(e)))
//     }).__proto__ = i, t.prototype = i.prototype, t
// }), jQuery.trumbowyg = {
//         langs: {
//             en: {
//                 viewHTML: "View HTML",
//                 undo: "Undo",
//                 redo: "Redo",
//                 formatting: "Formatting",
//                 p: "Paragraph",
//                 blockquote: "Quote",
//                 code: "Code",
//                 header: "Header",
//                 bold: "Bold",
//                 italic: "Italic",
//                 strikethrough: "Stroke",
//                 underline: "Underline",
//                 strong: "Strong",
//                 em: "Emphasis",
//                 del: "Deleted",
//                 superscript: "Superscript",
//                 subscript: "Subscript",
//                 unorderedList: "Unordered list",
//                 orderedList: "Ordered list",
//                 insertImage: "Insert Image",
//                 link: "Link",
//                 createLink: "Insert link",
//                 unlink: "Remove link",
//                 justifyLeft: "Align Left",
//                 justifyCenter: "Align Center",
//                 justifyRight: "Align Right",
//                 justifyFull: "Align Justify",
//                 horizontalRule: "Insert horizontal rule",
//                 removeformat: "Remove format",
//                 fullscreen: "Fullscreen",
//                 close: "Close",
//                 submit: "Confirm",
//                 reset: "Cancel",
//                 required: "Required",
//                 description: "Description",
//                 title: "Title",
//                 text: "Text",
//                 target: "Target",
//                 width: "Width"
//             }
//         },
//         plugins: {},
//         svgPath: null,
//         hideButtonTexts: null
//     }, Object.defineProperty(jQuery.trumbowyg, "defaultOptions", {
//         value: {
//             lang: "en",
//             fixedBtnPane: !1,
//             fixedFullWidth: !1,
//             autogrow: !1,
//             autogrowOnEnter: !1,
//             imageWidthModalEdit: !1,
//             prefix: "trumbowyg-",
//             semantic: !0,
//             resetCss: !1,
//             removeformatPasted: !1,
//             tagsToRemove: [],
//             tagsToKeep: ["hr", "img", "embed", "iframe", "input"],
//             btns: [
//                 ["viewHTML"],
//                 ["undo", "redo"],
//                 ["formatting"],
//                 ["strong", "em", "del"],
//                 ["superscript", "subscript"],
//                 ["link"],
//                 ["insertImage"],
//                 ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],
//                 ["unorderedList", "orderedList"],
//                 ["horizontalRule"],
//                 ["removeformat"],
//                 ["fullscreen"]
//             ],
//             btnsDef: {},
//             inlineElementsSelector: "a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u",
//             pasteHandlers: [],
//             plugins: {},
//             urlProtocol: !1,
//             minimalLinks: !1
//         },
//         writable: !1,
//         enumerable: !0,
//         configurable: !1
//     }),
//     function(f, p, m, g) {
//         "use strict";
//         var c = "tbwconfirm",
//             h = "tbwcancel";
//         g.fn.trumbowyg = function(t, e) {
//             var n = "trumbowyg";
//             if (t === Object(t) || !t) return this.each(function() {
//                 g(this).data(n) || g(this).data(n, new o(this, t))
//             });
//             if (1 === this.length) try {
//                 var i = g(this).data(n);
//                 switch (t) {
//                     case "execCmd":
//                         return i.execCmd(e.cmd, e.param, e.forceCss);
//                     case "openModal":
//                         return i.openModal(e.title, e.content);
//                     case "closeModal":
//                         return i.closeModal();
//                     case "openModalInsert":
//                         return i.openModalInsert(e.title, e.fields, e.callback);
//                     case "saveRange":
//                         return i.saveRange();
//                     case "getRange":
//                         return i.range;
//                     case "getRangeText":
//                         return i.getRangeText();
//                     case "restoreRange":
//                         return i.restoreRange();
//                     case "enable":
//                         return i.setDisabled(!1);
//                     case "disable":
//                         return i.setDisabled(!0);
//                     case "toggle":
//                         return i.toggle();
//                     case "destroy":
//                         return i.destroy();
//                     case "empty":
//                         return i.empty();
//                     case "html":
//                         return i.html(e)
//                 }
//             } catch (r) {}
//             return !1
//         };
//         var o = function(t, e) {
//             var n = this,
//                 i = "trumbowyg-icons",
//                 r = g.trumbowyg;
//             n.doc = t.ownerDocument || m, n.$ta = g(t), n.$c = g(t), null != (e = e || {}).lang || null != r.langs[e.lang] ? n.lang = g.extend(!0, {}, r.langs.en, r.langs[e.lang]) : n.lang = r.langs.en, n.hideButtonTexts = null != r.hideButtonTexts ? r.hideButtonTexts : e.hideButtonTexts;
//             var o = null != r.svgPath ? r.svgPath : e.svgPath;
//             if (n.hasSvg = !1 !== o, n.svgPath = n.doc.querySelector("base") ? p.location.href.split("#")[0] : "", 0 === g("#" + i, n.doc).length && !1 !== o) {
//                 if (null == o) {
//                     for (var s = m.getElementsByTagName("script"), a = 0; a < s.length; a += 1) {
//                         var l = s[a].src,
//                             u = l.match("trumbowyg(.min)?.js");
//                         null != u && (o = l.substring(0, l.indexOf(u[0])) + "ui/icons.svg")
//                     }
//                     null == o && console.warn("You must define svgPath: https://goo.gl/CfTY9U")
//                 }
//                 var c = n.doc.createElement("div");
//                 c.id = i, n.doc.body.insertBefore(c, n.doc.body.childNodes[0]), g.ajax({
//                     async: !0,
//                     type: "GET",
//                     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//                     dataType: "xml",
//                     crossDomain: !0,
//                     url: o,
//                     data: null,
//                     beforeSend: null,
//                     complete: null,
//                     success: function(t) {
//                         c.innerHTML = (new XMLSerializer).serializeToString(t.documentElement)
//                     }
//                 })
//             }
//             var h = n.lang.header,
//                 d = function() {
//                     return (p.chrome || p.Intl && Intl.v8BreakIterator) && "CSS" in p
//                 };
//             n.btnsDef = {
//                 viewHTML: {
//                     fn: "toggle",
//                     "class": "trumbowyg-not-disable"
//                 },
//                 undo: {
//                     isSupported: d,
//                     key: "Z"
//                 },
//                 redo: {
//                     isSupported: d,
//                     key: "Y"
//                 },
//                 p: {
//                     fn: "formatBlock"
//                 },
//                 blockquote: {
//                     fn: "formatBlock"
//                 },
//                 h1: {
//                     fn: "formatBlock",
//                     title: h + " 1"
//                 },
//                 h2: {
//                     fn: "formatBlock",
//                     title: h + " 2"
//                 },
//                 h3: {
//                     fn: "formatBlock",
//                     title: h + " 3"
//                 },
//                 h4: {
//                     fn: "formatBlock",
//                     title: h + " 4"
//                 },
//                 subscript: {
//                     tag: "sub"
//                 },
//                 superscript: {
//                     tag: "sup"
//                 },
//                 bold: {
//                     key: "B",
//                     tag: "b"
//                 },
//                 italic: {
//                     key: "I",
//                     tag: "i"
//                 },
//                 underline: {
//                     tag: "u"
//                 },
//                 strikethrough: {
//                     tag: "strike"
//                 },
//                 strong: {
//                     fn: "bold",
//                     key: "B"
//                 },
//                 em: {
//                     fn: "italic",
//                     key: "I"
//                 },
//                 del: {
//                     fn: "strikethrough"
//                 },
//                 createLink: {
//                     key: "K",
//                     tag: "a"
//                 },
//                 unlink: {},
//                 insertImage: {},
//                 justifyLeft: {
//                     tag: "left",
//                     forceCss: !0
//                 },
//                 justifyCenter: {
//                     tag: "center",
//                     forceCss: !0
//                 },
//                 justifyRight: {
//                     tag: "right",
//                     forceCss: !0
//                 },
//                 justifyFull: {
//                     tag: "justify",
//                     forceCss: !0
//                 },
//                 unorderedList: {
//                     fn: "insertUnorderedList",
//                     tag: "ul"
//                 },
//                 orderedList: {
//                     fn: "insertOrderedList",
//                     tag: "ol"
//                 },
//                 horizontalRule: {
//                     fn: "insertHorizontalRule"
//                 },
//                 removeformat: {},
//                 fullscreen: {
//                     "class": "trumbowyg-not-disable"
//                 },
//                 close: {
//                     fn: "destroy",
//                     "class": "trumbowyg-not-disable"
//                 },
//                 formatting: {
//                     dropdown: ["p", "blockquote", "h1", "h2", "h3", "h4"],
//                     ico: "p"
//                 },
//                 link: {
//                     dropdown: ["createLink", "unlink"]
//                 }
//             }, n.o = g.extend(!0, {}, r.defaultOptions, e), n.o.hasOwnProperty("imgDblClickHandler") || (n.o.imgDblClickHandler = n.getDefaultImgDblClickHandler()), n.urlPrefix = n.setupUrlPrefix(), n.disabled = n.o.disabled || "TEXTAREA" === t.nodeName && t.disabled, e.btns ? n.o.btns = e.btns : n.o.semantic || (n.o.btns[3] = ["bold", "italic", "underline", "strikethrough"]), g.each(n.o.btnsDef, function(t, e) {
//                 n.addBtnDef(t, e)
//             }), n.eventNamespace = "trumbowyg-event", n.keys = [], n.tagToButton = {}, n.tagHandlers = [], n.pasteHandlers = [].concat(n.o.pasteHandlers), n.isIE = -1 !== f.userAgent.indexOf("MSIE") || -1 !== f.appVersion.indexOf("Trident/"), n.init()
//         };
//         o.prototype = {
//             DEFAULT_SEMANTIC_MAP: {
//                 b: "strong",
//                 i: "em",
//                 s: "del",
//                 strike: "del",
//                 div: "p"
//             },
//             init: function() {
//                 var t = this;
//                 t.height = t.$ta.height(), t.initPlugins();
//                 try {
//                     t.doc.execCommand("enableObjectResizing", !1, !1), t.doc.execCommand("defaultParagraphSeparator", !1, "p")
//                 } catch (e) {}
//                 t.buildEditor(), t.buildBtnPane(), t.fixedBtnPaneEvents(), t.buildOverlay(), setTimeout(function() {
//                     t.disabled && t.setDisabled(!0), t.$c.trigger("tbwinit")
//                 })
//             },
//             addBtnDef: function(t, e) {
//                 this.btnsDef[t] = e
//             },
//             setupUrlPrefix: function() {
//                 var t = this.o.urlProtocol;
//                 if (t) return "string" != typeof t ? "https://" : /:\/\/$/.test(t) ? t : t + "://"
//             },
//             buildEditor: function() {
//                 var r = this,
//                     e = r.o.prefix,
//                     t = "";
//                 r.$box = g("<div/>", {
//                     "class": e + "box " + e + "editor-visible " + e + r.o.lang + " trumbowyg"
//                 }), r.isTextarea = r.$ta.is("textarea"), r.isTextarea ? (t = r.$ta.val(), r.$ed = g("<div/>"), r.$box.insertAfter(r.$ta).append(r.$ed, r.$ta)) : (r.$ed = r.$ta, t = r.$ed.html(), r.$ta = g("<textarea/>", {
//                     name: r.$ta.attr("id"),
//                     height: r.height
//                 }).val(t), r.$box.insertAfter(r.$ed).append(r.$ta, r.$ed), r.syncCode()), r.$ta.addClass(e + "textarea").attr("tabindex", -1), r.$ed.addClass(e + "editor").attr({
//                     contenteditable: !0,
//                     dir: r.lang._dir || "ltr"
//                 }).html(t), r.o.tabindex && r.$ed.attr("tabindex", r.o.tabindex), r.$c.is("[placeholder]") && r.$ed.attr("placeholder", r.$c.attr("placeholder")), r.$c.is("[spellcheck]") && r.$ed.attr("spellcheck", r.$c.attr("spellcheck")), r.o.resetCss && r.$ed.addClass(e + "reset-css"), r.o.autogrow || r.$ta.add(r.$ed).css({
//                     height: r.height
//                 }), r.semanticCode(), r.o.autogrowOnEnter && r.$ed.addClass(e + "autogrow-on-enter");
//                 var n, i = !1,
//                     o = !1,
//                     s = "keyup";
//                 r.$ed.on("dblclick", "img", r.o.imgDblClickHandler).on("keydown", function(t) {
//                     if ((t.ctrlKey || t.metaKey) && !t.altKey) {
//                         i = !0;
//                         var e = r.keys[String.fromCharCode(t.which).toUpperCase()];
//                         try {
//                             return r.execCmd(e.fn, e.param), !1
//                         } catch (n) {}
//                     }
//                 }).on("compositionstart compositionupdate", function() {
//                     o = !0
//                 }).on(s + " compositionend", function(t) {
//                     if ("compositionend" === t.type) o = !1;
//                     else if (o) return;
//                     var e = t.which;
//                     if (!(37 <= e && e <= 40)) {
//                         if (!t.ctrlKey && !t.metaKey || 89 !== e && 90 !== e)
//                             if (i || 17 === e) "undefined" == typeof t.which && r.semanticCode(!1, !1, !0);
//                             else {
//                                 var n = !r.isIE || "compositionend" === t.type;
//                                 r.semanticCode(!1, n && 13 === e), r.$c.trigger("tbwchange")
//                             }
//                         else r.$c.trigger("tbwchange");
//                         setTimeout(function() {
//                             i = !1
//                         }, 50)
//                     }
//                 }).on("mouseup keydown keyup", function(t) {
//                     (!t.ctrlKey && !t.metaKey || t.altKey) && setTimeout(function() {
//                         i = !1
//                     }, 50), clearTimeout(n), n = setTimeout(function() {
//                         r.updateButtonPaneStatus()
//                     }, 50)
//                 }).on("focus blur", function(t) {
//                     if (r.$c.trigger("tbw" + t.type), "blur" === t.type && g("." + e + "active-button", r.$btnPane).removeClass(e + "active-button " + e + "active"), r.o.autogrowOnEnter) {
//                         if (r.autogrowOnEnterDontClose) return;
//                         "focus" === t.type ? (r.autogrowOnEnterWasFocused = !0, r.autogrowEditorOnEnter()) : r.o.autogrow || (r.$ed.css({
//                             height: r.$ed.css("min-height")
//                         }), r.$c.trigger("tbwresize"))
//                     }
//                 }).on("cut drop", function() {
//                     setTimeout(function() {
//                         r.semanticCode(!1, !0), r.$c.trigger("tbwchange")
//                     }, 0)
//                 }).on("paste", function(n) {
//                     if (r.o.removeformatPasted) {
//                         n.preventDefault(), p.getSelection && p.getSelection().deleteFromDocument && p.getSelection().deleteFromDocument();
//                         try {
//                             var t = p.clipboardData.getData("Text");
//                             try {
//                                 r.doc.selection.createRange().pasteHTML(t)
//                             } catch (e) {
//                                 r.doc.getSelection().getRangeAt(0).insertNode(r.doc.createTextNode(t))
//                             }
//                             r.$c.trigger("tbwchange", n)
//                         } catch (i) {
//                             r.execCmd("insertText", (n.originalEvent || n).clipboardData.getData("text/plain"))
//                         }
//                     }
//                     g.each(r.pasteHandlers, function(t, e) {
//                         e(n)
//                     }), setTimeout(function() {
//                         r.semanticCode(!1, !0), r.$c.trigger("tbwpaste", n), r.$c.trigger("tbwchange")
//                     }, 0)
//                 }), r.$ta.on("keyup", function() {
//                     r.$c.trigger("tbwchange")
//                 }).on("paste", function() {
//                     setTimeout(function() {
//                         r.$c.trigger("tbwchange")
//                     }, 0)
//                 }), r.$box.on("keydown", function(t) {
//                     if (27 === t.which && 1 === g("." + e + "modal-box", r.$box).length) return r.closeModal(), !1
//                 })
//             },
//             autogrowEditorOnEnter: function() {
//                 var t = this;
//                 t.$ed.removeClass("autogrow-on-enter");
//                 var e = t.$ed[0].clientHeight;
//                 t.$ed.height("auto");
//                 var n = t.$ed[0].scrollHeight;
//                 t.$ed.addClass("autogrow-on-enter"), e !== n && (t.$ed.height(e), setTimeout(function() {
//                     t.$ed.css({
//                         height: n
//                     }), t.$c.trigger("tbwresize")
//                 }, 0))
//             },
//             buildBtnPane: function() {
//                 var r = this,
//                     n = r.o.prefix,
//                     o = r.$btnPane = g("<div/>", {
//                         "class": n + "button-pane"
//                     });
//                 g.each(r.o.btns, function(t, e) {
//                     g.isArray(e) || (e = [e]);
//                     var i = g("<div/>", {
//                         "class": n + "button-group " + (0 <= e.indexOf("fullscreen") ? n + "right" : "")
//                     });
//                     g.each(e, function(t, e) {
//                         try {
//                             r.isSupportedBtn(e) && i.append(r.buildBtn(e))
//                         } catch (n) {}
//                     }), 0 < i.html().trim().length && o.append(i)
//                 }), r.$box.prepend(o)
//             },
//             buildBtn: function(t) {
//                 var n = this,
//                     e = n.o.prefix,
//                     i = n.btnsDef[t],
//                     r = i.dropdown,
//                     o = null == i.hasIcon || i.hasIcon,
//                     s = n.lang[t] || t,
//                     a = g("<button/>", {
//                         type: "button",
//                         "class": e + t + "-button " + (i["class"] || "") + (o ? "" : " " + e + "textual-button"),
//                         html: n.hasSvg && o ? '<svg><use xlink:href="' + n.svgPath + "#" + e + (i.ico || t).replace(/([A-Z]+)/g, "-$1").toLowerCase() + '"/></svg>' : n.hideButtonTexts ? "" : i.text || i.title || n.lang[t] || t,
//                         title: (i.title || i.text || s) + (i.key ? " (Ctrl + " + i.key + ")" : ""),
//                         tabindex: -1,
//                         mousedown: function() {
//                             return r && !g("." + t + "-" + e + "dropdown", n.$box).is(":hidden") || g("body", n.doc).trigger("mousedown"), (!n.$btnPane.hasClass(e + "disable") && !n.$box.hasClass(e + "disabled") || g(this).hasClass(e + "active") || g(this).hasClass(e + "not-disable")) && n.execCmd((!r ? i.fn : "dropdown") || t, i.param || t, i.forceCss), !1
//                         }
//                     });
//                 if (r) {
//                     a.addClass(e + "open-dropdown");
//                     var l = e + "dropdown",
//                         u = {
//                             "class": l + "-" + t + " " + l + " " + e + "fixed-top"
//                         };
//                     u["data-" + l] = t;
//                     var c = g("<div/>", u);
//                     g.each(r, function(t, e) {
//                         n.btnsDef[e] && n.isSupportedBtn(e) && c.append(n.buildSubBtn(e))
//                     }), n.$box.append(c.hide())
//                 } else i.key && (n.keys[i.key] = {
//                     fn: i.fn || t,
//                     param: i.param || t
//                 });
//                 return r || (n.tagToButton[(i.tag || t).toLowerCase()] = t), a
//             },
//             buildSubBtn: function(t) {
//                 var e = this,
//                     n = e.o.prefix,
//                     i = e.btnsDef[t],
//                     r = null == i.hasIcon || i.hasIcon;
//                 return i.key && (e.keys[i.key] = {
//                     fn: i.fn || t,
//                     param: i.param || t
//                 }), e.tagToButton[(i.tag || t).toLowerCase()] = t, g("<button/>", {
//                     type: "button",
//                     "class": n + t + "-dropdown-button" + (i.ico ? " " + n + i.ico + "-button" : ""),
//                     html: e.hasSvg && r ? '<svg><use xlink:href="' + e.svgPath + "#" + n + (i.ico || t).replace(/([A-Z]+)/g, "-$1").toLowerCase() + '"/></svg>' + (i.text || i.title || e.lang[t] || t) : i.text || i.title || e.lang[t] || t,
//                     title: i.key ? " (Ctrl + " + i.key + ")" : null,
//                     style: i.style || null,
//                     mousedown: function() {
//                         return g("body", e.doc).trigger("mousedown"), e.execCmd(i.fn || t, i.param || t, i.forceCss), !1
//                     }
//                 })
//             },
//             isSupportedBtn: function(t) {
//                 try {
//                     return this.btnsDef[t].isSupported()
//                 } catch (e) {}
//                 return !0
//             },
//             buildOverlay: function() {
//                 var t = this;
//                 return t.$overlay = g("<div/>", {
//                     "class": t.o.prefix + "overlay"
//                 }).appendTo(t.$box), t.$overlay
//             },
//             showOverlay: function() {
//                 var t = this;
//                 g(p).trigger("scroll"), t.$overlay.fadeIn(200), t.$box.addClass(t.o.prefix + "box-blur")
//             },
//             hideOverlay: function() {
//                 var t = this;
//                 t.$overlay.fadeOut(50), t.$box.removeClass(t.o.prefix + "box-blur")
//             },
//             fixedBtnPaneEvents: function() {
//                 var r = this,
//                     o = r.o.fixedFullWidth,
//                     s = r.$box;
//                 r.o.fixedBtnPane && (r.isFixed = !1, g(p).on("scroll." + r.eventNamespace + " resize." + r.eventNamespace, function() {
//                     if (s) {
//                         r.syncCode();
//                         var t = g(p).scrollTop(),
//                             e = s.offset().top + 1,
//                             n = r.$btnPane,
//                             i = n.outerHeight() - 2;
//                         0 < t - e && t - e - r.height < 0 ? (r.isFixed || (r.isFixed = !0, n.css({
//                             position: "fixed",
//                             top: 0,
//                             left: o ? "0" : "auto",
//                             zIndex: 7
//                         }), g([r.$ta, r.$ed]).css({
//                             marginTop: n.height()
//                         })), n.css({
//                             width: o ? "100%" : s.width() - 1 + "px"
//                         }), g("." + r.o.prefix + "fixed-top", s).css({
//                             position: o ? "fixed" : "absolute",
//                             top: o ? i : i + (t - e) + "px",
//                             zIndex: 15
//                         })) : r.isFixed && (r.isFixed = !1, n.removeAttr("style"), g([r.$ta, r.$ed]).css({
//                             marginTop: 0
//                         }), g("." + r.o.prefix + "fixed-top", s).css({
//                             position: "absolute",
//                             top: i
//                         }))
//                     }
//                 }))
//             },
//             setDisabled: function(t) {
//                 var e = this,
//                     n = e.o.prefix;
//                 (e.disabled = t) ? e.$ta.attr("disabled", !0): e.$ta.removeAttr("disabled"), e.$box.toggleClass(n + "disabled", t), e.$ed.attr("contenteditable", !t)
//             },
//             destroy: function() {
//                 var t = this,
//                     e = t.o.prefix;
//                 t.isTextarea ? t.$box.after(t.$ta.css({
//                     height: ""
//                 }).val(t.html()).removeClass(e + "textarea").show()) : t.$box.after(t.$ed.css({
//                     height: ""
//                 }).removeClass(e + "editor").removeAttr("contenteditable").removeAttr("dir").html(t.html()).show()), t.$ed.off("dblclick", "img"), t.destroyPlugins(), t.$box.remove(), t.$c.removeData("trumbowyg"), g("body").removeClass(e + "body-fullscreen"), t.$c.trigger("tbwclose"), g(p).off("scroll." + t.eventNamespace + " resize." + t.eventNamespace)
//             },
//             empty: function() {
//                 this.$ta.val(""), this.syncCode(!0)
//             },
//             toggle: function() {
//                 var t = this,
//                     e = t.o.prefix;
//                 t.o.autogrowOnEnter && (t.autogrowOnEnterDontClose = !t.$box.hasClass(e + "editor-hidden")), t.semanticCode(!1, !0), setTimeout(function() {
//                     t.doc.activeElement.blur(), t.$box.toggleClass(e + "editor-hidden " + e + "editor-visible"), t.$btnPane.toggleClass(e + "disable"), g("." + e + "viewHTML-button", t.$btnPane).toggleClass(e + "active"), t.$box.hasClass(e + "editor-visible") ? t.$ta.attr("tabindex", -1) : t.$ta.removeAttr("tabindex"), t.o.autogrowOnEnter && !t.autogrowOnEnterDontClose && t.autogrowEditorOnEnter()
//                 }, 0)
//             },
//             dropdown: function(t) {
//                 var e = this,
//                     n = e.doc,
//                     i = e.o.prefix,
//                     r = g("[data-" + i + "dropdown=" + t + "]", e.$box),
//                     o = g("." + i + t + "-button", e.$btnPane),
//                     s = r.is(":hidden");
//                 if (g("body", n).trigger("mousedown"), s) {
//                     var a = o.offset().left;
//                     o.addClass(i + "active"), r.css({
//                         position: "absolute",
//                         top: o.offset().top - e.$btnPane.offset().top + o.outerHeight(),
//                         left: e.o.fixedFullWidth && e.isFixed ? a + "px" : a - e.$btnPane.offset().left + "px"
//                     }).show(), g(p).trigger("scroll"), g("body", n).on("mousedown." + e.eventNamespace, function(t) {
//                         r.is(t.target) || (g("." + i + "dropdown", e.$box).hide(), g("." + i + "active", e.$btnPane).removeClass(i + "active"), g("body", n).off("mousedown." + e.eventNamespace))
//                     })
//                 }
//             },
//             html: function(t) {
//                 var e = this;
//                 return null != t ? (e.$ta.val(t), e.syncCode(!0), e.$c.trigger("tbwchange"), e) : e.$ta.val()
//             },
//             syncTextarea: function() {
//                 var t = this;
//                 t.$ta.val(0 < t.$ed.text().trim().length || 0 < t.$ed.find(t.o.tagsToKeep.join(",")).length ? t.$ed.html() : "")
//             },
//             syncCode: function(t) {
//                 var e = this;
//                 if (!t && e.$ed.is(":visible")) e.syncTextarea();
//                 else {
//                     var n = g("<div>").html(e.$ta.val()),
//                         i = g("<div>").append(n);
//                     g(e.o.tagsToRemove.join(","), i).remove(), e.$ed.html(i.contents().html())
//                 }
//                 if (e.o.autogrow && (e.height = e.$ed.height(), e.height !== e.$ta.css("height") && (e.$ta.css({
//                         height: e.height
//                     }), e.$c.trigger("tbwresize"))), e.o.autogrowOnEnter) {
//                     e.$ed.height("auto");
//                     var r = e.autogrowOnEnterWasFocused ? e.$ed[0].scrollHeight : e.$ed.css("min-height");
//                     r !== e.$ta.css("height") && (e.$ed.css({
//                         height: r
//                     }), e.$c.trigger("tbwresize"))
//                 }
//             },
//             semanticCode: function(t, e, n) {
//                 var i = this;
//                 if (i.saveRange(), i.syncCode(t), i.o.semantic) {
//                     if (i.semanticTag("b"), i.semanticTag("i"), i.semanticTag("s"), i.semanticTag("strike"), e) {
//                         var r = i.o.inlineElementsSelector,
//                             o = ":not(" + r + ")";
//                         i.$ed.contents().filter(function() {
//                             return 3 === this.nodeType && 0 < this.nodeValue.trim().length
//                         }).wrap("<span data-tbw/>");
//                         var s = function(t) {
//                             if (0 !== t.length) {
//                                 var e = t.nextUntil(o).addBack().wrapAll("<p/>").parent(),
//                                     n = e.nextAll(r).first();
//                                 e.next("br").remove(), s(n)
//                             }
//                         };
//                         s(i.$ed.children(r).first()), i.semanticTag("div", !0), i.$ed.find("p").filter(function() {
//                             return (!i.range || this !== i.range.startContainer) && (0 === g(this).text().trim().length && 0 === g(this).children().not("br,span").length)
//                         }).contents().unwrap(), g("[data-tbw]", i.$ed).contents().unwrap(), i.$ed.find("p:empty").remove()
//                     }
//                     n || i.restoreRange(), i.syncTextarea()
//                 }
//             },
//             semanticTag: function(t, e) {
//                 var n;
//                 if (null != this.o.semantic && "object" == typeof this.o.semantic && this.o.semantic.hasOwnProperty(t)) n = this.o.semantic[t];
//                 else {
//                     if (!0 !== this.o.semantic || !this.DEFAULT_SEMANTIC_MAP.hasOwnProperty(t)) return;
//                     n = this.DEFAULT_SEMANTIC_MAP[t]
//                 }
//                 g(t, this.$ed).each(function() {
//                     var t = g(this);
//                     if (0 === t.contents().length) return !1;
//                     t.wrap("<" + n + "/>"), e && g.each(t.prop("attributes"), function() {
//                         t.parent().attr(this.name, this.value)
//                     }), t.contents().unwrap()
//                 })
//             },
//             createLink: function() {
//                 for (var t, e, n, i = this, r = i.doc.getSelection(), o = r.focusNode, s = (new XMLSerializer).serializeToString(r.getRangeAt(0).cloneContents());
//                     ["A", "DIV"].indexOf(o.nodeName) < 0;) o = o.parentNode;
//                 if (o && "A" === o.nodeName) {
//                     var a = g(o);
//                     s = a.text(), t = a.attr("href"), i.o.minimalLinks || (e = a.attr("title"), n = a.attr("target"));
//                     var l = i.doc.createRange();
//                     l.selectNode(o), r.removeAllRanges(), r.addRange(l)
//                 }
//                 i.saveRange();
//                 var u = {
//                     url: {
//                         label: "URL",
//                         required: !0,
//                         value: t
//                     },
//                     text: {
//                         label: i.lang.text,
//                         value: s
//                     }
//                 };
//                 i.o.minimalLinks || Object.assign(u, {
//                     title: {
//                         label: i.lang.title,
//                         value: e
//                     },
//                     target: {
//                         label: i.lang.target,
//                         value: n
//                     }
//                 }), i.openModalInsert(i.lang.createLink, u, function(t) {
//                     var e = i.prependUrlPrefix(t.url);
//                     if (!e.length) return !1;
//                     var n = g(['<a href="', e, '">', t.text || t.url, "</a>"].join(""));
//                     return i.o.minimalLinks || (0 < t.title.length && n.attr("title", t.title), 0 < t.target.length && n.attr("target", t.target)), i.range.deleteContents(), i.range.insertNode(n[0]), i.syncCode(), i.$c.trigger("tbwchange"), !0
//                 })
//             },
//             prependUrlPrefix: function(t) {
//                 var e = this;
//                 return e.urlPrefix ? /^([a-z][-+.a-z0-9]*:|\/|#)/i.test(t) ? t : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? "mailto:" + t : e.urlPrefix + t : t
//             },
//             unlink: function() {
//                 var t = this,
//                     e = t.doc.getSelection(),
//                     n = e.focusNode;
//                 if (e.isCollapsed) {
//                     for (;
//                         ["A", "DIV"].indexOf(n.nodeName) < 0;) n = n.parentNode;
//                     if (n && "A" === n.nodeName) {
//                         var i = t.doc.createRange();
//                         i.selectNode(n), e.removeAllRanges(), e.addRange(i)
//                     }
//                 }
//                 t.execCmd("unlink", undefined, undefined, !0)
//             },
//             insertImage: function() {
//                 var n = this;
//                 n.saveRange();
//                 var t = {
//                     url: {
//                         label: "URL",
//                         required: !0
//                     },
//                     alt: {
//                         label: n.lang.description,
//                         value: n.getRangeText()
//                     }
//                 };
//                 n.o.imageWidthModalEdit && (t.width = {}), n.openModalInsert(n.lang.insertImage, t, function(t) {
//                     n.execCmd("insertImage", t.url, !1, !0);
//                     var e = g('img[src="' + t.url + '"]:not([alt])', n.$box);
//                     return e.attr("alt", t.alt), n.o.imageWidthModalEdit && e.attr({
//                         width: t.width
//                     }), n.syncCode(), n.$c.trigger("tbwchange"), !0
//                 })
//             },
//             fullscreen: function() {
//                 var t, e = this,
//                     n = e.o.prefix,
//                     i = n + "fullscreen";
//                 e.$box.toggleClass(i), t = e.$box.hasClass(i), g("body").toggleClass(n + "body-fullscreen", t), g(p).trigger("scroll"), e.$c.trigger("tbw" + (t ? "open" : "close") + "fullscreen")
//             },
//             execCmd: function(t, e, n, i) {
//                 var r = this;
//                 i = !!i || "", "dropdown" !== t && r.$ed.focus();
//                 try {
//                     r.doc.execCommand("styleWithCSS", !1, n || !1)
//                 } catch (o) {}
//                 try {
//                     r[t + i](e)
//                 } catch (o) {
//                     try {
//                         t(e)
//                     } catch (s) {
//                         "insertHorizontalRule" === t ? e = undefined : "formatBlock" === t && r.isIE && (e = "<" + e + ">"), r.doc.execCommand(t, !1, e), r.syncCode(), r.semanticCode(!1, !0)
//                     }
//                     "dropdown" !== t && (r.updateButtonPaneStatus(), r.$c.trigger("tbwchange"))
//                 }
//             },
//             openModal: function(t, e) {
//                 var n = this,
//                     i = n.o.prefix;
//                 if (0 < g("." + i + "modal-box", n.$box).length) return !1;
//                 n.o.autogrowOnEnter && (n.autogrowOnEnterDontClose = !0), n.saveRange(), n.showOverlay(), n.$btnPane.addClass(i + "disable");
//                 var r = g("<div/>", {
//                     "class": i + "modal " + i + "fixed-top"
//                 }).css({
//                     top: n.$box.offset().top + n.$btnPane.height(),
//                     zIndex: 99999
//                 }).appendTo(g(n.doc.body));
//                 n.$overlay.one("click", function() {
//                     return r.trigger(h), !1
//                 });
//                 var o = g("<form/>", {
//                         action: "",
//                         html: e
//                     }).on("submit", function() {
//                         return r.trigger(c), !1
//                     }).on("reset", function() {
//                         return r.trigger(h), !1
//                     }).on("submit reset", function() {
//                         n.o.autogrowOnEnter && (n.autogrowOnEnterDontClose = !1)
//                     }),
//                     s = g("<div/>", {
//                         "class": i + "modal-box",
//                         html: o
//                     }).css({
//                         top: "-" + n.$btnPane.outerHeight() + "px",
//                         opacity: 0
//                     }).appendTo(r).animate({
//                         top: 0,
//                         opacity: 1
//                     }, 100);
//                 return g("<span/>", {
//                     text: t,
//                     "class": i + "modal-title"
//                 }).prependTo(s), r.height(s.outerHeight() + 10), g("input:first", s).focus(), n.buildModalBtn("submit", s), n.buildModalBtn("reset", s), g(p).trigger("scroll"), r
//             },
//             buildModalBtn: function(t, e) {
//                 var n = this,
//                     i = n.o.prefix;
//                 return g("<button/>", {
//                     "class": i + "modal-button " + i + "modal-" + t,
//                     type: t,
//                     text: n.lang[t] || t
//                 }).appendTo(g("form", e))
//             },
//             closeModal: function() {
//                 var t = this,
//                     e = t.o.prefix;
//                 t.$btnPane.removeClass(e + "disable"), t.$overlay.off();
//                 var n = g("." + e + "modal-box", g(m.body));
//                 n.animate({
//                     top: "-" + n.height()
//                 }, 100, function() {
//                     n.parent().remove(), t.hideOverlay()
//                 }), t.restoreRange()
//             },
//             openModalInsert: function(t, e, n) {
//                 var a = this,
//                     s = a.o.prefix,
//                     l = a.lang,
//                     u = "";
//                 return g.each(e, function(t, e) {
//                     var n = e.label || t,
//                         i = e.name || t,
//                         r = e.attributes || {},
//                         o = Object.keys(r).map(function(t) {
//                             return t + '="' + r[t] + '"'
//                         }).join(" ");
//                     u += '<label><input type="' + (e.type || "text") + '" name="' + i + '"' + ("checkbox" === e.type && e.value ? ' checked="checked"' : ' value="' + (e.value || "").replace(/"/g, "&quot;")) + '"' + o + '><span class="' + s + 'input-infos"><span>' + (l[n] ? l[n] : n) + "</span></span></label>"
//                 }), a.openModal(t, u).on(c, function() {
//                     var r = g("form", g(this)),
//                         o = !0,
//                         s = {};
//                     g.each(e, function(t, e) {
//                         var n = e.name || t,
//                             i = g('input[name="' + n + '"]', r);
//                         switch (i.attr("type").toLowerCase()) {
//                             case "checkbox":
//                                 s[n] = i.is(":checked");
//                                 break;
//                             case "radio":
//                                 s[n] = i.filter(":checked").val();
//                                 break;
//                             default:
//                                 s[n] = g.trim(i.val())
//                         }
//                         e.required && "" === s[n] ? (o = !1, a.addErrorOnModalField(i, a.lang.required)) : e.pattern && !e.pattern.test(s[n]) && (o = !1, a.addErrorOnModalField(i, e.patternError))
//                     }), o && (a.restoreRange(), n(s, e) && (a.syncCode(), a.$c.trigger("tbwchange"), a.closeModal(), g(this).off(c)))
//                 }).one(h, function() {
//                     g(this).off(c), a.closeModal()
//                 })
//             },
//             addErrorOnModalField: function(t, e) {
//                 var n = this.o.prefix,
//                     i = t.parent();
//                 t.on("change keyup", function() {
//                     i.removeClass(n + "input-error")
//                 }), i.addClass(n + "input-error").find("input+span").append(g("<span/>", {
//                     "class": n + "msg-error",
//                     text: e
//                 }))
//             },
//             getDefaultImgDblClickHandler: function() {
//                 var r = this;
//                 return function() {
//                     var e = g(this),
//                         t = e.attr("src"),
//                         n = "(Base64)";
//                     0 === t.indexOf("data:image") && (t = n);
//                     var i = {
//                         url: {
//                             label: "URL",
//                             value: t,
//                             required: !0
//                         },
//                         alt: {
//                             label: r.lang.description,
//                             value: e.attr("alt")
//                         }
//                     };
//                     return r.o.imageWidthModalEdit && (i.width = {
//                         value: e.attr("width") ? e.attr("width") : ""
//                     }), r.openModalInsert(r.lang.insertImage, i, function(t) {
//                         return t.url !== n && e.attr({
//                             src: t.url
//                         }), e.attr({
//                             alt: t.alt
//                         }), r.o.imageWidthModalEdit && (0 < parseInt(t.width) ? e.attr({
//                             width: t.width
//                         }) : e.removeAttr("width")), !0
//                     }), !1
//                 }
//             },
//             saveRange: function() {
//                 var t = this,
//                     e = t.doc.getSelection();
//                 if (t.range = null, e.rangeCount) {
//                     var n, i = t.range = e.getRangeAt(0),
//                         r = t.doc.createRange();
//                     r.selectNodeContents(t.$ed[0]), r.setEnd(i.startContainer, i.startOffset), n = (r + "").length, t.metaRange = {
//                         start: n,
//                         end: n + (i + "").length
//                     }
//                 }
//             },
//             restoreRange: function() {
//                 var t, e = this,
//                     n = e.metaRange,
//                     i = e.range,
//                     r = e.doc.getSelection();
//                 if (i) {
//                     if (n && n.start !== n.end) {
//                         var o, s = 0,
//                             a = [e.$ed[0]],
//                             l = !1,
//                             u = !1;
//                         for (t = e.doc.createRange(); !u && (o = a.pop());)
//                             if (3 === o.nodeType) {
//                                 var c = s + o.length;
//                                 !l && n.start >= s && n.start <= c && (t.setStart(o, n.start - s), l = !0), l && n.end >= s && n.end <= c && (t.setEnd(o, n.end - s), u = !0), s = c
//                             } else
//                                 for (var h = o.childNodes, d = h.length; 0 < d;) d -= 1, a.push(h[d])
//                     }
//                     r.removeAllRanges(), r.addRange(t || i)
//                 }
//             },
//             getRangeText: function() {
//                 return this.range + ""
//             },
//             updateButtonPaneStatus: function() {
//                 var s = this,
//                     a = s.o.prefix,
//                     t = s.getTagsRecursive(s.doc.getSelection().focusNode),
//                     l = a + "active-button " + a + "active";
//                 g("." + a + "active-button", s.$btnPane).removeClass(l), g.each(t, function(t, e) {
//                     var n = s.tagToButton[e.toLowerCase()],
//                         i = g("." + a + n + "-button", s.$btnPane);
//                     if (0 < i.length) i.addClass(l);
//                     else try {
//                         var r = (i = g("." + a + "dropdown ." + a + n + "-dropdown-button", s.$box)).parent().data("dropdown");
//                         g("." + a + r + "-button", s.$box).addClass(l)
//                     } catch (o) {}
//                 })
//             },
//             getTagsRecursive: function(n, i) {
//                 var r = this;
//                 if (i = i || (n && n.tagName ? [n.tagName] : []), !n || !n.parentNode) return i;
//                 var t = (n = n.parentNode).tagName;
//                 return "DIV" === t ? i : ("P" === t && "" !== n.style.textAlign && i.push(n.style.textAlign), g.each(r.tagHandlers, function(t, e) {
//                     i = i.concat(e(n, r))
//                 }), i.push(t), r.getTagsRecursive(n, i).filter(function(t) {
//                     return null != t
//                 }))
//             },
//             initPlugins: function() {
//                 var n = this;
//                 n.loadedPlugins = [], g.each(g.trumbowyg.plugins, function(t, e) {
//                     e.shouldInit && !e.shouldInit(n) || (e.init(n), e.tagHandler && n.tagHandlers.push(e.tagHandler), n.loadedPlugins.push(e))
//                 })
//             },
//             destroyPlugins: function() {
//                 g.each(this.loadedPlugins, function(t, e) {
//                     e.destroy && e.destroy()
//                 })
//             }
//         }
//     }(navigator, window, document, jQuery), $(document).ready(function() {
//         editorInit(), imagesDelete(), showAdvanced()
//     }), document.addEventListener("turbolinks:load", function(t) {
//         "function" == typeof gtag && gtag("config", "UA-97812625-1", {
//             page_location: t.data.url
//         }), "function" == typeof fbq && fbq("track", "PageView"), "function" == typeof fathom && fathom("trackPageview")
//     }),
//     function() {
//         var t = this;
//         (function() {
//             (function() {
//                 var n = [].slice;
//                 this.ActionCable = {
//                     INTERNAL: {
//                         message_types: {
//                             welcome: "welcome",
//                             ping: "ping",
//                             confirmation: "confirm_subscription",
//                             rejection: "reject_subscription"
//                         },
//                         default_mount_path: "/cable",
//                         protocols: ["actioncable-v1-json", "actioncable-unsupported"]
//                     },
//                     WebSocket: window.WebSocket,
//                     logger: window.console,
//                     createConsumer: function(t) {
//                         var e;
//                         return null == t && (t = null != (e = this.getConfig("url")) ? e : this.INTERNAL.default_mount_path), new l.Consumer(this.createWebSocketURL(t))
//                     },
//                     getConfig: function(t) {
//                         var e;
//                         return null != (e = document.head.querySelector("meta[name='action-cable-" + t + "']")) ? e.getAttribute("content") : void 0
//                     },
//                     createWebSocketURL: function(t) {
//                         var e;
//                         return t && !/^wss?:/i.test(t) ? ((e = document.createElement("a")).href = t, e.href = e.href, e.protocol = e.protocol.replace("http", "ws"), e.href) : t
//                     },
//                     startDebugging: function() {
//                         return this.debugging = !0
//                     },
//                     stopDebugging: function() {
//                         return this.debugging = null
//                     },
//                     log: function() {
//                         var t, e;
//                         if (t = 1 <= arguments.length ? n.call(arguments, 0) : [], this.debugging) return t.push(Date.now()), (e = this.logger).log.apply(e, ["[ActionCable]"].concat(n.call(t)))
//                     }
//                 }
//             }).call(this)
//         }).call(t);
//         var l = t.ActionCable;
//         (function() {
//             (function() {
//                 var i = function(t, e) {
//                     return function() {
//                         return t.apply(e, arguments)
//                     }
//                 };
//                 l.ConnectionMonitor = function() {
//                     function t(t) {
//                         this.connection = t, this.visibilityDidChange = i(this.visibilityDidChange, this), this.reconnectAttempts = 0
//                     }
//                     var r, e, n;
//                     return t.pollInterval = {
//                             min: 3,
//                             max: 30
//                         }, t.staleThreshold = 6, t.prototype.start = function() {
//                             if (!this.isRunning()) return this.startedAt = e(), delete this.stoppedAt, this.startPolling(), document.addEventListener("visibilitychange", this.visibilityDidChange), l.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms")
//                         }, t.prototype.stop = function() {
//                             if (this.isRunning()) return this.stoppedAt = e(), this.stopPolling(), document.removeEventListener("visibilitychange", this.visibilityDidChange), l.log("ConnectionMonitor stopped")
//                         }, t.prototype.isRunning = function() {
//                             return null != this.startedAt && null == this.stoppedAt
//                         }, t.prototype.recordPing = function() {
//                             return this.pingedAt = e()
//                         }, t.prototype.recordConnect = function() {
//                             return this.reconnectAttempts = 0, this.recordPing(), delete this.disconnectedAt, l.log("ConnectionMonitor recorded connect")
//                         }, t.prototype.recordDisconnect = function() {
//                             return this.disconnectedAt = e(), l.log("ConnectionMonitor recorded disconnect")
//                         }, t.prototype.startPolling = function() {
//                             return this.stopPolling(), this.poll()
//                         }, t.prototype.stopPolling = function() {
//                             return clearTimeout(this.pollTimeout)
//                         }, t.prototype.poll = function() {
//                             return this.pollTimeout = setTimeout((t = this, function() {
//                                 return t.reconnectIfStale(), t.poll()
//                             }), this.getPollInterval());
//                             var t
//                         }, t.prototype.getPollInterval = function() {
//                             var t, e, n, i;
//                             return n = (i = this.constructor.pollInterval).min, e = i.max, t = 5 * Math.log(this.reconnectAttempts + 1), Math.round(1e3 * r(t, n, e))
//                         }, t.prototype.reconnectIfStale = function() {
//                             if (this.connectionIsStale()) return l.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + n(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s"), this.reconnectAttempts++, this.disconnectedRecently() ? l.log("ConnectionMonitor skipping reopening recent disconnect") : (l.log("ConnectionMonitor reopening"), this.connection.reopen())
//                         }, t.prototype.connectionIsStale = function() {
//                             var t;
//                             return n(null != (t = this.pingedAt) ? t : this.startedAt) > this.constructor.staleThreshold
//                         }, t.prototype.disconnectedRecently = function() {
//                             return this.disconnectedAt && n(this.disconnectedAt) < this.constructor.staleThreshold
//                         },
//                         t.prototype.visibilityDidChange = function() {
//                             if ("visible" === document.visibilityState) return setTimeout((t = this, function() {
//                                 if (t.connectionIsStale() || !t.connection.isOpen()) return l.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState), t.connection.reopen()
//                             }), 200);
//                             var t
//                         }, e = function() {
//                             return (new Date).getTime()
//                         }, n = function(t) {
//                             return (e() - t) / 1e3
//                         }, r = function(t, e, n) {
//                             return Math.max(e, Math.min(n, t))
//                         }, t
//                 }()
//             }).call(this),
//                 function() {
//                     var t, r, e, n, i, o = [].slice,
//                         s = function(t, e) {
//                             return function() {
//                                 return t.apply(e, arguments)
//                             }
//                         },
//                         a = [].indexOf || function(t) {
//                             for (var e = 0, n = this.length; e < n; e++)
//                                 if (e in this && this[e] === t) return e;
//                             return -1
//                         };
//                     n = l.INTERNAL, r = n.message_types, e = n.protocols, i = 2 <= e.length ? o.call(e, 0, t = e.length - 1) : (t = 0, []), e[t++], l.Connection = function() {
//                         function t(t) {
//                             this.consumer = t, this.open = s(this.open, this), this.subscriptions = this.consumer.subscriptions, this.monitor = new l.ConnectionMonitor(this), this.disconnected = !0
//                         }
//                         return t.reopenDelay = 500, t.prototype.send = function(t) {
//                             return !!this.isOpen() && (this.webSocket.send(JSON.stringify(t)), !0)
//                         }, t.prototype.open = function() {
//                             return this.isActive() ? (l.log("Attempted to open WebSocket, but existing socket is " + this.getState()), !1) : (l.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + e), null != this.webSocket && this.uninstallEventHandlers(), this.webSocket = new l.WebSocket(this.consumer.url, e), this.installEventHandlers(), this.monitor.start(), !0)
//                         }, t.prototype.close = function(t) {
//                             var e;
//                             if ((null != t ? t : {
//                                     allowReconnect: !0
//                                 }).allowReconnect || this.monitor.stop(), this.isActive()) return null != (e = this.webSocket) ? e.close() : void 0
//                         }, t.prototype.reopen = function() {
//                             var t;
//                             if (l.log("Reopening WebSocket, current state is " + this.getState()), !this.isActive()) return this.open();
//                             try {
//                                 return this.close()
//                             } catch (e) {
//                                 return t = e, l.log("Failed to reopen WebSocket", t)
//                             } finally {
//                                 l.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms"), setTimeout(this.open, this.constructor.reopenDelay)
//                             }
//                         }, t.prototype.getProtocol = function() {
//                             var t;
//                             return null != (t = this.webSocket) ? t.protocol : void 0
//                         }, t.prototype.isOpen = function() {
//                             return this.isState("open")
//                         }, t.prototype.isActive = function() {
//                             return this.isState("open", "connecting")
//                         }, t.prototype.isProtocolSupported = function() {
//                             var t;
//                             return t = this.getProtocol(), 0 <= a.call(i, t)
//                         }, t.prototype.isState = function() {
//                             var t, e;
//                             return e = 1 <= arguments.length ? o.call(arguments, 0) : [], t = this.getState(), 0 <= a.call(e, t)
//                         }, t.prototype.getState = function() {
//                             var t, e;
//                             for (e in WebSocket)
//                                 if (WebSocket[e] === (null != (t = this.webSocket) ? t.readyState : void 0)) return e.toLowerCase();
//                             return null
//                         }, t.prototype.installEventHandlers = function() {
//                             var t, e;
//                             for (t in this.events) e = this.events[t].bind(this), this.webSocket["on" + t] = e
//                         }, t.prototype.uninstallEventHandlers = function() {
//                             var t;
//                             for (t in this.events) this.webSocket["on" + t] = function() {}
//                         }, t.prototype.events = {
//                             message: function(t) {
//                                 var e, n, i;
//                                 if (this.isProtocolSupported()) switch (e = (i = JSON.parse(t.data)).identifier, n = i.message, i.type) {
//                                     case r.welcome:
//                                         return this.monitor.recordConnect(), this.subscriptions.reload();
//                                     case r.ping:
//                                         return this.monitor.recordPing();
//                                     case r.confirmation:
//                                         return this.subscriptions.notify(e, "connected");
//                                     case r.rejection:
//                                         return this.subscriptions.reject(e);
//                                     default:
//                                         return this.subscriptions.notify(e, "received", n)
//                                 }
//                             },
//                             open: function() {
//                                 if (l.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol"), this.disconnected = !1, !this.isProtocolSupported()) return l.log("Protocol is unsupported. Stopping monitor and disconnecting."), this.close({
//                                     allowReconnect: !1
//                                 })
//                             },
//                             close: function() {
//                                 if (l.log("WebSocket onclose event"), !this.disconnected) return this.disconnected = !0, this.monitor.recordDisconnect(), this.subscriptions.notifyAll("disconnected", {
//                                     willAttemptReconnect: this.monitor.isRunning()
//                                 })
//                             },
//                             error: function() {
//                                 return l.log("WebSocket onerror event")
//                             }
//                         }, t
//                     }()
//                 }.call(this),
//                 function() {
//                     var u = [].slice;
//                     l.Subscriptions = function() {
//                         function t(t) {
//                             this.consumer = t, this.subscriptions = []
//                         }
//                         return t.prototype.create = function(t, e) {
//                             var n, i, r;
//                             return i = "object" == typeof(n = t) ? n : {
//                                 channel: n
//                             }, r = new l.Subscription(this.consumer, i, e), this.add(r)
//                         }, t.prototype.add = function(t) {
//                             return this.subscriptions.push(t), this.consumer.ensureActiveConnection(), this.notify(t, "initialized"), this.sendCommand(t, "subscribe"), t
//                         }, t.prototype.remove = function(t) {
//                             return this.forget(t), this.findAll(t.identifier).length || this.sendCommand(t, "unsubscribe"), t
//                         }, t.prototype.reject = function(t) {
//                             var e, n, i, r, o;
//                             for (r = [], e = 0, n = (i = this.findAll(t)).length; e < n; e++) o = i[e], this.forget(o), this.notify(o, "rejected"), r.push(o);
//                             return r
//                         }, t.prototype.forget = function(r) {
//                             var o;
//                             return this.subscriptions = function() {
//                                 var t, e, n, i;
//                                 for (i = [], t = 0, e = (n = this.subscriptions).length; t < e; t++)(o = n[t]) !== r && i.push(o);
//                                 return i
//                             }.call(this), r
//                         }, t.prototype.findAll = function(t) {
//                             var e, n, i, r, o;
//                             for (r = [], e = 0, n = (i = this.subscriptions).length; e < n; e++)(o = i[e]).identifier === t && r.push(o);
//                             return r
//                         }, t.prototype.reload = function() {
//                             var t, e, n, i, r;
//                             for (i = [], t = 0, e = (n = this.subscriptions).length; t < e; t++) r = n[t], i.push(this.sendCommand(r, "subscribe"));
//                             return i
//                         }, t.prototype.notifyAll = function(t) {
//                             var e, n, i, r, o, s, a;
//                             for (n = t, e = 2 <= arguments.length ? u.call(arguments, 1) : [], s = [], i = 0, r = (o = this.subscriptions).length; i < r; i++) a = o[i], s.push(this.notify.apply(this, [a, n].concat(u.call(e))));
//                             return s
//                         }, t.prototype.notify = function(t, e) {
//                             var n, i, r, o, s, a, l;
//                             for (a = t, i = e, n = 3 <= arguments.length ? u.call(arguments, 2) : [], s = [], r = 0, o = (l = "string" == typeof a ? this.findAll(a) : [a]).length; r < o; r++) a = l[r], s.push("function" == typeof a[i] ? a[i].apply(a, n) : void 0);
//                             return s
//                         }, t.prototype.sendCommand = function(t, e) {
//                             var n;
//                             return n = t.identifier, this.consumer.send({
//                                 command: e,
//                                 identifier: n
//                             })
//                         }, t
//                     }()
//                 }.call(this),
//                 function() {
//                     l.Subscription = function() {
//                         function t(t, e, n) {
//                             this.consumer = t, null == e && (e = {}), this.identifier = JSON.stringify(e), i(this, n)
//                         }
//                         var i;
//                         return t.prototype.perform = function(t, e) {
//                             return null == e && (e = {}), e.action = t, this.send(e)
//                         }, t.prototype.send = function(t) {
//                             return this.consumer.send({
//                                 command: "message",
//                                 identifier: this.identifier,
//                                 data: JSON.stringify(t)
//                             })
//                         }, t.prototype.unsubscribe = function() {
//                             return this.consumer.subscriptions.remove(this)
//                         }, i = function(t, e) {
//                             var n, i;
//                             if (null != e)
//                                 for (n in e) i = e[n], t[n] = i;
//                             return t
//                         }, t
//                     }()
//                 }.call(this),
//                 function() {
//                     l.Consumer = function() {
//                         function t(t) {
//                             this.url = t, this.subscriptions = new l.Subscriptions(this), this.connection = new l.Connection(this)
//                         }
//                         return t.prototype.send = function(t) {
//                             return this.connection.send(t)
//                         }, t.prototype.connect = function() {
//                             return this.connection.open()
//                         }, t.prototype.disconnect = function() {
//                             return this.connection.close({
//                                 allowReconnect: !1
//                             })
//                         }, t.prototype.ensureActiveConnection = function() {
//                             if (!this.connection.isActive()) return this.connection.open()
//                         }, t
//                     }()
//                 }.call(this)
//         }).call(this), "object" == typeof module && module.exports ? module.exports = l : "function" == typeof define && define.amd && define(l)
//     }.call(this),
//     function() {
//         this.App || (this.App = {}), App.cable = ActionCable.createConsumer()
//     }.call(this), document.addEventListener("DOMContentLoaded", function() {
//         holmesInit()
//     }), document.addEventListener("turbolinks:load", function() {
//         signaturePad(), colorPicker(), isMobile() && $("html, body, #mobile-wrapper").css({
//             height: $(window).height()
//         })
//     }), isMobile = function() {
//         return !!window.matchMedia("only screen and (max-width: 760px)").matches
//     };
// var _global = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof global && global.global === global ? global : this,
//     saveAs = _global.saveAs || ("object" != typeof window || window !== _global ? function saveAs() {} : "download" in HTMLAnchorElement.prototype ? function saveAs(t, e, n) {
//         var i = _global.URL || _global.webkitURL,
//             r = document.createElement("a");
//         e = e || t.name || "download", r.download = e, r.rel = "noopener", "string" == typeof t ? (r.href = t, r.origin !== location.origin ? corsEnabled(r.href) ? download(t, e, n) : click(r, r.target = "_blank") : click(r)) : (r.href = i.createObjectURL(t), setTimeout(function() {
//             i.revokeObjectURL(r.href)
//         }, 4e4), setTimeout(function() {
//             click(r)
//         }, 0))
//     } : "msSaveOrOpenBlob" in navigator ? function saveAs(t, e, n) {
//         if (e = e || t.name || "download", "string" == typeof t)
//             if (corsEnabled(t)) download(t, e, n);
//             else {
//                 var i = document.createElement("a");
//                 i.href = t, i.target = "_blank", setTimeout(function() {
//                     click(i)
//                 })
//             }
//         else navigator.msSaveOrOpenBlob(bom(t, n), e)
//     } : function saveAs(t, e, n, i) {
//         if ((i = i || open("", "_blank")) && (i.document.title = i.document.body.innerText = "downloading..."), "string" == typeof t) return download(t, e, n);
//         var r = "application/octet-stream" === t.type,
//             o = /constructor/i.test(_global.HTMLElement) || _global.safari,
//             s = /CriOS\/[\d]+/.test(navigator.userAgent);
//         if ((s || r && o) && "undefined" != typeof FileReader) {
//             var a = new FileReader;
//             a.onloadend = function() {
//                 var t = a.result;
//                 t = s ? t : t.replace(/^data:[^;]*;/, "data:attachment/file;"), i ? i.location.href = t : location = t, i = null
//             }, a.readAsDataURL(t)
//         } else {
//             var l = _global.URL || _global.webkitURL,
//                 u = l.createObjectURL(t);
//             i ? i.location = u : location.href = u, i = null, setTimeout(function() {
//                 l.revokeObjectURL(u)
//             }, 4e4)
//         }
//     });
// _global.saveAs = saveAs.saveAs = saveAs, "undefined" != typeof module && (module.exports = saveAs),
//     function(t, e) {
//         "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = e(require, exports, module) : t.ouibounce = e()
//     }(this, function() {
//         return function T(t, e) {
//             "use strict";

//             function n(t, e) {
//                 return void 0 === t ? e : t
//             }

//             function i(t) {
//                 var e = 24 * t * 60 * 60 * 1e3,
//                     n = new Date;
//                 return n.setTime(n.getTime() + e), "; expires=" + n.toUTCString()
//             }

//             function r() {
//                 c() || (E.addEventListener("mouseleave", o), E.addEventListener("mouseenter", s), E.addEventListener("keydown", a))
//             }

//             function o(t) {
//                 t.clientY > m || (_ = setTimeout(h, v))
//             }

//             function s() {
//                 _ && (clearTimeout(_), _ = null)
//             }

//             function a(t) {
//                 C || t.metaKey && 76 === t.keyCode && (C = !0, _ = setTimeout(h, v))
//             }

//             function l(t, e) {
//                 return u()[t] === e
//             }

//             function u() {
//                 for (var t = document.cookie.split("; "), e = {}, n = t.length - 1; 0 <= n; n--) {
//                     var i = t[n].split("=");
//                     e[i[0]] = i[1]
//                 }
//                 return e
//             }

//             function c() {
//                 return l(x, "true") && !p
//             }

//             function h() {
//                 c() || (t && (t.style.display = "block"), y(), d())
//             }

//             function d(t) {
//                 var e = t || {};
//                 "undefined" != typeof e.cookieExpire && (b = i(e.cookieExpire)), !0 === e.sitewide && (k = ";path=/"), "undefined" != typeof e.cookieDomain && (w = ";domain=" + e.cookieDomain), "undefined" != typeof e.cookieName && (x = e.cookieName), document.cookie = x + "=true" + b + w + k, E.removeEventListener("mouseleave", o), E.removeEventListener("mouseenter", s), E.removeEventListener("keydown", a)
//             }
//             var f = e || {},
//                 p = f.aggressive || !1,
//                 m = n(f.sensitivity, 20),
//                 g = n(f.timer, 1e3),
//                 v = n(f.delay, 0),
//                 y = f.callback || function() {},
//                 b = i(f.cookieExpire) || "",
//                 w = f.cookieDomain ? ";domain=" + f.cookieDomain : "",
//                 x = f.cookieName ? f.cookieName : "viewedOuibounceModal",
//                 k = !0 === f.sitewide ? ";path=/" : "",
//                 _ = null,
//                 E = document.documentElement;
//             setTimeout(r, g);
//             var C = !1;
//             return {
//                 fire: h,
//                 disable: d,
//                 isDisabled: c
//             }
//         }
//     }), document.addEventListener("turbolinks:load", function() {
//         ! function() {
//             function t(e, n) {
//                 return function(t) {
//                     i(), e.classList.toggle("hide"), n && n.classList.toggle("hide"), t.preventDefault()
//                 }
//             }

//             function i() {
//                 p = document.querySelector(".tooltip"), null !== h && p.classList.add("hide")
//             }
//             var e, n, r, o, s, a, l, u, c, h, d, f, p, m, g = 4e3;
//             e = document.querySelector(".login-href"), n = document.querySelector(".modal"), r = document.querySelector(".screen"), c = document.querySelector(".ds-modal"), h = document.querySelector(".modal-overlay"), d = document.querySelector(".btn-close"), f = document.querySelectorAll(".btn-modal"), m = document.querySelectorAll(".label-help"), p = document.querySelectorAll(".tooltip"), document.querySelector("form"), document.addEventListener("focus", function() {
//                 i()
//             }, !0), null !== d && (d.addEventListener("click", t(c)), d.addEventListener("click", t(h))), null !== h && (h.addEventListener("click", t(c)), h.addEventListener("click", t(h)));
//             for (var v = 0, y = f.length; v < y; v++) {
//                 (b = f[v]).addEventListener("click", t(h)), b.addEventListener("click", t(c))
//             }
//             for (v = 0, y = m.length; v < y; v++) {
//                 var b;
//                 (b = m[v]).addEventListener("click", t(b.firstChild.nextSibling))
//             }
//             null !== e && e.addEventListener("click", t(n)), null !== r && null !== (o = r.querySelectorAll("img")) && (o = [].slice.call(o), a = 0, l = o.length, u = function() {
//                 for (var t = 0; t < l; t++) o[t].classList.add("faded")
//             }, s = function() {
//                 u(), o[a].classList.remove("faded"), a = a === l - 1 ? 0 : a + 1, setTimeout(s, g)
//             }, setTimeout(s, g / 2))
//         }()
//     }),
//     function() {
//         try {
//             Typekit.load({
//                 async: !0
//             })
//         } catch (t) {}
//     }(), $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(t) {
//         if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
//             var e = $(this.hash);
//             (e = e.length ? e : $("[name=" + this.hash.slice(1) + "]")).length && (t.preventDefault(), $("html, body").stop().animate({
//                 scrollTop: e.offset().top - 40
//             }, 600, function() {
//                 var t = $(e);
//                 if (t.focus(), t.is(":focus")) return !1;
//                 t.attr("tabindex", "-1"), t.focus()
//             }))
//         }
//     }), document.addEventListener("turbolinks:load", function() {
//         $(".scroll-to").on("click", function(t) {
//             t.preventDefault();
//             var e = $(this).attr("href"),
//                 n = $(this).data("offset"),
//                 i = $(e).offset().top + n;
//             $("body,html").animate({
//                 scrollTop: i
//             }, 300)
//         })
//     }), document.addEventListener("turbolinks:load", function() {
//         $(".tab-wrapper .tab-btn").show().click(function() {
//             var t = $(this).index();
//             $(".tab-wrapper .tab-btn").removeClass("active").eq(t).addClass("active"), $(".tab_item").hide().eq(t).fadeIn()
//         }).eq(0).addClass("active")
//     }), document.addEventListener("turbolinks:load", function() {
//         createTypedSignature(), loadMoreSignatures(), editSignature()
//     });
