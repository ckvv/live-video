<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { IPTVS } from '@/constant/iptvs';

const emit = defineEmits(['confirm']);
const ruleFormRef = ref<FormInstance>();
const modelValue = defineModel();
const videoOptions = IPTVS.map((v: any) => ({ label: v.name, value: v.src }));
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

function onChangeSrc(src: string) {
  options.value.name = (videoOptions.find((v: any) => v.value === src))?.label;
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    title="视频设置"
    class="max-sm:min-w-100vw min-w-400px"
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
          placeholder="你可以输入或选择视频地址"
          @change="onChangeSrc"
        >
          <template #default="{ item }">
            <span class="m-r-1">{{ item.label }}</span>
            <span class="color-gray">
              {{ item.value }}
            </span>
          </template>
        </el-select-v2>
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
