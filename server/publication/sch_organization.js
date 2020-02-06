import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_OrganizationReact} from "../../imports/collection/schOrganization";

Meteor.publish('Sch_OrganizationReact', function () {
    if (this.userId) {
        return Sch_OrganizationReact.find({});
    }
    return this.ready();

});
