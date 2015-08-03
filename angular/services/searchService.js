var SearchService = angular.module('SearchService', []).service('SearchService', 
	['localStorageService', "$q", "$http", function (localStorageService, q, http) {


	this.searchObject = {
		"position" : {
				"distance" : "",
				"name" : "",
				"longitude" : 0,
				"latitude" : 0
		},
		"searchCriterias" : [
		],
		"doSearch" : "true"
	};

	this.searchResultList = [];

	this.setSearchObject = function (position, criterias, doSearch) {
		var deferred = q.defer();
		this.searchObject.position = position;
		this.searchObject.criterias = criterias;
		this.searchObject.doSearch = doSearch;
		deferred.resolve(true);
		return deferred.promise;
	}

	this.setDoSearch = function (doSearch) {
		var deferred = q.defer();
		this.searchObject.doSearch = doSearch;
		deferred.resolve(true);
		return deferred.promise;
	}

	this.getSearchObject = function () {
		var deferred = q.defer();
		deferred.resolve(this.searchObject);
		return deferred.promise;
	}


	this.getSearchResultsSize = function () {
		var deferred = q.defer();
		deferred.resolve("10");
		return deferred.promise;
	}

	this.getSearchResults = function (startIndex, endIndex) {
		var deferred = q.defer();
		var results = [
			{
				"farmerId" : 145,
				"farmer" : "Jovan Jovanovic",
				"location" : "Begec",
				"image" : "images/home/product1.jpg",
				"farmerType" : "neregistrovan",
				"searchProducts" : [
						{
							"productId" : 10,
							"productName" : "Paradajz",
							"productImage" : "images/cart/tomato.png",
							"productPrice" : "100",
							"productMeasure" : "kg",
							"productStock" : "78",
							"productAmmount" : "3"
						},
						{
							"productId" : 11,
							"productName" : "Krastavac",
							"productImage" : "images/cart/cucumber.png",
							"productPrice" : "30",
							"productMeasure" : "kg",
							"productStock" : "19",
							"productAmmount" : "10"
						},
						{
							"productId" : 12,
							"productName" : "Mladi Luk",
							"productImage" : "images/cart/onion.gif",
							"productPrice" : "45",
							"productMeasure" : "veza",
							"productStock" : "79",
							"productAmmount" : "4"
						}
				]
			},
			{
				"farmerId" : 155,
				"farmer" : "Petar Petrovic",
				"location" : "Curug",
				"image" : "images/home/product2.jpg",
				"farmerType" : "registrovan",
				"searchProducts" : [
						{
							"productId" : 10,
							"productName" : "Paradajz",
							"productImage" : "images/cart/tomato.png",
							"productPrice" : "105",
							"productMeasure" : "kg",
							"productStock" : "78",
							"productAmmount" : "3"
						},
						{
							"productId" : 11,
							"productName" : "Krastavac",
							"productImage" : "images/cart/cucumber.png",
							"productPrice" : "50",
							"productMeasure" : "kg",
							"productStock" : "19",
							"productAmmount" : "10"
						},
						{
							"productId" : 12,
							"productName" : "Mladi Luk",
							"productImage" : "images/cart/onion.gif",
							"productPrice" : "55",
							"productMeasure" : "veza",
							"productStock" : "79",
							"productAmmount" : "4"
						}
				]
			},
			{
				"farmerId" : 135,
				"farmer" : "Milan Milanovic",
				"location" : "Cerevic",
				"image" : "images/home/product3.jpg",
				"farmerType" : "registrovan",
				"searchProducts" : [
						{
							"productId" : 10,
							"productName" : "Paradajz",
							"productImage" : "images/cart/tomato.png",
							"productPrice" : "73",
							"productMeasure" : "kg",
							"productStock" : "78",
							"productAmmount" : "3"
						},
						{
							"productId" : 11,
							"productName" : "Krastavac",
							"productImage" : "images/cart/cucumber.png",
							"productPrice" : "52",
							"productMeasure" : "kg",
							"productStock" : "19",
							"productAmmount" : "10"
						},
						{
							"productId" : 12,
							"productName" : "Mladi Luk",
							"productImage" : "images/cart/onion.gif",
							"productPrice" : "75",
							"productMeasure" : "veza",
							"productStock" : "79",
							"productAmmount" : "4"
						}
				]
			},
			{
				"farmerId" : 125,
				"farmer" : "Dejan Dejanovic",
				"location" : "Futog",
				"image" : "images/home/product4.jpg",
				"farmerType" : "neregistrovan",
				"searchProducts" : [
						{
							"productId" : 10,
							"productName" : "Paradajz",
							"productImage" : "images/cart/tomato.png",
							"productPrice" : "63",
							"productMeasure" : "kg",
							"productStock" : "78",
							"productAmmount" : "3"
						},
						{
							"productId" : 11,
							"productName" : "Krastavac",
							"productImage" : "images/cart/cucumber.png",
							"productPrice" : "47",
							"productMeasure" : "kg",
							"productStock" : "19",
							"productAmmount" : "10"
						},
						{
							"productId" : 12,
							"productName" : "Mladi Luk",
							"productImage" : "images/cart/onion.gif",
							"productPrice" : "22",
							"productMeasure" : "veza",
							"productStock" : "79",
							"productAmmount" : "4"
						}
				]
			},
			{
				"farmerId" : 105,
				"farmer" : "Zdravo i fit d.o.o",
				"location" : "Novi Sad",
				"image" : "images/home/healthy-logo.jpg",
				"farmerType" : "firma",
				"searchProducts" : [
						{
							"productId" : 10,
							"productName" : "Paradajz",
							"productImage" : "images/cart/tomato.png",
							"productPrice" : "71",
							"productMeasure" : "kg",
							"productStock" : "78",
							"productAmmount" : "3"
						},
						{
							"productId" : 11,
							"productName" : "Krastavac",
							"productImage" : "images/cart/cucumber.png",
							"productPrice" : "87",
							"productMeasure" : "kg",
							"productStock" : "19",
							"productAmmount" : "10"
						},
						{
							"productId" : 12,
							"productName" : "Mladi Luk",
							"productImage" : "images/cart/onion.gif",
							"productPrice" : "52",
							"productMeasure" : "veza",
							"productStock" : "79",
							"productAmmount" : "4"
						}
				]
			}
		];

		//this.getSearchResults = results;
		deferred.resolve(results);
		return deferred.promise;
	}




	this.getSubcategories = function (category) {
		var subcategories = [];
		if (category == 13) {
			subcategories = [
				{
					"id" : 0,
					"name" : "Torte"
				},
				{
					"id" : 1,
					"name" : "Kolaci"
				},
			];
		}
		return subcategories;
	};

	this.getProductsInSubcategory = function (category, subcategory) {
		var subcatproducts = [];
		if (category == 13 && subcategory == 1) {
			subcatproducts = [
				{
					"id" : 0,
					"name" : "Princes Krofne"
				},
				{
					"id" : 1,
					"name" : "Bajadere"
				}
			];
		} else if (category == 13 && subcategory == 0) {
			subcatproducts = [
				{
					"id" : 0,
					"name" : "Svarcvald"
				},
				{
					"id" : 1,
					"name" : "Saher torta"
				}
			];
		} else if (category == 0) {
			subcatproducts = [
				{
					"id" : 0,
					"name" : "Paradajz"
				},
				{
					"id" : 1,
					"name" : "Krastavac"
				},
				{
					"id" : 2,
					"name" : "Mladi luk"
				}
			];
		} 
		return subcatproducts;
	};


	this.getCategories = function () {
		var categories = [
				{
					"id" : 0,
					"name" : "Povrce"
				},
				{
					"id" : 1,
					"name" : "Voce"
				},
				{
					"id" : 2,
					"name" : "Meso i mesne preradjevine"
				},
				{
					"id" : 3,
					"name" : "Mleko i mlecni proizvodi"
				},
				{
					"id" : 4,
					"name" : "Med i pcelinji proizvodi"
				},
				{
					"id" : 5,
					"name" : "Jaja"
				},
				{
					"id" : 6,
					"name" : "Zitarice i brasno"
				},
				{
					"id" : 7,
					"name" : "Gljive"
				},
				{
					"id" : 8,
					"name" : "Suseno voce i orasasti plodovi"
				},
				{
					"id" : 9,
					"name" : "Suseno povrce"
				},
				{
					"id" : 10,
					"name" : "Zimnica"
				},
				{
					"id" : 11,
					"name" : "Bezalkoholna pica i sirupi"
				},
				{
					"id" : 12,
					"name" : "Alkoholna pica"
				},
				{
					"id" : 13,
					"name" : "Slatkisi"
				},
				{
					"id" : 14,
					"name" : "Peciva"
				},
				{
					"id" : 15,
					"name" : "Kozmetika i higijena"
				},
				{
					"id" : 16,
					"name" : "Organski proizvodi"
				},
				{
					"id" : 17,
					"name" : "Gotove korpe"
				},
				{
					"id" : 18,
					"name" : "Cvece i sadnice"
				}
		];
		return categories;
	}

}]);