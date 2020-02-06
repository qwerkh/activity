

import {SpaceChar} from "../../both/config.js/space"

Meteor.methods({


    queryRoleBranchOptionReport() {
        let list = [];
        let provinces = JSON.parse(Assets.getText('geoData/province.json'));
        provinces.forEach(function (province) {
            list.push({
                label: `${province.properties.ADMIN_ID1} | ${province.properties.NAME1}`,
                value: `${province.properties.ADMIN_ID1}`
            });
        });
        return list;
    },
    queryRoleAreaOptionReport(adminId1) {
        let list = [];
        let districts = JSON.parse(Assets.getText('geoData/district.json'));
        districts.map(function (o) {
            if (o.properties.ADMIN_ID1 === adminId1) {
                list.push({
                    label: `${o.properties.ADMIN_ID2} | ${o.properties.NAME2}`,
                    value: `${o.properties.ADMIN_ID2}`
                });
            }
        });
        return list;
    }
});