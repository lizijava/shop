<template> <!--template标签不被渲染-->
<el-container class="home-container">   <!--它是一整套的-->
<!--头部区域-->
<el-header>
    <div>
    <!--logo-->
    <img src="../assets/heima.png" alt="">
    <!--标题-->
    <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
</el-header>
<!--页面主体-->
<el-container>
<!--侧边栏-->
<el-aside width="collapse ? 64px : 200px" >
    <!--侧边栏伸缩按钮-->
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!--侧边菜单   -->
    <el-menu
    :default-active="activePath"
    :router="true"
    :unique-opened="true"
    :collapse="isCollapse"
    :collapse-transition="false"
    background-color="#1aad19"
    text-color="#fff"
    active-color="#495150">
    <!--一级菜单-->
    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
     <!--一级菜单模板-->
     <template slot="title">   <!--具名插槽 与子组件的<solt name="title">匹配-->
          <i :class="iconsObj[item.id]"></i>
    <span>{{item.authName}}</span>
     </template>
     <!--二级子菜单-->
     <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
         <!--二级子菜单模板-->
         <template solt="title">
             <!--图标-->
             <i class="el-icon-menu"></i>
             <!--文本-->
             <span>{{subItem.authName}}</span>
         </template>
    </el-menu-item>
    </el-submenu >
    </el-menu>
</el-aside>
<!--主体结构-->
<el-main>
    <router-view></router-view>      <!--子级路由-->
</el-main>
</el-container>

</el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单栏数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () { // 生命周期函数加载前
    this.getMenuList()
  },

  methods: {

    // 退出登录
    logout () {
      window.sessionStorage.clear() // 退出登录状态
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus') // 通过接口向服务器获取左侧菜单的数据 async简化promise
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      console.log(res)
    },
    // 点击收缩侧边栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击子菜单传地址  判断激活哪个
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    }

  }
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color:#08d808;
    display: flex;
    justify-content: space-between;
    color:#fff;
    font-size:20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color:#1aad19;
    .el-menu{
        border-right:none;
    }
}
.el-main {
    background-color:#eaedf1;
}
.toggle-button {
    font-size: 10px;
    color:#fff;
    text-align:center;
    line-height:24px;
    letter-spacing:0.2em;   //字的间距
    cursor:pointer;
}
</style>
