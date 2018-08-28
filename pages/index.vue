<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8 md6>
        <v-card dark class="user-card">
          <v-card-title>
            <h2>{{$store.state.user.name}}</h2>
          </v-card-title>
          <v-card-text>
            <div>地址：{{$store.state.user.town}} - {{$store.state.user.street}}</div>
            <div>电话：{{$store.state.user.phone}}</div>
          </v-card-text>
          <router-link to="/me" tag="v-btn" class="v-btn--flat v-btn--icon user-card-btn">
            <v-icon>fas fa-user-cog</v-icon>
          </router-link>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {}
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
