<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            添加店铺
          </p>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
            <FormItem label="店铺类型" prop="pid">
              <Select v-model="formValidate.pid" placeholder="选择平台">
                  <Option v-for="(item,index) in platform" :key="index" :value="item.id">
                    {{item.platform_name}}</Option>
                  <!-- <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option> -->
              </Select>
            </FormItem>
            <FormItem label="店铺首页网址(URL)" prop="shop_homeurl">
                <Input v-model="formValidate.shop_homeurl" ></Input>
            </FormItem>
            <FormItem label="店铺名称" prop="shop_name">
                <Input v-model="formValidate.shop_name" ></Input>
            </FormItem>
            <FormItem label="店铺主旺旺ID" prop="master_wang">
                <Input v-model="formValidate.master_wang" ></Input>
            </FormItem>

            <FormItem label="发件人姓名" prop="send_name">
                <Input v-model="formValidate.send_name" ></Input>
            </FormItem>
            <FormItem label="发件人电话" prop="send_phone">
                <Input v-model="formValidate.send_phone" ></Input>
            </FormItem>
            <FormItem label="发件地区" prop="send_area">
              <!-- <al-cascader level="3"/> -->
                <Select v-model="formValidate.send_province" @on-change="selectCity" placeholder="请选择" style="width:150px;">
                  <Option v-for="(item,index) in province" :key="index" :value="item.Code">{{item.Name}}</Option>

                </Select>
                 <Select v-model="formValidate.send_city" @on-change="selectArea" placeholder="请选择" style="width:150px;">
                  <Option v-for="(item,index) in city" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
                 <Select v-model="formValidate.send_area" placeholder="请选择" style="width:150px;">
                  <Option v-for="(item,index) in area" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="发件详细地址" prop="send_address">
              <Input v-model="formValidate.send_address" ></Input>
            </FormItem>
            <!-- <FormItem label="验证码" prop="mail">
              <Input v-model="formValidate.mail" ></Input>
            </FormItem>
            <FormItem label="商品网址(URL)" prop="mail">
              <Input v-model="formValidate.mail" ></Input>
            </FormItem> -->
            <!-- <FormItem label="Desc" prop="desc">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem> -->
          </Form>
          <Button class="margin-top-10" @click="addShop('formValidate')" type="primary" icon="plus" :disabled="btnstatus">确定添加</Button>
        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
import { addressSearch, bindShop, platform } from '@/server/api';

export default {
  name: 'bindshop',
  data() {
    return {
      btnstatus: false,
      province: [],
      city: [],
      area: [],
      platform: [],
      formValidate: {
        pid: '',
        shop_homeurl: '',
        shop_name: '',
        master_wang: '',
        send_name: '',
        send_phone: '',
        send_address: '',
        send_province: '',
        send_city: '',
        send_area: '',
      },
      ruleValidate: {
        pid: [
          { required: true, type: 'number', message: '平台必须选择', trigger: 'change' },
        ],
        shop_homeurl: [
          { required: true, message: '链接不能为空', trigger: 'blur' },
        ],
        shop_name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        send_address: [
          { required: true, message: '地址不能为空', trigger: 'blur' },
        ],
        send_phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
        ],
        send_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        master_wang: [
          { required: true, message: '旺旺不能为空', trigger: 'blur' },
        ],
        send_area: [
          { required: true, message: '地区必须填写', trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    this.getAddress();
    this.getPlatform();
  },
  methods: {
    addShop(name) {
      this.btnstatus = true;
      console.log(this.formValidate);
      this.$refs[name].validate(valid => {
        if (valid) {
          const data = this.formValidate;
          bindShop(data).then(res => {
            this.btnstatus = false;
            if (res.code === 0) {
              this.$Message.success('提交成功');
              this.$router.push({ name: 'shop_setting' });
            } else {
              this.$Message.error('提交失败!');
            }
          });
        }
      });
    },
    getPlatform() {
      platform().then(res => {
        if (res.code === 0) {
          this.platform = res.data;
        }
      });
    },
    getAddress() {
      addressSearch().then(res => {
        if (res.code === 0) {
          this.province = res.data;
        }
      });
    },
    selectCity(code) {
      const data = {
        parentId: code,
      };
      addressSearch(data).then(res => {
        if (res.code === 0) {
          this.city = res.data;
          this.formValidate.send_city = '';
          this.formValidate.send_area = '';
        }
      });
    },
    selectArea(code) {
      const data = {
        parentId: code,
      };
      addressSearch(data).then(res => {
        if (res.code === 0) {
          this.area = res.data;
          this.formValidate.send_area = '';
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
