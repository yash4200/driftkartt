// Listing.js (Short logic)
const filtered = products.filter(p => p.category.toLowerCase() === selectedCat);
return (
    <div style={{ padding: '20px' }}>
        <h2>Items in {selectedCat}</h2>
        <div style={styles.grid}>
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
    </div>
);