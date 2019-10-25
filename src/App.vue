<template>
  <div id="programs" /> 
</template>
<script>

import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";

Vue.use(VueFuse);

// const endpoint =
//   "https://cors-anywhere.herokuapp.com/phila.gov/wp-json/the-latest/v1/";

const endpoint =
  "https://www.phila.gov/wp-json/the-latest/v1/";

export default {
  name: "Archives",
  components: { 
  
  },
  filters: {
   
  },
  data: function() {
    return {

      routerQuery: {},
    };
  },
  computed: { 
   
  },

  watch: {
  

    routerQuery: {
      handler: function () {
        this.updateRouter();
      },
      deep: true,
    },

  },

  mounted:  function() {
  
  },

  methods: {
 

    updateRouterQuery: function (key, value) {
      if (typeof value === 'undefined' || value === '' || value === null) {
        Vue.delete(this.routerQuery, key);
      } else {
        Vue.set(this.routerQuery, key, value);
      }
    },

    /**
    * @desc scrolls to top from paginate buttons
    */
    scrollToTop : function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },

    resetRouterQuery: function () {
      for (let routeKey in this.$route.query) {
        Vue.delete(this.routerQuery, routeKey);
      }
    },

    updateRouter: function () {
      if (this.routerQuery  === this.$route.query) {
        return;
      } 
      this.$router.push({
        name: 'main',
        query: this.routerQuery,
      }).catch(e => {
        // window.console.log(e);
      });
    },
  },
};
</script>

<style lang="scss">

</style>