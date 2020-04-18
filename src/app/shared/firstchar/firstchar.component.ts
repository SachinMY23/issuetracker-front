import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-firstchar',
  templateUrl: './firstchar.component.html',
  styleUrls: ['./firstchar.component.css']
})
export class FirstcharComponent implements OnInit {

  @Input() name: string;
  @Input() userBg: string;
  @Input() userColor: string;

  public firstChar: string;
  private _name:string = '';

  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();



  ngOnInit(): void {
      this._name = this.name;
      this.firstChar = this._name[0];

  } // end ngOnInit


  ngOnChanges(changes: SimpleChanges){
    let name  = changes.name;
    this._name = name.currentValue;
    this.firstChar = this._name[0];
  }


  nameClicked(){
    this.notify.emit(this._name);
  }

}
