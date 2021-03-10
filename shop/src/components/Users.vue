<template>
<div>
    <h3>用户列表组件</h3>
    <!--面包屑导航-->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
</el-breadcrumb>
    <!--卡片组件(主体)-->
    <el-card >
    <!--Layout布局-->
      <el-row :gutter="20">  
          <el-col :span="8">  
            <!--搜索与添加区域-->
              <el-input placeholer="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"> 
                <!--点击图标搜索-->
                  <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
          </el-col>
          <el-col :span="4">
              <!--添加按钮-->
              <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>  <!--primary 主要按钮-->
          </el-col>
          </el-row>
          <!--表格  用户数据展示-->
          <el-table :data="userList" stripe border>
    <el-table-column type="index">
    </el-table-column>
    <el-table-column property="username" label="姓名">
    </el-table-column>
    <el-table-column property="email" label="邮箱">
    </el-table-column>
    <el-table-column property="mobile" label="电话">
    </el-table-column>
    <el-table-column property="role_name" label="角色">
    </el-table-column>

    <el-table-column label="状态">
      <!--状态开关-->
      <template slot-scope="scope">
      <el-switch v-model="scope.row.mg_state" @change="userSateChanged(scope.row)"></el-switch>
      </template>
    </el-table-column>

     <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <!--修改按钮-->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
         <!--删除按钮-->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
        <!--角色分配按钮-->
        <el-tooltip effect="drak" connet="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>     
          </el-tooltip>
        </template>
        </el-table-column>

        </el-table>
      <!--页码-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!--添加用户的对话框-->
<el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed">
  <el-form class="login_form" :model="addForm" ref="addFormRef" :rules="addFormRules">
                <!--用户名-->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item label="密码" prop="password">
                    <el-input type="possword" v-model="addForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!--邮箱-->
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <!--电话-->
                <el-form-item label="电话" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
    </el-form>
    <!-- 对话框底部 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </div>
</el-dialog>

<!--修改用户对话框-->
<el-dialog title="用户修改" :visible.sync="editDialogVisible" @close="editDialogClosed">
  <el-form class="login_form" :model="editForm" ref="editFormRef" :rules="editFormRules">
                <!--用户名-->
                <el-form-item label="用户名" disabled>
                    <el-input v-model="editForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--邮箱-->
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <!--电话-->
                <el-form-item label="电话" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
    </el-form>
    <!-- 对话框底部 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </div>
</el-dialog>

    </div>
