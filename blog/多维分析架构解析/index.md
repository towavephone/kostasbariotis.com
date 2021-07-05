---
title: 多维分析架构解析
path: /multi-dimension-analysis-structure-analyzing/
date: 2021-3-29 10:02:10
tags: 业务
draft: true
---

src\client\components\derive-analytic

```bash
.
├── components
│   ├── indice-item-list.jsx
│   ├── indice-item-list.styl
│   ├── indice-selector-modal.jsx
│   ├── indice-selector-modal.styl
│   ├── indice-selector-setting-modal.jsx
│   ├── indice-selector-setting-modal.styl
│   ├── indice-selector.jsx
│   ├── indices-inspector.jsx
│   ├── save-analytic-modal.jsx
│   ├── save-analytic-modal.styl
│   ├── time-select.jsx
│   ├── time-select.styl
│   └── time-setting.jsx
├── drag-drop-hoc.jsx
├── filter-editor.js
├── filter-editor.styl
├── group
│   ├── add-modal.jsx
│   ├── dnd-sort.jsx
│   ├── group-setting-modal.jsx
│   ├── group-setting-modal.styl
│   └── index.jsx
├── index.jsx
├── index.styl
├── model.js # model 数据层，存放跨组件数据
├── pinyin-utils.js
├── report-analytic.jsx
├── report-analytic.styl
├── report-tabs
│   ├── analytic-func.js
│   ├── draggable-tabs.jsx
│   ├── index.jsx
│   ├── table.styl
│   └── 多维分析后处理逻辑、自定义本地指标说明.md
└── viz-type-selector.jsx
```

动态 saga model 绑定工具，使用 key 来实现切换 model

SliceChartFacade 多组件映射
