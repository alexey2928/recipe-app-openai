import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
const Footer = () => {
	return (
		<div className="footer">
			<div className="footer-info">
				<div>
					<p>Aliaksei Kalupaila</p>{" "}
				</div>
				<div className="footer-links">
					<a href="https://www.linkedin.com/in/akalupaila/">
						<AiFillLinkedin />
					</a>
					<a href="https://www.github.com/alexey2928">
						<AiFillGithub />
					</a>
				</div>
			</div>
			<div className="footer-p">
				<p>© 2023 All Rights Reserved. </p>
			</div>
		</div>
	);
};
export default Footer;
