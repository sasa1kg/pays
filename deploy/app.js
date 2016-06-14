var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'ngAnimate', 'LocalStorageModule',
        'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 'DistributorService', 'FarmerService', 'UserService', 'OrderService',
        'ui-rangeSlider', 'cgBusy', 'brantwills.paging', 'pascalprecht.translate', 'ui.bootstrap', 'ui-notification', 'flow', 'monospaced.qrcode', 'dbaq.google.directions',
        'angularUtils.directives.dirPagination','angular-md5'])
    .filter('html', ["$sce", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    }]).filter('slice', function () {
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
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');

    }]).config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            target: 'upload.php',
            permanentErrors: [404, 500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 4,
            singleFile: true,
            headers: {'X-Auth-Token' : '9F2490EC33584328A5E83991724C28AE'}
        };
        flowFactoryProvider.on('catchAll', function (event) {
            console.log('catchAll', arguments);
        });
        // Can be used with different implementations of Flow.js
        // flowFactoryProvider.factory = fustyFlowFactory;
    }]).config(["NotificationProvider", function (NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 5000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'center',
            positionY: 'top'
        });
    }]).config(
        ["$compileProvider", function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }]
    );

paysApp.config(["localStorageServiceProvider", function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('paysApp');
}]);

paysApp.filter("htmlSafe", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);

paysApp.run(["$rootScope", "$location", "$anchorScroll", function ($rootScope, $location, $anchorScroll) {
    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
        if ($location.hash()) $anchorScroll();
    });
}]);

paysApp.run(["$rootScope", "$translate", "$location", "$window", "$filter", "Notification", "SearchService", "UserService", "OrderService", function ($rootScope, $translate, $location, $window, $filter, Notification, SearchService, UserService, OrderService) {

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
    $rootScope.genKey = "a231ae09-da45-4952-8a23-b48fbe19f99c";
    $rootScope.waitMsg = $filter('translate')('WAIT_MSG');
    $rootScope.loadMsg = $filter('translate')('LOAD_MSG');
    $rootScope.saveInfoMsg = $filter('translate')('SAVE_INFO_MSG');
    $rootScope.uploadImgMsg = $filter('translate')('UPLOAD_IMAGE_MSG');
    $rootScope.loadImgMsg = $filter('translate')('LOAD_IMAGE_MSG');

    $rootScope.predefinedLocationString = "predefinedLocation";
    $rootScope.previousLocationString = "previousLocation";
    $rootScope.noDeliveryString = "noDelivery";
    $rootScope.newAddressString = "newAddress";

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
        OrderService.clearOrderData();

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

    $rootScope.getTwoDecimalsFormat = function(inputStr){
        return parseFloat(inputStr).toFixed(2);
    }
}]);

