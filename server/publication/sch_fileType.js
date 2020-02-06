import {Meteor} from 'meteor/meteor';
import {publishComposite} from 'meteor/reywood:publish-composite';
import {Sch_FileTypeReact} from "../../imports/collection/schFileType";

Meteor.publish('Sch_FileTypeReact', function () {
    if (this.userId) {
        return Sch_FileTypeReact.find({});
    }
    return this.ready();

});
