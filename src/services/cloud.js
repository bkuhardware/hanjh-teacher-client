/* eslint-disable */
import { apiPostFormData } from '@/utils/request';

export async function uploadAvatar(formData) {
	return apiPostFormData(`${CLOUD_API_URL}/upload/avatar`, {
		body: formData
	});
}

export async function uploadCourseAvatar(courseId, formData) {
	return apiPostFormData(`${CLOUD_API_URL}/upload/course/${courseId}/avatar`, {
		body: formData
	});
}

export async function uploadCourseLectureResource(courseId, lectureId, formData) {
	return apiPostFormData(`${CLOUD_API_URL}/upload/course/${courseId}/${lectureId}/resources`, {
		body: formData
	});
}