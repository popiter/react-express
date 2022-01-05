import React, {useEffect} from 'react';

const Home = () => {
	useEffect(() => {
		document.title = 'Главная страница'
	}, []);

	return (
		<div>
			<h1>Home Page</h1>
		</div>
	);
};

export default Home;
