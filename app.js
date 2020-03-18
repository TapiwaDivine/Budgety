/************************************************************************************
 *****************************************BUDGET CONTROLLER**************************
 ************************************************************************************/

// module to handle budget data
var budgetController = (function(){

    // creating a constructor prototype obj for all expenses__________________EXPENSES CONSTRUCTOR
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // creating a constructor prototype obj for all incomes_____________________INCOME CONSTRUCTOR
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // function to calculate totals_________________________________________________________TOTALS
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    //setting up a data structure for expenses and income_____________________________________DATA
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
        
    };
    
    // globalizing__________________________________________________GLOBALIZING BUDGET CONTROLLER 
    return {

        // function to add input in database_______________________________________ADDITEM
        addItem: function(type, des, val){
            var newItem, ID;

            // ID to be last ID + 1
            // creating id for new item that will be put in the data allItems ____________DATA ID 
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id +1;
            }else {
                ID = 0
            }
            
            
            // create new item based on 'inc' or 'exp' type____________________________INPUT DATA 
            if( type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            // push it to the data obj
            data.allItems[type].push(newItem)
            // return the new element
            return newItem            
        },
        // Function to calculate the Incomes & Expenses_______________________BUDGET CALCULATION
        calculateBudget: function(){
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the buget income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calculate the percentage of income that we spent and rounding 
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            console.log(data.percentage)
        },

        // Function to return data from Database_________________________________GET BUDGET
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.totals.percentage

            }
        },
        testing: function(){
            console.log(data)
        },
    }

})();



/************************************************************************************
 *****************************************UI CONTROLLER******************************
 ************************************************************************************/
// Module to control the User Interface
var UIController = (function(){

    // object to store query selections______________________________________DOCUMENT SELECTIONS
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value', 
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',   
    }
    return {
        // globalizing getting user input______________________________________GET USER INPUT 
        getInput: function(){
            return {
                // pulling data from the user input in html form/input
                type: document.querySelector(DOMstrings.inputType).value,// either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        // function to display input list on UI_____________________________DISPLAY INPUT 
        addListItem: function(obj, type){
            var html, newHtml, element;
            //create a HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer  
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // replace placeholder text with actual data_______________________DATA DISPLAY
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value, type);
    
            // insert html in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
            
        },

        // function to clear fields after input is enter____________________CLEAR FIELD 
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)
            
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            })
            fieldsArr[0].focus();
        },

        // globalizing the DOMstring object to acces it in the controller___DOMSTINGS TO CONTROLER
        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();



/************************************************************************************
 *********************************** CONTROLLER *************************************
 ************************************************************************************/

var controller = (function(budgetCtrl, UICtrl){
    // function to execute event handlers________________________________
    var setupEventListeners = function() {
        // getting globalized DOMstrings to be accessible in this current function
        var DOM = UICtrl.getDOMstrings();
        // event for btn click
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        // event to target enter/return key on keyboard
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }
        });
    };
    // control function to update Budget__________________________________Control Budget
    var updateBudget = function(){
        // 1. calculate the budget
        budgetCtrl.calculateBudget()
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display budget on UI
        console.log(budget)

    }

    // Controller function for adding items_______________________________CTRL ADD ITEMS
    var ctrlAddItem = function(){
        var input, newItem;
        // 1. get the field input data
        input = UICtrl.getInput();
        
        //form validation and data integrity
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add new item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. Clear the fields
            UICtrl.clearFields();
            // 5. calculate and update budget
            updateBudget();

        }
    }
    
    return {
        // object with a function for initialising functions_________________________INIT
        init: function() {
            console.log('Application has started.')
            setupEventListeners();
        }
    }

})(budgetController, UIController);

// the init function inside the controller function
controller.init();