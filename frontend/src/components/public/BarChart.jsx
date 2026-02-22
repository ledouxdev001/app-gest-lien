import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarChart({ links }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !links.length) return;
    const total = d3.sum(links, d => d.weight) || 1;
    const margin = { top: 4, right: 60, bottom: 4, left: 110 };
    const W = 520, barH = 28, gap = 10;
    const H = links.length * (barH + gap) + margin.top + margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const innerW = W - margin.left - margin.right;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
    const colorScale = d3.scaleSequential()
      .domain([0, links.length - 1])
      .interpolator(d3.interpolateRgb('#7b5ea7', '#e8ff47'));

    links.forEach((d, i) => {
      const y = i * (barH + gap), pct = (d.weight / total * 100).toFixed(1);
      g.append('text').attr('x', -8).attr('y', y + barH/2)
        .attr('dominant-baseline', 'central').attr('text-anchor', 'end')
        .attr('font-family', 'DM Mono,monospace').attr('font-size', '11').attr('fill', '#888')
        .text(`${d.emoji} ${d.title}`);
      g.append('rect').attr('x', 0).attr('y', y).attr('width', innerW).attr('height', barH)
        .attr('rx', 6).attr('fill', 'rgba(255,255,255,0.03)');
      g.append('rect').attr('x', 0).attr('y', y).attr('width', 0).attr('height', barH)
        .attr('rx', 6).attr('fill', colorScale(i)).attr('opacity', 0.85)
        .transition().delay(300 + i*80).duration(700).ease(d3.easeCubicOut).attr('width', x(+pct));
      const label = g.append('text').attr('x', x(+pct)+8).attr('y', y + barH/2)
        .attr('dominant-baseline', 'central').attr('font-family', 'DM Mono,monospace')
        .attr('font-size', '11').attr('fill', '#777').text('0%');
      label.transition().delay(300 + i*80).duration(700).ease(d3.easeCubicOut)
        .tween('text', function() { const ip = d3.interpolateNumber(0, +pct); return t => d3.select(this).text(ip(t).toFixed(1) + '%'); })
        .attr('x', x(+pct) + 8);
    });
  }, [links]);

  return (
    <div className="stats-section">
      <h3>Répartition des projets</h3>
      <svg ref={ref} />
    </div>
  );
}
