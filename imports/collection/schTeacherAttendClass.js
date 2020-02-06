export const Sch_TeacherAttendClass = new Mongo.Collection('sch_teacherAttendClass');

Sch_TeacherAttendClass.schema = new SimpleSchema({
    teacherId: {
        type: String,
        label: "Teacher"
    },
    teacherReplaceId: {
        type: String,
        label: "Teacher Replace",
        optional: true
    },
    isAttend:{
        type:Boolean,
    },
    numAttend:{
        type:Number,

    },
    date:{
        type:Date,
    },
    classId:{
        type:String,

    },
    rolesArea: {
        type: String,
        label: "Role Area",
        optional: true
    },
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
    }
});

Sch_TeacherAttendClass.attachSchema(Sch_TeacherAttendClass.schema);

export const Sch_TeacherAttendClassReact = new Mongo.Collection('sch_teacherAttendClassReact');
Sch_TeacherAttendClassReact.schema = new SimpleSchema({
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

Sch_TeacherAttendClassReact.attachSchema(Sch_TeacherAttendClassReact.schema);