paysApp.config(["$translateProvider", function ($translateProvider) {
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
            NO_DELIVERY : 'No delivery',
            DELIVERY_OPTION: 'If checked, farmer will consider you will pick up your order',
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
            DISTRIBUTOR_PRICE_LIST: "Transport price list",
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
            MAX_500_CHARS_FOR_REVIEW: 'Maximum 500 characters for review',
            MAX_250_CHARS_FOR_REVIEW : 'maximum 250 characters',
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
            TERMS_OF_SERVICE_BUYER_TEXT: ' <h4 class="text-center">TERMS OF USE</h4> <h4 class="text-center">PAYS SYSTEM SERVICE</h4> <p>PAYS WEBSHOP is an online service for purchasing of agricultural products (hereinafter PAYS service) owned by CAM ENGINEERING LTD, headquartered at Filipa Filipovića 8, Novi Sad, Serbia, which on the basis of a separate agreement, for the territory of the Republic of Serbia, conveys the right to manage PAYS service to company "INDUSTRIAL PROJECT" (hereinafter Distributor), based at Milana Rakića 16, 21 000 Novi Sad, Serbia.</p> <p>PAYS service internet address is http://www.pays-system.com.</p> <p>Terms of use define the procedures whose acceptance unambiguously confirms that you agree with the possible limitations of this service has. In addition, we are here to inform you in the best possible way, so to avoid your bringing in any confusion. A more detailed explanation of the technical functioning of the PAYS service is written in the user manuals within which is explained in detail how to use the service.</p> <p>By using the PAYS service you agree to the following terms and conditions of use, so it is considered that you automatically agree to them. Otherwise, PAYS service and distributor are relieved of all responsibility and liability.</p> <h4 class="text-center">TERMS OF PURCHASE</h4> <p>Terms of use define the rules and procedures offered by PAYS services, which consist of, among other things: order preparation, shipping, payments, refunds and complaints about goods. </p> <p>To purchase products through PAYS service it is essential to use PAYS-EN mobile application (currently supported for the Android operating system) and it can be downloaded from the Play Store: https://play.google.com/store/apps/details?id=camengineeringns.pays.english</p> <p>Buyer is any person who orders at least one product by using the service, is registered, thereby accepts all the terms of use envisaged:</p> <p>- Buyer using PAYS orders items, which are delivered to him at the desired address or a predefined point of delivery.</p> <p>- After completion of the order on the Web portal, a buyer receives a list of ordered items with item volume and price, on his e-mail address.</p> <p>- The buyer is obliged to take the ordered products and check the package contents on the delivery site and by using his mobile applications to read the QR code on the package delivered and by his mobile app(PAYS-EN) to make the payment of a part of the order, payment of the entire amount of the order, or completely reject the payment.</p> <p>- Moment of sale is considered to be the moment when the goods are delivered to the delivery site, and with completion of the payment process by scanning the QR code on the package delivered with the goods.</p> <p>- INDUSTRIAL PROJECT is not a VAT payer (by law registration), and all prices on http://www.pays- system.com are shown in the national currency (RSD) without VAT.</p> <p>- The distributor does not guarantee that each ordered item will be delivered.</p> <p>- Distributor has the discretion to, without notification about it, permanently terminate users access to PAYS service, in cases where a user: INTENTIONALLY abusing the service, does not respect the terms and conditions of purchase and use.</p> <p>- This photograph of the item may deviate from the actual article look and please bear that in mind. <p>- Some photos of items show a proposal for the arrangement and are not part of the item in display.</p> <p>- The cost of shipping depends on the package weight and distance for delivery, and will be clearly visible during each order.</p> <h4 class="text-center">REGISTRATION AND DATA SECURITY</h4> <p>If you have not ordered and purchased by PAYS service you must create your user account by signing in at Log in.</p> <p>Log in page provides the registration of all participants in the system: farmers, distributors and buyers. Registration for the buyer consists of a few simple steps (less than 30 seconds) after which you become a registered user of PAYS service. Your e-mail address, password, user name, telephone number and address you enter during registration are sufficient for your use of PAYS WEBSHOP portal and perform all actions in the service (forming a cart, ordering, reservation of funds and confirmation of payment).</p> <p>At the end of the ordering process in order to make your orders processed correctly, please fill out all required information. With the help of this data, farmer or deliverer will be able to provide a quality service in delivering the desired goods.</p> <p>As a user of PAYS services you are responsible for the accuracy of the data entered during registration. Should there be any changes to the data entered during registration, you are required to immediately update your user account on the My Profile page or by written notice to the e-mail: office@pays- system.com and thus inform the customer service of PAYS that changes have occurred.</p> <p>When you register for the PAYS service mandatory step (as indicated above) is to create a password that you need to keep to yourself and it is your responsibility of you share it with others. After registration PAYS service will send you an e-mail to confirm your registration. By registering, you accept the responsibility to communicate with your e-mail address eather about orders, personal data or unsubscribe from the service. If you know or suspect that someone knows your password, or it can be used contrary to your expectations, you can change the password and keep to yourself, and if you are unable to, please contact our Call Center on 021/455-071 on weekdays from 08:00 to 15:00 h or via e- mail address: office@pays-system.com.</p> <p>If, however, there is any doubt in the possibility of the existence of security vulnerabilities, unauthorized use of the Services or violation of the above terms of use, distributor INDUSTRIAL PROJECT reserves the right ask you to change initially defined passwords as well as to revoke your account without notice.</p> <h4 class="text-center">DECLARATION ON THE PROTECTION, COLLECTION AND USE OF PERSONAL DATA</h4> <p>Distributor, INDUSTRIAL PROJECT is obligated to keep and protect the privacy of all users and their data on http://www.pays-system.com and the data obtained shall not be used for other purposes that are not subject to orders nor will it be made available to third parties.</p> <p>In accordance with the business policy PAYS collects only the necessary, basic information about the users of the service. At the user\'s request, we are obliged to provide them with information about the use of their data. All user information is strictly confidential and available only to authorized persons employed in INDUSTRIAL PROJECT (distributor), to which these data are necessary for the performance of work and provision of quality-services. Employees in the company INDUSTRIAL PROJECT are criminally responsible for complying with the principles of privacy protection.</p> <p> If there is a change in PAYS service privacy policy that will be posted in this section at PAYS service web portal.</p> <p>All changes take effect immediately after its publication.</p> <p>Using PAYS service, by releasing a change of privacy policy, you agree with all the changes and accept them entirely.</p> <p>Using PAYS service you give your consent to the policy views expressed and published on the portal.</p> <h4 class="text-center">ORDERING OF GOODS</h4> <p>Ordering of goods can be made 24 hours a day, seven days a week. Product selection can be made without prior notification to the PAYS service, but a log in is required on the PAYS service, when finishing the ordering process.</p> <p>As a buyer, when logging in to the system, you gain the ability to add wanted items in the "Cart overview". You can select items using the "Navigation menu" where items are classified in categories and subcategories by the type.</p> <p>By clicking on "Add to Cart" you can add an item to your cart (Cart overview) with one of these measurment units (piece, kg, l ...). If you have inserted the products of one producer in the "Cart overview", the products of another producer you can insert in the "Wishlist".</p> <p>The amount of ordered items can be changed direct by entry into the field for the amount or with the buttons (+) and (-).</p> <p>Quantities less than the unit presented can be ordered by going to the amount field to enter the desired amount (for example: if you want to order 500g of potatoes, it is necessary to enter in the amount field for the amount of 0.5). When ordering such items, delivered weight of the product can deviate from theoriginally ordered ones (+/- kg). Note: Please bear in mind that such discrepancies occur and can not be regarded as a complaint.</p> <p>Overview of selected products and the amount you can view on the page "Cart overview".</p> <p>The order enters the system only after entry of the data for delivery to the site. Application is set so that each time you order it will offer you the address of previous deliveries (in the drop-down list) that you can choose or change. Note: You have the possibility of changing the address for delivery and it can be added when filling out the data for delivery.</p> <p>To complete the order you need to click on the "payment" in the "Cart overview" and on the “Payment” page check all entered data and by clicking on the payment button you will be redirected to a payment processor in order to perform reservation of funds for payment.</p> <p>It is not possible to add items or change the confirmed purchase order once the payment process has finished, or when your assets are reserved from the card and the order is formed. If you have urgent and immediate cancellation of the entire order, please refer to the email: office@pays-system.com or call our phone 021/455-071.</p> <h4 class="text-center">PREPARATION AND DELIVERY OF GOODS</h4> <p>Before transport, in preparation for delivery, the producer (farmer) packages the goods in appropriate packaging and deliverer ensures proper storage and transportation in his transport vehicle.</p> <p>The possibility of damage to goods in transit is not excluded. Upon delivery of defective and/or damaged goods, you have the right not to pay the amount of the invoice for the cost of the damaged item. The buyer is obliged, when taking over the goods ordered to check for any damage, immediately report it using his/her mobile application for PAYS service and to refuse to take over the damaged goods.</p> <p>Checking the correctness of order upon receipt depends on the customer, and subsequent complaints are respected in accordance with the Serbian Law, through a person responsible for dealing with competent from the company INDUSTRIAL PROJECT. More about the risks that may arise during the delivery of goods, you can find out in paragraphs COMPLAINTS / RETURNS / REFUND.</p> <h4 class="text-center">DELIVERY</h4> <p>Ordered goods producers deliver by their own transport or by using a profesional deliverer (courier), which can be selected from the PAYS system.</p> <p>Dates of delivery shall be determined when ordering and can not be subsequently changed.</p> <h4 class="text-center">PAYMENT OPTIONS</h4> <p>Payment on PAYS service can be made only cashless, through MASTERCARD, VISA and MAESTRO cards.</p> <p>Buyers, who are individual or legal persons, are obligated to pay for the goods ordered on the portal http://www.pays-system.com upon delivery (acknowledgment for the receipt of the package provided by mobile application).</p> <h4 class="text-center">COMPLAINTS / RETURNS / REFUND</h4> <p>On goods, purchased by PAYS service, the customer can file a complaint at the point of delivery by checking the content and quality of the goods ordered by using PAYS mobile application. If you have any complaint you can not resolve upon delivery of the goods it is possible to leave a comment on every order and rate each producer individualy, and you can always send us an e-mail at office@pays- system.com.</p> <p>Employees of the PAYS service are trained to deal with complaints and act according to set rules and terms issued by the PAYS legal entity. An important assumption and a condition for resolving complaints is the full exchange of information with customers and the existence of the invoice and the original packaging (if any) of the goods subject to complaint.</p> <p>The buyer is obliged to keep and submit an invoice and if possible packaging. All complaints arose after the moment of takeover of the delivered package must be considered separately. Complaints will be acceptable only within the framework of the law and regulations of the Republic of Serbia.</p> <p> Upon delivery of the goods the buyer is obliged to:</p> <p> - check the validity of delivery,</p> <p> - compare the goods received with the invoice,</p> <p> - if something is missing immediately note it through PAYS mobile application and to the deliverer.</p> <p> If the complaint is resolved in favor of the buyer, and for the case of inability to deliver another, the replacement for the goods, the Distributor will reimburse the buyer his purchase in the value of goods for which the complaint is accepted.</p> <h4 class="text-center">CHANGES</h4> <p>Distributor may, in accordance with its business policy, without prior notice, update or change the information posted on the Web service http://www.pays-system.com. Distributor reserves the right to change the above terms and conditions of use and not to inform registered users of any changes directly, as they will always be available in the Info section of the PAYS service.</p> <p>If you are a registered user does not agree with the above and offered amendments of the terms and conditions of use and does not want to accept them, it is obliged to contact the Distributor to one of the following ways:</p> <p> - By calling 021 / 455-071 on weekdays from 08:00 to 15:00 and</p> <p> - Sending messages to e-mail address: office@pays-system.com.</p> <p>During the course of this process, the user can not use the PAYS service.</p> <h4 class="text-center">PRICES</h4> <p>All prices on http://www.pays-system.com are presented in the national currency (RSD).</p> <p>Prices at PAYS service are ambiguous in accordance with the Law on Trade of Republic of Serbia.</p> <p>What you pay is the price on the day when you ordered the goods.</p> <p>PAYS system with a large prediction percentage forms its offer, but due to unforeseen circumstances reserves the right to change prices at any time that does not undermine the legality and legitimacy of operations in accordance with legal regulations.</p> <p>If you are not satisfied with the quality of the ordered item, you can return it in compliance with all the above mentioned conditions. Items you can return and we\'ll refund you. All this is done through a service provided PAYS mobile applications.</p> <p>Prices for goods that is measured and which is charged by weight, may deviate up to 10% due to the inability to accurately measure the product. Deviations in weights are minimal, which means you can get a few grams more or less, and the price will be calculated according to the weight you ordered. </p> <h4 class="text-center">COMUNICATION WITH THE USERS</h4> <p>Your phone number (home / mobile) or e-mail address you provide during registration can be used for the purpose of confirming the order and the terms of delivery of the goods ordered.</p> <p>Distributor reserves the right to inform all its registered users at http://www.pays-system.com, periodically by e-mail or by sending an SMS, about new services or items provided under special and different terms then usual.</p> <p>All your questions, suggestions or concerns you can send us to:</p> <p>Phone 021/455-071 on weekdays from 08:00 to 15:00</p> <p>E-mail address: office@pays-system.com</p> <p>All your questions will be answered quickly and professionally.</p> <h4 class="text-center">LIMITATION OF LIABILITY</h4> <p>Distributor under no circumstances will be liable to service user:</p> <p> - For the proper or improper use of PAYS services as well as for any damage done to the equipment used to access the portal, which occurs on that basis, and that the distributor could not prevent.</p> <p> - For any damage suffered by the users proper or improper use of the portal, as well as other information, services, products, advice or products which were reached via links or ads on the service or those who are in any way associated with the PAYS service.</p> <p> - For improper performance or interruption of the service, which is caused directly or indirectly by the forces of nature or other causes beyond reasonable control, which includes: the problems of functioning of the Internet, computer equipment failures, problems in the functioning of telecommunications equipment and devices, power outages, strikes, riots, shortages of content or labor shortages, orders of government or other authority, natural disasters.</p> <p> - For delay in delivery of any kind, as this responsibility lies with the farmer and his selected deliverer.</p> <p>All information available on http://www.pays-system.com, are solely intended for the person who reads them, he familiarises him self with them and gives its consent to the registration. This information shall not be used for commercial purposes for the benefit of third parties, nor is it allowed to distribute unauthorized third parties.</p> <p>For any errors, uncertainties and irregularities shown on the portal, http://www.pays-system.com Distributor is not responsible. Information available on PAYS service should not be regarded as a basis for one-sided assessment of the deviation from its own expectations and preferences.</p> <p>Business risks and deviation from the expressed will of both parties to this business relationship must be viewed realistically, with care and with full harmonization and mutual exchange of all facts and circumstances that can result in economic consequences and damages, tangible and intangible.</p> <p>Registration and acceptance of business conditions with PAYS service, you are actually expressed consent to the Distributor, that he will not be liable for any direct, indirect, incidental, immaterial or material damages, losses or expenses resulting from the use or inability to use some of the information available on the site PAYS service.</p> <p>Distributor does not warrant that PAYS service will always be available and will not contain errors or viruses. Each user expressly agrees to use this service at his or her risk.</p> <p>Business entities whose activities are in media, will be responsible for the damage they can inflict by unauthorized use of information. Distributor reserves the right to seeks damages from such entities to be determined under the provisions of the Law of Obligations, which is valid on the territory of the Republic of Serbia.</p> <p>Participants who use the portal http://www.pays-system.com to order, agree to indemnify Distributor for claims which highlight to them, whether it is in the category of costs, market material damage, non- pecuniary damage or liability for negligent use of materials from the portal including any direct or indirect, material or immaterial damage, regardless of whether the same was caused intentionally or not.</p> <p>Possible non-conformities, interested parties must first attempt to resolve consent and by agreement. If this is not accomplished, competent authority is the court in Novi Sad.</p> <p> <h4 class="text-center">THIRD PARTY SERVICES</h4> <p>Services offered by PAYS service do not imply the existence of costs for computer equipment and services provider to access PAYS service. Distributor is not responsible for telephone or any other charges that may occur in this approach.</p> <p>Please note that http://www.pays-system.com you use solely at your own risk. PAYS service and his Distributor do not guarantee for the business relationship that you have with a third party and can not be held accountable and take responsibility for direct or indirect damages that may suffer by using the services of third parties.</p> <p>Internet is an international computer network which is an independent network which Distributor does not control globally, but only to the extent that it is used for its own purposes, so for these reasons Distributor in any form can not guarantee availability of PAYS services that he does not directly control.</p> <p> <h4 class="text-center">HELP</h4> <p>Different types of assistance when using PAYS service is available in the Info section at http://www.pays- system.com and we assess it would be of benefit. We would advise you to contact us by calling 021/455- 071 on weekdays from 08:00 to 15:00 or by sending an email to: office@pays-system.com.</p> <p>Also, please note that sending private messages by e-mail can be unsafe and subject to unauthorized access by third parties or wrong delivery. Every message received by e-mail will be considered untrustworthy and according to that PAYS service and Distributor are not responsible for the security and privacy of such messages. On the other hand, your messages to us will be distributed only to our official personel who are involved in PAYS service.</p> <p> <h4 class="text-center">PHOTOGRAPHY</h4> <p>Photos on PAYS service http://www.pays-system.com are illustrative and some photos may differ from the actual items for technical reasons and the inability to display layout in the area from all angles.</p> <p>Special note: some items and products displayed in the image of displayed products represent only a proposal for serving and are not part of the ordered products.</p> <h4 class="text-center">INTELLECTUAL PROPERTY</h4> <p>PAYS service http://www.pays-system.com is patent protected and Distributor, company INDUSTRIAL PROJECT exercised sole right to its management. Pictures and texts displayed on PAYS service may not be copied or used in other publications, written or electronic, except with the express permission PAYS service.</p> <p>Using material from PAYS service, all users comply fully with the established here restrictions, conditions and requirements.</p> <p>Date and place</p> <p> 01.03.2016.</p> <p>Novi Sad, Serbia</p> <p>Document issued by PAYS service</p> <h5 class="text-center">This is an electronic document, valid without stamp and signature.</h5>',
            DELIVERY_TIME_PREDEFINED_LOCATION: ' You can pick up your order from PAYS delivery location on the next work day in time period',
            PREVIOUS_LOCATION : 'Previous locations',
            REGISTERED_DISTRIBUTORS : 'Registered distributors',
            NO_DISTRIBUTORS_FOUND : 'No distributors were found using your criteria. Please retry with different criteria.',
            NO_PREVIOUS_LOCATIONS : 'You are not logged in at the moment. Please log in to see previous delivery locations of your account.',
            NO_FARMERS_FOUND : 'No farmers were found using your criteria. Please retry with different criteria',
            WORKING_HOURS_DESC :'In case of problems with the delivery time, farmer/ deliverer will contact you directly on your contact phone number.',
            ORDER_INFO_ERROR : 'An error occured during payment procedure for you order. Please check entered information of your credit card and try to create another order.',
            PASSWORD_FORMAT: 'Password\'s length must be minimum 8 characters.<br>Password must contain : 1 small letter, 1 capital letter, 1 digit.',
            ANDROID_APP_TEXT : 'To accept delivery you will need:',
            PAYS_ANDROID : 'Experience PAYS on Android',
            APK_PAYS_ICON : 'images/android/pays-en.jpg',
            APK_QR_ICON : 'images/android/englQRAPK.png',
            APK_GOOGLE_PLAY_LINK : 'https://play.google.com/store/apps/details?id=camengineeringns.pays.english',
            NO_PRODUCTS_IN_CART : 'There are no products in your cart. Please find desired products and add them to your cart.',
            BUSINESS_POLICY : 'Business policy',
            MINIMAL_ORDER_AMOUNT : 'Minimal order amount',
            WORK_HOURS : 'Work hours',
            WORK_HOURS_FARMER : 'Farmer work hours',
            MONDAY : 'Monday',
            TUESDAY : 'Tuesday',
            WEDNESDAY : 'Wednesday',
            THURSDAY : 'Thursday',
            FRIDAY : 'Friday',
            SATURDAY : 'Saturday',
            SUNDAY : 'Sunday',
            WORK_HOURS_UPDATED : 'Work hours updated',
            WORK_HOURS_NOT_UPDATED : 'Failed to update work hours',
            MINIMUM_ORDER_AMOUNT : 'Minimum order price for this farmer is',
            CURRENT_AMOUNT : 'Current price of the products in your order is',
            CLOSED : 'Closed',
            TOTAL_TAX : 'Total tax amount',
            NO_TRANSPORT_PRICE : 'Please make sure you calculated your transport price on cart page and come back to finish your order.',
            ITEM_PRICE_CHANGED : 'Some product price has changed in the meantime. Please check product prices in cart overview page.',
            PRICE_CHANGED : 'Product price changed!',
            OLD_PRICE : 'Old price',
            NEW_PRICE : 'New price',
            USER_PICK_UP : 'Products will not be delivered, since \'No delivery\' option is selected in order.'
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
            NO_DELIVERY : 'Bez dostave',
            DELIVERY_OPTION: 'Ukoliko je odabrano, farmer podrazumeva da ćete sami preuzeti proizvode',
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
            BANNER_PICTURES: "Slike za baner",
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
            MAX_500_CHARS_FOR_REVIEW: 'Maksimum 500 karaktera za tekst komentara',
            MAX_250_CHARS_FOR_REVIEW: 'maksimum 250  karaktera',
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
            TERMS_OF_SERVICE_BUYER_TEXT: '<h4 class="text-center">PRAVILA I USLOVI KORIŠĆENJA</h4> <h4 class="text-center">PAYS SYSTEM SERVISA</h4> <p>PAYS WEBSHOP je online servis za naručivanje i plaćanje poljoprivrednih proizvoda (u daljem tekstu PAYS servis) čiji je vlasnik CAM ENGINEERING DOO, sa sedištem na adresi Filipa Filipovića 8, Novi Sad, Srbija koji na osnovu posebnog ugovora, za teritoriju Republike Srbije, prenosi pravo upravljanja servisom firmi „INDUSTRIAL PROJECT“ (u daljem tekstu Distributer), sa sedištem na adresi Milana Rakića 16, 21 000 Novi Sad, Srbija.</p> <p>PAYS servis se nalazi na Internet adresi http://www.pays-system.com.</p> <p>Pravila i uslovi korišćenja definišu postupke čijim prihvatanjem nedvosmisleno potvrđujete da ste saglasni sa eventualnim ograničenjima koje ovaj servis nosi sa sobom. Pored toga, tu smo da Vas informišemo na najbolji mogući način, tako da izbegnemo Vaše dovođenje u bilo kakvu zabludu. Detaljnije objašnjenje tehničkog funkcionisanja PAYS servisa se nalazi u pisanim korisničkim upustvima u okviru kojih je detaljno objašnjeno korišćenje servisa.</p> <p>Korišćenjem PAYS servisa prihvatate navedene uslove i pravila, pa se smatra da ste automatski pristali na iste. U suprotnom, PAYS servis i distributer se oslobađaju svake odgovornosti.</p> <h4 class="text-center">USLOVI KUPOVINE</h4> <p>Uslovi kupovine definišu pravila i postupke ponuđene od strane PAYS servisa, koji se pored ostalog sastoje iz: naručivanja, pripreme, dostave, plaćanja, povrata i reklamacije robe. </p> <p>Za kupovinu proizvoda preko PAYS servisa kupcu je neophodna PAYS-RS mobilna aplikacija (trenutno podržana za Android operativni sistem) i može se preuzeti na Play prodavnici: https://play.google.com/store/apps/details?id=camengineeringns.pays.srpski</p> <p>Kupcem se smatra svaka osoba koja elektronskim putem naruči bar jedan proizvod, registruje se i pri tom prihvati sve predviđene uslove korišćenja:</p> <p>- Kupac putem PAYS servisa naručuje artikle, koji mu se isporučuju na željenu adresu ili na unapred definisanu tačku isporuke.</p> <p>- Nakon završetka narudžbine na Web portalu kupac na svoju e-mail adresu dobija spisak naručenih artikala sa prikazanim količinama i cenom.</p> <p>- Kupac je dužan da naručene proizvode preuzme i proveri sadržaj paketa na licu mesta, te očitavanjem QR koda na dostavljenom paketu izvrši plaćanje dela, plaćanje celog iznosa narudžbine, ili u potpunosti odbije plaćanje pomoću svoje mobilne aplikacije PAYS-RS.</p> <p>- Trenutkom prodaje smatra se onaj momenat kada je roba isporučena na traženu lokaciju, preuzmete je u svoje vlasništvo, te se završi proces plaćanja očitavanjem QR koda na dostavljenom paketu sa robom.</p> <p>- INDUSTRIAL PROJECT nije obveznik PDV, te su sve cene na http://www.pays-system.com prikazane su u nacionalnoj valuti (RSD) bez PDV-a.</p> <p>- Distributer ne garantuje da će svaki poručeni artikal biti isporučen.</p> <p>- Distributer ima diskreciono pravo da korisniku servisa, bez obaveštenje o tome, trajno ukine pristup PAYS servisu, i to u slučajevima kada korisnik: NAMERNO zloupotrebljava servis, ne poštuje pravila i uslove kupovine.</p> <p>- Prikazana fotografija artikla može odstupiti od stvarnog izgleda artikla i molimo Vas da to imate u vidu. <p>- Pojedine fotografije artikala predstavalju predlog za aranžiranje i nisu sastavni deo artikla.</p> <p>- Cena dostave zavisi od težine paketa i rastojanja dostave, te će biti jasno istaknuta prilikom svake narudžbine.</p> <h4 class="text-center">REGISTRACIJA I SIGURNOST PODATAKA</h4> <p>Ukoliko do sada niste naručivali i kupovali putem PAYS servisa neophodno je da kreirate Vaš korisnički nalog prijavom na stranici Prijava.</p> <p>Na stranici Prijava omogućena je registracija svih učesnika u sistemu: farmera, distributera i kupca. Registracija za kupca se sastoji iz par jednostavnih koraka (manje od 30 sekundi) posle kojih postajete registrovani član i korisnik usluga PAYS servisa. Vaša e-mail adresa, lozinka, korisničko ime, broj telefona i adresa stanovanja koje unosite prilikom registracije dovoljni su za predstojeće kretanje po PAYS WEBSHOP portalu i obavljanje svih radnji u okviru servisa (formiranje korpe, naručivanje, rezervacija sredstava na kartici i potvrda plaćanja).</p> <p>Na kraju procesa naručivanja preko Web portala, da bi Vaša narudžbina ispravno bila obrađena, molimo Vas da ispravno popunite sve tražene podatke. Uz pomoć tih podataka farmer ili dostavljač će biti u mogućnosti da Vam kvalitetno isporučimo željenu robu.</p> <p>Kao korisnik PAYS servisa odgovorni ste za tačnost unesenih podataka prilikom registracije. Ukoliko dođe do bilo kakvih promena podataka koje ste uneli prilikom registracije, dužni ste da odmah ažurirate Vaš korisnički nalog na strani Moj Profil ili pisanim obaveštenjem na e-mail: office@pays-system.com i na taj način obavestite korisnički servis PAYS sistema o nastalim promenama.</p> <p>Prilikom registracije na PAYS servis obavezan korak (kao što smo naveli) je kreiranje lozinke koju trebate zadržati samo za sebe i koju na svoju odgovornost delite sa drugim osobama. Nakon registracije PAYS servis će Vam poslati e-mail za potvrdu registracije. Registracijom, prihvatate odgovornost za komunikaciju sa Vaše e-mail adrese bilo da su u pitanju narudžbine, promena podataka ili odjava sa liste registrovanih. Ako saznate ili posumnjate da neko zna Vašu lozinku, ili je može koristiti suprotno Vašim očekivanjima, lozinku možete samostalno promeniti i zadržati samo za sebe, a ako to niste u mogućnosti kontaktirajte naš Call Centar na broj 021/455-071 od radnim danima od 08:00 do 15:00 h ili putem e- mail adrese: office@pays-system.com.</p> <p>Ukoliko, ipak postoje bilo kakva sumnja u mogućnost postojanja sigurnosnih propusta, nedopuštenog korišćenja usluga ili kršenja navedenih uslova i pravila, distributer INDUSTRIAL PROJECT zadržava pravo da od Vas traži promenu prvobitno navedene lozinke kao i da ukine korisnički nalog bez prethodne najave.</p> <p>Prilikom unošenja podataka o platnoj kartici, poverljive informacija se prenose putem javne mreže u zaštićenoj (kriptovanoj) formi upotrebom SSL protokola i PKI sistema, kao trenutno najsavremenije kriptografske tehnologije.</p> <p>Sigurnost podataka prilikom kupovine, garantuje procesor platnih kartica, Banca Intesa ad Beograd, pa se tako kompletni proces naplate obavlja na stranicama banke. Niti jednog trenutka podaci o platnoj kartici nisu dostupni našem sistemu.</p> <h4 class="text-center">IZJAVA O ZAŠTITI, PRIKUPLJANJU I KORIŠĆENJU LIČNIH PODATAKA</h4> <p>Distributer, INDUSTRIAL PROJECT se obavezuje da će čuvati i štititi privatnost svih registrovanih korisnika i njihovih podataka na http://www.pays-system.com i da ih neće koristiti u druge svrhe koje nisu predmet naručivanja ili staviti na uvid trećim licima.</p> <p>U ime PAYS-SYSTEMA obavezujemo se da ćemo čuvati privatnost svih naših kupaca. Prikupljamo samo neophodne, osnovne podatke o kupcima/ korisnicima i podatke neophodne za poslovanje i informisanje korisnika u skladu sa dobrim poslovnim običajima i u cilju pružanja kvalitetne usluge. Dajemo kupcima mogućnost izbora uključujući mogućnost odluke da li žele ili ne da se izbrišu sa mailing lista koje se koriste za marketinške kampanje. Svi podaci o korisnicima/kupcima se strogo čuvaju i dostupni su samo zaposlenima kojima su ti podaci nužni za obavljanje posla. Svi zaposleni PAYS-SYSTEMA (i poslovni partneri) odgovorni su za poštovanje načela zaštite privatnosti.</p> <p> U skladu sa poslovnom politikom prikupljaju se samo nužni, osnovni podaci o korisnicima servisa. Na zahtev korisnika, obavezni smo da im pružimo informaciju o načinu korišćenja njihovih podataka. Svi podaci o korisnicima se strogo čuvaju i dostupni su samo ovlašćenim licima zaposlenima u INDUSTRIAL PROJECT (kao distributeru), kojima su ti podaci neophodni za obavljanje poslova i kvaliteno pružanje usluge. Zaposleni u firmi INDUSTRIAL PROJECT krivično su odgovorni za poštovanje načela zaštite privatnosti.</p> <p> Ukoliko dođe do promene našeg stava o privatnosti, promene će biti objavljene u ovom odeljku na PAYS servisu.</p> <p> Sve promene stupaju na snagu odmah po njihovom objavljivanju.</p> <p> Korišćenjem PAYS servisa, po objavljivanju promena o stavu privatnosti, Vi se slažete sa svim promenama i prihvatate ih u celosti.</p> <p> Korišćenjem PAYS servisa Vi dajete svoju saglasnost sa stavovima o privatnosti izraženim i objavljenim na portalu.</p> <h4 class="text-center">NARUČIVANJE ROBE</h4> <p>Naručivanje robe možete vršiti 24 časa na dan, sedam dana u nedelji. Odabir proizvoda može se izvršiti bez prethodne prijave na PAYS servis, a obavezna je prijava na PAYS servis, prilikom završavanja procesa naručivanja.</p> <p> Kao kupac, prilikom prijave u sistem, stičete mogućnost dodavanja željenih artikala u „Pregled korpe“. Artikle možete da birate koristeći „Navigacioni meni” gde su artikli klasifikovani u kategorije i podkategorije po vrsti artikla.</p> <p> Klikom na dugme „Dodaj u korpu“ odabrani artikal dodajete u Vašu korpu (Pregled korpe) i na taj način ste izvršili dodavanje proizvoda po jedinici mere dodatog artikla (komad, kg, l...). Ukoliko ste u sekciji „Pregled korpe” ubacili proizvode jednog proizvođača, proizvode drugog proizvođača, njihovim odabirom, možete ubaciti u „Listu želja”.</p> <p> Količinu naručenih artikala možete menjati direktnim unosom u polje za količinu ili pomoću dugmića (+) i (-).</p> <p> Količine manje od jedinične mere se poručuju tako što ćete u polje za količinu uneti željenu količinu (Na primer: ukoliko želite da naručite 500g krompira, potrebno je da u polje za količinu unesete 0.5). Kod artikala na merenje i artikala u rinfuzi može se desiti da isporučena težina odstupa od prvobitno poručene (+/- kg). Napomena: Molimo da imate u vidu da se ovakva odstupanja dešavaju i da se ne mogu smatrati prigovorom.</p> <p> Pregled odabranih proizvoda i količina imate na stranici „Pregled korpe“.</p> <p> Narudžbina ulazi u sistem za dalju obradu tek posle upisa podataka za isporuku na stranici. Aplikacije je podešena tako da će Vam svaki put ponuditi adrese prethodnih isporuka (u padajućem meniju) koji možete odabrati ili eventualno promeniti. Napomena: Imate mogudnost menjanja adresa za isporuku i možete je dodati prilikom popunjavanja podataka za isporuku.</p> <p> Za završetak formiranja Vaše narudžbine potrebno je da kliknete na dugme “Plaćanje” u sekciji “Pregled korpe” i da na stranici za plaćanje proverite sve unete podatke, kako biste klikom na dugme Plaćanje u dnu strane bili preusmereni na sajt platnog procesora kako bi se izvršila rezervacija sredstava za plaćanje i potvrdila narudžbina.</p> <p> Nije moguće da dopunite/izmenite potvrđenu narudžbenicu kada se završi proces plaćanja, odnosno kada vam se sredstva sa kartice rezervišu i narudžbina se formira. Ukoliko imate hitno i neodložno otkazivanje kompletne narudžbenice, molimo Vas da je uputite na email: office@pays- system.com ili pozovete naš telefon 021/455-071.</p> <h4 class="text-center">PRIPREMA I ISPORUKA ROBE</h4> <p>Pre transporta, u fazi pripreme za isporuku, proizvođač (farmer) pakuje robu u odgovarajudu ambalažu, a dostavljač obezbeđuje pravilno skladištenje i transport robe u svom prevoznom vozilu.</p> <p> Mogudnost oštećenja robe u transportu nije isključena. Prilikom dostave neispravne i/ili oštećene robe, u mogućnosti ste, na mestu predaje naručene robe, umanjiti iznos računa za cenu oštećenog artikla i izvršiti povrat istog. Kupac je dužan da prilikom preuzimanja naručene robe proveri eventualna oštećenja, odmah ih prijavi pomoću mobilne aplikacije PAYS servisa i odbije da preuzme oštećenu robu na kojoj su vidljiva oštećenja.</p> <p> Provera ispravnosti narudžbine prilikom prijema zavisi isključivo od ocene kupca i dostavljača, a naknadne reklamacije se uvažavaju u skladu sa Zakonom, a posredstvom nadležnog lica iz firme INDUSTRIAL PROJECT. O riziku koji može nastati prilikom isporuke robe, više se možete informisati u stavci PRIGOVORI/ REKLAMACIJE/ POVRAT.</p> <h4 class="text-center">ISPORUKA</h4> <p> Naručenu robu proizvođači dostavljaju sopstvenim prevozom ili putem dostavljača kojeg odaberu iz PAYS sistema.</p> <p> Termini isporuke se utvrđuju prilikom narudžbine i nije ih moguće naknadno menjati.</p> <h4 class="text-center">NAČINI PLAĆANJA</h4> <p> Plaćanje na PAYS servisu se vrše isključivo bezgotovinski, putem MASTERCARD, VISA i MAESTRO platnih kartica.</p> <p> Kupci koji su fizička ili pravna lica, obavezuju se da će robu naručenu na portalu http://www.pays- system.com prilikom dostave paketa platiti (potvrdom prijema paketa putem predviđene mobilne aplikacije).</p> <h4 class="text-center">PRIGOVORI/ REKLAMACIJE/ POVRAT</h4> <p>Na robu, kupljenu putem PAYS servisa, kupac može uputiti prigovor na mestu isporuke proverom sadržine i kvaliteta poručene robe putem PAYS mobilne aplikacije. Ukoliko imate bilo koji prigovor koji ne možete da rešite prilikom dostave robe moguće je da ostavite komentar na svaku narudžbinu i da ocenite svaki proizvod pojedinačnog proizvođača, a možete nam uvek poslati i e-mail na office@pays- system.com.</p> <p> Zaposleni u PAYS servisu su obučeni za rešavanje prigovora i postupaju po utvrđenim Pravilima i Uslovima donetim od strane privrednog subjekta. Bitna pretpostavka i uslov za rešavanje prigovora jeste potpuna razmena informacija sa kupcem i postojanje ispostavljenog računa i originalne ambalaže robe (ukoliko postoji) koja podleže reklamaciji.</p> <p> Kupac je u obavezi da sačuva, dostavi (elektronski) račun i eventualno ambalažu. Svi prigovori nastali nakon trenutka preuzimanja dostavljenog paketa moraju biti posebno razmotreni. Reklamacije će biti prihvatljive samo u okviru Zakona i propisa Republike Srbije.</p> <p> Pri isporuci robe kupac je dužan da:</p> <p> - proveri ispravnost isporuke,</p> <p> - uporedi primljenu robu sa računom,</p> <p> - ukoliko nešto nedostaje da odmah napomene dostavljaču i kroz PAYS mobilnu aplikaciju.</p> <p> Ukoliko prigovor bude rešen u korist kupca, a za slučaju nemogućnosti isporuke druge, zamenske robe, distributer će nadoknaditi kupcu njegove troškove povratom novca, u vrednosti robe za koju je prigovor usvojen.</p> <p>U slučaju vraćanja robe i povraćaja sredstava kupcu koji je prethodno platio nekom od platnih kartica, delimično ili u celosti, a bez obzira na razlog vraćanja, PAYS-SYSTEM je u obavezi da povraćaj vrši isključivo preko VISA, EC/MC i Maestro metoda plaćanja, što znači da će banka na zahtev prodavca obaviti povraćaj sredstava na račun korisnika kartice.</p> <h4 class="text-center">IZMENE</h4> <p>Distributer može u skladu sa svojom poslovnom politikom, bez prethodne najave, ažurirati ili izmeniti podatke objavljene na Web servisu http://www.pays-system.com. Distributer zadržava pravo na izmenu navedenih uslova i pravila, a o svim promenama korisnici se mogu obavestiti u Info sekciji sajta.</p> <p> Ukoliko se registrovani korisnik ne saglasi sa navedenim i ponuđenim izmenama o uslovima i pravilima korišćenja i ne želi da ih prihvati, u obavezi je da kontaktira Distributera na jedan od sledećih načina:</p> <p> - pozivom na broj 021/455-071 radnim danima od 08:00 do 15:00 i</p> <p> - slanjem poruke na e-mail adresu: office@pays-system.com.</p> <p> Tokom trajanja ovog postupka, korisnik ne može koristiti usluge PAYS servisa.</p> <h4 class="text-center">CENE</h4> <p>Sve cene na http://www.pays-system.com prikazane su u nacionalnoj valuti (RSD).</p> <p> Cene na PAYS servisu su višeznačne u skladu sa Zakonom o trgovini.</p> <p> Ono što plaćate jeste cena na dan kada ste naručili robu.</p> <p> PAYS sistem sa velikim procentom predviđanja formira svoju ponudu, ali zbog nepredviđenih okolnosti zadržava pravo da promeni cene u bilo kom momentu koji ne narušava legalitet i legitimitet poslovanja u skladu sa zakonskim propisima.</p> <p> Ukoliko niste zadovoljni kvalitetom naručenog artikla, možete ga u skladu sa svim navedenim uslovima vratiti. Artikal možete vratiti, a mi ćemo Vam izvršiti povrat sredstava. Sve se to vrši putem predviđene PAYS servis mobilne aplikacije.</p> <p> Cene za robu koja se meri i koja se napladuje prema težini, mogu da odstupe i do 10% zbog nemogućnosti da se tačno precizira merenje. Odstupanja težine su minimalna, što znači da možete dobiti nekoliko grama više ili manje, a cena će biti obračunata po težini koju ste naručili. </p> <h4 class="text-center">KOMUNIKACIJA SA KORISNICIMA</h4> <p> Vaš broj telefona (fiksni/mobilni) ili e-mail adresa koju navedete prilikom registracije može biti upotrebljena u svrhe potvrđivanja narudžbenice, kao i termina isporuke naručene robe.</p> <p> Distributer zadržava pravo da sve svoje registrovane korisnike na http://www.pays-system.com, povremeno putem mail-a ili slanjem sms-a, obavestiti o novim uslugama ili artiklima koje nudi pod posebnim i drugačijim uslovima od uobičajenih.</p> <p> Sva Vaša pitanja, sugestije ili nejasnoće možete nam uputiti na:</p> <p> Telefon 021/455-071 radnim danima od 08:00 do 15:00</p> <p> E-mail adresu: office@pays-system.com</p> <p> Na sva Vaša pitanja biće odgovoreno brzo i profesionalno.</p> <h4 class="text-center">OGRANIČENJE ODGOVORNOSTI</h4> <p>Distributer ni pod kakvim okolnostima neće biti odgovoran korisniku servisa:</p> <p> - Za pravilno ili nepravilno korišćenje PAYS servisa kao i za eventualnu štetu nanešenu opremi koja se koristi za pristup portalu, a koja nastane po tom osnovu, a da je Distributer nije mogao preduprediti.</p> <p> - Za bilo kakvu štetu koju korisnik pretrpi pravilnim ili nepravilnim korišćenjem portala, kao i drugih informacija, servisa, usluga, saveta ili proizvoda do kojih se došlo pomoću linkova ili reklama na servisu ili onih koji su na bilo koji način povezane sa PAYS servisom.</p> <p> - Za nepravilno funkcionisanje ili prekid rada servisa, koji je prouzrokovan direktno ili indirektno prirodnim silama ili drugim uzrocima van razumne moći kontrole, u šta spadaju: problemi funkcionisanja Interneta, kvarovi na kompjuterskoj opremi, problemi u funkcionisanju telekomunikacione opreme i uređaja, nestanak struje, štrajkovi, obustave rada, nemiri, nestašice sadržaja ili manjka radne snage, naredbe državnih ili drugih organa, elementarne nepogode.</p> <p> - Za kašnjenje isporuke bilo koje vrste, kako je ta odgovornost na strani farmera i njegovog odabranog dostavljača.</p> <p> Sve informacije dostupne na http://www.pays-system.com, isključivo su namenjene licu koje ih čita, upoznaje se sa njima i daje svoju saglasnost na registraciju. Ove informacije se ne smeju koristiti u komercijalne svrhe u korist trećih lica, niti je dozvoljeno da se neovlašćeno distribuiraju trećim licima.</p> <p> Za eventualne greške, nejasnoće i nepravilnosti objavljene na portalu, http://www.pays-system.com firma Distributera ne snosi odgovornost. Informacije dostupne na PAYS servisu ne smeju se smatrati osnovom za donošenje jednostranih ocena o odstupanju od sopstvenih očekivanja i opredeljenja.</p> <p> Poslovne rizike i odstupanje od izražene volje, obe strane u ovom poslovnom odnosu moraju sagledavati realno, sa pažnjom i uz puno međusobno usaglašavanje i razmenu svih činjenica i okolnosti koje za posledicu mogu imati ekonomske posledice i štetu, kako materijalnu tako i nematerijalnu.</p> <p> Registracijom i prihvatanjem uslova poslovanja sa PAYS servisom, iskazali ste zapravo saglasnost da Distributera, nećete smatrati odgovornima za bilo kakvu direktnu ili indirektnu, slučajnu, nematerijalnu ili materijalnu štetu, gubitke ili troškove nastale kao rezultat upotrebe ili nemogućnosti upotrebe neke od informacija dostupnih na stranicama PAYS servisa.</p> <p> Distributer ne garantuje da će PAYS servis uvek biti dostupan i raspoloživ, te da neće sadržavati greške ili viruse. Svaki korisnik izričito prihvata korišćenje ovog servisa na svoju sopstvenu odgovornost.</p> <p> Privredni subjekti čija je delatnost medijska, biće odgovorni za štetu koju mogu naneti neovlašćenim korišćenjem informacija. Distributer zadržava pravo da od takvih subjekta traži naknadu štete koja će biti utvrđena po odredbama Zakona o obligacionim odnosima koji je važeći na području Republike Srbije.</p> <p> Učesnici koji koriste portal za naručivanje http://www.pays-system.com, prihvataju da obeštete Distributera za potraživanja koja istakne prema njima, bilo da su u kategoriji troškova, tržišne materijalne štete, nematerijalne štete ili odgovornosti zbog nesavesnog korišćenja materijala sa portala, uključujući i bilo kakvu direktnu ili indirektnu, materijalnu ili nematerijalnu štetu bez obzira da li je ista prouzrokovana namerno ili ne.</p> <p> Eventualne neusaglašenosti, interesne strane moraju prvo pokušati da reše dogovorom i sporazumno. Ukoliko to ne postignu, nadležan je sud u Novom Sadu.</p> <p> <h4 class="text-center">USLUGE TREĆIM LICIMA</h4> <p>Usluge koje Vam pruža PAYS servis ne podrazumevaju postojanje troškova za računarsku opremu i usluge provajdera za pristup PAYS servisu. Distributer nije odgovoran za telefonske ili bilo koje druge troškove do kojih može doći u ovakvom pristupu.</p> <p> Napominjemo da http://www.pays-system.com upotrebljavate isključivo na sopstveni rizik. Distributer i PAYS servis ne garantuju za poslovne odnose koje imate sa trećom stranom i ne mogu se smatrati odgovornim i preuzeti odgovornost za direktne ili indirektne štete koje možete pretrpeti korišćenjem usluga trećih lica.</p> <p> Internet je internacionalna, nezavisna računarska mreža koju Distributer ne kontroliše globalno, već i isključivo u meri u kojoj je koristi za sopstvene potrebe, tako da iz tih razloga ni u kojem obliku ne može garantovati dostupnost PAYS servisa koje direktno ne kontroliše.</p> <p> <h4 class="text-center">POMOĆ</h4> <p>Različite vrste pomoći pri korišćenju PAYS servisa se nalaze u sekciji Info na adresi http://www.pays- system.com i ocenjujemo da će Vam biti od koristi. Želimo da Vas posavetujemo da nam se obratite pozivom na broj telefona 021-455-071 radnim danima od 08:00 do 15:00 ili slanjem poruka na mail adresu: office@pays-system.com.</p> <p> Takođe, i na ovom mestu i ovom prilikom, molimo Vas da vodite računa o tome da slanje privatnih poruka elektronskom poštom može biti nesigurno i podložno neovlašćenom pristupu trećih lica ili pogrešnoj dostavi. Svaka poruka primljena elektronskom poštom smatraće se nepoverljivom i u skladu sa tim PAYS servis i Distributer ne odgovaraju za sigurnost i privatnost takvih poruka. S druge strane, Vaše poruke upućene nama upotrebljavaćemo, raspolagati njima i distribuirati ih samo našim službenim licima koji su uključeni u kompletnu uslugu PAYS servisa.</p> <p> <h4 class="text-center">FOTOGRAFIJE</h4> <p>Fotografije na PAYS servisu http://www.pays-system.com su ilustrativne prirode i neke fotografije mogu odstupati od stvarnog izgleda artikala iz tehničkih razloga i nemogućnosti prikaza izgleda u prostoru iz svih uglova.</p> <p> Posebna napomena: pojedini predmeti i proizvodi prikazani na slici proizvoda koji naručujete predstavljaju samo predlog za serviranje i nisu deo naručenog proizvoda.</p> <h4 class="text-center">INTELEKTUALNO VLASNIŠTVO</h4> <p>Sadržaj PAYS servisa http://www.pays-system.com zaštićen je i Distributer, firma INDUSTRIAL PROJECT ostvaruje jedinstveno pravo na njegovo upravljanje na teritoriji Republike Srbije. Slike i tekstovi prikazani na PAYS servisu ne smeju se kopirati i koristiti u drugim publikacijama, pisanim ili elektronskim, osim uz izričito odobrenje PAYS servisa.</p> <p> Korišćenjem materijala sa PAYS servisa, svi korisnici obavezuju se da se u potpunosti pridržavaju ovde utvrđenih ograničenja, uslova i zahteva.</p> <p> Datum i mesto</p> <p> 01.03.2016.</p> <p> Novi Sad, Srbija</p> <p> Dokument izdat od strane PAYS servisa</p> <h5 class="text-center"> Ovo je elektronski dokument, punovažan bez pečata i potpisa.</h5>',
            DELIVERY_TIME_PREDEFINED_LOCATION: 'Vašu narudžbinu možete preuzeti sa PAYS dostavnog mesta prvog sledećeg radnog dana u vremenskom intervalu',
            PREVIOUS_LOCATION : 'Prethodno korišćena mesta',
            REGISTERED_DISTRIBUTORS : 'Registrovani distributeri',
            NO_DISTRIBUTORS_FOUND : 'Nijedan distributer nije pronađen koristeći zadane kriterijume. Molimo Vas pokušajte sa drugim kriterijumima.',
            NO_PREVIOUS_LOCATIONS : 'Trenutno niste prijavljeni. Molimo Vas da se prijavite da biste videli lokacije prethodnih dostava za Vaš nalog.',
            NO_FARMERS_FOUND : 'Nijedan farmer nije pronađen koristeći zadane kriterijume. Molimo Vas pokušajte sa drugim kriterijumima.',
            WORKING_HOURS_DESC : 'U slučaju nastanka problema sa vremenom dostave, kontaktiraće vas direktno farmer/dostavljač na Vaš kontakt telefon.',
            ORDER_INFO_ERROR : 'Dogodila se greška prilikom plaćanja Vaše narudžbine. Molimo Vas proverite unete podatke sa Vaše platne kartice i pokušajte sa kreiranjem nove narudžbine.',
            PASSWORD_FORMAT: 'Dužina lozinke mora biti minimum 8 karaktera.<br> Lozinka mora sadržati : 1 malo slovo, 1 veliko slovo, 1 broj',
            ANDROID_APP_TEXT : 'Za prihvatanje pošiljke trebaće vam:',
            PAYS_ANDROID : 'Iskusite PAYS na Android-u',
            APK_PAYS_ICON : 'images/android/pays-rs.jpg',
            APK_QR_ICON : 'images/android/srpQRAPK.png',
            APK_GOOGLE_PLAY_LINK : 'https://play.google.com/store/apps/details?id=camengineeringns.pays.srpski',
            NO_PRODUCTS_IN_CART : 'U vašoj korpi nema proizvoda. Molimo Vas pronađite željene proizvode i ubacite ih u Vašu korpu.',
            BUSINESS_POLICY : 'Poslovna pravila',
            MINIMAL_ORDER_AMOUNT : 'Minimalan iznos narudžbine',
            WORK_HOURS : 'Radno vreme',
            WORK_HOURS_FARMER : 'Radno vreme farmera',
            MONDAY : 'Ponedeljak',
            TUESDAY : 'Utorak',
            WEDNESDAY : 'Sreda',
            THURSDAY : 'Četvrtak',
            FRIDAY : 'Petak',
            SATURDAY : 'Subota',
            SUNDAY : 'Nedelja',
            WORK_HOURS_UPDATED : 'Radno vreme ažurirano',
            WORK_HOURS_NOT_UPDATED : 'Neuspešno ažuriranje radnog vremena',
            MINIMUM_ORDER_AMOUNT : 'Minimalna cena narudžbine kod ovog farmera je',
            CURRENT_AMOUNT : 'Trenutna ukupna cena proizvoda u vašoj narudžbini je',
            CLOSED : 'Ne radi',
            TOTAL_TAX :' Ukupan iznos PDV-a',
            NO_TRANSPORT_PRICE : 'Molimo Vas da proverite da li ste izračunali cenu prevoza na stranici \'Pregled korpe\' i vratite se da biste završili naručivanje.',
            ITEM_PRICE_CHANGED : 'Cena nekog od željenih proizvoda se promenila. Proverite na stranici za pregled korpe.',
            PRICE_CHANGED : 'Promenjena cena proizvoda!',
            OLD_PRICE : 'Stara cena',
            NEW_PRICE : 'Nova cena',
            USER_PICK_UP : 'Dostava proizvoda nije izabrana prilikom kreiranja narudžbine.'
        })
    $translateProvider.preferredLanguage('en_EN');
}]);

