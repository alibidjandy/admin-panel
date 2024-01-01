export interface State {
  user: string;
  token: string;
  loading: boolean;
  errorMessage: string | null;
}

export interface Action {
  type: string;
  payload?: {
    email: string;
    token: string;
  };
  error?: string;
}

const user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")!)
  : "";
const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token")!)
  : "";

export const initialState: State = {
  user: user || "",
  token: token || "",
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...state,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload?.email || "",
        token: action.payload?.token || "",
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: "",
        token: "",
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        errorMessage: action.error || null,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
