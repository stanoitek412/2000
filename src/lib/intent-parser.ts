import { products, type Product } from '../data/products';

export interface ParsedIntent {
  action: 'buy' | 'search' | 'browse' | 'topup' | 'unknown';
  productName?: string;
  amount?: number;
  currency?: string;
  category?: string;
  matchedProducts: Product[];
  confidence: number;
  responseText: string;
}

const productKeywords: Record<string, string[]> = {
  amazon: ['amazon', '亚马逊', '亚马逊礼品卡', 'amazon礼品卡'],
  'google-play': ['google play', '谷歌', 'google', '谷歌商店'],
  apple: ['apple', 'itunes', '苹果', 'app store', '苹果礼品卡'],
  steam: ['steam', '蒸汽', 'steam钱包', 'steam充值'],
  playstation: ['playstation', 'ps', 'ps5', 'ps4', '索尼', 'sony'],
  nintendo: ['nintendo', 'switch', '任天堂', 'eshop'],
  xbox: ['xbox', '微软游戏'],
  spotify: ['spotify', '音乐', '音乐会员'],
  netflix: ['netflix', '网飞', '影视', '流媒体'],
  disney: ['disney', '迪士尼', 'disney+'],
  walmart: ['walmart', '沃尔玛'],
  target: ['target', '塔吉特'],
  'uber-eats': ['uber eats', '优食', '外卖'],
  starbucks: ['starbucks', '星巴克', '咖啡'],
  att: ['at&t', 'att', 'at&t话费'],
  tmobile: ['t-mobile', 'tmobile', 't-mobile话费'],
  softbank: ['softbank', '软银', '日本话费'],
  roblox: ['roblox', '罗布乐思'],
  doordash: ['doordash', '门冲'],
};

const categoryKeywords: Record<string, string[]> = {
  'gift-cards': ['礼品卡', 'gift card', '代金券', '充值卡', '卡'],
  'mobile-topup': ['话费', '充值话费', 'top-up', 'topup', '手机充值', '流量'],
  gaming: ['游戏', 'game', 'gaming', '游戏卡'],
  entertainment: ['娱乐', 'entertainment', '影视', '音乐', '视频'],
  shopping: ['购物', 'shopping', '商城', '商店'],
  food: ['美食', 'food', '外卖', '咖啡', '餐厅'],
};

const currencyPatterns: Record<string, RegExp> = {
  USD: /\$?\s*(\d+)\s*(?:美元|USD|dollars?)/i,
  JPY: /(\d+)\s*(?:日元|JPY|yen)/i,
  EUR: /(\d+)\s*(?:欧元|EUR|euros?)/i,
};

function extractAmount(text: string): { amount: number; currency: string } | null {
  for (const [currency, pattern] of Object.entries(currencyPatterns)) {
    const match = text.match(pattern);
    if (match) {
      return { amount: parseInt(match[1], 10), currency };
    }
  }

  const genericAmount = text.match(/(\d+)/);
  if (genericAmount) {
    return { amount: parseInt(genericAmount[1], 10), currency: 'USD' };
  }

  return null;
}

function matchProducts(text: string): Product[] {
  const lowerText = text.toLowerCase();
  const matched: Product[] = [];

  for (const [key, keywords] of Object.entries(productKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        const found = products.filter(
          (p) => p.id.includes(key) || p.nameEn.toLowerCase().includes(key)
        );
        matched.push(...found);
        break;
      }
    }
  }

  if (matched.length === 0) {
    const searchResults = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerText) ||
        p.nameEn.toLowerCase().includes(lowerText) ||
        p.tags.some((t) => lowerText.includes(t.toLowerCase()))
    );
    matched.push(...searchResults);
  }

  return [...new Map(matched.map((p) => [p.id, p])).values()];
}

function matchCategory(text: string): string | null {
  const lowerText = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return cat;
      }
    }
  }
  return null;
}