angular.module('paysApp').factory('myHttpInterceptor', ["$q", "$rootScope", function($q,$rootScope) {
    return {
        // optional method
        'request': function(config) {
            // do something on success
            if(!/.html/.test(config.url) && !/.Pagination/.test(config.url)){
                //if(/.images/.test(config.url)){
                //  config.url = $rootScope.serverImagesURL + config.url;
                //}else {
                config.url = $rootScope.serverURL + config.url;
                //});
                if ($rootScope.credentials && $rootScope.credentials.token) {
                    config.headers['X-Auth-Token'] = $rootScope.credentials.token;
                } else {
                    config.headers['X-Auth-Token'] = "9F2490EC33584328A5E83991724C28AE";
                }
                console.log("NEW URL "+ config.url);
                console.log("HEADERS " + JSON.stringify(config.headers,null,4));
            }
            return config;
        },

        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function(rejection) {
            // do something on error
            //if (canRecover(rejection)) {
            //  return responseOrNewPromise
            //}
            return $q.reject(rejection);
        }
    };
}]);

angular.module("paysApp").config(['$routeProvider', function (routeProvider) {

  routeProvider.when("/", {
    templateUrl: "partials/mainPage.html",
    controller: "mainCtrl",
    resolve: {},
    restricted: false
  })
    .when("/cart", {
      templateUrl: "partials/cart.html",
      controller: "cartCtrl",
      resolve: {},
      restricted: false
    })
    .when("/wishlist", {
      templateUrl: "partials/wishlist.html",
      controller: "wishlistCtrl",
      resolve: {},
      restricted: false
    })
    .when("/checkout", {
      templateUrl: "partials/checkout.html",
      controller: "checkoutCtrl",
      resolve: {},
      restricted: false
    })
    .when("/farmer/:id/", {
      templateUrl: "partials/farmerPage.html",
      controller: "farmCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributor/:id/", {
      templateUrl: "partials/distributorPage.html",
      controller: "distributorCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributoredit/:id/", {
      templateUrl: "partials/editDistributor.html",
      controller: "editDistributorCtrl",
      resolve: {},
      restricted: true,
      allow: 'T'
    })
    .when("/farmeredit/:id/", {
      templateUrl: "partials/editFarmer.html",
      controller: "editFarmerCtrl",
      resolve: {},
      restricted: true,
      allow: 'F'
    })
    .when("/buyeredit/:id/", {
      templateUrl: "partials/editBuyer.html",
      controller: "editBuyerCtrl",
      resolve: {},
      restricted: true,
      allow: 'C'
    })
    .when("/404", {
      templateUrl: "404.html",
      resolve: {},
      restricted: false
    })
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "loginCtrl",
      resolve: {},
      restricted: false
    })
    .when("/register", {
      templateUrl: "partials/register.html",
      controller: "registerCtrl",
      resolve: {},
      restricted: false
    })
    .when("/distributorSearch", {
      templateUrl: "partials/distributorSearch.html",
      controller: "distributorSearchCtrl",
      resolve: {},
      restricted: false
    }).when("/redirection/token/:token/id/:id/role/:role", {
      templateUrl: "partials/redirect.html",
      controller: "redirectCtrl",
      resolve: {},
      restricted: false
    }).when("/forgotpass/:token", {
      templateUrl: "partials/forgotPassword.html",
      controller: "forgotPasswordCtrl",
      resolve: {},
      restricted: false
    }).when("/activateuser/:token", {
      templateUrl: "partials/activateUser.html",
      controller: "activateUserCtrl",
      restricted: false
    }).when("/order/:orderId", {
      templateUrl: "partials/order.html",
      controller: "orderCtrl",
      restricted: false
    }).when("/info", {
      templateUrl: "partials/infoPage.html",
      controller: "",
      restricted: false
    }).otherwise({redirectTo: '/'});
}]);
angular.module('paysApp').controller("activateUserCtrl", ["$scope", "$http", "$filter","$modal", "$routeParams","$window",
  "UserService", "Notification",
  function (scope, http, filter,modal, routeParams,$window, UserService, Notification) {

    console.log("activateUserCtrl");
    var token = routeParams.token;
    console.log(token);

    scope.success=false;
    scope.message = '';
    UserService.activateUser(token).then(function(){
      scope.success=true;
      scope.message = 'ACTIVATED_USER_MSG';
    }).catch( function(err){
      scope.message = 'NOT_ACTIVATED_USER_MSG';
    });

    scope.goToLogin = function () {
      $window.location.href = "#/login";
    }
  }]);
angular.module('paysApp').controller("cartCtrl", ["$scope", "$rootScope", "$q", "$location", "$modal", "$filter", "CartService", "WishlistService",
    "SearchService", "OrderService", "UserService", "FarmerService", "Notification",
    function (scope, rootScope, q, location, modal, filter, CartService, WishlistService, SearchService, OrderService, UserService, FarmerService, Notification) {

        console.log("Cart Ctrl!");

        scope.total = "";

        scope.transportPrice = 0;

        scope.previousAddresses = UserService.getUserDeliveryAddress(rootScope.credentials.id);

        scope.farmerData = CartService.getCartFarmer();

        scope.farmer = null;

        scope.address = {
            city: "",
            street: "",
            houseNumber: "",
            apartmentNumber: "",
            floor: "",
            postalCode: ""
        }

        scope.prevAddress = {
            address: null
        };

        scope.locationType = {};
        scope.predefinedLocation = {
            data: null
        };
        //Checkout data


        scope.transportPriceDeffered = null;

        scope.calculateTotal = function () {
            scope.totalPrice = 0;
            for (var i = scope.cartItems.items.length - 1; i >= 0; i--) {
                scope.totalPrice = scope.totalPrice + scope.cartItems.items[i].itemPrice * scope.cartItems.items[i].itemNum;
            }
            scope.total = scope.totalPrice + (scope.locationType.selected != rootScope.noDeliveryString ? parseFloat(scope.transportPrice) : 0);
        }

        scope.calculateTransportPrice = function () {
            scope.transportPriceDeffered = q.defer();
            if (scope.locationType.selected != rootScope.noDeliveryString) {
                SearchService.getDistanceBetweenCities(scope.address.city + ", Serbia", scope.farmerData.farmerLocation + ", Serbia").then(function (data) {
                    var reqData = {
                        distance: data,
                        items: []
                    };
                    angular.forEach(scope.cartItems.items, function (item) {
                        reqData.items.push({
                            item: item.itemId,
                            amount: item.itemNum
                        })
                    });
                    console.log(reqData);
                    FarmerService.getTransportPrice(scope.farmerData.farmerId, reqData).then(function (data) {
                        scope.transportPrice = data.price;
                        scope.calculateTotal();
                        Notification.success({message: filter('translate')('TRANSPORT_PRICE_SUCCESS')});
                        scope.transportPriceDeffered.resolve();

                    }).catch(function (err) {
                        Notification.error({message: filter('translate')('TRANSPORT_PRICE_FAILED')});
                        scope.transportPriceDeffered.reject();
                    })
                }).catch(function (err) {
                    Notification.error({message: filter('translate')('LOCATION_NOT_FOUND')});
                    scope.transportPriceDeffered.reject();
                });
            } else {
                scope.transportPrice = 0;
                scope.transportPriceDeffered.resolve();
            }
            return scope.transportPriceDeffered.promise;
        }

        SearchService.getPredefinedLocations().then(function (data) {
            scope.predefinedLocations = data;
        });
        scope.loadDeffered = null;
        if (scope.farmerData != null) {
            scope.loadDeffered = q.defer();
            SearchService.getFarmerById(scope.farmerData.farmerId).then(function (data) {
                scope.farmer = data;

                SearchService.getFarmerProducts(scope.farmerData.farmerId).then(function (data) {
                    scope.farmerProducts = data;
                    scope.cartItems = CartService.getItems();
                    scope.loadData();
                    var orderData = OrderService.getOrderData();
                    if (orderData != null) {
                        scope.locationType.selected = orderData.transportType;
                        scope.address = orderData.address;
                        scope.calculateTransportPrice();
                    } else {
                        scope.locationType.selected = rootScope.newAddressString;
                    }
                    scope.loadDeffered.resolve();
                    if (scope.cartItems != null) {
                        var promisesWaiting = 0;
                        scope.loadDeffered = q.defer();
                        for (var j = 0; j < scope.cartItems.items.length; j++) {
                            scope.cartItems.items[j].amount = 0;
                            for (var i = 0; i < scope.farmerProducts.length; i++) {
                                if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
                                    scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
                                    if (scope.cartItems.items[j].amount < scope.cartItems.items[j].itemNum) {
                                        scope.cartItems.items[j].resourceExcedeed = true;
                                        scope.cartItems.items[j].alertMessage = filter('translate')('MAX_AVAILABLE') + " " + scope.cartItems.items[j].amount + " " + scope.cartItems.items[j].itemMeasure.code;
                                    }
                                    if(parseFloat(scope.cartItems.items[j].itemPrice) != parseFloat(scope.farmerProducts[i].price.price)){
                                        scope.cartItems.items[j].oldPrice = parseFloat(scope.cartItems.items[j].itemPrice).toFixed(2);
                                        scope.cartItems.items[j].itemPrice = parseFloat(scope.farmerProducts[i].price.price).toFixed(2);
                                    }
                                    scope.cartItems.items[j].shortDesc = scope.farmerProducts[i].product.shortDesc;
                                    if (scope.farmerProducts[i].customImage) {
                                        FarmerService.getStockProductImage(scope.farmerProducts[i].stockItemId, scope.farmerProducts[i].customImage).then(function imgArrived(data) {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                            for (var j = 0; j < scope.farmerProducts.length; j++) {
                                                if (scope.farmerProducts[j].stockItemId === data.index) {
                                                    scope.farmerProducts[j].img = "data:image/jpeg;base64," + data.document_content;
                                                    data.index = scope.farmerProducts[j].product.id;
                                                }
                                            }
                                            for (var j = 0; j < scope.cartItems.items.length; j++) {
                                                if (scope.cartItems.items[j].itemId === data.index) {
                                                    scope.cartItems.items[j].img = "data:image/jpeg;base64," + data.document_content;
                                                }
                                            }
                                        }).catch(function () {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                        });
                                        ;
                                        promisesWaiting++;
                                    } else {
                                        SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function imgArrived(data) {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                            for (var j = 0; j < scope.farmerProducts.length; j++) {
                                                if (scope.farmerProducts[j].product.id === data.index) {
                                                    scope.farmerProducts[j].img = "data:image/jpeg;base64," + data.document_content;
                                                }
                                            }
                                            for (var j = 0; j < scope.cartItems.items.length; j++) {
                                                if (scope.cartItems.items[j].itemId === data.index) {
                                                    scope.cartItems.items[j].img = "data:image/jpeg;base64," + data.document_content;
                                                }
                                            }
                                        }).catch(function () {
                                            promisesWaiting--;
                                            if (promisesWaiting == 0) {
                                                scope.loadDeffered.resolve();
                                            }
                                        });
                                        promisesWaiting++;
                                    }
                                }
                            }
                            if (scope.cartItems.items[j].amount < scope.cartItems.items[j].itemNum) {
                                scope.cartItems.items[j].resourceExcedeed = true;
                                scope.cartItems.items[j].alertMessage = filter('translate')('MAX_AVAILABLE') + " " + scope.cartItems.items[j].amount + " " + scope.cartItems.items[j].itemMeasure.code;
                            }
                        }
                        if (promisesWaiting == 0) {
                            scope.loadDeffered.resolve();
                        }
                    }
                }).catch(function () {
                    scope.loadDeffered.resolve();
                });
            }).catch(function () {
                scope.loadDeffered.resolve();
            });
        }


        scope.deleteCartItem = function (item) {
            CartService.remove(item.itemId, scope.farmerData.farmerId);
            scope.loadData();
            scope.price = CartService.getTotalCartAmount() + "";
            scope.calculateTotal();
        };

        scope.addMore = function (item) {
            if (_validateProductAmount(item, ++item.itemNum)) {
                item.resourceExcedeed = false;
                item.alertMessage = "";
                CartService.more(item.itemId, scope.farmerData.farmerId);
                scope.price = CartService.getTotalCartAmount() + "";
                scope.calculateTotal();
            } else {
                item.itemNum--;
                item.resourceExcedeed = true;
                item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
            }
        }
        scope.less = function (item) {
            if (_validateProductAmount(item, --item.itemNum)) {
                item.resourceExcedeed = false;
                item.alertMessage = "";
                CartService.less(item.itemId, scope.farmerData.farmerId);
                scope.price = CartService.getTotalCartAmount() + "";
                scope.calculateTotal();
                if (item.itemNum == 0) {
                    scope.loadData();
                }
            } else {
                item.resourceExcedeed = true;
                item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
            }
        };
        scope.setAmount = function (item, amount) {

            if ((amount != null) && (amount >= 0)) {
                console.log("Amount of " + item.itemId + " = " + amount);
                if (!_validateProductAmount(item, amount)) {
                    item.resourceExcedeed = true;
                    item.alertMessage = filter('translate')('MAX_AVAILABLE') + " " + item.amount + " " + item.itemMeasure.code;
                } else {
                    item.resourceExcedeed = false;
                    item.alertMessage = "";
                    CartService.updateProductAmount(item.itemId, scope.farmerData.farmerId, parseFloat(amount));
                    scope.price = CartService.getTotalCartAmount() + "";
                    scope.calculateTotal();
                    if (amount == 0) {
                        scope.loadData();
                    }
                }
            }
        }

        scope.loadData = function () {
            scope.cartItems = CartService.getItems();
            if (scope.cartItems != null) {
                for (var j = 0; j < scope.cartItems.items.length; j++) {
                    for (var i = 0; i < scope.farmerProducts.length; i++) {
                        if (scope.cartItems.items[j].itemId === scope.farmerProducts[i].product.id) {
                            scope.cartItems.items[j].amount = scope.farmerProducts[i].amount;
                            scope.cartItems.items[j].img = scope.farmerProducts[i].img;
                            scope.cartItems.items[j].tax = scope.farmerProducts[i].product.tax;
                        }
                    }
                }
            }
            scope.calculateTotal();
            scope.wishlistItemSize = WishlistService.getItemsSize();
        }

        scope.goBack = function () {
            window.history.back();
        }


        scope.saveAddress = function () {
            var orderData = OrderService.getOrderData();
            if (orderData == null) {
                OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
            }
            OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
        }
        scope.openEmptyCartModal = function () {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'emptyCartModal.html',
                controller: 'EmptyCartModalInstanceCtrl',
                size: 'sm'
            });
        };

        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();


        SearchService.getCities().then(function (data) {
            scope.cities = data;
        });

        scope.canGoToPayment = function () {
            if (scope.locationType.selected == rootScope.noDeliveryString) {
                return true;
            } else {
                if ((scope.address.city != null) && (scope.address.city.length > 0)
                    && (scope.address.postalCode != null) && (scope.address.postalCode > 0)
                    && (scope.address.street != null) && (scope.address.street.length > 0)
                    && (scope.address.houseNumber != null) && (scope.address.houseNumber.length > 0)) {
                    return true;
                }
            }
            return false;
        }
        scope.paymentDeffered = null;
        scope.goToPayment = function () {
            scope.paymentDeffered = q.defer();
            console.log(scope.locationType.selected);
            console.log(scope.address);
            scope.calculateTransportPrice().then(function () {
                OrderService.createOrderItem(scope.farmerData.farmerId, rootScope.credentials.id);
                OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                    (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
                OrderService.savePriceCalculatePrice(true);
                OrderService.saveItems(scope.cartItems, scope.total);
                OrderService.saveFarmerTime(scope.farmer.workHours);
                scope.paymentDeffered.resolve();
                location.path("/checkout");
            }).catch(function (err) {
                scope.paymentDeffered.reject();
            });
        }

        scope.$watch('prevAddress.address', function () {
            if (scope.prevAddress.address != null) {
                var addressObj = JSON.parse(scope.prevAddress.address);
                scope.address = {
                    city: addressObj.city,
                    street: addressObj.street,
                    houseNumber: addressObj.houseNumber,
                    apartmentNumber: parseInt(addressObj.apartmentNumber),
                    floor: parseInt(addressObj.floor),
                    postalCode: parseInt(addressObj.postalCode)
                }
            }
        });

        scope.$watch('predefinedLocation.data', function () {
            if (scope.predefinedLocation.data != null) {
                var addressObj = JSON.parse(scope.predefinedLocation.data).address;
                scope.address = {
                    city: addressObj.city,
                    street: addressObj.street,
                    houseNumber: addressObj.houseNumber,
                    apartmentNumber: parseInt(addressObj.apartmentNumber),
                    floor: parseInt(addressObj.floor),
                    postalCode: parseInt(addressObj.postalCode)
                }
            }
        });

        scope.$watch('address.city', function () {
            if ((scope.address.city != null) && (scope.address.city.length > 0)) {
                for (var i = 0; i < scope.cities.length; i++) {
                    if (scope.cities[i].name == scope.address.city) {
                        scope.address.postalCode = parseInt(scope.cities[i].postalCode);
                        return true;
                    }
                }
            }
        });

        scope.$watch('locationType.selected', function () {
            if (scope.locationType.selected != null) {
                OrderService.savePriceCalculatePrice(false);
                if (scope.locationType.selected == rootScope.noDeliveryString) {
                    scope.transportPrice = 0;
                    scope.address = {};
                    scope.calculateTotal();
                }
                OrderService.saveAddress(scope.locationType.selected, scope.address, scope.transportPrice,
                    (scope.locationType.selected == rootScope.predefinedLocationString) ? JSON.parse(scope.predefinedLocation.data) : null);
            }
        });

        _validateProductAmount = function (product, amount) {
            if (parseFloat(product.amount) >= amount) {
                return true;
            }
            return false;
        }

        scope.goToFarmerPage = function (farmer) {
            console.log(farmer.farmerId);
            location.path("/farmer/" + farmer.farmerId);
        }

        //true ok, false to low
        scope.lowOrderAmount = function () {
            var retVal = false;
            if (scope.farmer != null) {
                if (parseFloat(scope.farmer.minOrderPrice) <= scope.totalPrice) {
                    retVal = true;
                }
            }
            return retVal;
        }
    }]);

angular.module('paysApp').controller('EmptyCartModalInstanceCtrl', ["$scope", "$modalInstance", "$location", "CartService", "OrderService", function ($scope, $modalInstance, $location, CartService, OrderService) {

    $scope.emptyCart = function () {
        console.log("Empty cart");
        CartService.resetCart();
        OrderService.clearOrderData();
        $modalInstance.close();
        $location.path('#/');
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
angular.module('paysApp').controller("checkoutCtrl", ["$scope", "$rootScope", "$filter", "$window", "$location", "$modal", "CartService", "WishlistService",
    "OrderService", "UserService", "Notification","md5",
    function (scope, rootScope, filter, window, location, modal, CartService, WishlistService, OrderService, UserService, Notification,md5) {

        scope.noTransportPrice = false;

        scope.workDaysArray = [];
        scope.workDaysSize = 0;

        _convertWorkHoursObjToDaysArray = function (workHours) {

            scope.workDaysArray.push(_convertDayStringToObj(workHours.sun));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.mon));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.tue));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.wed));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.thu));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.fri));
            scope.workDaysArray.push(_convertDayStringToObj(workHours.sat));

        }
        _convertDayStringToObj = function (day) {
            var retObj = null;
            if (day != null && day.length > 1) {
                var retObj = {};
                var timeString = day.split('-');
                var fromStrings = timeString[0].split(':');
                var toStrings = timeString[1].split(':');
                retObj.fromTime = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                retObj.toTime = new Date(new Date().setHours(parseInt(toStrings[0]), parseInt(toStrings[1]), 0, 0));
                scope.workDaysSize++;
            }
            return retObj;
        }

        scope.termsAccepted = false;
        scope.orderData = OrderService.getOrderData();
        if (scope.orderData != null) {
            if ((scope.orderData.transportType != rootScope.noDeliveryString) && (scope.orderData.transportCalculated == false)) {
                scope.noTransportPrice = true;
            } else {
                _convertWorkHoursObjToDaysArray(scope.orderData.workHours);
                scope.orderData.totalPrice = parseFloat(scope.orderData.totalPrice).toFixed(2);
                scope.orderData.transportPrice = scope.orderData.transportType != rootScope.noDeliveryString ? parseFloat(scope.orderData.transportPrice).toFixed(2) : parseFloat("0.00").toFixed(2);
                scope.orderData.totalProductPrice = (parseFloat(scope.orderData.totalPrice) - parseFloat(scope.orderData.transportPrice)).toFixed(2);
                scope.totalOrderTax = 0;
                angular.forEach(scope.orderData.items.items, function (item) {
                    var taxLower = (100 * parseFloat(item.tax)) / (100 + parseFloat(item.tax)) / 100;
                    item.totalTax = (parseFloat(item.itemNum) * parseFloat(item.itemPrice) * taxLower).toFixed(2);
                    scope.totalOrderTax += item.totalTax;
                    item.itemPriceNoTax = (parseFloat(item.itemPrice) - parseFloat(item.itemPrice) * taxLower).toFixed(2);
                });
                scope.amount = scope.orderData.totalPrice;
                scope.currency = scope.orderData.currency;
                scope.addressJson = scope.orderData.address;
                scope.totalOrderTax = parseFloat(scope.totalOrderTax).toFixed(2);

                if (scope.orderData.clientId == null) {
                    if (rootScope.credentials.id) {
                        scope.orderData.clientId = rootScope.credentials.id;
                        OrderService.saveClientId(scope.orderData.clientId);
                    }
                }
                if (scope.orderData.clientId != null) {
                    {
                        UserService.getUserData(scope.orderData.clientId).then(function (data) {
                            scope.userData = data;
                        }).catch(function (err) {
                            scope.userData = null;
                        });
                    }
                }
                else {
                    scope.userData = null;
                }
            }
        }


        scope.dateFormat = 'yyyy-MM-dd';
        scope.timeFormat = 'HH:mm';

        scope.deliveryDate = {
            date: null
        }

        scope.dateOptions = {
            startingDay: 1
        };
        scope.minDate = new Date(new Date().getTime() + 24 * 3600 * 1000);
        scope.maxDate = new Date(new Date().getTime() + 15 * 24 * 3600 * 1000);

        scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( scope.workDaysArray[date.getDay()] == null));
        }

        var today = new Date().getTime();
        var date = null;
        var counter = 1;
        while (scope.deliveryDate.date == null && counter < 8) {
            date = new Date(new Date().getTime() + counter * 24 * 3600 * 1000);
            if (scope.workDaysArray[date.getDay()] != null) {
                scope.deliveryDate.date = date;
            }
            counter++;
        }

        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        var minimalHoursDistance = 1;


        scope.fromTime = {
            minTime: null,
            maxTime: null,
            time: null
        };
        scope.toTime = {
            minTime: null,
            maxTime: null,
            time: null
        };

        scope.datePopup = {
            opened: false
        };

        scope.note = "";

        scope.$watch('fromTime.time', function () {
            if (scope.fromTime != null && scope.fromTime.time != null) {
                var minToTime = scope.fromTime.time.getTime() + 1 * 3600 * 1000;
                if (minToTime > scope.toTime.time.getTime()) {
                    scope.toTime.time = new Date(minToTime);
                    scope.toTime.minTime = new Date(minToTime);
                } else {
                    scope.toTime.minTime = new Date(minToTime);
                }
            }
        });

        scope.$watch('deliveryDate.date', function () {
            if (scope.deliveryDate.date) {
                var obj = scope.workDaysArray[scope.deliveryDate.date.getDay()];
                console.log(obj);
                scope.fromTime.minTime = new Date(obj.fromTime.getTime());
                scope.fromTime.maxTime = new Date(obj.toTime.getTime() - 3600 * 1000);
                scope.toTime.minTime = new Date(obj.fromTime.getTime() + 3600 * 1000);
                scope.toTime.maxTime = new Date(obj.toTime.getTime());
                //delayed update because of timepicker data race condition
                setTimeout(function () {
                    scope.toTime.time = obj.toTime;
                    scope.fromTime.time = obj.fromTime;
                }, 10);

            }
        });


        scope.executePayment = function () {
            console.log("Payment Information!");
            console.log(scope.date);
            var hashObj = {
                currencyId: scope.orderData.currency.id,
                transportPrice: scope.orderData.transportPrice,
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                items: [],
                privateKey : rootScope.genKey
            }
            var order = {
                farmerId: scope.orderData.farmerId,
                clientId: scope.orderData.clientId,
                currencyId: scope.orderData.currency.id,
                transportPrice: scope.orderData.transportPrice,
                withTransport: scope.orderData.transportType != rootScope.noDeliveryString,
                totalPrice: scope.orderData.totalPrice,
                items: [],
                comment: scope.orderData.comment
            };
            if (scope.orderData.transportType == rootScope.previousLocationString || scope.orderData.transportType == rootScope.newAddressString) {
                order.address = scope.addressJson;
            } else if (scope.orderData.transportType == rootScope.predefinedLocationString) {
                order.deliveryPlace = scope.orderData.predefinedLocation.id;
            }

            if (scope.orderData.transportType != rootScope.noDeliveryString) {
                order.deliveryDate = filter('date')(scope.deliveryDate.date, scope.dateFormat);
                order.deliveryFrom = filter('date')(scope.fromTime.time, scope.timeFormat);
                order.deliveryTo = filter('date')(scope.toTime.time, scope.timeFormat);
            }
            angular.forEach(scope.orderData.items.items, function (item) {
                order.items.push({
                    productId: item.itemId,
                    amount: item.itemNum,
                    measurementUnitId: item.itemMeasure.id,
                    totalPrice: item.itemPrice,
                    tax: item.tax
                });
                hashObj.items.push({
                    amount: item.itemNum.toFixed(2),
                    productId :item.itemId
                });
            });

            var hash = md5.createHash(JSON.stringify(hashObj));
            order.signature = hash;
            OrderService.createOrder(order).then(function (data) {
                Notification.success({message: filter('translate')('ORDER_CREATED')});
                window.location.href = data.redirectURL;
            }).catch(function (err) {
                if(err.error.message.indexOf("Item price changed") >= 0){
                    Notification.error({message: filter('translate')('ITEM_PRICE_CHANGED')});
                } else {
                    Notification.error({message: filter('translate')('ORDER_NOT_CREATED')});
                }
            });
        }

        scope.openDate = function () {
            scope.datePopup.opened = true;
        };
        scope.showPaysCompanyInfo = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'paysCompanyInfoModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
        scope.showOfferedGoods = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'offeredGoodsModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
        scope.showTermsOfService = function () {
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'termsOfServiceModal.html',
                controller: 'PaymentRegulationsCtrl',
                size: 'lg'
            });
        }
    }
]);

