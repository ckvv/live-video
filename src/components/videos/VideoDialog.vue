<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['confirm']);
const dialogVisible = defineModel('dialogVisible');
const defaultVideos = ['//vjs.zencdn.net/v/oceans.mp4', '//d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4'].map(v => ({ label: v, value: v }));
const options = ref<any>({});

function close() {
  dialogVisible.value = false;
}
function confirm() {
  emit('confirm', options.value);
  close();
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="视频设置"
    width="500"
    @open="options.value = {}"
    @close="close"
  >
    <el-form :model="options">
      <el-form-item label="地址">
        <el-select-v2
          v-model="options.src"
          :options="defaultVideos"
          placeholder="请选择或输入视频地址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">
          取消
        </el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
