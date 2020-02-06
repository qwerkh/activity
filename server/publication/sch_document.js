import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_DocumentReact} from "../../imports/collection/schDocument";

Meteor.publish('Sch_DocumentReact', function () {
    if (this.userId) {
        return Sch_DocumentReact.find({});
    }
    return this.ready();

});
