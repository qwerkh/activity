export const Sch_Document = new Mongo.Collection('sch_document');

Sch_Document.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    },
    date: {
        type: Date,
        label: "Date",
        optional: true
    },
    dateName: {
        type: String,
        label: "Date",
        optional: true
    },
    receivedDate: {
        type: Date,
        label: "Date",
        optional: true
    },
    receivedDateName: {
        type: String,
        label: "Date",
        optional: true
    },
    documentType: {
        type: String,
        label: "Document Type",
    },
    link: {
        type: [Object],
        label: "Link",
        blackbox: true

    },
    "link.fileName": {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index: true,
        optional: true
    },
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        },
        index: true
    },
    updatedAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return moment().toDate();
            }
        }
    },
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return Meteor.userId();
            }
        }
    }
});

Sch_Document.attachSchema(Sch_Document.schema);

export const Sch_DocumentReact = new Mongo.Collection('sch_documentReact');
Sch_DocumentReact.schema = new SimpleSchema({
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return moment().toDate();
            }
        }
    },
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return Meteor.userId();
            }
        }
    },
    id: {
        type: String
    }
});

Sch_DocumentReact.attachSchema(Sch_DocumentReact.schema);