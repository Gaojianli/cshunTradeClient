<template>
  <v-container>
    <v-layout justify-center column>
      <v-tabs slider-color="black" fixed-tabs>
        <v-tab v-for="types in ['蔬果类登记','牲畜类登记']" :key="types" v-model="type">
          {{types}}
        </v-tab>
        <v-tab-item  v-for="type in ['蔬果类登记','牲畜类登记']" :key="type">
          <!--<v-select :items="['蔬果类登记','牲畜类登记']" v-model="type" label="登记类型"></v-select>
          <v-divider></v-divider>-->
          <v-flex xs12 v-if="type !== ''">
            <VegEnroll :editable="true" v-if="type == '蔬果类登记'" @save="vegEnroll" :loading="loading"
            />
            <AnimalEnroll v-else :editable="true" :loading="loading" @save="animalEnroll" />
          </v-flex>
        </v-tab-item>
      </v-tabs>
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
        .dispatch("enrollment/create_vegEnrollment", data)
        .then(() => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch(() => {
          this.loading = false;
          alert("输入异常");
        });
    },
    animalEnroll(data) {
      this.loading = true;
      this.$store
        .dispatch("enrollment/create_animalEnrollment", data)
        .then(() => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch(() => {
          this.loading = false;
          alert("输入异常");
        });
    }
  }
};
</script>
