<template>
  <v-container>
    <v-card class="pa-4 elevation-4">
    <v-tabs>
      <v-tab>登记信息</v-tab>
      <v-tab>订单信息</v-tab>
      <!-- 登记元信息 -->
      <v-tab-item>
        <v-layout justify-center column>
          <v-flex xs12>
            <VegEnroll v-if="$store.state.active_enrollment.type == 'planting'"
              :editable="meta_editable" :init_form="meta" :editing="true" @save="saveEnrollment" @cancel="restoreEnroll"
              :loading="loading" />
            <AnimalEnroll v-else :editable="meta_editable" :init_form="meta" :editing="true"  @cancel="restoreEnroll"
              @save="saveEnrollment" :loading="loading" />
          </v-flex>
          <v-flex v-if="!meta_editable">
            <v-btn flat @click="meta_editable = true">编辑登记</v-btn>
            <v-btn flat color="error" @click="deleteEnrollment">删除登记</v-btn>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <!-- 订单列表 -->
      <v-tab-item>
        <v-layout column>
          <v-flex xs12>
            <v-radio-group row label="是否有订单:" v-model="has_order" :disabled="orders.length > 0">
              <v-radio label="是" :value="true"></v-radio>
              <v-radio label="否" :value="false"></v-radio>
            </v-radio-group>
          </v-flex>
          <!-- 订单列表 -->
          <v-flex>
            <v-card flat class="transparent">
              <v-list three-line>
                <template v-for="item in orders">
                  <v-list-tile :key="item.id" class="py-2">
                    <v-list-tile-content>
                      <!-- if breed show product -->
                      <v-list-tile-title v-if="type == 'breed'">产品：{{computeProductName(item.breed_product)}}</v-list-tile-title>
                      <v-list-tile-title>地址：{{item.order_source_address}}</v-list-tile-title>
                      <v-list-tile-sub-title>价格：{{item.price}}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>
                        模式：{{modes.find((x)=>{return x.value ==
                        item.sale_model}).name}}
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title>{{item.is_overseas ? '境外订单' :
                        '境内订单'}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn icon ripple>
                        <v-icon color="blue darken-1" class="list-icon" @click="editOrder(item)">fas
                          fa-pen</v-icon>
                      </v-btn>
                      <v-btn icon ripple>
                        <v-icon color="red" class="list-icon" @click="deleteOrder(item)">fas
                          fa-trash-alt</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider :key="-item.id"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-btn block flat @click="active = true" v-if="has_order" style="border:dashed rgba(0,0,0,0.25) 2px;">
              <v-icon style="font-size:18px;">fas fa-plus</v-icon>
              <span>增加订单</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <!-- 订单表单 -->
      <v-dialog persistent v-model="active">
        <v-card class="pa-4">
          <v-card-text>
            <v-form>
              <!-- if breed choose product -->
              <v-select v-if="type == 'breed'" :items="meta.breed_products"
                label="对应产品" v-model="form_data.breed_product" :item-text="'name'"
                :item-value="'id'"></v-select>
              <v-text-field label="价格" v-model="form_data.price"></v-text-field>
              <v-select :items="modes" v-model="form_data.sale_model" item-text="name"
                item-value="value" label="价格类型"></v-select>
              <v-text-field label="订单来源类型" v-model="form_data.order_source_type"></v-text-field>
              <v-text-field label="具体订单来源" v-model="form_data.order_source_name"></v-text-field>
              <v-radio-group row label="是否境外订单:" v-model="form_data.is_overseas">
                <v-radio label="是" :value="true"></v-radio>
                <v-radio label="否" :value="false"></v-radio>
              </v-radio-group>
              <v-textarea label="地址" v-model="form_data.order_source_address" v-if="form_data.is_overseas"></v-textarea>
              <v-layout fluid wrap align-start justify-start row v-if="!form_data.is_overseas">
                <v-flex sm1>
              <v-radio-group row label="请选择地址:">
              </v-radio-group>
                </v-flex>
              <v-flex  xs12 sm3 d-flex mr-4>
                <v-select
                  :items="province_info"
                  label="省/市/自治区/特别行政区"
                  solo
                  v-model="province"
                  @change="form_data.order_source_address=province"
                ></v-select>
                </v-flex>
              <v-flex  xs12 sm3 d-flex mr-4>
                <v-select
                  :items="cityinfo[province]"
                  label="市/地区/旗/盟/自治州"
                  v-if="province"
                  solo
                  v-model="city"
                   @change="form_data.order_source_address +=city"
                ></v-select>
                </v-flex>
              <v-flex  xs12 sm3 d-flex>
                <v-select
                  :items="district_info[city]"
                  label="区/县"
                  v-if="city"
                  solo
                  v-model="district"
                  @change="form_data.order_source_address +=district"
                ></v-select>
              </v-flex>
            </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="blue" @click="saveDialog" :loading="loading">保存</v-btn>
            <v-btn flat color="error" @click="cancelDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import VegEnroll from "@/components/VegEnroll";
import AnimalEnroll from "@/components/AnimalEnroll";
let province_infos=require("@/static/province_info");
export default {
  asyncData(ctx, cb) {
    if (ctx.store.state.active_enrollment.id == null) ctx.redirect("/");
    let { type, id } = ctx.store.state.active_enrollment;
    let meta;
    //获取登记元信息
    if (type == "planting")
      meta = Object.assign(
        {},
        ctx.store.state.enrollment.PlantingEnrollment.find(x => {
          return x.id == id;
        })
      );
    else
      meta = Object.assign(
        {},
        ctx.store.state.enrollment.BreedEnrollment.find(x => {
          return x.id == id;
        })
      );
    //获取登记订单信息
    ctx.$axios
      .$get(`/api/${type}_enrollment_orders/?enrollment=${id}`)
      .then(data => {
        console.log(data);
        cb(null, {
          orders: data,
          meta: meta,
          has_order: data.length > 0 ? true : false,
          type: type
        });
      })
      .catch(err => {
        cb({ statusCode: 404, message: "没有收到预期的数据，请刷新" });
      });
  },
  components: {
    VegEnroll,
    AnimalEnroll
  },
  data() {
    return {
      active: false,
      loading: false,
      meta_editable: false,
      form_data: {
        order_source_type: "",
        order_source_name: "",
        order_source_address: "",
        is_overseas: false,
        price: "",
        sale_model: "",
        id: null
      },
      modes: [
        { name: "固定价格", value: "fixed" },
        { name: "市场价格", value: "market" },
        { name: "保底价格 + 市场价格", value: "safe_market" }
      ],
      province_info:province_infos.province_info,
      cityinfo:province_infos.cityinfo,
      district_info:province_infos.district_info
    };
  },
  methods: {
    /**
     * 获取订单信息
     */
    fetchOrders() {
      let { type, id } = this.$store.state.active_enrollment;
      this.$axios
        .$get(`/api/${type}_enrollment_orders/?enrollment=${id}`)
        .then(data => {
          this.orders = data;
        })
        .catch(err => {
          console.log(err);
          alert("更新订单失败");
        });
    },
    /**
     * 保存订单信息
     */
    saveDialog() {
      this.loading = true;
      let { type, id } = this.$store.state.active_enrollment;
      if (!this.form_data.id) {
        //新建订单
        this.form_data.enrollment = id;
        this.$axios
          .$post(
            `/api/${type}_enrollment_orders/?enrollment=${id}`,
            this.form_data
          )
          .then(() => {
            this.loading = false;
            this.fetchOrders();
            this.cancelDialog(); //还原表单
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
            alert("保存失败");
          });
      } else {
        //修改订单
        this.$axios
          .$put(
            `/api/${type}_enrollment_orders/${this.form_data.id}/`,
            this.form_data
          )
          .then(() => {
            this.loading = false;
            this.fetchOrders();
            this.cancelDialog();
          })
          .catch(err => {
            console.log(err);
            alert("保存失败");
          });
      }
    },
    /**
     * 取消创建订单
     */
    cancelDialog() {
      let { type, id } = this.$store.state.active_enrollment;
      if (type == "breed") this.form_data.breed_product = null;
      this.active = false;
      this.form_data.order_source_type = "";
      this.form_data.order_source_name = "";
      this.form_data.order_source_address = "";
      this.form_data.is_overseas = false;
      this.form_data.price = "";
      this.form_data.sale_model = "";
      this.form_data.id = null;
      this.province=this.city=this.district="";
    },
    /**
     * 编辑订单
     */
    editOrder(item) {
      let { type, id } = this.$store.state.active_enrollment;
      if (type == "breed") this.form_data.breed_product = item.breed_product;
      this.form_data.id = item.id;
      this.form_data.order_source_type = item.order_source_type;
      this.form_data.order_source_name = item.order_source_name;
      this.form_data.order_source_address = item.order_source_address;
      this.form_data.is_overseas = item.is_overseas;
      this.form_data.price = item.price;
      this.form_data.sale_model = item.sale_model;
      this.active = true;
    },
    /**
     * 删除订单
     */
    deleteOrder(item) {
      let { type, id } = this.$store.state.active_enrollment;
      this.$axios
        .$delete(`/api/${type}_enrollment_orders/${item.id}`)
        .then(() => {
          this.fetchOrders();
        })
        .catch(err => {
          console.log(err);
          alert("删除失败");
        });
    },
    /**
     * 删除登记
     */
    deleteEnrollment() {
      if (!confirm("确认删除这项登记？")) return;
      this.$store
        .dispatch(
          `enrollment/delete_${
            this.$store.state.active_enrollment.type
          }Enrollments`,
          this.$store.state.active_enrollment.id
        )
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          alert("删除失败");
        });
    },
    /**
     * 保存修改登记信息
     */
    saveEnrollment(form) {
      this.loading = true;
      let { type, id } = this.$store.state.active_enrollment;
      this.$store
        .dispatch(`enrollment/update_${type}Enrollment`, form)
        .then(() => {
          this.meta_editable = false;
          this.loading = false;
        })
        .catch(err => {
          alert("保存失败");
        });
    },
    computeProductName(index) {
      let product = this.meta.breed_products.find(x => {
        return x.id == index;
      });
      if (product) return product.name;
      else return "";
    },
    //还原表单状态
    restoreEnroll: function() {
      this.meta_editable = false;
    }
  },
  mounted() {
    this.cancelDialog();
  }
};
</script>

<style>
.transparent > .v-list {
  background-color: transparent;
}
.transparent.theme--light .v-card {
  background-color: transparent;
}
.list-icon {
  font-size: 16px;
}
</style>

