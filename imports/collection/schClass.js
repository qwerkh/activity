export const Sch_Class = new Mongo.Collection('sch_class');

Sch_Class.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        index:true
    },
    khName: {
        type: String,
        label: "Khmer",
        optional: true
    },
    code: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    teacherId: {
        type: String,
        optional: true
    },
    levelId: {
        type: String
    },
    timeId: {
        type: String
    },
    classDate: {
        type: Date
    },
    classDateName: {
        type: String
    },
    status: {
        type: Boolean
    },
    charge: {
        type: Number,
        decimal: true
    },
    rolesArea: {
        type: String,
        label: "Role Area",
        index:true,
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
        index:true
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

Sch_Class.attachSchema(Sch_Class.schema);

export const Sch_ClassReact = new Mongo.Collection('sch_classReact');
Sch_ClassReact.schema = new SimpleSchema({
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

Sch_ClassReact.attachSchema(Sch_ClassReact.schema);