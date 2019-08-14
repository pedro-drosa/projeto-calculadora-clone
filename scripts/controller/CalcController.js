class CalcController
{
    constructor()
    {
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
    }
    clearEntry()
    {
        this._operation.pop();
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
    calc()
    {
        let last = this._operation.pop();
        let result  = eval(this._operation.join(''));
        this._operation = [result,last];
        //atualizar display
        this.setLastNumberToDisplay();
    }
    setLastNumberToDisplay()
    {
        let lastNumber;
        for (let i = this._operation.length-1; i >= 0; i--) {
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }
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
            }else if(isNaN(value)){
                //Outra coisa
                console.log('outra coisa', value);
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
                this.setLastOperation(Number.parseInt(newValue));
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

                break;
            case 'ponto':
                this.addOperation('.')
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