import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_TeacherActivity} from '../../../imports/collection/schTeacherActivity';
import {Sch_Teacher} from '../../../imports/collection/schTeacher';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import moment from "moment";

Meteor.methods({
    schTeacherActivityReport(params, translate) {
        let parameter = {};
        let newParam = {};
        let nextParam = {};
        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.teacherId != "") {
            newParam["teacher.teacherId"] = params.teacherId;
        }
        if (params.positionId != "") {
            newParam["teacher.positionId"] = params.positionId;
        }
        if (params.activityId != "") {
            parameter.activityId = params.activityId;
        }

        if (params.fileTypeId != "") {
            parameter.fileType = params.fileTypeId;
        }

        if (params.organizationId != "") {
            nextParam["teacherDoc.personal.organization"] = params.organizationId;
        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});

        if (params.topic !== "") {
            let reg = new RegExp(params.topic);
            parameter.topic = {$regex: reg, $options: 'mi'};
        }
        if (params.fileName !== "") {
            let reg = new RegExp(params.fileName);
            parameter.fileName = {$regex: reg, $options: 'mi'};
        }

        if (params.place !== "") {
            let reg = new RegExp(params.place);
            parameter.place = {$regex: reg, $options: 'mi'};
        }

        if (params.date !== null && params.date !== "" && params.date !== undefined && params.date.length !== 0) {
            parameter.$or = [
                {
                    startDate: {
                        $lte: moment(params.date[1]).endOf("day").toDate(),
                        $gte: moment(params.date[0]).endOf("day").toDate(),
                    }
                }, {

                    endDate: {
                        $lte: moment(params.date[1]).endOf("day").toDate(),
                        $gte: moment(params.date[0]).startOf("day").toDate()
                    }
                }, {
                    $and: [{
                        startDate: {
                            $lte: moment(params.date[0]).endOf("day").toDate(),
                        },
                        endDate: {
                            $gte: moment(params.date[1]).startOf("day").toDate()
                        },
                    }
                    ]


                }
            ]
        }

        let teacherActivityHTML = "";

        let teacherActivityList = Sch_TeacherActivity.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_activity',
                    localField: 'activityId',
                    foreignField: '_id',
                    as: 'activityDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$activityDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$teacher",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: newParam
            },
            {
                $lookup: {
                    from: 'sch_teacher',
                    localField: 'teacher.teacherId',
                    foreignField: '_id',
                    as: 'teacherDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$teacherDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: nextParam
            },
            {
                $lookup: {
                    from: 'sch_position',
                    localField: 'teacher.positionId',
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
                $sort: {
                    "positionDoc.order": 1,
                    "teacherDoc.personal.name": 1
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
        if (teacherActivityList[0] && teacherActivityList[0].data.length > 0) {
            teacherActivityList[0].data.forEach((obj) => {
                if (obj) {
                    teacherActivityHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;width: 15%">${obj.teacherDoc.personal.name}</td>
                            <td style="text-align: center !important;">${obj.startDateName}</td>
                            <td style="text-align: center !important;">${obj.endDateName}</td>
                            <td style="text-align: center !important;width: 15%">${obj.activityDoc && obj.activityDoc.name || ""}</td>
                            <td style="text-align: center !important;">${obj.topic || ""}</td>
                            <td style="text-align: center !important;">${obj.place || ""}</td>
                             <td style="text-align: center !important;width: 10%">
                            `;


                    if (obj.fileName && obj.fileName.length > 0 && obj.fileName !== "") {
                        let a = 1;
                        obj.fileName.forEach((d) => {
                            teacherActivityHTML += `<a href="${d.fileName || ""}" target="_blank"> ${d.fileName ? "File" + a : ""}</a>`;
                            a++;
                        })
                    }

                    teacherActivityHTML += `</td><td style="text-align: center !important;">${(moment(obj.endDate).diff(obj.startDate, "days") || 0) + 1}</td>

                        </tr>
                    `;
                    i++;
                }
            });
        }

        if (params.date !== null && params.date !== "" && params.date !== undefined && params.date.length !== 0) {
            data.dateHeader = (params.date && params.date[0] ? moment(params.date[0]).format("DD/MM/YYYY") : "") + " - " + (params.date && params.date[1] ? moment(params.date[1]).format("DD/MM/YYYY") : "");
        } else {
            data.dateHeader = "";
        }
        data.teacherActivityHTML = teacherActivityHTML;
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
