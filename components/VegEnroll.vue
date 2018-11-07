<template>
  <v-layout justify-center column>
    <!-- form -->
    <v-flex xs12>
      <v-alert v-if="editable" :value="true" type="info">条目名称前加*号的为必填项</v-alert>
      <v-form v-model="valid">
        <v-text-field label="*生产主体" v-model="form.main_body" :disabled="!editable"></v-text-field>
        <v-select :items="main_body_items" label="*主体类型" v-model="form.main_body_type"
          :item-text="'name'" :disabled="!editable"></v-select>
        <v-text-field label="*主体负责人" v-model="form.principal" :disabled="!editable"></v-text-field>
        <v-text-field label="*主体负责人联系方式" v-model="form.principal_phone"
          :disabled="!editable"></v-text-field>
        <v-text-field label="销售负责人" v-model="form.sale_manager" :disabled="!editable"></v-text-field>
        <v-text-field label="销售负责人联系方式" v-model="form.sale_manager_phone"
          :disabled="!editable"></v-text-field>
        <v-select :items="schema" label="*品种" v-model="form.category"
          :item-text="'name'" :item-value="'name'" :disabled="!editable"></v-select>
        <v-text-field label="二级品种" v-model="form.category_secondary" :disabled="!editable"></v-text-field>
        <v-select :items="towns" label="*乡镇" v-model="form.village" :disabled="!editable"
          @input="getStreetList"></v-select>
        <v-select :items="streets" label="*所在村（社区）" v-model="form.street"
          :disabled="!form.village || !editable"></v-select>
        <v-text-field label="*种植面积" suffix="亩" v-model="form.area" :disabled="!editable"></v-text-field>
        <v-radio-group row label="*是否连片500亩以上:" v-model="form.larger_than_500_acres"
          :disabled="!editable">
          <v-radio style="margin-left:20px" label="是" :value="true"></v-radio>
          <v-radio label="否" :value="false"></v-radio>
        </v-radio-group>
        <v-text-field label="*预计总产量" suffix="斤" v-model="form.yield_out"
          :disabled="!editable"></v-text-field>
        <!-- 种植日期 -->
        <v-dialog ref="dialog" v-model="modal.plant_date" :persistent="editable"
          lazy full-width width="290px">
          <v-text-field slot="activator" v-model="form.plant_date" label="*种植时间"
            prepend-icon="fas fa-calendar-alt" readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.plant_date" scrollable @input="modal.plant_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 预计上市时间 -->
        <v-dialog ref="dialog" v-model="modal.begin_date" :persistent="editable"
          lazy full-width width="290px">
          <v-text-field slot="activator" v-model="form.market_begin_date" label="*预计上市时间"
            prepend-icon="fas fa-calendar-alt" readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.market_begin_date" scrollable @input="modal.begin_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 上市结束时间 -->
        <v-dialog ref="dialog" v-model="modal.end_date" :persistent="editable"
          lazy full-width width="290px">
          <v-text-field slot="activator" v-model="form.market_end_date" label="上市结束时间"
            prepend-icon="fas fa-calendar-alt" readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.market_end_date" scrollable @input="modal.end_date = false"
            locale="zh-cn" color="success" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <v-radio-group row label="*是否有冷链存储:" v-model="form.has_cool_store"
          :disabled="!editable">
          <v-radio style="margin-left:20px" label="是" :value="true"></v-radio>
          <v-radio label="否" :value="false"></v-radio>
        </v-radio-group>
        <v-text-field label="*保本销售价格" prefix="￥" suffix="元/每斤" v-model="form.min_price"
          :disabled="!editable"></v-text-field>
      </v-form>
    </v-flex>
    <!-- btn -->
    <v-layout xs12 v-if="editable">
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-2" @click="$emit('save', form)" :loading="loading">保存</v-btn>
      <v-btn flat color="error" v-if="editing" @click="cancel" :loading="loading">取消</v-btn>
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
          main_body: "",
          main_body_type: "",
          principal: "",
          principal_phone: "",
          sale_manager: "",
          sale_manager_phone: "",
          village: "",
          street: "",
          area: 0,
          yield_out: 0,
          category: "",
          categorySecondary: "",
          plant_date: "",
          market_begin_date: "",
          market_end_date: "",
          has_cool_store: false,
          minPrice: 0,
          larger_than_500_acres: false,
          min_price: ""
        };
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    editing: {
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
      schema: [],
      towns: [],
      streets: [],
      main_body_items: [
        {
          name: "大户",
          value: "fam"
        },
        {
          name: "合作社",
          value: "coo"
        },
        {
          name: "企业",
          value: "com"
        }
      ]
    };
  },
  mounted() {
    /**
     * 获取果蔬登记一级分类
     */
    this.$axios
      .$get("/api/planting_enrollment_categories/")
      .then(data => {
        this.schema = data;
      })
      .catch(err => {
        console.log(err);
        alert("获取分类异常");
      });
    //获取乡镇列表
    this.$axios
      .$get("/api/users/all_villages/")
      .then(data => {
        this.towns = data;
      })
      .catch(err => {
        console.log(err);
        alert("获取乡镇列表失败");
      });
    this.bodyTypes = new Array("大户", "合作社", "企业");
    this.getStreetList();
  },
  methods: {
    getStreetList: function() {
      this.$axios
        .$get("/api/users/all_streets/?village=" + this.form.village)
        .then(data => {
          this.streets = data;
        })
        .catch(err => {
          console.log(err);
          alert("获取社区列表失败");
        });
    },
    cancel() {
      console.log("canceled");
      this.form = Object.assign(
        {},
        this.$store.state.enrollment.PlantingEnrollment.find(x => {
          return x.id == this.form.id;
        })
      );
      this.getStreetList();
      this.$emit("cancel");
    },
    append_product() {
      this.form.breed_products.push({
        name: "",
        yield_out: "",
        min_price: ""
      });
    },
    delete_product(i) {
      this.form.breed_products.splice(i, 1);
    }
  }
};
</script>

<style>
div.v-input__slot > div > input[type="text"] {
  color: #333;
}
</style>