angular.module('paysApp').controller('PaymentRegulationsCtrl', ["$scope", "$modalInstance", function ($scope, $modalInstance) {

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('paysApp').controller("distributorCtrl", ["$scope", "$rootScope", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "DistributorService",
  function (scope, rootScope, filter, routeParams, CartService, WishlistService, SearchService, DistributorService) {

    console.log("Distributor:  " + (routeParams.id));

    scope.prices = [];

    DistributorService.getPrices(routeParams.id).then(function (data) {
      angular.forEach(data.prices, function (price) {
        if (!scope.prices[price.distance]) {
          scope.prices[price.distance] = new Array();
          scope.prices[price.distance][price.weight] = price.price;
        } else {
          scope.prices[price.distance][price.weight] = price.price;
        }
      });
    });
    DistributorService.getDistributorById(routeParams.id).then(function (data) {
      scope.distributor              = data;
      scope.distributor.bannerImages = [];
      var bannerPicIndex             = 0;
      for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.distributor.images.banner.length)); i++) {
        DistributorService.getDistributorImage(routeParams.id, scope.distributor.images.banner[scope.distributor.images.banner.length - (i+1)])
          .then(function (img) {
            scope.distributor.bannerImages[bannerPicIndex++] = "data:image/jpeg;base64," + img.document_content;
          });
      }

    });

    DistributorService.getVehiclesByDistributorId(routeParams.id).then(function (data) {
      scope.distributorVehicles = data;
      for (var j = 0; j < scope.distributorVehicles.length; j++) {
        if (scope.distributorVehicles[j].images != null) {
          DistributorService.getVehicleImage(scope.distributorVehicles[j].id, scope.distributorVehicles[j].images).then(function (img) {
            for (var i = 0; i < scope.distributorVehicles.length; i++) {
              if (scope.distributorVehicles[i].id === img.index) {
                scope.distributorVehicles[i].img = "data:image/jpeg;base64," + img.document_content;
              }
            }
          });
        }
      }
    });


  }])
;
angular.module('paysApp').controller("distributorSearchCtrl", ["$scope", "$rootScope", "$http", "$filter", "$routeParams", "CartService", "SearchService", "DistributorService", "WishlistService",
    function (scope, rootScope, http, filter, routeParams, CartService, SearchService, DistributorService, WishlistService) {

        scope.distances = SearchService.getDistances();

        scope.searchPerformed = false;
        scope.allDistributors = [];
        scope.foundDistributors = [];

        scope.distributorsNamesArray = [];

        scope.queryParams = {};

        scope.cancelSearch = function () {
            console.log("Search configuration canceled.");
            scope.foundDistributors = [];
            scope.queryParams = {};
            scope.searchPerformed = false;
        };

        DistributorService.getDistributors().then(function (data) {
            scope.allDistributors = data;
            for (var j = 0; j < scope.allDistributors.length; j++) {
                if ((scope.allDistributors[j].isConfirmed == true) && (scope.allDistributors[j].isActive == true)) {

                    var name = scope.allDistributors[j].businessSubject.name;
                    var firstLetter = null;
                    var distributorName = null;
                    if (name != null && name.length > 0) {
                        firstLetter = name[0].toUpperCase();
                    }
                    for (var k = 0; k < scope.distributorsNamesArray.length; k++) {
                        if (scope.distributorsNamesArray[k].letter == firstLetter) {
                            distributorName = scope.distributorsNamesArray[k];
                        }
                    }
                    if (distributorName == null) {
                        var item = {
                            letter: firstLetter,
                            distributors: []
                        };
                        item.distributors.push(scope.allDistributors[j]);
                        scope.distributorsNamesArray.push(item);
                    } else {
                        distributorName.distributors.push(scope.allDistributors[j]);
                    }
                    if (scope.allDistributors[j].images.profile != null) {
                        DistributorService.getDistributorImage(scope.allDistributors[j].id, scope.allDistributors[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.allDistributors.length; i++) {
                                if (scope.allDistributors[i].id === img.index) {
                                    scope.allDistributors[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
            }
        });

        scope.setSearchPrepared = function () {

            scope.queryParams.name = (scope.queryParams.name != null && scope.queryParams.name.length > 0) ? scope.queryParams.name : null;
            scope.queryParams.city = (scope.queryParams.city != null && scope.queryParams.city.length > 0) ? scope.queryParams.city : null;
            scope.queryParams.weight = (scope.queryParams.weight != null) ? scope.queryParams.weight : null;
            DistributorService.searchDistributors(scope.queryParams).then(function (data) {
                scope.foundDistributors = data;
                scope.searchPerformed = true;
                for (var j = 0; j < scope.foundDistributors.length; j++) {
                    if (scope.foundDistributors[j].images.profile != null) {
                        DistributorService.getDistributorImage(scope.foundDistributors[j].id, scope.allDistributors[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.foundDistributors.length; i++) {
                                if (scope.foundDistributors[i].id === img.index) {
                                    scope.foundDistributors[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
            });
        };

        scope.clearSelectedSearchProducts = function () {
            scope.foundDistributors = [];
            scope.queryParams = {};
            scope.searchPerformed = false;
        }

        scope.searchNameCallback = function (keyEvent) {
            if (keyEvent.which === 13) {
                scope.setSearchPrepared();
            }
        }
    }])
;
/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editBuyerCtrl", ["$scope", "$rootScope", "$q", "$filter", "$routeParams", "CartService", "WishlistService", "SearchService", "UserService", "Notification",
  function (scope, rootScope, q, filter, routeParams, CartService, WishlistService, SearchService, UserService, Notification) {

    console.log("edit buyer:  " + routeParams.id);

    scope.page = 'GENERAL_BUYER_DATA';

    scope.orders = [];
    var defaultRating = 5;

    scope.loadGeneralDeffered = q.defer();
    SearchService.getClientById(routeParams.id).then(function (data) {
      scope.buyer = data;
      scope.loadGeneralDeffered.resolve();
    }).catch(function(){
      scope.loadGeneralDeffered.reject();
    });


    scope.loadOrdersDeffered = q.defer();
    SearchService.getBuyerOrders(routeParams.id).then(function (data) {
      scope.orders  = [];
      var farmerIds = [];
      angular.forEach(data,function(order){
        if (order.status != 'C') {
          order.totalPrice = parseFloat(order.totalPrice);
          order.numericStatus = rootScope.getNumericOrderStatus(order.status);
          scope.orders.push(order);

        }
      });
      for (var i = 0; i < scope.orders.length; i++) {
          scope.orders[i].showDetails = false;
          scope.orders[i].showReview  = false;
          scope.orders[i].review      = {
            stars: [],
            comment: "",
            rating: defaultRating,
          };
          for (var j = 1; j <= defaultRating; j++) {
            scope.orders[i].review.stars.push({index: j, filled: true});
          }

          if (farmerIds.indexOf(scope.orders[i].orderedFrom) == -1) {
            farmerIds.push(scope.orders[i].orderedFrom);
          }
      }
      for (var i = 0; i < farmerIds.length; i++) {
        SearchService.getFarmerById(farmerIds[i]).then(function (farmer) {
          for (var j = 0; j < scope.orders.length; j++) {
            if (scope.orders[j].orderedFrom == farmer.id) {
              scope.orders[j].farmer = farmer;
            }
          }
        });
      }
      scope.loadOrdersDeffered.resolve();
    }).catch(function(){
      scope.loadOrdersDeffered.reject();
    });;

    scope.sectionChange = function (sectionName) {
      scope.page = sectionName;
    }


    scope.toggle = function (order, star) {
      for (var i = 0; i < 5; i++) {
        order.review.stars[i].filled = false;
      }
      order.review.rating = star.index;

      for (var i = 0; i < order.review.rating; i++) {
        order.review.stars[i].filled = true;
      }
    };

    scope.submitReview           = function (order) {
      console.log(order.review);
      UserService.postOrderReview(routeParams.id, order.id, {
        comment: order.review.comment,
        rating: order.review.rating
      }).then(function (data) {
        Notification.success({message: filter('translate')('REVIEW_SUBMITED')});
        order.review.comment = "";
        order.hasComments = true;
      }).catch(function () {
        Notification.error({message: filter('translate')('REVIEW_NOT_SUBMITED')});
      });
    }
    scope.saveGeneralInfoChanges = function () {
      UserService.updateBuyerGeneralInfo(scope.buyer.id,
        {
          privateSubject: scope.buyer.privateSubject
        }
      ).then(function (data) {
          console.log(data);
          Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
        }).catch(function (err) {
          console.error(err);
          Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
        })
    }

    scope.sortType    = "id";
    scope.sortReverse = true;
  }])
;


/**
 * Created by nignjatov on 10.10.2015.
 */
angular.module('paysApp').controller("editDistributorCtrl", ["$scope", "$rootScope", "$q", "$filter", "$modal", "$routeParams",
  "CartService", "WishlistService", "SearchService", "DistributorService", "Notification",
  function (scope, rootScope, q, filter, modal, routeParams, CartService, WishlistService, SearchService, DistributorService, Notification) {


    var distributorId = routeParams.id;
    console.log("edit Distributor:  " + distributorId);

    scope.page       = 'GENERAL_DISTRIBUTOR_DATA';
    scope.vehicles   = [];
    scope.prices     = [];
    scope.profilePic = {
      flow: null
    };

    scope.sortType    = "name";
    scope.sortReverse = false;

    scope.loadGeneralDeffered     = null;
    scope.loadVehicleDeffered     = null;
    scope.loadAdvertisingDeffered = null;
    scope.loadPricesDeffered      = null;
    scope.saveInfo                = null;
    scope.uploadImage             = null;
    scope.loadImage               = null;
    scope.uploadAdvertisingImage  = null;
    scope.loadAdvertisingImage    = null;

    scope.sectionChange       = function (sectionName) {
      scope.page = sectionName;
    }
    scope.loadGeneralDeffered = q.defer();
    DistributorService.getDistributorById(distributorId).then(function (data) {
      scope.distributor              = data;
      scope.distributor.bannerImages = [];
      scope.loadGeneralDeffered.resolve();
      //Initialize array for banner images
      for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
        scope.distributor.bannerImages[i] = {
          flow: null,
          imageId: rootScope.undefinedImageId,
          imgData: ""
        };
      }
      ;
      if ((scope.distributor.images.profile != null) || (scope.distributor.images.banner.length)) {
        scope.loadAdvertisingDeffered = q.defer();
        var advertisingPromises       = 0;
        if (scope.distributor.images.profile != null) {
          DistributorService.getDistributorImage(distributorId, scope.distributor.images.profile)
            .then(function (img) {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
              scope.distributor.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
            }).catch(function () {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
            });
          advertisingPromises++;
        }
        var bannerPicIndex  = 0;
        var bannerLoadIndex = 0;
        for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.distributor.images.banner.length)); i++) {
          scope.distributor.bannerImages[bannerLoadIndex++].imageId = scope.distributor.images.banner[scope.distributor.images.banner.length - (i + 1)];
          DistributorService.getDistributorImage(distributorId, scope.distributor.images.banner[scope.distributor.images.banner.length - (i + 1)])
            .then(function (img) {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
              if (img.type != 'undefined') {
                for (var j = 0; j < scope.distributor.bannerImages.length; j++) {
                  if (scope.distributor.bannerImages[j].imageId == img.imageIndex) {
                    scope.distributor.bannerImages[bannerPicIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                    bannerPicIndex++
                  }
                }
              }
            }).catch(function () {
              advertisingPromises--;
              if (advertisingPromises == 0) {
                scope.loadAdvertisingDeffered.resolve();
              }
            });
          ;
          advertisingPromises++;
        }
      }
    }).catch(function () {
      scope.loadGeneralDeffered.reject();
    });
    scope.loadVehicleDeffered = q.defer();
    DistributorService.getVehiclesByDistributorId(distributorId).then(function (data) {
      scope.vehicles = data;
      if (scope.vehicles.length == 0) {
        scope.loadVehicleDeffered.resolve();
      } else {
        var vehiclePromises = 0;
        for (var j = 0; j < scope.vehicles.length; j++) {
          if (scope.vehicles[j].images) {
            DistributorService.getVehicleImage(scope.vehicles[j].id, scope.vehicles[j].images)
              .then(function (img) {
                vehiclePromises--;
                if (vehiclePromises == 0) {
                  scope.loadVehicleDeffered.resolve();
                }
                for (var i = 0; i < scope.vehicles.length; i++) {
                  if (scope.vehicles[i].id === img.index) {
                    scope.vehicles[i].img = "data:image/jpeg;base64," + img.document_content;
                  }
                }
              }).catch(function () {
                vehiclePromises--;
                if (vehiclePromises == 0) {
                  scope.loadVehicleDeffered.resolve();
                }
              });
            vehiclePromises++;
          }
        }
        if (vehiclePromises == 0) {
          scope.loadVehicleDeffered.resolve();
        }
      }
    }).catch(function () {
      scope.loadVehicleDeffered.reject();
    });
    scope.loadPricesDeffered  = q.defer();
    DistributorService.getPrices(routeParams.id).then(function (data) {
      if (data.prices && data.prices.length > 0) {
        angular.forEach(data.prices, function (price) {
          if (!scope.prices[price.distance]) {
            scope.prices[price.distance]               = new Array();
            scope.prices[price.distance][price.weight] = price.price;
          } else {
            scope.prices[price.distance][price.weight] = price.price;
          }
        });
      } else {
        for (var i in rootScope.transportDistances) {
          scope.prices[rootScope.transportDistances[i]] = [];
          for (var j in rootScope.transportWeights) {
            scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
          }
        }
      }
      scope.loadPricesDeffered.resolve();
    }).catch(function () {
      scope.loadPricesDeffered.reject();
    });
    ;

    scope.saveGeneralChanges = function () {
      console.log("Saving general changes!");
      DistributorService.updateGeneralInfo(scope.distributor.id,
        {
          businessSubject: scope.distributor.businessSubject
        }
      ).then(function (data) {
          console.log(data);
          Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
        }).catch(function (err) {
          console.error(err);
          Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
        })
    }

    scope.saveAdvertisingChanges = function () {
      console.log("Saving advertising changes!");
      DistributorService.updateAdvertisingInfo(scope.distributor.id, {
          advertisingTitle: scope.distributor.advertisingTitle,
          advertisingText: scope.distributor.advertisingText,
        }
      ).then(function (data) {
          Notification.success({message: filter('translate')('ADVERTISING_INFO_UPDATED')});
        }).catch(function (data) {
          Notification.error({message: filter('translate')('ADVERTISING_INFO_NOT_UPDATED')});
        });
    }
    scope.uploadProfilePicture = function () {
      if (typeof scope.profilePic.flow.files !== 'undefined') {
        scope.uploadAdvertisingImage = q.defer();
        DistributorService.uploadDistributorProfileImage(scope.distributor.id,
          scope.distributor.images.profile ? scope.distributor.images.profile : rootScope.undefinedImageId,
          scope.profilePic.flow).then(function (data) {
            scope.uploadAdvertisingImage.resolve();
            Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
            scope.profilePic.flow.cancel();
            scope.loadAdvertisingImage = q.defer();
            DistributorService.getDistributorImage(distributorId, data.image)
              .then(function (img) {
                scope.loadAdvertisingImage.resolve();
                scope.distributor.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
              }).catch(function(){
                scope.loadAdvertisingImage.reject();
              });
          }).catch(function (err) {
            scope.uploadAdvertisingImage.reject();
            Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
            scope.profilePic.flow.cancel();
          });

      }
    }

    scope.uploadDistributorBannerImage = function (bannerPictureIndex) {
      console.log("uploadDistributorBannerImage" + bannerPictureIndex);
      if (typeof scope.distributor.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
        scope.uploadAdvertisingImage = q.defer();
        DistributorService.uploadDistributorBannerImage(scope.distributor.id,
          scope.distributor.bannerImages[bannerPictureIndex].imageId, scope.distributor.bannerImages[bannerPictureIndex].flow).
          then(function (data) {
            scope.uploadAdvertisingImage.resolve();
            Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
            scope.distributor.bannerImages[bannerPictureIndex].flow.cancel();
            scope.loadAdvertisingImage = q.defer();
            DistributorService.getDistributorImage(distributorId, data.image)
              .then(function (img) {
                scope.loadAdvertisingImage.resolve();
                scope.distributor.bannerImages[bannerPictureIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                scope.distributor.bannerImages[bannerPictureIndex].imageId = img.imageIndex;
              }).catch(function(){
                scope.loadAdvertisingImage.reject();
              });
          }).catch(function (err) {
            scope.uploadAdvertisingImage.reject();
            Notification.error({message: filter('translate')('BANNER_IMAGE_FAILURE')});
            scope.distributor.bannerImages[bannerPictureIndex].flow.cancel();
          });

      }
    }

    scope.deleteVehicle = function (vehicle) {
      DistributorService.deleteVehicle(distributorId, vehicle.id).then(function (data) {
        Notification.success({message: filter('translate')('VEHICLE_DELETED')});
        var idx = scope.vehicles.indexOf(vehicle);
        if (idx >= 0) {
          scope.vehicles.splice(idx, 1);
        }
      }).catch(function (data) {
        Notification.error({message: filter('translate')('VEHICLE_NOT_DELETED')});
      });

    }

    scope.updateVehicle = function (vehicle) {
      scope.openVehicleModal(vehicle)
    }

    scope.addVehicle = function () {
      scope.openVehicleModal()
    }


    scope.updatePrices = function () {
      scope.updatePricesDeffered = q.defer();
      var pricesObj              = {
        currency: rootScope.defaultCurrency.id,
        prices: []
      };

      for (var i in rootScope.transportDistances) {
        for (var j in rootScope.transportWeights) {
          pricesObj.prices.push({
            weight: rootScope.transportWeights[j],
            distance: rootScope.transportDistances[i],
            price: scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]
          });
        }
      }

      DistributorService.updatePrices(distributorId, pricesObj).then(function (data) {
        Notification.success({message: filter('translate')('PRICES_UPDATED')});
        scope.updatePricesDeffered.resolve();
      }).catch(function () {
        Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
        scope.updatePricesDeffered.reject();
      });

    }


    scope.uploadVehiclePicture = function (vehicleId, imageId, flow) {
      if ((typeof flow.files !== 'undefined') && (flow.files.length > 0)) {
        scope.uploadImage = q.defer();
        DistributorService.uploadVehicleImage(vehicleId, imageId, flow).then(function (data) {
          scope.uploadImage.resolve();
          Notification.success({message: filter('translate')('VEHICLE_IMAGE_UPLOADED')});
          scope.reloadVehicleImage(vehicleId, data.image);
        }).catch(function (err) {
          scope.uploadImage.reject();
          Notification.error({message: filter('translate')('VEHICLE_IMAGE_FAILURE')});
        });
      }
    }

    scope.reloadVehicleImage = function (vehicleId, imageId) {
      scope.loadImage = q.defer();
      DistributorService.getVehicleImage(vehicleId, imageId)
        .then(function (img) {
          scope.loadImage.resolve();
          for (var i = 0; i < scope.vehicles.length; i++) {
            if (scope.vehicles[i].id === img.index) {
              scope.vehicles[i].img = "data:image/jpeg;base64," + img.document_content;
            }
          }
        }).catch(function () {
          scope.loadImage.reject();
        });
    }

    scope.openVehicleModal = function (vehicle) {

      var modalInstance = modal.open({
        animation: true,
        templateUrl: 'vehicleEditModal.html',
        controller: 'UpdateVehicleModalCtrl',
        size: 'sm',
        resolve: {
          vehicles: function () {
            return scope.vehicles;
          },
          vehicle: function () {
            return vehicle;
          }
        }
      });
      modalInstance.result.then(function (returnJson) {
        if (typeof returnJson !== 'undefined') {
          var found      = false;
          var newImage   = returnJson.image.flow;
          var vehicleNew = returnJson.info;

          angular.forEach(scope.vehicles, function (vehicle) {
            if (vehicle.id == vehicleNew.id) {
              found          = true;
              scope.saveInfo = q.defer();
              DistributorService.updateVehicle(distributorId, vehicleNew).then(function () {
                Notification.success({message: filter('translate')('VEHICLE_UPDATED')});
                scope.saveInfo.resolve();
                scope.uploadVehiclePicture(vehicleNew.id, vehicleNew.images ? vehicleNew.images : rootScope.undefinedImageId, newImage);
                vehicle.cooled  = vehicleNew.cooled;
                vehicle.maxMass = vehicleNew.maxMass;
                vehicle.depth   = vehicleNew.depth;
                vehicle.width   = vehicleNew.width;
                vehicle.height  = vehicleNew.height;
                vehicle.name    = vehicleNew.name;
                vehicle.number  = vehicleNew.number;
              }).catch(function () {
                scope.saveInfo.reject();
                Notification.error({message: filter('translate')('VEHICLE_NOT_UPDATED')});
              });
            }
          });
          if (found == false) {
            scope.saveInfo = q.defer();
            DistributorService.addNewVehicle(distributorId, vehicleNew).then(function () {
              Notification.success({message: filter('translate')('VEHICLE_ADDED')});
              scope.saveInfo.resolve();
              DistributorService.getVehiclesByDistributorId(distributorId).then(function (data) {
                angular.forEach(data, function (newVeh) {
                  var exists = false;
                  for (var j = 0; j < scope.vehicles.length; j++) {
                    if (scope.vehicles[j].id === newVeh.id) {
                      exists = true;
                    }
                  }
                  if (exists == false) {
                    scope.vehicles.push(newVeh);
                    scope.uploadVehiclePicture(newVeh.id, rootScope.undefinedImageId, newImage);
                  }
                });

              });
            }).catch(function () {
              scope.saveInfo.reject();
              Notification.error({message: filter('translate')('VEHICLE_NOT_ADDED')});
            });
          }
        }
      });
    };
  }])
;

angular.module('paysApp').controller('UpdateVehicleModalCtrl', ["$scope", "$filter", "$modalInstance", "vehicles", "vehicle", function ($scope, $filter, $modalInstance, vehicles, vehicle) {

  $scope.vehicleImage = {
    flow: null
  }

  var newVehicle    = false
  $scope.vehicleNew = $.extend({}, vehicle);

  $scope.maxMass = 0;
  $scope.depth   = 0;
  $scope.width   = 0;
  $scope.height  = 0;
  $scope.model   = "";
  $scope.number  = 0;
  $scope.cooled  = false;
  if (typeof vehicle === 'undefined') {
    newVehicle = true;
  } else {
    $scope.maxMass = parseFloat($scope.vehicleNew.maxMass);
    $scope.depth   = parseFloat($scope.vehicleNew.depth);
    $scope.width   = parseFloat($scope.vehicleNew.width);
    $scope.height  = parseFloat($scope.vehicleNew.height);
    $scope.model   = "" + $scope.vehicleNew.name;
    $scope.number  = parseFloat($scope.vehicleNew.number);
    $scope.cooled  = $scope.vehicleNew.cooled;
  }

  $scope.saveChanges = function () {
    $scope.vehicleNew.cooled  = stringToBoolean($scope.cooled);
    $scope.vehicleNew.maxMass = $scope.maxMass;
    $scope.vehicleNew.depth   = $scope.depth;
    $scope.vehicleNew.width   = $scope.width;
    $scope.vehicleNew.height  = $scope.height;
    $scope.vehicleNew.name    = $scope.model;
    $scope.vehicleNew.number  = $scope.number;
    var returnJson            = {
      info: $scope.vehicleNew,
      image: $scope.vehicleImage
    };
    if (newVehicle == true) {
      $modalInstance.close(returnJson);
    }
    $modalInstance.close(returnJson);
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.isCooled = function (field, value) {
    if (field == value) {
      return true;
    }
    return false;
  }

  stringToBoolean = function (string) {
    if (typeof string === 'string') {

      switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
          return true;
        case "false":
        case "no":
        case "0":
        case null:
          return false;
        default:
          return Boolean(string);
      }
    }
    return string;
  }
}])
;
/**
 * Created by Norbert on 2015-11-01.
 */
angular.module('paysApp').controller("editFarmerCtrl", ["$scope", "$rootScope", "$q", "$filter", "$modal", "$routeParams", "CartService", "WishlistService", "SearchService", "FarmerService", "Notification",
    function (scope, rootScope, q, filter, modal, routeParams, CartService, WishlistService, SearchService, FarmerService, Notification) {

        console.log("edit Farmer:  " + routeParams.id);

        scope.page = 'GENERAL_FARMER_DATA';
        scope.products = [];
        scope.orders = [];
        scope.prices = [];
        scope.profilePic = {
            flow: null
        };

        scope.sortTypeProduct = "product.name.localization[currentLang]";
        scope.sortReverseProduct = false;

        scope.sortTypeOrder = "id";
        scope.sortReverseOrder = true;

        scope.loadGeneralDeffered = null;
        scope.loadVehicleDeffered = null;
        scope.loadAdvertisingDeffered = null;
        scope.loadPricesDeffered = null;
        scope.loadOrdersDeffered = null;

        scope.saveInfo = null;
        scope.uploadImage = null;
        scope.loadImage = null;
        scope.uploadAdvertisingImage = null;
        scope.loadAdvertisingImage = null;

        scope.workHours = [];
        scope.timeFormat = 'HH:mm';
        scope.hstep = 1;
        scope.mstep = 30;
        scope.ismeridian = false;

        scope.loadGeneralDeffered = q.defer();

        SearchService.getFarmerById(routeParams.id).then(function (data) {
            scope.farmer = data;
            scope.farmer.minOrderPrice = scope.farmer.minOrderPrice != null ? scope.farmer.minOrderPrice : 0;
            scope.farmer.bannerImages = [];
            _convertWorkHoursStringToObj(scope.farmer.workHours);
            scope.loadGeneralDeffered.resolve();
            //Initialize array for banner images
            for (var i = 0; i < rootScope.bannerPicsLimit; i++) {
                scope.farmer.bannerImages[i] = {
                    flow: null,
                    imageId: rootScope.undefinedImageId,
                    imgData: ""
                };
            }
            ;
            if ((scope.farmer.images.profile != null) || (scope.farmer.images.banner.length)) {
                scope.loadAdvertisingDeffered = q.defer();
                var advertisingPromises = 0;
                if (scope.farmer.images.profile != null) {
                    FarmerService.getFarmerImage(scope.farmer.id, scope.farmer.images.profile)
                        .then(function (img) {
                            advertisingPromises--;
                            if (advertisingPromises == 0) {
                                scope.loadAdvertisingDeffered.resolve();
                            }
                            scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                        }).catch(function () {
                        advertisingPromises--;
                        if (advertisingPromises == 0) {
                            scope.loadAdvertisingDeffered.resolve();
                        }
                    });
                    advertisingPromises++;
                }
                var bannerPicIndex = 0;
                var bannerLoadIndex = 0;
                for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
                    scope.farmer.bannerImages[bannerLoadIndex++].imageId = scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)];
                    FarmerService.getFarmerImage(scope.farmer.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)])
                        .then(function (img) {
                            advertisingPromises--;
                            if (advertisingPromises == 0) {
                                scope.loadAdvertisingDeffered.resolve();
                            }
                            if (img.type != 'undefined') {
                                for (var j = 0; j < scope.farmer.bannerImages.length; j++) {
                                    if (scope.farmer.bannerImages[j].imageId == img.imageIndex) {
                                        scope.farmer.bannerImages[bannerPicIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                                        bannerPicIndex++
                                    }
                                }
                            }
                        }).catch(function () {
                        advertisingPromises--;
                        if (advertisingPromises == 0) {
                            scope.loadAdvertisingDeffered.resolve();
                        }
                    });
                    advertisingPromises++;
                }
            }
        });
        scope.loadProductsDeffered = q.defer();
        SearchService.getFarmerProducts(routeParams.id).then(function (data) {
            scope.products = data;
            if (scope.products.length == 0) {
                scope.loadProductsDeffered.resolve();
            } else {
                var productPromises = 0;
                for (var i = 0; i < scope.products.length; i++) {
                    scope.products[i].amount = parseFloat(scope.products[i].amount).toFixed(2);
                    if (scope.products[i].customImage) {
                        FarmerService.getStockProductImage(scope.products[i].stockItemId, scope.products[i].customImage).then(function imgArrived(data) {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                            for (var j = 0; j < scope.products.length; j++) {
                                if (scope.products[j].stockItemId === data.index) {
                                    scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                                }
                            }
                        }).catch(function () {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                        });
                        productPromises++;
                    } else {
                        SearchService.getProductImage(scope.products[i].product.id, scope.products[i].product.images).then(function imgArrived(data) {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                            for (var j = 0; j < scope.products.length; j++) {
                                if (scope.products[j].product.id === data.index) {
                                    scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                                }
                            }
                        }).catch(function () {
                            productPromises--;
                            if (productPromises == 0) {
                                scope.loadProductsDeffered.resolve();
                            }
                        });
                        productPromises++;
                    }
                }
            }
        }).catch(function () {
            scope.loadProductsDeffered.reject();
        });

        scope.loadOrdersDeffered = q.defer();
        SearchService.getFarmerOrders(routeParams.id).then(function (data) {
            scope.orders = [];
            var clientIds = [];
            angular.forEach(data, function (order) {
                if (order.status != 'C') {
                    order.totalPrice = parseFloat(order.totalPrice).toFixed(2);
                    order.numericStatus = rootScope.getNumericOrderStatus(order.status);
                    order.acceptedPrice = parseFloat(0);
                    if (order.status == 'D' || order.status == 'P') {
                        order.acceptedPrice = parseFloat(0);
                        angular.forEach(order.items, function (item) {
                            item.totalPayPrice = (parseFloat(item.totalItemPrice) * parseFloat(item.amount)).toFixed(2);
                            if (item.status == "A") {
                                order.acceptedPrice += parseFloat(item.totalItemPrice) * parseFloat(item.amount);
                            }
                        });

                        if(order.acceptedPrice > 0){
                            order.acceptedPrice = order.acceptedPrice + parseFloat(order.transportPrice);
                        }
                        order.acceptedPrice = order.acceptedPrice.toFixed(2);
                    }
                    scope.orders.push(order);
                    if (clientIds.indexOf(order.orderedBy) == -1) {
                        clientIds.push(order.orderedBy);
                    }
                }
            });
            if (clientIds.length == 0) {
                scope.loadOrdersDeffered.resolve();
            } else {
                var clientPromises = 0;
                for (var i = 0; i < clientIds.length; i++) {
                    SearchService.getClientById(clientIds[i], 0).then(function clientDataArrived(client) {
                        clientPromises--;
                        if (clientPromises == 0) {
                            scope.loadOrdersDeffered.resolve();
                        }
                        for (var j = 0; j < scope.orders.length; j++) {
                            if (scope.orders[j].orderedBy == client.id) {
                                scope.orders[j].client = client;
                            }
                        }
                    }).catch(function () {
                        clientPromises--;
                        if (clientPromises == 0) {
                            scope.loadOrdersDeffered.resolve();
                        }
                    });
                    clientPromises++;
                }
            }
        }).catch(function () {
            scope.loadOrdersDeffered.reject();
        });
        scope.loadPricesDeffered = q.defer();
        for (var i in rootScope.transportDistances) {
            scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for (var j in rootScope.transportWeights) {
                scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
            }
        }
        FarmerService.getPrices(routeParams.id).then(function (data) {
            if (data.prices && data.prices.length > 0) {
                angular.forEach(data.prices, function (price) {
                    if (!scope.prices[price.distance]) {
                        scope.prices[price.distance] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                        scope.prices[price.distance][price.weight] = parseFloat(price.price);
                    } else {
                        scope.prices[price.distance][price.weight] = parseFloat(price.price);
                    }
                });
            } else {
                for (var i in rootScope.transportDistances) {
                    scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    for (var j in rootScope.transportWeights) {
                        scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                    }
                }
            }
            scope.loadPricesDeffered.resolve();
        }).catch(function (err) {
            for (var i in rootScope.transportDistances) {
                scope.prices[rootScope.transportDistances[i]] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                for (var j in rootScope.transportWeights) {
                    scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
                }
            }
            scope.loadPricesDeffered.reject();
        });


        scope.sectionChange = function (sectionName) {
            scope.page = sectionName;
        }

        scope.saveGeneralInfoChanges = function () {
            FarmerService.updateGeneralInfo(scope.farmer.id,
                {
                    businessSubject: scope.farmer.businessSubject
                }
            ).then(function (data) {
                console.log(data);
                Notification.success({message: filter('translate')('GENERAL_INFO_UPDATED')});
            }).catch(function (err) {
                console.error(err);
                Notification.error({message: filter('translate')('GENERAL_INFO_NOT_UPDATED')});
            })
        }

        scope.updateProduct = function (product) {
            scope.openProductModal(product)
        }

        scope.addProduct = function () {
            scope.openProductModal()
        }

        scope.uploadStockProductImage = function (product, stockId, imageId, flow) {
            if ((typeof flow.files !== 'undefined') && (flow.files.length > 0)) {
                scope.uploadImage = q.defer();
                FarmerService.uploadStockProductImage(stockId, imageId, flow).then(function (data) {
                    scope.uploadImage.resolve();
                    Notification.success({message: filter('translate')('PRODUCT_IMAGE_UPLOADED')});
                    scope.reloadStockProductImage(stockId, data.image);
                    //Update product customImage ID
                    angular.forEach(scope.products, function (prod) {
                        if (product.id == prod.product.id) {
                            prod.customImage = data.image;
                        }
                    });
                }).catch(function (err) {
                    scope.uploadImage.reject();
                    Notification.error({message: filter('translate')('PRODUCT_IMAGE_FAILURE')});
                    scope.reloadProductImage(product);
                });
            }
            else {
                scope.reloadProductImage(product);
            }
        }

        scope.reloadProductImage = function (product) {
            SearchService.getProductImage(product.id, product.images)
                .then(function (img) {
                    for (var i = 0; i < scope.products.length; i++) {
                        if (scope.products[i].product.id === img.index) {
                            scope.products[i].product.img = "data:image/jpeg;base64," + img.document_content;
                        }
                    }
                });
        }

        scope.reloadStockProductImage = function (stockId, imageId) {
            scope.loadImage = q.defer();
            FarmerService.getStockProductImage(stockId, imageId).then(function imgArrived(data) {
                scope.loadImage.resolve();
                for (var j = 0; j < scope.products.length; j++) {
                    if (scope.products[j].stockItemId === data.index) {
                        scope.products[j].product.img = "data:image/jpeg;base64," + data.document_content;
                    }
                }
            }).catch(function () {
                scope.loadImage.reject();
            });
        }

        scope.deleteProduct = function (product) {
            FarmerService.deleteProduct(scope.farmer.id, product.stockItemId).then(function (data) {
                Notification.success({message: filter('translate')('PRODUCT_DELETED')});
                var idx = scope.products.indexOf(product);
                if (idx >= 0) {
                    scope.products.splice(idx, 1);
                }
            }).catch(function (data) {
                Notification.error({message: filter('translate')('PRODUCT_NOT_DELETED')});
            });

        }

        scope.saveAdvertisingChanges = function () {
            console.log("Saving advertising changes!");
            FarmerService.updateAdvertisingInfo(scope.farmer.id, {
                    advertisingTitle: scope.farmer.advertisingTitle,
                    advertisingText: scope.farmer.advertisingText,
                }
            ).then(function (data) {
                Notification.success({message: filter('translate')('ADVERTISING_INFO_UPDATED')});
            }).catch(function (data) {
                Notification.error({message: filter('translate')('ADVERTISING_INFO_NOT_UPDATED')});
            });
        }

        scope.uploadProfilePicture = function () {
            if (typeof scope.profilePic.flow.files !== 'undefined') {
                scope.uploadAdvertisingImage = q.defer();
                FarmerService.uploadFarmerProfileImage(scope.farmer.id,
                    scope.farmer.images.profile ? scope.farmer.images.profile : rootScope.undefinedImageId,
                    scope.profilePic.flow).then(function (data) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.success({message: filter('translate')('PROFILE_IMAGE_UPLOADED')});
                    scope.profilePic.flow.cancel();
                    scope.loadAdvertisingImage = q.defer();
                    FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.loadAdvertisingImage.resolve();
                            scope.farmer.profilePictureBase64 = "data:image/jpeg;base64," + img.document_content;
                        }).catch(function () {
                        scope.loadAdvertisingImage.reject();
                    });
                }).catch(function (err) {
                    scope.uploadAdvertisingImage.reject();
                    Notification.error({message: filter('translate')('PROFILE_IMAGE_FAILURE')});
                    scope.profilePic.flow.cancel();
                });

            }
        }

        scope.uploadFarmerBannerImage = function (bannerPictureIndex) {
            if (typeof scope.farmer.bannerImages[bannerPictureIndex].flow.files !== 'undefined') {
                scope.uploadAdvertisingImage = q.defer();
                FarmerService.uploadFarmerBannerImage(scope.farmer.id,
                    scope.farmer.bannerImages[bannerPictureIndex].imageId, scope.farmer.bannerImages[bannerPictureIndex].flow).then(function (data) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.success({message: filter('translate')('BANNER_IMAGE_UPLOADED')});
                    scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                    scope.loadAdvertisingImage = q.defer();
                    FarmerService.getFarmerImage(scope.farmer.id, data.image)
                        .then(function (img) {
                            scope.loadAdvertisingImage.resolve();
                            scope.farmer.bannerImages[bannerPictureIndex].imgData = "data:image/jpeg;base64," + img.document_content;
                            scope.farmer.bannerImages[bannerPictureIndex].imageId = img.imageIndex;
                        }).catch(function () {
                        scope.loadAdvertisingImage.reject();
                    });
                }).catch(function (err) {
                    scope.uploadAdvertisingImage.resolve();
                    Notification.error({message: filter('translate')('BANNER_IMAGE_FAILURE')});
                    scope.farmer.bannerImages[bannerPictureIndex].flow.cancel();
                });

            }
        }


        scope.updatePrices = function () {
            scope.updatePricesDeffered = q.defer();
            var pricesObj = {
                currency: rootScope.defaultCurrency.id,
                prices: []
            };

            for (var i in rootScope.transportDistances) {
                for (var j in rootScope.transportWeights) {
                    console.log("i = "+i +", j = "+j);
                    console.log("weight "+rootScope.transportWeights[j]);
                    console.log("dist  "+rootScope.transportDistances[j]);
                    console.log("price " +  scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]);
                    pricesObj.prices.push({
                        weight: rootScope.transportWeights[j],
                        distance: rootScope.transportDistances[i],
                        price: scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]]
                    });
                }
            }

            FarmerService.updatePrices(scope.farmer.id, pricesObj).then(function (data) {
                Notification.success({message: filter('translate')('PRICES_UPDATED')});
                scope.updatePricesDeffered.resolve();
            }).catch(function () {
                Notification.error({message: filter('translate')('PRICES_NOT_UPDATED')});
                scope.updatePricesDeffered.reject();
            });

        }

        _convertWorkHoursStringToObj = function (workHoursStrings) {

            scope.workHours.push(_convertDayStringToObj(workHoursStrings.mon, 'MONDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.tue, 'TUESDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.wed, 'WEDNESDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.thu, 'THURSDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.fri, 'FRIDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.sat, 'SATURDAY'));
            scope.workHours.push(_convertDayStringToObj(workHoursStrings.sun, 'SUNDAY'));
        }

        _convertWorkHoursObjectToStrings = function (workHours) {
            var retObj = {};
            for (var i = 0; i < workHours.length; i++) {
                if (i == 0) {
                    retObj.mon = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 1) {
                    retObj.tue = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 2) {
                    retObj.wed = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 3) {
                    retObj.thu = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 4) {
                    retObj.fri = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 5) {
                    retObj.sat = _convertDayWorkHoursToStrings(workHours[i]);
                } else if (i == 6) {
                    retObj.sun = _convertDayWorkHoursToStrings(workHours[i]);
                }
            }
            return retObj;
        }

        _convertDayStringToObj = function (day, dayName) {
            if (day == null) {
                return {
                    name: dayName,
                    checked: false,
                    from: {
                        time: new Date(new Date().setHours(8, 0, 0, 0))
                    },
                    to: {
                        time: new Date(new Date().setHours(9, 0, 0, 0)),
                        minTime: new Date(new Date().setHours(8, 0, 0, 0))
                    }
                };
            } else {
                var retObj = {
                    name : dayName,
                    checked : true,
                    from : {},
                    to : {}
                }
                if (day.length > 1) {
                    var timeString = day.split('-');
                    var fromStrings = timeString[0].split(':');
                    var toStrings = timeString[1].split(':');
                    retObj.from.time = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                    retObj.to.time = new Date(new Date().setHours(parseInt(toStrings[0]), parseInt(toStrings[1]), 0, 0));
                    retObj.to.minTime = new Date(new Date().setHours(parseInt(fromStrings[0]), parseInt(fromStrings[1]), 0, 0));
                }
                return retObj;
            }
        }

        _convertDayWorkHoursToStrings = function (dayObj) {
            console.log(dayObj);
            if (dayObj.checked == false){
                return null;
            } else {
                return filter('date')(dayObj.from.time, scope.timeFormat) +
                "-" + filter('date')(dayObj.to.time, scope.timeFormat);
            }
        }


        scope.saveConstraints = function () {
            var obj = {
                workHours : _convertWorkHoursObjectToStrings(scope.workHours),
                minOrderPrice : scope.farmer.minOrderPrice
            }
            scope.loadGeneralDeffered = q.defer();
            FarmerService.saveWorkHours(scope.farmer.id,obj).then(function(){
                Notification.success({message: filter('translate')('WORK_HOURS_UPDATED')});
                scope.loadGeneralDeffered.resolve();
            }).catch(function(){
                Notification.error({message: filter('translate')('WORK_HOURS_NOT_UPDATED')});
                scope.loadGeneralDeffered.resolve();
            });
        }


        scope.openProductModal = function (product) {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'productEditModal.html',
                controller: 'ProductModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    products: function () {
                        return scope.products;
                    },
                    product: function () {
                        return product;
                    },
                    SearchService: function () {
                        return SearchService;
                    },
                    FarmerService: function () {
                        return FarmerService;
                    }
                }
            });

            modalInstance.result.then(function (returnJson) {
                if (typeof returnJson !== 'undefined') {
                    var found = false;
                    var newImage = returnJson.image.flow;
                    var productNew = returnJson.info;
                    console.log(returnJson);
                    angular.forEach(scope.products, function (product) {
                        if (product.product.id == productNew.product.id) {
                            found = true;
                            scope.saveInfo = q.defer();
                            FarmerService.updateProduct(routeParams.id, productNew).then(function () {
                                scope.saveInfo.resolve();
                                Notification.success({message: filter('translate')('PRODUCT_UPDATED')});
                                scope.uploadStockProductImage(productNew.product, productNew.stockItemId, productNew.customImage ? productNew.customImage : rootScope.undefinedImageId, newImage);
                                product.amount = productNew.amount;
                                product.price.price = productNew.price.newPrice;
                            }).catch(function () {
                                scope.saveInfo.reject();
                                Notification.error({message: filter('translate')('PRODUCT_NOT_UPDATED')});
                            });
                        }
                    });
                    if (found == false) {
                        scope.saveInfo = q.defer();
                        FarmerService.addNewProduct(routeParams.id, productNew).then(function (newProdData) {
                            scope.saveInfo.resolve();
                            Notification.success({message: filter('translate')('PRODUCT_ADDED')});
                            SearchService.getFarmerProducts(routeParams.id).then(function (data) {
                                angular.forEach(data, function (newProd) {
                                    var exists = false;
                                    for (var j = 0; j < scope.products.length; j++) {
                                        if (scope.products[j].product.id === newProd.product.id) {
                                            exists = true;
                                        }
                                    }
                                    if (exists == false) {
                                        newProd.stockItemId = newProdData.id;
                                        newProd.price.price = productNew.price.newPrice;
                                        newProd.amount = parseFloat(newProd.amount).toFixed(2);
                                        scope.products.push(newProd);
                                        scope.uploadStockProductImage(newProd.product, newProd.stockItemId, rootScope.undefinedImageId, newImage);
                                    }
                                });

                            });
                        }).catch(function () {
                            scope.saveInfo.reject();
                            Notification.error({message: filter('translate')('PRODUCT_NOT_ADDED')});
                        });
                    }
                }
            });
        };

        scope.openOrderModal = function (order) {

            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'orderEditModal.html',
                controller: 'OrderModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    farmer: function () {
                        return scope.farmer;
                    },
                    orders: function () {
                        return scope.orders;
                    },
                    order: function () {
                        return order;
                    },
                    FarmerService: function () {
                        return FarmerService;
                    }
                }
            });
        };
    }]);

