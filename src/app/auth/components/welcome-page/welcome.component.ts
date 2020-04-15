import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-welcomepage',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomePageComponent implements OnInit {
    welcomemessageheader: string;
    welcomemessagesub: string;

    constructor(){}

    ngOnInit(){
        this.welcomemessageheader = "Care Exchange";
        this.welcomemessagesub = "Welcome back.<br>Let's do some good today!";
    }

    tabclick(tab){
        console.log('tabclick', tab);
        switch(tab.index){
            case 0:
                this.welcomemessageheader = "Care Exchange";
                this.welcomemessagesub = "Welcome back.<br>Let's do some good today!";
                break;
            case 1:
                this.welcomemessageheader = "We've all been there";
                this.welcomemessagesub = "Your community <br>is here to help!";
                break;
            default:
                break;
        }
    }
}