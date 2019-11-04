<template>
  <div id="programs">
    <div class="search">
      <input
        id="search-bar"
        v-model="search"
        class="search-field"
        type="text"
        placeholder="Search by title or keyword"
      ><input
        ref="archive-search-bar"
        type="submit"
        class="search-submit"
        value="Search"
      >
    </div>
    
    <div 
      v-show="!loading && !failure" 
      id="programs-container"
    >
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
        <div
      v-show="loading"
      class="mtm center"
    >
      <i class="fas fa-spinner fa-spin fa-3x" />
    </div>
    <div
      v-show="!loading && emptyResponse"
      class="h3 mtm center"
    >
      Sorry, there are no results.
    </div>
    <div
      v-show="failure"
      class="h3 mtm center"
    >
      Sorry, there was a problem. Please try again.
    </div>
        
        <div id="tiles">
          <paginate 
            v-if="filteredPrograms.length > 0 "
            id="program-results"
            name="filteredPrograms"
            :list="filteredPrograms"
            class="grid-x grid-margin-x paginate-list"
            tag="div"
            :per="8"
          >
            <div
              v-for="program in paginated('filteredPrograms')"
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
          <div class="program-pages">
            <div class="program-length"
             v-show="!loading && !emptyResponse && !failure"
             >
              Showing <b> {{ filteredPrograms.length }} </b> programs.
            </div>
        
            <paginate-links
              v-show="!loading && !emptyResponse && !failure"
              for="filteredPrograms"
              :async="true"
              :limit="3"
              :show-step-links="true"
              :hide-single-page="true"
              :step-links="{
                next: 'Next',
                prev: 'Previous'
              }"
              @change="scrollToTop()"
            />
          </div>
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
const programsEndpoint = '/wp-json/programs/v1/archives';
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
      filteredPrograms: [],
      search: '',
      routerQuery: {},
      paginate: [ 'filteredPrograms' ],
      audiences: [],
      checkedAudiences: [],
      serviceTypes: [],
      checkedServiceTypes: [],
      // searchResults: [],
      servicePrograms: [],
      audiencePrograms: [],

      loading: true,
      emptyResponse: false,
      failure: false,
      searchOptions: {
        shouldSort: true,
        threshold: 0.3,
        keys: [
          'title',
          'short_description',
        ],
      },
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

    search () {
      this.filterResults();
    },

    checkedAudiences(arr) {
      this.filterResults();
    },
    checkedServiceTypes (arr) {
      this.filterResults();
    },
  },

  mounted: async function() {
    this.getAllPrograms();
    this.getAllAudiences();
    this.getAllServices();
    // await this.filterResults();
  },

  methods: {
 
    getAllPrograms: function () {
      axios
        .get(philagov + programsEndpoint , {
          params: {
            'count': -1,
          }})
        .then(response => {
          this.programs = response.data;
          this.filteredPrograms = response.data;
        })
        .catch(e => {})
        .finally(() => {
          this.loading = false;
        });
    },

    getAllServices: function () {
      axios
        .get(philagov + serviceTypeEndpoint, {
          params: {
            'per_page': 30,
          }})
        .then(response => {
          this.serviceTypes = response.data;
        })
        .catch(e => {})
        .finally(() => {});
    },

    getAllAudiences: function () {
      axios
        .get(philagov + audienceEndpoint , {
          params: {
            'count': -1,
          }})
        .then(response => {
          this.audiences = response.data;
        })
        .catch(e => {})
        .finally(() => {});
    },
    
    
    filterResults: async function () {
      await this.filterByServiceType();
      await this.filterByAudience();
      await this.filterBySearch();
      await this.checkEmpty();
    },

    filterByAudience: function() {
      if (this.checkedAudiences.length !== 0 ){
        this.audiencePrograms = [];
        
        this.servicePrograms.forEach((program) => {
          // go through each audience and see if it matches an item in audiences
          // if yes, push it and break from item (use let?)
          // how to make this not take forever... break loop if match
          program.audiences.forEach((audience) => {
            if (this.checkedAudiences.includes(audience.slug)) {
              if (!this.audiencePrograms.includes(program)) {
                this.audiencePrograms.push(program);
              }
            }
          });
        });

      
      } else {
        this.audiencePrograms = this.servicePrograms;
      }
    },

    filterBySearch: function() {
      if (this.search) {
        // this.searchResults = []; 
        // there is nothing in the search bar -> return everything
        this.$search(this.search, this.audiencePrograms, this.searchOptions).then(programs => {
          this.filteredPrograms = programs;
        });

       
      } else {
        this.filteredPrograms = this.audiencePrograms;
      }
      
    },

    filterByServiceType: function() {
      if (this.checkedServiceTypes.length !== 0 ){
        this.servicePrograms = [];
        
        this.programs.forEach((program) => {
          
          program.services.forEach((serviceType) => {
            if (this.checkedServiceTypes.includes(serviceType.slug)) {
              if (!this.servicePrograms.includes(program)) {
                this.servicePrograms.push(program);
              }
            }
          });
        });
        // this.filteredPrograms = this.searchResults;
      } else {
        this.servicePrograms = this.programs;
      }
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

    checkEmpty: function() {
      this.emptyResponse = (this.filteredPrograms.length === 0 ) ? true : false;
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

      .trim {
        max-height: 188px;
        overflow: hidden;
      }
    } 
  }

  .program-pages {
    display: flex;
    justify-content: space-between;
  
  }
}

</style>