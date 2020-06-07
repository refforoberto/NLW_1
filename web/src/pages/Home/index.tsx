import React from 'react';
import logo from '../../assets/logo.svg';
import './styles.css';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
				<header>
					<img src= { logo } alt="Ecoleta"/>
				</header>

				<main>
					<h1>Seu marketplace de coleta de resíduos.</h1>
					<p>Ajudamos pessoas a encontarem posntos de coleta de forma eficiente</p>
					<Link to="/create-point">
						<span>
							<FiLogIn/>
						</span>
						<strong>Cadastre um ponto de coleta</strong>
					</Link>
				</main>

				
            </div>
        </div>
    );
};

export default Home;