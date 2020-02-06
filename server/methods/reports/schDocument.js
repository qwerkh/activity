import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_Document} from '../../../imports/collection/schDocument';
import {Sch_Teacher} from '../../../imports/collection/schTeacher';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"
import moment from "moment";

Meteor.methods({
    schDocumentReport(params, translate) {
        let parameter = {};

        if (params.fileTypeId != "") {
            parameter.documentType = params.fileTypeId;
        }


        if (params.issueDate != "" && params.issueDate !== null && params.issueDate !== undefined) {
            parameter.dateName = moment(params.issueDate).format("DD/MM/YYYY");
        }

        if (params.receivedDate != "" && params.receivedDate !== null && params.receivedDate !== undefined) {
            parameter.receivedDateName = moment(params.receivedDate).format("DD/MM/YYYY");
        }

        if (params.description != "") {
            let reg = new RegExp(params.description);
            parameter.desc = {$regex: reg, $options: 'mi'};
        }

        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        if (params.name !== "") {
            let reg = new RegExp(params.name);
            parameter.name = {$regex: reg, $options: 'mi'};
        }


        if (params.date !== null && params.date !== "" && params.date !== undefined && params.date.length !== 0) {
            parameter.date = {
                $lte: moment(params.date[1]).endOf("day").toDate(),
                $gte: moment(params.date[0]).startOf("day").toDate(),
            }
        }

        let documentHTML = "";

        let documentList = Sch_Document.aggregate([
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_fileType',
                    localField: 'documentType',
                    foreignField: '_id',
                    as: 'documentTypeDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$documentTypeDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: null,
                    data: {$push: "$$ROOT"},
                }
            }
        ]);


        let i = 1;
        if (documentList[0] && documentList[0].data.length > 0) {
            documentList[0].data.forEach((obj) => {
                if (obj) {
                    documentHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;width: 20%">${obj.name}</td>
                            <td style="text-align: center !important;">${obj.dateName}</td>
                            <td style="text-align: center !important;width: 160px">${obj.receivedDateName || ""}</td>
                            <td style="text-align: center !important;width: 10%">${obj.documentTypeDoc.name}</td>
                            <td style="text-align: center !important;width: 10%">
                            `;

                    if (obj.link && obj.link.length > 0 && obj.link != "") {
                        let a = 1;
                        obj.link.forEach((d) => {
                            documentHTML += ` 
                            <a href="${d.fileName || ""}" target="_blank"> ${d.fileName ? "File" + a : ""}</a>
                            `;
                            a++;
                        })
                    }

                    documentHTML += `
                          
                            </td>
                            <td style="text-align: center !important;">${obj.desc || ""}</td>


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
        data.documentHTML = documentHTML;
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
