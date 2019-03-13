<template>
  <div class='onboading'>
    <b-row>
      <b-col cols="1" >
      </b-col>
      <b-col md="11" sm="11" lg="9" xl="8" >
        <div class="onboading-section" v-for='(section) in listQuestions' :key="section.id">
          <div>
          <h3>{{section.name}}</h3>
          <div v-for='(question) in section.questions' :key="question.id">
            <b-row class='row-question'>
              <b-col cols="8">
                <h5 class='question'>
                  {{question.question}}
                </h5>
              </b-col>
              <b-col cols="4">
                <b-form-select
                  class='answers'
                  v-model='question.answer'
                  @input='changeAnswer()'
                  :options='statuses'></b-form-select>
              </b-col>
            </b-row>
            <b-row class='row-question'>
              <b-col cols="12">
              <textarea placeholder="Start typing your notes..."
                        @input='changeAnswer()'
                        v-model="question.notes">{{question.notes}}</textarea>
              </b-col>
            </b-row>
          </div>
          </div>
        </div>
        <div class='question-btns' v-show='isEditMode'>
          <b-btn size="lg" @click='save()' variant='success'>Save</b-btn>
          <b-btn size="lg" @click='undoAll()' variant='primary'>Undo</b-btn>
        </div>
      </b-col>
    </b-row>
    <div>
      <transition v-if='isLoading' name='fade'>
        <p class='loader-question'><b>Loading</b> <i class='fa fa-spinner fa-spin' aria-hidden='true'></i></p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'onboarding',
  data () {
    return {
      max: 100,
      questions: [],
      isEditMode: false,
      isLoading: true,
      listQuestions: [],
      statuses: [
        {text: 'Yes', value: 'yes'},
        {text: 'No', value: 'no'},
        {text: 'N/A', value: 'n/a'},
        {text: 'Waiting on client', value: 'wait'}
      ]
    }
  },
  methods: {
    changeAnswer () {
      let isEdit = this.questionsBackup.some((section, sectionIndex) => {
        return section.questions.some((question, index) => {
          return question.answer !== this.listQuestions[sectionIndex].questions[index].answer || question.notes !== this.listQuestions[sectionIndex].questions[index].notes
        })
      })
      this.isEditMode = !!isEdit
    },
    undoAll () {
      this.questionsBackup.forEach((section, sectionIndex) => {
        this.$set(this.listQuestions, sectionIndex, JSON.parse(JSON.stringify(section)))
      })
      this.isEditMode = false
    },
    save () {
      this.isLoading = true
      this.isEditMode = false
      let result = []
      this.listQuestions.forEach((section, sectionIndex) => {
        section.questions.forEach((question, index) => {
          if (question.answer !== this.questionsBackup[sectionIndex].questions[index].answer || question.notes !== this.questionsBackup[sectionIndex].questions[index].notes) {
            result.push({
              'answer': question.answer,
              'id': question.id,
              'notes': question.notes
            })
            this.questionsBackup[sectionIndex].questions[index].answer = question.answer
            this.questionsBackup[sectionIndex].questions[index].notes = question.notes
          }
        })
      })
      this.axios.post(
        this.newApiProperty + '/api/clients/' + this.$route.params.id + '/questions',
        result,
        this.configWithCredentials
      ).then(() => {
        this.isLoading = false
      })
      .catch((err) => {
        console.log(err)
        this.isLoading = false
      })
    }
  },
  created () {
    this.isLoading = true
    this.axios.get(
      this.newApiProperty + '/api/clients/' + this.$route.params.id + '/questions',
      this.configWithCredentials
    ).then((resp) => {
      this.listQuestions = resp.data
      this.questionsBackup = JSON.parse(JSON.stringify(this.listQuestions))
    })
    this.isLoading = false
  }
}
</script>

<style scoped>
  .row-question {
    padding: 10px 10px;
  }

  .question {
    display: inline-block;
    padding-right: 5px;
  }

  .answers {
    display: inline-block;
    width: 100%;
  }

  .btn-danger, .btn-success {
    font-size: 20px;
  }

  .question-btns {
    text-align: right;
    margin-top: 12px;
  }

  .loader-question {
    text-align: center;
    display: block;
    width: 100%;
    font-size: 18px;
  }

  .loader-question b {
    font-size: 18px;
  }

  .onboading {
    margin: 15px 0 0 0;
  }

  .onboading-section {
    border: 1px solid #8c8c8c;
    margin-bottom: 20px;
    padding: 1%;
    border-radius: 15px;
    padding-left: 2%;
  }

  .onboading-section h3 {
    text-align: left;
    font-weight: 600;
    font-size: 24px;
    margin-left: 2%;
  }

  textarea {
    width: 100%;
  }

  input {
    min-width: 170px;
  }

  textarea {
    padding: 3px 12px;
  }
</style>
