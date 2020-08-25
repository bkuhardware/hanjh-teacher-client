/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function searchTopics(keyword) {
	return apiGet(`${TOPIC_API_URL}/suggest?keyword=${keyword}`)
}