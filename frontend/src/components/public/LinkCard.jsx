import { useRef } from 'react';
import * as d3 from 'd3';

export default function LinkCard({ link, index }) {
  const rectRef = useRef(null);

  const handleMouseEnter = () => {
    if (rectRef.current) d3.select(rectRef.current).transition().duration(300).ease(d3.easeCubicOut).attr('width', 560);
  };
  const handleMouseLeave = () => {
    if (rectRef.current) d3.select(rectRef.current).transition().duration(250).ease(d3.easeCubicIn).attr('width', 0);
  };

  return (
    <a
      className="link-card visible"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${80 * index + 100}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-bar">
        <svg width="100%" height="3">
          <rect ref={rectRef} y={0} height={3} fill="rgba(232,255,71,0.5)" rx={2} width={0} />
        </svg>
      </div>
      <div className="link-icon">{link.emoji}</div>
      <div className="link-info">
        <div className="link-title">{link.title}</div>
        <div className="link-desc">{link.desc}</div>
      </div>
      <div className="link-arrow">↗</div>
    </a>
  );
}
