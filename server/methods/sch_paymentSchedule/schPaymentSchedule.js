import {Sch_Register} from '../../../imports/collection/schRegister';
import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Class} from "../../../imports/collection/schClass";
import {Sch_Transcript} from "../../../imports/collection/schTranscript";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";
import {Sch_PaymentScheduleReact} from "../../../imports/collection/schPaymentSchedule";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {Sch_Promotion} from "../../../imports/collection/schPromotion";
import {Sch_PaymentReact} from "../../../imports/collection/schPayment";

Meteor.methods({
    schGeneratePaymentSchedule(classDoc, levelDoc, classTableDoc) {
        if (classTableDoc && classTableDoc.studentList && classTableDoc.studentList.length > 0) {
            classTableDoc.studentList.map((obj) => {
                if (obj.isGenerated === undefined || obj.isGenerated === false) {
                    Meteor.call("schGeneratePaymentScheduleAStudent", classDoc, levelDoc, obj);

                    obj.isGenerated = true;
                    return obj;
                }
            });
            Sch_ClassTable.update({_id: classTableDoc._id}, {$set: {studentList: classTableDoc.studentList}});
        }
    },
    schGeneratePaymentScheduleAStudent(classDoc, levelDoc, doc) {
        let order = 1;
        let discount = 0;

        let promotionDoc = Sch_Promotion.findOne({_id: doc.promotionId});
        let pricePerUnitNotDiscount = levelDoc.price * doc.term / levelDoc.term;

        if (promotionDoc.promotionType === "Percent") {
            discount = levelDoc.price * promotionDoc.value / 100;
        } else {
            discount = promotionDoc.value;
        }

        let pricePerUnit = (levelDoc.price - discount) * doc.term / levelDoc.term;
        let discountPerUnit = discount * doc.term / levelDoc.term;

        let scheduleDoc = {};
        scheduleDoc.studentId = doc.studentId;
        scheduleDoc.classId = classDoc._id;
        scheduleDoc.levelId = levelDoc._id;
        scheduleDoc.isPaid = false;
        scheduleDoc.paid = 0;
        scheduleDoc.waived = 0;


        let installment = levelDoc.term / doc.term;

        let newPricePerUnitNotDiscount = Math.floor(pricePerUnitNotDiscount);
        let newDiscountPerUnit = Math.floor(discountPerUnit);
        let newPricePerUnit = Math.floor(pricePerUnit);

        let firstPricePerUnitNotDiscount = levelDoc.price - (newPricePerUnitNotDiscount * (installment - 1));
        let firstDiscountPerUnit = discount - (newDiscountPerUnit * (installment - 1));
        let firstPricePerUnit = (levelDoc.price - discount) - (newPricePerUnit * (installment - 1));

        for (let i = 1; i <= installment; i++) {

            if (installment === 1) {

                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(pricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(pricePerUnit);
                scheduleDoc.discount = formatCurrency(discountPerUnit);
                scheduleDoc.netAmount = formatCurrency(pricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(pricePerUnit);
            } else if (i === 1) {
                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(firstPricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(firstPricePerUnit);
                scheduleDoc.discount = formatCurrency(firstDiscountPerUnit);
                scheduleDoc.netAmount = formatCurrency(firstPricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(firstPricePerUnit);
            } else {
                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(newPricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(newPricePerUnit);
                scheduleDoc.discount = formatCurrency(newDiscountPerUnit);
                scheduleDoc.netAmount = formatCurrency(newPricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(newPricePerUnit);
            }

            scheduleDoc.term = doc.term;
            scheduleDoc.promotionId = doc.promotionId;
            scheduleDoc.receivePaymentScheduleDate = doc.startClassDate;
            scheduleDoc.receivePaymentScheduleDateName = moment(doc.startClassDate).format("DD/MM/YYYY");
            let reDoc = Sch_PaymentSchedule.insert(scheduleDoc);
            doc.startClassDate = moment(doc.startClassDate).add(doc.term, "months").toDate();
            order++;
        }
    },
    schGeneratePaymentScheduleAStudentWithDifferentPromotion(classDoc, levelDoc, doc, scholarshipId) {
        let paymentScheduleDocOld = Sch_PaymentSchedule.find({
            studentId: doc.studentId,
            classId: classDoc._id,
            status: {$ne: "Complete"}
        }).fetch();

        Sch_PaymentSchedule.update({
            studentId: doc.studentId,
            classId: classDoc._id,
        }, {$set: {status: "Complete"}}, {multi: true});


        let order = 1;
        let discount = 0;

        let promotionDoc = Sch_Promotion.findOne({_id: scholarshipId});
        let pricePerUnitNotDiscount = levelDoc.price * doc.term / levelDoc.term;

        if (promotionDoc.promotionType === "Percent") {
            discount = levelDoc.price * promotionDoc.value / 100;
        } else {
            discount = promotionDoc.value;
        }

        let pricePerUnit = (levelDoc.price - discount) * doc.term / levelDoc.term;
        let discountPerUnit = discount * doc.term / levelDoc.term;

        let scheduleDoc = {};
        scheduleDoc.studentId = doc.studentId;
        scheduleDoc.classId = classDoc._id;
        scheduleDoc.levelId = levelDoc._id;
        scheduleDoc.isPaid = false;
        scheduleDoc.paid = 0;
        scheduleDoc.waived = 0;


        let installment = levelDoc.term / doc.term;

        let newPricePerUnitNotDiscount = Math.floor(pricePerUnitNotDiscount);
        let newDiscountPerUnit = Math.floor(discountPerUnit);
        let newPricePerUnit = Math.floor(pricePerUnit);

        let firstPricePerUnitNotDiscount = levelDoc.price - (newPricePerUnitNotDiscount * (installment - 1));
        let firstDiscountPerUnit = discount - (newDiscountPerUnit * (installment - 1));
        let firstPricePerUnit = (levelDoc.price - discount) - (newPricePerUnit * (installment - 1));
        for (let i = 1; i <= installment; i++) {
            if (installment === 1) {

                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(pricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(pricePerUnit);
                scheduleDoc.discount = formatCurrency(discountPerUnit);
                scheduleDoc.netAmount = formatCurrency(pricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(pricePerUnit);
            } else if (i === 1) {
                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(firstPricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(firstPricePerUnit);
                scheduleDoc.discount = formatCurrency(firstDiscountPerUnit);
                scheduleDoc.netAmount = formatCurrency(firstPricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(firstPricePerUnit);
            } else {
                scheduleDoc.order = order;
                scheduleDoc.amount = formatCurrency(newPricePerUnitNotDiscount);
                scheduleDoc.rawAmount = formatCurrency(newPricePerUnit);
                scheduleDoc.discount = formatCurrency(newDiscountPerUnit);
                scheduleDoc.netAmount = formatCurrency(newPricePerUnit);
                scheduleDoc.balanceUnPaid = formatCurrency(newPricePerUnit);
            }

            scheduleDoc.term = doc.term;
            scheduleDoc.promotionId = doc.promotionId;
            scheduleDoc.receivePaymentScheduleDate = doc.startClassDate;
            scheduleDoc.receivePaymentScheduleDateName = moment(doc.startClassDate).format("DD/MM/YYYY");

            let old = paymentScheduleDocOld.find(({order}) => order === scheduleDoc.order);
            if (old && old.status !== "Complete") {
                let reDoc = Sch_PaymentSchedule.insert(scheduleDoc);
            }

            doc.startClassDate = moment(doc.startClassDate).add(doc.term, "months").toDate();
            order++;
        }
    },
    querySchPaymentScheduleByStudentId(studentId, classId) {
        let studentDoc = Sch_ClassTable.aggregate([
            {$match: {classId: classId}},
            {
                $unwind: {
                    path: "$studentList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {"studentList.studentId": studentId}
            },
            {
                $lookup:
                    {
                        from: "sch_promotion",
                        localField: "studentList.promotionId",
                        foreignField: "_id",
                        as: "promotionDoc"
                    }
            },
            {
                $unwind: {
                    path: "$promotionDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        let d = Sch_PaymentSchedule.find({
            studentId: studentId,
            classId: classId,
            status: {$in: ["Active", "Partial"]}
        }, {sort: {order: 1}}).fetch();

        d.map((obj) => {
            obj.isShow = true;
            obj.isApplyTerm = false;
            obj.promotionDoc = studentDoc && studentDoc[0].promotionDoc || "";

            obj.amount = formatCurrency(obj.amount - obj.paid - (obj.waived || 0) - (obj.balanceNotCut || 0));
            obj.netAmount = formatCurrency(obj.netAmount - obj.paid - (obj.waived || 0) - (obj.balanceNotCut || 0));
            obj.paid = 0;
            obj.isPaid = false;
            obj.desc = "";
            obj.waived = 0;
            obj.dayOverDue = moment().startOf("days").diff(moment(obj.receivePaymentScheduleDate).startOf("days").toDate(), "days") < 0 ? 0 : moment().startOf("days").diff(moment(obj.receivePaymentScheduleDate).startOf("days").toDate(), "days");

            return obj;
        });
        return d;
    },
    removePaymentScheduleByClassAndStudent(classId, studentId) {
        let isRemoved = Sch_PaymentSchedule.remove({classId: classId, studentId: studentId});
        return isRemoved;
    }

});

let paymentScheduleReact = function (id) {
    let doc = Sch_PaymentScheduleReact.findOne();
    if (doc) {
        Sch_PaymentScheduleReact.update({_id: doc._id}, {
            $set: {
                id: id
            }
        });
    } else {
        Sch_PaymentScheduleReact.insert({
            id: id
        });
    }
}