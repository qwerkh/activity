import {Sch_Document} from '../../../imports/collection/schDocument';
import {Sch_DocumentReact} from '../../../imports/collection/schDocument';

import {SpaceChar} from "../../../both/config.js/space"

Meteor.methods({
    querySchDocument({q, filter,rolesArea, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchDocument: 0,
            };
            let selector = {};

            if (!!q) {
                let reg = new RegExp(q);
                if (!!filter) {
                    selector[filter] = {$regex: reg, $options: 'mi'}
                } else {
                    selector.$or = [{name: {$regex: reg, $options: 'mi'}}, {
                        dateName: {
                            $regex: reg,
                            $options: 'mi'
                        }
                    }, {desc: {$regex: reg, $options: 'mi'}}];
                }
            }
            let shcDocuments = Sch_Document.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: "sch_fileType",
                        localField: "documentType",
                        foreignField: "_id",
                        as: "documentTypeDoc"
                    }
                },
                {
                    $unwind: {
                        path: "$documentTypeDoc",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $limit: options.limit
                },
                {
                    $skip: options.skip
                }
            ]);
            if (shcDocuments.length > 0) {
                data.content = shcDocuments;
                let shcDocumentTotal = Sch_Document.find(selector).count();
                data.countSchDocument = shcDocumentTotal;
            }
            return data;
        }
    },
    querySchDocumentById(id) {
        let data = Sch_Document.findOne({_id: id});
        return data;
    },
    insertSchDocument(data) {
        let doc = Sch_Document.insert(data);
        if (doc) {
            documentReact(doc);
        }
        return doc;
    },
    updateSchDocument(data) {
        let id = data._id;
        let doc = Sch_Document.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            documentReact(id);
        }
        return doc;
    },
    removeSchDocument(id) {
        let isRemoved = Sch_Document.remove({_id: id});
        if (isRemoved) {
            documentReact(id);
        }
        return isRemoved;
    }
});


let documentReact = function (id) {
    let doc = Sch_DocumentReact.findOne();
    if (doc) {
        Sch_DocumentReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_DocumentReact.insert({
            id: id
        });
    }
}