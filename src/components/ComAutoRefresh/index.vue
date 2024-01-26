<template>
  <div class="com_auto_refresh">
    <el-select
      v-model="refreshInterval"
      placeholder="选择刷新间隔"
      @change="resetTimer"
      size="mini"
      style="width:80px; margin-right:10px"
    >
      <el-option v-for="interval in intervals" :key="interval" :value="interval" :label="interval + '秒'"></el-option>
    </el-select>
    <el-switch v-model="isAutoRefresh"  @change="resetTimer" />
    <div :class="{ active:isAutoRefresh }" class="auto">
      <span class="span1">自动刷新</span><span class="span2">[{{ num }}]</span>
    </div>
  </div>
</template>

<script>
const NUM = 3
export default {
  data() {
    return {
      refreshInterval: NUM,
      isAutoRefresh: false,
      num: NUM,
      intervals: [1,NUM,5,10, 30, 50],
      timer: null,
      isMouseMoving: false
    };
  },
  mounted() {
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeDestroy() {
    this.clearTimer();
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
  watch: {
    isAutoRefresh(newValue) {
      if (!newValue && this.timer) { // 当开关关闭时停止计数
        this.clearTimer();
      } else if (newValue && !this.timer) {
        this.startTimer();
      }
    }
  },
  methods: {
    handleMouseMove() {
      this.isMouseMoving = true;
      clearTimeout(this.mouseMoveTimer);
      this.mouseMoveTimer = setTimeout(() => {
        this.isMouseMoving = false;
      }, 2000); // 设置鼠标静止2秒后，将 isMouseMoving 设置为false，认为鼠标已停止移动
    },
    startTimer() {
      this.$message.success("自动刷新开启，当有鼠标移动时,自动刷新会暂停")
      if (this.timer) return; // 如果计时器已经存在，则不重新启动
      this.num = this.refreshInterval;
      this.timer = setInterval(() => {
        if (!this.isMouseMoving) {
          this.num--;
          if (this.num === 0) {
            this.refresh_func();
            this.num = this.refreshInterval; // 重置倒计时
          }
        }
      }, 1000);
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resetTimer() {
      if (this.isAutoRefresh) {
        this.clearTimer();
        this.startTimer();
      }
    },
    refresh_func() {
      this.$emit("done")
    }
  }
};
</script>
<style lang="scss" scoped>
//@import '@/assets/scss/var.scss';
.com_auto_refresh{
  display: flex; white-space: nowrap;
  align-items: center;  margin-right: 10px;

  .auto{
    margin-left: 5px;
    .span1{color: #aaa;}
    .span2{display: none;color: #e15ea8;}
    &.active{
      .span1{color: #e5a761;}
      .span2{display: inline;}
    }
  }
}
</style>
