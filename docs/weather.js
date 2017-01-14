var app = angular.module('weatherApp', []);

app.controller('WeatherCtrl', function($scope, $http) {
	
  
  //News Report Function
   $scope.newsReport = function(){
		var myURL = 'https://newsapi.org/v1/sources';
		var newsRequest = {
				method: 'GET',
				url: myURL,
				params: {
						category: 'general',
						sortBy: 'latest',
						country: $scope.country,
						apiKey: '1e062534803e45fca5e92ee554ee7633'
						}
					};

	//Http Request for news report
		$http(newsRequest)
			.then(function(response) {
					$scope.news = response.data;
		//If it is the same cities 
					if($scope.cityName == $scope.secondCityName){
						$scope.newsObjectForFirstCity = [];
						$scope.newsObjectForSecondCity = [];
						$scope.count = 0;
						angular.forEach($scope.news.sources, function(news, key) {
								if(news.description.match(/weather/g)){
									var newsReport = {newsProvider : news.name,description : news.description};
									$scope.newsObjectForFirstCity.push(newsReport);
									$scope.newsObjectForSecondCity = $scope.newsObjectForFirstCity;
									$scope.newsAvailableForFirstCity = true;
									$scope.newsAvailableForSecondCity = true;
									$scope.count++;
								}
							});
							if($scope.count == 0 || $scope.newsObjectForFirstCity == []){
									$scope.newsAvailableForFirstCity = false;
									$scope.newsAvailableForSecondCity = false;
						
									}
					}else
					if($scope.whichCity == "first"){
							$scope.count = 0;
							$scope.newsObjectForFirstCity = [];
							angular.forEach($scope.news.sources, function(news, key) {
								if(news.description.match(/weather/g)){
									var newsReport = {newsProvider : news.name,description : news.description};
									$scope.newsObjectForFirstCity.push(newsReport);
									$scope.newsAvailableForFirstCity = true;
									$scope.count++;
									}
									
							});
							if($scope.count == 0 || $scope.newsObjectForFirstCity == []){
									$scope.newsAvailableForFirstCity = false;
									}
					}
					else{
							$scope.count = 0;
							$scope.newsObjectForSecondCity = [];
							angular.forEach($scope.news.sources, function(news, key) {
								if(news.description.match(/weather/g)){
									var newsReport = {newsProvider : news.name,description : news.description};
									$scope.newsObjectForSecondCity.push(newsReport);
									$scope.newsAvailableForSecondCity = true;
									$scope.count++;
									}
									
							});
							if($scope.count == 0 || $scope.newsObjectForSecondCity == []){
									$scope.newsAvailableForSecondCity = false;
									}
						}
			}).
			catch(function(response) {
			});
		}
		
	//City Weather Function
   $scope.searchForCityWeather= function(cityName) {
		var URL = 'https://api.openweathermap.org/data/2.5/forecast/daily';
		var request = {
				method: 'GET',
				url: URL,
				params: {
						q: cityName,
						mode: 'json',
						units: 'metric',
						cnt: '7',
						appid: '57d2c666f1cb5bf9b61b561573fab933'
						}
				};
		$scope.dataFetched = false;
		$http(request)
			.then(function(response) {
				if($scope.cityName == $scope.secondCityName){
					$scope.dataFetchedForFirstCity = true;
					$scope.dataFetchedForSecondCity = true;
				$scope.weatherFirstCity.data = response.data;
				$scope.country = $scope.weatherFirstCity.data.city.country;
				$scope.weatherSecondCity.data = response.data;
				$scope.country = $scope.weatherFirstCity.data.city.country;
				$scope.newsReport($scope.country);
				$scope.temperatureComparison();
				}else
				if($scope.whichCity == "first"){
					$scope.dataFetchedForFirstCity = true;
				$scope.weatherFirstCity.data = response.data;
				$scope.country = $scope.weatherFirstCity.data.city.country;
				$scope.newsReport($scope.country);
				$scope.temperatureComparison();
				}
				else{
					$scope.dataFetchedForSecondCity = true;
				$scope.weatherSecondCity.data = response.data;
				$scope.country = $scope.weatherSecondCity.data.city.country;
				$scope.newsReport($scope.country);
				$scope.temperatureComparison();
				}
				
			}).
		catch(function(response) {
			$scope.dataFetched = false;
			
		});
		
		if(cityName == $scope.cityName){
	 			$scope.whichCity = "first";
			}
  		else{
			$scope.whichCity = "second";
  			}
  };
  $scope.temperatureComparison = function(){
		if($scope.cityName == $scope.secondCityName){
			$scope.sameCities = true;
			$scope.temperatureComparisonForSameCityMessage = `Both are the same cities,please enter some different city name to have the comparison. `;
		}
		else if($scope.weatherFirstCity.data.list[0].temp.day > $scope.weatherSecondCity.data.list[0].temp.day){
			$scope.sameCities = false;
			$scope.temperatureComparisonMessage  = $scope.weatherFirstCity.data.city.name + ` is much warmer than ` + $scope.weatherSecondCity.data.city.name+` .`;
		}
		else{
			$scope.sameCities = false;
			$scope.temperatureComparisonMessage  = $scope.weatherFirstCity.data.city.name + ` is much cooler than ` + $scope.weatherSecondCity.data.city.name +` .`;
		}
  }
  
  $scope.init =  function(){
  $scope.cityName = $scope.secondCityName = "Norfolk";
  $scope.country = 'US';
  $scope.weatherSecondCity = {};
  $scope.weatherFirstCity = {};
  $scope.dataFetchedForFirstCity = false;
  $scope.dataFetchedForSecondCity = false;
  $scope.searchForCityWeather("Norfolk");
  $scope.newsReport();
  }
  $scope.init();
  
  
});