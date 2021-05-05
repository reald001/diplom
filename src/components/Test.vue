<template>
  <div>
    <ul v-for="task in tasks" :key="task">
      {{start(task)}}
      <h1>Новая задача</h1>
      <!-- <li class="list" :class="{'activeRow': rowI == rowIndex(task) && !checkForOptimal(task)}" v-for="(el, rowI) in task.matr" :key="el" :index="rowI"> -->
      <li class="list" v-for="(el, rowI) in task.matr" :key="el" :index="rowI">
        <span class="matrix-item" v-for="(num, columnI) in el" :key="num" :index="columnI">
          {{num}}
        </span>
      </li>
      <p>Решение оптимально? - <span>{{checkForOptimal(task)}}</span></p>  
        
          <div v-if="!task.optimal" v-for="i in 20" :key="i" class="simplex-step">
            <div v-if="task.beforeSim">
              <p>Избавляемся от отрицательных значений правой части если они есть...</p>
              {{beforeSimplex(task)}}
              <li class="list" v-for="el in task.matr" :key="el">
                <span class="matrix-item" v-for="e in el" :key="e">{{e.toFixed(2)}}</span>
              </li>
            </div>
            <div v-else> 
              <p> <i>Делаем симплекс-шаг...</i> </p>
              <p>Найденный столбец: {{columnIndex(task) + 1}} </p>
              <div v-if="rowIndex(task) === -1">
                <p>Решения нет.</p>
              </div>
              <div v-else>
                <p>Найденнаяя строка: {{rowIndex(task) + 1}} </p>
                <li class="list" v-for="(el, rowI) in changedMatrix(task)" :index="rowI" :key="el">
                  <span class="matrix-item" v-for="(num, columnI) in el" :index="columnI" :key="num">
                    {{num.toFixed(2)}}
                  </span>
                </li>
                <p>Решение оптимально? - <span>{{checkForOptimal(task)}}</span></p>  
              
              </div>
              
            </div>
          </div>
          {{checkForInteger(task)}}
          <div v-if="task.unsolveable">
            <p>Задача не имеет оптимального решения</p>
          </div>
          <div v-else-if="task.integer">
            <p>Ответ целочисленный.</p>
            <p><b>F(X) = {{task.matr[task.matr.length-1][task.matr[task.matr.length-1].length - 1].toFixed(2)}}</b></p>

          </div>
          <div v-else>
            
            
            <div class="list" v-for="row in task.matr" :key="row">
              <span class="matrix-item" v-for="el in row" :key="el">
                {{el.toFixed(2)}}
              </span>
            </div>
            <br>
            <br>

              {{insertNewRow(task)}}
              <p>Добавляем новое ограничение</p>
              <div class="list" v-for="row in task.matr" :key="row">
                <span class="matrix-item" v-for="el in row" :key="el">
                  {{el.toFixed(2)}}
                </span>
              </div>

              <br>
              {{gomoriStep(task)}}
              <p>Выполняем шаг Гомори</p>
              <div class="list" v-for="row in task.matr" :key="row">
                <span class="matrix-item" v-for="el in row" :key="el">
                  {{el.toFixed(2)}}
                </span>
              </div> 
              

            <p><b>F(X) = {{-task.matr[task.matr.length-1][task.matr[task.matr.length-1].length - 1].toFixed(2)}}</b></p>
          </div>
     
    </ul>
  </div>
</template>

