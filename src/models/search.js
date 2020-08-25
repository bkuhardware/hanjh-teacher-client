import * as topicServices from '@/services/topic';

export default {
	namespace: 'search',
	state: {
		topics: []
	},
	effects: {
		*searchTopics({ payload: keyword }, { call, put }) {
			const response = yield call(topicServices.searchTopics, keyword);
			if (response) {
				yield put({
					type: 'saveTopicsSearchResult',
					payload: response.data.topics
				});
			}
		}
	},
	reducers: {
		saveTopicsSearchResult(state, { payload }) {
			return {
				...state,
				topics: payload
			};
		},
		resetSearchTopics(state) {
			return {
				...state,
				topics: []
			};
		}
	}
}