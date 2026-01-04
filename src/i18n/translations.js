export const translations = {
    zh: {
        // 通用
        home: '首页',
        guestbook: '留言板',

        // 首页
        greeting: '你好！这里是刘碧坤',
        tagline: '探索技术边界，积攒赛博功德。',

        // 板块标题
        introduction: '个人介绍',
        interests: '兴趣爱好',
        skills: '技术能力',

        // 个人介绍
        introItems: [
            '一名对技术充满热情的探索者',
            '致力于通过技术解决实际问题',
            '乐于学习新知识，挑战未知'
        ],

        // 兴趣爱好
        interestItems: [
            '游戏：死亡搁浅、大镖客、永劫无间、仙剑...',
            '户外：徒步和探索自然、闲逛、骑摩托、游泳...',
            '阅读：历史与科幻',
            '音乐：竹笛、陶笛爱好者，喜欢玩但都不太会'
        ],

        // 技术能力
        skillItems: [
            '自动驾驶相关技术(算法、中间件、基础设施等)',
            '港口机械自动化 (算法、业务等)',
            '现代前端开发 (React, Tailwind)'
        ],

        // 按钮文字
        viewDetails: '查看详情',
        backToHome: '返回主页',

        // 留言板
        guestbookTitle: '留言板',
        guestbookSubtitle: '留下您的足迹，分享您的想法',
        nickname: '昵称',
        message: '留言内容',
        submit: '发布留言',
        submitting: '提交中...',
        allMessages: '所有留言',
        noMessages: '暂无留言，快来抢沙发吧！',

        // 电子木鱼
        cyberTemple: 'Cyber Temple',
        meritCount: '功德数',

        // 页脚
        copyright: '© 2025-12-30 Liu Bikun',
        contact: 'contact:804872510@qq.com',

        // 详情页面
        detailPages: {
            // 技术能力页面
            ability: {
                title: 'ABILITY',
                subtitle: 'Change some things',
                quote: '"技术是改变世界的支点，而每一行代码都是杠杆的一部分。"',
                footer: 'Keep coding, keep learning.',
                nav: '技能树'
            },
            // 个人介绍页面
            intro: {
                title: 'INTRODUCTION',
                subtitle: 'Record life trajectory',
                quote: '"人生是一场漫长的旅程，重要的不是目的地，而是沿途的风景。"',
                footer: 'To be continued...',
                nav: '时间线'
            },
            // 兴趣爱好页面
            interest: {
                title: 'INTEREST',
                subtitle: 'Fall into some things',
                quote: '"我们所热爱的不仅仅是事物本身，更是它们让我们感受到的那个世界。"',
                footer: 'Life needs passions to keep going.',
                nav: '目录'
            }
        },

        // SEO
        seo: {
            title: '碧坤的主页',
            description: '刘碧坤的个人主页 - 自动驾驶技术工程师，港口机械自动化专家，热爱技术探索与创新',
            keywords: '刘碧坤, Liu Bikun, 自动驾驶, 港口自动化, 前端开发, React, 技术博客, 个人主页'
        }
    },

    en: {
        // Common
        home: 'Home',
        guestbook: 'Guestbook',

        // Home page
        greeting: 'Hello! I\'m Liu Bikun',
        tagline: 'Exploring the boundaries of technology, accumulating cyber merit.',

        // Section titles
        introduction: 'About Me',
        interests: 'Interests',
        skills: 'Technical Skills',

        // Introduction
        introItems: [
            'A tech enthusiast passionate about exploration',
            'Committed to solving real-world problems through technology',
            'Eager to learn new knowledge and embrace challenges'
        ],

        // Interests
        interestItems: [
            'Games: Death Stranding, Red Dead Redemption, Naraka, Chinese Paladin...',
            'Outdoors: Hiking, exploring nature, wandering, motorcycling, swimming...',
            'Reading: History and Science Fiction',
            'Music: Bamboo flute and ocarina enthusiast (still learning)'
        ],

        // Skills
        skillItems: [
            'Autonomous Driving (Algorithms, Middleware, Infrastructure)',
            'Port Mechanical Automation (Algorithms, Business Logic)',
            'Modern Frontend Development (React, Tailwind)'
        ],

        // Buttons
        viewDetails: 'View Details',
        backToHome: 'Back to Home',

        // Guestbook
        guestbookTitle: 'Guestbook',
        guestbookSubtitle: 'Leave your footprint, share your thoughts',
        nickname: 'Nickname',
        message: 'Message',
        submit: 'Submit',
        submitting: 'Submitting...',
        allMessages: 'All Messages',
        noMessages: 'No messages yet. Be the first!',

        // Cyber Temple
        cyberTemple: 'Cyber Temple',
        meritCount: 'Merit Count',

        // Footer
        copyright: '© 2025-12-30 Liu Bikun',
        contact: 'Contact: 804872510@qq.com',

        // Detail Pages
        detailPages: {
            // Ability page
            ability: {
                title: 'ABILITY',
                subtitle: 'Change some things',
                quote: '"Technology is the fulcrum to change the world, and every line of code is part of the lever."',
                footer: 'Keep coding, keep learning.',
                nav: 'Skills'
            },
            // Introduction page
            intro: {
                title: 'INTRODUCTION',
                subtitle: 'Record life trajectory',
                quote: '"Life is a long journey. What matters is not the destination, but the scenery along the way."',
                footer: 'To be continued...',
                nav: 'Timeline'
            },
            // Interest page
            interest: {
                title: 'INTEREST',
                subtitle: 'Fall into some things',
                quote: '"What we love is not just the things themselves, but the world they make us feel."',
                footer: 'Life needs passions to keep going.',
                nav: 'Contents'
            }
        },

        // SEO
        seo: {
            title: 'Bikun\'s Homepage',
            description: 'Liu Bikun\'s Personal Homepage - Autonomous Driving Engineer, Port Automation Expert, Technology Explorer and Innovator',
            keywords: 'Liu Bikun, Autonomous Driving, Port Automation, Frontend Development, React, Tech Blog, Personal Homepage'
        }
    }
};

// Hook to use translations
export function useTranslation(language) {
    return translations[language] || translations.zh;
}
