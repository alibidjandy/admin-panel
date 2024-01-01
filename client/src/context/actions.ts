import { Dispatch } from "react";

const ROOT_URL = "http://localhost:3001";

interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData extends LoginPayload {
  token: string;
  email: string;
}

export async function loginUser(
  dispatch: any,
  loginPayload: LoginPayload
): Promise<UserData | void> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginPayload),
  };

  try {
    // debugger;
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
    let data = await response.json();

    if (data) {
      const userData: UserData = data;

      dispatch({ type: "LOGIN_SUCCESS", payload: userData });

      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email: userData.email, password: userData.password })
      );
      localStorage.setItem("token", JSON.stringify(userData.token));
      return userData;
    }

    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    console.log(data.errors[0]);
    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
    console.log(error);
  }
}

export async function logout(dispatch: Dispatch<any>): Promise<void> {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
}
