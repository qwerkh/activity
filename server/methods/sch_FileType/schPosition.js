import {Sch_FileType} from '../../../imports/collection/schFileType';
import {Sch_FileTypeReact} from '../../../imports/collection/schFileType';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_PaymentScheduleReact} from "../../../imports/collection/schPaymentSchedule";

Meteor.methods({
    querySchFileType({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchFileType: 0,
            };
            let selector = {};
            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcFileTypes = Sch_FileType.aggregate([
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
                }
            ]);
            if (shcFileTypes.length > 0) {
                data.content = shcFileTypes;
                let shcFileTypeTotal = Sch_FileType.find(selector).count();
                data.countSchFileType = shcFileTypeTotal;
            }
            return data;
        }
    },
    querySchFileTypeById(id) {
        let data = Sch_FileType.findOne({_id: id});
        return data;
    },
    insertSchFileType(data) {
        let doc = Sch_FileType.insert(data);
        if (doc) {
            fileTypeReact(doc);
        }
        return doc;
    },
    updateSchFileType(data) {
        let id = data._id;
        let doc = Sch_FileType.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            fileTypeReact(id);
        }
        return doc;
    },
    removeSchFileType(id) {
        let isRemoved = Sch_FileType.remove({_id: id});
        if (isRemoved) {
            fileTypeReact(id);
        }
        return isRemoved;
    }
});


let fileTypeReact = function (id) {
    let doc = Sch_FileTypeReact.findOne();
    if (doc) {
        Sch_FileTypeReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_FileTypeReact.insert({
            id: id
        });
    }
}