angular.module('paysApp').controller('ProductModalInstanceCtrl', ["$scope", "$rootScope", "$filter", "$modalInstance", "products", "product", "SearchService", "FarmerService", "Notification", function ($scope, $rootScope, $filter, $modalInstance, products, product, SearchService, FarmerService, Notification) {
    $scope.productImage = {
        flow: null
    }
    $scope.newProduct = false
    $scope.productNew = $.extend({}, product);
    $scope.availableProducts = [];
    $scope.productPrice = 0;
    $scope.productAmount = 0;
    angular.forEach($rootScope.allProducts, function (product) {
        var found = false;
        angular.forEach(products, function (compProd) {
            if (compProd.product.id == product.id) {
                found = true;
            }
        });
        if (found == false) {
            $scope.availableProducts.push(product);
        }
    });
    if (typeof product === 'undefined') {
        $scope.newProduct = true;
        $scope.productNew.price = {};
        $scope.productNew.product = {};
        $scope.productNew.price.currency = $rootScope.defaultCurrency;
        $scope.productNew.price.price = 0;
        $scope.productNew.amount = 0;

    } else {
        $scope.productNew.price.price = parseFloat($scope.productNew.price.price);
        $scope.productNew.amount = parseFloat($scope.productNew.amount);
        $scope.productPrice = parseFloat($scope.productNew.price.price);
        $scope.productAmount = parseFloat($scope.productNew.amount);
    }

    $scope.onProductNameChanged = function () {
        SearchService.getProductImage($scope.productNew.product.id, $scope.productNew.product.images).then(function imgArrived(data) {
            if ($scope.productNew.product.id === data.index) {
                $scope.productNew.product.img = "data:image/jpeg;base64," + data.document_content;
            }
        });
    }

    $scope.canBeSaved = function () {
        var retValue = false;
        if (($scope.productPrice > 0 || $scope.productAmount > 0)
            && (typeof $scope.productNew.product.id != 'undefined')) {
            retValue = true;
        }
        return retValue;
    }

    $scope.revertToDefaultImage = function () {
        FarmerService.deleteStockProductImage($scope.productNew.stockItemId).then(function () {
            Notification.success({message: $filter('translate')('PRODUCT_IMAGE_REVERTED')});
            $scope.productNew.customImage = null;
            SearchService.getProductImage($scope.productNew.product.id, $scope.productNew.product.images).then(function imgArrived(data) {
                if ($scope.productNew.product.id === data.index) {
                    $scope.productNew.product.img = "data:image/jpeg;base64," + data.document_content;
                }
            });
        }).catch(function () {
            Notification.error({message: $filter('translate')('PRODUCT_IMAGE_NOT_REVERTED')});
        });
    }
    $scope.saveChanges = function () {
        console.log($scope.productNew);
        $scope.productNew.price.newPrice = $scope.productPrice;
        $scope.productNew.amount = "" + $scope.productAmount;
        var returnJson = {
            info: $scope.productNew,
            image: $scope.productImage
        };
        if ($scope.newProduct == true) {
            $modalInstance.close(returnJson);
        }
        $modalInstance.close(returnJson);
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

angular.module('paysApp').controller('OrderModalInstanceCtrl', ["$scope", "$filter", "$modalInstance", "$q", "farmer", "orders", "order", "FarmerService", "Notification", function ($scope, $filter, $modalInstance, $q, farmer, orders, order, FarmerService, Notification) {

    $scope.orders = orders;
    $scope.order = order;
    $scope.order.totalMass = 0;
    $scope.farmerName = farmer.businessSubject.name;
    console.log(farmer.businessSubject);
    for (var i = 0; i < order.items.length; i++) {
        $scope.order.totalMass += parseInt(order.items[i].product.avgWeight);
    }
    $scope.qr = {};

    $scope.qrGenerationDeffered = null;
    check = function () {
        if (($scope.qr.content == null) && (document.getElementsByClassName("qrcode-link").length > 0)) {
            var qrElement = angular.element(document.getElementsByClassName("qrcode-link"));
            $scope.qr.content = qrElement[0].attributes['href'].value;
            $scope.qrGenerationDeffered.resolve();
        }
        else {
            setTimeout(check, 100); // check again in a second
        }
    }

    if (order.status != 'C' && order.status != 'A') {
        $scope.qrGenerationDeffered = $q.defer();
        $scope.qr.packagesNumber = order.packageNumber;
        $scope.qr.img = FarmerService.generateOrderQRCode(order, farmer, order.packageNumber);
        check();
        console.log("QR data generated: " + $scope.qr.img);
    }
    $scope.generateQr = function () {
        $scope.qrGenerationDeffered = $q.defer();
        FarmerService.setTransportOrderStatus(farmer.id, order.id, $scope.qr.packagesNumber).then(function (data) {
            Notification.success({message: $filter('translate')('ORDER_STATUS_TRANSPORT')});
            $scope.order.status = "T";
            $scope.qr.img = FarmerService.generateOrderQRCode(order, farmer, $scope.qr.packagesNumber);
            check();
        }).catch(function () {
            $scope.qrGenerationDeffered.reject();
            Notification.error({message: $filter('translate')('NOT_ORDER_STATUS_TRANSPORT')});
        });
    }

    $scope.printQR = function (divName) {
        var printDiv = document.getElementById(divName).innerHTML;
        var printContents = "";
        for (var i = 0; i < $scope.qr.packagesNumber; i++) {
            var prefix = '<div style="border: dashed;padding: 50px;margin-bottom: 80px; margin-top: 30px;width: 40%; text-align :center;' + (i == ($scope.qr.packagesNumber - 1) ? '' : 'page-break-after: always')
                + '"> <div style="margin-bottom: 50px;">' + printDiv + '</div>';
            prefix += '<h5><strong>Id : </strong>' + $scope.order.id + ' </h5>';
            prefix += '<h5><strong> ' + $filter('translate')('COMPANY_NAME') + ': </strong> ' + $scope.farmerName + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('NUMBER_OF_PACKAGES') + ': </strong> ' + (i + 1) + '/' + $scope.qr.packagesNumber + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('TOTAL_MASS') + ': </strong> ' + $scope.order.totalMass + ' [kg]</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('CLIENT_NAME') + ': </strong> ' + $scope.order.client.privateSubject.name + ' ' + $scope.order.client.privateSubject.lastName + '</h5>';
            if(!$scope.order.deliveryPlace) {
                prefix += '<h5><strong> ' + $filter('translate')('CITY') + ': </strong> ' + $scope.order.address.city + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('POSTAL_CODE') + ': </strong> ' + $scope.order.address.postalCode + '</h5>';
                prefix += '<h5><strong> ' + $filter('translate')('STREET') + ' </strong> ' + $scope.order.address.street + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('HOUSE_NUMBER') + ' </strong> ' + $scope.order.address.houseNumber + '</h5>';
                if ($scope.order.address.floor && $scope.order.address.apartmentNumber) {
                    prefix += '<h5>';
                    if ($scope.order.address.floor) {
                        prefix += '<strong> ' + $filter('translate')('FLOOR') + ' </strong> ' + $scope.order.address.floor;
                    }
                    prefix += ' &nbsp; ';
                    if ($scope.order.address.apartmentNumber) {
                        prefix += '<strong> ' + $filter('translate')('APARTMENT') + ' </strong> ' + $scope.order.address.apartmentNumber;
                    }
                    prefix += '</h5>';
                }
            } else {
                prefix += '<h5><strong> ' + $filter('translate')('CITY') + ': </strong> ' + $scope.order.deliveryPlace.address.city + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('POSTAL_CODE') + ': </strong> ' + $scope.order.deliveryPlace.address.postalCode + '</h5>';
                prefix += '<h5><strong> ' + $filter('translate')('STREET') + ' </strong> ' + $scope.order.deliveryPlace.address.street + ' &nbsp; ' +
                    '<strong> ' + $filter('translate')('HOUSE_NUMBER') + ' </strong> ' + $scope.order.deliveryPlace.address.houseNumber + '</h5>';
                if ($scope.order.deliveryPlace.address.floor && $scope.order.deliveryPlace.address.apartmentNumber) {
                    prefix += '<h5>';
                    if ($scope.order.deliveryPlace.address.floor) {
                        prefix += '<strong> ' + $filter('translate')('FLOOR') + ' </strong> ' + $scope.order.deliveryPlace.address.floor;
                    }
                    prefix += ' &nbsp; ';
                    if ($scope.order.deliveryPlace.address.apartmentNumber) {
                        prefix += '<strong> ' + $filter('translate')('APARTMENT') + ' </strong> ' + $scope.order.deliveryPlace.address.apartmentNumber;
                    }
                    prefix += '</h5>';
                }
            }
            prefix += '<h5><strong> ' + $filter('translate')('DELIVERY_DATE') + ': </strong> ' + $scope.order.deliveryDate + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('DELIVERY_TIME') + ': </strong> ' + $scope.order.deliveryFrom + ' - ' + $scope.order.deliveryTo + '</h5>';
            prefix += '<h5><strong> ' + $filter('translate')('NOTE') + ': </strong> ' + $scope.order.comment +'</h5></div></div>';
            printContents += prefix;
        }

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=600');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    }

    $scope.cancelModal = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

angular.module('paysApp').controller("farmCtrl", ["$scope", "$rootScope", "$filter", "$routeParams", "CartService", "WishlistService",
  "SearchService", "FarmerService","UserService",
  function (scope, rootScope, filter, routeParams, CartService, WishlistService, SearchService, FarmerService, UserService) {


    console.log("FARM! " + routeParams.id);
    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();


    scope.farmerId      = routeParams.id;
    scope.searchedItems = [];
    scope.prices        = [];
    scope.amount        = "";

    scope.addToWishlist = function (productId) {
      for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
        if (scope.farmerProducts[i].product.id == productId) {
          WishlistService.putInWishlist(scope.farmerProducts[i].product.id,
            scope.farmerProducts[i].product.name,
            scope.farmerProducts[i].product.unit,
            scope.farmerProducts[i].price.price,
            scope.farmerProducts[i].product.images,
            scope.farmer.id,
            scope.farmer.businessSubject.name,
            scope.farmer.businessSubject.city,
            scope.farmer.email
          );
        }
      }
      scope.wishlistItemsSize = WishlistService.getItemsSize();
    }

    scope.removeFromWishlist = function (productId) {
      WishlistService.removeFromWishList(productId, scope.farmer.id);
      scope.wishlistItemsSize = WishlistService.getItemsSize();
    }

    scope.isProductInWishlist = function (productId) {
      return WishlistService.itemInWishlist(scope.farmerId, productId);
    }

    scope.addToCart = function (productId) {
      if (CartService.canBeAdded(scope.farmer.id)) {
        for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
          if (scope.farmerProducts[i].product.id == productId) {
            CartService.putInCartAmmount(scope.farmerProducts[i].product.id,
              scope.farmerProducts[i].product.name,
              scope.farmerProducts[i].product.unit,
              scope.farmerProducts[i].price.price,
              scope.farmerProducts[i].product.images,
              scope.farmer.id,
              scope.farmer.businessSubject.name,
              scope.farmer.businessSubject.city,
              scope.farmer.email,
              1);
          }
        }
        for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
          if (scope.farmerProducts[i].product.id == productId) {
            scope.farmerProducts[i].itemNum = 1;
          }
        }

        scope.wishlistItems = WishlistService.getItemsSize();

        scope.price = CartService.getTotalCartAmount() + "";
      } else {
        alert("Proizvodi drugog farmera su u kolicima.");
      }
    }

    scope.isProductInCart = function (productId) {

      var content = CartService.getItems(scope.farmerId);
      if (content != null) {
        for (var i = content.items.length - 1; i >= 0; i--) {
          if ((content.items[i].itemId == productId) && (content.items[i].itemNum > 0)) {
            return true;
          }
        }
      }
      return false;
    }

    scope.addMore = function (product) {
      if (_validateProductAmount(product, ++product.itemNum)) {
        product.resourceExcedeed = false;
        product.alertMessage = "";
        CartService.more(product.product.id, scope.farmerId);
        scope.price              = CartService.getTotalCartAmount() + "";
      } else {
        product.itemNum--;
        product.resourceExcedeed = true;
        product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
      }
    }

    scope.less = function (product) {
      if (_validateProductAmount(product, --product.itemNum)) {
        product.resourceExcedeed = false;
        product.alertMessage = "";
        CartService.less(product.product.id, scope.farmerId);
        scope.price = CartService.getTotalCartAmount() + "";
      } else {
        product.itemNum++;
        product.resourceExcedeed = true;
        product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
      }
    }

    scope.setAmount = function (product, amount) {

      if ((amount != null) && (amount > 0)) {
        console.log("Amount of " + product.product.id + " = " + amount + " MAX " + product.amount);
        if (!_validateProductAmount(product, amount)) {
          product.resourceExcedeed = true;
          product.alertMessage = filter('translate')('MAX_AVAILABLE') + " "+product.amount +" "+product.measure.code;
        } else {
          product.resourceExcedeed = false;
          product.alertMessage = "";
          CartService.updateProductAmount(product.product.id, scope.farmerId, parseFloat(amount));
          scope.price              = CartService.getTotalCartAmount() + "";
        }
      }
    }

    scope.canShop = function(){
      var credentials = UserService.getUserCredentials();
      if (credentials.token != null) {
        if ((credentials.role == rootScope.farmerUserType) || (credentials.role == rootScope.distributorUserType)) {
          return false;
        }
      }
      return true;
    }
    SearchService.getFarmerById(scope.farmerId).then(function (data) {
      if (data) {
        scope.farmer              = data;
        FarmerService.getReviews(scope.farmer.id).then(function (data) {
          scope.reviews = data;
        });
        scope.farmer.bannerImages = [];
        var bannerPicIndex        = 0;
        for (var i = 0; ((i < rootScope.bannerPicsLimit) && (i < scope.farmer.images.banner.length)); i++) {
          FarmerService.getFarmerImage(routeParams.id, scope.farmer.images.banner[scope.farmer.images.banner.length - (i + 1)])
            .then(function (img) {
              scope.farmer.bannerImages[bannerPicIndex++] = "data:image/jpeg;base64," + img.document_content;
            });
        }
      } else {
        console.log("Unable to load farmer from DB");
      }
    });

    SearchService.getFarmerProducts(scope.farmerId).then(function (data) {
      if (data) {
        scope.farmerProducts = data;
        var content          = CartService.getItems(scope.farmerId);
        for (var i = scope.farmerProducts.length - 1; i >= 0; i--) {
          scope.farmerProducts[i].itemNum = 0;
          if (scope.farmerProducts[i].customImage) {
            FarmerService.getStockProductImage(scope.farmerProducts[i].stockItemId, scope.farmerProducts[i].customImage).then(function imgArrived(data) {
              for (var j = 0; j < scope.farmerProducts.length; j++) {
                if (scope.farmerProducts[j].stockItemId === data.index) {
                  scope.farmerProducts[j].product.img = "data:image/jpeg;base64," + data.document_content;
                }
              }
            });
          } else {
            SearchService.getProductImage(scope.farmerProducts[i].product.id, scope.farmerProducts[i].product.images).then(function imgArrived(data) {
              for (var j = 0; j < scope.farmerProducts.length; j++) {
                if (scope.farmerProducts[j].product.id === data.index) {
                  scope.farmerProducts[j].product.img = "data:image/jpeg;base64," + data.document_content;
                }
              }
            });
          }
          if (content != null) {
            for (var k = content.items.length - 1; k >= 0; k--) {
              if (scope.farmerProducts[i].product.id == content.items[k].itemId) {
                scope.farmerProducts[i].itemNum = content.items[k].itemNum;
                break;
              }
            }
          }
        }

        var searched = SearchService.getSearchedItems();
        console.log("Searched");
        console.log(searched);
        for (var i = searched.length - 1; i >= 0; i--) {
          for (var j = scope.farmerProducts.length - 1; j >= 0; j--) {
            if (searched[i].id == scope.farmerProducts[j].product.id) {
              scope.searchedItems.push(scope.farmerProducts[j])
            }
          }
        }
      } else {
        console.log("Unable to load farmer products from DB");
      }
    });

    FarmerService.getPrices(routeParams.id).then(function (data) {
      if (data.prices && data.prices.length > 0) {
        angular.forEach(data.prices, function (price) {
          if (!scope.prices[price.distance]) {
            scope.prices[price.distance]               = new Array();
            scope.prices[price.distance][price.weight] = price.price;
          } else {
            scope.prices[price.distance][price.weight] = price.price;
          }
        });
      } else {
        for (var i in rootScope.transportDistances) {
          scope.prices[rootScope.transportDistances[i]] = [];
          for (var j in rootScope.transportWeights) {
            scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
          }
        }
      }
    }).catch(function (err) {
      for (var i in rootScope.transportDistances) {
        scope.prices[rootScope.transportDistances[i]] = [];
        for (var j in rootScope.transportWeights) {
          scope.prices[rootScope.transportDistances[i]][rootScope.transportWeights[j]] = 0;
        }
      }
    });


    scope.canBeAdded = function () {
      return CartService.canBeAdded(scope.farmerId);
    }

    scope.range = function (min, max, step) {
      step      = step || 1;
      var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
      return input;
    };

    _validateProductAmount = function (product, amount) {
      if (parseFloat(product.amount) >= amount) {
        return true;
      }
      return false;
    }
  }]);
angular.module('paysApp').controller("forgotPasswordCtrl", ["$scope", "$http", "$filter","$modal", "$routeParams", "UserService", "Notification",
  function (scope, http, filter,modal, routeParams, UserService, Notification) {

    console.log("forgotPasswordCtrl");
    var token = routeParams.token;
    console.log(token);

    scope.password        = "";
    scope.confirmPassword = "";

    scope.passwordsSame = function () {
      if (scope.password.length == 0) {
        return false;
      }

      if (scope.password != scope.confirmPassword) {
        return false;
      }
      return true;
    }
    scope.resetPassword = function () {
      UserService.resetPassword({
        passwordChangeToken: token,
        newPass: scope.password
      }).then(function (data) {
        var modalInstance = modal.open({
          animation: true,
          templateUrl: 'passChangedModalCtrl.html',
          controller: 'passChangedModalCtrl',
          size: 'sm'
        });
      }).catch(function (err) {
        Notification.error({message: filter('translate')('PASSWORD_NOT_CHANGED')});
      });
    }
  }]);


angular.module('paysApp').controller('passChangedModalCtrl', ["$scope", "$modalInstance", "$location", function ($scope, $modalInstance, $location) {

  $scope.goToLogin = function () {
    $modalInstance.close();
    $location.path('/login');
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
angular.module('paysApp').controller("loginCtrl", ["$scope", "$http", "$filter", "$window", "CartService", "WishlistService", "UserService", "Notification",
  function (scope, http, filter, $window, CartService, WishlistService, UserService, Notification) {

    console.log("login Ctrl!");

    scope.login = function () {
      var clientId = "41a888d71e754ee99167eaebecace9c1";
      var domain   = "pays-system.com";

      //redirect url for the user to authenticate
      //itself using the fi-ware oauth
      var newURL            = "http://148.6.81.216/oauth2/authorize"
        + "?response_type=code"
        + "&client_id=" + clientId
        + "&state=xyz"
        + "&redirect_uri=http%3A%2F%2F" + domain
        + "%2Fcallback.php";

      //actual redirect
      console.log(newURL);
      $window.location.href = newURL;
    }

    scope.forgotPassEmail = "";

    scope.forgotPass = function () {
      console.log("FORGOT" + scope.forgotPassEmail);
      UserService.sendForgotPasswordEmail({
        email: scope.forgotPassEmail
      }).then(function (data) {
        Notification.success({message: filter('translate')('PASSWORD_EMAIL_SENT')});
      }).catch(function (err) {
        Notification.error({message: filter('translate')('PASSWORD_EMAIL_NOT_SENT')});
      });
    }
  }]);
angular.module('paysApp').controller("mainCtrl", ["$scope", "$sce", "$document", "$http", "$filter", "$location", "localStorageService",
    "GeoLocationService", "CartService", "WishlistService", "SearchService","FarmerService",
    function (scope, $sce, $document, http, filter, location, localStorageService, GeoLocationService, CartService, WishlistService, SearchService, FarmerService) {


        console.log("Main Ctrl!");

        scope.checkedValue = "";
        scope.geoLoc = null;
        scope.geoLocSearch = null;
        scope.gmapsLocLink = "";

        scope.searchWishlistItems = [];
        scope.categories = [];
        scope.selectedCategories = [];

        scope.foundProducts = [];
        scope.foundFarmers = [];

        scope.searchName = "";
        scope.searchPlace = "";
        scope.locationFound = false;

        scope.queryParams = {
            searchName : "",
            searchPlace : "",
            distanceValue: "",
            products : {
                product : {},
                minAmount : "",
                maxPrice: ""
            }
        }

        scope.searchPlaceValue = "";
        scope.searchPerformed = false;
        scope.initGeo = function () {
            GeoLocationService.getLocation().then(function (data) {
                if (data) {
                    scope.geoLoc = GeoLocationService.getGeoLoc();

                    scope.gmapsLocLink = "https://www.google.rs/maps/place/" + scope.geoLoc.lat + "," + scope.geoLoc.lng;
                } else {
                    scope.geoLoc = null;
                }
            });
        }


        scope.farmers = [];

        scope.nearByFarmers = GeoLocationService.testPromise().then(function (data) {

            scope.farmers = scope.farmersLoaded;

        }, function (error) {

        });


        scope.changeSearchMode = function () {
            scope.geoLoc = null;
            scope.locationFound = false;
        };

        scope.clearSearch = function () {
            scope.searchPlaceValue = "";
            scope.geoLoc = null;
            scope.locationFound = false;
        };


        scope.categoryId = "";
        scope.subcategoryId = "";
        scope.subcatProductId = "";

        scope.subcategories = [];
        scope.subcatproducts = [];
        scope.getCategories = SearchService.getCategories().then(function (data) {
            if (data) {
                scope.categories = data;
            } else {
                console.log("Unable to retrieve categories from DB");
            }

        });


        scope.setSearchPrepared = function () {
            var query = {};
            if(scope.searchName.length > 0){
                query.name = scope.searchName;
            }
            if(scope.searchWishlistItems.length > 0){
                query.items = [];
                angular.forEach(scope.searchWishlistItems, function(item){
                    query.items.push({
                        productId : item.id,
                        minAmount : (typeof item.minAmount == 'undefined') ? 0  : item.minAmount,
                        maxPrice : (typeof item.maxPrice == 'undefined') ? 0  : item.maxPrice
                    });
                })
            }
            SearchService.setSearchedItems(scope.searchWishlistItems);
            if(scope.searchPlaceValue.length > 0 ){
                SearchService.getLocationByAddress(scope.searchPlaceValue + " , Serbia").then(function(coordinates){
                    query.location = { latitude : coordinates.lat , longitude : coordinates.lng, range : scope.distanceValue.num};
                    console.log(query);
                    SearchService.searchFarmers(query).then(function (data) {
                        if (data) {
                            scope.searchPerformed = true;
                            scope.foundFarmers = data;
                            for (var j = 0; j < scope.foundFarmers.length; j++) {
                                FarmerService.getFarmerImage(scope.foundFarmers[j].id,scope.foundFarmers[j].images.profile).then(function (img) {
                                    for (var i = 0; i < scope.foundFarmers.length; i++) {
                                        if (scope.foundFarmers[i].id === img.index) {
                                            scope.foundFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            console.log("Unable to load farmers from DB");
                        }
                    });
                });
            } else {

                SearchService.searchFarmers(query).then(function (data) {
                    if (data) {
                        scope.searchPerformed = true;
                        scope.foundFarmers = data;
                        for (var j = 0; j < scope.foundFarmers.length; j++) {
                            FarmerService.getFarmerImage(scope.foundFarmers[j].id,scope.foundFarmers[j].images.profile).then(function (img) {
                                for (var i = 0; i < scope.foundFarmers.length; i++) {
                                    if (scope.foundFarmers[i].id === img.index) {
                                        scope.foundFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                                    }
                                }
                            });
                        }
                    }
                    else {
                        console.log("Unable to load farmers from DB");
                    }
                });
            }
        };
        scope.cancelSearch = function () {
            console.log("Search configuration canceled.");
            scope.foundFarmers = [];
            scope.searchPerformed = false;
        };


        scope.isWishListEmpty = function () {
            return typeof scope.searchWishlistItems[0] === 'undefined' || scope.searchWishlistItems.length == 0;
        };

        scope.noSelectedCategory = function () {
            return typeof scope.selectedCategories[0] === 'undefined' || scope.selectedCategories.length == 0;
        }

        scope.noFoundFarmers = function () {
            console.log("no selected farmers? ".concat(typeof scope.foundFarmers[0] === 'undefined' || scope.foundFarmers.length == 0));
            return typeof scope.foundFarmers[0] === 'undefined' || scope.foundFarmers.length == 0;
        }

        scope.check = function (category) {
            console.log(category.checkedValue);
            if (!category.checkedValue) {
                SearchService.getProductsInCategory(category.id).then(function (data) {
                    if (data) {
                        var products = data.products;
                        scope.selectedCategories.splice(scope.selectedCategories.indexOf(category), 1);
                        for (var j = products.length - 1; j >= 0; j--) {
                            for (var k = scope.foundProducts.length - 1; k >= 0; k--) {
                                if (scope.foundProducts[k].id == products[j].id) {
                                    scope.foundProducts.splice(k, 1);
                                    break;
                                }
                            }
                        }
                    } else {
                        console.log("Unable to retrieve category products from DB");
                    }
                });
            }
            if (category.checkedValue) {
                SearchService.getProductsInCategory(category.id).then(function (data) {
                    if (data) {
                        scope.selectedCategories.push(category);
                        var products = data.products;
                        for (var j = products.length - 1; j >= 0; j--) {
                            products[j].checked = false;
                            if (products[j].checked == false) {
                                for (var k = scope.searchWishlistItems.length - 1; k >= 0; k--) {
                                    if (scope.searchWishlistItems[k].id == products[j].id) {
                                        products[j].checked = true;
                                    }
                                }
                            }

                            scope.foundProducts.push(products[j]);
                        }
                    } else {
                        console.log("Unable to retrieve category products from DB");
                    }
                });
            }
        }


        scope.addOrRemoveSearchWishlistItem = function (product) {

            if (product.checked) {
                var prodFound = false;
                for (var prod in scope.searchWishlistItems) {
                    if (prod.id == product.id) {
                        prodFound = true;
                    }
                }

                if (prodFound == false) {
                    console.log("Adding product ".concat(product.name));
                    scope.searchWishlistItems.push(product);
                }
            } else {
                console.log("Removing product ".concat(product.name));
                var idx = scope.searchWishlistItems.indexOf(product);
                if (idx >= 0) {
                    scope.searchWishlistItems.splice(idx, 1);
                }
            }
        }

        scope.clearSelectedSearchProducts = function () {
            scope.searchWishlistItems = [];
            scope.selectedCategories = [];
            scope.foundProducts = [];
            scope.foundFarmers = [];
            scope.searchPerformed = false;
        }
        scope.distance = "";

        scope.getLocation = function () {
            if (scope.geoLoc != null) {
                return {
                    "distance": scope.distance,
                    "name": "YOUR_LOC",
                    "longitude": scope.geoLoc.lng,
                    "latitude": scope.geoLoc.lat
                };
            } else if (scope.geoLocSearch != null) {
                return {
                    "distance": scope.distance,
                    "name": scope.searchPlaceValue,
                    "longitude": scope.geoLocSearch.lng,
                    "latitude": scope.geoLocSearch.lat
                };
            } else {
                return {
                    "distance": "",
                    "name": "",
                    "longitude": "",
                    "latitude": ""
                };
            }
        };

//INIT FUNCTIONS
//        scope.initGeo();
        SearchService.getFarmers().then(function (data) {
            if (data) {
                scope.farmersLoaded = data;
                for (var j = 0; j < scope.farmersLoaded.length; j++) {
                    if (scope.farmersLoaded[j].images.profile != null) {
                        FarmerService.getFarmerImage(scope.farmersLoaded[j].id, scope.farmersLoaded[j].images.profile).then(function (img) {
                            for (var i = 0; i < scope.farmersLoaded.length; i++) {
                                if (scope.farmersLoaded[i].id === img.index) {
                                    scope.farmersLoaded[i].img = "data:image/jpeg;base64," + img.document_content;
                                }
                            }
                        });
                    }
                }
            }
            else {
                console.log("Unable to load farmers from DB");
            }
        });

        SearchService.getMostProfitFarmers().then(function (data) {
            scope.mostProfitFarmers = data;
            for (var j = 0; j < scope.mostProfitFarmers.length; j++) {
                if (scope.mostProfitFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostProfitFarmers[j].merchantId, scope.mostProfitFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostProfitFarmers.length; i++) {
                            if (scope.mostProfitFarmers[i].merchantId === img.index) {
                                scope.mostProfitFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });

        SearchService.getMostOrdersFarmers().then(function (data) {
            scope.mostProductsFarmers = data;
            for (var j = 0; j < scope.mostProductsFarmers.length; j++) {
                if (scope.mostProductsFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostProductsFarmers[j].merchantId, scope.mostProductsFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostProductsFarmers.length; i++) {
                            if (scope.mostProductsFarmers[i].merchantId === img.index) {
                                scope.mostProductsFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });

        SearchService.getMostProductsFarmers().then(function (data) {
            scope.mostOrdersFarmers = data;
            for (var j = 0; j < scope.mostOrdersFarmers.length; j++) {
                if (scope.mostOrdersFarmers[j].imageId != null) {
                    FarmerService.getFarmerImage(scope.mostOrdersFarmers[j].merchantId, scope.mostOrdersFarmers[j].imageId).then(function (img) {
                        for (var i = 0; i < scope.mostOrdersFarmers.length; i++) {
                            if (scope.mostOrdersFarmers[i].merchantId === img.index) {
                                scope.mostOrdersFarmers[i].img = "data:image/jpeg;base64," + img.document_content;
                            }
                        }
                    });
                }
            }
        });
        scope.searchNameCallback = function(keyEvent) {
            if (keyEvent.which === 13){
                scope.setSearchPrepared();
            }
        }

        scope.distances = SearchService.getDistances();
    }])
;
/**
 * Created by nignjatov on 18.12.2015.
 */
angular.module('paysApp').controller("navbarCtrl", ["$scope","$rootScope","$location",
    "CartService", "WishlistService",
    function (scope, rootScope,location, CartService, WishlistService) {


        scope.price = CartService.getTotalCartAmount() + "";
        scope.wishlistItemsSize = WishlistService.getItemsSize();

    }]);

angular.module('paysApp').controller("orderCtrl", ["$scope", "$rootScope", "$routeParams", "$window", "OrderService", "CartService", "SearchService","UserService",
  function (scope, rootScope, routeParams, window, OrderService, CartService, SearchService,UserService) {

    console.log("orderCtrl!");
    var orderId = routeParams.orderId;
    console.log("ORDER ID " + orderId);

    CartService.resetCart();
    OrderService.clearOrderData();

    OrderService.getOrder(orderId).then(function (order) {
      scope.order     = order;
      var credentials = UserService.getUserCredentials();
      if (credentials.role == rootScope.buyerUserType && scope.order.orderedBy == credentials.id) {
        if(order.status != 'C'){
          CartService.resetCart();
        }
        SearchService.getClientById(scope.order.orderedBy, 0).then(function clientDataArrived(client) {
          scope.order.client = client;
        });
        SearchService.getFarmerById(scope.order.orderedFrom, 0).then(function (farmer) {
          scope.order.farmer = farmer;
        });
        UserService.getUserPreviousDeliveryAddress(scope.order.orderedBy).then(function (address) {
          UserService.storeUserDeliveryAddresses(scope.order.orderedBy, address);
        });
      } else {
        scope.order = null;
      }
    });

    scope.goToMainPage = function () {
      window.location.href = "#/";
    };
  }]);
angular.module('paysApp').controller("redirectCtrl", ["$scope", "$rootScope", "$routeParams", "$location", "UserService",
  function (scope, rootScope, routeParams, location, UserService) {

    console.log("redirectCtrl!");
    var token = routeParams.token;
    var idmId = routeParams.id;
    var role  = routeParams.role;

    UserService.getUserIdFromIDMId(idmId, role).then(function (id) {
      UserService.storeUserCredentials(token, id.id, role);
      if (role === rootScope.buyerUserType) {
        UserService.getUserPreviousDeliveryAddress(id.id).then(function (address) {
          UserService.storeUserDeliveryAddresses(id.id, address);
        });
      }
    });

    location.path('#/');

  }]);
angular.module('paysApp').controller("registerCtrl", ["$scope", "$q","$timeout", "$rootScope", "$filter", "$modal", "UserService","SearchService", "WishlistService", "CartService", "Notification",
  function (scope, q, timeout, rootScope, filter, modal, UserService,SearchService, WishlistService, CartService, Notification) {

    scope.userType = "";

    scope.confPassword = "";
    scope.registerDeffered = {};

    scope.passwordMatch = 0;
    scope.userTypes = [
      {
        name: "BUYER",
        id: rootScope.buyerUserType
      },
      {
        name: "DISTRIBUTOR",
        id: rootScope.distributorUserType
      },
      {
        name: "FARMER",
        id: rootScope.farmerUserType
      }

    ]

    scope.buyer = {
      "type": "C",
      "username": "",
      "password": "",
      "email": "",
      "isPrivateUser": true,
      "privateSubject": {
        "name": "",
        "lastName": "",
        "address": "",
        "phone": "",
        "city": "",
        "postalCode": ""
      }
    };

    scope.distributor = {
      type: "T",
      username: "",
      password: "",
      email: "",
      isPrivateUser: false,
      businessSubject: {
        name: "",
        account: "",
        taxNum: "",
        companyNum: "",
        businessActivityCode: "",
        address: "",
        phone: "",
        fax: "",
        city: "",
        postalCode: ""
      }
    };

    scope.farmer = {
      type: "F",
      username: "",
      password: "",
      email: "",
      isPrivateUser: false,
      businessSubject: {
        name: "",
        account: "",
        taxNum: "",
        companyNum: "",
        businessActivityCode: "",
        address: "",
        phone: "",
        fax: "",
        city: "",
        postalCode: ""
      }
    };

    scope.register = function () {
      scope.registerDeffered = q.defer();

      if (scope.userType == rootScope.buyerUserType) {
        console.log(scope.buyer);
        if ((scope.buyer.password.length == 0) || (scope.confPassword.length == 0) || (scope.buyer.password !== scope.confPassword)) {
          Notification.error({message: filter('translate')('PASSWORD_NOT_MATCH')});
        } else {
          UserService.registerUser(scope.buyer).then(function (data) {
            scope.registerDeffered.resolve();
            var modalInstance = modal.open({
              animation: true,
              templateUrl: 'userActivateModal.html',
              controller: 'userActivateModalCtrl',
              size: 'sm'
            });
          }).catch(function (error) {
            scope.registerDeffered.reject();
            Notification.error({message: filter('translate')('USER_NOT_ADDED')});
          });
        }
      } else if (scope.userType == rootScope.distributorUserType) {
        console.log(scope.distributor);
        if ((scope.distributor.password.length == 0) || (scope.confPassword.length == 0) || (scope.distributor.password !== scope.confPassword)) {
          Notification.error({message: filter('translate')('PASSWORD_NOT_MATCH')});
        } else {
          UserService.registerUser(scope.distributor).then(function (data) {
            scope.registerDeffered.resolve();
            var modalInstance = modal.open({
              animation: true,
              templateUrl: 'userActivateModal.html',
              controller: 'userActivateModalCtrl',
              size: 'sm'
            });
          }).catch(function (error) {
            scope.registerDeffered.reject();
            Notification.error({message: filter('translate')('USER_NOT_ADDED')});
          });
        }
      }
      else if (scope.userType == rootScope.farmerUserType) {
        console.log(scope.farmer);
        if ((scope.farmer.password.length == 0) || (scope.confPassword.length == 0) || (scope.farmer.password !== scope.confPassword)) {
          Notification.error({message: filter('translate')('PASSWORD_NOT_MATCH')});
        } else {
          SearchService.getLocationByAddress(scope.farmer.businessSubject.city+", Serbia").then(function(loc){
            scope.farmer.location = {
              latitude : loc.lat,
              longitude : loc.lng
            };
            UserService.registerUser(scope.farmer).then(function (data) {
              scope.registerDeffered.resolve();
              var modalInstance = modal.open({
                animation: true,
                templateUrl: 'userActivateModal.html',
                controller: 'userActivateModalCtrl',
                size: 'sm'
              });
            }).catch(function (error) {
              scope.registerDeffered.reject();
              Notification.error({message: filter('translate')('USER_NOT_ADDED')});
            });
          }).catch(function(){
            Notification.error({message: filter('translate')('LOCATION_NOT_FOUND')});
            scope.registerDeffered.reject();
          });
        }
      }
    }

    scope.copyEmail = function () {
      if (scope.userType == rootScope.buyerUserType) {
        scope.buyer.username = scope.buyer.email;
      } else if (scope.userType == rootScope.distributorUserType) {
        scope.distributor.username = scope.distributor.email;
      }
      if (scope.userType == rootScope.farmerUserType) {
        scope.farmer.username = scope.farmer.email;

      }
    }

    scope.validatePassword = function (conf, notify) {
      scope.confPassword = conf;
      scope.passwordMatch = 0;
      var retVal         = false;
      if (conf.length > 0) {
        if (scope.userType == rootScope.buyerUserType) {
          if ((scope.buyer.password.length > 0) && (scope.buyer.password === scope.confPassword)) {
            if (notify) {
              Notification.success({message: filter('translate')('PASSWORD_MATCH')});
              scope.passwordMatch = 2;
            }
            retVal = true;
          } else {
            scope.passwordMatch = 1;
          }
        } else if (scope.userType == rootScope.distributorUserType) {
          if ((scope.distributor.password.length > 0) && (scope.distributor.password === scope.confPassword)) {
            if (notify) {
              Notification.success({message: filter('translate')('PASSWORD_MATCH')});
              scope.passwordMatch = 2;
            }
            retVal = true;
          } else {
            scope.passwordMatch = 1;
          }
        } else if (scope.userType == rootScope.farmerUserType) {
          if ((scope.farmer.password.length > 0) && (scope.farmer.password === scope.confPassword)) {
            if (notify) {
              Notification.success({message: filter('translate')('PASSWORD_MATCH')});
              scope.passwordMatch = 2;
            }
            retVal = true;
          } else {
            scope.passwordMatch = 1;
          }
        }
      }
      return retVal;
    }
  }]);

angular.module('paysApp').controller('userActivateModalCtrl', ["$scope", "$modalInstance", "$location", function ($scope, $modalInstance, $location) {

  $scope.goToLogin = function () {
    $modalInstance.close();
    $location.path('/login');
  }

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
angular.module('paysApp').controller("wishlistCtrl", ["$scope", "$http", "$filter", "WishlistService", "CartService", "Notification", "SearchService","FarmerService",
  function (scope, http, filter, WishlistService, CartService, Notification, SearchService,FarmerService) {

    console.log("wishlistCtrl!");

    scope.farmerProducts = [];
    scope.price          = CartService.getTotalCartAmount() + "";

    scope.wishlistItemsSize = WishlistService.getItemsSize();
    scope.wishlistItems     = WishlistService.getItems();
    scope.images            = [];

    scope.farmers = [];

    scope.loadData = function () {
      scope.wishlistItemsSize = WishlistService.getItemsSize();
      scope.price             = CartService.getTotalCartAmount() + "";
      scope.wishlistItems     = WishlistService.getItems();
      for (var i = 0; i < scope.wishlistItems.length; i++) {
        for (var j = 0; j < scope.wishlistItems[i].products.items.length; j++) {
          for (var k = 0; k < scope.images.length; k++) {
            if (scope.wishlistItems[i].products.items[j].itemId == scope.images[k].itemId ||
              scope.wishlistItems[i].products.items[j].stockId == scope.images[k].itemId) {
              scope.wishlistItems[i].products.items[j].img = scope.images[k].img;
            }
          }
        }
      }
    }


    for (var i = 0; i < scope.wishlistItems.length; i++) {
      if (scope.farmers.indexOf(scope.wishlistItems[i].farmer) < 0) {
        scope.farmers.push(scope.wishlistItems[i].farmer);
      }
    }
    scope.loadData();
    for (var i = 0; i < scope.farmers.length; i++) {
      SearchService.getFarmerProducts(scope.farmers[i].farmerId).then(function (productData) {
        for (var i = 0; i < scope.wishlistItems.length; i++) {
          for (var j = 0; j < scope.wishlistItems[i].products.items.length; j++) {
            for (var p = 0; p < productData.length; p++) {
              if (scope.wishlistItems[i].products.items[j].itemId == productData[p].product.id) {
                if (productData[p].customImage) {
                  scope.wishlistItems[i].products.items[j].stockId = productData[p].stockItemId;
                  FarmerService.getStockProductImage(productData[p].stockItemId, productData[p].customImage).then(function imgArrived(img) {
                    for (var m = 0; m < scope.wishlistItems.length; m++) {
                      for (var n = 0; n < scope.wishlistItems[m].products.items.length; n++) {
                        if (scope.wishlistItems[m].products.items[n].stockId === img.index) {
                          scope.wishlistItems[m].products.items[n].img = "data:image/jpeg;base64," + img.document_content;
                          img.index = scope.wishlistItems[m].products.items[n].itemId;
                        }
                      }
                    }
                    scope.images.push({
                      itemId: img.index,
                      img: "data:image/jpeg;base64," + img.document_content
                    });
                  });
                } else {
                  SearchService.getProductImage(productData[p].product.id, productData[p].product.images).then(function imgArrived(img) {
                    for (var m = 0; m < scope.wishlistItems.length; m++) {
                      for (var n = 0; n < scope.wishlistItems[m].products.items.length; n++) {
                        if (scope.wishlistItems[m].products.items[n].itemId === img.index) {
                          scope.wishlistItems[m].products.items[n].img = "data:image/jpeg;base64," + img.document_content;
                        }
                      }
                    }
                    scope.images.push({
                      itemId: img.index,
                      img: "data:image/jpeg;base64," + img.document_content
                    });
                  });
                }
              }
            }
          }
        }
      });
    }
    scope.remove = function (productId, farmerId) {
      WishlistService.remove(productId, farmerId);
      scope.loadData();
    }

    scope.putToCart = function (productId, farmerId, msg) {
      if (WishlistService.canBeAddedToCart(farmerId)) {
        WishlistService.toCart(productId, farmerId);
        Notification.info({message: msg});
      }
      scope.loadData();
    }

    scope.removeFromWishlist = function (productId, farmerId, msg) {
      WishlistService.removeFromWishList(productId, farmerId);
      scope.wishlistItems = WishlistService.getItemsSize();
      Notification.info({message: msg});
      scope.loadData();
    }

    scope.canBeAdded = function (farmerId) {
      return CartService.canBeAdded(farmerId);
    }

    scope.isProductInCart = function (productId) {
      var content = CartService.getItems();
      if (content != null) {
        for (var i = content.items.length - 1; i >= 0; i--) {
          if ((content.items[i].itemId == productId) && (content.items[i].itemNum > 0)) {
            return true;
          }
        }
      }
      return false;
    }

    scope.goToMainPage = function () {
      window.location.href = "#/";
    };

    scope.price             = CartService.getTotalCartAmount() + "";
    scope.wishlistItemsSize = WishlistService.getItemsSize();
  }]);
angular.module('paysApp').directive('setClassWhenAtTop', ["$window", function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                offsetTop = element.offset().top + 70; // get element's top relative to the document

            $win.on('scroll', function (e) {
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
}]);
var CartService = angular.module('CartService', []).service('CartService', ['localStorageService', function (localStorageService) {

        this.putInCartAmmount = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation, farmerEMail, ammount) {
            var keys = localStorageService.keys();
            var added = false;
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.farmerId == farmerId && identifier.type == "cart") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.items.push({
                        "itemName": productName,
                        "itemNum": ammount,
                        "itemPrice": productPrice,
                        "itemMeasure": productMeasure,
                        "itemId": productId,
                        "image": productImage
                    });
                    localStorageService.set(keys[i], localItem);
                    added = true;
                    return;
                }
            };
            if (!added) {
                localStorageService.set(JSON.stringify(
                    {
                        "type": "cart",
                        "farmerId": farmerId,
                        "farmer": farmerName,
                        "farmerLocation": farmerLocation,
                        "farmerEMail": farmerEMail
                    }
                ), {
                    items: [{
                        "itemName": productName,
                        "itemNum": ammount,
                        "itemPrice": productPrice,
                        "itemMeasure": productMeasure,
                        "itemId": productId,
                        "image": productImage
                    }],
                    "currency": "RSD"
                });
            }
        }

        this.more = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            localItem.items[j].itemNum = localItem.items[j].itemNum + 1;
                        }
                    }
                    localStorageService.set(keys[i], localItem);
                }
            }

        }

        this.less = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            if (localItem.items[j].itemNum > 1) {
                                localItem.items[j].itemNum = localItem.items[j].itemNum - 1;
                                localStorageService.set(keys[i], localItem);
                            } else {
                                localItem.items.splice(j, 1);
                                if (localItem.items.length == 0) {
                                    localStorageService.remove(keys[i]);
                                } else {
                                    localStorageService.set(keys[i], localItem);

                                }
                            }
                        }
                    }
                }
            }
        }

        this.updateProductAmount = function (productId, farmerId, amount) {
            console.log("AMOUNT "+ amount)
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            if (amount > 0) {
                                localItem.items[j].itemNum = amount;
                                localStorageService.set(keys[i], localItem);
                            } else {
                                localItem.items.splice(j, 1);
                                if (localItem.items.length == 0) {
                                    localStorageService.remove(keys[i]);
                                } else {
                                    localStorageService.set(keys[i], localItem);

                                }
                            }
                        }
                    }
                }
            }
        }

        this.resetCart = function () {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    localStorageService.remove(keys[i]);
                }
            }
        }

        this.remove = function (productId, farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId == farmerId) {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        if (localItem.items[j].itemId == productId) {
                            localItem.items.splice(j, 1);
                            if (localItem.items.length == 0) {
                                localStorageService.remove(keys[i]);
                            } else {
                                localStorageService.set(keys[i], localItem);

                            }
                        }
                    }
                }
            }
        }

        this.canBeAdded = function (farmerId) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart" && identifier.farmerId != farmerId) {
                    return false;
                }
            }
            return true;
        }

        this.getItems = function () {
            var keys = localStorageService.keys();
            var items = null;
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    items = localStorageService.get(keys[i]);
                }
            }
            return items;
        }

        this.getTotalCartAmount = function () {
            var price = 0;
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    var localItem = localStorageService.get(keys[i]);
                    for (var j = 0; j < localItem.items.length; j++) {
                        price += localItem.items[j].itemNum * localItem.items[j].itemPrice;
                    }
                }
            }
            return price;
        }

        this.getCartFarmer = function() {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "cart") {
                    return identifier;
                }
            }
            return null;
        }
    }]);
