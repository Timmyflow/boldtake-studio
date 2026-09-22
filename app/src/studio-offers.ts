import { siteUrl } from './site-config';
export const studioUrl = `${siteUrl}/`;
export const studioTitle = "AI-відеореклама та рекламні ролики — BOLDTAKE";
export const studioDescription =
  "Створюємо рекламні відеоролики для брендів, продуктів і нерухомості за допомогою ШІ. Сценарій, генерація, монтаж і звук. Від 5 000 грн.";
export const videoPackages = [
  {
    name: "Два акценти",
    description: "Два ролики по 10–15 секунд",
    detail: "Два різні початки або рекламні акценти в межах однієї ідеї.",
    price: 8000,
    saving: 2000,
  },
  {
    name: "Запуск",
    description: "Ролик 20–30 секунд + ролик 10–15 секунд",
    detail: "Основний ролик і коротка версія з окремим початком для соцмереж.",
    price: 11000,
    saving: 4000,
  },
  {
    name: "Кампанія",
    description: "Ролик 20–30 секунд + два ролики по 10–15 секунд",
    detail: "Основний ролик і два короткі ролики з різними рекламними акцентами.",
    price: 15000,
    saving: 5000,
  },
  {
    name: "Серія",
    description: "Три ролики по 20–30 секунд",
    detail: "Три повноцінні ролики для одного бренду в межах спільної кампанії.",
    price: 21000,
    saving: 9000,
  },
];
export const formatPrice = (value: number) => new Intl.NumberFormat("uk-UA").format(value);
export const studioSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": studioUrl + "#organization",
      name: "BOLDTAKE",
      url: studioUrl,
      description: "Студія AI-відеореклами в Україні. Рекламні відеоролики для брендів, продуктів і просторів.",
      telephone: "+380679468439",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+380679468439",
        contactType: "customer service",
        availableLanguage: "uk",
        url: "https://t.me/lmaze22",
      },
    },
    {
      "@type": "WebSite",
      "@id": studioUrl + "#website",
      url: studioUrl,
      name: "BOLDTAKE",
      inLanguage: "uk-UA",
      publisher: { "@id": studioUrl + "#organization" },
    },
    {
      "@type": "WebPage",
      "@id": studioUrl + "#webpage",
      url: studioUrl,
      name: studioTitle,
      description: studioDescription,
      inLanguage: "uk-UA",
      isPartOf: { "@id": studioUrl + "#website" },
      about: { "@id": studioUrl + "#organization" },
    },
    {
      "@type": "Service",
      "@id": studioUrl + "#video-production",
      name: "Виробництво рекламних роликів",
      serviceType: "AI-відеореклама, рекламні відеоролики, контент для соцмереж та архітектурні відео",
      provider: { "@id": studioUrl + "#organization" },
      areaServed: { "@type": "Country", name: "Україна" },
      url: studioUrl + "#services",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Ролики та пакети BOLDTAKE",
        itemListElement: [
          ...[
            { name: "Ролик 10–15 секунд", price: 5000 },
            { name: "Ролик 20–30 секунд", price: 10000 },
            ...videoPackages.map((p) => ({
              name: `Пакет «${p.name}»: ${p.description}`,
              price: p.price,
            })),
          ].map((p) => ({
            "@type": "Offer",
            name: p.name,
            url: studioUrl + "#pricing",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: p.price,
              priceCurrency: "UAH",
            },
            itemOffered: { "@type": "Service", name: p.name },
            seller: { "@id": studioUrl + "#organization" },
          })),
        ],
      },
    },
  ],
};
