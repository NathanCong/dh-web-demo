<template>
  <div class="app">
    <section class="global-header">数字人测试</section>
    <section class="app-mainer">
      <div class="app-content">
        <!-- 输入区域 -->
        <div class="app-input">
          <!-- 输入 — 按钮 -->
          <div class="app-start-button">
            <template v-if="!isStart">
              <div :class="{ 'global-button': true, disabled: isLoading }" @click="handleStart"><strong>START</strong>
              </div>
            </template>
            <template v-else>
              <div class="global-button" @click="handleStop"><strong>STOP</strong></div>
            </template>
          </div>
          <!-- 输入 — 文字 -->
          <div class="app-input-text">
            <span>Input Text</span>
            <input type="text" placeholder="请输入想说的话" v-model="inputText">
            <div :class="{ 'global-button': true, disabled: !videoSrcObject }" @click="handleSend"><strong>发送</strong>
            </div>
          </div>
        </div>
        <!-- 输出区域 -->
        <div class="app-output">
          <template v-if="isLoading">
            <div class="app-loading">处理中...</div>
          </template>
          <template v-if="!isLoading && !videoSrcObject">
            <div class="app-no-result">暂无数据</div>
          </template>
          <template v-if="!isLoading && videoSrcObject">
            <audio autoplay :srcObject="audioSrcObject"></audio>
            <video class="app-video" autoplay :srcObject="videoSrcObject" @loadedmetadata="handleVideoLoaded"
              @error="handleVideoError">
            </video>
          </template>
        </div>
      </div>
    </section>
    <section class="global-footer">2025.07.31 version 1.0.0</section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { fetchOffer } from '@/apis';

const isStart = ref(false);
const inputText = ref('');
const pc = ref(null);
const audioSrcObject = ref(null);
const videoSrcObject = ref(null);
const sessionId = ref('');
const isLoading = ref(false);

/**
 * 等待ICE gathering完成
 */
function waitICEGatheringComplete() {
  return new Promise((resolve) => {
    if (pc.value.iceGatheringState === 'complete') {
      resolve();
      return;
    }
    const checkStatus = () => {
      if (pc.value.iceGatheringState === 'complete') {
        pc.value.removeEventListener('icegatheringstatechange', checkStatus);
        resolve();
      }
    };
    pc.value.addEventListener('icegatheringstatechange', checkStatus);
  });
}

function handleError(errMessage) {
  isLoading.value = false;
  isStart.value = false;
  alert(errMessage);
  // 清理资源
  if (pc.value) {
    pc.value.close();
    pc.value = null;
  }
}

/**
 * Start 按钮事件
 */
async function handleStart() {
  if (isLoading.value) {
    return;
  }
  const config = { sdpSemantics: 'unified-plan' };
  if (!window.RTCPeerConnection) {
    alert('当前浏览器不支持 RTCPeerConnection');
    return;
  }
  pc.value = new RTCPeerConnection(config);
  pc.value.addEventListener('track', (e) => {
    const { track: { kind, readyState, enabled } } = e;
    console.log('kind', kind);
    console.log('e.streams[0]', e.streams[0]);
    console.log('检查轨道状态', readyState);
    console.log('检查流是否激活', e.streams[0].active);
    console.log('检查轨道是否启用', enabled);
    switch (kind) {
      case 'audio':
        audioSrcObject.value = e.streams[0];
        break;
      case 'video':
        videoSrcObject.value = e.streams[0];
        break;
      default:
    }
  });
  pc.value.addEventListener('connectionstatechange', () => {
    console.log('连接状态:', pc.value.connectionState);
    if (pc.value.connectionState === 'failed') {
      handleError('连接失败，请检查网络或服务器状态');
    }
  });
  pc.value.addEventListener('iceconnectionstatechange', () => {
    console.log('ICE连接状态:', pc.value.iceConnectionState);
    if (pc.value.iceConnectionState === 'failed') {
      handleError('ICE协商失败，请检查网络配置');
    }
  });
  pc.value.addTransceiver('video', { direction: 'recvonly' });
  pc.value.addTransceiver('audio', { direction: 'recvonly' });
  try {
    isLoading.value = true;
    const offer = await pc.value.createOffer();
    await pc.value.setLocalDescription(offer);
    // wait for ICE gathering to complete
    await waitICEGatheringComplete();
    const { sdp, type } = pc.value.localDescription;
    const answer = await fetchOffer({ sdp, type });
    console.log('answer', answer);
    sessionId.value = answer.sessionId;
    pc.value.setRemoteDescription(answer);
    isStart.value = true;
  } catch (err) {
    console.error(err);
    handleError(err.message);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Stop 按钮事件
 */
function handleStop() {
  isStart.value = false;
  console.log('stop');
}

/**
 * 发送方法
 */
function handleSend() {
  if (!inputText.value) {
    alert('不能发送空内容');
    return;
  }
  console.log(inputText.value);
}

function handleVideoLoaded() {
  console.log('视频元数据已加载，可以播放');
}

function handleVideoError(error) {
  alert('视频播放失败，请检查控制台');
  console.log('视频播放错误：', error);
}
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
  box-sizing: border-box;
}

.app-loading,
.app-no-result {
  font-size: 20px;
  font-weight: bold;
  color: gray;
}

.app-video {
  height: 100%;
  width: 300px;
  background-color: black;
}
</style>