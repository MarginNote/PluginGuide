module.exports = {
    title: '插件开发指南(预览版)',
    description: '制作专属与你的个性化插件',
    logo: "/logo.png",
    head: [
        ['link', {
            rel: 'icon',
            href: `/favicon.ico`
        }]
    ],
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
    themeConfig: {
        sidebarDepth: 6,
        sidebar: 'auto',
        nav: [
          { text: '主页', link: '/' },
          { text: '指南', link: '/guide/' },
          { text: '进阶', link: '/advanced/' },
          { text: 'API', link: 'https://github.com/MarginNote/Addon/tree/master/API/' },
          { text: '插件', link: 'https://bbs.marginnote.cn/c/script/Mod/55' },
          
          { text: 'GitHub', link: 'https://github.com/MarginNote' },
        ]
    }
}