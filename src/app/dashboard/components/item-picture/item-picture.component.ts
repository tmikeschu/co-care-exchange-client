import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/core/services/cce/dashboard.service';

@Component({
    selector: 'app-item-picture',
    templateUrl: './item-picture.component.html',
    styleUrls: ['./item-picture.component.scss']
  })
  export class ItemPictureComponent implements OnInit {
    private videoElement: ElementRef;
    @ViewChild('video', { static: false }) set content1(content: ElementRef) {
        if(content) { // initially setter gets called with undefined
            this.videoElement = content;
        }
    }

    private canvasElement: ElementRef;
    @ViewChild('canvas', { static: false }) set content2(content: ElementRef) {
        if(content) { // initially setter gets called with undefined
            this.canvasElement = content;
        }
    }

    //@ViewChild('video', { static: true }) videoElement: ElementRef;
    //@ViewChild('canvas', { static: true }) canvas: ElementRef;
    
    videoWidth = 0;
    videoHeight = 0;
    constraints = {
      video: {
          facingMode: "environment",
          width: { ideal: 200 },
          height: { ideal: 200 }
      }
    };

    hideVid: boolean = false;
    hidePic: boolean = true;
    showCaptureBtn: boolean = true;
    showRetakeBtn: boolean = false;
    
    constructor(private renderer: Renderer2, private dashboardService: DashboardService,) { }

    ngOnInit(){
        this.startCamera();
    }    
    
    captureimage(){
        this.hideVid = true;
        this.hidePic = false;
        this.showCaptureBtn = false;
        this.showRetakeBtn = true;
        setTimeout(()=> {//NOTE: this just needs a moment to show the div
            this.renderer.setProperty(this.canvasElement.nativeElement, 'width', this.videoWidth);
            this.renderer.setProperty(this.canvasElement.nativeElement, 'height', this.videoHeight);
            this.canvasElement.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
        }, 500);        
    }

    retakepicture(){
        this.startCamera();
        this.hideVid = false;
        this.hidePic = true;
        this.showCaptureBtn = true;
        this.showRetakeBtn = false;
    }

    acceptimage(){
        //console.log('the image', this.canvasElement.nativeElement.toDataURL("image/svg"));
    }

    startCamera() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            alert('Sorry, camera not available.');
        }
    }

    attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
        });
    }

    handleError(error) {
        console.log('Error: ', error);
    }
}