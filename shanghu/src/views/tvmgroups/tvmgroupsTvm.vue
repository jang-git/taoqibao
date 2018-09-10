<template>
  <div>
    <span class="pr" v-for="item in tvms" :key="item.id">{{item.tvmname}}</span>
  </div>
</template>

<script>
import { currentTvmName } from '@/server/api';

export default {
  name: 'tvmgroupsTvm',
  props: ['groupid'],
  data() {
    return {
      tvms: [],
    };
  },
  mounted() {
    const dat = {
      id: this.groupid,
    };
    currentTvmName(dat).then(res => {
      if (res.code === 0) {
        this.tvms = res.data;
      }
    });
  },
};
</script>

<style scoped>
  .pr{
    padding-right: 10px;
  }
</style>
