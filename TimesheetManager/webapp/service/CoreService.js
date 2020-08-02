sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {
    "use strict";

    var Service = Object.extend("cap.trello.TimesheetManager.service.CoreService", {
        constructor: function () { },

        http: function (url) {
            var core = {
                ajax: function (method, url, headers, args, mimetype) {
                    var promise = new Promise(function (resolve, reject) {
                        var client = new XMLHttpRequest();
                        var uri = url;
                        if (args && method === 'GET') {
                            uri += '?';
                            var argcount = 0;
                            for (var key in args) {
                                if (args.hasOwnProperty(key)) {
                                    if (argcount++) {
                                        uri += '&';
                                    }
                                    uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                                }
                            }
                        }
                        if (args && (method === 'POST' || method === 'PUT')) {
                            var data = {};
                            for (var keyp in args) {
                                if (args.hasOwnProperty(keyp)) {
                                    data[keyp] = args[keyp];
                                }
                            }
                        }
                        client.open(method, uri);
                        if (method === 'POST' || method === 'PUT') {
                            client.setRequestHeader("accept", "application/json");
                            client.setRequestHeader("content-type", "application/json;charset=UTF-8;IEEE754Compatible=true");
                        }

                        for (var keyh in headers) {
                            if (headers.hasOwnProperty(keyh)) {
                                client.setRequestHeader(keyh, headers[keyh]);
                            }
                        }
                        if (data) {
                            client.send(JSON.stringify(data));
                        } else {
                            client.send();
                        }
                        client.onload = function () {
                            if (this.status === 200 || this.status === 201 || this.status === 204) {
                                resolve(this.response);
                            } else {
                                reject(this.statusText);
                            }
                        };
                        client.onerror = function () {
                            reject(this.statusText);
                        };
                    });
                    return promise;
                }
            };

            return {
                'get': function (headers, args) {
                    return core.ajax('GET', url, headers, args);
                },
                'post': function (headers, args) {
                    return core.ajax('POST', url, headers, args);
                },
                'put': function (headers, args) {
                    return core.ajax('PUT', url, headers, args);
                },
                'delete': function (headers, args) {
                    return core.ajax('DELETE', url, headers, args);
                }
            };
        }
    });
    return Service;
});
