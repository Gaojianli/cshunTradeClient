<template>
  <v-container>
    <v-layout justify-center>
      <v-flex xs12>
        <VegEnroll v-if="$store.state.active_enrollment.type == 'veg'" :editable="false"
          :init_form="meta" />
      </v-flex>
    </v-layout>
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
    axios
      .get(`/${type}Enrollment/${id}/orders`)
      .then(({ data }) => {
        cb(null, { orders: data, meta: meta });
      })
      .catch(err => {
        cb({ statusCode: 404, message: "没有收到预期的数据，请回到首页" });
      });
  },
  components: {
    VegEnroll
  }
};
</script>
