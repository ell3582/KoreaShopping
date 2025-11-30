import { products } from '../data/products.js';

export class ProductService {
    constructor() {
        this.products = products;
    }

    // 根據類別獲取產品
    getProductsByFilter(filter) {
        if (filter === 'all') {
            return this.products;
        }
        return this.products.filter(p => p.category === filter);
    }

    // 格式化價格字串
    formatPrice(krw, hkd) {
        return `₩${krw.toLocaleString()} · 約 HK$${hkd}`;
    }

    // 根據 ID 查找產品
    getProductById(id) {
        return this.products.find(p => p.id === String(id));
    }
}