<script>
  export default {
    name: "test",
    data(){
      return {
        tasks: [
          {
            type: 'max', 
            func: [1, 2], 
            array: [
                [-1, 2],
                [1, 1],
                [1, -1],
                [0, 1]
            ],
            arrRight: [2, 4, 2, 6],
            signs: ['>=', '>=', '<=', '<='],
          },
          {
            type: 'max', 
            func: [4, 5, 6], 
            array: [
                [1, 2, 3],
                [4, 3, 2],
                [3, 1, 1]
            ],
            arrRight: [35, 45, 40],
            signs: ['<=', '<=', '<='],
          },
          {
            type: 'max', 
            func: [1, -1], 
            array: [
                [-2, 3],
                [1, -2],
                [1, 1],
            ],
            arrRight: [9, 2, 8],
            signs: ['>=', '>=', '<='],
          },
          {
            type: 'max', 
            func: [1, 2, 3], 
            array: [
                [1,-1, 2],
                [4, 30, 2],
                [2, 3, -4],
            ],
            arrRight: [5, 4, 0],
            signs: ['>=', '>=', '<='],
          },
          {
            type: 'max', 
            func: [7, -9], 
            array: [
                [2, 1],
                [0, 3],
                [4, 5]
            ],
            arrRight: [9, 7, 5],
            signs: ['<=', '<=', '<='],
          },
          {
            type: 'max', 
            func: [6, 1], 
            array: [
                [3, -1],
                [2, 3],
                [-1, 4]
            ],
            arrRight: [9, 50, 18],
            signs: ['>=', '<=', '>='],
          },
          {
            type: 'max', 
            func: [1, -1, 1, 2], 
            array: [
                [1, -1, 2, 4],
                [3, 4, 3, 2],
                [3, 1, 0, 2]
            ],
            arrRight: [4, 2, 0],
            signs: ['<=', '<=', '>='],
          },
  
          
        ]
      }
    },
    methods: {
      // canon менял
      canon(task){
        let basisElems = []
              basisElems.length = task.array.length
              let newArr = []

              for(let i = 0; i < task.array.length; i++){
                newArr.push([])
                for(let j = 0; j < task.array[i].length; j++){
                  newArr[i].push(task.array[i][j])
                }
              }
              for(let i = 0; i < newArr.length; i++){
                basisElems.fill(0)
                if(task.signs[i] === '>='){
                  basisElems[i] = -1
                  newArr[i].push(...basisElems)
                }
                else{
                  basisElems[i] = 1
                  newArr[i].push(...basisElems)
                }
              }

              return newArr
      },
      setMatrix(task){
        let matrix = []
        for(let i = 0; i < task.array.length; i++){
          matrix.push([])
          matrix[i].push(...this.canon(task)[i])
          matrix[i].push(task.arrRight[i])
        }
        matrix.push([])
        let newFunc = task.func.map(el => el*-1)
        matrix[matrix.length-1].push(...newFunc)
        for(let i = 0; i < task.array.length + 1; i++){
          matrix[matrix.length-1].push(0)
        }

        return matrix
      },
      start(task){
        // task.matr = task.matrix()
        task.matr = this.setMatrix(task)

        for(let i = 0; i < task.matr.length; i++){
          if(task.signs[i] === ">="){
            task.matr[i] = task.matr[i].map(el => el*-1)
          }
        }
        task.integer = false
        task.beforeSim = true
        task.unsolveable = false
        task.optimal = false
      },
      lastRow(matrix){
        return matrix[matrix.length-1]
      },
      lastColumn(matrix){
        let arr = []
        for(let item of matrix){
          arr.push(item[item.length-1])
        }
        return arr
      },
      
      checkForOptimal(task){
        const arr = this.lastRow(task.matr)
        const solved = arr.filter(el => el < 0).length === 0
        return task.optimal = solved
      },
      columnIndex(task){
        const arr = [].slice.call(this.lastRow(task.matr))
        arr.pop()
        const maxItem = Math.min.apply(null, arr)
        const maxItemIndex = arr.indexOf(maxItem)
        return maxItemIndex;
      },
      rowIndex(task){
        const arr = [].slice.call(this.lastColumn(task.matr))
        const column = this.columnIndex(task)
        arr.pop()
        let colArr = []
        for(let el of task.matr){
          colArr.push(el[column])
        }
        colArr.pop()
        colArr = colArr.map(el => el < 0 ? 0 : el)

        let dividedArr = arr.map((el, index) => el / colArr[index])
        let tempArr = dividedArr.filter(el => (el >= 0 && el < Infinity))
        if(!tempArr.length){
          task.unsolveable = true
          task.optimal = true
          return -1
        }
        const minEl = Math.min.apply(null, tempArr)
        const rowIndex = dividedArr.indexOf(minEl)
        return rowIndex
      },
      newBasisRow(task){
        const basisRow = task.matr[this.rowIndex(task)].map(el => el / task.matr[this.rowIndex(task)][this.columnIndex(task)])
        return basisRow
      },
      
      changedMatrix(task){
        const curRow = this.newBasisRow(task)
        const curRowIdx = this.rowIndex(task)
        const curColumnIdx = this.columnIndex(task)
        let matrix = task.matr
        matrix[curRowIdx] = curRow
        const changedMatrix = matrix.map((el, index) => {
          if(index !== curRowIdx){
            return el.map((item, i) => item - (curRow[i] * el[curColumnIdx]))
          }
          else{
            return el
          }
        })
        task.matr = changedMatrix
        return changedMatrix
      },
      beforeSimplex(task){
        const rightArr = this.lastColumn(task.matr)
        rightArr.pop()
        const negativeArr = [].slice.call(rightArr).filter(el => el < 0)    

        if(negativeArr.length === 0){
          task.beforeSim = false
          return 
        }

        let matrCopy = [].slice.call(task.matr)
        const maxNegativeEl = Math.min(...negativeArr); 
        const rowIdx = rightArr.indexOf(maxNegativeEl)
        let curRow = [].slice.call(matrCopy[rowIdx])
        
        let curNegativeRow = [].slice.call(curRow)
        curNegativeRow.pop()
        curNegativeRow = curNegativeRow.filter(el => el < 0)
        if(curNegativeRow.length === 0){
          task.optimal = true
          task.unsolveable = true
          return 
        }

        const tempRow = [].slice.call(curRow)
        tempRow.pop()
        const maxNegativeRowEl = Math.min(...curNegativeRow); 
        const colIdx = tempRow.indexOf(maxNegativeRowEl)

        
        curRow = curRow.map(el => el / curRow[colIdx])
        matrCopy[rowIdx] = curRow
        matrCopy = matrCopy.map((el, index) => {
          if(index !== rowIdx){
            return el.map((item, i) => item - (curRow[i] * el[colIdx]))
          }
          else{
            return el
          }
        })

        task.matr = matrCopy
        if(Math.min(...this.lastColumn(task.matr)) >= 0){
          task.beforeSim = false
        }
        return

      },
      isBasis(row){
        let noOnes = true
        for(let el of row){
          if(el === 0){
            continue
          }
          else if(el === 1 && noOnes){
            noOnes = false
            continue
          }
          else{
            return false
          }
          
        }
        return true
      },
      column(arr, i){
        const col = []
        for(let el of arr){
          col.push(el[i])
        }
        return col
      },
      basisColIdxs(task){
        const baseArr = []
        for(let i = 0; i < task.func.length; i++){
          let col = this.column(task.matr, i)
          if(this.isBasis(col)){
            baseArr.push(i)
          }
        }
        return baseArr
      },
      basisRowIdxs(task){
        const res = []
        for(let row of this.basisColIdxs(task)){
          let col = this.column(task.matr, row).indexOf(1)
          res.push(col)
        }

        return res
      },
      basisRowEls(task){
        const arr = []
        for(let el of this.basisRowIdxs(task)){
          arr.push(this.lastColumn(task.matr)[el])
        }
        return arr
      },
      checkForInteger(task){
        const arr = this.basisRowEls(task)
        for(let el of arr){
          if(el.toFixed(2) !== (Math.round(el).toFixed(2))){
            task.integer = false
            return 
          }
        }
        task.integer = true
        return        
      },
      curDrobElIdx(task){
        let arr = []
        for(let el of this.basisRowEls(task)){
          arr.push(el.toFixed(2) - (Math.floor(el).toFixed(2)))
        }
        arr = arr.filter(el => el !== 0 && el !== 1)
        const idx = arr.indexOf(Math.max(...arr))

        return idx
      },
      
      newRow(task){
        let arr = [].slice.call(task.matr[this.basisRowIdxs(task)[this.curDrobElIdx(task)]])
        arr.pop()
        arr.pop()
        arr = arr.map(el => {
          return (el.toFixed(2) - (Math.floor(el).toFixed(2)) ) == 1 ? 0 : (el.toFixed(2) - (Math.floor(el).toFixed(2)) )
        })
        arr.push(-1)
        let lastEl = this.basisRowEls(task)[this.curDrobElIdx(task)]
        lastEl = lastEl - Math.floor(lastEl)
        arr.push(lastEl)
        arr = arr.map(el => el*-1)
        // if(arr.filter(el => el == 0).length >= arr.length - 2){
          
        //   return false
        // }
        return arr
      },
      insertNewRow(task){
        // if(this.newRow(task) === false){
        //   task.unsolveable = true
        //   return
        // }
        for(let row of task.matr){
          row.splice(row.length - 1, 0, 0)
        }
        task.matr.splice(task.matr.length - 1, 0, this.newRow(task))
        task.matr[task.matr.length - 1] = task.matr[task.matr.length - 1].map(e => e*-1)
        return
      },
      gomoriStep(task){
        // this.insertNewRow(task)
        let arr = [].slice.call(task.matr)
        let F = [].slice.call(arr[arr.length - 1])
        F.pop()
        F.pop()
        let X = [].slice.call(arr[arr.length - 2])
        X.pop()
        X.pop()
       
        let FdelX = F.map((e, i) => e / X[i])
        let temp = FdelX.filter(e => e >= 0 && e < Infinity)
        let curEl = Math.min(...temp)
        let colIdx = FdelX.indexOf(curEl)

        let rowIdx = task.matr.length - 2
        task.matr[rowIdx] = task.matr[rowIdx].map((e, i) => e / task.matr[rowIdx][colIdx])

        task.matr = task.matr.map((el, index) => {
          if(index !== rowIdx){
            return el.map((item, i) => item - (task.matr[rowIdx][i] * el[colIdx]))
          }
          else{
            return el
          }
        })
        return this.checkForInteger(task)
      },

      /*TODO:
      [+] Реализовать beforeSimplex
      [+] Реализовать метод Гомори
      [+] Проверить решается ли задача
      [не нужно] Избавиться от цикла от 1 до 10, найти альтернативу 
      [-] Создать отдельную страницу с вводом данных пользователем (исп. vue-router)
      [-] Подробное решение скрыть
      [-] Добавить кнопку показа подробного решения
      [-] Сделать решение для задач на минимум
      
      */
    }
    
  }
</script>

<style scoped>
  ul{list-style: none;width: max-content; margin: 0 auto;}
  .matrix-item{
    width: 80px;height: 40px;
    display: inline-flex;
    font-size: 20px; 
    justify-content: center;
    align-items: center;
  }
  .simplex-step{
    margin: 20px 0;
  }
  .activeCol{
    border-right: 3px solid rgb(30, 255, 0);
    border-left: 3px solid rgb(30, 255, 0);
  }
  .activeRow{
    border-top: 3px solid rgb(30, 255, 0);
    border-bottom: 3px solid rgb(30, 255, 0);
  }
</style>
