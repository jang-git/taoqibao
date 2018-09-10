<style lang="less">
@import './login.less';
</style>

<template>
  <div
    class="login"
    @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"/>欢迎登录
        </p>
        <div class="form-con">
          <Form
            ref="loginForm"
            :model="form"
            :rules="rules">
            <FormItem prop="userName">
              <Input
                v-model="form.userName"
                placeholder="请输入用户名"
              >
              <span slot="prepend">
                <Icon
                  :size="16"
                  type="person"/>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
              >
              <span slot="prepend">
                <Icon
                  :size="14"
                  type="locked"/>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button
                long
                type="primary"
                @click="handleSubmit"
              >登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { login } from '@/server/api';
// import { leimu } from './tbtask/data';

export default {
  data() {
    return {
      form: {
        userName: '',
        password: '',
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {

  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const data = {
            accno: this.form.userName,
            password: this.form.password,
          };
          this.$router.push({
            name: 'home_index',
          });
          login(data).then(res => {
            if (res.code === 0) {
              Cookies.set('token', res.data.token);
              Cookies.set('uname', res.data.userInfo.accno);
              this.$router.push({
                name: 'home_index',
              });
            } else {
              this.$Message.error(res.msg);
            }
          });

          // Cookies.set('password', this.form.password);
        }
      });
    },
  },
};
</script>

<style>
</style>
