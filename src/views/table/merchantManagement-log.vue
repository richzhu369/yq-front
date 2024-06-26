<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="IP" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.opUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.CreatedAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchLogList } from '@/api/ingressWhitelist'
import waves from '@/directive/waves' // waves directive
import { opIP } from '@/api/ingressWhitelist'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        ip: undefined,
        type: undefined,
        sort: '+id'
      },
      statusOptions: ['done', 'repeat', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        ip: '',
        type: '',
        status: 'done'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchLogList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleAddIP() {
      this.listLoading = true
      const formData = new FormData()
      formData.append('ips', this.listQuery.ip)
      formData.append('act', 'add')
      formData.append('opUser', 'admin')
      opIP(formData).then(() => {
        // 当 Promise 解决时，调用 getList
        this.getList()
        // 并设置 listLoading 为 false
        this.listLoading = false
      }).catch((error) => {
        // 如果有错误，同样需要设置 listLoading 为 false
        this.listLoading = false
        console.error('Error adding IP:', error);
      })
    },
    handleDelIP(row) {
      this.listLoading = true
      const formData = new FormData()
      formData.append('ips', row)
      formData.append('act', 'del')
      formData.append('opUser', 'admin')
      opIP(formData).then(() => {
        // 当 Promise 解决时，调用 getList
        this.getList()
        // 并设置 listLoading 为 false
        this.listLoading = false
      }).catch((error) => {
        // 如果有错误，同样需要设置 listLoading 为 false
        this.listLoading = false
        console.error('Error adding IP:', error);
      })
    }
  }
}
</script>
