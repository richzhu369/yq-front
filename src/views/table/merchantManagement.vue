<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="createMerchantVisible = true"
      >
        新增商户
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="站点名称" min-width="30px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.Status === 'process'"
            type="text"
            icon="el-icon-loading"
            @click="getCreateStatus(row.MerchantName)"
          >
            {{ row.MerchantName }}
          </el-button>
          <el-button
            v-if="row.Status === 'failed'"
            type="text"
            icon="el-icon-close"
            @click="getCreateStatus(row.MerchantName)"
          >
            {{ row.MerchantName }}
          </el-button>
          <el-button
            v-if="row.Status === 'done'"
            type="text"
            icon="el-icon-check"
            @click="getCreateStatus(row.MerchantName)"
          >
            {{ row.MerchantName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="商户号" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.MerchantCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端域名" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.FrontendDomain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="财务域名" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.CwDomain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="awscf后台域名" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.AwsCdnDomain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cf后台域名" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.CfDomain }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="bindDomain(row.MerchantName)">
            前端域名
          </el-button>
          <el-button size="mini" type="primary" @click="IPwhiteList(row.MerchantName)">
            IP加白
          </el-button>
          <el-button size="mini" type="success" @click="ContinentWhite(row.MerchantName)">
            大洲加白
          </el-button>
          <el-button size="mini" type="warning" @click="CountryWhite(row.MerchantName)">
            国家加白
          </el-button>
          <el-button size="mini" type="danger" @click="deleteMerchant(row.MerchantName)">
            关站
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="创建商户" :visible.sync="createMerchantVisible" @close="cleanCreateForm">
      <el-form :model="form">
        <el-form-item label="商户名称" label-width="120px">
          <el-input v-model="form.merchantName" placeholder="例如: b99" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商户编号" label-width="120px">
          <el-input v-model="form.merchantCode" placeholder="例如: XXX" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createMerchantVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateMerchant">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="`${form.merchantName} 前端域名`" :visible.sync="bindDomainVisible" @close="bindDomainDialogClose">
      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="bindNewDomainDialogVisible = true" @close="bindNewDomainDialogVisible = false">
          增加域名
        </el-button>
      </div>
      <el-table :key="tableKey" :data="merchantDomainList" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="域名" prop="domain" align="center" min-width="100px">
          <template slot-scope="{row}">
            <span>{{ row.domain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" min-width="30px">
          <template slot-scope="{row,$index}">
            <el-button size="mini" type="danger" @click="removeDomain(row.domain,form.merchantName,$index)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="`${form.merchantName} 绑定域名`" :visible.sync="bindNewDomainDialogVisible" width="20%" @close="NewDomainDialogClose">
      <el-form ref="newFrontDomain" :model="newFrontDomain" status-icon :rules="domainRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="前端域名" prop="domain">
          <el-input v-model="newFrontDomain.domain" placeholder="请输入新域名:" autocomplete="off" name="newFrontDomain" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="runBind(newFrontDomain.domain)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer
      :title="form.merchantName"
      :visible.sync="createProgressVisible"
      direction="rtl"
      size="50%"
      @close="stopCheckStatus"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.Icon"
          :type="activity.Type"
          :color="activity.Color"
          :size="activity.Size"
          :timestamp="activity.Timestamp"
        >
          {{ activity.Content }}
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import {
  bindFrontendDomain,
  createMerchant,
  createProgress,
  deleteFrontendDomain,
  fetchList,
  getFrontendDomain
} from '@/api/merchantManagement'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        done: 'success',
        repeat: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const isURL = require('validator/lib/isURL')
    const validateFrontDomain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('域名不可以为空'))
      } else if (/[A-Z]/.test(value)) {
        callback(new Error('域名不能包含大写字母'))
      } else if (!isURL(value, { require_tld: true })) {
        callback(new Error('域名格式不正确.'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      merchantDomainList: null,
      total: 0,
      listLoading: true,
      activities: [],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        ip: undefined,
        type: undefined,
        sort: '+id',
        SiteName: '',
        AwsCdnDomain: '',
        CfDomain: '',
        merchantName: ''
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        SiteName: '',
        AwsCdnDomain: '',
        CfDomain: '',
        type: '',
        status: 'done'
      },
      form: {
        merchantName: '',
        merchantCode: '',
        frontendDomain: ''
      },
      createMerchantVisible: false,
      createProgressVisible: false,
      bindNewDomainDialogVisible: false,
      bindDomainVisible: false,
      MerchantName: '',
      bindDomains: null,
      newFrontDomain: {
        domain: ''
      },
      domainRules: {
        domain: [{ required: true, trigger: 'blur', validator: validateFrontDomain }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    cleanCreateForm() {
      this.form.merchantName = ''
      this.form.merchantCode = ''
    },
    bindDomainDialogClose() {
      this.merchantDomainList = ''
      this.form.frontendDomain = ''
      this.form.merchantName = ''
      this.getList()
    },
    NewDomainDialogClose() {
      this.newFrontDomain.domain = ''
    },
    bindDomain(data) {
      this.form.merchantName = data
      getFrontendDomain(this.form).then(response => {
        if (response.data.items.length === 0) {
          this.$message.info('当前商户，未绑定域名')
          this.bindNewDomainDialogVisible = true
        } else {
          this.merchantDomainList = response.data.items
          this.bindDomainVisible = true
          // const split = response.data.items.split(',')
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error(error)
      })
    },
    runBind(domain) {
      this.$refs.newFrontDomain.validate(valid => {
        if (valid) {
          const formData = new FormData()
          formData.append('merchantName', this.form.merchantName)
          formData.append('frontendDomain', domain)
          bindFrontendDomain(formData)
            .then(res => {
              this.$message.success('绑定域名成功')
              this.bindNewDomainDialogVisible = false
              this.bindDomainVisible = false
              this.getList()
              this.newFrontDomain.domain = ''
            })
            .catch(error => {
              this.$message.error(error.msg)
              console.log(error)
            })
        } else {
          console.log('表单验证不通过')
        }
      })
    },
    handleCreateMerchant() {
      const formData = new FormData()
      formData.append('merchantName', this.form.merchantName)
      formData.append('merchantCode', this.form.merchantCode)

      createMerchant(formData).then((res) => {
        // 并设置 listLoading 为 false
        this.listLoading = false
        this.createMerchantVisible = false
        if (res.res === 'success') {
          // 如果是 success，则执行 startCheckStatus
          this.$message.success('开始创建商户')
        }
        // 当 Promise 解决时，调用 getList
        this.getList()
      }).catch((error) => {
        // 如果有错误，同样需要设置 listLoading 为 false
        this.listLoading = false
        console.log('create merchant error:', error)
      })
    },
    getCreateStatus(data) {
      this.activities = []
      this.createProgressVisible = true
      this.MerchantName = data
      this.form.merchantName = data
      createProgress(this.MerchantName).then((res) => {
        this.activities = res.data.items
        this.$message.info(this.activities)
        // 当 Promise 解决时，调用 getList
        this.getList()
        // 并设置 listLoading 为 false
        this.listLoading = false
        this.createMerchantVisible = false

        // 如果定时器已存在就清除
        if (this.intervalId) {
          clearInterval(this.intervalId)
        }
        this.intervalId = setInterval(() => this.getProgress(res), 2000)
      }).catch(() => {
        // 如果有错误，同样需要设置 listLoading 为 false
        this.listLoading = false
      })
    },
    getProgress() {
      createProgress(this.MerchantName).then((res) => {
        // 更新 activities 数组为最新的进度信息
        this.activities = res.data.items
        // 可选：如果需要，可以在这里调用 resolve
      }).catch((error) => {
        console.log('Error fetching progress:', error)
        // 可选：如果需要，可以在这里调用 reject
      })
    },
    stopCheckStatus() {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.form.merchantCode = ''
      this.form.merchantName = ''
    },
    deleteMerchant() {
      this.$message.info('这个功能开发中。')
    },
    removeDomain(domain, merchantName, index) {
      const formData = new FormData()
      formData.append('merchantName', merchantName)
      formData.append('deleteDomain', domain)

      deleteFrontendDomain(formData).then((res) => {
        this.merchantDomainList.splice(index, 1)
        this.$message.success('前端域名删除成功')
      }).catch((error) => {
        this.$message.error('前端域名删除失败:' + error)
        console.log(error)
      })
    }
  }
}
</script>
