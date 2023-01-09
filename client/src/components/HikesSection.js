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
	const [hikesLatitude, setHikesLatitude] = useState(-1);
	const [hikesLongitude, setHikesLongitude] = useState(-1);
	const [hikesRadius, setHikesRadius] = useState(-1);
	const [preferences, setPreferences] = useState();

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


	useEffect(() => {
		if (dirty) {
			API.getUserPreferences(props.user.id)
				.then((preferences) => setPreferences(preferences))
				.catch(err => console.log(err))
			setDirty(false);
		}
	}, [dirty]);
	

	return (
		<>
			<MyHikesFilters user={props.user} hikes={hikes} hikesMinLength={hikesMinLength} setHikesMinLength={setHikesMinLength} hikesMaxLength={hikesMaxLength} setHikesMaxLength={setHikesMaxLength} hikesMinTime={hikesMinTime} setHikesMinTime={setHikesMinTime} hikesMaxTime={hikesMaxTime} setHikesMaxTime={setHikesMaxTime}
				hikesMinAscent={hikesMinAscent} setHikesMinAscent={setHikesMinAscent} hikesMaxAscent={hikesMaxAscent} setHikesMaxAscent={setHikesMaxAscent} hikesDifficulties={hikesDifficulties} setHikesDifficulties={setHikesDifficulties} hikesDifficultiesList={hikesDifficultiesList}
				hikesState={hikesState} setHikesState={setHikesState} hikesRegion={hikesRegion} setHikesRegion={setHikesRegion} hikesProvince={hikesProvince} setHikesProvince={setHikesProvince} hikesMunicipality={hikesMunicipality} setHikesMunicipality={setHikesMunicipality}
				hikesLatitude={hikesLatitude} setHikesLatitude={setHikesLatitude} hikesLongitude={hikesLongitude} setHikesLongitude={setHikesLongitude} hikesRadius={hikesRadius} setHikesRadius={setHikesRadius} preferences={preferences} />
			<HikesCards user={props.user} hikesMinLength={hikesMinLength} hikesMaxLength={hikesMaxLength} hikesMinTime={hikesMinTime} hikesMaxTime={hikesMaxTime} hikesMinAscent={hikesMinAscent} hikesMaxAscent={hikesMaxAscent} hikesDifficulties={hikesDifficulties}
				hikesState={hikesState} hikesRegion={hikesRegion} hikesProvince={hikesProvince} hikesMunicipality={hikesMunicipality} hikes={hikes} hikesLatitude={hikesLatitude} hikesLongitude={hikesLongitude} hikesRadius={hikesRadius} />
		</>
	);
}

export default MyHikesSection;