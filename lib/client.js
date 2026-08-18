window.__ModuleLoader__.load({
	id: "dsh-pelican",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let React = require("react");
		let ReactDOMClient = require("react-dom/client");
		const PACKAGE_ID = "dsh-pelican";
		const el = React.createElement;

		let audioCtx = null
		function ensureAudio() {
			try {
				if (typeof window === 'undefined') return
				const AC = window.AudioContext || window.webkitAudioContext
				if (!AC) return
				if (!audioCtx) audioCtx = new AC()
				if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {})
			} catch (e) {}
		}
		function playChime() {
			try {
				ensureAudio()
				if (!audioCtx) return
				const ctx = audioCtx
				const t = ctx.currentTime
				const notes = [880, 1174.66]
				notes.forEach(function (freq, i) {
					const osc = ctx.createOscillator()
					const gain = ctx.createGain()
					const start = t + i * 0.18
					osc.type = 'sine'
					osc.frequency.value = freq
					gain.gain.setValueAtTime(0.0001, start)
					gain.gain.exponentialRampToValueAtTime(0.35, start + 0.03)
					gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85)
					osc.connect(gain)
					gain.connect(ctx.destination)
					osc.start(start)
					osc.stop(start + 0.9)
				})
			} catch (e) {}
		}

		const CSS = `
.dsh-pel-root { pointer-events: none; }
.dsh-pel-card {
  position: fixed; right: 16px; bottom: 16px; z-index: 9990;
  pointer-events: auto;
  background: linear-gradient(165deg, rgba(255,255,255,.95), rgba(231,244,255,.95));
  border: 1px solid rgba(120,160,200,.4);
  border-radius: 18px; padding: 8px 8px 4px;
  box-shadow: 0 10px 28px rgba(25,55,90,.22);
  backdrop-filter: blur(8px);
  font-family: system-ui, 'Segoe UI', sans-serif;
  user-select: none;
}
.dsh-pel-card svg { width: 296px; height: auto; border-radius: 12px; display: block; }
.dsh-pel-cap { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 4px 2px; }
.dsh-pel-cap > span { font-size: 11px; font-weight: 700; color: #2b6a9c; letter-spacing: .02em; white-space: nowrap; }
.dsh-pel-ctrl { display: flex; align-items: center; gap: 5px; }
.dsh-pel-speed { display: flex; border: 1px solid rgba(70,120,170,.5); border-radius: 8px; overflow: hidden; }
.dsh-pel-speed button { border: none; background: transparent; padding: 3px 7px; font-size: 11px; font-weight: 700; color: #5d84a6; cursor: pointer; }
.dsh-pel-speed button + button { border-left: 1px solid rgba(70,120,170,.3); }
.dsh-pel-speed button.on { background: #3d9edf; color: #fff; }
.dsh-pel-flap { border: 1px solid rgba(70,120,170,.5); border-radius: 8px; background: transparent; padding: 3px 7px; font-size: 11px; font-weight: 700; color: #5d84a6; cursor: pointer; }
.dsh-pel-flap.on { background: #f7931e; border-color: #f7931e; color: #fff; }
.dsh-pel-min { border: none; background: transparent; cursor: pointer; color: #5d84a6; font-size: 13px; line-height: 1; padding: 3px 7px; border-radius: 8px; }
.dsh-pel-min:hover { background: rgba(70,130,190,.14); color: #2b6a9c; }
.dsh-pel-bubble {
  position: fixed; right: 16px; bottom: 16px; z-index: 9990; pointer-events: auto;
  width: 46px; height: 46px; border-radius: 50%; cursor: pointer;
  border: 1px solid rgba(120,160,200,.45);
  background: linear-gradient(150deg, #eaf6ff, #cfe9ff);
  box-shadow: 0 8px 18px rgba(25,55,90,.24);
  font-size: 21px; display: flex; align-items: center; justify-content: center;
}
.dsh-pel-bubble:hover { transform: scale(1.07); }
.dsh-pel-speech {
  position: absolute; top: 34px; left: 120px; z-index: 6;
  max-width: 240px; white-space: nowrap;
  background: #fffdf6; border: 1.5px solid #f7931e; border-radius: 12px;
  padding: 5px 12px; font-size: 12px; font-weight: 700; color: #2b6a9c;
  box-shadow: 0 5px 14px rgba(0,0,0,.14);
  animation: dsh-pel-pop .16s ease-out;
}
.dsh-pel-speech::after {
  content: ''; position: absolute; bottom: -7px; left: 67px;
  width: 0; height: 0;
  border-left: 7px solid transparent; border-right: 7px solid transparent;
  border-top: 8px solid #f7931e;
}
@keyframes dsh-pel-pop { from { opacity: 0; transform: translateY(4px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes dsh-pel-cloud { 0% { transform: translateX(-14px); } 50% { transform: translateX(14px); } 100% { transform: translateX(-14px); } }
@keyframes dsh-pel-bird { from { transform: translateX(0); } to { transform: translateX(92px); } }
@keyframes dsh-pel-flap { from { transform: scaleY(1); } to { transform: scaleY(.55); } }
@keyframes dsh-pel-twinkle { 0%,100% { opacity: .12; } 50% { opacity: .9; } }
@keyframes dsh-pel-glow { 0%,100% { opacity: .35; } 50% { opacity: .75; } }
@media (prefers-reduced-motion: reduce) {
  .dsh-pel-card *, .dsh-pel-bubble { animation: none !important; }
}
`

		const PELICAN_ICON = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#ffb23e'/><ellipse cx='28' cy='36' rx='15' ry='13' fill='#ffffff'/><path d='M28 23 Q28 15 34 16 L36 23 Z' fill='#ffffff' stroke='#c9d9e8'/><circle cx='34' cy='24' r='2.4' fill='#26303c'/><path d='M32 27 C46 24 58 28 62 31 L46 38 Z' fill='#ff881c' stroke='#e07a12'/><path d='M30 27 L40 44 C32 48 27 40 30 27 Z' fill='#ffb23e' stroke='#e07a12'/></svg>")

		const O = { x: 206, y: 247 }
		const CRANK = 16
		const HIP = { x: 200, y: 186 }
		const THIGH = 40
		const SHIN = 42
		const REAR = { x: 152, y: 258 }
		const FRONT = { x: 272, y: 258 }
		const WHEEL = 34

		function solveKnee(H, F, l1, l2) {
			const dx = F.x - H.x
			const dy = F.y - H.y
			let d = Math.hypot(dx, dy)
			const maxD = l1 + l2 - 0.6
			const minD = Math.abs(l1 - l2) + 0.6
			d = Math.max(minD, Math.min(maxD, d))
			const ux = dx / d, uy = dy / d
			const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d)
			const h = Math.sqrt(Math.max(0, l1 * l1 - a * a))
			const mx = H.x + ux * a, my = H.y + uy * a
			const px = -uy, py = ux
			const s = px >= 0 ? 1 : -1
			return { x: mx + s * h * px, y: my + s * h * py }
		}

		function wavePath(yTop, yBot, amp, phase) {
			const pts = ['M 0 ' + (yTop + Math.sin(phase) * amp).toFixed(1)]
			for (let x = 0; x <= 460; x += 11.5) {
				const y = yTop + Math.sin((x / 230) * Math.PI * 2 + phase) * amp
				pts.push('L ' + x + ' ' + y.toFixed(1))
			}
			pts.push('L 460 ' + yBot + ' L 0 ' + yBot + ' Z')
			return pts.join(' ')
		}

		function midWave(yTop, yBot, amp, phase, fill, op) {
			const d = wavePath(yTop, yBot, amp, phase)
			return [
				el('path', { d: d, fill: fill, opacity: op }),
				el('path', { d: d, fill: fill, opacity: op, transform: 'translate(460 0)' })
			]
		}

		function cloud(x, y, s) {
			return el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')', opacity: 0.85 },
				el('g', { style: { animation: 'dsh-pel-cloud 30s ease-in-out infinite alternate' } },
					el('ellipse', { cx: 0, cy: 0, rx: 30, ry: 12, fill: '#ffffff' }),
					el('ellipse', { cx: 24, cy: 5, rx: 20, ry: 9, fill: '#ffffff' }),
					el('ellipse', { cx: -22, cy: 5, rx: 18, ry: 8, fill: '#ffffff' })
				)
			)
		}

		function bird(x, y, s, dur) {
			return el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' },
				el('g', { style: { animation: 'dsh-pel-bird ' + dur + 's ease-in-out infinite alternate' } },
					el('path', {
						d: 'M 0 0 Q 5 -7 10 0 Q 15 -7 20 0 Q 15 4 10 0 Q 5 4 0 0 Z',
						fill: '#ffffff',
						style: { animation: 'dsh-pel-flap .55s ease-in-out infinite alternate', transformBox: 'fill-box', transformOrigin: 'center' }
					})
				)
			)
		}

		function sparkle(x, y, s, delay) {
			const p = {
				d: 'M 0 -6 L 1.4 -1.4 L 6 0 L 1.4 1.4 L 0 6 L -1.4 1.4 L -6 0 L -1.4 -1.4 Z',
				fill: '#ffffff',
				style: { animation: 'dsh-pel-twinkle ' + (2.2 + delay) + 's ease-in-out ' + delay + 's infinite', transformBox: 'fill-box', transformOrigin: 'center' }
			}
			return [
				el('path', Object.assign({}, p, { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' })),
				el('path', Object.assign({}, p, { transform: 'translate(' + (x + 460) + ' ' + y + ') scale(' + s + ')' }))
			]
		}

		function sailboat(x, y, s) {
			const hull = el('path', { d: 'M 0 0 L 26 0 L 22 5 L 4 5 Z', fill: '#7a5c43' })
			const sail1 = el('path', { d: 'M 13 0 L 13 -22 L 2 -4 Z', fill: '#ffffff', stroke: '#d7e7f2', strokeWidth: 0.6 })
			const sail2 = el('path', { d: 'M 14 -1 L 14 -20 L 25 -4 Z', fill: '#e8f3fb', stroke: '#d7e7f2', strokeWidth: 0.6 })
			return [
				el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' }, hull, sail1, sail2),
				el('g', { transform: 'translate(' + (x + 460) + ' ' + y + ') scale(' + s + ')' }, hull, sail1, sail2)
			]
		}

		function wheel(cx, cy, ref) {
			return el('g', { ref: ref, transform: 'rotate(0 ' + cx + ' ' + cy + ')' },
				el('circle', { cx: cx, cy: cy, r: WHEEL, fill: 'none', stroke: '#2b303b', strokeWidth: 7 }),
				el('circle', { cx: cx, cy: cy, r: WHEEL - 3.5, fill: 'none', stroke: '#aab6c6', strokeWidth: 1.6 }),
				el('path', {
					d: 'M ' + cx + ' ' + (cy - WHEEL) + ' L ' + cx + ' ' + (cy + WHEEL) +
						' M ' + (cx - WHEEL) + ' ' + cy + ' L ' + (cx + WHEEL) + ' ' + cy +
						' M ' + (cx - WHEEL * 0.7) + ' ' + (cy - WHEEL * 0.7) + ' L ' + (cx + WHEEL * 0.7) + ' ' + (cy + WHEEL * 0.7) +
						' M ' + (cx + WHEEL * 0.7) + ' ' + (cy - WHEEL * 0.7) + ' L ' + (cx - WHEEL * 0.7) + ' ' + (cy + WHEEL * 0.7),
					stroke: '#8d99a8', strokeWidth: 1.4
				}),
				el('circle', { cx: cx, cy: cy, r: 3.4, fill: '#6b7686' })
			)
		}

		function pedal(ref) {
			return el('g', { ref: ref, transform: 'translate(206 263)' },
				el('rect', { x: -11, y: 4, width: 22, height: 5.5, rx: 2.5, fill: '#33404d', stroke: '#1f2830', strokeWidth: 1 }),
				el('circle', { cx: 0, cy: 4, r: 2.2, fill: '#1f2830' }),
				el('path', {
					d: 'M 0 0 C -5 1 -8 3 -8 5 Q -8 6.5 -6 6 Q -4.5 5 -3 5.8 Q -1.5 6.5 0 6 Q 1.5 6.5 3 5.8 Q 4.5 5 6 6 Q 8 6.5 8 5 C 8 3 5 1 0 0 Z',
					fill: '#f7931e', stroke: '#d96f10', strokeWidth: 1.3, strokeLinejoin: 'round'
				})
			)
		}

		function PelicanRide() {
			const [minimized, setMinimized] = React.useState(false)
			const [speedState, setSpeedState] = React.useState(1)
			const [flapState, setFlapState] = React.useState(false)
			const [status, setStatus] = React.useState('idle')
			const speedRef = React.useRef(1)
			const flapRef = React.useRef(false)
			const statusRef = React.useRef('idle')
			const lastSeqRef = React.useRef(-1)
			const fadeRef = React.useRef(null)
			const talkPhaseRef = React.useRef(0)
			const angleRef = React.useRef(0)
			const revRef = React.useRef(0)
			const wheelAngleRef = React.useRef(0)
			const flapPhaseRef = React.useRef(0)
			const crankRef = React.useRef(null)
			const rearRef = React.useRef(null)
			const frontRef = React.useRef(null)
			const midRef = React.useRef(null)
			const nearRef = React.useRef(null)
			const pedalBackRef = React.useRef(null)
			const pedalFrontRef = React.useRef(null)
			const backThighRef = React.useRef(null)
			const backShinRef = React.useRef(null)
			const backKneeRef = React.useRef(null)
			const frontThighRef = React.useRef(null)
			const frontShinRef = React.useRef(null)
			const frontKneeRef = React.useRef(null)
			const neckRef = React.useRef(null)
			const headRef = React.useRef(null)
			const wingRef = React.useRef(null)
			const farWingRef = React.useRef(null)

			const scheduleDoneFade = function () {
				if (fadeRef.current) { clearTimeout(fadeRef.current); fadeRef.current = null }
				fadeRef.current = setTimeout(function () {
					fadeRef.current = null
					statusRef.current = 'idle'
					setStatus('idle')
				}, 4200)
			}
			const cancelDoneFade = function () {
				if (fadeRef.current) { clearTimeout(fadeRef.current); fadeRef.current = null }
			}
			const notifyDone = function () {
				try {
					if (typeof Notification === 'undefined') return
					const opts = { body: '鹈鹕：任务完成啦！', icon: PELICAN_ICON, tag: 'pelican-done' }
					const show = function () { try { new Notification('任务完成啦 🎉', opts) } catch (e) {} }
					if (Notification.permission === 'granted') show()
					else if (Notification.permission !== 'denied') {
						Notification.requestPermission().then(function (p) { if (p === 'granted') show() }).catch(function () {})
					}
				} catch (e) {}
			}

			React.useEffect(function () {
				const tickId = setInterval(function tick() {
					const speed = speedRef.current
					const dth = 0.13 * speed
					angleRef.current = (angleRef.current + dth) % (Math.PI * 2)
					revRef.current += dth / (Math.PI * 2)
					const th = angleRef.current
					const deg = th * 180 / Math.PI
					const bob = Math.sin(th * 2) * 1.6

					const nearScroll = (revRef.current * 250) % 460
					const midScroll = (revRef.current * 132) % 460
					midRef.current.setAttribute('transform', 'translate(-' + midScroll.toFixed(1) + ' 0)')
					nearRef.current.setAttribute('transform', 'translate(-' + nearScroll.toFixed(1) + ' 0)')

					wheelAngleRef.current = (wheelAngleRef.current + (dth / (Math.PI * 2)) * 250 / WHEEL * (180 / Math.PI)) % 360
					const wdeg = wheelAngleRef.current

					crankRef.current.setAttribute('transform', 'rotate(' + deg + ' ' + O.x + ' ' + O.y + ')')
					rearRef.current.setAttribute('transform', 'rotate(' + wdeg + ' ' + REAR.x + ' ' + REAR.y + ')')
					frontRef.current.setAttribute('transform', 'rotate(' + wdeg + ' ' + FRONT.x + ' ' + FRONT.y + ')')

					const f1 = { x: O.x + CRANK * Math.cos(th), y: O.y + CRANK * Math.sin(th) }
					const f2 = { x: O.x + CRANK * Math.cos(th + Math.PI), y: O.y + CRANK * Math.sin(th + Math.PI) }
					pedalFrontRef.current.setAttribute('transform', 'translate(' + f1.x + ' ' + f1.y + ')')
					pedalBackRef.current.setAttribute('transform', 'translate(' + f2.x + ' ' + f2.y + ')')

					const hip = { x: HIP.x, y: HIP.y + bob }
					const k1 = solveKnee(hip, f1, THIGH, SHIN)
					const k2 = solveKnee(hip, f2, THIGH, SHIN)

					frontThighRef.current.setAttribute('d', 'M ' + hip.x + ' ' + hip.y + ' L ' + k1.x + ' ' + k1.y)
					frontShinRef.current.setAttribute('d', 'M ' + k1.x + ' ' + k1.y + ' L ' + f1.x + ' ' + f1.y)
					frontKneeRef.current.setAttribute('transform', 'translate(' + k1.x + ' ' + k1.y + ')')
					backThighRef.current.setAttribute('d', 'M ' + hip.x + ' ' + hip.y + ' L ' + k2.x + ' ' + k2.y)
					backShinRef.current.setAttribute('d', 'M ' + k2.x + ' ' + k2.y + ' L ' + f2.x + ' ' + f2.y)
					backKneeRef.current.setAttribute('transform', 'translate(' + k2.x + ' ' + k2.y + ')')

					talkPhaseRef.current += 1
					const speaking = statusRef.current === 'thinking' || statusRef.current === 'done'
					if (speaking) {
						const wob = Math.sin(talkPhaseRef.current * 0.16) * 3
						neckRef.current.setAttribute('transform', 'rotate(0 217 116)')
						headRef.current.setAttribute('transform',
							'translate(216 120) scale(0.78 1) translate(-216 -120) rotate(' + (-12 + wob).toFixed(1) + ' 216 120)')
					} else {
						const idleT = 'rotate(' + (Math.sin(th * 2) * 1.3).toFixed(2) + ' 217 116) translate(0 ' + bob.toFixed(2) + ')'
						neckRef.current.setAttribute('transform', idleT)
						headRef.current.setAttribute('transform', idleT)
					}

					if (flapRef.current) {
						flapPhaseRef.current = (flapPhaseRef.current + 0.3) % (Math.PI * 2)
						// 伪 3D 拍翅：绕肩关节上下挥动，同时按挥动幅度垂直压缩（scaleY < 1），
						// 在最高/最低点翅膀"转过去"变窄——模拟真实拍翅的透视变化。
						const fa = Math.sin(flapPhaseRef.current)
						const deg = -fa * 30
						const sy = 1 - Math.abs(fa) * 0.45
						wingRef.current.setAttribute('transform',
							'translate(190 166) rotate(' + deg.toFixed(1) + ') scale(1 ' + sy.toFixed(3) + ') translate(-190 -166)')
						// 远翼：相位略滞后、幅度更小、压缩更多（透视下更窄更暗，增强深度）
						const fa2 = Math.sin(flapPhaseRef.current - 0.35)
						const deg2 = -fa2 * 24
						const sy2 = 1 - Math.abs(fa2) * 0.52
						farWingRef.current.setAttribute('transform',
							'translate(184 162) rotate(' + deg2.toFixed(1) + ') scale(1 ' + sy2.toFixed(3) + ') translate(-184 -162)')
					} else {
						wingRef.current.setAttribute('transform', 'rotate(0 190 166)')
						farWingRef.current.setAttribute('transform', 'rotate(0 184 162)')
					}
				}, 33)
				return function () { clearInterval(tickId) }
			}, [])

			React.useEffect(function () {
				let disposed = false
				const unlock = function () { ensureAudio() }
				if (typeof document !== 'undefined') document.addEventListener('pointerdown', unlock, true)
				try {
					if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
						Notification.requestPermission().catch(function () {})
					}
				} catch (e) {}
				const poll = function () {
					fetch('/api/pelican/status', { cache: 'no-store' })
						.then(function (r) { return r.json() })
						.then(function (s) {
							if (disposed || !s || typeof s.seq !== 'number') return
							if (lastSeqRef.current === -1) {
								lastSeqRef.current = s.seq
								const st = s.state === 'thinking' || s.state === 'done' ? s.state : 'idle'
								statusRef.current = st
								setStatus(st)
								applyAutoSpeed(st)
								if (st === 'done') {
									scheduleDoneFade()
									playChime()
								}
								return
							}
							if (s.seq === lastSeqRef.current) return
							lastSeqRef.current = s.seq
							if (s.state === 'thinking') {
								statusRef.current = 'thinking'
								setStatus('thinking')
								applyAutoSpeed('thinking')
								cancelDoneFade()
							} else if (s.state === 'done') {
								statusRef.current = 'done'
								setStatus('done')
								applyAutoSpeed('done')
								scheduleDoneFade()
								playChime()
								if (typeof document !== 'undefined' && typeof document.hasFocus === 'function' && !document.hasFocus()) notifyDone()
							} else {
								statusRef.current = 'idle'
								setStatus('idle')
								applyAutoSpeed('idle')
								cancelDoneFade()
							}
						})
						.catch(function () {})
				}
				const pollId = setInterval(poll, 500)
				return function () {
					disposed = true
					clearInterval(pollId)
					if (typeof document !== 'undefined') document.removeEventListener('pointerdown', unlock, true)
					if (fadeRef.current) { clearTimeout(fadeRef.current); fadeRef.current = null }
				}
			}, [])

			const defs = el('defs', null,
				el('linearGradient', { id: 'dshPelSky', x1: 0, y1: 0, x2: 0, y2: 1 },
					el('stop', { offset: 0, stopColor: '#a9e0ff' }),
					el('stop', { offset: 1, stopColor: '#e8f7ff' })),
				el('linearGradient', { id: 'dshPelSea', x1: 0, y1: 0, x2: 0, y2: 1 },
					el('stop', { offset: 0, stopColor: '#63c3f4' }),
					el('stop', { offset: 1, stopColor: '#2f8fd6' })),
				el('linearGradient', { id: 'dshPelSand', x1: 0, y1: 0, x2: 0, y2: 1 },
					el('stop', { offset: 0, stopColor: '#f6e3b2' }),
					el('stop', { offset: 1, stopColor: '#ecd08c' })),
				el('radialGradient', { id: 'dshPelSunGlow', cx: 0.5, cy: 0.5, r: 0.5 },
					el('stop', { offset: 0, stopColor: '#ffd958', stopOpacity: 0.95 }),
					el('stop', { offset: 1, stopColor: '#ffd958', stopOpacity: 0 })),
				el('linearGradient', { id: 'dshPelReflect', x1: 0, y1: 0, x2: 0, y2: 1 },
					el('stop', { offset: 0, stopColor: '#ffffff', stopOpacity: 0 }),
					el('stop', { offset: 0.5, stopColor: '#ffffff', stopOpacity: 0.85 }),
					el('stop', { offset: 1, stopColor: '#ffffff', stopOpacity: 0 })),
				el('linearGradient', { id: 'dshPelBeak', x1: 0, y1: 0, x2: 1, y2: 0 },
					el('stop', { offset: 0, stopColor: '#ffb23e' }),
					el('stop', { offset: 1, stopColor: '#ff881c' })),
				el('linearGradient', { id: 'dshPelBody', x1: 0, y1: 0, x2: 0, y2: 1 },
					el('stop', { offset: 0, stopColor: '#ffffff' }),
					el('stop', { offset: 1, stopColor: '#e3eef8' }))
			)

			const scene = el('svg', {
				viewBox: '0 0 460 330',
				role: 'img',
				'aria-label': '鹈鹕环海骑行动画',
			},
				defs,
				el('rect', { x: 0, y: 0, width: 460, height: 150, fill: 'url(#dshPelSky)' }),
				el('circle', { cx: 52, cy: 54, r: 26, fill: 'url(#dshPelSunGlow)' }),
				el('circle', { cx: 52, cy: 54, r: 15, fill: '#ffd94a' }),
				cloud(96, 30, 0.7),
				cloud(320, 20, 0.55),
				bird(120, 62, 0.8, 11),
				bird(268, 44, 0.65, 15),
				el('rect', { x: 0, y: 150, width: 460, height: 146, fill: 'url(#dshPelSea)' }),
				el('rect', { x: 40, y: 154, width: 26, height: 70, fill: 'url(#dshPelReflect)', style: { animation: 'dsh-pel-glow 3.4s ease-in-out infinite' } }),
				el('g', { ref: midRef, transform: 'translate(0 0)' },
					midWave(152, 190, 5, 0, '#d9f1ff', 0.95),
					midWave(186, 240, 8, 1.2, '#9ed7f6', 0.9),
					midWave(238, 296, 11, 2.4, '#54b0e8', 0.95),
					sparkle(300, 200, 1, 0),
					sparkle(180, 262, 0.8, 0.6),
					sparkle(404, 232, 0.9, 1.2),
					sparkle(120, 210, 0.7, 1.8),
					sailboat(64, 172, 1),
					sailboat(368, 188, 0.8)
				),
				el('rect', { x: 0, y: 296, width: 460, height: 34, fill: 'url(#dshPelSand)' }),
				el('path', { d: 'M 0 296 L 460 296', stroke: '#e9f7ff', strokeWidth: 3, opacity: 0.85 }),
				el('g', { ref: nearRef, transform: 'translate(0 0)' },
					el('path', { d: 'M 0 296 L 0 272 Q 10 258 26 266 Q 40 258 54 272 L 62 296 Z', fill: '#93a08f' }),
					el('path', { d: 'M 20 296 Q 24 284 34 286 Q 44 282 48 296 Z', fill: '#7e8b7c' }),
					el('path', { d: 'M 460 296 L 460 272 Q 470 258 486 266 Q 500 258 514 272 L 522 296 Z', fill: '#93a08f' }),
					el('path', { d: 'M 480 296 Q 484 284 494 286 Q 504 282 508 296 Z', fill: '#7e8b7c' }),
					el('line', {
						x1: 0, y1: 313, x2: 460, y2: 313,
						stroke: '#ffffff', strokeWidth: 2.5, strokeDasharray: '24 22', opacity: 0.75
					}),
					el('line', {
						x1: 460, y1: 313, x2: 920, y2: 313,
						stroke: '#ffffff', strokeWidth: 2.5, strokeDasharray: '24 22', opacity: 0.75
					}),
					el('ellipse', { cx: 40, cy: 301, rx: 3.4, ry: 1.6, fill: '#d9c08a', opacity: 0.9 }),
					el('ellipse', { cx: 500, cy: 301, rx: 3.4, ry: 1.6, fill: '#d9c08a', opacity: 0.9 }),
					el('ellipse', { cx: 208, cy: 303, rx: 2.6, ry: 1.4, fill: '#d9c08a', opacity: 0.9 }),
					el('ellipse', { cx: 668, cy: 303, rx: 2.6, ry: 1.4, fill: '#d9c08a', opacity: 0.9 }),
					el('ellipse', { cx: 352, cy: 300, rx: 3, ry: 1.5, fill: '#e6cd96', opacity: 0.85 }),
					el('ellipse', { cx: 812, cy: 300, rx: 3, ry: 1.5, fill: '#e6cd96', opacity: 0.85 }),
					el('circle', { cx: 132, cy: 286, r: 2.4, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 0.2s infinite' } }),
					el('circle', { cx: 592, cy: 286, r: 2.4, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 0.2s infinite' } }),
					el('circle', { cx: 116, cy: 289, r: 1.8, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 1s infinite' } }),
					el('circle', { cx: 576, cy: 289, r: 1.8, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 1s infinite' } }),
					el('circle', { cx: 102, cy: 287, r: 2, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 1.7s infinite' } }),
					el('circle', { cx: 562, cy: 287, r: 2, fill: '#f2d391', opacity: 0.5, style: { animation: 'dsh-pel-twinkle 2.6s ease-in-out 1.7s infinite' } })
				),

				el('g', { style: { filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.16))' } },
					el('path', { ref: backThighRef, d: 'M 200 186 L 214 220', fill: 'none', stroke: '#c3d9ec', strokeWidth: 8, strokeLinecap: 'round' }),
					el('path', { ref: backShinRef, d: 'M 214 220 L 222 247', fill: 'none', stroke: '#c3d9ec', strokeWidth: 7, strokeLinecap: 'round' }),
					el('circle', { ref: backKneeRef, cx: 0, cy: 0, r: 4, fill: '#c3d9ec', stroke: 'rgba(0,0,0,.12)', strokeWidth: 1 })
				),
				pedal(pedalBackRef),
				wheel(REAR.x, REAR.y, rearRef),
				el('circle', { cx: O.x, cy: O.y, r: 11.5, fill: '#cdd8e2', stroke: '#8b98a8', strokeWidth: 2 }),
				el('circle', { cx: O.x, cy: O.y, r: 4, fill: '#9aa8b8' }),
				el('circle', { cx: REAR.x, cy: REAR.y, r: 4.5, fill: '#7c8a9a' }),
				el('path', { d: 'M 206 235 L 152 254 M 206 259 L 152 263', stroke: '#4a5563', strokeWidth: 2.5, fill: 'none' }),
				el('g', { fill: 'none', stroke: '#ff6b4a', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' },
					el('path', {
						d: 'M 152 258 L 206 247 L 196 200 L 262 196 L 206 247 L 272 258' +
							' M 200 214 L 152 258 M 262 196 L 269 211 L 272 258'
					})
				),
				el('path', { d: 'M 184 201 Q 196 196 208 201 Q 202 205 190 205 Z', fill: '#5b4a55' }),
				el('g', { stroke: '#3a4552', strokeWidth: 4, strokeLinecap: 'round', fill: 'none' },
					el('path', { d: 'M 262 196 L 256 186 L 274 181 M 256 186 L 246 184' })
				),
				el('circle', { cx: 274, cy: 181, r: 3.5, fill: '#2b323c' }),
				el('circle', { cx: 246, cy: 184, r: 3.5, fill: '#2b323c' }),
				el('g', { ref: crankRef, transform: 'rotate(0 ' + O.x + ' ' + O.y + ')' },
					el('path', { d: 'M 0 0 L ' + CRANK + ' 0 M 0 0 L ' + (-CRANK) + ' 0', stroke: '#3a4552', strokeWidth: 4.5, strokeLinecap: 'round', fill: 'none' }),
					el('circle', { cx: 0, cy: 0, r: 3, fill: '#2b323c' })
				),
				wheel(FRONT.x, FRONT.y, frontRef),
				pedal(pedalFrontRef),
				el('g', { style: { filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.18))' } },
					el('path', { ref: frontThighRef, d: 'M 200 186 L 214 220', fill: 'none', stroke: '#f4f9fd', strokeWidth: 8, strokeLinecap: 'round' }),
					el('path', { ref: frontShinRef, d: 'M 214 220 L 222 247', fill: 'none', stroke: '#f4f9fd', strokeWidth: 7, strokeLinecap: 'round' }),
					el('circle', { ref: frontKneeRef, cx: 0, cy: 0, r: 4, fill: '#f4f9fd', stroke: 'rgba(0,0,0,.12)', strokeWidth: 1 })
				),
				el('g', { ref: farWingRef, transform: 'rotate(0 184 162)' },
					el('path', {
						d: 'M 178 156 C 196 148 212 152 218 164 C 219 169 216 176 208 180 C 196 186 184 184 176 176 C 170 168 171 160 178 156 Z',
						fill: '#c3d9ec', stroke: '#a9c4dc', strokeWidth: 1.2, opacity: 0.9
					}),
					el('path', { d: 'M 181 164 C 192 158 202 160 210 166', fill: 'none', stroke: '#a9c4dc', strokeWidth: 1, opacity: 0.8 }),
					el('path', { d: 'M 180 171 C 190 166 199 168 206 173', fill: 'none', stroke: '#a9c4dc', strokeWidth: 1, opacity: 0.8 })
				),
				el('g', { ref: neckRef },
					el('path', {
						d: 'M 208 158 C 212 146 212 134 210 126 C 209 121 212 116 217 116 L 222 118 C 222 130 220 144 218 158 C 217 166 212 170 208 158 Z',
						fill: 'url(#dshPelBody)', stroke: '#cfdde9', strokeWidth: 1.4
					})
				),
				el('path', { d: 'M 162 172 L 146 162 L 152 176 L 140 172 L 150 186 L 160 180 Z', fill: '#eef4fa', stroke: '#cfdde9', strokeWidth: 1 }),
				el('path', {
					d: 'M 188 138 C 210 138 224 156 222 176 C 220 194 204 202 188 200 C 168 198 156 184 158 166 C 160 148 170 138 188 138 Z',
					fill: 'url(#dshPelBody)', stroke: '#cfdde9', strokeWidth: 1.5
				}),
				el('g', { ref: headRef },
					el('ellipse', { cx: 217, cy: 116, rx: 11, ry: 9.5, fill: 'url(#dshPelBody)', stroke: '#cfdde9', strokeWidth: 1.4 }),
					el('path', { d: 'M 210 108 C 207 104 209 101 213 102 C 216 103 216 107 213 109 Z', fill: '#eef4fa' }),
					el('path', {
						d: 'M 224 112 C 246 108 278 113 297 118 C 299 119 299 122 297 124 C 274 128 254 132 238 138 C 232 142 226 143 223 137 C 221 130 222 120 224 112 Z',
						fill: 'url(#dshPelBeak)', stroke: '#e07a12', strokeWidth: 1.2
					}),
					el('path', { d: 'M 226 121 C 246 122 268 124 292 122', fill: 'none', stroke: '#e07a12', strokeWidth: 1.2, opacity: 0.5 }),
					el('path', { d: 'M 232 138 C 240 141 250 141 258 138', fill: 'none', stroke: '#ffd9a8', strokeWidth: 1.4, opacity: 0.7 }),
					el('circle', { cx: 222, cy: 110, r: 2.8, fill: '#26303c' }),
					el('circle', { cx: 223, cy: 109, r: 1, fill: '#ffffff' })
				),
				el('g', { ref: wingRef, transform: 'rotate(0 190 166)' },
					el('path', {
						d: 'M 176 154 C 200 144 220 148 228 164 C 230 170 227 178 218 184 C 204 192 188 192 176 184 C 167 176 166 160 176 154 Z',
						fill: '#dcebf7', stroke: '#b9cfe2', strokeWidth: 1.4
					}),
					el('path', { d: 'M 183 164 C 196 157 209 160 218 167 M 181 172 C 194 165 207 168 215 175 M 180 180 C 191 174 202 176 209 181', fill: 'none', stroke: '#b3c9de', strokeWidth: 1.2, strokeLinecap: 'round' })
				),
				el('path', {
					d: 'M 206 170 C 224 168 244 170 262 177 C 268 179 270 183 268 185 C 264 187 258 185 254 182 C 238 176 222 176 208 178 Z',
					fill: '#f2f7fc', stroke: '#c4d6e6', strokeWidth: 1.4
				}),
				el('circle', { cx: 270, cy: 184, r: 3, fill: '#eef4fa', stroke: '#c4d6e6' })
			)

			const setSpeed = function (v) {
				speedRef.current = v
				setSpeedState(v)
			}
			// 自动倍速：思考中蹬快点（3x）更像在努力，回复结束后恢复 1x。
			const applyAutoSpeed = function (st) {
				const target = st === 'thinking' ? 3 : 1
				if (speedRef.current !== target) {
					speedRef.current = target
					setSpeedState(target)
				}
			}
			const toggleFlap = function () {
				const n = !flapRef.current
				flapRef.current = n
				setFlapState(n)
			}

			const speedBtns = [1, 2, 3].map(function (v) {
				return el('button', {
					key: 's' + v,
					className: speedState === v ? 'on' : undefined,
					onClick: function () { setSpeed(v) },
					title: v + 'x 骑行倍速'
				}, v + 'x')
			})

			const speech = status === 'thinking'
				? el('div', { className: 'dsh-pel-speech' }, '稍等，我正在努力蹬呢')
				: status === 'done'
					? el('div', { className: 'dsh-pel-speech' }, '任务完成啦 🎉')
					: null

			const card = el('div', { className: 'dsh-pel-card', style: { display: minimized ? 'none' : undefined } },
				speech,
				scene,
				el('div', { className: 'dsh-pel-cap' },
					el('span', null, '🐦 鹈鹕环海骑行'),
					el('div', { className: 'dsh-pel-ctrl' },
						el('div', { className: 'dsh-pel-speed', role: 'group', 'aria-label': '骑行倍速' }, speedBtns),
						el('button', {
							className: 'dsh-pel-flap' + (flapState ? ' on' : ''),
							onClick: toggleFlap,
							title: flapState ? '停止扇翅' : '鹈鹕扇动翅膀'
						}, flapState ? '扇翅中' : '🪽 扇翅')
					),
					el('button', { className: 'dsh-pel-min', onClick: function () { setMinimized(true) }, title: '收起', 'aria-label': '收起' }, '—')
				)
			)
			const bubble = el('button', {
				className: 'dsh-pel-bubble',
				style: { display: minimized ? undefined : 'none' },
				onClick: function () { setMinimized(false) },
				title: '展开鹈鹕环海骑行'
			}, '🐦')

			return el('div', { className: 'dsh-pel-root' }, card, bubble)
		}

		const name = 'pelican-sea-ride'
		const inject = ['slots']

		function apply(ctx) {
			ctx.effect(function () {
				const style = document.createElement('style')
				style.setAttribute('data-plugin', PACKAGE_ID)
				style.textContent = CSS
				document.head.appendChild(style)
				return function () { try { style.remove() } catch (e) {} }
			}, 'pelican-sea-ride: styles')
			// 挂载到 document.body 顶层，而不是 shell.overlay 插槽宿主：
			// shell.overlay 的宿主容器 z-index:20（position:absolute）会创建一个层叠上下文，
			// 卡片的 z-index:9990 被困在它内部；better-sidebar 面板 z-index:40 在根层叠上下文，
			// 40 > 20 所以面板展开时盖住了卡片。直接挂 body 顶层后，9990 在根层叠上下文生效。
			ctx.effect(function () {
				const host = document.createElement('div')
				host.setAttribute('data-dsh-pelican', '')
				document.body.appendChild(host)
				const root = ReactDOMClient.createRoot(host)
				root.render(el(PelicanRide))
				return function () {
					try { root.unmount() } catch (e) {}
					try { host.remove() } catch (e) {}
				}
			}, 'pelican-sea-ride: mount')
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});
