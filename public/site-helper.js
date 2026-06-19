// public/site-helper.js

(function () {
  "use strict";

  // 配置数据
  const SITE_CONFIG = {
    url: "https://chinese-official-leyu.com",
    keyword: "leyu",
    seed: "449c431b4cc9960e"
  };

  /**
   * 创建页面提示卡片
   * @param {string} message - 提示内容
   * @param {string} type - 类型: 'info', 'warning', 'success'
   * @returns {HTMLElement} 卡片DOM元素
   */
  function createTipCard(message, type) {
    var card = document.createElement("div");
    card.className = "tip-card tip-card--" + (type || "info");
    card.setAttribute("role", "alert");

    var icon = document.createElement("span");
    icon.className = "tip-card__icon";
    icon.textContent = type === "warning" ? "⚠️" : type === "success" ? "✅" : "ℹ️";
    card.appendChild(icon);

    var text = document.createElement("span");
    text.className = "tip-card__text";
    text.textContent = message;
    card.appendChild(text);

    return card;
  }

  /**
   * 生成关键词徽章
   * @param {string} keyword - 关键词
   * @param {number} count - 关联计数
   * @returns {HTMLElement} 徽章DOM元素
   */
  function createKeywordBadge(keyword, count) {
    var badge = document.createElement("span");
    badge.className = "keyword-badge";
    badge.setAttribute("data-keyword", keyword);

    var label = document.createElement("span");
    label.className = "keyword-badge__label";
    label.textContent = keyword;
    badge.appendChild(label);

    if (count !== undefined) {
      var num = document.createElement("span");
      num.className = "keyword-badge__count";
      num.textContent = count;
      badge.appendChild(num);
    }

    return badge;
  }

  /**
   * 生成访问说明区域
   * @param {string} siteUrl - 站点URL
   * @param {string} primaryKeyword - 主要关键词
   * @returns {HTMLElement} 说明区块
   */
  function createAccessNotice(siteUrl, primaryKeyword) {
    var container = document.createElement("div");
    container.className = "access-notice";

    var heading = document.createElement("h3");
    heading.className = "access-notice__title";
    heading.textContent = "访问说明";
    container.appendChild(heading);

    var list = document.createElement("ul");
    list.className = "access-notice__list";

    var items = [
      "本页面与 " + siteUrl + " 关联，提供辅助信息。",
      "关键词 \"" + primaryKeyword + "\" 用于标识相关内容。",
      "建议使用现代浏览器获得最佳体验。",
      "所有提示仅作参考，不构成推荐或保证。"
    ];

    items.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });

    container.appendChild(list);

    // 添加关键词徽章示例
    var badgeRow = document.createElement("div");
    badgeRow.className = "access-notice__badges";
    badgeRow.appendChild(createKeywordBadge(primaryKeyword, 5));
    badgeRow.appendChild(createKeywordBadge("官方", 3));
    badgeRow.appendChild(createKeywordBadge("提示", 2));
    container.appendChild(badgeRow);

    return container;
  }

  /**
   * 初始化页面增强：插入提示卡片、关键词徽章和访问说明
   * @param {Object} config - 配置对象
   */
  function enhancePage(config) {
    if (!config) config = SITE_CONFIG;

    var body = document.body;
    if (!body) return;

    // 插入提示卡片
    var tipCard = createTipCard(
      "欢迎访问关联站点：" + config.url + "。关键词：“" + config.keyword + "”",
      "info"
    );
    body.insertBefore(tipCard, body.firstChild);

    // 插入访问说明
    var notice = createAccessNotice(config.url, config.keyword);
    body.appendChild(notice);

    // 额外：在页面中查找包含关键词的元素并添加徽章效果（仅演示）
    var walker = document.createTreeWalker(
      body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    var nodesToMark = [];
    while ((node = walker.nextNode())) {
      if (node.textContent.indexOf(config.keyword) !== -1) {
        nodesToMark.push(node);
      }
    }

    // 简单高亮关键词（不破坏原有结构）
    nodesToMark.forEach(function (textNode) {
      var parent = textNode.parentNode;
      if (parent && parent.nodeType === 1) {
        // 只对纯文本段落或span做简单替换（避免复杂DOM操作）
        var tag = parent.tagName.toLowerCase();
        if (tag === "p" || tag === "span" || tag === "div" || tag === "li") {
          var html = parent.innerHTML;
          var regex = new RegExp("(" + config.keyword + ")", "gi");
          html = html.replace(regex, '<mark class="highlight-keyword">$1</mark>');
          parent.innerHTML = html;
        }
      }
    });
  }

  // 准备样式（内联注入，避免外部依赖）
  function injectStyles() {
    var style = document.createElement("style");
    style.textContent = [
      ".tip-card { display: flex; align-items: center; padding: 12px 16px; margin: 12px 0; border-radius: 8px; background: #e3f2fd; border-left: 4px solid #1976d2; font-size: 14px; }",
      ".tip-card--warning { background: #fff3e0; border-left-color: #f57c00; }",
      ".tip-card--success { background: #e8f5e9; border-left-color: #388e3c; }",
      ".tip-card__icon { margin-right: 10px; font-size: 18px; }",
      ".tip-card__text { color: #333; }",
      ".keyword-badge { display: inline-block; padding: 4px 10px; margin: 4px; border-radius: 12px; background: #eee; font-size: 12px; color: #555; border: 1px solid #ccc; }",
      ".keyword-badge__count { margin-left: 6px; background: #ddd; border-radius: 8px; padding: 0 6px; font-weight: bold; }",
      ".access-notice { margin: 20px 0; padding: 16px; background: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0; }",
      ".access-notice__title { margin: 0 0 10px; font-size: 18px; color: #222; }",
      ".access-notice__list { margin: 0; padding-left: 20px; }",
      ".access-notice__list li { margin: 6px 0; line-height: 1.5; }",
      ".access-notice__badges { margin-top: 12px; }",
      ".highlight-keyword { background: #fff176; padding: 0 2px; border-radius: 2px; }"
    ].join(" ");
    document.head.appendChild(style);
  }

  // 等DOM完全加载后执行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectStyles();
      enhancePage();
    });
  } else {
    injectStyles();
    enhancePage();
  }
})();