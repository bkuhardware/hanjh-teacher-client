/* eslint-disable */
import { apiPostFormData } from '@/utils/request';

export async function uploadAvatar(formData) {
	return apiPostFormData(`${CLOUD_API_URL}/upload/avatar`, {
		body: formData
	});
}