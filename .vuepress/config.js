module.exports = {
  base: "/smartsla/",
  title: "SmartSLA",
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
    }
  },
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      lang: "en-US",
      description: "OpenPaas Ticketing module"
    },
    '/fr/': {
      lang: 'fr-FR',
      description: 'Module de ticketing OpenPaas'
    }
  }
};
