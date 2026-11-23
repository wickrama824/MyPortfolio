import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SkillsManage from "./pages/SkillsManage";
import ProjectsManage from "./pages/ProjectsManage";
import EducationManage from "./pages/EducationManage";
import MessagesManage from "./pages/MessagesManage";
import ChangePassword from "./pages/ChangePassword";

import "./App.css";

function Portfolio() {
    return (
        <>
            <Navbar />

            <main>
                <Home />
                <About />
                <Skills />
                <Education />
                <Projects />
                <Contact />
            </main>

            <Footer />
        </>
    );
}

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Portfolio */}
                <Route path="/" element={<Portfolio />} />

                {/* Admin Login */}
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route path="/admin" element={<Admin />} />

                    <Route
                        path="/admin/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/admin/skills"
                        element={<SkillsManage />}
                    />

                    <Route
                        path="/admin/projects"
                        element={<ProjectsManage />}
                    />

                    <Route
                        path="/admin/education"
                        element={<EducationManage />}
                    />

                    <Route
                        path="/admin/messages"
                        element={<MessagesManage />}
                    />

                    <Route
                        path="/admin/change-password"
                        element={<ChangePassword />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;