import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//引入router
import router from './router'

//引入pinia持久化存储和临时性存储
import store from './stores'
import { useMainStore }  from "./stores/main.js"

//引入Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus';

//引入axios
import axios from 'axios'

//引入事件总线mitt
import mitt from 'mitt'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);

//将pinia存储的数据全局化
let mainStore = useMainStore();
app.config.globalProperties.Pinia = mainStore;
//事件总线全局化
app.config.globalProperties.Bus = new mitt();
//服务器地址与端口全局化
let ServerPath="http://localhost:8000"//本地服务器地址
//let ServerPath="http://118.140.206.140:50673"//外部服务器地址
app.config.globalProperties.ServerPath = ServerPath;

//axio请求拦截器
axios.interceptors.request.use((config)=>{
	if(mainStore.token){
		config.headers['token'] = mainStore.token
	}
	return config;
});

//axios响应拦截器
axios.interceptors.response.use((res)=>{
	// if(res.data.error){
	// 	ElMessage({
	// 	showClose: true,
	// 	message: '发生错误。',
	// 	type: 'error'
	//   });
	//   return Promise.reject(res.data);
	// }
	return res;
});

router.initRouterGuard(mainStore)//初始化路由守卫

app.mount('#app')
