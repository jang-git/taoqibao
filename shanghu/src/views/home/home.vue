<style lang="less">
@import './home.less';
@import '../../styles/common.less';
</style>
<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col span="8">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            淘宝任务
          </p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {
    // videoPlayer,
  },
  mounted() {
  },
  data() {
    return {
      count: {
        createUser: 30,
        visit: 26,
        collection: 1,
        transfer: 2,
        error: 1,
      },
    };
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {

  },
};
</script>
