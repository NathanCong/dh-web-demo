import { post } from '@/utils/request';

/**
 * offer 接口
 */
export function fetchOffer({ sdp, type }) {
  return post('/offer', { sdp, type });
}