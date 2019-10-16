System.register(["./controllers/app.controller"], function (exports_1, context_1) {
    "use strict";
    var app_controller_1, app;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (app_controller_1_1) {
                app_controller_1 = app_controller_1_1;
            }
        ],
        execute: function () {
            // Create instance of application
            app = new app_controller_1.AppController();
            app.init();
        }
    };
});
