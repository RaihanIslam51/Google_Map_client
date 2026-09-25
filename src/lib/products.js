export const getLocalProducts = () => {
  if (typeof window === 'undefined') return [];
  const prods = localStorage.getItem('ws_products');
  try {
    return prods ? JSON.parse(prods) : [];
  } catch {
    return [];
  }
};

export const saveProductsToLocal = (newProducts) => {
  if (typeof window === 'undefined') return;
  if (!newProducts || newProducts.length === 0) return;
  
  const current = getLocalProducts();
  const merged = [...current];
  
  newProducts.forEach(prod => {
    // Avoid duplicates by productUrl
    const exists = merged.some(p => p.productUrl === prod.productUrl);
    if (!exists) {
      merged.push(prod);
    }
  });
  
  localStorage.setItem('ws_products', JSON.stringify(merged));
};

export const deleteLocalProduct = (id) => {
  if (typeof window === 'undefined') return;
  const current = getLocalProducts();
  const filtered = current.filter(p => p._id !== id);
  localStorage.setItem('ws_products', JSON.stringify(filtered));
  return filtered;
};
