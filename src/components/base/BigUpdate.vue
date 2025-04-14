<template>
  <Modal
    :visible="showModal"
    @close="handleModalClose"
    title="我们有个大更新！"
    description="本次更新将会清除以往的阅读数据，请确认以继续。"
    buttonText="确认"
  />
</template>

<script setup>
import Modal from "@/components/ui/feedback/Modal.vue";

import { useStorage } from "@vueuse/core";

import { useCleanStorage } from "@/utils/cleanStorage";

const showModal = useStorage("IS_NOT_UPDATED", true);
const handleModalClose = () => {
  showModal.value = false;
  useCleanStorage();
};
</script>
