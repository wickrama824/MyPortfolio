import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-content">

                <h2 className="footer-logo">
                    Kulakshee<span>.</span>
                </h2>

                <p>
                    Passionate about technology, web development
                    and creating meaningful digital experiences.
                    Let's build something amazing together!
                </p>

                <div className="footer-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#skills">Skills</a>
                    <a href="#education">Education</a>
                    <a href="#projects">Projects</a>
                    <a href="#contact">Contact</a>
                </div>

                <div className="footer-socials">

                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                        GitHub ↗
                    </a>

                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                        LinkedIn ↗
                    </a>

                    <a href="mailto:yourname@gmail.com">
                        Email ↗
                    </a>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} Kulakshee.
                    All Rights Reserved.
                </p>

                <p>
                    Designed & Developed with 💜
                </p>

            </div>

        </footer>
    );
}

export default Footer;