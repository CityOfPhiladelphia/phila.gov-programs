<template>
  <div id="programs">
    <div class="search">
      <input
        id="search-bar"
        v-model="search"
        class="search-field"
        type="text"
        placeholder="Search by title, department, or keyword"

      ><input
        ref="archive-search-bar"
        type="submit"
        class="search-submit"
        value="Search"
       
      >
    </div>
    <div id="programs-container">
      <div id="filters-container" />
      <div id="programs-display">
        <div id="tiles">
           <paginate 
          name="programs"
          :list="programs"
          id="program-results"
          class="grid-x grid-margin-x paginate-list"
          tag="div"
          :per="16">
            <div v-for="program in paginated('programs')"
              :key="program.id"
              class="medium-12 cell mbl">
              <a class="card program-card" :href="program.link">
              <div class="trim"><img :src="program.image" alt="" class="program-image"/></div>
              <div class="content-block">
              <h3 :class="{ external: [program.link].includes('http') }">{{program.title}}</h3>
                <p>{{program.short_description}}</p>
              </div>
            </a>
            </div>
          </paginate>
        
            <paginate-links for="programs"
              :async="true"
              :limit="3"
              :show-step-links="true"
              :hide-single-page="false"
              :step-links="{
                next: 'Next',
                prev: 'Previous'
              }"
              @change="onLangsPageChange"
              v-show="!loading && !emptyResponse && !failure">
            </paginate-links>
          </div>
        </div>
       
    
    </div>
  </div>
</template>
<script>

import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import VuePaginate from "vue-paginate";

Vue.use(VueFuse);
Vue.use(VuePaginate);

// const philagov =  "https://www.phila.gov";

const philagov =  "https://cors-anywhere.herokuapp.com/phila.gov";
const programsEndpoint = '/wp-json/programs/v1/';
const audienceEndpoint = '/wp-json/wp/v2/audience/';
const serviceTypeEndpoint = '/wp-json/wp/v2/service_type/';


export default {
  name: "Programs",
  components: { 
  
  },
  filters: {
   
  },
  data: function() {
    return {
      programs: [],
      search: '',
      routerQuery: {},
      loading: false,
      emptyResponse: false,
      failure: false,
      paginate: [ 'programs' ],
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
    this.getAllPrograms();
  },

  methods: {
 
    getAllPrograms: function () {
  
        console.log(philagov + programsEndpoint + 'archives')
      axios.get(philagov + programsEndpoint + 'archives' , {
        params: {
          'count': -1,
        }
      })
        .then(response => {
          this.programs = response.data;
        
         
        })
        .catch(e => {
          
        });
    },

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

#programs {
  width: 900px;
  margin: 0 auto;
}

</style>