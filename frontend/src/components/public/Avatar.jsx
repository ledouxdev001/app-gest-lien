import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Avatar({ emoji }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const size = 74;
    const container = d3.select(ref.current);
    container.selectAll('*').remove();

    const svg = container.append('svg').attr('width', size).attr('height', size)
      .style('display', 'block').style('margin', '0 auto 18px');

    const defs = svg.append('defs');
    const f = defs.append('filter').attr('id', 'glow-pub');
    f.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    const fm = f.append('feMerge');
    fm.append('feMergeNode').attr('in', 'blur');
    fm.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${size/2},${size/2})`);
    g.append('circle').attr('r', 33).attr('fill', 'none').attr('stroke', 'rgba(123,94,167,0.3)').attr('stroke-width', '1');
    d3.range(16).forEach(i => {
      const a = (i/16) * Math.PI * 2;
      g.append('line')
        .attr('x1', Math.cos(a)*28).attr('y1', Math.sin(a)*28)
        .attr('x2', Math.cos(a)*33).attr('y2', Math.sin(a)*33)
        .attr('stroke', 'rgba(232,255,71,0.4)').attr('stroke-width', '1.2');
    });
    g.append('circle').attr('r', 24).attr('fill', 'rgba(123,94,167,0.18)')
      .attr('stroke', 'rgba(123,94,167,0.5)').attr('stroke-width', '1').attr('filter', 'url(#glow-pub)');
    g.append('text').text(emoji || '✦')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('font-size', '22').attr('fill', '#e8ff47').attr('filter', 'url(#glow-pub)');

    let angle = 0;
    const timer = d3.timer(() => {
      angle += 0.003;
      g.attr('transform', `translate(${size/2},${size/2}) rotate(${(angle*180)/Math.PI})`);
    });
    return () => timer.stop();
  }, [emoji]);

  return <div ref={ref} />;
}
