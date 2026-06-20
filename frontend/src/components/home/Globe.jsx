import { useEffect, useRef } from 'react'

export default function Globe() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    // Get actual layout size
    let width = canvas.clientWidth || 500
    let height = canvas.clientHeight || 500

    // Set canvas dimensions with device pixel ratio for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Generate points on a sphere (Fibonacci sphere algorithm)
    const numDots = 850
    const points = []
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = 2 * Math.PI * (1 - 1 / goldenRatio)

    for (let i = 0; i < numDots; i++) {
      const t = i / numDots
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      const x = Math.sin(inclination) * Math.cos(azimuth)
      const y = Math.sin(inclination) * Math.sin(azimuth)
      const z = Math.cos(inclination)

      // Distribute color types matching brand palette:
      // 0: lavender (#C084FC), 1: pink (#EC4899), 2: deep purple (#A855F7)
      const colorType = i % 3
      points.push({ x, y, z, colorType })
    }

    // Orbiting particles resembling satellites or light arcs
    const orbits = [
      { angle: 0, speed: 0.005, radius: 1.18, tiltX: 0.22, tiltY: 0.18, color: '#EC4899' },
      { angle: Math.PI * 0.6, speed: -0.0035, radius: 1.28, tiltX: -0.18, tiltY: 0.32, color: '#A855F7' },
      { angle: Math.PI * 1.35, speed: 0.0045, radius: 1.22, tiltX: 0.28, tiltY: -0.28, color: '#C084FC' }
    ]

    const activeArcs = []
    
    // Pre-populate initial arcs to prevent cold startup delay
    for (let i = 0; i < 8; i++) {
      const idxA = Math.floor(Math.random() * numDots)
      let idxB = Math.floor(Math.random() * numDots)
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * numDots)
      }

      const pA = points[idxA]
      const pB = points[idxB]

      const dx = pA.x - pB.x
      const dy = pA.y - pB.y
      const dz = pA.z - pB.z
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

      if (dist > 0.4 && dist < 1.6) {
        const mx = (pA.x + pB.x) / 2
        const my = (pA.y + pB.y) / 2
        const mz = (pA.z + pB.z) / 2
        const mLen = Math.sqrt(mx*mx + my*my + mz*mz)
        
        if (mLen > 0.01) {
          const nx = mx / mLen
          const ny = my / mLen
          const nz = mz / mLen

          const archHeight = 1.35 + Math.random() * 0.15
          const cx = nx * archHeight
          const cy = ny * archHeight
          const cz = nz * archHeight

          const colors = ['#DB2777', '#9333EA', '#06B6D4', '#F59E0B']
          const color = colors[Math.floor(Math.random() * colors.length)]

          activeArcs.push({
            pA,
            pB,
            pC: { x: cx, y: cy, z: cz },
            progress: Math.random(), // Random initial progress
            speed: 0.004 + Math.random() * 0.005,
            color
          })
        }
      }
    }

    let spawnTimer = 0

    let rotY = 0
    let rotX = 0.22 // Slight tilt towards user for depth

    const render = () => {
      if (!canvas) return
      
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const globeRadius = Math.min(width, height) * 0.44

      rotY += 0.001 // Slow continuous rotation speed

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const projected = []

      // Spawning active arcs representing connections
      spawnTimer++
      if (spawnTimer > 18 && activeArcs.length < 12) {
        spawnTimer = 0
        const idxA = Math.floor(Math.random() * numDots)
        let idxB = Math.floor(Math.random() * numDots)
        while (idxB === idxA) {
          idxB = Math.floor(Math.random() * numDots)
        }

        const pA = points[idxA]
        const pB = points[idxB]

        // Calculate 3D distance
        const dx = pA.x - pB.x
        const dy = pA.y - pB.y
        const dz = pA.z - pB.z
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

        if (dist > 0.4 && dist < 1.6) {
          const mx = (pA.x + pB.x) / 2
          const my = (pA.y + pB.y) / 2
          const mz = (pA.z + pB.z) / 2
          const mLen = Math.sqrt(mx*mx + my*my + mz*mz)
          
          if (mLen > 0.01) {
            const nx = mx / mLen
            const ny = my / mLen
            const nz = mz / mLen

            // Control point arches outward
            const archHeight = 1.35 + Math.random() * 0.15
            const cx = nx * archHeight
            const cy = ny * archHeight
            const cz = nz * archHeight

            const colors = ['#DB2777', '#9333EA', '#06B6D4', '#F59E0B']
            const color = colors[Math.floor(Math.random() * colors.length)]

            activeArcs.push({
              pA,
              pB,
              pC: { x: cx, y: cy, z: cz },
              progress: 0,
              speed: 0.004 + Math.random() * 0.005,
              color
            })
          }
        }
      }

      // Update active arcs progress
      for (let k = activeArcs.length - 1; k >= 0; k--) {
        const arc = activeArcs[k]
        arc.progress += arc.speed
        if (arc.progress >= 1.0) {
          activeArcs.splice(k, 1)
        }
      }

      // Project sphere dots
      for (let i = 0; i < numDots; i++) {
        const pt = points[i]

        // Rotate around Y-axis
        let x1 = pt.x * cosY - pt.z * sinY
        let z1 = pt.x * sinY + pt.z * cosY
        let y1 = pt.y

        // Rotate around X-axis (tilt)
        let y2 = y1 * cosX - z1 * sinX
        let z2 = y1 * sinX + z1 * cosX
        let x2 = x1

        // Perspective projection
        const D = 2.4
        const scale = D / (D + z2)
        const px = x2 * globeRadius * scale + centerX
        const py = y2 * globeRadius * scale + centerY

        projected.push({
          px,
          py,
          z: z2,
          colorType: pt.colorType,
          scale,
          type: 'dot'
        })
      }

      // Project active arcs
      const numSegments = 20
      for (let k = 0; k < activeArcs.length; k++) {
        const arc = activeArcs[k]
        const pA = arc.pA
        const pB = arc.pB
        const pC = arc.pC

        let baseOpacity = 1.0
        if (arc.progress < 0.15) {
          baseOpacity = arc.progress / 0.15
        } else if (arc.progress > 0.85) {
          baseOpacity = (1.0 - arc.progress) / 0.15
        }

        const curve3D = []
        for (let s = 0; s <= numSegments; s++) {
          const t = s / numSegments
          const mt = 1 - t
          const fA = mt * mt
          const fC = 2 * mt * t
          const fB = t * t

          const x = fA * pA.x + fC * pC.x + fB * pB.x
          const y = fA * pA.y + fC * pC.y + fB * pB.y
          const z = fA * pA.z + fC * pC.z + fB * pB.z

          let x1 = x * cosY - z * sinY
          let z1 = x * sinY + z * cosY
          let y1 = y

          let y2 = y1 * cosX - z1 * sinX
          let z2 = y1 * sinX + z1 * cosX
          let x2 = x1

          const D = 2.4
          const scale = D / (D + z2)
          const px = x2 * globeRadius * scale + centerX
          const py = y2 * globeRadius * scale + centerY

          curve3D.push({ px, py, z: z2, t })
        }

        for (let s = 0; s < numSegments; s++) {
          const pt1 = curve3D[s]
          const pt2 = curve3D[s + 1]
          const tMid = (pt1.t + pt2.t) / 2
          const zMid = (pt1.z + pt2.z) / 2

          projected.push({
            type: 'arc_segment',
            x1: pt1.px,
            y1: pt1.py,
            x2: pt2.px,
            y2: pt2.py,
            z: zMid,
            segmentT: tMid,
            progress: arc.progress,
            color: arc.color,
            baseOpacity
          })
        }
      }

      // Project orbiting particles
      for (let j = 0; j < orbits.length; j++) {
        const orbit = orbits[j]
        orbit.angle += orbit.speed

        let ox = Math.cos(orbit.angle) * orbit.radius
        let oz = Math.sin(orbit.angle) * orbit.radius
        let oy = 0

        // Apply orbit tilt
        const cosTX = Math.cos(orbit.tiltX)
        const sinTX = Math.sin(orbit.tiltX)
        let oy1 = oy * cosTX - oz * sinTX
        let oz1 = oy * sinTX + oz * cosTX
        let ox1 = ox

        const cosTY = Math.cos(orbit.tiltY)
        const sinTY = Math.sin(orbit.tiltY)
        let ox2 = ox1 * cosTY - oz1 * sinTY
        let oz2 = ox1 * sinTY + oz1 * cosTY
        let oy2 = oy1

        // Rotate along with globe
        let ox3 = ox2 * cosY - oz2 * sinY
        let oz3 = ox2 * sinY + oz2 * cosY
        let oy3 = oy2

        let oy4 = oy3 * cosX - oz3 * sinX
        let oz4 = oy3 * sinX + oz3 * cosX
        let ox4 = ox3

        const D = 2.4
        const scale = D / (D + oz4)
        const px = ox4 * globeRadius * scale + centerX
        const py = oy4 * globeRadius * scale + centerY

        projected.push({
          px,
          py,
          z: oz4,
          color: orbit.color,
          scale,
          type: 'orbit'
        })
      }

      // Sort by depth (farthest rendered first for natural Z-buffering)
      projected.sort((a, b) => b.z - a.z)

      // Draw projected elements
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i]

        if (p.type === 'dot') {
          if (p.px < 0 || p.px > width || p.py < 0 || p.py > height) continue
          const normZ = (p.z + 1.2) / 2.4 // Normalize z coordinates
          const opacity = Math.max(0.12, Math.min(0.75, (1 - normZ) * 0.63 + 0.12))
          const radius = Math.max(0.8, Math.min(2.2, (1 - normZ) * 1.4 + 0.8))

          let color = '#C084FC'
          if (p.colorType === 1) color = '#DB2777' // More saturated pink
          else if (p.colorType === 2) color = '#9333EA' // More saturated purple

          ctx.fillStyle = color
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(p.px, p.py, radius, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'orbit') {
          if (p.px < 0 || p.px > width || p.py < 0 || p.py > height) continue
          const normZ = (p.z + 1.2) / 2.4
          const opacity = Math.max(0.1, Math.min(0.8, (1 - normZ) * 0.7 + 0.1))
          const radius = Math.max(1.5, Math.min(3.5, (1 - normZ) * 2.5 + 1.0))

          // Outer bloom glow
          ctx.fillStyle = p.color
          ctx.globalAlpha = opacity * 0.3
          ctx.beginPath()
          ctx.arc(p.px, p.py, radius * 2.4, 0, Math.PI * 2)
          ctx.fill()

          // Solid core
          ctx.fillStyle = '#FFFFFF'
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(p.px, p.py, radius * 0.8, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'arc_segment') {
          const normZ = (p.z + 1.2) / 2.4
          const dist = Math.abs(p.segmentT - p.progress)

          if (dist < 0.14) {
            // Laser Traveling Pulse
            const pulseFactor = 1 - (dist / 0.14)
            const opacity = p.baseOpacity * Math.max(0.15, Math.min(0.9, (1 - normZ) * 0.75 + 0.15)) * pulseFactor
            const lineWidth = Math.max(1.2, Math.min(2.8, (1 - normZ) * 1.6 + 1.2)) * (1.0 + pulseFactor * 0.6)

            ctx.strokeStyle = p.color
            ctx.lineWidth = lineWidth
            ctx.globalAlpha = opacity
            ctx.beginPath()
            ctx.moveTo(p.x1, p.y1)
            ctx.lineTo(p.x2, p.y2)
            ctx.stroke()
          } else {
            // Faint trace arc
            const opacity = p.baseOpacity * Math.max(0.02, Math.min(0.15, (1 - normZ) * 0.12 + 0.03))
            const lineWidth = Math.max(0.6, Math.min(1.2, (1 - normZ) * 0.6 + 0.6))

            ctx.strokeStyle = p.color
            ctx.lineWidth = lineWidth
            ctx.globalAlpha = opacity
            ctx.beginPath()
            ctx.moveTo(p.x1, p.y1)
            ctx.lineTo(p.x2, p.y2)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1.0
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Handle fluid resizing
    const handleResize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      width = rect.width || canvas.clientWidth || 500
      height = rect.height || canvas.clientHeight || 500
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      
      ctx.resetTransform()
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', handleResize)
    setTimeout(handleResize, 150)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-95"
      style={{
        width: '100%',
        height: '100%',
        minWidth: '400px',
        minHeight: '400px',
        maxWidth: '580px',
        maxHeight: '580px'
      }}
    />
  )
}
