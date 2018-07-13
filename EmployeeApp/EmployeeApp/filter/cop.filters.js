angular.module('cop.filters', [])

    .filter('numberPad', function () {
        return function (input, places) {
            var out = "";
            if (places && !angular.isUndefined(input)) {
                var placesLength = parseInt(places, 10);
                var inputLength = input.toString().length;

                for (var i = 0; i < (placesLength - inputLength) ; i++) {
                    out = '0' + out;
                }
                out = out + input;
            }
            return out;
        };
    })

    .filter('dateOnlyFormat', function () {
        return function (utcDateString) {
            var out = "";
            if (!angular.isUndefined(utcDateString) && utcDateString != null && utcDateString.substring(0, 4) != "0001") {
                out = moment(utcDateString).format('DD MMM YYYY');
            }
            return out;
        };
    })
    .filter('localDateFormat', function () {
        return function (utcDateString) {
            var out = "";
            if (!angular.isUndefined(utcDateString) && utcDateString != null && utcDateString.substring(0, 4) != "0001") {
                out = moment(utcDateString).local().format('DD MMM YYYY');
            }
            return out;
        };
    })
    .filter('localDateTimeFormat', function () {
        return function (utcDateString) {
            var out = "";
            if (!angular.isUndefined(utcDateString) && utcDateString != null && utcDateString.substring(0, 4) != "0001") {
                out = moment(utcDateString).local().format('DD MMM YYYY HH:mm');
            }
            return out;
        };
    })