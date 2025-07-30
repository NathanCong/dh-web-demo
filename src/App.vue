<template>
  <div class="app">
    <section class="global-header">数字人测试</section>
    <section class="app-mainer">
      <div class="app-content">
        <!-- 输入区域 -->
        <div class="app-input">
          <!-- 输入 — 按钮 -->
          <div class="app-start-button">
            <div class="global-button"><strong>START</strong></div>
          </div>
          <!-- 输入 — 文字 -->
          <div class="app-input-text">
            <span>Input Text</span>
            <input type="text" placeholder="请输入想说的话">
            <div class="global-button"><strong>发送</strong></div>
          </div>
        </div>
        <!-- 输出区域 -->
        <div class="app-output">
          <div class="app-no-result">暂无数据</div>
        </div>
      </div>
    </section>
    <section class="global-footer">2025.07.31 version 1.0.0</section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const msg = ref('hello world');
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-mainer {
  flex: 1;
  position: relative;
}

.app-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.app-input {
  margin: 16px;
  border: 1px solid #ccc;
  padding: 16px;
  display: flex;
  flex-direction: row;
}

.app-start-button {
  display: flex;
  align-items: center;
}

.app-input-text {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 32px;

  span {
    font-size: 24px;
    font-weight: bold;
    margin-right: 16px;
  }

  input {
    height: 100%;
    flex: 1;
    margin-right: 16px;
    box-sizing: border-box;
    padding: 8px;
  }
}

.app-output {
  margin: 16px;
  margin-top: 0;
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-no-result {
  font-size: 20px;
  font-weight: bold;
  color: gray;
}
</style>