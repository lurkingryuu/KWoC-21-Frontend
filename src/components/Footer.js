import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.scss';
import Part from './Part';
export default function Footer() {
	return (
		<section className="footer-btm">
			
			<footer>
				<div className="container">
					<div className="columns is-vcentered">
						<div className="column">
							<h1>Kharagpur Winter of Code</h1>
							<h2>With &#10084; by KOSS</h2>
						</div>
						<div className="column">
							<a href="#tline">Timeline</a>
							<a href="https://www.facebook.com/groups/kwoc2016">Social Groups</a>
						</div>
						<div className="column">
							<Link to="/FAQ">FAQ</Link>
							<Link to="/about">About KOSS</Link>
						</div>
					</div>
				</div>
			</footer>
		</section>
	);
}