export function parseIntent(input: string): ParsedIntent {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      action: 'unknown',
      matchedProducts: [],
      confidence: 0,
      responseText: '请告诉我您想要什么，比如"给我买一张 100 美元的 Amazon 礼品卡"或"帮我充值话费"。',
    };
  }

  const amountInfo = extractAmount(trimmed);
  const matchedProducts = matchProducts(trimmed);
  const matchedCategory = matchCategory(trimmed);

  const isBuyIntent =
    /买|购买|下单|get|buy|purchase|帮我|我要|想要|需要/i.test(trimmed);
  const isSearchIntent =
    /搜索|查找|找|search|find|看看|有什么/i.test(trimmed);
  const isTopupIntent =
    /充值|充话费|top.?up|recharge/i.test(trimmed);
  const isBrowseIntent =
    /浏览|看看|推荐|browse|show|display/i.test(trimmed);

  let action: ParsedIntent['action'] = 'unknown';
  let confidence = 0;
  let responseText = '';

  if (isBuyIntent || isTopupIntent) {
    action = isTopupIntent ? 'topup' : 'buy';
    confidence = matchedProducts.length > 0 ? 0.9 : 0.5;

    if (matchedProducts.length > 0) {
      const product = matchedProducts[0];
      const priceStr = amountInfo
        ? `${amountInfo.currency} ${amountInfo.amount}`
        : `${product.currency} ${product.price}`;
      responseText = `好的！我为您找到了「${product.name}」，价格 ${priceStr}。${
        amountInfo && amountInfo.amount !== product.price
          ? `注意：您指定的金额 ${amountInfo.currency} ${amountInfo.amount} 与标准面值 ${product.currency} ${product.price} 不同，将以实际面值为准。`
          : ''
      }是否立即加入购物车？`;
    } else {
      responseText = '抱歉，我没有找到匹配的商品。请尝试更具体的描述，比如"Amazon 礼品卡"或"Steam 充值卡"。';
    }
  } else if (isSearchIntent) {
    action = 'search';
    confidence = matchedProducts.length > 0 ? 0.85 : 0.3;

    if (matchedProducts.length > 0) {
      responseText = `为您找到 ${matchedProducts.length} 个相关商品：${matchedProducts
        .slice(0, 3)
        .map((p) => `「${p.name}」(${p.currency} ${p.price})`)
        .join('、')}${matchedProducts.length > 3 ? ` 等 ${matchedProducts.length} 个` : ''}。点击查看详情或直接下单。`;
    } else {
      responseText = '没有找到相关商品。您可以浏览分类或尝试其他关键词。';
    }
  } else if (isBrowseIntent || matchedCategory) {
    action = 'browse';
    confidence = 0.7;

    const categoryProducts = matchedCategory
      ? products.filter((p) => p.category === matchedCategory)
      : matchedProducts;

    if (categoryProducts.length > 0) {
      const catName = matchedCategory
        ? Object.values({
            'gift-cards': '礼品卡',
            'mobile-topup': '话费充值',
            gaming: '游戏',
            entertainment: '娱乐',
            shopping: '购物',
            food: '美食',
          }).find((_, i) => Object.keys(categoryKeywords)[i] === matchedCategory) || '商品'
        : '推荐';
      responseText = `为您推荐${catName}类商品：${categoryProducts
        .slice(0, 3)
        .map((p) => `「${p.name}」`)
        .join('、')}等。点击任意商品查看详情。`;
    }
  } else if (matchedProducts.length > 0) {
    action = 'search';
    confidence = 0.6;
    responseText = `我猜您可能在找：${matchedProducts
      .slice(0, 3)
      .map((p) => `「${p.name}」(${p.currency} ${p.price})`)
      .join('、')}。需要我帮您下单吗？`;
  } else {
    action = 'unknown';
    confidence = 0.1;
    responseText =
      '我暂时没有理解您的意思。您可以试试：\n• "给我买一张 100 美元的 Amazon 礼品卡"\n• "帮我充值 30 美元 AT&T 话费"\n• "有什么游戏礼品卡推荐"';
  }

  return {
    action,
    amount: amountInfo?.amount,
    currency: amountInfo?.currency,
    category: matchedCategory || undefined,
    matchedProducts,
    confidence,
    responseText,
  };
}
