import './sch_document.html';
import schDocument from '/imports/vue/ui/schDocument';

let indexTmpl = Template.sch_document;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schDocument)
    }).$mount('sch_document');
});

indexTmpl.onDestroyed(function () {
    $('.sch_document').remove();
});

