import { MainController } from './controllers/mainController.js';

// 當 DOM 載入完成後初始化 App
document.addEventListener('DOMContentLoaded', () => {
    new MainController();
});
