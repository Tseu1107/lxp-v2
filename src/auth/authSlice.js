import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
// import { getUserByToken } from "./authCrud";
import { DEFAULT_USER, IS_DEMO } from 'config.js';

export const actionTypes = {
    setAuth: "SET_AUTHENTICATION",
    setPerson: "SET_PERSON_INFO",
    Login: "[Login] Action",
    Logout: "[Logout] Action",
    Register: "[Register] Action",
    UserRequested: "[Request User] Action",
    UserLoaded: "[Load User] Auth API"
};

const initialAuthState = {
    user: undefined,
    authToken: undefined,
    eToken: undefined,
    currentUser: IS_DEMO ? DEFAULT_USER : {},
    isLogin: IS_DEMO,
};

export const reducer = persistReducer(
    { storage, key: "auth", whitelist: ["user", "authToken"] },
    (state = initialAuthState, action) => {
        switch (action.type) {
            case actionTypes.setAuth: {
                return {
                    authToken: action.payload?.token,
                    currentUser: action.payload?.token,
                    eToken: action.payload?.eToken,
                    isLogin: true
                };
            }

            case actionTypes.Login: {
                const { authToken } = action.payload;

                return { authToken, user: undefined };
            }

            case actionTypes.Register: {
                const { authToken } = action.payload;

                return { authToken, user: undefined };
            }

            case actionTypes.Logout: {
                // TODO: Change this code. Actions in reducer aren't allowed.
                return initialAuthState;
            }

            case actionTypes.UserLoaded: {
                const { user } = action.payload;
                return { ...state, user };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
    register: authToken => ({
        type: actionTypes.Register,
        payload: { authToken }
    }),
    logout: () => ({ type: actionTypes.Logout }),
    requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
    fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } })
};

export function* saga() {
    yield takeLatest(actionTypes.Login, function* loginSaga() {
        yield put(actions.requestUser());
    });

    yield takeLatest(actionTypes.Register, function* registerSaga() {
        yield put(actions.requestUser());
    });

    yield takeLatest(actionTypes.UserRequested, function* userRequested() {
        // const { data: user } = yield getUserByToken();

        // yield put(actions.fulfillUser(user));
    });
}
