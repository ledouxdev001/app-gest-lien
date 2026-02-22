import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BackgroundCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    const svg = d3.select(ref.current).attr('width', W).attr('height', H);

    const nodes = d3.range(55).map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.5, opacity: Math.random() * 0.35 + 0.05,
    }));

    const lineG = svg.append('g'), dotG = svg.append('g');
    const circles = dotG.selectAll('circle').data(nodes).enter().append('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y)
      .attr('r',  d => d.r).attr('fill', '#7b5ea7').attr('opacity', d => d.opacity);

    function getLinks() {
      const ls = [];
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 140) ls.push({ s: nodes[i], t: nodes[j], dist });
        }
      return ls;
    }

    const timer = d3.timer(() => {
      nodes.forEach(n => {
        n.x += (Math.random() - 0.5) * 0.4; n.y += (Math.random() - 0.5) * 0.4;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
      });
      circles.attr('cx', d => d.x).attr('cy', d => d.y);
      const ls = getLinks();
      const lines = lineG.selectAll('line').data(ls);
      lines.enter().append('line').attr('stroke', '#7b5ea7').attr('stroke-width', '0.5')
        .merge(lines)
        .attr('x1', d => d.s.x).attr('y1', d => d.s.y)
        .attr('x2', d => d.t.x).attr('y2', d => d.t.y)
        .attr('opacity', d => (1 - d.dist / 140) * 0.18);
      lines.exit().remove();
    });

    return () => { timer.stop(); svg.selectAll('*').remove(); };
  }, []);

  return <svg id="bg-canvas" ref={ref} />;
}
