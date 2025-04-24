// src/constants/toast.js
export const TOAST_POSITIONS = {
  // 水平 + 垂直组合
  "start-top": "toast-start toast-top",
  "start-middle": "toast-start toast-middle",
  "start-bottom": "toast-start toast-bottom",
  "center-top": "toast-center toast-top",
  "center-middle": "toast-center toast-middle",
  "center-bottom": "toast-center toast-bottom",
  "end-top": "toast-end toast-top",
  "end-middle": "toast-end toast-middle",
  "end-bottom": "toast-end toast-bottom", // 默认值

  // 简写形式
  top: "toast-end toast-top",
  middle: "toast-center toast-middle",
  bottom: "toast-end toast-bottom",
  left: "toast-start toast-middle",
  center: "toast-center toast-middle",
  right: "toast-end toast-middle",
};

export const DEFAULT_POSITION = "end-bottom";

export const TOAST_ICONS = {
  info: "ri-information-line",
  success: "ri-checkbox-circle-line",
  error: "ri-close-circle-line",
  warning: "ri-alert-line",
  loading: "ri-loader-4-line animate-spin",
};

export const TOAST_CLASSES = {
  info: "alert-info",
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
};
