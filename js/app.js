import { MainController } from './controllers/mainController.js';

// 全域暴露 controller 方便 onclick 調用
window.controller = null;

document.addEventListener('DOMContentLoaded', () => {
  window.controller = new MainController();
  window.controller.init();
});
