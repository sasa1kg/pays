var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule',
    'GeoLocationService', 'CartService', 'WishlistService', 'SearchService',
    'ui-rangeSlider', 'cgBusy', 'brantwills.paging', 'pascalprecht.translate', 'ui.bootstrap.datetimepicker', 'ui.bootstrap'])
    .filter('html', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    }).filter('slice', function() {
        return function(arr, start, end) {
            return arr.slice(start, end);
        };
    });

paysApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('paysApp');
});


paysApp.run(function ($rootScope, $translate) {
    $rootScope.translate = function (lang) {
        $translate.use(lang);
    };
});

paysApp.config(function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en', {
        HOME: 'Home',
        SHOP: 'Shop',
        BLOG: 'Blog',
        FOR_FARMERS: 'For farmers',
        FOR_DISTRIBUTORS: 'For distributors',
        SEARCH: 'Search',
        NEAR_YOU: 'Near you',
        IN_CIRCLE_OF: 'In circle of',
        CHOOSE_DISTANCE: 'Select a distance',
        VIEW_OFFER: 'View Offer',
        ACCOUNT: 'Account',
        WISHLIST: 'Wishlist',
        SHOPPING: 'Shopping',
        CART: 'Cart overview',
        LOGIN: 'Log in',
        CONTACT: 'Contact us',
        PRODUCTS: 'Products',
        PRODUCT_DETAILS: 'Product details',
        BLOG_LIST: 'Blog list',
        ONE_BLOG: 'One blog',
        SEARCH_RESET: 'Reset search parameters',
        PAY: 'Payment',
        DELIVERY: 'Delivery',
        TOTAL: 'Total',
        UPDATE_CART: 'Update cart',
        EMPTY_CART: 'Empty cart',
        DIALOG_EMPTY_CART_QUESTION: 'Do you want to remove all items from your cart?',
        YES: 'Yes',
        NO: 'No',
        YOUR_LOCATION: 'Your location',
        CATEGORY: 'Category',
        LOCATION_PLACE: 'Location',
        LOCATION_FOUND: 'Location found',
        MARKETING_SPACE: 'Top picks',
        ADVERTISING: 'Advertising',
        MOST_IN_YEAR: 'The most sales in a year',
        MOST_DIFFERENT: 'The most different products',
        MOST_ORDERS: 'The most orders',
        ABOUT_US: 'About us',
        TITLE_1: 'Everyday items shop',
        TITLE_2: 'direct from farmers',
        TITLE_3: 'Follow our blog',
        ORDER: 'Order',
        ORDER_DATA_SUFFIX: 'information about your delivery',
        WHO: 'Who',
        NAME_SURNAME: 'Name and surname',
        WHERE: 'Where',
        CHOOSE_CITY: 'Choose city:',
        CITY: 'City',
        STREET: 'Street:',
        HOUSE_NUMBER: 'Number:',
        APARTMENT: 'Appartment:',
        FLOOR: 'Floor:',
        ENTRANCE: 'Entrance:',
        PREDEFINED_LOCATION: 'Predefined location:',
        WHEN: 'When',
        AVAILABLE_TERMIN: 'Available period:',
        VALUE: 'Value:',
        CARD_TYPE: 'Card type:',
        NOTE: 'Comment',
        NOTE_MSG: 'Please enter Your comment for delivery',
        ENTER_ACCOUNT: 'Log in to account',
        USERNAME: 'Username',
        PASSWORD: 'Password',
        ENTER: 'Log in',
        OR: 'or',
        NEW_ACCOUNT: 'Create new account',
        REGISTER: 'Register',
        USER_TYPE: 'Account type',
        BUYER: 'Buyer',
        DISTRIBUTOR: 'Distributor',
        FARMER: 'Farmer',
        EMAIL: 'E-Mail address',
        CONFIRM_PASSWORD: 'Confirm password',
        STREET_AND_NUMBER: 'Street and number',
        POSTAL_CODE: 'Postal code',
        PHONE_NUMBER: 'Telephone number',
        COMPANY_NAME: 'Company name',
        FARM_NAME: 'Farm name',
        LOCATION: 'Location',
        FARMER_ID:'Farmer ID',
        ITEM: 'Item',
        PRICE: 'Price per item',
        ITEM_AMOUNT:'Item amount',
        MONEY_AMOUNT: 'Total price',
        ITEM_ID: 'Item ID: ',
        SEARCHED_PRODUCTS: 'Searched products',
        ALL_PRODUCTS: 'All products',
        ADD_TO_CART: 'Add to cart',
        DISTRIBUTOR_TITLE: 'Everyday items transport',
        VEHICLES: 'VEHICLES',
        NUMBER_OF_VEHICLES: 'Vehicles number',
        COOLED_TRANSPORT: 'Cooled transport',
        TRANSPORT_VOLUME: 'Volume for transport',
        TRANSPORT_WEIGHT: 'Weight for transport',
        MAX_PRICE: 'Maximum price',
        MIN_AMOUNT: 'Minimal amount',
        CANCEL_SEARCH: 'Cancel search',
        VEGETABLES: 'Vegetables',
        FRUIT: 'Fruits',
        MEAT_AND_MEAT_PRODUCTS: 'Meat and meat products',
        MILK_AND_DAIRES: 'Milk and dairy',
        HONEY_PRODUCTS: 'Honey products',
        EGGS: 'Eggs',
        GRAINS_AND_FLOUR: 'Grains and flour',
        MUSHROUMS: 'Mushrooms',
        DRIED_FRUIT_AND_NUTS: 'Dried fruit and nuts',
        DRIED_VEGETABLES: 'Dried vegetables',
        WINTER_STORES: 'Winter stores',
        NON_ALCOHOL_AND_SIRUPS: 'Beverages and syrup',
        ALCOHOL_DRINKS: 'Alcohol drinks',
        SWEETS: 'Sweets',
        BAGELS: 'Bagels',
        COSMETICS_AND_HYGIENE: 'Cosmetic and hygiene',
        ORGANIC_PRODUCTS: 'Organic products',
        BASKETS: 'Baskets',
        FLOWERS_AND_SEEDLINGS: 'Flowers and seedlings',
        FISH_PRODUCTS: 'Fish products',
        TOMATO: 'Tomato',
        CUCUMBER: 'Cucumber',
        SPRING_ONION: 'Spring onion',
        APPLE: 'Apple',
        PEAR: 'Pear',
        STRAWBERRY: 'Strawberry',
        LAMB: 'Lamb',
        SAUSAGE: 'Sausage',
        CHICKEN: 'Chicken',
        MILK: 'Milk',
        YOGHURT: 'Yoghurt',
        CHEESE: 'Cheese',
        ACACIA_HONEY: 'Acacia honey',
        MEADOW_HONEY: 'Meadow honey',
        CHICKEN_EGGS: 'Eggs',
        OATS: 'Oats',
        BARLEY: 'Barley',
        FLOUR: 'Flour',
        CHAMPIGNIONS: 'Champignongs',
        WALNUT: 'Walnut',
        NUT: 'Nut',
        DRY_FIGS: 'Dry figs',
        DRY_PAPRIKA: 'Dry paprika',
        PICKLES: 'Pickle',
        BRINE: 'Brine',
        HOMEMADE_JUICE: 'Homemade juice',
        GRAPE_JUICE: 'Grape juice',
        SIRYP: 'Siryp',
        SCHNAPS: 'Schnaps',
        WINE: 'Wins',
        BEER: 'Beer',
        CHOCOLATE: 'Chocolate',
        CANDY: 'Candy',
        BREAD: 'Bread',
        ROOL: 'Rool',
        SOAP: 'Soap',
        SHAMPOO: 'Shampoo',
        ORGANIC_APPLE: 'Organic apple',
        ORGANIC_CABBAGE: 'Organic cabbage',
        OGRANIC_STRAWBERRY: 'Organic strawberry',
        BASKET: 'Basket',
        HANDBAG: 'Handbag',
        PETUNIA: 'Petunia',
        ROSE: 'Rose',
        TROUT: 'Trout',
        SEARCH_PRODUCTS: 'Search products',
        ALL_RIGHTS_RESERVED: 'All rights reserved',
        NON_ORGANIC: 'Non-organic'
    })
        .translations('rs', {
            HOME: 'Početna',
            SHOP: 'Prodavnica',
            BLOG: 'Blog',
            FOR_FARMERS: 'Za prodavce',
            FOR_DISTRIBUTORS: 'Za distributere',
            SEARCH: 'Pretraga',
            NEAR_YOU: 'U vašoj okolini',
            IN_CIRCLE_OF: 'U krugu od',
            CHOOSE_DISTANCE: 'Izaberi udaljenost',
            VIEW_OFFER: 'Pogledaj ponudu',
            ACCOUNT: 'Nalog',
            WISHLIST: 'Lista želja',
            SHOPPING: 'Kupovina',
            CART: 'Pregled korpe',
            LOGIN: 'Prijava',
            CONTACT: 'Kontaktirajte nas',
            PRODUCTS: 'Proizvodi',
            PRODUCT_DETAILS: 'Detalji proizvoda',
            BLOG_LIST: 'Lista blogova',
            ONE_BLOG: 'Jedan blog',
            SEARCH_RESET: 'Poništi izbor za pretragu',
            PAY: ' Plaćanje',
            DELIVERY: 'Dostava',
            TOTAL: 'Ukupno',
            UPDATE_CART: 'Nastavi naručivanje',
            EMPTY_CART: 'Isprazni korpu',
            DIALOG_EMPTY_CART_QUESTION: 'Da li želite da uklonite sve stavke iz Vaše korpe?',
            YES: 'Da',
            NO: 'Ne',
            YOUR_LOCATION: 'Vaša lokacija',
            CATEGORY: 'Kategorija',
            LOCATION_PLACE: 'Mesto',
            LOCATION_FOUND: 'Lokacija pronađena',
            MARKETING_SPACE: 'Najistaknutiji farmeri',
            ADVERTISING: 'Reklame',
            MOST_IN_YEAR: 'Najviše prodali u toku godine',
            MOST_DIFFERENT: 'Najviše različitih proizvoda',
            MOST_ORDERS: 'Najviše porudžbina',
            ABOUT_US: 'O nama',
            TITLE_1: 'Kupovina svakodnevnih namirnica',
            TITLE_2: 'direktno od proizvođača',
            TITLE_3: 'Pratite naš blog',
            ORDER: 'Narudžbina',
            ORDER_DATA_SUFFIX: 'podaci za Vašu isporuku',
            WHO: 'Kome',
            NAME_SURNAME: 'Ime i prezime',
            WHERE: 'Gde',
            CHOOSE_CITY: 'Izaberite grad:',
            CITY: 'Grad',
            STREET: 'Ulica:',
            HOUSE_NUMBER: 'Broj:',
            APARTMENT: 'Stan:',
            FLOOR: 'Sprat:',
            ENTRANCE: 'Ulaz:',
            PREDEFINED_LOCATION: 'Predefinisana lokacija:',
            WHEN: 'Kada',
            AVAILABLE_TERMIN: 'Vreme dostave:',
            VALUE: 'Vrednost',
            CARD_TYPE: 'Vrsta kartice:',
            NOTE: 'Napomena',
            NOTE_MSG: 'Molimo unesite napomenu za Vašu isporuku',
            ENTER_ACCOUNT: 'Pristupi svom nalogu',
            USERNAME: 'Korisničko ime',
            PASSWORD: 'Lozinka',
            ENTER: 'Prijavi se',
            OR: 'ili',
            NEW_ACCOUNT: 'Postani novi korisnik',
            REGISTER: 'Registruj se',
            USER_TYPE: 'Tip korisnika',
            BUYER: 'Kupac',
            DISTRIBUTOR: 'Dostavljač',
            FARMER: 'Farmer',
            EMAIL: 'E-Mail adresa',
            CONFIRM_PASSWORD: 'Potvrdi lozinku',
            STREET_AND_NUMBER: 'Ulica i broj',
            POSTAL_CODE: 'Poštanski broj',
            PHONE_NUMBER: 'Broj telefona',
            COMPANY_NAME: 'Ime kompanije',
            FARM_NAME: 'Ime farme',
            LOCATION: 'Lokacija',
            FARMER_ID: 'ID farmera',
            ITEM: 'Proizvod',
            PRICE: 'Cena po jedinici mere',
            ITEM_AMOUNT: 'Količina',
            MONEY_AMOUNT: 'Ukupna cena',
            ITEM_ID: 'ID proizvoda: ',
            SEARCHED_PRODUCTS: 'Traženi proizvodi',
            ALL_PRODUCTS: 'Svi proizvodi',
            ADD_TO_CART: 'Dodaj u korpu',
            DISTRIBUTOR_TITLE: 'Prevoz svakodnevnih namirnica',
            VEHICLES: 'Vozni park',
            NUMBER_OF_VEHICLES: 'Broj vozila',
            COOLED_TRANSPORT: 'Rashlađen prevoz',
            TRANSPORT_VOLUME: 'Gabariti za prevoz',
            TRANSPORT_WEIGHT: 'Težina za prevoz',
            MAX_PRICE: 'Maksimalna cena',
            MIN_AMOUNT: 'Minimalna količina',
            CANCEL_SEARCH: 'Poništi pretragu',
            VEGETABLES: 'Povrće',
            FRUIT: 'Voće',
            MEAT_AND_MEAT_PRODUCTS: 'Meso i mesne prerađevine',
            MILK_AND_DAIRES: 'Mleko i mlečni proizvodi',
            HONEY_PRODUCTS: 'Med i pčelinji proizvodi',
            EGGS: 'Jaja',
            GRAINS_AND_FLOUR: 'Zrna i brašno',
            MUSHROUMS: 'Pečurke',
            DRIED_FRUIT_AND_NUTS: 'Sušeno voće i orašasti plodovi',
            DRIED_VEGETABLES: 'Sušeno povrće',
            WINTER_STORES: 'Zimnica',
            NON_ALCOHOL_AND_SIRUPS: 'Bezalkoholna pića i sirupi',
            ALCOHOL_DRINKS: 'Alkoholna pića',
            SWEETS: 'Slatkiši',
            BAGELS: 'Peciva',
            COSMETICS_AND_HYGIENE: 'Kozmetika i higijena',
            ORGANIC_PRODUCTS: 'Organski proizvodi',
            BASKETS: 'Gotove korpe',
            FLOWERS_AND_SEEDLINGS: 'Cveće i sadnice',
            FISH_PRODUCTS: 'Riba i riblji proizvodi',
            TOMATO: 'Paradajz',
            CUCUMBER: 'Krastavac',
            SPRING_ONION: 'Mladi luk',
            APPLE: 'Jabuka',
            PEAR: 'Kruška',
            STRAWBERRY: 'Jagoda',
            LAMB: 'Jagnjetina',
            SAUSAGE: 'Kobasica',
            CHICKEN: 'Piletina',
            MILK: 'Mleko',
            YOGHURT: 'Jogurt',
            CHEESE: 'Sir',
            ACACIA_HONEY: 'Bagremov med',
            MEADOW_HONEY: 'Livaski med',
            CHICKEN_EGGS: 'Kokošija jaja',
            OATS: 'Ovas',
            BARLEY: 'Ječam',
            FLOUR: 'Brašno',
            CHAMPIGNIONS: 'Šampinjoni',
            WALNUT: 'Orah',
            NUT: 'Lešnik',
            DRY_FIGS: 'Suve smokve',
            DRY_PAPRIKA: 'Suva paprika',
            PICKLES: 'Kornišoni',
            BRINE: 'Turšija',
            HOMEMADE_JUICE: 'Domaći sok',
            GRAPE_JUICE: 'Sok od grožđa',
            SIRYP: 'Sirup',
            SCHNAPS: 'Rakija',
            WINE: 'Vino',
            BEER: 'Pivo',
            CHOCOLATE: 'Čokolada',
            CANDY: 'Bombone',
            BREAD: 'Hleb',
            ROOL: 'Kifla',
            SOAP: 'Sapun',
            SHAMPOO: 'Šampon',
            ORGANIC_APPLE: 'Organska jabuka',
            ORGANIC_CABBAGE: 'Organska zelena salata',
            OGRANIC_STRAWBERRY: 'Organske jagode',
            BASKET: 'Korpa',
            HANDBAG: 'Tašna',
            PETUNIA: 'Petunije',
            ROSE: 'Ruže',
            TROUT: 'Pastrmka',
            SEARCH_PRODUCTS: 'Proizvodi za pretragu',
            ALL_RIGHTS_RESERVED: 'Sva prava zadržana',
            NON_ORGANIC: 'Neorganski'
        })
    $translateProvider.preferredLanguage('en');
});