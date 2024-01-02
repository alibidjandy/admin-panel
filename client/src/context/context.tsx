import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { initialState, MainReducer, State, Action } from "./reducer";

interface AuthStateContextProps {
  children: ReactNode;
}

type AuthStateContextType = State | undefined;
export type AuthDispatchContextType = React.Dispatch<Action> | undefined;

const AuthStateContext = createContext<AuthStateContextType>(undefined);
const AuthDispatchContext = createContext<AuthDispatchContextType>(undefined);

export function useState(): AuthStateContextType {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
}

export function useDispatch(): AuthDispatchContextType {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useDispatch must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<AuthStateContextProps> = ({ children }) => {
  const [user, dispatch] = useReducer(MainReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
