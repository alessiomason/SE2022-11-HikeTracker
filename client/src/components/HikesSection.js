import MyHikesFilters from './HikesFilters';
import HikesCards from './HikeCards';

function MyHikesSection(props) {
	return (
		<>
			<MyHikesFilters hikes={props.hikes} hikesMinLength={props.hikesMinLength} setHikesMinLength={props.setHikesMinLength} hikesMaxLength={props.hikesMaxLength} setHikesMaxLength={props.setHikesMaxLength} hikesMinTime={props.hikesMinTime} setHikesMinTime={props.setHikesMinTime} hikesMaxTime={props.hikesMaxTime} setHikesMaxTime={props.setHikesMaxTime}
				hikesMinAscent={props.hikesMinAscent} setHikesMinAscent={props.setHikesMinAscent} hikesMaxAscent={props.hikesMaxAscent} setHikesMaxAscent={props.setHikesMaxAscent} hikesDifficulties={props.hikesDifficulties} setHikesDifficulties={props.setHikesDifficulties} hikesDifficultiesList={props.hikesDifficultiesList}
				hikesState={props.hikesState} setHikesState={props.setHikesState} hikesRegion={props.hikesRegion} setHikesRegion={props.setHikesRegion} hikesProvince={props.hikesProvince} setHikesProvince={props.setHikesProvince} hikesMunicipality={props.hikesMunicipality} setHikesMunicipality={props.setHikesMunicipality} />
			<HikesCards user={props.user} hikesMinLength={props.hikesMinLength} hikesMaxLength={props.hikesMaxLength} hikesMinTime={props.hikesMinTime} hikesMaxTime={props.hikesMaxTime} hikesMinAscent={props.hikesMinAscent} hikesMaxAscent={props.hikesMaxAscent} hikesDifficulties={props.hikesDifficulties}
				hikesState={props.hikesState} hikesRegion={props.hikesRegion} hikesProvince={props.hikesProvince} hikesMunicipality={props.hikesMunicipality}
				hikes={props.hikes} />
		</>
	);
}

export default MyHikesSection;