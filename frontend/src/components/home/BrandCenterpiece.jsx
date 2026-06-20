import { useEffect, useRef } from 'react'

export default function BrandCenterpiece() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Handle Retina Display resolution scaling
    let width = canvas.clientWidth || 550
    let height = canvas.clientHeight || 550
    const dpr = window.devicePixelRatio || 1
    
    const initCanvas = () => {
      width = canvas.clientWidth || 550
      height = canvas.clientHeight || 550
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.resetTransform()
      ctx.scale(dpr, dpr)
    }
    initCanvas()

    // 1. Generate 3D Dotted Globe Points (Fibonacci sphere algorithm)
    const numGlobeDots = 700
    const globePoints = []
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = 2 * Math.PI * (1 - 1 / goldenRatio)

    for (let i = 0; i < numGlobeDots; i++) {
      const t = i / numGlobeDots
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      // Unit sphere coords
      const x = Math.sin(inclination) * Math.cos(azimuth)
      const y = Math.sin(inclination) * Math.sin(azimuth)
      const z = Math.cos(inclination)

      // Color types matching brand palette: 0: Electric Purple, 1: Pink, 2: Cyan
      const colorType = i % 3
      globePoints.push({ x, y, z, colorType })
    }

    // 2. Initialize Floating PRADARSH Letters
    const letterChars = ['P', 'R', 'A', 'D', 'A', 'R', 'S', 'H']
    const spacing = 48 // Increased spacing to let letters breathe
    const letters = letterChars.map((char, index) => {
      const offsetFactor = index - (letterChars.length - 1) / 2
      return {
        char,
        bx: offsetFactor * spacing,
        by: 0,
        bz: -70, // Placed in front of the globe center (closer to the camera)
        phase: index * 0.4,
        px: 0,
        py: 0,
        pz: 0,
        scale: 1
      }
    })

    // 3. Spawning Active Connecting Arcs on the Globe
    const activeArcs = []
    const colors = ['#7C4DFF', '#EC4899', '#06B6D4']
    
    const spawnArc = () => {
      const idxA = Math.floor(Math.random() * numGlobeDots)
      let idxB = Math.floor(Math.random() * numGlobeDots)
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * numGlobeDots)
      }

      const pA = globePoints[idxA]
      const pB = globePoints[idxB]

      // Distance check
      const dx = pA.x - pB.x
      const dy = pA.y - pB.y
      const dz = pA.z - pB.z
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

      // Maintain medium connections
      if (dist > 0.4 && dist < 1.4) {
        const mx = (pA.x + pB.x) / 2
        const my = (pA.y + pB.y) / 2
        const mz = (pA.z + pB.z) / 2
        const mLen = Math.sqrt(mx*mx + my*my + mz*mz)
        
        if (mLen > 0.01) {
          const nx = mx / mLen
          const ny = my / mLen
          const nz = mz / mLen

          // Curve outward slightly
          const heightFactor = 1.15 + Math.random() * 0.15
          const cx = nx * heightFactor
          const cy = ny * heightFactor
          const cz = nz * heightFactor

          activeArcs.push({
            pA,
            pB,
            pC: { x: cx, y: cy, z: cz },
            progress: 0,
            speed: 0.005 + Math.random() * 0.006,
            color: colors[Math.floor(Math.random() * colors.length)]
          })
        }
      }
    }

    // Populate initial arcs
    for (let j = 0; j < 8; j++) {
      spawnArc()
      if (activeArcs[j]) {
        activeArcs[j].progress = Math.random()
      }
    }

    let time = 0
    let rotYGlobe = 0 // Globe slow spin
    const rotXGlobe = 0.22 // Globe tilt towards user

    const renderLoop = () => {
      time += 0.012
      rotYGlobe += 0.0014 // Slow continuous globe rotation speed

      ctx.clearRect(0, 0, width, height)

      const scaleFactor = width / 550
      const logicalCenterX = 275
      const logicalCenterY = 275
      const globeRadius = 190 // Logical radius in 550x550 space

      const cosYG = Math.cos(rotYGlobe)
      const sinYG = Math.sin(rotYGlobe)
      const cosXG = Math.cos(rotXGlobe)
      const sinXG = Math.sin(rotXGlobe)

      const D = 450 // Perspective view constant

      // Project unit sphere coordinates to 2D relative to 550x550 logical space
      const projectGlobePoint = (pt) => {
        // Y-axis rotation
        const x1 = pt.x * cosYG - pt.z * sinYG
        const z1 = pt.x * sinYG + pt.z * cosYG
        const y1 = pt.y

        // X-axis tilt
        const y2 = y1 * cosXG - z1 * sinXG
        const z2 = y1 * sinXG + z1 * cosXG
        const x2 = x1

        // scale & project
        const scale = D / (D + z2 * globeRadius)
        const px = x2 * globeRadius * scale + logicalCenterX
        const py = y2 * globeRadius * scale + logicalCenterY
        return { px, py, pz: z2 * globeRadius, scale }
      }

      // Project custom absolute points (for letters) relative to 550x550 space
      const projectWordPoint = (x, y, z) => {
        // Slow gentle float/parallax for word itself, independent of globe spin
        const rotYText = Math.sin(time * 0.25) * 0.08
        const rotXText = Math.cos(time * 0.2) * 0.05
        
        const cosYT = Math.cos(rotYText)
        const sinYT = Math.sin(rotYText)
        const cosXT = Math.cos(rotXText)
        const sinXT = Math.sin(rotXText)

        // Rotate Y
        let x1 = x * cosYT - z * sinYT
        let z1 = x * sinYT + z * cosYT
        let y1 = y

        // Rotate X
        let y2 = y1 * cosXT - z1 * sinXT
        let z2 = y1 * sinXT + z1 * cosXT
        let x2 = x1

        const scale = D / (D + z2)
        const px = x2 * scale + logicalCenterX
        const py = y2 * scale + logicalCenterY
        return { px, py, pz: z2, scale }
      }

      // Spawning new arcs over time
      if (Math.random() < 0.05 && activeArcs.length < 15) {
        spawnArc()
      }

      // Update active arcs
      for (let k = activeArcs.length - 1; k >= 0; k--) {
        const arc = activeArcs[k]
        arc.progress += arc.speed
        if (arc.progress >= 1.0) {
          activeArcs.splice(k, 1)
        }
      }

      const drawQueue = []

      // 1. Queue Globe Dots
      globePoints.forEach((pt) => {
        const proj = projectGlobePoint(pt)
        drawQueue.push({
          type: 'globe_dot',
          z: proj.pz,
          scale: proj.scale,
          px: proj.px,
          py: proj.py,
          colorType: pt.colorType
        })
      })

      // 2. Queue Letters (float oscillation)
      const letterFloatingOffset = Math.sin(time * 0.8) * 8
      letters.forEach((letter) => {
        // Small local phase oscillation per letter + global float
        const ly = letter.by + Math.sin(time * 1.3 + letter.phase) * 4 + letterFloatingOffset
        const lz = letter.bz

        const proj = projectWordPoint(letter.bx, ly, lz)
        letter.px = proj.px
        letter.py = proj.py
        letter.pz = proj.pz
        letter.scale = proj.scale

        drawQueue.push({
          type: 'letter',
          z: letter.pz,
          scale: letter.scale,
          char: letter.char,
          px: letter.px,
          py: letter.py
        })
      })

      // 3. Queue Active Arcs
      const numSegments = 30
      activeArcs.forEach((arc) => {
        let baseOpacity = 1.0
        if (arc.progress < 0.15) {
          baseOpacity = arc.progress / 0.15
        } else if (arc.progress > 0.85) {
          baseOpacity = (1.0 - arc.progress) / 0.15
        }

        const curvePoints = []
        for (let s = 0; s <= numSegments; s++) {
          const t = s / numSegments
          const mt = 1 - t
          // Bezier blend
          const fA = mt * mt
          const fC = 2 * mt * t
          const fB = t * t

          const x = fA * arc.pA.x + fC * arc.pC.x + fB * arc.pB.x
          const y = fA * arc.pA.y + fC * arc.pC.y + fB * arc.pB.y
          const z = fA * arc.pA.z + fC * arc.pC.z + fB * arc.pB.z

          const proj = projectGlobePoint({ x, y, z })
          curvePoints.push({ px: proj.px, py: proj.py, pz: proj.pz, t })
        }

        for (let s = 0; s < numSegments; s++) {
          const pt1 = curvePoints[s]
          const pt2 = curvePoints[s + 1]
          const zMid = (pt1.pz + pt2.pz) / 2
          const tMid = (pt1.t + pt2.t) / 2

          // Check if segment has traveling pulse factor
          const dist = Math.abs(tMid - arc.progress)
          const isPulse = dist < 0.14
          const pulseFactor = isPulse ? (1 - dist / 0.14) : 0

          drawQueue.push({
            type: 'arc_segment',
            z: zMid,
            x1: pt1.px,
            y1: pt1.py,
            x2: pt2.px,
            y2: pt2.py,
            color: arc.color,
            baseOpacity,
            isPulse,
            pulseFactor
          })
        }
      })

      // Depth sort: Farthest elements rendered first (Z value is highest)
      drawQueue.sort((a, b) => b.z - a.z)

      // Find Z-depth of letters to calculate line fade overlaps
      const avgLettersZ = letters.reduce((acc, l) => acc + l.pz, 0) / letters.length

      // Draw loop
      drawQueue.forEach((el) => {
        // Calculate physical responsive coordinates
        const px = el.px * scaleFactor
        const py = el.py * scaleFactor

        if (el.type === 'globe_dot') {
          if (px < 0 || px > width || py < 0 || py > height) return

          // Normalize depth scaling
          const normZ = (el.z + globeRadius) / (globeRadius * 2)
          const opacity = Math.max(0.1, Math.min(0.7, (1 - normZ) * 0.5 + 0.1))
          const size = Math.max(0.8, Math.min(2.0, (1 - normZ) * 1.2 + 0.8)) * scaleFactor

          // Subtle dot color palette
          let color = '#7C4DFF' // purple
          if (el.colorType === 1) color = '#EC4899' // pink
          else if (el.colorType === 2) color = '#06B6D4' // cyan

          ctx.fillStyle = color
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(px, py, size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1.0
        } else if (el.type === 'letter') {
          // Glow shadow
          ctx.shadowColor = 'rgba(124, 77, 255, 0.28)'
          ctx.shadowBlur = 18 * el.scale * scaleFactor

          ctx.font = `900 ${Math.round(88 * el.scale * scaleFactor)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          // Gradient Purple -> Pink -> Cyan
          const minGradX = (logicalCenterX - 180 * el.scale) * scaleFactor
          const maxGradX = (logicalCenterX + 180 * el.scale) * scaleFactor
          const gradient = ctx.createLinearGradient(minGradX, 0, maxGradX, 0)
          gradient.addColorStop(0, '#7C4DFF')
          gradient.addColorStop(0.5, '#EC4899')
          gradient.addColorStop(1, '#06B6D4')

          ctx.fillStyle = gradient
          ctx.fillText(el.char, px, py)

          ctx.shadowBlur = 0
        } else if (el.type === 'arc_segment') {
          // Check if segment is in front of the letters' Z-plane
          // If in front, make it highly translucent so it doesn't cover text readability
          const isInFront = el.z < avgLettersZ
          
          const normZ = (el.z + globeRadius) / (globeRadius * 2)
          
          const x1 = el.x1 * scaleFactor
          const y1 = el.y1 * scaleFactor
          const x2 = el.x2 * scaleFactor
          const y2 = el.y2 * scaleFactor

          if (el.isPulse) {
            // Pulse: thicker, glowing line
            const opacity = el.baseOpacity * Math.max(0.15, Math.min(0.9, (1 - normZ) * 0.75 + 0.15)) * (1.0 + el.pulseFactor * 0.4)
            ctx.strokeStyle = el.color
            ctx.lineWidth = Math.max(1.2, Math.min(2.8, (1 - normZ) * 1.6 + 1.2)) * (1.0 + el.pulseFactor * 0.6) * scaleFactor
            ctx.globalAlpha = isInFront ? Math.min(opacity, 0.15) : opacity // Limit opacity in front of text
            
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          } else {
            // Faint trace arc
            const opacity = el.baseOpacity * Math.max(0.02, Math.min(0.15, (1 - normZ) * 0.12 + 0.03))
            ctx.strokeStyle = el.color
            ctx.lineWidth = Math.max(0.5, Math.min(1.0, (1 - normZ) * 0.5 + 0.5)) * scaleFactor * scaleFactor
            ctx.globalAlpha = isInFront ? Math.min(opacity, 0.08) : opacity // Limit opacity in front of text

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
          ctx.globalAlpha = 1.0
        }
      })

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    const handleResize = () => {
      initCanvas()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[550px] aspect-square flex items-center justify-center select-none overflow-visible mx-auto">
      {/* 3D Network & Dotted Globe Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-95 pointer-events-none"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
