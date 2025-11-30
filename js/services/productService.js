import { products } from '../data/products.js';

export class ProductService {
  getProductsByFilter(mainCat, subFilter) {
    let result = products.filter(p => p.mainCategory === mainCat);
    if (subFilter !== 'all') {
      result = result.filter(p => p.category === subFilter);
    }
    return result;
  }

  formatPrice(krw, hkd) {
    return `₩${krw.toLocaleString()} · 約 HK$${hkd}`;
  }
}
