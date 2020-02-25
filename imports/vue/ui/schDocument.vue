<template>
    <div class="sch_document">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="clickAddDocument()">
                            <i class="fa fa-plus"></i> {{langConfig['title']}}
                        </a>
                    </h4>
                </el-col>
                <el-col :span="16" style="text-align: right; margin-right: 10px">
                    <br>
                    <el-row type="flex" justify="center">
                        <el-col :span="8"></el-col>
                        <el-col :span="8"></el-col>
                        <el-col :span="8">
                            <el-input
                                    :placeholder="langConfig['searchHere']"
                                    suffix-icon="el-icon-search"
                                    v-model="searchData"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr>
            <br>
            <slot v-if="loading">
                <div class="row">
                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                        <!--<loader></loader>-->
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        v-loading="newLoading"
                        :data="schDocumentData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            :label="langConfig['name']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="dateName"
                            :label="langConfig['date']">
                    </el-table-column>
                    <el-table-column
                            prop="receivedDateName"
                            :label="langConfig['receivedDate']">
                    </el-table-column>
                    <el-table-column
                            prop="documentTypeDoc.name"
                            :label="langConfig['documentType']">
                    </el-table-column>
                    <el-table-column
                            prop="link"
                            :label="langConfig['link']">
                        <template slot-scope="scope">
                            <a v-for="(d,index) in scope.row.link" :href="d.fileName" target="_blank">
                                {{d.fileName ? " File"+(index+1) : ""}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="desc"
                            :label="langConfig['desc']">
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="120"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeSchDocument(scope.$index,scope.row,schDocumentData)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="findSchDocumentById(scope),dialogUpdateSchDocument= true"
                                           :disabled="disabledUpdate"></el-button>
                            </el-button-group>

                        </template>
                    </el-table-column>

                </el-table>
                <!--Pagination-->
                <br>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24" style="text-align: center;">
                        <div class="block">
                            <el-pagination @size-change="handleSizeChange" background
                                           @current-change="handleCurrentChange"
                                           :current-page.sync="currentPage" :page-sizes="[10,20, 50, 100,200]"
                                           :page-size="currentSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="count">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <br>
            </slot>
            <!--End Pagination-->
        </div>

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['add']"
                :visible.sync="dialogAddSchDocument"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schDocumentForm" :rules="rules" ref="schDocumentFormAdd" label-width="150px"
                     class="schDocumentForm">
                <el-form-item :label="langConfig['name']" prop="name">
                    <el-input v-model="schDocumentForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['date']" prop="date">
                    <el-date-picker
                            v-model="schDocumentForm.date"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="langConfig['receivedDate']" prop="receivedDate">
                    <el-date-picker
                            v-model="schDocumentForm.receivedDate"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="langConfig['documentType']" prop="documentType">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schDocumentForm.documentType" remote :remote-method="documentTypeOpt"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in documentTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['link']" prop="link">

                    <el-table
                            :data="schDocumentForm.link"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                :index="indexMethod">
                        </el-table-column>
                        <el-table-column
                                :label="langConfig['link']">
                            <template slot-scope="scope">
                                <el-input type="text" v-model="scope.row.fileName"
                                          @keyup.native="handleEditFileName(scope.$index, scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                :label="langConfig['action']"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                           size="small"
                                           @click="handleAddFileName()"

                                ></el-button>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                           size="small"
                                           @click="removeFileNameData(scope.$index,scope.row)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :label="langConfig['desc']" prop="desc">
                    <el-input type="textarea" v-model="schDocumentForm.desc"></el-input>
                </el-form-item>

                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddSchDocument = false, cancel()">{{langConfig['cancel']}} <i>(ESC)</i>
                    </el-button>
                    <el-button type="primary" @click="saveSchDocument($event)">{{langConfig['save']}} <i>(Ctrl +
                        Enter)</i></el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['update']"
                :visible.sync="dialogUpdateSchDocument"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schDocumentForm" :rules="rules" ref="schDocumentFormUpdate" label-width="150px"
                     class="schDocumentForm">

                <el-form-item :label="langConfig['name']" prop="name">
                    <el-input v-model="schDocumentForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['date']" prop="date">
                    <el-date-picker
                            v-model="schDocumentForm.date"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="langConfig['receivedDate']" prop="receivedDate">
                    <el-date-picker
                            v-model="schDocumentForm.receivedDate"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="langConfig['documentType']" prop="documentType">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schDocumentForm.documentType" remote :remote-method="documentTypeOpt"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in documentTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['link']" prop="link">
                    <el-table
                            :data="schDocumentForm.link"
                            stripe
                            style="width: 100%">
                        <el-table-column
                                type="index"
                                :index="indexMethod">
                        </el-table-column>
                        <el-table-column
                                :label="langConfig['link']">
                            <template slot-scope="scope">
                                <el-input type="text" v-model="scope.row.fileName"
                                          @keyup.native="handleEditFileName(scope.$index, scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                :label="langConfig['action']"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                           size="small"
                                           @click="handleAddFileName()"

                                ></el-button>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                           size="small"
                                           @click="removeFileNameData(scope.$index,scope.row)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item :label="langConfig['desc']" prop="desc">
                    <el-input type="textarea" v-model="schDocumentForm.desc"></el-input>
                </el-form-item>

                <input type="hidden" v-model="schDocumentForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateSchDocument = false ,cancel()">{{langConfig['cancel']}} <i>(ESC)</i>
                    </el-button>
                    <el-button type="primary" @click="updateSchDocument">{{langConfig['save']}} <i>(Ctrl + Enter)</i>
                    </el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import compoLang from '../../../both/i18n/lang/elem-label-sch'
    import {Sch_DocumentReact} from "../../collection/schDocument";

    export default {
        meteor: {
            langSession() {
                return Session.get('lang') || "en";
            },
            disabledRemove() {
                return Session.get("canRemove");
            },
            disabledUpdate() {
                return Session.get("canUpdate");
            },
            newRe() {
                let vm = this;
                Sch_DocumentReact.find({}).fetch();
                vm.queryData(vm.searchData, vm.skip, vm.currentSize + vm.skip);
            }
        },
        mounted() {
            this.$jQuery('body').off();

        },
        data() {
            return {
                newLoading: true,
                schDocumentData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddSchDocument: false,
                dialogUpdateSchDocument: false,
                documentTypeList: [],
                schDocumentForm: {
                    name: "",
                    date: "",
                    dateName: "",
                    receivedDate: "",
                    receivedDateName: "",
                    link: [{fileName: ""}],
                    documentType: "",
                    desc: "",
                    _id: ""
                },
                rules: {
                    name: [{required: true, message: 'Please input name', trigger: 'blur'}],
                },
                skip: 0
            }
        },
        watch: {
            currentSize(val) {
                this.isSearching = true;
                this.skip = (this.currentPage - 1) * val;
                this.queryData(this.searchData, this.skip, val + this.skip);
            },
            currentPage(val) {
                this.isSearching = true;
                this.skip = (val - 1) * this.currentSize;
                this.queryData(this.searchData, this.skip, this.currentSize + this.skip);
            },
            searchData(val) {
                this.isSearching = true;
                this.skip = (this.currentPage - 1) * this.currentSize;
                this.queryData(val, this.skip, this.currentSize + this.skip);
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            queryData: _.debounce(function (val, skip, limit) {
                this.newLoading = true;
                Meteor.call('querySchDocument', {
                    q: val,
                    filter: this.filter,
                    rolesArea: Session.get('area'),
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.schDocumentData = result.content;
                        this.count = result.countSchDocument;
                    }
                    this.isSearching = false;
                    this.newLoading = false;
                });
            }, 300),

            fetchUser() {
                Meteor.call("queryUserOption", (err, result) => {
                    this.applyUserOption = result;
                })
            },
            documentTypeOpt(q) {
                Meteor.call('queryFileTypeOption',q || "", (err, result) => {
                    this.documentTypeList = result;
                })
            },
            saveSchDocument() {
                let vm = this;
                this.$refs["schDocumentFormAdd"].validate((valid) => {
                    if (valid) {
                        let schDocumentDoc = {
                            name: vm.schDocumentForm.name,
                            link: vm.schDocumentForm.link,
                            date: vm.schDocumentForm.date,
                            dateName: moment(vm.schDocumentForm.date).format("DD/MM/YYYY"),
                            receivedDate: vm.schDocumentForm.receivedDate,
                            receivedDateName: moment(vm.schDocumentForm.receivedDate).format("DD/MM/YYYY"),
                            documentType: vm.schDocumentForm.documentType,
                            desc: vm.schDocumentForm.desc,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("insertSchDocument", schDocumentDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddSchDocument = false;

                                vm.$refs["schDocumentFormAdd"].resetFields();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: err.message,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            updateSchDocument() {
                let vm = this;
                this.$refs["schDocumentFormUpdate"].validate((valid) => {
                    if (valid) {
                        let schDocumentDoc = {
                            _id: vm.schDocumentForm._id,
                            name: vm.schDocumentForm.name,
                            link: vm.schDocumentForm.link,
                            date: vm.schDocumentForm.date,
                            dateName: moment(vm.schDocumentForm.date).format("DD/MM/YYYY"),
                            receivedDate: vm.schDocumentForm.receivedDate,
                            receivedDateName: moment(vm.schDocumentForm.receivedDate).format("DD/MM/YYYY"),
                            documentType: vm.schDocumentForm.documentType,
                            desc: vm.schDocumentForm.desc,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("updateSchDocument", schDocumentDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogUpdateSchDocument = false;

                                vm.$refs["schDocumentFormUpdate"].resetFields();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Failed
                        !`,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            removeSchDocument(index, row, rows) {
                let vm = this;
                this.$confirm('This will permanently delete the Item. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeSchDocument", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `
                        លុប ${row.code} : ${row.name} បានជោគជ័យ`,
                                type: 'success'
                            });


                        } else {
                            vm.$message({
                                type: 'error',
                                message: 'Delete Fialed'
                            });
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });


            },
            findSchDocumentById(doc) {
                let vm = this;
                vm.schDocumentForm = {};
                Meteor.call("querySchDocumentById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schDocumentForm._id = result._id;
                        vm.schDocumentForm = result;
                        if (result.link && result.link.length === 0 || result.link === undefined) {
                            vm.schDocumentForm.link = [{
                                fileName: "",
                            }];
                        }
                    }
                })
            },
            handleAddFileName() {
                this.schDocumentForm.link.push({
                    fileName: ""
                })
            },
            handleEditFileName(index, row) {
                this.schDocumentForm.link[index] = row;
            },
            removeFileNameData(index, row) {
                if (this.schDocumentForm.link.length > 1) {
                    this.schDocumentForm.link.splice(index, 1);
                    this.$message({
                        message: `លុប បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.schDocumentForm.link = [{
                        fileName: "",
                    }];
                }
            },
            indexMethod(index) {
                return index + 1;
            },
            cancel() {
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
            },
            resetForm() {
                this.schDocumentForm._id = "";

                this.schDocumentForm.link = [{
                    fileName: "",
                }];
                if (this.$refs["schDocumentFormAdd"]) {
                    this.$refs["schDocumentFormAdd"].resetFields();
                }

                if (this.$refs["schDocumentFormUpdate"]) {
                    this.$refs["schDocumentFormUpdate"].resetFields();
                }

            },
            clickAddDocument() {
                this.schDocumentForm.link = [{
                    fileName: ""
                }];
                this.dialogAddSchDocument = true;
            }
        },
        created() {
            this.isSearching = true;
            this.fetchUser();
            this.documentTypeOpt();
            this.queryData();
            Meteor.subscribe('Sch_DocumentReact');

        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['document'];
                return data;
            }
        }
    }
</script>