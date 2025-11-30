import { ProductService } from '../services/productService.js';

export class MainController {
    constructor() {
        this.productService = new ProductService();
        this.appElement = document.getElementById('app');
        this.navContainer = document.getElementById('nav-container');
        
        this.state = {
            currentFilter: 'all',
            isElderlyMode: false
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    // 綁定所有 DOM 事件
    bindEvents() {
        // 篩選按鈕事件
        document.getElementById('filter-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterClick(e.target);
            }
        });

        // 字體切換事件
        document.getElementById('size-container').addEventListener('click', (e) => {
            if (e.target.id === 'normal-size') this.toggleElderlyMode(false);
            if (e.target.id === 'elderly-size') this.toggleElderlyMode(true);
        });
    }

    // 處理篩選邏輯
    handleFilterClick(targetBtn) {
        // 更新 UI 狀態
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        // 更新數據狀態
        this.state.currentFilter = targetBtn.dataset.filter;
        this.render();
    }

    // 處理字體模式切換
    toggleElderlyMode(isElderly) {
        this.state.isElderlyMode = isElderly;
        document.body.classList.toggle('elderly-mode', isElderly);
        
        document.getElementById('normal-size').classList.toggle('active', !isElderly);
        document.getElementById('elderly-size').classList.toggle('active', isElderly);
    }

    // 處理滾動
    scrollToProduct(id) {
        const target = document.querySelector(`[data-product-id="${id}"]`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 渲染主視圖
    render() {
        const filteredProducts = this.productService.getProductsByFilter(this.state.currentFilter);
        
        this.renderProductList(filteredProducts);
        this.renderQuickNav(filteredProducts);
    }

    // 渲染產品列表
    // js/controllers/mainController.js

    // ...
    renderProductList(products) {
        // ... (前面不變)

        this.appElement.innerHTML = products.map(p => {
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
                    <span class="product-number">產品${p.id}</span>
                    <div class="product-title">${p.chineseName}</div>
                    <div class="product-subtitle">${p.koreanName}</div>
                    
                    <!-- 👇 這裡放入判斷後的結果 👇 -->
                    <div class="product-image-container">
                        ${imageContainerContent}
                    </div>
                    <!-- 👆 修改結束 👆 -->

                    <div class="price-row">${this.productService.formatPrice(p.krw, p.hkd)}</div>
                    <div class="desc">${p.desc}</div>
                    <ul class="features">
                        ${p.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </section>
            `;
        }).join('');
    }
    // ...


    // 渲染快速導航按鈕
    renderQuickNav(products) {
        this.navContainer.innerHTML = '';
        
        products.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = `產品 ${p.id}`;
            btn.onclick = () => this.scrollToProduct(p.id);
            this.navContainer.appendChild(btn);
        });
    }
}
