<template>
  <v-layout justify-center column>
    <!-- form -->
    <v-flex xs12>
      <v-form v-model="valid">
        <v-text-field label="主体" v-model="form.mainBody" :disabled="!editable"></v-text-field>
        <v-text-field label="主体负责人" v-model="form.principal" :disabled="!editable"></v-text-field>
        <v-text-field label="主体负责人联系方式" v-model="form.contacts" :disabled="!editable"></v-text-field>
        <v-text-field label="乡镇" v-model="form.town" :disabled="!editable"></v-text-field>
        <v-text-field label="街道（村）" v-model="form.street" :disabled="!editable"></v-text-field>
        <v-text-field label="规模数量" suffix="个" v-model="form.area" :disabled="!editable"></v-text-field>
        <v-text-field label="产量" suffix="个" v-model="form.yield" :disabled="!editable"></v-text-field>
        <v-select :items="schema" label="品种" v-model="form.category" :disabled="!editable"></v-select>
        <v-text-field label="二级品种" v-model="form.categorySecondary" :disabled="!editable"></v-text-field>
        <!-- 投苗时间 -->
        <v-dialog ref="dialog" v-model="modal.seed_date" :persistent="editable" lazy full-width
          width="290px">
          <v-text-field slot="activator" v-model="form.seedlingDate" label="投苗时间" prepend-icon="fas fa-calendar-alt"
            readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.seedlingDate" scrollable @input="modal.seed_date = false"
            locale="zh-cn" color="orange lighten-1" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 出栏时间 -->
        <v-dialog ref="dialog" v-model="modal.out_date" :persistent="editable" lazy full-width
          width="290px">
          <v-text-field slot="activator" v-model="form.outOfBarDate" label="出栏时间" prepend-icon="fas fa-calendar-alt"
            readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.outOfBarDate" scrollable @input="modal.out_date = false"
            locale="zh-cn" color="orange lighten-1" :readonly="!editable"></v-date-picker>
        </v-dialog>

        <v-text-field label="出栏数量" v-model="form.outOfBarCount" :disabled="!editable"></v-text-field>
        <v-checkbox label="是否有冷链存储" v-model="form.hasCoolStore" :disabled="!editable"></v-checkbox>
        <v-text-field label="最低销售价格" prefix="￥" suffix="元/每个" v-model="form.minPrice" :disabled="!editable"></v-text-field>
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
          contacts: "",
          town: "",
          street: "",
          location: {},
          category: "",
          categorySecondary: "",
          seedlingDate: "",
          outOfBarDate: "",
          outOfBarCount: null,
          hasCoolStore: false,
          minPrice: 0,
          area: null,
          yield: null
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
        seed_date: false,
        out_date: false
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
      .$get("configs/AnimalCategories")
      .then(data => {
        this.schema = data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
div.v-input__slot > div > input[type="text"] {
  color: #333;
}
</style>
