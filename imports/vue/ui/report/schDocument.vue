<!--suppress ALL -->
<template>
    <div class="schDocument-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span> {{langConfig['titleFilter']}} <i class="header-icon el-icon-info"></i></span>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           style="float: right"
                                           size="small">{{langConfig['run']}}
                                </el-button>
                            </div>
                            <el-form :label-position="labelPosition">
                                <el-row type="flex" class="row-bg" justify="center">

                                    <el-col>
                                        <el-form-item :label="langConfig['fileType']">
                                            <el-select filterable v-model="params.fileTypeId" clearable
                                                       :placeholder="langConfig['all']"
                                                       style="width: 95%">
                                                <el-option
                                                        v-for="item in fileTypeOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                    </el-col>

                                    <el-col>
                                        <el-form-item :label="langConfig['name']">
                                            <el-input v-model="params.name"></el-input>
                                        </el-form-item>

                                    </el-col>
                                    <el-col>
                                        <el-form-item :label="langConfig['dateRange']">
                                            <el-date-picker
                                                    align="right" style="width: 95%"
                                                    v-model="params.date"
                                                    type="daterange"
                                                    :picker-options="pickerDateOptions"
                                                    :placeholder="langConfig['pickDateRange']"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row type="flex" class="row-bg" justify="center">
                                    <el-col>
                                        <el-form-item :label="langConfig['description']">
                                            <el-input v-model="params.description"></el-input>
                                        </el-form-item>


                                    </el-col>
                                    <el-col>
                                        <el-form-item :label="langConfig['issueDate']">
                                            <el-date-picker
                                                    v-model="params.issueDate"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col>
                                        <el-form-item :label="langConfig['receivedDate']">
                                            <el-date-picker
                                                    v-model="params.receivedDate"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>

                        </el-card>

                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="margin: 0px !important;">
                <table class="table table-report-block-summary table-bordered">
                      <caption>

                          <div class="row">
                                <div class="col-md-12" style="text-align: center !important;">
                                    <img style="width: auto;height: 100px; float: left;padding-top: 20px !important;"
                                         src="/mih.png"
                                         alt=""
                                         :onLoad="onLoadHandler()">
                                        <span class="blueOnPrint"
                                              style="font-family:Khmer os muol; font-size: 15px  !important;padding-top: 15px !important;float: left;text-align: left !important;">


                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.ministryKhName || ""}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.ministryEnName || ""}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.khName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">    {{waterBillingSetup.enName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">    លេខ៖ .............................</p>

                                            </span>

                              <span style="text-align: center;font-size: 15px; border: 0px !important; float: right;"
                              >
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ព្រះរាជាណាចក្រកម្ពុជា</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">Kingdom Of Cambodia</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                                  <p style="font-family: 'Khmer OS Muol' !important; margin-bottom: 0px !important;"
                                     class="blueOnPrint">Nation Religion King</p>
                                  <p style="font-family:tacteing;font-size: 40px; margin: 0px !important;">6</p>

                              </span>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-md-12  balckOnPrint" style="text-align: center;">
                                                                   <p style="font-family: 'Khmer OS Moul'">របាយការណ៍</p>

                                 {{langConfig['title']}}
                                  <br>
                                  <p style="font-family:tacteing ">rs</p>
                              </div>
                          </div><div class="row">
                              <div style="widows: 50% !important; float:right">
                                  </div>
                              <div style="width: 50% !important;">
                                  {{langConfig['date']}}: {{dateHeader}}
                              </div>

                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <th>{{langConfig['no']}}</th>
                        <th>{{langConfig['name']}}</th>
                        <th>{{langConfig['issueDate']}}</th>
                        <th>{{langConfig['receivedDate']}}</th>
                        <th>{{langConfig['documentType']}}</th>
                        <th>{{langConfig['desc']}}</th>
                        <th>{{langConfig['link']}}</th>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="documentHtml">

                </tbody>


            </table>
                 <div class="row" style="width: 100% !important;">
                    <div style="width: 50%;float: left !important;text-align: center !important;">
                        បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br><br>
                        ថ្ងៃ ........................    ខែ  ........................ឆ្នាំ .................................<br><br>
                        .......................... ថ្ងៃទី ............    ខែ  ....................  ឆ្នាំ ...................<br><br><span
                            style="font-family: 'Khmer OS Muol'">ហត្ថលេខា</span>
                    </div>

                    <div style="width: 50%;float: right !important;text-align: center !important;">
                          ថ្ងៃ ........................    ខែ  ........................ឆ្នាំ .................................<br><br>
                        .......................... ថ្ងៃទី  ............ ខែ   ....................  ឆ្នាំ  ...................<br><br><b>រៀបចំដោយ</b><br><br>
                    </div>

                </div>
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';
    import compoLangReport from '../../../../both/i18n/lang/elem-label-sch-report';

    export default {
        mixins: [GenerateFile],
        mounted() {
            this.$jQuery('body').off();

        },
        data() {
            return {
                params: {
                    branch: '',
                    area: '',
                    date: [],
                    //date: [moment().startOf("months").toDate(), moment().endOf("months").toDate()],
                    issueDate: "",
                    receivedDate: "",
                    fileTypeId: "",
                    organizationId: "",
                    description: "",
                    name: ""

                },
                rolesArea: '',
                activeName: '1',
                documentHtml: "",
                labelPosition: 'top',
                branchOptions: [],
                areaOptions: [],
                teacherOptions: [],
                activityOptions: [],
                organizationOptions: [],
                fileTypeOptions: [],
                positionOptions: [],

                waterBillingSetup: {
                    khName: '',
                    enName: ''
                },

                loading: false,
                exportLoading: false,

                checkAll: false,
                isIndeterminate: true,
                dateHeader: "",
                currencyHeader: "",
                pickerDateOptions: {
                    shortcuts: [{
                        text: 'Last Year',
                        onClick(picker) {
                            const end = moment().add(-1, "year").endOf("year").toDate();
                            const start = moment().add(-1, "year").startOf("year").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'This Year',
                        onClick(picker) {
                            const end = moment().endOf("year").toDate();
                            const start = moment().startOf("year").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last week',
                        onClick(picker) {
                            const end = moment().endOf("day").toDate();
                            const start = moment().startOf("day").toDate();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last month',
                        onClick(picker) {
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-1, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick(picker) {
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-4, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'This month',
                        onClick(picker) {
                            const end = moment().endOf("month").toDate();
                            const start = moment().startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Today',
                        onClick(picker) {
                            const end = moment().endOf("day").toDate();
                            const start = moment().startOf("day").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                groupByOptions: [
                    {label: "None", value: "None"},
                    {label: "Transaction Type", value: "Transaction Type"},
                    {label: "Customer", value: "Customer"},
                    {label: "Item", value: "Item"},
                    {label: "Day", value: "Day"},
                    {label: "Week", value: "Week"},
                    {label: "Month", value: "Month"},
                    {label: "Quarter", value: "Quarter"},
                    {label: "Year", value: "Year"},
                ]
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            },
            langSessionReport() {
                return Session.get('lang') || "en";
            }
        },
        watch: {

            "params.branch"(val) {
                this.params.area = "";
                this.fetchArea(val);
            },
            "params.programId"(val) {
                if (val !== "") {
                    this.fetchMajor(val);
                } else {
                    this.params.majorId = "";
                }
            },
            "params.majorId"(val) {
                if (val !== "") {
                    this.fetchLevel(val);
                } else {
                    this.params.levelId = "";
                }
            }
        },
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            /*this.fetchBranch();
            this.fetchTeacher();
            this.fetchActivity();
            this.fetchOrganization();*/
            this.fetchFileType();
            // this.fetchPosition();
        },
        methods: {

            fetchBranch() {
                Meteor.call("queryRoleBranchOptionReport", (err, result) => {
                    if (result) {
                        this.branchOptions = result;
                    }
                })
            },
            fetchArea(branchList) {
                Meteor.call("queryRoleAreaOptionReport", branchList, (err, result) => {
                    if (result) {
                        this.areaOptions = result;
                    }
                })
            },
            fetchTeacher() {
                let selector = {};
                Meteor.call("queryTeacherOption", selector, (err, result) => {
                    if (result) {
                        this.teacherOptions = result;
                    }
                })
            },
            fetchActivity() {
                let selector = {};
                Meteor.call("queryActivityOption", selector, (err, result) => {
                    if (result) {
                        this.activityOptions = result;
                    }
                })
            },
            fetchPosition() {
                let selector = {};
                Meteor.call("queryPositionOption", selector, (err, result) => {
                    if (result) {
                        this.positionOptions = result;
                    }
                })
            },
            fetchFileType(q) {
                Meteor.call("queryFileTypeOption", q, (err, result) => {
                    if (result) {
                        this.fileTypeOptions = result;
                    }
                })
            },
            fetchOrganization() {
                let selector = {};
                Meteor.call("queryOrganizationOption", selector, (err, result) => {
                    if (result) {
                        this.organizationOptions = result;
                    }
                })
            },
            handleRun() {
                this.loading = true;

                /*if (this.params.date == "" || this.params.date == undefined) {
                    alertify.error("Date can't not empty!!");
                    this.loading = false;
                    return false;
                }*/
                Meteor.call('schDocumentReport', this.params, this.langConfig, (err, result) => {
                    if (result) {
                        this.documentHtml = result.documentHTML;
                        this.dateHeader = result.dateHeader;
                    }
                    this.loading = false;
                });
            },
            onLoadHandler: function () {
                this.onLoad = true;
            }


        },
        computed: {
            dataExist() {
                // return this.posSaleData.length > 0;
            },
            langConfig() {
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['document'];
                return data;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }
</style>