/* eslint-disable */
import { apiPut } from '@/utils/request';

export async function sendToken(token) {
    return apiPut(`${TEACHER_API_URL}/update/token`, {
        body: {
            token
        }
    });
}