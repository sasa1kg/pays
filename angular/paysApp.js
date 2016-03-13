var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'ngAnimate', 'LocalStorageModule',
        'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 'DistributorService', 'FarmerService', 'UserService', 'OrderService',
        'ui-rangeSlider', 'cgBusy', 'brantwills.paging', 'pascalprecht.translate', 'ui.bootstrap', 'ui-notification', 'flow', 'monospaced.qrcode', 'dbaq.google.directions',
        'angularUtils.directives.dirPagination'])
    .filter('html', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    }).filter('slice', function () {
        return function (arr, start, end) {
            return arr.slice(start, end);
        };
    }).filter('orderStatus', function () {
        return function (code) {
            var ret = code;
            switch (code) {
                case 'C':
                    ret = "CREATED";
                    break;
                case 'A':
                    ret = "ACTIVE";
                    break;
                case 'T':
                    ret = "TRANSPORT";
                    break;
                case 'D':
                    ret = "DELIVERED";
                    break;
                case 'P':
                    ret = "PAID";
                    break;
                default:
                    ret = code;
                    break;
            }
            return ret;
        }
    }).filter('orderItemStatus', function () {
        return function (code) {
            var ret = "N/A";
            switch (code) {
                case 'A':
                    ret = "YES";
                    break;
                case 'R':
                    ret = "NO";
                    break;
                default:
                    ret = code;
                    break;
            }
            return ret;
        }
    }).config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: 'upload.php',
            permanentErrors: [404, 500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4,
            singleFile: true
        };
        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', arguments);
        });
        // Can be used with different implementations of Flow.js
        // flowFactoryProvider.factory = fustyFlowFactory;
    }]).config(function (NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'center',
            positionY: 'top'
        });
    }).config(
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    );

paysApp.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('paysApp');
});

paysApp.filter("htmlSafe", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);

paysApp.run(function ($rootScope, $location, $anchorScroll) {
    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
        if ($location.hash()) $anchorScroll();
    });
});

paysApp.run(function ($rootScope, $translate, $location, $window, $filter, Notification, SearchService, UserService) {

    $rootScope.englishLangCode = "en_EN";
    $rootScope.serbianLangCode = "rs_RS";

    $rootScope.currentLang = $rootScope.serbianLangCode;

    var storedLang = UserService.getDefaultLanguage();
    if (storedLang != null) {
        $rootScope.currentLang = storedLang;
    }

    $rootScope.translate = function (lang) {
        $rootScope.currentLang = lang;
        $rootScope.waitMsg = $filter('translate')('WAIT_MSG');
        $rootScope.loadMsg = $filter('translate')('LOAD_MSG');
        UserService.storeDefaultLanguage(lang);
        $translate.use(lang);
    };

    $rootScope.translate($rootScope.currentLang);

    $rootScope.lastPage = "#/";
    $rootScope.credentials = UserService.getUserCredentials();
    $rootScope.$on('$routeChangeStart', function (event, next) {
        console.log($location.url());
        if (next.restricted) {
            if ($rootScope.credentials.role && ($rootScope.credentials.role === next.allow)) {
                if ($rootScope.credentials.role && (next.params.id == $rootScope.credentials.id)) {
                    $rootScope.lastPage = "#" + $location.url();
                } else {
                    Notification.error({message: $filter('translate')('ACCESS_NOT_ALLOWED')});
                    $window.location.href = $rootScope.lastPage;
                }
            } else {
                Notification.error({message: $filter('translate')('ACCESS_NOT_ALLOWED')});
                $window.location.href = $rootScope.lastPage;
            }
        } else {
            $rootScope.lastPage = "#" + $location.url();
        }
    });

    $rootScope.paysCompanyInfo = {
        title1: 'AGENCIJA ZA RAČUNARSKI INŽENJERING',
        title2: 'INDUSTRIAL PROJECT',
        description: 'Distributer PAYS sistema za Srbiju',
        address: 'Milana Rakića 16/7',
        city: '21000 Novi Sad ',
        phone: '+381-21-455071',
        activityNum: '6201 ',
        companyNum: '62552778',
        pib: '107176348',
        bankNum: '200-2596270201891-47'
    }
    $rootScope.paysEMail = 'office@pays-system.com';
    $rootScope.paysPhone = '+38121455071';
    $rootScope.showFooter = false;
    $rootScope.buyerUserType = 'C';
    $rootScope.farmerUserType = 'F';
    $rootScope.distributorUserType = 'T';
    $rootScope.bannerPicsLimit = 5;
    $rootScope.waitMsg = $filter('translate')('WAIT_MSG');
    $rootScope.loadMsg = $filter('translate')('LOAD_MSG');
    $rootScope.saveInfoMsg = $filter('translate')('SAVE_INFO_MSG');
    $rootScope.uploadImgMsg = $filter('translate')('UPLOAD_IMAGE_MSG');
    $rootScope.loadImgMsg = $filter('translate')('LOAD_IMAGE_MSG');
    $rootScope.range = function (n) {
        return new Array(n);
    };


    $rootScope.transportDistances = [
        0, 20, 40, 60, 80, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500
    ];
    $rootScope.transportWeights = [
        0, 5, 10, 15, 20, 30, 40, 50, 65, 80, 100, 150, 200, 300, 400, 500
    ];

    $rootScope.maxItemsPerPage = 15;
    $rootScope.maxItemsPerPagePictures = 8;

    $rootScope.paysEMail = 'office@pays-system.com';

    $rootScope.serverURL = "http://148.6.81.216/PEP/PaysRest/";
    $rootScope.serverImagesURL = "http://148.6.81.216/PaysImages/";

    $rootScope.undefinedImageId = -1;

    SearchService.getCurrencies().then(function (data) {
        $rootScope.currencies = data;
        angular.forEach($rootScope.currencies, function (currency) {
            if (currency.code === "RSD") {
                $rootScope.defaultCurrency = currency;
            }
        })
    });

    SearchService.getAllProducts().then(function (data) {
        $rootScope.allProducts = data;
    });

    SearchService.getMeasurementUnits().then(function (data) {
        $rootScope.measures = data;
    });

    $rootScope.getNumericOrderStatus = function (statusAlpha) {
        var ret = 0;
        switch (statusAlpha) {
            case 'C':
                ret = 1;
                break;
            case 'A':
                ret = 2;
                break;
            case 'T':
                ret = 3;
                break;
            case 'D':
                ret = 4;
                break;
            case 'P':
                ret = 5;
                break;
            default:
                break;
        }
        return ret;
    }

    $rootScope.getCurrencyObjectFromCode = function (code) {
        var retVal = {};
        angular.forEach($rootScope.currencies, function (currency) {
            if (currency.code === code) {
                retVal = currency;
            }
        });
        return retVal;
    };

    $rootScope.logout = function () {
        UserService.logoutUser();
    }

    $rootScope.isLoggedIn = function () {
        $rootScope.credentials = UserService.getUserCredentials();
        if ($rootScope.credentials.token != null) {
            return true;
        }
        return false;
    }

    $rootScope.goToProfile = function () {
        $rootScope.credentials = UserService.getUserCredentials();
        if ($rootScope.credentials.token != null) {
            if ($rootScope.credentials.role == $rootScope.farmerUserType) {
                $location.path("/farmeredit/" + $rootScope.credentials.id);
            } else if ($rootScope.credentials.role == $rootScope.distributorUserType) {
                $location.path('/distributoredit/' + $rootScope.credentials.id);
            } else if ($rootScope.credentials.role == $rootScope.buyerUserType) {
                $location.path('/buyeredit/' + $rootScope.credentials.id);
            }
        }
    }
});

