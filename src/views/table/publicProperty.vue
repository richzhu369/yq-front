<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        创建资产
      </el-button>
    </div>

    <el-table
      :data="formattedList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="配置名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置值" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" min-width="150px">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="showEditDialog(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="form.key" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="当前值" label-width="120px">
          <el-input v-model="form.oldValue" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请输入新值" label-width="120px">
          <el-input v-model="form.newValue" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { editPublicProperty, getPublicProperty } from '@/api/publicProperty'

export default {
  name: 'ComplexTable',
  directives: { waves },
  data() {
    return {
      visible: false,
      tableKey: 0,
      list: [], // 原始数据列表
      formattedList: [], // 格式化后的数据列表
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        key: '',
        oldValue: 'aaaa',
        newValue: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getPublicProperty().then(response => {
        this.listLoading = true
        const data = response.data.items
        this.list = data
        this.formattedList = this.formatData(data)
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.error('获取数据失败:', error)
      })
    },
    formatData(data) {
      return Object.keys(data).map(key => ({
        key: key,
        value: data[key]
      }))
    },
    handleCreate() {
      this.$message({
        message: '暂不支持'
      })
    },
    showEditDialog(data) {
      this.form.key = data.key
      this.form.oldValue = data.value
      this.form.newValue = ''
      this.dialogFormVisible = true
    },
    handleEdit() {
      editPublicProperty(this.form).then(response => {
        const data = response.data.message
        this.list = data
        this.formattedList = this.formatData(data)
      }).catch(error => {
        console.error('获取数据失败:', error)
      })
      this.dialogFormVisible = false
      this.getList()

      this.$message({
        message: '修改成功',
        type: 'success'
      })

    }
  }
}
</script>
