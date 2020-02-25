import schTeacherListReport from '/imports/vue/ui/report/schTeacherList';
import './schTeacherList.html';

let index = Template.sch_teacherListReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schTeacherListReport),
        component: schTeacherListReport
    }).$mount('#schTeacherList-report')
});

index.onDestroyed(function () {
    $('.schTeacherList-report').remove();
});