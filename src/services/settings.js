/* eslint-disable  */
import { apiGet } from '@/utils/request';

export async function fetchAreasMenu() {
    return apiGet(`${AREA_API_URL}`);
}