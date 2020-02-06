

import {SpaceChar} from "../../both/config.js/space"
import {Sch_Level} from "../../imports/collection/schLevel";
import {Sch_Program} from "../../imports/collection/schProgram";
import {Sch_Subject} from "../../imports/collection/schSubject";
import {Sch_Ciriculumn} from "../../imports/collection/schCiriculumn";
import {Sch_Teacher} from "../../imports/collection/schTeacher";
import {Sch_Student} from "../../imports/collection/schStudent";
import {Sch_Promotion} from "../../imports/collection/schPromotion";
import {Sch_Class} from "../../imports/collection/schClass";
import {Sch_Major} from "../../imports/collection/schMajor";
import {Sch_Faculty} from "../../imports/collection/schFaculty";
import {Sch_ClassTable} from "../../imports/collection/schClassTable";
import {Sch_Time} from "../../imports/collection/schTime";
import {Sch_Bus} from "../../imports/collection/schBus";
import {Sch_BusStop} from "../../imports/collection/schBusStop";
import {Sch_BusRegister} from "../../imports/collection/schBusRegister";
import {Sch_Position} from "../../imports/collection/schPosition";
import {Sch_Activity} from "../../imports/collection/schActivity";
import {Sch_Organization} from "../../imports/collection/schOrganization";
import {Sch_FileType} from "../../imports/collection/schFileType";

