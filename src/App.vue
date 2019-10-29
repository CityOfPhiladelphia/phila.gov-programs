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
      <div id="filters-container">
        <div
          class="accordion"
        >
          <div
            class="accordion-item is-active"
          >
            <a
              href="#"
              class="h4 accordion-title mbn"
            >Filter by audience</a>
            <div
              class="acc-content"
            >
              <div 
                v-for="(value, key) in audiences"
                :key="key"
                class="accordion-checkbox"
              >
                <input
                  :id="value.slug"
                  v-model="checkedAudiences"
                  type="checkbox"
                  :value="value.slug"
                  :name="value.slug"
                  @click="filterResults"
                >
                <label
                  :for="value.slug"
                  class="program-audience"
                >{{ value.name }}</label>
              </div>
            </div>
          </div>
          <div
            class="accordion-item is-active"
            data-accordion-item
          >
            <a
              href="#"
              class="h4 accordion-title"
            >Filter by category</a>
            <div
              class="acc-content"
            >
              <fieldset>
                <div
                  v-for="(value, key) in serviceTypes"
                  :key="key"
                  class="accordion-checkbox"
                >
                  <input
                    :id="value.slug"
                    v-model="checkedServiceTypes"
                    type="checkbox"
                    :value="value.slug"
                    :name="value.slug"
                    @click="filterResults"
                  >
                  <label
                    :for="value.slug"
                    class="program-category"
                  ><span v-html="value.name" /></label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div id="programs-display">
        <div id="tiles">
          <paginate 
            id="program-results"
            name="programs"
            :list="programs"
            class="grid-x grid-margin-x paginate-list"
            tag="div"
            :per="16"
          >
            <div
              v-for="program in paginated('programs')"
              :key="program.id"
              class="medium-12 cell mbl"
            >
              <a
                class="card program-card"
                :href="program.link"
              >
                <div class="trim"><img
                  :src="program.image"
                  alt=""
                  class="program-image"
                ></div>
                <div class="content-block">
                  <h3 :class="{ external: [program.link].includes('http') }">{{ program.title }}</h3>
                  <p>{{ program.short_description }}</p>
                </div>
              </a>
            </div>
          </paginate>
        
          <paginate-links
            v-show="!loading && !emptyResponse && !failure"
            for="programs"
            :async="true"
            :limit="3"
            :show-step-links="true"
            :hide-single-page="false"
            :step-links="{
              next: 'Next',
              prev: 'Previous'
            }"
          />
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
      audiences: [],
      checkedAudiences: [],
      serviceTypes: [],
      checkedServiceTypes: [],
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

  mounted: async function() {
    this.getAllPrograms();
    this.getAllAudiences();
    this.getAllServices();
    await this.filterResults();
  },

  methods: {
 
    getAllPrograms: function () {
  
      console.log(philagov + programsEndpoint + 'archives');
      axios
        .get(philagov + programsEndpoint + 'archives' , {
          params: {
            'count': -1,
          }})
        .then(response => {
          this.programs = response.data;
        
        })
        .catch(e => {
          
        })
        .finally(() => {
          
        });
    },

    getAllServices: function () {
  
      console.log(philagov + serviceTypeEndpoint);
      axios
        .get(philagov + serviceTypeEndpoint, {
          params: {
            'per_page': 30,
          }})
        .then(response => {
          this.serviceTypes = response.data;
        
        })
        .catch(e => {
          
        })
        .finally(() => {
         
        });
    },

    getAllAudiences: function () {
  
      console.log(philagov + audienceEndpoint);
      axios
        .get(philagov + audienceEndpoint , {
          params: {
            'count': -1,
          }})
        .then(response => {
          this.audiences = response.data;
        
        })
        .catch(e => {
          
        })
        .finally(() => {

        });
    },
    
    
    filterResults: function () {

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
  
  margin: 0 auto;
  max-width: 75rem;

  #programs-container {
    display: flex;

    #filters-container {
      width: 33%;
      padding-right: 2rem;

      .acc-content {
        background-color: white;
        padding: 1rem;

      .accordion-checkbox {
        user-select: none;
      }
      }

    }

    #programs-display {
      width: 66%;

    }
    
  }
}

</style>