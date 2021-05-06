<template>
  <div>
    <a v-if="testsPage" class="main-link" href="/">Перейти к калькулятору</a>

    <ul v-for="(task, idx) in tasks" :key="'A' + idx">
      {{
        start(task)
      }}
      <h1>Задача №{{ idx + 1 }}</h1>
      <li
        class="list"
        v-for="(el, rowI) in task.matr"
        :key="'B' + rowI"
        :index="rowI"
      >
        <span
          class="matrix-item"
          v-for="(num, columnI) in el"
          :key="'C' + columnI"
          :index="columnI"
        >
          {{ num }}
        </span>
      </li>
      <!-- <p>
        Решение оптимально? - <span>{{ checkForOptimal(task) }}</span>
      </p> -->

      <div
        v-if="!task.optimal"
        v-for="i in 20"
        :key="'D' + i"
        class="simplex-step"
      >
        <div v-if="task.beforeSim">
          <p>
            Избавляемся от отрицательных значений правой части если они есть...
          </p>
          {{ beforeSimplex(task) }}
          <li class="list" v-for="(el, j) in task.matr" :key="'E' + j">
            <span class="matrix-item" v-for="(e, k) in el" :key="'F' + k">{{
              e.toFixed(2)
            }}</span>
          </li>
        </div>
        <div v-else>
          <p>Задача оптимальна? - {{ checkForOptimal(task) }}</p>
          <div v-if="!task.optimal">
            <p><i>Делаем симплекс-шаг...</i></p>
            <p>Найденный столбец: {{ columnIndex(task) + 1 }}</p>
            <div v-if="rowIndex(task) === -1">
              <p>Решения нет.</p>
            </div>
            <div v-else>
              <p>Найденнаяя строка: {{ rowIndex(task) + 1 }}</p>
              <li
                class="list"
                v-for="(el, rowI) in changedMatrix(task)"
                :index="rowI"
                :key="'G' + rowI"
              >
                <span
                  class="matrix-item"
                  v-for="(num, columnI) in el"
                  :index="columnI"
                  :key="'H' + columnI"
                >
                  {{ num.toFixed(2) }}
                </span>
              </li>
              <p>
                Решение оптимально? - <span>{{ checkForOptimal(task) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {{
        checkForInteger(task)
      }}
      <div v-if="task.unsolveable">
        <p>Задача не имеет оптимального решения</p>
      </div>
      <div v-else-if="task.integer">
        <p>Ответ целочисленный.</p>
        <p>
          <b>F(X) = {{ F(task).toFixed(2) }}</b>
        </p>
      </div>
      <div v-else>
        <div class="list" v-for="(row, i) in task.matr" :key="'I' + i">
          <span class="matrix-item" v-for="(el, j) in row" :key="'J' + j">
            {{ el.toFixed(2) }}
          </span>
        </div>
        <br />
        <br />

        <div
          v-if="!task.integer && !task.unsolveable"
          v-for="i in 20"
          :key="'K' + i"
        >
          {{ insertNewRow(task) }}
          <p>Добавляем новое ограничение</p>
          <div class="list" v-for="(row, j) in task.matr" :key="'L' + j">
            <span class="matrix-item" v-for="(el, k) in row" :key="'M' + k">
              {{ el.toFixed(2) }}
            </span>
          </div>

          <br />
          {{ gomoriStep(task) }}
          <p>Выполняем шаг Гомори</p>
          <div class="list" v-for="(row, j) in task.matr" :key="'N' + j">
            <span class="matrix-item" v-for="(el, k) in row" :key="'O' + k">
              {{ el.toFixed(2) }}
            </span>
          </div>
          <br />
        </div>

        <p>
          <b>F(X) = {{ F(task).toFixed(2) }}</b>
        </p>
      </div>
    </ul>
  </div>
</template>

<script>
import db from "@/assets/tests.json";
export default {
  name: "tests",
  props: ["tasks"],
  data() {
    return {
      testsPage: false
    };
  },
  methods: {
    canon(task) {
      let basisElems = [];
      basisElems.length = task.array.length;
      let newArr = [];

      for (let i = 0; i < task.array.length; i++) {
        newArr.push([]);
        for (let j = 0; j < task.array[i].length; j++) {
          newArr[i].push(task.array[i][j]);
        }
      }
      for (let i = 0; i < newArr.length; i++) {
        basisElems.fill(0);
        if (task.signs[i] === ">=") {
          basisElems[i] = -1;
          newArr[i].push(...basisElems);
        } else {
          basisElems[i] = 1;
          newArr[i].push(...basisElems);
        }
      }

      return newArr;
    },
    setMatrix(task) {
      let matrix = [];
      for (let i = 0; i < task.array.length; i++) {
        matrix.push([]);
        matrix[i].push(...this.canon(task)[i]);
        matrix[i].push(task.arrRight[i]);
      }
      matrix.push([]);
      let newFunc = task.func.map(el => (task.type === "min" ? el : el * -1));
      matrix[matrix.length - 1].push(...newFunc);
      for (let i = 0; i < task.array.length + 1; i++) {
        matrix[matrix.length - 1].push(0);
      }
      return matrix;
    },
    start(task) {
      task.matr = this.setMatrix(task);

      for (let i = 0; i < task.matr.length; i++) {
        if (task.signs[i] === ">=") {
          task.matr[i] = task.matr[i].map(el => el * -1);
        }
      }
      task.integer = false;
      task.gomori = false;
      task.beforeSim = true;
      task.unsolveable = false;
      task.optimal = false;
    },
    lastRow(matrix) {
      return matrix[matrix.length - 1];
    },
    lastColumn(matrix) {
      let arr = [];
      for (let item of matrix) {
        arr.push(item[item.length - 1]);
      }
      return arr;
    },

    checkForOptimal(task) {
      const arr = [].slice.call(this.lastRow(task.matr));
      arr.pop();
      const solved = arr.filter(el => el < 0).length === 0;
      return (task.optimal = solved);
    },
    columnIndex(task) {
      const arr = [].slice.call(this.lastRow(task.matr));
      arr.pop();
      const maxItem = Math.min.apply(null, arr);
      const maxItemIndex = arr.indexOf(maxItem);
      return maxItemIndex;
    },
    rowIndex(task) {
      const arr = [].slice.call(this.lastColumn(task.matr));
      const column = this.columnIndex(task);
      arr.pop();
      let colArr = [];
      for (let el of task.matr) {
        colArr.push(el[column]);
      }
      colArr.pop();
      colArr = colArr.map(el => (el < 0 ? 0 : el));

      let dividedArr = arr.map((el, index) => el / colArr[index]);
      let tempArr = dividedArr.filter(el => el >= 0 && el < Infinity);
      if (!tempArr.length) {
        task.unsolveable = true;
        task.optimal = true;
        return -1;
      }
      const minEl = Math.min.apply(null, tempArr);
      const rowIndex = dividedArr.indexOf(minEl);
      return rowIndex;
    },
    newBasisRow(task) {
      const basisRow = task.matr[this.rowIndex(task)].map(
        el => el / task.matr[this.rowIndex(task)][this.columnIndex(task)]
      );
      return basisRow;
    },

    changedMatrix(task) {
      const curRow = this.newBasisRow(task);
      const curRowIdx = this.rowIndex(task);
      const curColumnIdx = this.columnIndex(task);
      let matrix = task.matr;
      matrix[curRowIdx] = curRow;
      const changedMatrix = matrix.map((el, index) => {
        if (index !== curRowIdx) {
          return el.map((item, i) => item - curRow[i] * el[curColumnIdx]);
        } else {
          return el;
        }
      });
      task.matr = changedMatrix;
      return changedMatrix;
    },
    beforeSimplex(task) {
      const rightArr = this.lastColumn(task.matr);
      rightArr.pop();
      const negativeArr = [].slice.call(rightArr).filter(el => el < 0);

      if (negativeArr.length === 0) {
        task.beforeSim = false;
        return;
      }

      let matrCopy = [].slice.call(task.matr);
      const maxNegativeEl = Math.min(...negativeArr);
      const rowIdx = rightArr.indexOf(maxNegativeEl);
      let curRow = [].slice.call(matrCopy[rowIdx]);

      let curNegativeRow = [].slice.call(curRow);
      curNegativeRow.pop();
      curNegativeRow = curNegativeRow.filter(el => el < 0);
      if (curNegativeRow.length === 0) {
        task.optimal = true;
        task.unsolveable = true;
        return;
      }

      const tempRow = [].slice.call(curRow);
      tempRow.pop();
      const maxNegativeRowEl = Math.min(...curNegativeRow);
      const colIdx = tempRow.indexOf(maxNegativeRowEl);

      curRow = curRow.map(el => el / curRow[colIdx]);
      matrCopy[rowIdx] = curRow;
      matrCopy = matrCopy.map((el, index) => {
        if (index !== rowIdx) {
          return el.map((item, i) => item - curRow[i] * el[colIdx]);
        } else {
          return el;
        }
      });

      task.matr = matrCopy;
      if (Math.min(...this.lastColumn(task.matr)) >= 0) {
        task.beforeSim = false;
      }
      return;
    },
    isBasis(row) {
      let noOnes = true;
      for (let el of row) {
        if (el === 0) {
          continue;
        } else if (el === 1 && noOnes) {
          noOnes = false;
          continue;
        } else {
          return false;
        }
      }
      return true;
    },
    column(arr, i) {
      const col = [];
      for (let el of arr) {
        col.push(el[i]);
      }
      return col;
    },
    basisColIdxs(task) {
      const baseArr = [];
      for (let i = 0; i < task.func.length; i++) {
        let col = this.column(task.matr, i);
        if (this.isBasis(col)) {
          baseArr.push(i);
        }
      }
      return baseArr;
    },
    basisRowIdxs(task) {
      const res = [];
      for (let row of this.basisColIdxs(task)) {
        let col = this.column(task.matr, row).indexOf(1);
        res.push(col);
      }

      return res;
    },
    basisRowEls(task) {
      const arr = [];
      for (let el of this.basisRowIdxs(task)) {
        arr.push(this.lastColumn(task.matr)[el]);
      }
      return arr;
    },
    checkForInteger(task) {
      const arr = this.basisRowEls(task);
      for (let el of arr) {
        if (el.toFixed(2) !== Math.round(el).toFixed(2)) {
          task.integer = false;
          return;
        }
      }
      task.integer = true;
      return;
    },
    curDrobElIdx(task) {
      let arr = [];
      for (let el of this.basisRowEls(task)) {
        arr.push(el.toFixed(2) - Math.floor(el).toFixed(2));
      }
      arr = arr.filter(el => el !== 0 && el !== 1);
      const idx = arr.indexOf(Math.max(...arr));

      return idx;
    },

    newRow(task) {
      let arr = [].slice.call(
        task.matr[this.basisRowIdxs(task)[this.curDrobElIdx(task)]]
      );
      arr.pop();
      arr.pop();
      arr = arr.map(el => {
        return el.toFixed(2) - Math.floor(el).toFixed(2) == 1
          ? 0
          : el.toFixed(2) - Math.floor(el).toFixed(2);
      });
      arr.push(-1);
      let lastEl = this.basisRowEls(task)[this.curDrobElIdx(task)];
      lastEl = lastEl - Math.floor(lastEl);
      arr.push(lastEl);
      arr = arr.map(el => el * -1);

      return arr;
    },
    insertNewRow(task) {
      for (let row of task.matr) {
        row.splice(row.length - 1, 0, 0);
      }
      task.matr.splice(task.matr.length - 1, 0, this.newRow(task));
      task.matr[task.matr.length - 1] = task.matr[task.matr.length - 1].map(
        e => e * -1
      );
      return;
    },
    gomoriStep(task) {
      task.gomori = true;
      let arr = [].slice.call(task.matr);
      let F = [].slice.call(arr[arr.length - 1]);
      F.pop();
      F.pop();
      let X = [].slice.call(arr[arr.length - 2]);
      X.pop();
      X.pop();

      let FdelX = F.map((e, i) => e / X[i]);
      let temp = FdelX.filter(e => e >= 0 && e < Infinity);
      let curEl = Math.min(...temp);
      let colIdx = FdelX.indexOf(curEl);

      let rowIdx = task.matr.length - 2;
      task.matr[rowIdx] = task.matr[rowIdx].map(
        (e, i) => e / task.matr[rowIdx][colIdx]
      );

      task.matr = task.matr.map((el, index) => {
        if (index !== rowIdx) {
          return el.map((item, i) => item - task.matr[rowIdx][i] * el[colIdx]);
        } else {
          return el;
        }
      });
      return this.checkForInteger(task);
    },
    F(task) {
      return Math.abs(task.matr[task.matr.length - 1][task.matr[0].length - 1]);
    }
  },
  created() {
    const curPage = document.URL.split("/")[document.URL.split("/").length - 1];
    console.log(db);

    if (curPage === "tests") {
      this.testsPage = true;
      this.tasks = db;
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  width: max-content;
  margin: 0 auto;
}
.matrix-item {
  width: 80px;
  height: 40px;
  display: inline-flex;
  font-size: 20px;
  justify-content: center;
  align-items: center;
}
.simplex-step {
  margin: 20px 0;
}
.activeCol {
  border-right: 3px solid rgb(30, 255, 0);
  border-left: 3px solid rgb(30, 255, 0);
}
.activeRow {
  border-top: 3px solid rgb(30, 255, 0);
  border-bottom: 3px solid rgb(30, 255, 0);
}
.main-link {
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