Meteor.methods({

    querySchStudentOption(q) {
        let selector = {};
        if (q !== "") {
            q = q.replace(/[/\\]/g, '');
            let reg = new RegExp(q, 'mi');
            selector.$or = [
                {"personal.name": {$regex: reg}},
                {_id: q}
            ];
        }
        return Sch_Student.find(selector, {limit: 300}).fetch().map(obj => ({
            label: (obj.personal && obj.personal.name || "") + " ( " + (obj.personal && obj.personal.dobName || "") + ")",
            value: obj._id
        }));
    },
    querySchBusRegisterOption(q) {
        let selector = {};
        selector.status = "Active";
        if (q !== "") {
            q = q.replace(/[/\\]/g, '');
            let reg = new RegExp(q, 'mi');
            let studentList = Sch_Student.find({"personal.name": {$regex: reg}}, {limit: 300}).fetch().map(function (obj) {
                return obj._id;
            });
            selector.$or = [
                {studentId: {$in: studentList}},
                {_id: q}
            ];
        }

        return Sch_BusRegister.aggregate([
            {$match: selector},
            {$limit: 300},
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            },
            {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            }

        ]).map(obj => ({
            label: (obj.studentDoc.personal && obj.studentDoc.personal.name || "") + " ( " + (obj.studentDoc.personal && obj.studentDoc.personal.dobName || "") + ")",
            value: obj._id
        }));
    },
    queryStudentOptionByClass(classId) {
        let list = [];

        let studentList = Sch_ClassTable.aggregate([
            {$match: {classId: classId}},
            {
                $unwind: {
                    path: "$studentList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentList.studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            },
            {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        studentList.forEach((obj) => {
            if (obj && obj.studentDoc) {
                list.push({
                    label: (obj.studentDoc && obj.studentDoc.personal && obj.studentDoc.personal.name || "") + " ( " + (obj.studentDoc && obj.studentDoc.personal && obj.studentDoc.personal.dobName || "") + ")",
                    value: obj.studentDoc._id
                });
            }
        });
        return list;
    },
    queryLevelOption(selector) {
        let list = [];

        Sch_Level.find(selector, {sort: {code: 1}}).fetch().forEach(function (obj) {
            list.push({label: obj.code + " : " + obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryTimeOption(selector) {
        let list = [];

        Sch_Time.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryFacultyOption(selector) {
        let list = [];

        Sch_Faculty.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    },
    queryBusOption(selector) {
        let list = [];

        Sch_Bus.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    },
    queryBusStopOption(selector) {
        let list = [];

        Sch_BusStop.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryMajorOption(selector) {
        let list = [];
        Sch_Major.find(selector, {sort: {code: 1}}).fetch().forEach(function (obj) {
            list.push({label: obj.code + " : " + obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryTeacherOption(selector) {
        let list = [];
        Sch_Teacher.find(selector, {sort: {"personal.name": 1}}).fetch().forEach(function (obj) {
            list.push({label: obj.personal.name, value: obj._id});
        });
        return list;
    }
    ,
    queryProgramOption() {
        let list = [];
        Sch_Program.find().fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    },

    queryActivityOption() {
        let list = [];
        Sch_Activity.find().fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryClassOption(selector) {
        let list = [];
        //selector.status = true;
        Sch_Class.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "sch_time",
                    localField: "timeId",
                    foreignField: "_id",
                    as: "timeDoc"
                }
            },
            {
                $unwind: {
                    path: "$timeDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 200
            }
        ]).forEach(function (obj) {
            list.push({
                label: obj.name + " - " + obj.classDateName + "(" + (obj.timeDoc && obj.timeDoc.name || "") + ")",
                value: obj._id
            });
        });
        return list;
    }
    ,

    queryClassOptionSearch(q) {
        let selector = {};
        if (q !== "") {
            q = q.replace(/[/\\]/g, '');
            let reg = new RegExp(q, 'mi');
            selector.$or = [
                {name: {$regex: reg}},
                {classDateName: {$regex: reg}},
                {_id: q}
            ];
        }
        selector.status = true;


        let list = [];

        Sch_Class.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "sch_time",
                    localField: "timeId",
                    foreignField: "_id",
                    as: "timeDoc"
                }
            },
            {
                $unwind: {
                    path: "$timeDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 200
            }
        ]).forEach(function (obj) {
            list.push({
                label: obj.name + " - " + obj.classDateName + "(" + (obj.timeDoc && obj.timeDoc.name || "") + ")",
                value: obj._id
            });
        });
        return list;
    },
    queryClassOptionSearchStatusNull(q, date) {
        let selector = {};
        if (q !== "") {
            q = q.replace(/[/\\]/g, '');
            let reg = new RegExp(q, 'mi');
            selector.$or = [
                {name: {$regex: reg}},
                {classDateName: {$regex: reg}},
                {_id: q}
            ];
        }
        if (date !== null && date !== "") {
            selector.classDate = {
                $lte: moment(date[1]).endOf("day").toDate(),
                $gte: moment(date[0]).startOf("day").toDate()
            };
        } else {
            selector.status = true;
        }

        let list = [];

        Sch_Class.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "sch_time",
                    localField: "timeId",
                    foreignField: "_id",
                    as: "timeDoc"
                }
            },
            {
                $unwind: {
                    path: "$timeDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 200
            }
        ]).forEach(function (obj) {
            list.push({
                label: obj.name + " - " + obj.classDateName + "(" + (obj.timeDoc && obj.timeDoc.name || "") + ")",
                value: obj._id
            });
        });

        return list;
    },
    queryClassOptionActive(selector) {
        let list = [];
        selector.status = true;

        Sch_Class.aggregate([
            {$match: selector},
            {
                $lookup: {
                    from: "sch_time",
                    localField: "timeId",
                    foreignField: "_id",
                    as: "timeDoc"
                }
            },
            {
                $unwind: {
                    path: "$timeDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).forEach(function (obj) {
            list.push({
                label: obj.name + " - " + obj.classDateName + "(" + (obj.timeDoc && obj.timeDoc.name || "") + ")",
                value: obj._id
            });
        });

        return list;
    }
    ,
    queryPromotionOption(selector) {
        let list = [];
        selector.status = true;
        Sch_Promotion.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryPromotionOptionNoStatus(selector) {
        let list = [];
        Sch_Promotion.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryCiriculumnOption(selector) {
        let list = [];

        Sch_Ciriculumn.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    querySubjectOption(selector) {
        let list = [];

        Sch_Subject.find(selector, {sort: {code: 1}}).fetch().forEach(function (obj) {
            list.push({label: obj.code + " : " + obj.name, value: obj._id});
        });
        return list;
    },
    querySubjectOptionLimit(q) {
        let selector = {};
        if (q != "") {
            q = q.replace(/[/\\]/g, '');
            let reg = new RegExp(q, 'mi');
            selector.$or = [
                {name: {$regex: reg}},
                {_id: q}
            ];
        }
        return Sch_Subject.find(selector, {limit: 100}).fetch().map(obj => ({label: obj.name, value: obj._id}));

    },
    queryPositionOption(selector) {
        let list = [];

        Sch_Position.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    },
    queryOrganizationOption(selector) {
        let list = [];

        Sch_Organization.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    },
    queryFileTypeOption(selector) {
        let list = [];

        Sch_FileType.find(selector).fetch().forEach(function (obj) {
            list.push({label: obj.name, value: obj._id});
        });
        return list;
    }
    ,
    queryUserOption() {
        let data = Meteor.users.find({username: {$ne: "super"}}).fetch().map((obj) => {
            return {label: obj.username, value: obj._id};
        });
        return data;
    },
    queryProvinceOption() {
        let list = [];
        let provinces = JSON.parse(Assets.getText('geoData/province.json'));
        provinces.forEach(function (province) {
            list.push({
                label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                value: `${province.properties.ADMIN_ID1}`
            });
        });
        return list;
    },
    queryDistrictOption(adminId1) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/district.json'));
        districts.map(function (o) {
            if (o.properties.ADMIN_ID1 === adminId1) {
                list.push({
                    label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                    value: `${o.properties.ADMIN_ID2}`
                });
            }
        });
        return list;
    },
    queryCommuneOption(adminId2) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/commune.json'));
        districts.map(function (o) {
            if (o.properties.ADMIN_ID2 === adminId2) {
                list.push({
                    label: `${o.properties.ADMIN_ID3} | ${o.properties.NAME3}`,
                    value: `${o.properties.ADMIN_ID3}`
                });
            }
        });
        return list;
    },
    queryVillageOption(adminId3) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/village.json'));
        districts.map(function (o) {
            if (o.properties.ADMIN_ID3 === adminId3) {
                list.push({
                    label: `${o.properties.ADMIN_ID} | ${o.properties.NAME}`,
                    value: `${o.properties.ADMIN_ID}`
                });
            }
        });
        return list;
    },
})
;
