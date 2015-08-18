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
                "name": "Domaæa pijaca",
                "location": "Novi Sad",
                "img": "images/home/healthy-logo2.jpg",
                "items": 10,
                "id": 145
            },
            {
                "name": "Dejan Dejanoviæ",
                "location": "Budisava",
                "img": "images/home/product2.jpg",
                "items": 8,
                "id": 155
            },
            {
                "name": "Milan Milanoviæ",
                "location": "Èurug",
                "img": "images/home/product3.jpg",
                "items": 4,
                "id": 165
            },
            {
                "name": "Zdrav o i fit d.o.o",
                "location": "Beška",
                "img": "images/home/healthy-logo.jpg",
                "items": 22,
                "id": 301
            },
            {
                "name": "Stevan Stevanoviæ",
                "location": "Begeè",
                "img": "images/home/product4.jpg",
                "items": 2,
                "id": 175
            },
            {
                "name": "Marko Markoviæ",
                "location": "Crvenka",
                "img": "images/home/product1.jpg",
                "items": 22,
                "id": 185
            },
            {
                "name": "Anðela Jovoviæ",
                "location": "Baèka Topola",
                "img": "images/home/product5.jpg",
                "items": 4,
                "id": 195
            },
            {
                "name": "Marina Maroviæ",
                "location": "Kovilj",
                "img": "images/home/product6.jpg",
                "items": 2,
                "id": 208
            }
        ];

        this.getFarmers = function() {
            return this.farmers;
        }

        this.getFarmerById = function(id){
            for (var i = this.farmers.length- 1; i >= 0; i--) {
                if (this.farmers[i].id == id) {
                    return this.farmers[i];
                }
            };
        }

        this.setSearchedItems = function(items){
            this.searchWishListItems = items;
        }
        this.getSearchedItems = function(){
            return this.searchWishListItems;
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
                        "id": 0,
                        "name": "Jabuke"
                    },
                    {
                        "id": 1,
                        "name": "Kruske"
                    },
                    {
                        "id": 2,
                        "name": "Jagode"
                    }
                ]
            } else if (category == 2) {
                products = [
                    {
                        "id": 0,
                        "name": "Jagnjetina"
                    },
                    {
                        "id": 1,
                        "name": "Kobasica"
                    },
                    {
                        "id": 2,
                        "name": "Piletina"
                    }
                ]
            } else if (category == 3) {
                products = [
                    {
                        "id": 0,
                        "name": "Mleko"
                    },
                    {
                        "id": 1,
                        "name": "Jogurt"
                    },
                    {
                        "id": 2,
                        "name": "Sir"
                    }
                ]
            } else if (category == 4) {
                products = [
                    {
                        "id": 0,
                        "name": "Bagremov med"
                    },
                    {
                        "id": 1,
                        "name": "Livadski med"
                    },
                ]
            } else if (category == 5) {
                products = [
                    {
                        "id": 0,
                        "name": "Kokosija jaja"
                    },
                ]
            } else if (category == 6) {
                products = [
                    {
                        "id": 0,
                        "name": "Ovas"
                    },
                    {
                        "id": 1,
                        "name": "Raz"
                    },
                    {
                        "id": 2,
                        "name": "Brasno"
                    }
                ]
            } else if (category == 7) {
                products = [
                    {
                        "id": 0,
                        "name": "Sampinjoni"
                    },
                ]
            } else if (category == 8) {
                products = [
                    {
                        "id": 0,
                        "name": "Orah"
                    },
                    {
                        "id": 1,
                        "name": "Lesnik"
                    },
                    {
                        "id": 2,
                        "name": "Suve smokve"
                    }
                ]
            } else if (category == 9) {
                products = [
                    {
                        "id": 0,
                        "name": "Suva paprika"
                    },
                ]
            } else if (category == 10) {
                products = [
                    {
                        "id": 0,
                        "name": "Kornisoni"
                    },
                    {
                        "id": 1,
                        "name": "Tursija"
                    },
                ]
            } else if (category == 11) {
                products = [
                    {
                        "id": 0,
                        "name": "Domaci sok"
                    },
                    {
                        "id": 1,
                        "name": "Kabeza"
                    },
                    {
                        "id": 2,
                        "name": "Sirup"
                    }
                ]
            } else if (category == 12) {
                products = [
                    {
                        "id": 0,
                        "name": "Rakija"
                    },
                    {
                        "id": 1,
                        "name": "Vino"
                    },
                    {
                        "id": 2,
                        "name": "Pivo"
                    }
                ]
            } else if (category == 13) {
                products = [
                    {
                        "id": 0,
                        "name": "Cokolada"
                    },
                    {
                        "id": 1,
                        "name": "Bombone"
                    },
                ]
            } else if (category == 14) {
                products = [
                    {
                        "id": 0,
                        "name": "Hleb"
                    },
                    {
                        "id": 1,
                        "name": "Kifle"
                    },
                ]
            } else if (category == 15) {
                products = [
                    {
                        "id": 0,
                        "name": "Sapun"
                    },
                    {
                        "id": 1,
                        "name": "Sampon"
                    },
                ]
            } else if (category == 16) {
                products = [
                    {
                        "id": 0,
                        "name": "Organske jabuke"
                    },
                    {
                        "id": 1,
                        "name": "Organska zelena salata"
                    },
                    {
                        "id": 2,
                        "name": "Jagode"
                    }
                ]
            } else if (category == 17) {
                products = [
                    {
                        "id": 0,
                        "name": "Korpa"
                    },
                    {
                        "id": 1,
                        "name": "Ceger"
                    },
                    {
                        "id": 2,
                        "name": "Jagode"
                    }
                ]
            } else if (category == 18) {
                products = [
                    {
                        "id": 0,
                        "name": "Petunije"
                    },
                    {
                        "id": 1,
                        "name": "Hrizanteme"
                    },
                    {
                        "id": 2,
                        "name": "Jagode"
                    }
                ]
            } else if (category == 1) {
                products = [
                    {
                        "id": 0,
                        "name": "Jabuke"
                    },
                    {
                        "id": 1,
                        "name": "Kruske"
                    },
                    {
                        "id": 2,
                        "name": "Jagode"
                    }
                ]
            }

            return products;
        }


    }]);