import { Dispatch } from "react";
import { toast } from "react-toastify";

const ROOT_URL = "http://localhost:3001";

interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData extends LoginPayload {
  token: string;
  email: string;
}

export interface IShops {
  id: String;
  shopName: String;
  items: {
    itemId: String;
    name: String;
    price: number;
    quantity: number;
  }[];
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
    dispatch({ type: "REQUEST_LOGIN" });

    let response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

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
  } catch (error: any) {
    dispatch({ type: "LOGIN_ERROR", error: error });
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    console.log(error);
  }
}

export async function logout(dispatch: any): Promise<void> {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
}

export async function getAllShops(dispatch: any): Promise<IShops[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  try {
    const response = await fetch(`${ROOT_URL}/shops`, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();

    if (data.message === "Forbidden") {
      logout(dispatch);
    }

    if (data) {
      dispatch({ type: "GET_SHOPS_SUCCESS", payload: { shops: data } });
    }
    return data;
  } catch (error: any) {
    console.error(error);
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return error.message;
  }
}

export async function getShopById(shopId: string): Promise<any | null> {
  try {
    const response = await fetch(`${ROOT_URL}/shops/${shopId}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 404) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return null;
  }
}

export async function createShop(shopData: any): Promise<any | null> {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(shopData),
    };
    const response = await fetch(`${ROOT_URL}/shops`, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return null;
  }
}

export async function updateShop(
  shopId: string,
  updatedShopData: any
): Promise<any | null> {
  try {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedShopData),
    };
    const response = await fetch(`${ROOT_URL}/shops/${shopId}`, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return null;
  }
}

export async function deleteShop(shopId: string): Promise<boolean> {
  try {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const response = await fetch(`${ROOT_URL}/shops/${shopId}`, requestOptions);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 404) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.error(error);
    toast(error.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return false;
  }
}
