<template>
  <v-layout justify-center column>
    <!-- form -->
    <v-flex xs12>
      <v-alert v-if="editable" :value="true" type="info">条目名称前加*号的为必填项</v-alert>
      <v-form v-model="valid">
        <v-text-field label="*生产主体" v-model="form.main_body" :disabled="!editable"></v-text-field>
        <v-select :items="main_body_items" :item-text="'name'" label="*主体类型"
          v-model="form.main_body_type" :disabled="!editable"></v-select>
        <v-text-field label="*主体负责人" v-model="form.principal" :disabled="!editable"></v-text-field>
        <v-text-field label="*主体负责人联系方式" v-model="form.principal_phone"
          :disabled="!editable"></v-text-field>
        <v-text-field label="销售负责人" v-model="form.sale_manager" :disabled="!editable"></v-text-field>
        <v-text-field label="销售负责人联系方式" v-model="form.sale_manager_phone"
          :disabled="!editable"></v-text-field>
        <v-select :items="schema" :item-text="'name'" :item-value="'name'"
          label="*品种" v-model="form.category" :disabled="!editable"></v-select>
        <v-text-field label="二级品种" v-model="form.category_secondary" :disabled="!editable"></v-text-field>
        <v-select :items="towns" label="*乡镇" v-model="form.village" :disabled="!editable"
          @input="getStreetList"></v-select>
        <v-select :items="streets" label="*所在村（社区）" v-model="form.street"
          :disabled="!form.village || !editable"></v-select>
        <v-text-field label="养殖数量" v-model="form.quantity" :disabled="!editable"></v-text-field>
        <!-- 投苗时间 -->
        <v-dialog ref="dialog" v-model="modal.seed_date" :persistent="editable"
          lazy full-width width="290px">
          <v-text-field slot="activator" v-model="form.seedling_date" label="*投苗时间"
            prepend-icon="fas fa-calendar-alt" readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.seedling_date" scrollable @input="modal.seed_date = false"
            locale="zh-cn" color="orange lighten-1" :readonly="!editable"></v-date-picker>
        </v-dialog>
        <!-- 出栏时间 -->
        <v-dialog ref="dialog" v-model="modal.out_date" :persistent="editable"
          lazy full-width width="290px">
          <v-text-field slot="activator" v-model="form.out_of_bar_date" label="*出栏时间"
            prepend-icon="fas fa-calendar-alt" readonly :disabled="!editable"></v-text-field>
          <v-date-picker v-model="form.out_of_bar_date" scrollable @input="modal.out_date = false"
            locale="zh-cn" color="orange lighten-1" :readonly="!editable"></v-date-picker>
        </v-dialog>

        <v-radio-group row label="*是否有冷链存储:" v-model="form.has_cool_store"
          :disabled="!editable">
          <v-radio label="是" :value="true"></v-radio>
          <v-radio label="否" :value="false"></v-radio>
        </v-radio-group>

        <v-divider></v-divider>
        <v-card v-for="(item, n) in form.breed_products" :key="n" class="my-2">
          <!-- use key will cause rerender, I HAVE to ignore this -->
          <v-card-title primary-title>
            <v-text-field label="*产品名称" v-model="item.name" :disabled="!editable"></v-text-field>
            <v-text-field label="*预计总产量" v-model="item.yield_out" :disabled="!editable"></v-text-field>
            <v-text-field label="*保本销售价格" v-model="item.min_price" :disabled="!editable"
              :suffix="'元'"></v-text-field>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="red" v-if="editable" @click="delete_product(n)">删除产品</v-btn>
          </v-card-actions>
        </v-card>
        <v-btn block @click="append_product" v-if="editable">新增产品</v-btn>
      </v-form>
    </v-flex>
    <!-- btn -->
    <v-layout xs12 v-if="editable">
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-2" @click="$emit('save', form)" :loading="loading">保存</v-btn>
      <v-btn flat color="error" v-if="editing" @click="cancel">取消</v-btn>
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
          category: "",
          category_secondary: "",
          seedling_date: "",
          out_of_bar_date: "",
          quantity: null,
          has_cool_store: false,
          breed_products: []
        };
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    editing:{
      type: Boolean,
      default:()=>{
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
      meta:this.init_form,
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
     * 获取牲畜登记一级分类
     */
    this.$axios
      .$get("/api/breed_enrollment_categories/")
      .then(data => {
        this.schema = data;
      })
      .catch(err => {
        console.log(err);
        alert("获取分类异常");
      });
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
      this.form = Object.assign({},this.$store.state.enrollment.BreedEnrollment.find(x => {
          return x.id == this.form.id;
        })
      );
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
.v-select__selection.v-select__selection--comma.v-select__selection--disabled {
  color: #333;
}
</style>