</template>
<script>
export default {
    data() {
        //自定义邮箱验证规则
            var checkEmail = ( rule, value, callback ) => {
              const regEmail = /^\w+@\w+(\.\w+)+$/
              if (regEmail.test(value)) {
                return callback()
              }
              //错误提示
              callback(new Error('请输入合法的邮箱'))
            }
            //验证手机号码
            var checkMobile = ( rule, value, callback ) => {
              const regMobile = /^1[34578]\d{9}$/
            if (regMobile.test(value)) {
              return callback()
            }
            //错误提示
            callback(new Error('请输入合法的号码'))
            }
            
        return {
            //获取用户信息的参数
            queryInfo: {
                //查询条件
                query: '',
                //页码
                pagenum: 1,
                //每页显示条数
                pagesize: 2
            },
            //保存接受的用户数据
            userList:[],
            //总条数
            total:0,
            //是否显示添加用户弹窗
            addDialogVisible: false,
            //添加用户的表单数据
            addForm: {
              username: '',
              password: '',
              email: '',
              mobile: ''
            },
            
            //添加表单验证规则
            addFormRules: {
              username:[
               { required: true, message: '请输入邮箱地址', trigger: 'blur' },
               {
                 min: 3,
                 max: 10,
                 message: '用户在3~10个字符之间',
                 trigger: 'blur'
               }
               ],
               password: [
                 { required: true, message: '请输入密码', trigger: 'blur'},
                 {
                   min: 6,
                   max: 15,
                   message: '用户名在6~15个字符之间',
                   trigger: 'blur'
                 }
               ], 
               email: [
                 { required :true, message: '请输入邮箱', trigger: 'blur' },
                 { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
               ],
               mobile: [
                 { required :true, message: '请输入手机号', trigger: 'blur' },
                 { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
               ]
               },
                //是否显示修改用户弹窗
            editDialogVisible: false,
             //修改用户的表单数据
            editForm: {},
             //修改表单验证规则
            editFormRules: {
               email: [
                 { required :true, message: '请输入邮箱', trigger: 'blur' },
                 { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
               ],
               mobile: [
                 { required :true, message: '请输入手机号', trigger: 'blur' },
                 { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
               ]
               }
          }
        },
    created() { //生命周期函数  还未挂载
        this.getUserList()
    },
    methods: {
            //发起数据请求
            async getUserList() {
                const { data: res } = await this.$http.get('users', {
                    params: this.queryInfo
                })
                   if(res.meta.status!==200) {
                    return this.$message.error('获取用户列表失败')
                }
                this.userList = res.data.users
                this.total = res.data.total
            },
            //监听页码变化事件
            handleCurrentChange ( current ) {
              this.queryInfo.pagenum = current; //页码数据变
              this.getUserList();
            },
            //监听页码条数大小变化事件
            handleSizeChange ( newSize ) {
              this.queryInfo.pagesize = newSize;
              this.getUserList()
            },
            //监听状态更改事件
            async userSateChanged ( row ) {
              //发送请求更新状态
               const { data:res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
              //如果返回状态异常则报错
              if (res.meta.status != 200) {
                row.mg_state = !row.mg_state
                return this.$message.error('修改状态失败')
              }
              this.$message.success('更改状态成功')
            },
            //监听添加对话框关闭事件
            addDialogClosed(){
              this.$refs.addFormRef.resetFields()
            },
            //添加新用户
            addUser(){
              this.$refs.addFormRef.validate( async valid => {
                if(!valid) return this.$message.error("请填写完整的用户信息");
                //发送请求完成添加用户操作
                const {data:res} = await this.$http.post('users', this.addForm)
                //判断添加失败
                if (res.meta.status !== 201) {
                  return this.$message.error('添加用户失败')
                }
                //添加成功提示
                this.$message.success('添加用户成功')
                //关闭对话框
                this.addDialogVisible = false
                //重新请求最新的数据
                this.getUserList()
              })
            },
            //修改用户id
            async showEditDialog(id){
              //获取改用户id
              const { data: res } = await this.$http.get('users/'+ id)
              //获取失败
              if ( res.meta.status !== 200 ) {
                return this.$message.error('获取用户信息失败')
                }
                //保存用户信息
                this.editForm = res.data
                //弹出对话框
                this.editDialogVisible = true
              
            },
              //修改对话框关闭之后，重置表达
            editDialogClosed(){
              this.$refs.editFormRef.resetFields()
            },
            //修改用户
            editUserInfo(){
              this.$refs.editFormRef.validate( async valid => {
                if(!valid) return this.$message.error("请填写完整的用户信息");
                //发送请求完成添加用户操作
                const {data:res} = await this.$http.put('users/'+this.editForm.id, this.editForm)
                //判断添加失败
                if (res.meta.status !== 200) {
                  return this.$message.error('更新用户信息失败')
                }
                //修改成功提示
                this.$message.success('更新用户信息成功')
                //关闭对话框
                this.editDialogVisible = false
                //重新请求最新的数据
                this.getUserList()
              })
            },

           //删除用户
          async removeUserById(id){
          const confirmRusult =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmRusult != "confirm") {
          return this.$message.info("已取消删除")
        }
        const {data:res} = await this.$http.delete('users/'+id)
           //删除失败
           if(res.meta.status !== 200){
             return this.$message.error('删除用户失败')
           }
           //删除成功
           this.$message.success('删除用户成功')
           //重新请求数据
           this.getUserList()
          }
    }
}
</script>

<style lang="less" scoped>

</style>