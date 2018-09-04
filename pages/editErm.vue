<template>
  <v-container>
    <v-tabs>
      <v-tab>登记信息</v-tab>
      <v-tab>订单信息</v-tab>
      <!-- 登记元信息 -->
      <v-tab-item>
        <v-layout justify-center column>
          <v-flex xs12>
            <VegEnroll v-if="$store.state.active_enrollment.type == 'veg'" :editable="meta_editable"
              :init_form="meta" @save="saveEnrollment" :loading="loading" />
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
            <v-checkbox label="是否有订单" v-model="has_order" :disabled="orders.length > 0"></v-checkbox>
          </v-flex>
          <!-- 订单列表 -->
          <v-flex>
            <v-card flat class="transparent">
              <v-list three-line>
                <template v-for="item in orders">
                  <v-list-tile :key="item.id">
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.address}}</v-list-tile-title>
                      <v-list-tile-sub-title>价格：{{item.price}}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>模式：{{modes.find((x)=>{return x.value == item.saleMode}).name}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn icon ripple>
                        <v-icon color="blue darken-1" class="list-icon" @click="editOrder(item)">fas fa-pen</v-icon>
                      </v-btn>
                      <v-btn icon ripple>
                        <v-icon color="red" class="list-icon" @click="deleteOrder(item)">fas fa-trash-alt</v-icon>
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
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field label="地址" v-model="form_data.address"></v-text-field>
              <v-text-field label="价格" v-model="form_data.price"></v-text-field>
              <v-select :items="modes" v-model="form_data.saleMode" item-text="name" item-value="value"
                label="登记类型"></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="blue" @click="saveDialog" :loading="loading">保存</v-btn>
            <v-btn flat color="error" @click="cancelDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-tabs>
  </v-container>
</template>

<script>
import axios from "axios";
import VegEnroll from "@/components/VegEnroll";
export default {
  asyncData(ctx, cb) {
    if (!ctx.store.state.active_enrollment.id) ctx.redirect("/");
    let { type, id } = ctx.store.state.active_enrollment;
    let meta;
    //获取登记元信息
    if (type == "veg")
      meta = Object.assign(
        {},
        ctx.store.state.enrollment.VegEnrollment.find(x => {
          return x.id == id;
        })
      );
    //获取登记订单信息
    ctx.$axios
      .$get(`/${type}Enrollment/${id}/orders`)
      .then(data => {
        console.log(data);
        cb(null, {
          orders: data,
          meta: meta,
          has_order: data.length > 0 ? true : false
        });
      })
      .catch(err => {
        cb({ statusCode: 404, message: "没有收到预期的数据，请刷新" });
      });
  },
  components: {
    VegEnroll
  },
  data() {
    return {
      active: false,
      loading: false,
      meta_editable: false,
      form_data: {
        address: "",
        price: null,
        saleMode: "",
        id: null
      },
      modes: [
        { name: "固定价格", value: "Fixed" },
        { name: "市场价格", value: "Market" },
        { name: "保底价格 + 市场价格", value: "SafeMarket" }
      ]
    };
  },
  methods: {
    /**
     * 获取订单信息
     */
    fetchOrders() {
      let { type, id } = this.$store.state.active_enrollment;
      this.$axios
        .$get(`/${type}Enrollment/${id}/orders`)
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
        this.$axios
          .$post(`/${type}Enrollment/${id}/orders`, this.form_data)
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
            `/${type}Enrollment/${id}/orders/${this.form_data.id}`,
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
      this.form_data.address = "";
      this.form_data.price = null;
      this.form_data.saleMode = "";
      this.form_data.id = null;
      this.active = false;
    },
    /**
     * 编辑订单
     */
    editOrder(item) {
      this.form_data.id = item.id;
      this.form_data.address = item.address;
      this.form_data.price = item.price;
      this.form_data.saleMode = item.saleMode;
      this.active = true;
    },
    /**
     * 删除订单
     */
    deleteOrder(item) {
      let { type, id } = this.$store.state.active_enrollment;
      this.$axios
        .$delete(`/${type}Enrollment/${id}/orders/${item.id}`)
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
        });
    }
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

