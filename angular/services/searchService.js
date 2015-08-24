var SearchService = angular.module('SearchService', []).service('SearchService',
    ['localStorageService', "$q", "$http", function (localStorageService, q, http) {


        this.searchObject = {
            "position": {
                "distance": "",
                "name": "",
                "longitude": 0,
                "latitude": 0
            },
            "searchCriterias": [],
            "doSearch": "true"
        };


        this.searchResultList = [];
        this.searchWishListItems = [];

        this.farmers = [
            {
                "name": "Jovan Jovanovic",
                "location": "Novi Sad",
                "img": "images/home/product1.jpg",
                "items": 10,
                "id": 145
            },
            {
                "name": 'Doma&#263;a pijaca',
                "location": "Novi Sad",
                "img": "images/home/healthy-logo2.jpg",
                "items": 10,
                "id": 147
            },
            {
                "name": "Dejan Dejanovi&#263;",
                "location": "Budisava",
                "img": "images/home/product2.jpg",
                "items": 8,
                "id": 155
            },
            {
                "name": "Milan Milanovi&#263;",
                "location": "&#269;urug",
                "img": "images/home/product3.jpg",
                "items": 4,
                "id": 165
            },
            {
                "name": "Zdrav o i fit d.o.o",
                "location": "Be&scaron;ka",
                "img": "images/home/healthy-logo.jpg",
                "items": 22,
                "id": 301
            },
            {
                "name": "Stevan Stevanovi&#263;",
                "location": "Bege&#269;",
                "img": "images/home/product4.jpg",
                "items": 2,
                "id": 175
            },
            {
                "name": "Marko Markovi&#263;",
                "location": "Crvenka",
                "img": "images/home/product1.jpg",
                "items": 22,
                "id": 185
            },
            {
                "name": "An&#273;ela Jovovi&#263;",
                "location": "Ba&#269;ka Topola",
                "img": "images/home/product5.jpg",
                "items": 4,
                "id": 195
            },
            {
                "name": "Marina Marovi&#263;",
                "location": "Kovilj",
                "img": "images/home/product6.jpg",
                "items": 2,
                "id": 208
            }
        ];

        this.getFarmers = function () {
            return this.farmers;
        }

        this.getFarmerById = function (id) {
            for (var i = this.farmers.length - 1; i >= 0; i--) {
                if (this.farmers[i].id == id) {
                    return this.farmers[i];
                }
            }
            ;
        }

        this.setSearchedItems = function (items) {
            this.searchWishListItems = items;
        }
        this.getSearchedItems = function () {

            var retArray = [];
            for (var i = this.searchWishListItems.length - 1; i >= 0; i--) {
                retArray.push(this.getProducts()[this.searchWishListItems[i].id]);
            }
            ;

            return retArray;
        }
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
                    "farmerId": 145,
                    "farmer": "Jovan Jovanovic",
                    "location": "Begec",
                    "image": "images/home/product1.jpg",
                    "farmerType": "neregistrovan",
                    "searchProducts": [
                        {
                            "productId": 10,
                            "productName": "Paradajz",
                            "productImage": "images/cart/tomato.png",
                            "productPrice": "100",
                            "productMeasure": "kg",
                            "productStock": "78",
                            "productAmmount": "3"
                        },
                        {
                            "productId": 11,
                            "productName": "Krastavac",
                            "productImage": "images/cart/cucumber.png",
                            "productPrice": "30",
                            "productMeasure": "kg",
                            "productStock": "19",
                            "productAmmount": "10"
                        },
                        {
                            "productId": 12,
                            "productName": "Mladi Luk",
                            "productImage": "images/cart/onion.gif",
                            "productPrice": "45",
                            "productMeasure": "veza",
                            "productStock": "79",
                            "productAmmount": "4"
                        }
                    ]
                },
                {
                    "farmerId": 155,
                    "farmer": "Petar Petrovic",
                    "location": "Curug",
                    "image": "images/home/product2.jpg",
                    "farmerType": "registrovan",
                    "searchProducts": [
                        {
                            "productId": 10,
                            "productName": "Paradajz",
                            "productImage": "images/cart/tomato.png",
                            "productPrice": "105",
                            "productMeasure": "kg",
                            "productStock": "78",
                            "productAmmount": "3"
                        },
                        {
                            "productId": 11,
                            "productName": "Krastavac",
                            "productImage": "images/cart/cucumber.png",
                            "productPrice": "50",
                            "productMeasure": "kg",
                            "productStock": "19",
                            "productAmmount": "10"
                        },
                        {
                            "productId": 12,
                            "productName": "Mladi Luk",
                            "productImage": "images/cart/onion.gif",
                            "productPrice": "55",
                            "productMeasure": "veza",
                            "productStock": "79",
                            "productAmmount": "4"
                        }
                    ]
                },
                {
                    "farmerId": 135,
                    "farmer": "Milan Milanovic",
                    "location": "Cerevic",
                    "image": "images/home/product3.jpg",
                    "farmerType": "registrovan",
                    "searchProducts": [
                        {
                            "productId": 10,
                            "productName": "Paradajz",
                            "productImage": "images/cart/tomato.png",
                            "productPrice": "73",
                            "productMeasure": "kg",
                            "productStock": "78",
                            "productAmmount": "3"
                        },
                        {
                            "productId": 11,
                            "productName": "Krastavac",
                            "productImage": "images/cart/cucumber.png",
                            "productPrice": "52",
                            "productMeasure": "kg",
                            "productStock": "19",
                            "productAmmount": "10"
                        },
                        {
                            "productId": 12,
                            "productName": "Mladi Luk",
                            "productImage": "images/cart/onion.gif",
                            "productPrice": "75",
                            "productMeasure": "veza",
                            "productStock": "79",
                            "productAmmount": "4"
                        }
                    ]
                },
                {
                    "farmerId": 125,
                    "farmer": "Dejan Dejanovic",
                    "location": "Futog",
                    "image": "images/home/product4.jpg",
                    "farmerType": "neregistrovan",
                    "searchProducts": [
                        {
                            "productId": 10,
                            "productName": "Paradajz",
                            "productImage": "images/cart/tomato.png",
                            "productPrice": "63",
                            "productMeasure": "kg",
                            "productStock": "78",
                            "productAmmount": "3"
                        },
                        {
                            "productId": 11,
                            "productName": "Krastavac",
                            "productImage": "images/cart/cucumber.png",
                            "productPrice": "47",
                            "productMeasure": "kg",
                            "productStock": "19",
                            "productAmmount": "10"
                        },
                        {
                            "productId": 12,
                            "productName": "Mladi Luk",
                            "productImage": "images/cart/onion.gif",
                            "productPrice": "22",
                            "productMeasure": "veza",
                            "productStock": "79",
                            "productAmmount": "4"
                        }
                    ]
                },
                {
                    "farmerId": 105,
                    "farmer": "Zdravo i fit d.o.o",
                    "location": "Novi Sad",
                    "image": "images/home/healthy-logo.jpg",
                    "farmerType": "firma",
                    "searchProducts": [
                        {
                            "productId": 10,
                            "productName": "Paradajz",
                            "productImage": "images/cart/tomato.png",
                            "productPrice": "71",
                            "productMeasure": "kg",
                            "productStock": "78",
                            "productAmmount": "3"
                        },
                        {
                            "productId": 11,
                            "productName": "Krastavac",
                            "productImage": "images/cart/cucumber.png",
                            "productPrice": "87",
                            "productMeasure": "kg",
                            "productStock": "19",
                            "productAmmount": "10"
                        },
                        {
                            "productId": 12,
                            "productName": "Mladi Luk",
                            "productImage": "images/cart/onion.gif",
                            "productPrice": "52",
                            "productMeasure": "veza",
                            "productStock": "79",
                            "productAmmount": "4"
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
                        "id": 0,
                        "name": "Torte"
                    },
                    {
                        "id": 1,
                        "name": "Kolaci"
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
                        "id": 0,
                        "name": "Princes Krofne"
                    },
                    {
                        "id": 1,
                        "name": "Bajadere"
                    }
                ];
            } else if (category == 13 && subcategory == 0) {
                subcatproducts = [
                    {
                        "id": 0,
                        "name": "Svarcvald"
                    },
                    {
                        "id": 1,
                        "name": "Saher torta"
                    }
                ];
            } else if (category == 0) {
                subcatproducts = [
                    {
                        "id": 0,
                        "name": "Paradajz"
                    },
                    {
                        "id": 1,
                        "name": "Krastavac"
                    },
                    {
                        "id": 2,
                        "name": "Mladi luk"
                    }
                ];
            }
            return subcatproducts;
        };


        this.getCategories = function () {
            var categories = [
                {
                    "id": 0,
                    "name": "Povrce"
                },
                {
                    "id": 1,
                    "name": "Voce"
                },
                {
                    "id": 2,
                    "name": "Meso i mesne preradjevine"
                },
                {
                    "id": 3,
                    "name": "Mleko i mlecni proizvodi"
                },
                {
                    "id": 4,
                    "name": "Med i pcelinji proizvodi"
                },
                {
                    "id": 5,
                    "name": "Jaja"
                },
                {
                    "id": 6,
                    "name": "Zitarice i brasno"
                },
                {
                    "id": 7,
                    "name": "Gljive"
                },
                {
                    "id": 8,
                    "name": "Suseno voce i orasasti plodovi"
                },
                {
                    "id": 9,
                    "name": "Suseno povrce"
                },
                {
                    "id": 10,
                    "name": "Zimnica"
                },
                {
                    "id": 11,
                    "name": "Bezalkoholna pica i sirupi"
                },
                {
                    "id": 12,
                    "name": "Alkoholna pica"
                },
                {
                    "id": 13,
                    "name": "Slatkisi"
                },
                {
                    "id": 14,
                    "name": "Peciva"
                },
                {
                    "id": 15,
                    "name": "Kozmetika i higijena"
                },
                {
                    "id": 16,
                    "name": "Organski proizvodi"
                },
                {
                    "id": 17,
                    "name": "Gotove korpe"
                },
                {
                    "id": 18,
                    "name": "Cvece i sadnice"
                }
            ];
            return categories;
        }

        this.products = [
            {
                "id": 0,
                "name": "Paradajz",
                "image": "images/cart/tomato.png",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Povrce"
            },
            {
                "id": 1,
                "name": "Krastavac",
                "image": "images/cart/cucumber.png",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "55",
                "category": "Povrce"
            },
            {
                "id": 2,
                "name": "Mladi luk",
                "image": "images/cart/onion.gif",
                "price": "22",
                "measure": "kg",
                "currency": "RSD",
                "stock": "44",
                "category": "Povrce"
            },
            {
                "id": 3,
                "name": "Jabuke",
                "image": "images/home/veggies.jpg",
                "price": "150",
                "measure": "kg",
                "currency": "RSD",
                "stock": "22",
                "category": "Voce"
            },
            {
                "id": 4,
                "name": "Kruske",
                "image": "images/home/veggies.jpg",
                "price": "105",
                "measure": "kg",
                "currency": "RSD",
                "stock": "21",
                "category": "Voce"
            },
            {
                "id": 5,
                "name": "Jagode",
                "image": "images/home/veggies.jpg",
                "price": "180",
                "measure": "kg",
                "currency": "RSD",
                "stock": "77",
                "category": "Voce"
            },
            {
                "id": 6,
                "name": "Jagnjetina",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "66",
                "category": "Meso i mesne preradjevine"
            },
            {
                "id": 7,
                "name": "Kobasica",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Meso i mesne preradjevine"
            },
            {
                "id": 8,
                "name": "Piletina",
                "image": "images/home/veggies.jpg",
                "price": "300",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Meso i mesne preradjevine"
            },
            {
                "id": 9,
                "name": "Mleko",
                "image": "images/home/veggies.jpg",
                "price": "10",
                "measure": "litar",
                "currency": "RSD",
                "stock": "18",
                "category": "Mleko i mlecni proizvodi"
            },
            {
                "id": 10,
                "name": "Jogurt",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "litar",
                "currency": "RSD",
                "stock": "78",
                "category": "Mleko i mlecni proizvodi"
            },
            {
                "id": 11,
                "name": "Sir",
                "image": "images/home/veggies.jpg",
                "price": "108",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Mleko i mlecni proizvodi"
            },
            {
                "id": 12,
                "name": "Bagremov med",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "48",
                "category": "Med i pcelinji proizvodi"
            },
            {
                "id": 13,
                "name": "Livadski med",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "66",
                "category": "Med i pcelinji proizvodi"
            },
            {
                "id": 14,
                "name": "Kokosija jaja",
                "image": "images/home/veggies.jpg",
                "price": "10",
                "measure": "kom",
                "currency": "RSD",
                "stock": "78",
                "category": "Jaja"
            },
            {
                "id": 15,
                "name": "Ovas",
                "image": "images/home/veggies.jpg",
                "price": "50",
                "measure": "kg",
                "currency": "RSD",
                "stock": "73",
                "category": "Zitarice i brasno"
            },
            {
                "id": 16,
                "name": "Raz",
                "image": "images/home/veggies.jpg",
                "price": "70",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Zitarice i brasno"
            },
            {
                "id": 17,
                "name": "Brasno",
                "image": "images/home/veggies.jpg",
                "price": "30",
                "measure": "kg",
                "currency": "RSD",
                "stock": "780",
                "category": "Zitarice i brasno"
            },
            {
                "id": 18,
                "name": "Sampinjoni",
                "image": "images/home/veggies.jpg",
                "price": "140",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Gljive"
            },
            {
                "id": 19,
                "name": "Orah",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Suseno voce i orasasti plodovi"
            },
            {
                "id": 20,
                "name": "Lesnik",
                "image": "images/home/veggies.jpg",
                "price": "110",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": "Suseno voce i orasasti plodovi"
            },
            {
                "id": 21,
                "name": "Suve smokve",
                "image": "images/home/veggies.jpg",
                "price": "109",
                "measure": "kg",
                "currency": "RSD",
                "stock": "100",
                "category": "Suseno voce i orasasti plodovi"
            },
            {
                "id": 22,
                "name": "Suva paprika",
                "image": "images/home/veggies.jpg",
                "price": "139",
                "measure": "kg",
                "currency": "RSD",
                "stock": "110",
                "category": "Suseno povrce"
            },
            {
                "id": 23,
                "name": "Kornisoni",
                "image": "images/home/veggies.jpg",
                "price": "109",
                "measure": "kg",
                "currency": "RSD",
                "stock": "105",
                "category": "Zimnica"
            },
            {
                "id": 24,
                "name": "Tursija",
                "image": "images/home/veggies.jpg",
                "price": "169",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Zimnica"
            },
            {
                "id": 25,
                "name": "Domaci sok",
                "image": "images/home/veggies.jpg",
                "price": "129",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Bezalkoholna pica i sirupi"
            },
            {
                "id": 26,
                "name": "Kabeza",
                "image": "images/home/veggies.jpg",
                "price": "16",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Bezalkoholna pica i sirupi"
            },
            {
                "id": 27,
                "name": "Sirup",
                "image": "images/home/veggies.jpg",
                "price": "69",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Bezalkoholna pica i sirupi"
            },
            {
                "id": 28,
                "name": "Rakija",
                "image": "images/home/veggies.jpg",
                "price": "300",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Alkoholna pica"
            },
            {
                "id": 29,
                "name": "Vino",
                "image": "images/home/veggies.jpg",
                "price": "200",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Alkoholna pica"
            },
            {
                "id": 30,
                "name": "Pivo",
                "image": "images/home/veggies.jpg",
                "price": "110",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Alkoholna pica"
            },
            {
                "id": 31,
                "name": "Cokolada",
                "image": "images/home/veggies.jpg",
                "price": "130",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Slatkisi"
            },
            {
                "id": 32,
                "name": "Bombone",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Slatkisi"
            },
            {
                "id": 33,
                "name": "Hleb",
                "image": "images/home/veggies.jpg",
                "price": "30",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Peciva"
            },
            {
                "id": 34,
                "name": "Kifle",
                "image": "images/home/veggies.jpg",
                "price": "20",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": "Peciva"
            },
            {
                "id": 35,
                "name": "Sapun",
                "image": "images/home/veggies.jpg",
                "price": "134",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": "Kozmetika i higijena"
            },
            {
                "id": 36,
                "name": "Sampon",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": "Kozmetika i higijena"
            },
            {
                "id": 37,
                "name": "Organske jagode",
                "image": "images/home/veggies.jpg",
                "price": "129",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Organski proizvodi"
            },
            {
                "id": 38,
                "name": "Organska zelena salata",
                "image": "images/home/veggies.jpg",
                "price": "140",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Organski proizvodi"
            },
            {
                "id": 39,
                "name": "Organske jagode",
                "image": "images/home/veggies.jpg",
                "price": "200",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": "Organski proizvodi"
            },
            {
                "id": 40,
                "name": "Korpa",
                "image": "images/home/veggies.jpg",
                "price": "169",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": "Gotove korpe"
            },
            {
                "id": 41,
                "name": "Ceger",
                "image": "images/home/veggies.jpg",
                "price": "210",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": "Gotove korpe"
            },
            {
                "id": 42,
                "name": "Petunije",
                "image": "images/home/veggies.jpg",
                "price": "210",
                "measure": "kom",
                "currency": "RSD",
                "stock": "10",
                "category": "Cvece i sadnice"
            },
            {
                "id": 43,
                "name": "Hrizanteme",
                "image": "images/home/veggies.jpg",
                "price": "330",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": "Cvece i sadnice"
            }
        ];

        this.getProducts = function () {
            return this.products;
        }
        this.getProductsInCategory = function (category) {
            var products = [];
            console.log("Search category ".concat(category));
            if (category == 0) {
                products = [
                    {
                        "id": 0,
                        "name": "Paradajz"
                    },
                    {
                        "id": 1,
                        "name": "Krastavac"
                    },
                    {
                        "id": 2,
                        "name": "Mladi luk"
                    }
                ]
            } else if (category == 1) {
                products = [
                    {
                        "id": 3,
                        "name": "Jabuke"
                    },
                    {
                        "id": 4,
                        "name": "Kruske"
                    },
                    {
                        "id": 5,
                        "name": "Jagode"
                    }
                ]
            } else if (category == 2) {
                products = [
                    {
                        "id": 6,
                        "name": "Jagnjetina"
                    },
                    {
                        "id": 7,
                        "name": "Kobasica"
                    },
                    {
                        "id": 8,
                        "name": "Piletina"
                    }
                ]
            } else if (category == 3) {
                products = [
                    {
                        "id": 9,
                        "name": "Mleko"
                    },
                    {
                        "id": 10,
                        "name": "Jogurt"
                    },
                    {
                        "id": 11,
                        "name": "Sir"
                    }
                ]
            } else if (category == 4) {
                products = [
                    {
                        "id": 12,
                        "name": "Bagremov med"
                    },
                    {
                        "id": 13,
                        "name": "Livadski med"
                    },
                ]
            } else if (category == 5) {
                products = [
                    {
                        "id": 14,
                        "name": "Kokosija jaja"
                    },
                ]
            } else if (category == 6) {
                products = [
                    {
                        "id": 15,
                        "name": "Ovas"
                    },
                    {
                        "id": 16,
                        "name": "Raz"
                    },
                    {
                        "id": 17,
                        "name": "Brasno"
                    }
                ]
            } else if (category == 7) {
                products = [
                    {
                        "id": 18,
                        "name": "Sampinjoni"
                    },
                ]
            } else if (category == 8) {
                products = [
                    {
                        "id": 19,
                        "name": "Orah"
                    },
                    {
                        "id": 20,
                        "name": "Lesnik"
                    },
                    {
                        "id": 21,
                        "name": "Suve smokve"
                    }
                ]
            } else if (category == 9) {
                products = [
                    {
                        "id": 22,
                        "name": "Suva paprika"
                    },
                ]
            } else if (category == 10) {
                products = [
                    {
                        "id": 23,
                        "name": "Kornisoni"
                    },
                    {
                        "id": 24,
                        "name": "Tursija"
                    },
                ]
            } else if (category == 11) {
                products = [
                    {
                        "id": 25,
                        "name": "Domaci sok"
                    },
                    {
                        "id": 26,
                        "name": "Kabeza"
                    },
                    {
                        "id": 27,
                        "name": "Sirup"
                    }
                ]
            } else if (category == 12) {
                products = [
                    {
                        "id": 28,
                        "name": "Rakija"
                    },
                    {
                        "id": 29,
                        "name": "Vino"
                    },
                    {
                        "id": 30,
                        "name": "Pivo"
                    }
                ]
            } else if (category == 13) {
                products = [
                    {
                        "id": 31,
                        "name": "Cokolada"
                    },
                    {
                        "id": 32,
                        "name": "Bombone"
                    },
                ]
            } else if (category == 14) {
                products = [
                    {
                        "id": 33,
                        "name": "Hleb"
                    },
                    {
                        "id": 34,
                        "name": "Kifle"
                    },
                ]
            } else if (category == 15) {
                products = [
                    {
                        "id": 35,
                        "name": "Sapun"
                    },
                    {
                        "id": 36,
                        "name": "Sampon"
                    },
                ]
            } else if (category == 16) {
                products = [
                    {
                        "id": 37,
                        "name": "Organske jabuke"
                    },
                    {
                        "id": 38,
                        "name": "Organska zelena salata"
                    },
                    {
                        "id": 39,
                        "name": "Organske Jagode"
                    }
                ]
            } else if (category == 17) {
                products = [
                    {
                        "id": 40,
                        "name": "Korpa"
                    },
                    {
                        "id": 41,
                        "name": "Ceger"
                    }
                ]
            } else if (category == 18) {
                products = [
                    {
                        "id": 42,
                        "name": "Petunije"
                    },
                    {
                        "id": 43,
                        "name": "Hrizanteme"
                    },
                ]
            }

            return products;
        }

        this.distributors = [
            {
                "id": 0,
                "name": "Kurir d.o.o",
                "location": "Novi Sad",
                "img":" images/home/courier1.jpg"
            },
            {
                "id": 1,
                "name": "Kombi prevoz",
                "location": "Rumenka",
                "img":" images/home/courier1.jpg"
            }

        ];

        this.getDistributorById = function (distributorId) {
            console.log(this.distributors[distributorId]);
            return this.distributors[distributorId];
        }

        this.vehicles = [
            {
                "id": 0,
                "number": 2,
                "cooled": true,
                "height": 120,
                "width": 150,
                "depth": 200,
                "amount": 500,
                "img":" images/home/vehicle1.jpg"
            },
            {
                "id": 1,
                "number": 6,
                "cooled": false,
                "height": 160,
                "width": 140,
                "depth": 220,
                "amount": 730,
                "img":" images/home/vehicle2.jpg"
            },
            {
                "id": 2,
                "number": 9,
                "cooled": true,
                "height": 110,
                "width": 155,
                "depth": 250,
                "amount": 650,
                "img":" images/home/vehicle1.jpg"
            }
        ]

        this.getVehiclesByDistributorId = function(distId){
            return this.vehicles;
        }
    }]);