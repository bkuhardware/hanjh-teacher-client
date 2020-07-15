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

export async function addLecture(courseId, chapterId, type, title) {
    return apiPost(`${COURSE_API_URL}/${courseId}/chapters/${chapterId}/lectures`, {
        body: {
            type,
            title
        }
    });
}

export async function updateLecture(courseId, chapterId, lectureId, type, title) {
    return apiPut(`${COURSE_API_URL}/${courseId}/chapters/${chapterId}/lectures/${lectureId}`, {
        body: {
            title,
            type
        }
    });
}

export async function deleteLecture(courseId, chapterId, lectureId) {
    return apiDelete(`${COURSE_API_URL}/${courseId}/chapters/${chapterId}/lectures/${lectureId}`);
}

export async function fetchChaptersDetail(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/chapters/detail`);
}

export async function fetchLanding(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/landing`);
}

export async function updateBasicInfo(courseId, params) {
    return apiPut(`${COURSE_API_URL}/${courseId}/landing`, {
        body: params
    });
}

export async function updateAvatar(courseId, avatarUrl) {
    return apiPut(`${COURSE_API_URL}/${courseId}/avatar`, {
        body: {
            url: avatarUrl
        }
    });
}

export async function fetchPrice(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/price`);
}

export async function updatePrice(courseId, value) {
    return apiPut(`${COURSE_API_URL}/${courseId}/price`, {
        body: {
            price: value
        }
    });
}

export async function fetchMessages(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/messages`);
}

export async function updateMessages(courseId, welcome, congratulation) {
    return apiPut(`${COURSE_API_URL}/${courseId}/messages`, {
        body: {
            welcome,
            congratulation
        }
    });
}

export async function validate(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/validate`);
}

export async function fetchPermission(courseId, type) {
    return apiGet(`${COURSE_API_URL}/${courseId}/permission?type=${type}`)
}

export async function updatePrivacy(courseId, params) {
    return apiPut(`${COURSE_API_URL}/${courseId}/privacy`, {
        body: params
    });
}

export async function invite(courseId, email) {
    return apiPost(`${COURSE_API_URL}/${courseId}/invite`, {
        body: {
            email
        }
    });
}

export async function fetchMembers(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/members`);
}

export async function deleteMember(courseId, memberId) {
    return apiDelete(`${COURSE_API_URL}/${courseId}/members/${memberId}`);
}

export async function updateMembers(courseId, params) {
    return apiPut(`${COURSE_API_URL}/${courseId}/members`, {
        body: params
    });
}

export async function fetchPublicReviews(courseId, page = 1, limit = 8) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews/public?page=${page}&limit=${limit}`);
}

export async function voteReview(courseId, reviewId, value) {
    return apiPut(`${COURSE_API_URL}/${courseId}/reviews/${reviewId}/vote`, {
        body: {
            value
        }
    })
}