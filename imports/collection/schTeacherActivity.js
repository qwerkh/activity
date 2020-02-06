export const Sch_TeacherActivity = new Mongo.Collection('sch_teacherActivity');

Sch_TeacherActivity.schema = new SimpleSchema({
    teacher: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    "teacher.teacherId": {
        type: String,
        optional: true
    },
    "teacher.positionId": {
        type: String,
        optional: true
    },
    activityId: {
        type: String,
        label: "Activity",
        optional: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    startDateName: {
        type: String,
        optional: true
    },
    endDateName: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    place: {
        type: String,
        optional: true
    },
    topic: {
        type: String,
        optional: true
    },
    order: {
        type: Number,
        optional: true
    },
    fileName: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    "fileName.fileName": {
        type: String,
        optional: true
    },
    fileType: {
        type: "String",
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

Sch_TeacherActivity.attachSchema(Sch_TeacherActivity.schema);

export const Sch_TeacherActivityReact = new Mongo.Collection('sch_teacherActivityReact');
Sch_TeacherActivityReact.schema = new SimpleSchema({
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

Sch_TeacherActivityReact.attachSchema(Sch_TeacherActivityReact.schema);