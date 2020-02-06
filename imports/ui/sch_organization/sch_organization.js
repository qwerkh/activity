import './sch_organization.html';
import schOrganization from '/imports/vue/ui/schOrganization';

let indexTmpl = Template.sch_organization;
indexTmpl.onRendered(function () {
    new Vue({
        render: h => h(schOrganization)
    }).$mount('sch_organization');
});

indexTmpl.onDestroyed(function () {
    $('.sch_organization').remove();
});

