<template>
    <div class="sch_inputScore">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" style="text-align: center !important;">
                            សូមវាយបញ្ចូល <b> -1 </b>ប្រសិនបើសិស្សអវត្តមាន <br><br> បញ្ចូលពិន្ទុហើយសូមចុច <b>Enter</b>
                        </a>
                    </h4>
                </el-col>
                <el-col :span="16" style="text-align: right; margin-right: 10px">
                    <br>
                    <el-row type="flex" justify="center">
                        <el-col :span="16" style="text-align: left !important;">
                        </el-col>
                        <el-col :span="8">
                            <el-col>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           style="float: right"
                                           size="small">{{langConfig['run']}}
                                </el-button>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr>
            <el-form :label-position="labelPosition" :model="params" :rules="rules" ref="schInputScore">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col>
                        <el-form-item :label="langConfig['program']" prop="programId">
                            <el-select filterable v-model="params.programId" clearable
                                       :placeholder="langConfig['selectOne']"
                                       style="width: 95%">
                                <el-option
                                        v-for="item in programOptions"
                                        :label="item.label"
                                        :value="item.value" :key="item._id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col>
                        <el-form-item :label="langConfig['major']" prop="majorId">
                            <el-select filterable v-model="params.majorId" clearable
                                       :placeholder="langConfig['selectOne']"
                                       style="width: 95%">
                                <el-option
                                        v-for="item in majorOptions"
                                        :label="item.label"
                                        :value="item.value" :key="item._id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>

                    <el-col>
                        <el-form-item :label="langConfig['generation']" prop="generation">
                            <el-input-number v-model="params.generation"
                                             controls-position="right"
                                             :min="1"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="langConfig['examDate']" prop="examDate">
                            <el-date-picker
                                    align="right" style="width: 95%"
                                    v-model="params.examDate"
                                    type="daterange"
                                    :placeholder="langConfig['pickDateRange']"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col>
                        <el-form-item :label="langConfig['year']" prop="year">
                            <el-select filterable v-model="params.year" clearable
                                       :placeholder="langConfig['selectOne']"
                                       style="width: 95%">
                                <el-option
                                        v-for="item in yearOptions"
                                        :label="item.label"
                                        :value="item.value" :key="item._id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col>

                        <el-form-item :label="langConfig['semester']" prop="semester">
                            <el-select filterable v-model="params.semester" clearable
                                       :placeholder="langConfig['selectOne']"
                                       style="width: 95%">
                                <el-option
                                        v-for="item in semesterOptions"
                                        :label="item.label"
                                        :value="item.value" :key="item._id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item :label="langConfig['subject']" prop="subjectId">
                            <el-select filterable v-model="params.subjectId" clearable
                                       :placeholder="langConfig['selectOne']" remote :remote-method="fetchSubject"
                                       style="width: 95%">
                                <el-option
                                        v-for="item in subjectOptions"
                                        :label="item.label"
                                        :value="item.value" :key="item._id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col></el-col>
                </el-row>
            </el-form>
            <hr>
            <slot v-if="loading">
                <div class="row">
                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                        <!--<loader></loader>-->
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        :data="schInputScoreData"
                        stripe
                        v-loading="loading"
                        border
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="120"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="studentDoc.personal.name"
                            :label="langConfig['name']"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="studentDoc.personal.gender"
                            :label="langConfig['gender']"
                    >
                        <template slot-scope="scope">
                            {{scope.row.studentDoc.personal.gender==="Male" ? "ប" :"ស"}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['score']"
                    >
                        <template slot-scope="scope">
                            <el-input type=number v-model.number="scope.row.score"
                                      class="cursor-pointer"
                                      :ref="setTab(scope.$index)"
                                      :placeholder="langConfig['score']"
                                      controls="false"
                                      @keyup.native.enter="moveDown(scope.$index,scope.row)"
                                      @keyup.native="handleInputScore(scope.$index, scope.row)"
                                      @change.native="handleInputScore(scope.$index, scope.row)"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['grades']"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.grade"
                                      :placeholder="langConfig['grades']" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['gradePoint']"
                    >
                        <template slot-scope="scope">
                            <el-input type=number v-model.number="scope.row.gradePoint"
                                      :placeholder="langConfig['gradePoint']" disabled></el-input>
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
    </div>
</template>
<script>
    import compoLang from '../../../both/i18n/lang/elem-label-sch'

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
                //vm.queryData(vm.searchData, vm.skip, vm.currentSize + vm.skip);
            }
        },
        mounted() {
            this.$jQuery('body').off();
            this.$jQuery('body').on('focus', 'input[type=number]', function(e) {
                $(this).on('wheel', function(e) {
                    e.preventDefault();
                });
            });
        },
        data() {
            return {
                schInputScoreData: [],
                loading: false,
                searchData: '',
                labelPosition: "top",
                isSearching: false,
                currentPage: 1,
                currentSize: 200,
                count: 0,
                dialogAddSchInputScore: false,
                dialogUpdateSchInputScore: false,
                programList: [],
                facultyList: [],
                subjectOptions: [],
                programOptions: [],
                majorOptions: [],
                subjectName: "",
                yearOptions: [
                    {label: "1", value: 1},
                    {label: "2", value: 2},
                    {label: "3", value: 3},
                    {label: "4", value: 4},
                ],
                semesterOptions: [
                    {label: "1", value: 1},
                    {label: "2", value: 2}
                ],

                params: {
                    programId: "",
                    majorId: "",
                    year: "",
                    generation: 1,
                    subjectId: "",
                    semester: "",
                    examDate: [],
                    rolesArea: Session.get("area")

                },
                schInputScoreForm: {
                    name: "",
                    khName: "",
                    code: "",
                    desc: "",
                    _id: "",
                    programId: "",
                    facultyId: "",
                    degree: ""
                },
                rules: {
                    programId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose program',
                            trigger: 'change'
                        }],
                    majorId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose major',
                            trigger: 'change'
                        }],
                    examDate:
                        [{
                            required: true,
                            message: 'Please select exam date',
                            trigger: 'blur'
                        }],
                    subjectId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose subject',
                            trigger: 'change'
                        }],
                    year:
                        [{
                            required: true,
                            type: "number",
                            message: 'Please choose year',
                            trigger: 'change'
                        }],
                    semester:
                        [{
                            required: true,
                            type: "number",
                            message: 'Please choose semester',
                            trigger: 'change'
                        }],
                    generation:
                        [{
                            required: true,
                            type: "number",
                            message: 'Please choose generation',
                            trigger: 'blur'
                        }]
                },
                skip: 0,
                mentionRange: [],
                curiculmnDoc: {}
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
            },
            "params.programId"(val) {
                if (val !== "") {
                    this.fetchMajor(val);
                } else {
                    this.params.majorId = "";
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            handleRun() {
                let vm = this;
                vm.$refs["schInputScore"].validate((valid) => {
                    if (valid) {
                        vm.queryData();

                    }
                })
            },
            queryData: _.debounce(function (val, skip, limit) {
                let vm = this;
                vm.loading = true;
                Meteor.call("generateInsertSchInputScore", this.params, (err, re) => {
                    if (!err) {
                        Meteor.call('querySchInputScore', {
                            q: val,
                            params: vm.params,
                            filter: vm.filter,
                            options: {skip: skip || 0, limit: limit || 200}
                        }, (err, result) => {
                            if (!err) {
                                vm.schInputScoreData = result.content;
                                vm.count = result.countSchInputScore;
                            }
                            vm.isSearching = false;
                            vm.loading = false;
                            vm.getCuriculmnByMajorId(vm.params.majorId);

                        });
                    }
                })

            }, 300),
            fetchProgram() {
                let selector = {};
                Meteor.call("queryProgramOption", selector, (err, result) => {
                    if (result) {
                        this.programOptions = result;
                    }
                })
            },
            fetchMajor(programId) {
                let selector = {};
                selector.programId = programId;
                Meteor.call("queryMajorOption", selector, (err, result) => {
                    if (result) {
                        this.majorOptions = result;
                    }
                })
            },
            getCuriculmnByMajorId(majorId) {
                Meteor.call("getCuriculmnByMajor", majorId, (err, result) => {
                    this.curiculmnDoc = result;
                })
            },
            fetchSubject(query) {

                if (!!query) {
                    setTimeout(() => {
                        Meteor.call('querySubjectOptionLimit', query, (err, result) => {
                            if (!err) {
                                this.subjectOptions = result;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    Meteor.call('querySubjectOptionLimit', "", (err, result) => {
                        if (!err) {
                            this.subjectOptions = result;
                        } else {
                            console.log(err.message);
                        }
                    })
                }
            },
            fetchUser() {
                Meteor.call("queryUserOption", (err, result) => {
                    this.applyUserOption = result;
                })
            },
            moveUp(index, row) {
                if (row.score === "" || row.score == "-") {
                    this.$message({
                        type: 'info',
                        message: 'ពិន្ទុមិនអាចទទេរ!!'
                    });
                    return false;
                }
                if (index || index == 0) {
                    let nextIndex = index > 0 ? `tab${index - 1}` : `tab0`;
                    let ref = this.$refs[nextIndex]
                    setTimeout(function () {
                        ref && ref.$refs.input.select()
                    }, 100)

                    this.scrollDownWithIndex(index);
                }
            },
            moveDown(index, row) {
                if (row.score === "" || row.score == "-") {
                    this.$message({
                        type: 'error',
                        message: 'ពិន្ទុមិនអាចទទេរ!!'
                    });
                    return false;
                }
                if (index || index == 0) {
                    let nextIndex = `tab${index + 1}`
                    let ref = this.$refs[nextIndex]
                    setTimeout(function () {
                        ref && ref.$refs.input.select()
                    }, 100)

                    this.scrollDownWithIndex(index);

                }
            },
            setTab(index) {
                return `tab${index}`
            },
            scrollDownWithIndex(index) {
                let maxHeigh = $(document).height() - 200; //take out 200px for header
                // let currentView = maxHeigh / this.currentSize;
                let currentView = maxHeigh / this.schInputScoreData.length;
                let scrollDown = index * currentView; //take out 5 px
                $("html, body").animate({scrollTop: scrollDown}, 300);

            },
            handleInputScore: _.debounce(function (index, row) {
                let vm = this;
                if (row.score !== "" && row.score !== "-") {
                    let gradeDoc = this.getMentionByScore(row.score);
                    row.grade = gradeDoc.grade;
                    row.gradePoint = gradeDoc.gradePoint;
                    this.schInputScoreData[row._id] = row;
                    Meteor.call("inputSchScore", row, vm.params, vm.curiculmnDoc, (err, result) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                }
            }, 50)
            ,
            getMentionByScore(val) {
                val = parseFloat(val) || 0;

                function checkMention(range) {
                    return range.from <= val && range.to >= val;
                }

                let data = this.mentionRange.find(checkMention);
                if (data === null || data === undefined) {
                    let newData = {};
                    newData.grade = "Un Range";
                    newData.gradePoint = 0;
                    return newData;
                }
                return data;
            },
            getMention() {
                Meteor.call("querySchMentionByActive", Session.get("area"), (err, result) => {
                    if (result) {
                        this.mentionRange = result.range;
                    }
                });
            },
            resetForm() {
                this.schInputScoreForm._id = "";
                if (this.$refs["schInputScoreFormAdd"]) {
                    this.$refs["schInputScoreFormAdd"].resetFields();
                }

                if (this.$refs["schInputScoreFormUpdate"]) {
                    this.$refs["schInputScoreFormUpdate"].resetFields();
                }

            },
        }
        ,
        created() {
            this.isSearching = true;
            this.fetchUser();
            this.fetchProgram();
            this.fetchSubject("");
            this.getMention();

            /*this.$jQuery('body').on('focus', 'input[type=number]', function(e) {
                $(this).on('wheel', function(e) {
                    e.preventDefault();
                });
            });*/


        }
        ,
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['inputScore'];
                return data;
            }
        }
    }
</script>