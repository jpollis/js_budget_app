/*
// budget/data controller
var budgetController = (function() {

})();




// UI Controller
var UIController = (function() {
	
})();




// global controller
var appController = (function(budgetCtrl, UICtrl) {
	var description, income, expenses;
	//budget
	income = 0;
	expenses = 0;
	
	
	
	var inputValue = document.querySelector('.add__value');
	
	
	
	// UI
	var incomeUI = document.querySelector('.budget__income--value');
	incomeUI.textContent = income;
	
	var ExpensesUI = document.querySelector('.budget__expenses--value');
	ExpensesUI.textContent = expenses;
	
	var budgetOperator = document.querySelector('.add__type');
	var incomeList = document.querySelector('.income__list');
	var expensesList = document.querySelector('.expenses__list');

	//click event
	document.querySelector('.add__btn').addEventListener('click', function() {
		if (budgetOperator.selectedIndex === 0) {
		  income += parseInt(inputValue.value);
		  incomeUI.textContent = income;
		  //document.querySelector('.income').style.visibility = 'visible';
	    } else {
		  expenses += parseInt(inputValue.value);
		  ExpensesUI.textContent = expenses;
		  //document.querySelector('.expenses').style.visibility = 'visible';
	    }
		// 1. gather field input data
		
		// 2. add the item to the budget controller
		
		// 3. add new item to UI
		
		// 4. calculate budget
		
		// 5. display the budget on UI
		
	});
	
	// keypress event
	document.addEventListener('keypress', function(e) {
		
		var key = e.which || e.keyCode;
		if (key === 13) {
			
		}
		
	});
	

})(budgetController, UIController);

*/


/********************************
** Clean Slate
*/

// budget/data controller
var budgetController = (function() {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: [],
			inc: []
		}
	}
	
	return {
		addItem: function(type, des, val) {
			
			var newItem, ID;
			
			// create id
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length -1].id + 1;
			} else {
				ID = 0;
			}
			// create new item
			if (type === 'exp') {
			  newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			
			// push to data structure and return new item
			data.allItems[type].push(newItem);
			return newItem;
		},
		
		testing: function() {
			console.log(data);
		}
	};

})();




// UI Controller
var UIController = (function() {
	
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputAddBtn: '.add__btn'
	};
	
	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},
		
		getDOMStrings: function() {
			return DOMStrings;
		}
	};
	
})();




// global controller
var appController = (function(budgetCtrl, UICtrl) {
	
	var setupEventListeners = function() {
		
		var DOM = UICtrl.getDOMStrings();
		
		
		document.querySelector(DOM.inputAddBtn).addEventListener('click', ctrlAddItem); 
		
		
		document.addEventListener('keypress', function(e) {
		  if (e.which === 13 || e.keyCode === 13) {
	        ctrlAddItem();
		  } 
		});
		
	};
	
	var ctrlAddItem = function() {
		// 1. gather field input data
		var input = UICtrl.getInput();
		console.log(input);
		// 2. add the item to the budget controller
		var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		// 3. add new item to UI
		
		// 4. calculate budget
		
		// 5. display the budget on UI
	}
	
	return {
		init: function() {
			console.log('Application has started');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

appController.init();