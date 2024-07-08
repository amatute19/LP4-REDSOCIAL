import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user:null,
  isFetching: false,
  error: false,
};

// const INITIAL_STATE = {
//   user: {
//     _id: "6685a80712ca1b7e545a1bc8",
//     username: "jane",
//     email: "jane@gamil.com",
//     ProfilePicture: "person/1.jpeg",
//     coverPicture: "",
//     isAdmin: false,
//     followers: [],
//     followings: [],
//   },
//   isFetching: false,
//   error: false,
// };

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};