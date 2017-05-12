import React from 'react';
import { render } from 'react-dom';

import GoogleMapReact from 'google-map-react';

//import Weather from 'weather.js';
import Request from 'superagent';

//import css
require('../scss/style.scss');


class Empty extends React.Component {
   render() {
      	return (
      		<div>
				<section id="emptySec" className="empty">
					<p>Please Enter the Location or Click on Marker</p>
				</section>
			</div>
      	)
    }
}


class Weather extends React.Component {
   componentWillMount() {
      //console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      //console.log('Component DID MOUNT!');
   }
   componentWillReceiveProps(newProps) {    
      //console.log('Component WILL RECIEVE PROPS!')
   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   componentWillUpdate(nextProps, nextState) {
      //console.log('Component WILL UPDATE!');
   }
   componentDidUpdate(prevProps, prevState) {
      //console.log('Component DID UPDATE!')
   }
   componentWillUnmount() {
      //console.log('Component WILL UNMOUNT!')
   }
   render() {
   		var weather= this.props.weather;
   		var currentWeather= weather.current;
		//console.log(JSON.stringify(weather));

		var forecastWeather= weather.forecast.list;
		//var sunrise= new Date(currentWeather.sys.sunrise).toTimeString();
		//var sunset= new Date(currentWeather.sys.sunset).toTimeString();

		var forecastList= [];
		var i=0;
		for(i; i<forecastWeather.length; i++){
			var org_date= forecastWeather[i].dt_txt;
			var day= org_date.slice(8, 10);
			var month= org_date.slice(5, 7);
			var time= org_date.slice(11, 16);
			forecastList.push(
				<tr key={forecastWeather[i].dt}>
					<td>{day+"/"+month+" "+time}</td>
					<td>{forecastWeather[i].weather[0].main}</td>
					<td>{Math.ceil(forecastWeather[i].main.temp - 273.15)}<span>&#8451;</span></td>
					<td>{forecastWeather[i].wind.speed + " Meter/Sec"}</td>
				</tr>
			)
		}

		var center= {lat: currentWeather.coord.lat, lng: currentWeather.coord.lon};
      	return (
        	<div>
          		<section id="weatherSec" className="weather">
					<div className="wCurrent">
						<p className="wcCity">
							<b>{currentWeather.name+", "+currentWeather.sys.country}</b>
						</p>
						<div className="wcTag">
							<img src={"http://openweathermap.org/img/w/"+currentWeather.weather[0].icon+".png"}/>
							<span className="temp">{Math.ceil(currentWeather.main.temp - 273.15)}</span>
							<span className="unit">&#8451;</span>
						</div>
						<h3 className="wcMain">{currentWeather.weather[0].main}</h3>
						<div className="wcExtra">
							<p className="wceItem">Pressure: <span>{currentWeather.main.pressure + " hPa"}</span></p>
							<p className="wceItem">Humidity: <span>{currentWeather.main.humidity + "%"}</span></p>
							<p className="wceItem">Wind Speed: <span>{currentWeather.wind.speed+" Meter/Sec"}</span></p>
							<p className="wceItem">Wind Direction: <span>{currentWeather.wind.deg+" Degree"}</span></p>
							<p className="wceItem">Cloudiness: <span>{currentWeather.clouds.all+"%"}</span></p>
							{/*
							<p className="wceItem">Sunrise: <span>{sunrise}</span></p>
							<p className="wceItem">Sunset: <span>{sunset}</span></p>
							*/}
						</div>
					</div>
					<div className="wForecast">
						<table>
							<thead>
								<tr>
									<th>DateTime</th>
									<th>Weather</th>
									<th>Temp</th>
									<th>Wind</th>
								</tr>
							</thead>
							<tbody>
								{forecastList}
							</tbody>
						</table>
					</div>
				</section>
				{/*
				<section id="mapSec" className="map">
					
				</section>
				*/}
				<section id="mapSec" className="map">
					<GoogleMapReact bootstrapURLKeys={{key: "AIzaSyBjY3Uq2SUTb82zWgCJkPUQlNf7eE3skwI"}} center={center} defaultZoom={12}>
						<AnyReactComponent lat={center.lat} lng={center.lng} text={''} />
					</GoogleMapReact>
		      	</section>
        	</div>
      );
   }
}

const AnyReactComponent = ({ text }) => (
  <div>
  	<img src="/media/map-marker.png"  style={{ position: 'relative', width: '50px',}}/>
  </div>
);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			currentWeather: undefined,
			forecastWeather: undefined
		}

		this.weatherFunction= this.weatherFunction.bind(this);
		this.handleChangeCity= this.handleChangeCity.bind(this);
		this.handleGetLocation= this.handleGetLocation.bind(this);
		this.showPosition= this.showPosition.bind(this);
	}
	componentDidMount() {
		
	}
	weatherFunction(typeArray) {
		var apikey= "ec10f26c407222857c4f4eda7a6148db";
		var urlCurrent= "http://api.openweathermap.org/data/2.5/weather/?";
		var urlForecast= "http://api.openweathermap.org/data/2.5/forecast/?";
		if(typeArray[0]=="search"){
			urlCurrent= urlCurrent + "q=" + encodeURIComponent(typeArray[1]);// + "&cnt=5";
			urlForecast= urlForecast + "q=" + encodeURIComponent(typeArray[1]);// + "&cnt=1";
		}
		else{
			urlCurrent = urlCurrent+ "lat=" + typeArray[1] + "&lon=" + typeArray[2];// + "&cnt=5";
			urlForecast = urlForecast+ "lat=" + typeArray[1] + "&lon=" + typeArray[2];// + "&cnt=7";
		}

		urlCurrent = urlCurrent + "&APPID=" + apikey;
		urlForecast = urlForecast + "&APPID=" + apikey;

		Request.get(urlCurrent).then((response) => {
			this.setState({currentWeather: JSON.parse(response.text)});
		});
		
		Request.get(urlForecast).then((response) => {
			this.setState({forecastWeather: JSON.parse(response.text)});
		});
	}
	handleChangeCity(event){
		event.preventDefault();
		var city= document.getElementById("cityInput").value;
		if(city!=""){
			var weatherArgs= ["search" , city];
			this.weatherFunction(weatherArgs);
		}
		else{
			document.getElementById("cityInput").autofocus = true;
		}
	}
	handleGetLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(this.showPosition);
		}
		else{
			console.log("not supported");
		}
	}
	showPosition(position){
		var lat= position.coords.latitude;
		var lon= position.coords.longitude;
		//console.log(lat+":::"+lon);
		var weatherArgs= ["geo" , lat , lon];
		this.weatherFunction(weatherArgs);
	}
	render(){
		var initialComponent;
		
		var currentWeather= this.state.currentWeather;
		var forecastWeather= this.state.forecastWeather;
		if(currentWeather==undefined || forecastWeather==undefined){
			initialComponent= <Empty/>;
		}
		else{
			var weather= {"current": currentWeather, "forecast": forecastWeather};
			initialComponent= <Weather weather={weather} />;
		}
		
		return(
			<div className="app">
				<div className="main">
					<header>
						<div className="hLogo">
							<img src="/media/logo.png"/>
						</div>
						<div className="hSearch">
							<form onSubmit={this.handleChangeCity}>
								<input id="cityInput" type="text" placeholder="City Name" autoFocus onChange={this.handleChangeCity}/>
								<button type="submit" onClick={this.handleChangeCity}>
									<img src="/media/search.png"/>
								</button>
							</form>
						</div>
						<div className="hGeo">
							<button onClick={this.handleGetLocation}>
								<img src="/media/location.png"/>
							</button>
						</div>
					</header>
					{initialComponent}
				</div>
				<footer>
					<p>By <a href="http://www.kunjimeena.com">Kunji Meena</a></p>
				</footer>
			</div>
		)
	}
}


render(<App/>, document.getElementById('root'));
