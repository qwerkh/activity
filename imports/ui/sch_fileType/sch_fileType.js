import './sch_fileType.html';
import schFileType from '/imports/vue/ui/schFileType';

let indexTmpl = Template.sch_fileType;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schFileType)
    }).$mount('sch_fileType');
});

indexTmpl.onDestroyed(function () {
    $('.sch_fileType').remove();
});

