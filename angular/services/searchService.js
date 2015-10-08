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
                "email":"jovan@gmail.com",
                "img": "images/home/farm1.jpg",
                "items": 10,
                "id": 145
            },
            {
                "name": 'Doma&#263;a pijaca',
                "location": "Novi Sad",
                "email":"pijaca@gmail.com",
                "img": "images/home/farm2.jpg",
                "items": 10,
                "id": 147
            },
            {
                "name": "Dejan Dejanovi&#263;",
                "location": "Budisava",
                "email":"dejan@gmail.com",
                "img": "images/home/farm3.jpg",
                "items": 8,
                "id": 155
            },
            {
                "name": "Milan Milanovi&#263;",
                "location": "&#269;urug",
                "email":"milan@gmail.com",
                "img": "images/home/farm4.jpg",
                "items": 4,
                "id": 165
            },
            {
                "name": "Zdrav o i fit d.o.o",
                "location": "Be&scaron;ka",
                "email":"zdravo@gmail.com",
                "img": "images/home/farm5.jpg",
                "items": 22,
                "id": 301
            },
            {
                "name": "Stevan Stevanovi&#263;",
                "location": "Bege&#269;",
                "email":"stevan@gmail.com",
                "img": "images/home/farm5.jpg",
                "items": 2,
                "id": 175
            },
            {
                "name": "Marko Markovi&#263;",
                "location": "Crvenka",
                "email":"marko@gmail.com",
                "img": "images/home/farm6.jpg",
                "items": 22,
                "id": 185
            },
            {
                "name": "An&#273;ela Jovovi&#263;",
                "location": "Ba&#269;ka Topola",
                "email":"andjela@gmail.com",
                "img": "images/home/farm7.jpg",
                "items": 4,
                "id": 195
            },
            {
                "name": "Marina Marovi&#263;",
                "location": "Kovilj",
                "email":"marina@gmail.com",
                "img": "images/home/farm8.jpg",
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
                    "name": "VEGETABLES"
                },
                {
                    "id": 1,
                    "name": "FRUIT"
                },
                {
                    "id": 2,
                    "name": "MEAT_AND_MEAT_PRODUCTS"
                },
                {
                    "id": 3,
                    "name": "MILK_AND_DAIRES"
                },
                {
                    "id": 4,
                    "name": "HONEY_PRODUCTS"
                },
                {
                    "id": 5,
                    "name": "EGGS"
                },
                {
                    "id": 6,
                    "name": "GRAINS_AND_FLOUR"
                },
                {
                    "id": 7,
                    "name": "MUSHROUMS"
                },
                {
                    "id": 8,
                    "name": "DRIED_FRUIT_AND_NUTS"
                },
                {
                    "id": 9,
                    "name": "DRIED_VEGETABLES"
                },
                {
                    "id": 10,
                    "name": "WINTER_STORES"
                },
                {
                    "id": 11,
                    "name": "NON_ALCOHOL_AND_SIRUPS"
                },
                {
                    "id": 12,
                    "name": "ALCOHOL_DRINKS"
                },
                {
                    "id": 13,
                    "name": "SWEETS"
                },
                {
                    "id": 14,
                    "name": "BAGELS"
                },
                {
                    "id": 15,
                    "name": "COSMETICS_AND_HYGIENE"
                },
                {
                    "id": 16,
                    "name": "ORGANIC_PRODUCTS"
                },
                {
                    "id": 17,
                    "name": "BASKETS"
                },
                {
                    "id": 18,
                    "name": "FLOWERS_AND_SEEDLINGS"
                },
                {
                    "id": 19,
                    "name": "FISH_PRODUCTS"
                }
            ];
            return categories;
        }

        this.products = [
            {
                "id": 0,
                "name": "TOMATO",
                "image": "images/cart/tomato.png",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 0
            },
            {
                "id": 1,
                "name": "CUCUMBER",
                "image": "images/cart/cucumber.png",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "55",
                "category": 0
            },
            {
                "id": 2,
                "name": "SPRING_ONION",
                "image": "images/cart/onion.gif",
                "price": "22",
                "measure": "kg",
                "currency": "RSD",
                "stock": "44",
                "category": 0
            },
            {
                "id": 3,
                "name": "APPLE",
                "image": "images/home/veggies.jpg",
                "price": "150",
                "measure": "kg",
                "currency": "RSD",
                "stock": "22",
                "category": 1
            },
            {
                "id": 4,
                "name": "PEAR",
                "image": "images/home/veggies.jpg",
                "price": "105",
                "measure": "kg",
                "currency": "RSD",
                "stock": "21",
                "category": 1
            },
            {
                "id": 5,
                "name": "STRAWBERRY",
                "image": "images/home/veggies.jpg",
                "price": "180",
                "measure": "kg",
                "currency": "RSD",
                "stock": "77",
                "category": 1
            },
            {
                "id": 6,
                "name": "LAMB",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "66",
                "category": 2
            },
            {
                "id": 7,
                "name": "SAUSAGE",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 2
            },
            {
                "id": 8,
                "name": "CHICKEN",
                "image": "images/home/veggies.jpg",
                "price": "300",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 2
            },
            {
                "id": 9,
                "name": "MILK",
                "image": "images/home/veggies.jpg",
                "price": "10",
                "measure": "litar",
                "currency": "RSD",
                "stock": "18",
                "category": 3
            },
            {
                "id": 10,
                "name": "YOGHURT",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "litar",
                "currency": "RSD",
                "stock": "78",
                "category": 3
            },
            {
                "id": 11,
                "name": "CHEESE",
                "image": "images/home/veggies.jpg",
                "price": "108",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 3
            },
            {
                "id": 12,
                "name": "ACACIA_HONEY",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "48",
                "category": 4
            },
            {
                "id": 13,
                "name": "MEADOW_HONEY",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "66",
                "category": 4
            },
            {
                "id": 14,
                "name": "CHICKEN_EGGS",
                "image": "images/home/veggies.jpg",
                "price": "10",
                "measure": "kom",
                "currency": "RSD",
                "stock": "78",
                "category": 5
            },
            {
                "id": 15,
                "name": "OATS",
                "image": "images/home/veggies.jpg",
                "price": "50",
                "measure": "kg",
                "currency": "RSD",
                "stock": "73",
                "category": 6
            },
            {
                "id": 16,
                "name": "BARLEY",
                "image": "images/home/veggies.jpg",
                "price": "70",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 6
            },
            {
                "id": 17,
                "name": "FLOUR",
                "image": "images/home/veggies.jpg",
                "price": "30",
                "measure": "kg",
                "currency": "RSD",
                "stock": "780",
                "category": 6
            },
            {
                "id": 18,
                "name": "CHAMPIGNIONS",
                "image": "images/home/veggies.jpg",
                "price": "140",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category":7
            },
            {
                "id": 19,
                "name": "WALNUT",
                "image": "images/home/veggies.jpg",
                "price": "100",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 8
            },
            {
                "id": 20,
                "name": "NUT",
                "image": "images/home/veggies.jpg",
                "price": "110",
                "measure": "kg",
                "currency": "RSD",
                "stock": "78",
                "category": 8
            },
            {
                "id": 21,
                "name": "DRY_FIGS",
                "image": "images/home/veggies.jpg",
                "price": "109",
                "measure": "kg",
                "currency": "RSD",
                "stock": "100",
                "category": 8
            },
            {
                "id": 22,
                "name": "DRY_PAPRIKA",
                "image": "images/home/veggies.jpg",
                "price": "139",
                "measure": "kg",
                "currency": "RSD",
                "stock": "110",
                "category": 9
            },
            {
                "id": 23,
                "name": "PICKLES",
                "image": "images/home/veggies.jpg",
                "price": "109",
                "measure": "kg",
                "currency": "RSD",
                "stock": "105",
                "category": 10
            },
            {
                "id": 24,
                "name": "BRINE",
                "image": "images/home/veggies.jpg",
                "price": "169",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 10
            },
            {
                "id": 25,
                "name": "HOMEMADE_JUICE",
                "image": "images/home/veggies.jpg",
                "price": "129",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 11
            },
            {
                "id": 26,
                "name": "GRAPE_JUICE",
                "image": "images/home/veggies.jpg",
                "price": "16",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 11
            },
            {
                "id": 27,
                "name": "SIRYP",
                "image": "images/home/veggies.jpg",
                "price": "69",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 11
            },
            {
                "id": 28,
                "name": "SCHNAPS",
                "image": "images/home/veggies.jpg",
                "price": "300",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 12
            },
            {
                "id": 29,
                "name": "WINE",
                "image": "images/home/veggies.jpg",
                "price": "200",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 12
            },
            {
                "id": 30,
                "name": "BEER",
                "image": "images/home/veggies.jpg",
                "price": "110",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 12
            },
            {
                "id": 31,
                "name": "CHOCOLATE",
                "image": "images/home/veggies.jpg",
                "price": "130",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 13
            },
            {
                "id": 32,
                "name": "CANDY",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 13
            },
            {
                "id": 33,
                "name": "BREAD",
                "image": "images/home/veggies.jpg",
                "price": "30",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 14
            },
            {
                "id": 34,
                "name": "ROOL",
                "image": "images/home/veggies.jpg",
                "price": "20",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 14
            },
            {
                "id": 35,
                "name": "SOAP",
                "image": "images/home/veggies.jpg",
                "price": "134",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 15
            },
            {
                "id": 36,
                "name": "SCHAMPOO",
                "image": "images/home/veggies.jpg",
                "price": "120",
                "measure": "litar",
                "currency": "RSD",
                "stock": "101",
                "category": 15
            },
            {
                "id": 37,
                "name": "ORGANIC_APPLE",
                "image": "images/home/veggies.jpg",
                "price": "129",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 16
            },
            {
                "id": 38,
                "name": "ORGANIC_CABBAGE",
                "image": "images/home/veggies.jpg",
                "price": "140",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 16
            },
            {
                "id": 39,
                "name": "OGRANIC_STRAWBERRY",
                "image": "images/home/veggies.jpg",
                "price": "200",
                "measure": "kg",
                "currency": "RSD",
                "stock": "101",
                "category": 16
            },
            {
                "id": 40,
                "name": "BASKET",
                "image": "images/home/veggies.jpg",
                "price": "169",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 17
            },
            {
                "id": 41,
                "name": "HANDBAG",
                "image": "images/home/veggies.jpg",
                "price": "210",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 17
            },
            {
                "id": 42,
                "name": "PETUNIA",
                "image": "images/home/veggies.jpg",
                "price": "210",
                "measure": "kom",
                "currency": "RSD",
                "stock": "10",
                "category": 18
            },
            {
                "id": 43,
                "name": "ROSE",
                "image": "images/home/veggies.jpg",
                "price": "330",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 18
            },
            {
                "id": 44,
                "name": "TROUT",
                "image": "images/home/veggies.jpg",
                "price": "330",
                "measure": "kom",
                "currency": "RSD",
                "stock": "101",
                "category": 19
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
                        "name": "TOMATO"
                    },
                    {
                        "id": 1,
                        "name": "CUCUMBER"
                    },
                    {
                        "id": 2,
                        "name": "SPRING_ONION"
                    }
                ]
            } else if (category == 1) {
                products = [
                    {
                        "id": 3,
                        "name": "APPLE"
                    },
                    {
                        "id": 4,
                        "name": "PEAR"
                    },
                    {
                        "id": 5,
                        "name": "STRAWBERRY"
                    }
                ]
            } else if (category == 2) {
                products = [
                    {
                        "id": 6,
                        "name": "LAMB"
                    },
                    {
                        "id": 7,
                        "name": "SAUSAGE"
                    },
                    {
                        "id": 8,
                        "name": "CHICKEN"
                    }
                ]
            } else if (category == 3) {
                products = [
                    {
                        "id": 9,
                        "name": "MILK"
                    },
                    {
                        "id": 10,
                        "name": "YOGHURT"
                    },
                    {
                        "id": 11,
                        "name": "CHEESE"
                    }
                ]
            } else if (category == 4) {
                products = [
                    {
                        "id": 12,
                        "name": "ACACIA_HONEY"
                    },
                    {
                        "id": 13,
                        "name": "MEADOW_HONEY"
                    },
                ]
            } else if (category == 5) {
                products = [
                    {
                        "id": 14,
                        "name": "CHICKEN_EGGS"
                    },
                ]
            } else if (category == 6) {
                products = [
                    {
                        "id": 15,
                        "name": "OATS"
                    },
                    {
                        "id": 16,
                        "name": "BARLEY"
                    },
                    {
                        "id": 17,
                        "name": "FLOUR"
                    }
                ]
            } else if (category == 7) {
                products = [
                    {
                        "id": 18,
                        "name": "CHAMPIGNIONS"
                    },
                ]
            } else if (category == 8) {
                products = [
                    {
                        "id": 19,
                        "name": "WALNUT"
                    },
                    {
                        "id": 20,
                        "name": "NUT"
                    },
                    {
                        "id": 21,
                        "name": "DRY_FIGS"
                    }
                ]
            } else if (category == 9) {
                products = [
                    {
                        "id": 22,
                        "name": "DRY_PAPRIKA"
                    },
                ]
            } else if (category == 10) {
                products = [
                    {
                        "id": 23,
                        "name": "PICKLES"
                    },
                    {
                        "id": 24,
                        "name": "BRINE"
                    },
                ]
            } else if (category == 11) {
                products = [
                    {
                        "id": 25,
                        "name": "HOMEMADE_JUICE"
                    },
                    {
                        "id": 26,
                        "name": "GRAPE_JUICE"
                    },
                    {
                        "id": 27,
                        "name": "SIRYP"
                    }
                ]
            } else if (category == 12) {
                products = [
                    {
                        "id": 28,
                        "name": "SCHNAPS"
                    },
                    {
                        "id": 29,
                        "name": "WINE"
                    },
                    {
                        "id": 30,
                        "name": "BEER"
                    }
                ]
            } else if (category == 13) {
                products = [
                    {
                        "id": 31,
                        "name": "CHOCOLATE"
                    },
                    {
                        "id": 32,
                        "name": "CANDY"
                    },
                ]
            } else if (category == 14) {
                products = [
                    {
                        "id": 33,
                        "name": "BREAD"
                    },
                    {
                        "id": 34,
                        "name": "ROOL"
                    },
                ]
            } else if (category == 15) {
                products = [
                    {
                        "id": 35,
                        "name": "SOAP"
                    },
                    {
                        "id": 36,
                        "name": "SHAMPOO"
                    },
                ]
            } else if (category == 16) {
                products = [
                    {
                        "id": 37,
                        "name": "ORGANIC_APPLE"
                    },
                    {
                        "id": 38,
                        "name": "ORGANIC_CABBAGE"
                    },
                    {
                        "id": 39,
                        "name": "OGRANIC_STRAWBERRY"
                    }
                ]
            } else if (category == 17) {
                products = [
                    {
                        "id": 40,
                        "name": "BASKET"
                    },
                    {
                        "id": 41,
                        "name": "HANDBAG"
                    }
                ]
            } else if (category == 18) {
                products = [
                    {
                        "id": 42,
                        "name": "PETUNIA"
                    },
                    {
                        "id": 43,
                        "name": "ROSE"
                    },
                ]
            }else if (category == 19) {
                products = [
                    {
                        "id": 44,
                        "name": "TROUT"
                    }
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

        this.getDistances = function(){
            return [
                {
                    value: "10 km"
                },
                {
                    value: "20 km"
                },
                {
                    value: "50 km"
                },
                {
                    value: "100 km"
                }
            ]
        }
    }]);