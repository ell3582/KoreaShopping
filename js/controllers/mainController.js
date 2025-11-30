import { ProductService } from '../services/productService.js';

export class MainController {
  constructor() {
    this.productService = new ProductService();
    this.state = {
      currentMainCategory: 'oliveyoung',
      currentSubFilter: 'all',
      isElderlyMode: false,
      navVisible: true
    };

    this.subFilterConfig = {
      'oliveyoung': [
        { id: 'all', name: '全部' },
        { id: 'lotion', name: '面霜' },
        { id: 'ampoule', name: '精華' },
        { id: 'mask', name: '面膜' },
        { id: 'food', name: '食物' }
      ],
      'food': [
        { id: 'all', name: '全部' },
        { id: 'drink', name: '飯/麵' },
        { id: 'snack', name: '零食' },
        { id: 'drink', name: '飲品' }
      ],
      'lifestyle': [
        { id: 'all', name: '全部' },
        { id: 'clean', name: '清潔用品' },
        { id: 'other', name: '雜貨' }
      ]
    };
  }

  init() {
    this.bindEvents();
    this.renderSubFilters();
    this.render();
  }

  bindEvents() {
    // 大分類 Tab 事件
    document.getElementById('main-tab-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('main-tab-btn')) {
        document.querySelectorAll('.main-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.switchMainCategory(e.target.dataset.mainCat);
      }
    });

    // 子篩選事件
    document.getElementById('filter-container').addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.state.currentSubFilter = e.target.dataset.filter;
        this.render();
      }
    });

    // 字體切換事件
    document.getElementById('size-container').addEventListener('click', (e) => {
      if (e.target.id === 'normal-size') this.toggleElderlyMode(false);
      if (e.target.id === 'elderly-size') this.toggleElderlyMode(true);
    });

    // 導航隱藏/顯示事件
    document.getElementById('toggle-nav-btn').addEventListener('click', () => {
      const navContainer = document.getElementById('nav-container');
      const btn = document.getElementById('toggle-nav-btn');

      this.state.navVisible = !this.state.navVisible;
      navContainer.classList.toggle('hidden', !this.state.navVisible);
      btn.classList.toggle('active', this.state.navVisible);
    });
  }

  switchMainCategory(newCat) {
    this.state.currentMainCategory = newCat;
    this.state.currentSubFilter = 'all';
    this.renderSubFilters();
    this.render();
  }

  toggleElderlyMode(isElderly) {
    this.state.isElderlyMode = isElderly;
    document.body.classList.toggle('elderly-mode', isElderly);
    document.getElementById('normal-size').classList.toggle('active', !isElderly);
    document.getElementById('elderly-size').classList.toggle('active', isElderly);
  }

  scrollToProduct(id) {
    const target = document.querySelector(`[data-product-id="${id}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderSubFilters() {
    const container = document.getElementById('filter-container');
    const filters = this.subFilterConfig[this.state.currentMainCategory] || [];

    container.innerHTML = `<span class="filter-label">🔍 篩選：</span>` +
      filters.map(f => `
        <button class="filter-btn ${f.id === 'all' ? 'active' : ''}" 
                data-filter="${f.id}">${f.name}</button>
      `).join('');
  }

  render() {
    const filteredList = this.productService.getProductsByFilter(
      this.state.currentMainCategory,
      this.state.currentSubFilter
    );

    this.renderProductList(filteredList);
    this.renderNav(filteredList);
  }

  renderProductList(list) {
    const app = document.getElementById('app');
    if (list.length === 0) {
      app.innerHTML = '<div class="empty-state">此分類暫無產品</div>';
      return;
    }

    app.innerHTML = list.map(p => {
      // 1. 定義圖片 HTML (共用部分)
      const imageHtml = `
                <img src="images/${p.image}" 
                     alt="${p.chineseName}" 
                     class="product-image" 
                     onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'product-image\'>圖片無法載入</div>'">
            `;

      // 2. 判斷是否有 url
      // 有 url -> 用 <a> 包住圖片
      // 無 url -> 直接顯示圖片
      const imageContainerContent = p.url
        ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="cursor: pointer;">${imageHtml}</a>`
        : imageHtml;

      return `
        <section class="product-card" data-product-id="${p.id}">
          <span class="product-number">編號 ${p.id}</span>
          <div class="product-title">${p.chineseName}</div>
          <div class="product-subtitle">${p.koreanName}</div>
          
          <div class="product-image-container">
            ${imageContainerContent}
          </div>

          <div class="price-row">${this.productService.formatPrice(p.krw, p.hkd)}</div>
          <div class="desc">${p.desc}</div>
          <ul class="features">
            ${p.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </section>
      `;
    }).join('');
  }

  renderNav(list) {
    const nav = document.getElementById('nav-container');
    nav.innerHTML = list.map(p => `
      <button class="nav-btn" onclick="window.controller.scrollToProduct('${p.id}')">
        ${p.id}
      </button>
    `).join('');
  }
}
