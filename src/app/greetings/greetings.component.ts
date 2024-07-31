import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.scss']
})
export class GreetingsComponent implements OnInit {


  
  name : string = '';
  greeting: string | null = null;

  greet(){
    this.greeting = ` ${this.name} Fuck you !`
  }

  reload(){
    this.greeting = ""
  }
  

  constructor() { }

  ngOnInit(): void {
  }

}
