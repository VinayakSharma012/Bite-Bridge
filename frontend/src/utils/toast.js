import { toast } from 'react-toastify';

const baseConfig = {
  autoClose: 3600,
  closeButton: true,
  draggable: true,
};

export const notify = {
  success(message) {
    toast.success(`✅ ${message}`, baseConfig);
  },
  error(message) {
    toast.error(`❌ ${message}`, baseConfig);
  },
  info(message) {
    toast.info(`ℹ️ ${message}`, baseConfig);
  },
  warning(message) {
    toast.warning(`⚠️ ${message}`, baseConfig);
  },
};

export default notify;
