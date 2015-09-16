var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'LocalStorageModule',
    'GeoLocationService', 'CartService', 'WishlistService', 'SearchService',
    'ui-rangeSlider', 'cgBusy', 'brantwills.paging', 'pascalprecht.translate'])
    .filter('html', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
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
        BLOG_ONE: 'One blog',
        SEARCH_RESET: 'Reset search parameters',
        PAY: 'Payment',
        DELIVERY: 'Delivery',
        TOTAL: 'Total',
        UPDATE_CART : 'Update cart',
        EMPTY_CART : 'Empty cart',
        DIALOG_EMPTY_CART_QUESTION : 'Do you want to remove all items from your cart?',
        YES: 'Yes',
        NO : 'No',
        YOUR_LOCATION: 'Your location',
        CATEGORY: 'Category',
        LOCATION_PLACE: 'Location',
        MARKETING_SPACE: 'Advertising space',
        ADVERTISING: 'Advertising',
        MOST_IN_YEAR: 'The most sales in a year',
        MOST_DIFFERENT: 'The most different products',
        MOST_ORDERS: 'The most orders',
        ABOUT_US: 'About us',
        TITLE_1: 'Everyday items shop',
        TITLE_2: 'direct from farmers',
        TITLE_3: 'Follow our blog'
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
            LOGIN: 'Ulaz',
            CONTACT: 'Kontaktirajte nas',
            PRODUCTS: 'Proizvodi',
            PRODUCT_DETAILS: 'Detalji proizvoda',
            BLOG_LIST: 'Lista blogova',
            BLOG_ONE: 'Jedan blog',
            SEARCH_RESET: 'Poništi izbor za pretragu',
            PAY: ' Plaćanje',
            DELIVERY: 'Dostava',
            TOTAL: 'Ukupno',
            UPDATE_CART : 'Nastavi naručivanje',
            EMPTY_CART : 'Ispravni korpu',
            DIALOG_EMPTY_CART_QUESTION : 'Da li želite da uklonite sve stavke iz Vaše korpe?',
            YES: 'Da',
            NO : 'Ne',
            YOUR_LOCATION: 'Vaša lokacija',
            CATEGORY: 'Kategorija',
            LOCATION_PLACE: 'Mesto',
            MARKETING_SPACE: 'Reklamni prostor',
            ADVERTISING: 'Reklame',
            MOST_IN_YEAR: 'Najviše prodali u toku godine',
            MOST_DIFFERENT: 'Najviše različitih proizvoda',
            MOST_ORDERS: 'Najviše porudžbina',
            ABOUT_US: 'O nama',
            TITLE_1: 'Kupovina svakodnevnih namirnica',
            TITLE_2: 'direktno od proizvođača',
            TITLE_3: 'Pratite naš blog'
        });
    $translateProvider.preferredLanguage('en');
});