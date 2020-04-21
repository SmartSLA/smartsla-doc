module.exports = {
  base: "/",
  title: "SmartSLA",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guides",
        items: [
          { text: "installation and configuration guide", link: "/guide/" },
          { text: "Docker guide", link: "/docker-guide/" }
        ]
      },
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
          {
            text: "Guides",
            items: [
              { text: "Guide d'installation et configuration", link: "/fr/guide/" },
              { text: "Guide docker", link: "/fr/docker-guide/" }
            ]
          },
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
