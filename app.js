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
		this.percentage = -1;
	};
	
	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
		  this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
		  this.percentage = -1;
		}
	};
	
	Expense.prototype.getPercentage = function() {
		return this.percentage;
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
		},
		budget: 0,
		percentage: -1
	};
	
	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};
	
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
		
		deleteItem: function(type, id) {
			var ids, index
			//data.allItems[type].indexOf(ID);
			
			ids = data.allItems[type].map(function(current){
				return current.id;
			});
			
			index = ids.indexOf(id);
			
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
			
		},
		
		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			
			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			
			// calculate percentage of income that gets spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
			
			
		},
		
		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},
		
		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			
			return allPerc;
		},
		
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		inputAddBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};
	
	var formatNumber = function(num, type) {
			var numSplit, integ, dec, type;
			/*
			+ or - before a number
			2 decimal points
			comma separating thousands
			
			2130.4567 --> + 2,310.46
			2000 --> + 2,000.00
			*/
			
			num = Math.abs(num);
			num = num.toFixed(2);
			
			numSplit = num.split('.');
			
			integ = numSplit[0];
			if (integ.length > 3) {
				integ = integ.substr(0, integ.length - 3) + ',' + integ.substr(integ.length - 3, 3);
			}
			
			dec = numSplit[1];
			
			return (type === 'exp' ? '-' : '+') + ' ' + integ +  '.' + dec;
		};
		
		var nodeListForEach = function(list, callback) {
			for (var i = 0; i < list.length; i++) {
				callback(list[i], i);
			}
		};
	
	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},
		
		addListItem: function(obj, type) {
			var html, newHtml, listElement;
			// create html string with placeholder
			if (type === 'inc') {
				
				listElement = DOMStrings.incomeContainer;
				
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				
			} else if (type === 'exp') {
				
				listElement = DOMStrings.expenseContainer;
				
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			// replace placeholder text with real data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			// insert into DOM
			
			document.querySelector(listElement).insertAdjacentHTML('beforeend', newHtml);
		},
		
		deleteListItem: function(selectorID) {
			var element = document.getElementById(selectorID);
			element.parentNode.removeChild(element);
		},
		
		clearFields: function() {
			var fields, fieldsArray, typeField;
			
			//typeField = document.querySelector(DOMStrings.inputType);
			
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
			
			fieldsArray = Array.prototype.slice.call(fields);
			
			fieldsArray.forEach(function(current, index, array){
				current.value = "";				
			});
			
			//typeField.value = 'inc';
			
			fieldsArray[0].focus();
			
		},
		
		displayBudget: function(obj) {
			var type; 
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			
			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
			
		},
		
		displayPercentages: function(percentages) {
			
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
			
			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
			
		},
		
		displayMonth: function() {
			
			var now, year, month, months;
			
			now = new Date();
			
			year = now.getFullYear();
			
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			
			month = now.getMonth();
			
			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;
			
		},
		
		changedType: function() {
			var fields = document.querySelectorAll(
				DOMStrings.inputType + ',' +
				DOMStrings.inputDescription + ',' + 
				DOMStrings.inputValue
			);
			
			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});
			
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
			  e.preventDefault();
			  ctrlAddItem();
			} 
		});
		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
		
	};
	
	var updateBudget = function() {
		// 1. calculate budget
		budgetCtrl.calculateBudget();
		//2. Return the budget
		var budget = budgetCtrl.getBudget();
		// 3. display the budget on UI
		UICtrl.displayBudget(budget);
		
		
	};
	
	var updatePercentages = function() {
		// calculate percentages
		budgetCtrl.calculatePercentages();
		// read from budgetCtrl
		var percentages = budgetCtrl.getPercentages();
		// update UI
		UICtrl.displayPercentages(percentages);
	};
	
	var ctrlAddItem = function() {
		// 1. gather field input data
		var input = UICtrl.getInput();
		console.log(input);
		
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. add the item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// 3. add new item to UI
			UICtrl.addListItem(newItem, input.type);
			// 3.5 clear fields
			UICtrl.clearFields();
			
			//calculate and update budget
			updateBudget();
			
			//update percentages
			updatePercentages();
		}
	};
	
	var ctrlDeleteItem = function(e) {
		var itemID, splitID, type, ID, itemsList, itemType, item
		
		itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if (itemID) {
			
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			
			// delete item from data structure
			budgetCtrl.deleteItem(type, ID);
			/*
			itemsList = budgetCtrl.getBudget();
			itemType = type + "Items";
			item = itemsList[itemType];
			
			item.splice(ID, 1);
			*/
		
			// delete from UI
			UICtrl.deleteListItem(itemID);
			// update new budget
			updateBudget();
			
			// update percentages
			updatePercentages();
		}
	};
	
	return {
		init: function() {
			console.log('Application has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

appController.init();