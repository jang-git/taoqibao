<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="4096"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        type="drag"
        action="//upload-z2.qiniu.com/"
        :data="{token: qiniuToken}"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
        <img :src="picDomain + imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { uploadToken } from '@/server/api';


export default {
  name: 'uploadiview',
  data() {
    return {
      imgName: '',
      visible: false,
      uploadList: [],
      qiniuToken: '',
      picDomain: '',
    };
  },
  props: ['defaultList', 'groupIndex', 'numMax'],
  mounted() {
    this.getQiniu();
    this.uploadList = this.$refs.upload.fileList;
  },
  watch: {
    // defaultList() {
    //   console.log(this.defaultList);
    //   // this.uploadList = this.$refs.upload.fileList;
    // },
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      // console.log(this.uploadList);
      // console.log(this.$refs.upload.fileList);
      this.$emit('updatePics', { key: this.groupIndex, data: this.$refs.upload.fileList });
    },
    handleSuccess(res, file) {
      const a = file;
      a.url = this.picDomain + res.key;
      a.name = res.key;
      this.$emit('updatePics', { key: this.groupIndex, data: this.$refs.upload.fileList });
    },
    handleFormatError() {
      this.$Notice.warning({
        title: '格式要求',
        desc: '请上传JPG或者PNG图片',
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '最大限制',
        desc: `文件 ${file.name} 太大，不能超过4M.`,
      });
    },
    handleBeforeUpload() {
      let numLimit = 3;
      if (this.numMax && this.numMax === 1) {
        numLimit = 1;
      }
      const check = this.uploadList.length < numLimit;
      if (!check) {
        this.$Notice.warning({
          title: '请删除图片再重新上传',
        });
      }
      return check;
    },
    getQiniu() {
      uploadToken().then(res => {
        this.qiniuToken = res.data.token;
        this.picDomain = res.data.domain;
      });
    },
  },
};
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
      width: 100%;
      height: 100%;
  }
  .demo-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
      display: block;
  }
  .demo-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
  }
</style>
