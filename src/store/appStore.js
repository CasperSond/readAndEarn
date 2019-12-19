export default {
  state: {
    baseUrl: "https://wdee0gs619.execute-api.us-east-1.amazonaws.com/dev/"
  },
  mutations: {},
  actions: {
    async getReadingSessions({ rootState, state }) {
      const endPoint = `${state.baseUrl}api/all-reading-sessions`;

      try {
        const response = await fetch(endPoint, {
          headers: {
            "content-type": "application/json",
            Authorization: rootState.Cognito.token
          }
        });

        const data = await response.json();

        return data;
      } catch (error) {
        return error;
      }
    },
    async reportReadTime({ rootState, state }, item) {
      const endpoint = `${state.baseUrl}api/save-new-reading-period`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            "content-type": "application/json",
            Authorization: rootState.Cognito.token
          },
          method: "post",
          body: JSON.stringify(item)
        });

        const data = await response.json();

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem({ rootState, state }, date) {
      const endpoint = `${state.baseUrl}api/delete/${date}`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            "content-type": "application/json",
            Authorization: rootState.Cognito.token
          },
          method: "delete"
        });

        const data = await response.json();

        return data;
      } catch (error) {
        console.log(error);
      }
    }
  },
  getter: {}
};
