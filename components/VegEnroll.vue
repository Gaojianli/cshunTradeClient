<template>
  <v-layout justify-center column>
    <!-- form -->
    <v-flex xs12>
      <v-form v-model="valid">
        <v-text-field label="生产主体" v-model="form.mainBody" :disabled="!editable"></v-text-field>
        <v-select :items="bodyTypes" label="主体类型" v-model="form.mainBodyType" :disabled="!editable"></v-select>
        <v-text-field label="主体负责人" v-model="form.principal" :disabled="!editable"></v-text-field>
        <v-text-field label="主体负责人联系方式" v-model="form.contacts" :disabled="!editable"></v-text-field>
        <v-text-field label="乡镇" v-model="form.town" :disabled="!editable"></v-text-field>
        <v-text-field label="所在村（社区）" v-model="form.street" :disabled="!editable"></v-text-field>
        <v-text-field label="种植面积" suffix="亩" v-model="form.area" :disabled="!editable"></v-text-field>
        <v-text-field label="预计总产量" suffix="斤" v-model="form.yield" :disabled="!editable"></v-text-field>
        <v-select :items="schema" label="一级品种分类" v-model="form.category" :disabled="!editable"></v-select>
        <v-text-field label="二级品种分类" v-model="form.categorySecondary" :disabled="!editable"></v-text-field>
        <!-- 种植日期 -->
        <v-dialog ref="dialog" v-model="modal.plant_date" :persistent="editable" lazy full-width
          width="290px">
          <v-text-field slot="activator" v-model="form.plantDate" label="种植时间" prepend-icon="fas fa-calendar-alt"
            readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.plantDate" scrollable @input="modal.plant_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 预计上市时间 -->
        <v-dialog ref="dialog" v-model="modal.begin_date" :persistent="editable" lazy full-width
          width="290px">
          <v-text-field slot="activator" v-model="form.marketBeginDate" label="预计上市时间" prepend-icon="fas fa-calendar-alt"
            readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.marketBeginDate" scrollable @input="modal.begin_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 上市结束时间 -->
        <v-dialog ref="dialog" v-model="modal.end_date" :persistent="editable" lazy full-width
          width="290px">
          <v-text-field slot="activator" v-model="form.marketEndDate" label="上市结束时间" prepend-icon="fas fa-calendar-alt"
            readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.marketEndDate" scrollable @input="modal.end_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <v-radio-group row label="是否有冷链存储:" v-model="form.hasCoolStore">
          <v-radio style="margin-left:20px" label="是" value="true"></v-radio>
          <v-radio label="否" value="false"></v-radio>
        </v-radio-group>
        <v-text-field label="保本销售价格" prefix="￥" suffix="元/每斤" v-model="form.minPrice" :disabled="!editable"></v-text-field>
      </v-form>
    </v-flex>
    <!-- btn -->
    <v-layout xs12 v-if="editable">
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-2" @click="$emit('save', form)" :loading="loading">保存</v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    init_form: {
      type: Object,
      default: () => {
        return {
          mainBody: "",
          principal: "",
          mainBodyType:"",
          contacts: "",
          town: "",
          street: "",
          area: 0,
          yield: 0,
          location: {},
          category: "",
          categorySecondary: "",
          plantDate: "",
          marketBeginDate: "",
          marketEndDate: "",
          hasCoolStore: false,
          minPrice: 0
        };
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      valid: false,
      modal: {
        plant_date: false,
        begin_date: false,
        end_date: false
      },
      form: this.init_form,
      schema: []
    };
  },
  mounted() {
    /**
     * 获取果蔬登记一级分类
     */
    this.$axios
      .$get("configs/VegCategories")
      .then(data => {
        this.schema = data;
      })
      .catch(err => {
        console.log(err);
        alert("获取分类异常");
      });
      this.bodyTypes=new Array('大户','合作社','企业');
  }
};
</script>

<style>
div.v-input__slot > div > input[type="text"] {
  color: #333;
}
</style>
