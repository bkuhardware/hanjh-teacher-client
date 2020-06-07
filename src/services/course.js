/* eslint-disable  */
import { apiGet, apiPost, apiPut } from '@/utils/request';

export async function fetch(sort, page = 1, limit = 8) {
    return apiGet(`${COURSE_API_URL}/my/teacher?page=${page}&limit=${limit}&sort=${sort}`);
}

export async function create(title, area) {
    return apiPost(`${COURSE_API_URL}`, {
        body: {
            title,
            area
        }
    });
}

export async function fetchInfo(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/info`);
}

export async function fetchGoals(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/goals`);
}

export async function updateWhatLearns(courseId, change) {
    return apiPut(`${COURSE_API_URL}/update/${courseId}/what-learns`, {
        body: {
            add: change.add,
            delete: change.delete,
            update: change.update
        }
    });
}

export async function updateRequirements(courseId, change) {
    return apiPut(`${COURSE_API_URL}/update/${courseId}/requirements`, {
        body: {
            add: change.add,
            delete: change.delete,
            update: change.update
        }
    });
}

export async function updateTargetStudents(courseId, change) {
    return apiPut(`${COURSE_API_URL}/update/${courseId}/target-students`, {
        body: {
            add: change.add,
            delete: change.delete,
            update: change.update
        }
    });
}