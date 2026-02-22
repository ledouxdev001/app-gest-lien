import LinkCard from './LinkCard';

export default function LinksContainer({ categories, links }) {
  const sorted = [...categories].sort((a, b) => a.order_pos - b.order_pos);
  let globalIndex = 0;

  return (
    <div>
      {sorted.map(cat => {
        const catLinks = links
          .filter(l => l.category_id === cat.id)
          .sort((a, b) => a.order_pos - b.order_pos);
        if (!catLinks.length) return null;
        return (
          <div key={cat.id}>
            <div className="category-row">{cat.label}</div>
            {catLinks.map(link => (
              <LinkCard key={link.id} link={link} index={globalIndex++} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
