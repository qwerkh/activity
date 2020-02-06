import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {WB_waterBillingSetup} from "../imports/collection/waterBillingSetup"
import {LoginSetup} from "../imports/collection/loginSetup";
import {Manage_Module} from "../imports/collection/manageModule";
//Water Billing setup
Meteor.publish('wb_waterBillingSetup', function () {
    if (this.userId) {
        return WB_waterBillingSetup.find({});
    }
    return this.ready();

});

//Login Setup
Meteor.publish('loginSetup', function () {
    return LoginSetup.find({});

});
//Login Setup
Meteor.publish('manageModule', function () {
    return Manage_Module.find({});

});

