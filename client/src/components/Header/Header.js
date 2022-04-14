import React from "react";
import { FaSearch, FaLaughBeam, FaShoppingCart } from "react-icons/fa";

const Header = () => {
	return (
		<>
			<nav className="main-nav">
				<div className="logo">
					<h2>
						<span>WEC</span>ommerce
					</h2>
				</div>
				<div className="menu-link">
					<ul>
						<li>
							<a href="/home">Home</a>
						</li>
						<li>
							<a href="/products">Products</a>
						</li>
						<li>
							<a href="/Contact">Contact</a>
						</li>
						<li>
							<a href="/about">About</a>
						</li>
					</ul>
				</div>
				<div className="menu-icons">
					<ul className="menu-icon-ul">
						<li>
							<a href="/search">
								<FaSearch />
							</a>
						</li>
						<li>
							<a href="/me">
								<FaLaughBeam />
							</a>
						</li>
						<li>
							<a href="/cart">
								<FaShoppingCart />
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
};

export default Header;
