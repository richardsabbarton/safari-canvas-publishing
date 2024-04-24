import {VideoController} from "./modules/video.js"


class App {
    constructor(){
        this.captureModeFixedResolution = true
        this.canvas = document.getElementById("capturecanvas")
        this.roomName = new URLSearchParams(window.location.search).get('roomName')
        this.videoController = new VideoController()
        this.videoController.connect(this.roomName)
        .then((session)=>{
            //this.captureScreenToCanvas()
        })

        document.getElementById("capturebutton").onclick = ()=>{
            //this.captureScreenToCanvas()
            this.renderStaticImageToCanvas()
            this.videoController.publishCanvas(this.canvas)
        }

        this.imageArray = new Array()

        let img1 = new Image()
        img1.src = "/images/img1.png"
        this.imageArray.push(img1)
        
        let img2 = new Image()
        img2.src = "/images/img2.png"
        this.imageArray.push(img2)

        this.currentImage = 0
    }

    captureScreenToCanvas(){
        navigator.mediaDevices.getDisplayMedia()
        .then(ms=>{
            console.log(ms)
            this.mediaStream = ms
            this.videoElement = document.createElement("video")
            this.videoElement.srcObject = ms
            this.videoElement.play()
            //document.body.appendChild(this.videoElement)
            if(this.captureModeFixedResolution){
                this.captureFrameNew()
            } else {
                this.captureFrame()
            }

            
            this.videoController.publishCanvas(this.canvas)
        })
    }

    captureFrame(){
        this.canvas.width = this.videoElement.videoWidth
        this.canvas.height = this.videoElement.videoHeight
        let ctx = this.canvas.getContext("2d")
        ctx.drawImage(this.videoElement, 0,0, this.videoElement.videoWidth, this.videoElement.videoHeight)
        setTimeout(()=>{this.captureFrame();}, 1000/30)
    }

    captureFrameNew(){
        this.canvas.width = 1280
        this.canvas.height = 720
        let ctx = this.canvas.getContext("2d")
        ctx.drawImage(this.videoElement, 0,0,1280, 720)
        setTimeout(()=>{this.captureFrame();}, 1000/1)
    }

    renderStaticImageToCanvas(){

        this.canvas.width = 1280
        this.canvas.height = 720
        let ctx = this.canvas.getContext("2d")
        ctx.drawImage(this.imageArray[this.currentImage], 0,0,1280, 720)
        
        this.currentImage++
        if(this.currentImage >= this.imageArray.length){
            this.currentImage = 0
        }
        
        setTimeout(()=>{this.renderStaticImageToCanvas()}, 3000)
    }
}


const app = new App()
window.app = app
