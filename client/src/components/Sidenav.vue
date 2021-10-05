<template>
  <div>
    <b-card title="映画監督" class="mt-4">
      <b-form @submit.prevent="addDirector">
        <b-form-group
          label="監督名"
          label-for="input-director-name"
        >
          <b-form-input
            v-model="form.director.name"
            id="input-director-name"
            type="text"
            placeholder="監督名"
            size="sm"
            required
          />
        </b-form-group>
        <b-form-group
          label="年齢"
          label-for="input-director-age"
        >
          <b-form-input
            v-model="form.director.age"
            id="input-director-age"
            type="number"
            placeholder="年齢"
            size="sm"
            required
          />
        </b-form-group>
        <b-button type="submit" variant="outline-info" class="mt-4">
          登録
        </b-button>
      </b-form>
    </b-card>
    <b-card title="映画作品" class="mt-4" >
      <b-form @submit.prevent="addMovie">
        <b-form-group
          label="タイトル"
          label-for="input-movie-name"
        >
          <b-form-input
            v-model="form.movies.name"
            id="input-movie-name"
            type="text"
            placeholder="タイトル"
            size="sm"
            required
          />
        </b-form-group>
        <b-form-group
          label="ジャンル"
          label-for="input-movie-genre"
        >
          <b-form-input
            v-model="form.movies.genre"
            id="input-movie-genre"
            type="text"
            placeholder="ジャンル"
            size="sm"
            required
          />
        </b-form-group>
        <b-form-group
          label="監督"
          label-for="input-movie-director"
        >
          <b-form-select
            size="sm"
            v-model="form.movies.directorId"
          >
            <b-form-select-option
              v-for="director in directors"
              :value="director.id"
              :key="director.id"
            >
              {{ director.name }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
        <b-button type="submit" variant="outline-info"  class="mt-4">
          登録
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  import {
    DIRECTOR_LIST,
    ADD_MOVIE,
    MOVIE_LIST,
    ADD_DIRECTOR
  } from '../graphql/queries';

  export default {
    name: 'Sidenav',
    apollo: {
      directors: DIRECTOR_LIST,
    },
    data() {
      return {
        form: {
          director: {
            name:'',
            age: '',
          },
          movies: {
            name: '',
            genre: '',
            directorId: '',
          },
        },
      }
    },
    methods: {
      clearForm(target) {
        const initData = this.$options.data();
        Object.assign(this.$data.form[target], initData.form[target]);
      },
      addDirector() {
        const { name, age } = this.form.director;
        this.$apollo.mutate({
          mutation: ADD_DIRECTOR,
          variables: {
            name,
            age: parseInt(age)
          },
          update: (store, {data: { addDirector }}) => {
            const data = store.readQuery({ query: DIRECTOR_LIST });
            data.directors.push(addDirector);
            store.writeQuery({ query: MOVIE_LIST, data })
          }
        }).then((data) => {
          console.log("監督 追加", data);
          this.clearForm("director");
        }).catch((err) => {
          console.log("監督 追加", err);
        })
      },
      addMovie() {
        const { name, genre, directorId } = this.form.movies;
        this.$apollo.mutate({
          mutation: ADD_MOVIE,
          variables: {
            name,
            genre,
            directorId
          },
          update: (store, { data: {addMovie}}) => {
            const data = store.readQuery({ query: MOVIE_LIST })
            data.movies.push(addMovie)
            store.writeQuery({ query: MOVIE_LIST, data })
          }
        }).then((data) => {
          console.log("映画 追加", data);
          this.clearForm("movies");
        }).catch((err) => {
          console.log("映画 追加", err);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>