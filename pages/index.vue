<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8 md6>
        <v-card dark class="user-card elevation-5">
          <v-card-title>
            <h2>{{$store.state.user.first_name}}{{$store.state.user.last_name}}</h2>
          </v-card-title>
          <v-card-text>
            <div>地址：{{$store.state.user.village}} -
              {{$store.state.user.street}}</div>
            <div>电话：{{$store.state.user.phone_number}}</div>
          </v-card-text>
          <router-link to="/me" tag="v-btn" class="v-btn--flat v-btn--icon user-card-btn">
            <v-icon>fas fa-user-cog</v-icon>
          </router-link>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- 果蔬类列表 -->
    <v-layout wrap justify-center class="py-2">
      <v-flex xs12 md6 v-if="$store.state.enrollment.PlantingEnrollment.length > 0">
        <v-card>
          <v-toolbar flat dark color="green lighten-1">
            <v-btn icon>
              <v-icon>fas fa-apple-alt</v-icon>
            </v-btn>
            <v-toolbar-title>果蔬类登记</v-toolbar-title>
          </v-toolbar>
          <v-list two-line subheader light>
            <!-- <v-subheader inset>果蔬类登记</v-subheader> -->
            <v-list-tile v-for="item in $store.state.enrollment.PlantingEnrollment"
              :key="item.id" @click="showVegDetail(item)" ripple>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.main_body }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.category }} -
                  {{item.category_secondary}}</v-list-tile-sub-title>
                <v-list-tile-sub-title style="font-size:12px;">{{ item.village
                  }}
                  - {{item.street}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <!-- 牲畜类列表 -->
      <v-flex xs12 md6 v-if="$store.state.enrollment.BreedEnrollment.length > 0">
        <v-card>
          <v-toolbar flat dark color="orange lighten-1">
            <v-btn icon>
              <v-icon>fas fa-piggy-bank</v-icon>
            </v-btn>
            <v-toolbar-title>牲畜类登记</v-toolbar-title>
          </v-toolbar>
          <v-list two-line subheader light>
            <v-list-tile v-for="item in $store.state.enrollment.BreedEnrollment"
              :key="item.id" @click="showAnimalDetail(item)" ripple>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.main_body }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.category }} -
                  {{item.category_secondary}}</v-list-tile-sub-title>
                <v-list-tile-sub-title style="font-size:12px;">{{ item.village
                  }}
                  - {{item.street}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  asyncData({ store }) {
    store.dispatch("enrollment/read_plantingEnrollments");
    store.dispatch("enrollment/read_breedEnrollments");
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    showVegDetail(item) {
      console.log(item);
      this.$store.commit("actEnrollment", {
        type: "planting",
        id: item.id
      });
      this.$router.push("/editErm");
    },
    showAnimalDetail(item) {
      this.$store.commit("actEnrollment", {
        type: "breed",
        id: item.id
      });
      this.$router.push("/editErm");
    }
  }
};
</script>

<style scoped>
.user-card {
  background: linear-gradient(135deg, #3398da, #2980b9);
}
.user-card-btn {
  position: absolute;
  top: 0;
  right: 0;
}

i.v-icon.fas.fa-user-cog {
  font-size: 16px;
}
</style>
