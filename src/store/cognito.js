import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.VUE_APP_USER_POOL_ID,
  ClientId: process.env.VUE_APP_CLIENT_ID
};

const Pool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function getCognitoUser(Username) {
  return new AmazonCognitoIdentity.CognitoUser({
    Username,
    Pool
  });
}

export default {
  state: {
    token: "",
    Username: "",
    password: "",
    currentUser: {},
    userAttr: [],
    sessionValid: false,
    cognitoUser: {}
  },
  mutations: {
    token(state, token) {
      state.token = token;
    },
    username(state, Username) {
      state.Username = Username;
    },
    currentUser(state, user) {
      state.currentUser = user;
    },
    sessionValid(state, session) {
      state.sessionValid = session;
    },
    userAttributes(state, attributes) {
      state.userAttr = attributes;
    },
    setPassword(state, password) {
      state.password = password;
    },
    saveCognitoUser(state, cognitoUser) {
      state.cognitoUser = cognitoUser;
    }
  },
  actions: {
    login(context, user) {
      return new Promise((resolve, reject) => {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
          user
        );

        const cognitoUser = getCognitoUser(user.Username);

        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess(user) {
            resolve(user);
          },
          onFailure(err) {
            reject(err);
          }
        });
      });
    },
    registerUser(
      { commit },

      { Password, Username }
    ) {
      return new Promise((resolve, reject) => {
        Pool.signUp(Username, Password, [], null, (err, result) => {
          if (result) {
            commit("currentUser", result.user.getUsername());
          }
          err ? reject(err) : resolve(result);
        });
      });
    },
    getUserAttributes({ state, commit }) {
      return new Promise((resolve, reject) => {
        state.cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            reject(err);
          } else {
            commit("userAttributes", result);
            resolve(result);
          }
        });
      });
    },
    confirmUserRegistration(context, { Username, confirmationCode }) {
      return new Promise((resolve, reject) => {
        const cognitoUser = getCognitoUser(Username);
        cognitoUser.confirmRegistration(
          confirmationCode,
          true,
          (err, response) => {
            err ? reject(err) : resolve(response);
          }
        );
      });
    },
    initNewPassword({ getters: { cognitoUser } }) {
      return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
          onSuccess() {},

          onFailure(err) {
            reject(err);
          },
          //Optional automatic callback
          inputVerificationCode(data) {
            resolve(data);
          }
        });
      });
    },
    resetPassword(
      { getters: { cognitoUser } },
      { verificationCode, password }
    ) {
      return new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(verificationCode, password, {
          onSuccess() {
            resolve(true);
          },
          onFailure(err) {
            reject(err);
          }
        });
      });
    },
    resendConfirmation({ getters: { cognitoUser } }) {
      return new Promise((resolve, reject) => {
        cognitoUser.resendConfirmationCode((err, result) => {
          err ? reject(err) : resolve(result);
        });
      });
    },
    signout({ getters: { cognitoUser }, commit }) {
      cognitoUser.signOut();

      commit("userAttributes", []);
      commit("token", "");
      commit("sessionValid", false);
    },

    updatePassword({ getters: { cognitoUser } }, { oldPassword, newPassword }) {
      return new Promise((resolve, reject) => {
        cognitoUser.changePassword(oldPassword, newPassword, function(
          err,
          result
        ) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    getSession({ commit }) {
      return new Promise((resolve, reject) => {
        const cognitoUser = Pool.getCurrentUser();

        if (cognitoUser) {
          cognitoUser.getSession((err, session) => {
            const valid = session.isValid();

            if (valid) {
              commit("sessionValid", true);
              commit("saveCognitoUser", cognitoUser);
              commit("token", session.getIdToken().getJwtToken());
              resolve(session);
            } else {
              commit("sessionValid", false);
              reject({ msg: "no valid session", id: "SessionNotValid" });
            }
          });
        } else {
          commit("sessionValid", false);
          reject({ msg: "no session", id: "noSession" });
        }
      });
    }
  },
  getters: {
    cognitoUser({ Username }) {
      return new AmazonCognitoIdentity.CognitoUser({
        Username,
        Pool
      });
    },
    getCurrentUser() {
      return Pool.getCurrentUser();
    },
    getEmail({ userAttr }) {
      const o = userAttr.find(el => el.Name === "email");
      return o ? o.Value : "";
    }
  }
};
