# 物品管理器

AI 智能物品识别应用 - 上传书桌或卧室照片，自动识别物品并生成卡通图片。

## 在线访问

**GitHub Pages**: https://hills-dong.github.io/conductor-playground/

## 功能

- 配置 Gemini API Key
- 上传书桌/卧室照片
- AI 自动识别照片中的物品
- 为每个物品生成卡通风格图片

## 本地运行

```bash
# 启动本地服务器
python -m http.server 8000

# 访问
open http://localhost:8000
```

## 技术栈

- HTML5 + Tailwind CSS
- Gemini 1.5 Flash (图像识别)
- Imagen 3 (图像生成)