/**
 * Created by nignjatov on 20.11.2015.
 */
var DistributorService = angular.module('DistributorService', []).service('DistributorService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {


        /**
         * Distributor data
         */
        this.getDistributors = function () {
            var deffered = q.defer();

            http.get("transporter").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributors | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributors | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.searchDistributors = function (query) {
            var deffered = q.defer();

            http.post("transporter_search",query).
            success(function (data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                    console.log("searchDistributors | Status not OK " + status);
                    deffered.reject("Error");
                }

            }).
            error(function (data, status) {
                console.log("searchDistributors | Error " + status);
                deffered.reject("Error");
            });

            return deffered.promise;
        }

        this.getDistributorById = function (distributorId) {
            var deffered = q.defer();

            http.get("transporter/" + distributorId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getDistributorById | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getDistributorById | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateGeneralInfo = function (distributorId, info) {
            var deffered = q.defer();

            http.put("transporter/" + distributorId, info).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updateGeneralInfo | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updateGeneralInfo | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.updateAdvertisingInfo = function (distributorId, info) {
            var deffered = q.defer();

            http.post("transporter/" + distributorId + "/advertising", info).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updateAdvertisingInfo | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updateAdvertisingInfo | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        /**
         * Vehicles data
         */

        this.getVehiclesByDistributorId = function (distributorId) {
            var deffered = q.defer();

            http.get("transporter/" + distributorId + "/vehicles").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getVehiclesByDistributorId | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getVehiclesByDistributorId | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.addNewVehicle = function (distributorId, vehicle) {
            var deffered = q.defer();

            http.post("transporter/" + distributorId + "/vehicles", vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("addNewVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("addNewVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateVehicle = function (distributorId, vehicle) {
            var deffered = q.defer();

            http.put("transporter/" + distributorId + "/vehicles/" + vehicle.id, vehicle).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("updateVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.deleteVehicle = function (distributorId, vehicleId) {
            var deffered = q.defer();

            http.delete("transporter/" + distributorId + "/vehicles/" + vehicleId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("deleteVehicle | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("deleteVehicle | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        /**
         * Images handling
         */

        this.getDistributorImage = function (distId, imageId) {
            var deffered = q.defer();
            http.get( "transporter/" + distId+"/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = distId;
                      data.imageIndex = imageId;
                      deffered.resolve(data);
                  } else {
                      console.log("getDistributorImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getVehicleImage = function (vehicleId, imageId) {
            var deffered = q.defer();

            http.get("vehicle/" + vehicleId + "/images/" + imageId + "/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = vehicleId;
                      deffered.resolve(data);
                  } else {
                      console.log("getVehicleImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.getVehicleImages = function(vehicleId){
            var deffered = q.defer();

            http.get("vehicle/" + vehicleId + "/images").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = vehicleId;
                      deffered.resolve(data);
                  } else {
                      console.log("getVehicleImages |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadVehicleImage = function(vehicleId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"vehicle/"+vehicleId+"/imagefile";
            } else {
                // update current picture of vehicle
                flowObj.opts.target = rootScope.serverURL+"vehicle/"+vehicleId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.uploadDistributorProfileImage = function(distributorId,imageId,flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/imagetype/P/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.uploadDistributorBannerImage = function(distributorId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/imagetype/B/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"transporter/"+distributorId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.updatePrices = function(distributorId, pricesData){
            var deffered = q.defer();

            http.post("transporter/" + distributorId + "/pricelist", pricesData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updatePrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updatePrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getPrices = function(distributorId){
            var deffered = q.defer();

            http.get("transporter/" + distributorId + "/pricelist").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getPrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getPrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }
    }]);
var FarmerService = angular.module('FarmerService', []).service('FarmerService',
    ["$rootScope", "$q", "$http", function (rootScope, q, http) {

        this.QRCodeDataSeparator = "*";

        this.updateGeneralInfo = function (farmerId, info) {
            var deffered = q.defer();

            http.put("merchant/" + farmerId, info).
                success(function (data, status) {
                    if (status == 200) {
                        console.log("updateGeneralInfo | Status OK " + status);
                        deffered.resolve(data);
                    } else {
                        console.log("updateGeneralInfo | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateGeneralInfo | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.updateAdvertisingInfo = function (farmerId, info) {
            var deffered = q.defer();

            http.post("merchant/" + farmerId + "/advertising", info).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("updateAdvertisingInfo | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateAdvertisingInfo | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }


        this.getProductImage = function (productId, imageId) {
            var deffered = q.defer();

            http.get("product/" + productId + "/images/" + imageId + "/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        deffered.resolve(data);
                    } else {
                        console.log("getProductImage |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.getProductImages = function(productId){
            var deffered = q.defer();

            http.get("product/" + productId + "/images").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        deffered.resolve(data);
                    } else {
                        console.log("getProductImages |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.getStockProductImage = function(stockId,imageId){
            var deffered = q.defer();

            http.get("stock_item/" + stockId + "/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = stockId;
                      deffered.resolve(data);
                  } else {
                      console.log("getStockProductImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadStockProductImage = function(stockId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"stock_item/"+stockId+"/imagefile";
            } else {
                // update current picture of vehicle
                flowObj.opts.target = rootScope.serverURL+"stock_item/"+stockId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.deleteStockProductImage = function(stockId){
            var deffered = q.defer();

            http.delete("stock_item/" + stockId + "/images").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = stockId;
                      deffered.resolve(data);
                  } else {
                      console.log("deleteStockProductImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.uploadFarmerProfileImage = function(farmerId,imageId,flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"merchant/"+farmerId+"/imagetype/P/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"merchant/"+farmerId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        this.uploadFarmerBannerImage = function(farmerId, imageId, flowObj){
            var deferred = q.defer();
            //image doesnt exists,create new one
            if(imageId == rootScope.undefinedImageId){
                flowObj.opts.target = rootScope.serverURL+"merchant/"+farmerId+"/imagetype/B/imagefile";
            } else {
                // update current profile picture
                flowObj.opts.target = rootScope.serverURL+"merchant/"+farmerId+"/image/"+imageId+"/imagefile";
            }
            flowObj.opts.headers = {'X-Auth-Token' : rootScope.credentials.token};
            flowObj.opts.testChunks=false;
            flowObj.opts.fileParameterName = "file";
            flowObj.on('fileSuccess', function (event,resp) {
                console.log('fileSuccess ', resp);
                deferred.resolve(JSON.parse(resp));
            });
            flowObj.on('fileError', function (event,err) {
                console.log('fileError ', err);
                if(err.length > 0) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(err);
                }
            });
            flowObj.upload();
            return deferred.promise;
        }

        //@url PUT /merchant/$id/products/$productId/amount/$amount
        this.updateProduct = function (farmerId, product) {
            var deffered = q.defer();

            http.put("merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post("merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.newPrice,
                            "minAmount":100,
                            "from":"2016-01-01",
                            "to":"2017-01-01"
                        }).success(function (data, status) {
                            if (status == 200) {
                                deffered.resolve(data);
                            }
                            else {
                                console.log("updateProduct | Status not OK " + status);
                                deffered.reject("Error");
                            }
                        }).error(function (data, status) {
                                console.log("updateProduct | Error " + status);
                                deffered.reject("Error");
                        });

                    } else {
                        console.log("updateProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("updateProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.addNewProduct = function (farmerId, product) {
            var deffered = q.defer();

            http.put("merchant/" + farmerId + "/products/" + product.product.id + "/amount/" + product.amount).
                success(function (data, status) {
                    if (status == 200) {
                        console.log(data);
                        http.post("merchant/" + farmerId + "/products/" + product.product.id +"/pricelist", {
                            "product": product.product.id,
                            "currencyId": product.price.currency.id,
                            "price": product.price.newPrice
                        }).success(function (dataPrice, status) {
                            if (status == 200) {
                                deffered.resolve(data);
                            }
                            else {
                                console.log("addNewProduct | Status not OK " + status);
                                deffered.reject("Error");
                            }
                        }).error(function (data, status) {
                            console.log("addNewProduct | Error " + status);
                            deffered.reject("Error");
                        });

                    } else {
                        console.log("addNewProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("addNewProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.deleteProduct = function (farmerId, productId) {
            var deffered = q.defer();

            http.delete("merchant/" + farmerId + "/products/" + productId).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("deleteProduct | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("deleteProduct | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmerImage = function (farmerId, imageId) {
            var deffered = q.defer();
            http.get("merchant/" + farmerId+"/images/"+imageId+"/imagefile").
              success(function (data, status) {
                  if (status == 200) {
                      data.index = farmerId;
                      data.imageIndex = imageId;
                      deffered.resolve(data);
                  } else {
                      console.log("getFarmerImage |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.updatePrices = function(farmerId, pricesData){
            var deffered = q.defer();

            http.post("merchant/" + farmerId + "/transportPricelist", pricesData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("updatePrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("updatePrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getPrices = function(farmerId){
            var deffered = q.defer();

            http.get("merchant/" + farmerId + "/transportPricelist").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getPrices | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getPrices | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getReviews = function(farmerId){
            var deffered = q.defer();

            http.get("merchant/" + farmerId + "/reviews").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getReviews | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getReviews | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.setTransportOrderStatus = function(farmerId,orderId,packageNumber) {
            var deffered = q.defer();
            http.put("merchant/" + farmerId + "/orders/" + orderId + "/startTransport/"+packageNumber).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("setTransportOrderStatus | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("setTransportOrderStatus | Error " + status);
                    deffered.reject("Error");
                });
            return deffered.promise;
        }

        this.generateOrderQRCode = function(order, farmer, packageNumber){

            var qrData;
            qrData = {
                id: order.id
            };
            return JSON.stringify(qrData);
        }

        this.getTransportPrice = function(farmerId, priceData){
            var deffered = q.defer();
            http.post("merchant/" + farmerId + "/calculateTransport",priceData).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getTransportPrice | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("getTransportPrice | Error " + status);
                  deffered.reject("Error");
              });
            return deffered.promise;
        }

        this.saveWorkHours = function(farmerId, hoursData){
            var deffered = q.defer();
            http.post("merchant/" + farmerId + "/deliveryConstraints",hoursData).
            success(function (data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                    console.log("saveWorkHours | Status not OK " + status);
                    deffered.reject("Error");
                }

            }).
            error(function (data, status) {
                console.log("saveWorkHours | Error " + status);
                deffered.reject("Error");
            });
            return deffered.promise;
        }


    }]);
var GeoLocationService = angular.module('GeoLocationService', [])
	.service('GeoLocationService', ['localStorageService', "$q", "$http", function (localStorageService, q, http) {



    var semaphore = false;
    var deferred = q.defer();

    this.hello = function () {
    	return "Hello from service";
    };

    this.getLocation = function () {
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
             return deferred.promise;
        }
          else {
            alert("Geolocation is not supported by this browser.");
            return deferred.promise;
            this.clearGeoLoc;
        }
    };

    this.showError = function (error) {
            alert (error);
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    this.clearGeoLoc;
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    this.clearGeoLoc;
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    this.clearGeoLoc;
                    break;
                case error.UNKNOWN_ERROR:
                    alert( "An unknown error occurred.");
                    this.clearGeoLoc;
                    break;
            }
    };

    this.showPosition = function (position) {
       var isGeoLocAdded = false;
            var geolocIdentifier = {
                "type" : "geoloc",
                "name" : "geoloc"
            }
            var geolocInfo = {
                "lat" : position.coords.latitude,
                "lng" : position.coords.longitude,
                "accuracy" : position.coords.accuracy
            };
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                    var geolocInfo = {
                        "lat" : position.coords.latitude,
                        "lng" : position.coords.longitude,
                        "accuracy" : position.coords.accuracy
                    };
                    localStorageService.set(keys[i], geolocInfo);
                    isGeoLocAdded = true;
                }
            }

            if (!isGeoLocAdded) {
                localStorageService.set(JSON.stringify(geolocIdentifier), geolocInfo);
            }
 
            deferred.resolve(true);
          
    };

    this.clearGeoLoc = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                     alert("clearGeoLoc");
                    localStorageService.remove(keys[i]);
                }
        }
        deferred.resolve(false);
    };

    this.getGeoLoc = function () {
        var isGeoLocAdded = false;
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "geoloc") {
                    var localItem  = localStorageService.get(keys[i]);
                    return localStorageService.get(keys[i]);
                }
        }
        return null;
    };

    this.findGeoLoc = function (place) {
            var findGeoLocDeffered = q.defer();
            console.log("find geo loc " + place);
            var res = place.split(" ");
            var url = 'http://maps.google.com/maps/api/geocode/json?address=';
            for (var i = 0; i <= res.length -1; i++) {
                url = url + "+" + res[i];
            };
            console.log("url to call " + url);
            http.get(url).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200 && data.status === "OK") {
                    console.log("Status OK");
                    findGeoLocDeffered.resolve(data.results[0].geometry.location);
                } else {
                   console.log("Status not OK");
                   findGeoLocDeffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                    console.log("Error");
                   findGeoLocDeffered.reject("Error");
              });
            return findGeoLocDeffered.promise;
    }

    this.testPromise = function () {
        var testDef = q.defer();
        var myTimeoutId = setTimeout( function(){
            testDef.resolve("hello");
        }, 2000);
        return testDef.promise;
    }
}]);
/**
 * Created by nignjatov on 27.11.2015.
 */
var OrderService = angular.module('OrderService', []).service('OrderService', ["$rootScope", "$q", "$http", "localStorageService",
    function (rootScope, q, http, localStorageService) {

        this.createOrder = function (order) {
            var deffered = q.defer();

            http.post("order",order).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("createOrder | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("createOrder | Error " + status);
                    deffered.reject(data);
                });

            return deffered.promise;
        }
        this.getOrder = function (orderId) {
            var deffered = q.defer();
            http.get("order/"+orderId).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getOrder | Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }
        this.createOrderItem = function (farmerId,clientId) {
            localStorageService.set(JSON.stringify(
                {
                    "type": "checkout",
                }
            ), {
                "farmerId": farmerId,
                "clientId": clientId,
                "items": [],
                "totalPrice" : "",
                "transportType" : "",
                "transportPrice" : "",
                "address": "",
                "deliveryPeriod": {},
                "currency": rootScope.defaultCurrency,
                "transportCalculated" : false
            });
        }

        this.saveAddress = function(transportType,address,transportPrice,predefinedLocation) {
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.address = address;
                    localItem.transportType = transportType;
                    localItem.transportPrice = transportPrice;
                    localItem.predefinedLocation = predefinedLocation;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.savePriceCalculatePrice = function(flag){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.transportCalculated = flag;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }
        this.saveItems = function(items, totalPrice){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.items = items;
                    localItem.totalPrice = totalPrice;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }
        this.saveFarmerTime = function(workHours){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.workHours = workHours;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.saveDeliveryPeriod = function(deliveryPeriod){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.deliveryPeriod = deliveryPeriod;
                    localStorageService.set(keys[i], localItem);
                }
            }
        }

        this.saveClientId = function(clientId){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    localItem.clientId = clientId;
                    localStorageService.set(keys[i], localItem);
                }
            }
            return null;
        }

        this.getOrderData = function (){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    var localItem = localStorageService.get(keys[i]);
                    return localItem;
                }
            }
            return null;
        }

        this.clearOrderData = function (){
            var keys = localStorageService.keys();
            for (var i = keys.length - 1; i >= 0; i--) {
                var identifier = JSON.parse(keys[i]);
                if (identifier.type == "checkout") {
                    localStorageService.remove(keys[i]);
                }
            }
        }
    }]);

var ResourceService = angular.module('ResourceService', []).service('ResourceService', ['$http', function (http) {

	this.getJumbotron = function () {
		
	}

}]);
var SearchService = angular.module('SearchService', []).service('SearchService',
    ["$rootScope", "$q", "$http", "googleDirections", function (rootScope, q, http, googleDirections) {

        this.searchWishListItems = [];

        /*-------------------------- USER OPERATIONS----------------------------*/
        this.getCategories = function () {
            var deffered = q.defer();
            http.get("product_category_first").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getCategories | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getProductsInCategory = function (category) {
            console.log("Search category ".concat(category));
            var deffered = q.defer();
            http.get("product_category/" + category).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getProductsInCategory |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getAllProducts = function () {
            var deffered = q.defer();
            http.get("product").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getAllProducts|Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getFarmers = function () {
            var deffered = q.defer();
            http.get("merchant").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmers |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }


        this.searchFarmers = function (query) {
            console.log("SEARCH FARMER QUERY");
            console.log(query);
            var deffered = q.defer();
            http.post("merchant_search",query).
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("searchFarmers |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getFarmerById = function (id) {
            var deffered = q.defer();
            http.get("merchant/" + id).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerById |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }


        this.getFarmerImage = function (farmerId, imageId) {
            var deffered = q.defer();

            var imgData = {
                document_content: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHgApgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xAA7EAACAQMDAQYEAwcDBAMAAAABAgMABBESITEFBhMiQVFhFHGBkSMyoRVCUrHB4fAHM9FygpLxFiRj/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDBAAFBv/EACURAAICAgIBBAMBAQAAAAAAAAABAhEDIRIxBBMiQVEFFGGBMv/aAAwDAQACEQMRAD8AiaDFNENG6GPNSxQajjFfZ86PAKwxb0u69qsJICrkEGud17V3M4BENSpERwKtLbpktwfw1JGN28hWh6R2bhaIPdo0jH93VgD7Vny+XjxrbK48E8nRimQnnPyqMw54Fb277K25XTA3dsN8tvUMPZ6G2TNyjSOTtgkCpL8hiqyn6mS6MvZWMgKu7YzwKvbO07xwrDCH82/NRXHRrprpyh0Jnw4OcUnW96e/5zKoHkKlkl6r9stlYLh2izvunwW1uTABFq5Geaqbdkius4xxwaJVru7i8Yxq/iPFBfDTk6HjZWHONxUoQ01JjyltNI08F6pjA4FKS41ccVTCF4YCTIA+Ngaij6i8QwV17+tZv1W3cSnrpdls2pj4QaLtoHC6nYj5mqy061FqxJHp2o89TiMBcOn/AEmpywZFqh1lg/kOV44hqd8+1VfVesvAwSADBHJqvn6hGwIcjJ50+XyqrlieQ6tXhPrWjD4qu5Ecmd1UQiXqkzqdU759BVfJqnde9clf5U/uYxgkknFIRFuNgK3qMY/8mZyb7J4I+nJ/ua224xSqHuD6iu0OP9YeX8HCEHzFER24bZSAf51KsZH96k4xkcU7kzOqB3sWGS+M1A0QRtOM1aRTsr5KK3/V5VG4jZtbKwOc42xSLJL5KcYvpjIZruCJNK4iP5RjmrS06h1Ar4VRFA2yMZqKTqELRKnckFePaoY7587qMeVZciclbgaYNJ1yNHaQ3kyrLPcKpPAVQcfM1Bd2/U4yTDJHP76MYptl1KPSFcbe1HDqERPh5rz+U4y6NlRa7KGcdVgc6oZMnG4XUP0qruZboS/jFlYfunat3bypL54PvTbq0tLlgJ0VyOCfKr4/MSfuiRn47a1IwMVxPGdS69IOCd8URJ1NmwEPA3q66pBLbJ3NuFMbbkAcVQG0cHdSM+1bscoZVyaMmTnj9qYM7vI3iJP1rmjI5oo25HlSMNXtfBBt/ILpx86RDeponuKcIK60crAtBpwDcDOKMMI9K6IK7khgQJ7VIIzjiixB7VKsTD0qbmOkAd0fSlVl3HqD9qVL6geI74c54rvw59KuBGqnB0YHrRcUEU8RBaNTnyrI/JosvGszZgqNoTWim6ep3SVNhx60A0G/FUhnTJTwuJUGGl8MpXdt/lVobbPlXRaCneVMVQaKyOPQdjmiEchgRR3wi+v2FOW1UcrmpOUCqczsMwClnJ1Y2AqCe6nlY+LAG2BRDQqoLHwqBkknYCmhUfUwdDgZODwKlHhF2NKU5ID1zRjPec+9R3VwEQSXMqqnK6iKyvXuux37KkFuVijOrW7fnG4yMVkrq/nuVSN5pO4RtKBjwDyfas0/OSlUEUjgbW2ekJ1jp8jyRfExKYzvqYDb1+VG24huY+9t5Y5YzwyMCD9q8xie2jjYXEgktwSWA8Of+4HP0p0fXfgkjisWEUStrGhs77b1NfkckXTVhfjRfR6ibYAZ5pvc+1YL/wCZ3hnhlkVcJtobZA2N/LfY1oukdpI5ruX4lyYZCBDpXOD6fz+1aMf5CMnTVEn47Redxnypwg9qse4rvc1q9YRQARBTxCMe/lRvdbUhH6UjyDqIKIyQKVGiInyrlL6g3BkqwR8ldj7VKscYbAXb1FeXXnbXqsBW3S6jWTGAkcS7D6jYVZ9je03Vpb65TqU4uLUx6w7L4on2AAwNwd6xPMjT6bN88UZ4Bpnce1Vv7bQs2SVCnGWwKmj6smcFvLJOOK5Z6OeKw3uPauiAeYodupYH4SFz6gDH6kVBfdbe1tWkcRB+F5x67n5Vzzg9EsO5HpSMPtWSsO28a9Kvr67d+7hOlW0g7nGCMeW/HtV/2N6jL1js7ZX92pWWZdRyuAd+QPT0ro5uS0CWKtA/aW4S16VcxsQsk0EoT56f71lul9RuLOxuZYni1xWx0mVvCN1wTk+nl70Z/qTfbm2C/wCwykHH5g6tn7EfrWch7VWvSLESSW8V1N3UaaZhlFwATkfQVDJNuQyjSM1eXHxt87l3VXyWdV8tyP5edMSdAWtzHt+ZsnxD5itQnZjq3aCWW96W6WHT7xUlZLgsupsZxpHIBJx5bjzzRL/6bXMMks0/UIO4ePu2iiibIXIJOc+ikcedTjEpVnncl2rRLG7FiNQ076SPU/aobeSBFJEexABX0Jq5uOzdk9w4huJoQrMuGAb29qr73py9MhWQ3KTo7hdIQqeM7j6VzX0cR30g8BZtQJJVTwvrn1o7o3V+7cd8URFXKkZBznaqp5IJ4h3xZlVyFOM/f2qeHpF9IGEHcBX3wXO3pnbak4poFWfQ/Q5v2j0ezvMYaWIMR70aBGZGiDAyJjUPTPFeWdiOuP2b+JtbhJbmOQAoiSglCBvzgYrZdC6+l31WfvImhMis+HI9RpGfl51pWeqTYjhXZou6z+6PtTlhzwBWZve2cdhK8envO80yQNnIMZ2+4INOHb+ykjGiCTvirHTyAc7b/LNd+zH7OUUaqODbJxSrzLq/+od2ZWQQGOItqQwkawBsAcke/wBqVSflK9B0ed2vdxxR92PzYJPrn3rTdmLswfFd0XEkmlVx5DxZrOQ2MsE3/wB4zpxjXDjGM8jOfTypp65L06aMdPm0IQSWmthpLZ+eSAc8edHnF9MrR6VBmEBVPjHO55pza9OpSdS+IEeY/wA/rXncXbTrQk0yLaPhT4Y4yAfP+I1Ynt1cRRjvbCB3yNopSNI8xuDvRoB6D0y9S4UI5VZeCSBn9f51X9r7qKLpUgDfhEiPVnkkjPz2zWNn7WQTFX/Zjg8hopRkfoKH6p1pOtxRW8trIVjxIQ0qgMTkDbT6UrTaoKdMKvJA3Za7EGnxTx6Rk7gA+EfQVp/9L+pv0rot5fdoOpTRWQYRQ20yse7I5IzwPEBgemazPZaOTqcNx0+C3Ki0uEuFkMu6nBULx5aT960t/wBDvOpxSRXyCZnlMoleXxoSoXG37uFU49RWaXkRxPjezpe52N/1JNn1BF6p0ucyiPHeYbIOcYwB/m9Y22hurVku1gElzGo7pGgDAHPJUjBx8v5Vo7jonUbO3MHT+ntIrkd6e8UB9uQC21RLY9cjkTT0JnGkBszRgD1xzSLyVJ9g6Ke47b9rnkkX9pTRLHjJWCLAz5HwbU237T9oblx8V1q6MTbEBo1z8wBmiz0LqIu55z0C4d5juSyEbbZxkVBH0DqqsGPR7lNW40su361VeTB/IykOubi6ilhKRgxzXXdknHnn7UF1cxuDB1JWh7qYnSvtkf8ANaKfonUOoPDJc2pght3EiKxBZyPXB4NVN90Trdx8Q/w02qTPgbSQfbnaun5GNas6qKOPpEPUuo2NtbSyCF5tMuMZC+ZH0Br02Tp/RJrS76fbwG1m6ZGpWUALlnGpRnPiycZB5J9axvReidYsk76PpjRXmTpkdxpGR6ZrVWL9dSOQy29jHPLgSSEliwHGdvKl/bxx+ReWzOQXlubeOcw+MA5BDIRsCc4Y45G3NBt1xZ7h2s4SzRoBqBwpGTjb6n/AKuurdCaWO4uHuQsmnEcESHSM4z5f5iqVukrFbhPj0iCLkK0bnW3vtzUVkxy3Yjewiy/EkWaTXscOo3I/t/WuXZW1J+FRjbsMnJ9fXO/rVZad7DcKBJHIukoDrI42zg45xtU1zPPAjyu0UojOV04zufL/ADFI0+egBNzOojUTaME5C6gfr9a5WR6h1KWaZ5FDKhb8pO/txXK0LBrZ3E9nvLgQ2dxJGPxFiZl+YG1eX9bjjden2sNsySNDEIpNQKykgFjjfTud/ua2j9SjzuMis/3VxBGFtFhk7tswrJkaRnIB23539dvSsXiS4Nl4yV7KL9h3+idRd28M0BCSRNraRjgZA0g+uPnQbwXsUaNKvhyRvG6jX6eLnG/24rX2V31XptmIIQudTO7ebMxyT/ntVZeS30kjTOjKSxdmQ48RABPzwBvW6HkSbd9HKmyskDQMspWQWhJKPOBnAx5jYHn9KKtOqwWt3JD8H3z+ECV5QqhcbHHrvStJ4baQPPaiVdXhhcArv7eZ4q16dcTIyd3aKq6R3qHdXIPI9DjK/KneZx+B58dGm7HNFBcLLAi6b2NjMNQJWRDkAYzsdTVrjKM+nzOK8+tYreWd5eo2lvMxUKid2ML6n3YnBJ9uOc2wFrGPwTdW54/DncKB8icfpXlZ+M53YtxNWs+Pyn7UhKzbnaswktwBiDq8re1xEjAfUBTip/i+qDGfgJhjdkleL7DDfzrO8bfTGtGhWR+NePrXDNKPD7/xVnJO0aWjKt3DIG4GhkfPl5HPPtRtn1iC9jb4cOCu/jRlO/zoSxzirZ1lsZn5ZyPrTWfWuQc/MUCJgyZxnPJIpLlTreQIvGdwamAKLKR4gf8AxqNnXbG59xxUDTRjAjkBJ9aW5Qlyc84Boi0TB9/yqflXS6Y8cePmgoRwVJAdfYahTASMZZhngsuc/aiAKZLduYoj68ULLY2D5Z7OA+h7sUxpGHntwNqYdYH59vnTJnWvoZ8H08HPwcK5/wDzrtQuWIHjX65pU1v7F/wrFt2B8a7fep47NHAypwPWuxXAUePOfbbFceVyuY5MKOdhTuxrRJDaINjpGT6UR8LGANIAJ9sUNC7Z8ca5G+vP9qJQsF1pjfbmldhTHC2jz4hGD9K6bZc7Kgx5kAUu+CEZTPqAc/8AqpUuI22BUEeRXFK2/sLpjEgBPEQJ4OTXUjXSToj5xyd6UxiX8RnAXzIHP6Zp0c6IWDRAIOM0LBxHJEozhAfXBxTgyhgiqV1DnNRtdR6cTKqZOAucfyFDNdSd4NCkQ/xA6s/Qf1ocbA9B7PHHp1aSTtnzNdWTBbQcewxQcdwAdSlsZ2TRv86nCqRsdyRk85obCtj2kZxz4h57U1Z2HHebcBjpBqRViVfDkg8nzpjxheFIHlkHNdR1Maut28acncKaUjRONLxrtwCcUyXUhyuonHsB/amSkmNXIVuNjjb60QDlkCPjSQRwQalllTSG/F2/hwKClkQ5R5MNxgnG9dAlxg+R28VG0C2SSXCLgBsKf3jSMgbduOPzZoJhIA2UCAZ3U6qfC6AjUyqM53XJH/FGhbdk+tlzrVDg4zpVs1yoGde8bOGGTjPP6Uqag7II5QrDL4k8xo4qRimQ2Ax8h5GlSp2P2LWjA6mA8X5eP708zFzmMaSPbOa5SpWBd0OZioDHxOPzbAf3p5nlKE6SvoVOM0qVTbBJEPfM+Ymk1MTv4icfWpUeYAK0jHf9470qVGWhY/Y98Rkyfh6zzqX/AIqSOaLQq4Cs22Qh/rSpUK0Fypk4kjEWS2hVXzP5vtUE8sJaNi3hUjGGJIP+f1pUqKiO5MOt5IZUPdFwBzlcfr51C1xDEw1hSxJAYLn/AA0qVCrdDXqxve22vUXX8QZAKVLhdP4i6V2y2PCaVKuoCdkP+7KQhfSoBAZdj9eKjaQpqJVtIG5bA39KVKhWwtJbBe+D6i0RU42Yb/rTQQjDVKpYjABG9KlVWq6ESTOOivgvEpPmckf0pUqVJbDxP//Z"
            };
            imgData.index = farmerId;
            deffered.resolve(imgData);
            // http.get("merchant/" + id+"/images/"+imageId+"imagefile").
            // http.get("product/1/images/10/imagefile").
            //     success(function (data, status) {
            //         if (status == 200) {
            //             deffered.resolve(data);
            //         } else {
            //             console.log("getFarmerById |Status not OK " + status);
            //             deffered.reject("Error");
            //         }
            //
            //     }).
            //     error(function (data, status) {
            //         console.log("Error " + status);
            //         deffered.reject("Error");
            //     });

            return deffered.promise;
        }

        this.getFarmerProducts = function (farmerId) {
            var deffered = q.defer();
            http.get("merchant/" + farmerId + "/products").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerProducts |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }
        this.getProductImage = function (productId,imageId) {
            var deffered = q.defer();
            http.get("product/" + productId + "/images/"+imageId+"/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerProducts |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getWishlistProductImage = function (productId,imageId,wishlistItemId) {
            var deffered = q.defer();
            http.get("product/" + productId + "/images/"+imageId+"/imagefile").
                success(function (data, status) {
                    if (status == 200) {
                        data.index = productId;
                        data.wishlistIndex = wishlistItemId;
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerProducts |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }


        this.getFarmerOrders = function (farmerId) {
            var deffered = q.defer();
            http.get("merchant/" + farmerId + "/orders").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getFarmerProducts |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getCurrencies = function () {
            var deffered = q.defer();

            http.get("currency").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getCurrencies | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getCurrencies | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getMeasurementUnits = function () {
            var deffered = q.defer();

            http.get("measurement_unit").
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getMeasurementUnits | Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("getMeasurementUnits | Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getSearchedItems = function (farmerId) {
            return this.searchWishListItems;
        }

        this.setSearchedItems = function (items) {
            this.searchWishListItems = items;
        }

        this.getDistances = function () {
            return [
                {
                    value: "10 km",
                    num : 10
                },
                {
                    value: "20 km",
                    num : 20
                },
                {
                    value: "50 km",
                    num : 50
                },
                {
                    value: "100 km",
                    num : 100
                }
            ]
        }

        this.getClientById = function (id) {
            var deffered = q.defer();
            http.get("client/" + id).
                success(function (data, status) {
                    if (status == 200) {
                        deffered.resolve(data);
                    } else {
                        console.log("getClientById |Status not OK " + status);
                        deffered.reject("Error");
                    }

                }).
                error(function (data, status) {
                    console.log("Error " + status);
                    deffered.reject("Error");
                });

            return deffered.promise;
        }

        this.getBuyerOrders = function (buyerId) {
            var deffered = q.defer();
            http.get("client/" + buyerId + "/orders").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getBuyerOrders |Status not OK " + status);
                      deffered.reject("Error");
                  }

              }).
              error(function (data, status) {
                  console.log("Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getCities = function(){
            var deffered = q.defer();
            http.get("city").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getCities |Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("getCities | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getDistanceBetweenCities = function(originCity, destinationCity){
            console.log(originCity + " - "+destinationCity);
            var deffered = q.defer();
            var args = {
                origin: originCity.toString(),
                destination: destinationCity.toString(),
                travelMode: 'driving',
                unitSystem: 'metric'
            }
            googleDirections.getDirections(args).then(function(directions) {
                if(directions === undefined || directions.routes.length < 1 || directions.routes[0].legs.length < 1){
                    deffered.reject("Error");
                }
                else {
                    var distanceMeters = directions.routes[0].legs[0].distance.value;
                    console.log("Distance between places: " + (distanceMeters/1000) + " km");
                    deffered.resolve(distanceMeters/1000);
                }
                console.log(directions);
            }).catch(function(err){
                deffered.reject(err);
            });

            return deffered.promise;
        }

        this.getLocationByAddress = function(address) {
            console.log(address);
            var deffered = q.defer();
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { "address": address }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var location = results[0].geometry.location;
                    deffered.resolve(location.toJSON());
                }
                else {
                    deffered.reject("Error");
                }
            });
            return deffered.promise;
        }

        this.getMostProfitFarmers = function () {
            var deffered = q.defer();
            http.get("merchant_most_profit").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getMostProfitFarmers |Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("getMostProfitFarmers | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getMostOrdersFarmers = function () {
            var deffered = q.defer();
            http.get("merchant_most_orders").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getMostOrdersFarmers |Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("getMostOrdersFarmers | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getMostProductsFarmers = function () {
            var deffered = q.defer();
            http.get("merchant_most_products").
              success(function (data, status) {
                  if (status == 200) {
                      deffered.resolve(data);
                  } else {
                      console.log("getMostProductsFarmers |Status not OK " + status);
                      deffered.reject("Error");
                  }
              }).
              error(function (data, status) {
                  console.log("getMostProductsFarmers | Error " + status);
                  deffered.reject("Error");
              });

            return deffered.promise;
        }

        this.getPredefinedLocations = function(){
            var deffered = q.defer();
            http.get("delivery_place").
            success(function (data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                    console.log("getPredefinedLocations |Status not OK " + status);
                    deffered.reject("Error");
                }
            }).
            error(function (data, status) {
                console.log("getPredefinedLocations | Error " + status);
                deffered.reject("Error");
            });

            return deffered.promise;
        }
    }]);


/**
 * Created by nignjatov on 20.11.2015.
 */
var UserService = angular.module('UserService', []).service('UserService',
  ["$rootScope", "$q", "$http", "localStorageService", function (rootScope, q, http, localStorageService) {

    /*-------------------------- USER OPERATIONS----------------------------*/
    this.registerUser = function (user) {
      var deffered = q.defer();
      http.post("user", user).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("registerUser | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.getUserIdFromIDMId = function (idmId, role) {
      var deffered = q.defer();
      http.get("user/" + idmId + "/userForRole/" + role).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("getUserIdFromIDMId | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.getUserData = function (userId) {
      var deffered = q.defer();
      http.get("client/" + userId).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("getUserData | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.getUserPreviousDeliveryAddress = function (userId) {
      var deffered = q.defer();
      http.get("client/" + userId + "/previousDelivery").
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("getUserPreviousDeliveryAddress | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("getUserPreviousDeliveryAddress | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.sendForgotPasswordEmail = function (destEmailData) {
      var deffered = q.defer();
      http.post("passwordChangeToken", destEmailData).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("sendForgotPasswordEmail | Status not OK " + status);
            deffered.reject("Error");
          }
        }).
        error(function (data, status) {
          console.log("sendForgotPasswordEmail | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.resetPassword = function (newPassData) {
      var deffered = q.defer();
      http.post("resetPassword", newPassData).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("resetPassword | Status not OK " + status);
            deffered.reject("Error");
          }
        }).
        error(function (data, status) {
          console.log("resetPassword | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.activateUser = function (token) {
      var deffered = q.defer();
      http.get("confirmUser/" + token).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("activateUser | Status not OK " + status);
            deffered.reject("Error");
          }
        }).
        error(function (data, status) {
          console.log("activateUser | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.updateBuyerGeneralInfo = function (buyerId, info) {
      var deffered = q.defer();

      http.put("client/" + buyerId, info).
        success(function (data, status) {
          if (status == 200) {
            console.log("updateBuyerGeneralInfo | Status OK " + status);
            deffered.resolve(data);
          } else {
            console.log("updateBuyerGeneralInfo | Status not OK " + status);
            deffered.reject("Error");
          }

        }).
        error(function (data, status) {
          console.log("updateBuyerGeneralInfo | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }

    this.storeUserCredentials = function (token, id, role) {
      if (localStorageService.cookie.isSupported) {
        localStorageService.cookie.clearAll();
        localStorageService.cookie.set("role", role, 1);
        localStorageService.cookie.set("id", id, 1);
        localStorageService.cookie.set("token", token, 1);
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.storeUserDeliveryAddresses = function (id, address) {
      if (localStorageService.cookie.isSupported) {
        localStorageService.cookie.set("addresses" + id, JSON.stringify(address), 1);
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.getUserDeliveryAddress = function (id) {
      if (localStorageService.cookie.isSupported) {
        return localStorageService.cookie.get("addresses" + id);
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.logoutUser = function () {
      if (localStorageService.cookie.isSupported) {
        return localStorageService.cookie.clearAll();
      } else {
        console.error("Cookies not supported in this browser!");
      }
    }

    this.getUserCredentials = function () {
      if (localStorageService.cookie.isSupported) {
        return {
          role: localStorageService.cookie.get("role"),
          id: localStorageService.cookie.get("id"),
          token: localStorageService.cookie.get("token")
        }
      } else {
        console.error("Cookies not supported in this browser!");
        return null;
      }
    }

    this.getDefaultLanguage = function () {
      var keys = localStorageService.keys();
      for (var i = keys.length - 1; i >= 0; i--) {
        var identifier = JSON.parse(keys[i]);
        if (identifier.type == "lang") {
          var lang = localStorageService.get(keys[i]);
          return lang.language;
        }
      }
      return null;
    }

    this.storeDefaultLanguage = function (langCode) {
      localStorageService.set(JSON.stringify(
        {
          "type": "lang",
        }
      ), {
        "language": langCode
      });
    }


    this.postOrderReview = function (clientId, orderId, reviewData) {
      var deffered = q.defer();
      http.post("client/" + clientId + "/orders/" + orderId + "/review", reviewData).
        success(function (data, status) {
          if (status == 200) {
            deffered.resolve(data);
          } else {
            console.log("postOrderReview | Status not OK " + status);
            deffered.reject("Error");
          }
        }).
        error(function (data, status) {
          console.log("postOrderReview | Error " + status);
          deffered.reject("Error");
        });

      return deffered.promise;
    }


  }]);
var WishlistService = angular.module('WishlistService', []).service('WishlistService',
    ['localStorageService','CartService', function (localStorageService,CartService) {

    this.putInWishlist = function (productId, productName, productMeasure, productPrice, productImage, farmerId, farmerName, farmerLocation, farmerEMail) {
        var keys = localStorageService.keys();
        var added = false;
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.farmerId == farmerId && identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                var localItem = localStorageService.get(keys[i]);
                localItem.items.push({
                    "itemName": productName,
                    "itemPrice": productPrice,
                    "itemMeasure": productMeasure,
                    "itemId": productId,
                    "image": productImage
                });
                localStorageService.set(keys[i], localItem);
                added = true;
                return;
            }
        }
        ;
        if (!added) {
            localStorageService.set(JSON.stringify(
                {
                    "type": "wishlist",
                    "farmerId": farmerId,
                    "farmer": farmerName,
                    "farmerLocation": farmerLocation,
                    "farmerEMail": farmerEMail
                }
            ), {
                items: [{
                    "itemName": productName,
                    "itemPrice": productPrice,
                    "itemMeasure": productMeasure,
                    "itemId": productId,
                    "image": productImage
                }]
            });
        }
    }

    this.removeFromWishList = function (productId, farmerId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.farmerId == farmerId && identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        localItem.items.splice(j, 1);
                        if (localItem.items.length == 0) {
                            localStorageService.remove(keys[i]);
                        } else {
                            localStorageService.set(keys[i], localItem);

                        }
                    }
                }
            }
        }
    }

    this.itemInWishlist = function (farmerId, productId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist" && identifier.farmerId == farmerId) {
                var localItem = localStorageService.get(keys[i]);
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    this.resetWishlist = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                localStorageService.remove(keys[i]);
            }
        }
        ;
    }

    this.getItemsSize = function () {
        var itemsNum = 0;
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                itemsNum += localItem.items.length;
            }
        }
        return itemsNum;
    }

    this.getItems = function () {
        var keys = localStorageService.keys();
        var items = [];
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist") {
                var localItem = localStorageService.get(keys[i]);
                items.push({
                    farmer: identifier,
                    products: localItem
                });
            }
        }
        return items;
    }

    this.canBeAddedToCart = function (farmerId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "cart" && identifier.farmerId != farmerId) {
                return false;
            }
        }
        ;
        return true;
    }

    this.toCart = function (productId, farmerId) {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
            var identifier = JSON.parse(keys[i]);
            if (identifier.type == "wishlist" && identifier.farmerId == farmerId) {
                var localItem = localStorageService.get(keys[i]);
                var addItem = null;
                for (var j = 0; j < localItem.items.length; j++) {
                    if (localItem.items[j].itemId == productId) {
                        addItem = localItem.items[j];
                        localItem.items.splice(j, 1);
                        if (localItem.items.length == 0) {
                            localStorageService.remove(keys[i]);
                        } else {
                            localStorageService.set(keys[i], localItem);

                        }
                    }
                }
                if(addItem != null) {
                    CartService.putInCartAmmount(productId, addItem.itemName, addItem.itemMeasure, addItem.itemPrice,
                        addItem.image, identifier.farmerId, identifier.farmer, identifier.farmerLocation,
                        identifier.farmerEMail, 1);
                }
            }
        }
    }
}]);
