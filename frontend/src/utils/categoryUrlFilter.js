export function getCategoryFromUrl(search = window.location.search) {
  return new URLSearchParams(search).get('category') || 'all';
}

export function buildCategoryUrl(category, { pathname = window.location.pathname, search = window.location.search } = {}) {
  const params = new URLSearchParams(search);
  if (category && category !== 'all') {
    params.set('category', category);
  } else {
    params.delete('category');
  }
  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ''}`;
}
