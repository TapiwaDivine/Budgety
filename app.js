// module to handle budget data
var budgetController = (function(){

    // creating a constructor prototype obj for all expenses__________________________________
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // creating a constructor prototype obj for all incomes_________________________________
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //setting up a data structure for expenses and income____________________________________
    var data = {
        allItems = {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
        

    };
    // globalizing the data structure
    return {
        addItem: function(type, des, val){
            var newItem; ID;

            // ID to be last ID + 1
            // creating id for new item that will be put in the 
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id +1;
            }else {
                ID = 0
            }
            
            
            // create new item based on 'inc' or 'exp' type 
            if( type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            // push it to the data obj
            data.allItems[type].push(newItem)
            // return the new element
            return newItem            
        }
    }

})();
// UI CONTROLLER
var UIController = (function(){

    // object to store query selections
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value', 
        inputBtn: '.add__btn'       
    }
    return {
        // globalizing getting user input 
        getInput: function(){
            return {
                // pulling data from the user input in html form/input
                type: document.querySelector(DOMstrings.inputType).value,// either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        // globalizing the DOMstring object to acces it in the controller
        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    // function to execute event handlers
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

    var ctrlAddItem = function(){
        var input; newItem;
        // 1. get the field input data
        input = UICtrl.getInput();
        //console.log(input)
        // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
        // 3. Add new item to the UI
        // 4. calculate the budget
        // 5. display budget on UI
    }
    
    return {
        // object with a function for initialising functions
        init: function() {
            console.log('Application has started.')
            setupEventListeners();
        }
    }

})(budgetController, UIController);

// the init function inside the controller function
controller.init();