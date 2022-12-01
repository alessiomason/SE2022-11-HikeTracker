import React, { useState, useEffect } from 'react';
import API from './../API.js';
import MyHikesFilters from './HikesFilters';
import HikesCards from './HikeCards';

function MyHikesSection(props) {

	// filters
	const hikesDifficultiesList = [
		{
			difficulty: 'Tourist',
			level: 1,
			isChecked: true
		},
		{
			difficulty: 'Hiker',
			level: 2,
			isChecked: true
		},
		{
			difficulty: 'Professional hiker',
			level: 3,
			isChecked: true
		}
	];

	const [hikesMinLength, setHikesMinLength] = useState('');
	const [hikesMaxLength, setHikesMaxLength] = useState('');
	const [hikesMinTime, setHikesMinTime] = useState('');
	const [hikesMaxTime, setHikesMaxTime] = useState('');
	const [hikesMinAscent, setHikesMinAscent] = useState('');
	const [hikesMaxAscent, setHikesMaxAscent] = useState('');
	const [hikesDifficulties, setHikesDifficulties] = useState(hikesDifficultiesList);
	const [hikesState, setHikesState] = useState('');
	const [hikesRegion, setHikesRegion] = useState('');
	const [hikesProvince, setHikesProvince] = useState('');
	const [hikesMunicipality, setHikesMunicipality] = useState('');

	const [hikes, setHikes] = useState([]);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		if (dirty) {
			API.getHikes()
				.then((hikes) => setHikes(hikes))
				.catch(err => console.log(err))
			setDirty(false);
		}
	}, [dirty]);

	return (
		<>
			<MyHikesFilters hikes={hikes} hikesMinLength={hikesMinLength} setHikesMinLength={setHikesMinLength} hikesMaxLength={hikesMaxLength} setHikesMaxLength={setHikesMaxLength} hikesMinTime={hikesMinTime} setHikesMinTime={setHikesMinTime} hikesMaxTime={hikesMaxTime} setHikesMaxTime={setHikesMaxTime}
				hikesMinAscent={hikesMinAscent} setHikesMinAscent={setHikesMinAscent} hikesMaxAscent={hikesMaxAscent} setHikesMaxAscent={setHikesMaxAscent} hikesDifficulties={hikesDifficulties} setHikesDifficulties={setHikesDifficulties} hikesDifficultiesList={hikesDifficultiesList}
				hikesState={hikesState} setHikesState={setHikesState} hikesRegion={hikesRegion} setHikesRegion={setHikesRegion} hikesProvince={hikesProvince} setHikesProvince={setHikesProvince} hikesMunicipality={hikesMunicipality} setHikesMunicipality={setHikesMunicipality} />
			<HikesCards user={props.user} hikesMinLength={hikesMinLength} hikesMaxLength={hikesMaxLength} hikesMinTime={hikesMinTime} hikesMaxTime={hikesMaxTime} hikesMinAscent={hikesMinAscent} hikesMaxAscent={hikesMaxAscent} hikesDifficulties={hikesDifficulties}
				hikesState={hikesState} hikesRegion={hikesRegion} hikesProvince={hikesProvince} hikesMunicipality={hikesMunicipality} hikes={hikes} />
		</>
	);
}

export default MyHikesSection;