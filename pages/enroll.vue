<template>
  <v-container>
    <v-layout justify-center column>
      <v-card class="pa-4">
        <v-select :items="['蔬果类登记','牲畜类登记']" v-model="type" label="登记类型"></v-select>
        <v-divider></v-divider>
        <v-flex xs12 v-if="type !== ''">
          <VegEnroll :editable="true" v-if="type == '蔬果类登记'" @save="vegEnroll"
            :loading="loading" />
          <AnimalEnroll v-else :editable="true" :loading="loading" @save="animalEnroll" />
        </v-flex>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import VegEnroll from "@/components/VegEnroll";
import AnimalEnroll from "@/components/AnimalEnroll";
export default {
  components: {
    VegEnroll,
    AnimalEnroll
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
        .dispatch("enrollment/create_plantingEnrollment", data)
        .then(data => {
          this.loading = false;
          //console.log(data);
          this.$store.commit("actEnrollment", {
            type: "planting",
            id: data.id
          });
          this.$router.push("/editErm");
          //this.$router.push("/");
        })
        .catch(err => {
          this.loading = false;
          alert("输入异常");
        });
    },
    animalEnroll(data) {
      this.loading = true;
      this.$store
        .dispatch("enrollment/create_breedEnrollment", data)
        .then(data => {
          this.loading = false;
          this.$store.commit("actEnrollment", {
            type: "planting",
            id: data.id
          });
          this.$router.push("/editErm");
          //this.$router.push("/");
        })
        .catch(err => {
          this.loading = false;
          alert("输入异常");
        });
    }
  }
};
</script>
