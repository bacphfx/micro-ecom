import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./page/home/Home";
import User from "./page/user/User";
import UserForm from "./page/user/UserForm";
import { MessageProvider } from "./context/MessageContext";
import { KeywordProvider } from "./context/KeywordContext";
function App() {
  return (
    <div className="App">
      <MessageProvider>
        <KeywordProvider>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/users" element={<User />}></Route>
            <Route path="/users/save" element={<UserForm />}></Route>
          </Routes>
        </KeywordProvider>
      </MessageProvider>
    </div>
  );
}

export default App;