paysApp.config(function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.translations('en_EN', {
            HOME: 'Home',
            SHOP: 'Shop',
            BLOG: 'Blog',
            FOR_FARMERS: 'For farmers',
            FOR_DISTRIBUTORS: 'Distributors',
            SEARCH: 'Search',
            NEAR_YOU: 'Near you',
            IN_CIRCLE_OF: 'In circle of',
            CHOOSE_DISTANCE: 'Select a distance',
            VIEW_OFFER: 'View Offer',
            ACCOUNT: 'My Profile',
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
            TITLE_11: 'The first marketplace for selling and buying fresh goods directly from farmers',
            TITLE_2: 'Direct from farmers',
            TITLE_22: 'Choose among variety of products and find best price for yourself',
            TITLE_3: 'Delivery to you',
            TITLE_33: 'Find best farmer using previous customers opinions and top picks',
            ADVERTISING_MSG: 'PAYS system is designed to make buying fresh products easier. Users can choose farmer and and set of products they want to buy.Furthermore, obtaining best price and fastest transport is included',
            ORDER: 'Order',
            ORDER_DATA_SUFFIX: 'Information about your order\'s delivery',
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
            ENTER_ACCOUNT: 'Log in to my profile',
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
            FARMER_ID: 'Farmer ID',
            ITEM: 'Item',
            PRICE: 'Price per item',
            ITEM_AMOUNT: 'Item amount',
            MONEY_AMOUNT: 'Total price',
            ITEM_ID: 'Item ID: ',
            SEARCHED_PRODUCTS: 'Searched products',
            ALL_PRODUCTS: 'All products',
            ADD_TO_CART: 'Add to cart',
            DISTRIBUTOR_TITLE: 'Everyday items transport',
            DISTRIBUTOR_MSG: 'Get your products on your address while they are still fresh ',
            FARMER_MSG: 'Buy fresh products everyday for you and your family ',
            VEHICLES: 'VEHICLES',
            NUMBER_OF_VEHICLES: 'Vehicles number',
            COOLED_TRANSPORT: 'Cooled transport',
            TRANSPORT_VOLUME: 'Volume for transport',
            TRANSPORT_WEIGHT: 'Weight for transport',
            MAX_PRICE: 'Maximum price',
            MIN_AMOUNT: 'Minimal amount',
            CANCEL_SEARCH: 'Change search criteria',
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
            NON_ORGANIC: 'Non-organic',
            DELIVERY_OPTION: 'If not checked, farmer will consider you will pick up your order',
            BANK_NUMBER: "Bank account number",
            COMPANY_REG_NUMBER: "Company identification number",
            INVALID_CREDENTIALS: "Invalid credentials",
            HELP: "Help",
            INFO: "Info",
            HELP_CENTER: "Help Center",
            COMPLAINT: "File a Complaint",
            EDIT_DISTRIBUTOR_DATA: "Distributor data",
            EDIT_FARMER_DATA: "Farmer data",
            GENERAL_DISTRIBUTOR_DATA: "General information",
            VEHICLES: "Vehicles",
            DISTRIBUTOR_MARKETING: "Advertising materials",
            DISTRIBUTOR_PRICES: "Price list",
            SAVE_CHANGES: "Save changes",
            ADD_NEW_VEHICLE: "Add new vehicle",
            ADD_NEW_PRODUCT: "Add new product",
            VEHICLE_MODEL: "Vehicle model",
            VEHICLE_PROPERTIES: "Vehicle properties",
            VEHICLE_IMAGE: "Vehicle image",
            ACTIONS: "Actions",
            UPDATE: "Update",
            DELETE: "Delete",
            VEHICLE_EDIT: "Add/Update vehicle",
            PRODUCT_EDIT: "Add/Update product",
            ORDER_EDIT: "Order details",
            DISCARD_CHANGES: "Discard changes",
            HEIGHT: "Height",
            WIDTH: "Width",
            DEPTH: "Depth",
            SELECT_IMAGE: "Select image",
            DISTRIBUTOR_ADVERTISING_TITLE: "Advertising title",
            DISTRIBUTOR_ADVERTISING_MSG: "Advertising message",
            BANNER_PICTURES: "Pictures for banner",
            DISTRIBUTOR_PRICE_LIST: "Distributor price list",
            DISTANCE: "Distance",
            WEIGHT: "Weight",
            PRICE_PER_KM: "Price per km",
            VEHICLE_MAX_LOAD: "Maximum load weight per vehicle",
            ADD_TO_WISHLIST: "Add to wishlist",
            REMOVE_FROM_WISHLIST: "Remove from wishlist",
            REMOVED_FROM_WISHLIST: "Item removed from wishlist",
            ITEM_ADDED_TO_CART: "Item added to the cart",
            DISTRIBUTOR_NAME: "Distributor name",
            FARMER_NAME: "Farmer name",
            NAME: "Name",
            SURNAME: "Surname",
            PIB: "Tax number",
            BUSSINESS_ACT_NUMBER: "Bussiness activity number",
            FAX_NUMBER: "Fax number",
            USER_NOT_ADDED: "Failed to add user",
            PASSWORD_MATCH: "Passwords are identical",
            PASSWORD_NOT_MATCH: "Passwords do not match",
            ACTIVATION_LINK_SENT_MSG: "User has been successfully added! Activation link is sent to your e-mail address.Please activate your profile and try to log in.",
            USER_ACTIVATION: "Activate profile",
            VEHICLE_DELETED: "Vehicle successfully deleted",
            VEHICLE_NOT_DELETED: "Unable to delete vehicle",
            VEHICLE_UPDATED: "Vehicle successfully updated",
            VEHICLE_NOT_UPDATED: "Unable to update vehicle",
            VEHICLE_ADDED: "Vehicle successfully added",
            VEHICLE_NOT_ADDED: "Unable to add vehicle",
            ADVERTISING_INFO_UPDATED: "Advertising information successfully updated",
            ADVERTISING_INFO_NOT_UPDATED: "Unable to update advertising information",
            GENERAL_INFO_UPDATED: "General information successfully updated",
            GENERAL_INFO_NOT_UPDATED: "Unable to update general information",
            LOGOUT: "Log out",
            GENERAL_FARMER_DATA: "General Information",
            ORDERS: "Orders",
            FARMER_MARKETING: "Advertising materials",
            FARMER_PRICES: "Price list",
            PRODUCT_NAME: "Product name",
            PRODUCT_PROPERTIES: "Product properties",
            PRODUCT_IMAGE: "Product image",
            PRODUCT_PRICE: "Price",
            PRODUCT_TOTAL_PRICE: "Total Price",
            PRODUCT_QUANTITY: "Quantity",
            PRODUCT_DELETED: "Product successfully deleted",
            PRODUCT_NOT_DELETED: "Unable to delete product",
            PRODUCT_UPDATED: "Product successfully updated",
            PRODUCT_NOT_UPDATED: "Unable to update product",
            PRODUCT_ADDED: "Product successfully added",
            PRODUCT_NOT_ADDED: "Unable to add product",
            ORDER_QR_CODE: "Order QR Code",
            CURRENCY: "Currency",
            MEASURE_UNIT: "Measure Unit",
            DETAILS: "Details",
            CLIENT_NAME: "Client",
            PRODUCT_NUMBER: "Products number",
            STATUS: "Status",
            CLIENT_ADDRESS: "Address",
            DELIVERY_DATE: "Delivery Date",
            DELIVERY_TIME: "Delivery Time",
            ITEMS: "Items",
            CLOSE: "Close",
            UNABLE_CART_INSERT: "Products of another farmer are present in cart. Please add this farmer's products to wishlist and move them to cart once you finish current order.",
            NO_PREDEFINED_LOCATIONS: "You are not logged in at the moment. Please log in to see previous delivery locations of your account.",
            NO_LOGIN_CHECKOUT: "You are not logged in at the moment. Please log in to finish your order.",
            NO_ORDER_CREATED: "You haven't created your order yet. Please create one.",
            FROM: "From",
            TO: "To",
            ORDER_CREATED: "Order successfully created!",
            ORDER_NOT_CREATED: "Unable to create order!",
            NO_IMAGE_PROVIDED: "No image provided",
            VEHICLE_IMAGE_UPLOADED: "Vehicle image uploaded",
            VEHICLE_IMAGE_FAILURE: "Failed to upload vehicle image",
            PRODUCT_IMAGE_UPLOADED: "Product image uploaded",
            PRODUCT_IMAGE_FAILURE: "Failed to upload product image",
            ACCESS_NOT_ALLOWED: "You are not allowed to access this page. Please login with valid credentials.",
            PROFILE_IMAGE_FAILURE: "Failed to upload profile image",
            PROFILE_IMAGE_UPLOADED: "Profile image uploaded",
            BANNER_IMAGE_UPLOADED: "Banner image uploaded",
            BANNER_IMAGE_FAILURE: "Failed to upload banner image",
            UPLOAD: "Upload",
            PASSWORD_EMAIL_SENT: 'E-Mail containing link for your password reset is sent to request e-mail address',
            PASSWORD_EMAIL_NOT_SENT: 'Failed to send e-mail for password reset',
            FORGOT_PASS: 'Forgotten password?',
            SEND_EMAIL: 'Send e-mail',
            RESET_PASSWORD: 'Reset password',
            PASSWORD_CHANGED: 'Password successfully changed',
            PASSWORD_NOT_CHANGED: 'Failed to change password',
            ENTER_NEW_PASSWORD: 'Please enter you new password',
            PASSWORD_CHANGED_MSG: 'You have successfully chaned your password. By clicking on OK you will be redirected to login page where you can access your profile.',
            ACTIVATED_USER_MSG: 'You have successfully activated your account. Please visit login page where you can access your profile.',
            NOT_ACTIVATED_USER_MSG: 'Account activation failed. Please contact our support team to resolve this issue.',
            GENERAL_BUYER_DATA: 'General buyer information',
            EDIT_BUYER_DATA: 'Buyer data',
            LEAVE_REVIEW: 'Leave review',
            YOUR_RATING: 'Your rating',
            MAX_250_CHARS_FOR_REVIEW: 'Maximum 250 characters for review',
            REVIEW_TEXT: 'Please enter your review\'s text...',
            SUBMIT_REVIEW: 'Submit review',
            NEW_ADDRESS: 'Enter address',
            PRICES_UPDATED: 'Prices update',
            PRICES_NOT_UPDATED: 'Failed to update prices',
            REVIEW_SUBMITED: 'Review submited',
            REVIEW_NOT_SUBMITED: 'Failed to submit review',
            TRANSPORT_PRICE_LIST: 'Transport price list',
            FARMER_ADVERTISING_TITLE: 'Farmer ',
            FARMER_ADVERTISING_TITLE: "Advertising title",
            FARMER_ADVERTISING_MSG: "Advertising message",
            CREATED: 'Created',
            ACTIVE: 'Active',
            TRANSPORT: 'In transport',
            DELIVERED: 'Delivered',
            PAID: 'Paid',
            GENERATE_QR: 'Generate QR code',
            NUMBER_OF_PACKAGES: 'Number of packages',
            ENTER_NUMBER_OF_PACKAGES: 'Please enter number of packages for order',
            SEND_ORDER: 'Send order',
            ORDER_STATUS_TRANSPORT: 'Order status changed to - In transport',
            NOT_ORDER_STATUS_TRANSPORT: 'Unable to change order status to - In transport',
            FARMER_REVIEWS: 'Farmer reviews',
            POSTED_ON: 'Posted on',
            ORDER_INFO: 'Current status of your order',
            ORDER_MESSAGE: 'You will be notified about payment status via e-mail. You can observe further progress of your order on your profile.',
            MAIN_PAGE: 'Go to home page',
            MAX_AVAILABLE: 'Maximum available',
            REVERT_IMAGE: 'Use default image',
            EMPTY_WISHLIST_MESSAGE: 'Your wishlist is empty. Please visit main page, search for desired products and add them to you wishlist.',
            PRINT: 'Print',
            DOWNLOAD: 'Download',
            NO_QR_GENERATION: 'Generation of QR code in not possible at the moment.Please wait for the money transaction for the order to be performed.',
            NO_REVIEWS_MESSAGE: 'There are no reviews for this farmer. Buy products from this farmer and be the first one to leave a review!',
            WAIT_MSG: 'Please wait',
            LOAD_MSG: 'Loading...',
            CALCULATE_TRANSPORT_PRICE: 'Preview transport price',
            REQUIRED_FIELDS: 'Required fields',
            PRODUCT_IMAGE_REVERTED: 'Product image reverted',
            PRODUCT_IMAGE_NOT_REVERTED: 'Product image not reverted',
            SAVE_INFO_MSG: 'Saving information',
            UPLOAD_IMAGE_MSG: 'Uploading image',
            LOAD_IMAGE_MSG: 'Loading new image',
            ACCEPTED: 'Accepted',
            YES: 'Yes',
            NO: 'No',
            PRICE_TO_CAPTURE: 'For capture',
            PAYS_COMPANY_INFO: 'Information about company',
            OFFERED_GOODS: 'Offered service declaration',
            ACCEPT_TERMS_OF_SERVICE: 'I accept terms of service',
            TERMS_OF_SERVICE: 'Terms of service',
            SAVE_ADDRESS: 'Save address',
            ORDINAL: 'Ordinal',
            PRICE_PER_UNIT: 'Price per unit',
            TAX: 'Tax',
            TAX_AMOUNT: 'Tax amount',
            TRANSPORT_PRICE: 'Transport price',
            TOTAL_PAY_PRICE: 'Total price',
            GO_TO_PAYMENT: 'Calculate transport price an proceed to payment',
            TRANSPORT_PRICE_SUCCESS: 'Transport price calculated',
            TRANSPORT_PRICE_FAILED: 'Failed to calculate transport price',
            LOCATION_NOT_FOUND: 'Location not found',
            TOTAL_MASS: 'Total weight',
            FRACTALS_FUNDING: 'This project is funded by FRACTALS (Future Internet Enabled Agricultural Applications, FP7 project No. 632874), under the funding framework of the European Commission.',
            WHO_ARE_WE: 'Who are we?',
            WHO_ARE_WE_ANSWER: 'Owner of PAYS WEBSHOP portal is the company CAM ENGINEERING DOO from Novi Sad, Serbia. Company is oriented on developing modern software solutions and tools, and  implementing activities on e-commerce. ',
            WHAT_ARE_WE_DOING: 'What are we doing? ',
            WHAT_ARE_WE_DOING_ANSWER: 'PAYS SYSTEM is a new concept for online selling of agriculture product that enables money transfer and networking between customer, farmer and deliverer with product traceability.',
            HOW_CAN_WE_HELP: 'How can we help you? ',
            HOW_CAN_WE_HELP_ANSWER: 'PAYS SYSTEM is designed to make buying fresh products easier. Users can choose farmer and products they want to buy. Furthermore, obtaining best prices and fastest transport is included.',
            MAX: 'maximum',
            CHARS: 'characters',
            INFO_WHO_ARE_WE: 'Who are we?',
            INFO_WHAT_WE_DO: 'What are we doing?',
            INFO_HELP_YOU: 'How can we help you?',
            INFO_COMMENTS: 'Comments and sugestions ',
            INFO_DOCUMENTS: 'Documents',
            INFO_WHO_ARE_WE_TEXT: 'Owner of PAYS WEBSHOP portal is the company CAM ENGINEERING DOO from Novi Sad, Serbia. The Company is oriented on developing modern software solutions and tools, and  implementing activities on e-commerce.<br><br>Company information:<br>Full name: CAM ENGINEERING DOO<br>Adress: Filipa Filipovića 8, Novi Sad<br>Phone: 021-455-071<br>Tax number: 107010207<br>Identification number :20723297<br>Website: <a class="info_link" target="_blank" href="http://www.cam.co.rs">www.cam.co.rs</a> <br><br>Authorized distributor of PAYS WEBSHOP for Serbia is the company INDUSTRIAL PROJECT from Novi Sad, Serbia.<br><br>Distributor information:<br>Full name: AGENCIJA ZA RAČUNARSKI INŽENJERING INDUSTRIAL PROJECT <br>Adress: Milana Rakića 16, Novi Sad<br>Phone : 021/455-071<br>Tax number: 107176348<br>Identification number : 62552778<br>Email: <a class="info_link" href="mailto:office@pays-system.com">office@pays-system.com</a><br>',
            INFO_WHAT_WE_DO_TEXT: 'PAYS SYSTEM is a new concept for online selling of agricultural products that enables money transfer between customer, farmer and deliverer with product traceability. This project is funded by FRACTALS (Future Internet Enabled Agricultural Applications, FP7 project No. 632874), under the funding framework  of the European Commission.',
            INFO_HELP_YOU_TEXT: 'PAYS SYSTEM is designed to make buying fresh products easier. Users can choose farmers and products they want to buy. Furthermore, obtaining best prices and fastest transport is included.',
            INFO_COMMENTS_TEXT: 'Please comment and grade your orders in the My profile section of the website. For all other comments and suggestions send us an email on:',
            INFO_DOCUMENTS_TEXT_MANUAL: 'Instruction Manual',
            INFO_DOCUMENTS_TEXT_TOU_FARMER: 'Terms of use – Farmer',
            INFO_DOCUMENTS_TEXT_TOU_DISTRIBUTOR: 'Terms of use – Distributor',
            INFO_DOCUMENTS_TEXT_TOU_BUYER: 'Terms of use – Buyer',
            INFO_DOCUMENTS_TEXT_MANUAL_LINK: 'docs/manual_EN.pdf',
            INFO_DOCUMENTS_TEXT_TOU_FARMER_LINK: 'docs/Terms_of_use_Farmer.pdf',
            INFO_DOCUMENTS_TEXT_TOU_DISTRIBUTOR_LINK: 'docs/Terms_of_use_Distributor.pdf',
            INFO_DOCUMENTS_TEXT_TOU_BUYER_LINK: 'docs/Terms_of_use_Buyer.pdf',
            PREDEFINED_LOCATION: 'PAYS delivery locations',
            TERMS_OF_SERVICE_BUYER_TEXT: ' <h4 class="text-center">TERMS OF USE</h4> <h4 class="text-center">PAYS SYSTEM SERVICE</h4> <p>PAYS WEBSHOP is an online service for purchasing of agricultural products (hereinafter PAYS service) owned by CAM ENGINEERING LTD, headquartered at Filipa Filipovića 8, Novi Sad, Serbia, which on the basis of a separate agreement, for the territory of the Republic of Serbia, conveys the right to manage PAYS service to company "INDUSTRIAL PROJECT" (hereinafter Distributor), based at Milana Rakića 16, 21 000 Novi Sad, Serbia.</p> <p>PAYS service internet address is http://www.pays-system.com.</p> <p>Terms of use define the procedures whose acceptance unambiguously confirms that you agree with the possible limitations of this service has. In addition, we are here to inform you in the best possible way, so to avoid your bringing in any confusion. A more detailed explanation of the technical functioning of the PAYS service is written in the user manuals within which is explained in detail how to use the service.</p> <p>By using the PAYS service you agree to the following terms and conditions of use, so it is considered that you automatically agree to them. Otherwise, PAYS service and distributor are relieved of all responsibility and liability.</p> <h4 class="text-center">TERMS OF PURCHASE</h4> <p>Terms of use define the rules and procedures offered by PAYS services, which consist of, among other things: order preparation, shipping, payments, refunds and complaints about goods. Buyer is any person who orders at least one product by using the service, is registered, thereby accepts all the terms of use envisaged:</p> <p>- Buyer using PAYS orders items, which are delivered to him at the desired address or a predefined point of delivery.</p> <p>- After completion of the order on the Web portal, a buyer receives a list of ordered items with item volume and price, on his e-mail address.</p> <p>- The buyer is obliged to take the ordered products and check the package contents on the delivery site and by using his mobile applications to read the QR code on the package delivered and by his mobile app to make the payment of a part of the order, payment of the entire amount of the order, or completely reject the payment.</p> <p>- Moment of sale is considered to be the moment when the goods are delivered to the delivery site, and with completion of the payment process by scanning the QR code on the package delivered with the goods.</p> <p>- INDUSTRIAL PROJECT is not a VAT payer (by law registration), and all prices on http://www.pays- system.com are shown in the national currency (RSD) without VAT.</p> <p>- The distributor does not guarantee that each ordered item will be delivered.</p> <p>- Distributor has the discretion to, without notification about it, permanently terminate users access to PAYS service, in cases where a user: INTENTIONALLY abusing the service, does not respect the terms and conditions of purchase and use.</p> <p>- This photograph of the item may deviate from the actual article look and please bear that in mind. <p>- Some photos of items show a proposal for the arrangement and are not part of the item in display.</p> <p>- The cost of shipping depends on the package weight and distance for delivery, and will be clearly visible during each order.</p> <h4 class="text-center">REGISTRATION AND DATA SECURITY</h4> <p>If you have not ordered and purchased by PAYS service you must create your user account by signing in at Log in.</p> <p>Log in page provides the registration of all participants in the system: farmers, distributors and buyers. Registration for the buyer consists of a few simple steps (less than 30 seconds) after which you become a registered user of PAYS service. Your e-mail address, password, user name, telephone number and address you enter during registration are sufficient for your use of PAYS WEBSHOP portal and perform all actions in the service (forming a cart, ordering, reservation of funds and confirmation of payment).</p> <p>At the end of the ordering process in order to make your orders processed correctly, please fill out all required information. With the help of this data, farmer or deliverer will be able to provide a quality service in delivering the desired goods.</p> <p>As a user of PAYS services you are responsible for the accuracy of the data entered during registration. Should there be any changes to the data entered during registration, you are required to immediately update your user account on the My Profile page or by written notice to the e-mail: office@pays- system.com and thus inform the customer service of PAYS that changes have occurred.</p> <p>When you register for the PAYS service mandatory step (as indicated above) is to create a password that you need to keep to yourself and it is your responsibility of you share it with others. After registration PAYS service will send you an e-mail to confirm your registration. By registering, you accept the responsibility to communicate with your e-mail address eather about orders, personal data or unsubscribe from the service. If you know or suspect that someone knows your password, or it can be used contrary to your expectations, you can change the password and keep to yourself, and if you are unable to, please contact our Call Center on 021/455-071 on weekdays from 08:00 to 15:00 h or via e- mail address: office@pays-system.com.</p> <p>If, however, there is any doubt in the possibility of the existence of security vulnerabilities, unauthorized use of the Services or violation of the above terms of use, distributor INDUSTRIAL PROJECT reserves the right ask you to change initially defined passwords as well as to revoke your account without notice.</p> <h4 class="text-center">DECLARATION ON THE PROTECTION, COLLECTION AND USE OF PERSONAL DATA</h4> <p>Distributor, INDUSTRIAL PROJECT is obligated to keep and protect the privacy of all users and their data on http://www.pays-system.com and the data obtained shall not be used for other purposes that are not subject to orders nor will it be made available to third parties.</p> <p>In accordance with the business policy PAYS collects only the necessary, basic information about the users of the service. At the user\'s request, we are obliged to provide them with information about the use of their data. All user information is strictly confidential and available only to authorized persons employed in INDUSTRIAL PROJECT (distributor), to which these data are necessary for the performance of work and provision of quality-services. Employees in the company INDUSTRIAL PROJECT are criminally responsible for complying with the principles of privacy protection.</p> <p> If there is a change in PAYS service privacy policy that will be posted in this section at PAYS service web portal.</p> <p>All changes take effect immediately after its publication.</p> <p>Using PAYS service, by releasing a change of privacy policy, you agree with all the changes and accept them entirely.</p> <p>Using PAYS service you give your consent to the policy views expressed and published on the portal.</p> <h4 class="text-center">ORDERING OF GOODS</h4> <p>Ordering of goods can be made 24 hours a day, seven days a week. Product selection can be made without prior notification to the PAYS service, but a log in is required on the PAYS service, when finishing the ordering process.</p> <p>As a buyer, when logging in to the system, you gain the ability to add wanted items in the "Cart overview". You can select items using the "Navigation menu" where items are classified in categories and subcategories by the type.</p> <p>By clicking on "Add to Cart" you can add an item to your cart (Cart overview) with one of these measurment units (piece, kg, l ...). If you have inserted the products of one producer in the "Cart overview", the products of another producer you can insert in the "Wishlist".</p> <p>The amount of ordered items can be changed direct by entry into the field for the amount or with the buttons (+) and (-).</p> <p>Quantities less than the unit presented can be ordered by going to the amount field to enter the desired amount (for example: if you want to order 500g of potatoes, it is necessary to enter in the amount field for the amount of 0.5). When ordering such items, delivered weight of the product can deviate from theoriginally ordered ones (+/- kg). Note: Please bear in mind that such discrepancies occur and can not be regarded as a complaint.</p> <p>Overview of selected products and the amount you can view on the page "Cart overview".</p> <p>The order enters the system only after entry of the data for delivery to the site. Application is set so that each time you order it will offer you the address of previous deliveries (in the drop-down list) that you can choose or change. Note: You have the possibility of changing the address for delivery and it can be added when filling out the data for delivery.</p> <p>To complete the order you need to click on the "payment" in the "Cart overview" and on the “Payment” page check all entered data and by clicking on the payment button you will be redirected to a payment processor in order to perform reservation of funds for payment.</p> <p>It is not possible to add items or change the confirmed purchase order once the payment process has finished, or when your assets are reserved from the card and the order is formed. If you have urgent and immediate cancellation of the entire order, please refer to the email: office@pays-system.com or call our phone 021/455-071.</p> <h4 class="text-center">PREPARATION AND DELIVERY OF GOODS</h4> <p>Before transport, in preparation for delivery, the producer (farmer) packages the goods in appropriate packaging and deliverer ensures proper storage and transportation in his transport vehicle.</p> <p>The possibility of damage to goods in transit is not excluded. Upon delivery of defective and/or damaged goods, you have the right not to pay the amount of the invoice for the cost of the damaged item. The buyer is obliged, when taking over the goods ordered to check for any damage, immediately report it using his/her mobile application for PAYS service and to refuse to take over the damaged goods.</p> <p>Checking the correctness of order upon receipt depends on the customer, and subsequent complaints are respected in accordance with the Serbian Law, through a person responsible for dealing with competent from the company INDUSTRIAL PROJECT. More about the risks that may arise during the delivery of goods, you can find out in paragraphs COMPLAINTS / RETURNS / REFUND.</p> <h4 class="text-center">DELIVERY</h4> <p>Ordered goods producers deliver by their own transport or by using a profesional deliverer (courier), which can be selected from the PAYS system.</p> <p>Dates of delivery shall be determined when ordering and can not be subsequently changed.</p> <h4 class="text-center">PAYMENT OPTIONS</h4> <p>Payment on PAYS service can be made only cashless, through MASTERCARD, VISA and MAESTRO cards.</p> <p>Buyers, who are individual or legal persons, are obligated to pay for the goods ordered on the portal http://www.pays-system.com upon delivery (acknowledgment for the receipt of the package provided by mobile application).</p> <h4 class="text-center">COMPLAINTS / RETURNS / REFUND</h4> <p>On goods, purchased by PAYS service, the customer can file a complaint at the point of delivery by checking the content and quality of the goods ordered by using PAYS mobile application. If you have any complaint you can not resolve upon delivery of the goods it is possible to leave a comment on every order and rate each producer individualy, and you can always send us an e-mail at office@pays- system.com.</p> <p>Employees of the PAYS service are trained to deal with complaints and act according to set rules and terms issued by the PAYS legal entity. An important assumption and a condition for resolving complaints is the full exchange of information with customers and the existence of the invoice and the original packaging (if any) of the goods subject to complaint.</p> <p>The buyer is obliged to keep and submit an invoice and if possible packaging. All complaints arose after the moment of takeover of the delivered package must be considered separately. Complaints will be acceptable only within the framework of the law and regulations of the Republic of Serbia.</p> <p> Upon delivery of the goods the buyer is obliged to:</p> <p> - check the validity of delivery,</p> <p> - compare the goods received with the invoice,</p> <p> - if something is missing immediately note it through PAYS mobile application and to the deliverer.</p> <p> If the complaint is resolved in favor of the buyer, and for the case of inability to deliver another, the replacement for the goods, the Distributor will reimburse the buyer his purchase in the value of goods for which the complaint is accepted.</p> <h4 class="text-center">CHANGES</h4> <p>Distributor may, in accordance with its business policy, without prior notice, update or change the information posted on the Web service http://www.pays-system.com. Distributor reserves the right to change the above terms and conditions of use and not to inform registered users of any changes directly, as they will always be available in the Info section of the PAYS service.</p> <p>If you are a registered user does not agree with the above and offered amendments of the terms and conditions of use and does not want to accept them, it is obliged to contact the Distributor to one of the following ways:</p> <p> - By calling 021 / 455-071 on weekdays from 08:00 to 15:00 and</p> <p> - Sending messages to e-mail address: office@pays-system.com.</p> <p>During the course of this process, the user can not use the PAYS service.</p> <h4 class="text-center">PRICES</h4> <p>All prices on http://www.pays-system.com are presented in the national currency (RSD).</p> <p>Prices at PAYS service are ambiguous in accordance with the Law on Trade of Republic of Serbia.</p> <p>What you pay is the price on the day when you ordered the goods.</p> <p>PAYS system with a large prediction percentage forms its offer, but due to unforeseen circumstances reserves the right to change prices at any time that does not undermine the legality and legitimacy of operations in accordance with legal regulations.</p> <p>If you are not satisfied with the quality of the ordered item, you can return it in compliance with all the above mentioned conditions. Items you can return and we\'ll refund you. All this is done through a service provided PAYS mobile applications.</p> <p>Prices for goods that is measured and which is charged by weight, may deviate up to 10% due to the inability to accurately measure the product. Deviations in weights are minimal, which means you can get a few grams more or less, and the price will be calculated according to the weight you ordered. </p> <h4 class="text-center">COMUNICATION WITH THE USERS</h4> <p>Your phone number (home / mobile) or e-mail address you provide during registration can be used for the purpose of confirming the order and the terms of delivery of the goods ordered.</p> <p>Distributor reserves the right to inform all its registered users at http://www.pays-system.com, periodically by e-mail or by sending an SMS, about new services or items provided under special and different terms then usual.</p> <p>All your questions, suggestions or concerns you can send us to:</p> <p>Phone 021/455-071 on weekdays from 08:00 to 15:00</p> <p>E-mail address: office@pays-system.com</p> <p>All your questions will be answered quickly and professionally.</p> <h4 class="text-center">LIMITATION OF LIABILITY</h4> <p>Distributor under no circumstances will be liable to service user:</p> <p> - For the proper or improper use of PAYS services as well as for any damage done to the equipment used to access the portal, which occurs on that basis, and that the distributor could not prevent.</p> <p> - For any damage suffered by the users proper or improper use of the portal, as well as other information, services, products, advice or products which were reached via links or ads on the service or those who are in any way associated with the PAYS service.</p> <p> - For improper performance or interruption of the service, which is caused directly or indirectly by the forces of nature or other causes beyond reasonable control, which includes: the problems of functioning of the Internet, computer equipment failures, problems in the functioning of telecommunications equipment and devices, power outages, strikes, riots, shortages of content or labor shortages, orders of government or other authority, natural disasters.</p> <p> - For delay in delivery of any kind, as this responsibility lies with the farmer and his selected deliverer.</p> <p>All information available on http://www.pays-system.com, are solely intended for the person who reads them, he familiarises him self with them and gives its consent to the registration. This information shall not be used for commercial purposes for the benefit of third parties, nor is it allowed to distribute unauthorized third parties.</p> <p>For any errors, uncertainties and irregularities shown on the portal, http://www.pays-system.com Distributor is not responsible. Information available on PAYS service should not be regarded as a basis for one-sided assessment of the deviation from its own expectations and preferences.</p> <p>Business risks and deviation from the expressed will of both parties to this business relationship must be viewed realistically, with care and with full harmonization and mutual exchange of all facts and circumstances that can result in economic consequences and damages, tangible and intangible.</p> <p>Registration and acceptance of business conditions with PAYS service, you are actually expressed consent to the Distributor, that he will not be liable for any direct, indirect, incidental, immaterial or material damages, losses or expenses resulting from the use or inability to use some of the information available on the site PAYS service.</p> <p>Distributor does not warrant that PAYS service will always be available and will not contain errors or viruses. Each user expressly agrees to use this service at his or her risk.</p> <p>Business entities whose activities are in media, will be responsible for the damage they can inflict by unauthorized use of information. Distributor reserves the right to seeks damages from such entities to be determined under the provisions of the Law of Obligations, which is valid on the territory of the Republic of Serbia.</p> <p>Participants who use the portal http://www.pays-system.com to order, agree to indemnify Distributor for claims which highlight to them, whether it is in the category of costs, market material damage, non- pecuniary damage or liability for negligent use of materials from the portal including any direct or indirect, material or immaterial damage, regardless of whether the same was caused intentionally or not.</p> <p>Possible non-conformities, interested parties must first attempt to resolve consent and by agreement. If this is not accomplished, competent authority is the court in Novi Sad.</p> <p> <h4 class="text-center">THIRD PARTY SERVICES</h4> <p>Services offered by PAYS service do not imply the existence of costs for computer equipment and services provider to access PAYS service. Distributor is not responsible for telephone or any other charges that may occur in this approach.</p> <p>Please note that http://www.pays-system.com you use solely at your own risk. PAYS service and his Distributor do not guarantee for the business relationship that you have with a third party and can not be held accountable and take responsibility for direct or indirect damages that may suffer by using the services of third parties.</p> <p>Internet is an international computer network which is an independent network which Distributor does not control globally, but only to the extent that it is used for its own purposes, so for these reasons Distributor in any form can not guarantee availability of PAYS services that he does not directly control.</p> <p> <h4 class="text-center">HELP</h4> <p>Different types of assistance when using PAYS service is available in the Info section at http://www.pays- system.com and we assess it would be of benefit. We would advise you to contact us by calling 021/455- 071 on weekdays from 08:00 to 15:00 or by sending an email to: office@pays-system.com.</p> <p>Also, please note that sending private messages by e-mail can be unsafe and subject to unauthorized access by third parties or wrong delivery. Every message received by e-mail will be considered untrustworthy and according to that PAYS service and Distributor are not responsible for the security and privacy of such messages. On the other hand, your messages to us will be distributed only to our official personel who are involved in PAYS service.</p> <p> <h4 class="text-center">PHOTOGRAPHY</h4> <p>Photos on PAYS service http://www.pays-system.com are illustrative and some photos may differ from the actual items for technical reasons and the inability to display layout in the area from all angles.</p> <p>Special note: some items and products displayed in the image of displayed products represent only a proposal for serving and are not part of the ordered products.</p> <h4 class="text-center">INTELLECTUAL PROPERTY</h4> <p>PAYS service http://www.pays-system.com is patent protected and Distributor, company INDUSTRIAL PROJECT exercised sole right to its management. Pictures and texts displayed on PAYS service may not be copied or used in other publications, written or electronic, except with the express permission PAYS service.</p> <p>Using material from PAYS service, all users comply fully with the established here restrictions, conditions and requirements.</p> <p>Date and place</p> <p> 01.03.2016.</p> <p>Novi Sad, Serbia</p> <p>Document issued by PAYS service</p> <h5 class="text-center">This is an electronic document, valid without stamp and signature.</h5>',
            DELIVERY_TIME_PREDEFINED_LOCATION: ' You can pick up your order from PAYS delivery location in time period',
            PREVIOUS_LOCATION : 'Previous locations',
            REGISTERED_DISTRIBUTORS : 'Registered distributors',
            NO_DISTRIBUTORS_FOUND : 'No distributors were found using your criteria. Please retry with different criterias',
            NO_PREVIOUS_LOCATIONS : 'You are not logged in at the moment. Please log in to see previous delivery locations of your account.'
        })
        .translations('rs_RS', {
            HOME: 'Početna',
            SHOP: 'Prodavnica',
            BLOG: 'Blog',
            FOR_FARMERS: 'Za prodavce',
            FOR_DISTRIBUTORS: 'Distributeri',
            SEARCH: 'Pretraga',
            NEAR_YOU: 'U vašoj okolini',
            IN_CIRCLE_OF: 'U krugu od',
            CHOOSE_DISTANCE: 'Izaberi udaljenost',
            VIEW_OFFER: 'Pogledaj ponudu',
            ACCOUNT: 'Moj Profil',
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
            PAY: 'Plaćanje',
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
            MOST_ORDERS: 'Najviše narudžbina',
            ABOUT_US: 'O nama',
            TITLE_1: 'Kupovina svakodnevnih namirnica',
            TITLE_11: 'Prva online prodavnica svežih proizvoda direktno od farmera',
            TITLE_2: 'Direktno od proizvođača',
            TITLE_22: 'Izaberite između mnoštva proizvoda po najboljim cenama',
            TITLE_3: 'Dostava do Vas',
            TITLE_33: 'Nađite najboljeg farmera za Vas koristeći naše preporuke',
            ADVERTISING_MSG: 'PAYS sistem je osmišljen da olakša kupovinu svežih namirnica. Kupci mogu izabrati farmera iz proizvode koje žele da naruče. Takođe, dobijanje najniže cene i najbržeg transporta se podrazumeva',
            ORDER: 'Narudžbina',
            ORDER_DATA_SUFFIX: 'Podaci o Vašoj narudžbini',
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
            ENTER_ACCOUNT: 'Pristupi svom profilu',
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
            DISTRIBUTOR_MSG: 'Dostava Vaših proizvoda na kućnu adresu dok su još sveži',
            FARMER_MSG: 'Kupujte sveže proizvode svaki dan za Vas i Vašu porodicu',
            VEHICLES: 'Vozni park',
            NUMBER_OF_VEHICLES: 'Broj vozila',
            COOLED_TRANSPORT: 'Rashlađen prevoz',
            TRANSPORT_VOLUME: 'Gabariti za prevoz',
            TRANSPORT_WEIGHT: 'Težina za prevoz',
            MAX_PRICE: 'Maksimalna cena',
            MIN_AMOUNT: 'Minimalna količina',
            CANCEL_SEARCH: 'Promeni kriterijume',
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
            NON_ORGANIC: 'Neorganski',
            DELIVERY_OPTION: 'Ukoliko nije odabrana, farmer podrazumeva da ćete sami preuzeti proizvode',
            BANK_NUMBER: "Žiro račun",
            COMPANY_REG_NUMBER: "Matični broj",
            INVALID_CREDENTIALS: "Nepostojeći korisnik",
            HELP: "Pomoć",
            INFO: "Informacije",
            HELP_CENTER: "Korisnička podrška",
            COMPLAINT: "Slanje predloga",
            EDIT_DISTRIBUTOR_DATA: "Informacije o distributeru",
            EDIT_FARMER_DATA: "Informacije o farmeru",
            GENERAL_DISTRIBUTOR_DATA: "Generalne informacije",
            VEHICLES: "Vozila",
            DISTRIBUTOR_MARKETING: "Reklamni materijali",
            DISTRIBUTOR_PRICES: "Cenovnik",
            SAVE_CHANGES: "Sačuvaj izmene",
            ADD_NEW_VEHICLE: "Dodaj novo vozilo",
            ADD_NEW_PRODUCT: "Dodaj novi proizvod",
            VEHICLE_MODEL: "Model vozila",
            VEHICLE_PROPERTIES: "Osobine vozila",
            VEHICLE_IMAGE: "Slika vozila",
            ACTIONS: "Akcije",
            UPDATE: "Izmeni",
            DELETE: "Ukloni",
            VEHICLE_EDIT: "Dodaj/izmeni vozilo",
            PRODUCT_EDIT: "Dodaj/izmeni proizvod",
            ORDER_EDIT: "Detalji narudžbina",
            DISCARD_CHANGES: "Ukloni izmene",
            HEIGHT: "Visina",
            WIDTH: "Širina",
            DEPTH: "Dubina",
            SELECT_IMAGE: "Odaberi sliku",
            DISTRIBUTOR_ADVERTISING_TITLE: "Reklamni naslov",
            DISTRIBUTOR_ADVERTISING_MSG: "Reklamna poruka",
            BANNER_PICTURES: "Silke za baner",
            DISTRIBUTOR_PRICE_LIST: "Cenovnik dostave",
            DISTANCE: "Udaljenost",
            WEIGHT: "Težina",
            PRICE_PER_KM: "Cena po kilometru",
            VEHICLE_MAX_LOAD: "Težina tereta po dostavnom vozilu",
            ADD_TO_WISHLIST: "Dodaj u listu želja",
            REMOVE_FROM_WISHLIST: "Ukloni iz liste želja",
            REMOVED_FROM_WISHLIST: "Proizvod uklonjen iz liste želja",
            ITEM_ADDED_TO_CART: "Proizvod dodat u korpu",
            DISTRIBUTOR_NAME: "Naziv distributera",
            FARMER_NAME: "Naziv farmera",
            NAME: "Ime",
            SURNAME: "Prezime",
            PIB: "PIB",
            BUSSINESS_ACT_NUMBER: "Šifra delatnosti",
            FAX_NUMBER: "Broj faksa",
            USER_NOT_ADDED: "Neuspešno dodavanje korisnika",
            PASSWORD_MATCH: "Lozinke se poklapaju",
            PASSWORD_NOT_MATCH: "Lozinke se ne poklapaju",
            ACTIVATION_LINK_SENT_MSG: "Korisnik je uspešno dodat! Aktivacioni link je poslat na Vašu e-mail adresu. Aktivirajte profil klikom na link i pokušajte da se prijavite.",
            USER_ACTIVATION: "Aktivacija profila",
            VEHICLE_DELETED: "Vozilo uspešno obrisano",
            VEHICLE_NOT_DELETED: "Neuspešno brisanje vozila",
            VEHICLE_UPDATED: "Podaci o vozilu uspešno ažurirani",
            VEHICLE_NOT_UPDATED: "Neuspešna izmena podataka o vozilu",
            VEHICLE_ADDED: "Uspešno dodavanje vozila",
            VEHICLE_NOT_ADDED: "Neuspešno dodavanje vozila",
            ADVERTISING_INFO_UPDATED: "Reklamni sadržaji uspešno ažurirani",
            ADVERTISING_INFO_NOT_UPDATED: "Neuspešno ažuriranje reklamnih sadržaja",
            GENERAL_INFO_UPDATED: "Generalne informacije uspešno ažurirane",
            GENERAL_INFO_NOT_UPDATED: "Neuspešno ažuriranje generalnih informacija",
            LOGOUT: "Odjava",
            GENERAL_FARMER_DATA: "Generalne informacije",
            ORDERS: "Narudžbine",
            FARMER_MARKETING: "Reklamni materijali",
            FARMER_PRICES: "Cenovnik",
            PRODUCT_NAME: "Naziv proizvoda",
            PRODUCT_PROPERTIES: "Osobine proizvoda",
            PRODUCT_IMAGE: "Slika proizvoda",
            PRODUCT_PRICE: "Cena",
            PRODUCT_TOTAL_PRICE: "Ukupna Cena",
            PRODUCT_QUANTITY: "Količina",
            PRODUCT_DELETED: "Proizvod uspešno obrisano",
            PRODUCT_NOT_DELETED: "Neuspešno brisanje proizvoda",
            PRODUCT_UPDATED: "Podaci o proizvodu uspešno ažurirani",
            PRODUCT_NOT_UPDATED: "Neuspešna izmena podataka o proizvodu",
            PRODUCT_ADDED: "Uspešno dodavanje proizvoda",
            PRODUCT_NOT_ADDED: "Neuspešno dodavanje proizvoda",
            ORDER_QR_CODE: "QR kod narudžbine",
            CURRENCY: "Valuta",
            MEASURE_UNIT: "Merna jedinica",
            DETAILS: "Detalji",
            CLIENT_NAME: "Klijent",
            PRODUCT_NUMBER: "Broj proizvoda",
            STATUS: "Status",
            CLIENT_ADDRESS: "Adresa",
            DELIVERY_DATE: "Datum isporuke",
            DELIVERY_TIME: "Vreme isporuke",
            ITEMS: "Stavke",
            CLOSE: "Zatvori",
            UNABLE_CART_INSERT: "Proizvodi drugog farmera se nalaze u korpi. Molimo Vas dodajte proizvode ovog farmera u listu želja i premestite ih u korpu kada naručite proizvode iz trenutne korpe.",
            NO_PREDEFINED_LOCATIONS: "Trenutno niste prijavljeni. Molimo Vas da se prijavite da biste videli lokacije prethodnih dostava za Vaš nalog.",
            NO_LOGIN_CHECKOUT: "Trenutno niste prijavljeni. Molimo Vas da se prijavite da biste naručili željene proizvode.",
            NO_ORDER_CREATED: "Narudžbina još nije kreirana. Molimo Vas posetite stranicu Pregled korpe i kreiranje narudžbinu.",
            FROM: "Od",
            TO: "Do",
            ORDER_CREATED: "Narudžbina uspešno kreirana!",
            ORDER_NOT_CREATED: "Bezuspešno kreiranje narudžbine!",
            NO_IMAGE_PROVIDED: "Nepostojeća slika",
            VEHICLE_IMAGE_UPLOADED: "Postavljena nova slika vozila",
            VEHICLE_IMAGE_FAILURE: "Neuspešno postavljanje nove slike vozila",
            PRODUCT_IMAGE_UPLOADED: "Postavljena nova slika proizvoda",
            PRODUCT_IMAGE_FAILURE: "Neuspešno postavljanje nove slike proizvoda",
            ACCESS_NOT_ALLOWED: "Pristup stranici trenutno nije moguć. Molimo prijavite se sa validnim podacima.",
            PROFILE_IMAGE_FAILURE: "Neuspešno postavljanje nove profilne slike",
            PROFILE_IMAGE_UPLOADED: "Postavljena nova profilna slika",
            BANNER_IMAGE_UPLOADED: "Postavljena nova reklamna slika",
            BANNER_IMAGE_FAILURE: "Neuspešno postavljanje nove reklamne slike",
            UPLOAD: "Postavi",
            PASSWORD_EMAIL_SENT: 'E-Mail poruka sa linkom sa promenu Vaše lozinke je poslata na željenu e-mail adresu',
            PASSWORD_EMAIL_NOT_SENT: 'Neuspešno slanje e-mail poruke za promenu lozinke',
            FORGOT_PASS: 'Zaboravljena lozinka?',
            SEND_EMAIL: 'Pošalji e-mail',
            RESET_PASSWORD: 'Promeni lozinku',
            PASSWORD_CHANGED: 'Lozinka uspešno promenljena',
            PASSWORD_NOT_CHANGED: 'Neuspešna promena lozinke',
            ENTER_NEW_PASSWORD: 'Molimo unesite novu lozinku',
            PASSWORD_CHANGED_MSG: 'Uspešno ste promenili Vašu lozinku. Klikom na OK bićete prebačeni na stranicu za prijavu gde možete pristupiti Vašem profilu',
            ACTIVATED_USER_MSG: 'Uspešno ste aktivirali Vaš nalog. Posetite stranicu za prijavu gde možete pristupiti Vašem profilu',
            NOT_ACTIVATED_USER_MSG: 'Neuspešna aktivacija naloga. Molimo Vas da kontaktirate našu tehničku podršku radi rešavanja ovog problema.',
            GENERAL_BUYER_DATA: 'Generalne informacije o kupcu',
            EDIT_BUYER_DATA: 'Informacije o kupcu',
            LEAVE_REVIEW: 'Ostavite komentar',
            YOUR_RATING: 'Vaša ocena',
            MAX_250_CHARS_FOR_REVIEW: 'Maksimum 250 karaktera za tekst komentara',
            REVIEW_TEXT: 'Molimo Vas unesite Vaš komentar...',
            SUBMIT_REVIEW: 'Postavi komentar',
            NEW_ADDRESS: 'Unesite adresu',
            PRICES_UPDATED: 'Cene ažurirane',
            PRICES_NOT_UPDATED: 'Neuspelo ažuriranje cena',
            REVIEW_SUBMITED: 'Komentar postavljen',
            REVIEW_NOT_SUBMITED: 'Neuspešno postavljanje komentara',
            TRANSPORT_PRICE_LIST: 'Cenovnik prevoza robe',
            FARMER_ADVERTISING_TITLE: "Reklamni naslov",
            FARMER_ADVERTISING_MSG: "Reklamna poruka",
            CREATED: 'Kreirana',
            ACTIVE: 'Aktivna',
            TRANSPORT: 'U transportu',
            DELIVERED: 'Dostavljena',
            PAID: 'Plaćena',
            GENERATE_QR: 'Generiši QR kod',
            NUMBER_OF_PACKAGES: 'Broj paketa',
            ENTER_NUMBER_OF_PACKAGES: 'Molimo unesite broj paketa u narudžbini',
            SEND_ORDER: 'Pošalji narudžbinu',
            ORDER_STATUS_TRANSPORT: 'Stanje narudžbine promenjeno u - U transportu',
            NOT_ORDER_STATUS_TRANSPORT: 'Neuspela promena stanja narudžbine',
            FARMER_REVIEWS: 'Komentari farmera',
            POSTED_ON: 'Postavljeno',
            ORDER_INFO: 'Trenutni status Vaše narudžbine',
            ORDER_MESSAGE: 'U najskorijem roku bićete obavešteni o statusu Vaše uplate putem e-mail poruke. Dalji status Vaše narudžbine možete pratiti na Vašem profilu',
            MAIN_PAGE: 'Idi na početnu stranicu',
            MAX_AVAILABLE: 'Na raspolaganju',
            REVERT_IMAGE: 'Vrati na predefinisanu sliku',
            EMPTY_WISHLIST_MESSAGE: 'Nema proizvoda u Vašoj listi želja. Molimo posetite početnu stranicu, pronađite željene proizvode i dodajte ih u Vašu listu želja.',
            PRINT: 'Štampaj',
            DOWNLOAD: 'Preuzmi',
            NO_QR_GENERATION: 'Generisanje QR koda trenutno nije moguće. Molimo sačekajte da sredstva za narudžbinu budu rezervisana.',
            NO_REVIEWS_MESSAGE: 'Ne postoje komentari o ovom farmeru. Kupite proizvode od ovog farmera i budite prvi koji će mu ostaviti komentar!',
            WAIT_MSG: 'Molimo sačekajte',
            LOAD_MSG: 'Učitavanje...',
            CALCULATE_TRANSPORT_PRICE: 'Proveri cenu prevoza',
            REQUIRED_FIELDS: 'Obavezna polja',
            PRODUCT_IMAGE_REVERTED: 'Vraćena slika proizvoda',
            PRODUCT_IMAGE_NOT_REVERTED: 'Slika proizvoda nije vraćena',
            SAVE_INFO_MSG: 'Ažuriranje informacija',
            UPLOAD_IMAGE_MSG: 'Postavljanje nove slike',
            LOAD_IMAGE_MSG: 'Učitavanje nove slike',
            ACCEPTED: 'Prihvaćeno',
            YES: 'Da',
            NO: 'Ne',
            PRICE_TO_CAPTURE: 'Za naplatu',
            PAYS_COMPANY_INFO: 'Informacije o firmi',
            OFFERED_GOODS: 'Opis ponuđenih roba i usluga',
            ACCEPT_TERMS_OF_SERVICE: 'Prihvatam uslove korišćenja',
            TERMS_OF_SERVICE: 'Uslovi korišćenja',
            SAVE_ADDRESS: 'Sačuvaj adresu',
            ORDINAL: 'Redni broj',
            PRICE_PER_UNIT: 'Jedinična cena',
            TAX: 'PDV',
            TAX_AMOUNT: 'Iznos PDV-a',
            TRANSPORT_PRICE: 'Troškovi dostave',
            TOTAL_PAY_PRICE: 'Ukupna cena',
            GO_TO_PAYMENT: 'Izračunaj cenu transporta i nastavi na plaćanje',
            TRANSPORT_PRICE_SUCCESS: 'Izračunata cena transporta',
            TRANSPORT_PRICE_FAILED: 'Neuspešno računanje cene transporta',
            LOCATION_NOT_FOUND: 'Lokacija nije pronadjena',
            TOTAL_MASS: 'Ukupna težina',
            FRACTALS_FUNDING: ' Ovaj projekat finansira FRACTALS (Future Internet Enabled Agricultural Applications, FP7 projekat br. 632874), u okviru programa finansiranja Evropske komisije.',
            WHO_ARE_WE: 'Ko smo mi?',
            WHO_ARE_WE_ANSWER: 'Vlasnik PAYS WEBSHOP portala je kompanija CAM INŽENJERING DOO iz Novog Sada, Srbija. Kompanija  je usmerena na razvoj savremenih softverskih rešenja i alata, te sprovođenje aktivnosti e-trgovine.',
            WHAT_ARE_WE_DOING: 'Šta mi radimo?',
            WHAT_ARE_WE_DOING_ANSWER: 'PAYS sistem je novi koncept za online prodaju poljoprivrednih proizvoda koji omogućuje prenos novca i povezivanje između kupca, farmera i dostavljača sa praćenjem podataka o proizvodu.',
            HOW_CAN_WE_HELP: 'Kako možemo da pomognemo?',
            HOW_CAN_WE_HELP_ANSWER: 'PAYS SYSTEM je dizajniran kako bi se omogućila lakša kupovina svežih poljoprivrednih proizvoda. Korisnici mogu odabrati farmera i proizvode koje žele kupiti. Osim toga, dobijanje najbolje cene i prevoza je uključeno u servis.',
            MAX: 'maksimum',
            CHARS: 'karaktera',
            INFO_WHO_ARE_WE: 'Ko smo mi?',
            INFO_WHAT_WE_DO: 'Šta mi radimo?',
            INFO_HELP_YOU: 'Kako možemo da pomognemo?',
            INFO_COMMENTS: 'Komentari i sugestije',
            INFO_DOCUMENTS: 'Dokumenti',
            INFO_WHO_ARE_WE_TEXT: 'Vlasnik PAYS WEBSHOP portala je kompanija CAM INŽENJERING DOO iz Novog Sada, Srbija. Kompanija  je usmerena na razvoj savremenih softverskih rešenja i alata, te sprovođenje aktivnosti e-trgovine.<br><br>Informacije o kompaniji:<br>Naziv: CAM ENGINEERING DOO<br>Adresa: Filipa Filipovića 8, Novi Sad<br>Telefon: 021-455-071<br>PIB: 107010207<br>Matični broj: 20723297<br>Internet adresa: <a class="info_link" target="_blank" href="http://www.cam.co.rs">www.cam.co.rs</a> <br><br>Ovlašćeni distributer za PAYS WEBSHOP za teritoriju Republike Srbije je kompanija INDUSTRIAL PROJECT iz Novog Sada, Srbija.<br><br>Informacije o distributeru:<br>Naziv: AGENCIJA ZA RAČUNARSKI INŽENJERING INDUSTRIAL PROJECT <br>Adresa: Milana Rakića 16, Novi Sad<br>Telefon: 021/455-071<br>PIB: 107176348<br>Matični broj: 62552778<br>Email: <a class="info_link" href="mailto:office@pays-system.com">office@pays-system.com</a><br>',
            INFO_WHAT_WE_DO_TEXT: 'PAYS SYSTEM je novi koncept za online prodaju poljoprivrednog proizvoda koji omogućuje prenos novca između kupca, farmera i dostavljača sa praćenjem podataka o proizvodu. Ovaj projekat finansira FRACTALS (Future Internet Enabled Agricultural Applications, FP7 projekat br. 632874), u okviru programa finansiranja Evropske komisije.',
            INFO_HELP_YOU_TEXT: 'PAYS SYSTEM je dizajniran kako bi se omogućila lakša kupovina svežih poljoprivrednih proizvoda. Korisnici mogu odabrati farmera i proizvode koje žele kupiti. Osim toga, dobijanje najbolje cene i prevoza je uključeno u servis.',
            INFO_COMMENTS_TEXT: 'Postavite Vaš komentar i ocenu Vaše narudžbe u odjeljku Moj profil u sklopu web stranice. Za sve ostale komentare i predloge pošaljite nam e-mail na:',
            INFO_DOCUMENTS_TEXT_MANUAL: 'Uputstvo za upotrebu',
            INFO_DOCUMENTS_TEXT_TOU_FARMER: 'Uslovi korišćenja – Farmer ',
            INFO_DOCUMENTS_TEXT_TOU_DISTRIBUTOR: 'Uslovi korišćenja – Distributer',
            INFO_DOCUMENTS_TEXT_TOU_BUYER: 'Uslovi korišćenja – Kupac',
            INFO_DOCUMENTS_TEXT_MANUAL_LINK: 'docs/manual_SR.pdf',
            INFO_DOCUMENTS_TEXT_TOU_FARMER_LINK: 'docs/Pravila_i_uslovi_koriscenja_Farmer.pdf',
            INFO_DOCUMENTS_TEXT_TOU_DISTRIBUTOR_LINK: 'docs/Pravila_i_uslovi_koriscenja_Distributer.pdf',
            INFO_DOCUMENTS_TEXT_TOU_BUYER_LINK: 'docs/Pravila_i_uslovi_koriscenja_Kupac.pdf',
            PREDEFINED_LOCATION: 'PAYS dostavna mesta',
            TERMS_OF_SERVICE_BUYER_TEXT: ' <h4 class="text-center">PRAVILA I USLOVI KORIŠĆENJA</h4> <h4 class="text-center">PAYS SYSTEM SERVISA</h4> <p>PAYS WEBSHOP je online servis za naručivanje i plaćanje poljoprivrednih proizvoda (u daljem tekstu PAYS servis) čiji je vlasnik CAM ENGINEERING DOO, sa sedištem na adresi Filipa Filipovića 8, Novi Sad, Srbija koji na osnovu posebnog ugovora, za teritoriju Republike Srbije, prenosi pravo upravljanja servisom firmi „INDUSTRIAL PROJECT“ (u daljem tekstu Distributer), sa sedištem na adresi Milana Rakića 16, 21 000 Novi Sad, Srbija.</p> <p>PAYS servis se nalazi na Internet adresi http://www.pays-system.com.</p> <p>Pravila i uslovi korišćenja definišu postupke čijim prihvatanjem nedvosmisleno potvrđujete da ste saglasni sa eventualnim ograničenjima koje ovaj servis nosi sa sobom. Pored toga, tu smo da Vas informišemo na najbolji mogući način, tako da izbegnemo Vaše dovođenje u bilo kakvu zabludu. Detaljnije objašnjenje tehničkog funkcionisanja PAYS servisa se nalazi u pisanim korisničkim upustvima u okviru kojih je detaljno objašnjeno korišćenje servisa.</p> <p>Korišćenjem PAYS servisa prihvatate navedene uslove i pravila, pa se smatra da ste automatski pristali na iste. U suprotnom, PAYS servis i distributer se oslobađaju svake odgovornosti.</p> <h4 class="text-center">USLOVI KUPOVINE</h4> <p>Uslovi kupovine definišu pravila i postupke ponuđene od strane PAYS servisa, koji se pored ostalog sastoje iz: naručivanja, pripreme, dostave, plaćanja, povrata i reklamacije robe. Kupcem se smatra svaka osoba koja elektronskim putem naruči bar jedan proizvod, registruje se i pri tom prihvati sve predviđene uslove korišćenja:</p> <p>- Kupac putem PAYS servisa naručuje artikle, koji mu se isporučuju na željenu adresu ili na unapred definisanu tačku isporuke.</p> <p>- Nakon završetka narudžbine na Web portalu kupac na svoju e-mail adresu dobija spisak naručenih artikala sa prikazanim količinama i cenom.</p> <p>- Kupac je dužan da naručene proizvode preuzme i proveri sadržaj paketa na licu mesta, te očitavanjem QR koda na dostavljenom paketu izvrši plaćanje dela, plaćanje celog iznosa narudžbine, ili u potpunosti odbije plaćanje pomoću svoje mobilne aplikacije.</p> <p>- Trenutkom prodaje smatra se onaj momenat kada je roba isporučena na traženu lokaciju, preuzmete je u svoje vlasništvo, te se završi proces plaćanja očitavanjem QR koda na dostavljenom paketu sa robom.</p> <p>- INDUSTRIAL PROJECT nije obveznik PDV, te su sve cene na http://www.pays-system.com prikazane su u nacionalnoj valuti (RSD) bez PDV-a.</p> <p>- Distributer ne garantuje da će svaki poručeni artikal biti isporučen.</p> <p>- Distributer ima diskreciono pravo da korisniku servisa, bez obaveštenje o tome, trajno ukine pristup PAYS servisu, i to u slučajevima kada korisnik: NAMERNO zloupotrebljava servis, ne poštuje pravila i uslove kupovine.</p> <p>- Prikazana fotografija artikla može odstupiti od stvarnog izgleda artikla i molimo Vas da to imate u vidu. <p>- Pojedine fotografije artikala predstavalju predlog za aranžiranje i nisu sastavni deo artikla.</p> <p>- Cena dostave zavisi od težine paketa i rastojanja dostave, te će biti jasno istaknuta prilikom svake narudžbine.</p> <h4 class="text-center">REGISTRACIJA I SIGURNOST PODATAKA</h4> <p>Ukoliko do sada niste naručivali i kupovali putem PAYS servisa neophodno je da kreirate Vaš korisnički nalog prijavom na stranici Prijava.</p> <p>Na stranici Prijava omogućena je registracija svih učesnika u sistemu: farmera, distributera i kupca. Registracija za kupca se sastoji iz par jednostavnih koraka (manje od 30 sekundi) posle kojih postajete registrovani član i korisnik usluga PAYS servisa. Vaša e-mail adresa, lozinka, korisničko ime, broj telefona i adresa stanovanja koje unosite prilikom registracije dovoljni su za predstojeće kretanje po PAYS WEBSHOP portalu i obavljanje svih radnji u okviru servisa (formiranje korpe, naručivanje, rezervacija sredstava na kartici i potvrda plaćanja).</p> <p>Na kraju procesa naručivanja preko Web portala, da bi Vaša narudžbina ispravno bila obrađena, molimo Vas da ispravno popunite sve tražene podatke. Uz pomoć tih podataka farmer ili dostavljač će biti u mogućnosti da Vam kvalitetno isporučimo željenu robu.</p> <p>Kao korisnik PAYS servisa odgovorni ste za tačnost unesenih podataka prilikom registracije. Ukoliko dođe do bilo kakvih promena podataka koje ste uneli prilikom registracije, dužni ste da odmah ažurirate Vaš korisnički nalog na strani Moj Profil ili pisanim obaveštenjem na e-mail: office@pays-system.com i na taj način obavestite korisnički servis PAYS sistema o nastalim promenama.</p> <p>Prilikom registracije na PAYS servis obavezan korak (kao što smo naveli) je kreiranje lozinke koju trebate zadržati samo za sebe i koju na svoju odgovornost delite sa drugim osobama. Nakon registracije PAYS servis će Vam poslati e-mail za potvrdu registracije. Registracijom, prihvatate odgovornost za komunikaciju sa Vaše e-mail adrese bilo da su u pitanju narudžbine, promena podataka ili odjava sa liste registrovanih. Ako saznate ili posumnjate da neko zna Vašu lozinku, ili je može koristiti suprotno Vašim očekivanjima, lozinku možete samostalno promeniti i zadržati samo za sebe, a ako to niste u mogućnosti kontaktirajte naš Call Centar na broj 021/455-071 od radnim danima od 08:00 do 15:00 h ili putem e- mail adrese: office@pays-system.com.</p> <p>Ukoliko, ipak postoje bilo kakva sumnja u mogućnost postojanja sigurnosnih propusta, nedopuštenog korišćenja usluga ili kršenja navedenih uslova i pravila, distributer INDUSTRIAL PROJECT zadržava pravo da od Vas traži promenu prvobitno navedene lozinke kao i da ukine korisnički nalog bez prethodne najave.</p> <h4 class="text-center">IZJAVA O ZAŠTITI, PRIKUPLJANJU I KORIŠĆENJU LIČNIH PODATAKA</h4> <p>Distributer, INDUSTRIAL PROJECT se obavezuje da će čuvati i štititi privatnost svih registrovanih korisnika i njihovih podataka na http://www.pays-system.com i da ih neće koristiti u druge svrhe koje nisu predmet naručivanja ili staviti na uvid trećim licima.</p> <p> U skladu sa poslovnom politikom prikupljaju se samo nužni, osnovni podaci o korisnicima servisa. Na zahtev korisnika, obavezni smo da im pružimo informaciju o načinu korišćenja njihovih podataka. Svi podaci o korisnicima se strogo čuvaju i dostupni su samo ovlašćenim licima zaposlenima u INDUSTRIAL PROJECT (kao distributeru), kojima su ti podaci neophodni za obavljanje poslova i kvaliteno pružanje usluge. Zaposleni u firmi INDUSTRIAL PROJECT krivično su odgovorni za poštovanje načela zaštite privatnosti.</p> <p> Ukoliko dođe do promene našeg stava o privatnosti, promene će biti objavljene u ovom odeljku na PAYS servisu.</p> <p> Sve promene stupaju na snagu odmah po njihovom objavljivanju.</p> <p> Korišćenjem PAYS servisa, po objavljivanju promena o stavu privatnosti, Vi se slažete sa svim promenama i prihvatate ih u celosti.</p> <p> Korišćenjem PAYS servisa Vi dajete svoju saglasnost sa stavovima o privatnosti izraženim i objavljenim na portalu.</p> <h4 class="text-center">NARUČIVANJE ROBE</h4> <p>Naručivanje robe možete vršiti 24 časa na dan, sedam dana u nedelji. Odabir proizvoda može se izvršiti bez prethodne prijave na PAYS servis, a obavezna je prijava na PAYS servis, prilikom završavanja procesa naručivanja.</p> <p> Kao kupac, prilikom prijave u sistem, stičete mogućnost dodavanja željenih artikala u „Pregled korpe“. Artikle možete da birate koristeći „Navigacioni meni” gde su artikli klasifikovani u kategorije i podkategorije po vrsti artikla.</p> <p> Klikom na dugme „Dodaj u korpu“ odabrani artikal dodajete u Vašu korpu (Pregled korpe) i na taj način ste izvršili dodavanje proizvoda po jedinici mere dodatog artikla (komad, kg, l...). Ukoliko ste u sekciji „Pregled korpe” ubacili proizvode jednog proizvođača, proizvode drugog proizvođača, njihovim odabirom, možete ubaciti u „Listu želja”.</p> <p> Količinu naručenih artikala možete menjati direktnim unosom u polje za količinu ili pomoću dugmića (+) i (-).</p> <p> Količine manje od jedinične mere se poručuju tako što ćete u polje za količinu uneti željenu količinu (Na primer: ukoliko želite da naručite 500g krompira, potrebno je da u polje za količinu unesete 0.5). Kod artikala na merenje i artikala u rinfuzi može se desiti da isporučena težina odstupa od prvobitno poručene (+/- kg). Napomena: Molimo da imate u vidu da se ovakva odstupanja dešavaju i da se ne mogu smatrati prigovorom.</p> <p> Pregled odabranih proizvoda i količina imate na stranici „Pregled korpe“.</p> <p> Narudžbina ulazi u sistem za dalju obradu tek posle upisa podataka za isporuku na stranici. Aplikacije je podešena tako da će Vam svaki put ponuditi adrese prethodnih isporuka (u padajućem meniju) koji možete odabrati ili eventualno promeniti. Napomena: Imate mogudnost menjanja adresa za isporuku i možete je dodati prilikom popunjavanja podataka za isporuku.</p> <p> Za završetak formiranja Vaše narudžbine potrebno je da kliknete na dugme “Plaćanje” u sekciji “Pregled korpe” i da na stranici za plaćanje proverite sve unete podatke, kako biste klikom na dugme Plaćanje u dnu strane bili preusmereni na sajt platnog procesora kako bi se izvršila rezervacija sredstava za plaćanje i potvrdila narudžbina.</p> <p> Nije moguće da dopunite/izmenite potvrđenu narudžbenicu kada se završi proces plaćanja, odnosno kada vam se sredstva sa kartice rezervišu i narudžbina se formira. Ukoliko imate hitno i neodložno otkazivanje kompletne narudžbenice, molimo Vas da je uputite na email: office@pays- system.com ili pozovete naš telefon 021/455-071.</p> <h4 class="text-center">PRIPREMA I ISPORUKA ROBE</h4> <p>Pre transporta, u fazi pripreme za isporuku, proizvođač (farmer) pakuje robu u odgovarajudu ambalažu, a dostavljač obezbeđuje pravilno skladištenje i transport robe u svom prevoznom vozilu.</p> <p> Mogudnost oštećenja robe u transportu nije isključena. Prilikom dostave neispravne i/ili oštećene robe, u mogućnosti ste, na mestu predaje naručene robe, umanjiti iznos računa za cenu oštećenog artikla i izvršiti povrat istog. Kupac je dužan da prilikom preuzimanja naručene robe proveri eventualna oštećenja, odmah ih prijavi pomoću mobilne aplikacije PAYS servisa i odbije da preuzme oštećenu robu na kojoj su vidljiva oštećenja.</p> <p> Provera ispravnosti narudžbine prilikom prijema zavisi isključivo od ocene kupca i dostavljača, a naknadne reklamacije se uvažavaju u skladu sa Zakonom, a posredstvom nadležnog lica iz firme INDUSTRIAL PROJECT. O riziku koji može nastati prilikom isporuke robe, više se možete informisati u stavci PRIGOVORI/ REKLAMACIJE/ POVRAT.</p> <h4 class="text-center">ISPORUKA</h4> <p> Naručenu robu proizvođači dostavljaju sopstvenim prevozom ili putem dostavljača kojeg odaberu iz PAYS sistema.</p> <p> Termini isporuke se utvrđuju prilikom narudžbine i nije ih moguće naknadno menjati.</p> <h4 class="text-center">NAČINI PLAĆANJA</h4> <p> Plaćanje na PAYS servisu se vrše isključivo bezgotovinski, putem MASTERCARD, VISA i MAESTRO platnih kartica.</p> <p> Kupci koji su fizička ili pravna lica, obavezuju se da će robu naručenu na portalu http://www.pays- system.com prilikom dostave paketa platiti (potvrdom prijema paketa putem predviđene mobilne aplikacije).</p> <h4 class="text-center">PRIGOVORI/ REKLAMACIJE/ POVRAT</h4> <p>Na robu, kupljenu putem PAYS servisa, kupac može uputiti prigovor na mestu isporuke proverom sadržine i kvaliteta poručene robe putem PAYS mobilne aplikacije. Ukoliko imate bilo koji prigovor koji ne možete da rešite prilikom dostave robe moguće je da ostavite komentar na svaku narudžbinu i da ocenite svaki proizvod pojedinačnog proizvođača, a možete nam uvek poslati i e-mail na office@pays- system.com.</p> <p> Zaposleni u PAYS servisu su obučeni za rešavanje prigovora i postupaju po utvrđenim Pravilima i Uslovima donetim od strane privrednog subjekta. Bitna pretpostavka i uslov za rešavanje prigovora jeste potpuna razmena informacija sa kupcem i postojanje ispostavljenog računa i originalne ambalaže robe (ukoliko postoji) koja podleže reklamaciji.</p> <p> Kupac je u obavezi da sačuva, dostavi (elektronski) račun i eventualno ambalažu. Svi prigovori nastali nakon trenutka preuzimanja dostavljenog paketa moraju biti posebno razmotreni. Reklamacije će biti prihvatljive samo u okviru Zakona i propisa Republike Srbije.</p> <p> Pri isporuci robe kupac je dužan da:</p> <p> - proveri ispravnost isporuke,</p> <p> - uporedi primljenu robu sa računom,</p> <p> - ukoliko nešto nedostaje da odmah napomene dostavljaču i kroz PAYS mobilnu aplikaciju.</p> <p> Ukoliko prigovor bude rešen u korist kupca, a za slučaju nemogućnosti isporuke druge, zamenske robe, distributer će nadoknaditi kupcu njegove troškove povratom novca, u vrednosti robe za koju je prigovor usvojen.</p> <h4 class="text-center">IZMENE</h4> <p>Distributer može u skladu sa svojom poslovnom politikom, bez prethodne najave, ažurirati ili izmeniti podatke objavljene na Web servisu http://www.pays-system.com. Distributer zadržava pravo na izmenu navedenih uslova i pravila, a o svim promenama korisnici se mogu obavestiti u Info sekciji sajta.</p> <p> Ukoliko se registrovani korisnik ne saglasi sa navedenim i ponuđenim izmenama o uslovima i pravilima korišćenja i ne želi da ih prihvati, u obavezi je da kontaktira Distributera na jedan od sledećih načina:</p> <p> - pozivom na broj 021/455-071 radnim danima od 08:00 do 15:00 i</p> <p> - slanjem poruke na e-mail adresu: office@pays-system.com.</p> <p> Tokom trajanja ovog postupka, korisnik ne može koristiti usluge PAYS servisa.</p> <h4 class="text-center">CENE</h4> <p>Sve cene na http://www.pays-system.com prikazane su u nacionalnoj valuti (RSD).</p> <p> Cene na PAYS servisu su višeznačne u skladu sa Zakonom o trgovini.</p> <p> Ono što plaćate jeste cena na dan kada ste naručili robu.</p> <p> PAYS sistem sa velikim procentom predviđanja formira svoju ponudu, ali zbog nepredviđenih okolnosti zadržava pravo da promeni cene u bilo kom momentu koji ne narušava legalitet i legitimitet poslovanja u skladu sa zakonskim propisima.</p> <p> Ukoliko niste zadovoljni kvalitetom naručenog artikla, možete ga u skladu sa svim navedenim uslovima vratiti. Artikal možete vratiti, a mi ćemo Vam izvršiti povrat sredstava. Sve se to vrši putem predviđene PAYS servis mobilne aplikacije.</p> <p> Cene za robu koja se meri i koja se napladuje prema težini, mogu da odstupe i do 10% zbog nemogućnosti da se tačno precizira merenje. Odstupanja težine su minimalna, što znači da možete dobiti nekoliko grama više ili manje, a cena će biti obračunata po težini koju ste naručili. </p> <h4 class="text-center">KOMUNIKACIJA SA KORISNICIMA</h4> <p> Vaš broj telefona (fiksni/mobilni) ili e-mail adresa koju navedete prilikom registracije može biti upotrebljena u svrhe potvrđivanja narudžbenice, kao i termina isporuke naručene robe.</p> <p> Distributer zadržava pravo da sve svoje registrovane korisnike na http://www.pays-system.com, povremeno putem mail-a ili slanjem sms-a, obavestiti o novim uslugama ili artiklima koje nudi pod posebnim i drugačijim uslovima od uobičajenih.</p> <p> Sva Vaša pitanja, sugestije ili nejasnoće možete nam uputiti na:</p> <p> Telefon 021/455-071 radnim danima od 08:00 do 15:00</p> <p> E-mail adresu: office@pays-system.com</p> <p> Na sva Vaša pitanja biće odgovoreno brzo i profesionalno.</p> <h4 class="text-center">OGRANIČENJE ODGOVORNOSTI</h4> <p>Distributer ni pod kakvim okolnostima neće biti odgovoran korisniku servisa:</p> <p> - Za pravilno ili nepravilno korišćenje PAYS servisa kao i za eventualnu štetu nanešenu opremi koja se koristi za pristup portalu, a koja nastane po tom osnovu, a da je Distributer nije mogao preduprediti.</p> <p> - Za bilo kakvu štetu koju korisnik pretrpi pravilnim ili nepravilnim korišćenjem portala, kao i drugih informacija, servisa, usluga, saveta ili proizvoda do kojih se došlo pomoću linkova ili reklama na servisu ili onih koji su na bilo koji način povezane sa PAYS servisom.</p> <p> - Za nepravilno funkcionisanje ili prekid rada servisa, koji je prouzrokovan direktno ili indirektno prirodnim silama ili drugim uzrocima van razumne moći kontrole, u šta spadaju: problemi funkcionisanja Interneta, kvarovi na kompjuterskoj opremi, problemi u funkcionisanju telekomunikacione opreme i uređaja, nestanak struje, štrajkovi, obustave rada, nemiri, nestašice sadržaja ili manjka radne snage, naredbe državnih ili drugih organa, elementarne nepogode.</p> <p> - Za kašnjenje isporuke bilo koje vrste, kako je ta odgovornost na strani farmera i njegovog odabranog dostavljača.</p> <p> Sve informacije dostupne na http://www.pays-system.com, isključivo su namenjene licu koje ih čita, upoznaje se sa njima i daje svoju saglasnost na registraciju. Ove informacije se ne smeju koristiti u komercijalne svrhe u korist trećih lica, niti je dozvoljeno da se neovlašćeno distribuiraju trećim licima.</p> <p> Za eventualne greške, nejasnoće i nepravilnosti objavljene na portalu, http://www.pays-system.com firma Distributera ne snosi odgovornost. Informacije dostupne na PAYS servisu ne smeju se smatrati osnovom za donošenje jednostranih ocena o odstupanju od sopstvenih očekivanja i opredeljenja.</p> <p> Poslovne rizike i odstupanje od izražene volje, obe strane u ovom poslovnom odnosu moraju sagledavati realno, sa pažnjom i uz puno međusobno usaglašavanje i razmenu svih činjenica i okolnosti koje za posledicu mogu imati ekonomske posledice i štetu, kako materijalnu tako i nematerijalnu.</p> <p> Registracijom i prihvatanjem uslova poslovanja sa PAYS servisom, iskazali ste zapravo saglasnost da Distributera, nećete smatrati odgovornima za bilo kakvu direktnu ili indirektnu, slučajnu, nematerijalnu ili materijalnu štetu, gubitke ili troškove nastale kao rezultat upotrebe ili nemogućnosti upotrebe neke od informacija dostupnih na stranicama PAYS servisa.</p> <p> Distributer ne garantuje da će PAYS servis uvek biti dostupan i raspoloživ, te da neće sadržavati greške ili viruse. Svaki korisnik izričito prihvata korišćenje ovog servisa na svoju sopstvenu odgovornost.</p> <p> Privredni subjekti čija je delatnost medijska, biće odgovorni za štetu koju mogu naneti neovlašćenim korišćenjem informacija. Distributer zadržava pravo da od takvih subjekta traži naknadu štete koja će biti utvrđena po odredbama Zakona o obligacionim odnosima koji je važeći na području Republike Srbije.</p> <p> Učesnici koji koriste portal za naručivanje http://www.pays-system.com, prihvataju da obeštete Distributera za potraživanja koja istakne prema njima, bilo da su u kategoriji troškova, tržišne materijalne štete, nematerijalne štete ili odgovornosti zbog nesavesnog korišćenja materijala sa portala, uključujući i bilo kakvu direktnu ili indirektnu, materijalnu ili nematerijalnu štetu bez obzira da li je ista prouzrokovana namerno ili ne.</p> <p> Eventualne neusaglašenosti, interesne strane moraju prvo pokušati da reše dogovorom i sporazumno. Ukoliko to ne postignu, nadležan je sud u Novom Sadu.</p> <p> <h4 class="text-center">USLUGE TREĆIM LICIMA</h4> <p>Usluge koje Vam pruža PAYS servis ne podrazumevaju postojanje troškova za računarsku opremu i usluge provajdera za pristup PAYS servisu. Distributer nije odgovoran za telefonske ili bilo koje druge troškove do kojih može doći u ovakvom pristupu.</p> <p> Napominjemo da http://www.pays-system.com upotrebljavate isključivo na sopstveni rizik. Distributer i PAYS servis ne garantuju za poslovne odnose koje imate sa trećom stranom i ne mogu se smatrati odgovornim i preuzeti odgovornost za direktne ili indirektne štete koje možete pretrpeti korišćenjem usluga trećih lica.</p> <p> Internet je internacionalna, nezavisna računarska mreža koju Distributer ne kontroliše globalno, već i isključivo u meri u kojoj je koristi za sopstvene potrebe, tako da iz tih razloga ni u kojem obliku ne može garantovati dostupnost PAYS servisa koje direktno ne kontroliše.</p> <p> <h4 class="text-center">POMOĆ</h4> <p>Različite vrste pomoći pri korišćenju PAYS servisa se nalaze u sekciji Info na adresi http://www.pays- system.com i ocenjujemo da će Vam biti od koristi. Želimo da Vas posavetujemo da nam se obratite pozivom na broj telefona 021-455-071 radnim danima od 08:00 do 15:00 ili slanjem poruka na mail adresu: office@pays-system.com.</p> <p> Takođe, i na ovom mestu i ovom prilikom, molimo Vas da vodite računa o tome da slanje privatnih poruka elektronskom poštom može biti nesigurno i podložno neovlašćenom pristupu trećih lica ili pogrešnoj dostavi. Svaka poruka primljena elektronskom poštom smatraće se nepoverljivom i u skladu sa tim PAYS servis i Distributer ne odgovaraju za sigurnost i privatnost takvih poruka. S druge strane, Vaše poruke upućene nama upotrebljavaćemo, raspolagati njima i distribuirati ih samo našim službenim licima koji su uključeni u kompletnu uslugu PAYS servisa.</p> <p> <h4 class="text-center">FOTOGRAFIJE</h4> <p>Fotografije na PAYS servisu http://www.pays-system.com su ilustrativne prirode i neke fotografije mogu odstupati od stvarnog izgleda artikala iz tehničkih razloga i nemogućnosti prikaza izgleda u prostoru iz svih uglova.</p> <p> Posebna napomena: pojedini predmeti i proizvodi prikazani na slici proizvoda koji naručujete predstavljaju samo predlog za serviranje i nisu deo naručenog proizvoda.</p> <h4 class="text-center">INTELEKTUALNO VLASNIŠTVO</h4> <p>Sadržaj PAYS servisa http://www.pays-system.com zaštićen je i Distributer, firma INDUSTRIAL PROJECT ostvaruje jedinstveno pravo na njegovo upravljanje na teritoriji Republike Srbije. Slike i tekstovi prikazani na PAYS servisu ne smeju se kopirati i koristiti u drugim publikacijama, pisanim ili elektronskim, osim uz izričito odobrenje PAYS servisa.</p> <p> Korišćenjem materijala sa PAYS servisa, svi korisnici obavezuju se da se u potpunosti pridržavaju ovde utvrđenih ograničenja, uslova i zahteva.</p> <p> Datum i mesto</p> <p> 01.03.2016.</p> <p> Novi Sad, Srbija</p> <p> Dokument izdat od strane PAYS servisa</p> <h5 class="text-center"> Ovo je elektronski dokument, punovažan bez pečata i potpisa.</h5>',
            DELIVERY_TIME_PREDEFINED_LOCATION: 'Vašu narudžbinu možete preuzeti sa PAYS dostavnog mesta u vremenskom intervalu',
            PREVIOUS_LOCATION : 'Prethodno korišćena mesta',
            REGISTERED_DISTRIBUTORS : 'Registrovani distributeri',
            NO_DISTRIBUTORS_FOUND : 'Nijedan distributer nije pronađen koristeći zadane kriterijume. Molimo Vas pokušajte sa drugim kriterijumima.',
            NO_PREVIOUS_LOCATIONS : 'Trenutno niste prijavljeni. Molimo Vas da se prijavite da biste videli lokacije prethodnih dostava za Vaš nalog.'
        })
    $translateProvider.preferredLanguage('en_EN');
});
