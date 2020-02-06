import {Sch_TeacherActivity} from '../../../imports/collection/schTeacherActivity';
import {Sch_TeacherActivityReact} from '../../../imports/collection/schTeacherActivity';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Teacher, Sch_TeacherReact} from "../../../imports/collection/schTeacher";
import {Sch_Activity} from "../../../imports/collection/schActivity";
import numeral from "numeral";

Meteor.methods({
    querySchTeacherActivity({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchTeacherActivity: 0,
            };
            let selector = {};
            let selectorTeacher = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selectorTeacher.$or = [{"personal.name": {$regex: reg, $options: 'mi'}}, {
                        "personal.khName": {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }];
                    let teacherList = Sch_Teacher.find(selectorTeacher, {_id: true},
                        {
                            $limit: options.limit
                        },
                        {
                            $skip: options.skip
                        }).fetch().map((obj) => {
                        return obj._id;
                    });

                    let activityList = Sch_Activity.find({name: {$regex: reg, $options: 'mi'}}, {_id: true},
                        {
                            $limit: options.limit
                        },
                        {
                            $skip: options.skip
                        }).fetch().map((obj) => {
                        return obj._id;
                    });

                    selector.$or = [{"teacher.teacherId": {$in: teacherList}}, {
                        activityId: {
                            $in: activityList
                        }
                    }
                        , {desc: {$regex: reg, $options: 'mi'}}
                        , {topic: {$regex: reg, $options: 'mi'}}
                        , {place: {$regex: reg, $options: 'mi'}}
                        , {startDateName: {$regex: reg, $options: 'mi'}}
                        , {endDateName: {$regex: reg, $options: 'mi'}}
                        , {fileName: {$regex: reg, $options: 'mi'}}
                        , {order: numeral(q).value()}
                    ];
                }
            }
            let shcTeacherActivitys = Sch_TeacherActivity.aggregate([
                {
                    $match: selector
                },

                {
                    $sort: {
                        createdAt: -1
                    }
                },

                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                },
                {
                    $unwind: {
                        path: "$teacher",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "sch_teacher",
                        localField: "teacher.teacherId",
                        foreignField: "_id",
                        as: "teacherDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$teacherDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        teacherName: {
                            $push: "$teacherDoc.personal.name"
                        },
                        activityId: {$last: "$activityId"},
                        startDateName: {$last: "$startDateName"},
                        endDateName: {$last: "$endDateName"},
                        fileName: {$last: "$fileName"},
                        desc: {$last: "$desc"},
                        place: {$last: "$place"},
                        topic: {$last: "$topic"},
                        order: {$last: "$order"},
                    }
                },
                {
                    $lookup: {
                        from: "sch_activity",
                        localField: "activityId",
                        foreignField: "_id",
                        as: "activityDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$activityDoc",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            if (shcTeacherActivitys.length > 0) {
                data.content = shcTeacherActivitys;
                let shcTeacherActivityTotal = Sch_TeacherActivity.find(selector).count();
                data.countSchTeacherActivity = shcTeacherActivityTotal;
            }
            return data;
        }
    }
    ,
    querySchTeacherActivityById(id) {
        let data = Sch_TeacherActivity.findOne({_id: id});
        return data;
    }
    ,
    insertSchTeacherActivity(data) {
        let doc = Sch_TeacherActivity.insert(data);
        if (doc) {
            teacherActivityReact(doc);
        }
        return doc;
    }
    ,
    updateSchTeacherActivity(data) {
        let id = data._id;
        let doc = Sch_TeacherActivity.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            teacherActivityReact(id);
        }
        return doc;
    }
    ,
    removeSchTeacherActivity(id) {
        let isRemoved = Sch_TeacherActivity.remove({_id: id});
        if (isRemoved) {
            teacherActivityReact(id);
        }
        return isRemoved;
    },
    fetchGenerateOrderActivity(area) {
        return Sch_TeacherActivity.findOne({rolesArea: area}, {sort: {billNo: -1}});
    }
});


let teacherActivityReact = function (id) {
    let doc = Sch_TeacherActivityReact.findOne();
    if (doc) {
        Sch_TeacherActivityReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_TeacherActivityReact.insert({
            id: id
        });
    }
}