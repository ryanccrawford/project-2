var apiKey = '1234f1b93e4b78224a19eedee0272692';
var GoogleMapsAPIKEY = 'AIzaSyDL1_5ivirgQ-DQq60BKvzNclzY_7EUTO8';
const request = require("request");
const endpoint = 'http://api.ipstack.com/';



module.exports = function (app) {

    app.get("/api/geolocate/:ipaddress", function (req, res) {

        var ip = req.params.ipaddress;

        geolocate(ip);

        function geolocate(ipadd) {

            var uri = `${endpoint}/${ipadd}?access_key=${apiKey}&format=1`;
            console.log(uri);

            request(uri, function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                if (response && response.statusCode) {
                    var locationObj = JSON.parse(body)
                    var locationCord = {
                        latitude: locationObj.latitude,
                        longitude: locationObj.longitude
                    }

                    res.json(locationCord);

                }

            });
        }

    });

    app.get("/api/getzipfromlatlog/:lat/:long", function (req, res) {


        var lattitude = req.params.lat;
        var longitute = req.params.long;
        var geoLocation = { lat: lattitude, long: longitute }
        reverseGeoLocate(geoLocation);

        function reverseGeoLocate(latlong) {
            var googleEndPoint = 'https://maps.googleapis.com/maps/api/geocode/json'
            var uri = `${googleEndPoint}?latlng=${latlong.lat},${latlong.long}&key=${GoogleMapsAPIKEY}`
            console.log(uri);

            request(uri, function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                if (response && response.statusCode) {
                    var zip_code = "";
                    var results = JSON.parse(body.results)
                    var components = results[0].address_components
                    components.forEach(function (item) {
                        item.types.forEach(function (part) {
                            if (part === 'postal_code') {
                                zip_code = item.short_name
                            }
                        })
                    })

                    res.json({ zip: zip_code });

                }

            });
        }

    });

    app.get("/api/getzipfromip/:ipaddress", function (req, res) {

        var ip = req.params.ipaddress;

        locate(ip);

        function locate(ipadd) {

            var uri = `/api/geolocate/${ipadd}`;
            console.log(uri);

            request(uri, function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                if (response && response.statusCode) {
                    var locationObj = JSON.parse(body)
                    getzipcode(locationObj)
                    function getzipcode(lo) {
                        var lat = lo.lat
                        var long = lo.long
                        var uri = `/api/getzipfromlatlog/${lat}/${long}`;
                        console.log(uri);

                        request(uri, function (error, response, body) {
                            if (error) {
                                console.log(error)
                            }
                            if (response && response.statusCode) {
                                var obj = JSON.parse(body)

                                alldone(obj.zip)

                            }

                        });

                    }

                }

            });
        }

    });

    function alldone(zip) {
        console.log(zip)
    }
}