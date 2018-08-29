<template>
  <v-container>
    <v-layout justify-center column>
      <v-select :items="['蔬果类登记','牲畜类登记']" v-model="type" label="登记类型"></v-select>
      <v-divider></v-divider>
      <v-flex xs12 v-if="type !== ''">
        <VegEnroll :editable="true" v-if="type == '蔬果类登记'" @save="vegEnroll" :loading="loading"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VegEnroll from "@/components/VegEnroll";
export default {
  components: {
    VegEnroll
  },
  data() {
    return {
      type: "",
      loading: false
    };
  },
  methods: {
    vegEnroll(data) {
      this.loading = true;
      this.$store
        .dispatch("enrollment/createVegEnrollment", data)
        .then(() => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
