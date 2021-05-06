<template>
  <div>
    
    <a class="test-link" href="/tests">Перейти к тестам</a>
     
    <h3>
      Количество переменных:
      <select
      @change="resetInputs"
        name="select-1"
        id="select-1"
        v-model.number="xCount"
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </h3>

    <h3>
      Количество неравенств:
      <select
      @change="resetInputs"
        name="select-2"
        id="select-2"
        v-model.number="equationCount"
      >
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        
      </select>
    </h3>

    <div class="input-field" v-if="inputArea">
      <div class="function">
        <p class="x-field" style="padding-right: 40px;">
          <span v-for="x in xCount" :key="'X' + x">x{{ x }}</span>
        </p>
        <span>F = </span>
        <input
          class="input"
          v-for="x in xCount"
          :key="'Func' + x"
          type="text"
          v-model.number="task.func[x - 1]"
        />
        <select class="type" v-model="task.type">
          <option value="max">max</option>
          <option value="min">min</option>
        </select>
      </div>

      <div class="input-area">
        <ul class="input-ul">
          <p class="x-field">
            <span v-for="x in xCount" :key="x">x{{ x }}</span>
          </p>
          <li v-for="i in equationCount" :key="'d'+i">
            <input
              class="input"
              v-for="j in xCount"
              :key="'eq-' + j"
              v-model.number="helpArr[xCount * (i-1) + j-1]"
            />
          </li>
        </ul>
        <ul class="input-ul">
          <p class="sign">sign</p>
          <select
            class="input-select"
            v-for="i in equationCount"
            :key="'znak-' + i"
            v-model="task.signs[i-1]"
          >
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
          </select>
        </ul>
        <ul class="input-ul">
          <p>B</p>
          <li v-for="i in equationCount" :key="'x-' + i">
            <input v-model.number="task.arrRight[i - 1]" class="input" />
          </li>
        </ul>
      </div>
      <button class="solve btn-prim" @click="solve">Решить</button>

      <Tests :tasks="tasks"> </Tests>
    </div>
   
  </div>
</template>

<script>
import Tests from "./Tests";
export default {
  components: {
    Tests
  },
  data() {
    return {
      tasks: [],
      task: {
        type: "max",
        func: [6, 1],
        array: [[3, -1], [2, 3], [-1, 4]],
        arrRight: [9, 50, 18],
        signs: ['>=', '<=', '>=']
      },
      helpArr: [3, -1, 2, 3, -1, 4],
      xCount: 2,
      equationCount: 3, 
      inputArea: true 
    };
  },
  methods: {
    resetInputs(){
      this.helpArr = []
      this.task.func = []
      this.task.arrRight = []
      this.task.signs = []
    },
    solve() {
      this.task.array = []
      for(let i = 0; i < this.equationCount; i++){
        this.task.array.push([])
        for(let j = 0; j < this.xCount; j++){
          this.task.array[i][j] = this.helpArr[this.xCount * i + j]
        }
      }
      
      
      if (this.tasks.length) {
        this.tasks.pop();
      }
      this.tasks.push(this.task);
      console.log(this.task);
    },

  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.input {
  text-align: center;
  width: 80px;
  height: 60px;
  padding: 5px;
  margin: 5px;
  font-size: 18px;
}
.input-ul {
  list-style: none;
}
.btn-prim {
  width: 90px;
  height: 35px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin: 20px;
  font-size: 18px;
  background: rgb(246, 197, 197);
}
.solve {
  background: rgb(5, 255, 59);
  color: #fff;
}
.input-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-select {
  display: block;
  width: 50px;
  height: 60px;
  padding: 5px;
  margin: 10px;
  text-align: center;
}

.x-field {
  justify-content: space-around;
}
.x-field span {
  display: inline-block;
  width: 90px;
}
.sign {
  transform: translateY(5px);
}
.type {
  width: 50px;
  height: 30px;
  margin: 5px;
}
.input-field {
  margin-top: 20px;
}
.test-link{
  display: inline-block;
  padding: 15px;
  font-size: 20px;
  margin: 5px;
  background: rgb(223, 223, 223);
  border: 1px solid black;
  color: rgb(15, 15, 15);
  text-decoration: none;
}
</style>
