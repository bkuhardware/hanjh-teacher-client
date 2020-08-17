/* eslint-disable */
import { apiPost } from '@/utils/request';

export async function uploadAvatar(formData) {
	return apiPost(`${CLOUD_API_URL}/upload/avatar`, {
		body: formData
	});
}

export async function uploadCourseAvatar(courseId, formData) {
	return apiPost(`${CLOUD_API_URL}/upload/course/${courseId}/avatar`, {
		body: formData
	});
}

export async function uploadCourseLectureResource(courseId, lectureId, formData) {
	return apiPost(`${CLOUD_API_URL}/upload/course/${courseId}/${lectureId}/resources`, {
		body: formData
	});
}

export async function uploadCourseLectureVideoVtt(courseId, lectureId, formData) {
	return apiPost(`${CLOUD_API_URL}/upload/course/${courseId}/${lectureId}/captions`, {
		body: formData
	});
}