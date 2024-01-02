import { IShops } from "./actions";

export interface State {
  email: string;
  token: string;
  loading: boolean;
  errorMessage: string | null;
  loadingShops: boolean;
  shops: IShops[];
  shopErrorMessage: string | null;
}

export interface Action {
  type: string;
  payload?: {
    email: string;
    token: string;
    shops: IShops[];
  };
  error?: string;
}

const email = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")!)
  : "";
const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token")!)
  : "";

export const initialState: State = {
  email: email || "",
  token: token || "",
  loading: false,
  errorMessage: null,
  loadingShops: false,
  shops: [
    {
      id: "1",
      items: [{ itemId: "", name: "", price: 0, quantity: 0 }],
      shopName: "",
    },
  ],
  shopErrorMessage: null,
};

export const MainReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...state,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        email: action.payload?.email || "",
        token: action.payload?.token || "",
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        email: "",
        token: "",
        shops: [],
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        errorMessage: action.error || null,
      };
    case "GET_SHOPS_SUCCESS":
      return {
        ...state,
        shops: action.payload?.shops || initialState.shops,
      };
    case "SHOPS_ERROR":
      return {
        ...state,
        loadingShops: false,
        shopErrorMessage: action.error || null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
