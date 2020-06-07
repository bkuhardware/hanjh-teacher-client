/* eslint-disable  */
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/request';

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

export async function fetchSyllabus(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/syllabus`);
}

export async function addChapter(courseId, title, description) {
    return apiPost(`${COURSE_API_URL}/${courseId}/chapters`, {
        body: {
            title,
            description
        }
    });
}

export async function updateChapter(courseId, chapterId, title, description) {
    return apiPut(`${COURSE_API_URL}/${courseId}/chapters/${chapterId}`, {
        body: {
            title,
            description
        }
    })
}

export async function deleteChapter(courseId, chapterId) {
    return apiDelete(`${COURSE_API_URL}/${courseId}/chapters/${chapterId}`);
}