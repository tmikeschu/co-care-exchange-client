import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-item-picture',
    templateUrl: './item-picture.component.html',
    styleUrls: ['./item-picture.component.scss']
  })
  export class ItemPictureComponent implements OnInit {
    @ViewChild('video', { static: true }) videoElement: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    
    videoWidth = 0;
    videoHeight = 0;
    constraints = {
      video: {
          facingMode: "environment",
          width: { ideal: 200 },
          height: { ideal: 200 }
      }
    };
    
    constructor(private renderer: Renderer2) { }

    ngOnInit(){
        this.startCamera();
    }    
    
    captureimage(){
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
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