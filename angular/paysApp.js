var paysApp = angular.module("paysApp", ['ngRoute', 'ngCookies', 'ngAnimate', 'LocalStorageModule',
  'GeoLocationService', 'CartService', 'WishlistService', 'SearchService', 'DistributorService', 'FarmerService', 'UserService', 'OrderService',
  'ui-rangeSlider', 'cgBusy', 'brantwills.paging', 'pascalprecht.translate', 'ui.bootstrap', 'ui-notification', 'flow', 'monospaced.qrcode'])
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
  }).
  config(['flowFactoryProvider', function (flowFactoryProvider) {
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
  });

paysApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('paysApp');
});


paysApp.run(function ($rootScope, $translate, $location, $window, $filter, Notification, SearchService, UserService) {

  $rootScope.englishLangCode = "en_EN";
  $rootScope.serbianLangCode = "rs_RS";

  $rootScope.currentLang = $rootScope.englishLangCode;

  $rootScope.translate = function (lang) {
    $rootScope.currentLang = lang;
    $translate.use(lang);
  };

  $rootScope.translate($rootScope.currentLang);

  $rootScope.lastPage            = "#/";
  $rootScope.credentials         = UserService.getUserCredentials();
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
  $rootScope.paysEMail           = 'office@pays-system.com';
  $rootScope.paysPhone           = '+38121455071';
  $rootScope.showFooter          = false;
  $rootScope.buyerUserType       = 'C';
  $rootScope.farmerUserType      = 'F';
  $rootScope.distributorUserType = 'T';
  $rootScope.bannerPicsLimit     = 5;

  $rootScope.range = function (n) {
    return new Array(n);
  };


  $rootScope.transportDistances = [
    0, 20, 40, 60, 80, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500
  ];
  $rootScope.transportWeights   = [
    0, 5, 10, 15, 20, 30, 40, 50, 65, 80, 100, 150, 200, 300, 400, 500
  ];

  $rootScope.paysEMail = 'office@pays-system.com';

  $rootScope.serverURL       = "http://185.23.171.43/PEP/PaysRest/";
  $rootScope.serverImagesURL = "http://185.23.171.43/PaysImages/";

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

  $rootScope.getMeasureUnitObjectFromCode = function (code) {
    var retVal = {};
    angular.forEach($rootScope.measures, function (measure) {
      if (measure.code === code) {
        retVal = measure;
      }
    });
    return retVal;
  };

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
    TITLE_11: 'Only marketplace for selling and buying fresh goods firectly from farmers',
    TITLE_2: 'Direct from farmers',
    TITLE_22: 'Choose among variety of products and find find best price for yourself',
    TITLE_3: 'Find best farmer',
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
    PIB_NUMBER: "Company identification number",
    INVALID_CREDENTIALS: "Invalid credentials",
    HELP: "Help",
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
    TAX_NUMBER: "Tax number",
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
    NO_ORDER_CREATED: "You haven't created your order yet. Please visit Cart overview page and create order.",
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
    CREATED : 'Created',
    ACTIVE : 'Active',
    TRANSPORT : 'In transport',
    DELIVERED : 'Delivered',
    PAID : 'Paid',
    GENERATE_QR : 'Generate QR code',
    NUMBER_OF_PACKAGES : 'Number of packaged',
    ENTER_NUMBER_OF_PACKAGES : 'Please enter number of packages for order',
    SEND_ORDER : 'Send order',
    ORDER_STATUS_TRANSPORT : 'Order status changed to - In transport',
    NOT_ORDER_STATUS_TRANSPORT : 'Unable to change order status to - In transport'
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
      TITLE_11: 'Jedina online prodavnica svežih proizvoda direktno od farmera',
      TITLE_2: 'direktno od proizvođača',
      TITLE_22: 'Izaberite između mnoštva proizvoda pod najboljom cenom',
      TITLE_3: 'Pratite naš blog',
      TITLE_33: 'Nađite najboljeg farmera za Vas koristeći naše preporuke',
      ADVERTISING_MSG: 'PAYS sistem je osmišljen da olakša kupovinu svežih namirnica. Kupci mogu izabrati farmera iz proizvode koje žele da naruče. Takođe, dobijanje najniže cene i najbržeg transporta se podrazumeva',
      ORDER: 'Narudžbina',
      ORDER_DATA_SUFFIX: 'Podaci za dostavu Vaše narudžbine',
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
      PIB_NUMBER: "PIB",
      INVALID_CREDENTIALS: "Nepostojeći korisnik",
      HELP: "Pomoć",
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
      DISTRIBUTOR_NAME: "Naziv distributora",
      FARMER_NAME: "Naziv farmera",
      NAME: "Ime",
      SURNAME: "Prezime",
      TAX_NUMBER: "Poreski broj",
      BUSSINESS_ACT_NUMBER: "Broj preduzetnika",
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
      ORDERS: "Porudžbine",
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
      NO_ORDER_CREATED: "Porudžbina još nije kreirana. Molimo Vas posetite stranicu Pregled korpe i kreiranje porudžbinu.",
      FROM: "Od",
      TO: "Do",
      ORDER_CREATED: "Narudžbina uspešno kreirana!",
      ORDER_NOT_CREATED: "Bezuspešno kreiranje narudžbine!",
      NO_IMAGE_PROVIDED: "Nepostojeća slika",
      VEHICLE_IMAGE_UPLOADED: "Postavljena nova slika vozila",
      VEHICLE_IMAGE_FAILURE: "Neuspešno postavljanje nove slike vozila",
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
      CREATED : 'Kreirana',
      ACTIVE : 'Aktivna',
      TRANSPORT : 'U transportu',
      DELIVERED : 'Dostavljena',
      PAID : 'Plaćena',
      GENERATE_QR : 'Generiši QR kod',
      NUMBER_OF_PACKAGES : 'Brok paketa',
      ENTER_NUMBER_OF_PACKAGES : 'Molimo unesite broj paketa u porudžbini',
      SEND_ORDER : 'Pošalji porudžbinu',
      ORDER_STATUS_TRANSPORT : 'Stanje narudžbine promenjeno u - U transportu',
      NOT_ORDER_STATUS_TRANSPORT : 'Neuspela promena stanja narudžbine'
    })
  $translateProvider.preferredLanguage('en_EN');
});
