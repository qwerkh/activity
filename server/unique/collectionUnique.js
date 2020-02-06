
import {Sch_Student} from '../../imports/collection/schStudent';
import {Sch_Teacher} from '../../imports/collection/schTeacher';
import {Sch_Register} from '../../imports/collection/schRegister';
import {Sch_Payment} from '../../imports/collection/schPayment';
import {Sch_BusRegister} from '../../imports/collection/schBusRegister';
import {Sch_BusPayment} from '../../imports/collection/schBusPayment';
import {Sch_Class} from '../../imports/collection/schClass';
import {Sch_TeacherActivity} from '../../imports/collection/schTeacherActivity';
import {Sch_Time} from '../../imports/collection/schTime';
import {Sch_Faculty} from "../../imports/collection/schFaculty";
import {Sch_Major} from "../../imports/collection/schMajor";
import {Sch_Program} from "../../imports/collection/schProgram";
import {Sch_Level} from "../../imports/collection/schLevel";
import {Sch_Promotion} from "../../imports/collection/schPromotion";
import {Sch_Subject} from "../../imports/collection/schSubject";
import {Sch_Ciriculumn} from "../../imports/collection/schCiriculumn";
import {Sch_Mention} from "../../imports/collection/schMention";
import {Sch_Position} from "../../imports/collection/schPosition";
import {Sch_Activity} from "../../imports/collection/schActivity";
import {Sch_BusStop} from "../../imports/collection/schBusStop";
import {Sch_Bus} from "../../imports/collection/schBus";
import {Sch_Organization} from "../../imports/collection/schOrganization";


Sch_Student._ensureIndex({
    "personal.name": 1,
    "personal.latinName": 1,
    rolesArea: 1,
    "personal.dobName": 1
}, {unique: 1});

Sch_Teacher._ensureIndex({
    "personal.name": 1,
    "personal.latinName": 1,
    rolesArea: 1,
    "personal.dobName": 1
}, {unique: 1});

Sch_Register._ensureIndex({
    registerDateName: 1,
    studentId: 1,
    levelId: 1,
    programId: 1,
    rolesArea: 1
}, {unique: 1});

Sch_Payment._ensureIndex({
    paymentDateName: 1,
    studentId: 1,
    classId: 1,
    paymentNo: 1,
    rolesArea: 1
}, {unique: 1});
Sch_BusRegister._ensureIndex({
    busRegisterDateName: 1,
    studentId: 1,
    busId: 1,
    busStopId: 1,
    rolesArea: 1
}, {unique: 1, name: "Sch_BusRegister2"});
Sch_BusPayment._ensureIndex({
    busPaymentDateName: 1,
    studentId: 1,
    busRegisterId: 1,
    busPaymentNo: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Class._ensureIndex({
    name: 1,
    code: 1,
    teacherId: 1,
    levelId: 1,
    timeId: 1,
    classDateName: 1,
    rolesArea: 1
}, {unique: 1, name: "Sch_Class2"});
Sch_TeacherActivity._ensureIndex({
    teacherId: 1,
    activityId: 1,
    startDateName: 1,
    endDateName: 1,
    topic: 1,
    place: 1,
    fileName: 1,
    rolesArea: 1,
    createdAt: 1
}, {unique: 1, name: "Sch_TeacherActivity2"});
Sch_Time._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});

Sch_Program._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Faculty._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Major._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Level._ensureIndex({
    name: 1,
    programId: 1,
    majorId: 1,
    code: 1,
    rolesArea: 1
}, {unique: 1});

Sch_Promotion._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Subject._ensureIndex({
    name: 1,
    code: 1,
    rolesArea: 1
}, {unique: 1});

Sch_Ciriculumn._ensureIndex({
    name: 1,
    majorId: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Mention._ensureIndex({
    dateName: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Position._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Organization._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Activity._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_BusStop._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});
Sch_Bus._ensureIndex({
    name: 1,
    rolesArea: 1
}, {unique: 1});