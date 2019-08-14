class CalcController
{
    constructor()
    {
        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector('#display');
        this._dateCalcEl = document.querySelector('#data');
        this._timeCalEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }
    initialize()
    {
        this.setDisplayDateTime();   
        setInterval(()=>{
            this.setDisplayDateTime();
        },1000);
        //atualizar display
        this.setLastNumberToDisplay();
    }
    setDisplayDateTime()
    {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day:"2-digit",
            month:"long",
            year:"numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    addEventListenerAll(element,events,fun)
    {
        events.split(' ').forEach((event)=>{
            element.addEventListener(event,fun,false);
        });
    }
    clearAll()
    {
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this.setLastNumberToDisplay();
    }
    clearEntry()
    {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    getLastOperation()
    {
        return this._operation[this._operation.length - 1];
    }
    setLastOperation(value)
    {
        this._operation[this._operation.length - 1] = value;
    }
    isOperator(value)
    {
        return (['+','-','*','%','/'].indexOf(value) > -1);
    }
    pushOperation(value)
    {
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calc();
            // console.log(this._operation);
        }
    }
    //retorna o valor da operação
    getResult()
    {
        //console.log('getResult',this._operation);
        return eval(this._operation.join(''));
    }
    calc()
    {
        let last = "";

        this._lastOperator =this.getLastItem(true);

        if (this._operation.length < 3) {
            let firstItem =  this._operation[0];
            this._operation = [firstItem,this._lastOperator,this._lastNumber];
        }
        if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }
        //console.log('lastOperator',this._lastOperator);
        //console.log('lastNumber',this._lastNumber);
        let result  = this.getResult();

        if(last == "%"){
            result /= 100;
            this._operation = [result];
        }else{
            this._operation = [result];
            if (last) this._operation.push(last);
        }
        //atualizar display
        this.setLastNumberToDisplay();
    }
    getLastItem(isOperator = true)
    {
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--) {
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }
    setLastNumberToDisplay()
    {
        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    addOperation(value)
    {
        // console.log('A',value,isNaN(this.getLastOperation()));
        if (isNaN(this.getLastOperation())) {
            //String
            if (this.isOperator(value)) {
                //trocar operador
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                //atualizar display
                this.setLastNumberToDisplay();
            }
        }else{
            //Number
            if (this.isOperator(value)) {
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(Number.parseFloat(newValue));
            //atualizar display
                this.setLastNumberToDisplay();
            }
        }
        // console.log(this._operation);
    }
    setError()
    {
        this.displayCalc = "Error";
    }
    addDot()
    {
        let lastOperation = this.getLastOperation();
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + ".");
        }
        this.setLastNumberToDisplay();
        // console.log(lastOperation);
    }
    execBtn(value)
    {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(Number.parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }
    initButtonsEvents()
    {
       let buttons = document.querySelectorAll("#buttons > g, #parts > g");
       buttons.forEach((button,index)=>{  
        this.addEventListenerAll(button,'click drag',(e)=>{
            let textbutton = button.className.baseVal.replace('btn-',"");
            this.execBtn(textbutton);
        });
        this.addEventListenerAll(button,"mouseover mouseup mousedown",e =>{
            button.style.cursor = "pointer";
        });
       });
    }
    get displayTime()
    {
        return this._timeCalEl.innerHTML;
    }
    set displayTime(value)
    {
        return this._timeCalEl.innerHTML = value;
    }
    get displayDate()
    {
        return this._dateCalcEl.innerHTML;
    }
    set displayDate(value)
    {
        return this._dateCalcEl.innerHTML = value;
    }
    get displayCalc()
    {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value)
    {
        this._displayCalcEl.innerHTML = value;
    }
    get currentDate()
    {
        return new Date();
    }
    set currentDate(value)
    {
        this._currentDate = value;
    }
}