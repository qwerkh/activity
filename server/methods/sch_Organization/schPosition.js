import {Sch_Organization} from '../../../imports/collection/schOrganization';
import {Sch_OrganizationReact} from '../../../imports/collection/schOrganization';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_PaymentScheduleReact} from "../../../imports/collection/schPaymentSchedule";

Meteor.methods({
    querySchOrganization({q, filter, options = {limit: 10, skip: 0}}) {
        if (Meteor.userId()) {
            let data = {
                content: [],
                countSchOrganization: 0,
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
            let shcOrganizations = Sch_Organization.aggregate([
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
            if (shcOrganizations.length > 0) {
                data.content = shcOrganizations;
                let shcOrganizationTotal = Sch_Organization.find(selector).count();
                data.countSchOrganization = shcOrganizationTotal;
            }
            return data;
        }
    },
    querySchOrganizationById(id) {
        let data = Sch_Organization.findOne({_id: id});
        return data;
    },
    insertSchOrganization(data) {
        let doc = Sch_Organization.insert(data);
        if (doc) {
            organizationReact(doc);
        }
        return doc;
    },
    updateSchOrganization(data) {
        let id = data._id;
        let doc = Sch_Organization.update({_id: data._id},
            {
                $set: data
            });
        if (doc) {
            organizationReact(id);
        }
        return doc;
    },
    removeSchOrganization(id) {
        let isRemoved = Sch_Organization.remove({_id: id});
        if (isRemoved) {
            organizationReact(id);
        }
        return isRemoved;
    }
});


let organizationReact = function (id) {
    let doc = Sch_OrganizationReact.findOne();
    if (doc) {
        Sch_OrganizationReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_OrganizationReact.insert({
            id: id
        });
    }
}