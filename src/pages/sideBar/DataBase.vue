<template>
  <div id="DataBase">
    <el-tabs v-model="activeName">
      <el-tab-pane label="激励计划" name="EncouragePlan">
        <encourage-plan v-if="activeName === 'EncouragePlan'"></encourage-plan>
      </el-tab-pane>
      <el-tab-pane label="授予协议" name="GrantProtocol">
        <grant-protocol v-if="activeName === 'GrantProtocol'"></grant-protocol>
      </el-tab-pane>
      <el-tab-pane label="模板文档" name="TemplateDoc">
        <template-doc v-if="activeName === 'TemplateDoc'"></template-doc>
      </el-tab-pane>
      <el-tab-pane label="成熟计划模板" name="MaturePlanTemplate">
        <mature-plan-template v-if="activeName === 'MaturePlanTemplate'"></mature-plan-template>
      </el-tab-pane>
      <el-tab-pane label="解限计划模板" name="NoLimitPlanTemplate">
        <no-limit-plan-template v-if="activeName === 'NoLimitPlanTemplate'"></no-limit-plan-template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import EncouragePlan from '../views/dataBase/EncouragePlan.vue'
  import GrantProtocol from '../views/dataBase/GrantProtocol.vue'
  import TemplateDoc from '../views/dataBase/TemplateDoc.vue'
  import MaturePlanTemplate from '../views/dataBase/MaturePlanTemplate.vue'
  import NoLimitPlanTemplate from '../views/dataBase/NoLimitPlanTemplate.vue'
  export default{
    data () {
      return {
        activeName: 'EncouragePlan'
      }
    },
    components: {
      EncouragePlan,
      GrantProtocol,
      TemplateDoc,
      MaturePlanTemplate,
      NoLimitPlanTemplate
    }
  }
</script>

<style>

</style>
