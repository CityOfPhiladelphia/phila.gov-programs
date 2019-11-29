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
      <button
        v-if="search.length > 0"
        class="clear-search-btn"
        @click="clearSearchBar"
      >
        <i class="fas fa-times " />
      </button>
    </div>
    <div 
      id="programs-container"
    >
      <div id="filters-container">
        <div
          class="accordion"
        >
          <div
            class="accordion-item"
            :class="{'is-active' : showAudiences}"
            @click="toggleAudiences"
          >
            <div
              tabindex="0"
              class="h4 accordion-title mbn"
            >
              Filter by audience
            </div>
          </div>
          <div
            v-show="showAudiences"
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
                class="hidden-checkbox"
                @change="filterResults"
              >
              <label
                 
                :for="value.slug"
                class="program-audience"
              >{{ value.name }}</label>
            </div>
          </div>
          <div
            class="accordion-item"
            :class="{'is-active' : showServices}"
            @click="toggleServices"
          >
            <div
              tabindex="0"
              class="h4 accordion-title"
            >
              Filter by category
            </div>
          </div>
          <div
            v-show="showServices"
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
                  class="hidden-checkbox"
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
        <div>
          <button 
            class="clear-button"
            @click="clearAllFilters()"
          >
            Clear all Filters
          </button>
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
            ref="paginator"
            name="filteredPrograms"
            :list="filteredPrograms"
            class="grid-x grid-margin-x paginate-list"
            tag="div"
            :per="8"
          >
            <div
              v-for="program in paginated('filteredPrograms')"
              :key="program.id"
              class="medium-12 cell mbl program-wrap"
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
                  <h3 :class="{ 'external' : program.link.includes('http') }">{{ program.title }}</h3>
                  <p>{{ program.short_description }}</p>
                </div>
              </a>
            </div>
          </paginate>
          <div class="program-pages">
            <div
              v-show="!loading && !emptyResponse && !failure"
              class="program-length"
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
              @change="onPageChange(); scrollToTop(); "
            />
          </div>
          <div
            v-show="showRelated && relatedServices.length > 0"
            id="related-services"
            class="grid-x grid-margin-x grid-padding-x"
          >
            <div class="medium-24 cell">
              <h3 class="black bg-ghost-gray phm-mu mtl mbm">
                Related services
              </h3>
              <ul class="phm-mu">
                <li
                  v-for="relatedService in relatedServices"
                  :key="relatedService.id"
                >
                  <a :href="relatedService.link">{{ relatedService.name }}</a>
                </li>
              </ul>
            </div>
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
const relatedServicesEndpoint =  '/wp-json/programs/v1/related_service/';


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
      relatedServices: [], 
      page: 1,
      servicePrograms: [],
      audiencePrograms: [],
      showAudiences: true,
      showServices: true,
      showRelated : false,
      loading: true,
      emptyResponse: false,
      failure: false,
      searchOptions: {
        shouldSort: true,
        threshold: 0.4,
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

    search(value) {
      this.filterResults();
      if (value.length > 3) {
        this.updateRouterQuery('search', value);
      } else {
        this.updateRouterQuery('search', null);
      }
      
    },

    filteredPrograms(val) {
      if (val.length === 0) {
        this.getRelatedServices();
        this.showRelated = true;
      } else {
        this.showRelated = false;
      }
    },

    checkedAudiences(val) {
      this.filterResults();
      this.updateRouterQuery('checkedAudiences', val);
    
    },
    checkedServiceTypes (val) {
      this.filterResults();
      this.updateRouterQuery('checkedServiceTypes', val);
     
    },
    loading(val) {
      if(!val) {
        this.initFilters();
        this.filterResults();
      }
    },

  },

  mounted: function() {
    this.getAllPrograms();
    this.getAllAudiences();
    this.getAllServices();
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
        .finally(() => {
          
        });
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

    getRelatedServices: function () {

      let params = {
        count: '50',
        'audience' : this.checkedAudiences,
        'service_type': this.checkedServiceTypes,
      };

      axios.get(philagov + relatedServicesEndpoint, { params })
        .then(response => {
          this.relatedServices = response.data;
        })
        .catch(e => {
        });
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
      } else {
        this.servicePrograms = this.programs;
      }
    },

    toggleAudiences: function() {
      this.showAudiences = this.showAudiences ? false : true;
    },

    toggleServices: function() {
      this.showServices = this.showServices ? false : true;
    },

    updateRouterQuery: function (key, value) {
      if (typeof value === 'undefined' || value === '' || value === null) {
        Vue.delete(this.routerQuery, key);
      } else {
        Vue.set(this.routerQuery, key, value);
      }
    },

    clearSearchBar: function () {
      this.search = "";
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

    initFilters: function() {
      if (Object.keys(this.$route.query).length !== 0) {
        for (let routerKey in this.$route.query) {
          if(routerKey === "checkedServiceTypes" || routerKey === "checkedAudiences"){
            Vue.set(this, routerKey, this.returnArray(this.$route.query[routerKey]));
          } else {
            Vue.set(this, routerKey, this.$route.query[routerKey]);
          }
        }
        this.setPage();
      }

      
    },

    returnArray (value) {
      if (Array.isArray(value)) {
        return value;
      } 
      if (value !== '') {
        return [ value ];
      } 
      return [];
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

    onPageChange() {
      let newPage = this.$refs.paginator.currentPage + 1;
      this.page = newPage;
      this.updateRouterQuery('page', newPage);
    },

    setPage: function() {
      if (this.page) {
        this.$refs.paginator.goToPage(this.page);
      }
    },

    clearAllFilters() {
      this.checkedAudiences = [];
      this.checkedServiceTypes = [];
      this.search = '';
      this.page = 1;
    },
  },
};
</script>

<style lang="scss">

#programs {
  margin: 0 auto;
  max-width: 75rem;

   .clear-search-btn {
      position: absolute;
      top:16px;
      right: 70px;
      padding: 0;
      font-size: 20px;
      background-color: #fff;
      opacity: 0.8;
      z-index: 999;
      cursor: pointer;
      color: rgba(60, 60, 60, 0.5);
      
    }

  #programs-container {
    display: flex;

    #filters-container {
      width: 33%;
      padding-right: 2rem;

      .accordion-title {
        font-weight: bold;
      }

      .acc-content {
        background-color: white;
        padding: 1rem;

        .accordion-checkbox {

          user-select: none;

          input[type="checkbox"]:focus + label {
            border:2px solid black;
          }

          .hidden-checkbox {
            display: block;
            opacity: 1;         // hide it visually
            z-index: -1;        // avoid unintended clicks
            position: absolute; // don't affect other elements positioning
          }

          
        }
      }

      .clear-button {
        margin: 0 auto;
      }
    }

    #programs-display {
      width: 66%;

      .program-wrap {
        min-height: 353px;
      }

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

    @media (max-width: 760px) {

      #programs-container {
        flex-direction: column;
        
        #filters-container {
          width: 95%;
          margin: 0 auto;
          padding:0 0 1rem 0
        }
        
        #programs-display {
          width: 95%;
          margin: 0 auto;
        }
      }
    }

}

</style>