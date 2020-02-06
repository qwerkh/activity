import schDocumentReport from '/imports/vue/ui/report/schDocument';
import './schDocument.html';

let index = Template.sch_documentReport;
index.onRendered(function () {
    new Vue({
        render: h => h(schDocumentReport),
        component: schDocumentReport
    }).$mount('#schDocument-report')
});

index.onDestroyed(function () {
    $('.schDocument-report').remove();
});