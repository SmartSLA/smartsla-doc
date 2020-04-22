module.exports = {
  base: "/",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "GitHub", link: "https://github.com/SmartSLA" }
    ],
    sidebar: "auto",
    locales: {
      '/': {
        label: 'English'
      },
      '/fr/': {
        label: 'Français',
        selectText: 'langues',
        nav: [
          { text: "Acceuil", link: "/fr/" },
          { text: "Guide", link: "/fr/guide/" },
          { text: "GitHub", link: "https://github.com/SmartSLA" }
        ]
      }
    },
    logo: '/assets/img/SmartSLA-logo.png'
  },
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      lang: "en-US",
      description: "Dedicated to manage customer support tickets"
    },
    '/fr/': {
      lang: 'fr-FR',
      description: 'Dédié à la gestion des tickets de support client'
    }
  },
  head: [
    [
      'link', { rel: 'icon', href: '/favicon.ico' }
    ]
  ],
};
