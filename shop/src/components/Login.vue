<template>
    <div class="login_container">
        <!--登录盒子-->
        <div class="login_box">
            <!--头像-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录表单-->
            <el-form class="login_form" :model="loginForm" ref="LoginFormRef"  :rules="loginFormRules">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="possword" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
          </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置表单按钮
    resetLoginForm () {
      this.$refs.LoginFormRef.resetFields() // 表单重置方法
    },
    // 登录按钮
    login () {
      this.$refs.LoginFormRef.validate(async valid => { // 表单验证方法 参数是fuction callback(boolean, object) boolean验证表单内容是否有误   objct不通过的字段
        if (!valid) return // 不通过
        const { data: res } = await this.$http.post('login', this.loginForm) // 无误后，发送请求进行登录
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败：' + res.meta.msg) // 弹窗  error是$message中的type的方法
        }

        this.$message.success('登录成功')

        window.sessionStorage.setItem('token', res.data.token) // setItem(键，值) 把tonken放在session网站开启期间才生效

        this.$router.push('/home') // 链式编程跳到后台主页
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
    background-color: #2b5b6b;
    height: 100%;

}
.login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

}
.avatar_box {
    height: 130px;
    width: 130px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
}
img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
}

.login_form {
    position:absolute;
    bottom:0;
    width:100%;
    padding: 0 20px;
    box-sizing:border-box;
}
.btns {
    display:flex;
    justify-content:flex-end;
}
</style>
