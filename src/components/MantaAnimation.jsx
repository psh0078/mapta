import { useEffect, useRef } from 'react';

const NUM_RAYS = 5;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createRay(width, height) {
  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    angle: randomBetween(0, Math.PI * 2),
    speed: randomBetween(0.35, 0.8),
    scale: randomBetween(0.6, 1.1),
    phaseOffset: randomBetween(0, Math.PI * 2),
    turnRate: randomBetween(-0.0022, 0.0022),
  };
}

// Build a manta ray Path2D facing right (+x).
// Wing tips shift in Y to simulate flapping — outer tips more than inner.
// Proportions based on real Mobula birostris: wingspan ≈ 2.5× disc length.
function buildMantaPath(flapOuter, flapInner) {
  // Disc length: ~75px (x: -42 to +33), Wingspan: ~190px (y: ±95)
  // Cephalic fins extend forward from the head.
  // Trailing edges are distinctly concave (a key manta ID feature).
  const lTipY  = -92 - flapOuter;
  const lMidY  = -52 - flapInner;
  const rTipY  =  92 + flapOuter;
  const rMidY  =  52 + flapInner;

  return new Path2D(`
    M 33 0
    C 29 -3, 24 -7, 20 -12
    C 16 -17, 10 -30, 2 ${lMidY}
    C -1 ${lTipY - 6}, -5 ${lTipY}, -4 ${lTipY}
    C -3 ${lTipY + 4}, -2 ${lTipY + 8}, 0 ${lTipY + 10}
    C -6 ${lMidY + 10}, -30 -10, -42 0
    C -30 10, -6 ${rMidY - 10}, 0 ${-(lTipY + 10)}
    C -2 ${-(lTipY + 8)}, -3 ${-(lTipY + 4)}, -4 ${-lTipY}
    C -5 ${-lTipY}, -1 ${-(lTipY - 6)}, 2 ${-lMidY}
    C 10 30, 16 17, 20 12
    C 24 7, 29 3, 33 0
    Z
  `);
}

function drawManta(ctx, x, y, angle, scale, t) {
  const flapOuter = Math.sin(t * 2.1) * 16;
  const flapInner = Math.sin(t * 2.1 - 0.5) * 6;
  const path = buildMantaPath(flapOuter, flapInner);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.fill(path);
  ctx.stroke(path);

  // Whip tail — thin bezier extending from disc rear
  ctx.beginPath();
  ctx.moveTo(-42, 0);
  ctx.bezierCurveTo(-50, -2, -58, 1, -65, 0);
  ctx.stroke();

  ctx.restore();
}

export default function MantaAnimation() {
  const canvasRef = useRef(null);
  const raysRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    raysRef.current = Array.from({ length: NUM_RAYS }, () =>
      createRay(canvas.width, canvas.height)
    );

    let startTime = null;

    function frame(ts) {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle   = 'rgba(0, 175, 220, 0.07)';
      ctx.strokeStyle = 'rgba(0, 215, 255, 0.16)';
      ctx.lineWidth   = 0.8;

      for (const ray of raysRef.current) {
        ray.angle += ray.turnRate;
        ray.x += Math.cos(ray.angle) * ray.speed;
        ray.y += Math.sin(ray.angle) * ray.speed;

        if (ray.x < -130) ray.x = width  + 130;
        if (ray.x > width  + 130) ray.x = -130;
        if (ray.y < -130) ray.y = height + 130;
        if (ray.y > height + 130) ray.y = -130;

        drawManta(ctx, ray.x, ray.y, ray.angle, ray.scale, t + ray.phaseOffset);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
