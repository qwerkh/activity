import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Teacher} from '../../../imports/collection/schTeacher';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import moment from "moment";

Meteor.methods({
    schTeacherListReport(params, translate) {
        let parameter = {};
        let newParam = {};
        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.teacherId != "") {
            parameter._id = params.teacherId;
        }


        if (params.organizationId != "") {
            parameter["personal.organization"] = params.organizationId;
        }

        if (params.degree !== "") {
            parameter["personalStudy"] = {$elemMatch: {grade: params.degree}};
        }

        if (params.positionId != "") {
            newParam["positionDoc._id"] = params.positionId;
        }


        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        let teacherListHTML = "";

        let teacherList = Sch_Teacher.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_organization',
                    localField: 'personal.organization',
                    foreignField: '_id',
                    as: 'organizationDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$organizationDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$position",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "position.startDate": 1,
                }
            },
            {
                $group: {
                    _id: {
                        _id: "$_id"
                    },
                    data: {$last: "$$ROOT"},
                }
            },
            {
                $lookup: {
                    from: 'sch_position',
                    localField: 'data.position.positionId',
                    foreignField: '_id',
                    as: 'positionDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$positionDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: newParam
            },
            {
                $sort: {
                    "positionDoc.order": 1,
                    "personal.name": 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                }
            },
        ]);

        let i = 1;
        if (teacherList[0] && teacherList[0].data.length > 0) {
            teacherList[0].data.forEach((obj) => {
                if (obj) {
                    teacherListHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.personal.name}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.personal.gender=="Male" ? "ប្រុស": "ស្រី"}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.personal && obj.data.personal.dobName || ""}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.personal && obj.data.personal.provinceCurrent || ""}</td>
                            <td style="text-align: left !important;width: 15%">${obj.positionDoc && obj.positionDoc.name || ""}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.organizationDoc && obj.data.organizationDoc.name || ""}</td>
                            <td style="text-align: left !important;width: 15%">${obj.data.phoneNumber || ""}</td>
                            </tr>
                            `;


                    i++;
                }
            });
        }


        data.teacherListHTML = teacherListHTML;
        return data;
    }
})
;


function getVoucherSubString(invoiceNo) {
    let newInvoice = invoiceNo.length > 9 ? parseInt((invoiceNo || "0000000000000").substr(9, 13)) : parseInt(invoiceNo || "0");
    return pad(newInvoice, 6);
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function getTypePromotion(val) {
    if (val === "Percent") {
        return "%";
    }
    return "";
}
