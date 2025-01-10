import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./page/home/Home";
import User from "./page/user/User";
import UserForm from "./page/user/UserForm";
import { MessageProvider } from "./context/MessageContext";
import { UserEditedProvider } from "./context/UserEditedContext";
import Login from "./page/login/Login";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Unauthorize from "./page/error/Unauthorize";
import NotFount from "./page/error/NotFount";
import Category from "./page/category/Category";
import CategoryForm from "./page/category/CategoryForm";
function App() {
  return (
    <div className="App">
      <MessageProvider>
        <UserEditedProvider>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/unauthorize" element={<Unauthorize />}></Route>
            <Route path="*" element={<NotFount />} />
            <Route element={<ProtectedRoute allowRoles={["ROLE_ADMIN"]} />}>
              <Route path="/users" element={<User />}></Route>
              <Route path="/users/save" element={<UserForm />}></Route>
            </Route>
            <Route
              element={
                <ProtectedRoute allowRoles={["ROLE_ADMIN", "ROLE_EDITOR"]} />
              }
            >
              <Route path="/categories" element={<Category />}></Route>
              <Route path="/categories/save" element={<CategoryForm />}></Route>
            </Route>
            <Route
              element={
                <ProtectedRoute
                  allowRoles={["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_SHIPPER"]}
                />
              }
            >
              <Route path="/" element={<Home />}></Route>
            </Route>
          </Routes>
        </UserEditedProvider>
      </MessageProvider>
    </div>
  );
}

export default App;
