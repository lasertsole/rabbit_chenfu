import { createRouter, createWebHashHistory } from 'vue-router'
/*一级路由*/
import index from "../views/Index.vue"
import Reservation from "../views/Reservation.vue"
import message from "../views/message.vue"
import Person from "../views/Person.vue"

/*二级路由*/
import newWork from "../views/childrenPages/newWork.vue"
import trends from "../views/childrenPages/trends.vue"
import showcase from "../views/childrenPages/showcase.vue"
import require from "../views/childrenPages/require.vue"
import session from "../views/childrenPages/session.vue"
import announcement from "../views/childrenPages/announcement.vue"
import manager from "../views/childrenPages/manager.vue"

/*由路由守卫初始化引入全局变量token判断是否登录*/
import { storeToRefs } from 'pinia'

/*失败提示*/
import { ElMessage } from 'element-plus';

let Mainstore = null;

const routes = [
    //首页
    {
        path: "/",
        name: "home",
        redirect:'/index',
    },
    {
        path: '/index',
        name: 'index',
        component: index,
        redirect:'/index/newWork',
        children:[
            //新作品
            {
                path: 'newWork',
                name: "newWork",
                component: newWork
            },
            {
                path: "/",
                redirect:'/newWork',
            },
            //动态
            {
                path: 'trends',
                name: "trends",
                component: trends 
            }
        ]
    },

    //约稿
    {
       path: "/Reservation",
       name: "Reservation",
       component: Reservation,
       redirect:'/Reservation/showcase',
       children:[
        //橱窗
        {
            path: 'showcase',
            name: "showcase",
            component: showcase
        },
        //需求贴
        {
            path: 'require',
            name: "require",
            component: require 
        }
      ]
    },

    //消息
    {
        path: "/message",
        name: "message",
        component: message,
        redirect:'/message/session',
        children:[
            //会话
            {
                path: 'session',
                name: "session",
                component: session,
            },
            //公告
            {
                path: 'announcement',
                name: "announcement",
                component: announcement 
            }
        ]
    },

    //我的
    {
        path: "/Person",
        name: "Person",
        component: Person,
        redirect:'/Person/manager',
        children:[
            //管理
            {
                path: 'manager',
                name: "manager",
                component: manager
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


/********************路由守卫********************/
router.initRouterGuard = function(store) {//初始化路由守卫
    Mainstore = store;
}

const powerArr=["session", "announcement"];//只有登录后才能访问的权限页面

router.beforeResolve((to, from, next) => {
    const {token} = storeToRefs(Mainstore);
    if(powerArr.indexOf(to.name)!=-1&&!token.value){//判断用户访问的页面是否在权限页面
        next(false);
        ElMessage.error("该页面需要登录才能访问");
    }
    else{
        next();
    }
})

export default router