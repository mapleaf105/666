# Flappy Bird - 666

A lightweight Flappy Bird–style 2D game implemented with HTML5 Canvas and vanilla JavaScript.
Mobile-friendly (touch/click), no external libraries, very small footprint.

Files added:
- index.html
- style.css
- game.js

如何运行
1. 直接打开 `index.html`：在本地双击 `index.html` 或用浏览器打开即可（Chrome/Edge/Firefox/Safari 都可）。
2. 手机测试：把仓库部署到静态服务器或直接将文件放到手机上并用浏览器打开。建议竖屏浏览体验更佳。
3. GitHub Pages：如果你想把 demo 发布到 GitHub Pages，打开仓库 Settings → Pages，选择 `main` 分支并保存（或选择 `gh-pages`）即可，随后访问 `https://<your-username>.github.io/666/`。

控制方式
- 点击或触摸屏幕：让小鸟上升
- 空格键：同样触发（桌面调试）
- 游戏结束后点击“再来一次”重试

自定义与扩展
- 参数都在 `game.js` 顶部（鸟的重力/跳跃力度、管道间隙与速度等），可轻松调整难度。
- 如需加入图片或音效，可把资源放到 `assets/` 目录并在 `index.html`/`game.js` 中加载（注意音频可能占用更多空间）。

注意
- 文件总体非常小，远小于 200 MB。当前实现没有额外音频或图片资源，方便直接运行与测试.
