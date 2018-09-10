<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card>
          <Steps :current="3">
            <Step title="第一步" content="选择任务类型"></Step>
            <Step title="第二步" content="填写任务信息"></Step>
            <Step title="第三步" content="支付"></Step>
            <Step title="第四步" content="发布成功"></Step>
          </Steps>
        </Card>
      </Col>
    </Row>
    3 这里的步骤是完成支付看到的结果
  </div>
</template>

<script>
export default {
  name: 'step3',
};
</script>

<style scoped>

</style>
