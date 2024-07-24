<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { defaultVideos } from '@/constant/videos';

const emit = defineEmits(['confirm']);
const ruleFormRef = ref<FormInstance>();
const modelValue = defineModel();
const videoOptions = defaultVideos.map(v => ({ label: v, value: v }));
const options = ref<any>({});

const rules = {
  src: [
    {
      required: true,
      trigger: 'change',
    },
  ],
};
function close() {
  modelValue.value = false;
}

async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('confirm', options.value);
      close();
    }
  });
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    title="视频设置"
    @open="options.value = {}"
    @close="close"
  >
    <el-form ref="ruleFormRef" :model="options" :rules="rules" label-width="auto">
      <el-form-item label="地址" prop="src">
        <el-select-v2
          v-model="options.src"
          :options="videoOptions"
          allow-create
          filterable
          placeholder="你可以点击选择或输入视频地址"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="options.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="options.password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">
          取消
        </el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
